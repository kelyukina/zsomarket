$(document).ready(function(){ 
	InitScrollBar();
    
	$('.select_head_wrap .menu_item_selected span').text($('.select_head_wrap .head-block .item-link.active').text()) ;
	$('.select_head_wrap .menu_item_selected').on('click', function(){ 
		if(window.matchMedia('(max-width: 767px)').matches){ 
			$(this).toggleClass('opened'); 
			$(this).closest('.select_head_wrap').find('.head-block').slideToggle(200); 
		} 
	}); 

	$('.select_head_wrap .btn-inline').on('click', function(){ 
		var text = $(this).text(); 
		var head_wrap = $(this).closest('.select_head_wrap');

		head_wrap.find('.menu_item_selected span').text(text);
		head_wrap.find('.menu_item_selected').removeClass('opened'); 
		if(window.matchMedia('(max-width: 767px)').matches){ 
			head_wrap.find('.head-block').slideUp(200); 
		} 
	}); 
	
	// close select
	$("html, body").on('mousedown', function(e){
		if(!$(e.target).closest('.select_head_wrap').length)
		{
			$('.select_head_wrap .menu_item_selected.opened').click();
		}
	});
}); 