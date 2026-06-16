import { User } from "../models";
import { UserRole } from "../types/user.types";
import { hashPassword } from "../utils/hashPassword";
import { sendAccountCreatedEmail } from "./email.service";

export interface CreateOfficerData {
  name: string;
  registerId: string;
  email: string;
  password: string;
  role: UserRole;
  facultyId?: number;
  departmentId?: number;
}

export class OfficerService {
  static async createOfficer(data: CreateOfficerData) {
    
    // Check email uniqueness
    const existingEmail = await User.findOne({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new Error("Email already exists");
    }

    // Check register ID uniqueness
    const existingRegisterId = await User.findOne({
      where: { registerId: data.registerId },
    });

    if (existingRegisterId) {
      throw new Error("Register ID already exists");
    }

    // Role uniqueness validation

    // Only one SAR in entire university
    if (data.role === UserRole.STUDENT_SERVICE_SAR) {
      const existingSAR = await User.findOne({
        where: {
          role: UserRole.STUDENT_SERVICE_SAR,
        },
      });

      if (existingSAR) {
        throw new Error("SAR account already exists");
      }
    }

    // Only one Faculty AR per faculty
    if (data.role === UserRole.FACULTY_AR) {
      const existingFacultyAR = await User.findOne({
        where: {
          role: UserRole.FACULTY_AR,
          facultyId: data.facultyId,
        },
      });

      if (existingFacultyAR) {
        throw new Error("Faculty AR already exists");
      }
    }

    // Only one Faculty MA per faculty
    if (data.role === UserRole.FACULTY_MA) {
      const existingFacultyMA = await User.findOne({
        where: {
          role: UserRole.FACULTY_MA,
          facultyId: data.facultyId,
        },
      });

      if (existingFacultyMA) {
        throw new Error("Faculty MA already exists");
      }
    }

    // Only one Department Head per department
    if (data.role === UserRole.DEPARTMENT_HEAD) {
      const existingHead = await User.findOne({
        where: {
          role: UserRole.DEPARTMENT_HEAD,
          departmentId: data.departmentId,
        },
      });

      if (existingHead) {
        throw new Error("Department Head already exists");
      }
    }

    // Only one Department MA per department
    if (data.role === UserRole.DEPARTMENT_MA) {
      const existingDepartmentMA = await User.findOne({
        where: {
          role: UserRole.DEPARTMENT_MA,
          departmentId: data.departmentId,
        },
      });

      if (existingDepartmentMA) {
        throw new Error("Department MA already exists");
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create officer
    const officer = await User.create({
      name: data.name,
      registerId: data.registerId,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      facultyId: data.facultyId ?? null,
      departmentId: data.departmentId ?? null,
      isActive: true,
      mustChangePassword: true,
    });

    // Send credentials email
    try {
      await sendAccountCreatedEmail(
        data.email,
        data.password
      );
    } catch (error) {
      console.log("Email sending failed:", error);
    }

    return officer;
  }
}