var mysqlUtil = require('../utils/mysqlUtil');
var util = require('util');
var cryptoUtil = require('../utils/cryptoUtil');

var config = require('../config');

// 登陆检查用户名和密码
exports.checkLogin = function(uname, pw, req, cb){

	var sql = 'select * from '+ config.user_t;
	sql += ' where ';
	sql += ' user_name = ? and ';
	sql += ' user_pw = ? ';
	
	mysqlUtil.query(sql, [uname, cryptoUtil.md5(pw)],  
		function(err, results, fields) {

		if (err) { 
			console.log('check login wrong');
			return next(err);		  	 
		} 

		if(results.length !== 0)
		{	
			req.session.uname = uname;
			req.session.uid = results[0].user_id;
			req.session.uimg = results[0].user_img;
			cb(null, true);
		}else{
			cb(null, false);
		};					     
	});	

}

// 修改密码
exports.modifyPW = function(uname, pw, cb){
	
	var sql = 'update ' + config.user_t;
	sql += ' set ';
	sql += ' user_pw = ?';
	sql += ' where user_name = ?';
	
	mysqlUtil.query(sql, [cryptoUtil.md5(pw), uname], function(err, result){
		if(err){
			console.log('modify pw error');
			return next(err);
		}

		cb(null, true);
	})

}

// 添加聊天内容
exports.addChat = function(obj, cb){

	var chat  = {user_id: obj.userid, chat_content: obj.content, add_time:new Date().Format('YYYY-MM-dd HH:mm:ss')};

	var sql = 'insert into ' +config.chat_t;
	sql += ' set ? ';

	mysqlUtil.query(sql, chat, function(err, result){
		
		if(err){
			console.log('add chat error');
			return next(err);
		}

		cb(null, result.insertId);
	});

}

// 修改用户信息
exports.modifyInfo = function(req, cb){
	
	var uid = req.body.uid;
	var type = req.body.type; 
	var  a_t = []; 

	var sql = 'update ' + config.user_t;
	sql += ' set ';
	
	if(+type === 1){
		sql += ' user_name = ?';
		sql += ' , user_sex = ?';
		sql += ' , user_phone = ?';
		a_t = [req.body.uname, req.body.sex, req.body.phoneNumber, uid]; 
	}else{
		sql += ' user_age = ?';
		sql += ' , user_horo = ?';
		sql += ' , user_hobby = ?';
		sql += ' , user_sign = ?';
		a_t = [req.body.age, req.body.horo, req.body.hobby, req.body.sign, uid];
	}	
	sql += ' where user_id = ?';

	mysqlUtil.query(sql, a_t, function(err, result){
		if(err){
			console.log('modify info error');
			return next(err);
		}else{
			cb(null, true);
		}
		
	})

}

// 根据id获取用户信息
exports.getById = function(uid, cb){

	var sql = 'select * from '+ config.user_t;
	sql += ' where ';
	sql += ' user_id = ?'; 

	mysqlUtil.query(sql, [uid], function(err, rows, fields){
		if(err){
			console.log('get by uid error');
			return next(err);
		}
		cb(null, rows);
		
	});

}

// 根据id获取某些列
exports.getColById = function(cols, uid, cb, next){
	
	var sql = 'select '+cols.join(',')+' from '+ config.user_t;
	sql += ' where ';
	sql += ' user_id = ?'; 
	
	mysqlUtil.query(sql, [uid], function(err, rows, fields){
		if(err){
			console.log('get by item error');
			return next(err);
		}
		
		cb(null, rows);
		
	});
}

// 获取订单的spend
exports.getSpend = function(uid, cb){

	var sql = 'SELECT menu_wine.menu_id, menu_wine.wine_id, wine_num, wine.wine_price FROM  '+ config.menu_wine_t;
	sql += ' JOIN ' + config.wine_t;
	sql += ' ON ' + config.menu_wine_t + '.wine_id='+config.wine_t+'.wine_id '; 
	sql += ' AND '+ config.menu_wine_t + '.menu_id in ';
	sql += ' (SELECT menu_id FROM '+ config.menu_t +' where user_id = ?) '
	var result = {};

	mysqlUtil.query(sql, [uid], function(err, rows, fields){
		if(err){
			console.log('get order error');
			return next(err);
		}

		if(rows.length !== 0){
			for(var i=0, l=rows.length; i<l; i++){
				var spend = result[rows[i].menu_id];
				if(!spend){
					spend = 0;
				}
				spend += +rows[i].wine_num * +rows[i].wine_price;
				result[rows[i].menu_id] = spend;
			}
			cb(null, result);

		}  // rows
	})  // get menu
}

// 检查用户名是否已存在
exports.checkUname = function(uname){
	
	var sql = 'select * from '+ config.user_t;
	sql += ' where ';
	sql += ' user_name = ?'; 
	
	mysqlUtil.query(sql, [uname], function(err, rows, fields){
		if(err){
			console.log('check uname error');
			return next(err);
		}
		
		if(rows.length !== 0){
			return true;
		}else{
			return false;
		}
	});
}

// 添加用户
exports.addUser = function(uname, pw, cb){
	var user  = {user_name: uname, user_pw: cryptoUtil.md5(pw), add_time:new Date().Format('YYYY-MM-dd HH:mm:ss')};
	
	var sql = 'insert into ' +config.user_t;
	sql += ' set ? ';
	
	mysqlUtil.query(sql, user, function(err, result){
		if(err){
			console.log('add user error');
			return next(err);
		}

		cb(null, result.insertId);
	});

}

// 删除用户
exports.delUser = function(){

}

// 检查邮箱是否被注册
exports.checkEmail = function(){

}

// 获取管理员列表
exports.getUserList = function(){

}

