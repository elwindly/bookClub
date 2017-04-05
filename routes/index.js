require('./../config/config');
var express = require('express');
var router = express.Router();
const {ObjectID} = require("mongodb");
const fetch = require('fetch').fetchUrl;
const _ = require('lodash');
const {Book} = require('./../models/books');
const {User} = require('./..//models/members');
const {authenticate} = require('./../middleware/authenticate');

/* GET home page. */
router.get('/', (req,res)=> {
  let isLoggedIn = req.session.xAuth ? true : false;
  let askedList = [];
  let askedFromYouList= []; 
  let otherTradeReq = 0;
  let yourTradeReq = 0;
  Book.find().then((books)=>{  
    let bookList = books.map((book)=>{
      if (isLoggedIn) {
        if (book.owner == req.session.name && book.isAskedForTrade) {
          if (!book.isAcceptedByOwner) { otherTradeReq++; }
          askedFromYouList.push({bookName: book.title, id:book._id, completed:book.isAcceptedByOwner});
        }
        if (book.askerName == req.session.name) {
          if (!book.isAcceptedByOwner) { yourTradeReq++; }
          askedList.push({bookName: book.title, id:book._id, completed:book.isAcceptedByOwner});
        } 
      }
      let owner = req.session.name ? req.session.name == book.owner : false;
      return {title:book.title, link:book.link, owner:owner, upForTrade: !book.isAskedForTrade, id:book._id, isLoggedIn:isLoggedIn};
    });
   // console.log(bookList);
    res.render('index', { 
      title: 'Book trading Club' ,
      isLoggedIn:isLoggedIn,
      bookList:bookList,
      request:askedList,
      requested:askedFromYouList,
      otherTradeReq: otherTradeReq,
      yourTradeReq: yourTradeReq
    });
  },(err)=>{
    console.log(err);
  });

});

router.get('/userLogged',authenticate, (req,res)=> {
  const name = req.user.name;
  let isLoggedIn = req.session.xAuth ? true : false;
  let askedList = [];
  let askedFromYouList= []; 
  let bookList = [];
  let otherTradeReq = 0;
  let yourTradeReq = 0;
  Book.find({"$or" : [{owner: name}, {askerName : name}]}).then((books)=>{  
    let iterate = books.map((book)=>{
        if (book.owner == req.session.name && book.isAskedForTrade) {
          if (!book.isAcceptedByOwner) { otherTradeReq++; }
          askedFromYouList.push({bookName: book.title, id:book._id, completed:book.isAcceptedByOwner});
        }
        if (book.askerName == req.session.name) {
          if (!book.isAcceptedByOwner) { yourTradeReq++; }
          askedList.push({bookName: book.title, id:book._id, completed:book.isAcceptedByOwner});
        } 
        if (book.owner === name) {
          bookList.push({title:book.title, link:book.link, owner:true, id:book._id, isLoggedIn:isLoggedIn });
        }
        return 0;      
    });
    res.render('index', { 
      title: 'Logged in' ,
      name:name,
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

router.post('/userLogged/newBook',authenticate, (req,res)=> {
  const name = req.user.name;
  let title = req.body.title;
  fetch(`https://stark-hamlet-16318.herokuapp.com/imagesearch/${title}?offset=10`, (err, meta,body)=>{
      if (err) {return res.status(400).send(); }
      let rand = Math.floor(Math.random() * 3);
      let results = JSON.parse(body);
      if (results.length < 1) {return res.status(400).send(); }

      let book = new Book({
          title: title,
          link: results[rand].thumbnailUrl,
          owner:name
      });
      book.save().then((book)=>{
        return res.status(200).send(book);
      }).catch((e)=>{
        return res.status(400).send();
      });
  });
});

router.delete('/userLogged/deleteBook',authenticate, (req,res)=> {
  let bookId = req.body.id;
  if(!ObjectID.isValid(bookId)){
    return res.status(404).send(e);
  }
    Book.findOneAndRemove({
        _id:bookId,
        owner:req.session.name
    }).then((book)=>{
        if(!book){
            return res.status(404).send();
        }
        res.status(200).send({book});
    }).catch((e)=> res.status(404).send(e));
});

router.patch('/userLogged/requestTrade', (req,res)=> {
  let bookId = req.body.id;
  if(!ObjectID.isValid(bookId)){
    return res.status(404).send(e);
  }
  Book.update( {
        _id: bookId,
      }, {
         $set: { isAskedForTrade: true, askerName: req.session.name }}, { new: true },
      function(err, raw) {
        if (err) return console.log(err);
        res.status(200).send();
      });
});

router.patch('/userLogged/cancelTrade', (req,res)=> {
  let bookId = req.body.id;
  if(!ObjectID.isValid(bookId)){
    return res.status(404).send(e);
  }
  Book.update( {
        _id: bookId,
      }, {
         $set: { isAskedForTrade: false, askerName: "" }}, { new: true },
      function(err, raw) {
        if (err) return console.log(err);
        res.status(200).send();
      });
});

router.patch('/userLogged/acceptTrade', (req,res)=> {
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

router.get('/userLogged/options',authenticate, (req,res)=> {
    res.render('options', { 
      title: 'Options' ,
      fullName:req.user.fullName,
      city:req.user.city,
      state:req.user.state,
      isLoggedIn:true,
    });   

});

router.post('/userLogged/options',authenticate, (req,res)=> {
    let fullName = req.body.fullName || req.user.fullName;
    let city = req.body.city || req.user.city;
    let state = req.body.state || req.user.state;

  User.update( {
        name: req.session.name,
      }, {
         $set: { fullName: fullName, city:city, state:state}}, { new: true },
      function(err, raw) {
        if (err) return console.log(err);
        res.status(200).send(raw);
      });

});


module.exports = router;
