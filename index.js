var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://root:123@myhappytime-shard-00-00-mqmxc.mongodb.net:27017,myhappytime-shard-00-01-mqmxc.mongodb.net:27017,myhappytime-shard-00-02-mqmxc.mongodb.net:27017/happy_data?ssl=true&replicaSet=myhappytime-shard-0&authSource=admin"
var randomstring = require('randomstring');

var twilio = require('twilio');
var twilio_sid = "AC93e381fa9a774070dbb9548bd20bfd1c";
var twilio_auth = "f434c2ec44243f778e986d079a2f755d";
var twilio_num = "+17656370247";
var target_user = {"hello":99};
const client = new twilio(twilio_sid, twilio_auth);


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
	  	charset: '123456789'
	  })

	  //create ids, etc
	  var group_id = confirm_code;
	  var code1 = randomstring.generate({
	  	length: 4,
	  	charset: '123456789'
	  });
	  var code2 = randomstring.generate({
	  	length: 4,
	  	charset: '123456789'
	  });

	  //create the json objects
	  var doc1 = {
	  	"name": req.body.roomie1,
	  	"number": req.body.roomie1_number,
	  	"email": req.body.roomie1_email,
	  	"code": code1,
	  	"group_code": group_id
	  }
	  var doc2 = {
	  	"name": req.body.roomie2,
	  	"number": req.body.roomie2_number,
	  	"email": req.body.roomie2_email,
	  	"code": code2,
	  	"group_code": group_id
	  }

		//text them their codes
		client.messages.create({ 
					to: req.body.roomie1_number,
					from: twilio_num,
					body: 'Hey, your unique code is ' + code1 + ', don\'t forget it!',
				});
		client.messages.create({ 
					to: req.body.roomie2_number,
					from: twilio_num,
					body: 'Hey, your unique code is ' + code2 + ', don\'t forget it!',
				});

		//insert the docs
		db.collection("users").insertOne(doc1, function(err, res){
			if (err) throw err;
		 });
		db.collection("users").insertOne(doc2, function(err, res){
			if (err) throw err;
		});

		console.log("Inserted " + doc1.name + " and " + doc2 + "'s info!\nWelcome!\n--------\n");
		db.close();
	});
	res.render("goodbye");
});

app.post('/test', function(req, res){
	console.log(req.body);
	res.send("SUCCESS");
	var x = req.body.key;
	console.log(x);
	var y = x.split(',');
	console.log(y[1]);
	var z = y[1].replace(/\D/g, "");
	console.log(parseInt(z));
});

app.post('/textroommate', function(req, res){
	res.send("SUCCESS");
	// var _result 
	MongoClient.connect(url, function(err, db){
		var collection = db.collection("users");
		if (err) throw err;
		var x = req.body.key;
		var y = x.split(',');
		var code = y[1].replace(/\D/g, "");
		console.log("connected");
		collection.findOne({code: code }, function(err, result){
			if (err) throw err;
			if(result){
				console.log("found the user");
				console.log(target_user);
				target_user = result;
				console.log(target_user);
				// collection.findOne({"group_code": target_user.group_code}, {_id: 0, "name": 0}, function(err, rez){
				// 	console.log(target_user.group_code);
				// 	console.log(rez);
				// });
				collection.find({}).toArray(function(err,rez){
					console.log(rez);
				});
			}else{
				console.log("Couldn't find it!");
			}
		});
		/*
		collection.findOne({"group_code": target_user.group_code}, function(err, result){
			console.log(target_user.group_code);
			console.log(result);
		});*/ 

		
		db.close();
	});
});

app.get('/textroommate', function(req, res){
	console.log("Thanks for the info!\n--------");
});

app.get('/sendmsg',function(req, res){
	client.messages.create({ 
			to: '+14087755735',
			from: twilio_num,
			body: 'Hey I need the room for a bit! Thanks for being patient!',
		})
});

app.listen(3000, function () {
	console.log('App listening on port 3000!\n--------');
});
