/**
 * Создаем DOM структуру для портала и добавляет на страницу.
 * Если портал уже существует, очищает его контент.
 * @returns элемент .portal__content для вставки контента
 */
export const createPortal = (): HTMLElement => {
  // Проверяем, существует ли портал
  let portal = document.querySelector<HTMLElement>('.portal');
  let content = document.querySelector<HTMLElement>('.portal__content');

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
    if (!node || !(node instanceof HTMLElement)) {
      throw new Error('Failed to create portal element');
    }
    document.body.appendChild(node);

    portal = document.querySelector<HTMLElement>('.portal');
    content = document.querySelector<HTMLElement>('.portal__content');

    if (!portal || !content) {
      throw new Error('Failed to find portal elements after creation');
    }

    // Инициализируем обработчики закрытия один раз
    initCloseWatchers(portal);
  } else {
    if (!content) {
      throw new Error('Portal exists but content not found');
    }
    // Очищаем старый контент, оставляя кнопку закрытия
    const closeBtn = content.querySelector<HTMLButtonElement>('.portal__close');
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
 * @returns void
 */
export const removePortal = (): void => {
  const portal = document.querySelector<HTMLElement>('.portal');
  if (portal) {
    portal.remove();
  }
};

/**
 * Инициализирует обработчики закрытия портала (overlay и кнопка закрытия).
 * @param portal — элемент портала
 * @returns void
 */
const initCloseWatchers = (portal: HTMLElement): void => {
  const overlay = portal.querySelector<HTMLElement>('.portal__overlay');
  const portalClose = portal.querySelector<HTMLButtonElement>('.portal__close');

  if (overlay) {
    overlay.addEventListener('click', removePortal);
  }

  if (portalClose) {
    portalClose.addEventListener('click', removePortal);
  }
};
