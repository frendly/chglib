# Структура

```
chglib/
├── .eleventy.js                 # Конфигурация Eleventy
├── build-assets.js              # Сборка JS/CSS
├── package.json                 # yarn start
├── .nvmrc                       # Версия Node.js
├── .github/workflows/main.yml   # CI/CD пайплайн для деплоя
├── pages/                       # Контент страниц
│   └── news/                    # Новости
├── src/
│   ├── _data/                   # Глобальные данные
│   ├── _includes/
│   │   └── layouts/             # Шаблоны страниц
│   └── assets/
│       ├── js/index.js          # Основной JS файл
│       ├── styles/              # CSS файлы
│       ├── images/              # Изображения
│       └── static/              # Статические файлы (robots.txt и др.)
└── dist/                        # Собранный сайт (генерируется)
```

## Wiki

Вся информация по работе с репозиторием находится в [вики](https://github.com/frendly/chglib/wiki)

Так же можно изучить [deep wiki](https://deepwiki.com/frendly/chglib) (AI generated)

## Локальная работа

Инструкция по запуску локального окружения:
[Разработка](https://github.com/frendly/chglib/wiki/%D0%A0%D0%B0%D0%B7%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BA%D0%B0)

## Деплой

[![🚀 Deploy website on push](https://github.com/frendly/chglib/actions/workflows/main.yml/badge.svg)](https://github.com/frendly/chglib/actions/workflows/main.yml)
