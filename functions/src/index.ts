import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { firestore } from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();
const bucketName = 'custom-prints-aae9c.appspot.com';
import { config } from '../../config/config';
import { getOriginalImagePath } from './helpers/get-original-image-path';
import { generateImageObject } from './helpers/generate-image-object';
import 'firebase-functions/logger/compat';

export const addImageToProduct = functions
  .runWith({
    maxInstances: 1,
  })
  .storage.object()
  .onFinalize(async (object) => {
    const isImage = object.contentType
      ? object.contentType.startsWith('image/')
      : false;

    if (!isImage || !object.metadata?.resizedImage) return false;

    const imageNameArr = object.name?.split('/') || [];
    const imageName = imageNameArr.pop() || '';

    const itemID = imageName?.split('_')[0];

    await db
      .collection(config.firestore.productsCollection)
      .doc(itemID || '')
      .update({
        images: firestore.FieldValue.arrayUnion(
          await generateImageObject(object, bucketName, imageName)
        ),
      });

    return true;
  });

export const removeDeletedImageFromProduct = functions.storage
  .object()
  .onDelete(async (object) => {
    const isImage = object.contentType
      ? object.contentType.startsWith('image/')
      : false;

    if (!isImage || !object.metadata?.resizedImage) return false;

    const imageNameArr = object.name?.split('/') || [];
    const imageName = imageNameArr[imageNameArr.length - 1];

    const itemID = imageName?.split('_')[0];

    // UPDATE COLLECTION DOC
    await db
      .collection(config.firestore.productsCollection)
      .doc(itemID)
      .update({
        images: firestore.FieldValue.arrayRemove(
          await generateImageObject(object, bucketName, imageName)
        ),
      });

    // DELETE ORIGINAL IMAGE
    const originalImageName = getOriginalImagePath(imageName || '');
    await storage
      .bucket(bucketName)
      .file(config.storage.productImagesFolder + '/' + originalImageName)
      .delete();

    return true;
  });
