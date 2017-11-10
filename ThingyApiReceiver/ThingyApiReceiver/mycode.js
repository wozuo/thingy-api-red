const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');
const mysql = require('mysql');

//URL Param Shemes
var thingyIdSchema = Joi.string().required().description('The Thingy UUID');
var sensorIdSchema = Joi.string().required().description('The Thingy Sensor');

const server = new Hapi.Server();
server.connection({
    host: '0.0.0.0',
    port: 8000,
    routes: {
        cors: true
    }
});


var con = mysql.createConnection({
    host: "us-cdbr-iron-east-05.cleardb.net",
    user: "bdd96dbef8384f",
    password: "816ee195",
    database: "heroku_5ce9a62dfd2216a"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected to the database!");
});


function transformResponseToJson(data) {
    try {
        return JSON.parse(data);
    } catch (e) {
        var wrapped = new Error("Could not parse response as JSON.");
        wrapped.stack = e.stack;
        throw wrapped;
    }
}
var Thingy_Temperature = [];
var Thingy_Pressure = [];
var Thingy_Humidity = [];
var Thingy_Color = [];
var Thingy_Gas = [];


server.route({
    method: 'GET',
    path: '/{thingy_id}/sensors/{thingy_sensor}',
    handler: function (request, reply) {

        var Thingy_Sensor = request.params.thingy_sensor;

        switch (Thingy_Sensor) {

            case "temperature":
                reply(Thingy_Temperature).code(200);
                break;
            case "pressure":
                reply(Thingy_Pressure).code(200);
                break;
            case "humidity":
                reply(Thingy_Humidity).code(200);
                break;
            case "color":
                reply(Thingy_Color).code(200);
                break;
            case "gas":
                reply(Thingy_Gas).code(200);
                break;
            default:
                reply("the sensor not available now").code(404);
        }
    },
    config: {
        tags: ['thingy'],
        validate: {
            params: {
                thingy_id: thingyIdSchema,
                thingy_sensor: Joi.string()
            }
        }
    }
});


/***********************************************************************************************************************
 *** START THINGY API
 **********************************************************************************************************************/
server.route({
    method: 'GET',
    path: '/{thingy_id}/setup',
    handler: function (request, reply) {
        var thingyId = request.params.thingy_id;

        //TODO: get from Server Config by Thingy ID
        var setup = {
            temperature: {
                interval: 1000
            },
            pressure: {
                interval: 1000
            },
            humidity: {
                interval: 1000
            },
            color: {
                interval: 1000
            },
            gas: {
                mode: 1
            }
        };

        reply(setup).code(200);
    },
    config: {
        tags: ['thingy'],
        validate: {
            params: {
                thingy_id: thingyIdSchema
            }
        }
    }
});

server.route({
    method: 'GET',
    path: '/{thingy_id}/actuators/led',
    handler: function (request, reply) {
        var thingyId = request.params.thingy_id;

        var DataType = request.headers;

        //TODO: get from Server Config by Thingy ID
        var led = {
            color: 8,
            intensity: 20,
            delay: 1
        };

        reply(led).code(200);

    },
    config: {
        tags: ['thingy'],
        validate: {
            params: {
                thingy_id: thingyIdSchema,
            },
        }
    }
});


server.route({
    method: 'POST',
    path: '/{uuid}/sensors/',
    handler: function (request, reply) {
        var thingyId = request.params.uuid;
        var timestamp = request.payload.timestamp;

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
        if (Thingy_Gas.length !== 0 && Thingy_Humidity.length !== 0 && Thingy_Color.length !== "undefined" &&
            Thingy_Pressure.length !== "undefined" && Thingy_Temperature.length !== "undefined") {
            var Thingy_Humidity_Json = transformResponseToJson(Thingy_Humidity);
            var Thingy_Gas_Json = transformResponseToJson(Thingy_Gas);
            var Thingy_Color_Json = transformResponseToJson(Thingy_Color);
            var Thingy_Pressure_Json = transformResponseToJson(Thingy_Pressure);
            var Thingy_Temperature_Json = JSON.parse(Thingy_Temperature);

            var sql = "INSERT INTO thingy_real_data (thingy_id,temperature,humidity,pressure,time_stamp) VALUES ('" + thingyId + "', " +
                Thingy_Temperature_Json.sensors.temperature + "," + Thingy_Humidity_Json.sensors.humidity +
                "," + Thingy_Pressure_Json.sensors.pressure + ",'" + timestamp + "')";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });

            var sql = "INSERT INTO color (red,green,blue,clear) VALUES ('" + Thingy_Color_Json.sensors.color.red + "', '" +
                Thingy_Color_Json.sensors.color.green + "','" + Thingy_Color_Json.sensors.color.blue + "','" + Thingy_Color_Json.sensors.color.clear + "')";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });

            var sql = "INSERT INTO gas (eco2,tvoc) VALUES ('" + Thingy_Gas_Json.sensors.gas.eco2 + "', '" +
                Thingy_Gas_Json.sensors.gas.tvoc + "')";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });

            //console.log("temp " + Thingy_Temperature_Json.sensors.temperature);
            //console.log("Gas " + Thingy_Gas_Json.sensors.gas.eco2);
            //console.log("Humidity " + Thingy_Humidity_Json.sensors.humidity);
            //console.log("Color " + Thingy_Color_Json.sensors.color.red);
            //console.log("Pressure " +Thingy_Pressure_Json.sensors.pressure);
        }
        reply(request.payload.sensors).code(200);
    },
    config: {
        tags: ['thingy'],
        validate: {
            params: {
                uuid: thingyIdSchema,
            },
            payload: {
                    timestamp: Joi.string(),
                    sensors: Joi.object().keys({
                    temperature: Joi.number(),
                    pressure: Joi.number(),
                    color: Joi.object().keys({ red: Joi.number(), green: Joi.number(), blue: Joi.number(), clear: Joi.number() }),
                    humidity: Joi.number(),
                    gas: Joi.object().keys({ eco2: Joi.number(), tvoc: Joi.number() })
                })
            }
        }
    }
});


//================================================================================

server.route({
    method: 'PUT',
    path: '/{uuid}/sensors/button',
    handler: function (request, reply) {
        var thingyId = request.params.thingy_id;

        //TODO: Store Data by Thingy and Sensor
        console.log('thingy: ' + thingyId);
        console.log(request.payload);

        reply({ success: true }).code(200);
    },
    config: {
        tags: ['thingy'],
        validate: {
            params: {
                uuid: thingyIdSchema,
            },
            payload: {
                pressed: Joi.bool(),
            }
        }
    }
});


server.start((err) => {
    console.log('Server running at:', server.info.uri);
});