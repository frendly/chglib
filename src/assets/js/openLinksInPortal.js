import { createPortal } from './portal';

const fetchData = (data) => {
  const container = document.querySelector('.portal__content');

  const htmlDocument = new DOMParser().parseFromString(data, "text/html");
  const trimData = htmlDocument.querySelector('main');

  container.appendChild(trimData);
}

export const openLinksInPortal = () => {
  // исключаем открытие ссылок /libweb/* в портале
  const links = document.querySelectorAll('main a[href*=".html"]:not([href*="ResBNC.html"]):not([href*="Restmp.html"]):not([href*="e-jour.html"])');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      fetch(e.target.href)
        .then(response => response.text())
        .then(response => {
          createPortal();
          fetchData(response);
        });
    });
  });
}
