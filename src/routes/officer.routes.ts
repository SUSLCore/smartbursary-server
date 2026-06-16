import express from "express";
import { OfficerController } from "../controllers/officer.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router = express.Router();

router.post(
  "/university-officers",
  protect,
  authorize("ADMIN"),
  OfficerController.createUniversityOfficer
);

router.post(
  "/faculties/:facultyId/officers",
  protect,
  authorize("ADMIN"),
  OfficerController.createFacultyOfficer
);

router.post(
  "/departments/:departmentId/officers",
  protect,
  authorize("ADMIN"),
  OfficerController.createDepartmentOfficer
);

export default router;