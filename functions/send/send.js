const fetch = require('node-fetch');
require('dotenv').config()

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  
  const data = JSON.parse(event.body);
  const whitelist = "d-hagemeier";
  const origin = data.origin;
  const url = origin + data.pathname + data.search;

  if (!origin.includes(whitelist)) {
    return { statusCode: 403, body: "Domain Not Whitelisted" };
  }
  
  const endpoint = "https://www.google-analytics.com/collect";
  const payload = encodeURI(`v=1&t=pageview&tid=UA-85526167-1&cid=${data.uuid}&ua=${data.useragent}&aip=1&ds=web&dl=${url}&dt=${data.title}&ul=${data.language}&dr=${data.referrer}`).replace(/\//g, '%2F');

  try {
      const response = await fetch(`${endpoint}?${payload}`, {
        method: 'POST',
        cache: 'no-cache'
      })
      if (response.ok) {
          console.log(`Status ${response.status}: ${response.statusText}`)
      }
  } catch (err) {
      console.error("Error: " + err)
  }

};