'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Columns', [
      {
        kanban_id: 1,
        name: 'Demo Column1',
        column_index: 0,
      },
      {
        kanban_id: 1,
        name: 'Demo Column2',
        column_index: 1,
      },
      {
        kanban_id: 1,
        name: 'Demo Column3',
        column_index: 2,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Columns', null, {});
  }
};
