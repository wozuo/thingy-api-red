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
