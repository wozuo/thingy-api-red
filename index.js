'use strict';

const hapi = require('hapi');
const routes = require('./routes');
const hapiSwagger = require('hapi-swagger');
const inert = require('inert');
const vision = require('vision');
const db = require('./db');

const server = new hapi.Server();

server.connection({
    host: '0.0.0.0',
    port: process.env.PORT || 3000
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
            description: 'User operations',
            name: 'users'
        }
    ]
}

server.register([
    inert,
    vision,
    {
        register: hapiSwagger,
        options: swaggerOptions
    }
]);

for (var route in routes) {
  server.route(routes[route]);
}

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
})
