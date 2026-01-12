import { getHumanDate, getHumanDateWithYear } from './dateFilters.js';
import { limit, getYears, getAllNews } from './collectionFilters.js';

/**
 * Регистрирует фильтры в Eleventy
 * @param {Object} eleventyConfig - Конфигурация Eleventy
 */
export function registerFilters(eleventyConfig) {
  /** Фильтры для дат */
  eleventyConfig.addFilter("getHumanDate", getHumanDate);
  eleventyConfig.addFilter("getHumanDateWithYear", getHumanDateWithYear);

  /** Фильтры для коллекций */
  eleventyConfig.addNunjucksFilter("limit", limit);
  eleventyConfig.addNunjucksFilter("getYears", getYears);
  eleventyConfig.addNunjucksFilter("getAllNews", getAllNews);
}
