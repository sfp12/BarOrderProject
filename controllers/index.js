var util = require('util');
var async = require('async');
var user_m = require('../models/user');
var wine_m = require('../models/wine');

exports.call = function(req, res, next){
	res.render('call');
};

exports.chat = function(req, res, next){
	res.render('chat');
};

exports.edit_1 = function(req, res, next){
	var uid = req.session.uid;

	if(!uid){
		//没有这个会话
	}

	async.waterfall([
		function(cb){
			user_m.getColById(['user_name', 'user_sex', "user_phone"], uid, cb);
		},
		function(r){
			// 登录成功
			if(r.length !== 0){				
				r = r[0];
				res.render('edit-1', {
					uname: r.user_name,
					usex: r.user_sex,
					unumber: r.user_phone
				})
			} 
		}

		], function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
	})
	
};

exports.edit_2 = function(req, res, next){
	var uid = req.session.uid;

	if(!uid){
		//没有这个会话
	}

	async.waterfall([
		function(cb){
			user_m.getColById(['user_age', 'user_horo', "user_hobby", "user_sign"], uid, cb);
		},
		function(r){
			// 登录成功
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

exports.login = function(req, res, next){
	res.render('login');
};

exports.main = function(req, res, next){
	res.render('main');
};

exports.menu = function(req, res, next){
	res.render('menu');
};

exports.modify_pw = function(req, res, next){
	res.render('modify-pw');
};

exports.order_confirm = function(req, res, next){
	res.render('order-confirm');
};

// exports.to_order_confirm = function(req, res, next){
// 	res.redirect('/order-confirm');
// };

exports.profile_1 = function(req, res, next){
	if(!req.session.uid){
		res.redirect('/login');
		return false;
	}
	var uid = req.session.uid;
	console.log(util.inspect({session:req.session}));

	async.waterfall([
		function(cb){
			user_m.getById(uid, cb);
		},
		function(r){
			// 登录成功
			if(r.length !== 0){				
				r = r[0];
				console.log(r.user_name);
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

exports.register = function(req, res, next){
	res.render('register');
};

exports.scope_1 = function(req, res, next){
	res.render('scope');
};

exports.wine_detail = function(req, res, next){

	if(!req.session.uid){
		res.redirect('/login');
		return false;
	}

	var wine_id = req.query.wine_id;
	var num = req.query.num;
	console.log('wine_id:'+wine_id);
	console.log(util.inspect({query: req.session}));
	async.waterfall([
		function(cb){
			wine_m.getById(wine_id, cb);
		},
		function(r){
			// 登录成功
			if(r.length !== 0){				
				r = r[0];
				console.log(r.wine_name);
				res.render('wine-detail', {
					wine_name: r.wine_name,
					wine_price: r.wine_price,
					wine_dis_price: r.wine_discount_price,
					wine_num: num,
					wine_des: r.wine_describe,
					wine_image: r.wine_image
				})
			} 
		}

		], function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
	})

	
};







