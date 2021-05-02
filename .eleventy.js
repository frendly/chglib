const fs = require("fs");
const path = require("path");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

const isProduction = process.env.ELEVENTY_ENV === 'production';

const assetPath = (value) => {
  if (isProduction) {
    const manifestPath = path.resolve(__dirname, "dist", "assets", 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath));
    return `/assets/${manifest[value]}`;
  }
  return `/assets/${value}`;
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Copy all images directly to dist.
  eleventyConfig.addPassthroughCopy({"src/assets/images": "images"});
  // Copy robots.txt, etc to dist.
  eleventyConfig.addPassthroughCopy({"src/assets/static/*": "/"});

  // Adds a universal shortcode to return the URL to a webpack asset in template
  eleventyConfig.addFilter('assetPath', assetPath);

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
