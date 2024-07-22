import supertest from "supertest";
import app from "../../src/app";
import "restmatcher";
import { User } from "../../src/model/UserModel";
import { verifyPasswordAndCreateJWT } from "../../src/services/JWTService";
import { UserResource } from "../../src/Resources";
import { createUser} from "../../src/services/UserService";
import { ModulList } from "../../src/model/ModulListModel";
import * as modulService from "../../src/services/ModulService";
import { performAuthentication, supertestWithAuth } from "../supertestWithAuth";
import { logger } from "../../src/logger/testLogger";

let logintoken: string | undefined;
let Admin: UserResource;
beforeEach(async () => {
    await User.deleteMany({});
    Admin = await createUser({ name: "Admin", password: "12345bcdABCD..;,.", admin: true, studentId: "000000", email: "Admin@bht-berlin.de" });
    const user1 = new User({
        name: "Tim",
        password: "1234abcdABCD..;,.",
        admin: true,
        studentId: "666456",
        email: "test@bht-berlin.de",
        course: "6",
    });
    await user1.save();
    const user2 = new User({
        name: "Tom",
        password: "1234abcdABCD..;,.",
        admin: false,
        studentId: "666995",
        email: "test2@bht-berlin.de",
        course: "6",
    });
    await user2.save();
    const user3 = new User({
        name: "Jerry",
        password: "1234abcdABCD..;,.",
        admin: false,
        studentId: "666999",
        email: "test3@bht-berlin.de",
        course: "6",
    });
    await user3.save();

    logintoken = await verifyPasswordAndCreateJWT("666456", "1234abcdABCD..;,.");
});

test("/api/user getAlleUser", async () => {
    const testee = supertest(app);
    const response = await testee.get("/api/user/alle").set("Cookie", `access_token=${logintoken}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(4);
    expect(response.body[1].name).toBe("Tim");
    expect(response.body[2].name).toBe("Tom");
    expect(response.body[3].name).toBe("Jerry");
});

test("/api/user/ get by studID", async () => {
    const testee = supertest(app);
    const response = await testee.get("/api/user/666456").set("Cookie", `access_token=${logintoken}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Tim");
    expect(response.body.studentId).toBe("666456");
    expect(response.body.email).toBe("test@bht-berlin.de");
});

test("/api/user/ get by id not found", async () => {
    const testee = supertest(app);
    const response = await testee.get("/api/user/999999").set("Cookie", `access_token=${logintoken}`);
    expect(response.status).toBe(400);
});

test("/api/user/ get by email", async () => {
    const testee = supertest(app);
    const response = await testee.get("/api/user/test@bht-berlin.de").set("Cookie", `access_token=${logintoken}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Tim");
    expect(response.body.studentId).toBe("666456");
    expect(response.body.email).toBe("test@bht-berlin.de");
});

test("/api/user/:identifier error handling", async () => {
    const testee = supertest(app);
    const response = await testee.get("/api/user/blalba").set("Cookie", `access_token=${logintoken}`);
    expect(response.statusCode).toBe(400);
});

test("/api/user/", async () => {
    const testee = supertest(app);

    const userResource: UserResource = {
        name: "uniqueUser 3000",
        password: "1234abcdABCD..;,.",
        studentId: "333999",
        email: "uniqueUserEmail@bht-berlin.de",
    };

    const response = await testee.post("/api/user/").set("Cookie", `access_token=${logintoken}`).send(userResource);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("uniqueUser 3000");
    expect(response.body.studentId).toBe("333999");
    expect(response.body.email).toBe("uniqueUserEmail@bht-berlin.de");

    //find user
    const user = await User.findOne({ studentId: "333999" });
    expect(user?.name).toBe("uniqueUser 3000");
    expect(user?.studentId).toBe("333999");
    expect(user?.email).toBe("uniqueUserEmail@bht-berlin.de");
});

test("/api/user/register", async () => {
    const testee = supertest(app);

    const userResource: UserResource = {
        name: "uniqueUser 3000",
        password: "1234abcdABCD..;,.",
        studentId: "333999",
        email: "uniqueUserEmail@bht-berlin.de",
    };

    const response = await testee.post("/api/user/register").send(userResource);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("uniqueUser 3000");
    expect(response.body.studentId).toBe("333999");
    expect(response.body.email).toBe("uniqueUserEmail@bht-berlin.de");

    // Find user in the database
    const user = await User.findOne({ studentId: "333999" });
    expect(user?.name).toBe("uniqueUser 3000");
    expect(user?.studentId).toBe("333999");
    expect(user?.email).toBe("uniqueUserEmail@bht-berlin.de");
});

test("/api/user/:id update user mit Auth", async () => {
    // authentication 
    

    const user = new User({
        name: "Ceoglasc",
        password: "1234abcdABCD..;,.",
        studentId: "777777",
        email: "777@bht-berlin.de",
        course: "6",
    });
    await user.save();

    await performAuthentication("777777", "1234abcdABCD..;,.");

    const testee = supertestWithAuth(app);


    const userResource: UserResource = {
        id: user.id,
        name: "Nicolas Cage",
    };

    try {
        let response = await testee.put(`/api/user/${userResource.id}`).send(userResource);
        logger.info("Update user response:", response.body);
        expect(response.statusCode).toBe(200);
        logger.info("Update user response:", response.error);

        const updatedUser = await User.findById(user.id).exec();
        expect(updatedUser?.name).toBe("Nicolas Cage");
    } catch (error) {
        logger.error("Error updating user:", error);
        throw error;
    }
});

test("/api/user/:id update User id not found", async () => {
    await performAuthentication("666456", "1234abcdABCD..;,.");
    const testee = supertestWithAuth(app);
    const fakeId = "609c5da71c9e985a2806981d";
    const userResource: UserResource = {
        id: fakeId,
        name: "Nicolas Cage",
        password: "geheim",
        admin: false,
        studentId: "999999",
        email: "nicolas@bht-berlin.de",
    };
    let response = await testee.put(`/api/user/${fakeId}`).send(userResource);
    logger.info("Attempted to update non-existent user:", response.body);
    expect(response.statusCode).toBe(401);
});

test("/api/user/:id delete User", async () => {
    await performAuthentication("666456", "1234abcdABCD..;,.");
    const testee = supertestWithAuth(app);
    const user = await createUser({
        name: "Cageolas Nice",
        password: "geheim",
        admin: false,
        studentId: "999999",
        email: "cage@bht-berlin.de",
    });
    logger.info("User created for delete test:", user);
    let response = await testee.delete(`/api/user/${user.id}`);
    logger.info("User delete response:", response.body);
    expect(response.statusCode).toBe(204);
    const deletedUser = await User.findById(user.id).exec();
    expect(deletedUser).toBe(null);
});

test("/api/user/:id delete User id not found", async () => {
    await performAuthentication("666456", "1234abcdABCD..;,.");
    const testee = supertestWithAuth(app);
    const fakeId = "609c5da71c9e985a2806981d";
    let response = await testee.delete(`/api/user/${fakeId}`);
    logger.info("Attempted to delete non-existent user:", response.body);
    expect(response.statusCode).toBe(404);
});

test("/api/user/register create User Medieninformatik and test for modules", async () => {
    const testee = supertest(app);

    const userResource: UserResource = {
        name: "uniqueUser 3000",
        password: "1234abcdABCD..;,.",
        studentId: "333999",
        email: "uniqueUserEmail@bht-berlin.de",
        course: "Medieninformatik",
    };

    const response = await testee.post("/api/user/register").send(userResource);

    logger.info("Attempted to create user:", response.body);
    expect(response.statusCode).toBe(201);

    const user = await User.findById(response.body.id).exec();
    logger.info("Created user data:", user);

    expect(user?.name).toBe("uniqueUser 3000");
    expect(user?.studentId).toBe("333999");

    // Prüfen, ob Module korrekt erstellt wurden
    const alleEintraege = await modulService.getAlleModule(user!.studentId!); // Pass the student ID instead of user ID
    logger.info("Found modules:", alleEintraege);
    expect(alleEintraege.length).toBe(55);
});