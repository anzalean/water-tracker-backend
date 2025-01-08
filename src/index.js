import dotenv from 'dotenv';
dotenv.config();

import { initMongoDB } from "./db/initMongoConnection.js";
import { setupServer } from "./server.js";

const bootstrap = async () => {
    await initMongoDB();
    setupServer();
};

void bootstrap();

