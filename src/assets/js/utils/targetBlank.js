/**
 * Добавляем target='_blank'
 * - для внешних ссылок
 * - для внутренних ссылок на файлы pdf, jpg
 */
export const targetBlank = () => {
  const urls = document.querySelectorAll("a");
  const host = location.host.replace("www.", "");
  const pattern = new RegExp('^(https?:\\/\\/)?' + host + '(?!.*\\.(pdf|jpg))', 'i');

  const externalAndResourceUrls = Array.from(urls).filter((url) => !url.href.match(pattern));
  externalAndResourceUrls.forEach(link => link.setAttribute('target', '_blank'));
};
