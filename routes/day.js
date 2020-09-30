var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var _ = require("underscore");
const checkAuth = require('../middleware/checkauth');

router.use(bodyParser.json());

var db = require("../db");

// GET listing. *
router.get('/',checkAuth, function(req, res, next) {
  db.daymodel.findAll().then(function(data){
    res.json(data);
  })
  
});

// POST adding. *
router.post('/',checkAuth, function(req, res, next) {

    let body = _.pick(req.body, "day");
    db.daymodel.findAll({
        where: {
            day: body.day
        }
    }).then((result) => {
        let dayFilter = result.map(x => x.dataValues)
        if(dayFilter.length != 0) {
            res.send({
                status : "Error",
                error : "Bu gün zaten mevcuttur..."
            })
        } else {
            db.daymodel.create(body).then(function(result){
            res.json(result.toJSON());
            })
        }
    })
});

// PUT updating. *
router.put('/:id',checkAuth, function(req, res, next) {
  let dayId = req.params.id;
  let body=_.pick(req.body, "day");
  let attributes = {};

  if(body.hasOwnProperty("day")){
      attributes.day = body.day;
  }

  db.daymodel.findOne({
      where : {
          id : dayId
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
router.delete('/:id',checkAuth, function(req, res, next) {
  let dayId =req.params.id;
    db.daymodel.destroy({
        where : {
            id : dayId
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