"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "eligible_students",
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },

        uploadId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "eligible_list_uploads",
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

        registerId: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        studentName: {
          type: Sequelize.STRING,
          allowNull: false,
        },

        batchYear: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        semester: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        accountNumber: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        branchCode: {
          type: Sequelize.STRING,
          allowNull: true,
        },

        amount: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true,
        },

        recommendation: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },

        isEligible: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
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

    await queryInterface.addIndex(
      "eligible_students",
      ["departmentId", "registerId"],
      {
        unique: true,
        name:
          "eligible_students_department_register_unique",
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable(
      "eligible_students"
    );
  },
};