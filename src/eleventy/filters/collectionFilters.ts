import dayjs from 'dayjs';
import type { EleventyCollectionItem } from '@/types/eleventy';

/**
 * Фильтр обрезает коллекцию
 * @param array - Массив для обрезки
 * @param limit - Количество элементов для возврата
 * @returns Обрезанный массив
 * @example {{ collection | limit(2) }}
 */
export const limit = <T>(array: T[] | undefined, limit: number): T[] => {
  return array?.slice(0, limit) || [];
};

/**
 * Фильтр для создания архива по годам
 * Извлекает годы из коллекции и сортирует их по убыванию (новые первыми)
 * @param collection - Коллекция с годами в качестве ключей
 * @returns Массив лет, отсортированных по возрастанию
 * @example {{ collections.benexByYear | getYears }}
 */
export const getYears = function (collection: Record<string, unknown> | undefined): string[] {
  return Object.keys(collection || {})
    .map(year => parseInt(year))
    .sort((a, b) => a - b) /** сортировка по возрастанию */
    .map(year => year.toString());
};

/**
 * Фильтр для получения всех новостей из всех лет
 * Объединяет новости из всех годов в один массив и сортирует по дате (новые первыми)
 * @param newsByYear - Объект с новостями, сгруппированными по годам
 * @returns Массив всех новостей, отсортированных по дате (новые первыми)
 * @example {{ collections.newsByYear | getAllNews }}
 */
export const getAllNews = function (newsByYear: Record<string, EleventyCollectionItem[]> | undefined): EleventyCollectionItem[] {
  if (!newsByYear || typeof newsByYear !== 'object') {
    return [];
  }

  /** объединяем все новости из всех лет в один массив */
  const allNews = Object.values(newsByYear).flat();

  /** сортируем по дате (новые первыми) */
  return allNews.sort((a, b) => {
    const dateA = a.date ? dayjs(a.date) : dayjs(0);
    const dateB = b.date ? dayjs(b.date) : dayjs(0);

    /** сортировка по убыванию (новые первыми) */
    return dateB.valueOf() - dateA.valueOf();
  });
};
