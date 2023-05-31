import { Request, Response } from "express";
import { userModel } from "../../models/userModel";
import { hashPassword } from "../../utils/hashPassword";
import { tokenModel } from "../../models/tokenMode";
import { createTokens } from "../../utils/createTokens";

export const signInController = async (req, res) => {
  try {
    // Get data from request body
    const { email, password } = req.body;
    // Validate data
    if (!email) {
      return res.status(400).json({ message: "Email are required!" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password are required!" });
    }
    // Check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email are invalid!" });
    }
    // Check if password is correct
    const { hash } = hashPassword(password, user.salt);
    if (hash !== user.hash) {
      return res.status(400).json({ message: "Password are invalid!" });
    }
    // Create tokens
    const { access, refresh } = createTokens(user, "user");
    // Save refreshToken in database
    const token = await tokenModel.findOne({ user: user._id });
    if (!token) {
      return res.status(400).json({ message: "Token not found!" });
    }
    token.access = access;
    token.refresh = refresh;
    await token.save();
    // Send tokens
    return res.status(200).json({ access, refresh });
  } catch (error) {
    console.log("Error in signInController: ", error.message);
    return res.status(500).json({ message: error.message });
  }
};
