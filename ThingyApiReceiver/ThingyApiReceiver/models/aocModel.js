'use strict';

var joi = require('joi');

function AocModel() {
	this.schema = {
		aocId: joi.number().integer().positive(),
		aocDesc: joi.string().max(40)
	};
};

module.exports = AocModel;
