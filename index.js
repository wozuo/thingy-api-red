'use strict';

const hapi = require('hapi');
const routes = require('./routes');
const hapiSwagger = require('hapi-swagger');
const inert = require('inert');
const vision = require('vision');

const server = new hapi.Server();

server.connection({
    host: '0.0.0.0',
    port: 5000
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

server.start((error) => {
  if (error) {
    throw error;
  }
  console.log('Server running at:', server.info.uri);
})
