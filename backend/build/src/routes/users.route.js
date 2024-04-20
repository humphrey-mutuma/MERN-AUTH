"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
/*  user listing. */
router.route("/").get(user_controller_1.getUsers).post(user_controller_1.createUser);
router.route("/:id").get(user_controller_1.getUser).put(user_controller_1.updateUser).delete(user_controller_1.deleteUser);
exports.default = router;
