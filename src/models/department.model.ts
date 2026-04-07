import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Faculty from "./faculty.model";

class Department extends Model {}

Department.init(
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
  },
  {
    sequelize,
    modelName: "Department",
  }
);

Faculty.hasMany(Department);
Department.belongsTo(Faculty);

export default Department;