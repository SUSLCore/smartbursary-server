"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      registerId: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      role: {
        type: Sequelize.ENUM(
          "ADMIN",
          "STUDENT_SERVICE_SAR",
          "FACULTY_AR",
          "FACULTY_MA",
          "DEPARTMENT_HEAD",
          "DEPARTMENT_MA",
          "STUDENT"
        ),
        allowNull: false,
      },

      phone: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      mustChangePassword: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      facultyId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "faculties",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      departmentId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "departments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");

    // MySQL ENUM cleanup (safe)
    try {
      await queryInterface.sequelize.query(
        "DROP TYPE IF EXISTS enum_users_role;"
      );
    } catch (error) {
      // Ignore for MySQL
    }
  },
};