// utils/getS3FileUrl.js
const getS3FileUrl = (folder, fileName) => {
  if (!fileName) return null;
  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${folder}/${fileName}`;
};

module.exports = getS3FileUrl;
