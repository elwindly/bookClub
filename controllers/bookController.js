const express = require('express');
const {ObjectID} = require("mongodb");
const _ = require('lodash');
const {Book} = require('./../models/books');
const {User} = require('./..//models/members');
const fetch = require('fetch');

function BookController () {

    this.createBook = ((req, res) => {
        let title = req.body.title;
        fetch(`https://stark-hamlet-16318.herokuapp.com/imagesearch/${title}?offset=10`, (err, meta,body)=>{
            if (err) {return res.status(400).send(); }
            let rand = Math.floor(Math.random() * 3);
            let results = JSON.parse(body);
            if (results.length < 1) {return res.status(400).send(); }

            let book = new Book({
                title: title,
                link: results[rand].thumbnailUrl,
                owner:req.user._id
            });
            book.save().then((book)=>{
                return res.status(200).send(book);
            }).catch((e)=>{
                return res.status(400).send();
            });
        });
    });

    this.deleteBook = ((req, res) => {
        let bookId = req.body.id;
        if(!ObjectID.isValid(bookId)){
            return res.status(404).send(e);
        }
            Book.findOneAndRemove({
                _id:bookId,
                owner:req.user._id
            }).then((book)=>{
                if(!book){
                    return res.status(404).send();
                }
                res.status(200).send({book});
         }).catch((e)=> res.status(404).send(e));
    });
}

module.exports = BookController;