const timestamp = new Date()
require('dotenv').config()

module.exports = {
  environment: process.env.ENVIRONMENT,
  timestamp: timestamp
};