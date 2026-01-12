/**
 * Регистрирует глобальные данные в Eleventy
 * @param {Object} eleventyConfig - Конфигурация Eleventy
 */
export function registerGlobalData(eleventyConfig) {
  /** текущий год доступен глобально */
  eleventyConfig.addGlobalData(
    "getGlobalCurrentYear",
    new Date().getFullYear().toString()
  );
}
