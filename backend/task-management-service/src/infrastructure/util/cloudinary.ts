import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const CloudinaryV2 = cloudinary.v2;

CloudinaryV2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

export default CloudinaryV2;