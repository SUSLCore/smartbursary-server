'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    const table = await queryInterface.describeTable(
      "eligible_students"
    );

    if (!table.batchId) {
      await queryInterface.addColumn(
        "eligible_students",
        "batchId",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        }
      );
    }

    try {
      await queryInterface.removeIndex(
        "eligible_students",
        "eligible_students_department_register_unique"
      );
    } catch (err) {
      console.log("Old index already removed");
    }

    try {
      await queryInterface.addIndex(
        "eligible_students",
        ["departmentId", "batchId", "registerId"],
        {
          unique: true,
          name:
            "eligible_students_department_batch_register_unique",
        }
      );
    } catch (err) {
      console.log("New index already exists");
    }
  },

  async down(queryInterface, Sequelize) {
    // rollback logic
  },
};