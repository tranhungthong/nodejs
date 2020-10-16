# Nodejs training

## Description

Tài liệu này miêu tả cách mình cài đặt và làm ra màn hình login

## Installing
Trong bài này cần sử dụng 
- <strong>Express</strong>: là framework dành cho Nodejs. Nó cung cấp nhiều tính năng mạnh mẽ cho nền tảng web, API... 

- <strong>Pugjs</strong>: là template enginé là công cú giúp tách mã HTML thành các phần nhỏ hơn mà chúng ta có thể sử dụng lại trên nhiều tập tin HTML.

    ### Install
    1. Tạo thư mục và di chuyển vào đó
    ```
        $ mkdir myapp
        $cd myapp
    ``` 
    2. Khởi tạo thông tin application lưu trong file package.json
    ```
        $ npm init
    ``` 
    ❊ Tại cửa sổ command nếu không nhập gì thì nó sẽ lấy giá trị defaut
    
    3. Cài đặt framework Express
    ```
        $ npm install express --save
    ``` 

     4. Cài đặt Pugjs
    ```
        $ npm install pug
    ``` 

## Thiết kế các màn hình
Mục này hướng dẫn cách tạo màn hình trong bài này. 

Trước tiên tạo file app.js và import các thông tin cần thiết của Express và pug vào. Nội dung như dưới đây

```h
const express = require('express');
const app = express();
const port = 3000;

var username = null;

app.set('view engine', 'pug');                      // sử dụng code html theo pug
app.set('views', './views');                        // đưa thư mục mặc định về view
app.use(express.static(__dirname + '/public'));     // public thư mục public để có thể truy cập được các file như css, image
app.use(express.urlencoded({
    extended: true                                  // de doc duoc json request can import cai nay
}))
```

### 1. Màn hình Home
Hiển thị thông tin user sau khi login thành công
- Tạo thư mục Views
- Tạo file Views/index.pug với nội dung sau
```h
head
    title=title
    link(rel='stylesheet', href='https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css')
body
    - var divClasses=['jumbotron','mt-3']
    div(class="container")
        div(class=divClasses)
            h1 Home page
            p(class="lead") Hello #{value}
            - var aClasses=['btn','btn-lg','btn-primary']
            a(class=aClasses href="/" role="button") Logout
```

- Khi người dùng truy cập trang web, mặc định sẽ hiển thị màn hình login. Thêm đoạn code sau vào file app.js

```h
app.get('/home', (req, res) => {    
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('users/login', {
        title: 'login form'
    });
});
```

### 2. Màn hình login
Sau khi login thành công sẽ di chuyển tới màn hình Home
- Tạo thư mục users trong thư mục views
- Tạo file views/users/login.pug với nội dung sau

```h
html
    head
        title=title
        link(rel='stylesheet', href='https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css')
        link(rel='stylesheet',href='./stylesheets/style.css')
    body
            .text-center
                form(class="form-signin" method="POST" acction="/login")
                    - var h1Classes=['h3','mb-3','font-weight-normal']
                    h1(class=h1Classes) Please sign in
                    
                    //- input mail
                    input(type="email" name="username" id="inputEmail" class="form-control" placeholder="Email address" required autofocus)
                    
                    //- input password
                    input(type="password" name="password" id="inputPassword" class="form-control" placeholder="password" required)

                    //- remember checkbox
                    - var divClasses=['checkbox','mb-3'];
                    div(class=divClasses)
                        label
                            input(type="checkbox" value="remember-me")
                            span  Remember me
                    
                    //- signin button
                    - var buttonClass=['btn','btn-lg','btn-primary','btn-block'];
                    button(class=buttonClass type="submit") Sign in

                    - var pClass=['mt-5','mb-3','text-muted'];
                    p(class=pClass) Copy right 2020
                    
```

- Khi người dùng bấm nút đăng nhập. Di chuyển đến màn hình home, và hiển thị thông tin đăng nhập lên màn hình

```h
app.post('/login', function (req, res) {
    username = req.body.username;
    res.redirect('/home');
});
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