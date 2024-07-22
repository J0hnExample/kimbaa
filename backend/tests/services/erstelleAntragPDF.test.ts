import { createAntragPDF } from "../../src/services/erstelleAntragPDFService";
import { createAnlage2PDF } from "../../src/services/erstelleAnlage2PDFService";
import { User } from "../../src/model/UserModel";
import * as UserService from "../../src/services/UserService";
import * as AntragZulassungService from "../../src/services/AntragZulassungService";
import * as AntragAnlage2Service from "../../src/services/AntragAnlage2Service";
import fs from 'fs';
import path from 'path';

beforeEach(async () => {
    const user = new User({
        name: "DerOtto",
        password: "test",
        admin: false,
        studentId: "666456",
        email: "s96969@bht-berlin.de",
        course: "Medieninformatik",
    });
    await user.save();

    await AntragZulassungService.createApplication({
        creator: user.id,
        studentid: user.studentId,
        department: "Informatik",
        bachelor: true,
        master: false,
        userDetails: {
            lastName: "Mustermann",
            firstName: "Max",
            street: "Musterstraße 1",
            city: "Berlin",
            postalCode: "12345",
            country: "Deutschland",
            phone: "0123456789",
        },
        internshipCompleted: true,
        recognitionApplied: false,
        modulesCompleted: false,
        modulesPending: true,
        attachment2Included: true,
        topicSuggestion: false,
        date: new Date(),
    });

    await AntragAnlage2Service.createAntragAnlage2({
        creator: user.id,
        themenvorschlag: "Ein interessantes Thema",
        betreuung1: "Dr. Müller",
        akademischerGradVonBetreuung1: "PhD",
        arbeitAlsGruppenarbeit: false,
        studentenSindAnHochschule: true,
        studentenSindBeiFirma: false,
        startVorlesungszeit: true,
    });
});

test("createAntragPDF", async () => {
    const user = await UserService.getOneUser({ studentId: "666456" });
    const [pdfBuffer1] = await createAntragPDF(user.id!.toString());

    const outputPath1 = path.resolve(__dirname, '../../src/output/Antrag_Zulassung_Abschlusspruefung.pdf');

    if (fs.existsSync(outputPath1)) {
        fs.unlinkSync(outputPath1);
    }

    fs.writeFileSync(outputPath1, pdfBuffer1);

    expect(fs.existsSync(outputPath1)).toBe(true);
});

test("createAnlage2PDF", async () => {
    const user = await UserService.getOneUser({ studentId: "666456" });
    //const anlage2 = await AntragAnlage2Service.getAntragAnlage2ById(user.id!.toString());
    const [pdfBuffer2] = await createAnlage2PDF(user.id!.toString());

    const outputPath2 = path.resolve(__dirname, '../../src/output/Anlage_2.pdf');

    if (fs.existsSync(outputPath2)) {
        fs.unlinkSync(outputPath2);
    }

    fs.writeFileSync(outputPath2, pdfBuffer2);

    expect(fs.existsSync(outputPath2)).toBe(true);
});
