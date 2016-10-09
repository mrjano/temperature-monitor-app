var express = require('express'),
	bodyParser = require('body-parser'),
	app = express();
	MongoClient = require('mongodb').MongoClient,
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

app.post('/entries', function(request, response) {
	console.log(request.body)
	entries.insert(request.body, function(err, result) {
		console.log(err);
		console.log(result);
	});
})

app.listen(app.get('port'), function() {
	MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
		entries = db.collection('entries');
	   	console.log('Node app is running on port', app.get('port'));
	});

});


