import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import { DATE_FORMAT_ISO, DATE_FORMAT_MONTH_DAY } from '../../../../const/dateFormats';
import { getCurrentYear } from '../../utils/currentYear';

import holidays from './data/holidays.yml';

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

interface HolidayEvent {
  startDate: string;
  endDate: string;
  text?: string;
  image: string;
}

const defaultMonthPicture = `/face/${dayjs().month()}.jpg`;

/**
 * Возвращает дату добавляя текущий год
 * MM-DD -> YYYY-MM-DD
 */
const getFullDate = (date: string): string =>
  dayjs(date, DATE_FORMAT_MONTH_DAY).format(DATE_FORMAT_ISO);

/**
 * Заменяет текст
 */
function replaceText(data: string): string {
  return data.replace('#current_year#', String(getCurrentYear()));
}

/**
 * Фильтрует массив праздников по текущей дате
 */
const getCurrentEvent = (data: HolidayEvent[]): void => {
  const today = dayjs().format(DATE_FORMAT_ISO);

  const event = data.find((item) => {
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
const setEvent = (event: HolidayEvent | undefined): void => {
  if (!event) {
    createImage(defaultMonthPicture);
    return;
  }

  if (event.text) {
    const text = replaceText(event.text);

    const eventElement = document.createElement('div');
    eventElement.innerHTML = text;

    const lastNews = document.querySelector<HTMLElement>('.last-news');
    if (lastNews) {
      lastNews.prepend(eventElement);
    }
  }

  createImage(event.image);
};

/**
 * Выводит переданное изображение
 */
const createImage = (src: string): void => {
  const domain = 'https://chglib.icp.ac.ru';

  const image = document.createElement('img');
  image.setAttribute('src', `${domain}${src}`);
  image.setAttribute('loading', 'lazy');
  image.classList.add('last-news-image');

  const lastNews = document.querySelector<HTMLElement>('.last-news');
  if (lastNews) {
    lastNews.prepend(image);
  }
};

/**
 * Возвращает список праздников из файла
 */
const getHolidays = (): void => {
  getCurrentEvent(holidays as HolidayEvent[]);
};

export { getHolidays };
