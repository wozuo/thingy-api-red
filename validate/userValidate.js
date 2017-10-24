'use strict'

var joi = require('joi');

var UserModel = require('../models/userModel');

function UserValidate(){};
UserValidate.prototype = (function() {
  return {
    findByID: {
      params: (function path() {
        var userSchema = new UserModel().schema;
        return {
          user_id: userSchema.userId.required()
        };
      })()
    },
    insert: {
      query: (function path() {
        var userSchema = new UserModel().schema;
        return {
          description: userSchema.description.required()
        };
      })()
    },
    update: {
      query: (function path() {
        var userSchema = new UserModel().schema;
        return {
          description: userSchema.description.required()
        };
      })()
    },
    delete: {
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
