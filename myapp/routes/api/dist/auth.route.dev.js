"use strict";

var express = require('express');

var router = express.Router();

var controller = require('../../controllers/api/auth.controoler');

router.post('/login', controller.apiLogin);
module.exports = router;