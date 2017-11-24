'use strict';

var Joi = require('joi');
function SensorsModel() {
    this.schema = {
        timestamp: Joi.string(),
        sensors: Joi.object().keys({
        temperature: Joi.number(),
        pressure: Joi.number(),
        color: Joi.object().keys({ red: Joi.number(), green: Joi.number(), blue: Joi.number(), clear: Joi.number() }),
        humidity: Joi.number(),
        gas: Joi.object().keys({ eco2: Joi.number(), tvoc: Joi.number() })
        })
    };
};

module.exports = SensorsModel;
