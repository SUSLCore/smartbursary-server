"use strict";

const DOCUMENT_STEPS = [
  "FACULTY_MA_UPLOAD",
  "SAR_APPROVAL",
  "FACULTY_AR_APPROVAL",
  "DEPARTMENT_HEAD_APPROVAL",
  "DEPARTMENT_MA_APPROVAL",
  "DEPARTMENT_HEAD_RETURN",
  "FACULTY_AR_RETURN",
  "SAR_RETURN",
  "FACULTY_MA_FINAL",
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("document_history", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      documentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "monthly_documents",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      uploadedBy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      step: {
        type: Sequelize.ENUM(...DOCUMENT_STEPS),
        allowNull: false,
      },

      filePath: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("document_history");
  },
};