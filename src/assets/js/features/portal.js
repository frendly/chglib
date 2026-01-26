/**
 * Создаем DOM структуру для портала и добавляет на страницу.
 * Если портал уже существует, очищает его контент.
 * @returns {HTMLElement} — элемент .portal__content для вставки контента
 */
export const createPortal = () => {
  // Проверяем, существует ли портал
  let portal = document.querySelector('.portal');
  let content = document.querySelector('.portal__content');

  if (!portal) {
    // Создаем новый портал
    const template = `
    <div class="portal">
      <div class="portal__content">
        <button class="portal__close">x</button>
      </div>
      <div class="portal__overlay"></div>
    </div>
    `;

    const node = new DOMParser().parseFromString(template, 'text/html').body.firstChild;
    document.body.appendChild(node);

    portal = document.querySelector('.portal');
    content = document.querySelector('.portal__content');

    // Инициализируем обработчики закрытия один раз
    initCloseWatchers(portal);
  } else {
    // Очищаем старый контент, оставляя кнопку закрытия
    const closeBtn = content.querySelector('.portal__close');
    // Сохраняем кнопку закрытия перед очисткой
    if (closeBtn) {
      content.innerHTML = '';
      content.appendChild(closeBtn);
    } else {
      // Если кнопки нет, создаём её заново
      content.innerHTML = '';
      const newCloseBtn = document.createElement('button');
      newCloseBtn.className = 'portal__close';
      newCloseBtn.textContent = 'x';
      content.appendChild(newCloseBtn);
      // Инициализируем обработчик для новой кнопки
      newCloseBtn.addEventListener('click', removePortal);
    }
  }

  return content;
};

/**
 * Удаляет портал из DOM.
 * @returns {void}
 */
export const removePortal = () => {
  const portal = document.querySelector('.portal');
  if (portal) {
    portal.remove();
  }
};

/**
 * Инициализирует обработчики закрытия портала (overlay и кнопка закрытия).
 * @param {HTMLElement} portal — элемент портала
 * @returns {void}
 */
const initCloseWatchers = (portal) => {
  const overlay = portal.querySelector('.portal__overlay');
  const portalClose = portal.querySelector('.portal__close');

  if (overlay) {
    overlay.addEventListener('click', removePortal);
  }

  if (portalClose) {
    portalClose.addEventListener('click', removePortal);
  }
};
