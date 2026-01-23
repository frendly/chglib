import path from 'node:path';
import dayjs from 'dayjs';
import { DATE_FORMAT_ISO } from '@/const/dateFormats';
import type { EleventyCollection, EleventyCollectionItem } from '@/types/eleventy';

/**
 * Создает коллекции на основе папок
 * Например newsByYear = { 2025: [{}], 2024: [{}], ... }
 * @param collection - Коллекция Eleventy
 * @param folderName - Имя папки для создания коллекции
 * @returns Объект с годами в качестве ключей и массивами постов в качестве значений
 */
export const makeCollection = (
  collection: EleventyCollection,
  folderName: string
): Record<string, EleventyCollectionItem[]> => {
  const files = collection.getFilteredByGlob(`./pages/${folderName}/**/*.md`);
  return files.reduce(
    (years, post) => {
      /**
       * В коллекцию попадают только файлы с маской 'YYYY-MM-DD'
       * - Проверяем валидность даты
       */
      const date = dayjs(post.fileSlug, DATE_FORMAT_ISO, true);
      if (!date.isValid()) {
        return years;
      }

      const year = path.dirname(post.inputPath).split('/').pop() || '';
      if (!years[year]) years[year] = [];

      /** добавляем в начало */
      // years[year].push(post);
      years[year].unshift(post);
      return years;
    },
    {} as Record<string, EleventyCollectionItem[]>
  );
};
