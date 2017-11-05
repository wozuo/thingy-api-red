'use strict';

var hapi = require('hapi');
const db = require('../db');

var Thingy_Temperature = [];
var Thingy_Pressure = [];
var Thingy_Humidity = [];
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
function UserController() { };
UserController.prototype = (function () {
    return {
        getSensordata: function getSensordata(request, reply) {
            var sensor_name = request.params.sensor_name;
            switch (sensor_name) {
                case "temperature":
                    db.get().query('SELECT td_id,temperature,time_stamp FROM thingy_real_data order by td_id desc limit 1', function (error, results) {
                        if (error) {
                            console.log('temperature data not found. Error: ' + error)
                            reply('temperature data not found.').code(404);
                        } else {
                            if (results.length == 1) {
                                var result = {
                                    td_id: results[0].td_id,
                                    temperature: results[0].temperature,
                                    timestamp: results[0].time_stamp
                                };
                                reply(result).code(200);
                            } else {
                                reply('temperature not found').code(404);
                            }
                        }
                    });
                    break;
                case "pressure":
                    db.get().query('SELECT td_id,pressure,time_stamp FROM thingy_real_data order by td_id desc limit 1', function (error, results) {
                        if (error) {
                            console.log('pressure data not found. Error: ' + error)
                            reply('pressure data not found.').code(404);
                        } else {
                            if (results.length == 1) {
                                var result = {
                                    td_id: results[0].td_id,
                                    pressure: results[0].pressure,
                                    timestamp: results[0].time_stamp
                                };
                                reply(result).code(200);
                            } else {
                                reply('pressure not found').code(404);
                            }
                        }
                    });
                    break;
                case "humidity":
                    db.get().query('SELECT td_id,humidity,time_stamp FROM thingy_real_data order by td_id desc limit 1', function (error, results) {
                        if (error) {
                            console.log('humidity data not found. Error: ' + error)
                            reply('humidity data not found.').code(404);
                        } else {
                            if (results.length == 1) {
                                var result = {
                                    td_id: results[0].td_id,
                                    humidity: results[0].humidity,
                                    timestamp: results[0].time_stamp
                                };
                                reply(result).code(200);
                            } else {
                                reply('humidity not found').code(404);
                            }
                        }
                    });
                    break;
                case "color":
                    db.get().query('SELECT td_id,red,green,blue,clear,time_stamp FROM color order by td_id desc limit 1', function (error, results) {
                        if (error) {
                            console.log('color data not found. Error: ' + error)
                            reply('color data not found.').code(404);
                        } else {
                            if (results.length == 1) {
                                var result = {
                                    td_id: results[0].td_id,
                                    red: results[0].red,
                                    green: results[0].green,
                                    blue: results[0].blue,
                                    clear: results[0].clear,
                                    timestamp: results[0].time_stamp
                                };
                                reply(result).code(200);
                            } else {
                                reply('color not found').code(404);
                            }
                        }
                    });
                    break;
                case "gas":
                    db.get().query('SELECT td_id,eco2,tvoc,time_stamp FROM gas order by td_id desc limit 1', function (error, results) {
                        if (error) {
                            console.log('gas data not found. Error: ' + error)
                            reply('gas data not found.').code(404);
                        } else {
                            if (results.length == 1) {
                                var result = {
                                    td_id: results[0].td_id,
                                    eco2: results[0].eco2,
                                    tvoc: results[0].tvoc,
                                    timestamp: results[0].time_stamp
                                };
                                reply(result).code(200);
                            } else {
                                reply('color not found').code(404);
                            }
                        }
                    });
                    break;
                default:
                    reply("the sensor not available now").code(404);
            }
        },



        insertSensorsdata: function insertSensorsdata(request, reply) {

            var thingyId = request.params.thingy_Id;
            var timestamp = request.payload.timestamp;
            var inserted_id = 0;
            //TODO: Store Data by Thingy and Sensor
            var temperature_type = typeof request.payload.sensors.temperature;
            if (temperature_type !== "undefined") {
                Thingy_Temperature = '{ "sensors" :{' +
                    '"temperature":' + request.payload.sensors.temperature + '},' +
                    '"timestamp":"' + request.payload.timestamp + '"}';

            }
            var pressure_type = typeof request.payload.sensors.pressure;
            if (pressure_type !== "undefined") {
                Thingy_Pressure = '{ "sensors" :{' +
                    ' "pressure":' + request.payload.sensors.pressure + '},' +
                    '"timestamp":"' + request.payload.timestamp + '"}';

            }
            var color_type = typeof request.payload.sensors.color;
            if (color_type !== "undefined") {
                Thingy_Color = '{ "sensors" :{' +
                    '"color":{"green":' + request.payload.sensors.color.green + ',"red": ' +
                    request.payload.sensors.color.red + ',"blue":' + request.payload.sensors.color.blue + ',"clear":' +
                    request.payload.sensors.color.clear + ' }},' +
                    '"timestamp":"' + request.payload.timestamp + '"}';

            }
            var humidity_type = typeof request.payload.sensors.humidity;
            if (humidity_type !== "undefined") {
                Thingy_Humidity = '{ "sensors" :{' +
                    '"humidity":' + request.payload.sensors.humidity + '},' +
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
                var Thingy_Humidity_Json = transformResponseToJson(Thingy_Humidity);
                var Thingy_Gas_Json = transformResponseToJson(Thingy_Gas);
                var Thingy_Color_Json = transformResponseToJson(Thingy_Color);
                var Thingy_Pressure_Json = transformResponseToJson(Thingy_Pressure);
                var Thingy_Temperature_Json = JSON.parse(Thingy_Temperature);

                var sql = "INSERT INTO thingy_real_data (thingy_id,temperature,humidity,pressure,time_stamp) VALUES ('" + thingyId + "', " +
                    Thingy_Temperature_Json.sensors.temperature + "," + Thingy_Humidity_Json.sensors.humidity +
                    "," + Thingy_Pressure_Json.sensors.pressure + ",'" + timestamp + "')";
                db.get().query(sql, function (error, results) {
                    if (error) {
                        console.log('Error executing query: ' + error.stack);
                        reply('sensor data  not found').code(404);
                    } else {
                        inserted_id = results.insertId;
                        db.get().query('SELECT * FROM thingy_real_data WHERE td_id = ?', results.insertId, function (error, results) {
                            if (error) {
                                console.log('sensor data not found. Error: ' + error)
                                reply('sensor data not found.').code(404);
                            } else {
                                if (results.length == 1) {
                                    var result = {
                                        td_id: results[0].td_id,
                                        temperature: results[0].temperature,
                                        humidity: results[0].humidity,
                                        pressure: results[0].pressure,
                                        timestamp: results[0].time_stamp,
                                    };

                                    var sql = "INSERT INTO color (td_id,red,green,blue,clear,time_stamp) VALUES (" + inserted_id + "," + Thingy_Color_Json.sensors.color.red + ", " +
                                        Thingy_Color_Json.sensors.color.green + "," + Thingy_Color_Json.sensors.color.blue + "," + Thingy_Color_Json.sensors.color.clear + ",'" + timestamp + "')";
                                    db.get().query(sql, function (error, results) {
                                        if (error) {
                                            console.log('Error executing query: ' + error.stack);
                                            reply('color data  not found').code(404);
                                        }
                                    });


                                    var sql = "INSERT INTO gas (td_id,eco2,tvoc,time_stamp) VALUES (" + inserted_id + "," + Thingy_Gas_Json.sensors.gas.eco2 + ", " +
                                        Thingy_Gas_Json.sensors.gas.tvoc + ",'" + timestamp + "')";
                                    db.get().query(sql, function (error, results) {
                                        if (error) {
                                            console.log('Error executing query: ' + error.stack);
                                            reply('gas data  not found').code(404);
                                        }
                                    });    
                                    reply(result).code(201);
                                } else {
                                    reply('sensor data not found').code(404);
                                }
                            }
                        })
                    }
                });               
            }
        }
    }
})();

var userController = new UserController();
module.exports = userController;
