const express = require('express');
const {ObjectID} = require("mongodb");
const _ = require('lodash');
const {Book} = require('./../models/books');
const {User} = require('./..//models/members');


function OptionsController () {

    this.showOptions = ((req, res) => {

    });

    this.updateOptions = ((req, res) => {

    });
}

module.exports = OptionsController;