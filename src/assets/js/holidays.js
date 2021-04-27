// import $ from "jquery";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { getCurrentYear } from "./utils";

import holidays from '../data/holidays.yml';

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

const defaultMonthPicture = `/face/${dayjs().month()}.jpg`;

/**
 * Возвращает дату добавляя текущий год
 * DD-MM -> YYYY-MM-DD
*/
const getFullDate = (date) => {
  const fullDate = dayjs(date, 'DD-MM').format('YYYY-MM-DD');
  return fullDate;
}

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
    createImage({ src: defaultMonthPicture });
    return;
  }

  if (event.text) {
    const text = replaceText(event.text);
    $('<div>').html(text).prependTo('.last-news');
  }

  createImage({ src: event.image });
}

/**
 * Выводит переданное изображение
*/
const createImage = ({
  domain = 'http://chglib.icp.ac.ru',
  src,
}) => {
  const img = document.createElement("img");
  img.classList.add('last-news-image13');
  img.src = [domain, src].join();

  const parent = document.querySelector('.last-news');
  parent.insertBefore(img, parent.firstChild);
}

export default getHolidays;
