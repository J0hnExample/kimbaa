import { logger } from "../../src/logger/testLogger";
import * as AntragAnlage2Model from "../../src/model/AntragAnlage2Model";
import { User } from "../../src/model/UserModel";
import { AntragAnlage2Resource } from "../../src/Resources";

let userID = "";

beforeAll(async () => {
    const user = new User({
        name: "test",
        password: "test",
        admin: false,
        studentId: "123456",
        email: "test@bht-berlin.de",
        course: "test",
        enrolledSince: new Date(),
        creditPoints: 0,
        phone: 123
    });
    await user.save();

    userID = user.id;
});

test("AntragAnlage2Model.test createAntragAnlage2", async () => {
    logger.info("AntragAnlage2Model.test createAntragAnlage2 wird gestartet");
    const user = await User.findById(userID).exec();
    const antrag = new AntragAnlage2Model.AntragAnlage2({
        creator: user?.id ? user.id.toString() : "",
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
    await antrag.save();
    expect(antrag.id).toBeDefined();
    expect(antrag.creator).toBeDefined();
    expect(antrag.themenvorschlag).toBe("Thema Vorschlag");
    expect(antrag.betreuung1).toBe("Prof. Dr. Mustermann");
    expect(antrag.akademischerGradVonBetreuung1).toBe("Dr. rer. nat.");
    expect(antrag.betreuung2).toBe("Prof. Dr. Musterfrau");
    expect(antrag.akademischerGradVonBetreuung2).toBe("Dr. rer. pol.");
    expect(antrag.arbeitAlsGruppenarbeit).toBe(true);
    expect(antrag.gruppenmitglied1).toBe("John Doe");
    expect(antrag.matrikelnummerVonGruppenmitglied1).toBe(1234567);
    expect(antrag.gruppenmitglied2).toBe("Jane Doe");
    expect(antrag.matrikelnummerVonGruppenmitglied2).toBe(2345678);
    expect(antrag.studentenSindAnHochschule).toBe(true);
    expect(antrag.studentenSindBeiFirma).toBe(false);
    expect(antrag.startVorlesungszeit).toBe(true);
    expect(antrag.startZum).toEqual(new Date("2024-09-01"));
    expect(antrag.begruendungFuerDatum).toBe("Begründung für das Datum");
    logger.info("AntragAnlage2Model.test createAntragAnlage2 wurde beendet");
});
