import { Request, Response } from "express";
import { BatchService } from "../services/batch.service";

export class BatchController {

  static async createBatch(
    req: Request,
    res: Response
  ) {
    try {
      const batch = await BatchService.createBatch(
        req.body
      );

      return res.status(201).json({
        message: "Batch created successfully",
        batch,
      });

    } catch (error: any) {

      return res.status(400).json({
        message: error.message,
      });

    }
  }

  static async getAllBatches(
    req: Request,
    res: Response
  ) {
    try {

      const batches =
        await BatchService.getAllBatches();

      return res.status(200).json({
        batches,
      });

    } catch (error: any) {

      return res.status(500).json({
        message: error.message,
      });

    }
  }

  static async deleteBatch(
    req: Request,
    res: Response
  ) {
    try {
      const result = await BatchService.deleteBatch(
        Number(req.params.id)
      );

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(404).json({
        message: error.message,
      });
    }
  }


}