module.exports = function(sequelize, Sequelize){
    return sequelize.define ('program', {
        userid : {
            type : Sequelize.STRING,
        },
        lessonid : {
            type : Sequelize.STRING,
        },
        dayid : {
            type : Sequelize.STRING,
        },
        absent : {
            type : Sequelize.STRING,
        },
        hour : {
            type : Sequelize.STRING,
        }
    },
    {
        freezeTableName: true
    });
}