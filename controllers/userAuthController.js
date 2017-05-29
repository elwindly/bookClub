const express = require('express');
const {User} = require('./..//models/members');
const _ = require('lodash');


function UserAuthController () {

    this.signUp = ((req, res) => {
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
                            req.session.name = body.name;
                            req.session._id = user._id;
                        // console.log("user session id",req.session._id)
                            return user.generateAuthToken();
                        }).then((token)=>{           
                            //res.header('x-auth', token).send(user);
                            req.session.xAuth = token;
                            res.status(200).send();
                        }).catch((e)=>{
                            res.status(400).send()
                        });
                    }       
                });
            }
        });        
    });

    this.logIn = ((req, res) => {
        var body = _.pick(req.body,['emailLog','pwdLog']);

        User.findByCredentials(body.emailLog,body.pwdLog).then((user)=>{
            return user.generateAuthToken().then((token)=>{
                req.session.xAuth = token;
                req.session.name = user.name;
                req.session._id = user._id;
                res.redirect('/userLogged');
            });
        }).catch((e)=>{
            res.status(409).send({message: "Invalid credinials!"});
        });   
    });

    this.logOut = ((req, res) => {
        req.user.removeToken(req.session.xAuth).then(()=>{
            req.session.xAuth = null;
            req.session.name = null;
            req.session._id = null;
            req.session.destroy(function(err) {
            res.status(200).send();
            })
            
        },()=>{
            res.status(400).send();
        });  
    });   
}

module.exports = UserAuthController;