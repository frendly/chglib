/**
 * Константы форматов дат для dayjs
 * Используются в Eleventy (backend) и frontend JavaScript
 */

/** Формат: ISO дата (YYYY-MM-DD) */
export const DATE_FORMAT_ISO = 'YYYY-MM-DD';

/** Формат: день и месяц (например, "11 февраля") */
export const DATE_FORMAT_HUMAN = 'D MMMM';

/** Формат: день, месяц и год (например, "11 февраля 2025") */
export const DATE_FORMAT_HUMAN_WITH_YEAR = 'D MMMM YYYY';

/** Формат: месяц и день (MM-DD) для парсинга */
export const DATE_FORMAT_MONTH_DAY = 'MM-DD';
