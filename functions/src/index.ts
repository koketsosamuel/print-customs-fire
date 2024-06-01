import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { firestore } from 'firebase-admin';
import * as moment from 'moment';
import * as uuid from 'uuid';

admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

import { getOriginalImagePath } from './helpers/get-original-image-path';
import { generateImageObject } from './helpers/generate-image-object';
import { globalConfig } from '../../config/config';
import 'firebase-functions/logger/compat';
import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import {
  IInvoicePayload,
  IInvoicePayloadItem,
} from './interfaces/invoice-payload.interface';
import { getFilePublicPermanentLink } from './helpers/get-file-public-permanent-link';

export const handleFileUploads = functions
  .runWith({
    maxInstances: 1,
  })
  .storage.object()
  .onFinalize(async (object) => {
    const isImage = object.contentType
      ? object.contentType.startsWith('image/')
      : false;
    const isSvg∂ = !!object.contentType?.includes('svg');
    const isPDFInvoice =
      !!object.contentType?.includes('pdf') &&
      !!object.name?.startsWith('Invoices');
    const skipOptimization = !!object.name?.includes(globalConfig.words.skip);

    if (
      isSvg ||
      (isImage && object.metadata?.resizedImage) ||
      (skipOptimization && object.metadata?.resizedImage)
    ) {
      const imageNameArr = object.name?.split('/') || [];
      const imageName = imageNameArr.pop() || '';

      const itemID = imageName?.split('_')[0];
      const collection = imageName?.split('_')[1];

      await db
        .collection(collection)
        .doc(itemID || '')
        .update({
          images: firestore.FieldValue.arrayUnion(
            await generateImageObject(object, globalConfig.storageBucketName)
          ),
        });

      return true;
    } else if (isPDFInvoice) {
      const invoicePayloadDocumentId =
        object.name?.split('/').pop()?.split('.')[0].split('-').pop() || '';
      const invoicePayload: IInvoicePayload = (
        await db
          .collection('InvoicePayloads')
          .doc(invoicePayloadDocumentId)
          .get()
      ).data() as IInvoicePayload;

      const token = uuid.v4();
      const metadata = {
        metadata: {
          firebaseStorageDownloadTokens: token
        },
        firebaseStorageDownloadTokens: token
      };

      await storage.bucket(globalConfig.storageBucketName).file(object.name as string).setMetadata(metadata);

      await db
        .collection('Order')
        .doc(invoicePayload.orderId as string)
        .get()
        .then(async (doc) => {
          await doc.ref.update({
            invoice: {
              link: getFilePublicPermanentLink(globalConfig.storageBucketName, { name: object.name as string, metadata }),
              name: object.name
            }
          });
        });
    }

    return;
  });

export const handleFileDeletions = functions.storage
  .object()
  .onDelete(async (object) => {
    const isImage = object.contentType
      ? object.contentType.startsWith('image/')
      : false;
    const isSvg = !!object.contentType?.includes('svg');

    if (isSvg || (isImage && object.metadata?.resizedImage)) {
      const imageNameArr = object.name?.split('/') || [];
      const imageName = imageNameArr[imageNameArr.length - 1];

      const itemID = imageName?.split('_')[0];
      const collection = imageName?.split('_')[1];

      // UPDATE COLLECTION DOC
      await db
        .collection(collection)
        .doc(itemID)
        .update({
          images: firestore.FieldValue.arrayRemove(
            await generateImageObject(object, globalConfig.storageBucketName)
          ),
        });

      // DELETE ORIGINAL IMAGE
      if (!isSvg) {
        const originalImageName = getOriginalImagePath(imageName || '');
        await storage
          .bucket(globalConfig.storageBucketName)
          .file('images/' + collection + '/' + originalImageName)
          .delete();
      }

      return true;
    }

    return false;
  });

export const cleanCartOnDelete = functions.firestore
  .document('Cart/{documentId}')
  .onDelete(async (snap, context) => {
    const cartItemCollectionRef = db.collection('CartItem');

    const snapshot = await cartItemCollectionRef
      .where('cartId', '==', snap.id)
      .get();

    snapshot.forEach(async (doc) => {
      await doc.ref.update({ printingInfoArr: [] });
      await doc.ref.delete();
      return '';
    });
  });

export const promoteCartToOrder = functions.firestore
  .document('Order/{documentId}')
  .onCreate(async (snap, context) => {
    const order = snap.data();
    const db = firestore();

    // collection refs
    const orderItemCollectionRef = db.collection('OrderItem');
    const cartItemCollectionRef = db.collection('CartItem');

    const cartItemsSnapshot = await cartItemCollectionRef
      .where('cartId', '==', order.cartId)
      .get();

    await snap.ref.update({ orderNumber: generateOrderNumber() });

    await db.doc('Cart/' + order.cartId).delete();

    const promises: Promise<any>[] = [];
    cartItemsSnapshot.forEach(async (doc) => {
      let orderItem: Record<string, any> = {
        ...doc.data(),
        orderId: context.params.documentId,
        product: (
          await db.collection('Product').doc(doc.data().productId).get()
        ).data(),
        createdAt: new Date(),
      };
      delete orderItem.cartId;
      promises.push(orderItemCollectionRef.add(orderItem));
    });
    await Promise.all(promises);
  });

export const generateInvoice = functions
  .runWith({ memory: '1GB', maxInstances: 2 })
  .firestore.document('InvoiceQueue/{documentId}')
  .onCreate(async (snap, context) => {
    const invoiceToBeGenerated = snap.data();
    const db = firestore();

    const orderSnap = await db
      .collection('Order')
      .doc(invoiceToBeGenerated.orderId)
      .get();

    if (!orderSnap.exists) {
      throw new Error('No order for ' + invoiceToBeGenerated.orderId);
    }

    const orderSnapData = orderSnap.data();
    const orderItemsSnap = await db
      .collection('OrderItem')
      .where('orderId', '==', invoiceToBeGenerated.orderId)
      .get();

    const invoiceLineItems: IInvoicePayloadItem[] = orderItemsSnap.docs
      .map((_oi) => {
        const oi = _oi.data();
        let lines: IInvoicePayloadItem[] = [
          {
            itemNumber: 0,
            description: oi.product.name,
            price: oi.costBreakdown.productCostPerUnit,
            quantity: oi.totalQuantity,
            total: oi.costBreakdown.totalProductBaseCost,
          },
        ];
        lines = [
          ...lines,
          ...oi.costBreakdown.brandingCosts.locationCosts.map((lc: any) => ({
            itemNumber: 0,
            description: lc.location,
            price: lc.costPerUnit,
            quantity: oi.totalQuantity,
            total: lc.total,
          })),
        ];
        return lines;
      })
      .flat().map((line, index) => {
        return {...line, itemNumber: index + 1 };
      });

    if (invoiceLineItems.length === 0) {
      throw new Error('Line items cannot be 0');
    }

    if (!orderSnapData) {
      throw new Error(String(orderSnap.exists));
    }

    const payload: IInvoicePayload = {
      title: 'Invoice',
      customerName: orderSnapData!.contactInfoAndPersonalInfo.fullName,
      customerEmail: orderSnapData!.contactInfoAndPersonalInfo.email,
      customerBillingAddress: formatAddress(orderSnapData!.billingAddress),
      companyName: '',
      companySalesEmail: 'sales@printkustom.co.za',
      companyAddress: '733 Gwendolen Road, Pretoria, Wolmer, 0182',
      companyAccountNumber: '100 2492 235',
      companyAccountName: 'Print Kustom Pty',
      companyAccountBranch: 'Rosebank',
      companyAccountBranchCode: '205221',
      invoiceNumber: orderSnapData!.orderNumber,
      orderDate: moment(orderSnapData!.createdAt).format('DD/MM/YYYY'),
      orderDueDate: moment(orderSnapData!.createdAt)
        .add(14, 'days')
        .format('DD/MM/YYYY'),
      items: invoiceLineItems,
      subTotal: orderSnapData!.subTotal,
      deliveryFee: orderSnapData!.deliveryFee,
      vat: orderSnapData!.vat,
      total: orderSnapData!.total,
      businessName: orderSnapData!.businessInformation.name,
      taxNumber: orderSnapData!.businessInformation.taxNumber,
      orderId: orderSnap.id,
    };

    await snap.ref.update({
      payload,
    });
    await db.collection('InvoicePayloads').add(payload);
  });

export const removeArtwork = functions.firestore
  .document('/CartItem/{documentId}')
  .onDelete(async (snap: QueryDocumentSnapshot) => {
    const artworks = snap.data().printingInfoArr.map((pi: any) => pi.artwork);
    await Promise.all(
      artworks.map((artwork: string) => {
        return storage.bucket().file(artwork).delete();
      })
    );
  });

function generateOrderNumber(): string {
  let characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZSAMANDLINDA';

  let orderNumber = '';
  const charactersLength = characters.length;
  const orderNumLen = 8 + Math.ceil(Math.random() * 5);
  for (let i = 0; i < orderNumLen; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    orderNumber += characters.charAt(randomIndex) || 'GODLOVESYOU';
  }
  return orderNumber;
}

function formatAddress(billingAddress: any) {
  const { streetAddress, suburb, city, province, buildingName, postalCode } =
    billingAddress;

  let formattedAddress = `${streetAddress}`;
  if (buildingName) {
    formattedAddress += `, ${buildingName}`;
  }
  if (suburb) {
    formattedAddress += `, ${suburb}`;
  }
  formattedAddress += `, ${city}, ${province}, ${postalCode}`;

  return formattedAddress;
}
