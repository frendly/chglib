/**
 * Создаем DOM структуру для портала и добавляет на страницу
 */
export const createPortal = () => {
  const template = `
  <div class="portal">
    <div class="portal__content">
      <button class="portal__close">x</button>
    </div>
    <div class="portal__overlay"></div>
  </div>
  `;

  const node = new DOMParser().parseFromString(template, "text/html").body.firstChild;

  document.body.appendChild(node);

  closeWatcher();
}

/**
 * Удаляет портал из DOM
 */
const removePortal = () => {
  const portal = document.querySelector('.portal');
  portal.remove();
}

/**
 * Ожидаем клик на оверлей или кнопку закрытия, чтобы удалить портал
 */
const closeWatcher = () => {
  const overlay = document.querySelector('.portal__overlay');
  const portalClose = document.querySelector('.portal__close');

  overlay.addEventListener('click', removePortal);
  portalClose.addEventListener('click', removePortal);
}
