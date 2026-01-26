/**
 * Модуль заказа журналов на страницах BENex (HTML-first: разметка в template, JS — логика).
 * Использует переиспользуемые модалку и форму (modalForm), GAS и localStorage — специфика BENex.
 * @module pages/benex
 */

import { closeModal, initModalFromTemplate, openModal, showMessage } from '../utils/modalForm';

/**
 * URL веб-приложения Google Apps Script для приёма заказов.
 * TODO: Замените на ваш URL после настройки. Инструкция: docs/google-apps-script-setup.md
 * @type {string}
 */
const GOOGLE_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbymTm1w1UVoPYBb00F6Qw3A4MqXmBnV1dx7RxLbuvKd6sDxoRBXsDscBJTsZ998OhVC/exec';

/** Ключ localStorage для сохранения email пользователя. */
const STORAGE_KEY_EMAIL = 'benex-journal-order-email';

/**
 * Инициализирует функциональность заказа журналов на страницах /BENex/.
 * Клонирует template модалки (modalForm), вешает submit, кнопки «Заказ журнала» у каждой записи.
 * @returns {void}
 */
const initJournalOrder = () => {
  if (!window.location.pathname.includes('/BENex/')) return;

  const main = document.querySelector('main');
  if (!main) return;

  const entries = main.querySelectorAll('ol > li, ul > li');
  if (entries.length === 0) return;

  const result = initModalFromTemplate('journal-order-modal-tpl');
  if (!result) return;

  const { modal, form } = result;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSubmit(form, modal);
  });

  // Очищаем ошибки при вводе текста в поля
  const inputs = form.querySelectorAll('.form__input');
  inputs.forEach((input) => {
    input.addEventListener('input', () => {
      clearFieldError(input);
    });
  });

  for (const entry of entries) {
    const strong = entry.querySelector('strong');
    if (!strong) continue;

    const btn = createOrderButton();
    entry.appendChild(btn);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openJournalModal(modal, form, strong.textContent.trim());
    });
  }
};

/**
 * Создаёт кнопку «Заказ журнала».
 * @returns {HTMLButtonElement}
 */
function createOrderButton() {
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
 * @param {HTMLElement} modal — корень модалки (.modal)
 * @param {HTMLFormElement} form — форма
 * @param {string} journalTitle — название журнала
 * @returns {void}
 */
function openJournalModal(modal, form, journalTitle) {
  const titleInput = form.elements.title;
  const pagesInput = form.elements.pages;
  const emailInput = form.elements.email;
  const messageEl = form.querySelector('.form__message');
  const submitBtn = form.querySelector('.form__submit');

  if (titleInput) titleInput.value = journalTitle;
  if (pagesInput) pagesInput.value = '';
  if (emailInput) {
    try {
      emailInput.value = localStorage.getItem(STORAGE_KEY_EMAIL) ?? '';
    } catch {
      emailInput.value = '';
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
 * @param {HTMLElement} fieldContainer — контейнер .form__field
 * @param {string} message — текст ошибки
 * @returns {void}
 */
function showFieldError(fieldContainer, message) {
  const errorEl = fieldContainer.querySelector('.form__field-error');
  if (errorEl) {
    errorEl.textContent = message || errorEl.getAttribute('data-error') || '';
  }
}

/**
 * Очищает ошибку конкретного поля.
 * @param {HTMLInputElement} input — поле ввода
 * @returns {void}
 */
function clearFieldError(input) {
  const fieldContainer = input.closest('.form__field');
  if (fieldContainer) {
    const errorEl = fieldContainer.querySelector('.form__field-error');
    if (errorEl) {
      errorEl.textContent = '';
    }
  }
}

/**
 * Очищает все ошибки полей в форме.
 * @param {HTMLFormElement} form — форма
 * @returns {void}
 */
function clearFieldErrors(form) {
  const errorElements = form.querySelectorAll('.form__field-error');
  errorElements.forEach((el) => {
    el.textContent = '';
  });
}

/**
 * Проверяет валидность email.
 * @param {string} email — email адрес
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Обрабатывает submit: payload → GAS, при успехе сохраняет email в localStorage, showMessage, closeModal через 2 с.
 * @param {HTMLFormElement} form — форма
 * @param {HTMLElement} modal — корень модалки
 * @returns {Promise<void>}
 */
async function handleSubmit(form, modal) {
  const titleInput = form.elements.title;
  const pagesInput = form.elements.pages;
  const emailInput = form.elements.email;

  // Очищаем предыдущие ошибки
  clearFieldErrors(form);

  // Валидация полей
  let hasErrors = false;
  let firstErrorField = null;

  const titleValue = String(titleInput?.value ?? '').trim();
  if (!titleValue) {
    const titleField = titleInput?.closest('.form__field');
    if (titleField) {
      showFieldError(titleField, 'Пожалуйста, укажите название журнала.');
      if (!firstErrorField) firstErrorField = titleInput;
      hasErrors = true;
    }
  }

  const pagesValue = String(pagesInput?.value ?? '').trim();
  if (!pagesValue) {
    const pagesField = pagesInput?.closest('.form__field');
    if (pagesField) {
      showFieldError(pagesField, 'Пожалуйста, укажите страницы.');
      if (!firstErrorField) firstErrorField = pagesInput;
      hasErrors = true;
    }
  }

  const emailValue = String(emailInput?.value ?? '').trim();
  if (!emailValue) {
    const emailField = emailInput?.closest('.form__field');
    if (emailField) {
      showFieldError(emailField, 'Пожалуйста, укажите email.');
      if (!firstErrorField) firstErrorField = emailInput;
      hasErrors = true;
    }
  } else if (!isValidEmail(emailValue)) {
    const emailField = emailInput?.closest('.form__field');
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

  const payload = {
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

  const msg = form.querySelector('.form__message');
  if (msg) {
    msg.hidden = true;
    msg.textContent = '';
    msg.className = 'form__message';
  }

  const submitBtn = form.querySelector('.form__submit');
  if (!submitBtn) return;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';

  try {
    await sendToGoogleAppsScript(payload);
    showMessage(form, 'Заказ успешно отправлен!', 'success');
    form.elements.pages.value = '';
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
 * @param {{ title: string; pages: string; email: string; timestamp: string; url: string }} payload
 * @returns {Promise<Response>}
 */
async function sendToGoogleAppsScript(payload) {
  const body = new FormData();
  body.append('data', JSON.stringify(payload));

  const res = await fetch(GOOGLE_APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body,
  });

  return res;
}

export default initJournalOrder;
