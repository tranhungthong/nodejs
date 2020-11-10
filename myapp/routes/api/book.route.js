var express = require('express');
var router = express.Router();
var controller = require('../../controllers/api/book.controller');

router.post('/search', controller.search);


module.exports = router;