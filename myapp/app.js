const express = require('express');
require('dotenv').config();
require('./database');
const expressLayouts = require('express-ejs-layouts')
var path = require('path');
const app = express();
const port = 3000;
var loginRoute = require('./routes/auth.route');
var bookRoute = require('./routes/book.route');
var weatherRoute = require('./routes/weather.route');
var authMiddleware = require('./middlewares/auth.middleware');
var fahrenheitToCelsius = require('fahrenheit-to-celsius');

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

app.get('/', authMiddleware.requireAuth, (req, res) => {
    res.render('index', {
        title: 'Home page'
    });
});

app.use('/auth', loginRoute);
app.use('/book', authMiddleware.requireAuth, bookRoute);
app.use('/weather', authMiddleware.requireAuth, weatherRoute);

app.locals.convertFtoC = function (val) {
    return Math.round(val - 273.15);
}
app.locals.formatDateTime = function (dt) {
    var day = new Date(dt * 1000).getDay();
    var dayofweek = 'None';

    switch (day) {
        case 0:
            dayofweek = 'Sunday';
            break;
        case 1:
            dayofweek = 'Monday';
            break;
        case 2:
            dayofweek = 'Tuesday';
            break;
        case 3:
            dayofweek = 'Wednesday ';
            break;
        case 4:
            dayofweek = 'Thurday';
            break;
        case 5:
            dayofweek = 'Friday';
            break;
        case 6:
            dayofweek = 'Saturday ';
            break;
    }

    return dayofweek;
}


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})