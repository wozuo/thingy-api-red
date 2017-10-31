'use strict';

const mysql = require('mysql');
const async = require('async');

var pool;

exports.connect = function(done) {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_DATABASE,
    password: process.env.DB_USERNAME,
    database: process.env.DB_PASSWORD
  });
  done();
}

exports.get = function() {
  return pool;
}
