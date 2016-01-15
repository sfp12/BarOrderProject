var async = require('async');
var validator = require('validator');
var util = require('util');

var config = require('../config');

var admin_m = require('../models/admin');
var menu_m = require('../models/menu');
var user_m = require('../models/user');

Date.prototype.Format = function(fmt)   
	{ 
	  var o = {   
	    "M+" : this.getMonth()+1,                 //月份   
	    "d+" : this.getDate(),                    //日   
	    "H+" : this.getHours(),                   //小时   
	    "m+" : this.getMinutes(),                 //分   
	    "s+" : this.getSeconds(),                 //秒   
	    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
	    "S"  : this.getMilliseconds()             //毫秒   
	  };   
	  if(/(Y+)/.test(fmt))   
	    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
	  for(var k in o)   
	    if(new RegExp("("+ k +")").test(fmt))   
	  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
	  return fmt;   
	}
	
//new Date().Format('YYYY-MM-dd HH:mm:ss');


// 登陆页
exports.admin = function(req, res, next){
	res.render('admin');
};

// 登录post
exports.login = function(req, res, next){
	var result = {
		'status': 1,
		'data': '用户名或密码不正确，请重新输入!'
	}
  
	var admin_name = req.body.admin_name;
	var admin_pw = req.body.admin_pw;

	async.waterfall([
		function(cb){
			admin_m.checkUname(admin_name, cb);
		},
		function(r, cb){
			if(r){
				admin_m.checkLogin(admin_name, admin_pw, req, cb, next);
			}else{
				result.data = '该用户名不存在';
				res.send(JSON.stringify(result));
				return false;
			}
		},
		function(r){
			// 登录成功
			if(r){
				result.status = 0;
				result.data = {};
				result.data.userName = req.session.uname;
				result.data.userId = req.session.uid; 
				// result.data.userImg = req.session.uimg;
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

// 检查用户名 是否 已被注册
exports.checkAdminName = function(req, res, next){

	var result = {};
	result.status = 1;
	result.data = '该用户名已被使用，请使用其他用户名注册';

	var admin_name = req.query.admin_name;

	async.waterfall([
		function(cb){
			admin_m.checkUname(admin_name, cb);
		},
		function(r, cb){
			console.log('r:'+r);
			if(r){
				res.send(JSON.stringify(result));
			}else{
				result.status = 0;
				result.data = '用户名未被使用';
				res.send(JSON.stringify(result));
			}
		}
		], function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
	})
}

// 管理主页
exports.index = function(req, res, next){
	res.render('admin-index');
};

// 套餐管理页面
exports.menu = function(req, res, next){
	res.render('admin-menu');
};

// 添加酒品页面
exports.wine = function(req, res, next){
	res.render('admin-wine');
};

// 酒吧申请注册
exports.barRegister = function(req, res, next){
	var result = {
		'status': 1,
		'data': '验证码不正确，请重新获取'
	}

	var admin_name = req.body.admin_name;
	var admin_pw = req.body.admin_pw;	 
	var code = req.body['code'];
	// 验证码 req.session.code
	if(code !== '1234'){		
		res.send(JSON.stringify(result));
		return false;
	}else{
		console.log('code equal');
	}

	// 手机号
	if (!validator.isMobilePhone(admin_name, 'zh-CN')) {
		result.data = '你输入的手机号不合法';
        res.send(JSON.stringify(result));
        return false;
    }else{
    	console.log('number normal');
    }

    async.waterfall([function(cb){
    					admin_m.checkUname(admin_name, cb);
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
						admin_m.addUser(req, cb, next);
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
					], 				    
				    function(err, value){
				    	console.log('err:'+err);
						console.log('value:'+value);
				    });
};

// 申请注册
exports.workerRegister = function(req, res, next){
	var result = {
		'status': 1,
		'data': '验证码不正确，请重新获取'
	}

	var admin_name = req.body.admin_name;
	var admin_pw = req.body.admin_pw;	 
	var code = req.body['code'];
	// 验证码 req.session.code
	if(code !== '1234'){		
		res.send(JSON.stringify(result));
		return false;
	}else{
		console.log('code equal');
	}

	// 手机号
	if (!validator.isMobilePhone(admin_name, 'zh-CN')) {
		result.data = '你输入的手机号不合法';
        res.send(JSON.stringify(result));
        return false;
    }else{
    	console.log('number normal');
    }

    async.waterfall([function(cb){
    					admin_m.checkUname(admin_name, cb);
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
						admin_m.addUser(req, cb, next);
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
					], 				    
				    function(err, value){
				    	console.log('err:'+err);
						console.log('value:'+value);
				    });
};

// 管理员 忘记 密码 post
exports.adminForgetPw = function(req, res, next){

}

/*
* 订单
*/
// 订单
exports.getPendingO = function(req, res, next){

	var result = {};
	result.status = 1;
	result.data = '获取待处理的订单错误';

	var bar_id = req.query.bar_id;
	var statu = req.query.statu;
	var page = req.query.page;
	var list_start = (+page - 1) * config.page_size;

	// 保存menu_id
	var menu_id = [];

	// 1、先获取menu_id [] 需要返回的menu_id
	// 2、获取每个menu的spend
	// 3、获取每个menu的phone_number
	// 4、获取订单的wine name; wine num
	// 5、获取menu的相关信息
	// spend: spend, phone_number, wine, day, time, menu_number, table_id
	async.waterfall([
			function(cb){

				admin_m.getMenuNum(req, cb, next);
			},			
			function(num, cb){

				result.num = num;
				admin_m.getLimitMenu(req, list_start, menu_id, cb, next);
			},
			function(cb){

				admin_m.getSpend(bar_id, statu, menu_id, cb, next);
			},
			function(spend, cb){
				
				admin_m.getPhoneNumber(bar_id, statu, menu_id, spend, cb, next);
			},
			function(spend, cb){

				admin_m.getWineInfo(bar_id, statu, menu_id, spend, cb, next);
				
			},
			function(spend, cb){

				admin_m.getMenuInfo(bar_id, statu, menu_id, spend, cb, next);
			},
			function(spend, cb){

				// console.log(util.inspect({getMenuInfo : spend['10'].wine}));
				result.status = 0;
				result.data = spend;
				res.send(JSON.stringify(result));				
			}
		], 
		function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
		})
}

// 订单 状态切换 1->3
exports.getSwitchStatus = function(req, res, next){
	var result = {};
	result.status = 1;
	result.data = '状态切换出错';

	var id = req.query.menu_id;
	var to = req.query.to;

	async.waterfall([
			function(cb){
				admin_m.getSwitchStatus(id, to, cb);
			},
			function(r, cb){
				if(r){
					result.status = 0;
					result.data = '状态切换成功';
					res.send(JSON.stringify(result));
				}
			}
		], 

		function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
		}
	);
}

// 新增点单和呼叫
exports.newOrderCall = function(req, res, next){
	var result = {};
	result.status = 1;
	result.data = '新增点单和呼叫错误';

	var bar_id = req.query.bar_id;
	var num_order = 0;
	var num_call = 0;
	async.waterfall([
			function(cb){

				admin_m.newOrderNum(bar_id, cb, next);
			},
			function(r, cb){

				num_order = r;
				admin_m.newCallNum(bar_id, cb, next);				
			},
			function(r, cb){

				num_call = r;
				result.status = 0;
				result.data = {
					num_order: num_order,
					num_call: num_call
				};
				res.send(JSON.stringify(result));
			}
		], 

		function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
		}
	);
}

/*
* 呼叫
*/
// 呼叫
exports.getPendingC = function(req, res, next){

	var result = {};
	result.status = 1;
	result.data = '获取待处理的呼叫错误';

	var bar_id = req.query.bar_id;
	var statu = req.query.statu;
	var page = req.query.page;
	var list_start = (+page - 1) * config.page_size;

	// 保存call_id
	var call_id = [];

	// 1、先获取call_id [] 需要返回的call_id
	// 3、获取每个call的phone_number
	// 5、获取call的相关信息
	// spend: phone_number, call_type, day, time, table_id, call_num
	async.waterfall([
			function(cb){

				admin_m.getCallNum(req, cb, next);
			},			
			function(num, cb){
				// console.log('num:'+num);

				result.num = num;
				admin_m.getLimitCall(req, list_start, call_id, cb, next);
			},
			function(cb){
				// console.log('call_id:'+call_id);
				
				admin_m.getCallPhoneNumber(bar_id, statu, call_id, cb, next);
			},
			function(spend, cb){
				// console.log(util.inspect({call_phone_number : spend}));

				admin_m.getCallInfo(bar_id, statu, call_id, spend, cb, next);
			},
			function(spend, cb){

				// console.log(util.inspect({getCallInfo : spend}));
				result.status = 0;
				result.data = spend;
				res.send(JSON.stringify(result));				
			}
		], 
		function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
		})
}

// 呼叫 状态切换 1->3
exports.getSwitchStatusCall = function(req, res, next){
	var result = {};
	result.status = 1;
	result.data = '状态切换出错';

	var id = req.query.call_id;
	var to = req.query.to;

	async.waterfall([
			function(cb){
				admin_m.getSwitchStatusCall(id, to, cb);
			},
			function(r, cb){
				if(r){
					result.status = 0;
					result.data = '状态切换成功';
					res.send(JSON.stringify(result));
				}
			}
		], 

		function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
		}
	);
}

/*
* 顾客信息
*/
exports.getTodayC = function(req, res, next){

	var result = {};
	result.status = 1;
	result.data = '获取顾客信息错误';

	var bar_id = req.query.bar_id;
	var page = req.query.page;
	var list_start = (+page - 1) * config.page_size;

	if(+req.query.state === 1){
		// 今日顾客
		// 开发阶段
		req.query.start_date = new Date(2015, 10, 30).Format('YYYY-MM-dd');
		req.query.end_date = new Date(new Date(2015, 10, 30).getTime() + 24*60*60*1000).Format('YYYY-MM-dd');
	}

	// 保存user_id
	var user_ids = [];

	// 最后返回的结果
	var data = {};

	// 1、先获取符合条件的user总数目
	// 2、获取今日user的今日menu
	// 3、计算今日user今日spend 排序
	// 4、获取今日user的历史menu
	// 5、计算今日user历史spend 排序
	// 6、获取user的come_times
	// 7、获取user的相关信息
	// data: come_times, today_spend, all_spend, user_name, phone_number, user_comments
	async.waterfall([
			function(cb){

				admin_m.getUserNum(req, cb, next);
			},
			function(num, cb){

				result.num = num;

				if(+req.query.state === 1){
					admin_m.getTodayUserMenu(req, cb, next);
				}else{
					cb(null, [], {});
				}
			},
			function(menu_id, today_menu_id, cb){

				if(+req.query.state === 1){
					req.query.today_menu_id = today_menu_id;
					admin_m.getSpendInfo(req, menu_id, cb, next);
				}else{
					cb(null, {});
				}				
			},
			function(spend, cb){

				// { menu_id: [ 17, 18, 19 ] }
				// { today_menu_id: { '17': 14, '18': 14, '19': 14 } }
				// { all_spend: { '17': { spend: 60 }, '18': { spend: 60 }, '19': { spend: 40 } } }
				// { data: { user_id: { today_spend: 160 } } }
				var today_menu_id = req.query.today_menu_id;
				for(key in spend){
					var user_id = today_menu_id[key];
					data[user_id] = data[user_id] || {};
					data[user_id].today_spend = data[user_id].today_spend || 0;
					data[user_id].today_spend += +spend[key].spend;
				}

				// 今日消费 排序
				// start
				var user_today_a = [];
				for(key in data){
					var item = {};
					item.user_id = key;
					item.today_spend = data[key].today_spend;
					user_today_a.push(item);
				}

				user_today_a.sort(function(a, b){
					// b-a 降序
					return +req.query.sort === 1 ? a.today_spend - b.today_spend : b.today_spend - a.today_spend;
				})
				// end

				if(+req.query.state === 1){
					for(var i=list_start,l=list_start+config.page_size; i<l; i++){
						if(user_today_a[i]){
							user_ids.push(user_today_a[i].user_id);
						}
					}
				}

				admin_m.getUserAllMenu(req, user_ids, cb, next);
			},
			function(menu_id, all_menu_id, cb){

				req.query.all_menu_id = all_menu_id;
				admin_m.getSpendInfo(req, menu_id, cb, next);
			},
			function(spend, cb){

				var all_menu_id = req.query.all_menu_id;
				for(key in spend){
					var user_id = all_menu_id[key];
					data[user_id] = data[user_id] || {};
					data[user_id].all_spend = data[user_id].all_spend || 0;
					data[user_id].all_spend += +spend[key].spend;
				}

				if(+req.query.state !== 1){
					// start
					var user_all_a = [];
					for(key in data){
						var item = {};
						item.user_id = key;
						item.all_spend = data[key].all_spend;
						user_all_a.push(item);
					}

					user_all_a.sort(function(a, b){
						// b-a 降序
						return +req.query.sort === 1 ? a.all_spend - b.all_spend : b.all_spend - a.all_spend;
					})
					// end


					for(var i=list_start,l=list_start+config.page_size; i<l; i++){
						if(user_all_a[i]){
							user_ids.push(user_all_a[i].user_id);
						}
					}
				}

				// 去掉data中 多余的
				var data_t = {};
				for(var i=0,l=user_ids.length; i<l; i++){
					data_t[user_ids[i]] = data[user_ids[i]];
				}
				data = data_t

				admin_m.getUserInfo(bar_id, user_ids, data, cb, next);
			},			
			// datetime -> date
			function(data, cb){

				// 返回来店次数
				admin_m.getUserComeTimes(bar_id, user_ids, req, list_start, cb, next);
			},
			function(times, cb){
				for(key in times){
					data[key] = data[key] || {};
					data[key].come_times = data[key].come_times || 0;
					data[key].come_times = times[key].come_times;
				}

				result.status = 0;
				result.data = data;
				res.send(JSON.stringify(result));				
			}
		], 
		function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
		})
}

/*
* 菜单管理
*/
exports.getSellW = function(req, res, next){
	var result = {};
	result.status = 1;
	result.data = '获取当前酒品出错';

	var page = req.query.page;
	var list_start = (+page - 1) * config.page_size;
	req.query.list_start = list_start;

	// 存储wine_id
	var wine_ids = [];
	// 存储menu_id
	var menu_ids = [];

	// 1、获取酒品信息
	// 2、获取今日售出 :先找出今日出售的菜单，再找出今日出售的酒
	// 3、获取历史售出 :直接找出历史出售的酒
	// 4、没有wine_today_sell, wine_all_sell, 设为0
	// 5、调整库存
	async.waterfall([
			function(cb){

				admin_m.getSellW(req, wine_ids, cb, next);
			},
			function(r, cb){
				// console.log('wine_ids:'+wine_ids);
				req.query.start_date = new Date(2015, 10, 30).Format('YYYY-MM-dd');
				req.query.end_date = new Date(new Date(2015, 10, 30).getTime() + 24*60*60*1000).Format('YYYY-MM-dd');
				admin_m.getTodaySellM(req, r, menu_ids, cb, next);
			},
			function(r, cb){
				// console.log(util.inspect({menu_ids : menu_ids}));

				
				admin_m.getTodaySellW(req, r, wine_ids, menu_ids, cb, next)
			},
			function(r, cb){
				// console.log(util.inspect({todaysellw : r}));
				
				admin_m.getAllSellW(req, r, cb, next)
			},			
			function(r, cb){

				for(key in r){
					if(!r[key].wine_today_sell){
						r[key].wine_today_sell = 0
					}
					if(!r[key].wine_all_sell){
						r[key].wine_all_sell = 0;
					}
				}

				for(key in r){
					r[key].wine_stock = +r[key].wine_stock - +r[key].wine_all_sell;
				}

				if(r){
					result.status = 0;
					result.data = r;
					res.send(JSON.stringify(result));
				}
			}
		], 

		function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
		}
	);
}

// 酒品下架
exports.getSwitchStatusWine = function(req, res, next){
	var result = {};
	result.status = 1;
	result.data = 'wine状态切换出错';

	var id = req.query.wine_id;
	var to = req.query.to;

	async.waterfall([
			function(cb){
				admin_m.getSwitchStatusWine(id, to, cb);
			},
			function(r, cb){
				if(r){
					result.status = 0;
					result.data = 'wine状态切换成功';
					res.send(JSON.stringify(result));
				}
			}
		], 

		function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
		}
	);
}

// 类别管理
exports.getTypeM = function(req, res, next){
	var result = {};
	result.status = 1;
	result.data = '获取类别管理数据错误';

	var page = req.query.page;
	var list_start = (+page - 1) * config.page_size;
	req.query.list_start = list_start;

	//
	var type_ids = [];

	async.waterfall([
			function(cb){
				admin_m.getTypeM(req, type_ids, cb);
			},
			function(r, cb){
				// if(r){
					// console.log(util.inspect({r : r}));
				// }
				admin_m.getWineBytype(r, type_ids, req, cb);

			},
			function(r, cb){
				// console.log(util.inspect({get_wine : r['1'].wine_name}));
				result.status = 0;
				result.data = r;
				res.send(JSON.stringify(result));
			}
		], 

		function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
		}
	);
}

//新增类别
exports.postNewType = function(req, res, next){
	var result = {};
	result.status = 1;
	result.data = '新增类别出错';

	async.waterfall([
			function(cb){
				admin_m.postNewType(req, cb, next);
			},
			function(r, cb){
				// console.log('insert:'+r);

				admin_m.updateWineType(req, r, cb, next);
			},
			function(r, cb){
				if(r){
					result.status = 0;
					result.data = '新增类别成功';
					res.send(JSON.stringify(result));
				}
			}
		], 

		function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
		}
	);
}

// 编辑类别
exports.getEditType = function(req, res, next){
	// 找出类别的信息，最后返回admin-type

	async.waterfall([
			function(cb){
				admin_m.getTypeInfo(req, cb, next);
			},
			function(r, cb){
				// console.log(util.inspect({gettypeinfo : r}));

				admin_m.getWineByType(req, r, cb, next);
			},
			function(r, cb){
				// console.log(util.inspect({getwine : r[req.query.type_id].wine}));
				res.render('admin-edit-type', {
					type_id: req.query.type_id,
					type_name: r[req.query.type_id].type_name,
					wine: r[req.query.type_id].wine
				});
			}
		], 

		function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
		}
	);

	console.log(req.query.type_id);
}

// 编辑类别 post
exports.postEditType = function(req, res, next){
	var result = {};
	result.status = 1;
	result.data = '';

	// type中待删除的wine 需要 跨函数
	var del = [];

	// 根据type_id找到wine_ids_o
	// 根据wine_ids_o and wine_id, 找出增加和删除的wine_id
	// 增加的wine_type设为type_id
	// 删除的wine_type设为0
	async.waterfall([
			function(cb){

				// 根据type_id找到wine_ids_o
				admin_m.getWineByTypeEdit(req, cb, next);
			},
			function(r, cb){


				var wine_ids_o = [];
				if(r.length !== 0){
					for(var i=0, l=r.length; i<l; i++){
						var item = r[i];				
						wine_ids_o.push(item.wine_id);
					}
				}

				var wine_ids = req.body['wine_ids[]'];
				// wine_ids 元素为字符
				for(var i=0; i<wine_ids.length; i++){
					wine_ids[i] = +wine_ids[i];
				}

				// del
				for(var i=0; i<wine_ids_o.length; i++){
				    if(wine_ids.indexOf(wine_ids_o[i]) === -1){
				        del.push(wine_ids_o[i])
				    }
				}

				// add
				var add = [];
				for(var i=0; i<wine_ids.length; i++){
				    if(wine_ids_o.indexOf(wine_ids[i]) === -1){
				        add.push(wine_ids[i])
				    }
				}

				if(add.length !== 0){
					admin_m.updateWineTypeEdit(req, add, cb, next);
				}else{
					cb(null, true);
				}
				
			},
			function(r, cb){

				if(del.length !== 0){
					req.query.type_id = 0
					admin_m.updateWineTypeEdit(req, del, cb, next);
				}else{
					cb(null)
				}			

			},
			function(r, cb){

				result.status = 0;
				result.data = '编辑类别成功';
				res.send(JSON.stringify(result));
			}
		], 

		function(err, value){
			console.log('err:'+err);
			console.log('value:'+value);
		}
	);
}


