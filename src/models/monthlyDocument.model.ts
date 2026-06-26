import {
  DataTypes,
  Model,
  Optional,
} from "sequelize";

import sequelize from "../config/database";
import { DocumentStep } from "../enums/DocumentStep";

interface MonthlyDocumentAttributes {
  id: number;

  batchId: number;

  departmentId: number;

  uploadedBy: number;

  month: number;

  year: number;

  originalFile: string;

  currentFile: string;

  currentStep: DocumentStep;

  status: "PENDING" | "COMPLETED";
}

interface MonthlyDocumentCreationAttributes
  extends Optional<
    MonthlyDocumentAttributes,
    "id" | "currentStep" | "status"
  > {}

class MonthlyDocument
  extends Model<
    MonthlyDocumentAttributes,
    MonthlyDocumentCreationAttributes
  >
  implements MonthlyDocumentAttributes
{
  public id!: number;

  public batchId!: number;

  public departmentId!: number;

  public uploadedBy!: number;

  public month!: number;

  public year!: number;

  public originalFile!: string;

  public currentFile!: string;

  public currentStep!: DocumentStep;

  public status!: "PENDING" | "COMPLETED";
}

MonthlyDocument.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    batchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    originalFile: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    currentFile: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    currentStep: {
      type: DataTypes.ENUM(...Object.values(DocumentStep)),
      defaultValue: DocumentStep.SAR_APPROVAL,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("PENDING", "COMPLETED"),
      defaultValue: "PENDING",
    },
  },

  {
    sequelize,
    tableName: "monthly_documents",
    modelName: "MonthlyDocument",
    timestamps: true,
  }
);

export default MonthlyDocument;