export default {
  /**
   * Если новость создана в новом формате (.md), устанавливаем permalink: false,
   * чтобы не создавался отдельный файл с новостью
   *
   * Если новость в старом формате, те .html файл с новостями за год
   * устанавливаем permalink с путем до файла
   */
  permalink: (data) => {
    const isMarkdown = data.page.inputPath.endsWith('.md');

    if(isMarkdown) {
      return false;
    }

    return data.page.filePathStem + '.html';
  }
};
