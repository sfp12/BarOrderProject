var async = require('async');
var util = require('util');

// models
var menu_m = require('../models/menu');

// 添加订单
exports.addOrder = function(req, res, next){

	if(!req.session.uid){
		res.redirect('/login');
		return false;
	}

	var cart = req.body.cart;
	var uid = req.session.uid;

	var result = {};
	result.status = 0;
	result.data = '添加成功';
	
	async.waterfall([
		function(cb){
			menu_m.addOrder(uid, cart, cb);
		},
		function(r){
			// 添加成功
			if(r){				
				res.send(JSON.stringify(result));
			}else{
				// 添加失败
				result.status = 1;
				result.data = '添加失败';
				res.send(JSON.stringify(result));
			} 
		}

		], function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
	})

};




