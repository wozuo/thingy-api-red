'use strict';

var joi = require('joi');

function UserModel() {
	this.schema = {
		userId: joi.number().integer().positive(),
        username: joi.string().max(20),
        password_hash: joi.string().max(80),
        access_tocken: joi.string().max(80)
	};
};

module.exports = UserModel;
