'use strict';
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const db = require('../db');

/*
  Routes for a workaround to get Google login working on the client.
*/

module.exports = function() {
  return [
    {
      // Google Login Callback Route
      method: 'GET',
      path: '/callback',
      handler: function (request, reply) {
        // For Google Login
        if(request.query.code === undefined) {
          console.log("Undefined");
          reply();
        } else {
          console.log(request.query.code)
          let user_id = request.query.state;
          var url = 'https://www.googleapis.com/oauth2/v4/token?code=' + request.query.code + '&client_id=' + process.env.GOOGLE_CID + '&client_secret=' + process.env.GOOGLE_SECRET + '&redirect_uri=https://wicked-pumpkin-99140.herokuapp.com/callback&grant_type=authorization_code';
          var req = new XMLHttpRequest();
          req.open("POST", url, false);
          req.send();
          var result = JSON.parse(req.responseText);
          if(result.access_token === undefined || result.refresh_token === undefined) {
            console.log("Undefined token");
            reply();
          } else {
            db.get().query('INSERT INTO tokens VALUES (default, "' + user_id + '", "' + result.access_token + '", "' + result.refresh_token + '")', function (error, results) {
              if (error) {
                console.log('Internal Server Error: ' + error)
                reply('Internal Server Error:').code(500);
              } else {
                reply('Please open the app back up to complete the login process. Access token info: ' + result);
              }
            });
          }
        }
      }
    },
    {
      // Google Login Refresh Token Route
      method: 'GET',
      path: '/refresh',
      handler: function (request, reply) {
        // For Google Login
        if(request.query.refresh_token === undefined) {
          console.log("Undefined")
          reply("No Refresh Token Provided")
        } else {
          console.log(request.query.refresh_token)
          var url = 'https://www.googleapis.com/oauth2/v4/token?client_id=' + process.env.GOOGLE_CID + '&client_secret=' + process.env.GOOGLE_SECRET + '&refresh_token=' + request.query.refresh_token + '&grant_type=refresh_token';
          var req = new XMLHttpRequest();
          req.open("POST", url, false);
          req.send();
          var result = JSON.parse(req.responseText);
          reply(result)
        }
      }
    },
    {
      // Route to get tokens and then delete tokens so they are not saved on server (security reasons)
      method: 'GET',
      path: '/token',
      handler: function (request, reply) {
        // For Google Login
        if(request.query.user_id === undefined) {
          console.log("Undefined")
          var result = {
            error: 'Please provide a valid user_id'
          };
          reply(result);
        } else {
          db.get().query('SELECT user_id, access_token, refresh_token FROM tokens WHERE user_id = ?', request.query.user_id, function (error, results) {
            if (error) {
              console.log('User not found. Error: ' + error)
              var result = {
                error: 'Internal server error'
              };
              reply(result);
            } else {
              if (results.length == 0) {
                var result = {
                  error: 'No tokens found for this user'
                };
                reply(result);
              } else {
                var result = {
                  access_token: results[0].access_token,
                  refresh_token: results[0].refresh_token
                };
                db.get().query('DELETE FROM tokens WHERE user_id = "' + request.query.user_id + '"', function (error) {
                  if (error) {
                    console.log('Internal Server Error: ' + error)
                    reply('Internal Server Error:').code(500);
                  } else {
                    reply(result);
                  }
                })
              }
            }
          });
        }
      }
    }
  ];
}();
