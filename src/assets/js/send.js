const timestamp = Date.now();
const useragent = navigator.userAgent;
const title = document.title;
const url = window.location.hostname + window.location.pathname;
const parameter = window.location.search;
const referrer = document.referrer;
const language = navigator.language || navigator.userLanguage;

const sitedata = {
  timestamp: timestamp,
  useragent: useragent,
  title: title,
  url: url,
  parameter: parameter,
  referrer: referrer,
  language: language
}

function senddata(data) {
  return fetch('/.netlify/functions/send', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

senddata(sitedata).then((response) => {
  console.log('API response', response)
}).catch((error) => {
  console.log('API error', error)
})