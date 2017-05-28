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


//Trade routes
router.patch('/userLogged/requestTrade', authenticate, tradeController.requestTrade);
router.patch('/userLogged/cancelTrade', authenticate, tradeController.cancelTrade);
router.patch('/userLogged/acceptTrade', authenticate, tradeController.acceptTrade);


//Displaying and changing options
router.get('/userLogged/options',authenticate, optionsController.showOptions);

router.post('/userLogged/options',authenticate, optionsController.updateOptions);


module.exports = router;
