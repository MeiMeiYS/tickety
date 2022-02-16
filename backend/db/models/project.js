'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.belongsTo(models.User, { foreignKey: 'owner_id' });
      Project.hasMany(models.Kanban, { foreignKey: 'project_id' });

      const memberMapping = {
        through: 'Member',
        otherKey: 'user_id',
        foreignKey: 'project_id'
      }
      Project.belongsToMany(models.User, memberMapping);

      const inviteMapping = {
        through: 'Invite',
        otherKey: 'recipient_id',
        foreignKey: 'project_id'
      }
      Project.belongsToMany(models.User, inviteMapping);

    }
  };
  Project.init({
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
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
    modelName: 'Project',
  });
  return Project;
};
