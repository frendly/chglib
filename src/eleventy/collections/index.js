import { makeCollection } from './makeCollection.js';
import { makeBENexCollection } from './makeBENexCollection.js';

/**
 * Регистрирует коллекции в Eleventy
 * @param {Object} eleventyConfig - Конфигурация Eleventy
 */
export function registerCollections(eleventyConfig) {
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
