'use strict';

var hapi = require('hapi');
const db = require('../db');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

function getTodaysCalendarEvents(access_token) {
  return new Promise(function(resolve, reject) {
    var now = new Date();
    var endOfDay = new Date();
    endOfDay.setHours(23, 59, 59);
    var req = new XMLHttpRequest();
    let url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token=' + access_token + '&singleEvents=true&timeMin=' + now.toISOString() + '&timeMax=' + endOfDay.toISOString() + '';
    req.open('GET', url);
    req.onload = function() {
      if (req.status == 200 && req.readyState == 4) {
        var jsonResp = JSON.parse(req.responseText);
        resolve(jsonResp);
      } else {
        reject(Error(req.statusText));
      }
    };
    req.send();
  });
}

function getCoordinatesFor(location) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
    let url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=' + process.env.GOOGLE_MAPS_API_KEY + '';
    req.open('GET', url);
    req.onload = function() {
      if (req.status == 200 && req.readyState == 4) {
        var jsonResp = JSON.parse(req.responseText);
        resolve(jsonResp);
      } else {
        reject(Error(req.statusText));
      }
    };
    req.send();
  });
}

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
      getTodaysCalendarEvents(request.params.google_at).then(function(response) {
        const items = response.items;
        let coordinatePromises = [];
        for(var i = 0; i < items.length; i++) {
          console.log('Item Location: ' + items[i].location);
          coordinatePromises.push(getCoordinatesFor(items[i].location));
        }
        Promise.all(coordinatePromises).then((results) => {
          let coordinates = [];
          for(var i = 0; i < results.length; i++) {
            //console.log('Location: ' + results[i].results[0].geometry.location.lat);
            var tempCoords = { lat: results[i].results[0].geometry.location.lat, lng: results[i].results[0].geometry.location.lng };
            coordinates.push(tempCoords);
          }
          console.log('Lat: ' + coordinates[0].lat + ' long: ' + coordinates[0].lng);
          
          reply("TODO: implement forecast.").code(200);
        });
      }, function(error) {
        console.error('Error', error);
        reply("Internal Server Error").code(500);
      })
    }
  }
})();

var recommendationController = new RecommendationController();
module.exports = recommendationController;
