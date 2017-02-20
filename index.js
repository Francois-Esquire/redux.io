'use strict';

const path = require('path');

const { app, server, io } = require('./server');

const PUBLIC_PATH = process.env.PUBLIC_PATH = path.join(__dirname, '../public');

app.use(require('body-parser').json());

app.use(express.static(PUBLIC_PATH));

app.use('/*', (req, res, next) => {
  res.sendFile(PUBLIC_PATH + '/index.html');
});
