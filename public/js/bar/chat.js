jQuery(function($){
	var w = window;
	var host = '172.18.223.2';
	var port = 3002;

	w.chat = {
		msgObj: $('#chat-page .content'),
		username: null,
		userid: null,
		socket: null,

		//让浏览器滚动条保持在最底部
		scrollToBottom: function(){
			this.msgObj.scrollTop(this.msgObj.height());
		},
		// 退出
		logout: function(){
			// 回到主页
			w.bo.toPage('/');
		},
		// 提交聊天内容
		submit: function(){
			var content = $('#chat-input').val();
			if(content !== ''){
				var obj = {
					userid: this.userid,
					username: this.username,
					content: content
				};
				console.log('input set to server');
				this.socket.emit('message', obj);
				$('#chat-input').val('');
			} 
			return false;
		},
		genUid: function(){
			return this.userid;
		},
		// 更新系统消息，在用户加入，退出时调用
		// 没有这个需求
		updateSysMeg:function(o, action){
			// var onlineUsers = o.onlineUsers;
			// var onlineCount = 0.onlineCount;
			// var user = o.user;

			// 更新在线人数

			// 添加系统消息
		},
		init:function(userid, username){
			console.log('userid:'+$.cookie('userid'));
			console.log('username:'+$.cookie('username'));

			// chat.scrollToBottom();

			this.userid = userid;
			this.username = username;

			// 链接后端服务器
			this.socket = io.connect('ws://'+host+':'+port);

			// 告诉服务器都用户登录
			this.socket.emit('login', {userid:this.userid, username: this.username});

			// 监听新用户登录
			this.socket.on('login', function(o){
				// chat.updateSysMsg(o, 'login');
			})

			// 监听用户退出
			this.socket.on('logout', function(o){
				// chat.updatSysMsg(o, 'logout');
			})

			// 监听消息发送
			this.socket.on('message', function(obj){
				var isme = (obj.userid === chat.userid) ? true : false;
				// 从个人主页找头像
				var str = "<div class='item'>"
			            + "<div class='u-img'>"
			             + "<img src='"+$('#user-img').attr('src')+"'/>"
			            + "</div>"
			            + "<div>"
			             + "<p class='uname'>"+obj.username+"</p>"
			              + "<div class='chat-content'>"
			               + "<span>"+obj.content+"</span>"
			              + "</div>"              
			            + "</div>"
			          + "</div>";
			    var temp = $(str);
				if(isme){
					temp.addClass('item-r');
				}

				chat.msgObj.append(temp);
				chat.scrollToBottom();
			})

		}

	};
	// console.log('userid:'+$.cookie('userid'));
	// console.log('username:'+$.cookie('username'));
	w.chat.init($.cookie('userid'), $.cookie('username'));

	$('#chat-submit').on('click', function(e){
		chat.submit();
	})
});