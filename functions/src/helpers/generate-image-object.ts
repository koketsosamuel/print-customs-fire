import { ObjectMetadata } from 'firebase-functions/v1/storage';
import { config } from '../../../config/config';
import { getFilePublicPermanentLink } from './get-file-public-permanent-link';
import { getOriginalImagePath } from './get-original-image-path';

export async function generateImageObject(
  object: ObjectMetadata,
  bucketName: string,
  imageName: string
) {
  const originalImageName = getOriginalImagePath(imageName || '');
  const originalImagePath = `${config.storage.productImagesFolder}/${originalImageName}`;

  return {
    path: object.name,
    token: object.metadata?.firebaseStorageDownloadTokens,
    link: getFilePublicPermanentLink(bucketName, object),
    original: {
      path: originalImagePath,
    },
  };
}
