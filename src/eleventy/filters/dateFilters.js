/**
 * Отображает дату в человеко-понятном виде, например 11 февраля
 * @param {Date|string} dateObj - Объект даты или строка с датой
 * @returns {string} Отформатированная дата
 * @example {{ post.date | getHumanDate }}
 */
export const getHumanDate = function (dateObj) {
  const date = new Date(dateObj);
  const options = {
    day: "2-digit",
    month: "long",
    locale: "ru-RU",
  };
  return date.toLocaleDateString("ru-RU", options);
};

/**
 * Отображает дату в человеко-понятном виде с годом, например 11 февраля 2025
 * @param {Date|string} dateObj - Объект даты или строка с датой
 * @returns {string} Отформатированная дата с годом
 * @example {{ post.date | getHumanDateWithYear }}
 */
export const getHumanDateWithYear = function (dateObj) {
  const date = new Date(dateObj);
  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    locale: "ru-RU",
  };
  return date.toLocaleDateString("ru-RU", options);
};
