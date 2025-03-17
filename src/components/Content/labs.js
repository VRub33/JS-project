import React from 'react';

export const labs = [
    'Лабораторная работа 1',
    'Лабораторная работа 2',
    'Лабораторная работа 3',
    'Лабораторная работа 4',
    'Лабораторная работа 5',
    'Лабораторная работа 6',
    'Лабораторная работа 7',
    'Лабораторная работа 8',
    'Лабораторная работа 9'
  ];

export const labDescriptions = {
    'Лабораторная работа 1': () => (
        <ul type="dics">
            <li>Реализовать скрипт, который уведомит о полной загрузке страницы</li>
            <li>Реализовать кнопку счетчик, которая будет увеличивать счетчик на "1" и вывести его значение на страницу (button onclick)</li>
            <li>Реализовать кнопку счетчик, которая будет уменьшать счетчик на "1" реализовать с помощью listener click</li>
            <li>Реализовать форму аутентификации пользователя (&lt;form&gt;)</li>
            <ul type="circle">
                <li>Реализовать скрипт очистки данных формы</li>
                <li>Реализовать скрипт отправки данных формы с помощью listener submit.</li>
                <li>Без отправки на сервер провести валидацию введенных данных, если login=="admin" & pass=="admin" вывести сообщение об успехе, иначе сообщение о неуспехе</li>
                <li>Реализовать скрипт сохранения учетных данных и автоподстановку оных с помощью localStorage</li>
            </ul>
        </ul>
    ),
        
    'Лабораторная работа 2': () => (
        <ul type="disc">
            <li>Создать "Hello World" приложение на основе React.</li>
            <li>Для создания можно использовать create-react-app или vite</li>  
            <li>Реализовать компонент кнопку, контейнер и использовать их на странице</li>
            <li>Реализовать шаблон страницы и разместить на нем компоненты навигации </li>
            <li>Разместить проект в репозиторий в github</li>
            <li>Прикрепить текстовый файл с сылкой на проект</li>    
        </ul>
    ),

    'Лабораторная работа 3': () => (
        <ul type="disc">
            <li>Продолжаем задание "Реализовать шаблон страницы и разместить на нем компоненты навигации" (Можно использовать готовые библиотеки Mui/Bootstrap и тд)</li>
            <ul type="circle">
                <li>Реализуем компоненты Header, Footer, Menu и Content</li>
                <li>В меню выводим список лабораторных работ</li>
                <li>В Content  выводим содержимое лабораторной работы</li>
            </ul>
            <li>Разместить проект в репозиторий в github</li>
            <li>Прикрепить текстовый файл с сылкой на проект</li>
        </ul>
    ),
    
    'Лабораторная работа 4': () => (
        <ul type="disc">
            <li>Реализовать изменение темы (день/ночь) используя Context</li>
            <li>useState и useEffect - простые примеры</li>
            <li>Внедрить в проект react-router</li>
            <ul type="cyrcle">
                <li>В меню проекта реализовать ссылки переходы</li>
                <li>В Content реализовать обработчик роутов</li>
            </ul> 
            <li>Внедрить в проект redux</li>
            <ul type="cyrcle">
                <li>Реализовать несколько action и reducer, например increment/decrement счетчика</li>
            </ul>
        </ul>
    ),
    
    'Лабораторная работа 5': () => (
        <ul type="disc">
            <li>Реализовать форму регистрации или форму обратной связи с помощью React-hook-forms или Formik</li>
            <li>Обработать submit через useCallback функции по примеру Лабораторной работы 1</li>
            <li>Разместить лабораторную работу в репозиторий в github отдельным коммитом</li>
            <li>Прикрепить текстовый файл с сылкой на проект</li>
        </ul>
    ),

    'Лабораторная работа 6': () => (
        <ul type="disc">
            <li>Реализовать или использовать простой REST сервер</li>
            <li>Реализовать несколько (GET, POST, PUT, DELETE) запросов на сервер используя промисы JS (fetch, axios). Можно использовать форму отправки из лабораторной работы №5.</li>
            <li>Вывести результаты GET запроса от сервера на экран, например, все отзывы обратной связи. Для оптимизации использовать redux</li>
            <li>Разместить лабораторную работу в репозиторий в github отдельным коммитом</li>
            <li>Прикрепить текстовый файл с сылкой на проект</li>      
        </ul>
    ),
    
    'Лабораторная работа 7': () => (
        <ul type="disc">
            <li>Внедрить в проект UI Kit Mui/Bootstrap или им подобное, для возможности адаптива.</li>
            <li>Реализовать Header (Главная, О себе) - отдельные страницы. Изменение темы на темную перенести в Header.</li>
            <li>Реализовать Menu (Drawer/Slider) - Меню по прежнему должно открывать список лабораторных, но должно быть скрываемым и вызываться из Header по кнопке-иконке.</li>
            <li>В нижнем меню организовать вызов быстрых действий (обратная связь и пр)</li>
            <li>Проконтролировать, что приложение стало адаптивным под разные устройства.</li>
            <li>Разместить лабораторную работу в репозиторий в github отдельным коммитом</li>
            <li>Прикрепить текстовый файл с сылкой на проект</li>
        </ul>
    ),
    
    'Лабораторная работа 8': () => (
        <ul type="disc">
            <li>Внедрить в проект  таблицы react-table. Для просмотра на мобильных устройствах зафиксировать первую колонку, остальные скроллировать.</li>
            <li>Добавить возможность сортировки и перетаскивания колонок. * Реализовать динамическую подгрузку данных (виртуализация) при скроллировании</li>
            <li>Разместить лабораторную работу в репозиторий в github отдельным коммитом</li>
            <li>Прикрепить текстовый файл с сылкой на проект</li>
        </ul>
    ),
    
    'Лабораторная работа 9': () => (
        <ul type="disc">
            <li>Написать тест для компонента кнопки</li>
            <li>Провести рефакторинг страницы со списком данных с сервера. Переписать запрос к backend через rtk-query(useGetPostsQuery). </li>
            <li>Используя isError, isLoading, isFetching отрисовать спиннер загрузки, сообщение об ошибке и результат успешного запроса</li>
            <li>* "Ленивые" импорты. Разбить приложение на Chunks (не обязательно)</li>
            <li>Результат работы разместить на github отдельным коммитом.</li>
            <li>Ссылку на репозиторий приложить к заданию</li>
        </ul>
    )
};