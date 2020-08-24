var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.json());
var _ = require("underscore");
var sequelize = require("sequelize");
var db = require("../db");
const { query } = require('express');

var q = "SELECT program.id, program.userid, lesson.lesson, day.day, program.absent, program.hour from absent.program INNER JOIN absent.day ON program.dayid = day.id INNER JOIN absent.lesson ON program.lessonid = lesson.id";

router.get('/', function(req, res, next){
    db.sequelize.query(q, { type: db.sequelize.QueryTypes.SELECT }).then((data) => {
     
        res.json(data);    
    console.log(data);
    })
  
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    var query_userid = "SELECT program.id, program.userid, lesson.lesson, day.day, program.absent, program.hour from absent.program INNER JOIN absent.day ON program.dayid = day.id INNER JOIN absent.lesson ON program.lessonid = lesson.id WHERE userid = " + id;

    db.sequelize.query(query_userid, { type: db.sequelize.QueryTypes.SELECT }).then((data) => {
      res.json(data);
    })
  })

/*
router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.programmodel.findOne({
        where : {
            userid : id
        }
    }).then((data) => {
        res.json(data.toJSON());  
    })
})*/
// POST adding. *
router.post('/', function(req, res, next) {

  let body = _.pick(req.body, "userid","lessonid","dayid","absent","hour");
  console.log(body);

  db.programmodel.create(body).then(function(data){ 
    res.json(data.toJSON());
  })
});

// PUT updating. *
router.put('/:id', function(req, res, next) {
  let programId = req.params.id;
  let body=_.pick(req.body, "userid","lessonid","dayid","absent","hour");
  let attributes = {};

  if(body.hasOwnProperty("userid")){
    attributes.userid = body.userid;
}
  if(body.hasOwnProperty("lessonid")){
      attributes.lessonid = body.lessonid;
  }
  if(body.hasOwnProperty("dayid")){
    attributes.dayid = body.dayid;
}
if(body.hasOwnProperty("absent")){
    attributes.absent = body.absent;
}
if(body.hasOwnProperty("hour")){
    attributes.hour = body.hour;
}

  db.programmodel.findOne({
      where : {
          id : programId
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

// DELETE removing. *
router.delete('/:id', function(req, res, next) {
  let programId =req.params.id;
    db.programmodel.destroy({
        where : {
            id : programId
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