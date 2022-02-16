'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tasks', [
      {
        column_id: 1,
        content: 'Demo task 1',
        task_index: 0,
        color_code: '55a9e0',
        creator_id: 1,
      },
      {
        column_id: 1,
        content: 'Demo task 2',
        task_index: 1,
        creator_id: 1,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tasks', null, {});
  }
};
