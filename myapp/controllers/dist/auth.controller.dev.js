"use strict";

var User = require('../models/user.model');

var jwtHelper = require('../helpers/jwt.helper');

module.exports.login = function (req, res) {
  res.render('users/login', {
    title: 'login form',
    layout: '../views/layouts/empty',
    errors: null
  });
};

module.exports.postLogin = function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.find({
    email: username,
    password: password
  }, function (err, foundData) {
    if (foundData.length > 0) {
      res.cookie('userid', foundData[0]._id, {
        signed: true
      });
      res.redirect('/');
    }

    res.render('users/login', {
      layout: '../views/layouts/empty',
      errors: ['Email or password not correct.']
    });
  });
};

module.exports.logout = function (req, res) {
  res.clearCookie('userid');
  res.render('users/login', {
    title: 'login form',
    layout: '../views/layouts/empty',
    errors: null
  });
};