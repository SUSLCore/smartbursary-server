import jwt from "jsonwebtoken";

interface ResetTokenPayload {
    userId: number;
    purpose: "password-reset";
}

const RESET_TOKEN_SECRET = process.env.JWT_RESET_SECRET!;

const RESET_TOKEN_EXPIRES_IN =
    (process.env.JWT_RESET_EXPIRES_IN || "10m") as jwt.SignOptions["expiresIn"];

/**
 * Generate Password Reset JWT
 */
export const generateResetToken = (
    userId: number
): string => {

    return jwt.sign(
        {
            userId,
            purpose: "password-reset"
        },
        RESET_TOKEN_SECRET,
        {
            expiresIn: RESET_TOKEN_EXPIRES_IN
        }
    );

};

/**
 * Verify Password Reset JWT
 */
export const verifyResetToken = (
    token: string
): ResetTokenPayload => {

    return jwt.verify(
        token,
        RESET_TOKEN_SECRET
    ) as ResetTokenPayload;

};