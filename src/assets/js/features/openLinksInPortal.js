import { initJournalOrderForPortal } from '../pages/benex';
import { isMobile } from '../utils';
import { createPortal } from './portal';

const fetchData = (data, container) => {
  const htmlDocument = new DOMParser().parseFromString(data, 'text/html');
  const trimData = htmlDocument.querySelector('main') || htmlDocument.body;

  container.appendChild(trimData);

  // Инициализируем кнопки заказа журналов для контента в портале
  // Проверяем, является ли загруженный контент страницей BENex
  // trimData уже является main или body, поэтому проверяем его напрямую
  const main = trimData.tagName === 'MAIN' ? trimData : trimData.querySelector('main');
  if (main) {
    // Проверяем наличие записей журналов (ol > li или ul > li с strong)
    const hasJournalEntries = main.querySelectorAll('ol > li strong, ul > li strong').length > 0;
    if (hasJournalEntries) {
      initJournalOrderForPortal(main);
    }
  }
};

export const openLinksInPortal = () => {
  // на мобильных устройствах открываем ссылки без портала
  if (isMobile) {
    return;
  }

  // исключаем открытие ссылок /libweb/* в портале
  const links = document.querySelectorAll(
    'main a[href*=".html"]:not([href*="ResBNC.html"]):not([href*="Restmp.html"]):not([href*="e-jour.html"])'
  );

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      // Используем currentTarget для получения правильного href
      // (e.target может быть дочерним элементом ссылки)
      const href = e.currentTarget.href || link.href;
      if (!href) return;

      fetch(href)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.text();
        })
        .then((response) => {
          const container = createPortal();
          fetchData(response, container);
        })
        .catch((error) => {
          console.error('Ошибка загрузки контента в портал:', error);
          // Можно показать сообщение пользователю
        });
    });
  });
};
