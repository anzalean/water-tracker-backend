import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';

import { CLOUDINARY } from '../constants/constants.js';


cloudinary.v2.config({
    secure: true,
    cloud_name: CLOUDINARY.CLOUD_NAME,
    api_key: CLOUDINARY.API_KEY,
    api_secret: CLOUDINARY.API_SECRET
});

export const saveFileToCloudinary = async (file) => {
    console.log("Uploading file to Cloudinary:", file.path); // Додаткове логування
    const response = await cloudinary.v2.uploader.upload(file.path);
    console.log("Cloudinary response:", response); // Додаткове логування
    await fs.unlink(file.path);
    return response.secure_url;
};
