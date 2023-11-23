import { Document, Schema, model } from "mongoose";
import * as bcrypt from "bcrypt";
import { NextFunction } from "express";

export type UserDocument = Document & {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
};

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// password encryption
UserSchema.pre("save", async function (next: NextFunction) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    console.error("Error while updating password");
    console.error(error);
    throw new Error("Error while updating user password.");
  }
});

const UserModel = model<UserDocument>("User", UserSchema);
export default UserModel;
