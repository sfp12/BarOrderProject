jQuery(function($){

/*
* 登录页
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

/*
* table switch page
*/
// $('.first-page').attr('disabled', true);
// $('.first-page').attr('disabled', false);
$('.page-to').on('click', function(e){
	var info = $(e.target).data('info');
	var $page_input = $('.page[data-info='+info+']')
	var page = $page_input.val();
	if($.isNumeric(+page)){
		console.log('is number');
	}else{
		$page_input.val('');
		$('#one-btn-m').modal('show');
		$('#one-btn-m .modal-body p').text('请输入数字');
	}
})

})