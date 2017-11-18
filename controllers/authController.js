'use strict';

var hapi = require('hapi');
const db = require('../db');

function AuthController(){};
AuthController.prototype = (function() {
  return {
    register: function register(request, reply) {
      reply('TODO: Register').code(200);
    },
    login: function login(request, reply) {
      reply('TODO: Login').code(200);
    }
  }
})();

var authController = new AuthController();
module.exports = authController;
