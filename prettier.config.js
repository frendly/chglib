/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  // Максимальная длина строки
  printWidth: 100,
  // Использование пробелов вместо табуляции
  useTabs: false,
  // Количество пробелов в табуляции
  tabWidth: 2,
  // Использование точки с запятой в конце выражения
  semi: true,
  // Использование одинарных кавычек вместо двойных
  singleQuote: true,
  // Добавление запятой в конце списка свойств объекта или элементов массива
  trailingComma: 'es5',
  // Добавление пробела между скобками в объектах и массивах
  bracketSpacing: true,
};

export default config;
