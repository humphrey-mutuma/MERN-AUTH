import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user.model";

// @desc    Get a user
// @route   GET /api/users/ id
export async function getUserDetails(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  if (!id?.trim()) {
    return res.status(200).json({ message: "User Id not Found" });
  }
  try {
    const user = await UserModel.findById(id, "-password");
    if (user) {
      return res.status(200).json(user);
    }
  } catch (error) {
    console.error(error);
    next(error); // Forward the error to the error handling middleware
  }
}

// @desc    update user details
// @route   PUT /api/users/id

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, name } = req.body;
  const { id } = req.params;
  if (!email?.trim() || !name?.trim()) {
    return res.status(400).json({ message: "Missing email or name!" });
  }
  try {
    const updated_user = await UserModel.updateOne(
      {
        id,
      },
      {
        email,
        name,
      }
    );
    if (updated_user) {
      return res.status(200).json(updated_user);
    }
  } catch (error) {
    console.error(error);
    next(error); // Forward the error to the error handling middleware
    return res.status(400).json(error);
  }
}

// @desc    delete a user
// @route   DELETE /api/users/ id
export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  if (!id?.trim()) {
    return res.status(400).json({ message: "Missing User id" });
  }
  try {
    const deletedUser = await UserModel.deleteOne({
      id: id,
    });
    if (deletedUser) {
      return res.status(200).json(deletedUser);
    }
  } catch (error) {
    console.error(error);
    next(error); // Forward the error to the error handling middleware
    return res.status(400).json(error);
  }
}
