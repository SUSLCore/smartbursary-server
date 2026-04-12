import { Request, Response } from "express";
import {
  registerStudentService,
  loginService,
  sanitizeUser,
} from "../services/auth.service";

export const registerStudent = async (req: Request, res: Response) => {
  try {
    const student = await registerStudentService(req.body);

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      data: student,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await loginService(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const getCurrentUser = async (req: any, res: Response) => {
  try {
    const safeUser = sanitizeUser(req.user);

    res.status(200).json({
      success: true,
      user: safeUser,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};