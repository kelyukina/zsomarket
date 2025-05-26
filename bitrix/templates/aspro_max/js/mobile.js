$(document).ready(function () {
  /*  --- Bind mobile menu  --- */
  var $mobileMenu = $("#mobilemenu");
  if ($mobileMenu.length) {
    $mobileMenu.isLeftSide = $mobileMenu.hasClass("leftside");
    $mobileMenu.isOpen = $mobileMenu.hasClass("show");
    $mobileMenu.isDowndrop = $mobileMenu.find(">.scroller").hasClass("downdrop");
    $mobileMenuNlo = $mobileMenu.find("[data-nlo]");

    $("#mobileheader .burger").click(function () {
      SwipeMobileMenu();
      
      // Closing hint list of items after the burger icon clicked
      if (typeof jsControlMobile === "object" && jsControlMobile && "onFocusLost" in jsControlMobile) {
        jsControlMobile.onFocusLost();
      }
    });

    if ($mobileMenu.isLeftSide) {
      $mobileMenu.parent().append('<div id="mobilemenu-overlay"></div>');
      var $mobileMenuOverlay = $("#mobilemenu-overlay");

      $mobileMenuOverlay.click(function () {
        if ($mobileMenu.isOpen) {
          CloseMobileMenu();
          $mobileMenu.find('.expanded').removeClass("expanded");
        }
      });
      BX.loadScript(arAsproOptions.SITE_TEMPLATE_PATH + "/js/jquery.mobile.custom.touch.min.js", function () {
        $(document).swiperight(function (e) {
          if (
            !$(e.target).closest(".flexslider").length &&
            !$(e.target).closest(".swipeignore").length &&
            !$(e.target).closest(".jqmWindow.popup").length
          ) {
            var partWindowWidth = document.documentElement.clientWidth / 3;
            var swipeStart = e.swipestart.coords[0];
            if (swipeStart <= partWindowWidth) {
              OpenMobileMenu();
            }
          }
        });
  
        $(document).swipeleft(function (e) {
          if (
            !$(e.target).closest(".flexslider").length &&
            !$(e.target).closest(".swipeignore").length &&
            !$(e.target).closest(".jqmWindow.popup").length
          ) {
            CloseMobileMenu();
          }
        });
      })
    } else {
      $(document).on("click", "#mobileheader", function (e) {
        if (
          !$(e.target).closest("#mobilemenu").length &&
          !$(e.target).closest(".burger").length &&
          $mobileMenu.isOpen
        ) {
          CloseMobileMenu();
        }
      });
    }

    $(document).on("click", "#mobilemenu .menu a,#mobilemenu .social-icons a", function (e) {
      var $this = $(this);
      if ($this.hasClass("parent")) {
        e.preventDefault();

        if (!$mobileMenu.isDowndrop) {
          $this.closest("li").addClass("expanded");
          MoveMobileMenuWrapNext();
        } else {
          if (!$this.closest("li").hasClass("expanded")) {
            $this.closest("li").addClass("expanded");
          } else {
            $this.closest("li").removeClass("expanded");
          }

          initMobileRegions();
        }
      } else {
        if ($this.closest("li").hasClass("counters")) {
          var href = $this.attr("href");
          if (typeof href !== "undefined") {
            if (href !== "javascript:void(0)") {
              window.location.href = href;
              window.location.reload();
            } else {
              return
            }
          }
        }

        if (!$this.closest(".menu_back").length) {
          CloseMobileMenu();
        }
      }
    });

    $(document).on("click", "#mobilemenu .dropdown .menu_back", function (e) {
      e.preventDefault();
      var $this = $(this);

      MoveMobileMenuWrapPrev();

      setTimeout(function () {
        $this.closest(".expanded").removeClass("expanded");
      }, 400);
    });

    $(document).on('click', '#mobilemenu .menu.mobile_regions .menu_autocomplete .clean_icon', function (e) {
      $(this).closest('.wrapper').find('input[type=text]').val('').trigger('change');
      $(this).hide();
    });

    $(document).on('keyup change paste', '#mobilemenu .menu.mobile_regions .menu_autocomplete input[type=text]', function (e) {
      let $btn = $(this).closest('.wrapper').find('.clean_icon');

      if ($(this).val().length) {
        $btn.show();
      }
      else {
        $btn.hide();

        // hide finded cities
        $(this).closest('.dropdown').find('.mobile-cities').show().siblings().hide().empty();
      }
    });

    $(document).on("click", ".mobile_regions .mobile-city a", function (e) {
      e.preventDefault();
  
      let $this = $(this);
      let regionId = $this.data("id");
  
      if (regionId) {
        setCookieOnDomains('current_region', regionId);
  
        let locationId = $this.data("locid");
        if (locationId) {
          setCookieOnDomains('current_location', locationId);
        } else {
          setCookieOnDomains('current_location', '', {expires: -1});
        }
  
        let href = $this.attr("href");
        location.href = href;
      }
    });

    function OpenMobileMenu() {
      CloseMobilePhone();

      if (!$mobileMenu.isOpen) {
        // hide styleswitcher
        if ($(".style-switcher").hasClass("active")) {
          $(".style-switcher .switch").trigger("click");
        }
        $(".style-switcher .switch").hide();

        if ($mobileMenu.isLeftSide) {
          // show overlay
          setTimeout(function () {
            $mobileMenuOverlay.fadeIn("fast");
          }, 100);
        } else {
          // scroll body to top & set fixed
          $("body").scrollTop(0).css({ position: "fixed" });

          // set menu top = bottom of header
          $mobileMenu.css({ top: +($("#mobileheader").height() + $("#mobileheader").offset().top) + "px" });

          // change burger icon
          $("#mobileheader .burger").addClass("c");
        }

        // show menu
        $mobileMenu.addClass("show");
        $mobileMenu.isOpen = true;

        if (!$mobileMenu.isDowndrop) {
          var $wrap = $mobileMenu.find(".wrap").first();
          var params = $wrap.data("params");
          if (typeof params === "undefined") {
            params = {
              depth: 0,
              scroll: {},
              height: {},
            };
          }
          $wrap.data("params", params);
        }

        if ($mobileMenuNlo.length) {
          if (!$mobileMenuNlo.hasClass("nlo-loadings")) {
            $mobileMenuNlo.addClass("nlo-loadings");
            setTimeout(function () {
              $.ajax({
                data: { nlo: $mobileMenuNlo.attr("data-nlo") },
                success: function (response) {
                  $mobileMenuNlo[0].insertAdjacentHTML("beforebegin", $.trim(response));
                  $mobileMenuNlo.remove();
                },
                error: function () {
                  $mobileMenuNlo.removeClass("nlo-loadings");
                },
              });
            }, 300);
          }
        }
      }
    }

    function CloseMobileMenu() {
      if ($mobileMenu.isOpen) {
        // hide menu
        $mobileMenu.removeClass("show");
        $mobileMenu.isOpen = false;

        // show styleswitcher
        $(".style-switcher .switch").show();

        if ($mobileMenu.isLeftSide) {
          // hide overlay
          setTimeout(function () {
            $mobileMenuOverlay.fadeOut("fast");
          }, 100);
        } else {
          // change burger icon
          $("#mobileheader .burger").removeClass("c");

          // body unset fixed
          $("body").css({ position: "" });
        }

        if (!$mobileMenu.isDowndrop) {
          setTimeout(function () {
            var $scroller = $mobileMenu.find(".scroller").first();
            var $wrap = $mobileMenu.find(".wrap").first();
            var params = $wrap.data("params");
            params.depth = 0;
            $wrap.data("params", params).attr("style", "");
            $mobileMenu.scrollTop(0);
            $scroller.css("height", "");
          }, 400);
        }
      }
    }

    function SwipeMobileMenu() {
      if ($mobileMenu.isOpen) {
        CloseMobileMenu();
      } else {
        OpenMobileMenu();
      }
    }

    function MoveMobileMenuWrapNext() {
      if (!$mobileMenu.isDowndrop) {
        var $scroller = $mobileMenu.find(".scroller").first();
        var $wrap = $mobileMenu.find(".wrap").first();
        if ($wrap.length) {
          var params = $wrap.data("params");
          var $dropdownNext = $mobileMenu.find(".expanded>.dropdown").eq(params.depth);
          if ($dropdownNext.length) {
            var bMobileRegions = $dropdownNext.closest('.mobile_regions').length;
            if (bMobileRegions) {
              var $fixedCities = $dropdownNext.find('.menu-item-fixed');
            }

            // save scroll position
            params.scroll[params.depth] = parseInt($mobileMenu.scrollTop());

            // height while move animating
            params.height[params.depth + 1] = Math.max(
              $dropdownNext.height(),
              !params.depth
                ? $wrap.height()
                : $mobileMenu
                    .find(".expanded>.dropdown")
                    .eq(params.depth - 1)
                    .height()
            );
            $scroller.css("height", params.height[params.depth + 1] + "px");

            // inc depth
            ++params.depth;

            // translateX for move
            $wrap.css("transform", "translateX(" + -100 * params.depth + "%)");

            // scroll to top
            setTimeout(function () {
              $mobileMenu.animate({ scrollTop: 0 }, 200);
            }, 100);

            if (bMobileRegions) {
              $fixedCities.css('height', ($mobileMenu.height() - $fixedCities.position().top) + 'px');
            }

            // height on enimating end
            var h = $dropdownNext.height();
            setTimeout(function () {
              if (h) {
                $scroller.css("height", h + "px");
              } else {
                $scroller.css("height", "");
              }

              if (bMobileRegions) {
                setTimeout(function () {
                  // show cities scroll
                  $fixedCities.css('overflow', '');
                }, 200);

                initMobileRegions();
              }
            }, 200);
          }

          $wrap.data("params", params);
        }
      }
    }

    function MoveMobileMenuWrapPrev() {
      if (!$mobileMenu.isDowndrop) {
        var $scroller = $mobileMenu.find(".scroller").first();
        var $wrap = $mobileMenu.find(".wrap").first();
        if ($wrap.length) {
          var params = $wrap.data("params");
          if (params.depth > 0) {
            var $dropdown = $mobileMenu.find(".expanded>.dropdown").eq(params.depth - 1);
            if ($dropdown.length) {
              // height while move animating
              $scroller.css("height", params.height[params.depth] + "px");

              // dec depth
              --params.depth;

              // translateX for move
              $wrap.css("transform", "translateX(" + -100 * params.depth + "%)");

              // restore scroll position
              setTimeout(function () {
                $mobileMenu.animate({ scrollTop: params.scroll[params.depth] }, 200);
              }, 100);

              if ($dropdown.closest('.mobile_regions').length) {
                // hide cities scroll
                $dropdown.find('.menu-item-fixed').css('overflow', 'hidden');

                // scroll cities to top
                setTimeout(function () {
                  $dropdown.find('.menu-item-fixed').animate({ scrollTop: 0 }, 200);
                }, 100);
              }

              // height on enimating end
              var h = !params.depth
                ? false
                : $mobileMenu
                    .find(".expanded>.dropdown")
                    .eq(params.depth - 1)
                    .height();
              setTimeout(function () {
                if (h) {
                  $scroller.css("height", h + "px");
                } else {
                  $scroller.css("height", "");
                }
              }, 200);
            }
          }

          $wrap.data("params", params);
        }
      }
    }

    function initMobileRegions() {
      if (!initMobileRegions.inited) {
        initMobileRegions.inited = true;

        if ($('.mobile_regions .dropdown .loadings').length) {
          getMainCities();
        }
  
        BX.loadScript(arAsproOptions.SITE_TEMPLATE_PATH + '/js/jquery-ui.min.js', autocompleteMobileRegionsHandler);
      }
    }

    initMobileRegions.inited = false;

    function autocompleteMobileRegionsHandler(){
      $("#mobile-region-search").autocomplete({
        minLength: 2,
        appendTo : $('.mobile_regions .dropdown .mobile-cities').closest('.menu-item-fixed'),
        source: function(request, callback){
          let componentAction = 'searchCities';
          let componentName = 'aspro:regionality.list.max';
          let sessid = BX.message('bitrix_sessid');
          let lang = BX.message('LANGUAGE_ID');
          let siteId = BX.message('SITE_ID');
          let url = location.pathname + location.search;

          BX.ajax({
            url: '/bitrix/services/main/ajax.php?mode=ajax&c=' + encodeURIComponent(componentName) +'&action=' + componentAction + '&sessid=' + sessid + '&SITE_ID=' + siteId + '&siteId=' + siteId + '&url=' + encodeURIComponent(url) + '&term=' + encodeURIComponent(request.term) + '&lang=' + lang,
            method: 'POST',
            async: true,
            processData: true,
            scriptsRunFirst: true,
            emulateOnload: true,
            start: true,
            cache: false,
            dataType: 'json',
            onsuccess: function(response){
              if (
                typeof response === 'object' &&
                response &&
                typeof response.data === 'object' &&
                response.data
              ) {
                if (Object.values(response.data.cities).length) {
                  callback(response.data.cities);
                }
                else {
                  $('.mobile_regions .dropdown .mobile-cities').hide().siblings().empty().show();
                }
              }
            },
            onfailure: function(){
            }
          });
        },
        select: function(event, ui) {
          let regionId = ui.item.ID;
          if (regionId) {              
            setCookieOnDomains('current_region', regionId);

            let locationId = ui.item.LOCATION_ID;
            if (locationId) {
              setCookieOnDomains('current_location', locationId);
            }
            else {
              setCookieOnDomains('current_location', '', {expires: -1});
            }
          }

          $('#mobile-region-search').val(ui.item.label);

          return false;
        },
        open: function(event, ui) {
          $('.mobile_regions .dropdown .mobile-cities').hide().siblings().show();
        },
        close: function(event, ui) {
          // do not hide finded citties! Hide it only on empty phrase!
          $('.mobile_regions .dropdown .mobile-cities').siblings().show();
        }
      }).data('ui-autocomplete')._renderItem = function(ul, item){
        let html = `
          <li class="mobile-city">
            <a href="` + item.URL + `" data-id="` + item.ID + `" data-locid="` + (item.LOCATION_ID ? item.LOCATION_ID : '') + `" class="dark-color"><span>` + item.NAME + `</span>` + (item.PATH ? '<div class="muted">' + item.PATH + '</div>' : '') + `</a>
          </li>
        `;

        return $(html).appendTo(ul);
      }
    }

    function getMainCities() {
			let componentAction = 'getMainCities';
      let componentName = 'aspro:regionality.list.max';
      let sessid = BX.message('bitrix_sessid');
      let lang = BX.message('LANGUAGE_ID');
      let siteId = BX.message('SITE_ID');
      let url = location.pathname + location.search;
      let lastId = getMainCities.lastId;
      let $loadings = $('.mobile_regions .dropdown .loadings').closest('li');

			BX.ajax({
				url: '/bitrix/services/main/ajax.php?mode=ajax&c=' + encodeURIComponent(componentName) +'&action=' + componentAction + '&sessid=' + sessid + '&SITE_ID=' + siteId + '&siteId=' + siteId + '&url=' + encodeURIComponent(url) + '&lastId=' + lastId + '&lang=' + lang,
				method: 'POST',
				async: true,
				processData: true,
				scriptsRunFirst: true,
				emulateOnload: true,
				start: true,
				cache: false,
				dataType: 'json',
				onsuccess: function(response){
					if (
						typeof response === 'object' &&
						response &&
						typeof response.data === 'object' &&
						response.data
					) {
						if (typeof response.data.lastId !== 'undefined') {
							getMainCities.lastId = response.data.lastId;
						}

						if (
							response.data.cities &&
							Object.values(response.data.cities).length
						) {
							let itemsHtml = '';

							for (let i in response.data.cities) {
								let item = response.data.cities[i];
								let bCurrent = item.CURRENT == 1;

								itemsHtml += `
									<li class="mobile-city main-city` + (bCurrent ? ' selected' : '') + `">
										<a href="` + item.URL + `" data-id="` + item.ID + `" data-locid="` + (item.LOCATION_ID ? item.LOCATION_ID : '') + `" class="dark-color"><span>` + item.NAME + `</span>` + (item.PATH ? '<div class="muted">' + item.PATH + '</div>' : '') + `</a>
									</li>
								`;
							}

							$(itemsHtml).insertBefore($loadings);
              
							if (response.data.more) {
                getMainCities.observer.observe($loadings[0]);
              }
              else {
                $loadings.remove();
							}
						}
					}
				},
				onfailure: function(){
					$loadings.remove();
				}
			});
		}

		getMainCities.lastId = 0;
    getMainCities.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          getMainCities.observer.unobserve(entry.target);
          getMainCities();
        }
      })
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    });
  }
  /*  --- END Bind mobile menu  --- */

  /*  --- Bind mobile phone  --- */
  var $mobileHeader = $("#mobileheader");
  var $simpleHeader = $("body.simple_basket_mode #header");
  var $mobilePhone = $("#mobilePhone");
  $mobilePhone.isOpen = false;
  if ($mobilePhone.length) {
    $mobilePhone.isOpen = $mobilePhone.hasClass("show");

    $(document).on("click", ".wrap_phones .svg-inline-phone", function (e) {
      SwipeMobilePhone();
      e.stopPropagation();
    });

    $(document).on("click", ".wrap_phones .svg-inline-close", function (e) {
      CloseMobilePhone();
      e.stopPropagation();
    });
  }

  SwipeMobilePhone = function () {
    if ($mobilePhone.isOpen) {
      CloseMobilePhone();
    } else {
      OpenMobilePhone();
    }
  };

  OpenMobilePhone = function () {
    if (!$mobilePhone.isOpen) {
      CloseMobileMenu();

      // show overlay
      var isSimple = Boolean($simpleHeader.length);
      var positionOffset = isSimple
        ? $simpleHeader[0].getBoundingClientRect()
        : $mobileHeader[0].getBoundingClientRect();
      var position = positionOffset.top + positionOffset.height + pageYOffset;
      $('<div class="jqmOverlay mobp" style="top:' + position + 'px;position:absolute"></div>').appendTo("body");

      // toggle phones
      setTimeout(function () {
        $mobilePhone.slideDown("fast", function () {
          $mobilePhone.addClass("show");
          $mobilePhone.isOpen = true;
        });
      }, 100);
    }
  };

  CloseMobilePhone = function () {
    if ($mobilePhone.isOpen) {
      // toggle phones
      setTimeout(function () {
        $mobilePhone.slideUp("fast", function () {
          $mobilePhone.removeClass("show");
          $mobilePhone.isOpen = false;

          // hide overlay
          $(".jqmOverlay.mobp").remove();
        });
      }, 100);
    }
  };

  checkMobilePhone = function () {
    if (!window.matchMedia("(max-width: 991px)").matches) {
      CloseMobilePhone();
    }
  };
  $(document).on("click", "body.simple_basket_mode .back-mobile-arrow .arrow-back", function () {
    if (document.referrer && document.referrer != location.href) {
      window.history.back();
    } else {
      location.href = "/";
    }
  });
  /*  --- END Bind mobile phone  --- */

  /*  --- Bind mobile filter  --- */
  var $mobilefilter = $("#mobilefilter");
  if ($mobilefilter.length) {
    $mobilefilter.isOpen = $mobileMenu.hasClass("show");
    $mobilefilter.isAppendLeft = false;
    $mobilefilter.isWrapFilter = false;
    $mobilefilter.isHorizontalOrCompact = $(".filter_horizontal").length || $(".bx_filter_vertical.compact").length;
    $mobilefilter.close = '<i class="svg svg-close close-icons"></i>';

    $(document).on("click", ".bx-filter-title", function () {
      OpenMobileFilter();
    });

    $(document).on("click", "#mobilefilter .svg-close.close-icons", function () {
      CloseMobileFilter();
    });

    $(document).on("click", ".bx_filter_select_block", function (e) {
      var bx_filter_select_container = $(e.target).parents(".bx_filter_select_container");
      if (bx_filter_select_container.length) {
        var prop_id = bx_filter_select_container.closest(".bx_filter_parameters_box").attr("data-property_id");
        if ($("#smartFilterDropDown" + prop_id).length) {
          $("#smartFilterDropDown" + prop_id).css({
            "max-width": bx_filter_select_container.width(),
            "z-index": "3020",
          });
        }
      }
    });

    $(document).on("mouseup", ".bx_filter_section", function (e) {
      if ($(e.target).hasClass("bx_filter_search_button")) {
        CloseMobileFilter();
      }
    });

    $(document).on("mouseup", ".bx_filter_parameters_box_title", function (e) {
      $("[id^='smartFilterDropDown']").hide();
      if ($(e.target).hasClass("close-icons")) {
        CloseMobileFilter();
      }
    });

    /*$(document).on('DOMSubtreeModified', "#mobilefilter #modef_num_mobile", function() {
                mobileFilterNum($(this));
            });

            $(document).on('DOMSubtreeModified', "#mobilefilter .bx_filter_container_modef", function() {
                mobileFilterNum($(this));
            });*/

    $mobilefilter.parent().append('<div id="mobilefilter-overlay"></div>');
    var $mobilefilterOverlay = $("#mobilefilter-overlay");

    $mobilefilterOverlay.click(function () {
      if ($mobilefilter.isOpen) {
        CloseMobileFilter();
        //e.stopPropagation();
      }
    });

    mobileFilterNum = function (num, def) {
      if (def) {
        $(".bx_filter_search_button").text(num.data("f"));
      } else {
        var str = "";
        var $prosLeng = $(".bx_filter_parameters_box > span");

        str +=
          $prosLeng.data("f") +
          " " +
          num +
          " " +
          declOfNumFilter(num, [$prosLeng.data("fi"), $prosLeng.data("fr"), $prosLeng.data("frm")]);
        $(".bx_filter_search_button").text(str);
      }
    };

    declOfNumFilter = function (number, titles) {
      cases = [2, 0, 1, 1, 1, 2];
      return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
    };

    OpenMobileFilter = function () {
      if (!$mobilefilter.isOpen) {
        $("body").addClass("jqm-initied wf");

        $(".bx_filter_vertical .slide-block__head.filter_title").removeClass("closed");

        $(".bx_filter_vertical .slide-block__head.filter_title + .slide-block__body").show();

        if (!$mobilefilter.isAppendLeft) {
          if (!$mobilefilter.isWrapFilter) {
            $(".bx_filter").wrap("<div id='wrapInlineFilter'></div>");
            $mobilefilter.isWrapFilter = true;
          }
          $(".bx_filter").appendTo($("#mobilefilter"));
          var helper = $("#filter-helper");
          if (helper.length) {
            helper.prependTo($("#mobilefilter .bx_filter_parameters"));
          }
          $mobilefilter.isAppendLeft = true;
        }
        if (typeof checkFilterLandgings === "function") {
          checkFilterLandgings();
        }

        $("#mobilefilter .bx_filter_parameters").addClass("scrollbar scrollblock");
        $("#mobilefilter .slide-block .filter_title").addClass("ignore");
        $("#mobilefilter .bx_filter_parameters .bx_filter_parameters_box_title").addClass(
          "colored_theme_hover_bg-block"
        );

        $(".bx_filter_button_box.ajax-btns").addClass("colored_theme_bg");
        $(".bx_filter_button_box.ajax-btns .filter-bnt-wrapper").removeClass("hidden");
        InitCustomScrollBar();

        // show overlay
        setTimeout(function () {
          $mobilefilterOverlay.fadeIn("fast");
        }, 100);

        // fix body
        $("body").css({ overflow: "hidden", height: "100vh" });

        // show mobile filter
        $mobilefilter.addClass("show");
        $mobilefilter.find(".bx_filter").css({ display: "block" });
        $mobilefilter.isOpen = true;

        $("#mobilefilter .bx_filter_button_box.btns.ajax-btns").removeClass("hidden");

        var init = $mobilefilter.data("init");
        if (typeof init === "undefined") {
          $mobilefilter.scroll(function () {
            $(".bx_filter_section .bx_filter_select_container").each(function () {
              var prop_id = $(this).closest(".bx_filter_parameters_box").attr("data-property_id");
              if ($("#smartFilterDropDown" + prop_id).length) {
                $("#smartFilterDropDown" + prop_id).hide();
              }
            });
          });

          $mobilefilter.data("init", "Y");
        }
      }
    };

    CloseMobileFilter = function (append) {
      $mobilefilter.find(".bx_filter_parameters").removeClass("scrollbar");

      if ($("#mobilefilter .bx_filter_parameters").length) $("body").removeClass("jqm-initied wf");

      $("#mobilefilter .bx_filter_parameters .bx_filter_parameters_box_title").removeClass(
        "colored_theme_hover_bg-block"
      );
      $(".slide-block .filter_title").removeClass("ignore");
      $(".bx_filter_button_box.ajax-btns").removeClass("colored_theme_bg");

      $(".bx_filter:not(.n-ajax) .bx_filter_button_box.ajax-btns .filter-bnt-wrapper").addClass("hidden");

      if ($mobilefilter.isOpen) {
        // scroll to top
        $mobilefilter.find(".bx_filter_parameters").scrollTop(0);

        // unfix body
        $("body").css({ overflow: "", height: "" });

        // hide overlay
        setTimeout(function () {
          $mobilefilterOverlay.fadeOut("fast");
        }, 100);

        // hide mobile filter
        $mobilefilter.removeClass("show");
        $mobilefilter.isOpen = false;
      }

      if (append && $mobilefilter.isAppendLeft) {
        $(".bx_filter").appendTo($("#wrapInlineFilter")).show();
        var helper = $("#filter-helper");
        if (helper.length) {
          helper.appendTo($("#filter-helper-wrapper"));
        }
        $mobilefilter.isAppendLeft = false;
        $mobilefilter.removeData("init");
        mobileFilterNum($("#modef_num_mobile"), true);
      }
    };

    checkMobileFilter = function () {
      if (
        (!window.matchMedia("(max-width: 991px)").matches && !$mobilefilter.isHorizontalOrCompact) ||
        (!window.matchMedia("(max-width: 767px)").matches && $mobilefilter.isHorizontalOrCompact)
      ) {
        CloseMobileFilter(true);
      }
    };
  } else {
    checkTopFilter();
    $(document).on("click", ".bx-filter-title", function () {
      $(this).toggleClass("opened");
      if ($(".visible_mobile_filter").length) {
        $(".visible_mobile_filter").show();
        $(".bx_filter_vertical, .bx_filter").slideToggle(333);
      } else {
        $(".bx_filter_vertical").closest("div[id^=bx_incl]").show();
        $(".bx_filter_vertical, .bx_filter").slideToggle(333);
      }
    });
  }
  /*  --- END Bind mobile filter  --- */
});
