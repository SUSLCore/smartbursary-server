import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";

import sequelize from "../config/database";
import { DocumentStep } from "../enums/DocumentStep";

interface DocumentHistoryAttributes {
  id: number;

  documentId: number;

  uploadedBy: number;

  step: DocumentStep;

  filePath: string;

  remarks?: string;
}

interface DocumentHistoryCreationAttributes
  extends Optional<DocumentHistoryAttributes, "id" | "remarks"> {}

class DocumentHistory
  extends Model<
    DocumentHistoryAttributes,
    DocumentHistoryCreationAttributes
  >
  implements DocumentHistoryAttributes
{
  public id!: number;

  public documentId!: number;

  public uploadedBy!: number;

  public step!: DocumentStep;

  public filePath!: string;

  public remarks?: string;
}

DocumentHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    documentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    step: {
      type: DataTypes.ENUM(...Object.values(DocumentStep)),
      allowNull: false,
    },

    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    remarks: {
      type: DataTypes.TEXT,
    },
  },

  {
    sequelize,
    tableName: "document_history",
    modelName: "DocumentHistory",
    timestamps: true,
  }
);

export default DocumentHistory;