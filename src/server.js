
import express from 'express';
import cors from "cors";
import pinoHttp from "pino-http";
import cookieParser from "cookie-parser";

import router from "./routers/index.js";
import { env } from './utils/env.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());
    app.use(
        pinoHttp({
            transport: {
                target: 'pino-pretty'
            }
        })
    );

    app.use(router);

    return app;
};

const app = setupServer();

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
