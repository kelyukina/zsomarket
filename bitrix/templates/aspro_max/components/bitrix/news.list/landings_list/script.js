$(document).ready(function(){
	$(document).on('click', '.landings-list__item--js-more', function(){
		if($(this).closest('.from_smartseo').length){
			return;
		}

		var $this = $(this),
			block = $this.find('> span'),
			dataOpened = $this.data('opened'),
			thisText = block.text()
			dataText = block.data('text'),
			showCount = $this.data('visible')
			item = $this.closest('.landings-list__info').find('.landings-list__item.hidden').get();

		var items = item.filter(function(item1, index){
			return ++index <= showCount
		})
		if (items) {
			items.forEach(function(item, index){
				$(item).removeClass('hidden');
			})
		}
		if (!item.length) {
			$this.closest('.landings-list__info').find('.landings-list__item.js-hidden').addClass('hidden');
			block.data('text', thisText).text(dataText);
			$this.removeClass('opened').data('opened', 'N');
		} else if (item.length <= showCount) {
			block.data('text', thisText).text(dataText);
			$this.addClass('opened').data('opened', 'Y');
		}
	});

	$(document).on('click', '.landings-list__clear-filter', function(){
		if($(this).closest('.from_smartseo').length){
			return;
		}

		$('.bx_filter_search_reset').trigger('click');
	})

	$(document).on('click', 'a.landings-list__name', function(e){
		if($(this).closest('.from_smartseo').length){
			return;
		}

		var _this = $(this);

		if(_this.closest('.no_ajax.landings_list_wrapper').length) {
			return true;
		}

		e.preventDefault();

		if(_this.attr('href'))
		{
			$.ajax({
				url:_this.attr('href'),
				type: "GET",
				data: {'ajax_get':'Y', 'ajax_get_filter':'Y'},
				success: function(html){
					// $('#right_block_ajax').html($(html).find('#right_block_ajax').html());
					// $('.top-content-block').html($(html).find('.top-content-block').html());

					var ajaxBreadCrumb = $('.ajax_breadcrumb .breadcrumbs', html);
					if(ajaxBreadCrumb.length){
						$('#navigation').html(ajaxBreadCrumb);
					}

					$('.right_block.catalog_page .container').html(html);

					$('.ajax_breadcrumb').remove();

					CheckTopMenuFullCatalogSubmenu();

					BX.onCustomEvent('onAjaxSuccessFilter');

					checkFilterLandgings()

					var eventdata = {action:'jsLoadBlock'};
					BX.onCustomEvent('onCompleteAction', [eventdata, this]);

					InitScrollBar();

					if(window.History.enabled || window.history.pushState != null)
						window.History.replaceState( null, document.title, decodeURIComponent(_this.attr('href')) );
					else
						location.href = _this.attr('href');
					
					if(typeof Ya !== 'undefined' && typeof Ya.share2 === 'function'){
						let myShare = document.querySelector('.ya-share2');
						if (myShare) {
							Ya.share2(myShare, {
								content: {
									url: location.href    
								}
							});
						}
					}
				}
			})
		}
	})
});