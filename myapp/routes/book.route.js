var express = require('express');
var router = express.Router();
var controller = require('../controllers/book.controller');

router.get('/', controller.index);
router.get('/get', controller.getABook);
router.post('/', controller.search);
router.post('/add', controller.add);
router.post('/update', controller.update);

module.exports = router;