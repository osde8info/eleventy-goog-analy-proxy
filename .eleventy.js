const dotenv = require("dotenv");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const moment = require('moment');
const pluginTOC = require('eleventy-plugin-nesting-toc');
const customfilter = require('./_11ty/custom-filter');
const wmfilter = require('./_11ty/webmention-filter');

module.exports = function(eleventyConfig) {

  eleventyConfig.addLayoutAlias("article", "layouts/article.njk");

  // Collections: Articles
  eleventyConfig.addCollection('articles_en', function(collection) {
    return collection.getFilteredByGlob('./src/articles-en/*').filter(function(item) { return !!item.data.permalink; });
  });
  eleventyConfig.addCollection('articles_de', function(collection) {
    return collection.getFilteredByGlob('./src/articles-de/*').filter(function(item) { return !!item.data.permalink; });
  });

  // Filter
  Object.keys(customfilter).forEach(filterName => {
    eleventyConfig.addFilter(filterName, customfilter[filterName])
  })

  // Webmention Filter
  Object.keys(wmfilter).forEach(filterName => {
    eleventyConfig.addFilter(filterName, wmfilter[filterName])
  })
  
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
    return `<figure role="group">
              <picture>
                <source media="(min-width: 768px)" srcset="${url}-768.webp" type="image/webp">
                <source media="(max-width: 480px)" srcset="${url}-480.webp" type="image/webp">
                <source media="(max-width: 320px)" srcset="${url}-320.webp" type="image/webp">
                <source srcset="${url}-original.jpg" type="image/jpeg"> 
                <img src="${url}-original.jpg" alt="${alt}" loading="lazy">
              </picture>
              <figcaption>${alt}</figcaption>
            </figure>`
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