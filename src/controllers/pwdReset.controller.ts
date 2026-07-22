import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/pwdReset.service";

export class PwdResetController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body;

      // Validate request body
      if (!email) {
        res.status(400).json({
          success: false,
          message: "Email is required."
        });
        return;
      }

      // Call service
      const result = await this.authService.forgotPassword(email);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error: any) {
      next(error);
    }
  };
}