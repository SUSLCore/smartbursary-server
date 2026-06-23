import express from "express";
import { AdminController } from "../controllers/admin.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { UserRole } from "../types/user.types";

const router = express.Router();

/**
 * Search user by registration ID
 */
router.get(
  "/users/:registerId",
  protect,
  authorize(UserRole.ADMIN),
  AdminController.getUserByRegisterId
);

/**
 * Delete user by registration ID
 */
router.delete(
  "/users/:registerId",
  protect,
  authorize(UserRole.ADMIN),
  AdminController.deleteUserByRegisterId
);

export default router;