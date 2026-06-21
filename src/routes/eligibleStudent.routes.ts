import { Router } from "express";

import eligibleStudentController from "../controllers/eligibleStudent.controller";

import { upload } from "../middlewares/upload.middleware";

import {
  protect,
} from "../middlewares/auth.middleware";
import { UserRole } from "../types/user.types";
import { authorize } from "../middlewares/authorize.middleware";

const router = Router();

/*
 * Upload Eligible Student List
 */
router.post(
  "/upload",
  protect,
  authorize(UserRole.FACULTY_MA),
  upload.single("file"),
  eligibleStudentController.uploadEligibleStudents
);


/*
 * Get Department Students
 */
router.get(
  "/department/:departmentId/batch/:batchId",
  protect,
  eligibleStudentController.getDepartmentStudents
);

/*
 * Check Student Eligibility
 */
router.get(
  "/check/:registerId",
  eligibleStudentController.checkEligibility
);

/*
 * Remove Student
 */
router.patch(
  "/:id/remove",
  protect,
  eligibleStudentController.removeStudent
);

export default router;