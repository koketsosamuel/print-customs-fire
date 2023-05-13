import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { firestore } from 'firebase-admin';
admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();
const bucketName = 'custom-prints-aae9c.appspot.com';
import { getOriginalImagePath } from './helpers/get-original-image-path';
import { generateImageObject } from './helpers/generate-image-object';
import 'firebase-functions/logger/compat';

export const addImageToCollection = functions
  .runWith({
    maxInstances: 1,
  })
  .storage.object()
  .onFinalize(async (object) => {
    const isImage = object.contentType
      ? object.contentType.startsWith('image/')
      : false;
    const isSvg = !!object.contentType?.includes('svg');

    if (isSvg || (isImage && object.metadata?.resizedImage)) {
      const imageNameArr = object.name?.split('/') || [];
      const imageName = imageNameArr.pop() || '';

      const itemID = imageName?.split('_')[0];
      const collection = imageName?.split('_')[1];

      await db
        .collection(collection)
        .doc(itemID || '')
        .update({
          images: firestore.FieldValue.arrayUnion(
            await generateImageObject(object, bucketName)
          ),
        });

      return true;
    }

    return false;
  });

export const removeDeletedImageFromCollectionRow = functions.storage
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
            await generateImageObject(object, bucketName)
          ),
        });

      // DELETE ORIGINAL IMAGE
      if (!isSvg) {
        const originalImageName = getOriginalImagePath(imageName || '');
        await storage
          .bucket(bucketName)
          .file('images/' + collection + '/' + originalImageName)
          .delete();
      }

      return true;
    }

    return false;
  });
