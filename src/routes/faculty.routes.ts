import express from "express";
import {
  getFaculties,
  getDepartmentsByFaculty,
} from "../controllers/faculty.controller";

const router = express.Router();

router.get("/", getFaculties);
router.get("/:facultyId/departments", getDepartmentsByFaculty);

export default router;