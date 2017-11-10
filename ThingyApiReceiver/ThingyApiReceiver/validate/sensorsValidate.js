'use strict'

var joi = require('joi');

var SensorsModel = require('../models/sensorsModel');

function SensorsValidate() { };
SensorsValidate.prototype = (function () {
    return {
        getSensordata: {
            params: (function path() {
                var sensorSchema = new SensorsModel().schema;
                return {
                    sensor_name: sensorSchema.sensor_name.required()
                };
            })()
        },
        insertSensorsData: {
            payload: (function path() {
                var sensorSchema = new SensorsModel().schema;
                return {
                    sensors: sensorSchema.sensors.required(),
                    timestamp: sensorSchema.timestamp.required()
                };
            })(),
            params: (function path() {
                var sensorSchema = new SensorsModel().schema;
                return {
                    thingy_Id: sensorSchema.thingy_Id.required()
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
