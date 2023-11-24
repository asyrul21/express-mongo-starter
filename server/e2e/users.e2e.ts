import request from "supertest";
import app from "../server";
import UserModel from "../models/User.model";

describe("Users E2E Tests", () => {
  beforeEach(async () => {
    await UserModel.deleteMany();
  });

  it("Sign Up >> should be successful", async () => {
    const samplePayload = {
      name: "John",
      email: "john@mail.com",
      password: "1234",
    };
    const res = await request(app)
      .post("/api/auth/signup")
      .send(samplePayload)
      .set("Content-Type", "application/json");

    expect(res.statusCode).toBe(201);
    const user = res.body;
    expect(user).toBeTruthy();
    expect(user.name).toBe(samplePayload.name);
    expect(user.email).toBe(samplePayload.email);
    expect(user.password).toBeFalsy();
    expect(user.isAdmin).toBe(false);
    expect(typeof user.token).toBe("string");
  });

  it("Login >> should be successful", async () => {
    // sign up
    const samplePayload = {
      name: "John",
      email: "john@mail.com",
      password: "1234",
    };
    await request(app)
      .post("/api/auth/signup")
      .send(samplePayload)
      .set("Content-Type", "application/json");

    // login
    const res = await request(app)
      .post("/api/auth/signin")
      .send({ email: "john@mail.com", password: "1234" })
      .set("Content-Type", "application/json");

    expect(res.statusCode).toBe(200);
    const user = res.body;

    expect(user).toBeTruthy();
    expect(user.name).toBe(samplePayload.name);
    expect(user.email).toBe(samplePayload.email);
    expect(user.password).toBeFalsy();
    expect(user.isAdmin).toBe(false);
    expect(typeof user.token).toBe("string");
  });
});
