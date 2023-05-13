import { ObjectMetadata } from 'firebase-functions/v1/storage';

export function getFilePublicPermanentLink(
  bucketName: string,
  object: ObjectMetadata | { metadata: any; name: string }
) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${object?.name
    ?.split('/')
    .join('%2F')}?alt=media&token=${
    object.metadata?.firebaseStorageDownloadTokens
  }`;
}
