function uuidv4() { return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)); }
const uuid = uuidv4();
const useragent = navigator.userAgent;
const title = document.title;
const url = window.location.origin + window.location.pathname + window.location.search;
const referrer = document.referrer;
const language = navigator.language || navigator.userLanguage;

const sitedata = {
  uuid: uuid,
  useragent: useragent,
  title: title,
  url: url,
  referrer: referrer,
  language: language
}
console.log(sitedata);

function senddata(data) {
  return fetch('/.netlify/functions/send', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    // console.log(response)
  })
}

senddata(sitedata).catch((error) => {
  console.log('Error: ', error)
})