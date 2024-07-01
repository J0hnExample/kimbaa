/* istanbul ignore file */
import dotenv from "dotenv";
dotenv.config() // read ".env"

import http from "http";
import https from "https";
import mongoose from 'mongoose';
import app from "./app";
import { logger } from "./logger/serviceLogger";
import { readFile } from "fs/promises";


async function setup() {
    let mongodURI = process.env.DB_CONNECTION_STRING;
    if (!mongodURI) {
        //logger.error('Cannot start, no database configured. Set environment variable DB_CONNECTION_STRING. Use "memory" for MongoMemoryServer');
        process.exit(1);
    }
    if (mongodURI === "memory") {
        logger.info("Start MongoMemoryServer")
        const MMS = await import('mongodb-memory-server')
        const mongo = await MMS.MongoMemoryServer.create();
        mongodURI = mongo.getUri();
    }
  
    logger.info(`Connect to mongod at ${mongodURI}`)
    await mongoose.connect(mongodURI);
    const port = process.env.HTTP_PORT ? parseInt(process.env.HTTP_PORT) : 3000;
    const useSSL = process.env.USE_SSL === 'true';
    const httpsPort = parseInt(process.env.HTTPS_PORT!);
      //neu eingefügt 
    
      if (useSSL) {
        try {
            const [privateSSLKey, publicSSLCert] = await Promise.all([
                readFile(process.env.SSL_KEY_FILE!),
                readFile(process.env.SSL_CRT_FILE!)
            ]);
            const httpsServer = https.createServer({ key: privateSSLKey, cert: publicSSLCert }, app);
            httpsServer.listen(process.env.HTTPS_PORT, () => {
                logger.info(`Listening for HTTPS at https://localhost:${httpsPort}`);
            });
        } catch (err) {
            logger.error(`Error reading SSL key or certificate: ${err}`);
            process.exit(1);
        }
    } else {
        const httpServer = http.createServer(app);
        httpServer.listen(port, () => {
            logger.info(`Listening for HTTP at http://localhost:${process.env.HTTP_PORT}`);
        });
    }
}


setup();