import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface BatchAttributes {
  id: number;
  name: string;
}

interface BatchCreationAttributes
  extends Optional<BatchAttributes, "id"> {}

class Batch
  extends Model<BatchAttributes, BatchCreationAttributes>
  implements BatchAttributes
{
  public id!: number;
  public name!: string;
}

Batch.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Batch",
    tableName: "batches",
    timestamps: true,
  }
);

export default Batch;