import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models";
import { UserRole } from "../types/user.types";
import { sendAccountCreatedEmail } from "../services/email.service";

export const createOfficer = async (req: Request, res: Response) => {
  try {
    const { email, password, role, facultyId, departmentId, name, registerId } = req.body;

    const allowedRoles = [
      UserRole.STUDENT_SERVICE_SAR,
      UserRole.STUDENT_SERVICE_MA,
      UserRole.FACULTY_MA,
      UserRole.FACULTY_AR,
      UserRole.DEPARTMENT_HEAD,
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid officer role" });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const officer = await User.create({
      name,
      registerId,
      email,
      password: hashedPassword,
      role,
      facultyId,
      departmentId,
      isActive: true,
      mustChangePassword: true,
    });

    try {
  await sendAccountCreatedEmail(email, password);
} catch (emailError) {
  console.log("Email sending failed:", emailError);
}

    res.status(201).json({
      message: "Officer account created successfully",
      officer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Officer account creation failed",
      error,
    });
  }
};