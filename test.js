const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!');
  console.log("WORKS");
})

app.post('/', function(req, res){
	res.send('hi');
	console.log("hi");
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
