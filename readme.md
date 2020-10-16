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

- Trong file app.js khai báo đoạn code mới để khi truy cập url http://localhost:3000/home thì hiển thị nội dung màn hình home lên trình duyệt

```h
app.get('/home', (req, res) => {    
    if (username == null) {
        res.redirect('/login');
    } else {
        res.render('index', {
            title: 'Home page',
            value: username
        });
    }
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