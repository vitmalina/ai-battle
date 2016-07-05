/*
var http = require('http');
var fs = require('fs');
var index = fs.readFileSync('index.html');



http.createServer(function(request, result) {
	var index = fs.readFileSync('index.html');
	result.writeHead(200, {'Content-Type' : 'text/html'});
	result.end(index);
}).listen(3000); 
*/
const crypto = require('crypto');
var connection = require('./connection.js');
var tools = require('./2ndnode.js');
var express = require('express');
var app = express();
var session = require('client-sessions');
var bodyParser = require('body-parser')
app.use( bodyParser.json() );  
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

app.use(express.static('../web'));

app.get('/', function (req, res) {
	res.send('Hello World!');
});

app.get('/users/list', function (req, res) {
	var limit = 10;
	var offset = 0;	 
	var search = "";
	if (req.query.search) {
		search = ` WHERE fname LIKE "%${req.query.search}%" 
		OR lname LIKE "%${req.query.search}%" 
		OR login LIKE "%${req.query.search}%" 
		OR email LIKE "%${req.query.search}%"`
		//OR userid = ${req.query.search}`
		// ^^ get it working later
	}
	if (req.query.limit) {
		limit = req.query.limit;
	}
	if (req.query.offset) {
		offset = req.query.offset;
	}

	var sql = `SELECT * FROM users ${search} LIMIT ${offset}, ${limit};`;
	console.log(sql);
	connection.query(sql, function(err, rows, fields) {
		//console.log(rows);
		res.send(rows);
		//console.log(err);
	});
	
});

app.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});

app.post('/users/signup', function(req, res) {
	console.log(req);
	if (!req.query.id) { // create
		console.log(1);
		if (req.body.fname && req.body.lname && req.body.email && req.body.pwd && req.body.usr) {
			console.log(2);
			const secret = req.body.pwd;
			const hash = crypto.createHash('sha256').update(secret).digest('base64');
			var sql = `INSERT INTO users (fname, lname, email, pass, login) VALUES("${req.body.fname}", "${req.body.lname}", "${req.body.email}", "${hash}", "${req.body.usr}")`;
			console.log(sql);
			connection.query(sql, function(err, rows, fields) {
				//console.log(rows);
				res.send(rows);
				//console.log(err);
			});	
		}
	}
	
});

app.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});

app.get('/users/session', function (req, res) {
	if (req.session && req.session.user) {
		var sql = `SELECT * FROM users WHERE login="${req.session.user}"`;
		console.log(sql);
		connection.query(sql, function(err, rows, fields) {
			//console.log(rows);
			res.send(rows);
			//console.log(err);
		});
	} else {
		var err = [{
			message : "Has not logged yet",
		}];
		res.send(err);
	}
});


app.get('/users/signin', function(req, res) {
	if (!req.query.usr || !req.query.pwd) {
		var err = [{
			message : "Error: Not enough info.",
		}];
		res.send(err);
	} else {
		const secret = req.query.pwd;
		const hash = crypto.createHash('sha256').update(secret).digest('base64');
		var sql = `SELECT * FROM users WHERE pass = ? AND login = ?`;
		connection.query(sql, [hash, req.query.usr], function(err, rows, fields) {
			if (err) console.log("DB ERROR", err);
			if (rows.length > 0) {
				req.session.user = rows[0].login;
				var succ = [{
					message : "success",
					tmp : req.session.user,
				}];
				rows.other = succ;
				res.send(rows);
			}
		});
	}
});

app.get('/users/update', tools.handleUpdate);

app.listen(3000, function () {
	console.log('Test app listening on port 3000!');
});

