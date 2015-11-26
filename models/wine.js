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

//根据id获取酒品信息
exports.getById = function(wine_id, cb){
	var sql = 'select * from '+ wine_t;
	sql += ' where ';
	sql += ' wine_id = ?'; 
	mysqlUtil.query(sql, [wine_id], function(err, rows, fields){
		if(err){
			console.log('get by wine id error');
		}
		console.log(util.inspect({rows: rows}));
		// console.log(util.inspect({fields: fields}));
		cb(null, rows);
		
	});
}