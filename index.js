var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser());

app.get('/', function(req, res){
	res.render('form');
});
app.set('view engine', 'pug');
app.set('views', './views');

app.post('/', function(req, res){
	console.log(req.body);
	res.send("received your request!");
});





app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})