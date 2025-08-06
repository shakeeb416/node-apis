const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const path = require("path");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const createUploader = (folder) => {
  return {
    _handleFile: async function (req, file, cb) {
      try {
        const ext = path.extname(file.originalname);
        const fileName = `${Date.now()}${ext}`;
        const s3Key = `${folder}/${fileName}`; // Dynamic folder path

        // Convert stream to buffer (for ContentLength)
        const chunks = [];
        for await (const chunk of file.stream) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: s3Key,
          Body: buffer,
          ContentType: file.mimetype,
          ContentLength: buffer.length,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        cb(null, {
          filename: fileName, // Just the filename
          key: s3Key, // Full S3 path
          location: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
        });
      } catch (err) {
        cb(err);
      }
    },
    _removeFile: function (req, file, cb) {
      cb(null);
    },
  };
};

// Create specific upload middlewares
const avatarUpload = multer({
  storage: createUploader("avatars"),
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
});

const postUpload = multer({
  storage: createUploader("posts"),
  limits: { fileSize: 1024 * 1024 * 10 }, // 10MB for posts
});

module.exports = {
  avatarUpload,
  postUpload,
};

// FOR LOCAL DISK STORAGE

// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Save files in uploads/
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//   },
// });

// const upload = multer({ storage });

// module.exports = upload;
