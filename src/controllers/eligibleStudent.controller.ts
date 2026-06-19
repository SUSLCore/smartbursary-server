import { Request, Response, NextFunction } from "express";
import eligibleStudentService from "../services/eligibleStudent.service";

interface AuthRequest extends Request {
    user?: any;
}

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

            const result =
                await eligibleStudentService.uploadEligibleStudents({
                    batchId: Number(req.body.batchId),
                    facultyId: Number(req.body.facultyId),
                    departmentId: Number(req.body.departmentId),
                    uploadedBy: req.user.id,
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