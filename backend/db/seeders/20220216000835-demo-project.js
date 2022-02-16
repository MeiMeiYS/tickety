'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Projects', [
      {
        owner_id: 1,
        name: 'Demo Project',
        description: 'This is a demo project.',
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Projects', null, {});
  }
};
