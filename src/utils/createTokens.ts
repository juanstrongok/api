import { sign } from "jsonwebtoken";
import { UserType } from "../types/UserType";
export const createTokens = (user: UserType, scope: string) => {
  try {
    const access = sign(
      { userId: user._id, scope: scope },
      process.env.JWT_ACCESS!,
      {
        expiresIn: "15m",
      }
    );
    const refresh = sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });
    return { access, refresh };
  } catch (error) {
    throw new Error(error);
  }
};
