import bcrypt from "bcrypt";
import User from "../models/user.model";
import PasswordResetOtp from "../models/passwordResetOtp.model";
import { EmailService } from "./pwdResetEmail.Service";
import { generateOtp } from "../utils/otpGenerator";
import { generateResetToken } from "../utils/jwtResetToken";

export class AuthService {

    private emailService: EmailService;

    constructor() {
        this.emailService = new EmailService();
    }

    /**
     * Send OTP for forgot password
     */
    public async forgotPassword(email: string): Promise<{ message: string }> {

        //----------------------------------------------------
        // 1. Find user
        //----------------------------------------------------

        const user = await User.findOne({
            where: {
                email
            }
        });

        if (!user) {
            throw new Error("No account found with this email address.");
        }

        //----------------------------------------------------
        // 2. Generate OTP
        //----------------------------------------------------

        const otp = generateOtp();

        //----------------------------------------------------
        // 3. Hash OTP
        //----------------------------------------------------

        const otpHash = await bcrypt.hash(otp, 10);

        //----------------------------------------------------
        // 4. OTP Expiry
        //----------------------------------------------------

        const expiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );

        //----------------------------------------------------
        // 5. Delete previous OTPs
        //----------------------------------------------------

        await PasswordResetOtp.destroy({
            where: {
                userId: user.id
            }
        });

        //----------------------------------------------------
        // 6. Save new OTP
        //----------------------------------------------------

        await PasswordResetOtp.create({

            userId: user.id,

            otpHash,

            expiresAt,

            attempts: 0,

            isUsed: false

        });

        //----------------------------------------------------
        // 7. Send Email
        //----------------------------------------------------

        await this.emailService.sendOtpEmail(
            user.email,
            otp
        );

        //----------------------------------------------------
        // 8. Success
        //----------------------------------------------------

        return {
            message: "OTP has been sent successfully."
        };

    }

    /**
     * Verify Password Reset OTP
     */
public async verifyOtp(
    email: string,
    otp: string
): Promise<{
    message: string;
    resetToken: string;
}> {

        //----------------------------------------------------
        // 1. Find User
        //----------------------------------------------------

        const user = await User.findOne({
            where: {
                email
            }
        });

        if (!user) {
            throw new Error("No account found with this email address.");
        }

        //----------------------------------------------------
        // 2. Find Active OTP
        //----------------------------------------------------

        const otpRecord = await PasswordResetOtp.findOne({
            where: {
                userId: user.id,
                isUsed: false
            }
        });

        if (!otpRecord) {
            throw new Error("OTP not found. Please request a new OTP.");
        }

        //----------------------------------------------------
        // 3. Check OTP Expiry
        //----------------------------------------------------

        if (new Date() > otpRecord.expiresAt) {
            throw new Error("OTP has expired. Please request a new OTP.");
        }

        //----------------------------------------------------
        // 4. Verify OTP
        //----------------------------------------------------

        const isOtpValid = await bcrypt.compare(
            otp,
            otpRecord.otpHash
        );

        if (!isOtpValid) {

            await otpRecord.increment("attempts");

            throw new Error("Invalid OTP.");
        }

        //----------------------------------------------------
        // 5. Mark OTP as Used
        //----------------------------------------------------

        otpRecord.isUsed = true;

        await otpRecord.save();

        //----------------------------------------------------
        // 6. Success
        //----------------------------------------------------

        return {
            message: "OTP verified successfully.",
            resetToken: generateResetToken(user.id)
        };

    }
    /**
 * Reset User Password
 */
public async resetPassword(
    userId: number,
    password: string,
    confirmPassword: string
): Promise<{ message: string }> {

    //----------------------------------------------------
    // Validate Passwords
    //----------------------------------------------------

    if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
    }

    //----------------------------------------------------
    // Find User
    //----------------------------------------------------

    const user = await User.findByPk(userId);

    if (!user) {
        throw new Error("User not found.");
    }

    //----------------------------------------------------
    // Hash Password
    //----------------------------------------------------

    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    //----------------------------------------------------
    // Update Password
    //----------------------------------------------------

    user.password = hashedPassword;

    await user.save();

    //----------------------------------------------------
    // Remove Used OTP Records
    //----------------------------------------------------

    await PasswordResetOtp.destroy({

        where: {

            userId

        }

    });

    //----------------------------------------------------
    // Success
    //----------------------------------------------------

    return {

        message: "Password reset successfully."

    };

}

}