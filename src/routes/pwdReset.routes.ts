import { Router } from "express";
import { PwdResetController } from "../controllers/pwdReset.controller";
import { verifyResetPasswordToken }
from "../middlewares/verifyResetToken.middleware";

const router = Router();

const pwdResetController = new PwdResetController();


router.post(
    "/forgot-password",
    pwdResetController.forgotPassword
);

router.post(
    "/verify-otp",
    pwdResetController.verifyOtp
);
router.post(

    "/reset-password",

    verifyResetPasswordToken,

    pwdResetController.resetPassword

);

export default router;