const express = require('express');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.listen(3000, () => {
  console.log('Listening on port 3000 for pallets.');
});