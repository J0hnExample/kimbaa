import express, { NextFunction, Request, Response } from 'express';
import { param, body, validationResult } from 'express-validator';
import * as antragAnlage2Service from "../services/AntragAnlage2Service";
import * as userService from "../services/UserService";
import { requiresAuthentication } from "./authentication";

export const antragAnlage2Router = express.Router();

// Validation rules
const identifierValidationRules = [
    param("identifier").isLength({ min: 6, max: 6 }).withMessage("Ungültige Studenten-ID")
];

const anlage2ValidationRules = [
    body("themenvorschlag").isString().withMessage("Themenvorschlag muss ein String sein"),
    body("betreuung1").isString().withMessage("Betreuung1 muss ein String sein"),
    body("akademischerGradVonBetreuung1").isString().withMessage("Akademischer Grad von Betreuung1 muss ein String sein"),
    body("arbeitAlsGruppenarbeit").isBoolean().withMessage("Arbeit als Gruppenarbeit muss ein Boolean sein"),
    body("studentenSindAnHochschule").isBoolean().withMessage("Studenten sind an Hochschule muss ein Boolean sein"),
    body("studentenSindBeiFirma").isBoolean().withMessage("Studenten sind bei Firma muss ein Boolean sein"),
    body("startVorlesungszeit").isBoolean().withMessage("Start Vorlesungszeit muss ein Boolean sein"),
    body("startZum").isISO8601().withMessage("Start zum muss ein gültiges Datum sein"),
    body("begruendungFuerDatum").isString().withMessage("Begründung für Datum muss ein String sein"),
];

// Route to get Anlage2 details
antragAnlage2Router.get("/:identifier", requiresAuthentication, identifierValidationRules, async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const identifier = req.params.identifier;
        const user = await userService.getOneUser({ studentId: String(identifier) });
        const anlage2 = await antragAnlage2Service.getAntragAnlage2ById(user.id!);

        if (anlage2 === null) {
            return res.status(404).send("Anlage2 nicht gefunden.");
        }

        res.status(200).send({ antragAnlage2Details: anlage2 });

    } catch (error) {
        res.status(400).send(error);
        next(error);
    }
});

// Route to update Anlage2 details
antragAnlage2Router.put("/:identifier", requiresAuthentication, identifierValidationRules, anlage2ValidationRules, async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const identifier = req.params.identifier;
        const anlage2Resource = req.body;

        const user = await userService.getOneUser({ studentId: String(identifier) });
        let anlage2 = await antragAnlage2Service.getAntragAnlage2ById(user.id!);

        if (anlage2) {
            // If Anlage2 exists, update it
            anlage2 = await antragAnlage2Service.updateAntragAnlage2({
                id: anlage2.id,
                ...anlage2Resource
            });
        } else {
            // If no Anlage2 exists, create a new one
            anlage2 = await antragAnlage2Service.createAntragAnlage2({
                creator: user.id,
                studentid: user.studentId,
                ...anlage2Resource
            });
        }

        res.status(200).send({ antragAnlage2Details: anlage2 });

    } catch (error) {
        res.status(400).send(error);
        next(error);
    }
});
