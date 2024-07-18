import express, { Request, Response, NextFunction } from 'express';
import { createAntragPDF } from "../services/erstelleAntragPDFService";
import { createAnlage2PDF } from '../services/erstelleAnlage2PDFService';
import { User } from '../model/UserModel';
import { requiresAuthentication } from './authentication';
import * as userService from '../services/UserService';
import { logger } from '../logger/routeLogger';


export const pdfAnlageRouter = express.Router();


pdfAnlageRouter.get('/:studentId', requiresAuthentication, async (req: Request, res: Response, next: NextFunction) => {
    

    try {
        const studentId = req.params.studentId;
        // Überprüfen, ob der Benutzer existiert
        const user = await userService.getOneUser({ studentId: String(studentId) });
        logger.info("PDFRoute: UserId: " + user?.id + "studentId: " + studentId);
        if (!user) {
            logger.info("PDFRoute: User nicht gefunden so ne scheisse");
            res.status(404).send('User not found');
            return;
        }

        // PDFs generieren
        try {
            logger.info("PDFRoute: PDFs werden erstellt");
            const [anlagePDFBuffer] = await createAnlage2PDF(user.id!.toString());
            logger.info("PDFRoute: PDFs  antrag erstellt");
            //const [anlage2PDFBuffer] = await createAnlage2PDF(user.id!.toString());
            logger.info("PDFRoute: PDFs anlage2 erstellt");

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="Anlage2.pdf"`);
            res.setHeader('Content-Length', anlagePDFBuffer.length);
    
            
            res.status(200).send(anlagePDFBuffer);
        } catch (pdfError) {
            res.status(501).send('Error generating PDFs');
        }
    } catch (error) {
        res.status(502).send('Internal Server Error');
        logger.error("PDFRoute: Fehler beim Erstellen der PDFs: " + error);
        next(error);
    }
});
