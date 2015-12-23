var util = require('util');
var async = require('async');

// models
var user_m = require('../models/user');
var wine_m = require('../models/wine');
var menu_m = require('../models/menu');

// game  add authority

// 呼叫页
exports.call = function(req, res, next){

	if(!req.session.uid){
		res.redirect('/login');
		return false;
	}

	res.render('call');
};

// 聊天页
exports.chat = function(req, res, next){
	res.render('chat');
};

// 编辑资料1
exports.edit_1 = function(req, res, next){

	var uid = req.session.uid;

	async.waterfall([
		function(cb){
			user_m.getColById(['user_name', 'user_sex', "user_phone"], uid, cb, next);
		},
		function(r, cb){
			// 查找成功
			if(r.length !== 0){				
				r = r[0];
				res.render('edit-1', {
					uname: r.user_name,
					usex: r.user_sex,
					unumber: r.user_phone
				})
			}else{
				console.log('查找失败');
			} 
		}

		], function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
	})	
};

// 编辑资料2
exports.edit_2 = function(req, res, next){

	var uid = req.session.uid;

	async.waterfall([
		function(cb){
			user_m.getColById(['user_age', 'user_horo', "user_hobby", "user_sign"], uid, cb);
		},
		function(r){
			// 查找成功
			if(r.length !== 0){				
				r = r[0];
				res.render('edit-2', {
					uage: r.user_age,
					uhoro: r.user_horo,
					uhobby: r.user_hobby,
					usign: r.user_sign
				})
			} 
		}

		], function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
	})
};

// 主页
exports.main = function(req, res, next){
	res.render('main');
};

// 修改密码
exports.modify_pw = function(req, res, next){

	if(!req.session.uid){
		res.redirect('/login');
		return false;
	}

	res.render('modify-pw');
};

// 订单确认
exports.order_confirm = function(req, res, next){
	res.render('order-confirm');
};

// 个人主页
exports.profile_1 = function(req, res, next){

	if(!req.session.uid){
		res.redirect('/login');
		return false;
	}

	var uid = req.session.uid;

	async.waterfall([
		function(cb){
			user_m.getById(uid, cb);
		},
		function(r){
			// 查找成功
			if(r.length !== 0){				
				r = r[0];
				res.render('profile', {
					uname: r.user_name,
					usex: r.user_sex,
					unumber: r.user_phone,
					uage: r.user_age,
					uhoro: r.user_horo,
					uhobby: r.user_hobby,
					usign: r.user_sign
				})
			} 
		}

		], function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
	})	

};

// 注册
exports.register = function(req, res, next){

	if(!req.session.uid){
		res.redirect('/login');
		return false;
	}

	res.render('register');
};

// 不在当前范围
exports.scope_1 = function(req, res, next){
	res.render('scope');
};

// 酒品详情
exports.wine_detail = function(req, res, next){

	if(!req.session.uid){
		res.redirect('/login');
		return false;
	}

	var wine_id = req.query.wine_id;
	var num = req.query.num;

	async.waterfall([
		function(cb){
			wine_m.getById(wine_id, cb);
		},
		function(r){
			// 登录成功
			if(r.length !== 0){				
				r = r[0];
				res.render('wine-detail', {
					wine_name: r.wine_name,
					wine_price: r.wine_price,
					wine_dis_price: r.wine_discount_price,
					wine_num: num,
					wine_des: r.wine_describe,
					wine_image: r.wine_image,
					wine_id : wine_id
				})
			} 
		}

		], function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
	})

	
};

// 我的订单
exports.my_order = function(req, res, next){
//
	var uid = req.session.uid;

	// 想获得订单的信息
	// 1、先获得，menu_id, menu_spend
	// 2、再获得，menu_id, add_time
	async.waterfall([
		function(cb){
			// 1
			// menu_id wine_id wine_num wine_price
			user_m.getSpend(uid, cb);
		},
		function(spend, cb){
			// 2
			menu_m.getAddTime(uid, spend, cb);
		},
		function(spend){
			//spend = {}
			// menu_id 是key， spend和add_time是value
			res.render('my-order', {
				spend: spend
			})
		}

		], function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
	})
};

// 订单详情
exports.order_detail = function(req, res, next){

	var menu_id = req.params.id;

	async.waterfall([
		function(cb){
			menu_m.getById(menu_id, cb);
		},
		function(r){
			// 查找成功
			if(r.length !== 0){	
				res.render('order-detail', {
					menu: r
				})
			} 
		}

		], function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
	})

};







