var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://root:123@myhappytime-shard-00-00-mqmxc.mongodb.net:27017,myhappytime-shard-00-01-mqmxc.mongodb.net:27017,myhappytime-shard-00-02-mqmxc.mongodb.net:27017/happy_data?ssl=true&replicaSet=myhappytime-shard-0&authSource=admin"
var randomstring = require('randomstring');

var twilio = require('twilio');
var twilio_sid = "PN65618436762b885397ea4687c255090b";
var twilio_auth = "f434c2ec44243f778e986d079a2f755d";
var twilio_num = "+17656370247";
const client = new twilio('AC93e381fa9a774070dbb9548bd20bfd1c', 'f434c2ec44243f778e986d079a2f755d');


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
	res.send("Hi there");
	console.log("hey i work");
	client.messages.create({ 
			to: '+14087755735',
			from: twilio_num,
			body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
		}).then((message) => console.log(message.sid));
});

app.get('/textroommate', function(req, res){
	console.log("Thanks for the info!");
});

app.get('/sendmsg',function(req, res){
	client.messages
		create({ 
			to: '+14087755735',
			from: twilio_num,
			body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
		}).then((message) => console.log(message.sid));
});

app.listen(3000, function () {
	console.log('App listening on port 3000!');
});
