'use strict';

var hapi = require('hapi');

function UserController(){};
UserController.prototype = (function() {
  return {
    getUser: function getUser(request, reply) {
      reply('TODO: Return user').code(200);
    },
    createUser: function createUser(request, reply) {
      reply('TODO: Insert user').code(200);
    },
    editUser: function editUser(request, reply) {
      reply('TODO: Update user').code(200);
    },
    deleteUser: function deleteUser(request, reply) {
      reply('TODO: Delete user').code(200);
    }
  }
})();

var userController = new UserController();
module.exports = userController;
