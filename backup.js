
// url
if(document.location.pathname === '/order-confirm'){
  
  // 从cookie中获取tbody
  $('#shopping-table tbody').html(bo.cookieToTbody());

}

data = JSON.parse(data);

if(data.status === 0){

}else{

}

// ￥20 -> 20
wine_price.slice(1, 3)

var result = {};
result.status = 1;
result.data = '';

async.waterfall([
		function(cb){

		},
		function(cb){

		},
		function(cb){

		}
	], 

	function(err, value){
		console.log('err:'+err);
		console.log('value:'+value);
	}
);

//进度
first-page 中的代码抽离出来，fn 根据data-info来决定参数和函数 ok
call-c js写好，还需要调后台 
switchStatus 需要抽离出来，以后很多地方需要用到。 不需要，一个个写吧
call_times, add call时，自动添加。 ok

info 前端写好，准备后端。 
如何取出add_time的date？























