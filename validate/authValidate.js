'use strict'

var joi = require('joi');

var UserModel = require('../models/userModel');

function AuthValidate(){};
AuthValidate.prototype = (function() {
  return {
    register: {
      payload: (function path() {
        var userSchema = new UserModel().schema;
        return {
          username: userSchema.username.required(),
          password: joi.string().max(20).required()
        };
      })()
    },
    login: {
      payload: (function path() {
        var userSchema = new UserModel().schema;
        return {
          username: userSchema.username.required(),
          password: joi.string().max(20).required()
        };
      })()
    }
  }
})();

var authValidate = new AuthValidate();
module.exports = authValidate;
