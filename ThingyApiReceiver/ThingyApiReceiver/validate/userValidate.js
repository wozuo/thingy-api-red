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
          user_id: userSchema.userId.required()
        };
      })()
    },
    createUser: {
      payload: (function path() {
        var userSchema = new UserModel().schema;
        return {
          username: userSchema.username.required()
        };
      })()
    },
    editUser: {
      params: (function path() {
        var userSchema = new UserModel().schema;
        return {
          user_id: userSchema.userId.required()
        };
      })(),
      payload: (function path() {
        var userSchema = new UserModel().schema;
        return {
            username: userSchema.username.required(),
            password_hash: userSchema.password_hash.required(),
            access_tocken: userSchema.access_tocken.required()
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
