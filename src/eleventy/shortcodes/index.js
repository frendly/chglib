import dayjs from 'dayjs';

const now = String(dayjs().valueOf());

/**
 * Регистрирует shortcodes в Eleventy
 * @param {Object} eleventyConfig - Конфигурация Eleventy
 */
export function registerShortcodes(eleventyConfig) {
  /** Add cache busting with {% version %} time string */
  eleventyConfig.addShortcode("version", function () {
    return now;
  });
}
