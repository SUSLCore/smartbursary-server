import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Faculty extends Model {}

Faculty.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Faculty",
  }
);

export default Faculty;