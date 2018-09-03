'use strict';
module.exports = (sequelize, DataTypes) => {
  var ProjectMsg = sequelize.define('ProjectMsg', {
    message: {
      type: DataTypes.STRING,
    },
    deleted: DataTypes.BOOLEAN
  });

  ProjectMsg.associate = function(models) {
    models.ProjectMsg.belongsTo(models.User, {as: 'Owner'});
    models.ProjectMsg.belongsTo(models.Project, {as: 'Place'});
  };

  return ProjectMsg;
};