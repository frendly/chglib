/**
 * Модуль заказа журналов на страницах BENex (HTML-first: разметка в template, JS — логика).
 * Кнопка «Заказ журнала» у каждой записи, модалка с формой из <template>, отправка в Google Apps Script.
 * @module pages/benex
 */

/**
 * URL веб-приложения Google Apps Script для приёма заказов.
 * TODO: Замените на ваш URL после настройки. Инструкция: docs/google-apps-script-setup.md
 * @type {string}
 */
const GOOGLE_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzvfwraJh3pVksi4zPAFUNapTkmj4zh-xd9rWxJk8sszd2TRSnPrBYB1PQ6I7puiSxb/exec';

/** Ключ localStorage для сохранения email пользователя. */
const STORAGE_KEY_EMAIL = 'benex-journal-order-email';

/**
 * Инициализирует функциональность заказа журналов на страницах /BENex/.
 * Клонирует `<template id="journal-order-modal-tpl">`, вешает обработчики на форму и кнопки «Заказ журнала» у каждой записи.
 * @returns {void}
 */
const initJournalOrder = () => {
  if (!window.location.pathname.includes('/BENex/')) return;

  const main = document.querySelector('main');
  if (!main) return;

  const entries = main.querySelectorAll('ol > li, ul > li');
  if (entries.length === 0) return;

  const tpl = document.getElementById('journal-order-modal-tpl');
  if (!tpl) return;

  const fragment = tpl.content.cloneNode(true);
  const modal = fragment.querySelector('.journal-order-modal');
  if (!modal) return;

  document.body.appendChild(fragment);

  const form = modal.querySelector('.journal-order-form');
  const cancelBtn = modal.querySelector('.journal-order-form__cancel');
  if (!form || !cancelBtn) return;

  const close = () => closeModal(modal, form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSubmit(form, modal);
  });
  cancelBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display !== 'none') close();
  });

  for (const entry of entries) {
    const strong = entry.querySelector('strong');
    if (!strong) continue;

    const btn = createOrderButton();
    entry.appendChild(btn);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(modal, form, strong.textContent.trim());
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
  btn.className = 'journal-order-btn';
  btn.textContent = 'Заказ журнала';
  btn.setAttribute('aria-label', 'Заказать журнал');
  return btn;
}

/**
 * Открывает модалку заказа, подставляет название журнала и email из localStorage, фокусирует «Страницы».
 * @param {HTMLElement} modal — корень модалки (`.journal-order-modal`)
 * @param {HTMLFormElement} form — форма заказа
 * @param {string} journalTitle — название журнала для readonly-поля
 * @returns {void}
 */
function openModal(modal, form, journalTitle) {
  const titleInput = form.elements.title;
  const pagesInput = form.elements.pages;
  const emailInput = form.elements.email;
  const messageEl = form.querySelector('.journal-order-form__message');
  const submitBtn = form.querySelector('.journal-order-form__submit');

  if (titleInput) titleInput.value = journalTitle;
  if (pagesInput) pagesInput.value = '';
  if (emailInput) {
    try {
      emailInput.value = localStorage.getItem(STORAGE_KEY_EMAIL) ?? '';
    } catch {
      emailInput.value = '';
    }
  }

  if (messageEl) {
    messageEl.hidden = true;
    messageEl.textContent = '';
    messageEl.className = 'journal-order-form__message';
  }
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить';
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  pagesInput?.focus();
}

/**
 * Закрывает модалку, сбрасывает сообщения и кнопку «Отправить».
 * @param {HTMLElement} modal — корень модалки
 * @param {HTMLFormElement} form — форма заказа
 * @returns {void}
 */
function closeModal(modal, form) {
  modal.style.display = 'none';
  document.body.style.overflow = '';

  const msg = form.querySelector('.journal-order-form__message');
  if (msg) {
    msg.hidden = true;
    msg.textContent = '';
    msg.className = 'journal-order-form__message';
    msg.style.display = '';
  }

  const submitBtn = form.querySelector('.journal-order-form__submit');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Отправить';
  }
}

/**
 * Обрабатывает отправку формы: собирает payload (включая email), отправляет в GAS, при успехе сохраняет email в localStorage.
 * @param {HTMLFormElement} form — форма заказа
 * @param {HTMLElement} modal — корень модалки (для закрытия после успеха)
 * @returns {Promise<void>}
 */
async function handleSubmit(form, modal) {
  const email = String(form.elements.email?.value ?? '').trim();
  const payload = {
    title: String(form.elements.title?.value ?? '').trim(),
    pages: String(form.elements.pages?.value ?? '').trim(),
    email,
    timestamp: new Date().toISOString(),
    url: window.location.href,
  };

  if (GOOGLE_APPS_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
    console.warn('Google Apps Script URL не настроен. Данные:', payload);
    showMessage(form, 'URL Google Apps Script не настроен. Проверьте консоль для данных.', 'error');
    return;
  }

  const msg = form.querySelector('.journal-order-form__message');
  if (msg) {
    msg.hidden = true;
    msg.textContent = '';
    msg.className = 'journal-order-form__message';
  }

  const submitBtn = form.querySelector('.journal-order-form__submit');
  if (!submitBtn) return;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Отправка...';

  try {
    await sendToGoogleAppsScript(payload);
    showMessage(form, 'Заказ успешно отправлен!', 'success');
    form.elements.pages.value = '';
    if (email) {
      try {
        localStorage.setItem(STORAGE_KEY_EMAIL, email);
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
 * Показывает сообщение в блоке `.journal-order-form__message` (успех или ошибка).
 * @param {HTMLFormElement} form — форма заказа
 * @param {string} message — текст сообщения
 * @param {'success'|'error'} [type='success'] — тип (влияет на класс `--success` / `--error`)
 * @returns {void}
 */
function showMessage(form, message, type) {
  const el = form.querySelector('.journal-order-form__message');
  if (!el) return;
  el.textContent = message;
  el.className = `journal-order-form__message journal-order-form__message--${type}`;
  el.hidden = false;
  el.style.display = 'block';
  el.setAttribute('aria-live', 'assertive');
}

/**
 * Отправляет данные заказа в Google Apps Script (POST, `data` — JSON в FormData, mode `no-cors`).
 * @param {{ title: string; pages: string; email: string; timestamp: string; url: string }} payload — данные заказа
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
