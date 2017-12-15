'use strict';

var Joi = require('joi');
function forecastModel() {
    this.schema = {
        country: Joi.string(),
        city: Joi.string(),
        time: Joi.number()
    };
};

module.exports = forecastModel;

