module.exports = function (eleventyConfig) {
  // Blog is deferred — keep the source in src/blog/ but don't publish it yet.
  // To re-enable: delete the next line and re-add the Blog entry to
  // src/_data/site.js `nav`.
  eleventyConfig.ignores.add("src/blog");

  // Static assets pass straight through to the site root, mirroring the
  // pre-build layout so paths like /site.css and /assets/... keep working.
  eleventyConfig.addPassthroughCopy({ "src/site.css": "site.css" });
  eleventyConfig.addPassthroughCopy({ "src/site.js": "site.js" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });

  // Active-nav + breadcrumb helper.
  eleventyConfig.addFilter("startsWith", (value, prefix) =>
    String(value).startsWith(prefix)
  );

  // Human-readable post date, e.g. "23 April 2026".
  eleventyConfig.addFilter("readableDate", (value) =>
    new Date(value).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  // ISO date (YYYY-MM-DD) for <time datetime> and sitemap <lastmod>.
  eleventyConfig.addFilter("isoDate", (value) =>
    new Date(value).toISOString().slice(0, 10)
  );

  // Newest-first blog ordering.
  eleventyConfig.addCollection("posts", (collectionApi) =>
    collectionApi.getFilteredByTag("post").reverse()
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};
