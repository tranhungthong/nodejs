"use strict";

var express = require('express');

var router = express.Router();

var controller = require('../controllers/weather.controller');

router.get('/', controller.index);
router.post('/', controller.search);
module.exports = router;