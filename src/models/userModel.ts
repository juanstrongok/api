import mongoose from "mongoose";
import { UserType } from "../types/UserType";

const userSchema = new mongoose.Schema<UserType>(
  {
    email: {
      type: String,
      required: [true, "Email are required!"],
      unique: true,
    },
    hash: {
      type: String,
      required: [true, "Hash are required!"],
    },
    salt: {
      type: String,
      required: [true, "Salt are required!"],
    },
    birthday: {
      type: Date,
      required: [true, "Birthday are required!"],
    },
    username: {
      type: String,
      required: [true, "Username are required!"],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, "Slug are required!"],
      unique: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    updatedAt: {
      type: Date,
      default: new Date(),
    },
    token: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Token",
    },
  },
  {
    versionKey: false,
  }
);

export const userModel = mongoose.model("User", userSchema);
