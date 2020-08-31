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

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.usermodel.findAll().then((data) =>{
    res.json(data);
  })
});

router.get('/login', (req, res) => {
  const { email, password } = req.body;
 
  db.usermodel.findOne({
    where : {
      email: email,
      password: password
    }
  }).then((data) => {
    if(data){
      res.json({
        status : "Success",
        data : data
      });
    }else{
      res.send({
        status : "Error",
        error : "Wrong Email or Password!!!"
      })
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
    if(userFilter.length != 0){
      res.send({
        status : "Error",
        error : "BU email zaten kullanılmıştır..."
      })
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
