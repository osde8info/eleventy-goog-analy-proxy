var fs = require('fs');
var Twitter = require('twitter');
require('dotenv').config()

// https://developer.twitter.com/en/apps
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
var params = {screen_name: 'dennisview', count: 10};

client.get('statuses/user_timeline', params, function(error, tweets, response) {
  if (!error) {
    var recentTweets = [];
    for(var tweet in tweets){
      var t = {
        text: tweets[tweet].text,
        url: "https://twitter.com/dennisview/status/" + tweets[tweet].id_str,
        date:  tweets[tweet].created_at,
      };
      // Not sharing direct mentions
      if(t.text.charAt(0) !== "@"){
        recentTweets.push(t);
      }
    }

    var json = JSON.stringify(recentTweets, null, 2);
    fs.writeFile('src/_data/tweets.json', json, function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("Tweets data saved.");
      }
    });

  }
});