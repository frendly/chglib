const path = require('path');
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const esbuild = require("./esbuild.config")

const now = String(Date.now());

// const dayjs = require("dayjs");
// function getByDate(collection, dateFormat) {
//   let postsByDate = {};
//   // Update this to point to where you want to get your posts from:
//   let posts = collection.getFilteredByGlob(["./src/blog/**/*.md"]);
//   posts.forEach(function (post) {
//     // Get the year from the date
//     let d = dayjs(post.data.date).format(dateFormat);
//     // Create a new array key with the year
//     if (!postsByDate[d]) {
//       postsByDate[d] = new Array();
//     }
//     // Add the post to the year array key
//     postsByDate[d].push(post);
//   });
//   return postsByDate;
// }

module.exports = function(eleventyConfig) {
  // Enable quiet mode to reduce console noise
  eleventyConfig.setQuietMode(true);

  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  // https://www.11ty.dev/docs/plugins/render/#renderfile
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  // Copy all images directly to dist.
  eleventyConfig.addPassthroughCopy({"src/assets/images": "/assets/images"});
  // Copy robots.txt, etc to dist.
  eleventyConfig.addPassthroughCopy({"src/assets/static/*": "/"});

  // ===
  // ===
  // ===
  eleventyConfig.addCollection('postsByYear', (collection) => {
    return collection.getFilteredByGlob('./pages/data/**/*.md')
      .reduce((years, post) => {
        const year = path.dirname(post.inputPath).split('/').pop();
        if (!years[year]) years[year] = [];
        years[year].push(post);
        return years;
      }, {});
  });

  eleventyConfig.addGlobalData("getGlobalCurrentYear", new Date().getFullYear().toString());

  // eleventyConfig.addFilter('getCurrentYear', () => {
  //   console.log('edws');

  //   return new Date().getFullYear().toString();
  // });

  // eleventyConfig.addFilter('getPostsForYear', (collections, year = null) => {
  //   // const targetYear = year || getCurrentYear();
  //   const targetYear = 2025;
  //   return collections.postsByYear[targetYear] || [];
  // });
  // Создаем коллекцию по годам
  // eleventyConfig.addCollection('postsByYear', (collection) => {


  //   const dataCollection = collection.getFilteredByGlob('./pages/data/**/*.md');
  //   // console.log('postsByYear', dataCollection);

  //     const result = dataCollection.reduce((years, post) => {
  //       const year = path.dirname(post.inputPath).split('/').pop();
  //       // console.log('year', year);

  //       if (!years[year]) years[year] = [];
  //       years[year].push(post);
  //       return years;
  //     }, {});

  //     // console.log('result', result);


  //     return result;
  // });

  // Добавляем фильтр для получения текущего года
  // eleventyConfig.addFilter('getCurrentYear', () => {
  //   return new Date().getFullYear().toString();
  // });
  // eleventyConfig.addMetadata("dateFromFilename", (filename) => {
  //   const match = filename.match(/^(\d{4}-\d{2}-\d{2})\.md$/);
  //   return match ? new Date(match[1]) : null;
  // });
//   eleventyConfig.addCollection("data", collection => {
//     // Получаем все файлы в папке /data
//     const items = collection.getAll().filter(item =>
//         item.inputPath.startsWith('./pages/data/') &&
//         item.inputPath.endsWith('.md')
//     );

//     // Группируем по годам и типу файла
//     const result = {};

//     items.forEach(item => {
//         // Получаем путь относительно папки data
//         const relativePath = item.inputPath.replace('./pages/data/', '');
//         // console.log('relativePath', relativePath);

//         // Определяем год и тип файла
//         const parts = relativePath.split('/');
//         const year = parts[0];
//         const isIndex = parts.includes('index.md');

//         // Создаём структуру данных
//         if (!result[year]) result[year] = { index: null, items: [] };
//         if (isIndex) {
//             result[year].index = item;
//         } else {
//             result[year].items.push(item);
//         }
//     });
//     // console.log('result111', result);

//     return result;
// });

// Добавляем правила маршрутизации для каждого года
// eleventyConfig.addCollection("dataYears", collection =>
//   getByDate(collection, "YYYY")
// );
// eleventyConfig.addCollection("dataYears", collection => {
//   const years = Object.keys(collection.getFilteredByGlob("./pages/data/[0-9]*/index.md"));
//   console.log('years', years);

//   return years;
// });
  // ===

  // Add cache busting with {% version %} time string
  eleventyConfig.addShortcode('version', function () {
    return now;
  });

  // Build JS and CSS assets
  eleventyConfig.on("beforeBuild", esbuild);

  eleventyConfig.addWatchTarget("./src/assets/");

  return {
    templateFormats: [ "md", "njk", "html" ],
    dir: {
      input: "pages",
      output: "dist",
      includes: "../src/_includes",
      data: "../src/_data",
      layouts: "../src/_includes/layouts",
    },
  }
}
