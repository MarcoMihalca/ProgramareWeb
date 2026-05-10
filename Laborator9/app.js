require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const User = require('./models/User');
const Proiect = require('./models/Proiect');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret123',
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.userLogat = req.session.user || null;
    next();
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectat la MongoDB!'))
    .catch(err => console.error('❌ Eroare:', err));

function esteLogat(req, res, next) {
    if (!req.session.user) return res.redirect('/login');
    next();
}

app.get('/', (req, res) => res.redirect('/proiecte'));

app.get('/proiecte', async (req, res) => {
    let filtru = {};
    if (req.query.search) {
        filtru.nume = { $regex: req.query.search, $options: 'i' };
    }

    const proiecte = await Proiect.find(filtru)
        .sort({ createdAt: -1 })
        .populate('createdBy', 'username email');

    res.render('index', { proiecte, search: req.query.search || '' });
});

app.get('/proiecte/nou', esteLogat, (req, res) => {
    res.render('add-proiect', { erori: null });
});

app.get('/proiecte/:id', async (req, res) => {
    try {
        const proiect = await Proiect.findById(req.params.id).populate('createdBy', 'username email');
        res.render('detalii', { proiect });
    } catch (err) {
        res.status(404).send('Proiectul nu a fost gasit.');
    }
});

app.post('/proiecte', esteLogat, async (req, res) => {
    try {
        const date = req.body;
        date.esteActiv = date.esteActiv === 'on';
        date.createdBy = req.session.user._id;

        await Proiect.create(date);
        res.redirect('/proiecte');
    } catch (err) {
        res.render('add-proiect', { erori: err.errors });
    }
});

app.get('/proiecte/:id/edit', esteLogat, async (req, res) => {
    const proiect = await Proiect.findById(req.params.id);
    res.render('edit-proiect', { proiect, erori: null });
});

app.post('/proiecte/:id/edit', esteLogat, async (req, res) => {
    try {
        const date = req.body;
        date.esteActiv = date.esteActiv === 'on';

        await Proiect.findByIdAndUpdate(req.params.id, date, { runValidators: true });
        res.redirect('/proiecte/' + req.params.id);
    } catch (err) {
        const proiect = await Proiect.findById(req.params.id);
        res.render('edit-proiect', { proiect, erori: err.errors });
    }
});

app.post('/proiecte/:id/delete', esteLogat, async (req, res) => {
    await Proiect.findByIdAndDelete(req.params.id);
    res.redirect('/proiecte');
});

app.get('/register', (req, res) => res.render('register', { eroare: null }));

app.post('/register', async (req, res) => {
    try {
        await User.create(req.body);
        res.redirect('/login');
    } catch (err) {
        const mesaj = err.code === 11000
            ? 'Email sau username deja folosit.'
            : 'Eroare la inregistrare.';
        res.render('register', { eroare: mesaj });
    }
});

app.get('/login', (req, res) => res.render('login', { eroare: null }));

app.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.render('login', { eroare: 'Email sau parola gresita.' });

    const parolaOk = await bcrypt.compare(req.body.password, user.password);
    if (!parolaOk) return res.render('login', { eroare: 'Email sau parola gresita.' });

    req.session.user = { _id: user._id, username: user.username, email: user.email, role: user.role };
    res.redirect('/proiecte');
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

app.listen(process.env.PORT || 3000, () => {
    console.log('🚀 Server pornit pe http://localhost:3000');
});