/**
 * Утилиты для модалок (template → clone, open/close, overlay/Escape, showMessage).
 * Поддерживает модалки с формой и без формы.
 * Ожидают разметку с классами .modal, опционально .form, .form__message, .form__submit, .form__cancel.
 */

// Глобальный обработчик ESC для всех модалок
let escapeHandler: ((e: KeyboardEvent) => void) | null = null;

interface ModalResult {
  modal: HTMLElement;
  form?: HTMLFormElement;
}

interface OpenModalOptions {
  focusSelector?: string;
}

/**
 * Инициализирует модалку из template: клонирует, вставляет в body, вешает закрытие (overlay, Escape, крестик, Отмена).
 * Submit не вешается — его навешивает вызывающий код.
 * @param templateId — id элемента <template>
 * @returns корень модалки и форма (если есть) или null
 */
export function initModalFromTemplate(templateId: string): ModalResult | null {
  const tpl = document.getElementById(templateId);
  if (!tpl || !(tpl instanceof HTMLTemplateElement)) return null;

  const fragment = tpl.content.cloneNode(true);
  if (!(fragment instanceof DocumentFragment)) return null;
  const modal = fragment.querySelector<HTMLElement>('.modal');
  if (!modal) return null;

  document.body.appendChild(fragment);

  const form = modal.querySelector<HTMLFormElement>('.form');
  const closeBtn = modal.querySelector<HTMLButtonElement>('.modal__close');
  const cancelBtn = modal.querySelector<HTMLButtonElement>('.form__cancel');

  const close = () => closeModal(modal, form || undefined);

  // Обработчик для кнопки закрытия (крестик)
  if (closeBtn) {
    closeBtn.addEventListener('click', close);
  }

  // Обработчик для кнопки "Отмена" (если есть форма)
  if (cancelBtn) {
    cancelBtn.addEventListener('click', close);
  }

  // Закрытие по клику на overlay
  modal.addEventListener('click', (e: MouseEvent) => {
    if (e.target === modal) close();
  });

  // Глобальный обработчик ESC (добавляется один раз для всех модалок)
  if (!escapeHandler) {
    escapeHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Находим открытую модалку
        const openModal = document.querySelector<HTMLElement>('.modal[style*="flex"]');
        if (openModal) {
          const modalForm = openModal.querySelector<HTMLFormElement>('.form');
          closeModal(openModal, modalForm || undefined);
        }
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }

  return { modal, form: form || undefined };
}

/**
 * Открывает модалку, блокирует скролл body, опционально даёт фокус.
 * @param modal — корень модалки (.modal)
 * @param form — форма (опционально)
 * @param options — опции (focusSelector для фокуса)
 * @returns void
 */
export function openModal(
  modal: HTMLElement,
  form: HTMLFormElement | undefined,
  options: OpenModalOptions = {}
): void {
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  const sel = options.focusSelector;
  if (sel) {
    const el = form?.querySelector<HTMLElement>(sel) ?? modal.querySelector<HTMLElement>(sel);
    el?.focus();
  }
}

/**
 * Закрывает модалку, сбрасывает overflow, сообщение и кнопку «Отправить» (если есть форма).
 * @param modal — корень модалки
 * @param form — форма (опционально)
 * @returns void
 */
export function closeModal(modal: HTMLElement, form?: HTMLFormElement): void {
  modal.style.display = 'none';
  document.body.style.overflow = '';

  if (form) {
    const msg = form.querySelector<HTMLElement>('.form__message');
    if (msg) {
      msg.hidden = true;
      msg.textContent = '';
      msg.className = 'form__message';
      msg.style.display = '';
    }

    const submitBtn = form.querySelector<HTMLButtonElement>('.form__submit');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить';
    }
  }
}

/**
 * Показывает сообщение в блоке .form__message (успех или ошибка).
 * @param form — форма
 * @param message — текст
 * @param type — тип сообщения ('success' или 'error')
 * @returns void
 */
export function showMessage(
  form: HTMLFormElement,
  message: string,
  type: 'success' | 'error' = 'success'
): void {
  const el = form.querySelector<HTMLElement>('.form__message');
  if (!el) return;
  el.textContent = message;
  el.className = `form__message form__message--${type}`;
  el.hidden = false;
  el.style.display = 'block';
  el.setAttribute('aria-live', 'assertive');
}
