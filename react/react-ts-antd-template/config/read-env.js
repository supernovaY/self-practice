'use strict';
const fs = require('fs');
const dotenv = require('dotenv');

let DOT_ENV = null;
module.exports = function() {
  if (DOT_ENV) {
    return DOT_ENV;
  }
  DOT_ENV = dotenv.parse(fs.readFileSync('.env'));
  let DOT_ENV_OVERRIDE = {};
  try {
    const envOverride = fs.statSync('.env.override');
    if (envOverride.isFile()) {
      DOT_ENV_OVERRIDE = dotenv.parse(fs.readFileSync('.env.override'));
    }
  } catch (error) {
    // 
  }
  const DOT_ENV_KEYS = Object.keys(DOT_ENV) || [];
  for (let i in DOT_ENV_OVERRIDE) {
    if (DOT_ENV_KEYS.indexOf(i) > -1) {
      DOT_ENV[i] = DOT_ENV_OVERRIDE[i];
    }
  }
  DOT_ENV.NODE_ENV = process.env.NODE_ENV;
  Object.assign(process.env, DOT_ENV);
  return DOT_ENV;
};
