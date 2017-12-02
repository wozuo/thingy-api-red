'use strict';

var hapi = require('hapi');
var https = require('https');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const db = require('../db');

var Thingy_Temperature = 0;
var Thingy_Pressure = 0;
var Thingy_Humidity = 0;
var Thingy_Color = [];
var Thingy_Gas = [];
function transformResponseToJson(data) {
    try {
        return JSON.parse(data);
    } catch (e) {
        var wrapped = new Error("Could not parse response as JSON.");
        wrapped.stack = e.stack;
        throw wrapped;
    }
}

function getlanAndLat(country,city) {

    var location = new XMLHttpRequest();
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address="+city+","+country+"&key=AIzaSyBHLGNo3tE8zlmUGAz_CNVYE538G1NRyGo";
    location.open("GET", url, false);
    location.send();
    var r = JSON.parse(location.responseText);
    return r.results[0].geometry.location;

}

function getForecastexpectaions(lat,lan,time) {
    var forecast = new XMLHttpRequest();
    var url = "https://api.darksky.net/forecast/f872bc130397ccd359931b25f820393c/"+lat+","+lan+","+time+"";
    forecast.open("GET", url, false);
    forecast.send();
    var r = JSON.parse(forecast.responseText);



    var result = {
        latitude: r.latitude,
        longitude: r.longitude,
        timezone: r.timezone,
        time: r.currently.time,
        temperature: (r.currently.temperature- 32) * 5 / 9,
        humidity: r.currently.humidity * 100,
        pressure: r.currently.pressure,
        windSpeed: r.currently.windSpeed,
        cloudCover: r.currently.cloudCover

    };
    if (result.length == 0) {
        return "invalid time or location";
    }
    return result;

}

function toProperTimestamp(timestamp) {
    var date = new Date(timestamp);
    var totime = date.toLocaleString();
    var replcaSlacshes = totime.replace(/\//g, '-');
    var removeComas = replcaSlacshes.replace(',', '');
    return removeComas;
}
function UserController() { };
UserController.prototype = (function () {
    return {
        getSensordata: function getSensordata(request, reply) {
            var thingy_id = request.params.thingy_id;
                    db.get().query("SELECT * FROM thingy_data where thingy_id = '"+thingy_id+"' order by td_id desc limit 1 ", function (error, results) {
                        if (error) {
                            console.log('thingy  data not found. Error: ' + error)
                            reply('thingy data not found.').code(404);
                        } else {
                            if (results.length == 1) {
                                var result = {
                                    td_id: results[0].td_id,
                                    thingy_id: results[0].thingy_id,
                                    temperature: results[0].temperature,
                                    humidity: results[0].humidity,
                                    pressure: results[0].pressure,
                                    eco2: results[0].eco2,
                                    tvoc: results[0].tvoc,
                                    red: results[0].red,
                                    green: results[0].green,
                                    blue: results[0].blue,
                                    clear: results[0].clear,
                                    timestamp: toProperTimestamp(results[0].added_time),
                                };
                                reply(result).code(200);
                            } else {
                                reply('thingy not found').code(404);
                            }
                        }
                    });
        },
        getYesterdayDiff: function getYesterdayDiff(request, reply) {
            var thingy_id = request.params.thingy_id;
            var currentDate = new Date();
            currentDate.setHours(currentDate.getHours() + 1);
            var proberCurrentTime = currentDate.toISOString().replace('T', ' ').slice(0, 19);
            var sql = "SELECT * FROM thingy_data where thingy_id = '" + thingy_id + "' && added_time <= '" + proberCurrentTime + "' order by td_id desc limit 1 ";
            db.get().query(sql, function (error, results) {
                if (error) {
                    console.log('thingy  data not found. Error: ' + error)
                    reply('thingy data not found.').code(404);
                } else {
                    if (results.length == 1) {
                        var result = {
                            td_id: results[0].td_id,
                            thingy_id: results[0].thingy_id,
                            temperature: results[0].temperature,
                            humidity: results[0].humidity,
                            pressure: results[0].pressure,
                            eco2: results[0].eco2,
                            tvoc: results[0].tvoc,
                            red: results[0].red,
                            green: results[0].green,
                            blue: results[0].blue,
                            clear: results[0].clear,
                            timestamp: toProperTimestamp(results[0].added_time),
                        };
                        reply(result).code(200);

                    }
                    else if (results == 0) {
                        var sql = "SELECT * FROM thingy_data where thingy_id = '" + thingy_id + "' && added_time >= '" + proberCurrentTime + "' order by td_id limit 1 ";
                        db.get().query(sql, function (error, results) {
                            if (error) {
                                console.log('thingy  data not found. Error: ' + error)
                                reply('thingy data not found.').code(404);
                            } else {
                                if (results.length == 1) {
                                    var result = {
                                        td_id: results[0].td_id,
                                        thingy_id: results[0].thingy_id,
                                        temperature: results[0].temperature,
                                        humidity: results[0].humidity,
                                        pressure: results[0].pressure,
                                        eco2: results[0].eco2,
                                        tvoc: results[0].tvoc,
                                        red: results[0].red,
                                        green: results[0].green,
                                        blue: results[0].blue,
                                        clear: results[0].clear,
                                        timestamp: toProperTimestamp(results[0].added_time),
                                    };
                                    reply(result).code(200);

                                }
                                else {
                                    reply('thingy not found').code(404);
                                }
                            }
                        });
                     }
                    else {
                        reply('thingy not found').code(404);
                    }
                }
            });
        },
        insertSensorsdata: function insertSensorsdata(request, reply) {

            var thingyId = request.params.thingy_id;
            var timestamp = toProperTimestamp(request.payload.timestamp);
            var inserted_id = 0;
            //TODO: Store Data by Thingy and Sensor
            var temperature_type = typeof request.payload.sensors.temperature;
            if (temperature_type !== "undefined") {
                Thingy_Temperature = request.payload.sensors.temperature;
            }
            var pressure_type = typeof request.payload.sensors.pressure;
            if (pressure_type !== "undefined") {
                Thingy_Pressure = request.payload.sensors.pressure;

            }
            var humidity_type = typeof request.payload.sensors.humidity;
            if (humidity_type !== "undefined") {
                Thingy_Humidity = request.payload.sensors.humidity;
            }

            var color_type = typeof request.payload.sensors.color;
            if (color_type !== "undefined") {
                Thingy_Color = '{ "sensors" :{' +
                    '"color":{"green":' + request.payload.sensors.color.green + ',"red": ' +
                    request.payload.sensors.color.red + ',"blue":' + request.payload.sensors.color.blue + ',"clear":' +
                    request.payload.sensors.color.clear + ' }},' +
                    '"timestamp":"' + request.payload.timestamp + '"}';

            }
            
            var gas_type = typeof request.payload.sensors.gas;
            if (gas_type !== "undefined") {
                Thingy_Gas = '{"sensors" :{' +
                    '"gas":{"eco2":' + request.payload.sensors.gas.eco2 + ',"tvoc": ' +
                    request.payload.sensors.gas.tvoc + '}},' +
                    '"timestamp":"' + request.payload.timestamp + '"}';
            }
            if (Thingy_Gas.length !== 0 && Thingy_Humidity.length !== 0 && Thingy_Color.length !== "undefined"
                && Thingy_Pressure.length !== "undefined" && Thingy_Temperature.length !== "undefined") {
                var Thingy_Gas_Json = transformResponseToJson(Thingy_Gas);
                var Thingy_Color_Json = transformResponseToJson(Thingy_Color);

                var sql = "INSERT INTO thingy_data (thingy_id,added_time,temperature,humidity,pressure,eco2,tvoc,red,green,blue,clear) VALUES ('" + thingyId + "', STR_TO_DATE('" + timestamp + "','%d-%m-%Y %h:%i:%s %p')," +
                    Thingy_Temperature + "," + Thingy_Humidity +
                    "," + Thingy_Pressure + ", " + Thingy_Gas_Json.sensors.gas.eco2 + ","
                    + Thingy_Gas_Json.sensors.gas.tvoc + "," + Thingy_Color_Json.sensors.color.red + "," + Thingy_Color_Json.sensors.color.green + ","
                    + Thingy_Color_Json.sensors.color.blue + "," + Thingy_Color_Json.sensors.color.clear + ")";
                db.get().query(sql, function (error, results) {
                    if (error) {
                        console.log('Error executing query: ' + error.stack);
                        reply('sensor data  not found').code(404);
                    } else {
                        inserted_id = results.insertId;
                        db.get().query('SELECT * FROM thingy_data WHERE td_id = ?', results.insertId, function (error, results) {
                            if (error) {
                                console.log('sensor data not found. Error: ' + error)
                                reply('sensor data not found.').code(404);
                            } else {
                                if (results.length == 1) {
                                    var result = {
                                        td_id: results[0].td_id,
                                        thingy_id: results[0].thingy_id,
                                        temperature: results[0].temperature,
                                        humidity: results[0].humidity,
                                        pressure: results[0].pressure,
                                        eco2: results[0].eco2,
                                        tvoc: results[0].tvoc,
                                        red: results[0].red,
                                        green: results[0].green,
                                        blue: results[0].blue,
                                        clear: results[0].clear,
                                        timestamp: results[0].added_time,
                                    };                                   
                                    reply(result).code(201);
                                } else {
                                    reply('sensor data not found').code(404);
                                }
                            }
                        })
                    }
                });               
            }
        },

        getForecast: function getForecast(request, reply) {
            var country = request.params.country;
            var city = request.params.city;
            var time = request.params.time;
            var location = getlanAndLat(country,city);
            var forecast = getForecastexpectaions(location.lat, location.lng, time);
            if (forecast.length == 0) {
                reply("check the data(lat,lng,time)");
            }
            else {
                reply(forecast).code(200);
            }
        }
    }
})();

var userController = new UserController();
module.exports = userController;
