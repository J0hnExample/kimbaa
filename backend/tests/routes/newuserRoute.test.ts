// must be imported before any other imports
import dotenv from "dotenv";
dotenv.config();

import { parseCookies } from "restmatcher";
import supertest from "supertest";
import app from "../../src/app";
import { createUser } from "../../src/services/UserService";

/**
 * Eigentlich sind das hier sogar 5 Tests!
 */
test(`/api/login POST, Positivtest`, async () => {
    await createUser({
        name: "John",
        password: "1234abcdABCD..;,.",
        studentId: "12345",
        email: "john@bht-berlin.de",
        course: "Test Course"
    });

    const testee = supertest(app);
    const loginData = { studentId: "12345", password: "1234abcdABCD..;,." };
    const response = parseCookies(await testee.post(`/api/login`).send(loginData));
    expect(response.status).toBe(200);

    // added by parseCookies, similar to express middleware cookieParser
    expect(response).toHaveProperty("cookies"); // added by parseCookies
    expect(response.cookies).toHaveProperty("access_token"); // the cookie with the JWT
    const token = response.cookies.access_token;
    expect(token).toBeDefined();

    // added by parseCookies, array with raw cookies, i.e. with all options and value
    expect(response).toHaveProperty("cookiesRaw");
    const rawCookie = response.cookiesRaw.find(c => c.name === "access_token");
    expect(rawCookie?.httpOnly).toBe(true);
    expect(rawCookie?.sameSite).toBe("None");
    expect(rawCookie?.secure).toBe(true);
});

// Additional tests for error cases, token validation, etc., can be added as needed.
