'use strict';

var hapi = require('hapi');
const db = require('../db');

function RecommendationController(){};
RecommendationController.prototype = (function() {
  return {
    getRecom: function getRecom(request, reply) {
      reply('TODO').code(200);
    }
  }
})();

var recommendationController = new RecommendationController();
module.exports = recommendationController;
