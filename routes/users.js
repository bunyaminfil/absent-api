var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.json());
var _ = require("underscore");
var sequelize = require("sequelize");
var db = require("../db");
const { query } = require('express');
const { pick, result } = require('underscore');
const { route } = require('./program');

//var q = "SELECT program.userid, program.id, lesson.lesson, day.day, program.absent, program.hour" + 
//" from absent.program INNER JOIN absent.day ON program.dayid = day.id INNER JOIN" + 
//" absent.lesson ON program.lessonid = lesson.id INNER JOIN absent.users ON program.userid = users.id";
//var q  = "SELECT program.userid, program.lessonid, program.dayid,program.absent,"+
//"program.hour from program INNER JOIN users ON program.userid = users.id";

//var q = "SELECT program.userid, program.id, lesson.lesson, day.day, program.absent, program.hour" + 
//" from absent.program INNER JOIN absent.day ON program.dayid = day.id INNER JOIN" + 
//" absent.lesson ON program.lessonid = lesson.id INNER JOIN absent.users ON program.userid = users.id WHERE program.userid = users.id";

//var q = "SELECT program.absent from absent.program INNER JOIN absent.users WHERE program.userid = users.id";
//var x = "SELECT users.id, program.absent, program.hour from program, users WHERE users.id = program.userid";



/* GET users listing. */
router.get('/', function(req, res, next) {
  db.usermodel.findAll({
    
    
  }).then((data) =>{
    res.json(data);
  })
  //res.send('respond with a resource');
});

/*router.get('/:id', (req, res) => {
  db.sequelize.query(x, { type: db.sequelize.QueryTypes.SELECT }).then((data) => {
    res.json(data);
  })
})  */

router.get('/login', (req, res) => {
  const { email, password } = req.body;
 
  db.usermodel.findOne({
    where : {
      email: email,
      password: password
    }
  }).then((data) => {
    if(data){
      console.log("Success login...");
      res.json({
        status : "success",
        data : data
      });

      /*db.sequelize.query(q, { type: db.sequelize.QueryTypes.SELECT }).then((data) => {
        res.json(data);
      })
      db.usermodel.findOne({
        where : {
          userid = id
        }
      }).then((data) => {
        if(data){
         
        }
      })
     */
      

    }else{
      console.log("Wrong Email or Password!!!");
    }
  })
})

//Insert...
router.post('/', function(req,res){
  let body = _.pick(req.body, "name", "email", "password");

  db.usermodel.findAll({
    where: {
      email: body.email
    }
  }).then((result) =>{
    let userFilter = result.map(x => x.dataValues)
    console.log("userfilter:", userFilter);

    if(userFilter.length != 0){
        console.log("create edilemez")
        res.send("There is this data already...")
    }else{
      db.usermodel.create(body).then((result) => {
        res.json(result.toJSON());
      })
    }
  })
})

//Update...
router.put('/:id', function(req, res, next) {
  let userID = req.params.id;
  let body=_.pick(req.body, "name","email","password");
  let attributes = {};

  if(body.hasOwnProperty("name")){
      attributes.name = body.name;
  }
  if(body.hasOwnProperty("email")){
    attributes.email = body.email;
}
if(body.hasOwnProperty("password")){
    attributes.password = body.password;
}

  db.usermodel.findOne({
      where : {
          id : userID
      }
  }).then(function(data){
      if(data){

          data.update(attributes).then(function(data){
              res.json(data.toJSON());
          },function(){
              res.status(400).send();
          })

      }else {
          res.status(404).send({
              error : "Aradığınız id bulunamadı..."
          })
      }
  },function(){
      res.status(500).send();
  })
});

//Delete...
router.delete('/:id', function(req, res, next) {
  let userID =req.params.id;
    db.usermodel.destroy({
        where : {
            id : userID
        }
    }).then(function(rowDeleted){
        if(rowDeleted === 0){
            res.status(404).send({
                error : "Girmek istediğiniz id bulunamadı..."
            });
        }else {
            res.status(204).send();
        }
    }, function(){
        res.status(500).send();
    })
});

module.exports = router;
