'use strict';

const Promise = require('bluebird');
const bodyParser = require('body-parser');
const morgan = require('morgan')('dev');
const chalk = require('chalk');

var pg = require('knex')({
  client: 'pg',
  connection: 'postgres://localhost:5432/express-knex',
  searchPath: 'knex,public',
  debug: true,
  pool: {
    afterCreate: function (conn, done) {
        console.log('afterCreate called');
      // in this example we use pg driver's connection API
      conn.query('SET timezone="UTC";', function (err) {
        if (err) {
          // first query failed, return error and don't try to make next query
          console.log(chalk.red(`connection error: ${err}`));
          done(err, conn);
        } else {
            console.log(chalk.green('connection successful'));
            done(null, conn);
        }
      });
    }
  }
});

// const api = require('./app/api/api');
const express = require('express');
const app = express();

// middleware
app.use(morgan);
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// routes
// app.use('/api/' + config.api_version, api);

// errors
app.use((err, req, res, next) => {
    console.log(chalk.red(err));
    res.send(err);
});

// Server setup
var server = app.listen(3000, () => {
    console.log('pid: ' + process.pid + ' listening on port:' + 3000);
});

// Shutdown
var gracefulShutdown = () => {
    console.log('Received SIGTERM signal, shutting down express server');
    server.close();
}

process.on('SIGTERM', gracefulShutdown);

server.on('close', () => {
    console.log('Express server closed.. about to cleanup connections');
});
