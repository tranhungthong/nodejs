"use strict";

var express = require('express');

var router = express.Router();

var controller = require('../controllers/cognito.controller');

router.get('/callback', controller.callback);
module.exports = router;