export const resbncBbTable = () => {
  const table = document.querySelector('.js-responsive-table');

  if (!table) {
    return;
  }

  const tableTitles = table.querySelectorAll('th');
  const tableCols = table.querySelectorAll('td');

  // массив заголовков таблицы
  const titles = Array.from(tableTitles).map((node) => node.textContent);

  // добавляем data атрибут с текстом заголовка, для отображения в мобильной версии таблицы
  Array.from(tableCols).map((col, index) => (col.dataset.title = titles[index % 4]));
};
