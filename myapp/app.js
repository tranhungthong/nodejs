const express = require('express');
require('dotenv').config();
require('./database');
const expressLayouts = require('express-ejs-layouts')
var path = require('path');
const app = express();
const port = 3000;
var loginRoute = require('./routes/auth.route');
var authMiddleware = require('./middlewares/auth.middleware');

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

app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

app.get('/home', authMiddleware.requireAuth, (req, res) => {
    res.render('index', {
        title: 'Home page'
    });
});

app.use('/auth', loginRoute);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})