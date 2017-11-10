'use strict';

var aocController = require('../controllers/aocController');
var aocValidate = require('../validate/aocValidate');
var AocModel = require('../models/aocModel');
var joi = require('joi');

module.exports = function() {
  return [
    {
      method: 'GET',
      path: '/clothes',
      config: {
        tags: ['api', 'clothes'],
        description: 'Get all clothes',
        handler: aocController.getAOC,
        plugins: {'hapi-swagger': {responses: {
          200: {
            description: 'Success',
            schema: joi.array().items(new AocModel().schema)
          }
        }}}
      }
    }
  ];
}();
