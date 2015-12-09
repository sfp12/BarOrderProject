var util = require('util');
var async = require('async');
var validator = require('validator');
var ccap = require('../utils/ccapUtil.js');

// models
var user_m = require('../models/user');

// 变量

// 登录页面
exports.login = function(req, res, next){
	res.render('login');
}

// 登陆
exports.doLogin = function(req, res, next){
	var result = {
		'status': 1,
		'data': '用户名或密码不正确，请重新输入'
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
				result.data.userImg = req.session.uimg;
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

// 退出
exports.logOut = function(req, res, next){
	req.session.cookie._expires = Date.now()-1;
	res.redirect('/main');
}

// 获取验证码
exports.getCode = function(req, res, next){
	var result = ccap.code();

	req.session.code = result.txt;
	res.send(result.buf);
}

// 注册
exports.register = function(req, res, next){
	var result = {
		'status': 1,
		'data': '验证码不正确，请重新获取'
	}

	var number = req.body.phoneNumber;
	var pw = req.body.pw;	 
	var code = req.body.validationCode;
	console.log('session code:'+req.session.code);
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
    if (user_m.checkUname(number)) {
        result.data = '你输入的手机号已注册，请直接登录';
        res.send(JSON.stringify(result));
        return false;
    }else{
    	console.log('number ok');
    }

	async.waterfall([		
		function(cb){
			user_m.addUser(number, pw, cb);
		},
		function(id, cb){
			if(id){
				result.status = 0;
				result.data = '恭喜您注册成功';
				res.send(JSON.stringify(result));
			}else{
				result.status = 1;
				result.data = '提交失败，请重新尝试';
				res.send(JSON.stringify(result));
			};
		}
	],function(err, value){
		console.log('err:'+err);
		console.log('value:'+value);
	})
}

