var express = require('express'),
	bodyParser = require('body-parser'),
	app = express();
	MongoClient = require('mongodb').MongoClient,
	process.MONGO = {},
	entries = null;

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/entries', function(req, res) {
	console.log(req.body)
	entries.createEntry(req.body, function(err) {
		if(err) {
			res.status(400).send({message:err});
		}
		else {
			res.send({});
		}
	});
})

app.get('/entries', function(req, res) {
	entries.getEntries(req.query, function(err, results) {
		if(err) {
			res.status(400).send({message:err});
		}
		else {
			res.send(results);
		}
	});
});

app.listen(app.get('port'), function() {
	MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
		process.MONGO.entries = db.collection('entries');
		entries = require('./entries.js'),
	   	console.log('Node app is running on port', app.get('port'));
	});

});


