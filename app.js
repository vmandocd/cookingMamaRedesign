/*
 * Module dependencies.
 */
 var express = require('express');
 var morgan = require('morgan');
 var mongoose = require('mongoose');
 var http = require('http');

 /*reading the data */
 var bodyParser = require('body-parser');
 /*templating system*/
 var ejs = require('ejs');
 var engine = require('ejs-mate');
 var session = require('express-session');
 /*expressjs uses a cookie to store a session id,
  *uses the value of the cookie to retrieve session
  *information stored on the server
 */
 var cookieParser = require('cookie-parser');
 var flash = require('express-flash');
 //requires the session to work
 var MongoStore = require('connect-mongo/es5')(session);
 var passport = require('passport');
 var secret = require('./config/secret');
 //from the user schema profile
 var User = require('./models/user');
 //var passportConf = require('..config/passport');
 var Category = require('./models/category');
 var app = express();

/***********Local setup************************/
// mongoose.connect(secret.database, function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("Connected to the MongoDB");
//   }
// });
/***********Local setup************************/

 /*****Heroku Setup********/
  mongoose.connect(process.env.MONGOLAB_URI);
  var port = process.env.PORT;
  var server = http.createServer(app);
  /*****Heroku Setup********/


 //this tells express that the public folder is for the static files
 app.use(express.static(__dirname + '/public'));

 //middleware
 app.use(morgan('dev'));

 //express application can parse json data format
 app.use(bodyParser.json());

 //express can parse x-www-form-urlencoded url encoded...
 app.use(bodyParser.urlencoded({extended: true}));

 app.use(cookieParser());

 app.use(session({
   resave:true,
   saveUninitialized: true,
   secret: secret.secretKey,
   store: new MongoStore({ url: secret.database, autoReconnect: true })
 }));

 app.use(flash());
 app.use(passport.initialize());
 app.use(passport.session());
 app.use(function(req, res, next){
   res.locals.user = req.user;
   next();
 });
/*
function for getting the recipes
*/
 app.use(function(req, res, next){
   Category.find({}, function(err, categories){
     if(err) return next(err);
     res.locals.categories = categories;
     next();
   });
 });

 app.use(function(req, res, next){
   User.find({}, function(err, people){
     if(err) return next(err);
     res.locals.people = people;
     next();
   });
 });

 //ejs engine
 app.engine('ejs', engine);

 //set the engine to (we are using handlebars, they are using ejs)
 app.set('view engine', 'ejs');

 //right now express is using mainRoutes
 var mainRoutes = require('./routes/main');
 var userRoutes = require('./routes/user');
 var adminRoutes = require('./routes/admin');

 app.use(mainRoutes);
 app.use(userRoutes);
 app.use(adminRoutes);

/******Heroku Setup: change 'secret.port' to 'port' *************/
/******Local Setup: change 'port' to 'secret.port'  *************/
 app.listen(port, function(err){
   if(err) throw err;
   console.log("Server is running on port: " + port);
 });
