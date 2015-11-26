var mysqlUtil = require('../utils/mysqlUtil');
var util = require('util');
var cryptoUtil = require('../utils/cryptoUtil');

var database = require('../config').mysql_db;
var user_t = require('../config').user_t;
var chat_t = require('../config').chat_t;




// 登陆检查用户名和密码
exports.checkLogin = function(uname, pw, req, cb){
	console.log('start login'+uname+'; '+pw);
	var sql = 'select * from '+ user_t;
	sql += ' where ';
	sql += ' user_name = ? and ';
	sql += ' user_pw = ? ';
	mysqlUtil.query(sql, [uname, cryptoUtil.md5(pw)],  
		function(err, results, fields) {

		if (err) { 
			console.log('check login wrong');		  	 
		} 

		if(results.length !== 0)
		{	
			req.session.uname = uname;
			req.session.uid = results[0].user_id;
			req.session.uimg = results[0].user_img;
			console.log('login success');
			cb(null, true);
		}else{
			console.log('login faild');
			cb(null, false);
		};					     
	});	

}

// 修改密码
exports.modifyPW = function(uname, pw, cb){
	var sql = 'update ' + user_t;
	sql += ' set ';
	sql += ' user_pw = ?';
	sql += ' where user_name = ?';
	mysqlUtil.query(sql, [cryptoUtil.md5(pw), uname], function(err, result){
		if(err){
			console.log('modify pw error');
		}

		cb(null, true);
	})

}

// 添加聊天内容
exports.addChat = function(obj, cb){

	var chat  = {user_id: obj.userid, chat_content: obj.content, add_time:new Date().Format('YYYY-MM-dd HH:mm:ss')};

	var sql = 'insert into ' +chat_t;
	sql += ' set ? ';
	console.log(sql);
	mysqlUtil.query(sql, chat, function(err, result){
		if(err){
			console.log('add chat error');
		}

		console.log(util.inspect({result: result}));
		
		cb(null, result.insertId);
	});
}

// 修改用户信息
exports.modifyInfo = function(req, cb){
	var uid = req.body.uid;
	var type = req.body.type; 
	var  a_t = []; 

	console.log(uid+'; argu '+req.body.uname+'; type:'+type);
	console.log(util.inspect({type:type}));
	var sql = 'update ' + user_t;
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
	console.log(sql);
	mysqlUtil.query(sql, a_t, function(err, result){
		if(err){
			console.log(util.inspect({err: err}));
			console.log('modify info error');
			cb(null, false);
		}else{
			cb(null, true);
		}
		
	})

}

//根据id获取用户信息
exports.getById = function(uid, cb){
	var sql = 'select * from '+ user_t;
	sql += ' where ';
	sql += ' user_id = ?'; 
	mysqlUtil.query(sql, [uid], function(err, rows, fields){
		if(err){
			console.log('get by uid error');
		}
		console.log(util.inspect({rows: rows}));
		// console.log(util.inspect({fields: fields}));
		cb(null, rows);
		
	});
}

//根据id获取某些列
exports.getColById = function(cols, uid, cb){
	var sql = 'select '+cols.join(',')+' from '+ user_t;
	sql += ' where ';
	sql += ' user_id = ?'; 
	mysqlUtil.query(sql, [uid], function(err, rows, fields){
		if(err){
			console.log('get by item error');
		}
		// console.log(util.inspect({rows: rows}));
		// console.log(util.inspect({fields: fields}));
		cb(null, rows);
		
	});
}

// 获取管理员列表
exports.getUserList = function(){

}

// 获取管理员列表
exports.checkUname = function(uname, cb){
	var sql = 'select * from '+ user_t;
	sql += ' where ';
	sql += ' user_name = ?'; 
	mysqlUtil.query(sql, [uname], function(err, rows, fields){
		if(err){
			console.log('check uname error');
		}
		// console.log(util.inspect({rows: rows}));
		// console.log(util.inspect({fields: fields}));
		if(rows.length !== 0){
			cb(null, true);
		}else{
			cb(null, false);
		}
	});
}

// 删除用户
exports.delUser = function(){

}

// 添加用户
exports.addUser = function(uname, pw, cb){
	var user  = {user_name: uname, user_pw: cryptoUtil.md5(pw), add_time:new Date().Format('YYYY-MM-dd HH:mm:ss')};
	var sql = 'insert into ' +user_t;
	sql += ' set ? ';
	console.log(sql);
	mysqlUtil.query(sql, user, function(err, result){
		if(err){
			console.log('add user error');
		}

		console.log(util.inspect({result: result}));
		
		cb(null, result.insertId);
	});

}

// 检查邮箱是否被注册
exports.checkEmail = function(){

}

