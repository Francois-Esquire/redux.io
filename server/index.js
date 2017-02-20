'use strict';

const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT = 3000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

require('./io')(io, app);

server.listen(PORT, function() {
  console.log(`Express server is up on port ${server.address().port}.`);
});

module.exports = { app, server, io };
