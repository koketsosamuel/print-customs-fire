export function getOriginalImagePath(optimizedImagePath: string) {
  // productID_collectionName_productName_originalImageExt_imageName
  let path: string | string[] = optimizedImagePath.split('.')[0].split('_');
  path.pop();
  const ext = path[3];
  return path.join('_') + '.' + ext;
}
