const multer = require("multer");
const ImageKit = require("imagekit");
const dotenv = require("dotenv");
dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const storage = multer.memoryStorage();

const upload = multer({ storage });

const uploadToImageKit = async (file) => {
  const result = await imagekit.upload({
    file: file.buffer,
    fileName: Date.now() + "_" + file.originalname,
    folder: "Metics",
  });

  return result.url;
};

module.exports = { upload, uploadToImageKit };
