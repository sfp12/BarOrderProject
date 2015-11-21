var express = require('express');
var router = express.Router();
var util = require('util');
var crypto = require('crypto');

var login_c = require('../controllers/login');
var user_c = require('../controllers/user');
var wine_c = require('../controllers/wine');

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
router.get('/', wine_c.wineList);


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




//  测试使用

router.get('/test', function(req, res, next) {

	
	res.render('test', {
		names: ['foo', 'bar', 'baz']
	})

});

router.get('/restricted', function(req, res, next) {
	// 会话
	if(req.session.user){
		res.render('result', {
			title: 'title',
			success: req.session.success
		})
	}else{
		console.log('error'+req.session.error);
		req.session.error = 'access denied';
		res.redirect('/login');
	}
});

router.get('/logout', function(req, res, next) {
	// 会话
	req.session.destroy(function(){
		res.redirect('/login');
	})
});

router.get('/login', function(req, res, next) {
	// 会话
	if(req.session.user){
		console.log('get login user');
		res.redirect('/restricted');
	}else if(req.session.error){
		console.log('get login error');

		res.render('test', {
			title: 'login',
			response: req.session.error
		})
	}else{
		console.log('get login');
		res.render('test', {
			title: 'login',
			response: 'get'
		})
	}	
});

router.post('/login', function(req, res, next) {

	console.log(req.body.uname);
	console.log(req.body.pw);
	// 会话
	var user = {name: req.body.uname, password:md5('test')};
	if(user.password === md5(req.body.pw)){
		console.log('post login success');
		req.session.regenerate(function(){
			req.session.user = user;
			req.session.success = 'auth as '+user.name;
			res.redirect('/restricted');
		})
	}else{
		console.log('post login fail');
		req.session.regenerate(function(){
			req.session.error = 'auth faild';
			res.redirect('/restricted');
		})
		
	}
});


module.exports = router;












