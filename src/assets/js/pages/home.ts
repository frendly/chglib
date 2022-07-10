import {isMainPage} from '../utils';

const fetchNews = () => fetch('/news/').then(response => response.text());

const setLastNews = () => {
  if (!isMainPage) {
    return null;
  }

  fetchNews().then(response => {
    const html = document.createElement('html');
    html.innerHTML = response;

    const lastNewsSelector = html.querySelectorAll('article:nth-of-type(-n+2)');
    const parent = document.querySelector('.get-last-news__list');

    parent.append(...lastNewsSelector);
  })


}

export default setLastNews;
