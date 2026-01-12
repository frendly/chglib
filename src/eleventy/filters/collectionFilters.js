/**
 * Фильтр обрезает коллекцию
 * @param {Array} array - Массив для обрезки
 * @param {number} limit - Количество элементов для возврата
 * @returns {Array} Обрезанный массив
 * @example {{ collection | limit(2) }}
 */
export const limit = (array, limit) => {
  return array?.slice(0, limit);
};

/**
 * Фильтр для создания архива по годам
 * Извлекает годы из коллекции и сортирует их по убыванию (новые первыми)
 * @param {Object} collection - Коллекция с годами в качестве ключей
 * @returns {Array<string>} Массив лет, отсортированных по возрастанию
 * @example {{ collections.benexByYear | getYears }}
 */
export const getYears = function (collection) {
  return Object.keys(collection || {})
    .map(year => parseInt(year))
    .sort((a, b) => a - b) /** сортировка по возрастанию */
    .map(year => year.toString());
};

/**
 * Фильтр для получения всех новостей из всех лет
 * Объединяет новости из всех годов в один массив и сортирует по дате (новые первыми)
 * @param {Object} newsByYear - Объект с новостями, сгруппированными по годам
 * @returns {Array} Массив всех новостей, отсортированных по дате (новые первыми)
 * @example {{ collections.newsByYear | getAllNews }}
 */
export const getAllNews = function (newsByYear) {
  if (!newsByYear || typeof newsByYear !== 'object') {
    return [];
  }

  /** объединяем все новости из всех лет в один массив */
  const allNews = Object.values(newsByYear).flat();

  /** сортируем по дате (новые первыми) */
  return allNews.sort((a, b) => {
    const dateA = a.date ? new Date(a.date) : new Date(0);
    const dateB = b.date ? new Date(b.date) : new Date(0);
    return dateB - dateA; /** сортировка по убыванию (новые первыми) */
  });
};
