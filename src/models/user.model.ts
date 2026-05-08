import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Faculty from "./faculty.model";
import Department from "./department.model";
import { UserRole } from "../types/user.types";

/**
 * Type definitions (optional but good practice)
 */
interface UserAttributes {
  id: number;
  registerId: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  facultyId?: number | null;
  departmentId?: number | null;
  mustChangePassword: boolean;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "phone" | "facultyId" | "departmentId"> {}

class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public registerId!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
  public phone?: string;
  public isActive!: boolean;
  public facultyId?: number | null;
  public departmentId?: number | null;
  public mustChangePassword!: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    registerId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    /**
     * 🔥 IMPORTANT FOR YOUR FEATURE
     */
    facultyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    /**
     * 🔐 Force user to change password after first login
     */
    mustChangePassword: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

export default User;