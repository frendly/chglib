import dayjs from 'dayjs';
import 'dayjs/locale/ru.js';
import { DATE_FORMAT_HUMAN, DATE_FORMAT_HUMAN_WITH_YEAR } from '@/const/dateFormats';

dayjs.locale('ru');

/**
 * Отображает дату в человеко-понятном виде, например 11 февраля
 * @param dateObj - Объект даты или строка с датой
 * @returns Отформатированная дата
 * @example {{ post.date | getHumanDate }}
 */
export const getHumanDate = function (dateObj: Date | string): string {
  return dayjs(dateObj).format(DATE_FORMAT_HUMAN);
};

/**
 * Отображает дату в человеко-понятном виде с годом, например 11 февраля 2025
 * @param dateObj - Объект даты или строка с датой
 * @returns Отформатированная дата с годом
 * @example {{ post.date | getHumanDateWithYear }}
 */
export const getHumanDateWithYear = function (dateObj: Date | string): string {
  return dayjs(dateObj).format(DATE_FORMAT_HUMAN_WITH_YEAR);
};

/**
 * Отображает дату в формате ISO 8601 (RFC 3339) для sitemap.xml
 * @param dateObj - Объект даты или строка с датой
 * @returns Отформатированная дата в формате YYYY-MM-DDTHH:mm:ss+00:00
 * @example {{ page.date | getSitemapDate }}
 */
export const getSitemapDate = function (dateObj: Date | string | undefined): string {
  if (!dateObj) {
    return dayjs().toISOString();
  }
  return dayjs(dateObj).toISOString();
};
