'use strict';
module.exports = (sequelize, DataTypes) => {
  var Project = sequelize.define('Project', {
    name: {
      type: DataTypes.STRING,
    },
    shortDesc: {
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
    models.Project.belongsTo(models.User, {as: 'Owner'});
    models.Project.belongsToMany(models.User, {as: 'Members', through: 'UserProject'});
    models.Project.asMany(models.ProjectMsg, {as: 'Msg'});
  };

  return Project;
};
