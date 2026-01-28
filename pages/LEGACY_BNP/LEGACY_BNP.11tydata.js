export default {
  /**
   * Обрабатывать HTML файлы как markdown, затем как Nunjucks
   * Это позволяет использовать markdown-форматирование (например, **bold**)
   * внутри HTML файлов
   */
  templateEngineOverride: 'md,njk',

  permalink: (data) => {
    return `${data.page.filePathStem}.html`;
  },
};
