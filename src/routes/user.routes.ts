import { Router } from "express";

import userController from "../controllers/user.controller";

import {
  protect,
} from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/profile",
  protect,
  userController.getProfile
);

export default router;