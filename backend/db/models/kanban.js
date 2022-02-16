'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kanban extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Kanban.belongsTo(models.Project, { foreignKey: 'project_id' });
      Kanban.hasMany(models.Column, { foreignKey: 'kanban_id' });
    }
  };
  Kanban.init({
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Projects',
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
    description: {
      type: DataTypes.STRING(2200),
      validate: {
        len: [1, 2200],
      },
    },
    archive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'Kanban',
  });
  return Kanban;
};
