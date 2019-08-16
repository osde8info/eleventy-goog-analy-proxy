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

  // Date formatting
  eleventyConfig.addFilter("date", function(dateObj, fromformat , toformat, language = "en") { 
    return moment(dateObj, fromformat).locale(language).format(toformat);
  });

  // Passthroughs
  eleventyConfig.addPassthroughCopy("src/assets/favicons");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

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
                    .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, '')
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