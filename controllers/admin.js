


// 登陆页
exports.admin = function(req, res, next){
	res.render('admin');
};

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