const express = require("express");
const mongoose = require("mongoose");
const { readFile } = require('fs');
const app = express();
const PORT = 8001;

const dbURI = "mongodb://marcomihalca_db_user:test123@ac-jlzinu0-shard-00-00.pbynoak.mongodb.net:27017,ac-jlzinu0-shard-00-01.pbynoak.mongodb.net:27017,ac-jlzinu0-shard-00-02.pbynoak.mongodb.net:27017/tema_laborator?ssl=true&replicaSet=atlas-lgffdt-shard-0&authSource=admin&appName=Cluster0";

mongoose.connect(dbURI)
    .then(() => console.log("Conectat cu succes la MongoDB Atlas"))
    .catch(err => console.error(err));

const taskSchema = new mongoose.Schema({
    user: String,
    name: String,
    status: String
});

const Task = mongoose.model('Task', taskSchema, 'tasks');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/', (req, res) => {
    readFile('./public/index.html', function(err, file) {
        if(err) return res.status(500).send("Eroare la citirea fișierului index.html");
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(file, "utf-8");
    });
});

app.get('/get-tasks', async (req, res) => {
    try {
        let filter = {};
        
        if (req.query.user) {
            filter.user = req.query.user;
        }
        
        if (req.query.status && req.query.status !== 'all') {
            filter.status = req.query.status;
        }

        const results = await Task.find(filter);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Serverul rulează la http://localhost:${PORT}`);
});