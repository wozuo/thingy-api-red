'use strict';

var userController = require('../controllers/dataController');
var userValidate = require('../validate/userValidate');
var UserModel = require('../models/dataModel');
var joi = require('joi');

module.exports = function() {
  return [
    {
      method: 'GET',
      path: '/{thingy_id}/sensors/{thingy_sensor}',
      config: {
        tags: ['api', 'data'],
        description: 'Get a specific sensor data',
        handler: dataController.getsensordata,
        validate: dataValidate.getsensordata,
        plugins: {'hapi-swagger': {responses: {
          200: {
            description: 'Success',
            schema: joi.array().items(new UserModel().schema)
          },
          404: {
            description: 'data is not avaiable '
          }
        }}}
      }
    },
    {
      method: 'POST',
      path: '/users',
      config: {
        tags: ['api', 'users'],
        description: 'Create a user',
        handler: userController.createUser,
        validate: userValidate.createUser,
        plugins: {'hapi-swagger': {responses: {
          201: {
            description: 'Success',
            schema: joi.array().items(new UserModel().schema)
          },
          404: {
            description: 'User not found'
          }
        }}}
      }
    },
    {
      method: 'PUT',
      path: '/users/{user_id}',
      config: {
        tags: ['api', 'users'],
        description: 'Edit user',
        handler: userController.editUser,
        validate: userValidate.editUser,
        plugins: {'hapi-swagger': {responses: {
          200: {
            description: 'Success',
            schema: joi.array().items(new UserModel().schema)
          },
          404: {
            description: 'User not found'
          }
        }}}
      }
    },
    {
      method: 'DELETE',
      path: '/users/{user_id}',
      config: {
        tags: ['api', 'users'],
        description: 'Delete a user',
        handler: userController.deleteUser,
        validate: userValidate.deleteUser,
        plugins: {'hapi-swagger': {responses: {
          204: {
            description: 'User deleted'
          },
          404: {
            description: 'User not found'
          }
        }}}
      }
    }
  ];
}();
