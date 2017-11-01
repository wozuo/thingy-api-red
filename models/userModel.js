'use strict';

var joi = require('joi');

function UserModel() {
	this.schema = {
		userId: joi.number().integer(),
		username: joi.string().max(20)
	};
};

function UserResponseModel() {
	this.schema = {
		userId: joi.number().integer(),
		username: joi.string().max(20),
		url: joi.string()
	};
};

module.exports = UserModel;
module.exports = UserResponseModel;
