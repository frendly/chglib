import path from "path";
import dayjs from 'dayjs';

/**
 * Создает коллекции на основе папок
 * Например newsByYear = { 2025: [{}], 2024: [{}], ... }
 * @param {Object} collection - Коллекция Eleventy
 * @param {string} folderName - Имя папки для создания коллекции
 * @returns {Object} Объект с годами в качестве ключей и массивами постов в качестве значений
 */
export const makeCollection = (collection, folderName) => {
  const files = collection.getFilteredByGlob(`./pages/${folderName}/**/*.md`);
  return files.reduce((years, post) => {
    /**
     * В коллекцию попадают только файлы с маской 'YYYY-MM-DD'
     * - Проверяем валидность даты
     */
    const date = dayjs(post.fileSlug, 'YYYY-MM-DD', true);
    if (!date.isValid()) {
      return years;
    }

    const year = path.dirname(post.inputPath).split("/").pop();
    if (!years[year]) years[year] = [];

    /** добавляем в начало */
    // years[year].push(post);
    years[year].unshift(post);
    return years;
  }, {});
};
