if (typeof window.JItemAction === "undefined") {
  // class JItemAction
  JItemAction = function (node, config) {
    node = typeof node === "object" && node && node instanceof Node ? node : null;
    config = typeof config === "object" && config ? config : {};

    this.node = node;

    var _private = {
      inited: false,
      data: null,
      config: {
        bindEvents: true,
        changeState: true,
        fireGoals: true,
      },
    };

    let _config = Object.assign({}, _private.config, config);

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

      config: {
        get: function () {
          return _config;
        },
      },

      data: {
        get: function () {
          let data = null;

          if (this.valid) {
            data = this.node.dataset;
          }

          if (_private.data) {
            data = _private.data;
          }

          return Object.assign({}, data);
        },
        set: function (data) {
          _private.data = data;
        },
      },
    });

    this.init();
  };

  JItemAction.prototype = {
    constructor: JItemAction,
    busy: false,
    parentNode: null,
    prevState: null,
    activeClass: "added in",

    get class() {
      return this.constructor.name;
    },

    get action() {
      return "";
    },

    get requestUrl() {
      return `aspro:max.ItemAction.${this.action}`;
    },

    get valid() {
      return this.node && this.action;
    },

    get state() {
      if (!this.config.changeState) {
        return true;
      }
      return this.valid && BX.hasClass(this.node, this.activeClass);
    },

    set state(value) {
      if (this.valid && this.config.changeState) {
        this.node.removeAttribute("style"); //for sku
        if (value != this.state) {
          if (value) {
            BX.addClass(this.node, this.activeClass);
          } else {
            BX.removeClass(this.node, this.activeClass);
          }

          let title = this.getStateTitle(value);
          this.node.setAttribute("title", title);

          let button = this.node.querySelector(".info-buttons__item-text");
          if (button) {
            button.setAttribute("title", title);
          }

          if (BX.hasClass(this.node, "btn")) {
            const $likeText = this.node.querySelector(".like-text");
            if ($likeText) {
              $likeText.textContent = title;
            }
          }
        }
      }
    },

    init: function () {
      if (!this.inited) {
        this.inited = true;

        if (this.valid) {
          this.node.itemAction = this;
          this.parentNode = this.node.parentElement;

          if (this.data.offers === "Y") {
            this.data = this.node.dataset;
          }

          if (this.config.bindEvents) {
            this.unbindAllEvents();
            this.bindEvents();
          }
        }
      }
    },

    bindEvents: function () {
      if (this.valid) {
        if (typeof this.handlers.onClickNode === "function") {
          BX.bind(this.node, "click", BX.proxy(this.handlers.onClickNode, this));
        }
      }
    },

    unbindEvents: function () {
      if (this.valid) {
        if (typeof this.handlers.onClickNode === "function") {
          BX.unbind(this.node, "click", BX.proxy(this.handlers.onClickNode, this));
        }
      }
    },

    unbindAllEvents: function () {
      if (this.valid) {
        BX.unbindAll(this.node, "click");
      }
    },

    fireEvent: function (event) {
      if (this.valid && !this.busy && typeof event === "object" && event) {
        let eventType = event.type;
        if (eventType) {
          if (eventType === "click") {
            BX.proxy(this.handlers.onClickNode, this)(event);
          }
        }
      }
    },

    isStateChanged: function () {
      return this.prevState !== null && this.prevState != this.state;
    },

    isItemChanged: function () {
      return this.node !== null && this.node.dataset["item"] != this.data.item;
    },

    getStateTitle: function (state) {
      if (this.valid) {
        if (state) {
          return this.node.getAttribute("data-title_added") || "";
        } else {
          return this.node.getAttribute("data-title") || "";
        }
      }

      return "";
    },

    getStateGoalCode: function (state) {
      return "goal_" + this.action + (state ? "_add" : "_remove");
    },

    showStateNotice: function (state) {
      this.showNotice([this.node], state);
    },
    showNotice: function (items, state = 1) {
      if (this.valid && typeof JNoticeSurface === "function") {
        let surface = JNoticeSurface.get();
        let actionCapitalize = this.action.replace(/^\w/, c => c.toUpperCase());
        let noticeFunc = "onAdd2" + actionCapitalize;

        if (noticeFunc && typeof surface[noticeFunc] === "function") {
          surface[noticeFunc](items, state);
        }
      }
    },

    updateState: function () {
      if (this.valid && !this.busy) {
        this.busy = true;

        this.node.blur();

        this.prevState = this.state;

        this.sendRequest();
      }
    },

    collectRequestData: async function () {
      const data = { fields: {} };

      data["fields"] = this.data;
      data["fields"]["state"] = Number(this.state);

      return data;
    },

    sendRequest: function () {
      if (this.valid) {
        this.collectRequestData()
          .then(data => {
            BX.ajax.runAction(this.requestUrl, { data }).then(
              response => {
                if (typeof this.onRequestSuccess === "function") {
                  this.onRequestSuccess(response);
                }

                if (typeof this.onRequestComplete === "function") {
                  this.onRequestComplete(data);
                }
              },
              response => {
                if (typeof this.onRequestFailure === "function") {
                  this.onRequestFailure(response);
                }

                if (typeof this.onRequestComplete === "function") {
                  this.onRequestComplete(data);
                }
              }
            );
          })
          .catch(() => {
            setTimeout(() => {
              if (this.isStateChanged()) {
                // toggle state back
                this.state = this.prevState;
                this.prevState = null;
              }

              if (this.parentNode) {
                BX.removeClass(this.parentNode, "loadings");
              }

              this.busy = false;
            }, 0);
          });
      }
    },

    onRequestComplete: function (config) {
      setTimeout(() => {
        if (this.parentNode) {
          BX.removeClass(this.parentNode, "loadings");
        }
        this.busy = false;
      }, 0);
    },

    onRequestSuccess: function (response) {
      if (response.status === "success") {
        if (this.action && response.data) {
          let actionUpper = this.action.toUpperCase();

          if (typeof arAsproCounters !== "object") {
            arAsproCounters = {};
          }

          if (typeof arAsproCounters[actionUpper] !== "object") {
            arAsproCounters[actionUpper] = {};
          }

          const data = response.data;
          if ("items" in data) {
            arAsproCounters[actionUpper].ITEMS = data.items;
          }

          if ("count" in data) {
            arAsproCounters[actionUpper].COUNT = data.count;
          }

          if ("title" in data) {
            arAsproCounters[actionUpper].TITLE = data.title;
          }

          // update badges
          if (
            this.class &&
            typeof window[this.class] === "function" &&
            typeof window[this.class].markBadges === "function"
          ) {
            window[this.class].markBadges();
          }

          let state = this.state;

          // mark items
          if (
            this.class &&
            typeof window[this.class] === "function" &&
            typeof window[this.class].markItems === "function"
          ) {
            window[this.class].markItems();
          }

          if (this.isStateChanged()) {
            // show notice
            this.showStateNotice(state);

            if (this.config.fireGoals) {
              // fire goal
              BX.onCustomEvent("onCounterGoals", [
                {
                  goal: this.getStateGoalCode(state),
                  params: {
                    id: this.node.getAttribute("data-item"),
                  },
                },
              ]);
            }
          }

          this.onCompleteEvent();
        }
      } else {
        console.error(response);

        if (this.isStateChanged()) {
          // toggle state back
          this.state = this.prevState;
        }

        // show error notice
        if (typeof JNoticeSurface === "function") {
          let surface = JNoticeSurface.get();
          response.error = this.getMessageFromErrors(response.errors);

          surface.onResultError && surface.onResultError(response);
        }
      }
    },

    onRequestFailure: function (xhr) {
      if (this.isStateChanged()) {
        // toggle state back
        this.state = this.prevState;
      }

      // show error notice
      if (typeof JNoticeSurface === "function") {
        let surface = JNoticeSurface.get();
        xhr.statusText = this.getMessageFromErrors(xhr.errors);

        surface.onRequestError && surface.onRequestError(xhr);
      }
    },

    getMessageFromErrors: function (errors) {
      let messages = [];
      if (errors.length) {
        errors.forEach(error => {
          messages.push(error.message);
        });
      }
      return messages.join("<br>");
    },

    onCompleteEvent: function () {},

    handlers: {
      onClickNode: function (event) {
        if (this.valid && !this.busy) {
          if (!event) {
            event = window.event;
          }

          let target = event.target || event.srcElement;

          if (typeof target !== "undefined" && target) {
            this.busy = true;

            this.node.blur();

            this.prevState = this.state;
            this.state = !this.state;

            this.sendRequest();
          }
        }
      },
    },
  };

  JItemAction.checkItemAction = function (node) {
    return node.itemAction && node.itemAction instanceof JItemAction;
  };

  JItemAction.getItemAction = function (node) {
    return node.itemAction;
  };

  // factory: returns a concrete JItemAction instance
  JItemAction.factory = function (node, config) {
    if (typeof node === "object" && node && node instanceof Node) {
      if (JItemAction.checkItemAction(node)) {
        return JItemAction.getItemAction(node);
      } else {
        let action = (node.getAttribute("data-action") || "").trim();
        if (action) {
          let actionCapitalize = action.replace(/^\w/, c => c.toUpperCase());
          let className = "JItemAction" + actionCapitalize;
          if (typeof window[className] === "function") {
            return new window[className](node, config);
          }
        }
      }
    }

    return new window.JItemAction(node, config);
  };

  // class JItemActionFavorite
  JItemActionFavorite = function (node, config) {
    JItemAction.apply(this, arguments);
  };

  JItemActionFavorite.prototype = Object.create(JItemAction.prototype);
  JItemActionFavorite.prototype.constructor = JItemActionFavorite;
  Object.defineProperties(JItemActionFavorite.prototype, {
    action: {
      get() {
        return "favorite";
      },
    },
  });

  JItemActionFavorite.prototype.getStateGoalCode = function (state) {
    return "goal_wish" + (state ? "_add" : "_remove");
  };

  // set current count into badges
  JItemActionFavorite.markBadges = function () {
    if (
      typeof arAsproCounters === "object" &&
      arAsproCounters &&
      typeof arAsproCounters.FAVORITE === "object" &&
      arAsproCounters.FAVORITE &&
      typeof arAsproCounters.FAVORITE.COUNT !== "undefined"
    ) {
      let blocks = Array.prototype.slice.call(document.querySelectorAll(".basket-link.delay .js-count"));
      if (blocks.length) {
        for (let i in blocks) {
          blocks[i].textContent = arAsproCounters.FAVORITE.COUNT;
          if (arAsproCounters.FAVORITE.COUNT > 0) {
            BX.removeClass(blocks[i], "empted");
            BX.addClass(blocks[i].closest(".basket-link.delay"), "basket-count");
            BX.removeClass(blocks[i].closest(".basket-link.delay"), "counter-state--empty");
          } else {
            BX.addClass(blocks[i], "empted");
            BX.removeClass(blocks[i].closest(".basket-link.delay"), "basket-count");
            BX.addClass(blocks[i].closest(".basket-link.delay"), "counter-state--empty");
          }
        }
      }
    }
  };

  // setup active state for all current items
  JItemActionFavorite.markItems = function () {
    if (
      typeof arAsproCounters === "object" &&
      arAsproCounters &&
      typeof arAsproCounters.FAVORITE === "object" &&
      arAsproCounters.FAVORITE &&
      typeof arAsproCounters.FAVORITE.ITEMS === "object" &&
      arAsproCounters.FAVORITE.ITEMS
    ) {
      let blocks = Array.prototype.slice.call(
        document.querySelectorAll('.js-item-action.added.in[data-action="favorite"]')
      );
      if (blocks.length) {
        for (let y in blocks) {
          let id = BX.data(blocks[y], "item");
          if (id) {
            if (!arAsproCounters.FAVORITE.ITEMS[id] || BX.data(blocks[y], "offers") === "Y") {
              let itemAction = JItemAction.checkItemAction(blocks[y]) ? JItemAction.getItemAction(blocks[y]) : "";

              if (BX.data(blocks[y], "offers") === "Y") {
                if (itemAction && itemAction.isItemChanged()) {
                  itemAction = new this(blocks[y]);
                }
              }

              if (!itemAction) {
                itemAction = new this(blocks[y]);
              }

              itemAction.state = false;
            }
          }
        }
      }

      if (arAsproCounters.FAVORITE.ITEMS) {
        for (let i in arAsproCounters.FAVORITE.ITEMS) {
          let id = arAsproCounters.FAVORITE.ITEMS[i];
          let blocks = Array.prototype.slice.call(
            document.querySelectorAll('.js-item-action[data-action="favorite"][data-item="' + id + '"]:not(.added.in)')
          );

          if (blocks.length) {
            for (let y in blocks) {
              let itemAction = JItemAction.checkItemAction(blocks[y])
                ? JItemAction.getItemAction(blocks[y])
                : new this(blocks[y]);
              itemAction.state = true;
            }
          }
        }
      }
    }
  };

  JItemAction.actual = function () {
    if (typeof JItemActionFavorite === "function") {
      JItemActionFavorite.markItems();
      JItemActionFavorite.markBadges();
    }
  };

  // bind handler for click on .js-item-action
  BX.bindDelegate(
    document,
    "click",
    {
      class: "js-item-action",
    },
    function (event) {
      if (!event) {
        event = window.event;
      }

      BX.PreventDefault(event);

      let target = event.target || event.srcElement;

      if (typeof target !== "undefined" && target) {
        if (!target.closest(".opt_action")) {
          JItemAction.factory(this).fireEvent(event);
        }
      }
    }
  );

  // on complete loading content by ajax
  BX.addCustomEvent("onCompleteAction", function (eventdata) {
    try {
      if (eventdata.action === "ajaxContentLoaded") {
        JItemAction.actual();
      }
    } catch (e) {
      console.error(e);
    }
  });

  BX.addCustomEvent("onSetBasketStatusBtn", function (eventdata) {
    JItemAction.actual();
  });

  BX.addCustomEvent("onSetItemButtonStatus", function (eventdata) {
    JItemAction.actual();
  });

  BX.addCustomEvent("onAjaxResponesTabs", function (eventdata) {
    JItemAction.actual();
  });

  BX.addCustomEvent("onFinalActionSKUInfo", function (eventdata) {
    JItemAction.actual();
  });

  /* 
  // set current items states
  readyDOM(function () {
    JItemAction.actual();
  }); */
}
