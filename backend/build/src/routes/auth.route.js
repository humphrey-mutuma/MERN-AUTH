"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// 
// POST Methods
router.route("/refresh").post(auth_controller_1.refreshAccessTokenHandler); // refresh access token
router.route("/register").post(auth_controller_1.registerUserHandler);
router.route("/login").post(auth_controller_1.loginUserHandler);
router.route("/logout").post(auth_middleware_1.protect, auth_controller_1.logOutUserHandler);
router.route("/forgot-password").post();
router.route("/resetpassword").post();
router.route("/verify-email").post();
exports.default = router;
