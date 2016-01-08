jQuery(function($){

	var admin = {};
	// 检查之前的input是否为空
	admin.register_input = [
		'admin-name',
		'admin-real-name',
		'bar-name',
		'phone-number',
		'code',
		'admin-pw',
		'repeat-pw'
		];
	admin.register_obj = {
		admin_name: '用户名',
		admin_real_name: '真实姓名',
		bar_name: '所属酒吧',
		phone_number: '手机号码',
		code: '验证码',
		admin_pw: '密码',
		repeat_pw: '确认密码'
	}

	admin.bar_register_input = [
		'apply-real-name',
		'admin-name',
		'bar-name',
		'bar-address',
		'phone-number',
		'code',
		'admin-pw',
		'repeat-pw'
		];
	admin.bar_register_obj = {
		apply_real_name: '真实姓名',
		admin_name: '用户名',
		bar_name: '酒吧名称',
		bar_address: '酒吧地址',
		phone_number: '手机号码',
		code: '验证码',
		admin_pw: '密码',
		repeat_pw: '确认密码'
	}

	cookie.set('bar_id', 1);
	admin.bar_id = cookie.get('bar_id');
	admin.page_size = 10;

	/*
	* 登录页 开始
	*/
	$('#register').on('click', function(){
		$('#login-d').hide();
		$('#register-d').show();
	})

	$('#bar-register').on('click', function(){
		$('#login-d').hide();
		$('#bar-register-d').show();
	})

	$('#forget-pw').on('click', function(){
		$('#login-d').hide();
		$('#forget-pw-d').show();
	})

	// 管理员登录
	$('#login-d input[name=submit]').on('click', function(e){

		var login_d = $('#login-d');
		var admin_name = login_d.find('input[name=admin-name]').val();
		var admin_pw = login_d.find('input[name=admin-pw]').val();

		// 判断条件
		if(admin_pw === '' && admin_name === ''){
			$('#login-d p span').text('请输入用户名和密码！');
			return false;
		}
		
		if(admin_name === ''){
			$('#login-d p span').text('请输入用户名！');
			return false;
		}
		
		if(admin_pw === ''){
			$('#login-d p span').text('请输入密码！');
			return false;
		}
		// 判断成功		

		var argu = {};
		argu.admin_name = admin_name;
		argu.admin_pw = admin_pw;

		$.post('/login', argu, function(data){
			data = JSON.parse(data);

			if(data.status === 0){
				console.log('admin login success');
				window.location.href = '/admin-info';
			}else{
				console.log('admin login fail');
				$('#login-d p span').text(data.data);
			}
		})
	})	

	// 申请注册页
	$('#register-d input[name=submit]').on('click', function(){

		// 判断 ok 都显示
		var $oks = $('#register-d span.glyphicon-ok'); 
		for(var i=0,l=$oks.length; i<l; i++){
			var $ok = $($oks[i]);
			if($ok.css('display') === 'none'){
				$('#two-btn-m .modal-body p').text('您填写的信息不全或有误');
				$('#two-btn-m').modal('show');
				return false;
			}
		}

		var bar_register_d = $('#register-d');

		var argu = {};
		argu.admin_name = bar_register_d.find('input[name=admin-name]').val();
		argu.admin_real_name = bar_register_d.find('input[name=admin-real-name]').val();
		argu.bar_name = bar_register_d.find('input[name=bar-name]').val();

		argu.admin_role = +$('#role-r').val();
		argu.phone_number = bar_register_d.find('input[name=phone-number]').val();
		argu['code'] = bar_register_d.find('input[name=code]').val();
		argu.admin_pw = bar_register_d.find('input[name=admin-pw]').val();
		argu.repeat_pw = bar_register_d.find('input[name=repeat-pw]').val();
		

		$.post('/workerRegister', argu, function(data){
			data = JSON.parse(data);

			if(data.status === 0){
				window.location.href='/admin-info';
			}else{
				$('#two-btn-m .modal-body p').text('提交失败，请再次尝试');
				$('#two-btn-m').modal('show');
			}
			
		})
	})

	// 检查之前的input，是否为空
	admin.beforeNull = function(type, input){
		var a = [];
		var o = {};
		var con = {};

		if(type === 'register'){
			a = admin.register_input;
			o = admin.register_obj;
			$con = $('#register-d');
		}else{
			a = admin.bar_register_input;
			o = admin.bar_register_obj;
			$con = $('#bar-register-d');
		}

		for(var i=0,l=a.length; i<l; i++){
			if(a[i] === input){
				break;
			}

			var $input = $con.find('input[name='+a[i]+']');
			var value = $input.val();

			if(value === ''){

				// 防止重复添加<p>
				if($input.parent().find('p').length !== 0){
					$input.parent().find('p').text('请输入'+o[a[i].split('-').join('_')]);
					continue;
				}else{
					$input.after('<p>请输入'+o[a[i].split('-').join('_')]+'</p>');
				}

			}
		}
	}

	// 申请注册页 input 事件集合，便于整理
	admin.register_input_event = function(){	

		// 用户名
		$('#register-d input[name=admin-name]').on('blur', function(){
			var $admin_name = $('#register-d input[name=admin-name]');
			var pat = new RegExp('^[a-zA-Z0-9\u4e00-\u9fa5]+$');
			var admin_name = $admin_name.val();

			var result = pat.test(admin_name);

			if(!result){
				$admin_name.val('');
				// 防止重复添加<p>
				if($admin_name.parent().find('p').length !== 0){
					$admin_name.parent().find('p').text('用户名只能由数字、字母和汉字构成哦');
					return false;
				}else{
					$admin_name.after('<p>用户名只能由数字、字母和汉字构成哦</p>');
				}
				
			}else{
				$admin_name.next().text('');
				// 判断是否已注册
				var argu = {};
				argu.admin_name = admin_name;
				$.get('/checkAdminName', argu, function(data){
					data = JSON.parse(data);

					if(data.status === 0){
						$admin_name.parent().find('span').show();
					}else{
						$admin_name.val('');
						// 防止重复添加<p>
						if($admin_name.parent().find('p').length !== 0){
							$admin_name.parent().find('p').text('用户名只能由数字、字母和汉字构成哦');
							return false;
						}else{
							$admin_name.after('<p>用户名只能由数字、字母和汉字构成哦</p>');
						}
						$admin_name.parent().find('span').hide();
					}
				});
			}
		});

		

		// 真实姓名
		$('#register-d input[name=admin-real-name]').on('click', function(){
			admin.beforeNull('register', 'admin-real-name');
		})

		$('#register-d input[name=admin-real-name]').on('blur', function(){

			var $admin_real_name = $('#register-d input[name=admin-real-name]');
			var admin_real_name = $admin_real_name.val();

			if(admin_real_name === ''){

				$admin_real_name.parent().find('span').hide();

				// 防止重复添加<p>
				if($admin_real_name.parent().find('p').length !== 0){
					$admin_real_name.parent().find('p').text('请输入真实姓名');
					return false;
				}else{
					$admin_real_name.after('<p>请输入真实姓名</p>');
				}
				
			}else{

				$admin_real_name.next().text('');
				$admin_real_name.parent().find('span').show();

			}
			
		})

		// 所属酒吧
		$('#register-d input[name=bar-name]').on('click', function(){
			admin.beforeNull('register', 'bar-name');
		})

		$('#register-d input[name=bar-name]').on('blur', function(){

			var $bar_name = $('#register-d input[name=bar-name]');
			var bar_name = $bar_name.val();

			if(bar_name === ''){

				$bar_name.parent().find('span').hide();

				// 防止重复添加<p>
				if($bar_name.parent().find('p').length !== 0){
					$bar_name.parent().find('p').text('请输入所属酒吧');
					return false;
				}else{
					$bar_name.after('<p>请输入所属酒吧</p>');
				}
				
			}else{

				$bar_name.next().text('');
				$bar_name.parent().find('span').show();

			}
			
		})

		// 手机号码
		$('#register-d input[name=phone-number]').on('blur', function(){
			admin.beforeNull('register', 'phone-number');
		});

		$('#register-d input[name=phone-number]').on('blur', function(){
			var $phone_number = $('#register-d input[name=phone-number]')
			var phone_number = $phone_number.val();
			var r = validator.isMobilePhone(phone_number, 'zh-CN');
			var $get_code = $('#register-d input[name=get-code]');
			if(r){
				$phone_number.parent().find('span').show();
				$phone_number.next().text('');
				$('#register-d input[name=get-code]').removeAttr('disabled');
			}else{
				// 防止重复添加<p>
				if($phone_number.parent().find('p').length !== 0){
					$phone_number.parent().find('p').text('请输入正确的手机号码');
					return false;
				}else{
					$phone_number.after('<p>请输入正确的手机号码</p>');
				}
				$('#register-d input[name=get-code]').attr('disabled', 'disabled');
				$phone_number.parent().find('span').hide();
			}
		});

		// 密码
		$('#register-d input[name=admin-pw]').on('blur', function(){
			admin.beforeNull('register', 'admin-pw');
		});

		$('#register-d input[name=admin-pw]').on('blur', function(){
			var $admin_pw = $('#register-d input[name=admin-pw]')
			var admin_pw = $admin_pw.val();
			var r = validator.isLength(admin_pw, 6);
			if(r){
				$admin_pw.parent().find('span').show();
				$admin_pw.next().text('');
			}else{
				// 防止重复添加<p>
				if($admin_pw.parent().find('p').length !== 0){
					$admin_pw.parent().find('p').text('请输入6-20位字符');
					return false;
				}else{
					$admin_pw.after('<p>请输入6-20位字符</p>');
				}
				$admin_pw.parent().find('span').hide();
			}
		});

		// 确认密码
		$('#register-d input[name=repeat-pw]').on('blur', function(){
			admin.beforeNull('register', 'repeat-pw');
		});

		$('#register-d input[name=repeat-pw]').on('blur', function(){
			var $repeat_pw = $('#register-d input[name=repeat-pw]');
			var $admin_pw = $('#register-d input[name=admin-pw]')
			var repeat_pw = $repeat_pw.val();
			var admin_pw = $admin_pw.val();
			if(admin_pw === repeat_pw){
				$repeat_pw.parent().find('span').show();
				$repeat_pw.next().text('');
			}else{
				// 防止重复添加<p>
				if($repeat_pw.parent().find('p').length !== 0){
					$repeat_pw.parent().find('p').text('两次输入的密码不一致');
					return false;
				}else{
					$repeat_pw.after('<p>两次输入的密码不一致</p>');
				}
				$repeat_pw.parent().find('span').hide();
			}
		});

	};

	admin.register_input_event();


	// 酒吧申请注册页
	$('#bar-register-d input[name=submit]').on('click', function(){

		// 判断 ok 都显示
		var $oks = $('#bar-register-d span.glyphicon-ok'); 
		for(var i=0,l=$oks.length; i<l; i++){
			var $ok = $($oks[i]);
			if($ok.css('display') === 'none'){
				$('#two-btn-m .modal-body p').text('您填写的信息不全或有误');
				$('#two-btn-m').modal('show');
				return false;
			}
		}

		var bar_register_d = $('#bar-register-d');

		var argu = {};
		argu.apply_real_name = bar_register_d.find('input[name=apply-real-name]').val();
		argu.admin_name = bar_register_d.find('input[name=admin-name]').val();
		argu.bar_name = bar_register_d.find('input[name=bar-name]').val();
		argu.bar_address = bar_register_d.find('input[name=bar-address]').val();
		argu.phone_number = bar_register_d.find('input[name=phone-number]').val();
		argu['code'] = bar_register_d.find('input[name=code]').val();
		argu.admin_pw = bar_register_d.find('input[name=admin-pw]').val();
		argu.repeat_pw = bar_register_d.find('input[name=repeat-pw]').val();
		argu.admin_role = 1;

		$.post('/barRegister', argu, function(data){
			data = JSON.parse(data);

			if(data.status === 0){
				window.location.href='/admin-info';
			}else{
				$('#two-btn-m .modal-body p').text('提交失败，请再次尝试');
				$('#two-btn-m').modal('show');
			}
			
		})
	})

	// 酒吧申请注册页 input 事件集合，便于整理
	admin.bar_register_input_event = function(){

		// 申请人真实姓名
		$('#bar-register-d input[name=apply-real-name]').on('blur', function(){

			var $apply_real_name = $('#bar-register-d input[name=apply-real-name]');
			var apply_real_name = $apply_real_name.val();

			if(apply_real_name === ''){

				$apply_real_name.parent().find('span').hide();

				// 防止重复添加<p>
				if($apply_real_name.parent().find('p').length !== 0){
					$apply_real_name.parent().find('p').text('请输入真实姓名');
					return false;
				}else{
					$apply_real_name.after('<p>请输入真实姓名</p>');
				}
				
			}else{

				$apply_real_name.next().text('');
				$apply_real_name.parent().find('span').show();

			}
			
		})		

		// 用户名
		$('#bar-register-d input[name=admin-name]').on('click', function(){
			admin.beforeNull('bar-register', 'admin-name');
		})

		$('#bar-register-d input[name=admin-name]').on('blur', function(){
			var $admin_name = $('#bar-register-d input[name=admin-name]');
			var pat = new RegExp('^[a-zA-Z0-9\u4e00-\u9fa5]+$');
			var admin_name = $admin_name.val();

			var result = pat.test(admin_name);

			if(!result){
				$admin_name.val('');
				// 防止重复添加<p>
				if($admin_name.parent().find('p').length !== 0){
					$admin_name.parent().find('p').text('用户名只能由数字、字母和汉字构成哦');
					return false;
				}else{
					$admin_name.after('<p>用户名只能由数字、字母和汉字构成哦</p>');
				}
			}else{
				$admin_name.next().text('');
				// 判断是否已注册
				var argu = {};
				argu.admin_name = admin_name;
				$.get('/checkAdminName', argu, function(data){
					data = JSON.parse(data);

					if(data.status === 0){
						$admin_name.parent().find('span').show();
					}else{
						$admin_name.val('');
						// 防止重复添加<p>
						if($admin_name.parent().find('p').length !== 0){
							$admin_name.parent().find('p').text('用户名只能由数字、字母和汉字构成哦');
							return false;
						}else{
							$admin_name.after('<p>用户名只能由数字、字母和汉字构成哦</p>');
						}
						$admin_name.parent().find('span').hide();
					}
				});
			}
		});		

		// 酒吧名称
		$('#bar-register-d input[name=bar-name]').on('click', function(){
			admin.beforeNull('bar-register', 'bar-name');
		})

		$('#bar-register-d input[name=bar-name]').on('blur', function(){

			var $bar_name = $('#bar-register-d input[name=bar-name]');
			var bar_name = $bar_name.val();

			if(bar_name === ''){

				$bar_name.parent().find('span').hide();

				// 防止重复添加<p>
				if($bar_name.parent().find('p').length !== 0){
					$bar_name.parent().find('p').text('请输入酒吧名称');
					return false;
				}else{
					$bar_name.after('<p>请输入酒吧名称</p>');
				}
				
			}else{

				$bar_name.next().text('');
				$bar_name.parent().find('span').show();

			}
			
		})

		// 酒吧地址
		$('#bar-register-d input[name=bar-address]').on('click', function(){
			admin.beforeNull('bar-register', 'bar-address');
		})

		$('#bar-register-d input[name=bar-address]').on('blur', function(){

			var $bar_address = $('#bar-register-d input[name=bar-address]');
			var bar_address = $bar_address.val();

			if(bar_address === ''){

				$bar_address.parent().find('span').hide();

				// 防止重复添加<p>
				if($bar_address.parent().find('p').length !== 0){
					$bar_address.parent().find('p').text('请输入酒吧地址');
					return false;
				}else{
					$bar_address.after('<p>请输入酒吧地址</p>');
				}
				
			}else{

				$bar_address.next().text('');
				$bar_address.parent().find('span').show();

			}
			
		})

		// 手机号码
		$('#bar-register-d input[name=phone-number]').on('blur', function(){
			admin.beforeNull('bar-register', 'phone-number');
		});

		$('#bar-register-d input[name=phone-number]').on('blur', function(){
			var $phone_number = $('#bar-register-d input[name=phone-number]')
			var phone_number = $phone_number.val();
			var r = validator.isMobilePhone(phone_number, 'zh-CN');
			var $get_code = $('#bar-register-d input[name=get-code]');
			if(r){
				$phone_number.parent().find('span').show();
				$phone_number.next().text('');
				$('#bar-register-d input[name=get-code]').removeAttr('disabled');
			}else{
				// 防止重复添加<p>
				if($phone_number.parent().find('p').length !== 0){
					$phone_number.parent().find('p').text('请输入正确的手机号码');
					return false;
				}else{
					$phone_number.after('<p>请输入正确的手机号码</p>');
				}
				$('#bar-register-d input[name=get-code]').attr('disabled', 'disabled');
				$phone_number.parent().find('span').hide();
			}
		});

		// 密码
		$('#bar-register-d input[name=admin-pw]').on('blur', function(){
			admin.beforeNull('bar-register', 'admin-pw');
		});

		$('#bar-register-d input[name=admin-pw]').on('blur', function(){
			var $admin_pw = $('#bar-register-d input[name=admin-pw]')
			var admin_pw = $admin_pw.val();
			var r = validator.isLength(admin_pw, 6);
			if(r){
				$admin_pw.parent().find('span').show();
				$admin_pw.next().text('');
			}else{
				// 防止重复添加<p>
				if($admin_pw.parent().find('p').length !== 0){
					$admin_pw.parent().find('p').text('请输入6-20位字符');
					return false;
				}else{
					$admin_pw.after('<p>请输入6-20位字符</p>');
				}
				$admin_pw.parent().find('span').hide();
			}
		});

		// 确认密码
		$('#bar-register-d input[name=repeat-pw]').on('blur', function(){
			admin.beforeNull('bar-register', 'repeat-pw');
		});

		$('#bar-register-d input[name=repeat-pw]').on('blur', function(){
			var $repeat_pw = $('#bar-register-d input[name=repeat-pw]');
			var $admin_pw = $('#bar-register-d input[name=admin-pw]')
			var repeat_pw = $repeat_pw.val();
			var admin_pw = $admin_pw.val();
			if(admin_pw === repeat_pw){
				$repeat_pw.parent().find('span').show();
				$repeat_pw.next().text('');
			}else{
				// 防止重复添加<p>
				if($repeat_pw.parent().find('p').length !== 0){
					$repeat_pw.parent().find('p').text('两次输入的密码不一致');
					return false;
				}else{
					$repeat_pw.after('<p>两次输入的密码不一致</p>');
				}
				$repeat_pw.parent().find('span').hide();
			}
		});

	};

	admin.bar_register_input_event();

	// 忘记密码页
	$('#forget-pw-d input[name=submit]').on('click', function(e){

		var forget_pw_d = $('#forget-pw-d');
		var $admin_name = forget_pw_d.find('input[name=admin-name]');
		var admin_name = $admin_name.val();
		var admin_pw = forget_pw_d.find('input[name=admin-pw]').val();
		var code = forget_pw_d.find('input[name=code]').val();

		// 判断条件
		if(admin_pw === '' || admin_name === '' || code === ''){
			$('#two-btn-m modal-body p').text('请将信息填写完整再提交');
			$('#two-btn-m').modal('show');
			return false;
		}		
		
		// 判断是否已注册
		var argu = {};
		argu.admin_name = admin_name;
		$.get('/checkAdminName', argu, function(data){
			data = JSON.parse(data);

			if(data.status === 0){				
				$admin_name.val('');
				// 防止重复添加<p>
				if($admin_name.parent().find('p').length !== 0){
					$admin_name.parent().find('p').text('用户名不存在');
					return false;
				}else{
					$admin_name.after('<p>用户名不存在</p>');
				}
				$admin_name.parent().find('span').hide();
				return false;
			}else{
				$admin_name.parent().find('p').text('');
				$admin_name.parent().find('span').show();				
			}
		});

		// 手机号码 是否 符合格式
		var $phone_number = $('#forget-pw-d input[name=phone-number]')
		var phone_number = $phone_number.val();
		var r = validator.isMobilePhone(phone_number, 'zh-CN');
		var $get_code = $('#forget-pw-d input[name=get-code]');
		if(r){
			$phone_number.parent().find('span').show();
			$phone_number.next().text('');
			$('#forget-pw-d input[name=get-code]').removeAttr('disabled');
		}else{
			// 防止重复添加<p>
			if($phone_number.parent().find('p').length !== 0){
				$phone_number.parent().find('p').text('请输入正确的手机号码');
				return false;
			}else{
				$phone_number.after('<p>请输入正确的手机号码</p>');
			}
			$('#forget-pw-d input[name=get-code]').attr('disabled', 'disabled');
			$phone_number.parent().find('span').hide();
			return false;
		}

		// 验证码的格式先不判断


		// 判断成功		

		var argu = {};
		argu.admin_name = admin_name;
		argu.admin_pw = admin_pw;
		argu['code'] = code;

		$.post('/adminForgetPw', argu, function(data){
			data = JSON.parse(data);

			if(data.status === 0){
				console.log('admin forget pw success');
				window.location.href = '/admin-info';
			}else{
				console.log('admin forget pw fail');
			}
		})
	})

	//----------------------登录页 结束--------------------------------

	/*
	* table switch page
	*/
	// 添加data page
	admin.addDataPage = function($page_con, current_page, last_page){
		// 上一页
  		$page_con.find('.prev-page').data('page', current_page-1);
  		if(last_page === 1){
  			$page_con.hide();
  			return false;
  		}
  		if(current_page-1 === 0){
  			// 当前为首页，首页和上一页变灰；
  			$page_con.find('.prev-page').attr('disabled', true);
  			$page_con.find('.first-page').attr('disabled', true);
  		}else{
  			// 当前为首页，首页和上一页正常；
  			$page_con.find('.prev-page').attr('disabled', false);
  			$page_con.find('.first-page').attr('disabled', false);
  		}
		// 下一页		  		
  		$page_con.find('.next-page').data('page', current_page+1);
  		if(current_page === last_page){
  			// 当前为末页，末页和下一页变灰；
  			$page_con.find('.next-page').attr('disabled', true);
  			$page_con.find('.last-page').attr('disabled', true);
  		}else{
  			// 当前为末页，末页和下一页正常；
  			$page_con.find('.next-page').attr('disabled', false);
  			$page_con.find('.last-page').attr('disabled', false);
  		}
  		// 末页
  		$page_con.find('.last-page').data('page', last_page);
	}

	// 把分页按钮data_info 转为方法名
	admin.convertMethod = function(str){
		var result = '';

		var a = str.split('-');
		result = a[0];
		result += a[1].toUpperCase();

		return result;
	}

	// 分页按钮事件
	admin.switchPage = function(e){
		var page = $(e.target).data('page');
		var data_info = $(e.target).data('info');

		if(data_info === 'pending-o'){

			admin[admin.convertMethod(data_info)](page);
		}else if(data_info === 'completed-o'){

			var start_time = $('#'+page+' input[name=start-time]').val();
			var end_time = $('#'+page+' input[name=end-time]').val();
			var key = $('#'+page+' input[name=key]').val();

			admin[admin.convertMethod(data_info)](page, start_time, end_time, key);
		}else if(data_info === 'invalid-o'){

			var start_time = $('#'+page+' input[name=start-time]').val();
			var end_time = $('#'+page+' input[name=end-time]').val();
			var key = $('#'+page+' input[name=key]').val();

			admin[admin.convertMethod(data_info)](page, start_time, end_time, key);
		}else if(data_info === 'pending-c'){

			admin[admin.convertMethod(data_info)](page);
		}else if(data_info === 'completed-c'){

			admin[admin.convertMethod(data_info)](page);
		}else if(data_info === 'today-c'){

			var start_time = $('#'+page+' input[name=start-time]').val();
			var end_time = $('#'+page+' input[name=end-time]').val();

			admin[admin.convertMethod(data_info)](page, start_time, end_time);
		}
		else if(data_info === 'all-c'){

			var start_time = $('#'+page+' input[name=start-time]').val();
			var end_time = $('#'+page+' input[name=end-time]').val();

			admin[admin.convertMethod(data_info)](page, start_time, end_time);
		}
		else{

			console.log('switch page data info error');
		}		

	};

	// 给分页按钮添加事件
	$('.first-page').on('click', function(e){

		admin.switchPage(e);
	})

	$('.prev-page').on('click', function(e){
		
		admin.switchPage(e);
	})

	$('.next-page').on('click', function(e){
		
		admin.switchPage(e);
	})

	$('.last-page').on('click', function(e){
		
		admin.switchPage(e);
	})

	$('.page-to').on('click', function(e){
		var page = $(e.target).prev().val();

		if(!validator.isNumeric(page)){
			$('#one-btn-m .modal-body p').text('请输入数字');
			$('#one-btn-m').modal('show');
			return false;
		}

		var last_page = $(e.target).prev().prev().data('page');
		if(page > last_page || page < 1){
			$('#one-btn-m .modal-body p').text('您要跳转的页面不存在');
			$('#one-btn-m').modal('show');
			return false;
		}

		admin.switchPage(e);
	})

	/*
	* 顾客点单 获取数据
	*/
	// 顾客点单
	admin.orderC = function(argu){
		var data = {};
  		data.page = argu.page;
  		data.bar_id = argu.bar_id;
  		data.statu = argu.statu;

  		if(argu.start_time){
  			data.start_time = argu.start_time;
	  		data.end_time = argu.end_time;
	  		data.key = argu.key;
  		}

  		$.get(argu.url, data, function(data){
	  		data = JSON.parse(data);
	  		var last_page = Math.ceil(data.num/10);

	  		if(data.status === 0){
	  			data = data.data;
	  			var str = '';
		  		for(key in data){	  		
		  			str += '<tr>';
	  				str += '<td>'+data[key].day+'</td>';
	  				str += '<td>'+data[key].time+'</td>';
	  				str += '<td>'+data[key].menu_number+'</td>';
	  				str += '<td>'+data[key].table_id+'</td>';
	  				str += '<td>'+data[key].phone_number+'</td>';

	  				// 单点内容
	  				var wine_info = ''
	  				for(wine in data[key].wine){
	  					wine_info += '<span class="wine-name">'+data[key].wine[wine].name+'</span><span class="wine-num">×'+data[key].wine[wine].num+'</span>';
	  					wine_info += '</br>';
	  				}
	  				str += '<td>'+wine_info+'</td>';

	  				str += '<td>'+data[key].spend+'</td>';
	  				str = argu.cb(str, key);
		  			str += '</tr>';
		  		}

		  		$(argu.selector+' table tbody').html(str);

		  		// 根据data.num 来确定末页。
		  		var $page_con = $(argu.selector+' .page-con');
		  		admin.addDataPage($page_con, argu.page, last_page);

		  		admin.switchStatus();
	  		}else{
	  			console.log(data.data);
	  		}

	  		
	  	})
	}

	// 待处理订单
	admin.pendingO = function(page){
		// 已完成的订单
  		var argu = {};
  		argu.page = page;
  		argu.bar_id = cookie.get('bar_id');
  		argu.statu = 1;

  		argu.url = '/getPendingO';
  		argu.selector = '#pending-o';
  		argu.cb = function(str, key){
  			str += '<td><a href="javascript:void(0);" class="to-completed-o" data-id="'+key+'">完成</a><a href="javascript:void(0);" class="to-invalid-o" data-id="'+key+'">撤单</a></td>';
  			return str;
  		};

  		admin.orderC(argu);
	}

	// 已完成订单
	admin.completedO = function(page, start_time, end_time, key){
		// 已完成的订单
  		var argu = {};
  		argu.page = page;
  		argu.bar_id = cookie.get('bar_id');
  		argu.statu = 2;

  		if(start_time){
  			argu.start_time = start_time;
	  		argu.end_time = end_time;
	  		argu.key = key;
  		}

  		argu.url = '/getCompletedO';
  		argu.selector = '#completed-o';
  		argu.cb = function(str, key){
  			return str;
  		};

  		admin.orderC(argu);
	}

	// 失效订单
	admin.invalidO = function(page, start_time, end_time, key){
		// 失效订单
  		var argu = {};
  		argu.page = 1;
  		argu.bar_id = cookie.get('bar_id');
  		argu.statu = 3;

  		if(start_time){
  			argu.start_time = start_time;
	  		argu.end_time = end_time;
	  		argu.key = key;
  		}

  		argu.url = '/getInvalidO';
  		argu.selector = '#invalid-o';
  		argu.cb = function(str, key){
  			str += '<td><a href="javascript:void(0);" class="to-pending-o" data-id="'+key+'">恢复</a></td>';
  			return str;
  		};

  		admin.orderC(argu);
	}

	/*
	* 顾客点单 tab show 获取数据
	*/
	$('a[data-toggle=tab][href=#order-c]').on('shown.bs.tab', function (e) {
		// 切换到顾客点单界面 一级

		// 找到 active tab 二级		
	  	var $order_c = $('#order-c');
	  	var active_info = $order_c.find('li.active').data('info');

	  	if(active_info === 'pending-o'){

	  		admin.pendingO(1);
	  	}else if(active_info === 'completed-o'){
	  		
	  		admin.completedO(1);
	  	}else if(active_info === 'invalid-o'){
	  		
	  		admin.invalidO(1);
	  	}else{
	  		console.log('order-c active info error');
	  	}

	});

	// 待处理订单
	$('a[data-toggle=tab][href=#pending-o]').on('shown.bs.tab', function (e) {

		admin.pendingO(1);
		
	});

	// 已完成订单
	$('a[data-toggle=tab][href=#completed-o]').on('shown.bs.tab', function (e) {

		admin.completedO(1);
	});

	//	已完成订单 搜索
	$('#completed-o input[name=search]').on('click', function(e){
		var $completed_o = $('#completed-o');
		var start_time = $completed_o.find('input[name=start-time]').val();
		var end_time = $completed_o.find('input[name=end-time]').val();
		var key = $completed_o.find('input[name=key]').val();

		admin.completedO(1, start_time, end_time, key);
	})

	// 失效订单
	$('a[data-toggle=tab][href=#invalid-o]').on('shown.bs.tab', function (e) {

		admin.invalidO(1);
	});

	//	已完成订单 搜索
	$('#invalid-o input[name=search]').on('click', function(e){
		var $invalid_o = $('#invalid-o');
		var start_time = $invalid_o.find('input[name=start-time]').val();
		var end_time = $invalid_o.find('input[name=end-time]').val();
		var key = $invalid_o.find('input[name=key]').val();

		admin.invalidO(1, start_time, end_time, key);
	})

	/*
	* 切换状态 order
	*/
	admin.getSwitchStatus = function(menu_id, to){
		$.get('/getSwitchStatus', {
			menu_id: menu_id,
			to: to
		}, function(data){
			data = JSON.parse(data);

			if(data.status === 0){
				// console.log('switch success');
			}else{
				console.log('switch fali');

			}
		})
	}

	admin.switchStatus = function(){
		// 撤单
		$('#pending-o .to-invalid-o').on('click', function(e){
			var menu_id = $(e.target).data('id');
			var to = 3;

			admin.getSwitchStatus(menu_id, to);
		})

		// 完成
		$('#pending-o .to-completed-o').on('click', function(e){
			var menu_id = $(e.target).data('id');
			var to = 2;

			admin.getSwitchStatus(menu_id, to);
		})

		// 恢复
		$('#invalid-o .to-pending-o').on('click', function(e){
			var menu_id = $(e.target).data('id');
			var to = 1;

			admin.getSwitchStatus(menu_id, to);
		})
	}

	/*
	* 新增点单和呼叫
	*/ 
	admin.newOrderCall = function(bar_id){
		$.get('/newOrderCall', {
			bar_id: bar_id
		}, function(data){
			data = JSON.parse(data);

			if(data.status === 0){
				var $new_order_num = $('.new-order-num');
				$new_order_num.find('span').text(data.data.num_order);
				var $new_call_num = $('.new-call-num');
				$new_call_num.find('span').text(data.data.num_call);

			}else{
				console.log('newOrderCall fail');

			}
		})
	}

	admin.newOrderCall(admin.bar_id);

	// 每隔1分钟，刷新一次新增点单和呼叫的数目
	// admin.intervalNewNum = setInterval(function(){
	// 	admin.newOrderCall(admin.bar_id);
	// }, 1000*10);

	// admin.intervalNewNum();	

	// 方法调用
	$('a[data-toggle=tab][href=#order-c]').tab('show');

	/*
	* 顾客呼叫
	*/
	admin.callC = function(argu){
		var data = {};
  		data.page = argu.page;
  		data.bar_id = argu.bar_id;
  		data.statu = argu.statu;

  		$.get(argu.url, data, function(data){
	  		data = JSON.parse(data);
	  		var last_page = Math.ceil(data.num/10);

	  		if(data.status === 0){
	  			data = data.data;
	  			var str = '';
		  		for(key in data){	  		
		  			str += '<tr>';
	  				str += '<td>'+data[key].day+'</td>';
	  				str += '<td>'+data[key].time+'</td>';
	  				str += '<td>'+data[key].call_type+'</td>';
	  				str += '<td>'+data[key].table_id+'</td>';
	  				str += '<td>'+data[key].phone_number+'</td>';

	  				str += '<td>'+data[key].call_times+'</td>';
	  				// 操作
	  				str = argu.cb(str, key);
		  			str += '</tr>';
		  		}

		  		$(argu.selector+' table tbody').html(str);

		  		// 根据data.num 来确定末页。
		  		var $page_con = $(argu.selector+' .page-con');
		  		admin.addDataPage($page_con, argu.page, last_page);

		  		admin.switchStatusCall();
	  		}else{
	  			console.log(data.data);
	  		}
	  		
	  	})
	}

	/*
	* 切换状态 call
	*/
	admin.switchStatusCall = function(){
		
		// 完成
		$('#pending-c .to-completed-c').on('click', function(e){
			var call_id = $(e.target).data('id');
			var to = 2;

			$.get('/getSwitchStatusCall', {
				call_id: call_id,
				to: to
			}, function(data){
				data = JSON.parse(data);

				if(data.status === 0){
					// console.log('switch success');
				}else{
					console.log('switch fail');

				}
			})
		})
		
	}

	// 待处理呼叫
	admin.pendingC = function(page){
		// 已完成的订单
  		var argu = {};
  		argu.page = page;
  		argu.bar_id = cookie.get('bar_id');
  		argu.statu = 1;

  		argu.url = '/getPendingC';
  		argu.selector = '#pending-c';
  		argu.cb = function(str, key){
  			str += '<td><a href="javascript:void(0);" class="to-completed-c" data-id="'+key+'">完成</a></td>';
  			return str;
  		};

  		admin.callC(argu);
	}

	// 已完成呼叫
	admin.completedC = function(page){
		// 已完成的订单
  		var argu = {};
  		argu.page = page;
  		argu.bar_id = cookie.get('bar_id');
  		argu.statu = 2;

  		argu.url = '/getCompletedC';
  		argu.selector = '#completed-c';
  		argu.cb = function(str, key){
  			return str;
  		};

  		admin.callC(argu);
	}

	/*
	* 顾客呼叫 tab show 获取数据
	*/
	$('a[data-toggle=tab][href=#call-c]').on('shown.bs.tab', function (e) {
		// 切换到顾客点单界面 一级

		// 找到 active tab 二级		
	  	var $call_c = $('#call-c');
	  	var active_info = $call_c.find('li.active').data('info');

	  	if(active_info === 'pending-c'){

	  		admin.pendingC(1);
	  	}else if(active_info === 'completed-c'){
	  		
	  		admin.completedC(1);
	  	}else{
	  		console.log('call-c active info error');
	  	}

	});

	// 待处理呼叫
	$('a[data-toggle=tab][href=#pending-c]').on('shown.bs.tab', function (e) {

		admin.pendingC(1);
		
	});

	// 已完成呼叫
	$('a[data-toggle=tab][href=#completed-c]').on('shown.bs.tab', function (e) {

		admin.completedC(1);
	});

	/*
	* 顾客信息
	*/
	admin.infoC = function(argu){
		var data = {};
  		data.page = argu.page;
  		data.bar_id = argu.bar_id;
  		data.state = argu.state;
  		data.sort = argu.sort;

  		if(argu.start_day){
  			data.start_day = argu.start_day;
  		}

  		if(argu.end_day){
  			data.end_day = argu.end_day;
  		}

  		$.get(argu.url, data, function(data){
	  		data = JSON.parse(data);
	  		var last_page = Math.ceil(data.num/10);

	  		if(data.status === 0){
	  			data = data.data;
	  			// 根据argu.sort 排序
	  			var str = '';
		  		for(key in data){	  		
		  			str += '<tr>';
	  				str += '<td>'+data[key].user_name+'</td>';
	  				str += '<td>'+data[key].user_phone+'</td>';
	  				str += '<td>'+data[key].come_times+'</td>';
	  				if(argu.state === 1){
	  					str += '<td>'+data[key].today_spend+'</td>';
	  				}
	  				str += '<td>'+data[key].all_spend+'</td>';
	  				str += '<td>'+data[key].user_comments+'</td>';
		  			str += '</tr>';
		  		}

		  		$(argu.selector+' table tbody').html(str);

		  		// 根据data.num 来确定末页。
		  		var $page_con = $(argu.selector+' .page-con');
		  		admin.addDataPage($page_con, argu.page, last_page);

	  		}else{
	  			console.log(data.data);
	  		}
	  		
	  	})
	}

	// 今日顾客
	admin.todayC = function(page){
  		var argu = {};
  		argu.page = page;
  		argu.bar_id = cookie.get('bar_id');
  		// 1:今日
  		argu.state = 1;
  		// 1:升序
  		argu.sort = $('#today-c input[name=today-spend-sort]').data('sort');;

  		argu.url = '/getTodayC';
  		argu.selector = '#today-c';

  		admin.infoC(argu);
	}

	// 所有顾客
	admin.allC = function(page, start_day, end_day){
  		var argu = {};
  		argu.page = page;
  		argu.bar_id = cookie.get('bar_id');
  		argu.state = 2;
  		argu.sort = $('#all-c input[name=all-spend-sort]').data('sort');
  		
  		// 搜索 开始日期
  		if(start_day){
  			argu.start_day = start_day;
  		}

  		// 搜索 结束日期
  		if(end_day){
  			argu.end_day = end_day;
  		}

  		argu.url = '/getAllC';
  		argu.selector = '#all-c';

  		admin.infoC(argu);
	}

	/*
	* 顾客信息 tab show 获取数据
	*/
	$('a[data-toggle=tab][href=#info-c]').on('shown.bs.tab', function (e) {
		// 切换到顾客信息界面 一级

		// 找到 active tab 二级		
	  	var $info_c = $('#info-c');
	  	var active_info = $info_c.find('li.active').data('info');

	  	if(active_info === 'today-c'){

	  		admin.todayC(1);
	  	}else if(active_info === 'all-c'){
	  		
	  		admin.allC(1);
	  	}else{
	  		console.log('info-c active info error');
	  	}

	});

	// 今日顾客
	$('a[data-toggle=tab][href=#today-c]').on('shown.bs.tab', function (e) {

		admin.todayC(1);
		
	});

	// 所有顾客
	$('a[data-toggle=tab][href=#all-c]').on('shown.bs.tab', function (e) {
		var page = 'all-c';
		var start_time = $('#'+page+' input[name=start-time]').val();
		var end_time = $('#'+page+' input[name=end-time]').val();

		admin.allC(1, start_time, end_time);
	});

	// 今日排序
	$('#today-c input[name=today-spend-sort]').on('click', function(e){
		var sort = $(e.target).data('sort');

		if(sort === 1){
			$(e.target).data('sort', 2);
			$(e.target).val('今日消费降序排列');
		}else{
			$(e.target).data('sort', 1);
			$(e.target).val('今日消费升序排列');
		}

		admin.todayC(1);
	});

	// 历史排序
	$('#all-c input[name=all-spend-sort]').on('click', function(e){
		var sort = $(e.target).data('sort');

		if(sort === 1){
			$(e.target).data('sort', 2);
			$(e.target).val('历史消费降序排列');
		}else{
			$(e.target).data('sort', 1);
			$(e.target).val('历史消费升序排列');
		}

		admin.allC(1);
	});

















	/*
	* 顾客信息 今日顾客
	*/
	// $('a[data-toggle=tab][href=#today-c]').on('shown.bs.tab', function (e) {
	//   	// e.target // newly activated tab
	//   	// e.relatedTarget // previous active tab
	//   	console.log('debug');

	//   	var argu = {};
	//   	argu.page = 1;

	//   	$.get('/getTodayCustom', argu, function(data){
	//   		data = JSON.parse(data);

	//   		console.log('get success');

	//   		var str = '';
	//   		for(var i=0,l=data.length; i<l; i++){
	//   			str += '<tr>';
	//   			// for( key in data[i]){
	//   				str += '<td>'+data[i].user_name+'</td>';
	//   				str += '<td>'+data[i].phone_number+'</td>';
	//   			// }
	//   			str += '</tr>';
	//   		}

	//   		$('#today-c table tbody').html(str);
	//   	})
	// })

})