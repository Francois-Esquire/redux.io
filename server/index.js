'use strict';

const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT = 3000;

const PUBLIC_PATH = process.env.PUBLIC_PATH = path.join(__dirname, '../public');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(require('body-parser').json());

app.use(express.static(PUBLIC_PATH));

app.use('/*', (req, res, next) => {
  app.sendFile('index.html');
}

server.listen(PORT, function() {
  console.log(`Express server is up on port ${server.address().port}.`);
});

module.exports = { app, server, io };
