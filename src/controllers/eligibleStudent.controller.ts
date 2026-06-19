import { Request, Response, NextFunction } from "express";
import eligibleStudentService from "../services/eligibleStudent.service";

interface AuthRequest extends Request {
    user?: any;
}

const toPositiveInteger = (value: unknown) => {
    if (Array.isArray(value)) {
        value = value[0];
    }

    const parsed = Number(value);

    return Number.isInteger(parsed) && parsed > 0
        ? parsed
        : null;
};

const normalizeKey = (key: string) =>
    key.toLowerCase().replace(/[^a-z0-9]/g, "");

const getBodyField = (body: any, key: string) => {
    if (!body || typeof body !== "object") {
        return undefined;
    }

    const normalizedTarget = normalizeKey(key);

    for (const [currentKey, value] of Object.entries(body)) {
        if (normalizeKey(currentKey) === normalizedTarget) {
            return value;
        }
    }

    return undefined;
};

const getBatchReference = (body: any): any =>
    getBodyField(body, "batchId") ??
    getBodyField(body, "batch") ??
    getBodyField(body, "batchName") ??
    getBodyField(body, "batch_name");

const getUserId = (user: any) => {
    if (!user) {
        return null;
    }

    const candidates = [
        user.id,
        user.userId,
        user.getDataValue?.("id"),
        user.toJSON?.()?.id,
    ];

    for (const candidate of candidates) {
        const parsed = toPositiveInteger(candidate);
        if (parsed) {
            return parsed;
        }
    }

    return null;
};

class EligibleStudentController {
    uploadEligibleStudents = async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Excel file is required",
                });
            }

            const batchRef = getBatchReference(req.body);
            const facultyId = toPositiveInteger(
                getBodyField(req.body, "facultyId")
            );
            const departmentId = toPositiveInteger(
                getBodyField(req.body, "departmentId")
            );
            const uploadedBy = getUserId(req.user);

            if (batchRef === undefined || batchRef === null || batchRef === "") {
                return res.status(400).json({
                    success: false,
                    message:
                        "batchId is required and must be a valid batch id or batch name",
                });
            }

            if (!facultyId) {
                return res.status(400).json({
                    success: false,
                    message: "facultyId is required and must be a valid number",
                });
            }

            if (!departmentId) {
                return res.status(400).json({
                    success: false,
                    message: "departmentId is required and must be a valid number",
                });
            }

            if (!uploadedBy) {
                return res.status(400).json({
                    success: false,
                    message:
                        "authenticated user is required and must have a valid id",
                });
            }

            const result =
                await eligibleStudentService.uploadEligibleStudents({
                    batchId: batchRef,
                    facultyId,
                    departmentId,
                    uploadedBy,
                    filePath: req.file.path,
                    fileName: req.file.originalname,
                });

            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    getDepartmentStudents = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const departmentId = Number(
                req.params.departmentId
            );

            const students =
                await eligibleStudentService.getDepartmentStudents(
                    departmentId
                );

            return res.status(200).json({
                success: true,
                count: students.length,
                data: students,
            });
        } catch (error) {
            next(error);
        }
    };

    checkEligibility = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { registerId } = req.params;

            if (typeof registerId !== "string") {
                throw new Error("Invalid registerId");
            }

            const result =
                await eligibleStudentService.checkEligibility(
                    registerId
                );

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    removeStudent = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const id = Number(req.params.id);

            const result =
                await eligibleStudentService.removeStudent(
                    id
                );

            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}

export default new EligibleStudentController();
