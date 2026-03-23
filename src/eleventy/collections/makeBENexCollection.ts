import type { EleventyCollection, EleventyCollectionItem } from '#types/eleventy';
import { makeNumberedByYearCollection } from './makeNumberedByYearCollection.ts';

/**
 * Создает коллекцию для BENex на основе папок
 * Например benexByYear = { 2025: [{}], 2024: [{}], ... }
 * @param collection - Коллекция Eleventy
 * @returns Объект с годами в качестве ключей и массивами постов в качестве значений
 */
export const makeBENexCollection = (
  collection: EleventyCollection
): Record<string, EleventyCollectionItem[]> => {
  return makeNumberedByYearCollection({
    collection,
    folderName: 'BENex',
    fileNameIndexRegex: /^BENex(\d+)/i,
  });
};
