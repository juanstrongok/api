import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    access: {
      type: String,
      required: [true, "Access are required!"],
    },
    refresh: {
      type: String,
      required: [true, "Refresh are required!"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
  }
);
export const tokenModel = mongoose.model("Token", tokenSchema);
