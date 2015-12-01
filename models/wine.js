var mysqlUtil = require('../utils/mysqlUtil');
var util = require('util');
var cryptoUtil = require('../utils/cryptoUtil');

var config = require('../config');

// 返回wine中的内容
exports.wineList = function(cb){

	var sql = 'select * from '+ config.wine_t;

	mysqlUtil.query(sql, function(err, results, fields) {

		if (err) { 
			console.log('selet wine wrong');
			return next(err);		  	 
		} 

		cb(null, results);
							     
	});	

}

// 根据id获取酒品信息
exports.getById = function(wine_id, cb){
	
	var sql = 'select * from '+ config.wine_t;
	sql += ' where ';
	sql += ' wine_id = ?'; 
	
	mysqlUtil.query(sql, [wine_id], function(err, rows, fields){
		
		if(err){
			console.log('get by wine id error');
			return next(err);
		}
		
		cb(null, rows);
		
	});
}