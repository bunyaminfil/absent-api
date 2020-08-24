var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
//var FCM = require('fcm-node');
var logger = require('morgan');
var db = require('./db');
/*
var serverKey = 'AAAAEDKIcO0:APA91bGV0Tt0ap0fWKh2HZ3ISbU_uF0H7ohklNzTyZmUDaLXmGEZBKN9yVhllZyf9eSNI-_mxk3l1w4tNnFezywxecPPOOY9d_QTEIttGG-dO6v4qSs8IInEIhxU8r_weglkx97Bws5-'; //put your server key here
var fcm = new FCM(serverKey);
var registrationToken = 'YOUR_REGISTRATION_TOKEN'; //token is here

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
*/

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dayRouter = require('./routes/day');
var lessonRouter = require('./routes/lesson');
var programRouter = require('./routes/program');
var notificationRouter = require('./routes/notification');
//var loginRouter = require('./routes/login');
const sequelize = require('./db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.set(db);
/*
app.get('/', function (req, res) {
  // Aboneler için mesaj hazırlanır
  var message = {
      to: registrationToken, //token is here
      
      notification: {
        title: 'Title of your push notification', 
        body: 'Body of your push notification' 
    },        
    data: {
      score: '850',
      time: '2:45'
    }
  };
  // Firebase Cloud Messaging üzerinden mesaj gönderilir
  fcm.send(message, function (err, response) {
      if (err) {
          console.log(err)
      } else {
          console.log("Mesaj başarılı bir şekilde gönderildi: ", response);
      }
  });
  res.sendStatus(200);
});
*/
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/days', dayRouter);
app.use('/lessons', lessonRouter);
app.use('/programs', programRouter);
app.use('/notification', notificationRouter);
//app.use('/login',loginRouter);

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

db.sequelize.sync({force : false}).then(function(){

  console.log("VT Bağlantısı başarılı.......");
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  for(let i=0;i<7;i++){
  days[i]=i;
  }
  days[0]=7;
  console.log(days[3],"gogogoggog");
  var date = new Date();
//console.log(db.sequelize.query("SELECT program.hour from program"));
var current_hour = date.getHours();
var current_day = days[date.getDay()];
var current_minute = ("0" + date.getMinutes()).slice(-2);
const current_time = current_hour + ":" + current_minute;
console.log("saat : " , current_hour, current_day);
console.log(current_minute);
console.log(current_time);
console.log(current_day,"saturday");

db.programmodel.findOne({
  where : {
    dayid : current_day,
    hour : current_time
  }
}).then((data) => {
  if(data){
    console.log("mesaj iletildi...",data.toJSON());
    
  }
  
  //res.json(data);
  //sendNotification(message);
})
})

module.exports = app;
