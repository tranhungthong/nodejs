const express = require('express');
const expressLayouts = require('express-ejs-layouts')
var path = require('path');
const app = express();
const port = 3000;

var username = null;

// app.set('view engine', 'pug');
// set template engine
app.set('layout', './layouts/layout')
app.use(expressLayouts)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));



app.use(express.urlencoded({
    extended: true     // de doc duoc json request can import cai nay
}))

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('users/login', {
        title: 'login form',
        layout:'./layouts/empty'
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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})