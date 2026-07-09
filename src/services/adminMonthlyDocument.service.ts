import sequelize from "../config/database";

import Batch from "../models/batch.model";
import Department from "../models/department.model";
import User from "../models/user.model";

import MonthlyDocument from "../models/monthlyDocument.model";
import DocumentHistory from "../models/documentHistory.model";

import { FileStorage } from "../utils/fileStorage";

export class AdminMonthlyDocumentService {

    static async getAllMonthlyDocuments() {

        const documents =
            await MonthlyDocument.findAll({

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

                order: [

                    ["createdAt", "DESC"],

                ],

            });

        return documents;

    }


    static async deleteMonthlyDocument(
        documentId: number
    ) {

        const transaction =
            await sequelize.transaction();

        let transactionCommitted = false;

        try {

            const monthlyDocument =
                await MonthlyDocument.findByPk(
                    documentId,
                    {
                        transaction,
                    }
                );

            if (!monthlyDocument) {

                throw new Error(
                    "Monthly document not found."
                );

            }

            const history =
                await DocumentHistory.findAll({

                    where: {
                        documentId,
                    },

                    transaction,

                });

            await DocumentHistory.destroy({

                where: {
                    documentId,
                },

                transaction,

            });

            await monthlyDocument.destroy({

                transaction,

            });

            await transaction.commit();

            transactionCommitted = true;

            const deletedFiles =
                new Set<string>();

            for (const item of history) {

                if (
                    item.filePath &&
                    !deletedFiles.has(item.filePath)
                ) {

                    FileStorage.deleteFile(
                        item.filePath
                    );

                    deletedFiles.add(
                        item.filePath
                    );

                }

            }

            return {

                success: true,

                message:
                    "Monthly document deleted successfully.",

            };

        } catch (error) {

            if (!transactionCommitted) {

                await transaction.rollback();

            }

            throw error;

        }

    }


}

