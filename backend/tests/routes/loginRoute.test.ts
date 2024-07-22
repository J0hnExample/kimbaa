// @ts-nocheck
import dotenv from "dotenv";
dotenv.config();
import "restmatcher";
import supertest from "supertest";
import app from "../../src/app";
import { User } from "../../src/model/UserModel";
import { verifyPasswordAndCreateJWT } from "../../src/services/JWTService";

let logintoken: string;

beforeEach(async () => {
    await User.deleteMany({});
    const user1 = new User({
        name: "Tim",
        password: "1234abcdABCD..;,.",
        admin: false,
        studentId: "666456",
        email: "test@bht-berlin.de",
        course: "6",
    });
    await user1.save();
});

test("/api/login login with correct credentials", async () => {
    const testee = supertest(app);
    const response = await testee.post("/api/login").send({ studentId: "666456", password: "1234abcdABCD..;,." });

    expect(response.status).toBe(200);
    const { user, jwt } = response.body;

    expect(user.name).toBe("Tim");
    expect(user.studentId).toBe("666456");
    expect(user.email).toBe("test@bht-berlin.de");
    expect(user.course).toBe("6");

    if (jwt) {
        logintoken = jwt;
    } else {
        throw new Error("Failed to create JWT token");
    }
});

test("/api/login login with wrong credentials", async () => {
    const testee = supertest(app);
    const response = await testee.post("/api/login").send({ studentId: "666456", password: "wrongpassword" });

    expect(response.status).toBe(403);
});

test("/api/login login min date", async () => {
    const user1 = new User({
        name: "Tim",
        password: "1234abcdABCD..;,.",
        studentId: "111111",
        email: "test55@bht-berlin.de",
    });
    await user1.save();
    const testee = supertest(app);
    
    const response2 = await testee.post("/api/login").send({ studentId: "111111", password: "1234abcdABCD..;,." });

    const { user, loginResult } = response2.body;
    expect(response2.status).toBe(200);
});
