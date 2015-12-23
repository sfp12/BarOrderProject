var base_m = require('../../models/base');
var menu_m = require('../../models/menu');
var user_m = require('../../models/user');
var wine_m = require('../../models/wine');
var ready = require('ready');
var async = require('async');
var util = require('util');

function randomInt(){
	return (Math.random() * 10000).toFixed(0);
}


var addUser = exports.addUser = function(cb){
	var key = new Date().getTime() + '_' + randomInt();
	user_m.addUser('sfp'+key, '123', cb);

}

ready(exports);

function mockUser(user) {
 	return 'mock_user=' + JSON.stringify(user) + ';';
}

async.waterfall([
		function(cb){
			addUser(cb);
			
		},
		function(uid, cb){
			user_m.getById(uid, cb)
		},
		function(rows, cb){
			exports.normalUser = rows[0];
			exports.normalUserCookie = mockUser(rows[0]);
			addUser(cb);
			
		},
		function(uid, cb){
			user_m.getById(uid, cb)
		},
		function(rows, cb){
			exports.normalUser2 = rows[0];
			exports.normalUser2Cookie = mockUser(rows[0]);
			exports.ready(true);
		},
		function(err,value){
			console.log('support error:'+err);
		},
	]);

