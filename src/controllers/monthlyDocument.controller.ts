import { Request, Response } from "express";
import { AuthRequest } from "../types/authRequest";
import { MonthlyDocumentService } from "../services/monthlyDocument.service";
import { MonthlyDocumentExistsError } from "../errors/MonthlyDocumentExistsError";


export class MonthlyDocumentController {

    static async createMonthlyDocument(
        req: AuthRequest,
        res: Response
    ) {
        try {

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Please upload a document.",
                });
            }

            const document =
                await MonthlyDocumentService.createMonthlyDocument({

                    batchId: Number(req.body.batchId),

                    departmentId: Number(req.body.departmentId),

                    month: Number(req.body.month),

                    year: Number(req.body.year),

                    uploadedBy: req.user!.id,

                    file: req.file,

                });

            return res.status(201).json({

                success: true,

                message:
                    "Monthly document uploaded successfully.",

                data: document,

            });

        } catch (error: any) {

            if (error instanceof MonthlyDocumentExistsError) {

                return res.status(400).json({

                    success: false,

                    message: error.message,

                    documentId: error.documentId,

                    canDelete: error.canDelete,

                });

            }

            return res.status(400).json({

                success: false,

                message: error.message,

            });

        }
    }


    static async uploadSignedDocument(
        req: AuthRequest,
        res: Response
    ) {
        try {

            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    message: "Please upload a signed document.",

                });

            }

            const document =
                await MonthlyDocumentService.uploadSignedDocument({

                    documentId:
                        Number(req.params.id),

                    uploadedBy:
                        req.user!.id,

                    remarks:
                        req.body.remarks,

                    file:
                        req.file,

                });

            return res.json({

                success: true,

                message:
                    "Document uploaded successfully.",

                data: document,

            });

        } catch (error: any) {

            return res.status(400).json({

                success: false,

                message: error.message,

            });

        }
    }


    static async getPendingDocuments(
        req: AuthRequest,
        res: Response
    ) {
        try {

            const documents =
                await MonthlyDocumentService.getPendingDocuments(
                    req.user!.id
                );

            return res.json({

                success: true,

                data: documents,

            });

        } catch (error: any) {

            return res.status(400).json({

                success: false,

                message: error.message,

            });

        }
    }


    static async getDocument(
        req: Request,
        res: Response
    ) {
        try {

            const document =
                await MonthlyDocumentService.getDocumentById(

                    Number(req.params.id)

                );

            return res.json({

                success: true,

                data: document,

            });

        } catch (error: any) {

            return res.status(404).json({

                success: false,

                message: error.message,

            });

        }
    }


    static async getHistory(
        req: Request,
        res: Response
    ) {
        try {

            const history =
                await MonthlyDocumentService.getDocumentHistory(

                    Number(req.params.id)

                );

            return res.json({

                success: true,

                data: history,

            });

        } catch (error: any) {

            return res.status(404).json({

                success: false,

                message: error.message,

            });

        }
    }


    static async downloadCurrentDocument(
        req: Request,
        res: Response
    ) {
        try {

            const document =
                await MonthlyDocumentService.downloadCurrentDocument(

                    Number(req.params.id)

                );

            return res.download(

                document.path,

                document.fileName

            );

        } catch (error: any) {

            return res.status(404).json({

                success: false,

                message: error.message,

            });

        }
    }


    static async getStatistics(
        req: AuthRequest,
        res: Response
    ) {
        try {

            const statistics =
                await MonthlyDocumentService.getMonthlyDocumentStatistics(

                    req.user!.id

                );

            return res.json({

                success: true,

                data: statistics,

            });

        } catch (error: any) {

            return res.status(400).json({

                success: false,

                message: error.message,

            });

        }
    }


}