const express = require('express') = require('express');
const app = express();
const db = require('./db');
const port = 3000;

app.listen(port);
console.log(`Listening on port ${port}`);