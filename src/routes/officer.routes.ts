import express from "express";
import { OfficerController } from "../controllers/officer.controller";

const router = express.Router();

/*
University Level
*/

router.post(
  "/university-officers",
  OfficerController.createUniversityOfficer
);

/*
Faculty Level
*/

router.post(
  "/faculties/:facultyId/officers",
  OfficerController.createFacultyOfficer
);

/*
Department Level
*/

router.post(
  "/departments/:departmentId/officers",
  OfficerController.createDepartmentOfficer
);

export default router;