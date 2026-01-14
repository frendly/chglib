import path from "path";
import type { EleventyCollection, EleventyCollectionItem } from '@/types/eleventy';

/**
 * Создает коллекцию для BNP на основе папок
 * Например bnpByYear = { 2025: [{}], 2024: [{}], ... }
 * @param collection - Коллекция Eleventy
 * @param folderName - Имя папки для создания коллекции
 * @returns Объект с годами в качестве ключей и массивами постов в качестве значений
 */
export const makeBNPCollection = (collection: EleventyCollection, folderName: string): Record<string, EleventyCollectionItem[]> => {
  const files = collection.getFilteredByGlob(`./pages/${folderName}/**/*.md`);
  return files.reduce((years, post) => {
    /**
     * В коллекцию попадают только файлы с маской 'bnp*.md'
     * - Извлекаем год из пути к папке
     * - Сортируем файлы по имени (bnp01, bnp02, ...)
     */
    const fileName = path.basename(post.filePathStem);
    if (!fileName.startsWith('bnp')) {
      return years;
    }

    const year = path.dirname(post.inputPath).split("/").pop() || '';
    if (!years[year]) years[year] = [];

    /** добавляем в начало для обратного порядка (новые первыми) */
    years[year].unshift(post);
    return years;
  }, {} as Record<string, EleventyCollectionItem[]>);
};
