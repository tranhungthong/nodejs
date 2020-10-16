const express = require('express');
const app = express();
const port = 3000;

var username = null;

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({
    extended: true     // de doc duoc json request can import cai nay
}))

app.get('/', (req, res) => {
    if(username == null){
        res.redirect('/login');
    }else{
        res.render('index', {
            title: 'Home page',
            value: username
        });
    }
});

app.get('/login', (req, res) => {
    res.render('users/login', {
        title: 'login form'
    });
});

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

app.post('/login', function (req, res) {
    username = req.body.username;
    res.redirect('/home');
});