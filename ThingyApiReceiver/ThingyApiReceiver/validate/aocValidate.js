'use strict'

var joi = require('joi');

var AocModel = require('../models/aocModel');

function AocValidate(){};
AocValidate.prototype = (function() {
  return {
    // Reserved for future clothes endpoints
  }
})();

var aocValidate = new AocValidate();
module.exports = aocValidate;
