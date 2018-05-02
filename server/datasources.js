'use strict';

const env = process.env;

module.exports = {
  jitsu: {
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    url: env.DATABASE_URL,
    connector: 'postgresql',
  },
};
