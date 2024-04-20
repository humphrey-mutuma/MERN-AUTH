import express from "express";
import {
   getUserDetails,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";

const router = express.Router();

// GET methods

 router.route("/:id").get(protect, getUserDetails);

// POST Methods

// PUT Methods
router.route("/:id").put(protect, updateUser);

// DELETE methods
router
  .route("/:id")
  .delete(protect, deleteUser);

export default router;
