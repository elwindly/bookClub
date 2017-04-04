const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcyript = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  name: {
    type: String,
    require: true,
    minlength: 4,
    unique:true
  },
  fullName: {
    type: String,
    default:"To be filled"
  },
  city:{
    type: String,
    default:"To be filled"
  },
  state:{
   type: String,
   default:"To be filled"
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject,['_id','email']);
};

UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},process.env.JWT_SECRET).toString();

    user.tokens.push({
        access,
        token
    });
    return user.save().then(()=>{
        return token;
    });
};

UserSchema.methods.removeToken = function(token){
  var user = this;

  return user.update({
    $pull:{
      tokens:{
        token:token
      }
    }
  });
};

UserSchema.statics.findByToken=function(token){
    var user = this;
    var decoded;
try {
    decoded = jwt.verify(token,process.env.JWT_SECRET);  //process.env.JWT_SECRET
} catch (e) {
   return Promise.reject();
}
return User.findOne({
    '_id':decoded._id,
    'tokens.token':token,
    'tokens.access': 'auth'
});
    
};

UserSchema.statics.findByCredentials = function(identifier,password){
  var user = this;
  var query = {};
  if(validator.isEmail(identifier)){
    query.email = identifier;
  }else{
    query.name = identifier;
  }

  return user.findOne(query).then((user)=>{
    if(!user){
      return Promise.reject();
    }
    return new Promise((resolve,reject)=>{
      bcyript.compare(password,user.password,(err,res)=>{
        if(!res){
          return reject();
        }
        return resolve(user);
      });
    })
    
  });
};

UserSchema.pre('save',function(next){
  var user = this;

  if(user.isModified('password')){
    bcyript.genSalt(10,(err,salt)=>{
      bcyript.hash(user.password,salt,(err,hash)=>{
        user.password = hash;
         next();
      });
    });  
  }else{
    next();
  }

});

var User = mongoose.model('User',UserSchema);

module.exports = {User} 