import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { CookieOptions, Request, NextFunction, Response } from "express";
import { DecodedToken } from "../utils/types";
import UserModel from "../models/user.model";

interface ExtendedRequest extends Request {
  user?: {
    id: string;
    email: string;
    // Other user properties
  };
}
// Set cookies with tokens
const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production" ? true : false, // Set to true in production if using HTTPS
  expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes in milliseconds
  maxAge: 15 * 60, // 15 minutes in seconds
};

const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production" ? true : false, // Set to true in production if using HTTPS
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in milliseconds
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};

// @desc    register a user
// @route   POST /api/users
export async function registerUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, name, password } = req.body;
  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: "Email or password not found!" });
  }

  // Check if JWT_SECRET is defined
  if (!process.env.JWT_SECRET || !process.env.JWT_SECRET_REFRESH) {
    return res.status(400).json({
      message:
        "JWT_SECRET or JWT_SECRET_REFRESH is not defined in the env variables.",
    });
  }
  // check if user already exists
  const userExists = await UserModel.findOne({
    email: email,
  });
  if (userExists) {
    return res
      .status(400)
      .json({ message: "User already exists! Please Login" });
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = await UserModel.create({
      email,
      name,
      password: hashedPassword,
     });
    if (newUser) {
      // verify user email using an OTP or magic link


      // after verifying user email, update with when it was verified

      return res.status(200).json({
        message: "User Successfully created!",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      });
    }
  } catch (error) {
    console.error(error);
    next(error); // Forward the error to the error handling middleware
    return res.status(400).json(error);
  }
}
// @desc    Get a user
// @route   GET /api/users/ id
export async function loginUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  // const { id, email } = req.user;

  if (!email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: "Email or password not found!" });
  }

  try {
    // get user email by email
    const user = await UserModel.findOne(
      {
        email: email,
      },
      " password name email"
    );

    // check used password is correct
    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate access token
      const {
        accessToken,
        refreshToken,
        accessTokenExpiration,
        refreshTokenExpiration,
      } = await generateTokens(user);

      res.cookie("access_token", accessToken, accessTokenCookieOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
      res.cookie("logged_in", true, {
        ...accessTokenCookieOptions,
        httpOnly: false,
      });

      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        accessToken,
      });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    next(error); // Forward the error to the error handling middleware
  }
}

// @desc    Get a user
// @route   GET /api/users/ id
export async function refreshAccessTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refresh_token = req.cookies.refresh_token;

  if (!refresh_token?.trim() || !process.env.JWT_SECRET_REFRESH) {
    return res
      .status(400)
      .json({ message: "Refresh token or secret Not Found!" });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refresh_token,
      process.env.JWT_SECRET_REFRESH
    ) as DecodedToken;

    // Sign new access token
    const {
      accessToken,
      refreshToken,
      accessTokenExpiration,
      refreshTokenExpiration,
    } = await generateTokens(decoded);

    // 4. Add Cookies and return res
    res.cookie("access_token", accessToken, accessTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    return res.json({
      accessToken,
    });
  } catch (error) {
    console.error(error);
    next(error); // Forward the error to the error handling middleware
  }
}

// @desc    log user out
// @route   GET /api/auth/logout
export async function loginUserOutHandler(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) {
  // get user from middleware req
  const user = req.user;
  if (!user) {
    return res.status(200).json({ message: "User credentials Not found!" });
  }

  try {
    // invalidate access/refresh token

    if (user) {
      return res.status(200).json({ message: "Successfully logged Out!" });
    }
  } catch (error) {
    console.error(error);
    next(error); // Forward the error to the error handling middleware
  }
}

// ***************************************************************************************
// Generate JWT
const generateTokens = (user: { id: string; email: string }) => {
  const currentTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds

  const accessTokenExpiration = currentTimestamp + 15 * 60; // 15 minutes from now
  const refreshTokenExpiration = currentTimestamp + 7 * 24 * 60 * 60; // 7 days from now

  // Check if JWT_SECRET is defined
  if (!process.env.JWT_SECRET || !process.env.JWT_SECRET_REFRESH) {
    throw new Error(
      "JWT_SECRET or JWT_SECRET_REFRESH is not defined in the environment variables."
    );
  }

  // Generate access token
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, timestamp: currentTimestamp },
    process.env.JWT_SECRET,
    { expiresIn: "1m" }
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, timestamp: currentTimestamp },
    process.env.JWT_SECRET_REFRESH,
    { expiresIn: "30d" }
  );

  return {
    accessToken,
    refreshToken,
    accessTokenExpiration,
    refreshTokenExpiration,
  };
};
