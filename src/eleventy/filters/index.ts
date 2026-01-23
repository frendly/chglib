import type { EleventyConfig } from '@/types/eleventy';
import { getBreadcrumbs } from './breadcrumbs';
import { getAllNews, getYears, hasPrefix, limit } from './collectionFilters';
import { getHumanDate, getHumanDateWithYear, getSitemapDate } from './dateFilters';

/**
 * Регистрирует фильтры в Eleventy
 * @param eleventyConfig - Конфигурация Eleventy
 */
export function registerFilters(eleventyConfig: EleventyConfig): void {
  /** Фильтры для дат */
  eleventyConfig.addFilter('getHumanDate', getHumanDate);
  eleventyConfig.addFilter('getHumanDateWithYear', getHumanDateWithYear);
  eleventyConfig.addFilter('getSitemapDate', getSitemapDate);

  /** Фильтры для коллекций */
  eleventyConfig.addNunjucksFilter('limit', limit);
  eleventyConfig.addNunjucksFilter('getYears', getYears);
  eleventyConfig.addNunjucksFilter('getAllNews', getAllNews);

  /** Фильтры для строк */
  eleventyConfig.addNunjucksFilter('hasPrefix', hasPrefix);

  /** Фильтры для навигации */
  eleventyConfig.addNunjucksFilter('getBreadcrumbs', getBreadcrumbs);
}
