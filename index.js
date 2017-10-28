var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://root:123@myhappytime-shard-00-00-mqmxc.mongodb.net:27017,myhappytime-shard-00-01-mqmxc.mongodb.net:27017,myhappytime-shard-00-02-mqmxc.mongodb.net:27017/happy_data?ssl=true&replicaSet=myhappytime-shard-0&authSource=admin"

app.use(bodyParser());

app.get('/', function(req, res){
	res.render('form');
});
app.set('view engine', 'pug');
app.set('views', './views');

app.post('/', function(req, res){
	console.log(req.body);
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  console.log("Database created!");
	  db.close();
	});
	res.render("goodbye");
});





app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})