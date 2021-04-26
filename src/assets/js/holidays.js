import $ from "jquery";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

import { getCurrentYear } from "./utils";

import holidays from '../data/holidays.yml';

dayjs.extend(isBetween);

const defaultMonthPicture = `/face/${dayjs().month()}.jpg`;

/**
 * Возвращает дату добавляя текущий год
 * 15-01 -> 15-01-2019
*/
const getFullDate = (date) => dayjs(date, 'DD-MM').format('DD-MM-YYYY');

/**
 * Заменяет текст
*/
function replaceText(data) {
  return data.replace('#current_year#', getCurrentYear());
}

/**
 * Возвращает список праздников из файла
*/
const getHolidays = () => {
  return getCurrentEvent(holidays)
}

/**
 * Фильтрует массив праздников по текущей дате
*/
const getCurrentEvent = (data) => {
  const today = dayjs().format('YYYY-MM-DD');

  const event = data.find(item => {
    const { start_date: startDate, end_date: endDate } = item;

    const start = getFullDate(startDate);
    const end = getFullDate(endDate);
    const isShowing = dayjs(today).isBetween(start, end, null, '[]');

    return isShowing && item;
  });

  setEvent(event);
};

/**
 * Выводит событие: текст и изображение.
 * Если событий нет, выводит изображение месяца
*/
const setEvent = (event) => {
  if (!event) {
    createImage(defaultMonthPicture);
    return;
  }

  if (event.text) {
    const text = replaceText(event.text);
    $('<div>').html(text).prependTo('.last-news');
  }

  createImage(event.image);

}

/**
 * Выводит переданное изображение
*/
const createImage = (src) => {
  const domain = 'http://chglib.icp.ac.ru';

  $('<img />')
    .addClass('last-news-image13')
    .attr('src', `${domain}/${src}`)
    .insertBefore('.last-news-list');
}

export default getHolidays;
