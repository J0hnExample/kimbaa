import express from 'express';
import "express-async-errors"; // needs to be imported before routers and other stuff!
import cookieParser from 'cookie-parser';
import fs from 'fs';
import https from 'https';
import path from 'path';
import dotenv from 'dotenv';

import { loginRouter } from './routes/loginRoute';
import { modulRouter } from './routes/modulRoute';
import { userDetailsRouter } from './routes/userDetailsRoute';
import { userRouter } from './routes/userRoute';
import { antragZulassungRouter } from './routes/antragZulassungRoute';
import { healthRouter } from './routes/healthRoute';
import { logger } from './logger/serviceLogger';
import { configureCORS } from './configCORS';

// Laden der Umgebungsvariablen aus der .env Datei
dotenv.config();

const HOSTNAME = process.env.HOSTNAME || 'localhost';
const FPORT = process.env.FRONTEND_PORT || '3000';

export const FRONTEND_URL = 'http://' + HOSTNAME + ':' + FPORT;

logger.info('Using ' + FRONTEND_URL);

const app = express();

// CORS muss ganz oben:
configureCORS(app);

// Middleware:
app.use('*', express.json());
app.use(cookieParser());

// Testroute zum Setzen und Lesen von Cookies
app.get('/test', (req, res) => {
    res.cookie('test_cookie', 'cookie_value', { httpOnly: true, secure: process.env.USE_SSL === 'true' });
    const cookie = req.cookies['test_cookie'];
    res.json({ message: 'Test route working', cookie: cookie });
});

// Routes
app.use("/api/login", loginRouter);
app.use("/api/user", userRouter);
app.use("/api/modul", modulRouter);
app.use("/api/userdetails", userDetailsRouter);
app.use("/api/antragZulassung", antragZulassungRouter);
app.use("/api/health", healthRouter);

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3001;

if (process.env.USE_SSL === 'true') {
    const SSL_KEY_FILE = process.env.SSL_KEY_FILE;
    const SSL_CRT_FILE = process.env.SSL_CRT_FILE;

    if (!SSL_KEY_FILE || !SSL_CRT_FILE) {
        throw new Error("SSL_KEY_FILE und SSL_CRT_FILE müssen gesetzt sein, wenn USE_SSL auf 'true' gesetzt ist.");
    }

    const sslOptions = {
        key: fs.readFileSync(path.resolve(__dirname, SSL_KEY_FILE)),
        cert: fs.readFileSync(path.resolve(__dirname, SSL_CRT_FILE)),
    };

    https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
        logger.info(`Secure server listening on port ${HTTPS_PORT}`);
    });
} else {
    app.listen(HTTP_PORT, () => {
        logger.info(`Server listening on port ${HTTP_PORT}`);
    });
}

export default app;
