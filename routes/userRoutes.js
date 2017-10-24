'use strict';

var userController = require('../controllers/userController');
var userValidate = require('../validate/userValidate');

module.exports = function() {
  return [
    {
      method: 'GET',
      path: '/users/{user_id}',
      config: {
        tags: ['api'],
        handler: userController.findByID,
        validate: userValidate.findByID
      }
    },
    {
      method: 'POST',
      path: '/users',
      config: {
        tags: ['api'],
        handler: userController.insert,
        validate: userValidate.insert
      }
    },
    {
      method: 'PUT',
      path: '/users/{user_id}',
      config: {
        tags: ['api'],
        handler: userController.update,
        validate: userValidate.update
      }
    },
    {
      method: 'DELETE',
      path: '/users/{user_id}',
      config: {
        tags: ['api'],
        handler: userController.delete,
        validate: userValidate.delete
      }
    }
  ];
}();
