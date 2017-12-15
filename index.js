'use strict';

require('dotenv').config();

const hapi = require('hapi');
const routes = require('./routes');
const hapiSwagger = require('hapi-swagger');
const inert = require('inert');
const vision = require('vision');
const db = require('./db');
const authBearer = require('hapi-auth-bearer-token');
const validateToken = require('./validate/validateToken');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const server = new hapi.Server();

server.connection({
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
	  routes: {
      cors: true
    }
});

const swaggerOptions = {
    info: {
        'title': 'Thingy API',
        'version': '1.0',
        'description': 'A RESTful API for ASE 2017',
    },
    documentationPath: '/doc',
    tags: [
        {
            description: 'User Endpoints',
            name: 'users'
        },
        {
          description: 'Recommendation Endpoints',
          name: 'recom'
        },
        {
          description: 'User Clothes Endpoints',
          name: 'user_clothes'
        },
        {
          description: 'Clothes Endpoints',
          name: 'clothes'
        },
        {
          description: 'Authentication Endpoints',
          name: 'auth'
        },
		    {
          description: 'Sensors Endpoints',
          name: 'Sensors'
        }
    ],
    grouping: 'tags',
    securityDefinitions: {
        Bearer: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
            'x-keyPrefix': 'Bearer '
        }
    },
    security: [{ Bearer: [] }]
}

server.register(
  [
    inert,
    vision,
    {
      register: hapiSwagger,
      options: swaggerOptions
    },
    authBearer
  ],
  function (error) {
    server.auth.strategy('bearer', 'bearer-access-token', {
      allowQueryToken: true,
      accessTokenName: 'access_token',
      validateFunc: validateToken.validateFunction
    });
    //server.auth.default('bearer');
    for (var route in routes) {
      server.route(routes[route]);
    }
    // Google Login Callback Route
    server.route({
      method: 'GET',
      path: '/callback',
      handler: function (request, reply) {
        // For Google Login
        if(request.query.code === undefined) {
          console.log("Undefined")
          reply()
        } else {
          console.log(request.query.code)
          var url = 'https://www.googleapis.com/oauth2/v4/token?code=' + request.query.code + '&client_id=' + process.env.GOOGLE_CID + '&client_secret=' + process.env.GOOGLE_SECRET + '&redirect_uri=https://wicked-pumpkin-99140.herokuapp.com/callback&grant_type=authorization_code';
          var req = new XMLHttpRequest();
          req.open("POST", url, false);
          req.send();
          var result = JSON.parse(req.responseText);
          reply(result)
        }
      }
    });
    // Google Login Refresh Token Route
    server.route({
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
    });
  }
);

db.connect(function(error) {
  if (error) {
    throw error;
  } else {
    console.log('Connected to database');
    server.start((error) => {
      if (error) {
        throw error;
      }
      console.log('Server running at:', server.info.uri);
    })
  }
});
