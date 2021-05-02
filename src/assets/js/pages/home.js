import {isMainPage} from '../utils';

const fetchNews = async () => {
  const response = await fetch('/news/');
  const htmlString = await response.text();
  return htmlString;
}

const setLastNews = async () => {
  if (!isMainPage) {
    return null;
  }

  const response = await fetchNews();

  const html = document.createElement('html');
  html.innerHTML = response;

  const lastNewsSelector = html.querySelectorAll('article:nth-of-type(-n+2)');
  const parent = document.querySelector('.get-last-news__list');

  parent.append(...lastNewsSelector);
}

export default setLastNews;
