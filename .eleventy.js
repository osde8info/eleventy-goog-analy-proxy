const dotenv = require("dotenv");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const moment = require('moment');

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

  // Add hash to category titles
  eleventyConfig.addFilter("addHash", obj => {
    var result = "#" + obj;
    return result;
  });

  // Date formatting
  eleventyConfig.addFilter("articleHumanDate", dateObj => { return moment(dateObj, "YYYY-MM-DDTHH:mm:ssZZ").format('Do MMMM YYYY'); });
  eleventyConfig.addFilter("articleMachineDate", dateObj => { return moment(dateObj, "YYYY-MM-DDTHH:mm:ssZZ").format('YYYY-MM-DDTHH:mm:ssZZ'); });
  eleventyConfig.addFilter("tweetHumanDate", dateObj => { return moment(dateObj, "ddd MMM D HH:mm:ss ZZ YYYY").format('Do MMMM YYYY'); });
  eleventyConfig.addFilter("tweetMachineDate", dateObj => { return moment(dateObj, "ddd MMM D HH:mm:ss ZZ YYYY").format('YYYY-MM-DDTHH:mm:ssZZ'); });

  eleventyConfig.addFilter("articleHumanDateDE", dateObj => { return moment(dateObj, "YYYY-MM-DDTHH:mm:ssZZ").locale('de').format('Do MMMM YYYY'); });
  eleventyConfig.addFilter("tweetHumanDateDE", dateObj => { return moment(dateObj, "ddd MMM D HH:mm:ss ZZ YYYY").locale('de').format('Do MMMM YYYY'); });

  // Passthroughs
  eleventyConfig.addPassthroughCopy("src/assets/favicons");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
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