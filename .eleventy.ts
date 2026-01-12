import "tsx/esm";
// @ts-expect-error - Eleventy не предоставляет официальных типов TypeScript
import { EleventyRenderPlugin } from "@11ty/eleventy";
// @ts-expect-error - Eleventy Navigation не предоставляет официальных типов TypeScript
import eleventyNavigationPlugin from "@11ty/eleventy-navigation";

import type { EleventyConfig, EleventyConfigReturn } from './src/types/eleventy';
import buildAssets from "./build-assets";
import { registerCollections, registerFilters, registerShortcodes, registerGlobalData } from './src/eleventy';

export default function (eleventyConfig: EleventyConfig): EleventyConfigReturn {
  /** Enable quiet mode to reduce console noise */
  eleventyConfig.setQuietMode(true);

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  /**
   * EleventyRenderPlugin добавляет поддержку тега {% renderFile %} в Nunjucks шаблонах.
   * Позволяет рендерить содержимое других файлов (.md, .njk, .html) внутри шаблонов
   * с обработкой front matter и шаблонизацией.
   * Используется в pages/libweb/resbnc/index.njk для вставки Markdown файлов.
   * @see https://www.11ty.dev/docs/plugins/render/#renderfile
   */
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
}
