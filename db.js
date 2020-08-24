var Sequelize = require("sequelize");
var sequelize = new Sequelize("absent","root","3152", {
    host : 'localhost',
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