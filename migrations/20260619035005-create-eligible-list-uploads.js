"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "eligible_list_uploads",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
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

        facultyId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "faculties",
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

        fileName: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        totalStudents: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },

        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },

        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(
      "eligible_list_uploads"
    );
  },
};