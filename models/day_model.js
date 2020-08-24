module.exports = function(sequelize, Sequelize){
    return sequelize.define ('day', {
        day : {
            type : Sequelize.STRING,
            allowNull: false
        }
    },
    {
        freezeTableName: true
    });
}