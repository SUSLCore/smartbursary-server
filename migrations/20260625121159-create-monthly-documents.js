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
    await queryInterface.createTable("monthly_documents", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      batchId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "batches",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      departmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "departments",
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

      month: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      originalFile: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      currentFile: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      currentStep: {
        type: Sequelize.ENUM(...DOCUMENT_STEPS),
        allowNull: false,
        defaultValue: "SAR_APPROVAL",
      },

      status: {
        type: Sequelize.ENUM("PENDING", "COMPLETED"),
        allowNull: false,
        defaultValue: "PENDING",
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
    await queryInterface.dropTable("monthly_documents");
  },
};