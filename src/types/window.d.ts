/**
 * Глобальные типы для расширения интерфейса Window
 */

type YandexMetrika = (id: number, method: string, target: string) => void;

declare global {
  interface Window {
    ym?: YandexMetrika;
  }
}

export {};
