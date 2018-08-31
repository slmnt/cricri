'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      }
    },
    name: {
      type: DataTypes.STRING,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    desc: {
      type: DataTypes.STRING,
    },
    emailVerified: DataTypes.BOOLEAN,
    suspended: DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN,
    expire: DataTypes.DATE
  });

  User.associate = function(models) {
    //models.User.hasMany(models.Task);
  };

  return User;
};