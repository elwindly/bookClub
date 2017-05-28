const express = require('express');
const {ObjectID} = require("mongodb");
const _ = require('lodash');
const {Book} = require('./../models/books');
const {User} = require('./..//models/members');


function TradeController () {

    this.requestTrade = ((req, res) => {
        let bookId = req.body.id;
        if(!ObjectID.isValid(bookId)){
            return res.status(404).send();
        }
        Book.update({
            _id: bookId,
        }, {
            $set: { isAskedForTrade: true, asker: req.user._id }}, { new: true },
        function(err, raw) {
            if (err) return status(400).send();
             res.status(200).send();
        });
    });

    this.cancelTrade = ((req, res) => {
        let bookId = req.body.id;
        if(!ObjectID.isValid(bookId)){
            return res.status(404).send(e);
        }
        Book.update( {
            _id: bookId,
         }, {
             $set: { isAskedForTrade: false, asker: null }}, { new: true },
         function(err, raw) {
             if (err) return console.log(err);
             res.status(200).send();
        });
    });

    this.acceptTrade = ((req, res) => {
        let bookId = req.body.id;
        if(!ObjectID.isValid(bookId)){
            return res.status(404).send(e);
        }
        Book.update( {
            _id: bookId,
        }, {
            $set: { isAcceptedByOwner: true}}, { new: true },
        function(err, raw) {
            if (err) return console.log(err);
               res.status(200).send();
        });
    });    
}

module.exports = TradeController;