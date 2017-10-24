'use strict';

var hapi = require('hapi');

function UserController(){};
UserController.prototype = (function() {
  return {
    findByID: function findByID(request, reply) {
      console.log('Return user');
      reply('TODO: Return user').code(200);
    },
    insert: function insert(request, reply) {
      reply('TODO: Insert user').code(200);
    },
    update: function update(request, reply) {
      reply('TODO: Update user').code(200);
    },
    delete: function remove(request, reply) {
      reply('TODO: Delete user').code(200);
    }
  }
})();

var userController = new UserController();
module.exports = userController;
