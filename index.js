'use strict';

require('dotenv').config();

const hapi = require('hapi');
const routes = require('./routes');
const hapiSwagger = require('hapi-swagger');
const inert = require('inert');
const vision = require('vision');
const db = require('./db');
const authBearer = require('hapi-auth-bearer-token');

const server = new hapi.Server();

server.connection({
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
	  routes: {
      cors: true
    }
});

for (var route in routes) {
  server.route(routes[route]);
}

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
          description: 'Sensors Endpoints',
          name: 'Sensors'
        }
    ],
    grouping: 'tags'
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
    server.auth.strategy('simple', 'bearer-access-token', {
      allowQueryToken: true,
      validate: async (request, token, h) => {

        // TODO: Validate token
        const isValid = token === '1234';
        const credentials = { token };
        const artifacts = { test: 'info' };
        return { isValid, credentials, artifacts };
      }
    });
    server.auth.default('simple');
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
