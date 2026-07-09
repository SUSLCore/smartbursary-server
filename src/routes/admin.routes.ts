import express from "express";
import { AdminController } from "../controllers/admin.controller";
import { AdminMonthlyDocumentController } from "../controllers/adminMonthlyDocument.controller";
import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { UserRole } from "../types/user.types";

const router = express.Router();

router.get(
  "/users/:registerId",
  protect,
  authorize(UserRole.ADMIN),
  AdminController.getUserByRegisterId
);

router.delete(
  "/users/:registerId",
  protect,
  authorize(UserRole.ADMIN),
  AdminController.deleteUserByRegisterId
);

router.get(
    "/monthly-documents",
    protect,
    authorize(UserRole.ADMIN),
    AdminMonthlyDocumentController.getAllMonthlyDocuments
);


router.delete(
    "/monthly-documents/:id",
    protect,
    authorize(UserRole.ADMIN),
    AdminMonthlyDocumentController.deleteMonthlyDocument
);

export default router;