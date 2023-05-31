import { Request, Response, NextFunction } from "express";
import { appModel } from "../models/appModel";
export const verifyClientMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if client_id and client_secret exists
    if (!req.body.client_id || !req.body.client_secret) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    // Check if client_id and client_secret are valid
    if (req.body.client_id && req.body.client_secret) {
      const app = await appModel.findOne({
        client_id: req.body.client_id,
        client_secret: req.body.client_secret,
        revoked: false,
      });
      if (!app) {
        return res.status(401).json({ message: "Unauthorized!" });
      }
    }
    next();
  } catch (error) {
    console.log("Error checking client authorization!");
    throw error;
  }
};
