'use strict';

const hapi = require('hapi');
const routes = require('./routes');

const server = new hapi.Server();
server.connection({
    host: '127.0.0.1',
    port: 5000
});

for (var route in routes) {
  server.route(routes[route]);
}

server.start((error) => {
  if (error) {
    throw error;
  }
  console.log('Server running at:', server.info.uri);
})
