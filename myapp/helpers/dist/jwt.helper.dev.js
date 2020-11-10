"use strict";

var jwt = require('jsonwebtoken'); // tao token


var generateToken = function generateToken(user, secretSignature, tokenLife) {
  return new Promise(function (resolve, reject) {
    var userData = {
      _id: user._id,
      name: user.name,
      email: user.email
    }; // tao token

    jwt.sign({
      data: userData
    }, secretSignature, {
      algorithm: "HS256",
      expiresIn: tokenLife
    }, function (error, token) {
      if (error) {
        return reject(error);
      }

      resolve(token);
    });
  });
}; // kiem tra token


var verifyToken = function verifyToken(token, secretKey) {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, secretKey, function (err, decoded) {
      if (err) {
        return reject(err);
      }

      resolve(decoded);
    });
  });
};

module.exports = {
  generateToken: generateToken,
  verifyToken: verifyToken
};