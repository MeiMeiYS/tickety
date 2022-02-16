'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      column_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Columns' },
      },
      content: {
        type: Sequelize.STRING(2200),
        allowNull: false,
      },
      task_index: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      color_code: {
        type: Sequelize.STRING(6),
      },
      creator_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users' },
      },
      edit_by_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Users' },
      },
      assign_to_id: {
        type: Sequelize.INTEGER,
        references: { model: 'Users' },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Tasks');
  }
};
