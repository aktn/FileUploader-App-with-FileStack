var express = require('express'),
	mongoose = require('mongoose'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	port = process.env.PORT || 3000,
	app = express(),
	methodOverride = require('method-override');

//Connecting to mongodb
mongoose.connect("mongodb://localhost/flatSharingApp");

app.use(morgan('dev'));

//For static files
app.use(express.static(__dirname+'/public'));
app.use('bower_components', express.static(__dirname + '/bower_components'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text()); //For raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));

app.use(methodOverride());

app.listen(port);
console.log('App runnning on'+ port);