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
  // cookir cart 未使用
  bo.cookie_cart = '';

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

    bo.cart = cookie.get('cart') ? true : false;

    if(document.location.pathname === '/wine-detail' && bo.cart){
      window.history.go(-1);
      return false;
    }

    if(document.location.pathname === '/order-confirm' && bo.cart){
      window.history.go(-1);
      return false;
    }


    if(document.location.pathname === '/menu' && bo.cart){
      bo.showConfirmLeave();
      return false;
    } 

    window.history.go(-1);
  })

  // wine add to cookie
  bo.addToCookie = function(item){

    var data = cookie.get('cart');
    data = data ? JSON.parse(data) : [];

    var wine_id = item.wine_id;

    if(data.length === 0){
      data.push(item);
    }else{
      var sign = false;
      data.forEach(function(item){
        if(item.wine_id === wine_id){
          item.wine_num = (+item.wine_num)+1;
          sign = true;
        }
      })
      // sign = false, 没有该种酒
      if(!sign){
        data.push(item);
      }
    }

    cookie.set('cart', JSON.stringify(data));
  }

  // wine minus form cookir
  bo.minusToCookie = function(wine_id){

    var data = cookie.get('cart');
    data = data ? JSON.parse(data) : [];

    if(data.length === 0){
      console.log('minus cart error, should has wine');
    }else{
      data.forEach(function(item){
        if(item.wine_id === wine_id){
          item.wine_num = (+item.wine_num)-1;
        }
      })
    }

    cookie.set('cart', JSON.stringify(data));
  }

  // 从cookie中计算个数和总价
  bo.cookieToOrder = function(){

    var num = 0;
    var spend = 0;

    var data = cookie.get('cart');
    data = data ? JSON.parse(data) : [];
    if(data.length !== 0){
      
      num = data.reduce(function(num, item){
              return +item.wine_num + num;
            }, 0);
      spend = data.reduce(function(money, item){
              return (+item.wine_num) * (+item.wine_price) + money;
            }, 0);

      $('#menu-num').parent().css('display','block');
      $('#menu-num').text(num);
      $('#menu-spend').css('display','inline-block');
      $('#menu-spend').text('￥'+spend);
    }
  }

  // 从cookie中计算个数和总价
  // bo.cookieToOrder = function(){

  //   var num = 0;
  //   var spend = 0;

  //   var data = cookie.get('cart');
  //   data = data ? JSON.parse(data) : [];
  //   if(data.length !== 0){
      
  //     num = data.reduce(function(item, num){
  //             return +item.wine_num + num;
  //           }, 0);
  //     spend = data.reduce(function(item, money){
  //             return (+item.wine_num) * (+item.wine_price) + money;
  //           }, 0);

  //     $('#menu-num').css('display','block');
  //     $('#menu-num').text(num);
  //     $('#menu-spend').css('display','inline-block');
  //     $('#menu-spend').text(spend);
  //   }
  // }

  // 从cookie中计算总的个数和总价
  bo.cookieToModal = function(){

    var num = 0;
    var spend = 0;

    var data = cookie.get('cart');
    data = data ? JSON.parse(data) : [];
    if(data.length !== 0){
      
      num = data.reduce(function(num, item){
              return +item.wine_num + num;
            }, 0);
      spend = data.reduce(function(money, item){
              return (+item.wine_num) * (+item.wine_price) + money;
            }, 0);

      $('#menu-num-modal').parent().css('display','block');
      $('#menu-num-modal').text(num);
      $('#menu-spend-modal').parent().css('display','block');
      $('#menu-spend-modal').text(spend);
    }

  }

  // 从cookie中取出购物车的内容
  bo.cookieToTbody = function(){
    var result = '';

    var data = cookie.get('cart');
    data = data ? JSON.parse(data) : [];
    if(data.length !== 0){
      result = data.reduce(function(str, item){
              str += '<tr data-id="'+item.wine_id+'">';
              str += '<td>'+ item.wine_name +'</td>';
              str +=  '<td>×'+ item.wine_num +'</td>';
              str += '<td class="money">'+ item.wine_price +'</td>'
              str += '</tr>';
              return str;
            }, result);
    }

    return result;
  }

  // 从cookie中取出每个wine num; menu
  bo.cookieToMenuNum = function(){
    var data = cookie.get('cart');
    data = data ? JSON.parse(data) : [];

    data.forEach(function(item){
      var id = item.wine_id;
      var add_order = $('.add-order[data-id="'+ id +'"]')[0];
      if(+item.wine_num > 0){
        $(add_order).next().css('display', 'inline-block');
        $(add_order).next().next().css('display', 'inline-block');
      }else{
        $(add_order).next().css('display', 'none');
        $(add_order).next().next().css('display', 'none');
      }
      $(add_order).next().text(item.wine_num);
    })
  }

  // 从cookie中取出wine num; wine-detail
  bo.cookieToDetailNum = function(){
    var data = cookie.get('cart');
    data = data ? JSON.parse(data) : [];
    var add_order = $('.add-order')[0];
    var id = $(add_order).data('id');

    data.forEach(function(item){
      if(item.wine_id === id){
        if(+item.wine_num > 0){
          $(add_order).next().css('display', 'inline-block');
        }else{
          $(add_order).next().css('display', 'none');
        }
        $(add_order).next().text(item.wine_num);
      }
    })
  }

  // OC order-confirm 从cookie中获取总价
  bo.cookieToOC = function(){
    var spend = 0;

    var data = cookie.get('cart');
    data = data ? JSON.parse(data) : [];
    if(data.length !== 0){
      
      spend = data.reduce(function(money, item){
              return (+item.wine_num) * (+item.wine_price) + money;
            }, 0);
      
      $('#order-confirm-page .amount').css('display','block');
      $('#order-confirm-page .amount span').text('￥'+spend);
    }
  }

  /*
  * 首页 开始
  */

  $('#main-page .content').css('height', bo.height - 4.4 * bo.fontSize() + 1);

  

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

  $('#main-icons').css('padding-top', ($('#main-page .content').height() - 4 * bo.fontSize() - 3 * $('#main-menu').height()) * .75);

  // alert($('#main-icons').css('padding-top'));
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
  var argu = {};
  argu.cart = cookie.get('cart');
  $.post('/order-confirm', argu, function(){

    data = JSON.parse(JSON);
    if(data.status === 0){
      console.log('order submit success');
    }else{
      console.log('order submit fail');
    }
  })
})

if(document.location.pathname === '/order-confirm'){
  
  // 从cookie中获取tbody
  $('#shopping-table2 tbody').html(bo.cookieToTbody());

  // 从cookie中获取总价
  bo.cookieToOC();

}

// 订单确认 结束

/*
* 我的订单 开始
*/
$('#my-order-page .content').css('height', bo.height - 4.4 * bo.fontSize());
$('#order-confirm-submit').on('click', function(){
  //我的订单 

})

// 我的订单 结束

/*
* 订单详情 开始
*/
$('#order-detail-page .content').css('height', bo.height - 4.4 * bo.fontSize());
// $('#order-confirm-submit').on('click', function(){



// 订单详情 结束

/*
* 呼叫 开始
*/
$('#call-page .content').css('height', bo.height - 4.4 * bo.fontSize());
$('#call-page .content .icons').css('margin-top', ($('#call-page .content').height() -  $('#call-page .content .icons').height()) * .75);
// 呼叫 结束

/*
* 酒品详情 开始
*/
$('#wine-detail-page .add-order').on('click', function(e){
  e.stopPropagation();
  // 改变num
  var num = +$(e.target).next().text();  
  if(++num > 0){
    $(e.target).next().show();
    $(e.target).next().next().show();
    $(e.target).next().text(num);
  }

  // 获取wine info
  var wine_name = $(e.target).parent().prev().find('.wine-name').text();
  var wine_price = $(e.target).parent().prev().find('.wine-price').text();
  var wine_num = $(e.target).parent().find('.num').text();
  var wine_id = $(e.target).data('id');

  wine_price = +wine_price.slice(1);

  // 把购物车的内容，添加到cookie cart中
  var item = {};
  item.wine_name = wine_name;
  item.wine_price = wine_price;
  item.wine_num = wine_num;
  item.wine_id = wine_id;
  
  bo.addToCookie(item);
  
});

if(document.location.pathname === '/wine-detail'){
  
  // 从cookie中获取wine num
  bo.cookieToDetailNum();

}

$('#wine-detail-page  .minus-order').on('click', function(e){
  e.stopPropagation();

  // 改变num
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

  // 获取wine info
  var wine_name = $(e.target).parent().prev().find('.wine-name').text();
  var wine_price = $(e.target).parent().prev().find('.wine-price').text();
  var wine_num = $(e.target).parent().find('.num').text();
  var wine_id = $(e.target).data('id');

  wine_price = +wine_price.slice(1);

  bo.minusToCookie(wine_id);

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
if(document.location.pathname === '/menu'){
  
  // 从cookie中获取个数和总价
  bo.cookieToOrder();

  // 从cookie中获取wine num
  bo.cookieToMenuNum();

}

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

    // 从cookie中获取tbody
    $('#shopping-table tbody').html(bo.cookieToTbody());

    // 从cookie中获取个数和总价
    bo.cookieToModal();

    bo.showOverlay();
    $('#shopping-table').css('display','block');
    $('body').css('overflow', 'hidden');
})

// 确定离开
$('#order-leave').on('click', function(){
  $('#confirm-leave').css('display', 'none');
  bo.hideOverlay();
  window.location.href='/main';
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
// $('.menu-type li').on('click', function(e){

//   // li中有很多元素，都可触发此事件。所以这里先找到li
//   var parents = $(e.target).parentsUntil('ul');
//   var li = $(parents[parents.length-1]);

//   // 给酒品详情页面赋值
//   $('#wine-detail-page .content>img').attr('src', li.find('.img').css('backgroundImage').replace('url(', '').replace(')',''));
//   $('#wine-detail-page .content .wine-name').text(li.find('.wine-name').text());
//   $('#wine-detail-page .content .wine-discount-price').text(li.find('.wine-discount-price').text());
//   $('#wine-detail-page .content .wine-price').text(li.find('.wine-price').text());
//   $('#wine-detail-page .content .wine-des').text(li.find('.wine-des').text());
//   $('#wine-detail-page .content .num').text(li.find('.num').text());
//   // 如果数目>0,则显示出来。
//   if(+li.find('.num').text() === 0){
//     $('#wine-detail-page .content .num').css('display', 'none');
//   }else{
//     $('#wine-detail-page .content .num').css('display', 'block');
//   }
//   $('#wine-detail-page .content .add-order').data('id', li.find('.add-order').data('id'));
//   $('#wine-detail-page .content .minus-order').data('id', li.find('.minus-order').data('id'));

//   window.location.href = '/wine-detail';
// })

$('.menu-type li .img').on('click', function(){
  var wine_id = +$(this).parent().find('.add-order').data('id');
  var argu = {};
  argu.wine_id = wine_id;
  argu.num = +$(this).parent().find('.num').text();
  window.location.href='/wine-detail?'+$.param(argu);
  
})

$('#menu-page .add-order').on('click', function(e){
  e.stopPropagation();
  // 改变num
  var num = +$(e.target).next().text();  
  if(++num > 0){
    $(e.target).next().show();
    $(e.target).next().next().show();
    $(e.target).next().text(num);
  }

  // 获取wine info
  var wine_name = $(e.target).parent().parent().find('.wine-name').text();
  var wine_price = $(e.target).parent().parent().find('.wine-price').text();
  var wine_num = $(e.target).parent().parent().find('.num').text();
  var wine_id = $(e.target).data('id');

  wine_price = +wine_price.slice(1);

  // 增加个数
  var wine_all_num = +$('#menu-num').text();
  wine_all_num++;

  // 增加钱数
  var wine_spend = +$('#menu-spend').text().slice(1);
  wine_spend = wine_spend+wine_price;

  // 加入购物车
  $('#menu-num').parent().css('display','block');
  $('#menu-num').text(wine_all_num);

  // 加入购物车modal
  $('#menu-spend').css('display','inline-block');
  $('#menu-spend').text(wine_spend);
  
  // 把购物车的内容，添加到cookie cart中
  var item = {};
  item.wine_name = wine_name;
  item.wine_price = wine_price;
  item.wine_num = wine_num;
  item.wine_id = wine_id;

  bo.addToCookie(item);
  
});

$('#menu-page .minus-order').on('click', function(e){
  e.stopPropagation();
  // 改变num
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

  // 获取wine info
  var wine_name = $(e.target).parent().parent().find('.wine-name').text();
  var wine_price = $(e.target).parent().parent().find('.wine-price').text();
  var wine_num = $(e.target).parent().parent().find('.num').text();
  var wine_id = $(e.target).data('id');

  wine_price = +wine_price.slice(1);    

  // 减少个数
  var wine_num = +$('#menu-num').text();
  wine_num--;

  // 增加钱数
  var wine_spend = +$('#menu-spend').text().slice(1);
  wine_spend = wine_spend-wine_price;

  // 加入购物车
  if(wine_num > 0){
    $('#menu-num').parent().css('display','block');
    $('#menu-spend').parent().css('display','block');
  }else{
    $('#menu-num').parent().css('display','none');
    $('#menu-spend').parent().css('display','none');
  }

  // 加入订单确认页
  $('#menu-num').text(wine_num);

  // 加入购物车modal
  $('#menu-spend').text(wine_spend);

  // 从cookie cart中，去除该种酒
  bo.minusToCookie(wine_id);

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
