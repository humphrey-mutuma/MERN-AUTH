import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { CookieOptions, Request, NextFunction, Response } from "express";
import { DecodedToken } from "../utils/types";
import UserModel from "../models/user.model";

interface ExtendedRequest extends Request {
  user?: {
    _id: string;
    email: string;
    name: string;
    // Other user properties
  };
}
interface LoginRequestBody extends Request {
  email: string;
  password: string;
}

const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true, // Use secure cookies in production
  sameSite: "strict", // Prevent CSRF attacks
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
};

// @desc    register a user
// @route   POST /api/users
export async function registerUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, name, password } = req.body;
  if (!email?.trim() || !name?.trim() || !password?.trim()) {
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

      return res.status(201).json({
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
  req: LoginRequestBody,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;
  // const { id, email } = req.user;

  if (!email?.toString().trim() || !password?.toString().trim()) {
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
      const { accessToken, refreshToken } = await generateTokens(user);
      // Set a cookie named "exampleCookie" with value "cookieValue"
    
      return (
        res
          .status(200)
          .cookie("refresh_token", refreshToken, refreshTokenCookieOptions)
          .json({
            _id: user._id,
            name: user.name,
            email: user.email,
            accessToken,
          })
      );
    } else {
      return res.status(400).json({ message: "Invalid Credentials!" });
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
 
  // Check if we have access token and JWT_SECRET
  if (!refresh_token || !process.env.JWT_SECRET_REFRESH) {
    return res.status(401).json({ message: "Token or Secret Not Found!" });
  }

  try {
    // Verify refresh token
    const decodedToken = jwt.verify(
      refresh_token,
      process.env.JWT_SECRET_REFRESH
    ) as DecodedToken;

    // If the token is expired or will expire soon, return a 401 status response
    if (decodedToken) {
      // Sign new access token
      const { accessToken, refreshToken } = await generateTokens(decodedToken);

      // 4. Add Cookies and return res
      // token rotation - issue new refresh token for all new access token request
      return res
        .status(200)
        .cookie("refresh_token", refreshToken, refreshTokenCookieOptions)
        .json({
          accessToken,
          message: "New Token Issued!",
        });
    } else {
      return res
        .status(401)
        .json({ message: "Token Expired! Please Login!", isExpired: true });
    }
  } catch (error) {
    console.error(error);
    next(error); // Forward the error to the error handling middleware
  }
}

// @desc    log user out
// @route   GET /api/auth/logout
export async function logOutUserHandler(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) {
  // get user from middleware req
  const user = req.user;
  if (!user) {
    return res.status(200).json({ message: "User Not found!" });
  }

  try {
    // invalidate access/refresh token
    return res
      .status(200)
      .clearCookie("refresh_token")
      .json({ message: "Successfully logged Out!" });
  } catch (error) {
    console.error(error);
    next(error); // Forward the error to the error handling middleware
  }
}

// ***************************************************************************************
// Generate JWT
const generateTokens = (user: DecodedToken) => {
 
  // Check if JWT_SECRET is defined
  if (!process.env.JWT_SECRET || !process.env.JWT_SECRET_REFRESH) {
    throw new Error(
      "JWT_SECRET or JWT_SECRET_REFRESH is not defined in the environment variables."
    );
  }

  // Generate access token
  const accessToken = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1m" }
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET_REFRESH,
    { expiresIn: "24h" }
  );

  return {
    accessToken,
    refreshToken,
  };
};
