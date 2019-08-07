$(document).ready(function(e){
	//ADD
	$('#alertbox').hide();
	$('#closeAlert').on('click',function(e){
		$('#alertbox').hide();
	});

	//EDIT
	if($('input[name=ids]').val()){
		xhqr('/api/department/'+$('input[name=ids]').val(),'GET',{},function(res,ret){
		if(res.status === 'error'){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			$('#departement_name').val(res.result.departement_name);
			$('#departement_desc').val(res.result.departement_desc);
		}
	});
	}
});

function save(){
	jsData = {
		key : 'abcdh',
		departement_name: $('#departement_name').val(),
		departement_desc: $('#departement_desc').val()
	}
	xhqr('/api/departement','POST',jsData,function(res,ret){
		if(res.status === 'error'){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			document.location.href = '/departement'
		}
	});
}

function update(){
	jsData = {
		key : 'abcdh',
		departement_name: $('#departement_name').val(),
		departement_desc: $('#departement_desc').val()
	}
	xhqr('/api/departement/'+$('input[name=ids]').val(),'PUT',jsData,function(res,ret){
		if(res.status === 'error'){
			$('#alertbox #message').html(res.message);
			$('#alertbox').show();
		}else{
			document.location.href = '/departement'
		}
	});
}