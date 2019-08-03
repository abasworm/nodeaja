var username;
var password;
$(document).ready(function(e){
	username = $('#username');
	password = $('#password');
	$('#btn_login').on('click',function(e){
		$(this).attr('disabled',true);
		signin();
	});
	//ADD
	$('#alertbox').hide();
	$('#closeAlert').on('click',function(e){
		$('#alertbox').hide();
	});
});

function signin(){
	xhqr('/api/login/check','POST',{
		key:'abcdh',
		username:username.val(),
		password:password.val()
	},function(res,ret){
		if(res.status === 'error'){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
			$('#btn_login').attr('disabled',false);
		}else{
			document.location.href = '/user';
		}
	});
}