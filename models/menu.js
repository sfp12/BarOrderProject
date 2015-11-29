var mysqlUtil = require('../utils/mysqlUtil');
var util = require('util');
var cryptoUtil = require('../utils/cryptoUtil');
var Connection = require('mysql/lib/Connection.js');

var database = require('../config').mysql_db;
var menu_t = require('../config').menu_t;
var wine_t = require('../config').wine_t;
var menu_wine_t = require('../config').menu_wine_t;

exports.addOrder = function(uid, cart, cb){

	mysqlUtil.getConnection(function(err, conn) {
	   
		if(err){
			console.log('get connection err:'+err.stack());
		}

		autoRelease(conn);
	    conn.beginTransaction(function(err) {
		  if (err) { throw err; }

		  var sql_1 = 'insert into ' + menu_t;
		  sql_1 += ' set ? ';
		  var t = {user_id: uid, add_time: new Date().Format('YYYY-MM-dd HH:mm:ss')};

		  conn.query(sql_1, t, function(err, result) {
		    if (err) {
		      return conn.rollback(function() {
		        throw err;
		      });
		    }

		    var sql_2 = 'insert into ' + menu_wine_t;
		    sql_2 += ' (wine_id, menu_id, wine_num) values ? ';

		    // format insert data
		    var menu = [];
		    // console.log(util.inspect({cart: cart}));
		    cart = JSON.parse(cart);
		    for(var i=0, l=cart.length; i<l; i++){
		    	var item = [];
		    	item.push(cart[i].wine_id);
		    	item.push(result.insertId);
		    	item.push(cart[i].wine_num);
		    	menu.push(item);
		    }

		    // console.log(util.inspect({menu: menu}));

		    conn.query(sql_2, [menu], function(err, result) {
		      if (err) {
		        return conn.rollback(function() {
		          throw err;
		        });
		      }  
		      conn.commit(function(err) {
		        if (err) {
		          return conn.rollback(function() {
		            throw err;
		          });
		        }
		        // transction success
		        cb(null, true);
		        console.log('success!');

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
	    // if this is original conn.commit() and conn.rollback(), change them to be "commit and release" and "rollback and relese"
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

	var sql = 'select menu_id, add_time from ' + menu_t;
	sql += ' where ';
	sql += ' user_id = ?';
console.log('uid:'+uid);
	mysqlUtil.query(sql, [uid], function(err, rows, fields){
		if(err){
			console.log('get wine id num error');
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

	var sql = 'select '+wine_t+'.wine_id, '+menu_wine_t+'.wine_num, '+wine_t+'.wine_price, '+wine_t+'.wine_name from ' + wine_t;
	sql += ' JOIN ' + menu_wine_t;
	sql += ' where '+ wine_t +'.wine_id = '+menu_wine_t + '.wine_id ';
	sql += ' AND '+ menu_wine_t +'.menu_id = ?';

	mysqlUtil.query(sql, [menu_id], function(err, rows, fields){
		if(err){
			console.log('get wine id num error');
		}
		if(rows.length !== 0){
			
			cb(null, rows);

		}
	});

}