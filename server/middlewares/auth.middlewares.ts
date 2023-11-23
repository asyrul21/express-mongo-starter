import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import UserModel, { UserDocument } from "../models/User.model";

// export interface UserRequest extends Request {
//   currentUser?: Omit<UserDocument, "password">;
// }

/**
 * Extend Express's Request Interface Type definition
 */
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDocument;
    }
  }
}

export const requireLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: null | string = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await UserModel.findOne({
        email: decoded.email,
      }).select("-password");
      req.currentUser = currentUser;
      return next();
    } catch (error) {
      console.error(error);
      res.status(401);
      next(new Error("Not authorized, token failed. " + error));
    }
  }

  if (!token) {
    res.status(401);
    next(new Error("Not authorized."));
  }
};

export const mustBeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.currentUser && req.currentUser.isAdmin) {
    next();
  } else {
    res.status(401);
    next(new Error("Not authorized as an admin."));
  }
};
