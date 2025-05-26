if (typeof window.JNotice === "undefined") {
  let svgError = `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M40.7071 19.2929C41.0976 19.6834 41.0976 20.3166 40.7071 20.7071L31.4142 30L40.7071 39.2929C41.0976 39.6834 41.0976 40.3166 40.7071 40.7071C40.3166 41.0976 39.6834 41.0976 39.2929 40.7071L30 31.4142L20.7071 40.7071C20.3166 41.0976 19.6834 41.0976 19.2929 40.7071C18.9024 40.3166 18.9024 39.6834 19.2929 39.2929L28.5858 30L19.2929 20.7071C18.9024 20.3166 18.9024 19.6834 19.2929 19.2929C19.6834 18.9024 20.3166 18.9024 20.7071 19.2929L30 28.5858L39.2929 19.2929C39.6834 18.9024 40.3166 18.9024 40.7071 19.2929Z"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M0 30C0 13.4315 13.4315 0 30 0C46.5685 0 60 13.4315 60 30C60 46.5685 46.5685 60 30 60C13.4315 60 0 46.5685 0 30ZM30 2C14.536 2 2 14.536 2 30C2 45.464 14.536 58 30 58C45.464 58 58 45.464 58 30C58 14.536 45.464 2 30 2Z"/>
      </svg>`;
  window.JNoticeSurface = function (config) {
    var _private = {
      inited: false,
    };

    Object.defineProperties(this, {
      inited: {
        get: function () {
          return _private.inited;
        },
        set: function (value) {
          if (value) {
            _private.inited = true;
          }
        },
      },
    });

    this.config = function (key) {
      if (typeof config === "object") {
        if (typeof key !== "undefined") {
          if (Object.keys(config).indexOf(key) > -1) {
            return config[key];
          }
        }
      }

      return undefined;
    };

    this.init();
  };

  window.JNoticeSurface.prototype = {
    node: null,
    inner: null,
    notices: [],

    get side() {
      var side = this.config("side");
      return side === "left" ? "left" : "right";
    },
    get reverse() {
      return Boolean(this.config("reverse"));
    },
    get classname() {
      return "notice-surface--" + this.side + (this.reverse ? " notice-surface--reverse" : "");
    },

    init: function () {
      if (!this.inited) {
        this.inited = true;

        this.node = BX.create({
          tag: "div",
          attrs: {
            class: "notice-surface " + this.classname,
          },
          html: '<div class="notice-surface__inner"></div>',
        });

        this.node.noticeSurface = this;
        this.inner = this.node.querySelector(".notice-surface__inner");

        BX.ready(
          BX.delegate(function () {
            BX.append(this.node, document.body);
          }, this)
        );
      }
    },

    search: function (notice) {
      if (typeof notice !== "undefined" && notice instanceof window.JNotice) {
        for (var i in this.notices) {
          if (this.notices[i] === notice) {
            return i;
          }
        }
      }

      return false;
    },

    create: function (config) {
      var notice = new JNotice(config);
      notice.appendTo(this);

      return notice;
    },

    append: function (notice) {
      if (typeof notice !== "undefined" && notice instanceof window.JNotice) {
        if (notice.removed || (notice.inserted && notice.surface !== this)) {
          return false;
        }

        var index = this.search(notice);

        if (!index) {
          this.notices.push(notice);
          index = this.notices.length - 1;
          BX.prepend(notice.node, this.inner);
        }

        if (!notice.inserted) {
          notice.appendTo(this);
        }

        return index;
      }

      return false;
    },

    remove: function (index) {
      if (typeof index !== "undefined") {
        if (typeof this.notices[index] !== "undefined") {
          var notice = this.notices[index];

          delete this.notices[index];
          this.notices.splice(index, 1);

          BX.remove(notice.node);

          notice.remove();
        }
      }
    },

    clear: function () {
      for (i in this.notices) {
        if (typeof this.notices[i] !== "undefined") {
          this.notices[i].remove();
        }
      }

      this.notices = [];
    },

    getItemName: function (item) {
      var bJquery = typeof jQuery === "function";

      var name = "";
      var itemTitle = item.querySelector(".js-notice-block__title");
      if (itemTitle) {
        name = itemTitle.textContent;
      }
      var bCatalogDetail = item.getAttribute("class").indexOf("catalog_detail") !== -1;
      var data;
      if (bCatalogDetail) {
        data = item.querySelector(".product-main [data-js-item-name]");
      } else {
        data = item.querySelector("[data-js-item-name]");
      }

      if (data) {
        data = bJquery ? jQuery(data).data("js-item-name") : BX.data(data, "js-item-name");

        if (data) {
          name = data;
        }

        /*if (data) {
          if (!bJquery) {
            try {
              data = JSON.parse(data.toString());
              if (typeof data !== "object" || !data) {
                data = {};
              }
            } catch (e) {
              data = {};
            }
          }

          if (data) {
            name = data.NAME;
          }
        }*/
      }

      return name;
    },

    getItemImage: function (item) {
      var bJquery = typeof jQuery === "function";
      var src = "";
      var image = item.querySelector(".js-notice-block__image img");

      if (image) {
        src = image.getAttribute("src");
        var dataSrc = bJquery ? jQuery(image).data("src") : BX.data(image, "src");
        if (dataSrc && !BX.hasClass(image, "lazyloaded")) {
          src = dataSrc;
        }
      } else if ((image = item.querySelector("meta[itemprop=image]"))) {
        src = image.getAttribute("content");
      } else if ((image = item.querySelector(".image-list__link link[itemprop=image]"))) {
        src = image.getAttribute("href");
      } else if ((image = item.querySelector(".image-list-wrapper img"))) {
        src = image.getAttribute("src");
        var dataSrc = bJquery ? jQuery(image).data("src") : BX.data(image, "src");
        if (dataSrc && !BX.hasClass(image, "lazyloaded")) {
          src = dataSrc;
        }
      }
      return src;
    },

    onRequestError: function(xhr) {
      var content = {
        title: BX.message("NOTICE_REQUEST_ERROR"),
        detail: xhr.status + ' ' + xhr.statusText,
        image: svgError,
      };

      return this.create({
        closeable: true,
        autoclose: 3000,
        type: "requesterror",
        content: content,
      });
    },

    onResultError: function(response) {
      var content = {
        title: BX.message("NOTICE_ERROR"),
        detail: response.error,
        image: svgError,
      };

      return this.create({
        closeable: true,
        autoclose: 3000,
        type: "resulterror",
        content: content,
      });
    },

    onAuth: function(user) {
      if (
        typeof user === "object" &&
        user &&
        BX.message('USER_ID')
      ) {
        const content = {
          title: BX.message("NOTICE_AUTHORIZED"),
          detail: user.login || user.fullname,
          image: user.image,
        };
  
        return this.create({
          closeable: true,
          autoclose: 3000,
          type: "auth",
          content: content,
          link: arAsproOptions.PAGES.PERSONAL_PAGE_URL,
        });
      }
    },

    onAdd2cart: function (items) {
      if (typeof items === "object" && items.length) {
        for (i in items) {
          var item = items[i];

          if (item instanceof Node) {
            if ((item = item.closest(".js-notice-block"))) {
              var bJquery = typeof jQuery === "function";

              var name = this.getItemName(item);
              var src = this.getItemImage(item);

              var content = {
                title: BX.message("NOTICE_ADDED2CART"),
                detail: name,
                image: src,
              };

              if (items.length > 1) {
                var cntMore = items.length - 1;
                var titles = [
                  BX.message("NOTICE_PRODUCT1"),
                  BX.message("NOTICE_PRODUCT2"),
                  BX.message("NOTICE_PRODUCT0"),
                ];
                var cases = [2, 0, 1, 1, 1, 2];
                content.detail +=
                  '<div class="notice__detail__more font-bold">' +
                  BX.message("NOTICE_MORE")
                    .replace("#COUNT#", cntMore)
                    .replace(
                      "#PRODUCTS#",
                      titles[cntMore % 100 > 4 && cntMore % 100 < 20 ? 2 : cases[Math.min(cntMore % 10, 5)]]
                    ) +
                  "</div>";
              }

              return this.create({
                closeable: true,
                autoclose: 3000,
                type: "add2cart",
                link: arAsproOptions.PAGES.BASKET_PAGE_URL,
                content: content,
              });
            }
          }
        }
      }
    },
    onAdd2Delay: function (items) {
      if (typeof items === "object" && items.length) {
        for (i in items) {
          var item = items[i];

          if (item instanceof Node) {
            if ((item = item.closest(".js-notice-block"))) {
              var bJquery = typeof jQuery === "function";

              var name = this.getItemName(item);
              var src = this.getItemImage(item);

              var content = {
                title: BX.message("NOTICE_ADDED2DELAY"),
                detail: name,
                image: src,
              };

              if (items.length > 1) {
                var cntMore = items.length - 1;
                var titles = [
                  BX.message("NOTICE_PRODUCT1"),
                  BX.message("NOTICE_PRODUCT2"),
                  BX.message("NOTICE_PRODUCT0"),
                ];
                var cases = [2, 0, 1, 1, 1, 2];
                content.detail +=
                  '<div class="notice__detail__more font-bold">' +
                  BX.message("NOTICE_MORE")
                    .replace("#COUNT#", cntMore)
                    .replace(
                      "#PRODUCTS#",
                      titles[cntMore % 100 > 4 && cntMore % 100 < 20 ? 2 : cases[Math.min(cntMore % 10, 5)]]
                    ) +
                  "</div>";
              }

              return this.create({
                closeable: true,
                autoclose: 3000,
                type: "add2delay",
                link: arAsproOptions.PAGES.BASKET_PAGE_URL + "#delayed",
                content: content,
              });
            }
          }
        }
      }
    },
    onAdd2Favorite: function (items, state) {
      if (typeof items === "object" && items.length && state) {
        for (i in items) {
          var item = items[i];

          if (item instanceof Node) {
            if ((item = item.closest(".js-notice-block"))) {
              var bJquery = typeof jQuery === "function";

              var name = this.getItemName(item);
              var src = this.getItemImage(item);

              var content = {
                title: BX.message("NOTICE_ADDED2FAVORITE"),
                detail: name,
                image: src,
              };

              if (items.length > 1) {
                var cntMore = items.length - 1;
                var titles = [
                  BX.message("NOTICE_PRODUCT1"),
                  BX.message("NOTICE_PRODUCT2"),
                  BX.message("NOTICE_PRODUCT0"),
                ];
                var cases = [2, 0, 1, 1, 1, 2];
                content.detail +=
                  '<div class="notice__detail__more font-bold">' +
                  BX.message("NOTICE_MORE")
                    .replace("#COUNT#", cntMore)
                    .replace(
                      "#PRODUCTS#",
                      titles[cntMore % 100 > 4 && cntMore % 100 < 20 ? 2 : cases[Math.min(cntMore % 10, 5)]]
                    ) +
                  "</div>";
              }

              return this.create({
                closeable: true,
                autoclose: 3000,
                type: "add2delay",
                link: arAsproOptions.PAGES.FAVORITE_PAGE_URL,
                content: content,
              });
            }
          }
        }
      }
    },
    onAdd2Compare: function (items) {
      if (typeof items === "object" && items.length) {
        for (i in items) {
          var item = items[i];

          if (item instanceof Node) {
            if ((item = item.closest(".js-notice-block"))) {
              var bJquery = typeof jQuery === "function";

              var name = this.getItemName(item);
              var src = this.getItemImage(item);

              var content = {
                title: BX.message("NOTICE_ADDED2COMPARE"),
                detail: name,
                image: src,
              };

              if (items.length > 1) {
                var cntMore = items.length - 1;
                var titles = [
                  BX.message("NOTICE_PRODUCT1"),
                  BX.message("NOTICE_PRODUCT2"),
                  BX.message("NOTICE_PRODUCT0"),
                ];
                var cases = [2, 0, 1, 1, 1, 2];
                content.detail +=
                  '<div class="notice__detail__more font-bold">' +
                  BX.message("NOTICE_MORE")
                    .replace("#COUNT#", cntMore)
                    .replace(
                      "#PRODUCTS#",
                      titles[cntMore % 100 > 4 && cntMore % 100 < 20 ? 2 : cases[Math.min(cntMore % 10, 5)]]
                    ) +
                  "</div>";
              }

              return this.create({
                closeable: true,
                autoclose: 3000,
                type: "add2compare",
                link: arAsproOptions.PAGES.COMPARE_PAGE_URL,
                content: content,
              });
            }
          }
        }
      }
    },
  };

  window.JNoticeSurface.get = function (config) {
    config = typeof config === "object" ? config : {};
    var side = config.side === "left" ? "left" : "right";
    var reverse = Boolean(config.reverse);
    var classname =
      ".notice-surface.notice-surface--" +
      side +
      (reverse ? ".notice-surface--reverse" : ":not(.notice-surface--reverse)");
    var surface = document.querySelector(classname);
    if (surface) {
      surface = surface.noticeSurface;
    } else {
      surface = new window.JNoticeSurface(config);
    }

    return surface;
  };

  window.JNotice = function (config) {
    var _private = {
      surface: false,
      inited: false,
      removed: false,
    };

    Object.defineProperties(this, {
      surface: {
        get: function () {
          return _private.surface;
        },
        set: function (value) {
          if (
            typeof value !== "undefined" &&
            value instanceof window.JNoticeSurface &&
            !this.inserted &&
            !this.removed
          ) {
            _private.surface = value;
            value.append(this);

            this.show();

            BX.onCustomEvent("onAppendNotice", { notice: this });
          }
        },
      },
      inserted: {
        get: function () {
          return _private.surface instanceof window.JNoticeSurface;
        },
      },
      inited: {
        get: function () {
          return _private.inited;
        },
        set: function (value) {
          if (value) {
            _private.inited = true;
          }
        },
      },
      removed: {
        get: function () {
          return _private.removed;
        },
        set: function (value) {
          if (value) {
            _private.removed = true;
          }
        },
      },
    });

    this.config = function (key) {
      if (typeof config === "object") {
        if (typeof key !== "undefined") {
          if (Object.keys(config).indexOf(key) > -1) {
            return config[key];
          }
        }
      }

      return undefined;
    };

    this.init();
  };

  window.JNotice.prototype = {
    node: null,
    inner: null,
    closer: null,
    handlers: {
      onClickNode: function (event) {
        if (!event) {
          event = window.event;
        }

        var target = event.target || event.srcElement;

        if (typeof target !== "undefined" && target) {
          if (!target.closest("a")) {
            if (!target.closest(".notice__closer")) {
              BX.PreventDefault(event);

              var notice = target.closest(".notice");
              if (notice) {
                notice = notice.notice;

                if (notice.link.length) {
                  location.href = notice.link;
                }
              }
            }
          }
        }
      },
      onMouseEnterNode: function (event) {
        if (!event) {
          event = window.event;
        }

        var target = event.target || event.srcElement;

        if (typeof target !== "undefined" && target) {
          var notice = target.closest(".notice");
          if (notice) {
            notice = notice.notice;

            if (notice.autoclose) {
              if (!notice.closed) {
                notice.stopAutoClose();
              }
            }
          }
        }
      },
      onMouseLeaveNode: function (event) {
        if (!event) {
          event = window.event;
        }

        var target = event.target || event.srcElement;

        if (typeof target !== "undefined" && target) {
          var notice = target.closest(".notice");
          if (notice) {
            notice = notice.notice;

            BX.removeClass(notice.node, "animate--notice-click");

            if (!notice.closed) {
              notice.startAutoClose();
            }
          }
        }
      },
      onMouseDownNode: function (event) {
        if (!event) {
          event = window.event;
        }

        var target = event.target || event.srcElement;

        if (typeof target !== "undefined" && target) {
          var notice = target.closest(".notice");
          if (notice) {
            notice = notice.notice;

            BX.addClass(notice.node, "animate--notice-click");
          }
        }
      },
      onMouseUpNode: function (event) {
        if (!event) {
          event = window.event;
        }

        var target = event.target || event.srcElement;

        if (typeof target !== "undefined" && target) {
          var notice = target.closest(".notice");
          if (notice) {
            notice = notice.notice;

            BX.removeClass(notice.node, "animate--notice-click");
          }
        }
      },
      onClickCloser: function (event) {
        if (!event) {
          event = window.event;
        }

        var target = event.target || event.srcElement;

        if (typeof target !== "undefined" && target) {
          // there is need IE hack for svg target here
          // var notice = target.closest('.notice');

          var notice = null;
          var parent = target;
          while (parent) {
            if (parent.matches(".notice")) {
              notice = parent;
              break;
            } else {
              parent = parent.parentElement || parent.parentNode;
            }
          }

          if (notice) {
            notice = notice.notice;

            BX.addClass(notice.node, "notice--closed");
            notice.remove();
          }
        }
      },
    },

    get visible() {
      return !BX.hasClass(this.node, "notice--hidden") && this.inserted;
    },
    get closed() {
      return BX.hasClass(this.node, "notice--closed");
    },
    get closeable() {
      return Boolean(this.config("closeable"));
    },
    get autoclose() {
      var autoclose = parseInt(this.config("autoclose"));
      return autoclose ? autoclose : 0;
    },
    get classname() {
      var classname = this.config("classname");
      return typeof classname === "string" ? classname : "";
    },
    get type() {
      var type = this.config("type");
      return typeof type === "string" ? type : "";
    },
    get link() {
      var link = this.config("link");
      return typeof link === "string" ? link : "";
    },
    get content() {
      var content = this.config("content");

      if (typeof content === "function") {
        content = content();
      }

      if (typeof content === "object") {
        var title =
          typeof content.title !== "undefined" && content.title
            ? typeof content.title === "function"
              ? content.title()
              : content.title.toString()
            : "";
        var detail =
          typeof content.detail !== "undefined" && content.detail
            ? typeof content.detail === "function"
              ? content.detail()
              : content.detail.toString()
            : "";
        var image =
          typeof content.image !== "undefined" && content.image
            ? typeof content.image === "function"
              ? content.image()
              : content.image.toString()
            : "";
        var image_link =
          typeof content.image_link !== "undefined" && content.image_link
            ? typeof content.image_link === "function"
              ? content.image_link()
              : content.image_link.toString()
            : "";

        if (title.length || detail.length || image.length) {
          content = '<div class="notice__info-wrap">';

          if (image) {
            const bSvgImage = image.match(/<svg[\s>]/);
            if (!bSvgImage) {
              image = `<img src="${image}" />`;
            }

            content +=
              '<div class="notice__image-wrap"><div class="notice__image">' +
                (image_link ? '<a href="' + image_link + '">' : "")
                + image +
                (image_link ? "</a>" : "") +
              "</div></div>";
          }
          if (title || detail) {
            content += '<div class="notice__text-wrap">';
            if (title) {
              content += '<div class="notice__title switcher-title font-bold">' + title + "</div>";
            }
            if (detail) {
              content += '<div class="notice__detail font_14">' + detail + "</div>";
            }
            content += "</div>";
          }

          content += "</div>";
        }
      }

      if (typeof content === "undefined") {
        return "";
      } else {
        return content.toString();
      }
    },

    init: function () {
      if (!this.inited) {
        this.inited = true;

        var closer = this.closeable
          ? '<span class="notice__closer stroke-theme-hover" title="' +
            BX.message("NOTICE_CLOSE") +
            '"><i class="svg inline  svg-inline-" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 1L1 13M1 1L13 13" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></i></span>'
          : "";

        this.node = BX.create({
          tag: "div",
          attrs: {
            class:
              "notice notice--hidden" +
              (this.classname.length ? " " + this.classname : "") +
              (this.link.length ? " notice--link" : ""),
          },
          dataset: {
            type: this.type,
          },
          html: closer + '<div class="notice__inner">' + this.content + "</div>",
        });

        this.node.notice = this;
        this.inner = this.node.querySelector(".notice__inner");
        if (this.closeable) {
          this.closer = this.node.querySelector(".notice__closer");
        }

        this.bindEvents();

        BX.onCustomEvent("onInitNotice", { notice: this });
      }
    },

    bindEvents: function () {
      if (this.node) {
        if (typeof this.handlers.onClickNode === "function") {
          this.node.addEventListener("click", this.handlers.onClickNode);
        }

        if (typeof this.handlers.onMouseEnterNode === "function") {
          this.node.addEventListener("mouseenter", this.handlers.onMouseEnterNode);
        }

        if (typeof this.handlers.onMouseLeaveNode === "function") {
          this.node.addEventListener("mouseleave", this.handlers.onMouseLeaveNode);
        }

        if (typeof this.handlers.onMouseEnterNode === "function") {
          this.node.addEventListener("mousedown", this.handlers.onMouseDownNode);
        }

        if (typeof this.handlers.onMouseLeaveNode === "function") {
          this.node.addEventListener("mouseup", this.handlers.onMouseUpNode);
        }
      }

      if (this.closeable) {
        if (this.closer && typeof this.handlers.onClickCloser === "function") {
          this.closer.addEventListener("click", this.handlers.onClickCloser);
        }
      }
    },

    unbindEvents: function () {
      if (this.node) {
        if (typeof this.handlers.onClickNode === "function") {
          this.node.removeEventListener("click", this.handlers.onClickNode);
        }

        if (typeof this.handlers.onMouseEnterNode === "function") {
          this.node.removeEventListener("mouseenter", this.handlers.onMouseEnterNode);
        }

        if (typeof this.handlers.onMouseLeaveNode === "function") {
          this.node.removeEventListener("mouseleave", this.handlers.onMouseLeaveNode);
        }

        if (typeof this.handlers.onMouseEnterNode === "function") {
          this.node.removeEventListener("mousedown", this.handlers.onMouseDownNode);
        }

        if (typeof this.handlers.onMouseLeaveNode === "function") {
          this.node.removeEventListener("mouseup", this.handlers.onMouseUpNode);
        }
      }

      if (this.closer && typeof this.handlers.onClickCloser === "function") {
        this.closer.removeEventListener("click", this.handlers.onClickCloser);
      }
    },

    callback: function (callback) {
      if (typeof callback === "function") {
        callback();
      }
    },

    appendTo: function (surface) {
      this.surface = surface;
    },

    show: function (callback) {
      if (!this.visible) {
        BX.addClass(this.node, "animate--notice-show");
        BX.removeClass(this.node, "notice--hidden");

        setTimeout(
          BX.delegate(function () {
            BX.removeClass(this.node, "animate--notice-show");
            this.startAutoClose();

            this.callback(callback);
          }, this),
          600
        );

        BX.onCustomEvent("onShowNotice", { notice: this });
      } else {
        this.callback(callback);
      }
    },

    hide: function (callback) {
      if (this.visible) {
        var that = this;

        setTimeout(function () {
          that.node.style.height = that.node.getBoundingClientRect().height + "px";
          that.node.style.opacity = 1;

          setTimeout(function () {
            BX.addClass(that.node, "animate--notice-hide");

            setTimeout(function () {
              BX.addClass(that.node, "notice--hidden");
              BX.removeClass(that.node, "animate--notice-hide");

              that.callback(callback);
            }, 700);
          }, 25);

          BX.onCustomEvent("onHideNotice", { notice: that });
        }, 100);
      } else {
        this.callback(callback);
      }
    },

    remove: function () {
      if (!this.removed) {
        this.removed = true;

        this.hide(
          BX.delegate(function () {
            this.unbindEvents();

            if (this.inserted) {
              this.surface.remove(this.surface.search(this));
            }

            BX.onCustomEvent("onRemoveNotice", { notice: this });
          }, this)
        );
      }
    },

    startAutoClose: function () {
      this.stopAutoClose();

      if (this.autoclose) {
        this.autocloseTimer = setTimeout(
          BX.delegate(function () {
            this.remove();
          }, this),
          this.autoclose
        );
      }
    },

    stopAutoClose: function () {
      if (typeof this.autocloseTimer !== "undefined" && this.autocloseTimer) {
        clearTimeout(this.autocloseTimer);
        this.autocloseTimer = false;
      }
    },
  };
}
