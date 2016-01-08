var express = require('express');
var router = express.Router();
var util = require('util');

// controllers
var login_c = require('../controllers/login');
var user_c = require('../controllers/user');
var wine_c = require('../controllers/wine');
var index_c = require('../controllers/index');
var menu_c = require('../controllers/menu');
var admin_c = require('../controllers/admin');

// 日期格式化
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

// ---------------------权限管理--------------------
// 获取验证码
router.get('/getCode', login_c.getCode);

// 登录页面
router.get('/login', login_c.login);

// 登录
router.post('/login/doLogin', login_c.doLogin); 

// 注册
router.post('/login/register', login_c.register);

// 退出
router.get('/login/logOut', login_c.logOut); 

// -------------------修改用户信息-----------------------

// 修改密码页面
router.get('/modify-pw', index_c.modify_pw);

// 密码修改
router.post('/modifyPW', user_c.modifyPW);

// 修改资料页面
router.get('/edit-1', index_c.edit_1);

router.get('/edit-2', index_c.edit_2);

router.post('/modifyInfo', user_c.modifyInfo);

// ---------------------获取页面-----------------------
router.get('/main', index_c.main);

router.get('/call', index_c.call);
// 呼叫
router.get('/addCall', index_c.addCall);

router.get('/chat', index_c.chat);

router.get('/menu', wine_c.wineList);

router.get('/order-confirm', index_c.order_confirm);

router.post('/order-confirm', menu_c.addOrder);

router.get('/profile', index_c.profile_1);

router.get('/register', index_c.register);

router.get('/scope', index_c.scope_1);

router.get('/wine-detail', index_c.wine_detail);

router.get('/my-order', index_c.my_order);

router.get('/order-detail/:id', index_c.order_detail);

// ---------------------管理端-----------------------
router.get('/admin', admin_c.admin);
router.post('/login', admin_c.login);
router.get('/checkAdminName', admin_c.checkAdminName);

router.get('/admin-info', admin_c.index);
router.get('/admin-menu', admin_c.menu);
router.get('/admin-wine', admin_c.wine);
router.post('/barRegister', admin_c.barRegister);
router.post('/workerRegister', admin_c.workerRegister);

router.post('/adminForgetPw', admin_c.adminForgetPw);

// 获取顾客点单的内容
router.get('/getPendingO', admin_c.getPendingO);
router.get('/getCompletedO', admin_c.getPendingO);
router.get('/getInvalidO', admin_c.getPendingO);

// 获取顾客呼叫的内容
router.get('/getPendingC', admin_c.getPendingC);
router.get('/getCompletedC', admin_c.getPendingC);

// 订单状态切换
router.get('/getSwitchStatus/', admin_c.getSwitchStatus);

// 新增点单和呼叫
router.get('/newOrderCall', admin_c.newOrderCall);
// 呼叫状态切换
router.get('/getSwitchStatusCall/', admin_c.getSwitchStatusCall);

// 获取顾客信息的内容
router.get('/getTodayC', admin_c.getTodayC);
router.get('/getAllC', admin_c.getTodayC);


// router.get('/getTodayCustom', admin_c.getTodayCustom);

//  测试使用
router.get('/test', function(req, res, next) {
	
	res.render('test', {
		names: ['foo', 'bar', 'baz']
	})

});

module.exports = router;












