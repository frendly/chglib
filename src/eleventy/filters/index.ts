import type { EleventyConfig } from '@/types/eleventy';
import { getHumanDate, getHumanDateWithYear, getSitemapDate } from './dateFilters';
import { limit, getYears, getAllNews, hasPrefix } from './collectionFilters';

/**
 * Регистрирует фильтры в Eleventy
 * @param eleventyConfig - Конфигурация Eleventy
 */
export function registerFilters(eleventyConfig: EleventyConfig): void {
  /** Фильтры для дат */
  eleventyConfig.addFilter("getHumanDate", getHumanDate);
  eleventyConfig.addFilter("getHumanDateWithYear", getHumanDateWithYear);
  eleventyConfig.addFilter("getSitemapDate", getSitemapDate);

  /** Фильтры для коллекций */
  eleventyConfig.addNunjucksFilter("limit", limit);
  eleventyConfig.addNunjucksFilter("getYears", getYears);
  eleventyConfig.addNunjucksFilter("getAllNews", getAllNews);

  /** Фильтры для строк */
  eleventyConfig.addNunjucksFilter("hasPrefix", hasPrefix);
}
