var fs = require('fs');
var axios = require('axios');
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
var params = {user_id: '550124146', count: 20};

client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {

      for(var tweet in tweets){

        var quote = tweets[tweet].is_quote_status;
        var retweeted = tweets[tweet].retweeted;

        if (quote === true) {

          let imglinks = tweets[tweet].quoted_status.user.profile_image_url_https;
          let imglinkl = imglinks.replace("_normal", "");
          let twitterhandle = tweets[tweet].quoted_status.user.screen_name;
		  let handlestring = twitterhandle.toLowerCase();
          let path = "_cache/" + handlestring + ".jpg";

          axios({
            method: 'get',
            url: imglinkl,
            responseType: 'stream'
          })
          .then(function (response) {
            response.data.pipe(fs.createWriteStream(path))
            console.log("File saved: " + path)
          });

        }
        if (retweeted === true) {

          let imglinks = tweets[tweet].retweeted_status.user.profile_image_url_https;
          let imglinkl = imglinks.replace("_normal", "");
          let twitterhandle = tweets[tweet].retweeted_status.user.screen_name;
		  let handlestring = twitterhandle.toLowerCase();
          let path = "_cache/" + handlestring + ".jpg";

          axios({
            method: 'get',
            url: imglinkl,
            responseType: 'stream'
          })
          .then(function (response) {
            response.data.pipe(fs.createWriteStream(path))
            console.log("File saved: " + path)
          });

        }
        
      };
      
    }
});
