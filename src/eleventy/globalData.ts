import dayjs from 'dayjs';
import type { EleventyConfig } from '../types/eleventy';
import meta from '../_data/meta';

/**
 * Регистрирует глобальные данные в Eleventy
 * @param eleventyConfig - Конфигурация Eleventy
 */
export function registerGlobalData(eleventyConfig: EleventyConfig): void {
  /** текущий год доступен глобально */
  eleventyConfig.addGlobalData(
    "getGlobalCurrentYear",
    dayjs().year().toString()
  );

  /** Регистрируем meta данные из TypeScript файла */
  eleventyConfig.addGlobalData("meta", meta);
}
