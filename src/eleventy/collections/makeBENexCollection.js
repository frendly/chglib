import path from "path";

/**
 * Создает коллекцию для BENex на основе папок
 * Например benexByYear = { 2025: [{}], 2024: [{}], ... }
 * @param {Object} collection - Коллекция Eleventy
 * @param {string} folderName - Имя папки для создания коллекции
 * @returns {Object} Объект с годами в качестве ключей и массивами постов в качестве значений
 */
export const makeBENexCollection = (collection, folderName) => {
  const files = collection.getFilteredByGlob(`./pages/${folderName}/**/*.md`);
  return files.reduce((years, post) => {
    /**
     * В коллекцию попадают только файлы с маской 'BENex*.md'
     * - Извлекаем год из пути к папке
     * - Сортируем файлы по имени (BENex01, BENex02, ...)
     */
    const fileName = path.basename(post.filePathStem);
    if (!fileName.startsWith('BENex')) {
      return years;
    }

    const year = path.dirname(post.inputPath).split("/").pop();
    if (!years[year]) years[year] = [];

    /** добавляем в начало для обратного порядка (новые первыми) */
    years[year].unshift(post);
    return years;
  }, {});
};
