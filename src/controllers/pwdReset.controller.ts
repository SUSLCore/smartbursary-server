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

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required."
      });
      return;
    }

    const result = await this.authService.forgotPassword(email);

    res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error: any) {

    if (error.message === "No account found with this email address.") {
      res.status(404).json({
        success: false,
        message: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

public verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, otp } = req.body;

    //---------------------------------------
    // Validate Request Body
    //---------------------------------------

    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: "Email and OTP are required."
      });
      return;
    }

    //---------------------------------------
    // Verify OTP
    //---------------------------------------

    const result = await this.authService.verifyOtp(
      email,
      otp
    );

    //---------------------------------------
    // Set Secure HttpOnly Cookie
    //---------------------------------------

    res.cookie("passwordResetToken", result.resetToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 60 * 1000
    });

    //---------------------------------------
    // Success Response
    //---------------------------------------

    res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error: any) {

    //---------------------------------------
    // User Not Found
    //---------------------------------------

    if (error.message === "No account found with this email address.") {
      res.status(404).json({
        success: false,
        message: error.message
      });
      return;
    }

    //---------------------------------------
    // OTP Not Found
    //---------------------------------------

    if (error.message === "OTP not found. Please request a new OTP.") {
      res.status(404).json({
        success: false,
        message: error.message
      });
      return;
    }

    //---------------------------------------
    // OTP Expired
    //---------------------------------------

    if (error.message === "OTP has expired. Please request a new OTP.") {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }

    //---------------------------------------
    // Invalid OTP
    //---------------------------------------

    if (error.message === "Invalid OTP.") {
      res.status(400).json({
        success: false,
        message: error.message
      });
      return;
    }

    //---------------------------------------
    // Internal Server Error
    //---------------------------------------

    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
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

        //---------------------------------------
        // Validate Request Body
        //---------------------------------------

        if (!password || !confirmPassword) {

            res.status(400).json({

                success: false,

                message: "Password and Confirm Password are required."

            });

            return;

        }

        //---------------------------------------
        // Reset Password
        //---------------------------------------

        const userId = (req as any).userId;

        await this.authService.resetPassword(
            userId,
            password,
            confirmPassword
        );

        //---------------------------------------
        // Clear Password Reset Cookie
        //---------------------------------------

        res.clearCookie("passwordResetToken", {

            httpOnly: true,

            secure: process.env.NODE_ENV === "production",

            sameSite: "strict"

        });

        //---------------------------------------
        // Clear Login Cookies
        //---------------------------------------

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

        //---------------------------------------
        // Success Response
        //---------------------------------------

        res.status(200).json({

            success: true,

            message: "Password changed successfully. Please login again."

        });

    }

    catch (error: any) {

        //---------------------------------------
        // Passwords Do Not Match
        //---------------------------------------

        if (error.message === "Passwords do not match.") {

            res.status(400).json({

                success: false,

                message: error.message

            });

            return;

        }

        //---------------------------------------
        // User Not Found
        //---------------------------------------

        if (error.message === "User not found.") {

            res.status(404).json({

                success: false,

                message: error.message

            });

            return;

        }

        //---------------------------------------
        // Internal Server Error
        //---------------------------------------

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

  
}