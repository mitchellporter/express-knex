'use strict';

const Promise = require('bluebird');
const bodyParser = require('body-parser');
const morgan = require('morgan')('dev');

const api = require('./app/api/api');
const express = require('express');
const app = express();


// middleware
app.use(morgan);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// routes
app.use('/api/' + config.api_version, api);

// errors
app.use((err, req, res, next) => {
    console.log(err);
    res.send(err);
});

// Server setup
var server = app.listen(config.port, () => {
    logger.silly('pid: ' + process.pid + ' listening on port:' + config.port);
});

// Shutdown
var gracefulShutdown = () => {
    logger.silly('Received SIGTERM signal, shutting down express server');
    server.close();
}

process.on('SIGTERM', gracefulShutdown);

server.on('close', () => {
    logger.silly('Express server closed.. about to cleanup connections');

    mongoose.disconnect();
});
