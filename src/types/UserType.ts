import { Types } from "mongoose";

export type UserType = {
  _id: Types.ObjectId;
  email: string;
  hash: string;
  salt: string;
  username: string;
  birthday: Date;
  city: string;
  country: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  token: Types.ObjectId;
};
