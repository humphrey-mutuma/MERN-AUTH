import express from "express";
import {
  loginUserHandler,
  registerUserHandler,
  loginUserOutHandler,
  refreshAccessTokenHandler,
} from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

/*  GET methods */
router.route("/refresh").get(refreshAccessTokenHandler); // refresh access token

// POST Methods
router.route("/register").post(registerUserHandler);
router.route("/login").post(loginUserHandler);
router.route("/logout").post(protect, loginUserOutHandler);
router.route("/forgot-password").post();
router.route("/resetpassword").post();
router.route("/verify-email").post();

export default router;
