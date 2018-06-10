'use strict';

const env = process.env;

module.exports = {
  jitsu: {
    host: 'localhost',
    port: '5432',
    url: 'postgres://postgres:postgres@localhost:5432/jitsu',
    connector: 'postgresql',
  },
};
