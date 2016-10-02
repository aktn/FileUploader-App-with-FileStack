var mongoose = require('mongoose');
var Flat = require('./flats.model.js');

module.exports = function(app){
	app.get('/flats', function(req, res){
		var query = Flat.find({});
		query.exec(function(err, flats){
			if(err) res.send(err);
			res.json(flats);
		});
	});

	app.post('/flats', function(req, res){
		var flat = new Flat(req.body);
		flat.save(function(err){
			if(err) res.send(err);
			res.json(req.body);
		});
	});

};