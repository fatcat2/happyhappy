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
	  var doc = {
	  	"roomie1": req.body.roomie1,
	  	"roomie1_number": req.body.roomie1_number,
	  	"roomie1_email": req.body.roomie1_email,
	  	"roomie2": req.body.roomie2,
	  	"roomie2_number": req.body.roomie2_number,
	  	"roomie2_email": req.body.roomie2_email
	  }
	  db.collection("users").insertOne(doc, function(err, res){
	  	if (err) throw err;
	  	console.log("Inserted " + doc.roomie1 + "'s and " + doc.roomie2 + "'s contract!");
	  	db.close();
	  });
	});
	res.render("goodbye");
});





app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
})