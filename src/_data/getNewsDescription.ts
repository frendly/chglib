import fs from "fs";
import path from "path";

// Кеш для хранения содержимого файлов, чтобы избежать повторного чтения
const cache = new Map<string, string>();
const fallbackDescription = (year: string): string => `Архив новостей за ${year} год. Важные события, научные открытия и мероприятия, произошедшие в научном центре.`;

// Функция для получения meta description из файла или возврат fallback
// @param year - год для поиска
export const getNewsDescription = (year: string): string => {
  const filePath = path.resolve(
    `./pages/news/${year}/seo_description.md`
  );

  if (cache.has(filePath)) {
    return cache.get(filePath)!;
  }

  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, "utf-8").trim();
    cache.set(filePath, content);
    return content;
  }

  return fallbackDescription(year);
};
