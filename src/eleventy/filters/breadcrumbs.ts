import type { EleventyCollectionItem } from '@/types/eleventy';

export interface BreadcrumbItem {
  title: string;
  url: string | null;
  isCurrent: boolean;
}

interface SectionInfo {
  baseUrl: string;
  navKey: string;
}

interface PageType {
  isSectionPage: boolean;
  isYearPage: boolean;
  isSpecificPage: boolean;
}

// Разделы с архивом (показываем крошки только для них)
const SECTION_MAP: Record<string, SectionInfo> = {
  'BNP': { baseUrl: '/BNP/', navKey: 'Новые поступления' },
  'BENex': { baseUrl: '/BENex/', navKey: 'Журналы БЕН' },
  'news': { baseUrl: '/news/', navKey: 'Новости' },
  'subjex': { baseUrl: '/subjex/', navKey: 'Тематические выставки' },
};

/**
 * Парсит URL и возвращает массив частей пути без расширения .html
 * Обрабатывает trailing slash и нормализует URL
 */
function parseUrl(url: string): string[] {
  // Убираем trailing slash и разбиваем на части
  const normalizedUrl = url.replace(/\/$/, '');
  const urlParts = normalizedUrl.split('/').filter(Boolean);
  return urlParts.map((part: string) => part.replace(/\.html$/, ''));
}

/**
 * Определяет информацию о секции по первой части URL
 */
function getSection(urlParts: string[]): SectionInfo | null {
  const sectionName = urlParts[0];
  if (!sectionName) {
    return null;
  }
  return SECTION_MAP[sectionName] || null;
}

/**
 * Определяет тип страницы на основе структуры URL
 * @param urlParts - Массив частей URL
 * @param sectionName - Название секции (первая часть URL)
 */
function getPageType(urlParts: string[], sectionName: string): PageType {
  const urlLength = urlParts.length;
  // sectionName уже равен urlParts[0] (проверено в getSection), поэтому проверяем только длину
  return {
    isSectionPage: urlLength === 1,
    isYearPage: urlLength === 2 && /^\d{4}$/.test(urlParts[1]),
    isSpecificPage: urlLength >= 3,
  };
}

/**
 * Извлекает год из URL (вторая часть пути, если это валидный год)
 * Валидирует, что год находится в разумном диапазоне (1900-2100)
 */
function getYear(urlParts: string[]): string | null {
  if (urlParts.length < 2) {
    return null;
  }

  const yearStr = urlParts[1];

  // Проверяем формат (4 цифры)
  if (!/^\d{4}$/.test(yearStr)) {
    return null;
  }

  // Валидируем диапазон года (1900-2100)
  const year = parseInt(yearStr, 10);
  if (year < 1900 || year > 2100) {
    return null;
  }

  return yearStr;
}

/**
 * Добавляет элемент секции в breadcrumbs
 */
function addSectionBreadcrumb(
  breadcrumbs: BreadcrumbItem[],
  section: SectionInfo,
  collections?: Record<string, EleventyCollectionItem[]>
): void {
  // Проверяем наличие коллекций
  if (!collections?.all) {
    // Если коллекций нет, все равно добавляем секцию (она всегда должна быть)
    breadcrumbs.push({
      title: section.navKey,
      url: section.baseUrl,
      isCurrent: false,
    });
    return;
  }

  const sectionPage = collections.all.find(
    (item: EleventyCollectionItem) => item.url === section.baseUrl
  );

  if (sectionPage) {
    breadcrumbs.push({
      title: section.navKey,
      url: section.baseUrl,
      isCurrent: false,
    });
  }
}

/**
 * Добавляет элемент года в breadcrumbs
 */
function addYearBreadcrumb(
  breadcrumbs: BreadcrumbItem[],
  year: string,
  section: SectionInfo,
  isYearPage: boolean
): void {
  const yearUrl = `${section.baseUrl}${year}/`;

  if (isYearPage) {
    // Для страниц года показываем год как не-ссылку
    breadcrumbs.push({
      title: year,
      url: null,
      isCurrent: true,
    });
  } else {
    // Для конкретных страниц год показываем как ссылку
    breadcrumbs.push({
      title: year,
      url: yearUrl,
      isCurrent: false,
    });
  }
}

/**
 * Добавляет элемент текущей страницы в breadcrumbs
 */
function addCurrentPageBreadcrumb(
  breadcrumbs: BreadcrumbItem[],
  page: EleventyCollectionItem
): void {
  // Пробуем получить title из разных источников
  // page.data.title - стандартное место для frontmatter title
  // page.title - может быть установлен через computed data
  const pageTitle = page.data?.title || (page.title as string | undefined) || '';

  if (pageTitle) {
    breadcrumbs.push({
      title: pageTitle,
      url: null,
      isCurrent: true,
    });
  }
}

/**
 * Фильтр для построения хлебных крошек на основе структуры папок страницы
 * Показывает крошки только для разделов с архивом: BNP, BENex, news, subjex
 * @param page - Объект текущей страницы из Eleventy
 * @param collections - Коллекции Eleventy для поиска родительских страниц (передается как второй аргумент)
 * @returns Массив элементов хлебных крошек
 * @example {{ page | getBreadcrumbs(collections) }}
 */
export function getBreadcrumbs(
  page: EleventyCollectionItem,
  collections?: Record<string, EleventyCollectionItem[]>
): BreadcrumbItem[] {
  const url = page.url || '';

  // Если это главная страница, не показываем крошки
  if (url === '/' || url === '/index.html') {
    return [];
  }

  // Парсим URL для извлечения структуры пути
  const urlParts = parseUrl(url);

  // Определяем секцию
  const section = getSection(urlParts);
  if (!section) {
    return [];
  }

  const sectionName = urlParts[0];

  // Определяем тип страницы
  const pageType = getPageType(urlParts, sectionName);

  // Для страниц раздела не показываем крошки
  if (pageType.isSectionPage) {
    return [];
  }

  const breadcrumbs: BreadcrumbItem[] = [];

  // Добавляем секцию
  addSectionBreadcrumb(breadcrumbs, section, collections);

  // Добавляем год, если есть
  const year = getYear(urlParts);
  if (year) {
    addYearBreadcrumb(breadcrumbs, year, section, pageType.isYearPage);
  }

  // Добавляем текущую страницу (только для конкретных страниц)
  if (pageType.isSpecificPage) {
    addCurrentPageBreadcrumb(breadcrumbs, page);
  }

  return breadcrumbs;
}
