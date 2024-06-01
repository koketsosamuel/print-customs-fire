import { Firestore } from "firebase-admin/firestore";
import { storage } from "firebase-functions";
import { globalConfig } from "../../../config/config";
import { generateImageObject } from "../helpers/generate-image-object";
import { firestore } from 'firebase-admin';

export function addImageToCollection(db: Firestore) {
    return async (object: storage.ObjectMetadata) => {
        const isImage = object.contentType
          ? object.contentType.startsWith('image/')
          : false;
        const isSvg = !!object.contentType?.includes('svg');
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
        }
    
        return false;
      }
}