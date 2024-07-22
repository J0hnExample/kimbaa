import dotenv from "dotenv";
dotenv.config();
import supertest from "supertest";
import app from "../../src/app";
import { ModulResource, UserResource } from "../../src/Resources";
import * as userService from "../../src/services/UserService";
import * as ModulService from "../../src/services/ModulService";
import { User } from "../../src/model/UserModel";
import { performAuthentication, supertestWithAuth } from "../supertestWithAuth";


let user: UserResource;
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

    await performAuthentication("666456", "12345bcdABCD..;,.");
});

// Test zum Abrufen aller Module
test("/api/modul getAlleModule", async () => {
    const token = await performAuthentication("666456", "12345bcdABCD..;,.");
    const testee = supertestWithAuth(app);
    //const response = await testee.get("/api/modul/alle/666456");

    const response = await testee.get(`/api/modul/alle/666456`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(2); // Ändern Sie dies entsprechend der Anzahl der erstellten Module
});

// Test zum Aktualisieren von Modulen anhand des Modulnamens und der Benutzer-ID

// Test zum Abrufen der Modulzusammenfassung
/* test("/api/modul calculateModuleSummary", async () => {
    const token = await performAuthentication("666456", "12345bcdABCD..;,.");
    const testee = supertestWithAuth(app);
    const modules: ModulResource[] = [
        {
            creator: user.id,
            modulnumber:" "
            solved: true
        },
        {
            creator: user.id,
            modulname: "Grundlagen der Theoretischen Informatik",
            solved: true
        },
        {
            creator: user.id,
            modulname: "Mathematik II",
            solved: true
        }
    ];

  

    const responseUpdate = await testee.put("/api/modul/update").send({ modules });
    expect(responseUpdate.status).toBe(200);

    const response = await testee.get(`/api/modul/summary/${user.id}`);
    expect(response.status).toBe(200);
    expect(response.body.credits).toBe(15); // Beispielwert, ändern Sie dies entsprechend Ihrer Berechnungslogik
    expect(response.body.allrequired).toBe(false); // Beispielwert, ändern Sie dies entsprechend Ihrer Berechnungslogik
    expect(response.body.minreqCredits).toBe(false); // Beispielwert, ändern Sie dies entsprechend Ihrer Berechnungslogik
    expect(response.body.credits).toBeGreaterThan(0);
});
 */