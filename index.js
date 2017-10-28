var express = require('express');
var emoji = require('node-emoji');
// var wink = emoji.get
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://root:123@myhappytime-shard-00-00-mqmxc.mongodb.net:27017,myhappytime-shard-00-01-mqmxc.mongodb.net:27017,myhappytime-shard-00-02-mqmxc.mongodb.net:27017/happy_data?ssl=true&replicaSet=myhappytime-shard-0&authSource=admin"
var randomstring = require('randomstring');

app.use(bodyParser());

app.get('/', function(req, res){
	res.render('index');
});

app.get('/register', function(req, res){
	res.render('form');
});

app.set('view engine', 'pug');

app.set('views', './views');

app.post('/register', function(req, res){
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var confirm_code = randomstring.generate({
	  	length: 4,
	  	charset: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789'
	  })
	  var doc = {
	  	"uname": req.body.username,
	  	"roomie1": req.body.roomie1,
	  	"roomie1_number": req.body.roomie1_number,
	  	"roomie1_email": req.body.roomie1_email,
	  	"roomie2": req.body.roomie2,
	  	"roomie2_number": req.body.roomie2_number,
	  	"roomie2_email": req.body.roomie2_email,
	  	"password": req.body.password,
	  	"confirm code": '1456'
	  }
	  db.collection("users").insertOne(doc, function(err, res){
	  	if (err) throw err;
		console.log(doc);
	  	console.log("Inserted " + doc.roomie1 + "'s and " + doc.roomie2 + "'s contract!");
	  	db.close();
	  });
	});
	res.render("goodbye");
});

app.post('/textroommate', function(req, res){
	console.log(req)
	console.log("hey i work");
});

app.get('/textroommate', function(req, res){
	console.log("Thanks for the info!");
});


app.listen(3000, function () {
	console.log('App listening on port 3000!');
});
// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

// httpServer.listen(80, () => console.log("HTTP listening on 8080!"));
// httpsServer.listen(443, () => console.log("HTTPS listening on 8443!"));
