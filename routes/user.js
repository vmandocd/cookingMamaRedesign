/*handling all the user routes*/
var router = require('express').Router();
var User = require('../models/user');
var passport = require('passport');
var passportConf = require('../config/passport');
var Product = require('../models/product');

router.get('/signup', function(req, res, next){
  res.render('accounts/signup', {
    errors: req.flash('errors')
  });
});

router.post('/signup', function(req, res, next){
  var user = new User();

  user.profile.name = req.body.name;
  user.email = req.body.email;
  user.password = req.body.password;

  user.profile.picture = user.gravatar();

  //mongoose method (find only one document in the user DB)
  User.findOne({email: req.body.email}, function(err, existingUser){
    //if existing user
    if(existingUser){
      req.flash('errors', 'Account with that email address already exists');
      //console.log(req.body.email + "is already exist");
      return res.redirect('/signup');
    }else{
      user.save(function(err, user){
        //if error,
        if(err) return next(err);

        req.logIn(user, function(err){
          if(err) return next(err);
          //adding the session to the server and cookie to the browser
          req.logIn(user, function(err){
            if(err) return next(err);
            res.redirect('/publicFeed');
          })
        })
      });
    }
  });
});

router.get('/login', function(req, res){
  if(req.user)  return res.redirect('/');
  res.render('accounts/login', {message: req.flash('loginMessage')});
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/publicFeed',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('../');
});

router.get('/publicFeed', function(req, res ,next){
  //search for a particular user
  User.findOne({ _id: req.user._id}, function(err, user){

    if(err) return next(err);
    //render the page with an object (user)
    res.render('accounts/publicFeed', { user: user });
  });
});

router.get('/profile', function(req, res ,next){
  //search for a particular user
  User.findOne({ _id: req.user._id}, function(err, user){

    if(err) return next(err);
    //render the page with an object (user)
    res.render('accounts/profile', { user: user });
  });
});

router.get('/findRecipe', function(req, res ,next){
  //search for a particular user
  User.findById({ _id: req.user._id}, function(err, user){
    if(err) return next(err);
    //render the page with an object (user)
    res.render('accounts/findRecipe', { user: user });
  });
});

router.get('/products/:id', function(req, res, next){
  Product
    .find({ category: req.params.id})
    .populate('category')
    .exec(function(err, products){
      if(err) return next(err);
      res.render('accounts/findRecipe', {
        products: products
      });
    });
});

/*
  query the id, then find the product and pass it to the product.ejs
*/
router.get('/product/:id', function(req, res, next){
  Product.findById({ _id: req.params.id}, function(err, product){
    if(err) return next(err);
    res.render('accounts/recipe', {
      product: product
    });
  });
});

router.get('/cooking', function(req, res ,next){
  //search for a particular user
  User.findOne({ _id: req.user._id}, function(err, user){

    if(err) return next(err);
    //render the page with an object (user)
    res.render('accounts/cooking', { user: user });
  });
});

router.get('/cooking/:id', function(req, res, next){
  Product.findById({ _id: req.params.id}, function(err, product){
    if(err) return next(err);
    res.render('accounts/cooking', {
      product: product
    });
  });
});

router.get('/completedCook', function(req, res ,next){
  //search for a particular user
  User.findOne({ _id: req.user._id}, function(err, user){

    if(err) return next(err);
    //render the page with an object (user)
    res.render('accounts/completedCook', { user: user });
  });
});

router.get('/completedCook/:id', function(req, res, next){
  Product.findById({_id: req.params.id}, function(err, product){
    if(err) return next(err);
    res.render('accounts/completedCook', { product: product, errors: req.flash('errors') });
  });
});

router.post('/completedCook/:product_id', function(req, res, next){
  User.findOne({_id: req.user._id}, function(err, user){
    var d = new Date();
    var dateCooked = d.getDate();

    if(req.body.comment == ""){
      req.flash('errors', 'Must complete comment field!!');
      return res.redirect('/completedCook/'+req.body.product_id);
    }else{
      user.history.push({
        item: req.body.product_id,
        name: req.body.product_name,
        image: req.body.image,
        comment: req.body.comment,
        feeling: req.body.feeling,
        date: dateCooked
      });
      user.save(function(err){
        if(err) return next(err);
        return res.redirect('/publicFeed');
      });
    }
  });
});


module.exports = router;
