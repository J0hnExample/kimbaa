import express, { NextFunction, Request, Response } from 'express';
import { body, param, validationResult, matchedData } from 'express-validator';
import { UserResource } from "../Resources";
import { logger } from '../logger/routeLogger';
import * as serviceHelper from "../services/ServiceHelper";
import * as userService from "../services/UserService";
import { requiresAuthentication, optionalAuthentication } from "./authentication";

export const userRouter = express.Router();

// Validation rules
const postValidationRules = [
    body("name").isLength({ min: 1, max: 100 }),
    body("password").isStrongPassword().withMessage("Das Passwort ist zu schwach"),
    body("studentId").isLength({ min: 6, max: 6 }),
    body("email").isEmail().withMessage("Ungültige E-Mail-Adresse"),
    body("course").optional().isLength({ min: 1, max: 100 }),
];

const putValidationRules = [
    body("name").optional().isLength({ min: 1, max: 100 }),
    body("password").optional().isStrongPassword().withMessage("Das Passwort ist zu schwach"),
    body("email").optional().isEmail().withMessage("Ungültige E-Mail-Adresse"),
    body("course").optional().isLength({ min: 1, max: 100 }),
];

const deleteValidationRules = [
    param("identifier").isLength({ min: 1, max: 100 }).withMessage("Ungültiger Identifier")
];

// GET all users - requires authentication
userRouter.get("/alle", requiresAuthentication, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAlleUser();
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
        next(error);
    }
});

// GET user by identifier - requires authentication
userRouter.get("/:identifier", requiresAuthentication, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const identifier = req.params.identifier;

        let user;
        if (!isNaN(Number(identifier))) {
            // Wenn identifier eine Nummer ist, dann ist es eine studentId
            user = await userService.getOneUser({ studentId: String(identifier) });
        } else if (serviceHelper.isEmail(identifier)) {
            // Wenn identifier das Format einer E-Mail hat, dann ist es eine email
            user = await userService.getOneUser({ email: String(identifier) });
        } else {
            // Wenn weder eine Studenten-ID noch eine E-Mail-Adresse erkannt wird, lösen wir einen Fehler aus
            throw new Error("Invalid identifier");
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
        next(error);
    }
});

// POST new user - registration does not require authentication
userRouter.post("/register", postValidationRules, async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const userResource = matchedData(req) as UserResource;
    try {
        const user = await userService.createUser(userResource);
        res.status(201).send(user);
    } catch (error) {
        logger.error("UserRouter.create: Fehler beim Erstellen des Users: " + error);
        res.status(400).send(error);
        next(error);
    }
});

// POST new user - requires authentication
userRouter.post("/", postValidationRules, async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, requiresAuthentication, async (req: Request, res: Response, next: NextFunction) => {
    const userResource = matchedData(req) as UserResource;
    try {
        const user = await userService.createUser(userResource);
        res.status(201).send(user);
    } catch (error) {
        logger.error("UserRouter.create: Fehler beim Erstellen des Users: " + error);
        res.status(400).send(error);
        next(error);
    }
});

// PUT update user - optional authentication
userRouter.put("/:identifier", putValidationRules, async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({ errors: errors.array() });
    }
    next();
}, optionalAuthentication, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const UserResource = req.body;
        const userId = req.params.id;
        const user = await userService.updateUser(UserResource);
        logger.info("UserService.updateUser: User aktualisiert ");
        res.status(200).send(user);
    } catch (error) {
        logger.error("UserService.updateUser: Fehler beim Aktualisieren des Users: " + error);
        res.status(402).send(error);
        next(error);
    }
});

// DELETE user - requires authentication
userRouter.delete("/:identifier", deleteValidationRules, async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, requiresAuthentication, async (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.params.identifier;
    try {
        const user = await userService.deleteUser(identifier);
        res.status(204).send(user);
    } catch (error) {
        logger.error("UserService.deleteUser: Fehler beim Loeschen des Users: " + error);
        res.status(404).send(error);
        next(error);
    }
});
