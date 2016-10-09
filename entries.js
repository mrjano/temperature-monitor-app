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

function getExternalTemperature(callback) {
	request(process.env.OPENWEATHER_URI, function (err, res, body) {
		if (!err && res.statusCode == 200) {
			console.log('Got temp: ' + body);
			callback(null, JSON.parse(body).main.temp);
		}
		else {
			console.log('Error getting temp: ' + JSON.stringify(err));
			callback(err);
		}
	})
}