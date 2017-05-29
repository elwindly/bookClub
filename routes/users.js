require('./../config/config');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const {authenticate} = require('./../middleware/authenticate');

const {User} = require('./..//models/members');

const UserAuthController = require('./../controllers/userAuthController');

const userAuthController = new UserAuthController();


router.post('/', userAuthController.signUp);
router.post('/login', userAuthController.logIn);
router.delete('/me/token',authenticate, userAuthController.logOut);

module.exports = router;
