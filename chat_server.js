var io = require('socket.io')();
var user_m = require('./models/user');
var async = require('async');

var onlineUsers = {};
var onlineCount = 0;

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('login', function(obj){
        console.log('a user login');
        socket.name = obj.userid;

        if(!onlineUsers.hasOwnProperty(obj.userid)){
            onlineUsers[obj.userid] = obj.username;
            onlineCount++;
        }

        io.emit('login', {onineUsers: onlineUsers, onlineCpunt:onlineCount, user:obj});
        console.log(obj.username+'加入和聊天室');
    });

    socket.on('disconnect', function(obj){
        if(onlineUsers.hasOwnProperty(socket.name)){
            var obj = {userid: socket.name, username: onlineUsers[socket.name]};

            delete onlineUsers[socket.name];
            onlineCount--;

            io.emit('logout', {onlineUsers: onlineUsers, onlineCount: onlineCount, user:obj});
            console.log(obj.username+'退出了聊天室');
        }
    });

    socket.on('message', function(obj){
        console.log('server receive str')

        async.waterfall([
            function(cb){
                user_m.addChat(obj, cb);
            },
            function(r){
                // 添加成功
                if(r){              
                    io.emit('message', obj);
                    console.log(obj.username+'说：'+obj.content);
                }
            }

            ], function(err, value){
                console.log('err:'+err);
                console.log('value:'+value);
        })

        
    });

});

exports.listen = function(_server){
    return io.listen(_server);
}