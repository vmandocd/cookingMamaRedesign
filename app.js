/*
 * Module dependencies.
 */
 var express = require('express');
 var morgan = require('morgan');
 var mongoose = require('mongoose');

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

 mongoose.connect(secret.database, function(err){
   if(err){
     console.log(err);
   }else{
     console.log("Connected to the MongoDB");
   }
 });

 //this tells express that the public folder is for the static files
 app.use(express.static(__dirname + '/public'));

 //middleware (don't know why I need this
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

 app.listen(secret.port, function(err){
   if(err) throw err;
   console.log("Server is running on port: " + secret.port);
 });


/******************************************************************************/
// var express = require('express');
// var http = require('http');
// var path = require('path');
// var handlebars = require('express3-handlebars')
//
// var index = require('./routes/index');
//
// var login = require('./routes/login');
// var signup = require('./routes/signup');
// var friendFeed = require('./routes/friendFeed');
// var publicFeed = require('./routes/publicFeed');
// var profile = require('./routes/profile');
// var findRecipe = require('./routes/findRecipe');
// var recipe = require('./routes/recipe');
// var cooking = require('./routes/cooking');
//
// // Example route
// // var user = require('./routes/user');
//
// var app = express();
//
// // all environments
// app.set('port', process.env.PORT || 3000);
// app.set('views', path.join(__dirname, 'views'));
// app.engine('handlebars', handlebars());
// app.set('view engine', 'handlebars');
// app.use(express.favicon());
// app.use(express.logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded());
// app.use(express.methodOverride());
// app.use(express.cookieParser('Intro HCI secret key'));
// app.use(express.session());
// app.use(app.router);
// app.use(express.static(path.join(__dirname, 'public')));
//
// // development only
// if ('development' == app.get('env')) {
//   app.use(express.errorHandler());
// }
//
// // Add routes here
// app.get('/', index.view);
// app.get('/login', login.view);
// app.get('/signup', signup.view);
// app.get('/friendFeed', friendFeed.view);
// app.get('/publicFeed', publicFeed.view);
// app.get('/profile', profile.view);
// app.get('/findRecipe', findRecipe.view);
// app.get('/recipe/:name', recipe.view);
// app.get('/cooking/:name', cooking.view);
//
// //app.get('/cooking/:name', cookingRecipe.recipeInfo);
//
//
// // Example route
// // app.get('/users', user.list);
//
// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Express server listening on port ' + app.get('port'));
// });
