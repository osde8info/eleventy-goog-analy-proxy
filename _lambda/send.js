const fetch = require('node-fetch');
require('dotenv').config()

// https://ga-dev-tools.appspot.com/hit-builder/?v=1&t=pageview&tid=UA-85526167-1&cid=c1d6f00d-8b04-445c-9ea4-d7e8875044ec&ua=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F78.0.3904.87%20Safari%2F537.36&aip=1&ds=web&dl=https%3A%2F%2Fwww.d-hagemeier.com%2Fen%2Farticles%2Fembed-twitter%2F%3Futm_source%3Dnewsletter%26utm_medium%3Demail%26utm_campaign%3Dtestnewsletter&dt=Dies%20ist%20ein%20Titel&ul=en-US&dr=https%3A%2F%2Fwww.gmail.com%2F

exports.handler = async (event, context) => {
  const data = JSON.parse(event.body);
  const endpoint = "https://www.google-analytics.com/collect";
  const payload = encodeURI(`v=1&t=pageview&tid=UA-85526167-1&cid=${data.uuid}&ua=${data.useragent}&aip=1&ds=web&dl=${data.url}&dt=${data.title}&ul=${data.language}&dr=${data.referrer}`).replace(/\//g, '%2F');

  try {
      const response = await fetch(`${endpoint}?${payload}`, {
        method: 'POST',
        cache: 'no-cache'
      })
      if (response.ok) {
          const feed = await response.json()
          console.log(feed)
      }
  } catch (err) {
      console.error("Error: " + err)
  }

};