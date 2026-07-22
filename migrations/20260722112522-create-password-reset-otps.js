"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("password_reset_otps", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users", // <-- your users table name
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },

      otpHash: {
        type: Sequelize.STRING,
        allowNull: false
      },

      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false
      },

      attempts: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      isUsed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("password_reset_otps");
  }
};