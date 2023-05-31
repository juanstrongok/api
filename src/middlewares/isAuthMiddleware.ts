import { Request, Response, NextFunction } from "express";
import { tokenModel } from "../models/tokenMode";
import { verify } from "jsonwebtoken";
export const isAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if authorization header exists
    if (!req.headers.authorization)
      return res.status(401).json({ message: "Token not found!" });
    // Check if authorization header is valid
    if (!req.headers.authorization.startsWith("Bearer "))
      return res.status(401).json({ message: "Token not found!" });
    // Get token from request headers
    const access = req.headers.authorization?.split(" ")[1];
    // Check if token exists
    const token = await tokenModel.findOne({ access: access });
    if (!token) return res.status(401).json({ message: "Token not found!" });
    // Decode token
    try {
      const payload: any = verify(token.access, process.env.JWT_SECRET!);
      req.user = payload.userId;
    } catch (error) {
      if (error.message === "jwt expired") {
        return res.status(401).json({ message: "Token expired!" });
      } else {
        return res.status(400).json({ message: "Error token!" });
      }
    }
    next();
  } catch (error) {
    console.log("Error in isAuthMiddleware: ", error.message);
    return res.status(500).json({ message: error.message });
  }
};
