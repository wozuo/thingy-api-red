'use strict';

const mysql = require('mysql');

var pool;

exports.connect = function(done) {
  pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });
  done();
}

exports.get = function() {
  return pool;
}

exports.sample = function() {
  pool.query('SELECT user_id, username FROM users WHERE user_id = 1', function (error, results, fields) {
    if (error) {
      console.log('not found' + error);
    }
    if (results.length == 1) {
      var result = {
        id: results[0].user_id,
        username: results[0].username,
        url: server.info.uri + '/users/' + results[0].user_id
      };
      console.log('Found user: ' + result);
    } else {
      console.log('not found');
    }
  })
}
