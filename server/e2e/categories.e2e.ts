import request from "supertest";
import app from "../server";
import CategoryModel from "../models/Category.model";
import { loginOrSignUpAsAdmin } from "./utils";

const sampleCategory1 = {
  name: "Category 1",
};
const sampleCategory2 = {
  name: "Category 2",
  description: "Some description here",
};

describe("Categories E2E Tests", () => {
  beforeEach(async () => {
    await CategoryModel.deleteMany();
  });

  it("should return status 403 when user not logged in", async () => {
    const res = await request(app)
      .post("/api/categories")
      .send(sampleCategory1)
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(401);
    expect(1).toBe(1);
  });

  it("should add new categories and get them correctly", async () => {
    const token = await loginOrSignUpAsAdmin();

    const res1 = await request(app)
      .post("/api/categories")
      .send(sampleCategory1)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(res1.statusCode).toBe(201);

    const res2 = await request(app)
      .post("/api/categories")
      .send(sampleCategory2)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(res2.statusCode).toBe(201);

    const expected = [sampleCategory1, sampleCategory2];
    const res3 = await request(app).get("/api/categories");
    const resCategories = res3.body;
    resCategories.forEach((c, idx: number) => {
      expect(c).toMatchObject(expected[idx]);
    });
  });

  it("should add new categories, edit one of it, and get them correctly", async () => {
    const token = await loginOrSignUpAsAdmin();

    const res1 = await request(app)
      .post("/api/categories")
      .send(sampleCategory1)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(res1.statusCode).toBe(201);

    const res2 = await request(app)
      .post("/api/categories")
      .send(sampleCategory2)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(res2.statusCode).toBe(201);

    const toEdit: string = res2.body[1]._id;
    const editRes = await request(app)
      .put(`/api/categories/${toEdit}`)
      .send({ name: "Category 2 Updated" })
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(editRes.statusCode).toBe(200);

    const getRes = await request(app).get("/api/categories");
    const resCategories = getRes.body;
    const edited = resCategories.filter((c) => c._id === toEdit)[0];

    expect(edited.name).toBe("Category 2 Updated");
    expect(edited.description).toBe(sampleCategory2.description);
  });

  it("should add new categories, delete one of it, and get them correctly", async () => {
    const token = await loginOrSignUpAsAdmin();

    const res1 = await request(app)
      .post("/api/categories")
      .send(sampleCategory1)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(res1.statusCode).toBe(201);

    const res2 = await request(app)
      .post("/api/categories")
      .send(sampleCategory2)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(res2.statusCode).toBe(201);

    const toDelete: string = res2.body[0]._id;
    const editRes = await request(app)
      .delete(`/api/categories/${toDelete}`)
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer: ${token}`);

    expect(editRes.statusCode).toBe(200);

    const getRes = await request(app).get("/api/categories");
    const resCategories = getRes.body;
    const deleted = resCategories.filter((c) => c._id === toDelete);

    expect(deleted.length).toBe(0);
  });
});
