import mongoose from "mongoose";
const appSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name are required!"],
    },
    client_id: {
      type: String,
      required: [true, "Client ID are required!"],
    },
    client_secret: {
      type: String,
      required: [true, "Client Secret are required!"],
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    updatedAt: {
      type: Date,
      default: new Date(),
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    revoked: {
      type: Boolean,
      default: false,
    },
    grants: {
      type: [String],
      required: [true, "Grants are required!"],
    },
  },
  {
    versionKey: false,
  }
);
export const appModel = mongoose.model("App", appSchema);
