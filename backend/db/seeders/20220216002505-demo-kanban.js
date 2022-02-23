'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Kanbans', [
      {
        project_id: 1,
        name: 'Demo-Kanban',
        description: 'This is a demo kanban.',
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Kanbans', null, {});
  }
};
