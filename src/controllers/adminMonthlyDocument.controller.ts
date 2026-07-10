import { Request, Response } from "express";
import { AdminMonthlyDocumentService } from "../services/adminMonthlyDocument.service";

export class AdminMonthlyDocumentController {

  
    static async getAllMonthlyDocuments(
        req: Request,
        res: Response
    ) {
        try {

            const documents =
                await AdminMonthlyDocumentService.getAllMonthlyDocuments();

            return res.status(200).json({
                success: true,
                data: documents,
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }
    }

    static async deleteMonthlyDocument(
        req: Request,
        res: Response
    ) {
        try {

            const result =
                await AdminMonthlyDocumentService.deleteMonthlyDocument(
                    Number(req.params.id)
                );

            return res.status(200).json(result);

        } catch (error: any) {

            return res.status(400).json({
                success: false,
                message: error.message,
            });

        }
    }

}