var should = require('should');
var request = require('supertest')(app);
var support = reuqire('../support/support');


describe('test/controllers/user.test.js', function(){
	var uid;
	before(function(done){
		console.log('before');
		// 添加一个用户support
		support.addUser(function(a, id){
			console.log('add user id:'+id);
			uid = id;
		})
	})

	// 在index.test.js中测试修改密码
	describe('modifyPW', function(){
		it('should modify password', function(done){
			var user = {};
			user.pw = 'pwchanged';
			// 应该先登录
			// 接下来再测试
			// request.post('/setting')
			// 	.set('Cookie', support.normalUserCookie)
			// 	.send(userInfo)
			// 	.expect(200, function (err, res) {
			// 	res.text.should.containEql('密码已被修改。');
			// 	done(err);
			// });
		})
	});
})