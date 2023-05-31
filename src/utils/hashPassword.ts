import crypto, { scryptSync } from "crypto";

export const hashPassword = (password: string, salt?: string) => {
  try {
    if (!salt) {
      salt = crypto.randomBytes(16).toString("base64");
    }
    const encrypt = scryptSync(password, salt, 64);
    return { hash: encrypt.toString("base64"), salt: salt };
  } catch (error) {
    console.log(error);
    throw new Error("Error hashing password!");
  }
};
