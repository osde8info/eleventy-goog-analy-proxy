const fs = require('fs')
const fetch = require('node-fetch')
const unionBy = require('lodash/unionBy')
require('dotenv').config()

// Define Cache Location and API Endpoint
const CACHE_FILE_PATH = '_cache/webmentions.json'
const API = 'https://webmention.io/api'
const TOKEN = process.env.WEBMENTION_TOKEN;

async function fetchWebmentions(since, perPage = 10000) {

  let url = `${API}/mentions.jf2?token=${TOKEN}&per-page=${perPage}`
  if (since) url += `&since=${since}` // only fetch new mentions

  const response = await fetch(url)
  if (response.ok) {
    const feed = await response.json()
    console.log(`${feed.children.length} new webmentions fetched from ${API}`)
    return feed
  }

  return null
}

// Merge fresh webmentions with cached entries, unique per id
function mergeWebmentions(a, b) {
  return unionBy(a.children, b.children, 'wm-id')
}

// save combined webmentions in cache file
function writeToCache(data) {
  const dir = '_cache'
  const fileContent = JSON.stringify(data, null, 2)
  // create cache folder if it doesnt exist already
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  // write data to cache json file
  fs.writeFile(CACHE_FILE_PATH, fileContent, err => {
    if (err) throw err
    console.log(`webmentions cached to ${CACHE_FILE_PATH}`)
  })
}

// get cache contents from json file
function readFromCache() {
  if (fs.existsSync(CACHE_FILE_PATH)) {
    const cacheFile = fs.readFileSync(CACHE_FILE_PATH)
    return JSON.parse(cacheFile)
  }

  // no cache found.
  return {
    lastFetched: null,
    children: []
  }
}

module.exports = async function () {
  console.log('Reading webmentions from cache...');

  const cache = readFromCache()

  if (cache.children.length) {
    console.log(`${cache.children.length} webmentions loaded from cache`)
  }

  // Only fetch new mentions in production
  const environment = process.env.ENVIRONMENT;
  if (environment === 'prod') {
    console.log('Checking for new webmentions...');
    const feed = await fetchWebmentions(cache.lastFetched)
    if (feed) {
      const webmentions = {
        lastFetched: new Date().toISOString(),
        children: mergeWebmentions(cache, feed)
      }

      writeToCache(webmentions)
      return webmentions
    }
  }

  return cache
}