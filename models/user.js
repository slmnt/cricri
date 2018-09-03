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
    shortDesc: {
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
    models.User.belongsTo(models.Image, {as: 'Avatar'});
    models.User.belongsToMany(models.Project, {as: 'Projects', through: 'UserProject'});
    models.User.hasMany(models.ProjectMsg, {as: 'Msg'});
  };

  return User;
};