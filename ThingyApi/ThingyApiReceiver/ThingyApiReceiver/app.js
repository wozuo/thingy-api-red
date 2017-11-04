const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');



//URL Param Shemes
var thingyIdSchema = Joi.string().required().description('The Thingy UUID');
var sensorIdSchema = Joi.string().required().description('The Thingy Sensor');

const server = new Hapi.Server();
server.connection({
    host: '0.0.0.0',
    port: 8080,
    routes: {
        cors: true
    }
});

const swaggerOptions = {
    info: {
        'title': 'thingy-api',
        'version': '1.0.0',
        'description': 'thingy-api-blue'
    }
}

function transformResponseToJson(data) {
    try {
        return JSON.parse(data);
    } catch (e) {
        var wrapped = new Error("Could not parse response as JSON.");
        wrapped.stack = e.stack;
        throw wrapped;
    }
}
var Thingy_Values = []
var Thingy_Temperature = [];
var Thingy_Pressure = [];
var Thingy_Humidity = [];
var Thingy_Color = [];
var Thingy_Gas = [];

server.register([
    Inert,
    Vision,
    {
        register: HapiSwagger,
        options: swaggerOptions
    }
]);

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

        //TODO: Store Data by Thingy and Sensor

        if (typeof request.payload.sensors.temperature !== "undefined") {
            Thingy_Temperature = '{ "sensors" :{' +
                ' "temperature":' + request.payload.sensors.temperature +'},' +
                '"timestamp":"' + request.payload.timestamp + '"}';

            transformResponseToJson(Thingy_Temperature);
        }
        if (typeof request.payload.sensors.pressure !== "undefined") {
            Thingy_Values.push(request.payload.sensors.pressure);
            Thingy_Pressure = '{ "sensors" :{' +
                ' "pressure":' + request.payload.sensors.pressure + '},' +
                '"timestamp":"' + request.payload.timestamp + '"}';

            transformResponseToJson(Thingy_Pressure);
        }
        if (typeof request.payload.sensors.color !== "undefined") {
            Thingy_Values.push({ "red": request.payload.sensors.color.red, "green": request.payload.sensors.color.green, "blue": request.payload.sensors.color.blue, "clear": request.payload.sensors.color.clear });
          
            Thingy_Color = '{ "sensors" :{' +
                '"Color":{"green":' + request.payload.sensors.color.green + ',"red": ' +
                request.payload.sensors.color.red + ',"blue":' + request.payload.sensors.color.blue + ',"clear":' +
                request.payload.sensors.color.clear + ' }},' +
                '"timestamp":"' + request.payload.timestamp + '"}';
            transformResponseToJson(Thingy_Color);
        }
        if (typeof request.payload.sensors.humidity !== "undefined") {
            Thingy_Values.push(request.payload.sensors.humidity);
            Thingy_Humidity = '{ "sensors" :{' +
                '"humidity":' + request.payload.sensors.humidity + '},' +
                '"timestamp":"' + request.payload.timestamp + '"}';
            transformResponseToJson(Thingy_Humidity);
       }
        if (typeof request.payload.sensors.gas !== "undefined") {
            Thingy_Values.push({ "eco2": request.payload.sensors.gas.eco2, "tvoc": request.payload.sensors.gas.tvoc });
            Thingy_Gas = '{ "sensors" :{' +
                '"gas":{"eco2":' + request.payload.sensors.gas.eco2 + ',"tvoc": ' +
                request.payload.sensors.gas.tvoc + '}},' +
                '"timestamp":"' + request.payload.timestamp + '"}';
            transformResponseToJson(Thingy_Gas);
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
                    color: Joi.object().keys({ red: Joi.number(), green: Joi.number(), blue: Joi.number(), clear: Joi.number()}),
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