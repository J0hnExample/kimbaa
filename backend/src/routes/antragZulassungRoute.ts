import express, { NextFunction, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import * as antragZulassungService from "../services/AntragZulassungService";
import * as userService from "../services/UserService";
import { requiresAuthentication } from "./authentication";

export const antragZulassungRouter = express.Router();

// Validation rules
const identifierValidationRules = [
    param("identifier").isLength({ min: 6, max: 6 }).withMessage("Ungültige Studenten-ID")
];

const userDetailsValidationRules = [
    body("userDetails.lastName").optional().isString().withMessage("Nachname muss ein String sein"),
    body("userDetails.firstName").optional().isString().withMessage("Vorname muss ein String sein"),
    body("userDetails.street").optional().isString().withMessage("Straße muss ein String sein"),
    body("userDetails.city").optional().isString().withMessage("Stadt muss ein String sein"),
    body("userDetails.postalCode").optional().isString().withMessage("Postleitzahl muss ein String sein"),
    body("userDetails.country").optional().isString().withMessage("Land muss ein String sein"),
    body("userDetails.phone").optional().isString().withMessage("Telefon muss ein String sein")
];

const applicationValidationRules = [
    body("department").optional().isString().withMessage("Fachbereich muss ein String sein"),
    body("bachelor").optional().isBoolean().withMessage("Bachelor muss ein Boolean sein"),
    body("master").optional().isBoolean().withMessage("Master muss ein Boolean sein"),
    body("userDetails").optional().isObject().withMessage("Benutzerdetails müssen ein Objekt sein"),
    body("internshipCompleted").optional().isBoolean().withMessage("Praxisphase abgeschlossen muss ein Boolean sein"),
    body("recognitionApplied").optional().isBoolean().withMessage("Anerkennung beantragt muss ein Boolean sein"),
    body("internshipCompletedFrom").optional().isISO8601().withMessage("Praxisphase abgeleistet von muss ein gültiges Datum sein"),
    body("internshipCompletedTo").optional().isISO8601().withMessage("Praxisphase abgeleistet bis muss ein gültiges Datum sein"),
    body("modulesCompleted").optional().isBoolean().withMessage("Module abgeschlossen muss ein Boolean sein"),
    body("modulesPending").optional().isBoolean().withMessage("Module ausstehend muss ein Boolean sein"),
    body("attachment2Included").optional().isBoolean().withMessage("Anlage 2 beigefügt muss ein Boolean sein"),
    body("topicSuggestion").optional().isBoolean().withMessage("Thema vorgeschlagen muss ein Boolean sein"),
    body("date").optional().isISO8601().withMessage("Datum muss ein gültiges Datum sein"),
    ...userDetailsValidationRules
];

// Route to get application details
antragZulassungRouter.get("/:identifier", requiresAuthentication, identifierValidationRules, async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const identifier = req.params.identifier;
        const user = await userService.getOneUser({ studentId: String(identifier) });
        const application = await antragZulassungService.getApplicationById(user.id!);

        if (application === null) {
            return res.status(404).send("Antrag nicht gefunden.");
        }

        res.status(200).send({ antragZulassungDetails: application });

    } catch (error) {
        res.status(400).send(error);
        next(error);
    }
});

// Route to update application details
antragZulassungRouter.put("/:identifier", requiresAuthentication, identifierValidationRules, applicationValidationRules, async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const identifier = req.params.identifier;
        const applicationResource = req.body;

        const user = await userService.getOneUser({ studentId: String(identifier) });
        let application = await antragZulassungService.getApplicationById(user.id!);

        if (application) {
            // If application exists, update it
            application = await antragZulassungService.updateApplication({
                id: application.id,
                ...applicationResource
            });
        } else {
            // If no application exists, create a new one
            application = await antragZulassungService.createApplication({
                creator: user.id,
                studentid: user.studentId,
                ...applicationResource
            });
        }

        res.status(200).send({ antragZulassungDetails: application });

    } catch (error) {
        res.status(400).send(error);
        next(error);
    }
});
