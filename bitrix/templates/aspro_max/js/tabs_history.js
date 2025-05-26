function tabsHistory () {
    $("a.linked").on("shown.bs.tab", function (e) {
    var hashLink = $(this).attr("href").replace("#", "");
    $(this).closest(".ordered-block").find(".tab-pane").removeClass("cur");
    $("#" + hashLink).addClass("cur");
  });

  $('a[data-toggle="tab"]:not(.linked)').on("shown.bs.tab", function (e) {
    var _this = $(e.target),
      parent = _this.parent();
    if (_this.attr("href")) {
      history.pushState({}, "", _this.attr("href"));
    }
    //top nav
    if (_this.closest(".product-item-detail-tabs-list").length) {
      if ($(".ordered-block .tabs").length) {
        var content_offset = $(".ordered-block .tabs").offset(),
          tab_height = $(".product-item-detail-tabs-container-fixed").actual("outerHeight"),
          hfixed_height = $("#headerfixed").actual("outerHeight");
        // $('html, body').animate({scrollTop: content_offset.top-hfixed_height-tab_height}, 400);
        $("html, body").animate({ scrollTop: content_offset.top - 88 }, 400);

        if (typeof initReviewsGallery !== 'undefined') {
          initReviewsGallery(_this);
        }
      }
    }

    if (_this.attr("href") === "#stores" && $(".stores_tab").length) {
      if (typeof map !== "undefined") {
        map.container.fitToViewport();
        if (typeof clusterer !== "undefined" && !$(".stores_tab").find(".detail_items").is(":visible")) {
          map.setBounds(clusterer.getBounds(), {
            zoomMargin: 40,
            // checkZoomRange: true
          });
        }
      }
    }
    if (_this.attr("href") === "#reviews" && $(".tab-pane.reviews").length && typeof initReviewsGallery !== 'undefined') {
      initReviewsGallery(_this);
    }
    $(".nav.nav-tabs li").each(function () {
      var _this = $(this);
      if (!_this.find(" > a.linked").length) {
        _this.removeClass("active");
        if (_this.index() == parent.index()) {
          _this.addClass("active");
        } 
      }
    });
    InitLazyLoad();
  });
}    