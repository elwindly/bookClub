const express = require('express');
const {ObjectID} = require("mongodb");
const _ = require('lodash');
const {Book} = require('./../models/books');
const {User} = require('./..//models/members');


function OptionsController () {

    this.showOptions = ((req, res) => {
        res.render('options', { 
        title: 'Options' ,
        fullName:req.user.fullName,
        city:req.user.city,
        state:req.user.state,
        isLoggedIn:true,
        });   
    });

    this.updateOptions = ((req, res) => {
        
        let fullName = req.body.fullName || req.user.fullName;
        let city = req.body.city || req.user.city;
        let state = req.body.state || req.user.state;

        User.update( {
            _id: req.session._id,
        }, {
            $set: { fullName: fullName, city:city, state:state}}, { new: true },
        function(err, raw) {
            if (err) return console.log(err);
            res.status(200).send(raw);
        });
    });
}

module.exports = OptionsController;