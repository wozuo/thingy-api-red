'use strict';

var hapi = require('hapi');
const db = require('../db');

function AocController(){};
AocController.prototype = (function() {
  return {
    getAOC: function getAOC(request, reply) {
      db.get().query('SELECT aoc_id, description FROM clothes', function (error, results) {
        if (error) {
          console.log('Internal Server Error: ' + error)
          reply('Internal Server Error:').code(500);
        } else {
          var result = [];
          for (var i = 0; i < results.length; i++) {
            result.push({
              aocId: results[i].aoc_id,
              aocDesc: results[i].description
            });
          }
          reply(result).code(200);
        }
      })
    }
  }
})();

var aocController = new AocController();
module.exports = aocController;
