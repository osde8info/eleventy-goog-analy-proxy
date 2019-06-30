var fs = require('fs');
var Twitter = require('twitter');
require('dotenv').config()

// https://developer.twitter.com/en/apps
// https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
var params = {user_id: '550124146', count: 5};

module.exports = async function() {
  return client.get('statuses/user_timeline', params)
    .catch((err) => {
      console.error(err);
    });
}
