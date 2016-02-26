/*handling all the main routes*/
var router = require('express').Router();
var User = require('../models/user');



/* HOME PAGE*/
router.get('/', function(req, res){
  res.render('main/home');
});

router.get('/about', function(req, res){
  res.render('main/about');
});



module.exports = router;
