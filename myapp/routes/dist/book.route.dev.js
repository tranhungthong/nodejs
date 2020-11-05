"use strict";

var express = require('express');

var router = express.Router();

var controller = require('../controllers/book.controller');

var multer = require('multer');

var upload = multer({
  dest: './public/upload/books/'
});

var _require = require('../middlewares/cleanCache'),
    clearCacheID = _require.clearCacheID;

router.get('/', controller.index);
router.get('/get', controller.getABook);
router.post('/', controller.search);
router.post('/add', upload.single('cover'), controller.add);
router.post('/update', upload.single('cover'), controller.update);
router.post('/delete', controller["delete"]);
module.exports = router;