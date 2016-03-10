var router = require('express').Router();
var Category = require('../models/category');
var Product = require('../models/product');



router.get('/add-recipe', function(req, res, next){
  res.render('admin/add-recipe', { message: req.flash('success'), errors: req.flash('errors')});
  // res.render('admin/add-recipe', { errors: req.flash('errors')});
});

router.post('/add-recipe', function(req, res, next){

  if((req.body.name == "")|| (req.body.ingredients == "") || (req.body.instructions == "") || (req.body.image == "")){
    req.flash('errors', 'Must fill in all fields to add recipe!');
    return res.redirect('/add-recipe');
  }else{
    var category = new Category();
    var product = new Product();
    product.name = req.body.name;
    product.ingredients = req.body.ingredients;
    product.instructions = req.body.instructions;
    product.image = req.body.image;

    product.category = '56c678014e1b72fc1b80a459';

    product.save(function(err){
      if(err) return next(err);
      req.flash('success', 'Successfully added a recipe');
      return res.redirect('/add-recipe');
    });
  }
});

module.exports = router;
