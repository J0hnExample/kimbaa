import express, { NextFunction, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { logger } from '../logger/routeLogger';
import * as userService from "../services/UserService";
import * as antragZulassungService from "../services/AntragZulassungService";
import * as serviceHelper from "../services/ServiceHelper";
import { requiresAuthentication } from "./authentication";

export const userDetailsRouter = express.Router();

// Validation rules
const identifierValidationRules = [
    param("identifier").isLength({ min: 1, max: 100 }).withMessage("Ungültiger Identifier")
];

const userDetailsValidationRules = [
    body("lastName").optional().isString().isLength({ min: 1, max: 100 }),
    body("firstName").optional().isString().isLength({ min: 1, max: 100 }),
    body("street").optional().isString().isLength({ min: 1, max: 100 }),
    body("city").optional().isString().isLength({ min: 1, max: 100 }),
    body("postalCode").optional().isString().isLength({ min: 1, max: 20 }),
    body("country").optional().isString().isLength({ min: 1, max: 50 }),
    body("phone").optional().isString().isLength({ min: 1, max: 20 }),
];

// Route to get user details
userDetailsRouter.get("/:identifier", requiresAuthentication, identifierValidationRules, async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const identifier = req.params.identifier;
        let user;
        let application;

        if (!isNaN(Number(identifier))) {
            // Wenn identifier eine Nummer ist, dann ist es eine studentId
            user = await userService.getOneUser({ studentId: String(identifier) });
            application = await antragZulassungService.getApplicationById(user.id!);
        } else if (serviceHelper.isEmail(identifier)) {
            // Wenn identifier das Format einer E-Mail hat, dann ist es eine email
            user = await userService.getOneUser({ email: String(identifier) });
            application = await antragZulassungService.getApplicationById(user.id!);
        } else {
            // Wenn weder eine Studenten-ID noch eine E-Mail-Adresse erkannt wird, lösen wir einen Fehler aus
            throw new Error("Invalid identifier");
        }

        const userDetails = {
            antragZulassungDetails: application!.userDetails
        };

        res.status(200).send(userDetails);
    } catch (error) {
        res.status(400).send(error);
        next(error);
    }
});

// Route to update user details
userDetailsRouter.put("/:identifier", requiresAuthentication, identifierValidationRules, userDetailsValidationRules, async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const identifier = req.params.identifier;
        const userDetails = req.body;

        let user;
        let newApplication;
        let application;

        if (!isNaN(Number(identifier))) {
            logger.info("UserDetailsRoute.update: User aktualisiert ");
            // Wenn identifier eine Nummer ist, dann ist es eine studentId
            user = await userService.getOneUser({ studentId: String(identifier) });

            // Prüfen, ob ein Antrag für den Benutzer existiert
            application = await antragZulassungService.getApplicationById(user.id!);
            if (user && application) {
                logger.info("UserDetailsRoute.update: Antrag aktualisiert user und application existiert");
                // Wenn ein Antrag existiert, aktualisieren wir ihn
                newApplication = await antragZulassungService.updateApplication({
                    id: application.id,
                    userDetails: userDetails
                });
            }
            if (user && !application) {
                logger.info("UserDetailsRoute.update: Antrag aktualisiert application existiert nicht");
                // Wenn kein Antrag existiert, erstellen wir einen neuen
                newApplication = await antragZulassungService.createApplication({
                    creator: user.id,
                    studentid: user.studentId,
                    userDetails: userDetails
                });
            }
        } if (!user && !application) {
            // Wenn weder eine Studenten-ID noch eine E-Mail-Adresse erkannt wird, lösen wir einen Fehler aus
            logger.info("UserDetailsRoute.update: Antrag aktualisiert user und application existiert nicht");
            throw new Error("Invalid identifier");
        }

        res.status(200).send({ antragZulassungDetails: newApplication!.userDetails });

    } catch (error) {
        logger.error("UserDetailsRoute.update: Fehler beim Aktualisieren des UserDetails: " + error);
        res.status(400).send(error);
        next(error);
    }
});
