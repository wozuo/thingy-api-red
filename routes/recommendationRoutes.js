'use strict';

var recommendationController = require('../controllers/recommendationController');
var recommendationValidate = require('../validate/recommendationValidate');
var RecommendationModel = require('../models/recommendationModel');
var joi = require('joi');

module.exports = function() {
  return [
    {
      method: 'GET',
      path: '/users/{user_id}/recommendations',
      config: {
        auth: 'bearer',
        tags: ['api', 'recom'],
        description: 'Get recommendations for a user',
        handler: recommendationController.getRecom,
        validate: recommendationValidate.getRecom,
        plugins: {'hapi-swagger': {responses: {
          200: {
            description: 'Success',
            schema: joi.array().items(new RecommendationModel().schema)
          },
          404: {
            description: 'User or thingy data not found'
          }
        }}}
      }
    },
    {
      method: 'GET',
      path: '/users/{user_id}/recommendations/forecast/{google_at}',
      config: {
        auth: 'bearer',
        tags: ['api', 'recom'],
        description: 'Get forecast recommendations for a user',
        handler: recommendationController.getForecast,
        validate: recommendationValidate.getForecast,
        plugins: {'hapi-swagger': {responses: {
          200: {
            description: 'Success',
            schema: joi.array().items(new RecommendationModel().schema)
          },
          404: {
            description: 'User or thingy data not found'
          }
        }}}
      }
    }
  ];
}();
