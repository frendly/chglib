import dayjs from 'dayjs';
import 'dayjs/locale/ru.js';
import { DATE_FORMAT_HUMAN, DATE_FORMAT_HUMAN_WITH_YEAR } from '../../const/dateFormats';

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
