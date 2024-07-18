import supertest from "supertest";
import app from "../../src/app";
import * as userService from "../../src/services/UserService";
import * as antragAnlage2Service from "../../src/services/AntragAnlage2Service";
import { User } from '../../src/model/UserModel';
import { performAuthentication, supertestWithAuth } from "../supertestWithAuth";
import { UserResource } from "../../src/Resources";

let token: string;
let user: UserResource;
let user2: UserResource;

beforeEach(async () => {
    await User.deleteMany({});

    user = await userService.createUser({
        name: "Tim",
        password: "12345bcdABCD..;,.",
        admin: true,
        studentId: "666456",
        email: "test@bht-berlin.de",
        course: "Medieninformatik",
    });
    user2 = await userService.createUser({
        name: "Tom",
        password: "12345bcdABCD..;,.",
        admin: false,
        studentId: "666995",
        email: "test2@bht-berlin.de",
        course: "Informetrik",
    })

    await antragAnlage2Service.createAntragAnlage2({
        creator: user2.id,
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

    await performAuthentication("666456", "test1234ABCD");
});

test("PUT /api/antraganlage2/:identifier - success with no existing application", async () => {
    const token = await performAuthentication("666456", "12345bcdABCD..;,.");
    const testee = supertestWithAuth(app);
    const user = await userService.getOneUser({ studentId: "666456" });

    // Stellen Sie sicher, dass kein Antrag für diesen Benutzer existiert
    let application = await antragAnlage2Service.getAntragAnlage2ById(user.id!);
    expect(application).toBeNull();

    const newAnlage2Resource = {
        themenvorschlag: "Neuer Themenvorschlag",
        betreuung1: "Prof. Dr. Neumann",
        akademischerGradVonBetreuung1: "Dr. rer. medic.",
        arbeitAlsGruppenarbeit: false,
        studentenSindAnHochschule: true,
        studentenSindBeiFirma: false,
        startVorlesungszeit: true,
        startZum: new Date("2024-10-01"),
        begruendungFuerDatum: "Neue Begründung für das Datum"
    };

    const res = await testee.put(`/api/antraganlage2/666456`).send(newAnlage2Resource);

    expect(res.status).toBe(200);

    const anlage2 = await antragAnlage2Service.getAntragAnlage2ById(user.id!);
    expect(anlage2?.themenvorschlag).toBe("Neuer Themenvorschlag");
    expect(anlage2?.betreuung1).toBe("Prof. Dr. Neumann");
    expect(anlage2?.akademischerGradVonBetreuung1).toBe("Dr. rer. medic.");
    expect(anlage2?.arbeitAlsGruppenarbeit).toBe(false);
    expect(anlage2?.studentenSindAnHochschule).toBe(true);
    expect(anlage2?.studentenSindBeiFirma).toBe(false);
    expect(anlage2?.startVorlesungszeit).toBe(true);
    expect(anlage2?.startZum).toEqual(new Date("2024-10-01"));
    expect(anlage2?.begruendungFuerDatum).toBe("Neue Begründung für das Datum");
});

test("PUT /api/antraganlage2/:identifier - success with existing application", async () => {
    const token = await performAuthentication("666456", "12345bcdABCD..;,.");
    const testee = supertestWithAuth(app);
    const user2 = await userService.getOneUser({ studentId: "666456" });

    const newAnlage2Resource = {
        themenvorschlag: "Aktualisiertes Thema",
        betreuung1: "Prof. Dr. Aktualisiert",
        akademischerGradVonBetreuung1: "Dr. rer. techn.",
        arbeitAlsGruppenarbeit: true,
        studentenSindAnHochschule: true,
        studentenSindBeiFirma: false,
        startVorlesungszeit: true,
        startZum: new Date("2024-11-01"),
        begruendungFuerDatum: "Aktualisierte Begründung für das Datum"
    };

    const res = await testee.put(`/api/antraganlage2/666456`).send(newAnlage2Resource);

    expect(res.status).toBe(200);

    const anlage2 = await antragAnlage2Service.getAntragAnlage2ById(user2.id!);
    // Weitere Überprüfungen...
    expect(anlage2?.themenvorschlag).toBe("Aktualisiertes Thema");
    expect(anlage2?.betreuung1).toBe("Prof. Dr. Aktualisiert");
    expect(anlage2?.akademischerGradVonBetreuung1).toBe("Dr. rer. techn.");
    expect(anlage2?.arbeitAlsGruppenarbeit).toBe(true);
    expect(anlage2?.studentenSindAnHochschule).toBe(true);
    expect(anlage2?.studentenSindBeiFirma).toBe(false);
    expect(anlage2?.startVorlesungszeit).toBe(true);
    expect(anlage2?.startZum).toEqual(new Date("2024-11-01"));
    expect(anlage2?.begruendungFuerDatum).toBe("Aktualisierte Begründung für das Datum");
});

test("GET /api/antraganlage2/:identifier - success", async () => {
    const token = await performAuthentication("666456", "12345bcdABCD..;,.");
    const testee = supertestWithAuth(app);
    const user = await userService.getOneUser({ studentId: "666456" });

    const application = await antragAnlage2Service.createAntragAnlage2({
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
    const applicationnew = await antragAnlage2Service.getAntragAnlage2ById(user.id!);
    expect(applicationnew).not.toBeNull();

    const res = await testee.get(`/api/antraganlage2/666456`);

    expect(res.status).toBe(200);
    expect(res.body.antragAnlage2Details.themenvorschlag).toBe("Thema Vorschlag");
    expect(res.body.antragAnlage2Details.betreuung1).toBe("Prof. Dr. Mustermann");
    expect(res.body.antragAnlage2Details.akademischerGradVonBetreuung1).toBe("Dr. rer. nat.");
    expect(res.body.antragAnlage2Details.betreuung2).toBe("Prof. Dr. Musterfrau");
    expect(res.body.antragAnlage2Details.akademischerGradVonBetreuung2).toBe("Dr. rer. pol.");
    expect(res.body.antragAnlage2Details.arbeitAlsGruppenarbeit).toBe(true);
    expect(res.body.antragAnlage2Details.gruppenmitglied1).toBe("John Doe");
    expect(res.body.antragAnlage2Details.matrikelnummerVonGruppenmitglied1).toBe(1234567);
    expect(res.body.antragAnlage2Details.gruppenmitglied2).toBe("Jane Doe");
    expect(res.body.antragAnlage2Details.matrikelnummerVonGruppenmitglied2).toBe(2345678);
    expect(res.body.antragAnlage2Details.studentenSindAnHochschule).toBe(true);
    expect(res.body.antragAnlage2Details.studentenSindBeiFirma).toBe(false);
    expect(res.body.antragAnlage2Details.startVorlesungszeit).toBe(true);
    expect(res.body.antragAnlage2Details.startZum).toBe("2024-09-01T00:00:00.000Z");
    expect(res.body.antragAnlage2Details.begruendungFuerDatum).toBe("Begründung für das Datum");
});
