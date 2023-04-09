const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp");

admin.initializeApp();
const storage = new Storage();

exports.generateOptimizedImages = async (object) => {
  // Exit if this is a deletion or non-image file
  if (object.contentType.startsWith("image/") === false) {
    console.log("This is not an image.");
    return null;
  }

  // Get the file bucket and name
  const bucket = storage.bucket(object.bucket);
  const filePath = object.name;
  const fileName = filePath.split("/").pop();

  // Check if the image has already been edited
  const originalImage = await bucket.file(filePath).getMetadata();
  if (originalImage.metadata && originalImage.metadata.edited) {
    console.log("This image has already been edited.");
    return null;
  }

  // Set the destination for the thumbnail image
  const thumbFilePath = `thumbnails/${fileName}`;

  // Generate the thumbnail image using Sharp
  await sharp(await bucket.file(filePath).download(), {})
    .resize(200, 200, {
      fit: "contain",
      background: {
        r: 255,
        b: 255,
        g: 255,
        alpha: 1,
      },
      position: "center",
    })
    .toFile(thumbFilePath);

  // Upload the thumbnail image to Firebase Storage with metadata
  const thumbFile = bucket.file(thumbFilePath);
  const metadata = {
    contentType: object.contentType,
    cacheControl: "public, max-age=2592000", // Set cache control for 30 days
    metadata: {
      originalImage: filePath, // Add original image path to metadata
      edited: true, // Mark the thumbnail as edited
    },
  };

  await bucket.upload(thumbFile.name, {
    destination: thumbFilePath,
    metadata,
  });

  // const db = admin.firestore();
  // const docRef = db.collection("thumbnails").doc(fileName);
  // await docRef.set({
  //   url: `gs://${bucket.name}/${thumbFilePath}`,
  // });

  // Delete the temporary local file
  await thumbFile.delete();

  console.log("Thumbnail created successfully");
  return null;
};
