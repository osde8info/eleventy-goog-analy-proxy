function uuidv4() { return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)); }
const uuid = uuidv4();
const useragent = navigator.userAgent;
const title = document.title;
const origin = window.location.origin;
const pathname = window.location.pathname;
const search = window.location.search;
const referrer = document.referrer;
const language = navigator.language || navigator.userLanguage;

const sitedata = {
  uuid: uuid,
  useragent: useragent,
  title: title,
  origin: origin,
  pathname: pathname,
  search: search,
  referrer: referrer,
  language: language
}

function senddata(data) {
  return fetch('/.netlify/functions/send', {
    body: JSON.stringify(data),
    method: 'POST'
  })
}

senddata(sitedata).catch((error) => {
  console.log('Error: ', error)
})