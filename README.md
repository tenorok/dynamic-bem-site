# Динамический [БЭМ](http://ru.bem.info)-сайт на Node.js

## Результат

[Демо](http://tenorok.github.io/shri-bem-practice/index/)

## Необходимые инструменты

* [Node.js](http://nodejs.org/)
* [NPM](http://npmjs.org/)
* [MongoDB](http://docs.mongodb.org/manual/installation/)

## Запуск

    git clone git@github.com:tenorok/dynamic-bem-site.git
    cd dynamic-bem-site
    npm install
    ./node_modules/.bin/bem make libs
    
В качестве базы данных используется [mongodb](http://www.mongodb.org/). Следующей командой можно добавить примерные данные для сайта.

    node data/insert.js
    
После этого можно запустить сайт.

    node index.js
    
## Маршруты

Будет запущен [express](http://expressjs.com/)-сервер, проводящий следующие маршруты:

* [localhost:3000/](http://localhost:3000/) — все контакты
* [localhost:3000/:id](http://localhost:3000/0) — один контакт по id

В конце адреса можно добавить `.bemjson`:

* [localhost:3000/.bemjson](http://localhost:3000/.bemjson) — посмотреть сформированный bemjson для всего списка контактов
* [localhost:3000/:id.bemjson](http://localhost:3000/0.bemjson) — bemjson для одного контакта

Данные сервер присылает по адресам:

* [localhost:3000/api/contacts](http://localhost:3000/api/contacts) — данные по всем контактам
* [localhost:3000/api/contacts/:id](http://localhost:3000/api/contacts/0) — по одному контакту

## Режимы запуска

### Production

В этом режиме не осуществляется сборка проекта при запросах.

    NODE_ENV=production node index.js

## Материалы

* [Лекции Школы Разработки Интерфейсов Яндекса](http://tech.yandex.ru/education/shri/)
* [Сайт про БЭМ](http://ru.bem.info)
* [БЭМ на гитхабе](http://github.com/bem)
