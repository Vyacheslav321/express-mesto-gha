[![Tests](https://github.com/Vyacheslav321/express-mesto-gha/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/Vyacheslav321/express-mesto-gha/actions/workflows/tests-13-sprint.yml) [![Tests](https://github.com/Vyacheslav321/express-mesto-gha/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/Vyacheslav321/express-mesto-gha/actions/workflows/tests-14-sprint.yml)
# Проект Mesto фронтенд + бэкенд



### Бэкенд сайта "Mesto".

В рамках спринта 13 реализован следующий функционал: 
- редактирование профиля пользователя
- создание карточки фотографий
- удаление карточки фотографий
- постановка лайков
- обработка ошибок некорректных запросов

В рамках спринта 14 реализован следующий функционал: 
- идентификация в рамках создание пользователя
- аутентификация пользователя
- хеширование пароля для БД
- авторизация пользователя 
- обработка ошибок некорректных запросов 

 [Ссылка на проект](https://github.com/Vyacheslav321/express-mesto-gha)

## Настройка бейджей статуса тестов
Перед началом работы над проектом рекомендуется исправить бейджи, отражающие статус прохождения тестов.
Для этого замените разметку бейджей на следующий фрагмент, подставив вместо `${имя_пользователя}` и `${имя_репозитория}` соответствующие значения.

```
[![Tests for sprint 13](https://github.com/${имя_пользователя}/${имя репозитория}/actions/workflows/tests-13-sprint.yml/badge.svg)](https://github.com/${имя_пользователя}/${имя репозитория}/actions/workflows/tests-13-sprint.yml) 

[![Tests for sprint 14](https://github.com/${имя_пользователя}/${имя репозитория}/actions/workflows/tests-14-sprint.yml/badge.svg)](https://github.com/${имя_пользователя}/${имя репозитория}/actions/workflows/tests-14-sprint.yml)
```


## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки  
  
Остальные директории вспомогательные, создаются при необходимости разработчиком

## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload
