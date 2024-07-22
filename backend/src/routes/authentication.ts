import { NextFunction, Request, Response } from "express";
import { verifyJWT, verifyPasswordAndCreateJWT } from "../services/JWTService";

declare global {
    namespace Express {
        export interface Request {
            /**
             * Mongo-ID of currently logged in pfleger; or undefined, if pfleger is a guest.
             */
            userId?: string;
            /**
             * Role of currently logged in pfleger; or undefined, if pfleger is a guest.
             */
            role?: "u" | "a";
        }
    }
}

export function requiresAuthentication(req: Request, res: Response, next: NextFunction) {
    req.userId = undefined
    try {
        let jwtString = req.cookies.access_token
        if (!jwtString) {
            return res.sendStatus(401)
        }
        let user = verifyJWT(jwtString)
        req.userId = user.id
        req.role = user.role
        next();
    }
    catch (err) {
        res.sendStatus(401)
        next(err)

    }
}

export function optionalAuthentication(req: Request, res: Response, next: NextFunction) {
    req.userId = undefined
    let jwtString=req.cookies["access_token"]
    if (jwtString) {
        try {
            let user = verifyJWT(jwtString)

            if (user.exp === 0) {
                res.sendStatus(401)
            }
            req.userId = user.id
            req.role = user.role
            
            return next();
        }
        catch (err) {
            res.sendStatus(401)
            return next(err)

        }
    }
    next()
}