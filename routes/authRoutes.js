'use strict';

var authController = require('../controllers/authController');
var authValidate = require('../validate/authValidate');
var AuthModel = require('../models/authModel');
var joi = require('joi');

module.exports = function() {
  return [
    {
      method: 'PUT',
      path: '/register',
      config: {
        tags: ['api', 'auth'],
        description: 'Register a new account',
        handler: authController.register,
        validate: authValidate.register,
        plugins: {'hapi-swagger': {responses: {
          201: {
            description: 'Success',
            schema: joi.array().items(new AuthModel().schema)
          },
          409: {
            description: 'Username already taken'
          }
        }}}
      }
    },
    {
      method: 'POST',
      path: '/login',
      config: {
        tags: ['api', 'auth'],
        description: 'Login to existing account',
        handler: authController.login,
        validate: authValidate.login,
        plugins: {'hapi-swagger': {responses: {
          200: {
            description: 'Success',
            schema: joi.array().items(new AuthModel().schema)
          },
          400: {
            description: 'Username or password wrong'
          },
          404: {
            description: 'User not found'
          }
        }}}
      }
    }
  ];
}();
