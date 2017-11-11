'use strict';

var Joi = require('joi');
function sensorGetDataModel() {
    this.schema = {
        thingy_id: Joi.string(),
    };
};

module.exports = sensorGetDataModel;

