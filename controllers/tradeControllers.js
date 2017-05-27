const express = require('express');
const {ObjectID} = require("mongodb");
const _ = require('lodash');
const {Book} = require('./../models/books');
const {User} = require('./..//models/members');


function TradeController () {

    this.requestTrade = ((req, res) => {

    });

    this.acceptTrade = ((req, res) => {

    });

    this.cancelTrade = ((req, res) => {

    });    
}

module.exports = TradeController;