'use strict';

var userController = require('../controllers/userController');
var userValidate = require('../validate/userValidate');
var UserResponseModel = require('../models/userModel');
var joi = require('joi');

module.exports = function() {
  return [
    {
      method: 'GET',
      path: '/users/{user_id}',
      config: {
        tags: ['api'],
        handler: userController.getUser,
        validate: userValidate.getUser,
        plugins: {'hapi-swagger': {responses: {
          200: {
            description: 'Success',
            schema: joi.array().items(new UserResponseModel().schema),
          },
          404: {description: 'User not found'}
        }}}
      }
    },
    {
      method: 'POST',
      path: '/users',
      config: {
        tags: ['api'],
        handler: userController.createUser,
        validate: userValidate.createUser
      }
    },
    {
      method: 'PUT',
      path: '/users/{user_id}',
      config: {
        tags: ['api'],
        handler: userController.editUser,
        validate: userValidate.editUser
      }
    },
    {
      method: 'DELETE',
      path: '/users/{user_id}',
      config: {
        tags: ['api'],
        handler: userController.deleteUser,
        validate: userValidate.deleteUser
      }
    }
  ];
}();
