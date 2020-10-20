const express = require('express');
const expressLayouts = require('express-ejs-layouts')
var path = require('path');
const app = express();
const port = 3000;
var loginRoute = require('./routes/auth.route');

var username = null;

// app.set('view engine', 'pug');
// set template engine
app.set('layout', './layouts/layout')
app.use(expressLayouts)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));



app.use(express.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

app.get('/home', (req, res) => {
    res.render('index', {
        title: 'Home page',
        value: username
    });
});

app.use('/auth', loginRoute);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})