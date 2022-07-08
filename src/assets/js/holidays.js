import moment from 'moment';

import holidays from '../data/holidays.yml';

import { getCurrentYear } from "./utils";

const defaultMonthPicture = `/face/${moment().month()}.jpg`;

/**
 * Возвращает дату добавляя текущий год
 * 15-01 -> 15-01-2019
*/
const getFullDate = (date) => moment(date, 'DD-MM');

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
  getCurrentEvent(holidays);
}

/**
 * Фильтрует массив праздников по текущей дате
*/
const getCurrentEvent = (data) => {
  const today = moment().format('YYYY-MM-DD');

  const event = data.find(item => {
    const { start_date: startDate, end_date: endDate } = item;

    const start = getFullDate(startDate);
    const end = getFullDate(endDate);
    const isShowing = moment(today).isBetween(start, end, null, '[]');

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

  const text = replaceText(event.text);

  const eventElement = document.createElement('div');
  eventElement.innerHTML = text;

  document.querySelector('.last-news').prepend(eventElement);

  createImage(event.image);
}

/**
 * Выводит переданное изображение
*/
const createImage = (src) => {
  const domain = 'http://chglib.icp.ac.ru';

  const image = document.createElement('img');
  image.setAttribute('src', `${domain}/${src}`);
  image.classList.add('last-news-image');

  document.querySelector('.last-news').prepend(image);
}

export default getHolidays;
