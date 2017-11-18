'use strict';

const db = require('../db');

module.exports = {
  validateFunction: function (token, callback) {
    var request = this;
    db.get().query('SELECT access_token FROM users WHERE user_id = ?', request.params.user_id, function (error, results) {
      if (error) {
        console.log('Internal Server Error: ' + error)
        return callback(null, false, { token: token }, { });
      } else {
        if (results.length == 1) {
          if (token == results[0].access_token) {
            return callback(null, true, { token: token }, { });
          } else {
            return callback(null, false, { token: token }, { });
          }
        } else {
          return callback(null, false, { token: token }, { });
        }
      }
    })
  }
}
