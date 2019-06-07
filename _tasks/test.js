var fs = require('fs');
var Twitter = require('twitter');
const axios = require('axios');
require('dotenv').config()

// https://developer.twitter.com/en/apps
// https://developer.twitter.com/en/docs/tweets/timelines/api-reference/get-statuses-user_timeline
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
var params = {user_id: '550124146', count: 10};

/*
module.exports = async function() {
    return client.get('statuses/user_timeline', params)
      .catch((err) => {
        console.error(err);
      });
}
*/

client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {

        for(var tweet in tweets){

            if (tweets[tweet].is_quote_status === true) {

                console.log("is_quote_status is true");

                var idstr = tweets[tweet].id_str;
                var imglink = tweets[tweet].quoted_status.user.profile_image_url_https;
                var imglinklarge = imglink.replace("_normal", "");

                axios({
                    method: 'get', 
                    url: imglinklarge,
                    responseType: 'stream'
                })
                .then(function (response) {
                    response.data.pipe(fs.createWriteStream(idstr + ".jpg"))
                    console.log("done")
                });

            }
        
        };
        
    }
});
