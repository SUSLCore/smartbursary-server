import express from "express";

import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

import { UserRole } from "../types/user.types";

import {
  getDepartments,
} from "../controllers/facultyMA.controller";

const router = express.Router();

router.get(
  "/departments",
  protect,
  authorize(UserRole.FACULTY_MA),
  getDepartments
);

export default router;