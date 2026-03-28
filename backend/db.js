const knex = require('knex');
const knexFile = require('./knexfile');

// Initialize knex with the development configuration
const db = knex(knexFile.development);

module.exports = db;
