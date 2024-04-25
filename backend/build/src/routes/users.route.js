"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// GET methods
router.route("/:id").get(auth_middleware_1.protect, user_controller_1.getUserDetails);
// POST Methods
// PUT Methods
router.route("/:id").put(auth_middleware_1.protect, user_controller_1.updateUser);
// DELETE methods
router
    .route("/:id")
    .delete(auth_middleware_1.protect, user_controller_1.deleteUser);
exports.default = router;
