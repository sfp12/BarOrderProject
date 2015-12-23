var should = require('should');
var app = require('../../app');
var request = require('supertest')(app);
var support = require('../support/support');
var util = require('util');
var user_m = require('../../models/user');

function randomInt(){
	return (Math.random() * 10000).toFixed(0);
}

describe('test/controllers/login.test.js', function(){

	var key = new Date().getTime() + '_' + randomInt();
	var loginname = 'sfp'+key;
	var pw = '123'

	before(function(done){

		user_m.addUser(loginname, pw, function(err, uid){
			done(err);
		});
		
	})

	describe('login in', function(){

		it('should visit login in page', function(done){
			request.get('/login')
			.expect(200, function(err, res){
				res.text.should.containEql('免费注册');
				done(err);
			})
		})

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

		it('should login in fail', function(done){
			request.post('/login/doLogin')
			.send({
				phoneNumber: loginname+1,
				pw: pw,
			})
			.end(function(err, res){
				should.not.exists(err);
				res.text.should.containEql('用户名或密码不正确，请重新输入');
				done(err);
			})
		})
	})

	describe('register', function(){
		it('register', function(done){	
			request.get('/register')
			.set('Cookie', support.normalUserCookie)
			.expect(200, function(err, res){
				res.text.should.containEql('注册');
				done(err);
			})
		})

		it('register fail code is not right', function(done){	
			request.post('/login/register')
			.set('Cookie', support.normalUserCookie)
			.send({
				validationCode : 123
			})
			.end(function(err, res){
				res.text.should.containEql('验证码不正确，请重新获取');
				done(err);
			})
		})

		it('register fail number is not mobile phone', function(done){	
			request.post('/login/register')
			.set('Cookie', support.normalUserCookie)
			.send({
				validationCode : 1234,
				phoneNumber : loginname
			})
			.end(function(err, res){
				res.text.should.containEql('你输入的手机号不合法');
				done(err);
			})
		})

		it('register fail number is exists', function(done){	
			request.post('/login/register')
			.set('Cookie', support.normalUserCookie)
			.send({
				validationCode : 1234,
				phoneNumber : 18810447927
			})
			.end(function(err, res){
				res.text.should.containEql('你输入的手机号已注册，请直接登录');
				done(err);
			})
		})

	})




})