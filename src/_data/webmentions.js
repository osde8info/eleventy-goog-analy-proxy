/*

const fetch = require('node-fetch')
require('dotenv').config()

module.exports = async function() {
    const origin = 'https://webmention.io/api/mentions.jf2'
    const token = process.env.WEBMENTION_TOKEN
    const url = `${origin}?token=${token}`

    try {
        const response = await fetch(url)
        if (response.ok) {
            const feed = await response.json()
            return feed
        }
    } catch (err) {
        console.error(err)
        return null
    }
}

*/