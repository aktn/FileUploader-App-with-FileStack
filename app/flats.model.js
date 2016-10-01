var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Flat Schema
var FlatSchema = new Schema({
	username: {type:String, required: true},
	location: {type:String, required: true},
	email: {type:String, required:true},
	location: {type: [Number], required: true},
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now}
});

//Setting the current date before saving into db
FlatSchema.pre('save', function(next){
	now = new Date();
	this.updated_at = now;
	if(!this.created_at){
		this.created_at = now
	}
	next();
});

//indexing location into 2dsphere format
FlatSchema.index({location: '2dsphere'});

module.exports = mongoose.model('FlatSchema', FlatSchema);