var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

const uri = "mongodb://marcomihalca_db_user:test123@ac-jlzinu0-shard-00-00.pbynoak.mongodb.net:27017,ac-jlzinu0-shard-00-01.pbynoak.mongodb.net:27017,ac-jlzinu0-shard-00-02.pbynoak.mongodb.net:27017/students?ssl=true&replicaSet=atlas-lgffdt-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(uri);

var schemaName = new mongoose.Schema({
    request: String,
    title: String,
    id: Number
}, { collection: 'test' });

schemaName.index({ request: 'text' });
var Model = mongoose.model('Model', schemaName);

var userSchema = new mongoose.Schema({
    nume: String,
    prenume: String,
    email: String
}, { collection: 'users' });

var User = mongoose.model('User', userSchema);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/select-image', function (req, res) {
    res.send(`<img src="/${req.body.imageChoice}.svg" style="width:200px;">`);
});

app.get('/find/:query', async function(req, res) {
    try {
        const result = await Model.find({ $text: { $search: req.params.query } });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/user', function (req, res) {
    res.send('data received');
});

app.post('/add-user', async function (req, res) {
    try {
        const newUser = new User({
            nume: req.body.nume,
            prenume: req.body.prenume,
            email: req.body.email
        });
        await newUser.save();
        res.send("Utilizator inserat cu succes in MongoDB Cloud!");
    } catch (err) {
        res.status(500).send("Eroare la salvare: " + err.message);
    }
});

app.listen(8001, function () {
    console.log('Server running on port 8001');
});