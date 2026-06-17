import Batch from "../models/batch.model";

export class BatchService {

  static async createBatch(data: {
    name: string;
  }) {
    const existingBatch = await Batch.findOne({
      where: {
        name: data.name,
      },
    });

    if (existingBatch) {
      throw new Error("Batch already exists");
    }

    return await Batch.create(data);
  }

  static async getAllBatches() {
    return await Batch.findAll({
      order: [["name", "DESC"]],
    });

  }

  static async deleteBatch(id: number) {
    const batch = await Batch.findByPk(id);

    if (!batch) {
      throw new Error("Batch not found");
    }

    await batch.destroy();

    return {
      message: "Batch deleted successfully",
    };
  }
  
}