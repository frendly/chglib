# Установка
1. Необходимо установить nodejs – https://nodejs.org/dist/v12.6.0/node-v12.6.0-x64.msi
Скачиваем файл и устанавливаем по-умолчанию, ничего менять не нужно.
2. Необходимо установить git – https://git-scm.com/download/win
Скачиваем файл и устанавливаем по-умолчанию, ничего менять не нужно.
3. Необходимо установить vs code(редактор кода) – https://code.visualstudio.com/docs/?dv=win
Скачиваем файл и устанавливаем поставив галочки:
* создать ярлык на рабочем столе
* Добавитть действие "Открыть с помощью Code" в контекстное меню файла проводника Windows
* Добавить в PATH
4. В пуске найти приложение `git bash` и запустить его
5. Откроется консоль, в которой будем писать `выделенный текст`
6. Вставить текст(shift + insert или правой кнопкой мыши - paste) `git clone https://iplt-test@bitbucket.org/frendly/chglib.git`
7. Появится окно, в котором нужно ввести пароль от сервиса
8. В консоли появится текст _Cloning into 'chglib'..._
9. Переходим в каталог с сайтом `cd chglib/`
10. Устанавливаем yarn `npm i -g yarn`
11. Устанавливаем зависимости проекта `yarn`

#Разработка
1. Перейти в папку с проектом `cd chglib`
2. Запустить локальный сервер `yarn watch`, откроектся браузер с сайтом
3. Открыть редактор vs code на рабочем столе
4. Вносим изменения...
5. Изменения нужно сохранить в репозитории(хранилище)
  * Сохранить файл – ctrl + S
  * На вкладке репозитория нажать `+` возле измененных файлов
  * В поле 'message' кратко описать суть изменения, например, 'add news'
  * Нажать три точки `...` и `push` – это отправит наши изменения в репозиторий
6. Остановить локальный сервер в консоли ctrl + C
7. Отправить изменения на наш сервер `yarn deploy`