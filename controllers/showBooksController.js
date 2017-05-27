const express = require('express');
const {ObjectID} = require("mongodb");
const _ = require('lodash');
const {Book} = require('./../models/books');
const {User} = require('./..//models/members');


function ShowBooksController () {

    this.allTheBooks = ((req, res) => {
        let isLoggedIn = req.session.xAuth ? true : false;
        Book.find().then((books)=>{  
            let bookList = books.map((book)=>{    
            let owner = isLoggedIn ? book.owner.equals(req.session._id) : false;
            return {title:book.title, link:book.link, owner:owner, upForTrade: !book.isAskedForTrade, id:book._id, isLoggedIn:isLoggedIn};
            });
            res.render('index', { 
            title: 'Book trading Club' ,
            isLoggedIn:isLoggedIn,
            bookList:bookList,
            });
        }).catch((e) => {
            res.send({msg:"Something went wrong"});
        });
    });

    this.onlyUserBooks = ((req, res) => {
        const id = req.user._id;
        let isLoggedIn = req.session.xAuth ? true : false;
        let askedList = [];
        let askedFromYouList= []; 
        let bookList = [];
        let otherTradeReq = 0;
        let yourTradeReq = 0;
        Book.find({"$or" : [{owner: id}, {asker: id}]}).then((books)=>{  
            let iterate = books.map((book)=>{
                if (book.isAskedForTrade && book.owner.equals(id)) {
                    if (!book.isAcceptedByOwner) { otherTradeReq++; }
                    askedFromYouList.push({bookName: book.title, id:book._id, completed:book.isAcceptedByOwner});
                }
                if (book.isAskedForTrade && book.asker.equals(id)) {
                    if (!book.isAcceptedByOwner) { yourTradeReq++; }
                    askedList.push({bookName: book.title, id:book._id, completed:book.isAcceptedByOwner});
                } 
                if (book.owner.equals(id)) {
                    bookList.push({title:book.title, link:book.link, owner:true, id:book._id, isLoggedIn:isLoggedIn });
                }
                 return 0;      
            });
            res.render('index', { 
                title: 'Logged in' ,
                name:req.user.name,
                isLoggedIn:true,
                bookList:bookList,
                ownPage: true,
                request:askedList,
                requested:askedFromYouList,
                otherTradeReq: otherTradeReq,
                yourTradeReq: yourTradeReq
            });
        }); 
    });
}

module.exports = ShowBooksController;