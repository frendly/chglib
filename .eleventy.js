// .eleventy.ts
import path from "path";
import { EleventyRenderPlugin } from "@11ty/eleventy";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import buildAssets from "./build-assets.js";
var now = String(Date.now());
var makeCollection = (collection, folderName) => {
  const files = collection.getFilteredByGlob(`./pages/${folderName}/**/*.md`);
  return files.reduce((years, post) => {
    const year = path.dirname(post.inputPath).split("/").pop();
    if (!years[year]) {
      years[year] = [];
    }
    years[year].unshift(post);
    return years;
  }, {});
};
function eleventy_default(eleventyConfig) {
  eleventyConfig.setQuietMode(true);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "/assets/images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/static/*": "/" });
  const folders = ["news"];
  folders.forEach((folderName) => {
    eleventyConfig.addCollection(
      `${folderName}ByYear`,
      (collection) => makeCollection(collection, folderName)
    );
  });
  eleventyConfig.addFilter("getHumanDate", function(dateObj) {
    const date = new Date(dateObj);
    const options = {
      // Type options
      day: "2-digit",
      month: "long"
    };
    return date.toLocaleDateString("ru-RU", options);
  });
  eleventyConfig.addNunjucksFilter(
    "limit",
    (array, limit) => (
      // Type array and limit
      array.slice(0, limit)
    )
  );
  eleventyConfig.addGlobalData(
    "getGlobalCurrentYear",
    (/* @__PURE__ */ new Date()).getFullYear().toString()
  );
  eleventyConfig.addShortcode("version", function() {
    return now;
  });
  eleventyConfig.on("beforeBuild", buildAssets);
  eleventyConfig.addWatchTarget("./src/assets/");
  return {
    templateFormats: ["md", "njk", "html"],
    dir: {
      input: "pages",
      output: "dist",
      includes: "../src/_includes",
      data: "../src/_data",
      layouts: "../src/_includes/layouts"
    }
  };
}
export {
  eleventy_default as default
};
