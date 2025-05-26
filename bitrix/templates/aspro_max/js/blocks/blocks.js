InitMenuNavigationAim = function () {
  var $block = $(".menu-navigation__sections-wrapper .menu-navigation__sections:not(.aim-init)");
  if ($block.length) {
    $block.addClass("aim-init");
    loadScripts(arAsproOptions["SITE_TEMPLATE_PATH"] + "/vendor/js/jquery.menu-aim.js", function () {
      $block.menuAim({
        firstActiveRow: true,
        rowSelector: "> .menu-navigation__sections-item",
        activate: function activate(a) {
          var _this = $(a),
            index = _this.index(),
            items = _this.closest(".menu-navigation__sections-wrapper").next(),
            link = _this.find("> a");

          _this.siblings().find("> a").addClass("dark_link");
          link.addClass("colored_theme_text").removeClass("dark_link");
          items.find(".parent-items").siblings().hide();
          items.find(".parent-items").eq(index).show();
        },
        deactivate: function deactivate(a) {
          var _this = $(a),
            index = _this.index(),
            items = _this.closest(".menu-navigation__sections-wrapper").next(),
            link = _this.find("> a");

          link.removeClass("colored_theme_text").addClass("dark_link");
          items.find(".parent-items").siblings().hide();
        },
      });
    });
  }
};

readyDOM(function () {
  window.asproAllProgressBar = document.querySelectorAll(".header-progress-bar__inner");
});

/*progress bar in header*/
function updateProgressBar() {
  let allProgressBar = typeofExt(window.asproAllProgressBar) === "nodelist" ? window.asproAllProgressBar : false;
  if (allProgressBar && allProgressBar.length) {
    let scrollHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let clientHeight = document.documentElement.clientHeight;
    let scrollProcent = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
    if (allProgressBar.length) {
      for (let item = 0; item < allProgressBar.length; item++) {
        allProgressBar[item].style.width = scrollProcent + "%";
      }
    }
  }
}
/**/

$(document).ready(function () {
  //dropdown-select
  $(document).on("click", ".dropdown-select .dropdown-select__title", function () {
    var _this = $(this),
      menu = _this.parent().find("> .dropdown-select__list");

    menu.stop().slideToggle(300);
    _this.toggleClass('dropdown-select__title--opened');
  });

  // close select
  $("html, body").on("mousedown", function (e) {
    if (typeof e.target.className == "string" && e.target.className.indexOf("adm") < 0) {
      e.stopPropagation();
      if (!$(e.target).closest(".dropdown-select").length) {
        BX.onCustomEvent("onCloseDropDown");
      }

    }
  });
  BX.addCustomEvent("onCloseDropDown", () => {
    $(".dropdown-select .dropdown-select__title").removeClass('dropdown-select__title--opened');
    $(".dropdown-select__list:visible").stop().slideUp();
  })
  /**/

  /*side head block*/
  $(document).on("click", ".slide-block .slide-block__head", function (e) {
    var _this = $(this),
      menu = _this.siblings(".slide-block__body"),
      bVisibleMeu = menu.is(":visible"),
      animate = bVisibleMeu ? "slideUp" : "slideDown";

    if (!_this.hasClass("clicked") && menu.length && !_this.hasClass("ignore") && !$(e.target).attr("href")) {
      var type = _this.data("id");
      _this.addClass("clicked");

      if (bVisibleMeu) $.cookie(type + "_CLOSED", "Y");
      else $.removeCookie(type + "_CLOSED");

      menu.stop().slideToggle({
        duration: 150,
        start: function () {
          _this.toggleClass("closed");
        },
        complete: function () {
          _this.removeClass("clicked");

          if (typeof window["stickySidebar"] !== "undefined") {
            window["stickySidebar"].updateSticky();
          }
        }
      });
    }
  });
  /**/

  /**/
  $(".switch-item-block .switch-item-block__icons").on("click", function () {
    var $this = $(this),
      animationTime = 200;

    if ($this.hasClass("switch-item-block__icons--small") && !$this.hasClass("active")) {
      $this.addClass("active");
      $this.siblings(".switch-item-block__icons--big").removeClass("active");
      $this
        .closest(".switch-item-block")
        .find(".switch-item-block__count-wrapper--big")
        .fadeOut(animationTime, function () {
          $this.closest(".switch-item-block").find(".switch-item-block__count-wrapper--small").fadeIn(animationTime);
        });

      $this
        .closest(".switch-item-block")
        .siblings(".big-gallery-block")
        .fadeOut(animationTime, function () {
          $this.closest(".switch-item-block").siblings(".small-gallery-block").fadeIn(animationTime);
        });
    } else if ($this.hasClass("switch-item-block__icons--big") && !$this.hasClass("active")) {
      $this.addClass("active");
      $this.siblings(".switch-item-block__icons--small").removeClass("active");
      $this
        .closest(".switch-item-block")
        .find(".switch-item-block__count-wrapper--small")
        .fadeOut(animationTime, function () {
          $this.closest(".switch-item-block").find(".switch-item-block__count-wrapper--big").fadeIn(animationTime);
        });

      $this
        .closest(".switch-item-block")
        .siblings(".small-gallery-block")
        .fadeOut(animationTime, function () {
          $this.closest(".switch-item-block").siblings(".big-gallery-block").fadeIn(animationTime);
        });
    }
    setTimeout(function () {
      InitLazyLoad();
    }, 300);
  });
  /**/

  /*many items menu*/

  //   InitMenuNavigationAim();
  /**/

  /*progress bar in header*/
  window.addEventListener("scroll", throttle(updateProgressBar, 200));
  /**/

  /*show password*/
  $(".form-control:not(.eye-password-ignore) [type=password]").each(function (item) {
    let passBlock = $(this).closest(".form-control");
    let labelBlock = passBlock.find(".label_block");
    if (labelBlock.length) {
      labelBlock.addClass("eye-password");
    } else {
      passBlock.addClass("eye-password");
    }
  });
  $(document).on("click", ".eye-password:not(.eye-password-ignore)", function (event) {
    let input = this.querySelector("input");
    let eyeWidth = 56;
    if (this.clientWidth - eyeWidth < event.offsetX) {
      if (input.type == "password") {
        input.type = "text";
        this.classList.add("password-show");
      } else if (input.type == "text") {
        input.type = "password";
        this.classList.remove("password-show");
      }
    }
  });
  /**/
});
