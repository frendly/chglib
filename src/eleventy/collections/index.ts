import type { EleventyConfig } from '#types/eleventy';
import { makeBENexCollection } from './makeBENexCollection.ts';
import { makeBNPCollection } from './makeBNPCollection.ts';
import { makeCollection } from './makeCollection.ts';
import { makeSubjexCollection } from './makeSubjexCollection.ts';

/**
 * Регистрирует коллекции в Eleventy
 * @param eleventyConfig - Конфигурация Eleventy
 */
export function registerCollections(eleventyConfig: EleventyConfig): void {
  /** папки для создания авто-коллекций */
  /** @see makeCollection */
  const folders = ['news'];
  folders.forEach((folderName) => {
    eleventyConfig.addCollection(`${folderName}ByYear`, (collection) =>
      makeCollection(collection, folderName)
    );
  });

  /** коллекция для BENex (использует другую функцию, т.к. файлы не датированные) */
  eleventyConfig.addCollection('benexByYear', (collection) =>
    makeBENexCollection(collection, 'BENex')
  );

  /** коллекция для BNP (использует другую функцию, т.к. файлы не датированные) */
  eleventyConfig.addCollection('bnpByYear', (collection) => makeBNPCollection(collection, 'BNP'));

  /** коллекция для subjex (использует другую функцию, т.к. файлы не датированные) */
  eleventyConfig.addCollection('subjexByYear', (collection) =>
    makeSubjexCollection(collection, 'subjex')
  );
}
