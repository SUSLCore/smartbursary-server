import { Router } from "express";

import { MonthlyDocumentController } from "../controllers/monthlyDocument.controller";

import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

import { monthlyDocumentUpload } from "../middlewares/monthlyDocumentUpload.middleware";

import { UserRole } from "../types/user.types";

const router = Router();

/*
|--------------------------------------------------------------------------
| Faculty MA - Initial Upload
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    protect,
    authorize(UserRole.FACULTY_MA),
    monthlyDocumentUpload.single("file"),
    MonthlyDocumentController.createMonthlyDocument
);

/*
|--------------------------------------------------------------------------
| Upload Signed Document
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Pending Documents
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Dashboard Statistics
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Document History
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Download Current Document
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| Get Single Document
|--------------------------------------------------------------------------
*/

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