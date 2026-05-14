var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var app = express();
var schemaName = new Schema({
request: String,
title: String,
id: Number
}, {
collection: 'test'
});
schemaName.index({ request: 'text' });
var Model = mongoose.model('Model', schemaName);
const uri = "mongodb://marcomihalca_db_user:test123@ac-jlzinu0-shard-00-00.pbynoak.mongodb.net:27017,ac-jlzinu0-shard-00-01.pbynoak.mongodb.net:27017,ac-jlzinu0-shard-00-02.pbynoak.mongodb.net:27017/students?ssl=true&replicaSet=atlas-lgffdt-shard-0&authSource=admin&appName=Cluster0";
mongoose.connect(uri)
    .then(() => console.log("Conexiune reușită la MongoDB Atlas!"))
    .catch(err => console.error("Eroare la conexiunea Atlas:", err));
app.get('/find/:query', function(req, res) {
var query = req.params.query;
Model.find({
$text: {
$search: query
}
}, function(err, result) {
if (err) throw err;
if (result) {
res.json(result)
} else {
res.send(JSON.stringify({
error : 'Error'
}))
}
})
})
var port = process.env.PORT || 3000;
app.listen(port, function() {
console.log('Node.js listening on port ' + port);
});