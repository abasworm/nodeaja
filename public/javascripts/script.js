$(document).ready(function(e){
	var chk = $('input');
	$.each(chk ,function(index, val) {
		 $(this).on('click',function(e){
		 	if($(this).prop('checked')){
		 		$(this).parent().attr('class','checked');
		 	}else{
		 		$(this).parent().attr('class','');
		 	}
		 }); 
	});
	
});