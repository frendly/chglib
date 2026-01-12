import dayjs from 'dayjs';
import 'dayjs/locale/ru.js';
import { DATE_FORMAT_HUMAN, DATE_FORMAT_HUMAN_WITH_YEAR } from '../../const/dateFormats.js';

dayjs.locale('ru');

/**
 * Отображает дату в человеко-понятном виде, например 11 февраля
 * @param {Date|string} dateObj - Объект даты или строка с датой
 * @returns {string} Отформатированная дата
 * @example {{ post.date | getHumanDate }}
 */
export const getHumanDate = function (dateObj) {
  return dayjs(dateObj).format(DATE_FORMAT_HUMAN);
};

/**
 * Отображает дату в человеко-понятном виде с годом, например 11 февраля 2025
 * @param {Date|string} dateObj - Объект даты или строка с датой
 * @returns {string} Отформатированная дата с годом
 * @example {{ post.date | getHumanDateWithYear }}
 */
export const getHumanDateWithYear = function (dateObj) {
  return dayjs(dateObj).format(DATE_FORMAT_HUMAN_WITH_YEAR);
};
