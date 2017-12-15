'use strict'

var joi = require('joi');

var SensorsModel = require('../models/sensorsModel');
var SensorGetDataModel = require('../models/sensorGetDataModel');
var forecastModel = require('../models/forecastModel');

function SensorsValidate() { };
SensorsValidate.prototype = (function () {
    return {
        getSensordata: {
            params: (function path() {
                var sensorSchema = new SensorGetDataModel().schema;
                return {
                    thingy_id: sensorSchema.thingy_id.required()
                };
            })()
        },
        getYesterdayDiff: {
            params: (function path() {
                var sensorSchema = new SensorGetDataModel().schema;
                return {
                    thingy_id: sensorSchema.thingy_id.required()
                };
            })()
        },
        getForecast: {
            params: (function path() {
                var forecastSchema = new forecastModel().schema;
                return {
                    country: forecastSchema.country.required(),
                    city: forecastSchema.city.required(),
                    time: forecastSchema.time.required()
                };
            })()
        },
        insertSensorsdata: {
            payload: (function path() {
                var sensorSchema = new SensorsModel().schema;
                return {
                    sensors: sensorSchema.sensors.required(),
                    timestamp: sensorSchema.timestamp.required()
                };
            })(),
            params: (function path() {
                var sensorSchema = new SensorGetDataModel().schema;
                return {
                    thingy_id: sensorSchema.thingy_id.required()
                };
            })()
        }//,
        //editUser: {
        //    params: (function path() {
        //        var userSchema = new UserModel().schema;
        //        return {
        //            user_id: userSchema.userId.required()
        //        };
        //    })(),
        //    payload: (function path() {
        //        var userSchema = new UserModel().schema;
        //        return {
        //            username: userSchema.username.required()
        //        };
        //    })()
        //},
        //deleteUser: {
        //    params: (function path() {
        //        var userSchema = new UserModel().schema;
        //        return {
        //            user_id: userSchema.userId.required()
        //        };
        //    })()
        //}
    }
})();

var sensorsValidate = new SensorsValidate();
module.exports = sensorsValidate;
