
$(document).ready(function(){
	$(document).on('click', 'div.section-detail-list__info', function(e){
		var _this = $(this);

		e.preventDefault();


		var arSectionsIDs = [];
		if(!$(_this).hasClass('all-sections')){
			_this.toggleClass('section-detail-list__item--active colored_theme_bg colored_theme_bg_hovered_hover');
			$('.section-detail-list__info.all-sections').removeClass('section-detail-list__item--active colored_theme_bg');

			$('.section-detail-list__info.section-detail-list__item--active').each(function() {
				var secId = $(this).attr('data-section_id');
				if(secId){
					arSectionsIDs.push(secId);
				}
			});

			if(!arSectionsIDs.length){
				$('.section-detail-list__info.all-sections').addClass('section-detail-list__item--active colored_theme_bg');
			}


		}else{
			$('.section-detail-list__info.section-detail-list__item--active').each(function() {
				$(this).removeClass('section-detail-list__item--active colored_theme_bg colored_theme_bg_hovered_hover');
				_this.addClass('section-detail-list__item--active colored_theme_bg');
			});
		}
		

		var strSectionIds = JSON.stringify(arSectionsIDs);
		$('.content_linked_goods').attr('data-sections-ids',encodeURIComponent(strSectionIds));

			$.ajax({
				url:window.location.href, //_this.attr('href'),
				type: "GET",
				data: {'ajax_get':'Y', 'ajax_get_sections':'Y', 'ajax_section_id':strSectionIds, 'ajax_section_reset': _this.attr('data-section_reset')},
				success: function(html){
					
					$('.js-load-block').html(html);
										
					if(_this.hasClass('section-detail-list__item--active')){
						_this.attr('data-section_reset', 'true');
					} else {
						_this.attr('data-section_reset', 'false');
					}

					var eventdata = {action:'jsLoadBlock'};
					BX.onCustomEvent('onCompleteAction', [eventdata, _this]);

				}
			})
	})


	$('.section-detail-list__item--js-more').on('click', function(){
		var $this = $(this),
			block = $this.find('> span'),
			dataOpened = $this.data('opened'),
			thisText = block.text()
			dataText = block.data('text'),
			item = $this.closest('.section-detail-list').find('.section-detail-list__item-more');

		item.removeClass('hidden');

		if(dataOpened != 'Y'){
			item.velocity('stop').velocity({
				'opacity': 1,
			}, {
				'display': 'inline',
				'duration': 200,
				begin: function(){
					
				}
			});
			$this.addClass('opened').data('opened', 'Y');
		}
		else{
			item.velocity('stop').velocity({
				'opacity': 0,
			}, {
				'display': 'none',
				'duration': 100,
				complete: function(){
					
				}
			});
			$this.removeClass('opened').data('opened', 'N');
		}
		
		block.data('text', thisText).text(dataText);
	});

});