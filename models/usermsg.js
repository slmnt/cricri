'use strict';
module.exports = (sequelize, DataTypes) => {
  var UserMsg = sequelize.define('UserMsg', {
    message: {
      type: DataTypes.STRING,
    },
    deleted: DataTypes.BOOLEAN
  });

  UserMsg.associate = function(models) {
    models.UserMsg.belongsTo(models.User, {as: 'Owner'});
    models.UserMsg.belongsTo(models.User, {as: 'Place'});
  };

  return UserMsg;
};