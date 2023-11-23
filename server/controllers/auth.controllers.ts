import { NextFunction, Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { HydratedDocument } from "mongoose";
import UserModel, { UserDocument } from "../models/User.model";
import { catchControllerError } from "../utils/error";
import { createToken } from "../utils/jwt";
import { CreateUserDto } from "./dtos/Create-User.dto";
import { validateRequestBody } from "../utils/validateRequestBody";
// import SocketInfo from "constants/Socket";

export const SignIn = async (
  req: Request<object, unknown, UserDocument>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const User: HydratedDocument<UserDocument> = await UserModel.findOne({
      email,
    });

    if (!User) {
      throw new Error("User not found");
    }

    if (await bcrypt.compare(password, User.password)) {
      const token = createToken(User.email);
      return res.status(200).json({
        _id: User._id,
        name: User.name,
        email: User.email,
        token,
        isAdmin: User.isAdmin,
      });
    } else {
      throw new Error("Invalid username or password");
    }
  } catch (error) {
    catchControllerError({
      operation: "signIn",
      statusCode: 401,
      error: error,
      response: res,
      errorMessagePrefix: "User sign-in failed",
      next,
    });
  }
};

export const Register = async (
  req: Request<object, unknown, UserDocument>,
  res: Response,
  next: NextFunction
) => {
  try {
    const CreateUserData = await validateRequestBody<UserDocument>(
      CreateUserDto,
      req.body
    );
    const { name, email, password, isAdmin } = CreateUserData;

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      throw new Error("User already exist");
    }

    const CreatedUser: HydratedDocument<UserDocument> = new UserModel({
      name,
      email,
      password,
      isAdmin,
    });

    await CreatedUser.save();

    const token = createToken(CreatedUser.email);
    const result = {
      _id: CreatedUser._id,
      name: CreatedUser.name,
      token,
      email: CreatedUser.email,
      isAdmin: CreatedUser.isAdmin,
    };

    // inform socket.io that new user has joined
    // req.app.get(SocketInfo.name).emit(SocketInfo.events.newUserJoins, {
    //   userId: createdUser._id,
    // });

    return res.status(201).json(result);
  } catch (error) {
    catchControllerError({
      operation: "registerNewUser",
      statusCode: 400,
      error,
      response: res,
      errorMessagePrefix: "User registration failed",
      next,
    });
  }
};
