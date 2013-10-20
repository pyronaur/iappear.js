(function() {
  jQuery(function() {
    $.iappear = function(element, iScroll, options) {
      var on_scroll, self;
      if (typeof iScroll !== "object" || iScroll.version === null) {
        throw new Error("iScroll5 or greater is reqired for this plugin to work.");
        return this;
      }
      this.opts = {};
      this.$element = $(element);
      this.element = this.$element.get(0);
      this.$window = $(window);
      this.location = -1;
      this.position = -1;
      self = this;
      this.status = false;
      this.appeared = false;
      this.disappeared = false;
      this.get_conv_axis = function() {
        if (this.opts.axis === "y") {
          return "top";
        } else {
          return "left";
        }
      };
      this.update_location = function() {
        var axis, loc;
        axis = this.get_conv_axis();
        loc = this.$element.position();
        return this.location = loc[axis];
      };
      this.gather_dimensions = function() {
        return this.dimensions = {
          window: {
            x: this.$window.width(),
            y: this.$window.height()
          },
          element: {
            x: this.$element.outerWidth(),
            y: this.$element.outerHeight()
          }
        };
      };
      this.update_position = function() {
        var pos;
        pos = iScroll.getComputedPosition()[this.opts.axis];
        this.position = pos + this.opts.offset;
        this.maybe_update_visibility();
        return this.position;
      };
      this.is_visible = function() {
        var el, win;
        win = this.dimensions.window[this.opts.axis];
        el = this.dimensions.element[this.opts.axis];
        if (this.location >= this.position && (this.location + el) <= (this.position + win)) {
          return true;
        } else {
          return false;
        }
      };
      on_scroll = function() {
        var axis, pos;
        axis = self.opts.axis;
        pos = this[axis] >> 0;
        self.position = pos;
        self.maybe_update_visibility();
        return pos;
      };
      this.maybe_update_visibility = function() {
        var visible;
        visible = this.is_visible();
        if (this.status !== visible) {
          this.update_status(visible);
        }
        return visible;
      };
      this.update_status = function(status) {
        if (status == null) {
          status = false;
        }
        if (this.status === status) {
          throw new Error("Status was already " + status);
          return;
        }
        this.status = status;
        if (status === true) {
          if (this.appeared === false) {
            if (this.opts.once === true) {
              this.appeared = true;
            }
            return this.opts.on_appear();
          }
        } else {
          if (this.disappeared === false) {
            if (this.opts.once === true) {
              this.disappeared = true;
            }
            return this.opts.on_disappear();
          }
        }
      };
      this.init = function() {
        this.opts = $.extend({}, this.defaults, options);
        this.gather_dimensions();
        this.update_location();
        this.update_position();
        iScroll.on("scroll", on_scroll);
        iScroll.on("scrollEnd", on_scroll);
        iScroll.on("refresh", this.gather_dimensions);
        return iScroll.on("refresh", this.update_position);
      };
      this.init();
      return this;
    };
    $.iappear.prototype.defaults = {
      on_appear: function() {},
      on_disappear: function() {},
      once: true,
      offset: 0,
      axis: "y"
    };
    return $.fn.iappear = function(iScroll, options) {
      return this.each(function() {
        var plugin;
        if ($(this).data('iappear') === void 0) {
          plugin = new $.iappear(this, iScroll, options);
          return $(this).data('iappear', plugin);
        }
      });
    };
  });

}).call(this);
