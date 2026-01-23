/**
 * Типы для Eleventy API
 *
 * Eleventy не предоставляет официальных типов TypeScript,
 * поэтому используются собственные объявления модулей.
 */
// biome-ignore-all lint/suspicious/noExplicitAny: Eleventy types are unknown
// biome-ignore-all lint/complexity/noBannedTypes: Eleventy uses generic Function types

declare module '@11ty/eleventy' {
  export class EleventyRenderPlugin {
    constructor();
  }
}

declare module '@11ty/eleventy-navigation' {
  const plugin: any;
  export default plugin;
}

export interface EleventyConfig {
  setQuietMode(enabled: boolean): void;
  addPlugin(plugin: any, options?: any): void;
  addPassthroughCopy(copy: string | Record<string, string>): void;
  addFilter(name: string, filter: Function): void;
  addNunjucksFilter(name: string, filter: Function): void;
  addShortcode(name: string, shortcode: Function): void;
  addCollection(name: string, collection: (collection: EleventyCollection) => any): void;
  addGlobalData(name: string, data: any): void;
  addLayoutAlias(from: string, to: string): void;
  on(event: string, callback: Function): void;
  addWatchTarget(target: string): void;
}

export interface EleventyCollection {
  getFilteredByGlob(glob: string): EleventyCollectionItem[];
}

export interface EleventyCollectionItem {
  fileSlug: string;
  filePathStem: string;
  inputPath: string;
  date?: Date | string;
  [key: string]: any;
}

export interface EleventyConfigReturn {
  templateFormats?: string[];
  dir?: {
    input?: string;
    output?: string;
    includes?: string;
    data?: string;
    layouts?: string;
  };
}

export type EleventyConfigFunction = (
  eleventyConfig: EleventyConfig
) => EleventyConfigReturn | undefined;
