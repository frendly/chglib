# Инструкция по настройке Google Apps Script для формы заказа журнала

Эта инструкция поможет настроить Google Apps Script для приема данных формы заказа журнала, записи их в Google Таблицу и отправки на email.

## Шаг 1: Создание Google Таблицы

1. Откройте [Google Sheets](https://sheets.google.com)
2. Создайте новую таблицу
3. В первой строке добавьте заголовки колонок:
   - `Дата и время`
   - `Название журнала`
   - `Страницы`
   - `Email`
   - `URL страницы`
4. Сохраните таблицу и запомните её название

## Шаг 2: Создание проекта Google Apps Script

1. Откройте созданную Google Таблицу
2. Перейдите в меню **Расширения** → **Apps Script**
3. Откроется редактор Google Apps Script
4. Удалите весь код по умолчанию и вставьте следующий код:

```javascript
function doPost(e) {
  try {
    // Получаем данные из запроса
    const dataString = e.parameter.data || e.postData.contents;
    let data;
    
    try {
      data = JSON.parse(dataString);
    } catch (e) {
      // Если данные пришли как FormData, парсим их
      data = {
        title: e.parameter.title || '',
        pages: e.parameter.pages || '',
        email: e.parameter.email || '',
        timestamp: e.parameter.timestamp || new Date().toISOString(),
        url: e.parameter.url || ''
      };
    }

    // Получаем активную таблицу
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Добавляем строку с данными
    sheet.appendRow([
      data.timestamp ? new Date(data.timestamp) : new Date(),
      data.title || '',
      data.pages || '',
      data.email || '',
      data.url || ''
    ]);

    // Настройте email адрес для получения уведомлений администратору
    const adminEmail = 'your-email@example.com'; // ЗАМЕНИТЕ на ваш email
    
    // Формируем текст письма для администратора
    const adminEmailBody = `Новый заказ журнала:\n\n` +
      `Название: ${data.title}\n` +
      `Страницы: ${data.pages}\n` +
      `Email заказчика: ${data.email || 'не указан'}\n` +
      `URL страницы: ${data.url}\n` +
      `Дата и время: ${data.timestamp || new Date().toLocaleString('ru-RU')}`;
    
    // Отправляем email администратору
    MailApp.sendEmail({
      to: adminEmail,
      subject: 'Заказ журнала',
      body: adminEmailBody
    });

    // Отправляем подтверждение пользователю (если email указан)
    if (data.email && data.email.trim() !== '') {
      const userEmailBody = `Спасибо за ваш заказ!\n\n` +
        `Ваш заказ принят:\n` +
        `Название журнала: ${data.title}\n` +
        `Страницы: ${data.pages}\n` +
        `Дата заказа: ${data.timestamp ? new Date(data.timestamp).toLocaleString('ru-RU') : new Date().toLocaleString('ru-RU')}\n\n` +
        `Мы свяжемся с вами в ближайшее время.`;
      
      try {
        MailApp.sendEmail({
          to: data.email,
          subject: 'Подтверждение заказа журнала',
          body: userEmailBody
        });
      } catch (emailError) {
        // Логируем ошибку, но не прерываем выполнение
        console.error('Ошибка отправки email пользователю:', emailError);
      }
    }

    // Возвращаем успешный ответ
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Данные успешно сохранены'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // В случае ошибки возвращаем информацию об ошибке
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. **ВАЖНО:** Замените `your-email@example.com` на ваш реальный email адрес (строка 54)

## Шаг 3: Настройка веб-приложения

1. В редакторе Google Apps Script нажмите **Развернуть** → **Новое развертывание**
2. Нажмите на иконку шестеренки рядом с "Тип развертывания" и выберите **Веб-приложение**
3. Заполните настройки:
   - **Описание**: "Форма заказа журнала" (или любое другое)
   - **Запускать от имени**: "Меня" (ваш аккаунт)
   - **У кого есть доступ**: "Все" (чтобы форма могла отправлять данные)
4. Нажмите **Развернуть**
5. При первом развертывании вам будет предложено авторизовать приложение:
   - Нажмите **Авторизовать доступ**
   - Выберите ваш Google аккаунт
   - Нажмите **Дополнительно** → **Перейти к [название проекта] (небезопасно)**
   - Нажмите **Разрешить**
6. После авторизации скопируйте **URL веб-приложения** (он будет выглядеть примерно так: `https://script.google.com/macros/s/AKfycby.../exec`)

## Шаг 4: Настройка в коде проекта

1. Откройте файл `src/assets/js/pages/benex.ts`
2. Найдите строку:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```
3. Замените `YOUR_SCRIPT_ID` на URL вашего веб-приложения (скопированный на шаге 3)
4. Сохраните файл

## Шаг 5: Тестирование

1. Соберите проект: `yarn build` или `yarn watch`
2. Откройте страницу с формой заказа журнала (например, `/BENex/2025/BENex21.html`)
3. Нажмите на кнопку "Заказ журнала" рядом с любой записью
4. Заполните поля "Страницы" и "Email" и нажмите "Отправить"
5. Проверьте:
   - В Google Таблице должна появиться новая строка с данными
   - На указанный email администратора должно прийти письмо с данными заказа
   - На email пользователя должно прийти письмо с подтверждением заказа

## Дополнительные настройки

### Изменение формата email

Вы можете изменить формат письма, отредактировав переменную `emailBody` в функции `doPost`.

### Добавление дополнительных полей

Если нужно добавить дополнительные поля в форму:
1. Обновите форму в `src/assets/js/pages/benex.ts`
2. Добавьте соответствующие колонки в Google Таблицу
3. Обновите код `doPost` для обработки новых полей

### Ограничение доступа

Если вы хотите ограничить доступ к форме, можно:
- Использовать проверку домена в Google Apps Script
- Добавить простую авторизацию через токен

## Устранение проблем

### Форма не отправляется

- Проверьте, что URL Google Apps Script правильно скопирован
- Убедитесь, что веб-приложение развернуто с доступом "Все"
- Проверьте консоль браузера на наличие ошибок

### Данные не записываются в таблицу

- Убедитесь, что скрипт привязан к правильной таблице
- Проверьте логи выполнения в Google Apps Script (Вид → Журналы выполнения)

### Email не приходит

- Проверьте, что email адрес указан правильно
- Убедитесь, что у скрипта есть права на отправку email (при первом запуске будет запрос разрешений)
- Проверьте папку "Спам" в почтовом ящике

## Безопасность

- URL веб-приложения будет публичным, но это нормально для форм
- Google Apps Script имеет встроенную защиту от спама
- Для дополнительной защиты можно добавить проверку домена или токен
