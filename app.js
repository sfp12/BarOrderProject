var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser')('bar');
var MongoStore = require('connect-mongo')(session);
var routes = require('./routes/index');
var users = require('./routes/users');
var util = require('util');

var app = express();

app.use(cookieParser);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret:'bar',
  cookie: { maxAge: 1000*60*60 },
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({   
         host: 'localhost',    
         port: 27017,          
         db: 'bar'        
     })
}));

app.use(function(req, res, next) {
  if (req.cookies['mock_user']) {
    var mockUser = JSON.parse(req.cookies['mock_user']);    
    req.session.uid = mockUser.user_id;
    req.session.code = 1234;
    return next();
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/users', users);



// 捕获404错误，并交给错误处理器
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 上线的时候，这样设置
// app.set('env', 'production');

// 开发模式下的错误处理
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// 生产模式下的错误处理
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
