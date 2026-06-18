import { Router } from "express";

import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

import { UserRole } from "../types/user.types";

import { BatchController } from "../controllers/batch.controller";

const router = Router();

router.post(
  "/",
  protect,
  authorize(UserRole.ADMIN),
  BatchController.createBatch
);

router.get(
  "/",
  protect,
  BatchController.getAllBatches
);

router.delete(
  "/:id",
  protect,
  authorize(UserRole.ADMIN),
  BatchController.deleteBatch
);


export default router;