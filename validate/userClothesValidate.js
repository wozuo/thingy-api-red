'use strict'

var joi = require('joi');

var UserClothesModel = require('../models/userClothesModel');

function UserClothesValidate(){};
UserClothesValidate.prototype = (function() {
  return {
    getClothesOfUser: {
      params: (function path() {
        var userClothesSchema = new UserClothesModel().schema;
        return {
          user_id: userClothesSchema.userId.required()
        };
      })()
    },
    addAOCToUser: {
      params: (function path() {
        var userClothesSchema = new UserClothesModel().schema;
        return {
          user_id: userClothesSchema.userId.required(),
          aoc_id: userClothesSchema.aocId.required()
        };
      })(),
      payload: (function path() {
        var userClothesSchema = new UserClothesModel().schema;
        return {
          fromTemp: userClothesSchema.fromTemp.required(),
          toTemp: userClothesSchema.toTemp.required()
        };
      })()
    },
    editAOCOfUser: {
      params: (function path() {
        var userClothesSchema = new UserClothesModel().schema;
        return {
          user_id: userClothesSchema.userId.required(),
          aoc_id: userClothesSchema.aocId.required()
        };
      })(),
      payload: (function path() {
        var userClothesSchema = new UserClothesModel().schema;
        return {
          fromTemp: userClothesSchema.fromTemp.required(),
          toTemp: userClothesSchema.toTemp.required()
        };
      })()
    },
    deleteAOCOfUser: {
      params: (function path() {
        var userClothesSchema = new UserClothesModel().schema;
        return {
          user_id: userClothesSchema.userId.required(),
          aoc_id: userClothesSchema.aocId.required()
        };
      })()
    }
  }
})();

var userClothesValidate = new UserClothesValidate();
module.exports = userClothesValidate;
