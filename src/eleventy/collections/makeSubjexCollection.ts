import type { EleventyCollection, EleventyCollectionItem } from '#types/eleventy';
import { makeNumberedByYearCollection } from './makeNumberedByYearCollection.ts';

/**
 * Создает коллекцию для subjex на основе папок
 * Например subjexByYear = { 2025: [{}], 2024: [{}], ... }
 * @param collection - Коллекция Eleventy
 * @returns Объект с годами в качестве ключей и массивами постов в качестве значений
 */
export const makeSubjexCollection = (
  collection: EleventyCollection
): Record<string, EleventyCollectionItem[]> => {
  // Файлы названы как subjNN.md (пример: subj01.md)
  return makeNumberedByYearCollection({
    collection,
    folderName: 'subjex',
    fileNameIndexRegex: /^subj(\d+)/i,
  });
};
