var Sequelize = require("sequelize");
var sequelize = new Sequelize("heroku_e1d32c9a8dd4884","b00255a902b740","6cc82cd7", {
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