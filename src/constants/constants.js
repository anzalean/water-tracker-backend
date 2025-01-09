import path from 'node:path';
import { env } from '../utils/env.js';


export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const CLOUDINARY = {
    CLOUD_NAME: env('CLOUDINARY_CLOUD_NAME'),
    API_KEY: env('CLOUDINARY_API_KEY'),
    API_SECRET: env('CLOUDINARY_API_SECRET')
};

export const accessTokenLifeTime = 1000 * 60 * 15; // 15 minutes
export const refreshTokenLifeTime = 1000 * 60 * 60 * 24 * 30; // 30 days
