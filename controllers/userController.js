'use strict';

var hapi = require('hapi');
const db = require('../db');

function UserController(){};
UserController.prototype = (function() {
  return {
    getUser: function getUser(request, reply) {
      db.get().query('SELECT user_id, username FROM users WHERE user_id = ?', request.params.user_id, function (error, results) {
        if (error) {
          console.log('User not found. Error: ' + error)
          reply('User not found.').code(404);
        } else {
          if (results.length == 1) {
            var result = {
              id: results[0].user_id,
              username: results[0].username,
              url: server.info.uri + '/users/' + results[0].user_id
            };
            reply(result).code(200);
          } else {
            reply('User not found').code(404);
          }
        }
      })
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
