const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const sassMiddleware = require('node-sass-middleware');
const browserify = require('browserify-middleware'); 
const mongoose = require('mongoose');
const dbConString = process.env.MONGODB_URI || 'mongodb://localhost:27017';
mongoose.connect(dbConString + '/todos');
const MongoStore = require('connect-mongo')(session);


const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');const loginAPI = require('./routes/login/api');
const userRouter = require('./routes/user');const userAPI = require('./routes/user/api');
const departementRouter = require('./routes/departement');const departementAPI = require('./routes/departement/api');
const todoRouter = require('./routes/todo/index');const todoAPI = require('./routes/todo/api');


const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use (
   	sassMiddleware({
		src: __dirname + '/sass',
		dest: __dirname + '/public',
		debug: true,
   	})
);

app.get('/javascripts/bundle.js', browserify('./client/script.js'));

if (app.get('env') == 'development') {
  var browserSync = require('browser-sync');
  var config = {
    files: ["public/**/*.{js,css}", "client/*.js", "sass/**/*.scss", "views/**/*.jade"],
    logLevel: 'debug',
    logSnippet: false,
    reloadDelay: 3000,
    reloadOnRestart: true
  };
  var bs = browserSync(config);
  app.use(require('connect-browser-sync')(bs));
}

app.use(session({
	secret: process.env.SESSION_SECRET_KEY,
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		ttl: 60 * 60 * 12// detik * menit * jam * hari * minggu
	})
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, 'public')));

app.use('/', loginRouter);

//app.use('/login', loginRouter);
app.use('/api/login', loginAPI);

app.use('/user', userRouter);
app.use('/api/user', userAPI);

app.use('/departement', departementRouter);
app.use('/api/departement', departementAPI);

app.use('/todo', todoRouter);
app.use('/api/todo', todoAPI);

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

module.exports = app;
