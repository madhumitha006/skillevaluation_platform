const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

module.exports = {
  mongoSanitize: () => mongoSanitize(),
  xss: () => xss()
};