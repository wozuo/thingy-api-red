'use strict';

const hapi = require('hapi');
const server = new hapi.Server();
server.connection({host: 'localhost', port: 3000});

server.start((error) => {
  if (error) {
    throw error;
  }
  console.log('Started server at: ${server.info.uri}');
})
