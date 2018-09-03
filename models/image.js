'use strict';
module.exports = (sequelize, DataTypes) => {
  var Image = sequelize.define('Image', {
    filename: {
      type: DataTypes.STRING,
    }
  });

  Image.associate = function(models) {
  };

  return Image;
};