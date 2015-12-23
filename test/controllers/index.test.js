var should = require('should');
var app = require('../../app');
var request = require('supertest')(app);
var support = require('../support/support');
var util = require('util');
var user_m = require('../../models/user');
var menu_m = require('../../models/menu');
var async = require('async');

function randomInt(){
	return (Math.random() * 10000).toFixed(0);
}

describe('test/controllers/index.test.js', function(){

	var key = new Date().getTime() + '_' + randomInt();
	var loginname = 'sfp'+key;
	var pw = '123';
	var uid = 0;
	// add order 和 my order需要同一个user
	var add_order_user = '';


	before(function(done){

		user_m.addUser(loginname, pw, function(err, id){
			uid = id;
			done(err);
		});
		
	})

	describe('every page', function(){
		

		it('should login in success', function(done){
			request.post('/login/doLogin')
			.send({
				phoneNumber: loginname,
				pw: pw,
			})
			.expect(200, function(err, res){
				should.not.exists(err);
				JSON.parse(res.text).status.should.be.exactly(0).and.be.a.number;
				done(err);
			})
		})

		it('should visit call page', function(done){
			request.get('/call')
			.set('Cookie', support.normalUserCookie)
			.expect(200, function(err, res){
				res.text.should.containEql('呼叫');
				done(err);
			})
		});

		it('should visit chat page', function(done){
			request.get('/chat')
			.expect(200, function(err, res){
				res.text.should.containEql('聊天室');
				done(err);
			})
		});

		describe('edit 1', function(){

			it('should visit edit 1 page', function(done){
				request.get('/edit-1')
				.set('Cookie', support.normalUserCookie)
				.expect(200, function(err, res){
					res.text.should.containEql('我的小美');
					done(err);
				})
			});

			it('should mofify user info', function(done){
				request.post('/modifyInfo')
				.set('Cookie', support.normalUserCookie)
				.send({
					uid : uid,
					type : 1,
					sex : '男'
				})
				.expect(200, function(err, res){
					
					user_m.getById(uid, function(a, b){
						res.text.should.containEql('修改成功');
						b[0].user_sex.should.containEql('男');
						done(err);
					})
					
				})
			});

		})

		describe('edit 2', function(){

			it('should visit edit 2 page', function(done){
				request.get('/edit-2')
				.set('Cookie', support.normalUserCookie)
				.expect(200, function(err, res){
					res.text.should.containEql('年龄');
					done(err);
				})
			});

			it('should mofify user info', function(done){
				request.post('/modifyInfo')
				.set('Cookie', support.normalUserCookie)
				.send({
					uid : uid,
					type : 2,
					age : '27'
				})
				.expect(200, function(err, res){
					
					user_m.getById(uid, function(a, b){
						res.text.should.containEql('修改成功');
						b[0].user_age.should.be.exactly(27).and.be.a.number;
						done(err);
					})
					
				})
			});

		})

		it('should visit main page', function(done){
			request.get('/main')
			.expect(200, function(err, res){
				res.text.should.containEql('小美');
				done(err);
			})
		});

		describe('modify pw', function(){

			it('should visit modify pw page', function(done){
				request.get('/modify-pw')
				.set('Cookie', support.normalUserCookie)
				.expect(200, function(err, res){
					res.text.should.containEql('密码重置');
					done(err);
				})
			});

			it('should mofify pw', function(done){
				request.post('/modifyPW')
				.set('Cookie', support.normalUserCookie)
				.send({
					uid : uid,
					pw : pw+'new'
				})
				.expect(200, function(err, res){
					
					user_m.getById(uid, function(a, b){
						res.text.should.containEql('密码重置成功');
						// b[0].user_age.should.be.exactly(27).and.be.a.number;
						done(err);
					})
					
				})
			});

		})

		
		describe('order confirm', function(){

			it('should visit order confirm page', function(done){
				request.get('/order-confirm')
				.expect(200, function(err, res){
					res.text.should.containEql('订单确认');
					// if(err) throw err;
					done(err);
				})
			});

			it('should confirm order', function(done){
				request.post('/order-confirm')
				.set('Cookie', support.normalUserCookie)
				.send({
					// uid : uid,
					cart : '[{"wine_name":"套餐1","wine_price":20,"wine_num":"1","wine_id":"2"}]'
				})
				.expect(200, function(err, res){
					
					res.text.should.containEql('添加成功');
					done(err);
					
				})
			});

			it('should visit my order page', function(done){
				request.get('/my-order')
				.set('Cookie', support.normalUserCookie)
				.expect(200, function(err, res){
					res.text.should.containEql('我的订单');
					done(err);
				})
			});

			it('should visit order detail page', function(done){

				async.waterfall([
						function(cb){
							menu_m.getByUserId(support.normalUser.user_id, cb);
						},
						function(r, cb){
							request.get('/order-detail/'+r)
							.set('Cookie', support.normalUserCookie)
							.expect(200, function(err, res){
								res.text.should.containEql('订单详情');
								done(err);
							})
						}
					], function(err, value){
							console.log('err:'+err);
							console.log('value:'+value);
						})
				
			});

		})

		it('should visit profile page', function(done){
			request.get('/profile')
			.set('Cookie', support.normalUserCookie)
			.expect(200, function(err, res){
				res.text.should.containEql('我的小美');
				done(err);
			})
		});

		
		it('should visit scope page', function(done){
			request.get('/scope')
			.set('Cookie', support.normalUserCookie)
			.expect(200, function(err, res){
				res.text.should.containEql('小美');
				done(err);
			})
		});

		
		it('should visit wine detail page', function(done){
			request.get('/wine-detail?wine_id=2&num=1')
			.set('Cookie', support.normalUserCookie)
			.expect(200, function(err, res){
				res.text.should.containEql('酒品详情');
				done(err);
			})
		});

		


	})

})
