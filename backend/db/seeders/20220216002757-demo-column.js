'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Columns', [
      {
        project_id: 1,
        kanban_id: 1,
        name: 'To do',
        column_index: 0,
      },
      {
        project_id: 1,
        kanban_id: 1,
        name: 'In progress',
        column_index: 1,
      },
      {
        project_id: 1,
        kanban_id: 1,
        name: 'Done',
        column_index: 2,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Columns', null, {});
  }
};
