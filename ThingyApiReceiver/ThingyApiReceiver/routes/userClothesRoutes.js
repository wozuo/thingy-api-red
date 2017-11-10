'use strict';

var userClothesController = require('../controllers/userClothesController');
var userClothesValidate = require('../validate/userClothesValidate');
var UserClothesModel = require('../models/userClothesModel');
var joi = require('joi');

module.exports = function() {
  return [
    {
      method: 'GET',
      path: '/users/{user_id}/clothes',
      config: {
        tags: ['api', 'user_clothes'],
        description: 'Get all clothes assigned to user',
        handler: userClothesController.getClothesOfUser,
        validate: userClothesValidate.getClothesOfUser,
        plugins: {'hapi-swagger': {responses: {
          200: {
            description: 'Success',
            schema: joi.array().items(new UserClothesModel().schema)
          },
          404: {
            description: 'Clothes for user not found.'
          }
        }}}
      }
    },
    {
      method: 'POST',
      path: '/users/{user_id}/clothes/{aoc_id}',
      config: {
        tags: ['api', 'user_clothes'],
        description: 'Assign an article of clothing to a user',
        handler: userClothesController.addAOCToUser,
        validate: userClothesValidate.addAOCToUser,
        plugins: {'hapi-swagger': {responses: {
          201: {
            description: 'Success',
            schema: joi.array().items(new UserClothesModel().schema)
          },
          404: {
            description: 'User or article of clothing not found. Or no article of clothing for user found.'
          },
          409: {
            description: 'Conflict: Article of clothing is already assigned to user.'
          }
        }}}
      }
    },
    {
      method: 'PUT',
      path: '/users/{user_id}/clothes/{aoc_id}',
      config: {
        tags: ['api', 'user_clothes'],
        description: 'Update an article of clothing for a user',
        handler: userClothesController.editAOCOfUser,
        validate: userClothesValidate.editAOCOfUser,
        plugins: {'hapi-swagger': {responses: {
          200: {
            description: 'Success',
            schema: joi.array().items(new UserClothesModel().schema)
          },
          404: {
            description: 'Article of clothing not found'
          }
        }}}
      }
    },
    {
      method: 'DELETE',
      path: '/users/{user_id}/clothes/{aoc_id}',
      config: {
        tags: ['api', 'user_clothes'],
        description: 'Delete an article of clothing from a user',
        handler: userClothesController.deleteAOCOfUser,
        validate: userClothesValidate.deleteAOCOfUser,
        plugins: {'hapi-swagger': {responses: {
          204: {
            description: 'Success'
          },
          404: {
            description: 'UArticle of clothing not found'
          }
        }}}
      }
    }
  ];
}();
