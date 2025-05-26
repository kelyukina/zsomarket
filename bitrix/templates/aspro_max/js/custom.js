/*
You can use this file with your scripts.
It will not be overwritten when you upgrade solution.
*/

//window.onerror = function (msg, url, line, col, exception) { BX.ajax.get('/ajax/error_log_logic.php', { data: { msg: msg, exception: exception, url: url, line: line, col: col } }); }

$(document).ready(function(){
	$(document).on('click', '.mobile_regions .city_item', function(e){
		e.preventDefault();
		var _this = $(this);
		$.removeCookie('current_region');
		$.cookie('current_region', _this.data('id'), {path: '/',domain: 'next.aspro-partner.ru'});
	});

	$(document).on('click', '.region_wrapper .more_item:not(.current) span', function(e){
		$.removeCookie('current_region');
		$.cookie('current_region', $(this).data('region_id'), {path: '/',domain: 'next.aspro-partner.ru'});
	});

	$(document).on('click', '.confirm_region .aprove', function(e){
		var _this = $(this);
		$.removeCookie('current_region');
		$.cookie('current_region', _this.data('id'), {path: '/',domain: 'next.aspro-partner.ru'});
	});

	$(document).on('click', '.cities .item a', function(e){
    	e.preventDefault();
    	var _this = $(this);
    	$.removeCookie('current_region');
		$.cookie('current_region', _this.data('id'), {path: '/',domain: 'next.aspro-partner.ru'});
    });

    $(document).on('click', '.popup_regions .ui-menu a', function(e){
    	e.preventDefault();
    	var _this = $(this);
    	var href = _this.attr('href')
    	if(typeof arRegions !== 'undefined' && arRegions.length){
	    	$.removeCookie('current_region');
	    	for(i in arRegions){
	    		var region = arRegions[i];
	    		if(region.HREF == href){
					$.cookie('current_region', region.ID, {path: '/',domain: 'next.aspro-partner.ru'});
	    		}
	    	}
    	}
		location.href = href;
    });
});