var entries = process.MONGO.entries,
	request = require('request');

exports.createEntry = function(data, callback) {
	var entry = validateEntry(data);
	if(entry) {
		getExternalTemperature(function(err, temp) {
			if(err) {
				callback('Error getting external temperature')
			}
			else {
				entry.externalValue = temp;
				entries.insert(entry, function(err, result) {
					if(err || !result) {
						callback('Error saving entry')
					}
					else {
						callback(null)
					}
				});
			}
		});
	}
	else {
		callback('Wrong data')
	}
};

exports.getEntries = function(data, callback) {
	var skip = process.env.PAGE_SIZE*data.page || 0;
	entries.find().sort({created: -1}).skip(skip).toArray(function(err, results) {
		entries.count({}, function(err, count) {
			var returnData = {
				results: results,
				pages: {
					current: parseInt(data.page),
					total:  Math.ceil(count/process.env.PAGE_SIZE)
				}
			}
			callback(null, returnData);
		});
	});
}

//Validates the entry and returns null if error
function validateEntry(entry) {
	if(!entry.created) {
		return null;
	}
	if(!entry.value) {
		return null;
	}
	var validatedEntry = {
		created : entry.created,
		value: entry.value
	}
	return validatedEntry;
}

var maxRetries = 3;
function getExternalTemperature(callback, retry) {
	request(process.env.OPENWEATHER_URI, function (err, res, body) {
		if (!err && res.statusCode == 200) {
			console.log('Got temp: ' + body);
			callback(null, JSON.parse(body).main.temp);
		}
		else {
			console.log('Error getting temp: ' + JSON.stringify(res));
			//Retry
			if(!retry) {
				retry = 0
			}
			retry += 1
			if(retry > maxRetries) {
				callback(err);
			}
			else {
				getExternalTemperature(callback, retry)
			}
		}
	})
}