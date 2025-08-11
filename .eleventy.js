import path from 'node:path';
import { EleventyRenderPlugin } from '@11ty/eleventy';
import eleventyNavigationPlugin from '@11ty/eleventy-navigation';
import buildAssets from './build-assets.js';

const now = String(Date.now());

// создаем коллекции на основе папок
// например newsByYear = { 2025: [{}], 2024: [{}], ... }
const makeCollection = (collection, folderName) => {
  const files = collection.getFilteredByGlob(`./pages/${folderName}/**/*.md`);
  return files.reduce((years, post) => {
    const year = path.dirname(post.inputPath).split('/').pop();
    if (!years[year]) years[year] = [];

    // добавляем в начало
    // years[year].push(post);
    years[year].unshift(post);
    return years;
  }, {});
};

export default function (eleventyConfig) {
  // Enable quiet mode to reduce console noise
  eleventyConfig.setQuietMode(true);

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // https://www.11ty.dev/docs/plugins/render/#renderfile
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // Copy all images directly to dist.
  eleventyConfig.addPassthroughCopy({ 'src/assets/images': '/assets/images' });
  // Copy robots.txt, etc to dist.
  eleventyConfig.addPassthroughCopy({ 'src/assets/static/*': '/' });

  // папки для создания авто-коллекций
  // @see makeCollection
  const folders = ['news'];
  folders.forEach((folderName) => {
    eleventyConfig.addCollection(`${folderName}ByYear`, (collection) =>
      makeCollection(collection, folderName),
    );
  });

  // Отображаем дату в человеко-понятном виде, например 11 февраля
  // @example {{ post.date | getHumanDate }}
  eleventyConfig.addFilter('getHumanDate', (dateObj) => {
    const date = new Date(dateObj);
    const options = {
      day: '2-digit',
      month: 'long',
      locale: 'ru-RU',
    };
    return date.toLocaleDateString('ru-RU', options);
  });

  // фильтр обрезает коллекцию
  // @example {{ collection | limit(2) }}
  eleventyConfig.addNunjucksFilter('limit', (array, limit) =>
    array.slice(0, limit),
  );

  // TODO: фильтр для создания архива по годам
  // eleventyConfig.addFilter("getYears", function (collection) {
  //   return Object.keys(collection);
  // });

  // текущий год доступен глобально
  eleventyConfig.addGlobalData(
    'getGlobalCurrentYear',
    new Date().getFullYear().toString(),
  );

  // Add cache busting with {% version %} time string
  eleventyConfig.addShortcode('version', () => now);

  // Build JS and CSS assets
  eleventyConfig.on('beforeBuild', buildAssets);

  eleventyConfig.addWatchTarget('./src/assets/');

  return {
    templateFormats: ['md', 'njk', 'html'],
    dir: {
      input: 'pages',
      output: 'dist',
      includes: '../src/_includes',
      data: '../src/_data',
      layouts: '../src/_includes/layouts',
    },
  };
}
