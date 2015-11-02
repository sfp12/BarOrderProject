// 不同的页面可能有相同的数据，用相同的id，一次全部赋值
// 人民币符号&#165;

jQuery(function($){
  var w = window;
  // bar_order
  var bo = {};

  // html font-size
  bo.fontSize = function(){
    return +$('html').css('fontSize').replace('px','');
  }

  // 页面跳转
  bo.toPage = function(url){
    $('#change-page').attr('href', url);
    $('#change-page').click();
  }

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
            bo.toPage('#scope-page');
          } 

      },{enableHighAccuracy: true})

  }

  // 遮罩层呈现
  bo.showOverlay = function(){
    $('#overlay').height(bo.pageHeight());
    $('#overlay').width(bo.pageWidth());

    $('#overlay').fadeTo(200, 0.5);
  }

  // 遮罩层消失
  bo.hideOverlay = function(){
    $('#overlay').fadeOut(200);
  }

  // 返回页面高度
  bo.pageHeight = function(){   
    return document.body.clientHeight
  }

  // 返回页面宽度
  bo.pageWidth = function(){
    return document.body.scrollWidth;
  }

  $('#overlay').on('click',function(){
    bo.hideOverlay();
    // $('#confirm-leave').popup('close');
    // $('#shopping-content').popup('close');
    $('body').css('overflow', 'visible');
  })


  /*
  * 首页 开始
  */

  $('#main-icons').css('height', document.body.clientHeight - 10.5 * $('html').css('fontSize').replace('px',''));

  $('#main-my-img, #main-my-p').on('click', function(){
    if(false){
      bo.toPage('#login-page');
    }else{
      bo.toPage('#profile-page');
    }
  });

  bo.locPos();

  $('#main-re-loc').on('click', function(){
    bo.locPos();
  });
  // 首页 结束

/*
* 编辑资料1 开始
*/

$('#edit-1-page .content').css('height', document.body.clientHeight);
// 编辑资料1 结束

/*
* 注册 开始
*/
$('#register-page .content').css('height', document.body.clientHeight);
// 注册 结束

/*
* 登陆 开始
*/
$('#login-page .content').css('height', document.body.clientHeight);
// 登陆 结束

/*
* 订单确认 开始
*/
$('#order-confirm-page .content').css('height', document.body.clientHeight);

// 订单确认 结束

/*
* 呼叫 开始
*/
$('#call-page .content').css('height', document.body.clientHeight);
// 呼叫 结束

/*
* 密码重置 开始
*/
$('#modify-pw-page .content').css('height', document.body.clientHeight);
// 密码重置 结束


/*
* 在线点酒 开始
*/
$('#menu-content').css('height', document.body.clientHeight- 8.35 * $('html').css('fontSize').replace('px',''));

$('#order-confirm').on('click',function(){
    bo.showOverlay();
    $('#confirm-leave').popup('open');
    $('body').css('overflow', 'hidden');
})



$('#order-leave').on('click', function(){
  bo.hideOverlay();
  $('#confirm-leave').popup('close');
})

$('#order-stay').on('click', function(){
  bo.hideOverlay();
  $('#confirm-leave').popup('close');
})

$('#shopping-cart').on('click',function(){
    bo.showOverlay();
    // $('#shopping-content').popup('open');
    $('#shopping-table').css('display','block');
    $('body').css('overflow', 'hidden');
})

$('#order-confirm-31').on('click', function(){
  bo.hideOverlay();
    $('#shopping-table').css('display','none');
  // $('#shopping-content').popup('close');
    $('body').css('overflow', 'visible');
})

$('#recommend li').on('click', function(){
  bo.toPage('#wine-detail-page');
})
// 在线点酒 结束

/*
* 聊天 开始
*/
$('#chat-page .content').css('height', document.body.clientHeight);
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
