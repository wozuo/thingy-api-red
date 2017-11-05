'use strict';

var joi = require('joi');

function UserClothesModel() {
	this.schema = {
		userId: joi.number().integer().positive(),
    aocId: joi.number().integer().positive(),
    fromTemp: joi.number().precision(2),
    toTemp: joi.number().precision(2),
		aocDesc: joi.string().max(40)
	};
};

module.exports = UserClothesModel;
