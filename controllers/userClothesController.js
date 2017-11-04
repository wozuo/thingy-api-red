'use strict';

var hapi = require('hapi');
const db = require('../db');

function UserClothesController(){};
UserClothesController.prototype = (function() {
  return {
    getClothesOfUser: function getClothesOfUser(request, reply) {
      db.get().query('SELECT users_clothes.user_id, users_clothes.aoc_id, users_clothes.from_temp, users_clothes.to_temp, clothes.description FROM clothes INNER JOIN users_clothes ON clothes.aoc_id = users_clothes.aoc_id WHERE users_clothes.user_id = "' + request.params.user_id + '"', function (error, results) {
        if (error) {
          console.log('Clothes for user not found. Error: ' + error)
          reply('Clothes for user not found.').code(404);
        } else {
          var result = [];
          for (var i = 0; i < results.length; i++) {
            result.push({
              userId: results[i].user_id,
              aocId: results[i].aoc_id,
              fromTemp: results[i].from_temp,
              toTemp: results[i].to_temp,
              aocDesc: results[i].description
            });
          }
          reply(result).code(200);
        }
      })
    },
    addAOCToUser: function addAOCToUser(request, reply) {
      db.get().query('SELECT user_id FROM users WHERE user_id = ?', request.params.user_id, function (error, results) {
        if (error) {
          console.log('User not found. Error: ' + error)
          reply('User not found.').code(404);
        } else {
          if (results.length == 1) {
            db.get().query('SELECT aoc_id FROM clothes WHERE aoc_id = ?', request.params.aoc_id, function (error, results) {
              if (error) {
                console.log('Internal Server Error: ' + error)
                reply('Internal Server Error:').code(500);
              } else {
                if (results.length == 1) {
                  db.get().query('SELECT aoc_id, user_id FROM users_clothes WHERE aoc_id = "' + request.params.aoc_id + '" AND user_id = "' + request.params.user_id + '"', function (error, results) {
                    if (error) {
                      console.log('Internal Server Error: ' + error)
                      reply('Internal Server Error:').code(500);
                    } else {
                      if (results.length == 0) {
                        db.get().query('INSERT INTO users_clothes VALUES ("' + request.params.user_id + '", "' + request.params.aoc_id + '", "' + request.payload.fromTemp + '", "' + request.payload.toTemp + '")', function (error, results) {
                          if (error) {
                            console.log('Internal Server Error: ' + error)
                            reply('Internal Server Error:').code(500);
                          } else {
                            db.get().query('SELECT users_clothes.user_id, users_clothes.aoc_id, users_clothes.from_temp, users_clothes.to_temp, clothes.description FROM clothes INNER JOIN users_clothes ON clothes.aoc_id = users_clothes.aoc_id WHERE users_clothes.user_id = "' + request.params.user_id + '" AND users_clothes.aoc_id = "' + request.params.aoc_id + '"', function (error, results) {
                              if (error) {
                                console.log('Clothes for user not found. Error: ' + error)
                                reply('Clothes for user not found.').code(404);
                              } else {
                                if (results.length == 1) {
                                  var result = {
                                    userId: results[0].user_id,
                                    aocId: results[0].aoc_id,
                                    fromTemp: results[0].from_temp,
                                    toTemp: results[0].to_temp,
                                    aocDesc: results[0].description
                                  };
                                  reply(result).code(201);
                                } else {
                                  reply('Article of clothing for user not found').code(404);
                                }
                              }
                            })
                          }
                        })
                      } else {
                        reply('Article of clothing is already assigned to user').code(409);
                      }
                    }
                  })
                } else {
                  reply('Article of clothing not found').code(404);
                }
              }
            })
          } else {
            reply('User not found').code(404);
          }
        }
      })
    },
    editAOCOfUser: function editAOCOfUser(request, reply) {
      db.get().query('SELECT user_id, aoc_id FROM users_clothes WHERE user_id = "' + request.params.user_id + '" AND aoc_id = "' + request.params.aoc_id + '"', function (error, results) {
        if (error) {
          console.log('Internal Server Error: ' + error)
          reply('Internal Server Error:').code(500);
        } else {
          if (results.length == 1) {
            db.get().query('UPDATE users_clothes SET from_temp = "' + request.payload.fromTemp + '", to_temp = "' + request.payload.toTemp + '" WHERE user_id = "' + request.params.user_id + '" AND aoc_id = "' + request.params.aoc_id + '"', function(error, results) {
              if (error) {
                console.log('Internal Server Error: ' + error)
                reply('Internal Server Error:').code(500);
              } else {
                db.get().query('SELECT users_clothes.user_id, users_clothes.aoc_id, users_clothes.from_temp, users_clothes.to_temp, clothes.description FROM clothes INNER JOIN users_clothes ON clothes.aoc_id = users_clothes.aoc_id WHERE users_clothes.user_id = "' + request.params.user_id + '" AND users_clothes.aoc_id = "' + request.params.aoc_id + '"', function (error, results) {
                  if (error) {
                    console.log('Internal Server Error: ' + error)
                    reply('Internal Server Error:').code(500);
                  } else {
                    if (results.length == 1) {
                      var result = {
                        userId: results[0].user_id,
                        aocId: results[0].aoc_id,
                        fromTemp: results[0].from_temp,
                        toTemp: results[0].to_temp,
                        aocDesc: results[0].description
                      };
                      reply(result).code(200);
                    } else {
                      reply('Article of clothing not found').code(404);
                    }
                  }
                })
              }
            })
          } else {
            reply('Article of clothing not found').code(404);
          }
        }
      })
    },
    deleteAOCOfUser: function deleteAOCOfUser(request, reply) {
      db.get().query('SELECT user_id, aoc_id FROM users_clothes WHERE user_id = "' + request.params.user_id + '" AND aoc_id = "' + request.params.aoc_id + '"', function (error, results) {
        if (error) {
          console.log('Internal Server Error: ' + error)
          reply('Internal Server Error:').code(500);
        } else {
          if (results.length == 1) {
            db.get().query('DELETE FROM users_clothes WHERE user_id = "' + request.params.user_id + '" AND aoc_id = "' + request.params.aoc_id + '"', function (error) {
              if (error) {
                console.log('Internal Server Error: ' + error)
                reply('Internal Server Error:').code(500);
              } else {
                reply('Article of clothing deleted for user').code(204);
              }
            })
          } else {
            reply('Article of clothing not found').code(404);
          }
        }
      })
    }
  }
})();

var userClothesController = new UserClothesController();
module.exports = userClothesController;
