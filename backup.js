
// url
if(document.location.pathname === '/order-confirm'){
  
  // 从cookie中获取tbody
  $('#shopping-table tbody').html(bo.cookieToTbody());

}

// ￥20 -> 20
wine_price.slice(1, 3)