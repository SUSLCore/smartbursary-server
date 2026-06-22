'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'eligible_students',
      'batchId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'batches',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'eligible_students',
      'batchId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    );
  },
};