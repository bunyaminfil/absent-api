var Sequelize = require("sequelize");
var sequelize = new Sequelize("heroku_c466fd1db9544c3","be06271288a76c","85bc7929", {
    host : 'us-cdbr-east-02.cleardb.com',
    dialect : 'mysql'
});

var db = {};

db.daymodel = require(__dirname + "/models/day_model.js")(sequelize, Sequelize);
db.lessonmodel = require(__dirname + "/models/lesson_model.js")(sequelize, Sequelize);
db.programmodel = require(__dirname + "/models/program_model.js")(sequelize, Sequelize);
db.usermodel = require(__dirname + "/models/user_model.js")(sequelize, Sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;