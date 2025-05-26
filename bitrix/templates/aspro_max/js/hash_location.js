
if ("onhashchange" in window) {
    $(window).bind("hashchange", function () {
        const hash = location.hash;
        if (hash == "#delayed") {
            if ($("#basket_toolbar_button_delayed").length) $("#basket_toolbar_button_delayed").trigger("click");
            } else {
            if ($("#basket_toolbar_button").length) $("#basket_toolbar_button").trigger("click");
            }
      
        if (hash) {
            if ("scrollRestoration" in history) {
                history.scrollRestoration = "manual";
            }
        const dataHash = $('[data-hash]');
        if (dataHash.length) {
            const tab = dataHash.find('.tabs');
            const tabHref = tab.find('.nav a[href="' + hash + '"]');
            if (tabHref.length) {
                tabHref.trigger("click");
                const content_offset = tab.offset();
                $("html, body").animate({ scrollTop: content_offset.top - 90 }, 400);
            }
        } 
        }
    });
}
  