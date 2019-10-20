const knex = require('knex');

const knexfile = require('../knexfile');

const db = knex(knexfile[process.env.DB]);

module.exports = db;