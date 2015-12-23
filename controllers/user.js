var util = require('util');
var async = require('async');
var validator = require('validator');

// models
var user_m = require('../models/user');

// 变量


// 修改密码
exports.modifyPW = function(req, res, next){

	var result = {
		status: 0,
		data: '密码重置成功'
	}

	var uid= req.session.uid;
	var pw = req.body.pw;

	async.waterfall([
		function(cb){
			user_m.modifyPW(uid, pw, cb);
		},
		function(r){
			// 修改成功
			if(r){				
				res.send(JSON.stringify(result));
			}else{
				result.data = '提交失败,请重新尝试';
				res.send(JSON.stringify(result));
			} 
		}

		], function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
	})	
}

// 修改用户信息
exports.modifyInfo = function(req, res, next){

	var result = {
		status: 0,
		data: '修改成功'
	}	

	async.waterfall([
		function(cb){
			user_m.modifyInfo(req, cb);
		},
		function(r){
			// 修改成功
			if(r){				
				res.send(JSON.stringify(result));
			}else{
				result.data = '修改失败';
				res.send(JSON.stringify(result));
			} 
		}

		], function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
	})	
}

