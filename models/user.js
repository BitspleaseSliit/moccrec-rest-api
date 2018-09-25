'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// mongoose user model
var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: {
    type: String
  },
  learningStyles: {
    active: {
      type: Number
    },
    reflective: {
      type: Number
    },
    sensing: {
      type: Number
    },
    intuitive: {
      type: Number
    },
    visual: {
      type: Number
    },
    verbal: {
      type: Number
    },
    sequential: {
      type: Number
    },
    global: {
      type: Number
    }
  },
  knowledgeLevel: {
    type: Number
  },
  status: {
    type: Boolean,
    default: true
  }
});

userSchema.pre('save', function(next){
  var user = this;
  if(this.isModified('password') || this.isNew){
    bcrypt.genSalt(10, function(err, salt){
      if(err){
        return next(err);
      }
      bcrypt.hash(user.password, salt, function(err, hash){
        if(err){
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function(passw, cb){
  bcrypt.compare(passw, this.password, function(err, isMatch){
    if(err){
      return cb(err);
    }
    cb(null, isMatch);
  });
}

var User = mongoose.model('User', userSchema);

module.exports = User;
