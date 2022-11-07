import { createPortal } from './portal';

const fetchData = (data) => {
  const container = document.querySelector('.portal__content');

  const htmlDocument = new DOMParser().parseFromString(data, "text/html");
  const trimData = htmlDocument.querySelector('main');

  container.appendChild(trimData);
}

export const openLinksInPortal = () => {
  const links = document.querySelectorAll('main [href*=".html"]');

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
