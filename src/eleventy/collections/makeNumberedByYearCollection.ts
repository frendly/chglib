import path from 'node:path';
import type { EleventyCollection, EleventyCollectionItem } from '#types/eleventy';

/**
 * Универсальная сборка коллекции "по годам" для серийных страниц.
 *
 * Идея: берём все `*.md` в `pages/${folderName}/**`, оставляем только файлы с нужным
 * шаблоном (regex должен иметь capture group с номером в `match[1]`), группируем по
 * "году" (имя папки после `folderName`) и сортируем элементы внутри года численно
 * по индексу из имени файла (`bnp01`, `bnp02`, ...).
 */
export const makeNumberedByYearCollection = (
  options: {
    collection: EleventyCollection;
    folderName: string;
    fileNameIndexRegex: RegExp;
  },
): Record<string, EleventyCollectionItem[]> => {
  const { collection, folderName, fileNameIndexRegex } = options;
  const files = collection.getFilteredByGlob(`./pages/${folderName}/**/*.md`);

  // На всякий случай убираем флаг `g`, чтобы `exec` не зависел от `lastIndex`.
  const safeRegex = new RegExp(fileNameIndexRegex.source, fileNameIndexRegex.flags.replace(/g/g, ''));

  const getIndex = (filePathStem: string): number => {
    const fileName = path.basename(filePathStem);
    safeRegex.lastIndex = 0;
    const match = safeRegex.exec(fileName);
    if (!match?.[1]) return Number.MAX_SAFE_INTEGER;
    return Number.parseInt(match[1], 10);
  };

  const years = files.reduce(
    (acc, post) => {
      const fileName = path.basename(post.filePathStem);
      safeRegex.lastIndex = 0;
      const match = safeRegex.exec(fileName);
      if (!match?.[1]) return acc;

      const year = path.dirname(post.inputPath).split('/').pop() || '';
      if (!acc[year]) acc[year] = [];

      acc[year].push(post);
      return acc;
    },
    {} as Record<string, EleventyCollectionItem[]>
  );

  // Сортируем численно, чтобы bnp10 не оказался перед bnp02.
  for (const [year, posts] of Object.entries(years)) {
    posts.sort((a, b) => getIndex(a.filePathStem) - getIndex(b.filePathStem));
    years[year] = posts;
  }

  return years;
};

