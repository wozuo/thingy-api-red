'use strict';

var joi = require('joi');

function UserModel(){
	this.schema = {
		userId: joi.number().integer(),
		description: joi.string().max(255)
	};
};

module.exports = UserModel;
