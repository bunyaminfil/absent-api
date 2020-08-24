module.exports = function(sequelize, Sequelize){
    return sequelize.define ('lesson', {
        lesson : {
            type : Sequelize.STRING,
            unique : true
        }
    },
    {
        freezeTableName: true
    });
}