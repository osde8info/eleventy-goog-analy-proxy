---
title: "Cookie-free Google Analytics"
permalink: /en/articles/cookie-free-google-analytics/index.html
date: 2019-11-14T16:30:00-00:00
dateModified: 2019-11-14T16:30:00-00:00
tags: ["code", "marketing"]
excerpt: "Data protection-oriented, cookie-free tracking with Google Analytics through the use of the measurement protocol."

language: en
translation_en: /en/articles/cookie-free-google-analytics/
translation_de: /de/articles/cookiefreies-google-analytics/

seoindex: true
seotitle: "Cookie-free Google Analytics"
seodescription: "Data protection-oriented, cookie-free tracking with Google Analytics through the use of the measurement protocol."
---

Since the start of the GDPR I am looking for a cookie-free Google Analytics alternative. I am interested in which pages of my blog are accessed, where the visitors come from and, since the relaunch of my blog, what language they speak. I would also like to be able to view the data in aggregated form, for example as a simple dashboard. And since my blog is only my private pleasure, I don't want to pay a lot of money every month for the analysis data. All this is easy to do with Google Analytics - if it weren't for the GDPR.

## The problem

If I want to use Google Analytics in compliance with data protection regulations, I need the consent of the visitors. So I slap a banner in the face of a new user, "agree" or "disagree" as options. Only to then give his data to Google and make him traceable on numerous websites.

Another disadvantage: More and more people are using extensions like Ghostery to block Google Analytics directly when they visit a page. At the latest with the further development of the browsers (like the Intelligent Tracking Prevention in WebKit) the data becomes less and less reliable.

There are some alternatives to Google Analytics: Alternatives such as <a href="https://simpleanalytics.com/" target="_blank">Simple Analytics</a>, plugins such as <a href="https://de.wordpress.org/plugins/statify/" target="_blank">Statify</a> or switching to server log analysis tools, e.g. with <a href="https://www.netlify.com/products/analytics/" target="_blank">Netlify Analytics</a>. Most of them, however, cost money and limit me to the data collected with the corresponding tool. I'm a big fan of the Google Data Studio, so that I can also evaluate data from the Search Console and other sources at the same time.

I've even done experiments with Firestore. With my own tracking pixel I have stored the user data there - but then I have to build EVERYTHING by myself. From the simple bot filter to the sorting of sources into channels to the interface with the Data Studio.

So I want Google Analytics - only without cookies and GDPR-compliant.

## The solution: Cookie-free Google Analytics

With Google's standard tracking code, cookie-free tracking is not possible. The script automatically sets multiple cookies for user ID, timestamp or jump tracking.

So I use the second variant to import data to Google Analytics: The Measurement Protocol. Behind it nothing else hides than an interface for the transmission of raw data as HTTP request. If you want to play with the Measurement Protocol, you can go with the <a href="https://ga-dev-tools.appspot.com/hit-builder/" target="_blank">Hit Builder</a>.

The solution of the cookie-free Google Analytics script therefore consists in a POST request in which we pack a basic set of user data and pass it on to the Measurement Protocol. I decided to use this data:

1. User ID (Google requirement for a valid POST request)
2. User agent (for filtering bot traffic)
3. Page title
4. URL
5. Referrer
6. Set language

This way of tracking also has some disadvantages:

**Tracking is limited to page views.**

To save the complete browse history of a user, I would have to assign several page views to one user. Also works with the Measurement Protocol - but I would have to store a user ID as a cookie or in LocalStorage to keep the variable constant over several page views. However, this contradicts my basic idea of completely doing without cookies (and also without LocalStorage).

Instead, each page view generates a new user ID and starts a new session with every page change. This means: No page flow, no number of users (this is displayed, but equal to the page views), no entries or jumps. Every pageview is a new entry and every page change means a jump.

**No target group analysis**

I'm just transmitting a basic framework of information. Since I don't give Google enough information to chain several pageviews together and therefore no cross-page tracking is possible, I don't have any information about the target group. Means: No demographic data, no location, no interests and no network information.

However, I transfer the browser language used and the user agent also provides data on the device category and the browser.

**The referrer is transmitted correctly only for the first hit**.

Since every pageview means a new session, the referrer is only set correctly for the first hit of a user. For all further calls the website itself is the referrer, so for every further pageview the source is set as "direct".

An example: If a user finds my blog via Google and looks at the three pages "Articles", "Home" and "About", the sources would be:

- Articles: google/organic
- Home: direct
- About: direct

**More detailed tracking is only possible in a very cumbersome way**

Although events can also be transmitted via the Measurement Protocol, this option would be very cumbersome. If you depend on detailed tracking, you are wrong with this solution and should rather use the Google Tag Manager with customized triggers and events.

## Client side script

If I would send the data directly to Google via POST-Request, Google would get a lot of information in the body of the request. Also, many privacy browser extensions would block this request.

So I split the POST request and use a client side script and a server side script (the second as a proxy script).

### Variables used

First, I fill my client side file with the variables that I want to transfer later via POST request:

**User ID**

Google uses for the User-ID (later `cid`) a <a href="https://wikipedia.org/wiki/Universally_Unique_Identifier" target="_blank">Universally Unique Identifier</a>. This can be generated with the following function and saved as a constant:

```javascript
function uuidv4() { return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, *c* => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)); }
const uuid = uuidv4();
```

**Useragent**

```javascript
const useragent = navigator.userAgent;
```
**Seitentitel**

```javascript
const title = document.title;
```
**URL**

A regular URL consists of three parts: The domain ("https://www.d-hagemeier.com"), the path ("/en/articles/") and the parameters ("?utm_source=facebook&utm_medium=social"). I deliberately transmit them separately from each other so that I can access them individually later.

```javascript
// Domain
const origin = window.location.origin;
// Path
const pathname = window.location.pathname;
// Parameter
const search = window.location.search;
```
**Referrer**

```javascript
const referrer = document.referrer;
```
**Set language**

```javascript
const language = navigator.language || navigator.userLanguage;
```

For simplicity's sake, I then sum the data into a variable:

```javascript
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
```

### Post request

I use the `fetch-API` for the transmission as POST request. My endpoint for this is `/.netlify/functions/send`, because I use an AWS lambda function over Netlify for my server-side script. But this is not a must; for example a PHP endpoint would be possible, which passes the data to the measurement protocol.

```javascript
function senddata(data) {
  return fetch('/.netlify/functions/send', {
    body: JSON.stringify(data),
    method: 'POST'
  })
}

senddata(sitedata).catch((error) => {
  console.log('Error: ', error)
})
```

## Server side script

As already described, I use a Netlify function on the server side. 

I start with the query whether the call is a POST request - and forbid all other calls.

```javascript
if (event.httpMethod !== "POST") {
  return { statusCode: 405, body: "Method Not Allowed" };
}
```

Next I parse the transmitted files and save them in the constant `data`. Then I construct my payload and the endpoint.

```javascript
const url = data.origin + data.pathname + data.search;
const endpoint = "https://www.google-analytics.com/collect";
const payload = encodeURI(`v=1&t=pageview&tid=UA-85526167-1&cid=${data.uuid}&ua=${data.useragent}&aip=1&ds=web&dl=${url}&dt=${data.title}&ul=${data.language}&dr=${data.referrer}`).replace(/\//g, '%2F');
```

Now the actual POST request to Google follows. I output the status as `console.log` or `console.error`, both are displayed in the Netlify dashboard under the functions.

```javascript
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
```

**Attention**: To use the `fetch-API` in NodeJS, I need the corresponding <a href="https://www.npmjs.com/package/node-fetch" target="_blank">module</a>!

The complete variants of the <a href="https://github.com/dennishagemeier/d-hagemeier/blob/master/src/assets/js/send.js" target="_blank">Client side</a> and <a href="https://github.com/dennishagemeier/d-hagemeier/blob/master/functions/send/send.js" target="_blank">Server side scripts</a> can be found in my Github-Repository.

## Bonus: Data Studio Template

With these two files, the data is already exported to Google Analytics and can be filtered and evaluated there as usual. But I'm a fan of Google Data Studio, so I created a dashboard with the transferred data and the search queries from the Search Console.

You can view and copy the Data Studio <a href="https://datastudio.google.com/s/nNr0l5Et0PM" target="_blank">here</a>. Just swap the data sources and you have a good starting point for your own Data Studio.