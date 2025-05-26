function asproFilterHelper(smartFilter, noAjax) {
	this.resultDiv = $('#filter-helper');
	this.smart = smartFilter;
	this.noAjax = noAjax;
	if(this.resultDiv.length) {
		this.resultDiv.empty();
		this.smartFilter = $('.bx_filter.bx_filter_vertical');
		this.filterHelper = [];
		this.getInputsInfo(this.smartFilter);

		var _this = this;
		$(document).on('click', '#filter-helper .filterHelperItem .delete_filter, #filter-helper .filterHelperItem:not(.multiple) .title-wrapper', function(e) {
			var _el = $(e.target);
			var id = _el.closest('.filterHelperItem').data('id');
			var options = {};
			options.ID = id;
			if(_el.closest('.filterHelperItem').hasClass('multiple')) {
				options.MULTIPLE = true;
			}
			if(_el.closest('.filterHelperItem').hasClass('price')) {
				options.PRICE = true;
			}
			_this.clearValue(options);
		});

		$(document).on('click', '#filter-helper .filterHelperItem .select-wrapper .select-value', function(e) {
			var _el = $(e.target);
			var id = _el.closest('.select-value').data('id');
			_this.clearValue({ID: id});
		});
	}
}

asproFilterHelper.prototype.check = function() {
	return (this.resultDiv.length && this.smartFilter.length);
}

asproFilterHelper.prototype.getInputsInfo = function(smartFilter) {
	if(smartFilter.length && this.check()) {
		var _this = this;
		this.inputs = smartFilter.find('input');
		if(this.inputs.length) {
			this.inputs.each(function(i, el) {
				var _el = $(el);
				var bPrice = _el.hasClass('min-price') || _el.hasClass('max-price');
				var bChecked = _el.attr('checked') && !_el.attr('disabled');
				if( bChecked || (bPrice && _el.val()) ) {
					var title = '';
					var code = '';

					var boxWrapper = _el.closest('.bx_filter_parameters_box');
					if(boxWrapper.length) {
						code = boxWrapper.data('prop_code') ? boxWrapper.data('prop_code') : '';
						var titleWrapper = boxWrapper.data('property_name');
						if(titleWrapper !== undefined) {
							title = titleWrapper;
						}
					}

					var value = _el.data('title') === undefined ? '' :  _el.data('title');
					if(!value) {
						var label = smartFilter.find('label[for='+_el.attr('name')+']');
						var labelFromId = smartFilter.find('label[for='+_el.attr('id')+']');
						if(label.length) {
							value = label.find('[title]');
							value = value.length ? value.attr('title') : '';
						}else if(labelFromId.length){
							value = labelFromId.find('[title]');
							value = labelFromId.length ? value.attr('title') : '';
						}
					}

					if(bPrice) {
						if(_el.hasClass('min-price')){
							value = BX.message('FROM');
						} else if(_el.hasClass('max-price')) {
							value = BX.message('BEFORE');
						}
						value += ' '+_el.val();
						code = _el.attr('name').replace(/_MIN|_MAX/, '');
					}

					var helperData = {
						NAME: _el.attr('id'),
						VALUE: value,
						INPUT: _el,
						TITLE: title.trim(),
						CODE: code,
						TYPE: bPrice ? 'price' : _el.attr('type'),
					};
					_this.add(helperData);
				}

			});
		}
	}
}

asproFilterHelper.prototype.reload = function() {
	if(!this.check())
		return false;

	this.filterHelper = [];
	if(this.resultDiv.length) {
		this.resultDiv.empty();
		this.resultDiv.hide();
	}
}

asproFilterHelper.prototype.add = function(arItem) {
	if(!this.check())
		return false;

	if(this.filterHelper === undefined) {
		this.reload();
	}

	if(this.filterHelper[arItem.CODE] === undefined) {
		this.filterHelper[arItem.CODE] = [];
	}
	this.filterHelper[arItem.CODE].push(arItem);
}

asproFilterHelper.prototype.show = function() {
	if(!this.check())
		return false;

	if(this.resultDiv.length && this.filterHelper && Object.keys(this.filterHelper).length) {
		this.resultDiv.empty();

		var filterSvg = '';
		filterSvg += '<div class="bx_filter_parameters_box_title filter_title  active-filter">';
			filterSvg += '<i class="svg  svg-inline-icon" aria-hidden="true">';
				filterSvg += '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="10" viewBox="0 0 12 10">';
					filterSvg += '<path class="cls-1" d="M574.593,665.783L570,670.4V674l-2-1v-2.6l-4.6-4.614a0.94,0.94,0,0,1-.2-1.354,0.939,0.939,0,0,1,.105-0.16,0.969,0.969,0,0,1,.82-0.269h9.747a0.968,0.968,0,0,1,.82.269,0.94,0.94,0,0,1,.087.132A0.945,0.945,0,0,1,574.593,665.783Zm-8.164.216L569,668.581,571.571,666h-5.142Z" transform="translate(-563 -664)"></path>';
				filterSvg += '</svg>';
			filterSvg += '</i>';
		filterSvg += '</div>';
		this.resultDiv.append(filterSvg);

		var filtersWrapper = $('<div class="filterHelperItemsWrapper"></div>');
		this.resultDiv.append(filtersWrapper);

		var _this = this;
		for(var key in _this.filterHelper) {
			var html = _this.getResultHTML(_this.filterHelper[key]);
			if(html) {
				filtersWrapper.append(html);
			}
		};

		this.resultDiv.css('display', 'flex');
	}
}

asproFilterHelper.prototype.clearValue = function(options) {
	if(!this.check())
		return false;

	if( (options.MULTIPLE !== undefined && options.MULTIPLE) || (options.PRICE !== undefined && options.PRICE) ) {
		if(options.PRICE !== undefined && options.PRICE) {
			var min = this.smartFilter.find('input.min-price#'+options.ID+'_MIN');
			var max = this.smartFilter.find('input.max-price#'+options.ID+'_MAX');
			var container = min.closest('.bx_filter_parameters_box_container');
			if(container.length) {
				var encode = container.find("[id^=colorUnavailableActive_]").attr('id').replace('colorUnavailableActive_', '');
				var track = window['trackBar'+encode];
				track.leftPercent=track.rightPercent=0;
				container.find("[id^=left_slider_]").css({'left':"0%"});
				container.find("[id^=colorUnavailableActive_]").css({'left':"0%", 'right' : "0%"});
				container.find("[id^=colorAvailableInactive_]").css({'left':"0%", 'right' : "0%"});
				container.find("[id^=colorAvailableActive_]").css({'left':"0%", 'right' : "0%"});
				container.find("[id^=right_slider_]").css({'right':"0%"});
			}
			if(min.length) {
				min.val('');
				smartFilter.keyup(min[0]);
				$("#"+options.ID+'_MIN').val('');
			}

			if(max.length) {
				var defaultVal = max.attr('placeholder');
				max.val('');
				smartFilter.keyup(max[0]);
				$("#"+options.ID+'_MAX').val('');
			}
		} else {
			var wrapper = this.smartFilter.find('[data-prop_code='+options.ID+']');
			if(wrapper.length) {
				var elements = wrapper.find('input');
				if(elements.length) {
					elements.each(function(i, el) {
						var _el = $(el);
						var label = _el.siblings('label[for='+_el.attr('id')+']');
						if(label.length && label.hasClass('active')) {
							label.trigger('click');
						} else if(el.checked) {
							_el.trigger('click');
						}
					});
				}
			}
		}		
	} else {
		var el = $('#'+options.ID);
		if(el.length){
			var type = el.attr('type');
			if(type == 'checkbox') {
				var label = $('label[for='+options.ID+']');
				if(label.length && label.hasClass('active')) {
					label.trigger('click');
				} else if(el[0].checked) {
					el.trigger('click');
				}
			} else if(type == 'radio') {
				var wrapperBox = el.closest('.bx_filter_parameters_box_container');
				if(wrapperBox.length) {
					var popup = wrapperBox.siblings('.popup-window').length ? wrapperBox.siblings('.popup-window') : (wrapperBox.find('.bx_filter_select_popup').length ? wrapperBox.find('.bx_filter_select_popup') : false);
					var bSelect = popup ? true : false;

					var allSelect = wrapperBox.find('[id^=all_]');
					if(allSelect.length) {
						var id = allSelect.attr('id');

						if(bSelect) {
							var all = popup.find('label[for='+id+']');

							if(all.length) {
								all.trigger('click');
								popup.hide();
								var innerPopup = popup.find('.bx_filter_select_popup');
								if(innerPopup.length) {
									innerPopup.show();
								}
							}
						} else {
							allSelect.trigger('click');
						}
					}
					
				}
			}
		};
	}
	if(this.noAjax){
		this.reloadPage = true;
	}

}

asproFilterHelper.prototype.apply = function() {
	if(!this.check())
		return false;

	if(this.noAjax && this.reloadPage) {
		var apply = this.smartFilter.find('#set_filter');
		if(apply.length) {
			apply.trigger('click');
		}
	}
}

asproFilterHelper.prototype.getResultHTML = function(el) {
	if(!this.check())
		return false;

	if(el.length == 1) {
		var options = el[0];
		options.ITEM_CLASS = ' colored_theme_bg_hovered_hover ';
		if(el[0]['TYPE'] == 'price') {
			options.ITEM_CLASS += ' price';
			options.NAME = options.NAME.replace(/_MIN|_MAX/, '');
		}
	} else if(el.length > 1) {
		var options = {
			NAME: el[0].CODE,
			TITLE: el[0].TITLE,
			VALUE: el.length+BX.message('FILTER_HELPER_VALUES'),
			ITEM_CLASS: (el[0].TYPE == 'price' ? 'price colored_theme_bg_hovered_hover' : 'multiple'),
			TYPE: el[0].TYPE,
			VALUES: el,
		};
	} else {
		return false;
	}

	if(options.CODE == 'in_stock') {
		options.TITLE = '';
	}

	var closeSvg = '';
	closeSvg += '<svg xmlns="http://www.w3.org/2000/svg" width="8.031" height="8" viewBox="0 0 8.031 8">';
		closeSvg += '<path class="cls-1" d="M756.41,668.967l2.313,2.315a1,1,0,0,1-1.415,1.409L755,670.379l-2.309,2.312a1,1,0,0,1-1.414-1.409l2.312-2.315-2.281-2.284a1,1,0,1,1,1.414-1.409L755,667.555l2.277-2.281a1,1,0,1,1,1.414,1.409Z" transform="translate(-751 -665)"></path>';
	closeSvg += '</svg>';

	var resultText = '';
	resultText += '<div class="filterHelperItem colored_theme_bg rounded3'+(options.ITEM_CLASS === undefined ? '' : ' '+options.ITEM_CLASS)+'" data-id="'+options['NAME']+'">';

		resultText += '<div class="title-wrapper colored_theme_bg_hovered_hover">';
			if(options['TITLE']) {
				resultText += '<span class="title">';
					resultText += options['TITLE']+': ';
				resultText += '</span>';
			}

			resultText += '<span class="value">';
				if(options.TYPE == 'price' && options.VALUES !== undefined) {
					options.VALUES.forEach(function(el, i) {
						resultText += el.VALUE+' ';
					});
				} else {
					resultText += options['VALUE'];
				}
			resultText += '</span>';
		resultText += '</div>';

		resultText += '<span class="delete_filter colored_theme_bg_hovered_hover">';
			resultText += closeSvg;
		resultText += '</span>';

		if(options.VALUES !== undefined && options.TYPE != 'price') {
			resultText += '<div class="select-wrapper">';
				resultText += '<div class="select-inner rounded3">';
					options.VALUES.forEach(function(el, i) {
						resultText += '<div class="select-value" data-id="'+el['NAME']+'">';
							resultText += el.VALUE;
							resultText += closeSvg;
						resultText += '</div>';
					});
				resultText += '</div>';
			resultText += '</div>';
		}

	resultText += '</div>';


	return resultText;
}



// $(document).on('click', '#filter-helper .filterHelperItem.multiple .title-wrapper', function(e) {
// 	var _el = $(this);
// 	_el.siblings('.select-wrapper').fadeToggle();
// });