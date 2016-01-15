var mysqlUtil = require('../utils/mysqlUtil');
var util = require('util');
var cryptoUtil = require('../utils/cryptoUtil');

var config = require('../config');

// 检查用户名是否已存在
exports.checkUname = function(admin_name, cb){
	
	var sql = 'select * from '+ config.admin_t;
	sql += ' where ';
	sql += ' admin_name = ?'; 
	mysqlUtil.query(sql, [admin_name], function(err, rows, fields){
		if(err){
			console.log('check uname error');
			return next(err);
		}
		console.log(util.inspect({rows : rows}));
		console.log('length:'+rows.length);
		if(rows.length !== 0){
			cb(null, true);
			console.log('true');
		}else{
			cb(null, false);
			console.log('false');
		}
	});
}

// 添加管理员
exports.addUser = function(req, cb, next){

	var admin  = {
		admin_name: req.body.admin_name,
		admin_pw: cryptoUtil.md5(req.body.admin_pw),
		admin_real_name: req.body.admin_real_name,
		bar_name: req.body.bar_name,
		admin_role: req.body.admin_role,
		phone_number: req.body.phone_number,
		add_time:new Date().Format('YYYY-MM-dd HH:mm:ss')};
	
	var sql = 'insert into ' +config.admin_t;
	sql += ' set ? ';

	mysqlUtil.query(sql, admin, function(err, result){
		if(err){
			console.log('add user error');
			return next(err);
		}

		cb(null, result.insertId);
	});

}

// 登陆检查用户名和密码
exports.checkLogin = function(admin_name, admin_pw, req, cb, next){

	var sql = 'select * from '+ config.admin_t;
	sql += ' where ';
	sql += ' admin_name = ? and ';
	sql += ' admin_pw = ? ';
	
	mysqlUtil.query(sql, [admin_name, cryptoUtil.md5(admin_pw)],  
		function(err, results, fields) {

		if (err) { 
			console.log('check admin login wrong');
			return next(err);		  	 
		} 

		if(results.length !== 0)
		{	
			req.session.uname = admin_name;
			req.session.uid = results[0].admin_id;
			req.session.bar_id = req.body.bar_id;
			cb(null, true);
		}else{
			cb(null, false);
		};					     
	});	

}

// get 顾客信息
exports.getCustom = function(list_start, cb){
	var sql = 'select * from '+config.admin_t;
	sql += ' limit '+list_start+','+5;
	mysqlUtil.query(sql, function(err, results, fields) {

		if (err) { 
			console.log('get custom wrong');
			return next(err);		  	 
		} 

		cb(null, results);

	});

}

// 获取menu的总个数
exports.getMenuNum = function(req, cb, next){
	var sql = 'select count(*) from '+config.menu_t;
	sql += ' where bar_id = ? and menu_status = ?';
	var data = [req.query.bar_id, req.query.statu];
	if(req.start_time){
		sql += ' and add_time > ?';
		data.push(req.query.start_time);
	}

	if(req.end_time){
		sql += ' and add_time < ?';
		data.push(req.query.end_time);
	}

	mysqlUtil.query(sql, data, function(err, results, fields) {

		if (err) { 
			console.log('get custom wrong');
			return next(err);		  	 
		} 

		cb(null, results[0]["count(*)"]);		

	});
}

// 获取page_size个menu
exports.getLimitMenu = function(req, list_start, menu_id, cb, next){
	var sql = 'SELECT menu_id FROM '+config.menu_t;
	sql += ' where bar_id = ? and menu_status = ? ';
	var data = [req.query.bar_id, req.query.statu];

	if(req.query.start_time){
		sql += ' and add_time > ?';
		data.push(req.query.start_time);
	}

	if(req.query.end_time){
		sql += ' and add_time < ?';
		data.push(req.query.end_time);
	}
	sql += ' limit ? , ?';
	data.push(list_start);
	data.push(config.page_size);

	mysqlUtil.query(sql, data, function(err, results, fields) {

		if (err) { 
			console.log('get custom wrong');
			return next(err);		  	 
		} 
		for(var i=0,l=results.length; i<l; i++){
			menu_id.push(results[i].menu_id);
		}
		cb(null);

	});

}

// 获取5个menu 的 user_id :nnap
exports.getLimitUser = function(bar_id, statu, list_start, user_id, cb, next){
	var sql = 'SELECT user_id FROM '+config.menu_t;
	sql += ' where bar_id = ? and menu_status = ? ';
	sql += ' limit ? , 5';

	mysqlUtil.query(sql, [bar_id, statu, list_start], function(err, results, fields) {

		if (err) { 
			console.log('get custom wrong');
			return next(err);		  	 
		} 
		for(var i=0,l=results.length; i<l; i++){
			user_id.push(results[i].user_id);
		}
		cb(null);

	});

}

// 获取订单的spend
exports.getSpend = function(bar_id, statu, menu_id, cb, next){
	var sql = 'SELECT menu_wine.menu_id, menu_wine.wine_id, wine_num, wine.wine_price FROM  '+ config.menu_wine_t;
	sql += ' JOIN ' + config.wine_t;
	sql += ' ON ' + config.menu_wine_t + '.wine_id='+config.wine_t+'.wine_id '; 
	sql += ' AND '+ config.menu_wine_t + '.menu_id in ';
	sql += ' ('+menu_id.join(",")+')  ';
	var result = {};

	mysqlUtil.query(sql, [bar_id, statu], function(err, rows, fields){
		if(err){
			console.log('get order error');
			return next(err);
		}
		
		if(rows.length !== 0){
			for(var i=0, l=rows.length; i<l; i++){
				result[rows[i].menu_id] = result[rows[i].menu_id] || {};
				var spend = result[rows[i].menu_id].spend;
				if(!spend){
					spend = 0;
				}
				spend += +rows[i].wine_num * +rows[i].wine_price;
				result[rows[i].menu_id].spend = spend;
			}

			cb(null, result);

		}  // rows
	})  // get menu
}

// 获取手机号码
exports.getPhoneNumber = function(bar_id, statu, menu_id, spend, cb, next){
	var sql = 'SELECT menu.menu_id, user.user_phone FROM  '+ config.menu_t;
	sql += ' JOIN ' + config.user_t;
	sql += ' ON ' + config.menu_t + '.user_id='+config.user_t+'.user_id '; 
	sql += ' AND '+ config.menu_t + '.menu_id in ';
	sql += ' ('+menu_id.join(",")+')  ';

	mysqlUtil.query(sql, [bar_id, statu], function(err, rows, fields){
		if(err){
			console.log('get wine id num error');
			return next(err);
		}
		if(rows.length !== 0){
			for(var i=0, l=rows.length; i<l; i++){
				var item = rows[i];
				spend[item.menu_id].phone_number = item.user_phone; 
			}
			cb(null, spend);

		}
	});
}

// 获取酒品信息
exports.getWineInfo = function(bar_id, statu, menu_id, spend, cb, next){
	var sql = 'SELECT menu_wine.menu_id, menu_wine.wine_id, wine_num, wine.wine_name FROM  '+ config.menu_wine_t;
	sql += ' JOIN ' + config.wine_t;
	sql += ' ON ' + config.menu_wine_t + '.wine_id='+config.wine_t+'.wine_id '; 
	sql += ' AND '+ config.menu_wine_t + '.menu_id in ';
	sql += ' ('+menu_id.join(",")+')  ';

	mysqlUtil.query(sql, [bar_id, statu], function(err, rows, fields){
		if(err){
			console.log('get wine id num error');
			return next(err);
		}

		if(rows.length !== 0){
			for(var i=0, l=rows.length; i<l; i++){
				var item = rows[i];
				spend[item.menu_id].wine = spend[item.menu_id].wine || {};
				spend[item.menu_id].wine[item.wine_id] = {};
				spend[item.menu_id].wine[item.wine_id].name = item.wine_name;
				spend[item.menu_id].wine[item.wine_id].num = item.wine_num;

			}
			cb(null, spend);

		}
	});
}

// 获取订单信息
exports.getMenuInfo = function(bar_id, statu, menu_id, spend, cb, next){
	var sql = 'select menu_id, add_time, menu_number, table_id from '+config.menu_t;
	sql += ' where menu_id in ';
	sql += ' ('+menu_id.join(",")+')  ';

	mysqlUtil.query(sql, function(err, results, fields) {

		if (err) { 
			console.log('get custom wrong');
			return next(err);		  	 
		} 

		if(results.length !== 0){
			for(var i=0, l=results.length; i<l; i++){
				var item = results[i];
				var add_time = item.add_time+'';
				if(add_time === 'null'){
					spend[item.menu_id].day = '';
					spend[item.menu_id].time = '';
				}else{
					// 2015-11-29 14:57:17   
					// day: 2015/11/29
					spend[item.menu_id].day = add_time.split(' ')[0].split('-').join('/');
					// time: 14:57
					spend[item.menu_id].time = (add_time.split(' ')[1]+'').substr(0, 5);
				};
				spend[item.menu_id].menu_number = item.menu_number;
				spend[item.menu_id].table_id = item.table_id;

			}
			cb(null, spend);

		}

	});
}

// 切换menu的status
exports.getSwitchStatus = function(menu_id, to, cb){
	sql = 'update '+config.menu_t+' set ';
	sql += ' menu_status = ? where ';
	sql += ' menu_id = ?';

	mysqlUtil.query(sql, [to, menu_id], function(err, results, fields) {

		if (err) { 
			console.log('get custom wrong');
			return next(err);		  	 
		} 

		cb(null, true);		

	});
}

// 新增点单的数目
exports.newOrderNum = function(bar_id, cb, next){
	var sql = 'select count(*) from '+config.menu_t;
	sql += ' where bar_id = ? and menu_status = ?';

	mysqlUtil.query(sql, [bar_id, 1], function(err, results, fields) {

		if (err) { 
			console.log('get custom wrong');
			return next(err);		  	 
		} 

		cb(null, results[0]["count(*)"]);		

	});
}

// 新增点单的数目
exports.newCallNum = function(bar_id, cb, next){
	var sql = 'select count(*) from '+config.call_t;
	sql += ' where bar_id = ? and call_status = ?';
	console.log('sql:'+sql);
	mysqlUtil.query(sql, [bar_id, 1], function(err, results, fields) {

		if (err) { 
			console.log('get custom wrong');
			return next(err);		  	 
		} 

		// console.log(util.inspect({results : results}));

		cb(null, results[0]["count(*)"]);		

	});
}

/*
* 顾客呼叫
*/
// 获取call的总个数
exports.getCallNum = function(req, cb, next){
	var sql = 'select count(*) from '+config.call_t;
	sql += ' where bar_id = ? and call_status = ?';
	var data = [req.query.bar_id, req.query.statu];

	if(req.start_time){
		sql += ' and add_time > ?';
		data.push(req.query.start_time);
	}

	if(req.end_time){
		sql += ' and add_time < ?';
		data.push(req.query.end_time);
	}

	mysqlUtil.query(sql, data, function(err, results, fields) {

		if (err) { 
			console.log('get call num wrong');
			return next(err);		  	 
		} 

		cb(null, results[0]["count(*)"]);		

	});
}

// 获取page_size个call
exports.getLimitCall = function(req, list_start, call_id, cb, next){
	var sql = 'SELECT call_id FROM '+config.call_t;
	sql += ' where bar_id = ? and call_status = ? ';
	var data = [req.query.bar_id, req.query.statu];

	if(req.query.start_time){
		sql += ' and add_time > ?';
		data.push(req.query.start_time);
	}

	if(req.query.end_time){
		sql += ' and add_time < ?';
		data.push(req.query.end_time);
	}
	sql += ' limit ? , ?';
	data.push(list_start);
	data.push(config.page_size);

	mysqlUtil.query(sql, data, function(err, results, fields) {

		if (err) { 
			console.log('get limit call wrong');
			return next(err);		  	 
		} 
		for(var i=0,l=results.length; i<l; i++){
			call_id.push(results[i].call_id);
		}
		cb(null);

	});

}

// 获取呼叫的手机号码
exports.getCallPhoneNumber = function(bar_id, statu, call_id, cb, next){
	var sql = 'SELECT '+config.call_t+'.call_id, '+config.user_t+'.user_phone FROM  '+ config.call_t;
	sql += ' JOIN ' + config.user_t;
	sql += ' ON ' + config.call_t + '.user_id='+config.user_t+'.user_id '; 
	sql += ' AND '+ config.call_t + '.call_id in ';
	sql += ' ('+call_id.join(",")+')  ';

	var spend = {};

	mysqlUtil.query(sql, [bar_id, statu], function(err, rows, fields){
		if(err){
			console.log('get call phone number error');
			return next(err);
		}
		if(rows.length !== 0){
			for(var i=0, l=rows.length; i<l; i++){
				var item = rows[i];
				spend[item.call_id] = {};
				spend[item.call_id].phone_number = item.user_phone; 
			}
			cb(null, spend);

		}
	});
}

// 获取呼叫信息
exports.getCallInfo = function(bar_id, statu, call_id, spend, cb, next){
	var sql = 'select call_id, add_time, call_times, table_id, call_type from '+config.call_t;
	sql += ' where call_id in ';
	sql += ' ('+call_id.join(",")+')  ';

	mysqlUtil.query(sql, function(err, results, fields) {

		if (err) { 
			console.log('get call info wrong');
			return next(err);		  	 
		} 

		if(results.length !== 0){
			for(var i=0, l=results.length; i<l; i++){
				var item = results[i];
				var add_time = item.add_time+'';
				if(add_time === 'null'){
					spend[item.call_id].day = '';
					spend[item.call_id].time = '';
				}else{
					// 2015-11-29 14:57:17   
					// day: 2015/11/29
					spend[item.call_id].day = add_time.split(' ')[0].split('-').join('/');
					// time: 14:57
					spend[item.call_id].time = (add_time.split(' ')[1]+'').substr(0, 5);
				};
				spend[item.call_id].call_times = item.call_times;
				spend[item.call_id].table_id = item.table_id;
				spend[item.call_id].call_type = item.call_type;

			}
			cb(null, spend);

		}

	});
}

// 切换call的status
exports.getSwitchStatusCall = function(call_id, to, cb){
	sql = 'update '+config.call_t+' set ';
	sql += ' call_status = ? where ';
	sql += ' call_id = ?';

	mysqlUtil.query(sql, [to, call_id], function(err, results, fields) {

		if (err) { 
			console.log('get switch status call wrong');
			return next(err);		  	 
		} 

		cb(null, true);		

	});
}

/*
* 顾客信息
*/
// 获取user的总个数
exports.getUserNum = function(req, cb, next){
	var sql = 'select count(distinct user_id) from '+config.menu_t;
	sql += ' where bar_id = ? ';

	var data = [req.query.bar_id];

	if(+req.query.state === 1){
		// 今日顾客
		sql += ' and add_time > ?';
		sql += ' and add_time < ?';
		data.push(req.query.start_date, req.query.end_date);
	}else{
		// 历史
		if(req.query.start_day){
			sql += ' and add_time > '+req.query.start_day;
			data.push(req.query.start_day);
		}

		if(req.query.end_day){
			sql += ' and add_time < '+req.query.end_day;
			data.push(req.query.end_day);
		}
	}	

	mysqlUtil.query(sql, data, function(err, results, fields) {

		if (err) { 
			console.log('get user num wrong');
			return next(err);		  	 
		} 

		cb(null, results[0]["count(distinct user_id)"]);		

	});
}

// 获取page_size个call nnap
exports.getLimitUser = function(req, list_start, user_id, cb, next){
	var sql = 'SELECT distinct user_id FROM '+config.menu_t;
	sql += ' where bar_id = ?  ';
	var data = [req.query.bar_id];

	if(+req.query.state === 1){
		// 今日顾客
		sql += ' and add_time > ?';
		sql += ' and add_time < ?';
		data.push(req.query.start_date, req.query.end_date);
	}else{
		// 历史
		if(req.query.start_day){
			sql += ' and add_time > ?';
			data.push(req.query.start_day);
		}

		if(req.query.end_day){
			sql += ' and add_time < ?';
			data.push(req.query.end_day);
		}
	}	

	sql += ' limit ? , ?';
	data.push(list_start);
	data.push(config.page_size);
	mysqlUtil.query(sql, data, function(err, results, fields) {

		if (err) { 
			console.log('get limit user wrong');
			return next(err);		  	 
		} 
		for(var i=0,l=results.length; i<l; i++){
			user_id.push(results[i].user_id);
		}
		cb(null);

	});

}

// 获取来店次数
exports.getUserComeTimes = function(bar_id, user_ids, req, list_start, cb, next){

	var sql = 'select user_id, count(DISTINCT DATE(add_time)) from '+config.menu_t;
	sql += ' where bar_id = ?  ';
	sql += ' and user_id in ('+user_ids.join(",")+') ';
	var data = [req.query.bar_id];

	// select user_id, count(DISTINCT DATE(add_time)) from menu group by user_id limit 0,5

	if(+req.query.state === 1){
		// // 今日顾客
		// sql += ' and add_time > ?';
		// sql += ' and add_time < ?';
		// data.push(req.query.start_date, req.query.end_date);
	}else{
		// 历史
		if(req.query.start_day){
			sql += ' and add_time > ?';
			data.push(req.query.start_day);
		}

		if(req.query.end_day){
			sql += ' and add_time < ?';
			data.push(req.query.end_day);
		}
	}	

	sql += ' group by user_id limit ? , ?';
	data.push(list_start);
	data.push(config.page_size);
	mysqlUtil.query(sql, data, function(err, results, fields) {

		if (err) { 
			console.log('get limit user wrong');
			return next(err);		  	 
		} 

		var result = {};
		for(var i=0,l=results.length; i<l; i++){
			result[results[i].user_id] = {};
			result[results[i].user_id].come_times = results[i]['count(DISTINCT DATE(add_time))']
		}
		cb(null, result);

	});
}

// 获取顾客的 今日 菜单
exports.getTodayUserMenu = function(req, cb, next){
	var sql = 'SELECT user_id, menu_id FROM '+config.menu_t;
	sql += ' where bar_id = ?  ';
	var data = [req.query.bar_id];

	if(+req.query.state === 1){
		// 今日顾客
		sql += ' and add_time > ?';
		sql += ' and add_time < ?';
		data.push(req.query.start_date, req.query.end_date);
	}else{
		// 历史
		if(req.query.start_day){
			sql += ' and add_time > '+req.query.start_day;
			data.push(req.query.start_day);
		}

		if(req.query.end_day){
			sql += ' and add_time < '+req.query.end_day;
			data.push(req.query.end_day);
		}
	}	

	mysqlUtil.query(sql, data, function(err, results, fields) {

		if (err) { 
			console.log('get today user menu wrong');
			return next(err);		  	 
		} 

		var menu_id = [];
		var today_menu_id = {};
		for(var i=0,l=results.length; i<l; i++){
			menu_id.push(results[i].menu_id);
			today_menu_id[results[i].menu_id] = results[i].user_id;
		}
		cb(null, menu_id, today_menu_id);

	});

}

// 获取订单的spend info
exports.getSpendInfo = function(req, menu_id, cb, next){
	var sql = 'SELECT menu_wine.menu_id, menu_wine.wine_id, wine_num, wine.wine_price FROM  '+ config.menu_wine_t;
	sql += ' JOIN ' + config.wine_t;
	sql += ' ON ' + config.menu_wine_t + '.wine_id='+config.wine_t+'.wine_id '; 
	sql += ' AND '+ config.menu_wine_t + '.menu_id in ';
	sql += ' ('+menu_id.join(",")+')  ';
	var result = {};

	mysqlUtil.query(sql, function(err, rows, fields){
		if(err){
			console.log('get order error');
			return next(err);
		}

		if(rows.length !== 0){
			for(var i=0, l=rows.length; i<l; i++){
				result[rows[i].menu_id] = result[rows[i].menu_id] || {};
				var spend = result[rows[i].menu_id].spend;
				if(!spend){
					spend = 0;
				}
				spend += +rows[i].wine_num * +rows[i].wine_price;
				result[rows[i].menu_id].spend = spend;
			}

			cb(null, result);

		}  // rows
	})  // get menu
}

// 获取顾客的 历史 菜单
exports.getUserAllMenu = function(req, user_id, cb, next){
	var sql = 'SELECT user_id, menu_id FROM '+config.menu_t;
	sql += ' where bar_id = ?  ';
	var data = [req.query.bar_id];
	if(user_id.length !== 0){
		sql += ' and user_id in ('+user_id.join(",")+') ';
	}
	
	mysqlUtil.query(sql, data, function(err, results, fields) {

		if (err) { 
			console.log('get today user menu wrong');
			return next(err);		  	 
		} 

		var menu_id = [];
		var today_menu_id = {};
		for(var i=0,l=results.length; i<l; i++){
			menu_id.push(results[i].menu_id);
			today_menu_id[results[i].menu_id] = results[i].user_id;
		}
		cb(null, menu_id, today_menu_id);

	});

}

// 获取顾客信息
exports.getUserInfo = function(bar_id, user_ids, data, cb, next){
	var sql = 'select user_id, user_name, user_phone, user_comments from '+config.user_t;
	sql += ' where user_id in ';
	sql += ' ('+user_ids.join(",")+')  ';

	mysqlUtil.query(sql, function(err, results, fields) {

		if (err) { 
			console.log('get user info wrong');
			return next(err);		  	 
		} 

		if(results.length !== 0){
			for(var i=0, l=results.length; i<l; i++){
				var item = results[i];
				
				data[item.user_id].user_name = item.user_name;
				data[item.user_id].user_phone = item.user_phone;
				data[item.user_id].user_comments = item.user_comments;

			}
			cb(null, data);

		}

	});
}

/*
* 菜单管理
*/
// 获取当前酒品
exports.getSellW = function(req, wine_ids, cb, next){
	var sql = 'select wine_id, wine_name, wine_price, wine_stock, wine_set, wine_type, if_recommend from '+config.wine_t;
	sql += ' where bar_id = ?';
	sql += ' and wine_status = ?';
	var data = [req.session.bar_id, 1];
	if(req.query.name){
		console.log('no name');
		sql += " and wine_name like '%"+req.query.name+"%' ";
	}
	sql += ' limit ?,?';
	data.push(req.query.list_start, config.page_size);

	mysqlUtil.query(sql, data, function(err, results, fields) {

		if (err) { 
			console.log('get sell wine wrong');
			return next(err);		  	 
		} 

		if(results.length !== 0){
			var data = {};
			for(var i=0, l=results.length; i<l; i++){
				var item = results[i];
				wine_ids.push(item.wine_id);
				data[item.wine_id] = {};
				data[item.wine_id].wine_name = item.wine_name;
				data[item.wine_id].wine_price = item.wine_price;
				data[item.wine_id].wine_stock = item.wine_stock;
				data[item.wine_id].wine_set = item.wine_set;
				data[item.wine_id].wine_type = item.wine_type;
				data[item.wine_id].if_recommend = item.if_recommend;

			}
			cb(null, data);

		}

	});
}

exports.getTodaySellM = function(req, r, menu_ids, cb, next){
	var sql = 'select menu_id from '+config.menu_t+' where bar_id = ? '
	data = [req.query.bar_id];
	sql += ' and add_time > ?';
	sql += ' and add_time < ?';
	data.push(req.query.start_date, req.query.end_date);

	mysqlUtil.query(sql, data, function(err, results, fields) {

		if (err) { 
			console.log('get today sell menu wrong');
			return next(err);		  	 
		} 

		if(results.length !== 0){
			for(var i=0, l=results.length; i<l; i++){
				var item = results[i];
				menu_ids.push(item.menu_id);
			}
			cb(null, r);

		}

	});
}

// 今日售出
exports.getTodaySellW = function(req, r, wine_ids, menu_ids, cb, next){
	var sql = 'SELECT menu_id, wine_id, wine_num FROM '+config.menu_wine_t;
	sql += ' where ';
	var data = [];
	if(wine_ids.length !== 0){
		sql += ' wine_id in ('+wine_ids.join(',')+') and ';
		// data.push(req.query.name);
	}
	if(menu_ids.length !== 0){
		sql += ' menu_id in ('+menu_ids.join(',')+') ';
	}

	mysqlUtil.query(sql, data, function(err, results, fields) {

		if (err) { 
			console.log('get today sell wine wrong');
			return next(err);		  	 
		} 

		if(results.length !== 0){
			var data = r;
			for(var i=0, l=results.length; i<l; i++){
				var item = results[i];
				if(!data[item.wine_id]){
					continue;
				}
				data[item.wine_id].wine_today_sell = data[item.wine_id].wine_today_sell || 0;
				data[item.wine_id].wine_today_sell += +item.wine_num;
			}
			cb(null, data);
		}

	});
}

// 历史售出
exports.getAllSellW = function(req, r, cb, next){
	var sql = 'SELECT menu_id, wine_id, wine_num FROM '+config.menu_wine_t;
	sql += ' where ';
	var data = [];
	if(req.query.name){
		sql += ' wine_id in (select wine_id from '+config.wine_t+' where wine_name like "%'+req.query.name+'%") and ';
		// data.push(req.query.name);
	}
	sql += ' menu_id in (select menu_id from '+config.menu_t+' where bar_id = ? '
	data = [req.query.bar_id];
	sql += ' ) ';

	mysqlUtil.query(sql, data, function(err, results, fields) {

		if (err) { 
			console.log('get all sell wine wrong');
			return next(err);		  	 
		} 
		if(results.length !== 0){
			var data = r;
			for(var i=0, l=results.length; i<l; i++){
				var item = results[i];
				if(!data[item.wine_id]){
					continue;
				}
				data[item.wine_id].wine_all_sell = data[item.wine_id].wine_all_sell || 0;
				data[item.wine_id].wine_all_sell += +item.wine_num;
			}
			cb(null, data);
		}

	});
}

// 当前酒品 切换状态
exports.getSwitchStatusWine = function(wine_id, to, cb){
	sql = 'update '+config.wine_t+' set ';
	sql += ' wine_status = ? where ';
	sql += ' wine_id = ?';

	mysqlUtil.query(sql, [to, wine_id], function(err, results, fields) {

		if (err) { 
			console.log('get switch status wine wrong');
			return next(err);		  	 
		} 

		cb(null, true);		

	});
}

// 类别管理
exports.getTypeM = function(req, type_ids, cb){
	var sql = 'select type_id, type_name from '+config.wine_type_t;
	sql += ' where bar_id = ?';
	sql += ' and type_status = ?';
	var data = [req.session.bar_id, 1];
	if(req.query.name){
		sql += " and type_name like '%"+req.query.name+"%' ";
	}
	sql += ' limit ?,?';
	data.push(req.query.list_start, config.page_size);

	mysqlUtil.query(sql, data, function(err, results, fields) {

		if (err) { 
			console.log('get type m wrong');
			return next(err);		  	 
		} 
		// console.log(util.inspect({result : results}));
		if(results.length !== 0){
			var data = {};
			for(var i=0, l=results.length; i<l; i++){
				var item = results[i];
				type_ids.push(item.type_id);
				data[item.type_id] = {};
				data[item.type_id].type_name = item.type_name;
			}
			cb(null, data);

		}

	});
}

// 根据type_ids 获取wine info
exports.getWineBytype = function(r, type_ids, req, cb){
	var sql = 'select wine_id, wine_name, wine_type from '+config.wine_t;
	sql += ' where bar_id = ? ';
	if(type_ids.length !== 0){
		sql += ' and wine_type in ('+type_ids.join(',')+')';
	}

	mysqlUtil.query(sql, [req.session.bar_id], function(err, results, fields) {

		if (err) { 
			console.log('get wine by type wrong');
			return next(err);		  	 
		} 
	console.log(util.inspect({result : results}));
		if(results.length !== 0){
			for(var i=0, l=results.length; i<l; i++){
				var item = results[i];
				r[item.wine_type].wine_name = r[item.wine_type].wine_name || [];
				r[item.wine_type].wine_name.push(item.wine_name);
			}
			cb(null, r);

		}

	});
	 
}

// 新增类别
exports.postNewType = function(req, cb, next){
	var sql = 'insert into '+config.wine_type_t+' set ? ';
	var type = {
		type_name: req.body.type_name,
		type_status: 1,
		bar_id: req.session.bar_id
	} 

	mysqlUtil.query(sql, type, function(err, result) {

		if (err) { 
			console.log('add new type wrong');
			return next(err);		  	 
		} 

		cb(null, result.insertId);
	});
}

// 更新wine type
exports.updateWineType = function(req, r, cb, next){
	var sql = 'update '+config.wine_t+' set wine_type = ?';
	sql += ' where wine_id in ('+req.body['wine_ids[]'].join(',')+')';

	mysqlUtil.query(sql, [r], function(err, results, fields) {

		if (err) { 
			console.log('update wine type wrong');
			return next(err);		  	 
		} 

		cb(null, true);
	});

}

// 获取类别的信息
exports.getTypeInfo = function(req, cb, next){
	var sql = 'select type_name from '+config.wine_type_t;
	sql += ' where type_id = ? and bar_id = ?';

	mysqlUtil.query(sql, [req.query.type_id, req.session.bar_id], function(err, results, fields) {

		if (err) { 
			console.log('get type info wrong');
			return next(err);		  	 
		} 
		var data = {};
		if(results.length !== 0){
			for(var i=0, l=results.length; i<l; i++){
				var item = results[i];
				data[req.query.type_id] = {};
				data[req.query.type_id].type_name = item.type_name;
			}
			cb(null, data);

		}

	});
}

// 获取酒的信息 根据 类别
exports.getWineByType = function(req, r, cb, next){
	var sql = 'select wine_id, wine_name, wine_price, wine_stock from '+config.wine_t;
	sql += ' where wine_type = ?';

	mysqlUtil.query(sql, [req.query.type_id], function(err, results, fields) {

		if (err) { 
			console.log('get wine by type wrong');
			return next(err);		  	 
		} 
	
		var data = r;
		if(results.length !== 0){
			// console.log(util.inspect({data : data}));
			// console.log('type_id:'+req.query.type_id);
			data[req.query.type_id].wine = {};
			for(var i=0, l=results.length; i<l; i++){
				var item = results[i];				
				data[req.query.type_id].wine[item.wine_id] = {}
				data[req.query.type_id].wine[item.wine_id].wine_name = item.wine_name;
				data[req.query.type_id].wine[item.wine_id].wine_price = item.wine_price;
				data[req.query.type_id].wine[item.wine_id].wine_stock = item.wine_stock;
			}
			cb(null, data);

		}

	});
}

// 获取酒的信息 根据 类别 编辑类别
exports.getWineByTypeEdit = function(req, cb, next){
	var sql = 'select wine_id from '+config.wine_t;
	sql += ' where wine_type = ?';

	mysqlUtil.query(sql, [req.body.type_id], function(err, results, fields) {

		if (err) { 
			console.log('get wine by edit type wrong');
			return next(err);		  	 
		} 

		cb(null, results);
	});
}

// 更新酒的类别
exports.updateWineTypeEdit = function(req, add, cb, next){
	var sql = 'update '+config.wine_t+' set wine_type = ?';
	sql += ' where wine_id in ('+add.join(',')+')';

	mysqlUtil.query(sql, [req.body.type_id], function(err, results, fields) {

		if (err) { 
			console.log('update wine type edit wrong');
			return next(err);		  	 
		} 

		cb(null, true);
	});
}















