import { Transaction, Op, WhereOptions } from "sequelize";
import sequelize from "../config/database";
import Batch from "../models/batch.model";
import Department from "../models/department.model";
import User from "../models/user.model";
import MonthlyDocument from "../models/monthlyDocument.model";
import DocumentHistory from "../models/documentHistory.model";
import { DocumentStep } from "../enums/DocumentStep";
import { DocumentWorkflow } from "../utils/documentWorkflow";
import { FileStorage } from "../utils/fileStorage";
import fs from "fs/promises";
import { UserRole } from "../types/user.types";

export interface CreateMonthlyDocumentPayload {
    batchId: number;
    departmentId: number;
    uploadedBy: number;
    month: number;
    year: number;
    file: Express.Multer.File;
}

export interface UploadSignedDocumentPayload {
    documentId: number;
    uploadedBy: number;
    file: Express.Multer.File;
    remarks?: string;
}

export class MonthlyDocumentService {

    private static async createHistory(
        transaction: Transaction,
        data: {
            documentId: number;
            uploadedBy: number;
            step: DocumentStep;
            filePath: string;
            remarks?: string;
        }
    ) {
        return await DocumentHistory.create(
            {
                documentId: data.documentId,
                uploadedBy: data.uploadedBy,
                step: data.step,
                filePath: data.filePath,
                remarks: data.remarks,
            },
            {
                transaction,
            }
        );
    }

    static async createMonthlyDocument(
        payload: CreateMonthlyDocumentPayload
    ) {
        const transaction = await sequelize.transaction();

        let absoluteFilePath: string | null = null;

        try {
            const {
                batchId,
                departmentId,
                uploadedBy,
                month,
                year,
                file,
            } = payload;

            const batch = await Batch.findByPk(batchId);

            if (!batch) {
                throw new Error("Batch not found.");
            }

            const department = await Department.findByPk(departmentId);

            if (!department) {
                throw new Error("Department not found.");
            }

            const user = await User.findByPk(uploadedBy);

            if (!user) {
                throw new Error("User not found.");
            }

            const existingDocument = await MonthlyDocument.findOne({
                where: {
                    batchId,
                    departmentId,
                    month,
                    year,
                },
            });

            if (existingDocument) {
                throw new Error(
                    "Monthly document already uploaded for this department."
                );
            }

            const extension = FileStorage.getExtension(file.originalname);

            const fileName = FileStorage.getWorkflowFileName(
                DocumentStep.FACULTY_MA_UPLOAD,
                extension
            );

            absoluteFilePath = FileStorage.buildMonthlyFilePath(
                year,
                month,
                batchId,
                departmentId,
                fileName
            );

            const relativePath = FileStorage.buildRelativePath(
                year,
                month,
                batchId,
                departmentId,
                fileName
            );

            await fs.writeFile(
                absoluteFilePath,
                file.buffer
            );

            const nextStep =
                DocumentWorkflow.getNextStep(
                    DocumentStep.FACULTY_MA_UPLOAD
                );

            if (!nextStep) {
                throw new Error("Workflow configuration error.");
            }

            const monthlyDocument =
                await MonthlyDocument.create(
                    {
                        batchId,
                        departmentId,
                        uploadedBy,

                        month,
                        year,

                        originalFile: relativePath,
                        currentFile: relativePath,

                        currentStep: nextStep,

                        status: "PENDING",
                    },
                    {
                        transaction,
                    }
                );

            await this.createHistory(
                transaction,
                {
                    documentId: monthlyDocument.id,

                    uploadedBy,

                    step: DocumentStep.FACULTY_MA_UPLOAD,

                    filePath: relativePath,

                    remarks: "Initial monthly document uploaded."
                }
            );

            await transaction.commit();

            const createdDocument = await MonthlyDocument.findByPk(
                monthlyDocument.id,
                {
                    include: [
                        {
                            model: Batch,
                        },
                        {
                            model: Department,
                        },
                        {
                            model: User,
                            attributes: [
                                "id",
                                "name",
                                "registerId",
                            ],
                        },
                    ],
                }
            );

            return createdDocument;

        } catch (error) {
            await transaction.rollback();

            if (absoluteFilePath) {
                FileStorage.deleteAbsoluteFile(absoluteFilePath);
            }

            throw error;
        }
    }

    static async getDocumentById(id: number) {
        const document = await MonthlyDocument.findByPk(id, {
            include: [
                {
                    model: Batch,
                },
                {
                    model: Department,
                },
                {
                    model: User,
                    attributes: ["id", "name", "registerId"],
                },
            ],
        });
        if (!document) {
            throw new Error("Monthly document not found.");
        }
        return document;
    }


    static async uploadSignedDocument(
        payload: UploadSignedDocumentPayload
    ) {

        const transaction = await sequelize.transaction();

        let absoluteFilePath: string | null = null;
        let transactionCommitted = false;


        try {

            const {

                documentId,
                uploadedBy,
                file,
                remarks
            } = payload;

            const user = await User.findByPk(
                uploadedBy,
                {
                    transaction
                }
            );

            if (!user) {
                throw new Error("User not found.");
            }

            const monthlyDocument =
                await MonthlyDocument.findByPk(
                    documentId,
                    {
                        transaction
                    }
                );

            if (!monthlyDocument) {
                throw new Error(
                    "Monthly document not found."
                );
            }

            if (
                !DocumentWorkflow.isValidStep(
                    monthlyDocument.currentStep
                )
            ) {
                throw new Error(
                    "Invalid workflow state."
                );
            }

            const extension =
                FileStorage.getExtension(
                    file.originalname
                );

            const fileName =
                FileStorage.getWorkflowFileName(
                    monthlyDocument.currentStep,
                    extension
                );

            absoluteFilePath =
                FileStorage.buildMonthlyFilePath(

                    monthlyDocument.year,

                    monthlyDocument.month,

                    monthlyDocument.batchId,

                    monthlyDocument.departmentId,

                    fileName

                );

            const relativePath =
                FileStorage.buildRelativePath(

                    monthlyDocument.year,

                    monthlyDocument.month,

                    monthlyDocument.batchId,

                    monthlyDocument.departmentId,

                    fileName

                );

            await fs.writeFile(
                absoluteFilePath,
                file.buffer
            );

            monthlyDocument.currentFile =
                relativePath;

            await this.createHistory(
                transaction,
                {
                    documentId: monthlyDocument.id,

                    uploadedBy,

                    step: monthlyDocument.currentStep,

                    filePath: relativePath,

                    remarks:
                        remarks ??
                        `${monthlyDocument.currentStep} completed.`,
                }
            );

            const nextStep =
                DocumentWorkflow.getNextStep(
                    monthlyDocument.currentStep
                );

            if (nextStep) {

                monthlyDocument.currentStep =
                    nextStep;

            } else {

                monthlyDocument.status =
                    "COMPLETED";

            }

            await monthlyDocument.save({
                transaction,
            });

            await transaction.commit();
            transactionCommitted = true;

            const updatedDocument =
                await MonthlyDocument.findByPk(
                    monthlyDocument.id,
                    {
                        include: [
                            {
                                model: Batch,
                            },
                            {
                                model: Department,
                            },
                            {
                                model: User,
                                attributes: [
                                    "id",
                                    "name",
                                    "registerId",
                                ],
                            },
                        ],
                    }
                );

            return updatedDocument;

        } catch (error) {

            if (!transactionCommitted) {
                await transaction.rollback();
            }

            if (absoluteFilePath) {
                FileStorage.deleteAbsoluteFile(absoluteFilePath);
            }

            throw error;
        }
    }


    static async getPendingDocuments(userId: number) {

        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error("User not found.");
        }

        const workflowSteps =
            DocumentWorkflow.getStepsByRole(
                user.role as UserRole
            );

        if (workflowSteps.length === 0) {
            return [];
        }

        const whereClause: WhereOptions = {

            currentStep: {
                [Op.in]: workflowSteps,
            },

            status: "PENDING",
        };

        if (
            user.role === UserRole.FACULTY_AR ||
            user.role === UserRole.FACULTY_MA
        ) {

            Object.assign(whereClause, {

                "$Department.facultyId$":
                    user.facultyId,

            });

        }

        if (
            user.role === UserRole.DEPARTMENT_HEAD ||
            user.role === UserRole.DEPARTMENT_MA
        ) {

            Object.assign(whereClause, {

                departmentId:
                    user.departmentId,

            });

        }

        const documents =
            await MonthlyDocument.findAll({

                where: whereClause,

                include: [

                    {
                        model: Batch,
                        attributes: [
                            "id",
                            "name",
                        ],
                    },

                    {
                        model: Department,
                        attributes: [
                            "id",
                            "name",
                            "facultyId",
                        ],
                    },

                    {
                        model: User,
                        attributes: [
                            "id",
                            "name",
                            "registerId",
                        ],
                    },

                ],

                order: [

                    ["year", "DESC"],

                    ["month", "DESC"],

                    ["createdAt", "DESC"],

                ],

            });

        return documents;
    }




}