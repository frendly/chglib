import type { EleventyCollection, EleventyCollectionItem } from '#types/eleventy';
import { makeNumberedByYearCollection } from './makeNumberedByYearCollection.ts';

/**
 * Создает коллекцию для BNP на основе папок
 * Например bnpByYear = { 2025: [{}], 2024: [{}], ... }
 * @param collection - Коллекция Eleventy
 * @returns Объект с годами в качестве ключей и массивами постов в качестве значений
 */
export const makeBNPCollection = (collection: EleventyCollection): Record<string, EleventyCollectionItem[]> => {
  return makeNumberedByYearCollection({
    collection,
    folderName: 'BNP',
    fileNameIndexRegex: /^bnp(\d+)/i,
  });
};
