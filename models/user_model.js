const { sequelize, Sequelize } = require("../db");

module.exports = (sequelize, Sequelize) => {
    return sequelize.define('users',{
        name : {
            type : Sequelize.STRING,
            allowNull: false
        },
        email : {
            type : Sequelize.STRING,
            allowNull: false
        },
        password : {
            type : Sequelize.STRING,
            allowNull: false
        },
        token : {
            type : Sequelize.STRING,
            allowNull : false,
            unique : true
        },
        phoneToken : {
            type : Sequelize.STRING,
            allowNull : false,
            unique : true
        }
    })
}