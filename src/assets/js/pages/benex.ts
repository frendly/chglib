/**
 * Модуль заказа журналов на страницах BENex (HTML-first: разметка в template, JS — логика).
 * Использует переиспользуемые модалку и форму (modalForm), GAS и localStorage — специфика BENex.
 * @module pages/benex
 */

import { closeModal, initModalFromTemplate, openModal, showMessage } from '../utils/modalForm';

/**
 * URL веб-приложения Google Apps Script для приёма заказов.
 * TODO: Замените на ваш URL после настройки. Инструкция: docs/google-apps-script-setup.md
 */
const GOOGLE_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbymTm1w1UVoPYBb00F6Qw3A4MqXmBnV1dx7RxLbuvKd6sDxoRBXsDscBJTsZ998OhVC/exec';

/** Ключ localStorage для сохранения email пользователя. */
const STORAGE_KEY_EMAIL = 'benex-journal-order-email';

interface ModalResult {
  modal: HTMLElement;
  form: HTMLFormElement;
}

interface FormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  pages: HTMLInputElement;
  email: HTMLInputElement;
}

interface Payload {
  title: string;
  pages: string;
  email: string;
  timestamp: string;
  url: string;
}

// Глобальные переменные для модалки и формы (инициализируются один раз)
let globalModal: HTMLElement | null = null;
let globalForm: HTMLFormElement | null = null;
let isModalInitialized = false;

/**
 * Инициализирует модалку и форму (вызывается один раз).
 * @returns объект с модалкой и формой или null
 */
const initModalOnce = (): ModalResult | null => {
  if (isModalInitialized && globalModal && globalForm) {
    return { modal: globalModal, form: globalForm };
  }

  const result = initModalFromTemplate('journal-order-modal-tpl');
  if (!result) return null;

  const { modal, form } = result;
  if (!form) return null;

  // Инициализируем обработчики только один раз
  if (!isModalInitialized) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSubmit(form, modal);
    });

    // Очищаем ошибки при вводе текста в поля
    const inputs = form.querySelectorAll<HTMLInputElement>('.form__input');
    inputs.forEach((input: HTMLInputElement) => {
      input.addEventListener('input', () => {
        clearFieldError(input);
      });
    });

    globalModal = modal;
    globalForm = form;
    isModalInitialized = true;
  }

  if (!globalModal || !globalForm) return null;
  return { modal: globalModal, form: globalForm };
};

/**
 * Инициализирует кнопки «Заказ журнала» для контейнера.
 * @param container — контейнер для поиска записей (main или другой элемент)
 * @param modal — корень модалки
 * @param form — форма
 * @returns void
 */
const initJournalOrderButtons = (
  container: HTMLElement,
  modal: HTMLElement,
  form: HTMLFormElement
): void => {
  const entries = container.querySelectorAll<HTMLElement>('ol > li, ul > li');
  if (entries.length === 0) return;

  for (const entry of Array.from(entries)) {
    // Проверяем, не добавлена ли уже кнопка
    if (entry.querySelector('.journal-order-btn')) continue;

    const strong = entry.querySelector<HTMLElement>('strong');
    if (!strong) continue;

    const btn = createOrderButton();
    entry.appendChild(btn);
    // Находим все ссылки в элементе
    const links = Array.from(entry.querySelectorAll<HTMLAnchorElement>('a'));
    const linkUrls = links.map((link) => link.href);
    btn.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault();
      openJournalModal(modal, form, strong.textContent?.trim() || '', linkUrls);
    });
  }
};

/**
 * Инициализирует функциональность заказа журналов на страницах /BENex/.
 * Проверяет как обычный main, так и контент в портале.
 * @returns void
 */
const initJournalOrder = (): void => {
  // Проверяем, есть ли контент BENex на странице или в портале
  const main = document.querySelector<HTMLElement>('main');
  const portalMain = document.querySelector<HTMLElement>('.portal__content main');

  // Если нет контента BENex, выходим
  if (!main && !portalMain) return;

  // Проверяем наличие записей в обычном main или в портале
  const hasEntriesInMain = main && main.querySelectorAll('ol > li, ul > li').length > 0;
  const hasEntriesInPortal =
    portalMain && portalMain.querySelectorAll('ol > li, ul > li').length > 0;

  if (!hasEntriesInMain && !hasEntriesInPortal) return;

  // Инициализируем модалку один раз
  const modalResult = initModalOnce();
  if (!modalResult) return;

  const { modal, form } = modalResult;

  // Инициализируем кнопки для обычного main
  if (hasEntriesInMain && main) {
    initJournalOrderButtons(main, modal, form);
  }

  // Инициализируем кнопки для портала
  if (hasEntriesInPortal && portalMain) {
    initJournalOrderButtons(portalMain, modal, form);
  }
};

/**
 * Создаёт кнопку «Заказ журнала».
 * @returns HTMLButtonElement
 */
function createOrderButton(): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'download-btn-compact journal-order-btn';
  btn.setAttribute('aria-label', 'Заказать журнал');

  // Добавляем SVG иконку
  const iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  iconSvg.setAttribute('viewBox', '0 0 24 24');
  iconSvg.setAttribute('class', 'download-icon');
  iconSvg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z');
  iconSvg.appendChild(path);

  // Добавляем текст
  const textSpan = document.createElement('span');
  textSpan.className = 'download-text';
  textSpan.textContent = 'Заказ журнала';

  btn.appendChild(iconSvg);
  btn.appendChild(textSpan);

  return btn;
}

/**
 * Открывает модалку заказа: подставляет название и email из localStorage, сбрасывает сообщение и submit, фокус на «Страницы».
 * @param modal — корень модалки (.modal)
 * @param form — форма
 * @param journalTitle — название журнала
 * @param linkUrls — массив URL ссылок на оглавление журнала (если есть)
 * @returns void
 */
function openJournalModal(
  modal: HTMLElement,
  form: HTMLFormElement,
  journalTitle: string,
  linkUrls: string[] = []
): void {
  const formElements = form.elements as FormElements;
  const titleInput = formElements.title;
  const pagesInput = formElements.pages;
  const emailInput = formElements.email;
  const messageEl = form.querySelector<HTMLElement>('.form__message');
  const submitBtn = form.querySelector<HTMLButtonElement>('.form__submit');

  if (titleInput) titleInput.value = journalTitle;
  if (pagesInput) pagesInput.value = '';
  if (emailInput) {
    try {
      emailInput.value = localStorage.getItem(STORAGE_KEY_EMAIL) ?? '';
    } catch {
      emailInput.value = '';
    }
  }

  // Показываем/скрываем hint для поля "Страницы" в зависимости от наличия ссылок
  const pagesField = pagesInput?.closest<HTMLElement>('.form__field');
  if (pagesField) {
    const hintEl = pagesField.querySelector<HTMLElement>('.form__field-hint');
    if (hintEl) {
      if (linkUrls.length > 0) {
        let hintHTML: string;

        if (linkUrls.length === 1) {
          // Одна ссылка: [оглавление журнала]
          hintHTML = `Укажите страницы или ссылку на конкретную статью,<br><a href="${linkUrls[0]}" target="_blank" rel="noopener noreferrer">[оглавление журнала]</a>`;
        } else {
          // Несколько ссылок: оглавление журнала [1, 2, 3]
          const linkElements = linkUrls.map((url, index) => {
            const linkNumber = index + 1;
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkNumber}</a>`;
          });
          hintHTML = `Укажите страницы или ссылку на конкретную статью,<br>оглавление журнала [${linkElements.join(', ')}]`;
        }

        hintEl.innerHTML = hintHTML;
      } else {
        hintEl.textContent = '';
      }
    }
  }

  // Очищаем ошибки полей
  clearFieldErrors(form);

  if (messageEl) {
    messageEl.hidden = true;
    messageEl.textContent = '';
    messageEl.className = 'form__message';
  }
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить';
  }

  openModal(modal, form, { focusSelector: 'input[name="pages"]' });
}

/**
 * Показывает ошибку для конкретного поля.
 * @param fieldContainer — контейнер .form__field
 * @param message — текст ошибки
 * @returns void
 */
function showFieldError(fieldContainer: HTMLElement, message: string): void {
  const errorEl = fieldContainer.querySelector<HTMLElement>('.form__field-error');
  if (errorEl) {
    errorEl.textContent = message || errorEl.getAttribute('data-error') || '';
  }
}

/**
 * Очищает ошибку конкретного поля.
 * @param input — поле ввода
 * @returns void
 */
function clearFieldError(input: HTMLInputElement): void {
  const fieldContainer = input.closest<HTMLElement>('.form__field');
  if (fieldContainer) {
    const errorEl = fieldContainer.querySelector<HTMLElement>('.form__field-error');
    if (errorEl) {
      errorEl.textContent = '';
    }
  }
}

/**
 * Очищает все ошибки полей в форме.
 * @param form — форма
 * @returns void
 */
function clearFieldErrors(form: HTMLFormElement): void {
  const errorElements = form.querySelectorAll<HTMLElement>('.form__field-error');
  errorElements.forEach((el: HTMLElement) => {
    el.textContent = '';
  });
}

/**
 * Проверяет валидность email.
 * @param email — email адрес
 * @returns boolean
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Обрабатывает submit: payload → GAS, при успехе сохраняет email в localStorage, showMessage, closeModal через 2 с.
 * @param form — форма
 * @param modal — корень модалки
 * @returns Promise<void>
 */
async function handleSubmit(form: HTMLFormElement, modal: HTMLElement): Promise<void> {
  const formElements = form.elements as FormElements;
  const titleInput = formElements.title;
  const pagesInput = formElements.pages;
  const emailInput = formElements.email;

  // Очищаем предыдущие ошибки
  clearFieldErrors(form);

  // Валидация полей
  let hasErrors = false;
  let firstErrorField: HTMLInputElement | null = null;

  const titleValue = String(titleInput?.value ?? '').trim();
  if (!titleValue) {
    const titleField = titleInput?.closest<HTMLElement>('.form__field');
    if (titleField) {
      showFieldError(titleField, 'Пожалуйста, укажите название журнала.');
      if (!firstErrorField) firstErrorField = titleInput;
      hasErrors = true;
    }
  }

  const pagesValue = String(pagesInput?.value ?? '').trim();
  if (!pagesValue) {
    const pagesField = pagesInput?.closest<HTMLElement>('.form__field');
    if (pagesField) {
      showFieldError(pagesField, 'Пожалуйста, укажите страницы.');
      if (!firstErrorField) firstErrorField = pagesInput;
      hasErrors = true;
    }
  }

  const emailValue = String(emailInput?.value ?? '').trim();
  if (!emailValue) {
    const emailField = emailInput?.closest<HTMLElement>('.form__field');
    if (emailField) {
      showFieldError(emailField, 'Пожалуйста, укажите email.');
      if (!firstErrorField) firstErrorField = emailInput;
      hasErrors = true;
    }
  } else if (!isValidEmail(emailValue)) {
    const emailField = emailInput?.closest<HTMLElement>('.form__field');
    if (emailField) {
      showFieldError(emailField, 'Пожалуйста, введите корректный email адрес.');
      if (!firstErrorField) firstErrorField = emailInput;
      hasErrors = true;
    }
  }

  if (hasErrors) {
    // Фокус на первое поле с ошибкой
    firstErrorField?.focus();
    return;
  }

  const payload: Payload = {
    title: titleValue,
    pages: pagesValue,
    email: emailValue,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  };

  if (GOOGLE_APPS_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
    console.warn('Google Apps Script URL не настроен. Данные:', payload);
    showMessage(form, 'URL Google Apps Script не настроен. Проверьте консоль для данных.', 'error');
    return;
  }

  const msg = form.querySelector<HTMLElement>('.form__message');
  if (msg) {
    msg.hidden = true;
    msg.textContent = '';
    msg.className = 'form__message';
  }

  const submitBtn = form.querySelector<HTMLButtonElement>('.form__submit');
  if (!submitBtn) return;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';

  try {
    await sendToGoogleAppsScript(payload);
    showMessage(form, 'Заказ успешно отправлен!', 'success');
    formElements.pages.value = '';
    if (emailValue) {
      try {
        localStorage.setItem(STORAGE_KEY_EMAIL, emailValue);
      } catch {
        /* ignore */
      }
    }
    setTimeout(() => closeModal(modal, form), 2000);
  } catch (err) {
    console.error('Ошибка отправки формы:', err);
    showMessage(form, 'Ошибка соединения. Проверьте интернет и попробуйте еще раз.', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить';
  }
}

/**
 * Отправляет данные заказа в Google Apps Script (POST, data — JSON в FormData, no-cors).
 * @param payload — данные заказа
 * @returns Promise<Response>
 */
async function sendToGoogleAppsScript(payload: Payload): Promise<Response> {
  const body = new FormData();
  body.append('data', JSON.stringify(payload));

  const res = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body,
  });

  return res;
}

/**
 * Инициализирует кнопки заказа журналов для контента в портале.
 * Экспортируется для использования в openLinksInPortal.
 * @param container — контейнер с контентом (обычно .portal__content main)
 * @returns void
 */
export const initJournalOrderForPortal = (container: HTMLElement): void => {
  if (!container) return;

  const entries = Array.from(container.querySelectorAll<HTMLElement>('ol > li, ul > li'));
  if (entries.length === 0) return;

  const modalResult = initModalOnce();
  if (!modalResult) return;

  const { modal, form } = modalResult;
  initJournalOrderButtons(container, modal, form);
};

export default initJournalOrder;
