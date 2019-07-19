const timestamp = new Date()

module.exports = {
  environment: process.env.ENVIRONMENT,
  timestamp: timestamp,
  id: timestamp.valueOf()
};