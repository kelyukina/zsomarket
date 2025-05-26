$(document).on('click', '.dropdown-select.searchtype .dropdown-select__list-link:not(.dropdown-select__list-link--current)', function(){
    let $this = $(this);
    let type = $this.data('type');
    let name = type === 'all' ? BX.message('SEARCH_IN_SITE') : BX.message('SEARCH_IN_CATALOG');

    BX.onCustomEvent("onCloseDropDown");
    
    $.cookie('searchtitle_type', type);

    $this.closest('.dropdown-select').find('input[name=type]').val(type);

    // remove already visible results
    $('.title-search-result').hide().empty();

    // fire new search request
    BX.fireEvent($this.closest('.dropdown-select').find('input[name=type]')[0], 'change');    

    $('.dropdown-select.searchtype').each(function(){
        $(this).closest('form').attr('action', type === 'all' ? arAsproOptions.PAGES.SEARCH_PAGE_URL : arAsproOptions.PAGES.CATALOG_PAGE_URL);
        $(this).find('.dropdown-select__title>span').text(name);
        $(this).find('input[name=type]').val(type);

        $(this).find('.dropdown-select__list-link').removeClass('dropdown-select__list-link--current').addClass('darken');
        $(this).find('.dropdown-select__list-link[data-type=' + type + ']').addClass('dropdown-select__list-link--current').removeClass('darken');
    });

    try {
        $this.closest('form').find('input[name=q]')[0].focus();
    }
    catch (e) {
    }
});