import { appModel } from "../models/appModel";
import { v4 as uuidv4 } from "uuid";

export const createAuth2ServerAppService = async () => {
  try {
    // Check if default app exists
    const appApp = await appModel.findOne({ name: "oauth2-server" });
    if (appApp) return;
    // generate random client_id && client_secret string 128 characters long
    const client_id = uuidv4();
    const client_secret = uuidv4();
    // Create default app
    const app = new appModel({
      name: "oauth2-server",
      client_id: client_id,
      client_secret: client_secret,
      grants: ["password", "refresh_token"],
    });
    await app.save();
    return app;
  } catch (error) {
    console.log("Error creating default app!");
    throw error;
  }
};
