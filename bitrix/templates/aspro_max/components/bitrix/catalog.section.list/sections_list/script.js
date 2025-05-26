$(document).ready(function(){
	$('.item_block.slide .arrow-block').on('click', function(e){
		$(this).closest('.toggle').find('.name').trigger('click');
	})
	$('.item_block.slide .name').on('click', function(e){
		var _this = $(this),
			slideBlock = _this.closest('.toggle').find('.slide-wrapper'),
			bOpen = slideBlock.is(':visible'),
			dur = bOpen ? 200 : 400,
			func = (bOpen ? 'slideUp' : 'slideDown');

		if(slideBlock.length)
		{
			if(!$(e.target).closest('a').length && !$(e.target).hasClass('dark_link'))
			{
				slideBlock.slideToggle();
				slideBlock.toggleClass('opened');
			}
		}
	})
})