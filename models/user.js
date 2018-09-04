'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    models.User.hasMany(models.ProjectMsg, {as: 'ProjMsgs', foreignKey: 'OwnerId'});
    models.User.hasMany(models.UserMsg, {as: 'UserMsgs', foreignKey: 'OwnerId'});
    models.User.hasMany(models.UserMsg, {as: 'Msgs', foreignKey: 'PlaceId'});
  };

  return User;
};