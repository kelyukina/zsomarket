$(document).ready(function(){
	$(document).on('click', ".scroll_btn", function(){
		scroll_block($('.ordered-block.goods_catalog'));
	});
    
	if($('.content-image').length && arMaxOptions['THEME']['STICKY_SIDEBAR'] != 'N')
	{
		window['sidebarImage']  = new StickySidebar('.content-image', {
			containerSelector: '.inner_wrapper_text',//'.detail_content_wrapper',
			innerWrapperSelector: '.sidebar__inner',
			topSpacing: 60,
			bottomSpacing: 20,
			resizeSensor: true,
		});

		if($('.detail_content_wrapper .content-image img').length)
		{
			$('.detail_content_wrapper .content-image img').load(function(){
				if(typeof window['sidebarImage'] !== 'undefined')
				{
					window['sidebarImage'].updateSticky();
					$('.content-image').trigger('resize');
				}
			})
		}
	}
	
	
	
	var menu_color = $('.banners-content .maxwidth-banner').data('text_color');


	if($('.wrapper1.long_banner_contents').length){
		if( menu_color == 'light')
		{
			$('.header_wrap').addClass('light-menu-color');
		}
		else
		{
			$('.header_wrap').removeClass('light-menu-color');
		}
	}
    if ($(".brands.owl-carousel.brands_slider .bordered  img.lazy").length) {
		$('.brands.owl-carousel.brands_slider .bordered  img.lazy')[0].onload(function(){
			$(window).resize();
		});
	}
});


BX.addCustomEvent('onWindowResize', function(eventdata){
	try{
		if(typeof window['sidebarImage'] !== 'undefined')
		{
			if($('.wrapper1.with_left_block').length){
				if(window.matchMedia('(max-width: 1199px)').matches)
				{
					window['sidebarImage'].destroy();
				}
				else
				{
					window['sidebarImage'].bindEvents();
				}
			} else{
				if(window.matchMedia('(max-width: 991px)').matches)
				{
					window['sidebarImage'].destroy();
				}
				else
				{
					window['sidebarImage'].bindEvents();
				}
			}
			
		}
	}
	catch(e){}
	
});

