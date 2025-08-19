import path from "path";
import { EleventyRenderPlugin } from "@11ty/eleventy";
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import buildAssets from "./build-assets.js"; // Points to the compiled .ts output
import type { UserConfig, CollectionItem } from "@11ty/eleventy"; // Import UserConfig and CollectionItem

const now: string = String(Date.now());

// Define a type for the 'years' accumulator object in makeCollection
interface YearCollection {
  [year: string]: CollectionItem[];
}

// Define a type for the collection API object passed to makeCollection
interface EleventyCollectionApi {
  getFilteredByGlob(glob: string): CollectionItem[];
}

const makeCollection = (collection: EleventyCollectionApi, folderName: string): YearCollection => {
  const files: CollectionItem[] = collection.getFilteredByGlob(`./pages/${folderName}/**/*.md`);
  return files.reduce((years: YearCollection, post: CollectionItem) => {
    const year = path.dirname(post.inputPath).split("/").pop() as string; // Ensure year is string
    if (!years[year]) {
      years[year] = [];
    }
    years[year].unshift(post);
    return years;
  }, {});
};

export default function (eleventyConfig: UserConfig): UserConfig { // Type eleventyConfig and return type
  eleventyConfig.setQuietMode(true);
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig.addPassthroughCopy({ "src/assets/images": "/assets/images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/static/*": "/" });

  const folders: string[] = ["news"];
  folders.forEach((folderName: string) => {
    eleventyConfig.addCollection(`${folderName}ByYear`, (collection: EleventyCollectionApi) =>
      makeCollection(collection, folderName)
    );
  });

  eleventyConfig.addFilter("getHumanDate", function (dateObj: string | Date): string { // Type dateObj
    const date = new Date(dateObj);
    const options: Intl.DateTimeFormatOptions = { // Type options
      day: "2-digit",
      month: "long",
    };
    return date.toLocaleDateString("ru-RU", options);
  });

  eleventyConfig.addNunjucksFilter("limit", (array: any[], limit: number): any[] => // Type array and limit
    array.slice(0, limit)
  );

  eleventyConfig.addGlobalData(
    "getGlobalCurrentYear",
    new Date().getFullYear().toString()
  );

  eleventyConfig.addShortcode("version", function (): string {
    return now;
  });

  // Type the buildAssets function if its signature is known, otherwise any
  // Assuming buildAssets is async () => Promise<void> as per build-assets.ts
  eleventyConfig.on("beforeBuild", buildAssets as () => Promise<void>);

  eleventyConfig.addWatchTarget("./src/assets/");

  // Ensure the return object matches Eleventy's expected config structure (implicitly typed by UserConfig return type)
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
}
