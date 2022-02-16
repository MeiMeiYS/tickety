'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Member.init({
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Projects',
        key: 'id'
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
    },
  }, {
    sequelize,
    modelName: 'Member',
  });
  return Member;
};
