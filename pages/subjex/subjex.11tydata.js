export default {
  layout: 'subjex',
  permalink: (data) => {
    return data.page.filePathStem + '.html';
  },
};
