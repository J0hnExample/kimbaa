import express, { NextFunction, Request, Response } from 'express';

import { logger } from "../logger/serviceLogger";


export const healthRouter = express.Router();

// Route zum Testen der Serververbindung
healthRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Health check successful");
    res.status(200).send();
})