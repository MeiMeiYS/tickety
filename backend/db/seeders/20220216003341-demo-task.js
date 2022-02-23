'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tasks', [
      {
        project_id: 1,
        kanban_id: 1,
        column_id: 1,
        content: '🎉 Welcome to Tickety 🎉 \n We\'re so excited that you\'ve decided to create a new project! You can create, edit, and delete tasks or columns here. You can also drag and drop me to any column you like.',
        task_index: 0,
        color_code: '55a9e0',
        creator_id: 1,
      },
      {
        project_id: 1,
        kanban_id: 1,
        column_id: 1,
        content: 'Demo task',
        task_index: 1,
        creator_id: 1,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tasks', null, {});
  }
};
