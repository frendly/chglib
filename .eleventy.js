const { EleventyRenderPlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const esbuild = require("./esbuild.config")

const now = String(Date.now());

module.exports = function(eleventyConfig) {
  // Enable quiet mode to reduce console noise
  eleventyConfig.setQuietMode(true);

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // https://www.11ty.dev/docs/plugins/render/#renderfile
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // Copy all images directly to dist.
  eleventyConfig.addPassthroughCopy({"src/assets/images": "/assets/images"});
  // Copy robots.txt, etc to dist.
  eleventyConfig.addPassthroughCopy({"src/assets/static/*": "/"});

  // Add cache busting with {% version %} time string
  eleventyConfig.addShortcode('version', function () {
    return now;
  });

  // Build JS and CSS assets
  eleventyConfig.on("beforeBuild", esbuild);

  eleventyConfig.addWatchTarget("./src/assets/");

  eleventyConfig.addNunjucksGlobal("NODE_ENV", process.env.NODE_ENV);

  return {
    templateFormats: [ "md", "njk", "html" ],
    dir: {
      input: "pages",
      output: "dist",
      includes: "../src/_includes",
      data: "../src/_data",
      layouts: "../src/_includes/layouts",
    },
  }
}
