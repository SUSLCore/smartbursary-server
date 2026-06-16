import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import Faculty from "./faculty.model";
import Department from "./department.model";
import { UserRole } from "../types/user.types";

interface UserAttributes {
  id: number;
  registerId: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;

  isActive: boolean;
  mustChangePassword: boolean;

  facultyId?: number | null;
  departmentId?: number | null;

  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | "id"
    | "phone"
    | "facultyId"
    | "departmentId"
    | "createdAt"
    | "updatedAt"
  > {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public registerId!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
  public phone?: string;

  public isActive!: boolean;
  public mustChangePassword!: boolean;

  public facultyId?: number | null;
  public departmentId?: number | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
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
      allowNull: false,
      unique: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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

    mustChangePassword: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    facultyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Faculty,
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },

    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Department,
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

export default User;