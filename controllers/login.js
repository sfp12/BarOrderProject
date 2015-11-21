// 说明：每个函数都有返回值，没有硬编码

// 安装模块
var util = require('util');
var async = require('async');
var validator = require('validator');

var ccap = require('../utils/ccapUtil.js');

var user_m = require('../models/user');

// 变量


exports.login = function(req, res, next){
	res.render('login.html');
}

// 登陆
exports.doLogin = function(req, res, next){
	var result = {
		'status': 1,
		'data': '用户名或密码错误'
	}
  
	var number = req.body.phoneNumber;
	var pw = req.body.pw;	

	async.waterfall([
		function(cb){
			user_m.checkLogin(number, pw, req, cb);
		},
		function(r){
			// 登录成功
			if(r){
				result.status = 0;
				result.data = {};
				result.data.userName = req.session.uname;
				result.data.userId = req.session.uid; 
				res.send(JSON.stringify(result));
			}else{
				res.send(JSON.stringify(result));
			} 
		}

		], function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
	})	
}

// 登录页面，是否有权限
exports.toPage = function(req, res, next){
	var result = {
		status: 0,
		data: '有登陆权限'
	}

	// console.log(util.inspect({session:req.session}));
	// console.log(req.session.uid);
	if(!req.session.uid){
		result.status = 1;
		result.data = '没有登录权限';
	}
		
	res.send(JSON.stringify(result))
	
}

// 退出
exports.logOut = function(req, res, next){
	delete req.session.userinfo;
	res.redirect('/login.html');
}

// 获取验证码
exports.getCode = function(req, res, next){
	console.log('get code');
	var result = ccap.code();

	req.session.code = result.txt;
	res.send(result.buf);
}

// 注册
exports.register = function(req, res, next){
	var result = {
		'status': 1,
		'data': '验证码错误'
	}

	console.log('start register');
  
	var number = req.body.phoneNumber;
	var pw = req.body.pw;	 
	var code = req.body.validationCode;

	// 验证码
	if(code !== req.session.code){		
		res.send(JSON.stringify(result));
		return false;
	}else{
		console.log('code equal');
	}

	// 手机号
	if (!validator.isMobilePhone(number, 'zh-CN')) {
		result.data = '你输入的手机号不合法';
        res.send(JSON.stringify(result));
        return false;
    }else{
    	console.log('number normal');
    }

    // 手机号
    // if (user_m.checkUname(number)) {
    //     result.data = '你输入的手机号已注册，请直接登录';
    //     res.send(JSON.stringify(result));
    //     return false;
    // }else{
    // 	console.log('number ok');
    // }

	async.waterfall([
		function(cb){
			user_m.checkUname(number, cb)
		},
		function(r, cb){
			if(r){
				result.data = '你输入的手机号已注册，请直接登录';
		        res.send(JSON.stringify(result));
		        return false;
			}else{
				console.log('number ok');
				cb();
			}
		},
		function(cb){
			user_m.addUser(number, pw, cb);
		},
		function(id, cb){
			if(id){
				result.status = 0;
				result.data = '注册成功';
				res.send(result);
			}else{
				result.status = 1;
				result.data = '注册失败';
				res.send(result);
			};
		}
	],function(err, value){
		console.log('err:'+err);
		console.log('value:'+value);
	})
}

