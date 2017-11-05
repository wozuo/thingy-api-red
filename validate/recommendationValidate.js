'use strict'

var joi = require('joi');

var UserModel = require('../models/userModel');

function RecommendationValidate(){};
RecommendationValidate.prototype = (function() {
  return {
    getRecom: {
      params: (function path() {
        var userSchema = new UserModel().schema;
        return {
          user_id: userSchema.userId.required()
        };
      })()
    }
  }
})();

var recommendationValidate = new RecommendationValidate();
module.exports = recommendationValidate;
