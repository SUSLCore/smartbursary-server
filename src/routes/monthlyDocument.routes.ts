import { Router } from "express";

import { MonthlyDocumentController } from "../controllers/monthlyDocument.controller";

import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

import { monthlyDocumentUpload } from "../middlewares/monthlyDocumentUpload.middleware";

import { UserRole } from "../types/user.types";

const router = Router();


router.post(
    "/",
    protect,
    authorize(UserRole.FACULTY_MA),
    monthlyDocumentUpload.single("file"),
    MonthlyDocumentController.createMonthlyDocument
);

router.put(
    "/:id/sign",
    protect,
    authorize(
        UserRole.STUDENT_SERVICE_SAR,
        UserRole.FACULTY_AR,
        UserRole.DEPARTMENT_HEAD,
        UserRole.DEPARTMENT_MA
    ),
    monthlyDocumentUpload.single("file"),
    MonthlyDocumentController.uploadSignedDocument
);

router.get(
    "/my-uploads",
    protect,
    authorize(
        UserRole.FACULTY_MA,
        UserRole.STUDENT_SERVICE_SAR,
        UserRole.FACULTY_AR,
        UserRole.DEPARTMENT_HEAD,
        UserRole.DEPARTMENT_MA
    ),
    MonthlyDocumentController.getMyUploads
);

router.put(
    "/:id/replace",
    protect,
    authorize(
        UserRole.FACULTY_MA,
        UserRole.STUDENT_SERVICE_SAR,
        UserRole.FACULTY_AR,
        UserRole.DEPARTMENT_HEAD,
        UserRole.DEPARTMENT_MA
    ),
    monthlyDocumentUpload.single("file"),
    MonthlyDocumentController.replaceUploadedDocument
);

router.put(
    "/:id/reject",
    protect,
    authorize(
        UserRole.FACULTY_AR,
        UserRole.STUDENT_SERVICE_SAR,
        UserRole.DEPARTMENT_HEAD,
        UserRole.DEPARTMENT_MA
    ),
    MonthlyDocumentController.returnDocument
);

router.get(
    "/pending",
    protect,
    authorize(
        UserRole.STUDENT_SERVICE_SAR,
        UserRole.FACULTY_AR,
        UserRole.FACULTY_MA,
        UserRole.DEPARTMENT_HEAD,
        UserRole.DEPARTMENT_MA
    ),
    MonthlyDocumentController.getPendingDocuments
);

router.get(
    "/statistics",
    protect,
    authorize(
        UserRole.ADMIN,
        UserRole.STUDENT_SERVICE_SAR,
        UserRole.FACULTY_AR,
        UserRole.FACULTY_MA,
        UserRole.DEPARTMENT_HEAD,
        UserRole.DEPARTMENT_MA
    ),
    MonthlyDocumentController.getStatistics
);

router.get(
    "/:id/history",
    protect,
    authorize(
        UserRole.ADMIN,
        UserRole.STUDENT_SERVICE_SAR,
        UserRole.FACULTY_AR,
        UserRole.FACULTY_MA,
        UserRole.DEPARTMENT_HEAD,
        UserRole.DEPARTMENT_MA
    ),
    MonthlyDocumentController.getHistory
);

router.get(
    "/:id/download",
    protect,
    authorize(
        UserRole.ADMIN,
        UserRole.STUDENT_SERVICE_SAR,
        UserRole.FACULTY_AR,
        UserRole.FACULTY_MA,
        UserRole.DEPARTMENT_HEAD,
        UserRole.DEPARTMENT_MA
    ),
    MonthlyDocumentController.downloadCurrentDocument
);

router.get(
    "/:id",
    protect,
    authorize(
        UserRole.ADMIN,
        UserRole.STUDENT_SERVICE_SAR,
        UserRole.FACULTY_AR,
        UserRole.FACULTY_MA,
        UserRole.DEPARTMENT_HEAD,
        UserRole.DEPARTMENT_MA
    ),
    MonthlyDocumentController.getDocument
);

export default router;