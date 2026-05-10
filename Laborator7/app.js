require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

const logger = require('./middleware/logger');
const requireLogin = require('./middleware/requireLogin');
const usersDb = require('./db/users');
const ordersDb = require('./db/orders');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(logger);

app.get('/', (req, res) => {
    res.render('home', { user: req.session.user || null });
});

app.get('/register', (req, res) => res.render('register'));

app.post('/register', async (req, res) => {
    const { nume, email, parola } = req.body;
    const user = await usersDb.addUser(nume, email, parola);
    req.session.user = user;
    res.redirect('/dashboard');
});

app.get('/login', (req, res) => res.render('login', { error: null }));

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = usersDb.findUserByEmail(email);

    if (user && await usersDb.comparePassword(password, user.password)) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Date incorecte!' });
    }
});

app.get('/dashboard', requireLogin, (req, res) => {
    if (!req.session.views) req.session.views = 0;
    req.session.views++;

    res.cookie('ultima_vizita', new Date().toLocaleTimeString());

    res.render('dashboard', { 
        user: req.session.user, 
        comenzi: ordersDb.orders,
        vizite: req.session.views,
        ultima: req.cookies.ultima_vizita
    });
});

app.get('/comanda/:id', requireLogin, (req, res) => {
    const comanda = ordersDb.orders.find(o => o.id === req.params.id);
    res.render('detalii_comanda', { comanda });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('ultima_vizita');
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server pornit pe portul ${PORT}`));