import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { getCurrentYear } from "./utils/currentYear";

import holidays from '../data/holidays.yml';

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

const defaultMonthPicture = `/face/${dayjs().month()}.jpg`;

/**
 * Возвращает дату добавляя текущий год
 * MM-DD -> YYYY-MM-DD
*/
const getFullDate = (date) => dayjs(date, 'MM-DD').format('YYYY-MM-DD');

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
    const { startDate, endDate } = item;

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

  if(event.text) {
    const text = replaceText(event.text);

    const eventElement = document.createElement('div');
    eventElement.innerHTML = text;

    document.querySelector('.last-news').prepend(eventElement);
  }

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

  document.querySelector('.last-news')?.prepend(image);
}

export default getHolidays;
