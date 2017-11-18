'use strict';

var hapi = require('hapi');
const db = require('../db');
const bcrypt = require('bcrypt');
var randtoken = require('rand-token');

function AuthController(){};
AuthController.prototype = (function() {
  return {
    register: function register(request, reply) {
      db.get().query('SELECT user_id FROM users WHERE username = ?', request.payload.username, function (error, results) {
        if (error) {
          console.log('Internal Server Error: ' + error)
          reply('Internal Server Error:').code(500);
        } else {
          if (results.length == 1) {
            reply('Username already taken').code(409);
          } else {
            // Hash password
            bcrypt.hash(request.payload.password, 8, function(error, hash) {
              if (error) {
                console.log('Internal Server Error: ' + error)
                reply('Internal Server Error:').code(500);
              } else {
                // Generate access_token
                var token = randtoken.generate(50);
                db.get().query('INSERT INTO users VALUES (default,"' + request.payload.username + '","' + hash + '","' + token + '")', function (error, results) {
                  if (error) {
                    console.log('Internal Server Error: ' + error)
                    reply('Internal Server Error:').code(500);
                  } else {
                    db.get().query('SELECT user_id, access_token FROM users WHERE username = ?', request.payload.username, function (error, results) {
                      if (error) {
                        console.log('Internal Server Error: ' + error)
                        reply('Internal Server Error:').code(500);
                      } else {
                        var result = {
                          userId: results[0].user_id,
                          token: results[0].access_token
                        };
                        reply(result).code(201);
                      }
                    })
                  }
                })
              }
            })
          }
        }
      })
    },
    login: function login(request, reply) {
      db.get().query('SELECT user_id, password_hash, access_token FROM users WHERE username = ?', request.payload.username, function (error, results) {
        if (error) {
          console.log('Internal Server Error: ' + error)
          reply('Internal Server Error:').code(500);
        } else {
          if (results.length == 1) {
            bcrypt.compare(request.payload.password, results[0].password_hash, function(error, res) {
              if (error) {
                console.log('Internal Server Error: ' + error)
                reply('Internal Server Error:').code(500);
              } else {
                if (res) {
                  var result = {
                    userId: results[0].user_id,
                    token: results[0].access_token
                  }
                  reply(result).code(200);
                } else {
                  reply('Username or password wrong').code(400);
                }
              }
            })
          } else {
            reply('User not found').code(404);
          }
        }
      })
    }
  }
})();

var authController = new AuthController();
module.exports = authController;
