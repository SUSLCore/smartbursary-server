import { Request, Response, NextFunction } from "express";
import { verifyResetToken } from "../utils/jwtResetToken";

export interface ResetTokenPayload {
    userId: number;
    purpose: "password-reset";
}

export const verifyResetPasswordToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    try {

        //----------------------------------------
        // Read Cookie
        //----------------------------------------

        const token = req.cookies.passwordResetToken;

        if (!token) {

            res.status(401).json({

                success: false,

                message: "Password reset session expired."

            });

            return;

        }

        //----------------------------------------
        // Verify JWT
        //----------------------------------------

        const payload = verifyResetToken(token);

        //----------------------------------------
        // Check Purpose
        //----------------------------------------

        if (payload.purpose !== "password-reset") {

            res.status(401).json({

                success: false,

                message: "Invalid reset token."

            });

            return;

        }

        //----------------------------------------
        // Save UserId
        //----------------------------------------

       (req as any).userId = payload.userId;

        next();

    } catch (error) {

        res.status(401).json({

            success: false,

            message: "Invalid or expired password reset session."

        });

    }

};


