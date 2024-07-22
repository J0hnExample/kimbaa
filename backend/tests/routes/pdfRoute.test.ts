import supertest from "supertest";
import app from "../../src/app";
import { User } from "../../src/model/UserModel";
import { UserResource } from "../../src/Resources";
import * as antragZulassungService from "../../src/services/AntragZulassungService";
import * as UserService from "../../src/services/UserService";
import * as userService from "../../src/services/UserService";
import * as antragAnlage2Service from "../../src/services/AntragAnlage2Service";
import { performAuthentication, supertestWithAuth } from "../supertestWithAuth";
import { response } from "express";

let logintoken: string | undefined;
let user: UserResource;
beforeEach(async () => {
    await User.deleteMany({});
    const admin = await UserService.createUser({ name: "Admin", password: "12345bcdABCD..;,.", admin: true, studentId: "000000", email: "Admin@bht-berlin.de" });
    user = await userService.createUser({
        name: "Tim",
        password: "12345bcdABCD..;,.",
        admin: true,
        studentId: "666456",
        email: "testasd@bht-berlin.de",
        course: "Medieninformatik",
    });

    await antragZulassungService.createApplication({
        creator: user.id,
        studentid: user.studentId,
        userDetails: {
            lastName: "Mustermann",
            firstName: "Max",
            street: "Musterstraße 1",
            city: "Berlin",
            postalCode: "12345",
            country: "Deutschland",
            phone: "0123456789",
        },
    });

    await antragAnlage2Service.createAntragAnlage2({
        creator: user.id,
        themenvorschlag: "Ein interessantes Thema",
        betreuung1: "Dr. Schmidt",
        akademischerGradVonBetreuung1: "PhD",
        arbeitAlsGruppenarbeit: false,
        studentenSindAnHochschule: true,
        studentenSindBeiFirma: false,
        startVorlesungszeit: true,
    })
    await performAuthentication("666456", "12345bcdABCD..;,.");
});

test("GET /api/pdf/:userId - successful generation", async () => {
    const token = await performAuthentication("666456", "12345bcdABCD..;,.");
    const testee = supertestWithAuth(app);
    const response = await testee!.get(`/api/pdfAntrag/666456`);
    expect(response.status).toBe(200);
    expect(response.header['content-type']).toBe('application/pdf');
    expect(response.header['content-disposition']).toContain('attachment; filename="antrag.pdf"');

});
test("GET /api/pdf/:userId - successful generation", async () => {
    const token = await performAuthentication("666456", "12345bcdABCD..;,.");
    const testee = supertestWithAuth(app);
    const response = await testee!.get("/api/pdfAnlage/666456");
    expect(response.status).toBe(200);
    expect(response.header['content-type']).toBe('application/pdf');
    expect(response.header['content-disposition']).toContain('attachment; filename="Anlage2.pdf"');
});
test("GET /api/pdf/:userId - user not found", async () => {
    const testee = supertest(app);
    const response = await testee.get(`/api/pdf/999999`).set("Cookie", `access_token=${logintoken}`);
    expect(response.status).toBe(404);
    
});

test("GET /api/pdf/:userId - internal server error", async () => {
    const testee = supertest(app);
    jest.spyOn(User, 'findById').mockImplementation(() => {
        throw new Error("Database error");
    });
    const response = await testee.get(`/api/pdf/666456`).set("Cookie", `access_token=${logintoken}`);
    expect(response.status).toBe(404);
    
});
