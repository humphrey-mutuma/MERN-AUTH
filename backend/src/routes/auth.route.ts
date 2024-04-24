import express from "express";
import {
  loginUserHandler,
  registerUserHandler,
  logOutUserHandler,
  refreshAccessTokenHandler,
 } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();
// 

// POST Methods
router.route("/refresh").post(refreshAccessTokenHandler); // refresh access token
router.route("/register").post(registerUserHandler);
router.route("/login").post(loginUserHandler);
router.route("/logout").post(protect, logOutUserHandler);
router.route("/forgot-password").post();
router.route("/resetpassword").post();
router.route("/verify-email").post();

export default router;
