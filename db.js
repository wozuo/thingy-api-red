'use strict';

const mysql = require('mysql');

var pool;

exports.connect = function(done) {
  pool = mysql.createPool({
    //connectionLimit: 10,
    //host: process.env.DB_HOST,
    //user: process.env.DB_USERNAME,
    //password: process.env.DB_PASSWORD,
    //database: process.env.DB_DATABASE

      host: "us-cdbr-iron-east-05.cleardb.net",
      user: "bdd96dbef8384f",
      password: "816ee195",
      database: "heroku_5ce9a62dfd2216a"
  });
  done();
}

exports.get = function() {
  return pool;
}
