'use strict';

var joi = require('joi');

function UserModel() {
	this.schema = {
		userId: joi.number().integer().positive(),
		username: joi.string().max(20)
	};
};

module.exports = UserModel;
