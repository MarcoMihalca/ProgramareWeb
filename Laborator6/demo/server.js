const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.get('/', function(req, res) {
  console.log(req.method + ' ' + req.url);
  res.render('home', { user: "Radu" });
});

const server = app.listen(3000, function () {
  console.log("Example app listening at port 3000");
});