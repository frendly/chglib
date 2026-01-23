import dayjs from 'dayjs';
import type { EleventyConfig } from '@/types/eleventy';

const now = String(dayjs().valueOf());

/**
 * Регистрирует shortcodes в Eleventy
 * @param eleventyConfig - Конфигурация Eleventy
 */
export function registerShortcodes(eleventyConfig: EleventyConfig): void {
  /** Add cache busting with {% version %} time string */
  eleventyConfig.addShortcode('version', () => now);
}
