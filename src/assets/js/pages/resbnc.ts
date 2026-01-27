export const resbncBbTable = (): void => {
  const table = document.querySelector<HTMLTableElement>('.js-responsive-table');

  if (!table) {
    return;
  }

  const tableTitles = table.querySelectorAll<HTMLTableCellElement>('th');
  const tableCols = table.querySelectorAll<HTMLTableCellElement>('td');

  // массив заголовков таблицы
  const titles = Array.from(tableTitles).map((node) => node.textContent || '');

  // добавляем data атрибут с текстом заголовка, для отображения в мобильной версии таблицы
  Array.from(tableCols).forEach((col, index) => {
    col.dataset.title = titles[index % 4];
  });
};
