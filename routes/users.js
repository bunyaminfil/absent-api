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
const jwt = require('jsonwebtoken')
const checkAuth = require('../middleware/checkauth');

/* GET users listing. */
router.get('/', checkAuth, function(req, res, next) {
  db.usermodel.findAll().then((data) =>{
    res.json({
      status : "Success",
      data : data
    });
  })
});

router.post('/login',checkAuth, (req, res) => {
  const { email, password } = req.body;
  db.usermodel.findOne({
    where : {
      email: email,
      password: password
    }
  }).then((data) => {
    if(data){
    
      res.send({
        status : "success",
        data: data
      })
    }else{
      res.status(404).send({
        status : "Error",
        error : "Wrong Email or Password!!!"
      })
    }
  })
})

//Insert...
router.post('/', function(req,res){
  let body = _.pick(req.body, "name", "email", "password", "phoneToken");
let attributes = {};
attributes.name = body.name;
attributes.email = body.email;
attributes.password = body.password;
attributes.phoneToken = body.phoneToken;
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
      const token = jwt.sign({
        id: result.dataValues,
        email : body.email
      },
      'secret_key',
      {
        expiresIn : "2h"
      }
      )
      attributes.token = token;
      console.log(attributes);
      db.usermodel.create(attributes).then((result) => {
        res.json(result);
      })
    }
  })
})

//Update...
router.put('/:id',checkAuth, function(req, res, next) {
  let userID = req.params.id;
  let body=_.pick(req.body, "name","email","password", "token", "phoneToken");
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
if(body.hasOwnProperty("token")){
  attributes.token = body.token;
}
if(body.hasOwnProperty("phoneToken")){
  attributes.phoneToken = body.phoneToken;
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
router.delete('/:id',checkAuth, function(req, res, next) {
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
