/**
 * Добавляем target='_blank'
 * - для внешних ссылок
 * - для внутренних ссылок на файлы pdf, jpg, doc, docx, ppt
 */
export const targetBlank = () => {
  const links = document.querySelectorAll('a');
  if (links.length === 0) return;

  const currentHost = location.host.replace('www.', '');
  // Экранируем специальные символы в host для использования в RegExp
  const escapedHost = currentHost.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Паттерн для внутренних ссылок (не ресурсные файлы)
  const internalLinkPattern = new RegExp(
    `^https?:\\/\\/(www\\.)?${escapedHost}(?!.*\\.(pdf|jpg|doc|docx|ppt)(\\?|#|$))`,
    'i'
  );

  for (const link of links) {
    if (!link.href) continue;
    // Добавляем target='_blank' если ссылка не соответствует паттерну внутренних ссылок
    if (!internalLinkPattern.test(link.href)) {
      link.setAttribute('target', '_blank');
    }
  }
};
