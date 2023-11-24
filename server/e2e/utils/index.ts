import request from "supertest";
import app from "../../server";
import UserModel from "../../models/User.model";

export const loginOrSignUpAsAdmin = async () => {
  const Admin = await UserModel.findOne({ isAdmin: true }).select("-password");
  if (Admin) {
    // login
    const res = await request(app)
      .post("/api/auth/signin")
      .send({ email: Admin.email, password: "1234" })
      .set("Content-Type", "application/json");
    const user = res.body;
    return user.token;
  }

  // register
  const samplePayload = {
    name: "Admin",
    email: "admin@mail.com",
    password: "1234",
    isAdmin: true,
  };
  const res = await request(app)
    .post("/api/auth/signup")
    .send(samplePayload)
    .set("Content-Type", "application/json");
  const user = res.body;
  return user.token;
};
