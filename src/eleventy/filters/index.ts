import type { EleventyConfig } from '@/types/eleventy';
import { getHumanDate, getHumanDateWithYear } from './dateFilters';
import { limit, getYears, getAllNews } from './collectionFilters';

/**
 * Регистрирует фильтры в Eleventy
 * @param eleventyConfig - Конфигурация Eleventy
 */
export function registerFilters(eleventyConfig: EleventyConfig): void {
  /** Фильтры для дат */
  eleventyConfig.addFilter("getHumanDate", getHumanDate);
  eleventyConfig.addFilter("getHumanDateWithYear", getHumanDateWithYear);

  /** Фильтры для коллекций */
  eleventyConfig.addNunjucksFilter("limit", limit);
  eleventyConfig.addNunjucksFilter("getYears", getYears);
  eleventyConfig.addNunjucksFilter("getAllNews", getAllNews);
}
