const express = require('express');
const router = express.Router();
const usersDb = require('../db/users');

router.get('/register', (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
    const { nume, email, parola } = req.body;
    const user = await usersDb.addUser(nume, email, parola);
    req.session.user = user;
    res.redirect('/dashboard');
});

router.get('/login', (req, res) => res.render('login', { error: null }));

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = usersDb.findUserByEmail(email);

    if (user && await usersDb.comparePassword(password, user.password)) {
        req.session.user = user;
        res.redirect('/dashboard');
    } else {
        res.render('login', { error: 'Date incorecte!' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie('ultima_vizita');
    res.redirect('/');
});

module.exports = router;