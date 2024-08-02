const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/admin");
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addLayoutAlias('default', 'blog-post.njk');

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes"
    },
    markdownTemplateEngine: "njk", // Use Nunjucks for Markdown files
    dataTemplateEngine: "njk", // Use Nunjucks for JSON or YAML data
    htmlTemplateEngine: "njk", // Use Nunjucks for HTML files
  };
  
};
