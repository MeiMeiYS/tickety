'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.belongsTo(models.Column, { foreignKey: 'column_id' });
      Task.belongsTo(models.User, { foreignKey: 'creator_id' });
      Task.belongsTo(models.User, { foreignKey: 'edit_by_id' });
      Task.belongsTo(models.User, { foreignKey: 'assign_to_id' });
    }
  };
  Task.init({
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Projects',
        key: 'id'
      },
    },
    kanban_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Kanbans',
        key: 'id'
      },
    },
    column_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Columns',
        key: 'id'
      },
    },
    content: {
      type: DataTypes.STRING(2200),
      allowNull: false,
      validate: {
        len: [1, 2200],
      },
    },
    task_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    color_code: {
      type: DataTypes.STRING(6),
      validate: {
        len: [6, 6],
      },
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
    },
    edit_by_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
    },
    assign_to_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
    },
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};
