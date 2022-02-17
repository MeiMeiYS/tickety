'use strict';
const { Model, Validator } = require('sequelize');
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toSafeObject() {
      const { id, username, email } = this; // context will be the User instance
      return { id, username, email };
    }
    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }
    static getCurrentUserById(id) {
      return User.scope("currentUser").findByPk(id);
    }
    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential,
          },
        },
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }
    static async signup({ username, email, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        email,
        username,
        name,
        hashedPassword,
      });
      return await User.scope('currentUser').findByPk(user.id);
    };
    static associate(models) {
      // define association here
      User.hasMany(models.Project, { foreignKey: 'owner_id' });
      User.hasMany(models.Task, { foreignKey: 'creator_id' });
      User.hasMany(models.Task, { foreignKey: 'edit_by_id' });
      User.hasMany(models.Task, { foreignKey: 'assign_to_id' });

      const memberMapping = {
        through: 'Member',
        otherKey: 'project_id',
        foreignKey: 'user_id'
      }
      User.belongsToMany(models.Project, memberMapping);

      const inviteMapping = {
        through: 'Invite',
        otherKey: 'project_id',
        foreignKey: 'recipient_id'
      }
      User.belongsToMany(models.Project, inviteMapping);

      User.hasMany(models.Notification, {foreignKey: 'recipient_id'});
    }
  };
  User.init(
    {
      username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          },
        },
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [2, 100],
        },
      },
      email: {
        type: DataTypes.STRING(320),
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 320],
        },
      },
      title: {
        type: DataTypes.STRING(100),
        validate: {
          len: [1, 100],
        },
      },
      avatar_url: {
        type: DataTypes.STRING(600),
        validate: {
          len: [6, 600]
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60],
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"],
        },
      },
      scopes: {
        currentUser: {
          attributes: { exclude: ["hashedPassword"] },
        },
        loginUser: {
          attributes: {},
        },
      },
    }
  );
  return User;
};
