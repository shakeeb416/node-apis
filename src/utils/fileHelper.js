const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Deletes a file from S3 bucket
 * @param {string} filename - The filename (without folder path)
 * @param {string} folder - The folder name ('avatars' or 'posts')
 * @returns {Promise<boolean>} - True if deleted successfully, false otherwise
 */
module.exports.deleteFile = async (filename, folder) => {
  if (!filename || !folder) return false;

  try {
    const s3Key = `${folder}/${filename}`; // Construct full path

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: s3Key,
      })
    );
    return true;
  } catch (err) {
    if (err.name !== "NoSuchKey") {
      // Ignore "file not found" errors
      console.error("Error deleting file from S3:", {
        filename,
        folder,
        error: err.message,
      });
    }
    return false;
  }
};

//FOR DELETING LOCAL DISK FILE

// import fs from "fs/promises";
// import path from "path";

// // Configure your upload directory (adjust as needed)
// const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// export const deleteFile = async (filename) => {
//   if (!filename) return false;

//   try {
//     const filePath = path.join(UPLOAD_DIR, filename);
//     await fs.access(filePath);
//     await fs.unlink(filePath);
//     return true;
//   } catch (err) {
//     if (err.code !== "ENOENT") {
//       // Ignore "file not found" errors
//       console.error(`Error deleting file ${filename}:`, err.message);
//     }
//     return false;
//   }
// };
