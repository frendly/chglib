/**
 * Утилиты для модалок (template → clone, open/close, overlay/Escape, showMessage).
 * Поддерживает модалки с формой и без формы.
 * Ожидают разметку с классами .modal, опционально .form, .form__message, .form__submit, .form__cancel.
 */

// Глобальный обработчик ESC для всех модалок
let escapeHandler = null;

/**
 * Инициализирует модалку из template: клонирует, вставляет в body, вешает закрытие (overlay, Escape, крестик, Отмена).
 * Submit не вешается — его навешивает вызывающий код.
 * @param {string} templateId — id элемента <template>
 * @returns {{ modal: HTMLElement; form?: HTMLFormElement } | null} — корень модалки и форма (если есть) или null
 */
export function initModalFromTemplate(templateId) {
  const tpl = document.getElementById(templateId);
  if (!tpl) return null;

  const fragment = tpl.content.cloneNode(true);
  const modal = fragment.querySelector('.modal');
  if (!modal) return null;

  document.body.appendChild(fragment);

  const form = modal.querySelector('.form');
  const closeBtn = modal.querySelector('.modal__close');
  const cancelBtn = modal.querySelector('.form__cancel');

  const close = () => closeModal(modal, form);

  // Обработчик для кнопки закрытия (крестик)
  if (closeBtn) {
    closeBtn.addEventListener('click', close);
  }

  // Обработчик для кнопки "Отмена" (если есть форма)
  if (cancelBtn) {
    cancelBtn.addEventListener('click', close);
  }

  // Закрытие по клику на overlay
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  // Глобальный обработчик ESC (добавляется один раз для всех модалок)
  if (!escapeHandler) {
    escapeHandler = (e) => {
      if (e.key === 'Escape') {
        // Находим открытую модалку
        const openModal = document.querySelector('.modal[style*="flex"]');
        if (openModal) {
          const modalForm = openModal.querySelector('.form');
          closeModal(openModal, modalForm);
        }
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }

  return { modal, form: form || undefined };
}

/**
 * Открывает модалку, блокирует скролл body, опционально даёт фокус.
 * @param {HTMLElement} modal — корень модалки (.modal)
 * @param {HTMLFormElement} [form] — форма (опционально)
 * @param {{ focusSelector?: string }} [options]
 * @returns {void}
 */
export function openModal(modal, form, options = {}) {
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  const sel = options.focusSelector;
  if (sel) {
    const el = form?.querySelector(sel) ?? modal.querySelector(sel);
    el?.focus();
  }
}

/**
 * Закрывает модалку, сбрасывает overflow, сообщение и кнопку «Отправить» (если есть форма).
 * @param {HTMLElement} modal — корень модалки
 * @param {HTMLFormElement} [form] — форма (опционально)
 * @returns {void}
 */
export function closeModal(modal, form) {
  modal.style.display = 'none';
  document.body.style.overflow = '';

  if (form) {
    const msg = form.querySelector('.form__message');
    if (msg) {
      msg.hidden = true;
      msg.textContent = '';
      msg.className = 'form__message';
      msg.style.display = '';
    }

    const submitBtn = form.querySelector('.form__submit');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить';
    }
  }
}

/**
 * Показывает сообщение в блоке .form__message (успех или ошибка).
 * @param {HTMLFormElement} form — форма
 * @param {string} message — текст
 * @param {'success'|'error'} [type='success']
 * @returns {void}
 */
export function showMessage(form, message, type = 'success') {
  const el = form.querySelector('.form__message');
  if (!el) return;
  el.textContent = message;
  el.className = `form__message form__message--${type}`;
  el.hidden = false;
  el.style.display = 'block';
  el.setAttribute('aria-live', 'assertive');
}
