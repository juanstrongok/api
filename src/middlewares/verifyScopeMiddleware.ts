import { Request, Response, NextFunction } from "express";
export const verifyScopeMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check if scope exists
    if (!req.body.scope) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    // Check if grants
    if (!req.grants) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    // Check if scope is in grants
    if (!req.grants.includes(req.body.scope)) {
      return res.status(401).json({ message: "Unauthorized!" });
    }
    next();
  } catch (error) {
    console.log("Error verifying scope!");
    throw error;
  }
};
