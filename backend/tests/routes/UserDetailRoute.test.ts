import dotenv from "dotenv";
dotenv.config();
import supertest from "supertest";
import app from "../../src/app";
import { User } from '../../src/model/UserModel';
import * as antragZulassungService from "../../src/services/AntragZulassungService";
import * as userService from "../../src/services/UserService";
import { performAuthentication, supertestWithAuth } from "../supertestWithAuth";

beforeEach(async () => {
    await User.deleteMany({});
    const user = new User({
        name: "DerOtto",
        password: "12345bcdABCD..;,.",
        admin: true,
        studentId: "666456",
        email: "test@bht-berlin.de",
        course: "6",
    });
    await user.save();

    await performAuthentication("666456", "test");
});

test("GET /userdetails/:identifier - success", async () => {
    const token = await performAuthentication("666456", "12345bcdABCD..;,.");
    const testee = supertestWithAuth(app);
    const user = await userService.getOneUser({ studentId: "666456" });
    const application = await antragZulassungService.createApplication({
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
        internshipCompleted: false,
        recognitionApplied: false,
        modulesCompleted: false,
        modulesPending: true,
        attachment2Included: false,
        topicSuggestion: false,
        date: new Date(),
    });

    const res = await testee.get("/api/userdetails/666456");

    const userDetails = res.body.antragZulassungDetails;

    expect(res.status).toBe(200);
    expect(userDetails.lastName).toBe("Mustermann");
    expect(userDetails.firstName).toBe("Max");
    expect(userDetails.street).toBe("Musterstraße 1");
    expect(userDetails.city).toBe("Berlin");
    expect(userDetails.postalCode).toBe("12345");
    expect(userDetails.country).toBe("Deutschland");
    expect(userDetails.phone).toBe("0123456789");
});

test("PUT /userdetails/:identifier - success with no existing application", async () => {
    const token = await performAuthentication("666456", "12345bcdABCD..;,.");
    const testee = supertestWithAuth(app);
    const user = await userService.getOneUser({ studentId: "666456" });

    const newUserDetails = {
        lastName: "Musterfrau",
        firstName: "Maria",
        street: "Musterstraße 2",
        city: "Berlin",
        postalCode: "12345",
        country: "Deutschland",
        phone: "0123456789",
    };

    const res = await testee.put("/api/userdetails/666456").send(newUserDetails);

    expect(res.status).toBe(200);
    expect(res.body.antragZulassungDetails.lastName).toEqual(newUserDetails.lastName);
    expect(res.body.antragZulassungDetails.firstName).toEqual(newUserDetails.firstName);
    
    const application = await antragZulassungService.getApplicationById(user.id!);
    expect(application).not.toBeNull();
    expect(application!.userDetails!.lastName).toEqual(newUserDetails.lastName);
    expect(application!.userDetails!.firstName).toEqual(newUserDetails.firstName);
});

test("PUT /userdetails/:identifier - success with existing application", async () => {
    const token = await performAuthentication("666456", "12345bcdABCD..;,.");
    const testee = supertestWithAuth(app);
    const user = await userService.getOneUser({ studentId: "666456" });
    const application = await antragZulassungService.createApplication({
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
        internshipCompleted: false,
        recognitionApplied: false,
        modulesCompleted: false,
        modulesPending: true,
        attachment2Included: false,
        topicSuggestion: false,
        date: new Date(),
    });

    const newUserDetails = {
        lastName: "Musterfrau",
        firstName: "Maria",
        street: "Musterstraße 2",
        city: "Berlin",
        postalCode: "12345",
        country: "Deutschland",
        phone: "0123456789",
    };

    const res = await testee.put("/api/userdetails/666456").send(newUserDetails);

    expect(res.status).toBe(200);
    expect(res.body.antragZulassungDetails.lastName).toEqual(newUserDetails.lastName);
    expect(res.body.antragZulassungDetails.firstName).toEqual(newUserDetails.firstName);

    const foundApplication = await antragZulassungService.getApplicationById(user.id!);
    expect(foundApplication).not.toBeNull();
    expect(foundApplication!.userDetails!.lastName).toEqual(newUserDetails.lastName);
    expect(foundApplication!.userDetails!.firstName).toEqual(newUserDetails.firstName);
});
