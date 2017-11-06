'use strict';

var sensorsController = require('../controllers/sensorsController');
var sensorsValidate = require('../validate/sensorsValidate');
var sensorsModel = require('../models/sensorsModel');
var joi = require('joi');

module.exports = function() {
  return [
    {
      method: 'GET',
      path: '/{thingy_id}/sensors/{sensor_name}',
      config: {
        tags: ['api', 'sensors'],
        description: 'Get a specific sensor data',
        handler: sensorsController.getSensordata,
        validate: sensorsValidate.getSensor,
        plugins: {'hapi-swagger': {responses: {
          200: {
            description: 'Success',
            schema: joi.array().items(new sensorsModel().schema)
          },
          404: {
            description: 'Sensor data  not available'
          }
        }}}
      }
    },
    {
      method: 'POST',
      path: '/{thingy_Id}/sensors/',
      config: {
        tags: ['api', 'sensors'],
        description: 'insert sensors data',
        handler: sensorsController.insertSensorsdata,
        validate: sensorsValidate.insertSensorsData,
        plugins: {'hapi-swagger': {responses: {
          201: {
            description: 'Success',
            schema: joi.array().items(new sensorsModel().schema)
          },
          404: {
            description: 'Sensors not found'
          }
        }}}
      }
    },{
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
                    thingy_id: joi.string()
                }
            }
        }
    },
    {
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
                    thingy_id: joi.string(),
                },
            }
        }
    },

    {
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
                    uuid: joi.string(),
                },
                payload: {
                    pressed: joi.bool(),
                }
            }
        }
    }
  ];
}();
