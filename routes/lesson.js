var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var _ = require("underscore");

router.use(bodyParser.json());

var db = require("../db");

// GET listing. *
router.get('/', function(req, res, next) {
  db.lessonmodel.findAll().then(function(data){
    res.json(data);
  })
});

// POST adding. *
router.post('/', function(req, res, next) {

  let body = _.pick(req.body, "lesson");

  db.lessonmodel.findAll({
    where: {
        lesson: body.lesson
    }
}).then((result) => {
    // console.log("result", result)
    let dayFilter = result.map(x => x.dataValues)
    console.log("day filter", dayFilter)
    if(dayFilter.length != 0) {
        console.log("create edilemez")
        res.send("There is this data already...")
    } else {
        db.lessonmodel.create(body).then(function(result){
        res.json(result.toJSON());
        })
        //console.log("create edildi")
    }
})
});

// PUT updating. *
router.put('/:id', function(req, res, next) {
  let lesId = req.params.id;
  let body=_.pick(req.body, "lesson");
  let attributes = {};

  if(body.hasOwnProperty("lesson")){
      attributes.lesson = body.lesson;
  }

  db.lessonmodel.findOne({
      where : {
          id : lesId
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
  let lesId =req.params.id;
    db.lessonmodel.destroy({
        where : {
            id : lesId
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