'use strict';

var joi = require('joi');

function AuthModel() {
	this.schema = {
		userId: joi.number().integer().positive(),
		token: joi.string().max(50)
	};
};

module.exports = AuthModel;
