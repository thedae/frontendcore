var Twig = function(a) {
    return a.VERSION = "0.8.4", a;
}(Twig || {}), Twig = function(a) {
    "use strict";
    function b(a, b) {
        var c = Object.prototype.toString.call(b).slice(8, -1);
        return void 0 !== b && null !== b && c === a;
    }
    function c(b, c) {
        var d, e, f, g = "/", h = [];
        if (b.url) d = "undefined" != typeof b.base ? b.base + ("/" === b.base.charAt(b.base.length - 1) ? "" : "/") : b.url; else {
            if (!b.path) throw new a.Error("Cannot extend an inline template.");
            var i = require("path"), j = i.sep || g, k = new RegExp("^\\.{1,2}" + j.replace("\\", "\\\\"));
            c = c.replace(/\//g, j), void 0 !== b.base && null == c.match(k) ? (c = c.replace(b.base, ""), 
            d = b.base + j) : d = b.path, d = d.replace(j + j, j), g = j;
        }
        for (e = d.split(g), e.pop(), e = e.concat(c.split(g)); e.length > 0; ) f = e.shift(), 
        "." == f || (".." == f && h.length > 0 && ".." != h[h.length - 1] ? h.pop() : h.push(f));
        return h.join(g);
    }
    return a.trace = !1, a.debug = !1, a.cache = !0, a.placeholders = {
        parent: "{{|PARENT|}}"
    }, a.indexOf = function(a, b) {
        if (Array.prototype.hasOwnProperty("indexOf")) return a.indexOf(b);
        if (void 0 === a || null === a) throw new TypeError();
        var c = Object(a), d = c.length >>> 0;
        if (0 === d) return -1;
        var e = 0;
        if (arguments.length > 0 && (e = Number(arguments[1]), e !== e ? e = 0 : 0 !== e && e !== 1 / 0 && e !== -(1 / 0) && (e = (e > 0 || -1) * Math.floor(Math.abs(e)))), 
        e >= d) return -1;
        for (var f = e >= 0 ? e : Math.max(d - Math.abs(e), 0); d > f; f++) if (f in c && c[f] === b) return f;
        return a == b ? 0 : -1;
    }, a.forEach = function(a, b, c) {
        if (Array.prototype.forEach) return a.forEach(b, c);
        var d, e;
        if (null == a) throw new TypeError(" this is null or not defined");
        var f = Object(a), g = f.length >>> 0;
        if ("[object Function]" != {}.toString.call(b)) throw new TypeError(b + " is not a function");
        for (c && (d = c), e = 0; g > e; ) {
            var h;
            e in f && (h = f[e], b.call(d, h, e, f)), e++;
        }
    }, a.merge = function(b, c, d) {
        return a.forEach(Object.keys(c), function(a) {
            (!d || a in b) && (b[a] = c[a]);
        }), b;
    }, a.Error = function(a) {
        this.message = a, this.name = "TwigException", this.type = "TwigException";
    }, a.Error.prototype.toString = function() {
        var a = this.name + ": " + this.message;
        return a;
    }, a.log = {
        trace: function() {
            a.trace && console && console.log(Array.prototype.slice.call(arguments));
        },
        debug: function() {
            a.debug && console && console.log(Array.prototype.slice.call(arguments));
        }
    }, "undefined" != typeof console ? "undefined" != typeof console.error ? a.log.error = function() {
        console.error.apply(console, arguments);
    } : "undefined" != typeof console.log && (a.log.error = function() {
        console.log.apply(console, arguments);
    }) : a.log.error = function() {}, a.ChildContext = function(a) {
        var b = function() {};
        return b.prototype = a, new b();
    }, a.token = {}, a.token.type = {
        output: "output",
        logic: "logic",
        comment: "comment",
        raw: "raw"
    }, a.token.definitions = [ {
        type: a.token.type.raw,
        open: "{% raw %}",
        close: "{% endraw %}"
    }, {
        type: a.token.type.raw,
        open: "{% verbatim %}",
        close: "{% endverbatim %}"
    }, {
        type: a.token.type.output,
        open: "{{",
        close: "}}"
    }, {
        type: a.token.type.logic,
        open: "{%",
        close: "%}"
    }, {
        type: a.token.type.comment,
        open: "{#",
        close: "#}"
    } ], a.token.strings = [ '"', "'" ], a.token.findStart = function(b) {
        var c, d, e, f = {
            position: null,
            def: null
        };
        for (c = 0; c < a.token.definitions.length; c++) d = a.token.definitions[c], e = b.indexOf(d.open), 
        a.log.trace("Twig.token.findStart: ", "Searching for ", d.open, " found at ", e), 
        e >= 0 && (null === f.position || e < f.position) && (f.position = e, f.def = d);
        return f;
    }, a.token.findEnd = function(b, c, d) {
        for (var e, f, g = null, h = !1, i = 0, j = null, k = null, l = null, m = null, n = null, o = null; !h; ) {
            if (j = null, k = null, l = b.indexOf(c.close, i), !(l >= 0)) throw new a.Error("Unable to find closing bracket '" + c.close + "' opened near template position " + d);
            if (g = l, h = !0, c.type === a.token.type.comment) break;
            for (f = a.token.strings.length, e = 0; f > e; e += 1) n = b.indexOf(a.token.strings[e], i), 
            n > 0 && l > n && (null === j || j > n) && (j = n, k = a.token.strings[e]);
            if (null !== j) for (m = j + 1, g = null, h = !1; ;) {
                if (o = b.indexOf(k, m), 0 > o) throw "Unclosed string in template";
                if ("\\" !== b.substr(o - 1, 1)) {
                    i = o + 1;
                    break;
                }
                m = o + 1;
            }
        }
        return g;
    }, a.tokenize = function(b) {
        for (var c = [], d = 0, e = null, f = null; b.length > 0; ) e = a.token.findStart(b), 
        a.log.trace("Twig.tokenize: ", "Found token: ", e), null !== e.position ? (e.position > 0 && c.push({
            type: a.token.type.raw,
            value: b.substring(0, e.position)
        }), b = b.substr(e.position + e.def.open.length), d += e.position + e.def.open.length, 
        f = a.token.findEnd(b, e.def, d), a.log.trace("Twig.tokenize: ", "Token ends at ", f), 
        c.push({
            type: e.def.type,
            value: b.substring(0, f).trim()
        }), "logic" === e.def.type && "\n" === b.substr(f + e.def.close.length, 1) && (f += 1), 
        b = b.substr(f + e.def.close.length), d += f + e.def.close.length) : (c.push({
            type: a.token.type.raw,
            value: b
        }), b = "");
        return c;
    }, a.compile = function(b) {
        try {
            for (var c = [], d = [], e = [], f = null, g = null, h = null, i = null, j = null, k = null, l = null, m = null, n = null; b.length > 0; ) {
                switch (f = b.shift(), a.log.trace("Compiling token ", f), f.type) {
                  case a.token.type.raw:
                    d.length > 0 ? e.push(f) : c.push(f);
                    break;

                  case a.token.type.logic:
                    if (g = a.logic.compile.apply(this, [ f ]), l = g.type, m = a.logic.handler[l].open, 
                    n = a.logic.handler[l].next, a.log.trace("Twig.compile: ", "Compiled logic token to ", g, " next is: ", n, " open is : ", m), 
                    void 0 !== m && !m) {
                        if (i = d.pop(), j = a.logic.handler[i.type], a.indexOf(j.next, l) < 0) throw new Error(l + " not expected after a " + i.type);
                        i.output = i.output || [], i.output = i.output.concat(e), e = [], k = {
                            type: a.token.type.logic,
                            token: i
                        }, d.length > 0 ? e.push(k) : c.push(k);
                    }
                    void 0 !== n && n.length > 0 ? (a.log.trace("Twig.compile: ", "Pushing ", g, " to logic stack."), 
                    d.length > 0 && (i = d.pop(), i.output = i.output || [], i.output = i.output.concat(e), 
                    d.push(i), e = []), d.push(g)) : void 0 !== m && m && (k = {
                        type: a.token.type.logic,
                        token: g
                    }, d.length > 0 ? e.push(k) : c.push(k));
                    break;

                  case a.token.type.comment:
                    break;

                  case a.token.type.output:
                    a.expression.compile.apply(this, [ f ]), d.length > 0 ? e.push(f) : c.push(f);
                }
                a.log.trace("Twig.compile: ", " Output: ", c, " Logic Stack: ", d, " Pending Output: ", e);
            }
            if (d.length > 0) throw h = d.pop(), new Error("Unable to find an end tag for " + h.type + ", expecting one of " + h.next);
            return c;
        } catch (o) {
            if (a.log.error("Error compiling twig template " + this.id + ": "), o.stack ? a.log.error(o.stack) : a.log.error(o.toString()), 
            this.options.rethrow) throw o;
        }
    }, a.parse = function(b, c) {
        try {
            var d = [], e = !0, f = this;
            return a.forEach(b, function(b) {
                switch (a.log.debug("Twig.parse: ", "Parsing token: ", b), b.type) {
                  case a.token.type.raw:
                    d.push(a.filters.raw(b.value));
                    break;

                  case a.token.type.logic:
                    var g = b.token, h = a.logic.parse.apply(f, [ g, c, e ]);
                    void 0 !== h.chain && (e = h.chain), void 0 !== h.context && (c = h.context), void 0 !== h.output && d.push(h.output);
                    break;

                  case a.token.type.comment:
                    break;

                  case a.token.type.output:
                    a.log.debug("Twig.parse: ", "Output token: ", b.stack), d.push(a.expression.parse.apply(f, [ b.stack, c ]));
                }
            }), a.output.apply(this, [ d ]);
        } catch (g) {
            if (a.log.error("Error parsing twig template " + this.id + ": "), g.stack ? a.log.error(g.stack) : a.log.error(g.toString()), 
            this.options.rethrow) throw g;
            if (a.debug) return g.toString();
        }
    }, a.prepare = function(b) {
        var c, d;
        return a.log.debug("Twig.prepare: ", "Tokenizing ", b), d = a.tokenize.apply(this, [ b ]), 
        a.log.debug("Twig.prepare: ", "Compiling ", d), c = a.compile.apply(this, [ d ]), 
        a.log.debug("Twig.prepare: ", "Compiled ", c), c;
    }, a.output = function(b) {
        if (!this.options.autoescape) return b.join("");
        var c = [];
        return a.forEach(b, function(b) {
            b && !b.twig_markup && (b = a.filters.escape(b)), c.push(b);
        }), a.Markup(c.join(""));
    }, a.Templates = {
        registry: {}
    }, a.validateId = function(b) {
        if ("prototype" === b) throw new a.Error(b + " is not a valid twig identifier");
        if (a.Templates.registry.hasOwnProperty(b)) throw new a.Error("There is already a template with the ID " + b);
        return !0;
    }, a.Templates.save = function(b) {
        if (void 0 === b.id) throw new a.Error("Unable to save template with no id");
        a.Templates.registry[b.id] = b;
    }, a.Templates.load = function(b) {
        return a.Templates.registry.hasOwnProperty(b) ? a.Templates.registry[b] : null;
    }, a.Templates.loadRemote = function(b, c, d, e) {
        var f = c.id, g = c.method, h = c.async, i = c.precompiled, j = null;
        if (void 0 === h && (h = !0), void 0 === f && (f = b), c.id = f, a.cache && a.Templates.registry.hasOwnProperty(f)) return d && d(a.Templates.registry[f]), 
        a.Templates.registry[f];
        if ("ajax" == g) {
            if ("undefined" == typeof XMLHttpRequest) throw new a.Error("Unsupported platform: Unable to do remote requests because there is no XMLHTTPRequest implementation");
            var k = new XMLHttpRequest();
            k.onreadystatechange = function() {
                var f = null;
                4 == k.readyState && (200 == k.status ? (a.log.debug("Got template ", k.responseText), 
                f = i === !0 ? JSON.parse(k.responseText) : k.responseText, c.url = b, c.data = f, 
                j = new a.Template(c), d && d(j)) : e && e(k));
            }, k.open("GET", b, h), k.send();
        } else !function() {
            var f = require("fs"), g = (require("path"), null), k = function(f, g) {
                return f ? void (e && e(f)) : (i === !0 && (g = JSON.parse(g)), c.data = g, c.path = b, 
                j = new a.Template(c), void (d && d(j)));
            };
            if (h === !0) f.stat(b, function(c, d) {
                if (c || !d.isFile()) throw new a.Error("Unable to find template file " + b);
                f.readFile(b, "utf8", k);
            }); else {
                if (!f.statSync(b).isFile()) throw new a.Error("Unable to find template file " + b);
                g = f.readFileSync(b, "utf8"), k(void 0, g);
            }
        }();
        return h === !1 ? j : !0;
    }, a.Template = function(c) {
        var d = c.data, e = c.id, f = c.blocks, g = c.macros || {}, h = c.base, i = c.path, j = c.url, k = c.options;
        this.id = e, this.base = h, this.path = i, this.url = j, this.macros = g, this.options = k, 
        this.reset(f), b("String", d) ? this.tokens = a.prepare.apply(this, [ d ]) : this.tokens = d, 
        void 0 !== e && a.Templates.save(this);
    }, a.Template.prototype.reset = function(b) {
        a.log.debug("Twig.Template.reset", "Reseting template " + this.id), this.blocks = {}, 
        this.importedBlocks = [], this.originalBlockTokens = {}, this.child = {
            blocks: b || {}
        }, this.extend = null;
    }, a.Template.prototype.render = function(b, d) {
        d = d || {};
        var e, f;
        if (this.context = b || {}, this.reset(), d.blocks && (this.blocks = d.blocks), 
        d.macros && (this.macros = d.macros), e = a.parse.apply(this, [ this.tokens, this.context ]), 
        this.extend) {
            var g;
            return this.options.allowInlineIncludes && (g = a.Templates.load(this.extend), g && (g.options = this.options)), 
            g || (f = c(this, this.extend), g = a.Templates.loadRemote(f, {
                method: this.url ? "ajax" : "fs",
                base: this.base,
                async: !1,
                id: f,
                options: this.options
            })), this.parent = g, this.parent.render(this.context, {
                blocks: this.blocks
            });
        }
        return "blocks" == d.output ? this.blocks : "macros" == d.output ? this.macros : e;
    }, a.Template.prototype.importFile = function(b) {
        var d, e;
        if (!this.url && !this.path && this.options.allowInlineIncludes) {
            if (e = a.Templates.load(b), e.options = this.options, e) return e;
            throw new a.Error("Didn't find the inline template by id");
        }
        return d = c(this, b), e = a.Templates.loadRemote(d, {
            method: this.url ? "ajax" : "fs",
            base: this.base,
            async: !1,
            options: this.options,
            id: d
        });
    }, a.Template.prototype.importBlocks = function(b, c) {
        var d = this.importFile(b), e = this.context, f = this;
        c = c || !1, d.render(e), a.forEach(Object.keys(d.blocks), function(a) {
            (c || void 0 === f.blocks[a]) && (f.blocks[a] = d.blocks[a], f.importedBlocks.push(a));
        });
    }, a.Template.prototype.compile = function(b) {
        return a.compiler.compile(this, b);
    }, a.Markup = function(a) {
        return "string" == typeof a && a.length > 0 && (a = new String(a), a.twig_markup = !0), 
        a;
    }, a;
}(Twig || {});

!function() {
    "use strict";
    String.prototype.trim || (String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, "");
    }), Object.keys || (Object.keys = function(a) {
        if (a !== Object(a)) throw new TypeError("Object.keys called on non-object");
        var b, c = [];
        for (b in a) Object.prototype.hasOwnProperty.call(a, b) && c.push(b);
        return c;
    });
}();

var Twig = function(a) {
    a.lib = {};
    var b = function() {
        function a() {
            var b = arguments[0], c = a.cache;
            return c[b] && c.hasOwnProperty(b) || (c[b] = a.parse(b)), a.format.call(null, c[b], arguments);
        }
        function b(a) {
            return Object.prototype.toString.call(a).slice(8, -1).toLowerCase();
        }
        function c(a, b) {
            return Array(b + 1).join(a);
        }
        var d = {
            not_string: /[^s]/,
            number: /[diefg]/,
            json: /[j]/,
            not_json: /[^j]/,
            text: /^[^\x25]+/,
            modulo: /^\x25{2}/,
            placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/,
            key: /^([a-z_][a-z_\d]*)/i,
            key_access: /^\.([a-z_][a-z_\d]*)/i,
            index_access: /^\[(\d+)\]/,
            sign: /^[\+\-]/
        };
        a.format = function(e, f) {
            var g, h, i, j, k, l, m, n = 1, o = e.length, p = "", q = [], r = !0, s = "";
            for (h = 0; o > h; h++) if (p = b(e[h]), "string" === p) q[q.length] = e[h]; else if ("array" === p) {
                if (j = e[h], j[2]) for (g = f[n], i = 0; i < j[2].length; i++) {
                    if (!g.hasOwnProperty(j[2][i])) throw new Error(a("[sprintf] property '%s' does not exist", j[2][i]));
                    g = g[j[2][i]];
                } else g = j[1] ? f[j[1]] : f[n++];
                if ("function" == b(g) && (g = g()), d.not_string.test(j[8]) && d.not_json.test(j[8]) && "number" != b(g) && isNaN(g)) throw new TypeError(a("[sprintf] expecting number but found %s", b(g)));
                switch (d.number.test(j[8]) && (r = g >= 0), j[8]) {
                  case "b":
                    g = g.toString(2);
                    break;

                  case "c":
                    g = String.fromCharCode(g);
                    break;

                  case "d":
                  case "i":
                    g = parseInt(g, 10);
                    break;

                  case "j":
                    g = JSON.stringify(g, null, j[6] ? parseInt(j[6]) : 0);
                    break;

                  case "e":
                    g = j[7] ? g.toExponential(j[7]) : g.toExponential();
                    break;

                  case "f":
                    g = j[7] ? parseFloat(g).toFixed(j[7]) : parseFloat(g);
                    break;

                  case "g":
                    g = j[7] ? parseFloat(g).toPrecision(j[7]) : parseFloat(g);
                    break;

                  case "o":
                    g = g.toString(8);
                    break;

                  case "s":
                    g = (g = String(g)) && j[7] ? g.substring(0, j[7]) : g;
                    break;

                  case "u":
                    g >>>= 0;
                    break;

                  case "x":
                    g = g.toString(16);
                    break;

                  case "X":
                    g = g.toString(16).toUpperCase();
                }
                d.json.test(j[8]) ? q[q.length] = g : (!d.number.test(j[8]) || r && !j[3] ? s = "" : (s = r ? "+" : "-", 
                g = g.toString().replace(d.sign, "")), l = j[4] ? "0" === j[4] ? "0" : j[4].charAt(1) : " ", 
                m = j[6] - (s + g).length, k = j[6] && m > 0 ? c(l, m) : "", q[q.length] = j[5] ? s + g + k : "0" === l ? s + k + g : k + s + g);
            }
            return q.join("");
        }, a.cache = {}, a.parse = function(a) {
            for (var b = a, c = [], e = [], f = 0; b; ) {
                if (null !== (c = d.text.exec(b))) e[e.length] = c[0]; else if (null !== (c = d.modulo.exec(b))) e[e.length] = "%"; else {
                    if (null === (c = d.placeholder.exec(b))) throw new SyntaxError("[sprintf] unexpected placeholder");
                    if (c[2]) {
                        f |= 1;
                        var g = [], h = c[2], i = [];
                        if (null === (i = d.key.exec(h))) throw new SyntaxError("[sprintf] failed to parse named argument key");
                        for (g[g.length] = i[1]; "" !== (h = h.substring(i[0].length)); ) if (null !== (i = d.key_access.exec(h))) g[g.length] = i[1]; else {
                            if (null === (i = d.index_access.exec(h))) throw new SyntaxError("[sprintf] failed to parse named argument key");
                            g[g.length] = i[1];
                        }
                        c[2] = g;
                    } else f |= 2;
                    if (3 === f) throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
                    e[e.length] = c;
                }
                b = b.substring(c[0].length);
            }
            return e;
        };
        var e = function(b, c, d) {
            return d = (c || []).slice(0), d.splice(0, 0, b), a.apply(null, d);
        };
        return {
            sprintf: a,
            vsprintf: e
        };
    }(), c = b.sprintf, d = b.vsprintf;
    return a.lib.sprintf = c, a.lib.vsprintf = d, function() {
        function b(a) {
            return (a = Math.abs(a) % 100) % 10 == 1 && 11 != a ? "st" : a % 10 == 2 && 12 != a ? "nd" : a % 10 == 3 && 13 != a ? "rd" : "th";
        }
        function c(a) {
            var b = new Date(a.getFullYear() + 1, 0, 4);
            return 7 > (b - a) / 864e5 && (a.getDay() + 6) % 7 < (b.getDay() + 6) % 7 ? b.getFullYear() : a.getMonth() > 0 || a.getDate() >= 4 ? a.getFullYear() : a.getFullYear() - ((a.getDay() + 6) % 7 - a.getDate() > 2 ? 1 : 0);
        }
        function d(a) {
            var b = new Date(c(a), 0, 4);
            return b.setDate(b.getDate() - (b.getDay() + 6) % 7), parseInt((a - b) / 6048e5) + 1;
        }
        var e = "Sun,Mon,Tue,Wed,Thu,Fri,Sat".split(","), f = "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","), g = "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","), h = "January,February,March,April,May,June,July,August,September,October,November,December".split(",");
        a.lib.formatDate = function(a, i) {
            if ("string" != typeof i || /^\s*$/.test(i)) return a + "";
            var j = new Date(a.getFullYear(), 0, 1), k = a;
            return i.replace(/[dDjlNSwzWFmMntLoYyaABgGhHisuU]/g, function(a) {
                switch (a) {
                  case "d":
                    return ("0" + k.getDate()).replace(/^.+(..)$/, "$1");

                  case "D":
                    return e[k.getDay()];

                  case "j":
                    return k.getDate();

                  case "l":
                    return f[k.getDay()];

                  case "N":
                    return (k.getDay() + 6) % 7 + 1;

                  case "S":
                    return b(k.getDate());

                  case "w":
                    return k.getDay();

                  case "z":
                    return Math.ceil((j - k) / 864e5);

                  case "W":
                    return ("0" + d(k)).replace(/^.(..)$/, "$1");

                  case "F":
                    return h[k.getMonth()];

                  case "m":
                    return ("0" + (k.getMonth() + 1)).replace(/^.+(..)$/, "$1");

                  case "M":
                    return g[k.getMonth()];

                  case "n":
                    return k.getMonth() + 1;

                  case "t":
                    return new Date(k.getFullYear(), k.getMonth() + 1, -1).getDate();

                  case "L":
                    return 29 == new Date(k.getFullYear(), 1, 29).getDate() ? 1 : 0;

                  case "o":
                    return c(k);

                  case "Y":
                    return k.getFullYear();

                  case "y":
                    return (k.getFullYear() + "").replace(/^.+(..)$/, "$1");

                  case "a":
                    return k.getHours() < 12 ? "am" : "pm";

                  case "A":
                    return k.getHours() < 12 ? "AM" : "PM";

                  case "B":
                    return Math.floor(1e3 * ((k.getUTCHours() + 1) % 24 + k.getUTCMinutes() / 60 + k.getUTCSeconds() / 3600) / 24);

                  case "g":
                    return k.getHours() % 12 != 0 ? k.getHours() % 12 : 12;

                  case "G":
                    return k.getHours();

                  case "h":
                    return ("0" + (k.getHours() % 12 != 0 ? k.getHours() % 12 : 12)).replace(/^.+(..)$/, "$1");

                  case "H":
                    return ("0" + k.getHours()).replace(/^.+(..)$/, "$1");

                  case "i":
                    return ("0" + k.getMinutes()).replace(/^.+(..)$/, "$1");

                  case "s":
                    return ("0" + k.getSeconds()).replace(/^.+(..)$/, "$1");

                  case "u":
                    return k.getMilliseconds();

                  case "U":
                    return k.getTime() / 1e3;
                }
            });
        };
    }(), a.lib.strip_tags = function(a, b) {
        b = (((b || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join("");
        var c = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, d = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
        return a.replace(d, "").replace(c, function(a, c) {
            return b.indexOf("<" + c.toLowerCase() + ">") > -1 ? a : "";
        });
    }, a.lib.parseISO8601Date = function(a) {
        var b = /(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)(\.\d+)?(Z|([+-])(\d\d):(\d\d))/, c = [];
        if (c = a.match(b), !c) throw "Couldn't parse ISO 8601 date string '" + a + "'";
        var d = [ 1, 2, 3, 4, 5, 6, 10, 11 ];
        for (var e in d) c[d[e]] = parseInt(c[d[e]], 10);
        c[7] = parseFloat(c[7]);
        var f = Date.UTC(c[1], c[2] - 1, c[3], c[4], c[5], c[6]);
        if (c[7] > 0 && (f += Math.round(1e3 * c[7])), "Z" != c[8] && c[10]) {
            var g = 60 * c[10] * 60 * 1e3;
            c[11] && (g += 60 * c[11] * 1e3), "-" == c[9] ? f -= g : f += g;
        }
        return new Date(f);
    }, a.lib.strtotime = function(a, b) {
        function c(a, b, c) {
            var d, e = j[b];
            "undefined" != typeof e && (d = e - i.getDay(), 0 === d ? d = 7 * c : d > 0 && "last" === a ? d -= 7 : 0 > d && "next" === a && (d += 7), 
            i.setDate(i.getDate() + d));
        }
        function d(a) {
            var b = a.split(" "), d = b[0], e = b[1].substring(0, 3), f = /\d+/.test(d), g = "ago" === b[2], h = ("last" === d ? -1 : 1) * (g ? -1 : 1);
            if (f && (h *= parseInt(d, 10)), k.hasOwnProperty(e) && !b[1].match(/^mon(day|\.)?$/i)) return i["set" + k[e]](i["get" + k[e]]() + h);
            if ("wee" === e) return i.setDate(i.getDate() + 7 * h);
            if ("next" === d || "last" === d) c(d, e, h); else if (!f) return !1;
            return !0;
        }
        var e, f, g, h, i, j, k, l, m, n, o, p = !1;
        if (!a) return p;
        if (a = a.replace(/^\s+|\s+$/g, "").replace(/\s{2,}/g, " ").replace(/[\t\r\n]/g, "").toLowerCase(), 
        f = a.match(/^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/), 
        f && f[2] === f[4]) if (f[1] > 1901) switch (f[2]) {
          case "-":
            return f[3] > 12 || f[5] > 31 ? p : new Date(f[1], parseInt(f[3], 10) - 1, f[5], f[6] || 0, f[7] || 0, f[8] || 0, f[9] || 0) / 1e3;

          case ".":
            return p;

          case "/":
            return f[3] > 12 || f[5] > 31 ? p : new Date(f[1], parseInt(f[3], 10) - 1, f[5], f[6] || 0, f[7] || 0, f[8] || 0, f[9] || 0) / 1e3;
        } else if (f[5] > 1901) switch (f[2]) {
          case "-":
            return f[3] > 12 || f[1] > 31 ? p : new Date(f[5], parseInt(f[3], 10) - 1, f[1], f[6] || 0, f[7] || 0, f[8] || 0, f[9] || 0) / 1e3;

          case ".":
            return f[3] > 12 || f[1] > 31 ? p : new Date(f[5], parseInt(f[3], 10) - 1, f[1], f[6] || 0, f[7] || 0, f[8] || 0, f[9] || 0) / 1e3;

          case "/":
            return f[1] > 12 || f[3] > 31 ? p : new Date(f[5], parseInt(f[1], 10) - 1, f[3], f[6] || 0, f[7] || 0, f[8] || 0, f[9] || 0) / 1e3;
        } else switch (f[2]) {
          case "-":
            return f[3] > 12 || f[5] > 31 || f[1] < 70 && f[1] > 38 ? p : (h = f[1] >= 0 && f[1] <= 38 ? +f[1] + 2e3 : f[1], 
            new Date(h, parseInt(f[3], 10) - 1, f[5], f[6] || 0, f[7] || 0, f[8] || 0, f[9] || 0) / 1e3);

          case ".":
            return f[5] >= 70 ? f[3] > 12 || f[1] > 31 ? p : new Date(f[5], parseInt(f[3], 10) - 1, f[1], f[6] || 0, f[7] || 0, f[8] || 0, f[9] || 0) / 1e3 : f[5] < 60 && !f[6] ? f[1] > 23 || f[3] > 59 ? p : (g = new Date(), 
            new Date(g.getFullYear(), g.getMonth(), g.getDate(), f[1] || 0, f[3] || 0, f[5] || 0, f[9] || 0) / 1e3) : p;

          case "/":
            return f[1] > 12 || f[3] > 31 || f[5] < 70 && f[5] > 38 ? p : (h = f[5] >= 0 && f[5] <= 38 ? +f[5] + 2e3 : f[5], 
            new Date(h, parseInt(f[1], 10) - 1, f[3], f[6] || 0, f[7] || 0, f[8] || 0, f[9] || 0) / 1e3);

          case ":":
            return f[1] > 23 || f[3] > 59 || f[5] > 59 ? p : (g = new Date(), new Date(g.getFullYear(), g.getMonth(), g.getDate(), f[1] || 0, f[3] || 0, f[5] || 0) / 1e3);
        }
        if ("now" === a) return null === b || isNaN(b) ? new Date().getTime() / 1e3 | 0 : 0 | b;
        if (!isNaN(e = Date.parse(a))) return e / 1e3 | 0;
        if (i = b ? new Date(1e3 * b) : new Date(), j = {
            sun: 0,
            mon: 1,
            tue: 2,
            wed: 3,
            thu: 4,
            fri: 5,
            sat: 6
        }, k = {
            yea: "FullYear",
            mon: "Month",
            day: "Date",
            hou: "Hours",
            min: "Minutes",
            sec: "Seconds"
        }, m = "(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)", 
        n = "([+-]?\\d+\\s" + m + "|(last|next)\\s" + m + ")(\\sago)?", f = a.match(new RegExp(n, "gi")), 
        !f) return p;
        for (o = 0, l = f.length; l > o; o++) if (!d(f[o])) return p;
        return i.getTime() / 1e3;
    }, a.lib.is = function(a, b) {
        var c = Object.prototype.toString.call(b).slice(8, -1);
        return void 0 !== b && null !== b && c === a;
    }, a.lib.copy = function(a) {
        var b, c = {};
        for (b in a) c[b] = a[b];
        return c;
    }, a.lib.replaceAll = function(a, b, c) {
        return a.split(b).join(c);
    }, a.lib.chunkArray = function(b, c) {
        var d = [], e = 0, f = b.length;
        if (1 > c || !a.lib.is("Array", b)) return [];
        for (;f > e; ) d.push(b.slice(e, e += c));
        return d;
    }, a.lib.round = function(a, b, c) {
        var d, e, f, g;
        if (b |= 0, d = Math.pow(10, b), a *= d, g = a > 0 | -(0 > a), f = a % 1 === .5 * g, 
        e = Math.floor(a), f) switch (c) {
          case "PHP_ROUND_HALF_DOWN":
            a = e + (0 > g);
            break;

          case "PHP_ROUND_HALF_EVEN":
            a = e + e % 2 * g;
            break;

          case "PHP_ROUND_HALF_ODD":
            a = e + !(e % 2);
            break;

          default:
            a = e + (g > 0);
        }
        return (f ? a : Math.round(a)) / d;
    }, a;
}(Twig || {}), Twig = function(a) {
    "use strict";
    for (a.logic = {}, a.logic.type = {
        if_: "Twig.logic.type.if",
        endif: "Twig.logic.type.endif",
        for_: "Twig.logic.type.for",
        endfor: "Twig.logic.type.endfor",
        else_: "Twig.logic.type.else",
        elseif: "Twig.logic.type.elseif",
        set: "Twig.logic.type.set",
        setcapture: "Twig.logic.type.setcapture",
        endset: "Twig.logic.type.endset",
        filter: "Twig.logic.type.filter",
        endfilter: "Twig.logic.type.endfilter",
        block: "Twig.logic.type.block",
        endblock: "Twig.logic.type.endblock",
        extends_: "Twig.logic.type.extends",
        use: "Twig.logic.type.use",
        include: "Twig.logic.type.include",
        spaceless: "Twig.logic.type.spaceless",
        endspaceless: "Twig.logic.type.endspaceless",
        macro: "Twig.logic.type.macro",
        endmacro: "Twig.logic.type.endmacro",
        import_: "Twig.logic.type.import",
        from: "Twig.logic.type.from",
        embed: "Twig.logic.type.embed",
        endembed: "Twig.logic.type.endembed"
    }, a.logic.definitions = [ {
        type: a.logic.type.if_,
        regex: /^if\s+([\s\S]+)$/,
        next: [ a.logic.type.else_, a.logic.type.elseif, a.logic.type.endif ],
        open: !0,
        compile: function(b) {
            var c = b.match[1];
            return b.stack = a.expression.compile.apply(this, [ {
                type: a.expression.type.expression,
                value: c
            } ]).stack, delete b.match, b;
        },
        parse: function(b, c, d) {
            var e = "", f = a.expression.parse.apply(this, [ b.stack, c ]);
            return d = !0, f && (d = !1, e = a.parse.apply(this, [ b.output, c ])), {
                chain: d,
                output: e
            };
        }
    }, {
        type: a.logic.type.elseif,
        regex: /^elseif\s+([^\s].*)$/,
        next: [ a.logic.type.else_, a.logic.type.elseif, a.logic.type.endif ],
        open: !1,
        compile: function(b) {
            var c = b.match[1];
            return b.stack = a.expression.compile.apply(this, [ {
                type: a.expression.type.expression,
                value: c
            } ]).stack, delete b.match, b;
        },
        parse: function(b, c, d) {
            var e = "";
            return d && a.expression.parse.apply(this, [ b.stack, c ]) === !0 && (d = !1, e = a.parse.apply(this, [ b.output, c ])), 
            {
                chain: d,
                output: e
            };
        }
    }, {
        type: a.logic.type.else_,
        regex: /^else$/,
        next: [ a.logic.type.endif, a.logic.type.endfor ],
        open: !1,
        parse: function(b, c, d) {
            var e = "";
            return d && (e = a.parse.apply(this, [ b.output, c ])), {
                chain: d,
                output: e
            };
        }
    }, {
        type: a.logic.type.endif,
        regex: /^endif$/,
        next: [],
        open: !1
    }, {
        type: a.logic.type.for_,
        regex: /^for\s+([a-zA-Z0-9_,\s]+)\s+in\s+([^\s].*?)(?:\s+if\s+([^\s].*))?$/,
        next: [ a.logic.type.else_, a.logic.type.endfor ],
        open: !0,
        compile: function(b) {
            var c = b.match[1], d = b.match[2], e = b.match[3], f = null;
            if (b.key_var = null, b.value_var = null, c.indexOf(",") >= 0) {
                if (f = c.split(","), 2 !== f.length) throw new a.Error("Invalid expression in for loop: " + c);
                b.key_var = f[0].trim(), b.value_var = f[1].trim();
            } else b.value_var = c;
            return b.expression = a.expression.compile.apply(this, [ {
                type: a.expression.type.expression,
                value: d
            } ]).stack, e && (b.conditional = a.expression.compile.apply(this, [ {
                type: a.expression.type.expression,
                value: e
            } ]).stack), delete b.match, b;
        },
        parse: function(b, c, d) {
            var e, f, g = a.expression.parse.apply(this, [ b.expression, c ]), h = [], i = 0, j = this, k = b.conditional, l = function(a, b) {
                var d = void 0 !== k;
                return {
                    index: a + 1,
                    index0: a,
                    revindex: d ? void 0 : b - a,
                    revindex0: d ? void 0 : b - a - 1,
                    first: 0 === a,
                    last: d ? void 0 : a === b - 1,
                    length: d ? void 0 : b,
                    parent: c
                };
            }, m = function(d, f) {
                var g = a.ChildContext(c);
                g[b.value_var] = f, b.key_var && (g[b.key_var] = d), g.loop = l(i, e), (void 0 === k || a.expression.parse.apply(j, [ k, g ])) && (h.push(a.parse.apply(j, [ b.output, g ])), 
                i += 1), delete g.loop, delete g[b.value_var], delete g[b.key_var], a.merge(c, g, !0);
            };
            return a.lib.is("Array", g) ? (e = g.length, a.forEach(g, function(a) {
                var b = i;
                m(b, a);
            })) : a.lib.is("Object", g) && (f = void 0 !== g._keys ? g._keys : Object.keys(g), 
            e = f.length, a.forEach(f, function(a) {
                "_keys" !== a && m(a, g[a]);
            })), d = 0 === h.length, {
                chain: d,
                output: a.output.apply(this, [ h ])
            };
        }
    }, {
        type: a.logic.type.endfor,
        regex: /^endfor$/,
        next: [],
        open: !1
    }, {
        type: a.logic.type.set,
        regex: /^set\s+([a-zA-Z0-9_,\s]+)\s*=\s*([\s\S]+)$/,
        next: [],
        open: !0,
        compile: function(b) {
            var c = b.match[1].trim(), d = b.match[2], e = a.expression.compile.apply(this, [ {
                type: a.expression.type.expression,
                value: d
            } ]).stack;
            return b.key = c, b.expression = e, delete b.match, b;
        },
        parse: function(b, c, d) {
            var e = a.expression.parse.apply(this, [ b.expression, c ]), f = b.key;
            return c[f] = e, {
                chain: d,
                context: c
            };
        }
    }, {
        type: a.logic.type.setcapture,
        regex: /^set\s+([a-zA-Z0-9_,\s]+)$/,
        next: [ a.logic.type.endset ],
        open: !0,
        compile: function(a) {
            var b = a.match[1].trim();
            return a.key = b, delete a.match, a;
        },
        parse: function(b, c, d) {
            var e = a.parse.apply(this, [ b.output, c ]), f = b.key;
            return this.context[f] = e, c[f] = e, {
                chain: d,
                context: c
            };
        }
    }, {
        type: a.logic.type.endset,
        regex: /^endset$/,
        next: [],
        open: !1
    }, {
        type: a.logic.type.filter,
        regex: /^filter\s+(.+)$/,
        next: [ a.logic.type.endfilter ],
        open: !0,
        compile: function(b) {
            var c = "|" + b.match[1].trim();
            return b.stack = a.expression.compile.apply(this, [ {
                type: a.expression.type.expression,
                value: c
            } ]).stack, delete b.match, b;
        },
        parse: function(b, c, d) {
            var e = a.parse.apply(this, [ b.output, c ]), f = [ {
                type: a.expression.type.string,
                value: e
            } ].concat(b.stack), g = a.expression.parse.apply(this, [ f, c ]);
            return {
                chain: d,
                output: g
            };
        }
    }, {
        type: a.logic.type.endfilter,
        regex: /^endfilter$/,
        next: [],
        open: !1
    }, {
        type: a.logic.type.block,
        regex: /^block\s+([a-zA-Z0-9_]+)$/,
        next: [ a.logic.type.endblock ],
        open: !0,
        compile: function(a) {
            return a.block = a.match[1].trim(), delete a.match, a;
        },
        parse: function(b, c, d) {
            var e = "", f = "", g = this.importedBlocks.indexOf(b.block) > -1, h = this.blocks[b.block] && this.blocks[b.block].indexOf(a.placeholders.parent) > -1;
            return (void 0 === this.blocks[b.block] || g || h || c.loop || b.overwrite) && (e = a.expression.parse.apply(this, [ {
                type: a.expression.type.string,
                value: a.parse.apply(this, [ b.output, c ])
            }, c ]), g && this.importedBlocks.splice(this.importedBlocks.indexOf(b.block), 1), 
            h ? this.blocks[b.block] = a.Markup(this.blocks[b.block].replace(a.placeholders.parent, e)) : this.blocks[b.block] = e, 
            this.originalBlockTokens[b.block] = {
                type: b.type,
                block: b.block,
                output: b.output,
                overwrite: !0
            }), f = this.child.blocks[b.block] ? this.child.blocks[b.block] : this.blocks[b.block], 
            {
                chain: d,
                output: f
            };
        }
    }, {
        type: a.logic.type.endblock,
        regex: /^endblock(?:\s+([a-zA-Z0-9_]+))?$/,
        next: [],
        open: !1
    }, {
        type: a.logic.type.extends_,
        regex: /^extends\s+(.+)$/,
        next: [],
        open: !0,
        compile: function(b) {
            var c = b.match[1].trim();
            return delete b.match, b.stack = a.expression.compile.apply(this, [ {
                type: a.expression.type.expression,
                value: c
            } ]).stack, b;
        },
        parse: function(b, c, d) {
            var e = a.expression.parse.apply(this, [ b.stack, c ]);
            return this.extend = e, {
                chain: d,
                output: ""
            };
        }
    }, {
        type: a.logic.type.use,
        regex: /^use\s+(.+)$/,
        next: [],
        open: !0,
        compile: function(b) {
            var c = b.match[1].trim();
            return delete b.match, b.stack = a.expression.compile.apply(this, [ {
                type: a.expression.type.expression,
                value: c
            } ]).stack, b;
        },
        parse: function(b, c, d) {
            var e = a.expression.parse.apply(this, [ b.stack, c ]);
            return this.importBlocks(e), {
                chain: d,
                output: ""
            };
        }
    }, {
        type: a.logic.type.include,
        regex: /^include\s+(ignore missing\s+)?(.+?)\s*(?:with\s+([\S\s]+?))?\s*(only)?$/,
        next: [],
        open: !0,
        compile: function(b) {
            var c = b.match, d = void 0 !== c[1], e = c[2].trim(), f = c[3], g = void 0 !== c[4] && c[4].length;
            return delete b.match, b.only = g, b.includeMissing = d, b.stack = a.expression.compile.apply(this, [ {
                type: a.expression.type.expression,
                value: e
            } ]).stack, void 0 !== f && (b.withStack = a.expression.compile.apply(this, [ {
                type: a.expression.type.expression,
                value: f.trim()
            } ]).stack), b;
        },
        parse: function(b, c, d) {
            var e, f, g, h = {};
            if (b.only || (h = a.ChildContext(c)), void 0 !== b.withStack) {
                e = a.expression.parse.apply(this, [ b.withStack, c ]);
                for (f in e) e.hasOwnProperty(f) && (h[f] = e[f]);
            }
            var i = a.expression.parse.apply(this, [ b.stack, h ]);
            return g = i instanceof a.Template ? i : this.importFile(i), {
                chain: d,
                output: g.render(h)
            };
        }
    }, {
        type: a.logic.type.spaceless,
        regex: /^spaceless$/,
        next: [ a.logic.type.endspaceless ],
        open: !0,
        parse: function(b, c, d) {
            var e = a.parse.apply(this, [ b.output, c ]), f = />\s+</g, g = e.replace(f, "><").trim();
            return {
                chain: d,
                output: g
            };
        }
    }, {
        type: a.logic.type.endspaceless,
        regex: /^endspaceless$/,
        next: [],
        open: !1
    }, {
        type: a.logic.type.macro,
        regex: /^macro\s+([a-zA-Z0-9_]+)\s*\(\s*((?:[a-zA-Z0-9_]+(?:,\s*)?)*)\s*\)$/,
        next: [ a.logic.type.endmacro ],
        open: !0,
        compile: function(b) {
            for (var c = b.match[1], d = b.match[2].split(/[\s,]+/), e = 0; e < d.length; e++) for (var f = 0; f < d.length; f++) if (d[e] === d[f] && e !== f) throw new a.Error("Duplicate arguments for parameter: " + d[e]);
            return b.macroName = c, b.parameters = d, delete b.match, b;
        },
        parse: function(b, c, d) {
            var e = this;
            return this.macros[b.macroName] = function() {
                for (var c = {
                    _self: e.macros
                }, d = 0; d < b.parameters.length; d++) {
                    var f = b.parameters[d];
                    "undefined" != typeof arguments[d] ? c[f] = arguments[d] : c[f] = void 0;
                }
                return a.parse.apply(e, [ b.output, c ]);
            }, {
                chain: d,
                output: ""
            };
        }
    }, {
        type: a.logic.type.endmacro,
        regex: /^endmacro$/,
        next: [],
        open: !1
    }, {
        type: a.logic.type.import_,
        regex: /^import\s+(.+)\s+as\s+([a-zA-Z0-9_]+)$/,
        next: [],
        open: !0,
        compile: function(b) {
            var c = b.match[1].trim(), d = b.match[2].trim();
            return delete b.match, b.expression = c, b.contextName = d, b.stack = a.expression.compile.apply(this, [ {
                type: a.expression.type.expression,
                value: c
            } ]).stack, b;
        },
        parse: function(b, c, d) {
            if ("_self" !== b.expression) {
                var e = a.expression.parse.apply(this, [ b.stack, c ]), f = this.importFile(e || b.expression);
                c[b.contextName] = f.render({}, {
                    output: "macros"
                });
            } else c[b.contextName] = this.macros;
            return {
                chain: d,
                output: ""
            };
        }
    }, {
        type: a.logic.type.from,
        regex: /^from\s+(.+)\s+import\s+([a-zA-Z0-9_, ]+)$/,
        next: [],
        open: !0,
        compile: function(b) {
            for (var c = b.match[1].trim(), d = b.match[2].trim().split(/[ ,]+/), e = {}, f = 0; f < d.length; f++) {
                var g = d[f], h = g.match(/^([a-zA-Z0-9_]+)\s+(.+)\s+as\s+([a-zA-Z0-9_]+)$/);
                h ? e[h[1].trim()] = h[2].trim() : g.match(/^([a-zA-Z0-9_]+)$/) && (e[g] = g);
            }
            return delete b.match, b.expression = c, b.macroNames = e, b.stack = a.expression.compile.apply(this, [ {
                type: a.expression.type.expression,
                value: c
            } ]).stack, b;
        },
        parse: function(b, c, d) {
            var e;
            if ("_self" !== b.expression) {
                var f = a.expression.parse.apply(this, [ b.stack, c ]), g = this.importFile(f || b.expression);
                e = g.render({}, {
                    output: "macros"
                });
            } else e = this.macros;
            for (var h in b.macroNames) e.hasOwnProperty(h) && (c[b.macroNames[h]] = e[h]);
            return {
                chain: d,
                output: ""
            };
        }
    }, {
        type: a.logic.type.embed,
        regex: /^embed\s+(ignore missing\s+)?(.+?)\s*(?:with\s+(.+?))?\s*(only)?$/,
        next: [ a.logic.type.endembed ],
        open: !0,
        compile: function(b) {
            var c = b.match, d = void 0 !== c[1], e = c[2].trim(), f = c[3], g = void 0 !== c[4] && c[4].length;
            return delete b.match, b.only = g, b.includeMissing = d, b.stack = a.expression.compile.apply(this, [ {
                type: a.expression.type.expression,
                value: e
            } ]).stack, void 0 !== f && (b.withStack = a.expression.compile.apply(this, [ {
                type: a.expression.type.expression,
                value: f.trim()
            } ]).stack), b;
        },
        parse: function(b, c, d) {
            var e, f, g, h = {};
            if (!b.only) for (f in c) c.hasOwnProperty(f) && (h[f] = c[f]);
            if (void 0 !== b.withStack) {
                e = a.expression.parse.apply(this, [ b.withStack, c ]);
                for (f in e) e.hasOwnProperty(f) && (h[f] = e[f]);
            }
            var i = a.expression.parse.apply(this, [ b.stack, h ]);
            g = i instanceof a.Template ? i : this.importFile(i), this.blocks = {};
            a.parse.apply(this, [ b.output, h ]);
            return {
                chain: d,
                output: g.render(h, {
                    blocks: this.blocks
                })
            };
        }
    }, {
        type: a.logic.type.endembed,
        regex: /^endembed$/,
        next: [],
        open: !1
    } ], a.logic.handler = {}, a.logic.extendType = function(b, c) {
        c = c || "Twig.logic.type" + b, a.logic.type[b] = c;
    }, a.logic.extend = function(b) {
        if (!b.type) throw new a.Error("Unable to extend logic definition. No type provided for " + b);
        a.logic.extendType(b.type), a.logic.handler[b.type] = b;
    }; a.logic.definitions.length > 0; ) a.logic.extend(a.logic.definitions.shift());
    return a.logic.compile = function(b) {
        var c = b.value.trim(), d = a.logic.tokenize.apply(this, [ c ]), e = a.logic.handler[d.type];
        return e.compile && (d = e.compile.apply(this, [ d ]), a.log.trace("Twig.logic.compile: ", "Compiled logic token to ", d)), 
        d;
    }, a.logic.tokenize = function(b) {
        var c = {}, d = null, e = null, f = null, g = null, h = null, i = null;
        b = b.trim();
        for (d in a.logic.handler) if (a.logic.handler.hasOwnProperty(d)) for (e = a.logic.handler[d].type, 
        f = a.logic.handler[d].regex, g = [], f instanceof Array ? g = f : g.push(f); g.length > 0; ) if (h = g.shift(), 
        i = h.exec(b.trim()), null !== i) return c.type = e, c.match = i, a.log.trace("Twig.logic.tokenize: ", "Matched a ", e, " regular expression of ", i), 
        c;
        throw new a.Error("Unable to parse '" + b.trim() + "'");
    }, a.logic.parse = function(b, c, d) {
        var e, f = "";
        return c = c || {}, a.log.debug("Twig.logic.parse: ", "Parsing logic token ", b), 
        e = a.logic.handler[b.type], e.parse && (f = e.parse.apply(this, [ b, c, d ])), 
        f;
    }, a;
}(Twig || {}), Twig = function(a) {
    "use strict";
    a.expression = {}, a.expression.reservedWords = [ "true", "false", "null", "TRUE", "FALSE", "NULL", "_context" ], 
    a.expression.type = {
        comma: "Twig.expression.type.comma",
        operator: {
            unary: "Twig.expression.type.operator.unary",
            binary: "Twig.expression.type.operator.binary"
        },
        string: "Twig.expression.type.string",
        bool: "Twig.expression.type.bool",
        array: {
            start: "Twig.expression.type.array.start",
            end: "Twig.expression.type.array.end"
        },
        object: {
            start: "Twig.expression.type.object.start",
            end: "Twig.expression.type.object.end"
        },
        parameter: {
            start: "Twig.expression.type.parameter.start",
            end: "Twig.expression.type.parameter.end"
        },
        key: {
            period: "Twig.expression.type.key.period",
            brackets: "Twig.expression.type.key.brackets"
        },
        filter: "Twig.expression.type.filter",
        _function: "Twig.expression.type._function",
        variable: "Twig.expression.type.variable",
        number: "Twig.expression.type.number",
        _null: "Twig.expression.type.null",
        context: "Twig.expression.type.context",
        test: "Twig.expression.type.test"
    }, a.expression.set = {
        operations: [ a.expression.type.filter, a.expression.type.operator.unary, a.expression.type.operator.binary, a.expression.type.array.end, a.expression.type.object.end, a.expression.type.parameter.end, a.expression.type.comma, a.expression.type.test ],
        expressions: [ a.expression.type._function, a.expression.type.bool, a.expression.type.string, a.expression.type.variable, a.expression.type.number, a.expression.type._null, a.expression.type.context, a.expression.type.parameter.start, a.expression.type.array.start, a.expression.type.object.start ]
    }, a.expression.set.operations_extended = a.expression.set.operations.concat([ a.expression.type.key.period, a.expression.type.key.brackets ]), 
    a.expression.fn = {
        compile: {
            push: function(a, b, c) {
                c.push(a);
            },
            push_both: function(a, b, c) {
                c.push(a), b.push(a);
            }
        },
        parse: {
            push: function(a, b, c) {
                b.push(a);
            },
            push_value: function(a, b, c) {
                b.push(a.value);
            }
        }
    }, a.expression.definitions = [ {
        type: a.expression.type.test,
        regex: /^is\s+(not)?\s*([a-zA-Z_][a-zA-Z0-9_]*)/,
        next: a.expression.set.operations.concat([ a.expression.type.parameter.start ]),
        compile: function(a, b, c) {
            a.filter = a.match[2], a.modifier = a.match[1], delete a.match, delete a.value, 
            c.push(a);
        },
        parse: function(b, c, d) {
            var e = c.pop(), f = b.params && a.expression.parse.apply(this, [ b.params, d ]), g = a.test(b.filter, e, f);
            "not" == b.modifier ? c.push(!g) : c.push(g);
        }
    }, {
        type: a.expression.type.comma,
        regex: /^,/,
        next: a.expression.set.expressions.concat([ a.expression.type.array.end, a.expression.type.object.end ]),
        compile: function(b, c, d) {
            var e, f = c.length - 1;
            for (delete b.match, delete b.value; f >= 0; f--) {
                if (e = c.pop(), e.type === a.expression.type.object.start || e.type === a.expression.type.parameter.start || e.type === a.expression.type.array.start) {
                    c.push(e);
                    break;
                }
                d.push(e);
            }
            d.push(b);
        }
    }, {
        type: a.expression.type.operator.binary,
        regex: /(^[\+\-~%\?\:]|^[!=]==?|^[!<>]=?|^\*\*?|^\/\/?|^and\s+|^or\s+|^in\s+|^not in\s+|^\.\.)/,
        next: a.expression.set.expressions.concat([ a.expression.type.operator.unary ]),
        compile: function(b, c, d) {
            delete b.match, b.value = b.value.trim();
            var e = b.value, f = a.expression.operator.lookup(e, b);
            for (a.log.trace("Twig.expression.compile: ", "Operator: ", f, " from ", e); c.length > 0 && (c[c.length - 1].type == a.expression.type.operator.unary || c[c.length - 1].type == a.expression.type.operator.binary) && (f.associativity === a.expression.operator.leftToRight && f.precidence >= c[c.length - 1].precidence || f.associativity === a.expression.operator.rightToLeft && f.precidence > c[c.length - 1].precidence); ) {
                var g = c.pop();
                d.push(g);
            }
            if (":" === e) {
                if (!c[c.length - 1] || "?" !== c[c.length - 1].value) {
                    var h = d.pop();
                    if (h.type !== a.expression.type.string && h.type !== a.expression.type.variable && h.type !== a.expression.type.number) throw new a.Error("Unexpected value before ':' of " + h.type + " = " + h.value);
                    return b.key = h.value, void d.push(b);
                }
            } else c.push(f);
        },
        parse: function(b, c, d) {
            b.key ? c.push(b) : a.expression.operator.parse(b.value, c);
        }
    }, {
        type: a.expression.type.operator.unary,
        regex: /(^not\s+)/,
        next: a.expression.set.expressions,
        compile: function(b, c, d) {
            delete b.match, b.value = b.value.trim();
            var e = b.value, f = a.expression.operator.lookup(e, b);
            for (a.log.trace("Twig.expression.compile: ", "Operator: ", f, " from ", e); c.length > 0 && (c[c.length - 1].type == a.expression.type.operator.unary || c[c.length - 1].type == a.expression.type.operator.binary) && (f.associativity === a.expression.operator.leftToRight && f.precidence >= c[c.length - 1].precidence || f.associativity === a.expression.operator.rightToLeft && f.precidence > c[c.length - 1].precidence); ) {
                var g = c.pop();
                d.push(g);
            }
            c.push(f);
        },
        parse: function(b, c, d) {
            a.expression.operator.parse(b.value, c);
        }
    }, {
        type: a.expression.type.string,
        regex: /^(["'])(?:(?=(\\?))\2[\s\S])*?\1/,
        next: a.expression.set.operations,
        compile: function(b, c, d) {
            var e = b.value;
            delete b.match, e = '"' === e.substring(0, 1) ? e.replace('\\"', '"') : e.replace("\\'", "'"), 
            b.value = e.substring(1, e.length - 1).replace(/\\n/g, "\n").replace(/\\r/g, "\r"), 
            a.log.trace("Twig.expression.compile: ", "String value: ", b.value), d.push(b);
        },
        parse: a.expression.fn.parse.push_value
    }, {
        type: a.expression.type.parameter.start,
        regex: /^\(/,
        next: a.expression.set.expressions.concat([ a.expression.type.parameter.end ]),
        compile: a.expression.fn.compile.push_both,
        parse: a.expression.fn.parse.push
    }, {
        type: a.expression.type.parameter.end,
        regex: /^\)/,
        next: a.expression.set.operations_extended,
        compile: function(b, c, d) {
            var e, f = b;
            for (e = c.pop(); c.length > 0 && e.type != a.expression.type.parameter.start; ) d.push(e), 
            e = c.pop();
            for (var g = []; b.type !== a.expression.type.parameter.start; ) g.unshift(b), b = d.pop();
            g.unshift(b);
            b = d[d.length - 1], void 0 === b || b.type !== a.expression.type._function && b.type !== a.expression.type.filter && b.type !== a.expression.type.test && b.type !== a.expression.type.key.brackets && b.type !== a.expression.type.key.period ? (f.expression = !0, 
            g.pop(), g.shift(), f.params = g, d.push(f)) : (f.expression = !1, b.params = g);
        },
        parse: function(b, c, d) {
            var e = [], f = !1, g = null;
            if (b.expression) g = a.expression.parse.apply(this, [ b.params, d ]), c.push(g); else {
                for (;c.length > 0; ) {
                    if (g = c.pop(), g && g.type && g.type == a.expression.type.parameter.start) {
                        f = !0;
                        break;
                    }
                    e.unshift(g);
                }
                if (!f) throw new a.Error("Expected end of parameter set.");
                c.push(e);
            }
        }
    }, {
        type: a.expression.type.array.start,
        regex: /^\[/,
        next: a.expression.set.expressions.concat([ a.expression.type.array.end ]),
        compile: a.expression.fn.compile.push_both,
        parse: a.expression.fn.parse.push
    }, {
        type: a.expression.type.array.end,
        regex: /^\]/,
        next: a.expression.set.operations_extended,
        compile: function(b, c, d) {
            for (var e, f = c.length - 1; f >= 0 && (e = c.pop(), e.type !== a.expression.type.array.start); f--) d.push(e);
            d.push(b);
        },
        parse: function(b, c, d) {
            for (var e = [], f = !1, g = null; c.length > 0; ) {
                if (g = c.pop(), g.type && g.type == a.expression.type.array.start) {
                    f = !0;
                    break;
                }
                e.unshift(g);
            }
            if (!f) throw new a.Error("Expected end of array.");
            c.push(e);
        }
    }, {
        type: a.expression.type.object.start,
        regex: /^\{/,
        next: a.expression.set.expressions.concat([ a.expression.type.object.end ]),
        compile: a.expression.fn.compile.push_both,
        parse: a.expression.fn.parse.push
    }, {
        type: a.expression.type.object.end,
        regex: /^\}/,
        next: a.expression.set.operations_extended,
        compile: function(b, c, d) {
            for (var e, f = c.length - 1; f >= 0 && (e = c.pop(), !e || e.type !== a.expression.type.object.start); f--) d.push(e);
            d.push(b);
        },
        parse: function(b, c, d) {
            for (var e = {}, f = !1, g = null, h = !1, i = null; c.length > 0; ) {
                if (g = c.pop(), g && g.type && g.type === a.expression.type.object.start) {
                    f = !0;
                    break;
                }
                if (g && g.type && (g.type === a.expression.type.operator.binary || g.type === a.expression.type.operator.unary) && g.key) {
                    if (!h) throw new a.Error("Missing value for key '" + g.key + "' in object definition.");
                    e[g.key] = i, void 0 === e._keys && (e._keys = []), e._keys.unshift(g.key), i = null, 
                    h = !1;
                } else h = !0, i = g;
            }
            if (!f) throw new a.Error("Unexpected end of object.");
            c.push(e);
        }
    }, {
        type: a.expression.type.filter,
        regex: /^\|\s?([a-zA-Z_][a-zA-Z0-9_\-]*)/,
        next: a.expression.set.operations_extended.concat([ a.expression.type.parameter.start ]),
        compile: function(a, b, c) {
            a.value = a.match[1], c.push(a);
        },
        parse: function(b, c, d) {
            var e = c.pop(), f = b.params && a.expression.parse.apply(this, [ b.params, d ]);
            c.push(a.filter.apply(this, [ b.value, e, f ]));
        }
    }, {
        type: a.expression.type._function,
        regex: /^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/,
        next: a.expression.type.parameter.start,
        transform: function(a, b) {
            return "(";
        },
        compile: function(a, b, c) {
            var d = a.match[1];
            a.fn = d, delete a.match, delete a.value, c.push(a);
        },
        parse: function(b, c, d) {
            var e, f = b.params && a.expression.parse.apply(this, [ b.params, d ]), g = b.fn;
            if (a.functions[g]) e = a.functions[g].apply(this, f); else {
                if ("function" != typeof d[g]) throw new a.Error(g + " function does not exist and is not defined in the context");
                e = d[g].apply(d, f);
            }
            c.push(e);
        }
    }, {
        type: a.expression.type.variable,
        regex: /^[a-zA-Z_][a-zA-Z0-9_]*/,
        next: a.expression.set.operations_extended.concat([ a.expression.type.parameter.start ]),
        compile: a.expression.fn.compile.push,
        validate: function(b, c) {
            return a.indexOf(a.expression.reservedWords, b[0]) < 0;
        },
        parse: function(b, c, d) {
            var e = a.expression.resolve(d[b.value], d);
            c.push(e);
        }
    }, {
        type: a.expression.type.key.period,
        regex: /^\.([a-zA-Z0-9_]+)/,
        next: a.expression.set.operations_extended.concat([ a.expression.type.parameter.start ]),
        compile: function(a, b, c) {
            a.key = a.match[1], delete a.match, delete a.value, c.push(a);
        },
        parse: function(b, c, d) {
            var e, f = b.params && a.expression.parse.apply(this, [ b.params, d ]), g = b.key, h = c.pop();
            if (null === h || void 0 === h) {
                if (this.options.strict_variables) throw new a.Error("Can't access a key " + g + " on an null or undefined object.");
                return null;
            }
            var i = function(a) {
                return a.substr(0, 1).toUpperCase() + a.substr(1);
            };
            e = "object" == typeof h && g in h ? h[g] : void 0 !== h["get" + i(g)] ? h["get" + i(g)] : void 0 !== h["is" + i(g)] ? h["is" + i(g)] : null, 
            c.push(a.expression.resolve(e, h, f));
        }
    }, {
        type: a.expression.type.key.brackets,
        regex: /^\[([^\]]*)\]/,
        next: a.expression.set.operations_extended.concat([ a.expression.type.parameter.start ]),
        compile: function(b, c, d) {
            var e = b.match[1];
            delete b.value, delete b.match, b.stack = a.expression.compile({
                value: e
            }).stack, d.push(b);
        },
        parse: function(b, c, d) {
            var e, f = b.params && a.expression.parse.apply(this, [ b.params, d ]), g = a.expression.parse.apply(this, [ b.stack, d ]), h = c.pop();
            if (null === h || void 0 === h) {
                if (this.options.strict_variables) throw new a.Error("Can't access a key " + g + " on an null or undefined object.");
                return null;
            }
            e = "object" == typeof h && g in h ? h[g] : null, c.push(a.expression.resolve(e, h, f));
        }
    }, {
        type: a.expression.type._null,
        regex: /^(null|NULL|none|NONE)/,
        next: a.expression.set.operations,
        compile: function(a, b, c) {
            delete a.match, a.value = null, c.push(a);
        },
        parse: a.expression.fn.parse.push_value
    }, {
        type: a.expression.type.context,
        regex: /^_context/,
        next: a.expression.set.operations_extended.concat([ a.expression.type.parameter.start ]),
        compile: a.expression.fn.compile.push,
        parse: function(a, b, c) {
            b.push(c);
        }
    }, {
        type: a.expression.type.number,
        regex: /^\-?\d+(\.\d+)?/,
        next: a.expression.set.operations,
        compile: function(a, b, c) {
            a.value = Number(a.value), c.push(a);
        },
        parse: a.expression.fn.parse.push_value
    }, {
        type: a.expression.type.bool,
        regex: /^(true|TRUE|false|FALSE)/,
        next: a.expression.set.operations,
        compile: function(a, b, c) {
            a.value = "true" === a.match[0].toLowerCase(), delete a.match, c.push(a);
        },
        parse: a.expression.fn.parse.push_value
    } ], a.expression.resolve = function(a, b, c) {
        return "function" == typeof a ? a.apply(b, c || []) : a;
    }, a.expression.handler = {}, a.expression.extendType = function(b) {
        a.expression.type[b] = "Twig.expression.type." + b;
    }, a.expression.extend = function(b) {
        if (!b.type) throw new a.Error("Unable to extend logic definition. No type provided for " + b);
        a.expression.handler[b.type] = b;
    };
    for (;a.expression.definitions.length > 0; ) a.expression.extend(a.expression.definitions.shift());
    return a.expression.tokenize = function(b) {
        var c, d, e, f, g, h, i = [], j = 0, k = null, l = [];
        for (h = function() {
            var b = Array.prototype.slice.apply(arguments);
            b.pop(), b.pop();
            return a.log.trace("Twig.expression.tokenize", "Matched a ", c, " regular expression of ", b), 
            k && a.indexOf(k, c) < 0 ? (l.push(c + " cannot follow a " + i[i.length - 1].type + " at template:" + j + " near '" + b[0].substring(0, 20) + "...'"), 
            b[0]) : a.expression.handler[c].validate && !a.expression.handler[c].validate(b, i) ? b[0] : (l = [], 
            i.push({
                type: c,
                value: b[0],
                match: b
            }), g = !0, k = f, j += b[0].length, a.expression.handler[c].transform ? a.expression.handler[c].transform(b, i) : "");
        }, a.log.debug("Twig.expression.tokenize", "Tokenizing expression ", b); b.length > 0; ) {
            b = b.trim();
            for (c in a.expression.handler) if (a.expression.handler.hasOwnProperty(c)) {
                for (f = a.expression.handler[c].next, d = a.expression.handler[c].regex, e = d instanceof Array ? d : [ d ], 
                g = !1; e.length > 0; ) d = e.pop(), b = b.replace(d, h);
                if (g) break;
            }
            if (!g) throw l.length > 0 ? new a.Error(l.join(" OR ")) : new a.Error("Unable to parse '" + b + "' at template position" + j);
        }
        return a.log.trace("Twig.expression.tokenize", "Tokenized to ", i), i;
    }, a.expression.compile = function(b) {
        var c = b.value, d = a.expression.tokenize(c), e = null, f = [], g = [], h = null;
        for (a.log.trace("Twig.expression.compile: ", "Compiling ", c); d.length > 0; ) e = d.shift(), 
        h = a.expression.handler[e.type], a.log.trace("Twig.expression.compile: ", "Compiling ", e), 
        h.compile && h.compile(e, g, f), a.log.trace("Twig.expression.compile: ", "Stack is", g), 
        a.log.trace("Twig.expression.compile: ", "Output is", f);
        for (;g.length > 0; ) f.push(g.pop());
        return a.log.trace("Twig.expression.compile: ", "Final output is", f), b.stack = f, 
        delete b.value, b;
    }, a.expression.parse = function(b, c) {
        var d = this;
        b instanceof Array || (b = [ b ]);
        var e = [], f = null;
        return a.forEach(b, function(b) {
            f = a.expression.handler[b.type], f.parse && f.parse.apply(d, [ b, e, c ]);
        }), e.pop();
    }, a;
}(Twig || {}), Twig = function(a) {
    "use strict";
    a.expression.operator = {
        leftToRight: "leftToRight",
        rightToLeft: "rightToLeft"
    };
    var b = function(a, b) {
        if (void 0 !== b.indexOf) return a === b || "" !== a && b.indexOf(a) > -1;
        var c;
        for (c in b) if (b.hasOwnProperty(c) && b[c] === a) return !0;
        return !1;
    };
    return a.expression.operator.lookup = function(b, c) {
        switch (b) {
          case "..":
          case "not in":
          case "in":
            c.precidence = 20, c.associativity = a.expression.operator.leftToRight;
            break;

          case ",":
            c.precidence = 18, c.associativity = a.expression.operator.leftToRight;
            break;

          case "?":
          case ":":
            c.precidence = 16, c.associativity = a.expression.operator.rightToLeft;
            break;

          case "or":
            c.precidence = 14, c.associativity = a.expression.operator.leftToRight;
            break;

          case "and":
            c.precidence = 13, c.associativity = a.expression.operator.leftToRight;
            break;

          case "==":
          case "!=":
            c.precidence = 9, c.associativity = a.expression.operator.leftToRight;
            break;

          case "<":
          case "<=":
          case ">":
          case ">=":
            c.precidence = 8, c.associativity = a.expression.operator.leftToRight;
            break;

          case "~":
          case "+":
          case "-":
            c.precidence = 6, c.associativity = a.expression.operator.leftToRight;
            break;

          case "//":
          case "**":
          case "*":
          case "/":
          case "%":
            c.precidence = 5, c.associativity = a.expression.operator.leftToRight;
            break;

          case "not":
            c.precidence = 3, c.associativity = a.expression.operator.rightToLeft;
            break;

          default:
            throw new a.Error(b + " is an unknown operator.");
        }
        return c.operator = b, c;
    }, a.expression.operator.parse = function(c, d) {
        a.log.trace("Twig.expression.operator.parse: ", "Handling ", c);
        var e, f, g;
        switch (c) {
          case ":":
            break;

          case "?":
            g = d.pop(), f = d.pop(), e = d.pop(), e ? d.push(f) : d.push(g);
            break;

          case "+":
            f = parseFloat(d.pop()), e = parseFloat(d.pop()), d.push(e + f);
            break;

          case "-":
            f = parseFloat(d.pop()), e = parseFloat(d.pop()), d.push(e - f);
            break;

          case "*":
            f = parseFloat(d.pop()), e = parseFloat(d.pop()), d.push(e * f);
            break;

          case "/":
            f = parseFloat(d.pop()), e = parseFloat(d.pop()), d.push(e / f);
            break;

          case "//":
            f = parseFloat(d.pop()), e = parseFloat(d.pop()), d.push(parseInt(e / f));
            break;

          case "%":
            f = parseFloat(d.pop()), e = parseFloat(d.pop()), d.push(e % f);
            break;

          case "~":
            f = d.pop(), e = d.pop(), d.push((null != e ? e.toString() : "") + (null != f ? f.toString() : ""));
            break;

          case "not":
          case "!":
            d.push(!d.pop());
            break;

          case "<":
            f = d.pop(), e = d.pop(), d.push(f > e);
            break;

          case "<=":
            f = d.pop(), e = d.pop(), d.push(f >= e);
            break;

          case ">":
            f = d.pop(), e = d.pop(), d.push(e > f);
            break;

          case ">=":
            f = d.pop(), e = d.pop(), d.push(e >= f);
            break;

          case "===":
            f = d.pop(), e = d.pop(), d.push(e === f);
            break;

          case "==":
            f = d.pop(), e = d.pop(), d.push(e == f);
            break;

          case "!==":
            f = d.pop(), e = d.pop(), d.push(e !== f);
            break;

          case "!=":
            f = d.pop(), e = d.pop(), d.push(e != f);
            break;

          case "or":
            f = d.pop(), e = d.pop(), d.push(e || f);
            break;

          case "and":
            f = d.pop(), e = d.pop(), d.push(e && f);
            break;

          case "**":
            f = d.pop(), e = d.pop(), d.push(Math.pow(e, f));
            break;

          case "not in":
            f = d.pop(), e = d.pop(), d.push(!b(e, f));
            break;

          case "in":
            f = d.pop(), e = d.pop(), d.push(b(e, f));
            break;

          case "..":
            f = d.pop(), e = d.pop(), d.push(a.functions.range(e, f));
            break;

          default:
            throw new a.Error(c + " is an unknown operator.");
        }
    }, a;
}(Twig || {}), Twig = function(a) {
    function b(a, b) {
        var c = Object.prototype.toString.call(b).slice(8, -1);
        return void 0 !== b && null !== b && c === a;
    }
    return a.filters = {
        upper: function(a) {
            return "string" != typeof a ? a : a.toUpperCase();
        },
        lower: function(a) {
            return "string" != typeof a ? a : a.toLowerCase();
        },
        capitalize: function(a) {
            return "string" != typeof a ? a : a.substr(0, 1).toUpperCase() + a.toLowerCase().substr(1);
        },
        title: function(a) {
            return "string" != typeof a ? a : a.toLowerCase().replace(/(^|\s)([a-z])/g, function(a, b, c) {
                return b + c.toUpperCase();
            });
        },
        length: function(b) {
            return a.lib.is("Array", b) || "string" == typeof b ? b.length : a.lib.is("Object", b) ? void 0 === b._keys ? Object.keys(b).length : b._keys.length : 0;
        },
        reverse: function(a) {
            if (b("Array", a)) return a.reverse();
            if (b("String", a)) return a.split("").reverse().join("");
            if (b("Object", a)) {
                var c = a._keys || Object.keys(a).reverse();
                return a._keys = c, a;
            }
        },
        sort: function(a) {
            if (b("Array", a)) return a.sort();
            if (b("Object", a)) {
                delete a._keys;
                var c = Object.keys(a), d = c.sort(function(b, c) {
                    return a[b] > a[c];
                });
                return a._keys = d, a;
            }
        },
        keys: function(b) {
            if (void 0 !== b && null !== b) {
                var c = b._keys || Object.keys(b), d = [];
                return a.forEach(c, function(a) {
                    "_keys" !== a && b.hasOwnProperty(a) && d.push(a);
                }), d;
            }
        },
        url_encode: function(a) {
            return void 0 !== a && null !== a ? encodeURIComponent(a) : void 0;
        },
        join: function(c, d) {
            if (void 0 !== c && null !== c) {
                var e = "", f = [], g = null;
                return d && d[0] && (e = d[0]), b("Array", c) ? f = c : (g = c._keys || Object.keys(c), 
                a.forEach(g, function(a) {
                    "_keys" !== a && c.hasOwnProperty(a) && f.push(c[a]);
                })), f.join(e);
            }
        },
        "default": function(b, c) {
            if (void 0 === c || 1 !== c.length) throw new a.Error("default filter expects one argument");
            return void 0 === b || null === b || "" === b ? c[0] : b;
        },
        json_encode: function(a) {
            return a && a.hasOwnProperty("_keys") && delete a._keys, void 0 === a || null === a ? "null" : JSON.stringify(a);
        },
        merge: function(c, d) {
            var e = [], f = 0, g = [];
            if (b("Array", c) ? a.forEach(d, function(a) {
                b("Array", a) || (e = {});
            }) : e = {}, b("Array", e) || (e._keys = []), b("Array", c) ? a.forEach(c, function(a) {
                e._keys && e._keys.push(f), e[f] = a, f++;
            }) : (g = c._keys || Object.keys(c), a.forEach(g, function(a) {
                e[a] = c[a], e._keys.push(a);
                var b = parseInt(a, 10);
                !isNaN(b) && b >= f && (f = b + 1);
            })), a.forEach(d, function(c) {
                b("Array", c) ? a.forEach(c, function(a) {
                    e._keys && e._keys.push(f), e[f] = a, f++;
                }) : (g = c._keys || Object.keys(c), a.forEach(g, function(a) {
                    e[a] || e._keys.push(a), e[a] = c[a];
                    var b = parseInt(a, 10);
                    !isNaN(b) && b >= f && (f = b + 1);
                }));
            }), 0 === d.length) throw new a.Error("Filter merge expects at least one parameter");
            return e;
        },
        date: function(b, c) {
            var d = a.functions.date(b), e = c && c.length ? c[0] : "F j, Y H:i";
            return a.lib.formatDate(d, e);
        },
        date_modify: function(b, c) {
            if (void 0 !== b && null !== b) {
                if (void 0 === c || 1 !== c.length) throw new a.Error("date_modify filter expects 1 argument");
                var d, e = c[0];
                return a.lib.is("Date", b) && (d = a.lib.strtotime(e, b.getTime() / 1e3)), a.lib.is("String", b) && (d = a.lib.strtotime(e, a.lib.strtotime(b))), 
                a.lib.is("Number", b) && (d = a.lib.strtotime(e, b)), new Date(1e3 * d);
            }
        },
        replace: function(b, c) {
            if (void 0 !== b && null !== b) {
                var d, e = c[0];
                for (d in e) e.hasOwnProperty(d) && "_keys" !== d && (b = a.lib.replaceAll(b, d, e[d]));
                return b;
            }
        },
        format: function(b, c) {
            return void 0 !== b && null !== b ? a.lib.vsprintf(b, c) : void 0;
        },
        striptags: function(b) {
            return void 0 !== b && null !== b ? a.lib.strip_tags(b) : void 0;
        },
        escape: function(b) {
            if (void 0 !== b && null !== b) {
                var c = b.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
                return a.Markup(c);
            }
        },
        e: function(b) {
            return a.filters.escape(b);
        },
        nl2br: function(b) {
            if (void 0 !== b && null !== b) {
                var c = "BACKSLASH_n_replace", d = "<br />" + c;
                return b = a.filters.escape(b).replace(/\r\n/g, d).replace(/\r/g, d).replace(/\n/g, d), 
                b = a.lib.replaceAll(b, c, "\n"), a.Markup(b);
            }
        },
        number_format: function(a, b) {
            var c = a, d = b && b[0] ? b[0] : void 0, e = b && void 0 !== b[1] ? b[1] : ".", f = b && void 0 !== b[2] ? b[2] : ",";
            c = (c + "").replace(/[^0-9+\-Ee.]/g, "");
            var g = isFinite(+c) ? +c : 0, h = isFinite(+d) ? Math.abs(d) : 0, i = "", j = function(a, b) {
                var c = Math.pow(10, b);
                return "" + Math.round(a * c) / c;
            };
            return i = (h ? j(g, h) : "" + Math.round(g)).split("."), i[0].length > 3 && (i[0] = i[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, f)), 
            (i[1] || "").length < h && (i[1] = i[1] || "", i[1] += new Array(h - i[1].length + 1).join("0")), 
            i.join(e);
        },
        trim: function(b, c) {
            if (void 0 !== b && null !== b) {
                var d, e = a.filters.escape("" + b);
                d = c && c[0] ? "" + c[0] : " \n\r	\f\x0B            ​\u2028\u2029　";
                for (var f = 0; f < e.length; f++) if (-1 === d.indexOf(e.charAt(f))) {
                    e = e.substring(f);
                    break;
                }
                for (f = e.length - 1; f >= 0; f--) if (-1 === d.indexOf(e.charAt(f))) {
                    e = e.substring(0, f + 1);
                    break;
                }
                return -1 === d.indexOf(e.charAt(0)) ? e : "";
            }
        },
        truncate: function(a, b) {
            var c = 30, d = !1, e = "...";
            if (a += "", b && (b[0] && (c = b[0]), b[1] && (d = b[1]), b[2] && (e = b[2])), 
            a.length > c) {
                if (d && (c = a.indexOf(" ", c), -1 === c)) return a;
                a = a.substr(0, c) + e;
            }
            return a;
        },
        slice: function(b, c) {
            if (void 0 !== b && null !== b) {
                if (void 0 === c || c.length < 1) throw new a.Error("slice filter expects at least 1 argument");
                var d = c[0] || 0, e = c.length > 1 ? c[1] : b.length, f = d >= 0 ? d : Math.max(b.length + d, 0);
                if (a.lib.is("Array", b)) {
                    for (var g = [], h = f; f + e > h && h < b.length; h++) g.push(b[h]);
                    return g;
                }
                if (a.lib.is("String", b)) return b.substr(f, e);
                throw new a.Error("slice filter expects value to be an array or string");
            }
        },
        abs: function(a) {
            return void 0 !== a && null !== a ? Math.abs(a) : void 0;
        },
        first: function(a) {
            if (b("Array", a)) return a[0];
            if (b("Object", a)) {
                if ("_keys" in a) return a[a._keys[0]];
            } else if ("string" == typeof a) return a.substr(0, 1);
        },
        split: function(b, c) {
            if (void 0 !== b && null !== b) {
                if (void 0 === c || c.length < 1 || c.length > 2) throw new a.Error("split filter expects 1 or 2 argument");
                if (a.lib.is("String", b)) {
                    var d = c[0], e = c[1], f = b.split(d);
                    if (void 0 === e) return f;
                    if (0 > e) return b.split(d, f.length + e);
                    var g = [];
                    if ("" == d) for (;f.length > 0; ) {
                        for (var h = "", i = 0; e > i && f.length > 0; i++) h += f.shift();
                        g.push(h);
                    } else {
                        for (var i = 0; e - 1 > i && f.length > 0; i++) g.push(f.shift());
                        f.length > 0 && g.push(f.join(d));
                    }
                    return g;
                }
                throw new a.Error("split filter expects value to be a string");
            }
        },
        last: function(b) {
            if (a.lib.is("Object", b)) {
                var c;
                return c = void 0 === b._keys ? Object.keys(b) : b._keys, b[c[c.length - 1]];
            }
            return b[b.length - 1];
        },
        raw: function(b) {
            return a.Markup(b);
        },
        batch: function(b, c) {
            var d, e, f, g = c.shift(), h = c.shift();
            if (!a.lib.is("Array", b)) throw new a.Error("batch filter expects items to be an array");
            if (!a.lib.is("Number", g)) throw new a.Error("batch filter expects size to be a number");
            if (g = Math.ceil(g), d = a.lib.chunkArray(b, g), h && b.length % g != 0) {
                for (e = d.pop(), f = g - e.length; f--; ) e.push(h);
                d.push(e);
            }
            return d;
        },
        round: function(b, c) {
            c = c || [];
            var d = c.length > 0 ? c[0] : 0, e = c.length > 1 ? c[1] : "common";
            if (b = parseFloat(b), d && !a.lib.is("Number", d)) throw new a.Error("round filter expects precision to be a number");
            if ("common" === e) return a.lib.round(b, d);
            if (!a.lib.is("Function", Math[e])) throw new a.Error("round filter expects method to be 'floor', 'ceil', or 'common'");
            return Math[e](b * Math.pow(10, d)) / Math.pow(10, d);
        }
    }, a.filter = function(b, c, d) {
        if (!a.filters[b]) throw "Unable to find filter " + b;
        return a.filters[b].apply(this, [ c, d ]);
    }, a.filter.extend = function(b, c) {
        a.filters[b] = c;
    }, a;
}(Twig || {}), Twig = function(a) {
    return a.functions = {
        range: function(a, b, c) {
            var d, e, f, g = [], h = c || 1, i = !1;
            if (isNaN(a) || isNaN(b) ? isNaN(a) && isNaN(b) ? (i = !0, d = a.charCodeAt(0), 
            e = b.charCodeAt(0)) : (d = isNaN(a) ? 0 : a, e = isNaN(b) ? 0 : b) : (d = parseInt(a, 10), 
            e = parseInt(b, 10)), f = d > e ? !1 : !0) for (;e >= d; ) g.push(i ? String.fromCharCode(d) : d), 
            d += h; else for (;d >= e; ) g.push(i ? String.fromCharCode(d) : d), d -= h;
            return g;
        },
        cycle: function(a, b) {
            var c = b % a.length;
            return a[c];
        },
        dump: function() {
            var b = "\n", c = "  ", d = 0, e = "", f = Array.prototype.slice.call(arguments), g = function(a) {
                for (var b = ""; a > 0; ) a--, b += c;
                return b;
            }, h = function(a) {
                e += g(d), "object" == typeof a ? i(a) : "function" == typeof a ? e += "function()" + b : "string" == typeof a ? e += "string(" + a.length + ') "' + a + '"' + b : "number" == typeof a ? e += "number(" + a + ")" + b : "boolean" == typeof a && (e += "bool(" + a + ")" + b);
            }, i = function(a) {
                var c;
                if (null === a) e += "NULL" + b; else if (void 0 === a) e += "undefined" + b; else if ("object" == typeof a) {
                    e += g(d) + typeof a, d++, e += "(" + function(a) {
                        var b, c = 0;
                        for (b in a) a.hasOwnProperty(b) && c++;
                        return c;
                    }(a) + ") {" + b;
                    for (c in a) e += g(d) + "[" + c + "]=> " + b, h(a[c]);
                    d--, e += g(d) + "}" + b;
                } else h(a);
            };
            return 0 == f.length && f.push(this.context), a.forEach(f, function(a) {
                i(a);
            }), e;
        },
        date: function(b, c) {
            var d;
            if (void 0 === b) d = new Date(); else if (a.lib.is("Date", b)) d = b; else if (a.lib.is("String", b)) d = new Date(1e3 * a.lib.strtotime(b)); else {
                if (!a.lib.is("Number", b)) throw new a.Error("Unable to parse date " + b);
                d = new Date(1e3 * b);
            }
            return d;
        },
        block: function(b) {
            return this.originalBlockTokens[b] ? a.logic.parse.apply(this, [ this.originalBlockTokens[b], this.context ]).output : this.blocks[b];
        },
        parent: function() {
            return a.placeholders.parent;
        },
        attribute: function(b, c, d) {
            return a.lib.is("Object", b) && b.hasOwnProperty(c) ? "function" == typeof b[c] ? b[c].apply(void 0, d) : b[c] : b[c] || void 0;
        },
        template_from_string: function(b) {
            return void 0 === b && (b = ""), new a.Template({
                options: this.options,
                data: b
            });
        },
        random: function(b) {
            function c(a) {
                var b = Math.floor(Math.random() * d), c = [ 0, a ], e = Math.min.apply(null, c), f = Math.max.apply(null, c);
                return e + Math.floor((f - e + 1) * b / d);
            }
            var d = 2147483648;
            if (a.lib.is("Number", b)) return c(b);
            if (a.lib.is("String", b)) return b.charAt(c(b.length - 1));
            if (a.lib.is("Array", b)) return b[c(b.length - 1)];
            if (a.lib.is("Object", b)) {
                var e = Object.keys(b);
                return b[e[c(e.length - 1)]];
            }
            return c(d - 1);
        }
    }, a._function = function(b, c, d) {
        if (!a.functions[b]) throw "Unable to find function " + b;
        return a.functions[b](c, d);
    }, a._function.extend = function(b, c) {
        a.functions[b] = c;
    }, a;
}(Twig || {}), Twig = function(a) {
    "use strict";
    return a.tests = {
        empty: function(a) {
            if (null === a || void 0 === a) return !0;
            if ("number" == typeof a) return !1;
            if (a.length && a.length > 0) return !1;
            for (var b in a) if (a.hasOwnProperty(b)) return !1;
            return !0;
        },
        odd: function(a) {
            return a % 2 === 1;
        },
        even: function(a) {
            return a % 2 === 0;
        },
        divisibleby: function(a, b) {
            return a % b[0] === 0;
        },
        defined: function(a) {
            return void 0 !== a;
        },
        none: function(a) {
            return null === a;
        },
        "null": function(a) {
            return this.none(a);
        },
        sameas: function(a, b) {
            return a === b[0];
        },
        iterable: function(b) {
            return b && (a.lib.is("Array", b) || a.lib.is("Object", b));
        }
    }, a.test = function(b, c, d) {
        if (!a.tests[b]) throw "Test " + b + " is not defined.";
        return a.tests[b](c, d);
    }, a.test.extend = function(b, c) {
        a.tests[b] = c;
    }, a;
}(Twig || {}), Twig = function(a) {
    "use strict";
    return a.exports = {
        VERSION: a.VERSION
    }, a.exports.twig = function(b) {
        var c = b.id, d = {
            strict_variables: b.strict_variables || !1,
            autoescape: null != b.autoescape && b.autoescape || !1,
            allowInlineIncludes: b.allowInlineIncludes || !1,
            rethrow: b.rethrow || !1
        };
        if (c && a.validateId(c), void 0 !== b.debug && (a.debug = b.debug), void 0 !== b.trace && (a.trace = b.trace), 
        void 0 !== b.data) return new a.Template({
            data: b.data,
            module: b.module,
            id: c,
            options: d
        });
        if (void 0 !== b.ref) {
            if (void 0 !== b.id) throw new a.Error("Both ref and id cannot be set on a twig.js template.");
            return a.Templates.load(b.ref);
        }
        return void 0 !== b.href ? a.Templates.loadRemote(b.href, {
            id: c,
            method: "ajax",
            base: b.base,
            module: b.module,
            precompiled: b.precompiled,
            async: b.async,
            options: d
        }, b.load, b.error) : void 0 !== b.path ? a.Templates.loadRemote(b.path, {
            id: c,
            method: "fs",
            base: b.base,
            module: b.module,
            precompiled: b.precompiled,
            async: b.async,
            options: d
        }, b.load, b.error) : void 0;
    }, a.exports.extendFilter = function(b, c) {
        a.filter.extend(b, c);
    }, a.exports.extendFunction = function(b, c) {
        a._function.extend(b, c);
    }, a.exports.extendTest = function(b, c) {
        a.test.extend(b, c);
    }, a.exports.extendTag = function(b) {
        a.logic.extend(b);
    }, a.exports.extend = function(b) {
        b(a);
    }, a.exports.compile = function(b, c) {
        var d, e = c.filename, f = c.filename;
        return d = new a.Template({
            data: b,
            path: f,
            id: e,
            options: c.settings["twig options"]
        }), function(a) {
            return d.render(a);
        };
    }, a.exports.renderFile = function(b, c, d) {
        "function" == typeof c && (d = c, c = {}), c = c || {};
        var e = {
            path: b,
            base: c.settings.views,
            load: function(a) {
                d(null, a.render(c));
            }
        }, f = c.settings["twig options"];
        if (f) for (var g in f) f.hasOwnProperty(g) && (e[g] = f[g]);
        a.exports.twig(e);
    }, a.exports.__express = a.exports.renderFile, a.exports.cache = function(b) {
        a.cache = b;
    }, a;
}(Twig || {}), Twig = function(a) {
    return a.compiler = {
        module: {}
    }, a.compiler.compile = function(b, c) {
        var d, e = JSON.stringify(b.tokens), f = b.id;
        if (c.module) {
            if (void 0 === a.compiler.module[c.module]) throw new a.Error("Unable to find module type " + c.module);
            d = a.compiler.module[c.module](f, e, c.twig);
        } else d = a.compiler.wrap(f, e);
        return d;
    }, a.compiler.module = {
        amd: function(b, c, d) {
            return 'define(["' + d + '"], function (Twig) {\n	var twig, templates;\ntwig = Twig.twig;\ntemplates = ' + a.compiler.wrap(b, c) + "\n	return templates;\n});";
        },
        node: function(b, c) {
            return 'var twig = require("twig").twig;\nexports.template = ' + a.compiler.wrap(b, c);
        },
        cjs2: function(b, c, d) {
            return 'module.declare([{ twig: "' + d + '" }], function (require, exports, module) {\n	var twig = require("twig").twig;\n	exports.template = ' + a.compiler.wrap(b, c) + "\n});";
        }
    }, a.compiler.wrap = function(a, b) {
        return 'twig({id:"' + a.replace('"', '\\"') + '", data:' + b + ", precompiled: true});\n";
    }, a;
}(Twig || {});

"undefined" != typeof module && module.declare ? module.declare([], function(a, b, c) {
    for (key in Twig.exports) Twig.exports.hasOwnProperty(key) && (b[key] = Twig.exports[key]);
}) : "function" == typeof define && define.amd ? define(function() {
    return Twig.exports;
}) : "undefined" != typeof module && module.exports ? module.exports = Twig.exports : (window.twig = Twig.exports.twig, 
window.Twig = Twig.exports), function(a, b) {
    "use strict";
    function c() {
        n.length === Object.keys(l).length && FrontendMediator.publish([ "data:finish" ]);
    }
    function d(a, b, c) {
        for (var d in a) "object" == typeof a[d] && (a[d].innerHTML = b, c(a[d]));
    }
    function e(a) {
        var b = [];
        for (var c in a) b.push(c);
        return b;
    }
    function f(a, b) {
        var c, f;
        -1 !== b.indexOf("[") ? (f = b.replace("[", "").replace("]", "").split(","), b = q, 
        c = j[b]) : (c = j[b], f = e(c));
        for (var g = 0; g < f.length; g++) void 0 === o[f[g]] && (o[f[g]] = []), o[f[g]].push(a), 
        p[f[g]] = c[f[g]];
        FrontendMediator.subscribe(r + a, function(b) {
            var c = void 0 !== b.data ? b.data : {}, e = document.querySelectorAll('[data-fc-render*="' + a + '"]');
            d(e, k[a].render(c), function(a) {
                var b = a.querySelectorAll("[data-fc-modules]");
                for (var c in b) {
                    var d = b[c];
                    if ("object" == typeof d) {
                        var e = String.fromCharCode(65 + Math.floor(26 * Math.random()));
                        "" === d.id && (d.id = e + Date.now()), void 0 === m[d.dataset.fcModules] && FrontendCore.requireAndStart(d.dataset.fcModules), 
                        m[d.dataset.fcModules] = i;
                    }
                }
            });
        }), Object.keys(l).length === Object.keys(k).length && FrontendMediator.publish([ "templates:finish" ], p);
    }
    function g(a) {
        var b, c, d, e;
        for (var f in l) b = l[f], c = void 0 !== l[f].dataset.fcData ? l[f].dataset.fcData : q, 
        d = l[f].dataset.fcTemplate, e = l[f].dataset.fcRender, "data" === a ? t.Data(c) : "template" === a && t.Template(b, e, d, c);
    }
    var h = null, i = !0, j = {}, k = {}, l = {}, m = {}, n = [], o = {}, p = {}, q = "RoundTripData", r = "module:", s = "data:", t = {
        version: "1.0.0",
        Bind: h,
        Data: h,
        Module: h,
        Template: h,
        Error: h
    };
    t.Data = function(a) {
        var b, d = typeof a, e = [];
        if ("object" === d) {
            var f = a;
            for (b in f) p[b] = f[b], FrontendMediator.publish([ s + b ], p);
            c();
        } else if (a === q) {
            n.push(q + Date.now()), j.RoundTripData = RoundTripData;
            for (b in RoundTripData) p[b] = RoundTripData[b], e.push(s + b);
            FrontendMediator.publish(e, p), c();
        } else if (-1 !== a.indexOf("[")) {
            n.push(q + Date.now()), j.RoundTripData = oGlobalSettings.RoundTripData;
            var g = a.replace("[", "").replace("]", "").split(",");
            for (b in j.RoundTripData) p[b] = j.RoundTripData[b], -1 !== g.indexOf(b) && e.push(s + b);
            FrontendMediator.publish(e, p), c();
        } else {
            var h = a;
            -1 === n.indexOf(h) && (n.push(h), $.ajax({
                url: h,
                async: !1,
                success: function(a) {
                    j[h] = a, c();
                }
            }));
        }
    }, t.Template = function(a, c, d, e) {
        $.get(d, function(a) {
            k[c] = b({
                id: c,
                data: a
            }), f(c, e);
        });
    }, t.getModules = function() {
        return l;
    }, a.RoundTrip = t, a.window.onload = function() {
        var b = a.document.querySelectorAll("[data-fc-render]");
        void 0 !== oGlobalSettings.RoundTripData && t.Data(oGlobalSettings.RoundTripData);
        for (var c = 0; c < b.length; c++) l[b[c].dataset.fcRender] = b[c];
        FrontendMediator.subscribe([ "data:finish" ], function(a) {
            g("template"), FrontendMediator.unsubscribe([ "data:finish" ]);
        }), FrontendMediator.subscribe([ "templates:finish" ], function(a) {
            var b, c;
            for (b in a.data) {
                var d = s + b;
                c = {}, c[b] = p[b], FrontendMediator.subscribe(d, function(a) {
                    var b = a.name.toString().replace("data:", "");
                    for (var c in o[b]) FrontendMediator.publish(r + o[b][c], p);
                });
            }
            for (b in p) c = {}, c[b] = p[b], FrontendMediator.publish(s + b, c);
        }), g("data");
    };
}(this, twig);