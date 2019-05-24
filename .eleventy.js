const { DateTime } = require("luxon");
const dotenv = require("dotenv");

module.exports = function(eleventyConfig) {

  eleventyConfig.addLayoutAlias("article", "layouts/article.njk");

  // Collections: Articles
  eleventyConfig.addCollection('articles', function(collection) {
    return collection.getFilteredByGlob('./src/articles/*').filter(function(item) {
      // Only include items with a permalink.
      return !!item.data.permalink;
    });
  });

  // Date formatting (human readable)
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("dd LLL yyyy");
  });

  // Date formatting (machine readable)
  eleventyConfig.addFilter("machineDate", dateObj => {
    return DateTime.fromJSDate(dateObj).toFormat("yyyy-MM-dd");
  });

  eleventyConfig.addPassthroughCopy("src/assets/favicons");
  
  /* Markdown Plugins */
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