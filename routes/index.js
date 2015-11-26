var express = require('express');
var router = express.Router();
var util = require('util');
var crypto = require('crypto');

var login_c = require('../controllers/login');
var user_c = require('../controllers/user');
var wine_c = require('../controllers/wine');
var index_c = require('../controllers/index');

// function md5(text) {
// 	var str_1 = crypto.createHash('md5').update(text).digest('hex');
// 	return crypto.createHash('md5').update(str_1+'darwin').digest('hex');
// };

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



// router.use(function(req, res, next){
// 	console.log('if login?')
// 	// next();
// })

/* GET home page. */
// router.get('/', wine_c.wineList);


// ---------------------权限管理--------------------
// 获取验证码
router.get('/getCode', login_c.getCode);

// 登录页面
router.get('/login.html', login_c.login);

// 登录
router.post('/login/doLogin', login_c.doLogin); 

// 注册
router.post('/login/register', login_c.register);

// 退出
router.get('/login/logOut', login_c.logOut); 

// -------------------用户信息-----------------------
// 密码修改
router.post('/modifyPW', user_c.modifyPW);

router.post('/modifyInfo', user_c.modifyInfo);

// -------------------页面跳转-----------------------
router.get('/tochat', login_c.toPage);


// ---------------------zepto-----------------------
router.get('/main', index_c.main);
router.get('/call', index_c.call);
router.get('/chat', index_c.chat);
router.get('/edit-1', index_c.edit_1);
router.get('/edit-2', index_c.edit_2);
router.get('/login', index_c.login);
router.get('/menu', wine_c.wineList);
router.get('/modify-pw', index_c.modify_pw);
router.get('/order-confirm', index_c.order_confirm);
router.get('/profile', index_c.profile_1);
router.get('/register', index_c.register);
router.get('/scope', index_c.scope_1);
router.get('/wine-detail', index_c.wine_detail);



//  测试使用

router.get('/test', function(req, res, next) {

	
	res.render('test', {
		names: ['foo', 'bar', 'baz']
	})

});



module.exports = router;












