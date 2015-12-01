var mysqlUtil = require('../utils/mysqlUtil');
var util = require('util');
var Connection = require('mysql/lib/Connection.js');

var config = require('../config');

// 添加订单
exports.addOrder = function(uid, cart, cb){

	mysqlUtil.getConnection(function(err, conn) {
	   
		if(err){
			console.log('add order connection err:'+err.stack());
			return next(err);
		}

		autoRelease(conn);

	    conn.beginTransaction(function(err) {

		  if (err) { 
		  	console.log('begin transaction');
		  	return next(err);
		  }

		  var sql_1 = 'insert into ' + config.menu_t;
		  sql_1 += ' set ? ';
		  var t = {user_id: uid, add_time: new Date().Format('YYYY-MM-dd HH:mm:ss')};

		  conn.query(sql_1, t, function(err, result) {
		    if (err) {
		      return conn.rollback(function() {
		      	cosole.log('insert into menu error');
		        return next(err);
		      });
		    }

		    var sql_2 = 'insert into ' + config.menu_wine_t;
		    sql_2 += ' (wine_id, menu_id, wine_num) values ? ';

		    // format insert data
		    var menu = [];
		    cart = JSON.parse(cart);
		    for(var i=0, l=cart.length; i<l; i++){
		    	var item = [];
		    	item.push(cart[i].wine_id);
		    	item.push(result.insertId);
		    	item.push(cart[i].wine_num);
		    	menu.push(item);
		    }

		    conn.query(sql_2, [menu], function(err, result) {
		      if (err) {
		        return conn.rollback(function() {
		        	console.log('insert into menu_wine error');
		            return next(err);
		        });
		      }  
		      conn.commit(function(err) {
		        if (err) {
		          return conn.rollback(function() {
		          	console.log('commit error');
		            return next(err);
		          });
		        }
		        // transction success
		        cb(null, true);

		      });  // commit

		    });  // insert into menu_wine

		  });  // insert into menu 

		});	  // begin transction
	});

	function after(fn, cb) {
	  return function () {
	    fn.apply(this, arguments);
	    cb();
	  }
	}

	function autoRelease(conn) {

	    if (conn.commit == Connection.prototype.commit) {
	        conn.commit = after(conn.commit, release);
	        conn.rollback = after(conn.rollback, release);
	    }

	    function release() {
	        if (conn) { 
	            conn.release();
	        }
	    } 
	}
	
}

// 从menu_wine 中获取add_time
exports.getAddTime = function(uid, spend, cb){

	var sql = 'select menu_id, add_time from ' + config.menu_t;
	sql += ' where ';
	sql += ' user_id = ?';

	mysqlUtil.query(sql, [uid], function(err, rows, fields){
		if(err){
			console.log('get wine id num error');
			return next(err);
		}
		
		if(rows.length !== 0){
			for(var i=0, l=rows.length; i<l; i++){
				var item = rows[i];
				spend[item.menu_id] += ','+item.add_time; 
			}
			cb(null, spend);

		}
	});

}

// 从menu_wine wine中获取wine info
exports.getById = function(menu_id, cb){

	var sql = 'select '+config.wine_t+'.wine_id, '+config.menu_wine_t+'.wine_num, '+config.wine_t+'.wine_price, '+config.wine_t+'.wine_name from ' + config.wine_t;
	sql += ' JOIN ' + config.menu_wine_t;
	sql += ' where '+ config.wine_t +'.wine_id = '+config.menu_wine_t + '.wine_id ';
	sql += ' AND '+ config.menu_wine_t +'.menu_id = ?';

	mysqlUtil.query(sql, [menu_id], function(err, rows, fields){
		if(err){
			console.log('get wine id num error');
			return next(err);
		}
		if(rows.length !== 0){
			
			cb(null, rows);

		}
	});

}