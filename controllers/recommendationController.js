'use strict';

var hapi = require('hapi');
const db = require('../db');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

function getRequest(url) {
  return new Promise(function(resolve, reject) {
    var req = new XMLHttpRequest();
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

function sortNumber(a,b) {
    return a - b;
}

function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
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
                      if (closestData.humi >= 90) {
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
      var now = new Date();
      var endOfDay = new Date();
      endOfDay.setHours(23, 59, 59);
      var url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?access_token=' + request.params.google_at + '&singleEvents=true&timeMin=' + now.toISOString() + '&timeMax=' + endOfDay.toISOString() + '';
      getRequest(url).then(function(response) {
        const items = response.items;
        let coordinatePromises = [];
        var dateTimes = [];
        for(var i = 0; i < items.length; i++) {
          console.log('Item Location: ' + items[i].location);
          console.log('Item Event Time: ' + items[i].start.dateTime);
          dateTimes.push(items[i].start.dateTime);
          url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + items[i].location + '&key=' + process.env.GOOGLE_MAPS_API_KEY + '';
          coordinatePromises.push(getRequest(url));
        }
        Promise.all(coordinatePromises).then((results) => {
          let coordinates = [];
          for(var i = 0; i < results.length; i++) {
            var tempCoords = { lat: results[i].results[0].geometry.location.lat, lng: results[i].results[0].geometry.location.lng };
            coordinates.push(tempCoords);
          }
          let weatherPromises = [];
          let unixTimes = [];
          for(var i = 0; i < coordinates.length; i++) {
            var accDateTime = new Date(dateTimes[i]);
            if (accDateTime.getMinutes() < 30) {
              accDateTime.setMinutes('00', '00', '00');
            } else {
              accDateTime.setMinutes('60', '00', '00');
            }
            var unixDateTimeValue = accDateTime.getTime()/1000;
            unixTimes.push(unixDateTimeValue);
            let url = 'https://api.darksky.net/forecast/f872bc130397ccd359931b25f820393c/' + coordinates[i].lat + ',' + coordinates[i].lng + '?time=' + unixDateTimeValue + '&units=si';
            weatherPromises.push(getRequest(url));
          }
          Promise.all(weatherPromises).then((results) => {
            let weatherData = [];
            let temperatures = [];
            let highestHumidity = 0;
            for(var i = 0; i < results.length; i++) {
              var index = -1;
              for(var j = 0; j < results[i].hourly.data.length; j++) {
                if(results[i].hourly.data[j].time == unixTimes[i]) { index = j }
              }
              console.log('Humidity: ' + results[i].hourly.data[index].humidity + " index: " + index + " time: " + results[i].hourly.data[index].time);
              temperatures.push(results[i].hourly.data[index].temperature);
              if (results[i].hourly.data[index].humidity > highestHumidity) {
                highestHumidity = results[i].hourly.data[index].humidity;
              }
            }
            db.get().query('SELECT user_id, username FROM users WHERE user_id = ?', request.params.user_id, function (error, results) {
              if (error) {
                console.log('Internal Server Error: ' + error)
                reply('Internal Server Error:').code(500);
              } else {
                if (results.length == 1) {
                  temperatures.sort(sortNumber);
                  let highestTemp = temperatures[temperatures.length-1];
                  let lowestTemp = temperatures[0];
                  highestHumidity = highestHumidity * 100;
                  console.log('Highest Temp: ' + highestTemp + ' lowest temp: ' + lowestTemp);
                  db.get().query('SELECT clothes.aoc_id, clothes.description FROM clothes INNER JOIN users_clothes ON clothes.aoc_id = users_clothes.aoc_id WHERE (users_clothes.from_temp >= ' + lowestTemp + ' AND users_clothes.from_temp <= ' + highestTemp + ') OR (users_clothes.to_temp >= ' + lowestTemp + ' AND users_clothes.to_temp <= ' + highestTemp + ') OR (users_clothes.from_temp <= ' + lowestTemp + ' AND users_clothes.to_temp >= ' + highestTemp + ') AND users_clothes.user_id = ' + request.params.user_id + '', function (error, results) {
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
                      if (highestHumidity >= 80) {
                        recommendations.push({
                          aocId: 5,
                          aocDesc: 'Raincoat (Rain)'
                        })
                      }
                      // Remove duplicates in recommendations
                      recommendations = removeDuplicates(recommendations, 'aocId');
                      reply(recommendations).code(200);
                    }
                  })
                } else {
                  reply('User not found').code(404);
                }
              }
            });
          });
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
