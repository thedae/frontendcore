!function(a, b) {
    "use strict";
    function c(b) {
        b = a.extend({}, O, b || {}), null === K && (K = a("body"));
        for (var c = a(this), e = 0, f = c.length; f > e; e++) d(c.eq(e), b);
        return c;
    }
    function d(b, c) {
        if (!b.hasClass("autocompleter-node")) {
            c = a.extend({}, c, b.data("autocompleter-options")), "string" != typeof c.source || ".json" !== c.source.slice(-5) && c.asLocal !== !0 || a.ajax({
                url: c.source,
                type: "GET",
                dataType: "json",
                async: !1
            }).done(function(a) {
                c.source = a;
            });
            var d = '<div class="autocompleter ' + c.customClass.join(" ") + '" id="autocompleter-' + (D + 1) + '">';
            c.hint && (d += '<div class="autocompleter-hint"></div>'), d += '<ul class="autocompleter-list"></ul>', 
            d += "</div>", b.addClass("autocompleter-node").after(d);
            var e = b.next(".autocompleter").eq(0), f = b.attr("autocomplete");
            b.attr("autocomplete", "off");
            var g = a.extend({
                $node: b,
                $autocompleter: e,
                $selected: null,
                $list: null,
                index: -1,
                hintText: !1,
                source: !1,
                jqxhr: !1,
                response: null,
                focused: !1,
                query: "",
                originalAutocomplete: f,
                guid: D++
            }, c);
            g.$autocompleter.on("mousedown.autocompleter", ".autocompleter-item", g, s).data("autocompleter", g), 
            g.$node.on("keyup.autocompleter", g, k).on("keydown.autocompleter", g, l).on("focus.autocompleter", g, m).on("blur.autocompleter", g, n).on("mousedown.autocompleter", g, o);
        }
    }
    function e(a, b, c) {
        var d = [];
        if (a = a.toUpperCase(), b.length) for (var e = 0; 2 > e; e++) for (var f in b) if (d.length < c.limit) {
            var g = c.customLabel && b[f][c.customLabel] ? b[f][c.customLabel] : b[f].label;
            switch (e) {
              case 0:
                0 === g.toUpperCase().search(a) && (d.push(b[f]), delete b[f]);
                break;

              case 1:
                -1 !== g.toUpperCase().search(a) && (d.push(b[f]), delete b[f]);
            }
        }
        return d;
    }
    function f(b) {
        return clearTimeout(L), b.query = a.trim(b.$node.val()), !b.empty && 0 === b.query.length || b.minLength && b.query.length < b.minLength ? void h(b) : void (b.delay ? L = setTimeout(function() {
            g(b);
        }, b.delay) : g(b));
    }
    function g(b) {
        if ("object" == typeof b.source) {
            h(b);
            var c = e(b.query, C(b.source), b);
            c.length && i(c, b);
        } else {
            b.jqxhr && b.jqxhr.abort();
            var d = a.extend({
                limit: b.limit,
                query: b.query
            }, b.combine());
            b.jqxhr = a.ajax({
                url: b.source,
                dataType: "json",
                data: d,
                beforeSend: function(a) {
                    if (b.$autocompleter.addClass("autocompleter-ajax"), h(b), b.cache) {
                        var c = z(this.url);
                        c && (a.abort(), i(c, b));
                    }
                }
            }).done(function(a) {
                b.offset && (a = x(a, b.offset)), b.cache && y(this.url, a), i(a, b);
            }).always(function() {
                b.$autocompleter.removeClass("autocompleter-ajax");
            });
        }
    }
    function h(a) {
        a.response = null, a.$list = null, a.$selected = null, a.index = 0, a.$autocompleter.find(".autocompleter-list").empty(), 
        a.$autocompleter.find(".autocompleter-hint").removeClass("autocompleter-hint-show").empty(), 
        a.hintText = !1, r(null, a);
    }
    function i(a, b) {
        j(a, b), b.$autocompleter.hasClass("autocompleter-focus") && p(null, b);
    }
    function j(b, c) {
        for (var d = "", e = 0, f = b.length; f > e; e++) {
            var g = [ "autocompleter-item" ];
            c.selectFirst && 0 === e && !c.changeWhenSelect && g.push("autocompleter-item-selected");
            var h = new RegExp(c.query, "gi"), i = c.customLabel && b[e][c.customLabel] ? b[e][c.customLabel] : b[e].label, j = i;
            i = c.highlightMatches ? i.replace(h, "<strong>$&</strong>") : i;
            var k = c.customValue && b[e][c.customValue] ? b[e][c.customValue] : b[e].value;
            if (c.template) {
                var l = c.template.replace(/({{ label }})/gi, i);
                for (var m in b[e]) if (b[e].hasOwnProperty(m)) {
                    var n = new RegExp("{{ " + m + " }}", "gi");
                    l = l.replace(n, b[e][m]);
                }
                i = l;
            }
            d += k ? '<li data-value="' + k + '" data-label="' + j + '" class="' + g.join(" ") + '">' + i + "</li>" : '<li data-label="' + j + '" class="' + g.join(" ") + '">' + i + "</li>";
        }
        if (b.length && c.hint) {
            var o = b[0].label.substr(0, c.query.length).toUpperCase() === c.query.toUpperCase() ? b[0].label : !1;
            if (o && c.query !== b[0].label) {
                var p = new RegExp(c.query, "i"), q = o.replace(p, "<span>" + c.query + "</span>");
                c.$autocompleter.find(".autocompleter-hint").addClass("autocompleter-hint-show").html(q), 
                c.hintText = q;
            }
        }
        c.response = b, c.$autocompleter.find(".autocompleter-list").html(d), c.$selected = c.$autocompleter.find(".autocompleter-item-selected").length ? c.$autocompleter.find(".autocompleter-item-selected") : null, 
        c.$list = b.length ? c.$autocompleter.find(".autocompleter-item") : null, c.index = c.$selected ? c.$list.index(c.$selected) : -1, 
        c.$autocompleter.find(".autocompleter-item").each(function(b, d) {
            a(d).data(c.response[b]);
        });
    }
    function k(b) {
        var c = b.data, d = b.keyCode ? b.keyCode : b.which;
        if (40 !== d && 38 !== d || !c.$autocompleter.hasClass("autocompleter-show")) -1 === a.inArray(d, E) && -1 === a.inArray(d, c.ignoredKeyCode) && f(c); else {
            var e, g, h = c.$list.length;
            h && (h > 1 ? c.index === h - 1 ? (e = c.changeWhenSelect ? -1 : 0, g = c.index - 1) : 0 === c.index ? (e = c.index + 1, 
            g = c.changeWhenSelect ? -1 : h - 1) : -1 === c.index ? (e = 0, g = h - 1) : (e = c.index + 1, 
            g = c.index - 1) : -1 === c.index ? (e = 0, g = 0) : (g = -1, e = -1), c.index = 40 === d ? e : g, 
            c.$list.removeClass("autocompleter-item-selected"), -1 !== c.index && c.$list.eq(c.index).addClass("autocompleter-item-selected"), 
            c.$selected = c.$autocompleter.find(".autocompleter-item-selected").length ? c.$autocompleter.find(".autocompleter-item-selected") : null, 
            c.changeWhenSelect && u(c));
        }
    }
    function l(a) {
        var b = a.keyCode ? a.keyCode : a.which, c = a.data;
        if (40 === b || 38 === b) a.preventDefault(), a.stopPropagation(); else if (39 === b) {
            if (c.hint && c.hintText && c.$autocompleter.find(".autocompleter-hint").hasClass("autocompleter-hint-show")) {
                a.preventDefault(), a.stopPropagation();
                var d = c.$autocompleter.find(".autocompleter-item").length ? c.$autocompleter.find(".autocompleter-item").eq(0).attr("data-label") : !1;
                d && (c.query = d, t(c));
            }
        } else 13 === b && c.$autocompleter.hasClass("autocompleter-show") && c.$selected && s(a);
    }
    function m(a, b) {
        if (!b) {
            var c = a.data;
            c.$autocompleter.addClass("autocompleter-focus"), c.$node.prop("disabled") || c.$autocompleter.hasClass("autocompleter-show") || c.focusOpen && (f(c), 
            c.focused = !0, setTimeout(function() {
                c.focused = !1;
            }, 500));
        }
    }
    function n(a, b) {
        a.preventDefault(), a.stopPropagation();
        var c = a.data;
        b || (c.$autocompleter.removeClass("autocompleter-focus"), r(a));
    }
    function o(c) {
        if ("mousedown" !== c.type || -1 === a.inArray(c.which, [ 2, 3 ])) {
            var d = c.data;
            if (d.$list && !d.focused && !d.$node.is(":disabled")) if (I && !J) {
                var e = d.$select[0];
                if (b.document.createEvent) {
                    var f = b.document.createEvent("MouseEvents");
                    f.initMouseEvent("mousedown", !1, !0, b, 0, 0, 0, 0, 0, !1, !1, !1, !1, 0, null), 
                    e.dispatchEvent(f);
                } else e.fireEvent && e.fireEvent("onmousedown");
            } else d.$autocompleter.hasClass("autocompleter-closed") ? p(c) : d.$autocompleter.hasClass("autocompleter-show") && r(c);
        }
    }
    function p(a, b) {
        var c = a ? a.data : b;
        !c.$node.prop("disabled") && !c.$autocompleter.hasClass("autocompleter-show") && c.$list && c.$list.length && (c.$autocompleter.removeClass("autocompleter-closed").addClass("autocompleter-show"), 
        K.on("click.autocompleter-" + c.guid, ":not(.autocompleter-item)", c, q));
    }
    function q(b) {
        a(b.target).hasClass("autocompleter-node") || 0 === a(b.currentTarget).parents(".autocompleter").length && r(b);
    }
    function r(a, b) {
        var c = a ? a.data : b;
        c.$autocompleter.hasClass("autocompleter-show") && (c.$autocompleter.removeClass("autocompleter-show").addClass("autocompleter-closed"), 
        K.off(".autocompleter-" + c.guid));
    }
    function s(b) {
        if ("mousedown" !== b.type || -1 === a.inArray(b.which, [ 2, 3 ])) {
            var c = b.data;
            b.preventDefault(), b.stopPropagation(), "mousedown" === b.type && a(this).length && (c.$selected = a(this), 
            c.index = c.$list.index(c.$selected)), c.$node.prop("disabled") || (r(b), v(c), 
            "click" === b.type && c.$node.trigger("focus", [ !0 ]));
        }
    }
    function t(a) {
        u(a), w(a), f(a);
    }
    function u(a) {
        if (a.$selected) {
            a.hintText && a.$autocompleter.find(".autocompleter-hint").hasClass("autocompleter-hint-show") && a.$autocompleter.find(".autocompleter-hint").removeClass("autocompleter-hint-show");
            var b = a.$selected.attr("data-value") ? a.$selected.attr("data-value") : a.$selected.attr("data-label");
            a.$node.val(b);
        } else a.hintText && !a.$autocompleter.find(".autocompleter-hint").hasClass("autocompleter-hint-show") && a.$autocompleter.find(".autocompleter-hint").addClass("autocompleter-hint-show"), 
        a.$node.val(a.query);
    }
    function v(a) {
        u(a), w(a), h(a);
    }
    function w(a) {
        a.callback.call(a.$autocompleter, a.$node.val(), a.index, a.response[a.index]), 
        a.$node.trigger("change");
    }
    function x(a, b) {
        for (b = b.split("."); a && b.length; ) a = a[b.shift()];
        return a;
    }
    function y(a, b) {
        if (N && a && b) {
            Q[a] = {
                value: b
            };
            try {
                localStorage.setItem(M, JSON.stringify(Q));
            } catch (c) {
                var d = c.code || c.number || c.message;
                if (22 !== d) throw c;
                B();
            }
        }
    }
    function z(a) {
        if (a) {
            var b = Q[a] && Q[a].value ? Q[a].value : !1;
            return b;
        }
    }
    function A() {
        return N ? JSON.parse(localStorage.getItem(M) || "{}") : void 0;
    }
    function B() {
        try {
            localStorage.removeItem(M), Q = A();
        } catch (a) {
            throw a;
        }
    }
    function C(a) {
        if (null === a || "object" != typeof a) return a;
        var b = a.constructor();
        for (var c in a) a.hasOwnProperty(c) && (b[c] = a[c]);
        return b;
    }
    var D = 0, E = [ 9, 13, 17, 19, 20, 27, 33, 34, 35, 36, 37, 39, 44, 92, 113, 114, 115, 118, 119, 120, 122, 123, 144, 145 ], F = [ "source", "empty", "limit", "cache", "focusOpen", "selectFirst", "changeWhenSelect", "highlightMatches", "ignoredKeyCode", "customLabel", "customValue", "template", "offset", "combine", "callback", "minLength", "delay" ], G = b.navigator.userAgent || b.navigator.vendor || b.opera, H = /Firefox/i.test(G), I = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(G), J = H && I, K = null, L = null, M = "autocompleterCache", N = function() {
        var a = "undefined" != typeof b.localStorage;
        if (a) try {
            localStorage.setItem("autocompleter", "autocompleter"), localStorage.removeItem("autocompleter");
        } catch (c) {
            a = !1;
        }
        return a;
    }(), O = {
        source: null,
        asLocal: !1,
        empty: !0,
        limit: 10,
        minLength: 0,
        delay: 0,
        customClass: [],
        cache: !0,
        focusOpen: !0,
        hint: !1,
        selectFirst: !1,
        changeWhenSelect: !0,
        highlightMatches: !1,
        ignoredKeyCode: [],
        customLabel: !1,
        customValue: !1,
        template: !1,
        offset: !1,
        combine: a.noop,
        callback: a.noop
    }, P = {
        defaults: function(b) {
            return O = a.extend(O, b || {}), "object" == typeof this ? a(this) : !0;
        },
        option: function(b) {
            return a(this).each(function(c, d) {
                var e = a(d).next(".autocompleter").data("autocompleter");
                for (var f in b) -1 !== a.inArray(f, F) && (e[f] = b[f]);
            });
        },
        open: function() {
            return a(this).each(function(b, c) {
                var d = a(c).next(".autocompleter").data("autocompleter");
                d && p(null, d);
            });
        },
        close: function() {
            return a(this).each(function(b, c) {
                var d = a(c).next(".autocompleter").data("autocompleter");
                d && r(null, d);
            });
        },
        clearCache: function() {
            B();
        },
        destroy: function() {
            return a(this).each(function(b, c) {
                var d = a(c).next(".autocompleter").data("autocompleter");
                d && (d.jqxhr && d.jqxhr.abort(), d.$autocompleter.hasClass("open") && d.$autocompleter.find(".autocompleter-selected").trigger("click.autocompleter"), 
                d.originalAutocomplete ? d.$node.attr("autocomplete", d.originalAutocomplete) : d.$node.removeAttr("autocomplete"), 
                d.$node.off(".autocompleter").removeClass("autocompleter-node"), d.$autocompleter.off(".autocompleter").remove());
            });
        }
    }, Q = A();
    a.fn.autocompleter = function(a) {
        return P[a] ? P[a].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof a && a ? this : c.apply(this, arguments);
    }, a.autocompleter = function(a) {
        "defaults" === a ? P.defaults.apply(this, Array.prototype.slice.call(arguments, 1)) : "clearCache" === a && P.clearCache.apply(this, null);
    };
}(jQuery, window), function(a, b, c, d, e, f) {
    "use strict";
    e.define("autocomplete", [], function() {
        return {
            sPathCss: c.sPathCssUI + "?v=" + c.sHash,
            oDefault: {
                limit: 12
            },
            onStart: function() {
                var a = d.getDataModules("autocomplete"), b = this;
                d.loadCSS(this.sPathCss), d.trackModule("JS_Libraries", "call", "autocomplete"), 
                f(a).each(function() {
                    b.autobind(this);
                });
            },
            autobind: function(a, b) {
                var c, e, g = this, h = {}, i = f(a), j = a.getAttribute("data-fc-values"), k = {};
                if (h.source = [], void 0 === b && null !== j) {
                    e = a.getAttribute("data-fc-values").split(",");
                    for (var l = 0; e.length > l; l++) k = {}, k.value = e[l], k.label = e[l], h.source.push(k), 
                    h.source.push(k);
                }
                c = d.mergeOptions(g.oDefault, h), i.autocompleter(c);
            },
            onStop: function() {
                this.sPathCss = null, this.oDefault = null;
            },
            onDestroy: function() {
                delete this.sPathCss, delete this.oDefault;
            }
        };
    });
}(window, document, oGlobalSettings, FrontendTools, FrontendCore, $);