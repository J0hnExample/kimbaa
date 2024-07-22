import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ApplicationResource } from "../Resources";
import * as antragZulassungService from "../services/AntragZulassungService";
import { User } from '../model/UserModel';
import { logger } from "../logger/serviceLogger";

const LINE_SPACING = 23; // Globale Variable für den Zeilenabstand
const CHECKBOX_TEXT_OFFSET = -2; // Globale Variable für den vertikalen Offset der Checkboxen
const TOP_MARGIN = 75; // Abstand der ersten Zeile zum oberen Logo
const FONT_SIZE = 12; // Größe der Schriftart
const HEADING_FONT_SIZE = 14; // Größe der Schriftart für Überschriften
const SIGNATURE_LINE_SPACING = 30; // Abstand für die Zeile mit der Unterschrift

export const createAntragPDF = async (id: string): Promise<Buffer[]> => {
    try {
        // Daten aus der Datenbank abrufen
        const user = await User.findById(id).exec();
        
        if (!user) {
            logger.error("PDFAntrag:User nicht gefunden.");
            throw new Error("PDFAntrag:User nicht gefunden.");
        }
        logger.info("PDFAntrag:User gefunden: " + user?.name);
        const application = await antragZulassungService.getApplicationById(user.id!) as ApplicationResource;

        // Erstes PDF-Dokument erstellen
        const pdfDoc1 = await PDFDocument.create();
        const page1 = pdfDoc1.addPage([595, 842]); // A4-Format

        const timesRomanFont = await pdfDoc1.embedFont(StandardFonts.TimesRoman);
        const timesRomanBoldFont = await pdfDoc1.embedFont(StandardFonts.TimesRomanBold);

        // Logo hinzufügen
        const logoPath = path.resolve(__dirname, '../BHT_Antrag_logo.png');
        const logoImageBytes = fs.readFileSync(logoPath);
        const logoImage = await pdfDoc1.embedPng(logoImageBytes);
        const logoDims = logoImage.scale(0.5);
        const pageWidth = page1.getWidth();
        const logoWidth = pageWidth - 20; // 10 pt Rand links und rechts
        const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
        const logoX = (pageWidth - logoWidth) / 2;

        page1.drawImage(logoImage, {
            x: logoX,  // Logo zentriert oben
            y: page1.getHeight() - logoHeight - 10,
            width: logoWidth,
            height: logoHeight,
        });

        const textOptions = { font: timesRomanFont, size: FONT_SIZE, color: rgb(0, 0, 0) };
        const headingOptions = { font: timesRomanBoldFont, size: HEADING_FONT_SIZE, color: rgb(0, 0, 0) };
        let currentY = page1.getHeight() - logoHeight - TOP_MARGIN; // Startpunkt nach dem Logo und Titel

        const drawText = (text: string, indent: number = 0, options = textOptions) => {
            page1.drawText(text, { x: 50 + indent, y: currentY, ...options });
            currentY -= LINE_SPACING;
        };

        const drawCheckbox = (label: string, checked: boolean, x: number, y: number) => {
            page1.drawRectangle({ x, y: y + CHECKBOX_TEXT_OFFSET, width: 10, height: 10, borderColor: rgb(0, 0, 0), borderWidth: 1 });
            if (checked) {
                page1.drawText('x', { x: x + 2, y, size: 10 });
            }
            page1.drawText(label, { x: x + 15, y, ...textOptions });
        };

        drawText('Persönliche Daten:', 0, headingOptions);
        currentY -= 10; // Add space after title
        drawText(`Matrikel-Nummer: ${application.studentid}`);
        drawText(`Fachbereich: ${application.department}`);
        drawText(`Vorname: ${application.userDetails?.firstName}`);
        drawText(`Name: ${application.userDetails?.lastName}`);
        drawText(`Studiengang: ${user.course}`);
        drawText(`E-Mail: ${user.email}`);
        drawText(`Telefon: ${application.userDetails?.phone}`);
        drawText(`Adresse: ${application.userDetails?.street}, ${application.userDetails?.postalCode}`);

        drawText('Zulassung zur Abschlussprüfung im:', 0, headingOptions);
        drawCheckbox('Sommersemester', application.sommersemester!, 50, currentY);
        drawCheckbox('Wintersemester', application.wintersemester!, 150, currentY);
        currentY -= LINE_SPACING; // Move to next line after checkboxes

        drawText('Bitte Zutreffendes ankreuzen:', 0, headingOptions);
        drawCheckbox('Bachelor', application.bachelor!, 50, currentY);
        drawCheckbox('Master', application.master!, 150, currentY);
        currentY -= LINE_SPACING; // Move to next line after checkboxes

        drawCheckbox('Die Praxisphase ist erfolgreich abgeschlossen.', application.internshipCompleted!, 50, currentY);
        currentY -= LINE_SPACING; // Move to next line after checkbox

        drawCheckbox('Die Praxisphase wird abgeleistet vom:', !!application.internshipCompletedFrom, 50, currentY);
        if (application.internshipCompletedFrom) {
            drawText(application.internshipCompletedFrom.toISOString().split('T')[0], 20);
        }
        currentY -= LINE_SPACING; // Move to next line after checkbox

        drawCheckbox('Sämtliche Module des Bachelor- oder Masterstudiums sind erfolgreich abgeschlossen.', application.modulesCompleted!, 50, currentY);
        currentY -= LINE_SPACING; // Move to next line after checkbox

        drawCheckbox('Der erfolgreiche Abschluss der in Anlage 1 angeführten Module steht noch aus.', application.modulesPending!, 50, currentY);
        currentY -= LINE_SPACING; // Move to next line after checkbox

        drawCheckbox('Die Anlage 2 (mein Vorschlag zum Thema meiner Abschlussarbeit und des/der Betreuers*in) ist beigefügt.', application.attachment2Included!, 50, currentY);
        currentY -= LINE_SPACING; // Move to next line after checkbox

        drawCheckbox('Einen Vorschlag für das Thema und den/die Betreuer*in meiner Abschlussarbeit mache ich nicht.', application.topicSuggestion!, 50, currentY);
        currentY -= LINE_SPACING; // Move to next line after checkbox

        drawCheckbox('Die Anerkennung ist beantragt bzw. erfolgt.', application.recognitionApplied!, 50, currentY);
        currentY -= LINE_SPACING; // Move to next line after checkbox

        currentY -= SIGNATURE_LINE_SPACING; // Abstand für die Unterschrift
        drawText(`Datum, Unterschrift Student*in: ${application.date ? application.date.toISOString().split('T')[0] : ''}`);

        const pdfBytes1 = await pdfDoc1.save();
        return [Buffer.from(pdfBytes1)];
    } catch (error) {
        console.error("Fehler beim Erstellen AntragZulassung:", error);
        throw error;
    }
}
