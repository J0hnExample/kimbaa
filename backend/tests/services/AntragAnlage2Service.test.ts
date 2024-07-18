import { logger } from "../../src/logger/testLogger";
import { User } from "../../src/model/UserModel";
import { AntragAnlage2 } from "../../src/model/AntragAnlage2Model";
import * as UserService from "../../src/services/UserService";
import * as AntragAnlage2Service from "../../src/services/AntragAnlage2Service";
import { AntragAnlage2Resource } from "../../src/Resources";

beforeEach(async () => {
    const user = new User({
        name: "DerOtto",
        password: "test",
        admin: false,
        studentId: "666456",
        email: "test@bht-berlin.de",
        course: "6",
    });
    await user.save();
});

test("AntragAnlage2Service.test createAntragAnlage2", async () => {
    logger.info("AntragAnlage2Service.test createAntragAnlage2 wird gestartet");
    const user = await UserService.getOneUser({ studentId: "666456" });
    const anlage2 = await AntragAnlage2Service.createAntragAnlage2({
        creator: user.id!,
        themenvorschlag: "Thema Vorschlag",
        betreuung1: "Prof. Dr. Mustermann",
        akademischerGradVonBetreuung1: "Dr. rer. nat.",
        betreuung2: "Prof. Dr. Musterfrau",
        akademischerGradVonBetreuung2: "Dr. rer. pol.",
        arbeitAlsGruppenarbeit: true,
        gruppenmitglied1: "John Doe",
        matrikelnummerVonGruppenmitglied1: 1234567,
        gruppenmitglied2: "Jane Doe",
        matrikelnummerVonGruppenmitglied2: 2345678,
        studentenSindAnHochschule: true,
        studentenSindBeiFirma: false,
        startVorlesungszeit: true,
        startZum: new Date("2024-09-01"),
        begruendungFuerDatum: "Begründung für das Datum"
    });

    const neuErstellteAnlage2 = await AntragAnlage2.findOne({ creator: user.id });

    expect(neuErstellteAnlage2!.themenvorschlag).toBe("Thema Vorschlag");
    expect(neuErstellteAnlage2!.betreuung1).toBe("Prof. Dr. Mustermann");
    expect(neuErstellteAnlage2!.akademischerGradVonBetreuung1).toBe("Dr. rer. nat.");
    expect(neuErstellteAnlage2!.betreuung2).toBe("Prof. Dr. Musterfrau");
    expect(neuErstellteAnlage2!.akademischerGradVonBetreuung2).toBe("Dr. rer. pol.");
    expect(neuErstellteAnlage2!.arbeitAlsGruppenarbeit).toBe(true);
    expect(neuErstellteAnlage2!.gruppenmitglied1).toBe("John Doe");
    expect(neuErstellteAnlage2!.matrikelnummerVonGruppenmitglied1).toBe(1234567);
    expect(neuErstellteAnlage2!.gruppenmitglied2).toBe("Jane Doe");
    expect(neuErstellteAnlage2!.matrikelnummerVonGruppenmitglied2).toBe(2345678);
    expect(neuErstellteAnlage2!.studentenSindAnHochschule).toBe(true);
    expect(neuErstellteAnlage2!.studentenSindBeiFirma).toBe(false);
    expect(neuErstellteAnlage2!.startVorlesungszeit).toBe(true);
    expect(neuErstellteAnlage2!.startZum).toEqual(new Date("2024-09-01"));
    expect(neuErstellteAnlage2!.begruendungFuerDatum).toBe("Begründung für das Datum");
    logger.info("AntragAnlage2Service.test createAntragAnlage2 wurde beendet");
});

test("AntragAnlage2Service.test updateAntragAnlage2", async () => {
    logger.info("AntragAnlage2Service.test updateAntragAnlage2 wird gestartet");

    const user = await UserService.getOneUser({ studentId: "666456" });
    const anlage2 = await AntragAnlage2Service.createAntragAnlage2({
        creator: user.id!,
        themenvorschlag: "Thema Vorschlag",
        betreuung1: "Prof. Dr. Mustermann",
        akademischerGradVonBetreuung1: "Dr. rer. nat.",
        betreuung2: "Prof. Dr. Musterfrau",
        akademischerGradVonBetreuung2: "Dr. rer. pol.",
        arbeitAlsGruppenarbeit: true,
        gruppenmitglied1: "John Doe",
        matrikelnummerVonGruppenmitglied1: 1234567,
        gruppenmitglied2: "Jane Doe",
        matrikelnummerVonGruppenmitglied2: 2345678,
        studentenSindAnHochschule: true,
        studentenSindBeiFirma: false,
        startVorlesungszeit: true,
        startZum: new Date("2024-09-01"),
        begruendungFuerDatum: "Begründung für das Datum"
    });

    const updatedAnlage2 = await AntragAnlage2Service.updateAntragAnlage2({
        id: anlage2.id,
        creator: user.id!,
        themenvorschlag: "Neuer Themenvorschlag",
        betreuung1: "Prof. Dr. Neumann",
        akademischerGradVonBetreuung1: "Dr. rer. medic.",
        arbeitAlsGruppenarbeit: anlage2.arbeitAlsGruppenarbeit,
        studentenSindAnHochschule: anlage2.studentenSindAnHochschule,
        studentenSindBeiFirma: anlage2.studentenSindBeiFirma,
        startVorlesungszeit: anlage2.startVorlesungszeit
    });

    expect(updatedAnlage2!.themenvorschlag).toBe("Neuer Themenvorschlag");
    expect(updatedAnlage2!.betreuung1).toBe("Prof. Dr. Neumann");
    expect(updatedAnlage2!.akademischerGradVonBetreuung1).toBe("Dr. rer. medic.");
    logger.info("AntragAnlage2Service.test updateAntragAnlage2 wurde beendet");
});

// Test für getAntragAnlage2ById
test("AntragAnlage2Service.test getAntragAnlage2ById", async () => {
    logger.info("AntragAnlage2Service.test getAntragAnlage2ById wird gestartet");

    const user = await UserService.getOneUser({ studentId: "666456" });
    const anlage2 = await AntragAnlage2Service.createAntragAnlage2({
        creator: user.id!,
        themenvorschlag: "Thema Vorschlag",
        betreuung1: "Prof. Dr. Mustermann",
        akademischerGradVonBetreuung1: "Dr. rer. nat.",
        betreuung2: "Prof. Dr. Musterfrau",
        akademischerGradVonBetreuung2: "Dr. rer. pol.",
        arbeitAlsGruppenarbeit: true,
        gruppenmitglied1: "John Doe",
        matrikelnummerVonGruppenmitglied1: 1234567,
        gruppenmitglied2: "Jane Doe",
        matrikelnummerVonGruppenmitglied2: 2345678,
        studentenSindAnHochschule: true,
        studentenSindBeiFirma: false,
        startVorlesungszeit: true,
        startZum: new Date("2024-09-01"),
        begruendungFuerDatum: "Begründung für das Datum"
    });

    const fetchedAnlage2 = await AntragAnlage2Service.getAntragAnlage2ById(user.id!);

    expect(fetchedAnlage2!.id!).toBe(anlage2.id); // Überprüfen Sie, ob der richtige Antrag abgerufen wurde
    logger.info("AntragAnlage2Service.test getAntragAnlage2ById wurde beendet");
});

// Test für deleteAntragAnlage2
test("AntragAnlage2Service.test deleteAntragAnlage2", async () => {
    logger.info("AntragAnlage2Service.test deleteAntragAnlage2 wird gestartet");
    const user = await UserService.getOneUser({ studentId: "666456" });
    const anlage2 = await AntragAnlage2Service.createAntragAnlage2({
        creator: user.id!,
        themenvorschlag: "Thema Vorschlag",
        betreuung1: "Prof. Dr. Mustermann",
        akademischerGradVonBetreuung1: "Dr. rer. nat.",
        betreuung2: "Prof. Dr. Musterfrau",
        akademischerGradVonBetreuung2: "Dr. rer. pol.",
        arbeitAlsGruppenarbeit: true,
        gruppenmitglied1: "John Doe",
        matrikelnummerVonGruppenmitglied1: 1234567,
        gruppenmitglied2: "Jane Doe",
        matrikelnummerVonGruppenmitglied2: 2345678,
        studentenSindAnHochschule: true,
        studentenSindBeiFirma: false,
        startVorlesungszeit: true,
        startZum: new Date("2024-09-01"),
        begruendungFuerDatum: "Begründung für das Datum"
    });

    await AntragAnlage2Service.deleteAntragAnlage2(anlage2!.id!);

    try {
        await AntragAnlage2Service.getAntragAnlage2ById(anlage2!.id!);
        expect(true).toBe(false);
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
        logger.info("AntragAnlage2Service.test deleteAntragAnlage2 wurde beendet");
    }
    logger.info("AntragAnlage2Service.test deleteAntragAnlage2 wurde beendet");
});
