"use strict";

var express = require('express');

var router = express.Router();

var controller = require('../controllers/book.controller');

var multer = require('multer');

var upload = multer({
  dest: './public/upload/books/'
});

var _require = require('../middlewares/cleanCache'),
    clearCacheByKey = _require.clearCacheByKey;

router.get('/', controller.index);
router.get('/get', controller.getABook);
router.post('/', controller.search);
router.post('/add', upload.single('cover'), clearCacheByKey, controller.add);
router.post('/update', upload.single('cover'), clearCacheByKey, controller.update);
router.post('/delete', clearCacheByKey, controller["delete"]);
module.exports = router;