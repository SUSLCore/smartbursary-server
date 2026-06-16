import { Request, Response } from "express";
import { OfficerService } from "../services/officer.service";
import { UserRole } from "../types/user.types";

export class OfficerController {

  // UNIVERSITY LEVEL
  static async createUniversityOfficer(
    req: Request,
    res: Response
  ) {
    try {
      const { role } = req.body;

      const allowedRoles = [
        UserRole.STUDENT_SERVICE_SAR,
      ];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid university role",
        });
      }

      const officer = await OfficerService.createOfficer(req.body);

      return res.status(201).json({
        message: "University officer created successfully",
        officer,
      });

    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  // FACULTY LEVEL
  static async createFacultyOfficer(
    req: Request,
    res: Response
  ) {
    try {
      const { role } = req.body;

      const allowedRoles = [
        UserRole.FACULTY_AR,
        UserRole.FACULTY_MA,
      ];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid faculty role",
        });
      }

      const officer = await OfficerService.createOfficer({
        ...req.body,
        facultyId: Number(req.params.facultyId),
      });

      return res.status(201).json({
        message: "Faculty officer created successfully",
        officer,
      });

    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  // DEPARTMENT LEVEL
  static async createDepartmentOfficer(
    req: Request,
    res: Response
  ) {
    try {
      const { role } = req.body;

      const allowedRoles = [
        UserRole.DEPARTMENT_HEAD,
        UserRole.DEPARTMENT_MA,
      ];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          message: "Invalid department role",
        });
      }

      const officer = await OfficerService.createOfficer({
        ...req.body,
        departmentId: Number(req.params.departmentId),
      });

      return res.status(201).json({
        message: "Department officer created successfully",
        officer,
      });

    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }
}