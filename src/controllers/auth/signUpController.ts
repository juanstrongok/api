import { Request, Response } from "express";
import { userModel } from "../../models/userModel";
import { hashPassword } from "../../utils/hashPassword";
import slugify from "slugify";
import Isemail from "isemail";
import { authorizedCountries } from "../../config/authorizedCountries";
import { createTokens } from "../../utils/createTokens";
import { tokenModel } from "../../models/tokenMode";

export const signUpController = async (req: Request, res: Response) => {
  try {
    // Get data from request body
    const { email, password, username, birtday, city, country } = req.body;
    let slug = "";
    // Validate data
    if (!email) {
      return res.status(400).json({ message: "Email are required!" });
    } else if (!Isemail.validate(email)) {
      // Check email format
      return res.status(400).json({ message: "Email are invalid!" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password are required!" });
    }
    // Check password length
    else if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters!" });
    } else if (password.length > 32) {
      return res
        .status(400)
        .json({ message: "Password must be less than 32 characters!" });
    }
    if (!username) {
      return res.status(400).json({ message: "Username are required!" });
    } else {
      // Check username length
      if (username.length < 3) {
        return res
          .status(400)
          .json({ message: "Username must be at least 3 characters!" });
      } else if (username.length > 32) {
        return res
          .status(400)
          .json({ message: "Username must be less than 32 characters!" });
      }
      // Check username format
      // username must be letters with spaces and accents
      const usernameRegex = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\u00E0-\u00FC ]+$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({
          message: "Username must be letters with spaces and accents!",
        });
      }
      // slugify username
      slug = slugify(username);
    }
    if (!birtday) {
      return res.status(400).json({ message: "Birthday are required!" });
    } else {
      // set UTC birthday date
      const date = new Date(birtday);
      // Check if birthday is a valid date
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: "Birthday are invalid!" });
      }
      date.setUTCHours(0, 0, 0, 0);
      // set UTC now date
      const now = new Date();
      now.setUTCHours(0, 0, 0, 0);
      // Check if birthday is not in the future
      if (date.getTime() > now.getTime()) {
        return res
          .status(400)
          .json({ message: "Birthday can't be in the future!" });
      }
      // Check if birthday is not less than 18 years
      const eighteenYearsOld = new Date();
      eighteenYearsOld.setUTCHours(0, 0, 0, 0);
      eighteenYearsOld.setFullYear(eighteenYearsOld.getFullYear() - 18);
      if (date.getTime() > 0 && eighteenYearsOld.getTime() > date.getTime()) {
        return res
          .status(400)
          .json({ message: "You must be at least 18 years old!" });
      }
    }
    // Check if city is valid
    if (!city) {
      return res.status(400).json({ message: "City are required!" });
    } else if (!authorizedCountries.includes(city)) {
      return res.status(400).json({ message: "City are invalid!" });
    }
    // Check if country is valid
    if (!country) {
      return res.status(400).json({ message: "Country are required!" });
    } else if (!authorizedCountries.includes(country)) {
      return res.status(400).json({ message: "Country are invalid!" });
    }
    // Check if user already exists
    let user = await userModel.findOne({
      $or: [{ email: email }, { username: username }, { slug: slug }],
    });
    if (user) {
      if (user.email === email)
        return res
          .status(400)
          .json({ message: "User already exists with this email!" });
      if (user.username === username)
        return res
          .status(400)
          .json({ message: "Username already exists with this username!" });
      if (user.slug === slug) {
        // Generate random number to add to slug
        let slugExists = true;
        while (slugExists === true) {
          // Generate random number
          const randomNumber = Math.floor(Math.random() * 1000);
          // Add random number to slug
          slug = slug + randomNumber;
          // Check if slug exists
          user = await userModel.findOne({ slug: slug });
          if (!user) {
            slugExists = false;
          }
        }
      }
    }

    // Hash password
    const { hash, salt } = hashPassword(password);
    // Create new user
    const newUser = await userModel.create({
      email,
      hash,
      salt,
      username,
      slug,
      birtday,
      city,
      country,
    });
    // Remove hash and salt from user object
    // @ts-ignore
    newUser.hash = undefined;
    // @ts-ignore
    newUser.salt = undefined;

    // Create token
    const { access, refresh } = createTokens(newUser, "user");
    const token = await tokenModel.create({
      access,
      refresh,
      user: newUser._id,
    });
    // Save token in database
    newUser.token = token._id;
    await newUser.save();

    // Return new user
    return res.status(201).json(newUser);
  } catch (error) {
    console.log("Error in signUpController: ", error.message);
    return res.status(500).json({ message: error.message });
  }
};
