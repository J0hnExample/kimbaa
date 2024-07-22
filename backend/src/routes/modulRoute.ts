import express, { NextFunction, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { ModulResource } from "../Resources";
import * as modulService from "../services/ModulService";
import { requiresAuthentication } from "./authentication";

export const modulRouter = express.Router();

// Validation rules
const studentIdValidationRules = [
    param("studentId").isLength({ min: 6, max: 6 }).withMessage("Ungültige Studenten-ID")
];

const userIdValidationRules = [
    param("userId").isLength({ min: 1, max: 100 }).withMessage("Ungültige Benutzer-ID")
];

const updateModulesValidationRules = [
    body("modules").isArray().withMessage("Module müssen ein Array sein"),
    body("modules.*.modulname").isString().withMessage("Modulname muss ein String sein"),
    body("modules.*.creator").isString().withMessage("Ersteller muss ein String sein"),
    // Weitere Validierungsregeln können hier hinzugefügt werden, je nach Bedarf
];

// Route zum Abrufen aller Module
modulRouter.get("/alle/:studentId", requiresAuthentication, studentIdValidationRules, async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const studentId = req.params.studentId;
        const modules = await modulService.getAlleModule(studentId);
        res.status(200).send(modules);
    } catch (error) {
        res.status(400).send(error);
        next(error);
    }
});

// Route zum Aktualisieren von Modulen anhand des Modulnamens und der Benutzer-ID
modulRouter.put("/update", requiresAuthentication, updateModulesValidationRules, async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const modules: ModulResource[] = req.body.modules;
        await modulService.updateModulesByModuleNumberAndUserId(modules);
        res.status(200).send({ message: "Module erfolgreich aktualisiert" });
    } catch (error) {
        res.status(400).send(error);
        next(error);
    }
});


// Route zum Abrufen der Modulzusammenfassung
modulRouter.get("/summary/:userId", requiresAuthentication, userIdValidationRules, async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const summary = await modulService.calculateModuleSummary(req.params.userId);
        res.status(200).send(summary);
    } catch (error) {
        res.status(400).send(error);
        next(error);
    }
});
