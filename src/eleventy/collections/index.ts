import type { EleventyConfig } from '@/types/eleventy';
import { makeCollection } from './makeCollection';
import { makeBENexCollection } from './makeBENexCollection';

/**
 * Регистрирует коллекции в Eleventy
 * @param eleventyConfig - Конфигурация Eleventy
 */
export function registerCollections(eleventyConfig: EleventyConfig): void {
  /** папки для создания авто-коллекций */
  /** @see makeCollection */
  const folders = ["news"];
  folders.forEach((folderName) => {
    eleventyConfig.addCollection(`${folderName}ByYear`, (collection) =>
      makeCollection(collection, folderName)
    );
  });

  /** коллекция для BENex (использует другую функцию, т.к. файлы не датированные) */
  eleventyConfig.addCollection("benexByYear", (collection) =>
    makeBENexCollection(collection, "BENex")
  );
}
