const { DataTypes } = require("sequelize");

module.exports = function(db){
  return db.define('sequelizeUser', {
        firstName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        lastName:{
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false
      },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
      }, {
        freezeTableName: true
      })
}