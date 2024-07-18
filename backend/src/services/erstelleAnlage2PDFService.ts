import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { AntragAnlage2Resource, ApplicationResource } from "../Resources";
import * as antragAnlage2Service from "../services/AntragAnlage2Service";
import * as antragZulassungService from "../services/AntragZulassungService";
import { User } from '../model/UserModel';
import { logger } from "../logger/serviceLogger";

const LINE_SPACING = 23; // Globale Variable für den Zeilenabstand
const CHECKBOX_TEXT_OFFSET = -2; // Globale Variable für den vertikalen Offset der Checkboxen
const TOP_MARGIN = 75; // Abstand der ersten Zeile zum oberen Logo
const FONT_SIZE = 12; // Größe der Schriftart
const HEADING_FONT_SIZE = 14; // Größe der Schriftart für Überschriften
const SIGNATURE_LINE_SPACING = 30; // Abstand für die Zeile mit der Unterschrift

export const createAnlage2PDF = async (id: string): Promise<Buffer[]> => {
    try {
        logger.info("createAnlage2PDF: Daten aus der Datenbank abrufen");

        // Daten aus der Datenbank abrufen
        const anlage2Data = await antragAnlage2Service.getAntragAnlage2ById(id) as AntragAnlage2Resource;
        if (!anlage2Data) {
            throw new Error("Anlage 2 Daten nicht gefunden.");
        }
        logger.info("createAnlage2PDF: Anlage 2 Daten gefunden");

        const user = await User.findById(id).exec();
        if (!user) {
            throw new Error("User nicht gefunden.");
        }
        logger.info("createAnlage2PDF: User gefunden: " + user?.name);

        const application = await antragZulassungService.getApplicationById(user.id!) as ApplicationResource;
        if (!application) {
            throw new Error("Application nicht gefunden.");
        }
        logger.info("createAnlage2PDF: Application gefunden");

        // PDF-Dokument erstellen
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595, 842]); // A4-Format

        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

        // Logo hinzufügen
        const logoPath = path.resolve(__dirname, '../BHT_Antrag_logo.png');
        const logoImageBytes = fs.readFileSync(logoPath);
        const logoImage = await pdfDoc.embedPng(logoImageBytes);
        const logoDims = logoImage.scale(0.5);
        const pageWidth = page.getWidth();
        const logoWidth = pageWidth - 20; // 10 pt Rand links und rechts
        const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
        const logoX = (pageWidth - logoWidth) / 2;

        page.drawImage(logoImage, {
            x: logoX,
            y: page.getHeight() - logoHeight - 10,
            width: logoWidth,
            height: logoHeight,
        });

        const textOptions = { font: timesRomanFont, size: FONT_SIZE, color: rgb(0, 0, 0) };
        const headingOptions = { font: timesRomanBoldFont, size: HEADING_FONT_SIZE, color: rgb(0, 0, 0) };
        let currentY = page.getHeight() - logoHeight - TOP_MARGIN;
        const column1X = 50;
        const column2X = 300;

        const drawText = (text: string, x: number, y: number, options = textOptions) => {
            page.drawText(text || "nicht ausgefüllt", { x, y, ...options });
        };

        const drawCheckbox = (label: string, checked: boolean | undefined, x: number, y: number) => {
            page.drawRectangle({ x, y: y + CHECKBOX_TEXT_OFFSET, width: 10, height: 10, borderColor: rgb(0, 0, 0), borderWidth: 1 });
            if (checked) {
                page.drawText('x', { x: x + 2, y, size: 10 });
            }
            page.drawText(label, { x: x + 15, y, ...textOptions });
        };

        const drawLine = (x: number, y: number, length: number) => {
            page.drawLine({ start: { x, y }, end: { x: x + length, y }, thickness: 1, color: rgb(0, 0, 0) });
        };

        drawText('Persönliche Daten:', column1X, currentY, headingOptions);
        currentY -= 10; // Add space after title

        // Erste Spalte
        drawText(`Matrikel-Nummer: ${application.studentid}`, column1X, currentY);
        drawText(`Fachbereich: ${application.department}`, column1X, currentY - LINE_SPACING);
        drawText(`Vorname: ${application.userDetails?.firstName}`, column1X, currentY - 2 * LINE_SPACING);
        drawText(`Studiengang: ${user.course}`, column1X, currentY - 3 * LINE_SPACING);
        drawText(`Telefon: ${application.userDetails?.phone}`, column1X, currentY - 4 * LINE_SPACING);

        // Zweite Spalte
        drawText(`Name: ${application.userDetails?.lastName}`, column2X, currentY);
        drawText(`E-Mail: ${user.email}`, column2X, currentY - LINE_SPACING);
        drawText(`Adresse: ${application.userDetails?.street}, ${application.userDetails?.postalCode}`, column2X, currentY - 2 * LINE_SPACING);

        currentY -= 5 * LINE_SPACING; // Move to the next section after personal data

        drawText('Bitte Zutreffendes ankreuzen:', column1X, currentY, headingOptions);
        drawCheckbox('Bachelor', application.bachelor!, column1X, currentY - LINE_SPACING);
        drawCheckbox('Master', application.master!, column2X, currentY - LINE_SPACING);
        currentY -= 2 * LINE_SPACING; // Move to next line after checkboxes

        drawText('Themenvorschlag:', column1X, currentY, headingOptions);
        currentY -= 10; // Add space after title
        drawText(`Themenvorschlag: ${anlage2Data.themenvorschlag}`, column1X, currentY);
        drawText(`Betreuung 1: ${anlage2Data.betreuung1}`, column1X, currentY - LINE_SPACING);
        drawText(`Akademischer Grad 1: ${anlage2Data.akademischerGradVonBetreuung1}`, column1X, currentY - 2 * LINE_SPACING);

        if (anlage2Data.betreuung2 || anlage2Data.akademischerGradVonBetreuung2) {
            drawText(`Betreuung 2: ${anlage2Data.betreuung2}`, column1X, currentY - 3 * LINE_SPACING);
            drawText(`Akademischer Grad 2: ${anlage2Data.akademischerGradVonBetreuung2}`, column1X, currentY - 4 * LINE_SPACING);
            currentY -= 5 * LINE_SPACING;
        } else {
            drawText(`Betreuung 2: nicht ausgefüllt`, column1X, currentY - 3 * LINE_SPACING);
            drawText(`Akademischer Grad 2: nicht ausgefüllt`, column1X, currentY - 4 * LINE_SPACING);
            currentY -= 5 * LINE_SPACING;
        }

        if (anlage2Data.arbeitAlsGruppenarbeit) {
            drawText(`Gruppenmitglied 1: ${anlage2Data.gruppenmitglied1}`, column1X, currentY);
            drawText(`Matrikelnummer 1: ${anlage2Data.matrikelnummerVonGruppenmitglied1}`, column1X, currentY - LINE_SPACING);
            drawText(`Gruppenmitglied 2: ${anlage2Data.gruppenmitglied2}`, column1X, currentY - 2 * LINE_SPACING);
            drawText(`Matrikelnummer 2: ${anlage2Data.matrikelnummerVonGruppenmitglied2}`, column1X, currentY - 3 * LINE_SPACING);
            currentY -= 4 * LINE_SPACING;
        } else {
            drawText(`Gruppenmitglied 1: nicht ausgefüllt`, column1X, currentY);
            drawText(`Matrikelnummer 1: nicht ausgefüllt`, column1X, currentY - LINE_SPACING);
            drawText(`Gruppenmitglied 2: nicht ausgefüllt`, column1X, currentY - 2 * LINE_SPACING);
            drawText(`Matrikelnummer 2: nicht ausgefüllt`, column1X, currentY - 3 * LINE_SPACING);
            currentY -= 4 * LINE_SPACING;
        }

        drawText('Arbeitsort:', column1X, currentY, headingOptions);
        drawCheckbox('an der Hochschule', anlage2Data.studentenSindAnHochschule, column1X, currentY - LINE_SPACING);
        drawCheckbox('bei der Firma', anlage2Data.studentenSindBeiFirma, column2X, currentY - LINE_SPACING);
        currentY -= 2 * LINE_SPACING;

        drawText('Startzeitpunkt:', column1X, currentY, headingOptions);
        currentY -= 10; // Add space after title
        if (anlage2Data.startVorlesungszeit) {
            drawCheckbox('zum Vorlesungsbeginn', anlage2Data.startVorlesungszeit, column1X, currentY);
        } else {
            drawCheckbox('zum', true, column1X, currentY);
            drawText(anlage2Data.startZum ? anlage2Data.startZum.toISOString().split('T')[0] : "nicht ausgefüllt", column1X + 20, currentY);
            drawText(anlage2Data.begruendungFuerDatum || "nicht ausgefüllt", column1X + 20, currentY - LINE_SPACING);
            currentY -= 2 * LINE_SPACING;
        }

        currentY -= SIGNATURE_LINE_SPACING; // Abstand für die Unterschrift
        drawText(`Datum, Unterschrift Student*in:`, column1X, currentY);
        drawLine(column2X, currentY + SIGNATURE_LINE_SPACING - 12, 200);
        currentY -= SIGNATURE_LINE_SPACING;

        drawText(`Datum, Unterschrift Betreuung:`, column1X, currentY);
        drawLine(column2X, currentY + SIGNATURE_LINE_SPACING - 12, 200);
        currentY -= SIGNATURE_LINE_SPACING;

        drawText(`Datum, Unterschrift ggf. zweite Betreuung:`, column1X, currentY);
        drawLine(column2X, currentY + SIGNATURE_LINE_SPACING - 12, 200);

        const pdfBytes = await pdfDoc.save();
        logger.info("createAnlage2PDF: PDF erfolgreich erstellt");
        return [Buffer.from(pdfBytes)];
    } catch (error) {
        logger.error("Fehler beim Erstellen der Anlage 2:", error);
        throw error;
    }
};
