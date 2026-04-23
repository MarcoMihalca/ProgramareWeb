const express = require('express');
const router = express.Router();
const ordersDb = require('../db/orders');
const requireLogin = require('../middleware/requireLogin');

router.get('/', (req, res) => {
    res.render('home', { user: req.session.user || null });
});

router.get('/dashboard', requireLogin, (req, res) => {
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

router.get('/comanda/:id', requireLogin, (req, res) => {
    const comanda = ordersDb.orders.find(o => o.id === req.params.id);
    res.render('comenzi/detalii_comanda', { comanda });
});

module.exports = router;