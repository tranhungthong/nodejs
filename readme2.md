# Nodejs training

## Description

Tài liệu này trình bày cách cài đặt các extention như Tailwindcss, dateformat, dotenv, ejs...
. MongoDB, bố trí lại các thư mục, sửa chức năng login để connect với DB và code chức năng Book (CRUD)

## Installing
- <strong>Tailwind</strong>: Framework css
    ```
    # Using npm
    npm install tailwindcss --dev   
    ``` 

- <strong>cookie-parser</strong>: Parser cookie từ header
    ```
    $ npm install cookie-parser   
    ``` 

- <strong>dateformat</strong>: Format datetime
    ```
    $ npm install dateformat
    ``` 

- <strong>dotenv</strong>: Module dùng để load biến từ file .env
    ```
    $ npm install dotenv
    ``` 

- <strong>ejs</strong>: Quản lý view trong Nodejs
    ```
    $ npm install ejs
    ``` 

- <strong>express-ejs-layouts</strong>: Hỗ trợ layout trong expressjs
    ```
    $ npm install express-ejs-layouts
    ``` 

- <strong>mongoose</strong>: Hỗ trợ kết nối với database mongodb
    ```
    $ npm install mongoose
    ``` 

- <strong>Multer</strong>: Module cho việc upload file
    ```
    $ npm install mongoose
    ``` 

- <strong>MongoDB</strong>: Database
    ```
    Download bộ cài đặt từ https://www.mongodb.com/ và cài đặt
    ``` 


## Setting
### Tailwind

- Thêm màu sắc vào Tailwind. Tạo file tailwind.config.js với nội dung sau
    ```js
    module.exports = {
    future: {
        // removeDeprecatedGapUtilities: true,
        // purgeLayersByDefault: true,
    },
    purge: [],
    theme: {
        extend: {
        colors: {
                primary: {
                    100: '#25CB97',
                    200: '#1DA57A',
                    },
                    sitebar: {
                    100: '#E2E2D5',
                    900: '#001529',
                    },
                }
            },
        },
        variants: {},
        plugins: [],
    }

    ```

- Custom class css. Tạo file stylesheets/taiwind.css với nội dung sau
    ```
    @tailwind base;

    @tailwind components;

    @tailwind utilities;

    .input{
        @apply transition duration-500 appearance-none block w-full bg-white text-sm border border-gray-400 rounded py-2 px-4 leading-tight;
    }

    .input:focus{
        @apply outline-none bg-white border-primary-200 shadow-inner;
    }

    .input:hover{
        @apply border-primary-200;
    }

    .btn{
        @apply transition duration-500 py-2 px-4 mt-2 text-center float-right bg-primary-200 rounded-md text-white text-sm;
    }

    .btn:focus{
        @apply outline-none shadow-outline border-blue-300;
    }

    .btn:hover{
        @apply bg-primary-100;
    }

    .combobox{
        @apply transition duration-500 mt-1 block w-full py-2 px-3 border border-gray-400 bg-white rounded-md shadow-sm  transition duration-150 ease-in-out;
    }

    .combobox:focus{
        @apply outline-none border-primary-200;
    }

    .combobox:hover{
        @apply border-primary-200;
    }

    ```
- Thêm đoạn code sau vào file package.json để build custom tailwind css file
    ```js
    "build-css": "npx tailwindcss build ./public/stylesheets/tailwind.css -o ./public/stylesheets/style.css"
    ```

- Generate tailwind ra file stylesheets/style.css
    ```
    $ npm run build-css
    ```

## Thiết kế các màn hình
Mục này hướng dẫn cách tạo màn hình trong bài này. 
Sửa lại mô hình code theo mô hình MVC
- Tạo các thư mục views, controllers và models
- Tạo file middlewares/auth.middleware.js để check chức năng phân quyền như sau
    ```js
    var User = require('../models/user.model');

    module.exports.requireAuth = function (req, res, next) {

        if (!req.signedCookies.userid) {
            res.redirect('/auth/login');
        }

        User.findById(req.signedCookies.userid, function (err, foundData) {
            if (foundData != null) {
                next();
            }
        });
    }
    ```
- Tạo file app.js với nội dung
    ```js
    const express = require('express');
    require('dotenv').config();
    require('./database');
    const expressLayouts = require('express-ejs-layouts')
    var path = require('path');
    const app = express();
    const port = 3000;

    app.set('layout', './layouts/layout')
    app.use(expressLayouts)

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static(__dirname + '/public'));

    var bodyParser = require('body-parser');
    var cookieParser = require('cookie-parser');

    app.use(bodyParser.json());

    app.use(express.urlencoded({
        extended: true
    }))

    app.use(cookieParser(process.env.SESSION_SECRET));

    app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    })
    ```

### 1. Thiết kế màn hình chính. Gồm các file dưới đây
- layouts/layout.ejs
    ```html
    <html>

    <head>
        <title>Title</title>
        <link rel="stylesheet" href="./stylesheets/style.css" />
        <link rel="stylesheet" href="./stylesheets/mystyle.css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="./scripts/menu.js"></script>
    </head>

    <body>
        <div class="flex h-screen bg-gray-200 font-roboto">
            <%- include ('sidebar.ejs') %>
            <div class="flex-1 flex flex-col overflow-hidden">
                <%- include ('header.ejs') %>
                <!-- <div style="box-shadow: 0 6px 50px -18px rgba(0,0,0,.81)"></div> -->
                <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 mt-4">
                    <div class="mx-auto px-4">
                        <div class="max-w-sm w-full lg:max-w-full lg:flex bg-white">
                            <%- body%>
                        </div>                    
                    </div>
                </main>
            </div>
        </div>
    </body>

    </html>

    <%- include ('confirm.ejs') %>
    ```

- layouts/header.ejs
    ```html
    <header class="flex justify-between items-center py-4 px-6 bg-white shadow-xl">
    <div class="flex items-center">
        <button id="btnCollapse" class="text-gray-500 focus:outline-none">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        </button>
    </div>

    <div class="flex items-center">
        <button class="flex mx-4 text-gray-600 focus:outline-none">
        <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
            d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        </button>

        <div class="relative mysetting">
        <button id="btnavatar" class="relative z-10 block h-8 w-8 rounded-full overflow-hidden shadow focus:outline-none">
            <img class="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1528892952291-009c663ce843?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=296&q=80"
            alt="Your avatar" />
        </button>

        <div id="my-setting" class="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20 hidden">
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white">Profile</a>
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white">Products</a>
            <a href="/auth/logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-600 hover:text-white">Log out</a>
        </div>
        </div>
    </div>
    </header>
    ```

- layouts/sidebar.ejs
    ```html
    <div class="flex">
        <div id="my-sidebar"
            class="fixed inset-y-0 left-0 w-64 transition duration-300 transform bg-sitebar-900 overflow-y-auto lg:translate-x-0 lg:static lg:inset-0">
            <div class="flex items-center justify-center mt-8">
                <div class="flex items-center">
                    <svg width="48px" height="48px" viewBox="0 0 256 289" version="1.1" xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid">
                        <g>
                            <path
                                d="M127.999999,288.463771 C124.024844,288.463771 120.314699,287.403728 116.869564,285.548656 L81.6231884,264.612838 C76.32298,261.697724 78.9730854,260.637682 80.5631458,260.107661 C87.7184259,257.72257 89.0434775,257.192547 96.4637688,252.952381 C97.2587979,252.422361 98.3188405,252.687372 99.1138718,253.217392 L126.144927,269.383024 C127.20497,269.913045 128.530021,269.913045 129.325053,269.383024 L235.064182,208.165634 C236.124225,207.635611 236.654245,206.575571 236.654245,205.250519 L236.654245,83.0807467 C236.654245,81.7556929 236.124225,80.6956526 235.064182,80.1656324 L129.325053,19.2132506 C128.26501,18.6832305 126.939959,18.6832305 126.144927,19.2132506 L20.4057954,80.1656324 C19.3457551,80.6956526 18.8157349,82.0207041 18.8157349,83.0807467 L18.8157349,205.250519 C18.8157349,206.31056 19.3457551,207.635611 20.4057954,208.165634 L49.2919247,224.861286 C64.9275364,232.811595 74.7329196,223.536234 74.7329196,214.260871 L74.7329196,93.681159 C74.7329196,92.0910985 76.0579711,90.5010358 77.9130428,90.5010358 L91.4285716,90.5010358 C93.0186343,90.5010358 94.6086948,91.8260873 94.6086948,93.681159 L94.6086948,214.260871 C94.6086948,235.196689 83.2132512,247.387164 63.3374737,247.387164 C57.2422362,247.387164 52.4720502,247.387164 38.9565214,240.761906 L11.1304347,224.861286 C4.24016581,220.886129 5.68434189e-14,213.46584 5.68434189e-14,205.515528 L5.68434189e-14,83.3457557 C5.68434189e-14,75.3954465 4.24016581,67.9751552 11.1304347,64.0000006 L116.869564,2.78260752 C123.494824,-0.927535841 132.505176,-0.927535841 139.130436,2.78260752 L244.869565,64.0000006 C251.759834,67.9751552 256,75.3954465 256,83.3457557 L256,205.515528 C256,213.46584 251.759834,220.886129 244.869565,224.861286 L139.130436,286.078676 C135.685299,287.668739 131.710145,288.463771 127.999999,288.463771 L127.999999,288.463771 Z M160.596274,204.455488 C114.219461,204.455488 104.679089,183.254659 104.679089,165.233955 C104.679089,163.643893 106.004141,162.053832 107.859212,162.053832 L121.639752,162.053832 C123.229813,162.053832 124.554864,163.113872 124.554864,164.703935 C126.674947,178.749484 132.770187,185.639753 160.861283,185.639753 C183.122154,185.639753 192.662526,180.604556 192.662526,168.67909 C192.662526,161.788821 190.012423,156.753624 155.296065,153.308489 C126.409938,150.393375 108.389235,144.033126 108.389235,120.977226 C108.389235,99.5113875 126.409938,86.7908901 156.621119,86.7908901 C190.542443,86.7908901 207.238095,98.4513472 209.358178,123.89234 C209.358178,124.687371 209.093167,125.482403 208.563147,126.277434 C208.033127,126.807454 207.238095,127.337474 206.443064,127.337474 L192.662526,127.337474 C191.337475,127.337474 190.012423,126.277434 189.747412,124.952382 C186.567289,110.376813 178.351966,105.606625 156.621119,105.606625 C132.240165,105.606625 129.325053,114.086957 129.325053,120.447205 C129.325053,128.132506 132.770187,130.5176 165.631471,134.757766 C198.227744,138.997931 213.598344,145.093169 213.598344,167.884058 C213.333333,191.20497 194.252589,204.455488 160.596274,204.455488 L160.596274,204.455488 Z"
                                fill="#539E43"></path>
                        </g>
                    </svg>

                    <span class="text-white text-2xl mx-2 font-semibold">Training Nodejs</span>
                </div>
            </div>

            <nav class="mt-10">
                <a class="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100"
                    href="/">
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M2 10C2 5.58172 5.58172 2 10 2V10H18C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10Z"
                            fill="currentColor" />
                        <path d="M12 2.25195C14.8113 2.97552 17.0245 5.18877 17.748 8.00004H12V2.25195Z"
                            fill="currentColor" />
                    </svg>

                    <span class="mx-4">Dashboard</span>
                </a>
                <a class="flex items-center mt-4 py-2 px-6 text-gray-500 hover:bg-gray-600 hover:bg-opacity-25 hover:text-gray-100"
                    href="/book">
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(0 -1028.4)">
                            <path d="m3 8v2 1 3 1 5 1c0 1.105 0.8954 2 2 2h14c1.105 0 2-0.895 2-2v-1-5-4-3h-18z"
                                transform="translate(0 1028.4)" fill="#16a085" />
                            <path d="m3 1035.4v2 1 3 1 5 1c0 1.1 0.8954 2 2 2h14c1.105 0 2-0.9 2-2v-1-5-4-3h-18z"
                                fill="#ecf0f1" />
                            <path d="m3 1034.4v2 1 3 1 5 1c0 1.1 0.8954 2 2 2h14c1.105 0 2-0.9 2-2v-1-5-4-3h-18z"
                                fill="#bdc3c7" />
                            <path d="m3 1033.4v2 1 3 1 5 1c0 1.1 0.8954 2 2 2h14c1.105 0 2-0.9 2-2v-1-5-4-3h-18z"
                                fill="#ecf0f1" />
                            <path
                                d="m5 1c-1.1046 0-2 0.8954-2 2v1 4 2 1 3 1 5 1c0 1.105 0.8954 2 2 2h2v-1h-1.5c-0.8284 0-1.5-0.672-1.5-1.5s0.6716-1.5 1.5-1.5h12.5 1c1.105 0 2-0.895 2-2v-1-5-4-3-1c0-1.1046-0.895-2-2-2h-4-10z"
                                transform="translate(0 1028.4)" fill="#16a085" />
                            <path d="m8 1v18h1 9 1c1.105 0 2-0.895 2-2v-1-5-4-3-1c0-1.1046-0.895-2-2-2h-4-6-1z"
                                transform="translate(0 1028.4)" fill="#1abc9c" />
                        </g>
                    </svg>

                    <span class="mx-4">Book list</span>
                </a>
            </nav>
        </div>
    </div>
    <script>
        $(document).ready(function ($) {
            var url = window.location;
            $('nav a').removeClass('bg-primary-200 text-gray-100');
            $('nav a').addClass('text-gray-500');
            $('nav a[href="' + url.pathname + '"]').addClass('bg-primary-200 text-gray-100');
            $('nav a[href="' + url.pathname + '"]').removeClass('text-gray-500');
        });
    </script>
    ```

### Thiết kế popup confirm
- layouts/confirm.ejs
    ```html
    <!--Modal-->
    <style>
        .modal-confirm {
            transition: opacity 0.25s ease;
        }

        body.modal-confirm-active {
            overflow-x: hidden;
            overflow-y: visible !important;
        }
    </style>
    <div
        class="modal-confirm opacity-0 pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center">
        <div class="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

        <div class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <!-- Add margin if you want to see some of the overlay behind the modal-->
            <div class="modal-content py-4 text-left">
                <!--Title-->
                <div class="flex justify-between items-center pb-3">
                    <p class="text-xl px-6">Confirm</p>
                    <div class="modal-confirm-close cursor-pointer z-50 px-6">
                        <svg class="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                            viewBox="0 0 18 18">
                            <path
                                d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z">
                            </path>
                        </svg>
                    </div>
                </div>
                <!--Body-->
                <div class="px-6 py-4">
                    <p id="confirm-message"></p>
                </div>

                <!--Footer-->
                <div class="flex justify-end pt-2">
                    <button
                        class="modal-confirm-open hover:border-teal-300 text-gray-600 hover:text-teal-600 py-1 px-4 mt-2 mr-2 border border-gray-300 rounded-md focus:outline-none focus:shadow-outline focus:border-blue-300">No</button>
                    <button
                        class="py-1 px-4 mt-2 text-center float-right bg-red-600 rounded-md text-white text-sm hover:bg-red-500 focus:outline-none focus:shadow-outline focus:border-red-300 mr-2"
                        id="btnYes">Yes</button>
                </div>
            </div>
        </div>
    </div>
    <script>
        var confirm_callback;

        var openmodal = document.querySelectorAll('.modal-confirm-open')
        for (var i = 0; i < openmodal.length; i++) {
            openmodal[i].addEventListener('click', function (event) {
                event.preventDefault()
                toggleModalConfirm(null)
            })
        }

        var closemodal = document.querySelectorAll('.modal-confirm-close')
        for (var i = 0; i < closemodal.length; i++) {
            closemodal[i].addEventListener('click', toggleModalConfirm)
        }

        document.onkeydown = function (evt) {
            evt = evt || window.event
            var isEscape = false
            if ("key" in evt) {
            } else {
                isEscape = (evt.keyCode === 27)
            }
            if (isEscape && document.body.classList.contains('modal-confirm-active')) {
                toggleModalConfirm(null)
            }
        };

        function toggleModalConfirm(message, callback) {
            const body = document.querySelector('body')
            const modal = document.querySelector('.modal-confirm')
            modal.classList.toggle('opacity-0')
            modal.classList.toggle('pointer-events-none')
            body.classList.toggle('modal-confirm-active')

            $('#confirm-message').html(message);

            confirm_callback = callback;
        }

        $(function () {
            $('#btnYes').click(function (e) {
                e.preventDefault();
                confirm_callback(true);
            })
        });
    </script>
    ```

### 1. Sửa lại màn hình login như dưới
- views/user/login.ejs
    ```html
    <div class="flex justify-center items-center h-screen bg-gray-200 px-6">
        <div class="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
            <div class="flex justify-center items-center">
                <svg class="h-10 w-10" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z"
                        fill="#4C51BF" stroke="#4C51BF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path
                        d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z"
                        fill="white" />
                </svg>
                <span class="text-gray-700 font-semibold text-2xl">Login</span>
            </div>

            <form class="mt-4" method="POST">
                <% if(errors){ %>
                <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-2" role="alert">
                    <p><%= errors %></p>
                </div>
                <% } %>
                <label class="block">
                    <span class="text-gray-700 text-sm">Email</span>
                    <input
                        class="transition duration-500 appearance-none block w-full bg-white-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-teal-500 focus:shadow-inner hover:border-teal-500"
                        id="username" type="email" name="username">
                </label>

                <label class="block mt-3">
                    <span class="text-gray-700 text-sm">Password</span>
                    <input
                        class="transition duration-500 appearance-none block w-full bg-white-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-teal-500 focus:shadow-inner hover:border-teal-500"
                        id="password" type="password" name="password">
                </label>

                <div class="flex justify-between items-center mt-4">
                    <div>
                        <label class="inline-flex items-center">
                            <input type="checkbox" class="form-checkbox h-4 w-4 text-teal-600" />
                            <span class="mx-2 text-gray-600 text-sm">Remember me</span>
                        </label>
                    </div>

                    <div>
                        <a class="block text-sm fontme text-indigo-700 hover:underline" href="#">Forgot your password?</a>
                    </div>
                </div>

                <div class="mt-6">
                    <button
                        class="py-2 px-4 text-center bg-teal-600 rounded-md w-full text-white text-sm hover:bg-teal-500 focus:outline-none focus:shadow-outline focus:border-blue-300"
                        type="submit">
                        Login
                    </button>
                </div>
            </form>
        </div>
    </div>
    ```

- controllers/auth.controller.js
    ```js
    var User = require('../models/user.model');

    module.exports.login = function (req, res) {
        res.render('users/login', {
            title: 'login form',
            layout: '../views/layouts/empty',
            errors: null
        });
    };

    module.exports.postLogin = function (req, res) {
        var username = req.body.username;
        var password = req.body.password;
        
        User.find({ email: username, password: password }, function (err, foundData) {
            if (foundData.length > 0) {
                res.cookie('userid', foundData[0]._id, {
                    signed: true
                });

                res.redirect('/');
            }

            res.render('users/login', {
                layout: '../views/layouts/empty',
                errors: [
                    'Email or password not correct.'
                ]
            });
        });
    };

    module.exports.logout = function (req, res) {
        res.clearCookie('userid');

        res.render('users/login', {
            title: 'login form',
            layout: '../views/layouts/empty',
            errors: null
        });
    };
    ```

- models/user.model.js
    ```js
    var mongoose = require('mongoose');

    var userSchema = new mongoose.Schema({
        name: String,
        phone: String,
        email: String,
        password: String
    });

    var User = mongoose.model('User', userSchema, 'User');

    module.exports = User;
    ```
- Thêm route url và check phân quyền vào app.js
    ```js
    var authMiddleware = require('./middlewares/auth.middleware');
    var loginRoute = require('./routes/auth.route');
    
    app.get('/', authMiddleware.requireAuth, (req, res) => {
        res.render('index', {
            title: 'Home page'
        });
    });

    app.use('/auth', loginRoute);
    ```

### 2. Thiết kế màn Book list
- views/books/index.ejs
    ```html
    <!--Regular Datatables CSS-->
    <link href="https://cdn.datatables.net/1.10.19/css/jquery.dataTables.min.css" rel="stylesheet">
    <!--Responsive Extension Datatables CSS-->
    <link href="https://cdn.datatables.net/responsive/2.2.3/css/responsive.dataTables.min.css" rel="stylesheet">
    <!--Button Extension Datatables CSS-->
    <link rel="stylesheet" href="https://cdn.datatables.net/buttons/1.6.4/css/buttons.dataTables.min.css">
    <style>
        /* Overrides to match the Tailwind CSS */

        .dataTables_wrapper {
            padding-top: 0.25rem;
            padding-bottom: 0.25rem
        }

        table.dataTable.no-footer {
            border-bottom-width: 1px;
            border-color: #fafafa;
        }

        .dataTables_wrapper .dataTables_paginate {
            padding: 1rem
        }

        table.dataTable thead tr th {
            background-color: #fafafa;
            border-bottom-width: 1px;
            /* border-top-width: 1px; */
            border-color: rgb(232, 232, 232);
        }

        .dataTables_wrapper .dataTables_paginate .paginate_button.current:not(.disabled),
        .dataTables_wrapper .dataTables_paginate .paginate_button.next:not(.disabled),
        .dataTables_wrapper .dataTables_paginate .paginate_button.previous:not(.disabled),
        .dataTables_wrapper .dataTables_paginate .paginate_button:not(.disabled),
        button.dt-button {
            transition-duration: 150ms;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #374151 !important;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            font-size: 0.75rem;
            font-weight: 600;
            align-items: center;
            display: inline-flex;
            border-width: 1px !important;
            border-color: #d2d6dc !important;
            border-radius: 0.375rem;
            background: #ffffff;
            overflow: visible;
            margin-bottom: 0
        }

        .dataTables_wrapper .dataTables_paginate .paginate_button.next:focus:not(.disabled),
        .dataTables_wrapper .dataTables_paginate .paginate_button.next:hover:not(.disabled),
        .dataTables_wrapper .dataTables_paginate .paginate_button.previous:focus:not(.disabled),
        .dataTables_wrapper .dataTables_paginate .paginate_button.previous:hover:not(.disabled),
        .dataTables_wrapper .dataTables_paginate .paginate_button:focus:not(.disabled),
        .dataTables_wrapper .dataTables_paginate .paginate_button:hover:not(.disabled),
        button.dt-button:focus,
        button.dt-button:focus:not(.disabled),
        button.dt-button:hover,
        button.dt-button:hover:not(.disabled) {
            background-color: #edf2f7 !important;
            border-width: 1px !important;
            border-color: #d2d6dc !important;
            color: #374151 !important
        }

        .dataTables_wrapper .dataTables_paginate .paginate_button.current:not(.disabled) {
            color: rgb(29, 165, 122) !important;
            border-color: rgb(29, 165, 122) !important;
        }
    </style>
    <div class="w-full mt-5 ml-5 mb-5 mr-5">
        <div class="grid grid-cols-1">
            <p class="text-2xl">Book list</p>
        </div>
        <div class="flex mb-4">
            <div class="pt-2 relative text-gray-600 w-1/4 h-12">
                <form method="POST">
                    <input
                        class="input"
                        type="search" name="search" placeholder="Search" value="<%=search%>">
                    <button id="btnSearch" type="submit" class="absolute right-0 top-0 mt-4 mr-4">
                        <svg class="text-gray-600 h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px"
                            viewBox="0 0 56.966 56.966" style="enable-background:new 0 0 56.966 56.966;"
                            xml:space="preserve" width="512px" height="512px">
                            <path
                                d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                        </svg>
                    </button> </form>
            </div>
            <div class="w-3/4 h-12">
                <button
                    class="btn modal-open"
                    type="button">
                    Add book
                </button>
            </div>
        </div>
        <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div class="inline-block min-w-full rounded-lg overflow-hidden">
                <table id="grBook" class="min-w-full leading-normal mr-4" style="border: 1px solid #f2f2f2;">
                    <thead>
                        <tr>
                            <th
                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Title
                            </th>
                            <th
                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Author
                            </th>
                            <th
                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Created at
                            </th>
                            <th
                                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Notfound data -->
                        <% if(!books){ %>
                        <tr>
                            <td colspan="4">
                                <div class="container mx-auto h-full flex justify-center items-center">
                                    <div class="h-32 mt-12">
                                        <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
                                            <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
                                                <ellipse fill="#F5F5F5" cx="32" cy="33" rx="32" ry="7"></ellipse>
                                                <g fill-rule="nonzero" stroke="#D9D9D9">
                                                    <path
                                                        d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z">
                                                    </path>
                                                    <path
                                                        d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                                                        fill="#FAFAFA"></path>
                                                </g>
                                            </g>
                                        </svg>
                                        <p class="text-gray-500 ml-1">No data</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <% } %>

                        <!-- has data -->
                        <% if(books){ %>
                        <% books.forEach(function(book){ %>
                        <tr>
                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 w-10 h-10">
                                        <img class="w-full h-full rounded-full"
                                            src="<%=book.img_cover==""?"images/notfound.png":book.img_cover%>"
                                            alt="" />
                                    </div>
                                    <div class="ml-3">
                                        <a href="#" class="edit-modal">
                                            <p class="text-gray-900 whitespace-no-wrap">
                                                <%=book.title%>
                                            </p>
                                        </a>
                                    </div>
                                </div>
                            </td>
                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-gray-900 whitespace-no-wrap"> <%=book.author%></p>
                            </td>
                            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <p class="text-gray-900 whitespace-no-wrap">
                                    <%=book.create_date%>
                                </p>
                            </td>
                            <td class="flex px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512"
                                    width="24px" height="40px"
                                    style="enable-background:new 0 0 512 512;opacity: 0.7;cursor: pointer;" class="btnedit"
                                    xml:space="preserve" data-id="<%=book._id%>">
                                    <g>
                                        <g>
                                            <g>
                                                <polygon
                                                    points="85.333,282.64 85.333,362.64 165.333,362.64 378.667,149.307 298.667,69.307 			" />
                                                <path d="M441.707,56.08L391.893,6.267c-8.32-8.32-21.867-8.32-30.187,0L320,47.973l80,80l41.707-41.707
                    C450.027,77.947,450.027,64.4,441.707,56.08z" />
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="40px"
                                    class="book-delete" viewBox="0 0 488.936 488.936"
                                    style="enable-background:new 0 0 488.936 488.936;margin-left: 10px;opacity: 0.7;cursor: pointer;"
                                    xml:space="preserve" data-id="<%=book._id%>">
                                    <g>
                                        <g>
                                            <path d="M381.16,111.948H107.376c-6.468,0-12.667,2.819-17.171,7.457c-4.504,4.649-6.934,11.014-6.738,17.477l9.323,307.69
                c0.39,12.92,10.972,23.312,23.903,23.312h20.136v-21.012c0-24.121,19.368-44.049,43.488-44.049h127.896
                c24.131,0,43.893,19.928,43.893,44.049v21.012h19.73c12.933,0,23.52-10.346,23.913-23.268l9.314-307.7
                c0.195-6.462-2.234-12.863-6.738-17.513C393.821,114.767,387.634,111.948,381.16,111.948z" />
                                            <path d="M309.166,435.355H181.271c-6.163,0-11.915,4.383-11.915,11.516v30.969c0,6.672,5.342,11.096,11.915,11.096h127.895
                c6.323,0,11.366-4.773,11.366-11.096v-30.969C320.532,440.561,315.489,435.355,309.166,435.355z" />
                                            <path d="M427.696,27.106C427.696,12.138,415.563,0,400.591,0H88.344C73.372,0,61.239,12.138,61.239,27.106v30.946
                c0,14.973,12.133,27.106,27.105,27.106H400.59c14.973,0,27.105-12.133,27.105-27.106L427.696,27.106L427.696,27.106z" />
                                        </g>
                                    </g>
                                </svg>
                            </td>
                        </tr>
                        <% }); %>

                        <% } %>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <%- include ('book_dialog.ejs') %>
    <script type="text/javascript"
        src="https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.10.22/b-1.6.4/b-flash-1.6.4/b-html5-1.6.4/b-print-1.6.4/datatables.min.js"></script>
    <script>
        $(document).ready(function () {
            // add class
            let table = $('#grBook').DataTable({
                "searching": false,
                "lengthChange": false,
                "info": false
            });
        });

        var currentId = '';

        function deleteCallback(val) {
            if (val == true) {
                var data = { "id": currentId }
                $.ajax({
                    type: 'POST',
                    data: JSON.stringify(data),
                    contentType: 'application/json',
                    url: '/book/delete',
                    success: function (res) {
                        if (res.type == "success") {
                            toggleModalConfirm();
                            $('#btnSearch').trigger('click');
                        } else {
                            $('#dmess').show();
                            $('#message_error').html(res.description);
                        }
                    }
                });
            }
        }

        var editmodal = document.querySelectorAll('.book-delete')
        for (var i = 0; i < editmodal.length; i++) {
            editmodal[i].addEventListener('click', function (event) {
                event.preventDefault()
                currentId = $(this).data('id');
                toggleModalConfirm("Are you sure delete this book.", deleteCallback)
            })
        }
    </script>
    ```
- controller/book.controller.js
    ```js
    var Book = require('../models/book.model');
    var dateFormat = require('dateformat');
    var globals = require('../global')


    module.exports.index = async function (req, res) {
        // get data
        await Book.find({ is_del: false }, function (err, data) {
            if (data.length > 0) {
                res.render('books/index', {
                    books: data,
                    search: null
                });

                return;
            }
        });

        res.render('books/index', { books: null, search: null });
    };

    module.exports.add = async function (req, res) {
        // validate    

        var now = new Date();

        var book = new Book({
            title: req.body.book_title,
            author: req.body.book_author,
            summary: req.body.book_summary,
            genre: req.body.book_genre,
            ISBN: '',
            img_cover: '',
            create_date: dateFormat(now, "yyyy/MM/dd"),
            create_by: req.signedCookies.userid,
            update_date: dateFormat(now, "yyyy/MM/dd"),
            update_by: req.signedCookies.userid,
            is_del: false
        });

        if (req.file != null) {
            book.img_cover = req.file.path.split('\\').slice(1).join('\\');
        }

        var valid = ValidateBook(book);

        if (valid != '') {
            globals.error.description = valid;
            res.json(globals.error);
            return;
        }

        await book.save(function (err) {
            if (err) {
                globals.error.description = err;
                res.json(globals.error);
                return;
            }
        })

        res.json(globals.success);
    };

    function ValidateBook(book) {
        var msg = '';
        if (!book.title) {
            msg += 'Title is required.'
        }

        return msg;
    }

    module.exports.update = async function (req, res) {
        // validate    
        if (req.body.book_title == null || req.body.book_title == '') {
            globals.error.description = 'Title is required.';
            res.json(globals.error);
            return;
        }

        var now = new Date();

        var book = await Book.findOne({ _id: req.body.book_id }, function (err, data) {
            var aaa = 1;
        });
        
        book.title = req.body.book_title;
        book.author = req.body.book_author;
        book.summary = req.body.book_summary;
        book.genre = req.body.book_genre;
        book.update_date = dateFormat(now, "yyyy/MM/dd");
        book.update_by = req.signedCookies.userid;

        if (req.file != null) {
            book.img_cover = req.file.path.split('\\').slice(1).join('\\');
        }

        await book.save(function (err) {
            if (err) {
                globals.error.description = err;
                res.json(globals.error);
                return;
            }
        })

        res.json(globals.success);
    };

    module.exports.delete = async function (req, res) {
        // validate    
        var now = new Date();

        var book = await Book.findOne({ _id: req.body.id }, function (err, data) {
            var aaa = 1;
        });

        book.is_del = true;
        book.update_date = dateFormat(now, "yyyy/MM/dd");
        book.update_by = req.signedCookies.userid;

        await book.save(function (err) {
            if (err) {
                globals.error.description = err;
                res.json(globals.error);
                return;
            }
        })

        res.json(globals.success);
    };

    module.exports.getABook = async function (req, res) {
        await Book.find({ _id: req.query.id }, function (err, data) {
            if (data != null && data.length > 0) {
                globals.success.data = data;
                res.json(globals.success);
                return;
            }
        });

        globals.success.data = null;
        res.json(globals.success);
    };

    module.exports.search = function (req, res) {
        // get data
        var input = '^.*' + req.body.search + '.*';

        Book.find({
            $and: [
                {
                    $or: [
                        { title: { $regex: new RegExp(input, "i") } },
                        { author: { $regex: new RegExp(input, "i") } }
                    ]
                }, {
                    is_del: false
                }
            ]

        }, function (err, data) {
            if (data.length > 0) {
                res.render('books/index', {
                    books: data,
                    search: req.body.search
                });

                return;
            }

            res.render('books/index', {
                books: null,
                search: req.body.search
            });
        });


    };

    ```
- models/book.model.js
    ```js
    var mongoose = require('mongoose');

    var userSchema = new mongoose.Schema({
        title: String,
        author: String,
        summary: String,
        ISBN: String,
        genre: String,
        img_cover: String,
        create_date: String,
        create_by: String,
        update_date: String,
        update_by: String,
        is_del: Boolean
    });

    var Book = mongoose.model('Book', userSchema, 'Book');

    module.exports = Book;
    ```
- routes/book.route.js
    ```js
    var express = require('express');
    var router = express.Router();
    var controller = require('../controllers/book.controller');
    var multer = require('multer');
    var upload = multer({ dest: './public/upload/books/' })

    router.get('/', controller.index);
    router.get('/get', controller.getABook);
    router.post('/', controller.search);
    router.post('/add', upload.single('cover'), controller.add);
    router.post('/update', upload.single('cover'), controller.update);
    router.post('/delete', controller.delete);

    module.exports = router;
    ```
- Thêm nội dung sau vào file app.js
    ```js
    var bookRoute = require('./routes/book.route');
    app.use('/book', authMiddleware.requireAuth, bookRoute);
    ```

## Usage
- Sau khi clone code từ git chạy lệnh cài đặt các module cần thiết

```
$ npm install
```
- Chạy chương trình bằng lệnh.
```
$ npm start
```
hoặc
```
$ node app.js
```

- Mở trình duyệt với url http://localhost:3000 để xem kết quả