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

  public verifyOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, otp } = req.body;

      // Validate request body
      if (!email || !otp) {
        res.status(400).json({
          success: false,
          message: "Email and OTP are required."
        });
        return;
      }

      // Call service
const result = await this.authService.verifyOtp(
    email,
    otp
);

//-----------------------------------------------
// Set Secure HttpOnly Cookie
//-----------------------------------------------

res.cookie(
    "passwordResetToken",
    result.resetToken,
    {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 10 * 60 * 1000
    }
);

res.status(200).json({

    success: true,

    message: result.message

});
    } catch (error: any) {
      next(error);
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {

    try {

        const {

            password,

            confirmPassword

        } = req.body;

        if (!password || !confirmPassword) {

            res.status(400).json({

                success: false,

                message: "Password and Confirm Password are required."

            });

            return;

        }

const userId = (req as any).userId;

await this.authService.resetPassword(
    userId,
    password,
    confirmPassword
);

        //-----------------------------------------
        // Clear Password Reset Cookie
        //-----------------------------------------

        res.clearCookie("passwordResetToken", {

            httpOnly: true,

            secure: process.env.NODE_ENV === "production",

            sameSite: "strict"

        });

        //-----------------------------------------
        // Logout User
        //-----------------------------------------

        res.clearCookie("accessToken", {

            httpOnly: true,

            secure: process.env.NODE_ENV === "production",

            sameSite: "strict"

        });

        res.clearCookie("refreshToken", {

            httpOnly: true,

            secure: process.env.NODE_ENV === "production",

            sameSite: "strict"

        });

        res.status(200).json({

            success: true,

            message:
                "Password changed successfully. Please login again."

        });

    }

    catch (error) {

        next(error);

    }

};

  
}