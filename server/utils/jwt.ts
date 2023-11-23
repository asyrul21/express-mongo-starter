import jwt from "jsonwebtoken";

export const createToken = (email: string) => {
  const secret = process.env.JWT_SECRET;
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, secret, {
    expiresIn: "60d",
  });
};
