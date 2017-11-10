'use strict';

var Joi = require('joi');
function SensorsValuesModel() {
    this.schema = {
        sensor_name: Joi.string(),
    };
};

module.exports = SensorsValuesModel;
