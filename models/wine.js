var mysqlUtil = require('../utils/mysqlUtil');
var util = require('util');
var cryptoUtil = require('../utils/cryptoUtil');

var database = require('../config').mysql_db;
var wine_t = require('../config').wine_t;


// 返回wine中的内容
exports.wineList = function(cb){

	var sql = 'select * from '+ wine_t;

	mysqlUtil.query(sql, function(err, results, fields) {

		if (err) { 
			console.log('selet wine wrong');		  	 
		} 

		cb(null, results);
							     
	});	

}