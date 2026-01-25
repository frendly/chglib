/**
 * Data file для страницы стилей
 * Исключает страницу из production сборки
 */
export default {
  /**
   * В production режиме устанавливаем permalink: false,
   * чтобы страница не попадала в сборку
   */
  permalink: process.env.NODE_ENV === 'production' ? false : '/styleguide/',
};
