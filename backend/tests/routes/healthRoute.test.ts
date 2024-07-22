import supertest from "supertest";
import app from "../../src/app";



test("/api/health", async () => {
    const testee = supertest(app);
    const response = await testee.get("/api/health");
    expect(response.status).toBe(200);
})
