import { Transaction } from "sequelize";
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


export interface CreateMonthlyDocumentPayload {
    batchId: number;
    departmentId: number;
    uploadedBy: number;
    month: number;
    year: number;
    file: Express.Multer.File;
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

            /*
             * Validate Batch
             */
            const batch = await Batch.findByPk(batchId);

            if (!batch) {
                throw new Error("Batch not found.");
            }

            /*
             * Validate Department
             */
            const department = await Department.findByPk(departmentId);

            if (!department) {
                throw new Error("Department not found.");
            }

            /*
             * Validate User
             */
            const user = await User.findByPk(uploadedBy);

            if (!user) {
                throw new Error("User not found.");
            }

            /*
             * Prevent duplicate monthly upload
             */
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

            /*
             * Determine file extension
             */
            const extension = FileStorage.getExtension(file.originalname);

            /*
             * Generate workflow filename
             */
            const fileName = FileStorage.getWorkflowFileName(
                DocumentStep.FACULTY_MA_UPLOAD,
                extension
            );

            /*
             * Absolute storage path
             */
            absoluteFilePath = FileStorage.buildMonthlyFilePath(
                year,
                month,
                batchId,
                departmentId,
                fileName
            );

            /*
             * Relative path for database
             */
            const relativePath = FileStorage.buildRelativePath(
                year,
                month,
                batchId,
                departmentId,
                fileName
            );

            /*
             * Save uploaded file
             */
            await fs.writeFile(
                absoluteFilePath,
                file.buffer
            );

            /*
             * Determine first workflow step
             */
            const nextStep =
                DocumentWorkflow.getNextStep(
                    DocumentStep.FACULTY_MA_UPLOAD
                );

            if (!nextStep) {
                throw new Error("Workflow configuration error.");
            }

            /*
             * Create MonthlyDocument
             */
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















}