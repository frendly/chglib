import { EleventyRenderPlugin } from "@11ty/eleventy";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import buildAssets from "./build-assets.js";
import { registerCollections } from './src/eleventy/collections/index.js';
import { registerFilters } from './src/eleventy/filters/index.js';
import { registerShortcodes } from './src/eleventy/shortcodes/index.js';
import { registerGlobalData } from './src/eleventy/globalData.js';

export default function (eleventyConfig) {
  /** Enable quiet mode to reduce console noise */
  eleventyConfig.setQuietMode(true);

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  /** https://www.11ty.dev/docs/plugins/render/#renderfile */
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  /** Copy all images directly to dist. */
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "/assets/images" });
  /** Copy robots.txt, etc to dist. */
  eleventyConfig.addPassthroughCopy({ "src/assets/static/*": "/" });

  /** Регистрация коллекций, фильтров, shortcodes и глобальных данных */
  registerCollections(eleventyConfig);
  registerFilters(eleventyConfig);
  registerShortcodes(eleventyConfig);
  registerGlobalData(eleventyConfig);

  /** Build JS and CSS assets */
  eleventyConfig.on("beforeBuild", buildAssets);

  eleventyConfig.addWatchTarget("./src/assets/");

  return {
    templateFormats: ["md", "njk", "html"],
    dir: {
      input: "pages",
      output: "dist",
      includes: "../src/_includes",
      data: "../src/_data",
      layouts: "../src/_includes/layouts",
    },
  };
};
