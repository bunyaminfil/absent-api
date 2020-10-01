var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cron = require('node-cron');
var logger = require('morgan');
var db = require('./db');
var cors = require('cors');
var FCM = require('fcm-node');
    var serverKey = 'AAAALi0mRzc:APA91bEBWOK5-4mtd5kMmwXXLYSd1L8VqeHli-N46tRJgNE98kJ2YsXC781x5G2xD0eBY0N4eCt6-XmPhIg7d2KYSIj2gGAYFxKPGPB7wLyX7vpOtju6naSs-haDZ6o3xiEVOb597aRd'; //put your server key here
    var fcm = new FCM(serverKey);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dayRouter = require('./routes/day');
var lessonRouter = require('./routes/lesson');
var programRouter = require('./routes/program');

const sequelize = require('./db');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/days', dayRouter);
app.use('/api/v1/lessons', lessonRouter);
app.use('/api/v1/programs', programRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
/*
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
};*/






/*
var message = { 
  app_id: "85709f52-b07d-4e2b-8a75-6703178bb15a",
  contents: {"en": "Wake up sleepy, Time to go :)"},
  included_segments: ["All"]
};
*/
var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  for(let i=0;i<7;i++){
  i=days[i];
  }
  


db.programmodel.findAll({
  attributes : ['dayid', 'hour','phoneToken']
}).then((data) => {
//console.log(data[3].dataValues.phoneToken);
  for(let i=0;i<data.length;i++){
   // console.log(data[i].dataValues.phoneToken,"data");

        let hour_value = data[i].dataValues.hour;
        let id_value = data[i].dataValues.dayid;
        let current_day = days[id_value]
        let chars = hour_value.split(':');

        let hour_cron = chars[0];
        let min_cron = chars[1];
            cron.schedule(`${min_cron} ${hour_cron} * * ${current_day}`, () => {
              var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                to: data[i].dataValues.phoneToken, 
                collapse_key: 'green',
                
                notification: {
                    title: 'Message', 
                    body: 'Wake up sleepy, Time to go :)' 
                }
              };
              fcm.send(message, function(err, response){
                if (err) {
                    console.log("Something has gone wrong!");
                } else {
                    console.log("Successfully sent with response: ", response);
                }
              });
              //console.log('Mesaj iletildi...');
              //sendNotification(message);             
            });   
  }
})

db.sequelize.sync({force : false}).then(function(){
  console.log("VT Bağlantısı başarılı.......");
})

module.exports = app;
