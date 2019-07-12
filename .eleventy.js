const dotenv = require("dotenv");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const moment = require('moment');

module.exports = function(eleventyConfig) {

  eleventyConfig.addLayoutAlias("article", "layouts/article.njk");

  // Collections: Articles
  eleventyConfig.addCollection('articles', function(collection) {
    return collection.getFilteredByGlob('./src/articles/*').filter(function(item) {
      // Only include items with a permalink.
      return !!item.data.permalink;
    });
  });

  // Date formatting
  eleventyConfig.addFilter("articleHumanDate", dateObj => {
    return moment(dateObj, "YYYY-MM-DDTHH:mm:ssZZ").format('Do MMMM YYYY');
  });
  
  eleventyConfig.addFilter("articleMachineDate", dateObj => {
    return moment(dateObj, "YYYY-MM-DDTHH:mm:ssZZ").format('YYYY-MM-DDTHH:mm:ssZZ');
  });

  eleventyConfig.addFilter("tweetMachineDate", dateObj => {
    return moment(dateObj, "ddd MMM D HH:mm:ss ZZ YYYY").format('YYYY-MM-DDTHH:mm:ssZZ');
  });

  eleventyConfig.addFilter("tweetHumanDate", dateObj => {
    return moment(dateObj, "ddd MMM D HH:mm:ss ZZ YYYY").format('Do MMMM YYYY');
  });

  // Passthroughs
  eleventyConfig.addPassthroughCopy("src/assets/favicons");
  eleventyConfig.addPassthroughCopy("src/sw.js");

  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);
  
  // Markdown Plugins
  let markdownIt = require("markdown-it");
  let options = {
    html: true,
	  xhtmlOut: true,
    breaks: true,
    linkify: true,
	  typographer: true
  };
  let opts = {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#"
  };

  return {
    templateFormats: [ "md", "njk", "html" ],
	  pathPrefix: "/",
    markdownTemplateEngine: "liquid",
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