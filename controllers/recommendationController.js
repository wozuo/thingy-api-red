'use strict';

var hapi = require('hapi');
const db = require('../db');

function RecommendationController(){};
RecommendationController.prototype = (function() {
  return {
    getRecom: function getRecom(request, reply) {
      db.get().query('SELECT user_id, username FROM users WHERE user_id = ?', request.params.user_id, function (error, results) {
        if (error) {
          console.log('Internal Server Error: ' + error)
          reply('Internal Server Error:').code(500);
        } else {
          if (results.length == 1) {
            var currentDate = new Date().toISOString().replace('T', ' ').slice(0, 19);
            db.get().query('SELECT temperature, humidity FROM thingy_data WHERE added_time <= "' + currentDate + '" ORDER BY added_time DESC LIMIT 1', function (error, results) {
              if (error) {
                console.log('Internal Server Error: ' + error)
                reply('Internal Server Error:').code(500);
              } else {
                if (results.length == 1) {
                  var closestData = {
                    temp: results[0].temperature,
                    humi: results[0].humidity
                  }
                  db.get().query('SELECT clothes.aoc_id, clothes.description FROM clothes INNER JOIN users_clothes ON clothes.aoc_id = users_clothes.aoc_id WHERE users_clothes.from_temp <= ' + closestData.temp + ' AND users_clothes.to_temp >= ' + closestData.temp + ' AND users_clothes.user_id = ' + request.params.user_id + '', function (error, results) {
                    if (error) {
                      console.log('Internal Server Error: ' + error)
                      reply('Internal Server Error:').code(500);
                    } else {
                      var recommendations = [];
                      for (var i = 0; i < results.length; i++) {
                        recommendations.push({
                          aocId: results[i].aoc_id,
                          aocDesc: results[i].description
                        });
                      }
                      if (closestData.humi >= 100) {
                        recommendations.push({
                          aocId: 5,
                          aocDesc: 'Raincoat (Rain)'
                        })
                      }
                      reply(recommendations).code(200);
                    }
                  })
                } else {
                  reply('Thingy data not found').code(404);
                }
              }
            })
          } else {
            reply('User not found').code(404);
          }
        }
      })
    },
    getForecast: function getForecast(request, reply) {
      reply("TODO: implement forecast").code(200);
    }
  }
})();

var recommendationController = new RecommendationController();
module.exports = recommendationController;
