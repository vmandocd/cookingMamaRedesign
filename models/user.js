var mongoose = require('mongoose');
//bcrypt is a library that hashes a password before it saves to the DB
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var crypto = require('crypto');


/* The user schema attributes / characteristics / fields */
var UserSchema = new mongoose.Schema({
  // _id is self generated, always there
  email: { type: String, unique: true, lowercase: true},
  password: String,

  profile: {
    name: {type: String, default: ''},
    picture: {type: String, default: ''}

  },
  history: [{
    date: Date,
    item: {type: Number, default: 0},
    //item: {type: Schema.Types.ObjectId}
  }]
})

/* Hash the password before we even save it to the DB*/
//mongoose method .pre saves it before adding to DB

UserSchema.pre('save', function(next){
  var user = this;
  //check whether userdoc is modified, if not return next
  if(!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt){
    //if there is an error return it
    if(err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash){
      if(err) return next(err);
      //mogodb will save user.pass
      user.password = hash;
      next();
    });
  });
});

//EXAMPLE METHOD
//
// UserSchema.pre('save', function(next){
//   var user = this;
//   user.name = 'Enter whatever you want to change before it goes to DB';
// })

/* compare password in the database and the one that the user type in */
/*custom methods are specified with .methods*/
UserSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
}
/*make default size 200, API lets us add profile picture
 * return rando image if not user email
 * if it is user email, hash it so that it will be unique to each User
 */
UserSchema.methods.gravatar = function(size){
  if(!this.size) size = 200;
  if(!this.email) return 'https://gravatar.com/avatar/?s' + size + '&=retro';
  var md5 = crypto.createHash('md5').update(this.email).digest('hex');
  return 'https://gravatar.com/avatar/' + md5 + '?s=' + size + '&d=retro';
}

//export the whole schema to MongoDB
module.exports = mongoose.model('User', UserSchema);
