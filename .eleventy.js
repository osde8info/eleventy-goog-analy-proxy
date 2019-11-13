const dotenv = require("dotenv");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const moment = require('moment');
const pluginTOC = require('eleventy-plugin-nesting-toc');

module.exports = function(eleventyConfig) {

  eleventyConfig.addLayoutAlias("article", "layouts/article.njk");

  // Collections: Articles
  eleventyConfig.addCollection('articles_en', function(collection) {
    return collection.getFilteredByGlob('./src/articles-en/*').filter(function(item) { return !!item.data.permalink; });
  });
  eleventyConfig.addCollection('articles_de', function(collection) {
    return collection.getFilteredByGlob('./src/articles-de/*').filter(function(item) { return !!item.data.permalink; });
  });

  // Twitter: Exclude answers
  eleventyConfig.addFilter("tweetExcludeAnswers", obj => {
    const result = obj.filter(el => el.text.charAt(0) !== "@");
    return result;
  });
  
  // Twitter: Remove link
  eleventyConfig.addFilter("tweetRemoveLink", obj => {
    const result = obj.replace(/https:\/\/t.co\/\S*/gm, "");
    return result;
  });

  // Add/remove hash
  eleventyConfig.addFilter("addHash", obj => {
    var result = "#" + obj;
    return result;
  });
  eleventyConfig.addFilter("removeHash", obj => {
    var result = obj.replace(/# /g, "");
    return result;
  });
  
  // Webmention Filter: By URL
  eleventyConfig.addFilter("webmentionsByUrl", function(webmentions, url) {
    const allowedTypes = ['mention-of', 'in-reply-to']
    const allowedHTML = {
        allowedTags: ['b', 'i', 'em', 'strong', 'a'],
        allowedAttributes: {
            a: ['href']
        }
    }

    const orderByDate = (a, b) =>
        new Date(a.published) - new Date(b.published)

    const checkRequiredFields = entry => {
        const { author, published, content } = entry
        return !!author && !!author.name && !!published && !!content
    }

    const clean = entry => {
        const { html, text } = entry.content

        if (html && html.length > 2000) {
            // really long html mentions, usually newsletters or compilations
            entry.content.value = `mentioned this in <a href="${entry.url}">${entry.url}</a>`
        } else {
            entry.content.value = html ? sanitizeHTML(html, allowedHTML) : sanitizeHTML(text, allowedHTML)
        }

        return entry
    }

    return webmentions
        .filter(entry => entry['wm-target'] === url)
        .filter(entry => allowedTypes.includes(entry['wm-property']))
        .filter(checkRequiredFields)
        .sort(orderByDate)
        .map(clean)
  });

  // Custom slug
  eleventyConfig.addFilter("pslug", obj => {
    var result = obj.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=_'`~()]/g, '').replace(/\s+/g, '-');
    return result;
  });

  // Date formatting
  eleventyConfig.addFilter("date", function(dateObj, fromformat , toformat, language = "en") { 
    return moment(dateObj, fromformat).locale(language).format(toformat);
  });
  
  // Shortcode Icons
  eleventyConfig.addShortcode("icon", function(iconName, useInline) {
    const spriteUrl = '/assets/icons/icons.sprite.svg'
    const iconId = `#icon-${iconName}`
    const href = useInline ? iconId : spriteUrl + iconId

    return `<svg class="icon icon-${iconName}" role="img" aria-hidden="true" width="24" height="24">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="${href}"></use>
            </svg>`
  });

  // Shortcode Images
  eleventyConfig.addShortcode("image", function(url, alt) {
    return `<img src="${url}" alt="${alt}" />`
  });

  // Shortcode Link
  eleventyConfig.addShortcode("link", function(link, text, target) {
    if (target == undefined) { return `<a href="${link}">${text}</a>` }
    if (target !== undefined ) { return `<a href="${link}" target="_blank" rel="noopener">${text}</a>` }
  });

  // Passthroughs
  eleventyConfig.addPassthroughCopy("src/assets/favicons");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/assets/media");

  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);

  const tocopts = {
    tags: ['h2', 'h3', 'h4'],
    wrapper: 'nav',
    wrapperClass: 'toc-nav',
    headingText: 'Navigation',
    headingTag: 'h2'
  }
  eleventyConfig.addPlugin(pluginTOC, tocopts);
  
  // Markdown Plugins
  let markdownIt = require("markdown-it");
  let markdownItAnchor = require('markdown-it-anchor');
  let emoji = require('markdown-it-emoji')

  let options = {
    html: true,
	  xhtmlOut: true,
    breaks: true,
    linkify: false,
	  typographer: true
  };
  let anchoroptions = {
    permalink: true,
    permalinkSymbol: '#',
    permalinkClass: 'heading-anchor',
    permalinkBefore: true,
    level: 2,
    slugify: s =>
        encodeURIComponent(
            'h-' +
                String(s)
                    .trim()
                    .toLowerCase()
                    .replace(/[.,\/#!$%\^&\*;:{}=_'`~()]/g, '')
                    .replace(/\s+/g, '-')
        )
  };

  // Markdown Parsing
  eleventyConfig.setLibrary( 
    'md', 
    markdownIt(options)
      .use(markdownItAnchor, anchoroptions)
      .use(emoji)
  );

  return {
    templateFormats: [ "md", "njk", "html" ],
	  pathPrefix: "/",
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };

};