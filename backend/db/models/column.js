'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Column extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Column.belongsTo(models.Kanban, { foreignKey: 'kanban_id' });
      Column.hasMany(models.Task, { foreignKey: 'column_id' });
    }

  };
  Column.init({
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [3, 100],
      },
    },
    column_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Column',
  });
  return Column;
};
