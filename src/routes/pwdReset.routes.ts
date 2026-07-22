import { Router } from "express";
import { PwdResetController } from "../controllers/pwdReset.controller";

const router = Router();

const pwdResetController = new PwdResetController();


router.post(
    "/forgot-password",
    pwdResetController.forgotPassword
);

export default router;