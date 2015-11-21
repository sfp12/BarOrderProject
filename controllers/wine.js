var util = require('util');
var async = require('async');
var validator = require('validator');
var wine_m = require('../models/wine');

// 返回wine_t的内容
exports.wineList = function(req, res, next){

	var result = {
		status: 0,
		data: {}
	}

	async.waterfall([
		function(cb){
			wine_m.wineList(cb);
		},
		function(r){
			if(r){
			console.log(util.inspect({r: r}));				
				result.data = r;
			}else{
				result.status = 1;
				result.data = '没有内容';				
			}
			res.render('index', {
				content: result
			}); 
			// res.render('index'); 
		}

		], function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
	})		
}