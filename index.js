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
          name: 'recommendations'
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
