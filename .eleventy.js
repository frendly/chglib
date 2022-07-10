const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");
const { yamlPlugin } = require("esbuild-plugin-yaml");

const isProduction = process.env.ELEVENTY_ENV === 'production';
const now = String(Date.now());

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // Copy all images directly to dist.
  eleventyConfig.addPassthroughCopy({"src/assets/images": "/assets/images"});
  // Copy robots.txt, etc to dist.
  eleventyConfig.addPassthroughCopy({"src/assets/static/*": "/"});

  // Add cache busting with {% version %} time string
  eleventyConfig.addShortcode('version', function () {
    return now;
  });

  eleventyConfig.on("afterBuild", () => {
    return esbuild.build({
      entryPoints: ["src/assets/js/index.js", "src/assets/styles/index.scss"],
      bundle: true,
      outdir: "dist/assets",
      minify: isProduction,
      sourcemap: !isProduction,
      target: 'es6',
      plugins: [
        sassPlugin(),
        yamlPlugin(),
      ]
    });
  });
  eleventyConfig.addWatchTarget("./src/assets/");

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
