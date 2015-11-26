// 不同的页面可能有相同的数据，用相同的id，一次全部赋值
// 人民币符号&#165;
// ×

Zepto(function($){
  var w = window;
  // bar_order
  var bo = {};
  // edit-1, edit-2, 如果有修改，则为true
  bo.modify = false;
  // menu shopping cart, 如果有商品，则为true
  bo.cart = false;

  // 全部加载完，再显示
  $('body').css('display', 'block');

  // html font-size
  bo.fontSize = function(){
    return +$('html').css('font-size').replace('px','');
  }

  bo.width = (window.innerWidth > 0) ? window.innerWidth : screen.width; 
  bo.height = (window.innerHeight > 0) ? window.innerHeight : screen.height; 

  // 定位
  bo.locPos = function(){
      // 百度地图API功能
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(function(r){

          if(this.getStatus() == BMAP_STATUS_SUCCESS){
              var mk = new BMap.Marker(r.point);

              var gc = new BMap.Geocoder();
            
              var pt = new BMap.Point(r.point.lng,r.point.lat);
              gc.getLocation(pt, function(rs){
                var addComp = rs.addressComponents;
                address = addComp.province +  addComp.city + addComp.district + addComp.street + addComp.streetNumber;

                $('.loc').text(address);
              });
          
          }else {
            alert('failed'+this.getStatus());
            window.location.href = '/scope';
          } 

      },{enableHighAccuracy: true})

  }

  // 遮罩层呈现
  bo.showOverlay = function(){
    $('#overlay').height(bo.height);
    $('#overlay').width(bo.width);

    $('#overlay').show(200, 0.5);
  }

  // 遮罩层消失
  bo.hideOverlay = function(){
    $('#overlay').hide(200);
  }  

  // 点击遮罩层，不会消失
  // $('#overlay').on('click',function(){
  //   bo.hideOverlay();
  //   // $('#confirm-leave').popup('close');
  //   // $('#shopping-content').popup('close');
  //   $('body').css('overflow', 'visible');
  // })

  // 回到上一页
  $('.img-con').on('click', function(){
    if(bo.cart){
      bo.showConfirmLeave();
      return false;
    } 

    window.history.go(-1);
  })


  /*
  * 首页 开始
  */

  $('#main-page .content').css('height', bo.height+1);

  $('#main-my-img, #main-my-p').on('click', function(){
    if(!cookie.get('userid')){
      window.location.href = '/login';
    }else{
      window.location.href = '/profile';
    }
  });

  bo.locPos();

  $('#main-re-loc').on('click', function(){
    bo.locPos();
  });

  $('#main-chat-page').on('click', function(){

    if(cookie.get('userid')){
      
      $.get('/tochat', function(data){

        data = JSON.parse(data);

        if(data.status === 0){
          window.location.href='/chat';
          w.chat.scrollToBottom();
        }else{
          window.location.href='/login';
        }

      })

    }else{

      window.location.href='/login';

    }

  })

  $('#main-menu').on('click',function(){
    window.location.href='/menu';
  });

  $('#main-call').on('click',function(){
    window.location.href='/call';
  });

  // $('#main-chat-page').on('click',function(){
  //   window.location.href='/chat';
  // });

  $('#main-profile').on('click',function(){
    // var argu = {};
    // argu.uid = cookie.get('userid');
    // $.get('/profile', argu, function(data){

    // });
    window.location.href='/profile';
  });

  // $('#main-game').on('click',function(){
  //   window.location.href='/game';
  // });
  // 首页 结束

/*
* 编辑资料1 开始
*/

// $('#edit-1-page .content').css('height', document.body.clientHeight);
$('#edit-1-back').on('click', function(){
  var argu = {};
  argu.uname = $('#edit-1-uname').val();
  argu.sex = $('#edit-1-sex').val();
  argu.phoneNumber = $('#edit-1-number').val();
  argu.uid = 2;
  argu.type = 1;
  $.post('/modifyInfo', argu, function(data){
    data = JSON.parse(data);

    if(data.status === 1){
      alert(data.data);
    }
    console.log('debug');
  });
})

$('#edit-2-back').on('click', function(){
  var argu = {};
  argu.age = $('#edit-2-age').val();
  argu.horo = $('#edit-2-horo').val();
  argu.hobby = $('#edit-2-hobby').val();
  argu.sign = $('#edit-2-sign').val();
  argu.uid = 2;
  argu.type = 2;
  $.post('/modifyInfo', argu, function(data){
    data = JSON.parse(data);

    if(data.status === 1){
      alert(data.data);
    }
    console.log('debug');
  });
})
// 编辑资料1 结束

/*
* 注册 开始
*/
// $('#register-page .content').css('height', document.body.clientHeight);
// 获取验证码
$('#validation').on('click', function(){
  $(this).attr('src', '/getCode?'+new Date().getTime());
})

$('#login-r').on('click', function(data){
  var argu = {};
  argu.phoneNumber = $('#phone-number').val();
  argu.validationCode = $('#validation-code').val();
  argu.pw = $('#pw-r').val();
  $.post('/login/register', argu, function(data){
    data = JSON.parse(data);

    if(data.status === 1){
      alert(data.data);
    }
    console.log('debug');
  });
})

// 注册 结束

/*
* 登陆 开始
*/
// $('#login-page .content').css('height', document.body.clientHeight);
// 登录
$('#login-s').on('click', function(data){
  var argu = {};
  argu.phoneNumber = $('#login-number').val();
  argu.pw= $('#login-pw').val();
  $.post('/login/doLogin', argu, function(data){
    data = JSON.parse(data);

    if(data.status === 1){
      alert(data.data);
    }else{
      cookie.set('username',data.data.userName);
      cookie.set('userid', data.data.userId);
      cookie.set('userimg', data.data.userImg);
      window.location.href='/profile';
      // w.chat.init(cookie.get('userid'), cookie.get('username'));
    }
    console.log('debug');
  });
})


// 登陆 结束

/*
* 订单确认 开始
*/
// $('#order-confirm-page .content').css('height', document.body.clientHeight);
$('#order-confirm-submit').on('click', function(){
  //订单确认 立即下单之后，会清空订单确认页的内容吗？

})

// 订单确认 结束

/*
* 呼叫 开始
*/
// $('#call-page .content').css('height', document.body.clientHeight);
// 呼叫 结束

/*
* 酒品详情 开始
*/
$('.add-order').on('click', function(e){
  e.stopPropagation();
  var num = +$(e.target).next().text();  
  if(++num > 0){
    $(e.target).next().show();
    $(e.target).next().next().show();
    $(e.target).next().text(num);
  }

  // 加入购物车
  console.log('debug');
  if($(e.target).parent().attr('class') === 'price-con'){
    // 在线点酒页面
    
    var wine_name = $(e.target).parent().parent().find('.wine-name').text();
    var wine_price = $(e.target).parent().parent().find('.wine-price').text();
    var wine_num = $(e.target).parent().parent().find('.num').text();
    var wine_id = $(e.target).data('id');

    
  }else{
    // 酒品详情页面

    var wine_name = $(e.target).parent().prev().find('.wine-name').text();
    var wine_price = $(e.target).parent().prev().find('.wine-price').text();
    var wine_num = $(e.target).parent().find('.num').text();
    var wine_id = $(e.target).data('id');

    // 改变在线点酒的值
    if(+wine_num > 0){
      // 赋值 显示
      $('#menu-page .add-order[data-id='+wine_id+']').next().text(wine_num);
      $('#menu-page .add-order[data-id='+wine_id+']').next().css('display','block');
      $('#menu-page .add-order[data-id='+wine_id+']').next().next().css('display','block');
    }else{
      // 赋值 隐藏
      $('#menu-page .add-order[data-id='+wine_id+']').next().text(wine_num);
      $('#menu-page .add-order[data-id='+wine_id+']').next().css('display','none');
      $('#menu-page .add-order[data-id='+wine_id+']').next().next().css('display','none');
    }
  }
  var wine_id = $(e.target).data('id');

  if(+wine_num !== 1){
    // 如果购物车中有
    // 找到那个元素，并更改X和金钱
    $('#shopping-table tr[data-id='+wine_id+'] td').eq(1).text('×'+wine_num);
    $('#order-confirm-page tr[data-id='+wine_id+'] td').eq(1).text('×'+wine_num);
  }else{
    // 如果购物车中没有
    var str = '<tr data-id="'+wine_id+'">';
    str += '<td>'+ wine_name +'</td>';
    str +=  '<td>×1</td>';
    str += '<td class="money">'+ wine_price +'</td>'
    str += '</tr>';
    
    // 加入购物车
    $('#shopping-table tbody').append(str);


    // 加入订单详情
    $('#order-confirm-page tbody').append(str);
  }

  

  // 增加个数
  var wine_num = +$('#menu-num').text();
  wine_num++;

  // 增加钱数
  var wine_spend = +$('#menu-spend').text();
  wine_spend = wine_spend+wine_price;

  // 加入购物车
  $('#menu-num').parent().css('display','block');
  $('#menu-num').text(wine_num);
  $('#menu-num-modal').text(wine_num);

  // 加入购物车modal
  $('#menu-spend').text(wine_spend);
  $('#menu-spend-modal').text(wine_spend);
  
  bo.cart = true;
});

$('.minus-order').on('click', function(e){
  e.stopPropagation();
  var num = +$(e.target).prev().text();
  --num;
  if(num > 0){
    $(e.target).prev().text(num);
  }else if(num === 0){
    $(e.target).prev().text(num);
    $(e.target).prev().hide();
    $(this).hide();
  }else{
    $(this).hide();
    $(e.target).prev().hide();
  }

  // 加入购物车
  console.log('debug');
  if($(e.target).parent().attr('class') === 'price-con'){
    // 在线点酒页面
    
    var wine_name = $(e.target).parent().parent().find('.wine-name').text();
    var wine_price = $(e.target).parent().parent().find('.wine-price').text();
    var wine_num = $(e.target).parent().parent().find('.num').text();
    var wine_id = $(e.target).data('id');

    
  }else{
    // 酒品详情页面

    var wine_name = $(e.target).parent().prev().find('.wine-name').text();
    var wine_price = $(e.target).parent().prev().find('.wine-price').text();
    var wine_num = $(e.target).parent().find('.num').text();
    var wine_id = $(e.target).data('id');

    // 改变在线点酒的值
    if(+wine_num > 0){
      // 赋值 显示
      $('#menu-page .add-order[data-id='+wine_id+']').next().text(wine_num);
      $('#menu-page .add-order[data-id='+wine_id+']').next().css('display','block');
      $('#menu-page .add-order[data-id='+wine_id+']').next().next().css('display','block');
    }else{
      // 赋值 隐藏
      $('#menu-page .add-order[data-id='+wine_id+']').next().text(wine_num);
      $('#menu-page .add-order[data-id='+wine_id+']').next().css('display','none');
      $('#menu-page .add-order[data-id='+wine_id+']').next().next().css('display','none');
    }
  }
  var wine_id = $(e.target).data('id');

  if(+wine_num !== 0){
    // 如果购物车中有
    // 找到那个元素，并更改X和金钱
    $('#shopping-table tr[data-id='+wine_id+'] td').eq(1).text('×'+wine_num);
  }else{
    // 删除最后一个
    $('#shopping-table tr[data-id='+wine_id+'] td').eq(1).remove();
    $('#order-confirm-page tr[data-id='+wine_id+'] td').eq(1).remove();
  }  

  // 增加个数
  var wine_num = +$('#menu-num').text();
  wine_num--;

  // 增加钱数
  var wine_spend = +$('#menu-spend').text();
  wine_spend = wine_spend-wine_price;

  // 加入购物车
  if(wine_num > 0){
    bo.cart = true;
    $('#menu-num').parent().css('display','block');
  }else{
    bo.cart = false;
    $('#menu-num').parent().css('display','none');
  }

  // 加入订单确认页
  $('#menu-num').text(wine_num);
  $('#menu-num-modal').text(wine_num);

  // 加入购物车modal
  $('#menu-spend').text(wine_spend);
  $('#menu-spend-modal').text(wine_spend);

})
// 酒品详情 结束

/*
* 密码重置 开始
*/
$('#modify-pw-page .content').css('min-height', bo.height - 4.4 * bo.fontSize());

$('#forget-pw').on('click', function(e){
  console.log('forget-pw');
})

// 登录
$('#m-login').on('click', function(data){
  var argu = {};
  argu.phoneNumber = $('#m-number').val();
  argu.pw= $('#m-pw').val();
  $.post('/modifyPW', argu, function(data){
    data = JSON.parse(data);

    if(data.status === 1){
      alert(data.data);
    }else{
      window.location.href = '/profile';
    }
    console.log('debug');
  });
})
// 密码重置 结束


/*
* 在线点酒 开始
*/


$('#menu-content').css('height', bo.height- 12.75 * $('html').css('font-size').replace('px',''));

bo.showConfirmLeave = function(){
  bo.showOverlay();
  $('#confirm-leave').css('top', (bo.height - 14.5 * bo.fontSize()) / 2);
  $('#confirm-leave').show();
}

// 在线点酒页面
$('#order-confirm').on('click',function(){    
    window.location.href='/order-confirm';
})

// 点击购物车
$('#shopping-cart').on('click',function(){
    bo.showOverlay();
    // $('#shopping-content').popup('open');
    $('#shopping-table').css('display','block');
    $('body').css('overflow', 'hidden');
})

// 确定离开
$('#order-leave').on('click', function(){
  $('#confirm-leave').css('display', 'none');
  bo.hideOverlay();
  bo.cart = false;
  $('.img-con').trigger('click');
})

// 不离开
$('#order-stay').on('click', function(){
  $('#confirm-leave').css('display', 'none');
  bo.hideOverlay();
})


// 订单确认 购物车
$('#order-confirm-31').on('click', function(){
  bo.hideOverlay();
    $('#shopping-table').css('display','none');
  // $('#shopping-content').popup('close');
    $('body').css('overflow', 'visible');
})

// 跳转到酒品详情
$('.menu-type li').on('click', function(e){

  // li中有很多元素，都可触发此事件。所以这里先找到li
  var parents = $(e.target).parentsUntil('ul');
  var li = $(parents[parents.length-1]);

  // 给酒品详情页面赋值
  $('#wine-detail-page .content>img').attr('src', li.find('.img').css('backgroundImage').replace('url(', '').replace(')',''));
  $('#wine-detail-page .content .wine-name').text(li.find('.wine-name').text());
  $('#wine-detail-page .content .wine-discount-price').text(li.find('.wine-discount-price').text());
  $('#wine-detail-page .content .wine-price').text(li.find('.wine-price').text());
  $('#wine-detail-page .content .wine-des').text(li.find('.wine-des').text());
  $('#wine-detail-page .content .num').text(li.find('.num').text());
  // 如果数目>0,则显示出来。
  if(+li.find('.num').text() === 0){
    $('#wine-detail-page .content .num').css('display', 'none');
  }else{
    $('#wine-detail-page .content .num').css('display', 'block');
  }
  $('#wine-detail-page .content .add-order').data('id', li.find('.add-order').data('id'));
  $('#wine-detail-page .content .minus-order').data('id', li.find('.minus-order').data('id'));

  window.location.href = '/wine-detail';
})

// 在线点酒 结束

/*
* 聊天 开始
*/
$('#chat-page .content').css('height', bo.height - 11.2 * bo.fontSize());
// 聊天 结束



  // 没有更多的信息，需要计算margin-top
  $('.no-more').css('marginTop', ($(document).height()-20-220)/2);

  






  var SHAKE_THRESHOLD = 3000;
  var last_update = 0;
  var x, y, z, last_x, last_y, last_z;

  /*
  * 摇动事件
  */
  function deviceMotionHandler(eventData) {
      var acceleration =eventData.accelerationIncludingGravity;
     
      var curTime = new Date().getTime();
     
      if ((curTime - last_update)> 100) {
     
          var diffTime = curTime -last_update;
          last_update = curTime;
     
          x = acceleration.x;
          y = acceleration.y;
          z = acceleration.z;
     
          var speed = Math.abs(x +y + z - last_x - last_y - last_z) / diffTime * 10000;
         
               if (speed > SHAKE_THRESHOLD) {
                                alert("shaked!");
          }
          last_x = x;
          last_y = y;
          last_z = z;
      }
  }

  /*
  * 摇一摇
  */
  function shake(){
      if (window.DeviceMotionEvent) {
          window.addEventListener('devicemotion',deviceMotionHandler, false);
      }
  };

 // 开始摇一摇
 shake();

 $('#user-img').on('click', function(){
       console.log('user-img click');
      $('#content-head-con').addClass('mask');
      $('#content-head-con').css("height",$(document).height());     
      $('#content-head-con').css("width",$(document).width()); 
      $('#upload-con').show();
      $('#upload-con').addClass('upload-mask');    
 })

/*
* 编辑资料 开始
*/
 $('#sex').on('click', function(e){      
      $('body').css('overflow', 'hidden');
      showOverlay(); 
      e.preventDefault();
      e.stopPropagation();
      $('#select-sex').css('display','block');
      if($('#sex').val() == ''){
        $('#sex').val('男');
      }
 })

 

  $('#male-s').on('click', function(){
    $('#male-s').removeClass('opacition');
    $('#female-s').addClass('opacition');
    $('#sex').val('男');
  })

  $('#female-s').on('click', function(){
    $('#male-s').addClass('opacition');
    $('#female-s').removeClass('opacition');
    $('#sex').val('女');
  })

  

  $('#select-sex-ok').on('click',function(){
    hideOverlay();
    $('#select-sex').hide();
    $('body').css('overflow', 'visible');
  })
//-------------编辑资料 结束-----------------------

  w.bo = bo || {};

})
