'use strict';

var joi = require('joi');

function RecommendationModel() {
	this.schema = {
		aocId: joi.number().integer().positive(),
		aocDesc: joi.string().max(40)
	};
};

module.exports = RecommendationModel;
