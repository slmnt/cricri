'use strict';
module.exports = (sequelize, DataTypes) => {
  var Project = sequelize.define('Project', {
    name: {
      type: DataTypes.STRING,
    },
    desc: {
      type: DataTypes.STRING,
    },
    suspended: DataTypes.BOOLEAN,
    deleted: DataTypes.BOOLEAN,
    creationDate: DataTypes.DATE
  });

  Project.associate = function(models) {
    //models.Project.hasMany(models.Task);
  };

  return Project;
};