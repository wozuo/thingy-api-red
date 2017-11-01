'use strict'

var joi = require('joi');

var UserModel = require('../models/userModel');

function UserValidate(){};
UserValidate.prototype = (function() {
  return {
    getUser: {
      params: (function path() {
        var userSchema = new UserModel().schema;
        return {
          user_id: userSchema.userId.required().positive()
        };
      })()
    },
    createUser: {
      query: (function path() {
        var userSchema = new UserModel().schema;
        return {
          username: userSchema.username.required()
        };
      })()
    },
    editUser: {
      query: (function path() {
        var userSchema = new UserModel().schema;
        return {
          username: userSchema.username.required()
        };
      })()
    },
    deleteUser: {
      params: (function path() {
        var userSchema = new UserModel().schema;
        return {
          user_id: userSchema.userId.required()
        };
      })()
    }
  }
})();

var userValidate = new UserValidate();
module.exports = userValidate;
