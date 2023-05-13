import { ObjectMetadata } from 'firebase-functions/v1/storage';
import { getFilePublicPermanentLink } from './get-file-public-permanent-link';

export async function generateImageObject(
  object: ObjectMetadata,
  bucketName: string
) {
  return {
    path: object.name,
    token: object.metadata?.firebaseStorageDownloadTokens,
    link: getFilePublicPermanentLink(bucketName, object),
    original: {
      path: '---',
    },
  };
}
