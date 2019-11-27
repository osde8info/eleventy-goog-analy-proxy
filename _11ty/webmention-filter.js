module.exports = {
    getWebmentionsForUrl: (webmentions, url) => {
      return webmentions.children.filter(entry => entry['wm-target'] === url)
    },
    isOwnWebmention: (webmention) => {
      const urls = [
        'https://www.d-hagemeier.com',
        'https://twitter.com/dennisview'
      ]
      const authorUrl = webmention.author ? webmention.author.url : false
      // check if a given URL is part of this site.
      return authorUrl && urls.includes(authorUrl)
    },
    size: (mentions) => {
      return !mentions ? 0 : mentions.length
    },
    webmentionsByType: (mentions, mentionType) => {
      return mentions.filter(entry => !!entry[mentionType])
    }
}