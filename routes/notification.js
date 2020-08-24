
var express = require('express');
var router = express.Router();
var db = require("../db");

var sendNotification = function(data) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic NThlMjkzYzAtODExZi00Yzk4LWI2ZjItMzlmNzRjMTgxMjNj"
  };
  
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };
  
  var https = require('https');
  var req = https.request(options, function(res) {  
    res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });
  
  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });
  
  req.write(JSON.stringify(data));
  req.end();
};

var message = { 
  app_id: "85709f52-b07d-4e2b-8a75-6703178bb15a",
  contents: {"en": "English Message"},
  included_segments: ["All"]
};
/*
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let workQueue = new Queue('work', REDIS_URL);

router.post('/job', async (req, res) => {
  let job = await workQueue.add();
  res.json({ id: job.id });
});*/

var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

var date = new Date();
var current_day = days[date.getDay()];
var current_hour = date.getHours();
var current_minute = date.getMinutes();
const current_time = current_hour + ":" + current_minute;
//console.log(current_hour + ":" + current_minute);
//router.get('/', (req, res) => {
    db.programmodel.findOne({
      where : {
        //dayid : current_day,
        hour : current_time
      }
    }).then((data) => {
      console.log("dsadasdaad",data);
      res.json(data);
      //sendNotification(message);
    })
  //})
//sendNotification(message);
module.exports = router;
