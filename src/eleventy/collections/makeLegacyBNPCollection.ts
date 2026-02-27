import path from 'node:path';
import type { EleventyCollection, EleventyCollectionItem } from '@/types/eleventy';

/**
 * Создает коллекцию для LEGACY_BNP на основе папок
 * Например legacyBnpByYear = { 2025: [{}], 2024: [{}], ... }
 * @param collection - Коллекция Eleventy
 * @param folderName - Имя папки для создания коллекции
 * @returns Объект с годами в качестве ключей и массивами постов в качестве значений
 */
export const makeLegacyBNPCollection = (
  collection: EleventyCollection,
  folderName: string
): Record<string, EleventyCollectionItem[]> => {
  const files = collection.getFilteredByGlob(`./pages/${folderName}/**/*.html`);
  const yearGroups = files.reduce(
    (years, post) => {
      /**
       * В коллекцию попадают только файлы с маской 'bnp*.html'
       * - Извлекаем год из пути к папке
       * - Сортируем файлы по имени (bnp01, bnp02, ...)
       */
      const fileName = path.basename(post.filePathStem);
      if (!fileName.startsWith('bnp')) {
        return years;
      }

      const year = path.dirname(post.inputPath).split('/').pop() || '';
      if (!years[year]) years[year] = [];

      years[year].push(post);
      return years;
    },
    {} as Record<string, EleventyCollectionItem[]>
  );

  /** Сортируем файлы в каждом году: новые первыми (bnp46, bnp45, ... bnp02, bnp01) */
  Object.keys(yearGroups).forEach((year) => {
    yearGroups[year].sort((a, b) => {
      const fileNameA = path.basename(a.filePathStem);
      const fileNameB = path.basename(b.filePathStem);
      return fileNameB.localeCompare(fileNameA);
    });
  });

  return yearGroups;
};
