require('dotenv').config();
const express = require('express');
const reverse = require('./reverse.js');
const forbidder = require('./forbidder.js');

const db = require('./db'); 

const app = express();
const port = process.env.PORT || 3000;
const hostname = process.env.HOST || 'localhost';

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(forbidder('Sunday')); 

app.use(function(req, res, next) {
    console.log(`Request la adresa: ${req.url} din partea IP: ${req.ip}`);
    next();
});

app.get('/', (req, res) => {
  res.render('home', { user: req.query.user || "Anonim" });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  console.log("Încercare de login pentru:", req.body.username);
  
  var userdata = db.users.authenticate(req.body.username, req.body.password);
  
  if (!userdata) {
      res.redirect('/');
  } else {
      res.render('home', { user: userdata.displayName });
  }
});

app.get('/:yourName', (req, res) => {
  if (req.params.yourName === 'login') return; 
  const numeInversat = reverse(req.params.yourName);
  res.send(`Your name is: ${req.params.yourName} <br> Your reversed name is: ${numeInversat}`);
});

app.listen(port, hostname, () => {
  console.log(`Serverul rulează la http://${hostname}:${port}`);
});