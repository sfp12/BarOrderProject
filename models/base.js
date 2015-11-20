

// 自己写的公用模块
var mysqlUtil = require('../utils/mysqlUtil');
var cryptoUtil = require('../utils/cryptoUtil');
var util = require('util');

// 变量
var database = require('../config').mysql_db;
var user_t = require('../config').user_t;

/*
* 登录检查
*/
exports.checkLogin = function(email, pwd, req, cb){

	// mysqlUtil.getConnection(function(err, client){
	// 	if(err){
	// 		console.log('链接错误');
	// 	}
		mysqlUtil.query(  
		  'SELECT * FROM '+database+'.'+user_t + ' where  email = \'' + email + '\' and pwd = \'' + cryptoUtil.md5(pwd) + '\'' ,  
		  function(err, results, fields) {

		    if (err) { 
		    	console.log('login select wrong'); 
		      	throw err;  
		    } 

		    if(results.length !== 0)
			{	
				req.session.userinfo = req.session.userinfo || '';
				req.session.userinfo = results[0];
				cb(null, 0, results[0].user_name, results[0].user_id);
			}else{
				cb(null, 1);
			};					     
		});	
	// });
		
}