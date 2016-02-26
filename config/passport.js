var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

//serialize and deserialize
passport.serializeUser(function(user, done){
  done(null, user._id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});


/*
//in every request this object will be used in a session
then it can be used in any page that requires you to login
req.user._id
req.user.profile.name
*/
//middleware
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done){
  User.findOne({ email: email}, function(err, user){
    if(err) return done(err);

    if(!user){
      return done(null, false, req.flash('loginMessage', 'No user has been found'));
    }
    if(!user.comparePassword(password)){
      return done(null, false, req.flash('loginMessage', 'Oops! Wrong Password yo'));
    }
    //return the callback
    return done(null, user);
  });
}));


//custom function to validate
exports.isAuthenticated = function(req, res, next){
  //if the req is authenticated, go to the next callback
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}
