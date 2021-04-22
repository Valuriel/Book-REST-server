'use strict';

const Datastorage = require('./dataStorageLayer');

const db = new Datastorage();

db.getAll().then(console.log).catch(console.log);

db.get(1).then(console.log).catch(console.log);

db.get(100).then(console.log).catch(console.log);