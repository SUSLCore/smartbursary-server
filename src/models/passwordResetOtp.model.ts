import {
    DataTypes,
    Model,
    Optional
} from "sequelize";

import sequelize from "../config/database";

interface PasswordResetOtpAttributes {
    id: number;
    userId: number;
    otpHash: string;
    expiresAt: Date;
    attempts: number;
    isUsed: boolean;
}

interface PasswordResetOtpCreation
    extends Optional<
        PasswordResetOtpAttributes,
        "id" | "attempts" | "isUsed"
    > {}

class PasswordResetOtp
    extends Model<
        PasswordResetOtpAttributes,
        PasswordResetOtpCreation
    >
    implements PasswordResetOtpAttributes
{
    public id!: number;

    public userId!: number;

    public otpHash!: string;

    public expiresAt!: Date;

    public attempts!: number;

    public isUsed!: boolean;
}

PasswordResetOtp.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        otpHash: {
            type: DataTypes.STRING,
            allowNull: false
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },

        attempts: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },

        isUsed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        sequelize,
        tableName: "password_reset_otps"
    }
);

export default PasswordResetOtp;