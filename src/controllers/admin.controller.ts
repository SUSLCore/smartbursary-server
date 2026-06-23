import { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/admin.service";




export class AdminController {

    

static async getUserByRegisterId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const registerId = req.params.registerId as string;

    const user = await AdminService.getUserByRegisterId(registerId);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

  static async deleteUserByRegisterId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const registerId = req.params.registerId as string;

    const result =
      await AdminService.deleteUserByRegisterId(registerId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
}

}