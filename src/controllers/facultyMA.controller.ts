import { Request, Response } from "express";
import { getMyDepartments } from "../services/facultyMA.service";

interface AuthRequest extends Request {
  user?: any;
}

export const getDepartments = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user?.facultyId) {
      return res.status(400).json({
        success: false,
        message: "Faculty not assigned",
      });
    }

    const departments = await getMyDepartments(
      req.user.facultyId
    );

    return res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load departments",
    });
  }
};