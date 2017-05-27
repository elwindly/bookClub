const express = require('express');
const router = express.Router();

const {authenticate} = require('./../middleware/authenticate');

const TradeController = require('./../controllers/tradeControllers');
const BookController = require('./../controllers/bookController');
const ShowBooksController = require('./../controllers/showBooksController');
const OptionsController = require('./../controllers/optionsController');

const tradeController = new TradeController();
const bookController = new BookController();
const showBooksController = new ShowBooksController();
const optionsController = new OptionsController();

/* GET home page. */
router.get('/', showBooksController.allTheBooks);

//User page, handling books and request
router.get('/userLogged',authenticate, showBooksController.onlyUserBooks);

//Add and delete books
router.post('/userLogged/newBook',authenticate, bookController.createBook);
router.delete('/userLogged/deleteBook',authenticate, bookController.deleteBook);

router.patch('/userLogged/requestTrade', authenticate, (req,res)=> {
  let bookId = req.body.id;
  if(!ObjectID.isValid(bookId)){
    return res.status(404).send();
  }
  Book.update( {
        _id: bookId,
      }, {
         $set: { isAskedForTrade: true, asker: req.user._id }}, { new: true },
      function(err, raw) {
        if (err) return status(400).send();
        res.status(200).send();
      });
});

router.patch('/userLogged/cancelTrade', authenticate,(req,res)=> {
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

router.patch('/userLogged/acceptTrade', authenticate,(req,res)=> {
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
        _id: req.session._id,
      }, {
         $set: { fullName: fullName, city:city, state:state}}, { new: true },
      function(err, raw) {
        if (err) return console.log(err);
        res.status(200).send(raw);
      });

});


module.exports = router;
