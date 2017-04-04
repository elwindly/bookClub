require('./../config/config');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {authenticate} = require('./../middleware/authenticate');

const {User} = require('./..//models/members');

/* GET users listing. */
router.get('/',function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', (req,res)=> {
    var body = _.pick(req.body,['email','name','password']);

    User.findOne({email:body.email}).then((user)=>{
    if(user){
        res.status(409).send({message:'User already exist'});
    }else{
        User.findOne({name:body.name}).then((user)=>{
            if(user){
                res.status(409).send({message:'User already exist'});     
            }else{
               var user = new User(body);

                user.save().then(()=>{
                    return user.generateAuthToken();
                }).then((token)=>{           
                    //res.header('x-auth', token).send(user);
                    req.session.xAuth = token;
                    req.session.name = body.name;
                    res.status(200).send();
                }).catch((e)=>{
                    res.status(400).send(e)
                });
            }       
        });
    }
    });
});


router.post('/login',(req,res)=>{
    var body = _.pick(req.body,['emailLog','pwdLog']);

    User.findByCredentials(body.emailLog,body.pwdLog).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            req.session.xAuth = token;
            req.session.name = user.name;
            res.redirect('/userLogged');
        });
    }).catch((e)=>{
        res.status(409).send({message: "Invalid username. email or password"});
    });
});

router.delete('/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.session.xAuth).then(()=>{
        req.session.xAuth = null;
        req.session.name = null;
        req.session.destroy(function(err) {
           res.status(200).send();
        })
        
    },()=>{
        res.status(400).send();
    });
});

module.exports = router;
