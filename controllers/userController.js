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
              username: results[0].username
            };
            reply(result).code(200);
          } else {
            reply('User not found').code(404);
          }
        }
      })
    },
    createUser: function createUser(request, reply) {
      db.get().query('INSERT INTO users VALUES (default,"' + request.payload.username + '")', function (error, results) {
        if (error) {
          console.log('Error executing query: ' + error.stack);
          reply('User not found').code(404);
        } else {
          db.get().query('SELECT user_id, username FROM users WHERE user_id = ?', results.insertId, function (error, results) {
            if (error) {
              console.log('User not found. Error: ' + error)
              reply('User not found.').code(404);
            } else {
              if (results.length == 1) {
                var result = {
                  id: results[0].user_id,
                  username: results[0].username
                };
                reply(result).code(201);
              } else {
                reply('User not found').code(404);
              }
            }
          })
        }
      })
    },
    editUser: function editUser(request, reply) {
      db.get().query('SELECT user_id, username FROM users WHERE user_id = ?', request.params.user_id, function (error, results) {
        if (error) {
          console.log('User not found. Error: ' + error)
          reply('User not found.').code(404);
        } else {
          if (results.length == 1) {
            var result = {
              id: results[0].user_id,
              username: results[0].username
              };
            var sql = 'UPDATE users SET username = "' + request.payload.username + '", password_hash = "' + request.payload.password_hash + '",access_token = "' + request.payload.access_tocken + '" WHERE user_id = "' + request.params.user_id + '"';
            db.get().query(sql, function (error, results) {
              if (error) {
                console.log('User not found. Error: ' + error)
                reply('User not found.').code(404);
              } else {
                db.get().query('SELECT * FROM users WHERE user_id = ?', request.params.user_id, function (error, results) {
                  if (error) {
                    console.log('User not found. Error: ' + error)
                    reply('User not found.').code(404);
                  } else {
                    if (results.length == 1) {
                      var result = {
                        id: results[0].user_id,
                        username: results[0].username,
                        password_hash: results[0].password_hash,
                        user_token: results[0].access_token
                      };
                      reply(result).code(200);
                    } else {
                      reply('User not found').code(404);
                    }
                  }
                })
              }
            })
          } else {
              var sql = 'insert into users values (' + request.params.user_id + ',"' + request.payload.username + '","'
                  + request.payload.password_hash + '","' + request.payload.access_tocken
                  + '")';
              db.get().query(sql, function (error, results) {
                  if (error) {
                      console.log('User not found. Error: ' + error)
                      reply('User not found.').code(404);
                  } else {
                      db.get().query('SELECT * FROM users WHERE user_id = ?', request.params.user_id, function (error, results) {
                          if (error) {
                              console.log('User not found. Error: ' + error)
                              reply('User not found.').code(404);
                          } else {
                              if (results.length == 1) {
                                  var result = {
                                      id: results[0].user_id,
                                      username: results[0].username,
                                      password_hash: results[0].password_hash,
                                      user_token:results[0].access_token
                                  };
                                  reply(result).code(200);
                              } else {
                                  reply('User not found').code(404);
                              }
                          }
                      })
                  }
              })
          }
        }
      })
    },
    deleteUser: function deleteUser(request, reply) {
      db.get().query('SELECT user_id FROM users WHERE user_id = ?', request.params.user_id, function (error, results) {
        if (error) {
          console.log('User not found. Error: ' + error)
          reply('User not found.').code(404);
        } else {
          if (results.length == 1) {
            db.get().query('DELETE FROM users WHERE user_id = "' + request.params.user_id + '"', function (error) {
              if (error) {
                console.error('Error executing query: ' + error.stack);
                reply().code(404);
              } else {
                reply('User deleted').code(204);
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

var userController = new UserController();
module.exports = userController;
