const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./src/admin");
  eleventyConfig.addPassthroughCopy("./src/assets");

  eleventyConfig.addNunjucksFilter("markdownify", (markdownString) =>
    md.render(markdownString),
  );

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj).toLocaleString(DateTime.DATE_MED);
  });

  // Add a global data filter to add the current page URL to the context
  eleventyConfig.addFilter("addCurrentUrl", function (url, page) {
    page.url = url;
    return page;
  });

  eleventyConfig.setBrowserSyncConfig({
      proxy: 'localhost:3000', // Proxy your Express server
      files: ['_site/**'] // Watch generated files
  });

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
