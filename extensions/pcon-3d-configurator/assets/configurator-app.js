import { g as yc } from "./pcon-chunk-engine-AgGdbLMj.js";
var Di = { exports: {} }, kr = {}, Ai = { exports: {} }, ee = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ha;
function _d() {
  if (Ha) return ee;
  Ha = 1;
  var s = Symbol.for("react.element"), f = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), y = Symbol.for("react.strict_mode"), w = Symbol.for("react.profiler"), E = Symbol.for("react.provider"), S = Symbol.for("react.context"), T = Symbol.for("react.forward_ref"), I = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), D = Symbol.for("react.lazy"), k = Symbol.iterator;
  function B(d) {
    return d === null || typeof d != "object" ? null : (d = k && d[k] || d["@@iterator"], typeof d == "function" ? d : null);
  }
  var X = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, Z = Object.assign, R = {};
  function z(d, g, H) {
    this.props = d, this.context = g, this.refs = R, this.updater = H || X;
  }
  z.prototype.isReactComponent = {}, z.prototype.setState = function(d, g) {
    if (typeof d != "object" && typeof d != "function" && d != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, d, g, "setState");
  }, z.prototype.forceUpdate = function(d) {
    this.updater.enqueueForceUpdate(this, d, "forceUpdate");
  };
  function J() {
  }
  J.prototype = z.prototype;
  function se(d, g, H) {
    this.props = d, this.context = g, this.refs = R, this.updater = H || X;
  }
  var O = se.prototype = new J();
  O.constructor = se, Z(O, z.prototype), O.isPureReactComponent = !0;
  var le = Array.isArray, ae = Object.prototype.hasOwnProperty, re = { current: null }, ve = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Le(d, g, H) {
    var Y, b = {}, te = null, de = null;
    if (g != null) for (Y in g.ref !== void 0 && (de = g.ref), g.key !== void 0 && (te = "" + g.key), g) ae.call(g, Y) && !ve.hasOwnProperty(Y) && (b[Y] = g[Y]);
    var ce = arguments.length - 2;
    if (ce === 1) b.children = H;
    else if (1 < ce) {
      for (var we = Array(ce), be = 0; be < ce; be++) we[be] = arguments[be + 2];
      b.children = we;
    }
    if (d && d.defaultProps) for (Y in ce = d.defaultProps, ce) b[Y] === void 0 && (b[Y] = ce[Y]);
    return { $$typeof: s, type: d, key: te, ref: de, props: b, _owner: re.current };
  }
  function Qe(d, g) {
    return { $$typeof: s, type: d.type, key: g, ref: d.ref, props: d.props, _owner: d._owner };
  }
  function ge(d) {
    return typeof d == "object" && d !== null && d.$$typeof === s;
  }
  function F(d) {
    var g = { "=": "=0", ":": "=2" };
    return "$" + d.replace(/[=:]/g, function(H) {
      return g[H];
    });
  }
  var me = /\/+/g;
  function Ne(d, g) {
    return typeof d == "object" && d !== null && d.key != null ? F("" + d.key) : g.toString(36);
  }
  function He(d, g, H, Y, b) {
    var te = typeof d;
    (te === "undefined" || te === "boolean") && (d = null);
    var de = !1;
    if (d === null) de = !0;
    else switch (te) {
      case "string":
      case "number":
        de = !0;
        break;
      case "object":
        switch (d.$$typeof) {
          case s:
          case f:
            de = !0;
        }
    }
    if (de) return de = d, b = b(de), d = Y === "" ? "." + Ne(de, 0) : Y, le(b) ? (H = "", d != null && (H = d.replace(me, "$&/") + "/"), He(b, g, H, "", function(be) {
      return be;
    })) : b != null && (ge(b) && (b = Qe(b, H + (!b.key || de && de.key === b.key ? "" : ("" + b.key).replace(me, "$&/") + "/") + d)), g.push(b)), 1;
    if (de = 0, Y = Y === "" ? "." : Y + ":", le(d)) for (var ce = 0; ce < d.length; ce++) {
      te = d[ce];
      var we = Y + Ne(te, ce);
      de += He(te, g, H, we, b);
    }
    else if (we = B(d), typeof we == "function") for (d = we.call(d), ce = 0; !(te = d.next()).done; ) te = te.value, we = Y + Ne(te, ce++), de += He(te, g, H, we, b);
    else if (te === "object") throw g = String(d), Error("Objects are not valid as a React child (found: " + (g === "[object Object]" ? "object with keys {" + Object.keys(d).join(", ") + "}" : g) + "). If you meant to render a collection of children, use an array instead.");
    return de;
  }
  function Ee(d, g, H) {
    if (d == null) return d;
    var Y = [], b = 0;
    return He(d, Y, "", "", function(te) {
      return g.call(H, te, b++);
    }), Y;
  }
  function Oe(d) {
    if (d._status === -1) {
      var g = d._result;
      g = g(), g.then(function(H) {
        (d._status === 0 || d._status === -1) && (d._status = 1, d._result = H);
      }, function(H) {
        (d._status === 0 || d._status === -1) && (d._status = 2, d._result = H);
      }), d._status === -1 && (d._status = 0, d._result = g);
    }
    if (d._status === 1) return d._result.default;
    throw d._result;
  }
  var ie = { current: null }, j = { transition: null }, q = { ReactCurrentDispatcher: ie, ReactCurrentBatchConfig: j, ReactCurrentOwner: re };
  function M() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return ee.Children = { map: Ee, forEach: function(d, g, H) {
    Ee(d, function() {
      g.apply(this, arguments);
    }, H);
  }, count: function(d) {
    var g = 0;
    return Ee(d, function() {
      g++;
    }), g;
  }, toArray: function(d) {
    return Ee(d, function(g) {
      return g;
    }) || [];
  }, only: function(d) {
    if (!ge(d)) throw Error("React.Children.only expected to receive a single React element child.");
    return d;
  } }, ee.Component = z, ee.Fragment = u, ee.Profiler = w, ee.PureComponent = se, ee.StrictMode = y, ee.Suspense = I, ee.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = q, ee.act = M, ee.cloneElement = function(d, g, H) {
    if (d == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + d + ".");
    var Y = Z({}, d.props), b = d.key, te = d.ref, de = d._owner;
    if (g != null) {
      if (g.ref !== void 0 && (te = g.ref, de = re.current), g.key !== void 0 && (b = "" + g.key), d.type && d.type.defaultProps) var ce = d.type.defaultProps;
      for (we in g) ae.call(g, we) && !ve.hasOwnProperty(we) && (Y[we] = g[we] === void 0 && ce !== void 0 ? ce[we] : g[we]);
    }
    var we = arguments.length - 2;
    if (we === 1) Y.children = H;
    else if (1 < we) {
      ce = Array(we);
      for (var be = 0; be < we; be++) ce[be] = arguments[be + 2];
      Y.children = ce;
    }
    return { $$typeof: s, type: d.type, key: b, ref: te, props: Y, _owner: de };
  }, ee.createContext = function(d) {
    return d = { $$typeof: S, _currentValue: d, _currentValue2: d, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, d.Provider = { $$typeof: E, _context: d }, d.Consumer = d;
  }, ee.createElement = Le, ee.createFactory = function(d) {
    var g = Le.bind(null, d);
    return g.type = d, g;
  }, ee.createRef = function() {
    return { current: null };
  }, ee.forwardRef = function(d) {
    return { $$typeof: T, render: d };
  }, ee.isValidElement = ge, ee.lazy = function(d) {
    return { $$typeof: D, _payload: { _status: -1, _result: d }, _init: Oe };
  }, ee.memo = function(d, g) {
    return { $$typeof: x, type: d, compare: g === void 0 ? null : g };
  }, ee.startTransition = function(d) {
    var g = j.transition;
    j.transition = {};
    try {
      d();
    } finally {
      j.transition = g;
    }
  }, ee.unstable_act = M, ee.useCallback = function(d, g) {
    return ie.current.useCallback(d, g);
  }, ee.useContext = function(d) {
    return ie.current.useContext(d);
  }, ee.useDebugValue = function() {
  }, ee.useDeferredValue = function(d) {
    return ie.current.useDeferredValue(d);
  }, ee.useEffect = function(d, g) {
    return ie.current.useEffect(d, g);
  }, ee.useId = function() {
    return ie.current.useId();
  }, ee.useImperativeHandle = function(d, g, H) {
    return ie.current.useImperativeHandle(d, g, H);
  }, ee.useInsertionEffect = function(d, g) {
    return ie.current.useInsertionEffect(d, g);
  }, ee.useLayoutEffect = function(d, g) {
    return ie.current.useLayoutEffect(d, g);
  }, ee.useMemo = function(d, g) {
    return ie.current.useMemo(d, g);
  }, ee.useReducer = function(d, g, H) {
    return ie.current.useReducer(d, g, H);
  }, ee.useRef = function(d) {
    return ie.current.useRef(d);
  }, ee.useState = function(d) {
    return ie.current.useState(d);
  }, ee.useSyncExternalStore = function(d, g, H) {
    return ie.current.useSyncExternalStore(d, g, H);
  }, ee.useTransition = function() {
    return ie.current.useTransition();
  }, ee.version = "18.3.1", ee;
}
var $a;
function Gi() {
  return $a || ($a = 1, Ai.exports = /* @__PURE__ */ _d()), Ai.exports;
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ka;
function Ed() {
  if (Ka) return kr;
  Ka = 1;
  var s = /* @__PURE__ */ Gi(), f = Symbol.for("react.element"), u = Symbol.for("react.fragment"), y = Object.prototype.hasOwnProperty, w = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, E = { key: !0, ref: !0, __self: !0, __source: !0 };
  function S(T, I, x) {
    var D, k = {}, B = null, X = null;
    x !== void 0 && (B = "" + x), I.key !== void 0 && (B = "" + I.key), I.ref !== void 0 && (X = I.ref);
    for (D in I) y.call(I, D) && !E.hasOwnProperty(D) && (k[D] = I[D]);
    if (T && T.defaultProps) for (D in I = T.defaultProps, I) k[D] === void 0 && (k[D] = I[D]);
    return { $$typeof: f, type: T, key: B, ref: X, props: k, _owner: w.current };
  }
  return kr.Fragment = u, kr.jsx = S, kr.jsxs = S, kr;
}
var qa;
function Cd() {
  return qa || (qa = 1, Di.exports = /* @__PURE__ */ Ed()), Di.exports;
}
var N = /* @__PURE__ */ Cd(), zl = {}, Mi = { exports: {} }, Ze = {}, Ui = { exports: {} }, Fi = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ya;
function xd() {
  return Ya || (Ya = 1, (function(s) {
    function f(j, q) {
      var M = j.length;
      j.push(q);
      e: for (; 0 < M; ) {
        var d = M - 1 >>> 1, g = j[d];
        if (0 < w(g, q)) j[d] = q, j[M] = g, M = d;
        else break e;
      }
    }
    function u(j) {
      return j.length === 0 ? null : j[0];
    }
    function y(j) {
      if (j.length === 0) return null;
      var q = j[0], M = j.pop();
      if (M !== q) {
        j[0] = M;
        e: for (var d = 0, g = j.length, H = g >>> 1; d < H; ) {
          var Y = 2 * (d + 1) - 1, b = j[Y], te = Y + 1, de = j[te];
          if (0 > w(b, M)) te < g && 0 > w(de, b) ? (j[d] = de, j[te] = M, d = te) : (j[d] = b, j[Y] = M, d = Y);
          else if (te < g && 0 > w(de, M)) j[d] = de, j[te] = M, d = te;
          else break e;
        }
      }
      return q;
    }
    function w(j, q) {
      var M = j.sortIndex - q.sortIndex;
      return M !== 0 ? M : j.id - q.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var E = performance;
      s.unstable_now = function() {
        return E.now();
      };
    } else {
      var S = Date, T = S.now();
      s.unstable_now = function() {
        return S.now() - T;
      };
    }
    var I = [], x = [], D = 1, k = null, B = 3, X = !1, Z = !1, R = !1, z = typeof setTimeout == "function" ? setTimeout : null, J = typeof clearTimeout == "function" ? clearTimeout : null, se = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function O(j) {
      for (var q = u(x); q !== null; ) {
        if (q.callback === null) y(x);
        else if (q.startTime <= j) y(x), q.sortIndex = q.expirationTime, f(I, q);
        else break;
        q = u(x);
      }
    }
    function le(j) {
      if (R = !1, O(j), !Z) if (u(I) !== null) Z = !0, Oe(ae);
      else {
        var q = u(x);
        q !== null && ie(le, q.startTime - j);
      }
    }
    function ae(j, q) {
      Z = !1, R && (R = !1, J(Le), Le = -1), X = !0;
      var M = B;
      try {
        for (O(q), k = u(I); k !== null && (!(k.expirationTime > q) || j && !F()); ) {
          var d = k.callback;
          if (typeof d == "function") {
            k.callback = null, B = k.priorityLevel;
            var g = d(k.expirationTime <= q);
            q = s.unstable_now(), typeof g == "function" ? k.callback = g : k === u(I) && y(I), O(q);
          } else y(I);
          k = u(I);
        }
        if (k !== null) var H = !0;
        else {
          var Y = u(x);
          Y !== null && ie(le, Y.startTime - q), H = !1;
        }
        return H;
      } finally {
        k = null, B = M, X = !1;
      }
    }
    var re = !1, ve = null, Le = -1, Qe = 5, ge = -1;
    function F() {
      return !(s.unstable_now() - ge < Qe);
    }
    function me() {
      if (ve !== null) {
        var j = s.unstable_now();
        ge = j;
        var q = !0;
        try {
          q = ve(!0, j);
        } finally {
          q ? Ne() : (re = !1, ve = null);
        }
      } else re = !1;
    }
    var Ne;
    if (typeof se == "function") Ne = function() {
      se(me);
    };
    else if (typeof MessageChannel < "u") {
      var He = new MessageChannel(), Ee = He.port2;
      He.port1.onmessage = me, Ne = function() {
        Ee.postMessage(null);
      };
    } else Ne = function() {
      z(me, 0);
    };
    function Oe(j) {
      ve = j, re || (re = !0, Ne());
    }
    function ie(j, q) {
      Le = z(function() {
        j(s.unstable_now());
      }, q);
    }
    s.unstable_IdlePriority = 5, s.unstable_ImmediatePriority = 1, s.unstable_LowPriority = 4, s.unstable_NormalPriority = 3, s.unstable_Profiling = null, s.unstable_UserBlockingPriority = 2, s.unstable_cancelCallback = function(j) {
      j.callback = null;
    }, s.unstable_continueExecution = function() {
      Z || X || (Z = !0, Oe(ae));
    }, s.unstable_forceFrameRate = function(j) {
      0 > j || 125 < j ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Qe = 0 < j ? Math.floor(1e3 / j) : 5;
    }, s.unstable_getCurrentPriorityLevel = function() {
      return B;
    }, s.unstable_getFirstCallbackNode = function() {
      return u(I);
    }, s.unstable_next = function(j) {
      switch (B) {
        case 1:
        case 2:
        case 3:
          var q = 3;
          break;
        default:
          q = B;
      }
      var M = B;
      B = q;
      try {
        return j();
      } finally {
        B = M;
      }
    }, s.unstable_pauseExecution = function() {
    }, s.unstable_requestPaint = function() {
    }, s.unstable_runWithPriority = function(j, q) {
      switch (j) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          j = 3;
      }
      var M = B;
      B = j;
      try {
        return q();
      } finally {
        B = M;
      }
    }, s.unstable_scheduleCallback = function(j, q, M) {
      var d = s.unstable_now();
      switch (typeof M == "object" && M !== null ? (M = M.delay, M = typeof M == "number" && 0 < M ? d + M : d) : M = d, j) {
        case 1:
          var g = -1;
          break;
        case 2:
          g = 250;
          break;
        case 5:
          g = 1073741823;
          break;
        case 4:
          g = 1e4;
          break;
        default:
          g = 5e3;
      }
      return g = M + g, j = { id: D++, callback: q, priorityLevel: j, startTime: M, expirationTime: g, sortIndex: -1 }, M > d ? (j.sortIndex = M, f(x, j), u(I) === null && j === u(x) && (R ? (J(Le), Le = -1) : R = !0, ie(le, M - d))) : (j.sortIndex = g, f(I, j), Z || X || (Z = !0, Oe(ae))), j;
    }, s.unstable_shouldYield = F, s.unstable_wrapCallback = function(j) {
      var q = B;
      return function() {
        var M = B;
        B = q;
        try {
          return j.apply(this, arguments);
        } finally {
          B = M;
        }
      };
    };
  })(Fi)), Fi;
}
var Ga;
function Pd() {
  return Ga || (Ga = 1, Ui.exports = /* @__PURE__ */ xd()), Ui.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Xa;
function Nd() {
  if (Xa) return Ze;
  Xa = 1;
  var s = /* @__PURE__ */ Gi(), f = /* @__PURE__ */ Pd();
  function u(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var y = /* @__PURE__ */ new Set(), w = {};
  function E(e, t) {
    S(e, t), S(e + "Capture", t);
  }
  function S(e, t) {
    for (w[e] = t, e = 0; e < t.length; e++) y.add(t[e]);
  }
  var T = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), I = Object.prototype.hasOwnProperty, x = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, D = {}, k = {};
  function B(e) {
    return I.call(k, e) ? !0 : I.call(D, e) ? !1 : x.test(e) ? k[e] = !0 : (D[e] = !0, !1);
  }
  function X(e, t, n, r) {
    if (n !== null && n.type === 0) return !1;
    switch (typeof t) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return r ? !1 : n !== null ? !n.acceptsBooleans : (e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-");
      default:
        return !1;
    }
  }
  function Z(e, t, n, r) {
    if (t === null || typeof t > "u" || X(e, t, n, r)) return !0;
    if (r) return !1;
    if (n !== null) switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
    return !1;
  }
  function R(e, t, n, r, l, o, i) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = o, this.removeEmptyString = i;
  }
  var z = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    z[e] = new R(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    z[t] = new R(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    z[e] = new R(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    z[e] = new R(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    z[e] = new R(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    z[e] = new R(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    z[e] = new R(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    z[e] = new R(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    z[e] = new R(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var J = /[\-:]([a-z])/g;
  function se(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      J,
      se
    );
    z[t] = new R(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(J, se);
    z[t] = new R(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(J, se);
    z[t] = new R(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    z[e] = new R(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), z.xlinkHref = new R("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    z[e] = new R(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function O(e, t, n, r) {
    var l = z.hasOwnProperty(t) ? z[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (Z(t, n, l, r) && (n = null), r || l === null ? B(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var le = s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ae = Symbol.for("react.element"), re = Symbol.for("react.portal"), ve = Symbol.for("react.fragment"), Le = Symbol.for("react.strict_mode"), Qe = Symbol.for("react.profiler"), ge = Symbol.for("react.provider"), F = Symbol.for("react.context"), me = Symbol.for("react.forward_ref"), Ne = Symbol.for("react.suspense"), He = Symbol.for("react.suspense_list"), Ee = Symbol.for("react.memo"), Oe = Symbol.for("react.lazy"), ie = Symbol.for("react.offscreen"), j = Symbol.iterator;
  function q(e) {
    return e === null || typeof e != "object" ? null : (e = j && e[j] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var M = Object.assign, d;
  function g(e) {
    if (d === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      d = t && t[1] || "";
    }
    return `
` + d + e;
  }
  var H = !1;
  function Y(e, t) {
    if (!e || H) return "";
    H = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (t) if (t = function() {
        throw Error();
      }, Object.defineProperty(t.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(t, []);
        } catch (v) {
          var r = v;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (v) {
          r = v;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (v) {
          r = v;
        }
        e();
      }
    } catch (v) {
      if (v && r && typeof v.stack == "string") {
        for (var l = v.stack.split(`
`), o = r.stack.split(`
`), i = l.length - 1, a = o.length - 1; 1 <= i && 0 <= a && l[i] !== o[a]; ) a--;
        for (; 1 <= i && 0 <= a; i--, a--) if (l[i] !== o[a]) {
          if (i !== 1 || a !== 1)
            do
              if (i--, a--, 0 > a || l[i] !== o[a]) {
                var c = `
` + l[i].replace(" at new ", " at ");
                return e.displayName && c.includes("<anonymous>") && (c = c.replace("<anonymous>", e.displayName)), c;
              }
            while (1 <= i && 0 <= a);
          break;
        }
      }
    } finally {
      H = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? g(e) : "";
  }
  function b(e) {
    switch (e.tag) {
      case 5:
        return g(e.type);
      case 16:
        return g("Lazy");
      case 13:
        return g("Suspense");
      case 19:
        return g("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = Y(e.type, !1), e;
      case 11:
        return e = Y(e.type.render, !1), e;
      case 1:
        return e = Y(e.type, !0), e;
      default:
        return "";
    }
  }
  function te(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case ve:
        return "Fragment";
      case re:
        return "Portal";
      case Qe:
        return "Profiler";
      case Le:
        return "StrictMode";
      case Ne:
        return "Suspense";
      case He:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case F:
        return (e.displayName || "Context") + ".Consumer";
      case ge:
        return (e._context.displayName || "Context") + ".Provider";
      case me:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Ee:
        return t = e.displayName || null, t !== null ? t : te(e.type) || "Memo";
      case Oe:
        t = e._payload, e = e._init;
        try {
          return te(e(t));
        } catch {
        }
    }
    return null;
  }
  function de(e) {
    var t = e.type;
    switch (e.tag) {
      case 24:
        return "Cache";
      case 9:
        return (t.displayName || "Context") + ".Consumer";
      case 10:
        return (t._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return e = t.render, e = e.displayName || e.name || "", t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return t;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return te(t);
      case 8:
        return t === Le ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof t == "function") return t.displayName || t.name || null;
        if (typeof t == "string") return t;
    }
    return null;
  }
  function ce(e) {
    switch (typeof e) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return e;
      case "object":
        return e;
      default:
        return "";
    }
  }
  function we(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function be(e) {
    var t = we(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
    if (!e.hasOwnProperty(t) && typeof n < "u" && typeof n.get == "function" && typeof n.set == "function") {
      var l = n.get, o = n.set;
      return Object.defineProperty(e, t, { configurable: !0, get: function() {
        return l.call(this);
      }, set: function(i) {
        r = "" + i, o.call(this, i);
      } }), Object.defineProperty(e, t, { enumerable: n.enumerable }), { getValue: function() {
        return r;
      }, setValue: function(i) {
        r = "" + i;
      }, stopTracking: function() {
        e._valueTracker = null, delete e[t];
      } };
    }
  }
  function Cr(e) {
    e._valueTracker || (e._valueTracker = be(e));
  }
  function Xi(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = we(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function xr(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Wl(e, t) {
    var n = t.checked;
    return M({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function Ji(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = ce(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Zi(e, t) {
    t = t.checked, t != null && O(e, "checked", t, !1);
  }
  function Bl(e, t) {
    Zi(e, t);
    var n = ce(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Ql(e, t.type, n) : t.hasOwnProperty("defaultValue") && Ql(e, t.type, ce(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function bi(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Ql(e, t, n) {
    (t !== "number" || xr(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var An = Array.isArray;
  function fn(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + ce(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          e[l].selected = !0, r && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Hl(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(u(91));
    return M({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function eu(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(u(92));
        if (An(n)) {
          if (1 < n.length) throw Error(u(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: ce(n) };
  }
  function tu(e, t) {
    var n = ce(t.value), r = ce(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function nu(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function ru(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function $l(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? ru(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Pr, lu = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Pr = Pr || document.createElement("div"), Pr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Pr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function Mn(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Un = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, xc = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Un).forEach(function(e) {
    xc.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Un[t] = Un[e];
    });
  });
  function ou(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Un.hasOwnProperty(e) && Un[e] ? ("" + t).trim() : t + "px";
  }
  function iu(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = ou(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var Pc = M({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Kl(e, t) {
    if (t) {
      if (Pc[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(u(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(u(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(u(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(u(62));
    }
  }
  function ql(e, t) {
    if (e.indexOf("-") === -1) return typeof t.is == "string";
    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var Yl = null;
  function Gl(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Xl = null, dn = null, pn = null;
  function uu(e) {
    if (e = ir(e)) {
      if (typeof Xl != "function") throw Error(u(280));
      var t = e.stateNode;
      t && (t = Gr(t), Xl(e.stateNode, e.type, t));
    }
  }
  function su(e) {
    dn ? pn ? pn.push(e) : pn = [e] : dn = e;
  }
  function au() {
    if (dn) {
      var e = dn, t = pn;
      if (pn = dn = null, uu(e), t) for (e = 0; e < t.length; e++) uu(t[e]);
    }
  }
  function cu(e, t) {
    return e(t);
  }
  function fu() {
  }
  var Jl = !1;
  function du(e, t, n) {
    if (Jl) return e(t, n);
    Jl = !0;
    try {
      return cu(e, t, n);
    } finally {
      Jl = !1, (dn !== null || pn !== null) && (fu(), au());
    }
  }
  function Fn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = Gr(n);
    if (r === null) return null;
    n = r[t];
    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != "function") throw Error(u(231, t, typeof n));
    return n;
  }
  var Zl = !1;
  if (T) try {
    var Vn = {};
    Object.defineProperty(Vn, "passive", { get: function() {
      Zl = !0;
    } }), window.addEventListener("test", Vn, Vn), window.removeEventListener("test", Vn, Vn);
  } catch {
    Zl = !1;
  }
  function Nc(e, t, n, r, l, o, i, a, c) {
    var v = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, v);
    } catch (C) {
      this.onError(C);
    }
  }
  var Wn = !1, Nr = null, Rr = !1, bl = null, Rc = { onError: function(e) {
    Wn = !0, Nr = e;
  } };
  function Lc(e, t, n, r, l, o, i, a, c) {
    Wn = !1, Nr = null, Nc.apply(Rc, arguments);
  }
  function Ic(e, t, n, r, l, o, i, a, c) {
    if (Lc.apply(this, arguments), Wn) {
      if (Wn) {
        var v = Nr;
        Wn = !1, Nr = null;
      } else throw Error(u(198));
      Rr || (Rr = !0, bl = v);
    }
  }
  function Xt(e) {
    var t = e, n = e;
    if (e.alternate) for (; t.return; ) t = t.return;
    else {
      e = t;
      do
        t = e, (t.flags & 4098) !== 0 && (n = t.return), e = t.return;
      while (e);
    }
    return t.tag === 3 ? n : null;
  }
  function pu(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function mu(e) {
    if (Xt(e) !== e) throw Error(u(188));
  }
  function Tc(e) {
    var t = e.alternate;
    if (!t) {
      if (t = Xt(e), t === null) throw Error(u(188));
      return t !== e ? null : e;
    }
    for (var n = e, r = t; ; ) {
      var l = n.return;
      if (l === null) break;
      var o = l.alternate;
      if (o === null) {
        if (r = l.return, r !== null) {
          n = r;
          continue;
        }
        break;
      }
      if (l.child === o.child) {
        for (o = l.child; o; ) {
          if (o === n) return mu(l), e;
          if (o === r) return mu(l), t;
          o = o.sibling;
        }
        throw Error(u(188));
      }
      if (n.return !== r.return) n = l, r = o;
      else {
        for (var i = !1, a = l.child; a; ) {
          if (a === n) {
            i = !0, n = l, r = o;
            break;
          }
          if (a === r) {
            i = !0, r = l, n = o;
            break;
          }
          a = a.sibling;
        }
        if (!i) {
          for (a = o.child; a; ) {
            if (a === n) {
              i = !0, n = o, r = l;
              break;
            }
            if (a === r) {
              i = !0, r = o, n = l;
              break;
            }
            a = a.sibling;
          }
          if (!i) throw Error(u(189));
        }
      }
      if (n.alternate !== r) throw Error(u(190));
    }
    if (n.tag !== 3) throw Error(u(188));
    return n.stateNode.current === n ? e : t;
  }
  function hu(e) {
    return e = Tc(e), e !== null ? yu(e) : null;
  }
  function yu(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = yu(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var vu = f.unstable_scheduleCallback, gu = f.unstable_cancelCallback, Oc = f.unstable_shouldYield, jc = f.unstable_requestPaint, xe = f.unstable_now, zc = f.unstable_getCurrentPriorityLevel, eo = f.unstable_ImmediatePriority, wu = f.unstable_UserBlockingPriority, Lr = f.unstable_NormalPriority, Dc = f.unstable_LowPriority, Su = f.unstable_IdlePriority, Ir = null, vt = null;
  function Ac(e) {
    if (vt && typeof vt.onCommitFiberRoot == "function") try {
      vt.onCommitFiberRoot(Ir, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var ct = Math.clz32 ? Math.clz32 : Fc, Mc = Math.log, Uc = Math.LN2;
  function Fc(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Mc(e) / Uc | 0) | 0;
  }
  var Tr = 64, Or = 4194304;
  function Bn(e) {
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return e & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return e;
    }
  }
  function jr(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, o = e.pingedLanes, i = n & 268435455;
    if (i !== 0) {
      var a = i & ~l;
      a !== 0 ? r = Bn(a) : (o &= i, o !== 0 && (r = Bn(o)));
    } else i = n & ~l, i !== 0 ? r = Bn(i) : o !== 0 && (r = Bn(o));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, o = t & -t, l >= o || l === 16 && (o & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - ct(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function Vc(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
        return t + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function Wc(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
      var i = 31 - ct(o), a = 1 << i, c = l[i];
      c === -1 ? ((a & n) === 0 || (a & r) !== 0) && (l[i] = Vc(a, t)) : c <= t && (e.expiredLanes |= a), o &= ~a;
    }
  }
  function to(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function ku() {
    var e = Tr;
    return Tr <<= 1, (Tr & 4194240) === 0 && (Tr = 64), e;
  }
  function no(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Qn(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - ct(t), e[t] = n;
  }
  function Bc(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - ct(n), o = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~o;
    }
  }
  function ro(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - ct(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var fe = 0;
  function _u(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var Eu, lo, Cu, xu, Pu, oo = !1, zr = [], Tt = null, Ot = null, jt = null, Hn = /* @__PURE__ */ new Map(), $n = /* @__PURE__ */ new Map(), zt = [], Qc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Nu(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Tt = null;
        break;
      case "dragenter":
      case "dragleave":
        Ot = null;
        break;
      case "mouseover":
      case "mouseout":
        jt = null;
        break;
      case "pointerover":
      case "pointerout":
        Hn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        $n.delete(t.pointerId);
    }
  }
  function Kn(e, t, n, r, l, o) {
    return e === null || e.nativeEvent !== o ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: o, targetContainers: [l] }, t !== null && (t = ir(t), t !== null && lo(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function Hc(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return Tt = Kn(Tt, e, t, n, r, l), !0;
      case "dragenter":
        return Ot = Kn(Ot, e, t, n, r, l), !0;
      case "mouseover":
        return jt = Kn(jt, e, t, n, r, l), !0;
      case "pointerover":
        var o = l.pointerId;
        return Hn.set(o, Kn(Hn.get(o) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return o = l.pointerId, $n.set(o, Kn($n.get(o) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function Ru(e) {
    var t = Jt(e.target);
    if (t !== null) {
      var n = Xt(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = pu(n), t !== null) {
            e.blockedOn = t, Pu(e.priority, function() {
              Cu(n);
            });
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function Dr(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = uo(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        Yl = r, n.target.dispatchEvent(r), Yl = null;
      } else return t = ir(n), t !== null && lo(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Lu(e, t, n) {
    Dr(e) && n.delete(t);
  }
  function $c() {
    oo = !1, Tt !== null && Dr(Tt) && (Tt = null), Ot !== null && Dr(Ot) && (Ot = null), jt !== null && Dr(jt) && (jt = null), Hn.forEach(Lu), $n.forEach(Lu);
  }
  function qn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, oo || (oo = !0, f.unstable_scheduleCallback(f.unstable_NormalPriority, $c)));
  }
  function Yn(e) {
    function t(l) {
      return qn(l, e);
    }
    if (0 < zr.length) {
      qn(zr[0], e);
      for (var n = 1; n < zr.length; n++) {
        var r = zr[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Tt !== null && qn(Tt, e), Ot !== null && qn(Ot, e), jt !== null && qn(jt, e), Hn.forEach(t), $n.forEach(t), n = 0; n < zt.length; n++) r = zt[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < zt.length && (n = zt[0], n.blockedOn === null); ) Ru(n), n.blockedOn === null && zt.shift();
  }
  var mn = le.ReactCurrentBatchConfig, Ar = !0;
  function Kc(e, t, n, r) {
    var l = fe, o = mn.transition;
    mn.transition = null;
    try {
      fe = 1, io(e, t, n, r);
    } finally {
      fe = l, mn.transition = o;
    }
  }
  function qc(e, t, n, r) {
    var l = fe, o = mn.transition;
    mn.transition = null;
    try {
      fe = 4, io(e, t, n, r);
    } finally {
      fe = l, mn.transition = o;
    }
  }
  function io(e, t, n, r) {
    if (Ar) {
      var l = uo(e, t, n, r);
      if (l === null) xo(e, t, r, Mr, n), Nu(e, r);
      else if (Hc(l, e, t, n, r)) r.stopPropagation();
      else if (Nu(e, r), t & 4 && -1 < Qc.indexOf(e)) {
        for (; l !== null; ) {
          var o = ir(l);
          if (o !== null && Eu(o), o = uo(e, t, n, r), o === null && xo(e, t, r, Mr, n), o === l) break;
          l = o;
        }
        l !== null && r.stopPropagation();
      } else xo(e, t, r, null, n);
    }
  }
  var Mr = null;
  function uo(e, t, n, r) {
    if (Mr = null, e = Gl(r), e = Jt(e), e !== null) if (t = Xt(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = pu(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Mr = e, null;
  }
  function Iu(e) {
    switch (e) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (zc()) {
          case eo:
            return 1;
          case wu:
            return 4;
          case Lr:
          case Dc:
            return 16;
          case Su:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Dt = null, so = null, Ur = null;
  function Tu() {
    if (Ur) return Ur;
    var e, t = so, n = t.length, r, l = "value" in Dt ? Dt.value : Dt.textContent, o = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var i = n - e;
    for (r = 1; r <= i && t[n - r] === l[o - r]; r++) ;
    return Ur = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Fr(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Vr() {
    return !0;
  }
  function Ou() {
    return !1;
  }
  function et(e) {
    function t(n, r, l, o, i) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = o, this.target = i, this.currentTarget = null;
      for (var a in e) e.hasOwnProperty(a) && (n = e[a], this[a] = n ? n(o) : o[a]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? Vr : Ou, this.isPropagationStopped = Ou, this;
    }
    return M(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Vr);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Vr);
    }, persist: function() {
    }, isPersistent: Vr }), t;
  }
  var hn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, ao = et(hn), Gn = M({}, hn, { view: 0, detail: 0 }), Yc = et(Gn), co, fo, Xn, Wr = M({}, Gn, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: mo, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== Xn && (Xn && e.type === "mousemove" ? (co = e.screenX - Xn.screenX, fo = e.screenY - Xn.screenY) : fo = co = 0, Xn = e), co);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : fo;
  } }), ju = et(Wr), Gc = M({}, Wr, { dataTransfer: 0 }), Xc = et(Gc), Jc = M({}, Gn, { relatedTarget: 0 }), po = et(Jc), Zc = M({}, hn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), bc = et(Zc), ef = M({}, hn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), tf = et(ef), nf = M({}, hn, { data: 0 }), zu = et(nf), rf = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, lf = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, of = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function uf(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = of[e]) ? !!t[e] : !1;
  }
  function mo() {
    return uf;
  }
  var sf = M({}, Gn, { key: function(e) {
    if (e.key) {
      var t = rf[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Fr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? lf[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: mo, charCode: function(e) {
    return e.type === "keypress" ? Fr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Fr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), af = et(sf), cf = M({}, Wr, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Du = et(cf), ff = M({}, Gn, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: mo }), df = et(ff), pf = M({}, hn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), mf = et(pf), hf = M({}, Wr, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), yf = et(hf), vf = [9, 13, 27, 32], ho = T && "CompositionEvent" in window, Jn = null;
  T && "documentMode" in document && (Jn = document.documentMode);
  var gf = T && "TextEvent" in window && !Jn, Au = T && (!ho || Jn && 8 < Jn && 11 >= Jn), Mu = " ", Uu = !1;
  function Fu(e, t) {
    switch (e) {
      case "keyup":
        return vf.indexOf(t.keyCode) !== -1;
      case "keydown":
        return t.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Vu(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var yn = !1;
  function wf(e, t) {
    switch (e) {
      case "compositionend":
        return Vu(t);
      case "keypress":
        return t.which !== 32 ? null : (Uu = !0, Mu);
      case "textInput":
        return e = t.data, e === Mu && Uu ? null : e;
      default:
        return null;
    }
  }
  function Sf(e, t) {
    if (yn) return e === "compositionend" || !ho && Fu(e, t) ? (e = Tu(), Ur = so = Dt = null, yn = !1, e) : null;
    switch (e) {
      case "paste":
        return null;
      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case "compositionend":
        return Au && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var kf = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Wu(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!kf[e.type] : t === "textarea";
  }
  function Bu(e, t, n, r) {
    su(r), t = Kr(t, "onChange"), 0 < t.length && (n = new ao("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var Zn = null, bn = null;
  function _f(e) {
    is(e, 0);
  }
  function Br(e) {
    var t = kn(e);
    if (Xi(t)) return e;
  }
  function Ef(e, t) {
    if (e === "change") return t;
  }
  var Qu = !1;
  if (T) {
    var yo;
    if (T) {
      var vo = "oninput" in document;
      if (!vo) {
        var Hu = document.createElement("div");
        Hu.setAttribute("oninput", "return;"), vo = typeof Hu.oninput == "function";
      }
      yo = vo;
    } else yo = !1;
    Qu = yo && (!document.documentMode || 9 < document.documentMode);
  }
  function $u() {
    Zn && (Zn.detachEvent("onpropertychange", Ku), bn = Zn = null);
  }
  function Ku(e) {
    if (e.propertyName === "value" && Br(bn)) {
      var t = [];
      Bu(t, bn, e, Gl(e)), du(_f, t);
    }
  }
  function Cf(e, t, n) {
    e === "focusin" ? ($u(), Zn = t, bn = n, Zn.attachEvent("onpropertychange", Ku)) : e === "focusout" && $u();
  }
  function xf(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Br(bn);
  }
  function Pf(e, t) {
    if (e === "click") return Br(t);
  }
  function Nf(e, t) {
    if (e === "input" || e === "change") return Br(t);
  }
  function Rf(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ft = typeof Object.is == "function" ? Object.is : Rf;
  function er(e, t) {
    if (ft(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!I.call(t, l) || !ft(e[l], t[l])) return !1;
    }
    return !0;
  }
  function qu(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Yu(e, t) {
    var n = qu(e);
    e = 0;
    for (var r; n; ) {
      if (n.nodeType === 3) {
        if (r = e + n.textContent.length, e <= t && r >= t) return { node: n, offset: t - e };
        e = r;
      }
      e: {
        for (; n; ) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = qu(n);
    }
  }
  function Gu(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Gu(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Xu() {
    for (var e = window, t = xr(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = xr(e.document);
    }
    return t;
  }
  function go(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Lf(e) {
    var t = Xu(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && Gu(n.ownerDocument.documentElement, n)) {
      if (r !== null && go(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, o = Math.min(r.start, l);
          r = r.end === void 0 ? o : Math.min(r.end, l), !e.extend && o > r && (l = r, r = o, o = l), l = Yu(n, o);
          var i = Yu(
            n,
            r
          );
          l && i && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== i.node || e.focusOffset !== i.offset) && (t = t.createRange(), t.setStart(l.node, l.offset), e.removeAllRanges(), o > r ? (e.addRange(t), e.extend(i.node, i.offset)) : (t.setEnd(i.node, i.offset), e.addRange(t)));
        }
      }
      for (t = [], e = n; e = e.parentNode; ) e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
      for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++) e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
    }
  }
  var If = T && "documentMode" in document && 11 >= document.documentMode, vn = null, wo = null, tr = null, So = !1;
  function Ju(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    So || vn == null || vn !== xr(r) || (r = vn, "selectionStart" in r && go(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), tr && er(tr, r) || (tr = r, r = Kr(wo, "onSelect"), 0 < r.length && (t = new ao("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = vn)));
  }
  function Qr(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var gn = { animationend: Qr("Animation", "AnimationEnd"), animationiteration: Qr("Animation", "AnimationIteration"), animationstart: Qr("Animation", "AnimationStart"), transitionend: Qr("Transition", "TransitionEnd") }, ko = {}, Zu = {};
  T && (Zu = document.createElement("div").style, "AnimationEvent" in window || (delete gn.animationend.animation, delete gn.animationiteration.animation, delete gn.animationstart.animation), "TransitionEvent" in window || delete gn.transitionend.transition);
  function Hr(e) {
    if (ko[e]) return ko[e];
    if (!gn[e]) return e;
    var t = gn[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in Zu) return ko[e] = t[n];
    return e;
  }
  var bu = Hr("animationend"), es = Hr("animationiteration"), ts = Hr("animationstart"), ns = Hr("transitionend"), rs = /* @__PURE__ */ new Map(), ls = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function At(e, t) {
    rs.set(e, t), E(t, [e]);
  }
  for (var _o = 0; _o < ls.length; _o++) {
    var Eo = ls[_o], Tf = Eo.toLowerCase(), Of = Eo[0].toUpperCase() + Eo.slice(1);
    At(Tf, "on" + Of);
  }
  At(bu, "onAnimationEnd"), At(es, "onAnimationIteration"), At(ts, "onAnimationStart"), At("dblclick", "onDoubleClick"), At("focusin", "onFocus"), At("focusout", "onBlur"), At(ns, "onTransitionEnd"), S("onMouseEnter", ["mouseout", "mouseover"]), S("onMouseLeave", ["mouseout", "mouseover"]), S("onPointerEnter", ["pointerout", "pointerover"]), S("onPointerLeave", ["pointerout", "pointerover"]), E("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), E("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), E("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), E("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), E("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), E("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var nr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), jf = new Set("cancel close invalid load scroll toggle".split(" ").concat(nr));
  function os(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, Ic(r, t, void 0, e), e.currentTarget = null;
  }
  function is(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var o = void 0;
        if (t) for (var i = r.length - 1; 0 <= i; i--) {
          var a = r[i], c = a.instance, v = a.currentTarget;
          if (a = a.listener, c !== o && l.isPropagationStopped()) break e;
          os(l, a, v), o = c;
        }
        else for (i = 0; i < r.length; i++) {
          if (a = r[i], c = a.instance, v = a.currentTarget, a = a.listener, c !== o && l.isPropagationStopped()) break e;
          os(l, a, v), o = c;
        }
      }
    }
    if (Rr) throw e = bl, Rr = !1, bl = null, e;
  }
  function he(e, t) {
    var n = t[To];
    n === void 0 && (n = t[To] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (us(t, e, 2, !1), n.add(r));
  }
  function Co(e, t, n) {
    var r = 0;
    t && (r |= 4), us(n, e, r, t);
  }
  var $r = "_reactListening" + Math.random().toString(36).slice(2);
  function rr(e) {
    if (!e[$r]) {
      e[$r] = !0, y.forEach(function(n) {
        n !== "selectionchange" && (jf.has(n) || Co(n, !1, e), Co(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[$r] || (t[$r] = !0, Co("selectionchange", !1, t));
    }
  }
  function us(e, t, n, r) {
    switch (Iu(t)) {
      case 1:
        var l = Kc;
        break;
      case 4:
        l = qc;
        break;
      default:
        l = io;
    }
    n = l.bind(null, t, n, e), l = void 0, !Zl || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function xo(e, t, n, r, l) {
    var o = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var i = r.tag;
      if (i === 3 || i === 4) {
        var a = r.stateNode.containerInfo;
        if (a === l || a.nodeType === 8 && a.parentNode === l) break;
        if (i === 4) for (i = r.return; i !== null; ) {
          var c = i.tag;
          if ((c === 3 || c === 4) && (c = i.stateNode.containerInfo, c === l || c.nodeType === 8 && c.parentNode === l)) return;
          i = i.return;
        }
        for (; a !== null; ) {
          if (i = Jt(a), i === null) return;
          if (c = i.tag, c === 5 || c === 6) {
            r = o = i;
            continue e;
          }
          a = a.parentNode;
        }
      }
      r = r.return;
    }
    du(function() {
      var v = o, C = Gl(n), P = [];
      e: {
        var _ = rs.get(e);
        if (_ !== void 0) {
          var A = ao, V = e;
          switch (e) {
            case "keypress":
              if (Fr(n) === 0) break e;
            case "keydown":
            case "keyup":
              A = af;
              break;
            case "focusin":
              V = "focus", A = po;
              break;
            case "focusout":
              V = "blur", A = po;
              break;
            case "beforeblur":
            case "afterblur":
              A = po;
              break;
            case "click":
              if (n.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              A = ju;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              A = Xc;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              A = df;
              break;
            case bu:
            case es:
            case ts:
              A = bc;
              break;
            case ns:
              A = mf;
              break;
            case "scroll":
              A = Yc;
              break;
            case "wheel":
              A = yf;
              break;
            case "copy":
            case "cut":
            case "paste":
              A = tf;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              A = Du;
          }
          var W = (t & 4) !== 0, Pe = !W && e === "scroll", m = W ? _ !== null ? _ + "Capture" : null : _;
          W = [];
          for (var p = v, h; p !== null; ) {
            h = p;
            var L = h.stateNode;
            if (h.tag === 5 && L !== null && (h = L, m !== null && (L = Fn(p, m), L != null && W.push(lr(p, L, h)))), Pe) break;
            p = p.return;
          }
          0 < W.length && (_ = new A(_, V, null, n, C), P.push({ event: _, listeners: W }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (_ = e === "mouseover" || e === "pointerover", A = e === "mouseout" || e === "pointerout", _ && n !== Yl && (V = n.relatedTarget || n.fromElement) && (Jt(V) || V[_t])) break e;
          if ((A || _) && (_ = C.window === C ? C : (_ = C.ownerDocument) ? _.defaultView || _.parentWindow : window, A ? (V = n.relatedTarget || n.toElement, A = v, V = V ? Jt(V) : null, V !== null && (Pe = Xt(V), V !== Pe || V.tag !== 5 && V.tag !== 6) && (V = null)) : (A = null, V = v), A !== V)) {
            if (W = ju, L = "onMouseLeave", m = "onMouseEnter", p = "mouse", (e === "pointerout" || e === "pointerover") && (W = Du, L = "onPointerLeave", m = "onPointerEnter", p = "pointer"), Pe = A == null ? _ : kn(A), h = V == null ? _ : kn(V), _ = new W(L, p + "leave", A, n, C), _.target = Pe, _.relatedTarget = h, L = null, Jt(C) === v && (W = new W(m, p + "enter", V, n, C), W.target = h, W.relatedTarget = Pe, L = W), Pe = L, A && V) t: {
              for (W = A, m = V, p = 0, h = W; h; h = wn(h)) p++;
              for (h = 0, L = m; L; L = wn(L)) h++;
              for (; 0 < p - h; ) W = wn(W), p--;
              for (; 0 < h - p; ) m = wn(m), h--;
              for (; p--; ) {
                if (W === m || m !== null && W === m.alternate) break t;
                W = wn(W), m = wn(m);
              }
              W = null;
            }
            else W = null;
            A !== null && ss(P, _, A, W, !1), V !== null && Pe !== null && ss(P, Pe, V, W, !0);
          }
        }
        e: {
          if (_ = v ? kn(v) : window, A = _.nodeName && _.nodeName.toLowerCase(), A === "select" || A === "input" && _.type === "file") var Q = Ef;
          else if (Wu(_)) if (Qu) Q = Nf;
          else {
            Q = xf;
            var $ = Cf;
          }
          else (A = _.nodeName) && A.toLowerCase() === "input" && (_.type === "checkbox" || _.type === "radio") && (Q = Pf);
          if (Q && (Q = Q(e, v))) {
            Bu(P, Q, n, C);
            break e;
          }
          $ && $(e, _, v), e === "focusout" && ($ = _._wrapperState) && $.controlled && _.type === "number" && Ql(_, "number", _.value);
        }
        switch ($ = v ? kn(v) : window, e) {
          case "focusin":
            (Wu($) || $.contentEditable === "true") && (vn = $, wo = v, tr = null);
            break;
          case "focusout":
            tr = wo = vn = null;
            break;
          case "mousedown":
            So = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            So = !1, Ju(P, n, C);
            break;
          case "selectionchange":
            if (If) break;
          case "keydown":
          case "keyup":
            Ju(P, n, C);
        }
        var K;
        if (ho) e: {
          switch (e) {
            case "compositionstart":
              var G = "onCompositionStart";
              break e;
            case "compositionend":
              G = "onCompositionEnd";
              break e;
            case "compositionupdate":
              G = "onCompositionUpdate";
              break e;
          }
          G = void 0;
        }
        else yn ? Fu(e, n) && (G = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (G = "onCompositionStart");
        G && (Au && n.locale !== "ko" && (yn || G !== "onCompositionStart" ? G === "onCompositionEnd" && yn && (K = Tu()) : (Dt = C, so = "value" in Dt ? Dt.value : Dt.textContent, yn = !0)), $ = Kr(v, G), 0 < $.length && (G = new zu(G, e, null, n, C), P.push({ event: G, listeners: $ }), K ? G.data = K : (K = Vu(n), K !== null && (G.data = K)))), (K = gf ? wf(e, n) : Sf(e, n)) && (v = Kr(v, "onBeforeInput"), 0 < v.length && (C = new zu("onBeforeInput", "beforeinput", null, n, C), P.push({ event: C, listeners: v }), C.data = K));
      }
      is(P, t);
    });
  }
  function lr(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function Kr(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, o = l.stateNode;
      l.tag === 5 && o !== null && (l = o, o = Fn(e, n), o != null && r.unshift(lr(e, o, l)), o = Fn(e, t), o != null && r.push(lr(e, o, l))), e = e.return;
    }
    return r;
  }
  function wn(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function ss(e, t, n, r, l) {
    for (var o = t._reactName, i = []; n !== null && n !== r; ) {
      var a = n, c = a.alternate, v = a.stateNode;
      if (c !== null && c === r) break;
      a.tag === 5 && v !== null && (a = v, l ? (c = Fn(n, o), c != null && i.unshift(lr(n, c, a))) : l || (c = Fn(n, o), c != null && i.push(lr(n, c, a)))), n = n.return;
    }
    i.length !== 0 && e.push({ event: t, listeners: i });
  }
  var zf = /\r\n?/g, Df = /\u0000|\uFFFD/g;
  function as(e) {
    return (typeof e == "string" ? e : "" + e).replace(zf, `
`).replace(Df, "");
  }
  function qr(e, t, n) {
    if (t = as(t), as(e) !== t && n) throw Error(u(425));
  }
  function Yr() {
  }
  var Po = null, No = null;
  function Ro(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Lo = typeof setTimeout == "function" ? setTimeout : void 0, Af = typeof clearTimeout == "function" ? clearTimeout : void 0, cs = typeof Promise == "function" ? Promise : void 0, Mf = typeof queueMicrotask == "function" ? queueMicrotask : typeof cs < "u" ? function(e) {
    return cs.resolve(null).then(e).catch(Uf);
  } : Lo;
  function Uf(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Io(e, t) {
    var n = t, r = 0;
    do {
      var l = n.nextSibling;
      if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
        if (r === 0) {
          e.removeChild(l), Yn(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    Yn(t);
  }
  function Mt(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (t = e.data, t === "$" || t === "$!" || t === "$?") break;
        if (t === "/$") return null;
      }
    }
    return e;
  }
  function fs(e) {
    e = e.previousSibling;
    for (var t = 0; e; ) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === "$" || n === "$!" || n === "$?") {
          if (t === 0) return e;
          t--;
        } else n === "/$" && t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  var Sn = Math.random().toString(36).slice(2), gt = "__reactFiber$" + Sn, or = "__reactProps$" + Sn, _t = "__reactContainer$" + Sn, To = "__reactEvents$" + Sn, Ff = "__reactListeners$" + Sn, Vf = "__reactHandles$" + Sn;
  function Jt(e) {
    var t = e[gt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[_t] || n[gt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = fs(e); e !== null; ) {
          if (n = e[gt]) return n;
          e = fs(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function ir(e) {
    return e = e[gt] || e[_t], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function kn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(u(33));
  }
  function Gr(e) {
    return e[or] || null;
  }
  var Oo = [], _n = -1;
  function Ut(e) {
    return { current: e };
  }
  function ye(e) {
    0 > _n || (e.current = Oo[_n], Oo[_n] = null, _n--);
  }
  function pe(e, t) {
    _n++, Oo[_n] = e.current, e.current = t;
  }
  var Ft = {}, Fe = Ut(Ft), qe = Ut(!1), Zt = Ft;
  function En(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Ft;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, o;
    for (o in n) l[o] = t[o];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function Ye(e) {
    return e = e.childContextTypes, e != null;
  }
  function Xr() {
    ye(qe), ye(Fe);
  }
  function ds(e, t, n) {
    if (Fe.current !== Ft) throw Error(u(168));
    pe(Fe, t), pe(qe, n);
  }
  function ps(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(u(108, de(e) || "Unknown", l));
    return M({}, n, r);
  }
  function Jr(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Ft, Zt = Fe.current, pe(Fe, e), pe(qe, qe.current), !0;
  }
  function ms(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(u(169));
    n ? (e = ps(e, t, Zt), r.__reactInternalMemoizedMergedChildContext = e, ye(qe), ye(Fe), pe(Fe, e)) : ye(qe), pe(qe, n);
  }
  var Et = null, Zr = !1, jo = !1;
  function hs(e) {
    Et === null ? Et = [e] : Et.push(e);
  }
  function Wf(e) {
    Zr = !0, hs(e);
  }
  function Vt() {
    if (!jo && Et !== null) {
      jo = !0;
      var e = 0, t = fe;
      try {
        var n = Et;
        for (fe = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        Et = null, Zr = !1;
      } catch (l) {
        throw Et !== null && (Et = Et.slice(e + 1)), vu(eo, Vt), l;
      } finally {
        fe = t, jo = !1;
      }
    }
    return null;
  }
  var Cn = [], xn = 0, br = null, el = 0, lt = [], ot = 0, bt = null, Ct = 1, xt = "";
  function en(e, t) {
    Cn[xn++] = el, Cn[xn++] = br, br = e, el = t;
  }
  function ys(e, t, n) {
    lt[ot++] = Ct, lt[ot++] = xt, lt[ot++] = bt, bt = e;
    var r = Ct;
    e = xt;
    var l = 32 - ct(r) - 1;
    r &= ~(1 << l), n += 1;
    var o = 32 - ct(t) + l;
    if (30 < o) {
      var i = l - l % 5;
      o = (r & (1 << i) - 1).toString(32), r >>= i, l -= i, Ct = 1 << 32 - ct(t) + l | n << l | r, xt = o + e;
    } else Ct = 1 << o | n << l | r, xt = e;
  }
  function zo(e) {
    e.return !== null && (en(e, 1), ys(e, 1, 0));
  }
  function Do(e) {
    for (; e === br; ) br = Cn[--xn], Cn[xn] = null, el = Cn[--xn], Cn[xn] = null;
    for (; e === bt; ) bt = lt[--ot], lt[ot] = null, xt = lt[--ot], lt[ot] = null, Ct = lt[--ot], lt[ot] = null;
  }
  var tt = null, nt = null, Se = !1, dt = null;
  function vs(e, t) {
    var n = at(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function gs(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, tt = e, nt = Mt(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, tt = e, nt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = bt !== null ? { id: Ct, overflow: xt } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = at(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, tt = e, nt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Ao(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Mo(e) {
    if (Se) {
      var t = nt;
      if (t) {
        var n = t;
        if (!gs(e, t)) {
          if (Ao(e)) throw Error(u(418));
          t = Mt(n.nextSibling);
          var r = tt;
          t && gs(e, t) ? vs(r, n) : (e.flags = e.flags & -4097 | 2, Se = !1, tt = e);
        }
      } else {
        if (Ao(e)) throw Error(u(418));
        e.flags = e.flags & -4097 | 2, Se = !1, tt = e;
      }
    }
  }
  function ws(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    tt = e;
  }
  function tl(e) {
    if (e !== tt) return !1;
    if (!Se) return ws(e), Se = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Ro(e.type, e.memoizedProps)), t && (t = nt)) {
      if (Ao(e)) throw Ss(), Error(u(418));
      for (; t; ) vs(e, t), t = Mt(t.nextSibling);
    }
    if (ws(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                nt = Mt(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        nt = null;
      }
    } else nt = tt ? Mt(e.stateNode.nextSibling) : null;
    return !0;
  }
  function Ss() {
    for (var e = nt; e; ) e = Mt(e.nextSibling);
  }
  function Pn() {
    nt = tt = null, Se = !1;
  }
  function Uo(e) {
    dt === null ? dt = [e] : dt.push(e);
  }
  var Bf = le.ReactCurrentBatchConfig;
  function ur(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(u(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(u(147, e));
        var l = r, o = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === o ? t.ref : (t = function(i) {
          var a = l.refs;
          i === null ? delete a[o] : a[o] = i;
        }, t._stringRef = o, t);
      }
      if (typeof e != "string") throw Error(u(284));
      if (!n._owner) throw Error(u(290, e));
    }
    return e;
  }
  function nl(e, t) {
    throw e = Object.prototype.toString.call(t), Error(u(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function ks(e) {
    var t = e._init;
    return t(e._payload);
  }
  function _s(e) {
    function t(m, p) {
      if (e) {
        var h = m.deletions;
        h === null ? (m.deletions = [p], m.flags |= 16) : h.push(p);
      }
    }
    function n(m, p) {
      if (!e) return null;
      for (; p !== null; ) t(m, p), p = p.sibling;
      return null;
    }
    function r(m, p) {
      for (m = /* @__PURE__ */ new Map(); p !== null; ) p.key !== null ? m.set(p.key, p) : m.set(p.index, p), p = p.sibling;
      return m;
    }
    function l(m, p) {
      return m = Yt(m, p), m.index = 0, m.sibling = null, m;
    }
    function o(m, p, h) {
      return m.index = h, e ? (h = m.alternate, h !== null ? (h = h.index, h < p ? (m.flags |= 2, p) : h) : (m.flags |= 2, p)) : (m.flags |= 1048576, p);
    }
    function i(m) {
      return e && m.alternate === null && (m.flags |= 2), m;
    }
    function a(m, p, h, L) {
      return p === null || p.tag !== 6 ? (p = Li(h, m.mode, L), p.return = m, p) : (p = l(p, h), p.return = m, p);
    }
    function c(m, p, h, L) {
      var Q = h.type;
      return Q === ve ? C(m, p, h.props.children, L, h.key) : p !== null && (p.elementType === Q || typeof Q == "object" && Q !== null && Q.$$typeof === Oe && ks(Q) === p.type) ? (L = l(p, h.props), L.ref = ur(m, p, h), L.return = m, L) : (L = Pl(h.type, h.key, h.props, null, m.mode, L), L.ref = ur(m, p, h), L.return = m, L);
    }
    function v(m, p, h, L) {
      return p === null || p.tag !== 4 || p.stateNode.containerInfo !== h.containerInfo || p.stateNode.implementation !== h.implementation ? (p = Ii(h, m.mode, L), p.return = m, p) : (p = l(p, h.children || []), p.return = m, p);
    }
    function C(m, p, h, L, Q) {
      return p === null || p.tag !== 7 ? (p = an(h, m.mode, L, Q), p.return = m, p) : (p = l(p, h), p.return = m, p);
    }
    function P(m, p, h) {
      if (typeof p == "string" && p !== "" || typeof p == "number") return p = Li("" + p, m.mode, h), p.return = m, p;
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case ae:
            return h = Pl(p.type, p.key, p.props, null, m.mode, h), h.ref = ur(m, null, p), h.return = m, h;
          case re:
            return p = Ii(p, m.mode, h), p.return = m, p;
          case Oe:
            var L = p._init;
            return P(m, L(p._payload), h);
        }
        if (An(p) || q(p)) return p = an(p, m.mode, h, null), p.return = m, p;
        nl(m, p);
      }
      return null;
    }
    function _(m, p, h, L) {
      var Q = p !== null ? p.key : null;
      if (typeof h == "string" && h !== "" || typeof h == "number") return Q !== null ? null : a(m, p, "" + h, L);
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case ae:
            return h.key === Q ? c(m, p, h, L) : null;
          case re:
            return h.key === Q ? v(m, p, h, L) : null;
          case Oe:
            return Q = h._init, _(
              m,
              p,
              Q(h._payload),
              L
            );
        }
        if (An(h) || q(h)) return Q !== null ? null : C(m, p, h, L, null);
        nl(m, h);
      }
      return null;
    }
    function A(m, p, h, L, Q) {
      if (typeof L == "string" && L !== "" || typeof L == "number") return m = m.get(h) || null, a(p, m, "" + L, Q);
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case ae:
            return m = m.get(L.key === null ? h : L.key) || null, c(p, m, L, Q);
          case re:
            return m = m.get(L.key === null ? h : L.key) || null, v(p, m, L, Q);
          case Oe:
            var $ = L._init;
            return A(m, p, h, $(L._payload), Q);
        }
        if (An(L) || q(L)) return m = m.get(h) || null, C(p, m, L, Q, null);
        nl(p, L);
      }
      return null;
    }
    function V(m, p, h, L) {
      for (var Q = null, $ = null, K = p, G = p = 0, De = null; K !== null && G < h.length; G++) {
        K.index > G ? (De = K, K = null) : De = K.sibling;
        var ue = _(m, K, h[G], L);
        if (ue === null) {
          K === null && (K = De);
          break;
        }
        e && K && ue.alternate === null && t(m, K), p = o(ue, p, G), $ === null ? Q = ue : $.sibling = ue, $ = ue, K = De;
      }
      if (G === h.length) return n(m, K), Se && en(m, G), Q;
      if (K === null) {
        for (; G < h.length; G++) K = P(m, h[G], L), K !== null && (p = o(K, p, G), $ === null ? Q = K : $.sibling = K, $ = K);
        return Se && en(m, G), Q;
      }
      for (K = r(m, K); G < h.length; G++) De = A(K, m, G, h[G], L), De !== null && (e && De.alternate !== null && K.delete(De.key === null ? G : De.key), p = o(De, p, G), $ === null ? Q = De : $.sibling = De, $ = De);
      return e && K.forEach(function(Gt) {
        return t(m, Gt);
      }), Se && en(m, G), Q;
    }
    function W(m, p, h, L) {
      var Q = q(h);
      if (typeof Q != "function") throw Error(u(150));
      if (h = Q.call(h), h == null) throw Error(u(151));
      for (var $ = Q = null, K = p, G = p = 0, De = null, ue = h.next(); K !== null && !ue.done; G++, ue = h.next()) {
        K.index > G ? (De = K, K = null) : De = K.sibling;
        var Gt = _(m, K, ue.value, L);
        if (Gt === null) {
          K === null && (K = De);
          break;
        }
        e && K && Gt.alternate === null && t(m, K), p = o(Gt, p, G), $ === null ? Q = Gt : $.sibling = Gt, $ = Gt, K = De;
      }
      if (ue.done) return n(
        m,
        K
      ), Se && en(m, G), Q;
      if (K === null) {
        for (; !ue.done; G++, ue = h.next()) ue = P(m, ue.value, L), ue !== null && (p = o(ue, p, G), $ === null ? Q = ue : $.sibling = ue, $ = ue);
        return Se && en(m, G), Q;
      }
      for (K = r(m, K); !ue.done; G++, ue = h.next()) ue = A(K, m, G, ue.value, L), ue !== null && (e && ue.alternate !== null && K.delete(ue.key === null ? G : ue.key), p = o(ue, p, G), $ === null ? Q = ue : $.sibling = ue, $ = ue);
      return e && K.forEach(function(kd) {
        return t(m, kd);
      }), Se && en(m, G), Q;
    }
    function Pe(m, p, h, L) {
      if (typeof h == "object" && h !== null && h.type === ve && h.key === null && (h = h.props.children), typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case ae:
            e: {
              for (var Q = h.key, $ = p; $ !== null; ) {
                if ($.key === Q) {
                  if (Q = h.type, Q === ve) {
                    if ($.tag === 7) {
                      n(m, $.sibling), p = l($, h.props.children), p.return = m, m = p;
                      break e;
                    }
                  } else if ($.elementType === Q || typeof Q == "object" && Q !== null && Q.$$typeof === Oe && ks(Q) === $.type) {
                    n(m, $.sibling), p = l($, h.props), p.ref = ur(m, $, h), p.return = m, m = p;
                    break e;
                  }
                  n(m, $);
                  break;
                } else t(m, $);
                $ = $.sibling;
              }
              h.type === ve ? (p = an(h.props.children, m.mode, L, h.key), p.return = m, m = p) : (L = Pl(h.type, h.key, h.props, null, m.mode, L), L.ref = ur(m, p, h), L.return = m, m = L);
            }
            return i(m);
          case re:
            e: {
              for ($ = h.key; p !== null; ) {
                if (p.key === $) if (p.tag === 4 && p.stateNode.containerInfo === h.containerInfo && p.stateNode.implementation === h.implementation) {
                  n(m, p.sibling), p = l(p, h.children || []), p.return = m, m = p;
                  break e;
                } else {
                  n(m, p);
                  break;
                }
                else t(m, p);
                p = p.sibling;
              }
              p = Ii(h, m.mode, L), p.return = m, m = p;
            }
            return i(m);
          case Oe:
            return $ = h._init, Pe(m, p, $(h._payload), L);
        }
        if (An(h)) return V(m, p, h, L);
        if (q(h)) return W(m, p, h, L);
        nl(m, h);
      }
      return typeof h == "string" && h !== "" || typeof h == "number" ? (h = "" + h, p !== null && p.tag === 6 ? (n(m, p.sibling), p = l(p, h), p.return = m, m = p) : (n(m, p), p = Li(h, m.mode, L), p.return = m, m = p), i(m)) : n(m, p);
    }
    return Pe;
  }
  var Nn = _s(!0), Es = _s(!1), rl = Ut(null), ll = null, Rn = null, Fo = null;
  function Vo() {
    Fo = Rn = ll = null;
  }
  function Wo(e) {
    var t = rl.current;
    ye(rl), e._currentValue = t;
  }
  function Bo(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Ln(e, t) {
    ll = e, Fo = Rn = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Ge = !0), e.firstContext = null);
  }
  function it(e) {
    var t = e._currentValue;
    if (Fo !== e) if (e = { context: e, memoizedValue: t, next: null }, Rn === null) {
      if (ll === null) throw Error(u(308));
      Rn = e, ll.dependencies = { lanes: 0, firstContext: e };
    } else Rn = Rn.next = e;
    return t;
  }
  var tn = null;
  function Qo(e) {
    tn === null ? tn = [e] : tn.push(e);
  }
  function Cs(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Qo(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Pt(e, r);
  }
  function Pt(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Wt = !1;
  function Ho(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function xs(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Nt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Bt(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (oe & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Pt(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Qo(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Pt(e, n);
  }
  function ol(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, ro(e, n);
    }
  }
  function Ps(e, t) {
    var n = e.updateQueue, r = e.alternate;
    if (r !== null && (r = r.updateQueue, n === r)) {
      var l = null, o = null;
      if (n = n.firstBaseUpdate, n !== null) {
        do {
          var i = { eventTime: n.eventTime, lane: n.lane, tag: n.tag, payload: n.payload, callback: n.callback, next: null };
          o === null ? l = o = i : o = o.next = i, n = n.next;
        } while (n !== null);
        o === null ? l = o = t : o = o.next = t;
      } else l = o = t;
      n = { baseState: r.baseState, firstBaseUpdate: l, lastBaseUpdate: o, shared: r.shared, effects: r.effects }, e.updateQueue = n;
      return;
    }
    e = n.lastBaseUpdate, e === null ? n.firstBaseUpdate = t : e.next = t, n.lastBaseUpdate = t;
  }
  function il(e, t, n, r) {
    var l = e.updateQueue;
    Wt = !1;
    var o = l.firstBaseUpdate, i = l.lastBaseUpdate, a = l.shared.pending;
    if (a !== null) {
      l.shared.pending = null;
      var c = a, v = c.next;
      c.next = null, i === null ? o = v : i.next = v, i = c;
      var C = e.alternate;
      C !== null && (C = C.updateQueue, a = C.lastBaseUpdate, a !== i && (a === null ? C.firstBaseUpdate = v : a.next = v, C.lastBaseUpdate = c));
    }
    if (o !== null) {
      var P = l.baseState;
      i = 0, C = v = c = null, a = o;
      do {
        var _ = a.lane, A = a.eventTime;
        if ((r & _) === _) {
          C !== null && (C = C.next = {
            eventTime: A,
            lane: 0,
            tag: a.tag,
            payload: a.payload,
            callback: a.callback,
            next: null
          });
          e: {
            var V = e, W = a;
            switch (_ = t, A = n, W.tag) {
              case 1:
                if (V = W.payload, typeof V == "function") {
                  P = V.call(A, P, _);
                  break e;
                }
                P = V;
                break e;
              case 3:
                V.flags = V.flags & -65537 | 128;
              case 0:
                if (V = W.payload, _ = typeof V == "function" ? V.call(A, P, _) : V, _ == null) break e;
                P = M({}, P, _);
                break e;
              case 2:
                Wt = !0;
            }
          }
          a.callback !== null && a.lane !== 0 && (e.flags |= 64, _ = l.effects, _ === null ? l.effects = [a] : _.push(a));
        } else A = { eventTime: A, lane: _, tag: a.tag, payload: a.payload, callback: a.callback, next: null }, C === null ? (v = C = A, c = P) : C = C.next = A, i |= _;
        if (a = a.next, a === null) {
          if (a = l.shared.pending, a === null) break;
          _ = a, a = _.next, _.next = null, l.lastBaseUpdate = _, l.shared.pending = null;
        }
      } while (!0);
      if (C === null && (c = P), l.baseState = c, l.firstBaseUpdate = v, l.lastBaseUpdate = C, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          i |= l.lane, l = l.next;
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      ln |= i, e.lanes = i, e.memoizedState = P;
    }
  }
  function Ns(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], l = r.callback;
      if (l !== null) {
        if (r.callback = null, r = n, typeof l != "function") throw Error(u(191, l));
        l.call(r);
      }
    }
  }
  var sr = {}, wt = Ut(sr), ar = Ut(sr), cr = Ut(sr);
  function nn(e) {
    if (e === sr) throw Error(u(174));
    return e;
  }
  function $o(e, t) {
    switch (pe(cr, t), pe(ar, e), pe(wt, sr), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : $l(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = $l(t, e);
    }
    ye(wt), pe(wt, t);
  }
  function In() {
    ye(wt), ye(ar), ye(cr);
  }
  function Rs(e) {
    nn(cr.current);
    var t = nn(wt.current), n = $l(t, e.type);
    t !== n && (pe(ar, e), pe(wt, n));
  }
  function Ko(e) {
    ar.current === e && (ye(wt), ye(ar));
  }
  var ke = Ut(0);
  function ul(e) {
    for (var t = e; t !== null; ) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && (n = n.dehydrated, n === null || n.data === "$?" || n.data === "$!")) return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
    return null;
  }
  var qo = [];
  function Yo() {
    for (var e = 0; e < qo.length; e++) qo[e]._workInProgressVersionPrimary = null;
    qo.length = 0;
  }
  var sl = le.ReactCurrentDispatcher, Go = le.ReactCurrentBatchConfig, rn = 0, _e = null, Ie = null, je = null, al = !1, fr = !1, dr = 0, Qf = 0;
  function Ve() {
    throw Error(u(321));
  }
  function Xo(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!ft(e[n], t[n])) return !1;
    return !0;
  }
  function Jo(e, t, n, r, l, o) {
    if (rn = o, _e = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, sl.current = e === null || e.memoizedState === null ? qf : Yf, e = n(r, l), fr) {
      o = 0;
      do {
        if (fr = !1, dr = 0, 25 <= o) throw Error(u(301));
        o += 1, je = Ie = null, t.updateQueue = null, sl.current = Gf, e = n(r, l);
      } while (fr);
    }
    if (sl.current = dl, t = Ie !== null && Ie.next !== null, rn = 0, je = Ie = _e = null, al = !1, t) throw Error(u(300));
    return e;
  }
  function Zo() {
    var e = dr !== 0;
    return dr = 0, e;
  }
  function St() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return je === null ? _e.memoizedState = je = e : je = je.next = e, je;
  }
  function ut() {
    if (Ie === null) {
      var e = _e.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Ie.next;
    var t = je === null ? _e.memoizedState : je.next;
    if (t !== null) je = t, Ie = e;
    else {
      if (e === null) throw Error(u(310));
      Ie = e, e = { memoizedState: Ie.memoizedState, baseState: Ie.baseState, baseQueue: Ie.baseQueue, queue: Ie.queue, next: null }, je === null ? _e.memoizedState = je = e : je = je.next = e;
    }
    return je;
  }
  function pr(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function bo(e) {
    var t = ut(), n = t.queue;
    if (n === null) throw Error(u(311));
    n.lastRenderedReducer = e;
    var r = Ie, l = r.baseQueue, o = n.pending;
    if (o !== null) {
      if (l !== null) {
        var i = l.next;
        l.next = o.next, o.next = i;
      }
      r.baseQueue = l = o, n.pending = null;
    }
    if (l !== null) {
      o = l.next, r = r.baseState;
      var a = i = null, c = null, v = o;
      do {
        var C = v.lane;
        if ((rn & C) === C) c !== null && (c = c.next = { lane: 0, action: v.action, hasEagerState: v.hasEagerState, eagerState: v.eagerState, next: null }), r = v.hasEagerState ? v.eagerState : e(r, v.action);
        else {
          var P = {
            lane: C,
            action: v.action,
            hasEagerState: v.hasEagerState,
            eagerState: v.eagerState,
            next: null
          };
          c === null ? (a = c = P, i = r) : c = c.next = P, _e.lanes |= C, ln |= C;
        }
        v = v.next;
      } while (v !== null && v !== o);
      c === null ? i = r : c.next = a, ft(r, t.memoizedState) || (Ge = !0), t.memoizedState = r, t.baseState = i, t.baseQueue = c, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        o = l.lane, _e.lanes |= o, ln |= o, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function ei(e) {
    var t = ut(), n = t.queue;
    if (n === null) throw Error(u(311));
    n.lastRenderedReducer = e;
    var r = n.dispatch, l = n.pending, o = t.memoizedState;
    if (l !== null) {
      n.pending = null;
      var i = l = l.next;
      do
        o = e(o, i.action), i = i.next;
      while (i !== l);
      ft(o, t.memoizedState) || (Ge = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
    }
    return [o, r];
  }
  function Ls() {
  }
  function Is(e, t) {
    var n = _e, r = ut(), l = t(), o = !ft(r.memoizedState, l);
    if (o && (r.memoizedState = l, Ge = !0), r = r.queue, ti(js.bind(null, n, r, e), [e]), r.getSnapshot !== t || o || je !== null && je.memoizedState.tag & 1) {
      if (n.flags |= 2048, mr(9, Os.bind(null, n, r, l, t), void 0, null), ze === null) throw Error(u(349));
      (rn & 30) !== 0 || Ts(n, t, l);
    }
    return l;
  }
  function Ts(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = _e.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, _e.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Os(e, t, n, r) {
    t.value = n, t.getSnapshot = r, zs(t) && Ds(e);
  }
  function js(e, t, n) {
    return n(function() {
      zs(t) && Ds(e);
    });
  }
  function zs(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !ft(e, n);
    } catch {
      return !0;
    }
  }
  function Ds(e) {
    var t = Pt(e, 1);
    t !== null && yt(t, e, 1, -1);
  }
  function As(e) {
    var t = St();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: pr, lastRenderedState: e }, t.queue = e, e = e.dispatch = Kf.bind(null, _e, e), [t.memoizedState, e];
  }
  function mr(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = _e.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, _e.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Ms() {
    return ut().memoizedState;
  }
  function cl(e, t, n, r) {
    var l = St();
    _e.flags |= e, l.memoizedState = mr(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function fl(e, t, n, r) {
    var l = ut();
    r = r === void 0 ? null : r;
    var o = void 0;
    if (Ie !== null) {
      var i = Ie.memoizedState;
      if (o = i.destroy, r !== null && Xo(r, i.deps)) {
        l.memoizedState = mr(t, n, o, r);
        return;
      }
    }
    _e.flags |= e, l.memoizedState = mr(1 | t, n, o, r);
  }
  function Us(e, t) {
    return cl(8390656, 8, e, t);
  }
  function ti(e, t) {
    return fl(2048, 8, e, t);
  }
  function Fs(e, t) {
    return fl(4, 2, e, t);
  }
  function Vs(e, t) {
    return fl(4, 4, e, t);
  }
  function Ws(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function Bs(e, t, n) {
    return n = n != null ? n.concat([e]) : null, fl(4, 4, Ws.bind(null, t, e), n);
  }
  function ni() {
  }
  function Qs(e, t) {
    var n = ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Xo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function Hs(e, t) {
    var n = ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Xo(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function $s(e, t, n) {
    return (rn & 21) === 0 ? (e.baseState && (e.baseState = !1, Ge = !0), e.memoizedState = n) : (ft(n, t) || (n = ku(), _e.lanes |= n, ln |= n, e.baseState = !0), t);
  }
  function Hf(e, t) {
    var n = fe;
    fe = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = Go.transition;
    Go.transition = {};
    try {
      e(!1), t();
    } finally {
      fe = n, Go.transition = r;
    }
  }
  function Ks() {
    return ut().memoizedState;
  }
  function $f(e, t, n) {
    var r = Kt(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, qs(e)) Ys(t, n);
    else if (n = Cs(e, t, n, r), n !== null) {
      var l = Ke();
      yt(n, e, r, l), Gs(n, t, r);
    }
  }
  function Kf(e, t, n) {
    var r = Kt(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (qs(e)) Ys(t, l);
    else {
      var o = e.alternate;
      if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
        var i = t.lastRenderedState, a = o(i, n);
        if (l.hasEagerState = !0, l.eagerState = a, ft(a, i)) {
          var c = t.interleaved;
          c === null ? (l.next = l, Qo(t)) : (l.next = c.next, c.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = Cs(e, t, l, r), n !== null && (l = Ke(), yt(n, e, r, l), Gs(n, t, r));
    }
  }
  function qs(e) {
    var t = e.alternate;
    return e === _e || t !== null && t === _e;
  }
  function Ys(e, t) {
    fr = al = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Gs(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, ro(e, n);
    }
  }
  var dl = { readContext: it, useCallback: Ve, useContext: Ve, useEffect: Ve, useImperativeHandle: Ve, useInsertionEffect: Ve, useLayoutEffect: Ve, useMemo: Ve, useReducer: Ve, useRef: Ve, useState: Ve, useDebugValue: Ve, useDeferredValue: Ve, useTransition: Ve, useMutableSource: Ve, useSyncExternalStore: Ve, useId: Ve, unstable_isNewReconciler: !1 }, qf = { readContext: it, useCallback: function(e, t) {
    return St().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: it, useEffect: Us, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, cl(
      4194308,
      4,
      Ws.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return cl(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return cl(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = St();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = St();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = $f.bind(null, _e, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = St();
    return e = { current: e }, t.memoizedState = e;
  }, useState: As, useDebugValue: ni, useDeferredValue: function(e) {
    return St().memoizedState = e;
  }, useTransition: function() {
    var e = As(!1), t = e[0];
    return e = Hf.bind(null, e[1]), St().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = _e, l = St();
    if (Se) {
      if (n === void 0) throw Error(u(407));
      n = n();
    } else {
      if (n = t(), ze === null) throw Error(u(349));
      (rn & 30) !== 0 || Ts(r, t, n);
    }
    l.memoizedState = n;
    var o = { value: n, getSnapshot: t };
    return l.queue = o, Us(js.bind(
      null,
      r,
      o,
      e
    ), [e]), r.flags |= 2048, mr(9, Os.bind(null, r, o, n, t), void 0, null), n;
  }, useId: function() {
    var e = St(), t = ze.identifierPrefix;
    if (Se) {
      var n = xt, r = Ct;
      n = (r & ~(1 << 32 - ct(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = dr++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = Qf++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Yf = {
    readContext: it,
    useCallback: Qs,
    useContext: it,
    useEffect: ti,
    useImperativeHandle: Bs,
    useInsertionEffect: Fs,
    useLayoutEffect: Vs,
    useMemo: Hs,
    useReducer: bo,
    useRef: Ms,
    useState: function() {
      return bo(pr);
    },
    useDebugValue: ni,
    useDeferredValue: function(e) {
      var t = ut();
      return $s(t, Ie.memoizedState, e);
    },
    useTransition: function() {
      var e = bo(pr)[0], t = ut().memoizedState;
      return [e, t];
    },
    useMutableSource: Ls,
    useSyncExternalStore: Is,
    useId: Ks,
    unstable_isNewReconciler: !1
  }, Gf = { readContext: it, useCallback: Qs, useContext: it, useEffect: ti, useImperativeHandle: Bs, useInsertionEffect: Fs, useLayoutEffect: Vs, useMemo: Hs, useReducer: ei, useRef: Ms, useState: function() {
    return ei(pr);
  }, useDebugValue: ni, useDeferredValue: function(e) {
    var t = ut();
    return Ie === null ? t.memoizedState = e : $s(t, Ie.memoizedState, e);
  }, useTransition: function() {
    var e = ei(pr)[0], t = ut().memoizedState;
    return [e, t];
  }, useMutableSource: Ls, useSyncExternalStore: Is, useId: Ks, unstable_isNewReconciler: !1 };
  function pt(e, t) {
    if (e && e.defaultProps) {
      t = M({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function ri(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : M({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var pl = { isMounted: function(e) {
    return (e = e._reactInternals) ? Xt(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = Ke(), l = Kt(e), o = Nt(r, l);
    o.payload = t, n != null && (o.callback = n), t = Bt(e, o, l), t !== null && (yt(t, e, l, r), ol(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = Ke(), l = Kt(e), o = Nt(r, l);
    o.tag = 1, o.payload = t, n != null && (o.callback = n), t = Bt(e, o, l), t !== null && (yt(t, e, l, r), ol(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = Ke(), r = Kt(e), l = Nt(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Bt(e, l, r), t !== null && (yt(t, e, r, n), ol(t, e, r));
  } };
  function Xs(e, t, n, r, l, o, i) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, o, i) : t.prototype && t.prototype.isPureReactComponent ? !er(n, r) || !er(l, o) : !0;
  }
  function Js(e, t, n) {
    var r = !1, l = Ft, o = t.contextType;
    return typeof o == "object" && o !== null ? o = it(o) : (l = Ye(t) ? Zt : Fe.current, r = t.contextTypes, o = (r = r != null) ? En(e, l) : Ft), t = new t(n, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = pl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
  }
  function Zs(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && pl.enqueueReplaceState(t, t.state, null);
  }
  function li(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, Ho(e);
    var o = t.contextType;
    typeof o == "object" && o !== null ? l.context = it(o) : (o = Ye(t) ? Zt : Fe.current, l.context = En(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (ri(e, t, o, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && pl.enqueueReplaceState(l, l.state, null), il(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Tn(e, t) {
    try {
      var n = "", r = t;
      do
        n += b(r), r = r.return;
      while (r);
      var l = n;
    } catch (o) {
      l = `
Error generating stack: ` + o.message + `
` + o.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function oi(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function ii(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var Xf = typeof WeakMap == "function" ? WeakMap : Map;
  function bs(e, t, n) {
    n = Nt(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      Sl || (Sl = !0, ki = r), ii(e, t);
    }, n;
  }
  function ea(e, t, n) {
    n = Nt(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        ii(e, t);
      };
    }
    var o = e.stateNode;
    return o !== null && typeof o.componentDidCatch == "function" && (n.callback = function() {
      ii(e, t), typeof r != "function" && (Ht === null ? Ht = /* @__PURE__ */ new Set([this]) : Ht.add(this));
      var i = t.stack;
      this.componentDidCatch(t.value, { componentStack: i !== null ? i : "" });
    }), n;
  }
  function ta(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new Xf();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = cd.bind(null, e, t, n), t.then(e, e));
  }
  function na(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function ra(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Nt(-1, 1), t.tag = 2, Bt(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var Jf = le.ReactCurrentOwner, Ge = !1;
  function $e(e, t, n, r) {
    t.child = e === null ? Es(t, null, n, r) : Nn(t, e.child, n, r);
  }
  function la(e, t, n, r, l) {
    n = n.render;
    var o = t.ref;
    return Ln(t, l), r = Jo(e, t, n, r, o, l), n = Zo(), e !== null && !Ge ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (Se && n && zo(t), t.flags |= 1, $e(e, t, r, l), t.child);
  }
  function oa(e, t, n, r, l) {
    if (e === null) {
      var o = n.type;
      return typeof o == "function" && !Ri(o) && o.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = o, ia(e, t, o, r, l)) : (e = Pl(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (o = e.child, (e.lanes & l) === 0) {
      var i = o.memoizedProps;
      if (n = n.compare, n = n !== null ? n : er, n(i, r) && e.ref === t.ref) return Rt(e, t, l);
    }
    return t.flags |= 1, e = Yt(o, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function ia(e, t, n, r, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (er(o, r) && e.ref === t.ref) if (Ge = !1, t.pendingProps = r = o, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Ge = !0);
      else return t.lanes = e.lanes, Rt(e, t, l);
    }
    return ui(e, t, n, r, l);
  }
  function ua(e, t, n) {
    var r = t.pendingProps, l = r.children, o = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, pe(jn, rt), rt |= n;
    else {
      if ((n & 1073741824) === 0) return e = o !== null ? o.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, pe(jn, rt), rt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = o !== null ? o.baseLanes : n, pe(jn, rt), rt |= r;
    }
    else o !== null ? (r = o.baseLanes | n, t.memoizedState = null) : r = n, pe(jn, rt), rt |= r;
    return $e(e, t, l, n), t.child;
  }
  function sa(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function ui(e, t, n, r, l) {
    var o = Ye(n) ? Zt : Fe.current;
    return o = En(t, o), Ln(t, l), n = Jo(e, t, n, r, o, l), r = Zo(), e !== null && !Ge ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (Se && r && zo(t), t.flags |= 1, $e(e, t, n, l), t.child);
  }
  function aa(e, t, n, r, l) {
    if (Ye(n)) {
      var o = !0;
      Jr(t);
    } else o = !1;
    if (Ln(t, l), t.stateNode === null) hl(e, t), Js(t, n, r), li(t, n, r, l), r = !0;
    else if (e === null) {
      var i = t.stateNode, a = t.memoizedProps;
      i.props = a;
      var c = i.context, v = n.contextType;
      typeof v == "object" && v !== null ? v = it(v) : (v = Ye(n) ? Zt : Fe.current, v = En(t, v));
      var C = n.getDerivedStateFromProps, P = typeof C == "function" || typeof i.getSnapshotBeforeUpdate == "function";
      P || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (a !== r || c !== v) && Zs(t, i, r, v), Wt = !1;
      var _ = t.memoizedState;
      i.state = _, il(t, r, i, l), c = t.memoizedState, a !== r || _ !== c || qe.current || Wt ? (typeof C == "function" && (ri(t, n, C, r), c = t.memoizedState), (a = Wt || Xs(t, n, a, r, _, c, v)) ? (P || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = c), i.props = r, i.state = c, i.context = v, r = a) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      i = t.stateNode, xs(e, t), a = t.memoizedProps, v = t.type === t.elementType ? a : pt(t.type, a), i.props = v, P = t.pendingProps, _ = i.context, c = n.contextType, typeof c == "object" && c !== null ? c = it(c) : (c = Ye(n) ? Zt : Fe.current, c = En(t, c));
      var A = n.getDerivedStateFromProps;
      (C = typeof A == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (a !== P || _ !== c) && Zs(t, i, r, c), Wt = !1, _ = t.memoizedState, i.state = _, il(t, r, i, l);
      var V = t.memoizedState;
      a !== P || _ !== V || qe.current || Wt ? (typeof A == "function" && (ri(t, n, A, r), V = t.memoizedState), (v = Wt || Xs(t, n, v, r, _, V, c) || !1) ? (C || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(r, V, c), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(r, V, c)), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || a === e.memoizedProps && _ === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || a === e.memoizedProps && _ === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = V), i.props = r, i.state = V, i.context = c, r = v) : (typeof i.componentDidUpdate != "function" || a === e.memoizedProps && _ === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || a === e.memoizedProps && _ === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return si(e, t, n, r, o, l);
  }
  function si(e, t, n, r, l, o) {
    sa(e, t);
    var i = (t.flags & 128) !== 0;
    if (!r && !i) return l && ms(t, n, !1), Rt(e, t, o);
    r = t.stateNode, Jf.current = t;
    var a = i && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && i ? (t.child = Nn(t, e.child, null, o), t.child = Nn(t, null, a, o)) : $e(e, t, a, o), t.memoizedState = r.state, l && ms(t, n, !0), t.child;
  }
  function ca(e) {
    var t = e.stateNode;
    t.pendingContext ? ds(e, t.pendingContext, t.pendingContext !== t.context) : t.context && ds(e, t.context, !1), $o(e, t.containerInfo);
  }
  function fa(e, t, n, r, l) {
    return Pn(), Uo(l), t.flags |= 256, $e(e, t, n, r), t.child;
  }
  var ai = { dehydrated: null, treeContext: null, retryLane: 0 };
  function ci(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function da(e, t, n) {
    var r = t.pendingProps, l = ke.current, o = !1, i = (t.flags & 128) !== 0, a;
    if ((a = i) || (a = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), a ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), pe(ke, l & 1), e === null)
      return Mo(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (i = r.children, e = r.fallback, o ? (r = t.mode, o = t.child, i = { mode: "hidden", children: i }, (r & 1) === 0 && o !== null ? (o.childLanes = 0, o.pendingProps = i) : o = Nl(i, r, 0, null), e = an(e, r, n, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = ci(n), t.memoizedState = ai, e) : fi(t, i));
    if (l = e.memoizedState, l !== null && (a = l.dehydrated, a !== null)) return Zf(e, t, i, r, a, l, n);
    if (o) {
      o = r.fallback, i = t.mode, l = e.child, a = l.sibling;
      var c = { mode: "hidden", children: r.children };
      return (i & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = c, t.deletions = null) : (r = Yt(l, c), r.subtreeFlags = l.subtreeFlags & 14680064), a !== null ? o = Yt(a, o) : (o = an(o, i, n, null), o.flags |= 2), o.return = t, r.return = t, r.sibling = o, t.child = r, r = o, o = t.child, i = e.child.memoizedState, i = i === null ? ci(n) : { baseLanes: i.baseLanes | n, cachePool: null, transitions: i.transitions }, o.memoizedState = i, o.childLanes = e.childLanes & ~n, t.memoizedState = ai, r;
    }
    return o = e.child, e = o.sibling, r = Yt(o, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function fi(e, t) {
    return t = Nl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function ml(e, t, n, r) {
    return r !== null && Uo(r), Nn(t, e.child, null, n), e = fi(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Zf(e, t, n, r, l, o, i) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = oi(Error(u(422))), ml(e, t, i, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = r.fallback, l = t.mode, r = Nl({ mode: "visible", children: r.children }, l, 0, null), o = an(o, l, i, null), o.flags |= 2, r.return = t, o.return = t, r.sibling = o, t.child = r, (t.mode & 1) !== 0 && Nn(t, e.child, null, i), t.child.memoizedState = ci(i), t.memoizedState = ai, o);
    if ((t.mode & 1) === 0) return ml(e, t, i, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var a = r.dgst;
      return r = a, o = Error(u(419)), r = oi(o, r, void 0), ml(e, t, i, r);
    }
    if (a = (i & e.childLanes) !== 0, Ge || a) {
      if (r = ze, r !== null) {
        switch (i & -i) {
          case 4:
            l = 2;
            break;
          case 16:
            l = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            l = 32;
            break;
          case 536870912:
            l = 268435456;
            break;
          default:
            l = 0;
        }
        l = (l & (r.suspendedLanes | i)) !== 0 ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, Pt(e, l), yt(r, e, l, -1));
      }
      return Ni(), r = oi(Error(u(421))), ml(e, t, i, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = fd.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, nt = Mt(l.nextSibling), tt = t, Se = !0, dt = null, e !== null && (lt[ot++] = Ct, lt[ot++] = xt, lt[ot++] = bt, Ct = e.id, xt = e.overflow, bt = t), t = fi(t, r.children), t.flags |= 4096, t);
  }
  function pa(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Bo(e.return, t, n);
  }
  function di(e, t, n, r, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = l);
  }
  function ma(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, o = r.tail;
    if ($e(e, t, r.children, n), r = ke.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && pa(e, n, t);
        else if (e.tag === 19) pa(e, n, t);
        else if (e.child !== null) {
          e.child.return = e, e = e.child;
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        e.sibling.return = e.return, e = e.sibling;
      }
      r &= 1;
    }
    if (pe(ke, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && ul(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), di(t, !1, l, n, o);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && ul(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        di(t, !0, n, null, o);
        break;
      case "together":
        di(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function hl(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function Rt(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), ln |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(u(153));
    if (t.child !== null) {
      for (e = t.child, n = Yt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = Yt(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function bf(e, t, n) {
    switch (t.tag) {
      case 3:
        ca(t), Pn();
        break;
      case 5:
        Rs(t);
        break;
      case 1:
        Ye(t.type) && Jr(t);
        break;
      case 4:
        $o(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        pe(rl, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (pe(ke, ke.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? da(e, t, n) : (pe(ke, ke.current & 1), e = Rt(e, t, n), e !== null ? e.sibling : null);
        pe(ke, ke.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return ma(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), pe(ke, ke.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, ua(e, t, n);
    }
    return Rt(e, t, n);
  }
  var ha, pi, ya, va;
  ha = function(e, t) {
    for (var n = t.child; n !== null; ) {
      if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
      else if (n.tag !== 4 && n.child !== null) {
        n.child.return = n, n = n.child;
        continue;
      }
      if (n === t) break;
      for (; n.sibling === null; ) {
        if (n.return === null || n.return === t) return;
        n = n.return;
      }
      n.sibling.return = n.return, n = n.sibling;
    }
  }, pi = function() {
  }, ya = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, nn(wt.current);
      var o = null;
      switch (n) {
        case "input":
          l = Wl(e, l), r = Wl(e, r), o = [];
          break;
        case "select":
          l = M({}, l, { value: void 0 }), r = M({}, r, { value: void 0 }), o = [];
          break;
        case "textarea":
          l = Hl(e, l), r = Hl(e, r), o = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Yr);
      }
      Kl(n, r);
      var i;
      n = null;
      for (v in l) if (!r.hasOwnProperty(v) && l.hasOwnProperty(v) && l[v] != null) if (v === "style") {
        var a = l[v];
        for (i in a) a.hasOwnProperty(i) && (n || (n = {}), n[i] = "");
      } else v !== "dangerouslySetInnerHTML" && v !== "children" && v !== "suppressContentEditableWarning" && v !== "suppressHydrationWarning" && v !== "autoFocus" && (w.hasOwnProperty(v) ? o || (o = []) : (o = o || []).push(v, null));
      for (v in r) {
        var c = r[v];
        if (a = l?.[v], r.hasOwnProperty(v) && c !== a && (c != null || a != null)) if (v === "style") if (a) {
          for (i in a) !a.hasOwnProperty(i) || c && c.hasOwnProperty(i) || (n || (n = {}), n[i] = "");
          for (i in c) c.hasOwnProperty(i) && a[i] !== c[i] && (n || (n = {}), n[i] = c[i]);
        } else n || (o || (o = []), o.push(
          v,
          n
        )), n = c;
        else v === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, a = a ? a.__html : void 0, c != null && a !== c && (o = o || []).push(v, c)) : v === "children" ? typeof c != "string" && typeof c != "number" || (o = o || []).push(v, "" + c) : v !== "suppressContentEditableWarning" && v !== "suppressHydrationWarning" && (w.hasOwnProperty(v) ? (c != null && v === "onScroll" && he("scroll", e), o || a === c || (o = [])) : (o = o || []).push(v, c));
      }
      n && (o = o || []).push("style", n);
      var v = o;
      (t.updateQueue = v) && (t.flags |= 4);
    }
  }, va = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function hr(e, t) {
    if (!Se) switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null; ) t.alternate !== null && (n = t), t = t.sibling;
        n === null ? e.tail = null : n.sibling = null;
        break;
      case "collapsed":
        n = e.tail;
        for (var r = null; n !== null; ) n.alternate !== null && (r = n), n = n.sibling;
        r === null ? t || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
    }
  }
  function We(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function ed(e, t, n) {
    var r = t.pendingProps;
    switch (Do(t), t.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return We(t), null;
      case 1:
        return Ye(t.type) && Xr(), We(t), null;
      case 3:
        return r = t.stateNode, In(), ye(qe), ye(Fe), Yo(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (tl(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, dt !== null && (Ci(dt), dt = null))), pi(e, t), We(t), null;
      case 5:
        Ko(t);
        var l = nn(cr.current);
        if (n = t.type, e !== null && t.stateNode != null) ya(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(u(166));
            return We(t), null;
          }
          if (e = nn(wt.current), tl(t)) {
            r = t.stateNode, n = t.type;
            var o = t.memoizedProps;
            switch (r[gt] = t, r[or] = o, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                he("cancel", r), he("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                he("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < nr.length; l++) he(nr[l], r);
                break;
              case "source":
                he("error", r);
                break;
              case "img":
              case "image":
              case "link":
                he(
                  "error",
                  r
                ), he("load", r);
                break;
              case "details":
                he("toggle", r);
                break;
              case "input":
                Ji(r, o), he("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!o.multiple }, he("invalid", r);
                break;
              case "textarea":
                eu(r, o), he("invalid", r);
            }
            Kl(n, o), l = null;
            for (var i in o) if (o.hasOwnProperty(i)) {
              var a = o[i];
              i === "children" ? typeof a == "string" ? r.textContent !== a && (o.suppressHydrationWarning !== !0 && qr(r.textContent, a, e), l = ["children", a]) : typeof a == "number" && r.textContent !== "" + a && (o.suppressHydrationWarning !== !0 && qr(
                r.textContent,
                a,
                e
              ), l = ["children", "" + a]) : w.hasOwnProperty(i) && a != null && i === "onScroll" && he("scroll", r);
            }
            switch (n) {
              case "input":
                Cr(r), bi(r, o, !0);
                break;
              case "textarea":
                Cr(r), nu(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (r.onclick = Yr);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            i = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = ru(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = i.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = i.createElement(n, { is: r.is }) : (e = i.createElement(n), n === "select" && (i = e, r.multiple ? i.multiple = !0 : r.size && (i.size = r.size))) : e = i.createElementNS(e, n), e[gt] = t, e[or] = r, ha(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (i = ql(n, r), n) {
                case "dialog":
                  he("cancel", e), he("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  he("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < nr.length; l++) he(nr[l], e);
                  l = r;
                  break;
                case "source":
                  he("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  he(
                    "error",
                    e
                  ), he("load", e), l = r;
                  break;
                case "details":
                  he("toggle", e), l = r;
                  break;
                case "input":
                  Ji(e, r), l = Wl(e, r), he("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = M({}, r, { value: void 0 }), he("invalid", e);
                  break;
                case "textarea":
                  eu(e, r), l = Hl(e, r), he("invalid", e);
                  break;
                default:
                  l = r;
              }
              Kl(n, l), a = l;
              for (o in a) if (a.hasOwnProperty(o)) {
                var c = a[o];
                o === "style" ? iu(e, c) : o === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, c != null && lu(e, c)) : o === "children" ? typeof c == "string" ? (n !== "textarea" || c !== "") && Mn(e, c) : typeof c == "number" && Mn(e, "" + c) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (w.hasOwnProperty(o) ? c != null && o === "onScroll" && he("scroll", e) : c != null && O(e, o, c, i));
              }
              switch (n) {
                case "input":
                  Cr(e), bi(e, r, !1);
                  break;
                case "textarea":
                  Cr(e), nu(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + ce(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, o = r.value, o != null ? fn(e, !!r.multiple, o, !1) : r.defaultValue != null && fn(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = Yr);
              }
              switch (n) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  r = !!r.autoFocus;
                  break e;
                case "img":
                  r = !0;
                  break e;
                default:
                  r = !1;
              }
            }
            r && (t.flags |= 4);
          }
          t.ref !== null && (t.flags |= 512, t.flags |= 2097152);
        }
        return We(t), null;
      case 6:
        if (e && t.stateNode != null) va(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(u(166));
          if (n = nn(cr.current), nn(wt.current), tl(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[gt] = t, (o = r.nodeValue !== n) && (e = tt, e !== null)) switch (e.tag) {
              case 3:
                qr(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && qr(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            o && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[gt] = t, t.stateNode = r;
        }
        return We(t), null;
      case 13:
        if (ye(ke), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (Se && nt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) Ss(), Pn(), t.flags |= 98560, o = !1;
          else if (o = tl(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(u(318));
              if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(u(317));
              o[gt] = t;
            } else Pn(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            We(t), o = !1;
          } else dt !== null && (Ci(dt), dt = null), o = !0;
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (ke.current & 1) !== 0 ? Te === 0 && (Te = 3) : Ni())), t.updateQueue !== null && (t.flags |= 4), We(t), null);
      case 4:
        return In(), pi(e, t), e === null && rr(t.stateNode.containerInfo), We(t), null;
      case 10:
        return Wo(t.type._context), We(t), null;
      case 17:
        return Ye(t.type) && Xr(), We(t), null;
      case 19:
        if (ye(ke), o = t.memoizedState, o === null) return We(t), null;
        if (r = (t.flags & 128) !== 0, i = o.rendering, i === null) if (r) hr(o, !1);
        else {
          if (Te !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (i = ul(e), i !== null) {
              for (t.flags |= 128, hr(o, !1), r = i.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) o = n, e = r, o.flags &= 14680066, i = o.alternate, i === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = i.childLanes, o.lanes = i.lanes, o.child = i.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = i.memoizedProps, o.memoizedState = i.memoizedState, o.updateQueue = i.updateQueue, o.type = i.type, e = i.dependencies, o.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return pe(ke, ke.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          o.tail !== null && xe() > zn && (t.flags |= 128, r = !0, hr(o, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = ul(i), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), hr(o, !0), o.tail === null && o.tailMode === "hidden" && !i.alternate && !Se) return We(t), null;
          } else 2 * xe() - o.renderingStartTime > zn && n !== 1073741824 && (t.flags |= 128, r = !0, hr(o, !1), t.lanes = 4194304);
          o.isBackwards ? (i.sibling = t.child, t.child = i) : (n = o.last, n !== null ? n.sibling = i : t.child = i, o.last = i);
        }
        return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = xe(), t.sibling = null, n = ke.current, pe(ke, r ? n & 1 | 2 : n & 1), t) : (We(t), null);
      case 22:
      case 23:
        return Pi(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (rt & 1073741824) !== 0 && (We(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : We(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(u(156, t.tag));
  }
  function td(e, t) {
    switch (Do(t), t.tag) {
      case 1:
        return Ye(t.type) && Xr(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return In(), ye(qe), ye(Fe), Yo(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Ko(t), null;
      case 13:
        if (ye(ke), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(u(340));
          Pn();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return ye(ke), null;
      case 4:
        return In(), null;
      case 10:
        return Wo(t.type._context), null;
      case 22:
      case 23:
        return Pi(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var yl = !1, Be = !1, nd = typeof WeakSet == "function" ? WeakSet : Set, U = null;
  function On(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      Ce(e, t, r);
    }
    else n.current = null;
  }
  function mi(e, t, n) {
    try {
      n();
    } catch (r) {
      Ce(e, t, r);
    }
  }
  var ga = !1;
  function rd(e, t) {
    if (Po = Ar, e = Xu(), go(e)) {
      if ("selectionStart" in e) var n = { start: e.selectionStart, end: e.selectionEnd };
      else e: {
        n = (n = e.ownerDocument) && n.defaultView || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var l = r.anchorOffset, o = r.focusNode;
          r = r.focusOffset;
          try {
            n.nodeType, o.nodeType;
          } catch {
            n = null;
            break e;
          }
          var i = 0, a = -1, c = -1, v = 0, C = 0, P = e, _ = null;
          t: for (; ; ) {
            for (var A; P !== n || l !== 0 && P.nodeType !== 3 || (a = i + l), P !== o || r !== 0 && P.nodeType !== 3 || (c = i + r), P.nodeType === 3 && (i += P.nodeValue.length), (A = P.firstChild) !== null; )
              _ = P, P = A;
            for (; ; ) {
              if (P === e) break t;
              if (_ === n && ++v === l && (a = i), _ === o && ++C === r && (c = i), (A = P.nextSibling) !== null) break;
              P = _, _ = P.parentNode;
            }
            P = A;
          }
          n = a === -1 || c === -1 ? null : { start: a, end: c };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (No = { focusedElem: e, selectionRange: n }, Ar = !1, U = t; U !== null; ) if (t = U, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, U = e;
    else for (; U !== null; ) {
      t = U;
      try {
        var V = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (V !== null) {
              var W = V.memoizedProps, Pe = V.memoizedState, m = t.stateNode, p = m.getSnapshotBeforeUpdate(t.elementType === t.type ? W : pt(t.type, W), Pe);
              m.__reactInternalSnapshotBeforeUpdate = p;
            }
            break;
          case 3:
            var h = t.stateNode.containerInfo;
            h.nodeType === 1 ? h.textContent = "" : h.nodeType === 9 && h.documentElement && h.removeChild(h.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(u(163));
        }
      } catch (L) {
        Ce(t, t.return, L);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, U = e;
        break;
      }
      U = t.return;
    }
    return V = ga, ga = !1, V;
  }
  function yr(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          l.destroy = void 0, o !== void 0 && mi(t, n, o);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function vl(e, t) {
    if (t = t.updateQueue, t = t !== null ? t.lastEffect : null, t !== null) {
      var n = t = t.next;
      do {
        if ((n.tag & e) === e) {
          var r = n.create;
          n.destroy = r();
        }
        n = n.next;
      } while (n !== t);
    }
  }
  function hi(e) {
    var t = e.ref;
    if (t !== null) {
      var n = e.stateNode;
      switch (e.tag) {
        case 5:
          e = n;
          break;
        default:
          e = n;
      }
      typeof t == "function" ? t(e) : t.current = e;
    }
  }
  function wa(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, wa(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[gt], delete t[or], delete t[To], delete t[Ff], delete t[Vf])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Sa(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function ka(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Sa(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function yi(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Yr));
    else if (r !== 4 && (e = e.child, e !== null)) for (yi(e, t, n), e = e.sibling; e !== null; ) yi(e, t, n), e = e.sibling;
  }
  function vi(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (vi(e, t, n), e = e.sibling; e !== null; ) vi(e, t, n), e = e.sibling;
  }
  var Me = null, mt = !1;
  function Qt(e, t, n) {
    for (n = n.child; n !== null; ) _a(e, t, n), n = n.sibling;
  }
  function _a(e, t, n) {
    if (vt && typeof vt.onCommitFiberUnmount == "function") try {
      vt.onCommitFiberUnmount(Ir, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        Be || On(n, t);
      case 6:
        var r = Me, l = mt;
        Me = null, Qt(e, t, n), Me = r, mt = l, Me !== null && (mt ? (e = Me, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : Me.removeChild(n.stateNode));
        break;
      case 18:
        Me !== null && (mt ? (e = Me, n = n.stateNode, e.nodeType === 8 ? Io(e.parentNode, n) : e.nodeType === 1 && Io(e, n), Yn(e)) : Io(Me, n.stateNode));
        break;
      case 4:
        r = Me, l = mt, Me = n.stateNode.containerInfo, mt = !0, Qt(e, t, n), Me = r, mt = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Be && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var o = l, i = o.destroy;
            o = o.tag, i !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && mi(n, t, i), l = l.next;
          } while (l !== r);
        }
        Qt(e, t, n);
        break;
      case 1:
        if (!Be && (On(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (a) {
          Ce(n, t, a);
        }
        Qt(e, t, n);
        break;
      case 21:
        Qt(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (Be = (r = Be) || n.memoizedState !== null, Qt(e, t, n), Be = r) : Qt(e, t, n);
        break;
      default:
        Qt(e, t, n);
    }
  }
  function Ea(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new nd()), t.forEach(function(r) {
        var l = dd.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
    }
  }
  function ht(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var o = e, i = t, a = i;
        e: for (; a !== null; ) {
          switch (a.tag) {
            case 5:
              Me = a.stateNode, mt = !1;
              break e;
            case 3:
              Me = a.stateNode.containerInfo, mt = !0;
              break e;
            case 4:
              Me = a.stateNode.containerInfo, mt = !0;
              break e;
          }
          a = a.return;
        }
        if (Me === null) throw Error(u(160));
        _a(o, i, l), Me = null, mt = !1;
        var c = l.alternate;
        c !== null && (c.return = null), l.return = null;
      } catch (v) {
        Ce(l, t, v);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Ca(t, e), t = t.sibling;
  }
  function Ca(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ht(t, e), kt(e), r & 4) {
          try {
            yr(3, e, e.return), vl(3, e);
          } catch (W) {
            Ce(e, e.return, W);
          }
          try {
            yr(5, e, e.return);
          } catch (W) {
            Ce(e, e.return, W);
          }
        }
        break;
      case 1:
        ht(t, e), kt(e), r & 512 && n !== null && On(n, n.return);
        break;
      case 5:
        if (ht(t, e), kt(e), r & 512 && n !== null && On(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            Mn(l, "");
          } catch (W) {
            Ce(e, e.return, W);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var o = e.memoizedProps, i = n !== null ? n.memoizedProps : o, a = e.type, c = e.updateQueue;
          if (e.updateQueue = null, c !== null) try {
            a === "input" && o.type === "radio" && o.name != null && Zi(l, o), ql(a, i);
            var v = ql(a, o);
            for (i = 0; i < c.length; i += 2) {
              var C = c[i], P = c[i + 1];
              C === "style" ? iu(l, P) : C === "dangerouslySetInnerHTML" ? lu(l, P) : C === "children" ? Mn(l, P) : O(l, C, P, v);
            }
            switch (a) {
              case "input":
                Bl(l, o);
                break;
              case "textarea":
                tu(l, o);
                break;
              case "select":
                var _ = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!o.multiple;
                var A = o.value;
                A != null ? fn(l, !!o.multiple, A, !1) : _ !== !!o.multiple && (o.defaultValue != null ? fn(
                  l,
                  !!o.multiple,
                  o.defaultValue,
                  !0
                ) : fn(l, !!o.multiple, o.multiple ? [] : "", !1));
            }
            l[or] = o;
          } catch (W) {
            Ce(e, e.return, W);
          }
        }
        break;
      case 6:
        if (ht(t, e), kt(e), r & 4) {
          if (e.stateNode === null) throw Error(u(162));
          l = e.stateNode, o = e.memoizedProps;
          try {
            l.nodeValue = o;
          } catch (W) {
            Ce(e, e.return, W);
          }
        }
        break;
      case 3:
        if (ht(t, e), kt(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          Yn(t.containerInfo);
        } catch (W) {
          Ce(e, e.return, W);
        }
        break;
      case 4:
        ht(t, e), kt(e);
        break;
      case 13:
        ht(t, e), kt(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (Si = xe())), r & 4 && Ea(e);
        break;
      case 22:
        if (C = n !== null && n.memoizedState !== null, e.mode & 1 ? (Be = (v = Be) || C, ht(t, e), Be = v) : ht(t, e), kt(e), r & 8192) {
          if (v = e.memoizedState !== null, (e.stateNode.isHidden = v) && !C && (e.mode & 1) !== 0) for (U = e, C = e.child; C !== null; ) {
            for (P = U = C; U !== null; ) {
              switch (_ = U, A = _.child, _.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  yr(4, _, _.return);
                  break;
                case 1:
                  On(_, _.return);
                  var V = _.stateNode;
                  if (typeof V.componentWillUnmount == "function") {
                    r = _, n = _.return;
                    try {
                      t = r, V.props = t.memoizedProps, V.state = t.memoizedState, V.componentWillUnmount();
                    } catch (W) {
                      Ce(r, n, W);
                    }
                  }
                  break;
                case 5:
                  On(_, _.return);
                  break;
                case 22:
                  if (_.memoizedState !== null) {
                    Na(P);
                    continue;
                  }
              }
              A !== null ? (A.return = _, U = A) : Na(P);
            }
            C = C.sibling;
          }
          e: for (C = null, P = e; ; ) {
            if (P.tag === 5) {
              if (C === null) {
                C = P;
                try {
                  l = P.stateNode, v ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (a = P.stateNode, c = P.memoizedProps.style, i = c != null && c.hasOwnProperty("display") ? c.display : null, a.style.display = ou("display", i));
                } catch (W) {
                  Ce(e, e.return, W);
                }
              }
            } else if (P.tag === 6) {
              if (C === null) try {
                P.stateNode.nodeValue = v ? "" : P.memoizedProps;
              } catch (W) {
                Ce(e, e.return, W);
              }
            } else if ((P.tag !== 22 && P.tag !== 23 || P.memoizedState === null || P === e) && P.child !== null) {
              P.child.return = P, P = P.child;
              continue;
            }
            if (P === e) break e;
            for (; P.sibling === null; ) {
              if (P.return === null || P.return === e) break e;
              C === P && (C = null), P = P.return;
            }
            C === P && (C = null), P.sibling.return = P.return, P = P.sibling;
          }
        }
        break;
      case 19:
        ht(t, e), kt(e), r & 4 && Ea(e);
        break;
      case 21:
        break;
      default:
        ht(
          t,
          e
        ), kt(e);
    }
  }
  function kt(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        e: {
          for (var n = e.return; n !== null; ) {
            if (Sa(n)) {
              var r = n;
              break e;
            }
            n = n.return;
          }
          throw Error(u(160));
        }
        switch (r.tag) {
          case 5:
            var l = r.stateNode;
            r.flags & 32 && (Mn(l, ""), r.flags &= -33);
            var o = ka(e);
            vi(e, o, l);
            break;
          case 3:
          case 4:
            var i = r.stateNode.containerInfo, a = ka(e);
            yi(e, a, i);
            break;
          default:
            throw Error(u(161));
        }
      } catch (c) {
        Ce(e, e.return, c);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function ld(e, t, n) {
    U = e, xa(e);
  }
  function xa(e, t, n) {
    for (var r = (e.mode & 1) !== 0; U !== null; ) {
      var l = U, o = l.child;
      if (l.tag === 22 && r) {
        var i = l.memoizedState !== null || yl;
        if (!i) {
          var a = l.alternate, c = a !== null && a.memoizedState !== null || Be;
          a = yl;
          var v = Be;
          if (yl = i, (Be = c) && !v) for (U = l; U !== null; ) i = U, c = i.child, i.tag === 22 && i.memoizedState !== null ? Ra(l) : c !== null ? (c.return = i, U = c) : Ra(l);
          for (; o !== null; ) U = o, xa(o), o = o.sibling;
          U = l, yl = a, Be = v;
        }
        Pa(e);
      } else (l.subtreeFlags & 8772) !== 0 && o !== null ? (o.return = l, U = o) : Pa(e);
    }
  }
  function Pa(e) {
    for (; U !== null; ) {
      var t = U;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Be || vl(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !Be) if (n === null) r.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : pt(t.type, n.memoizedProps);
                r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var o = t.updateQueue;
              o !== null && Ns(t, o, r);
              break;
            case 3:
              var i = t.updateQueue;
              if (i !== null) {
                if (n = null, t.child !== null) switch (t.child.tag) {
                  case 5:
                    n = t.child.stateNode;
                    break;
                  case 1:
                    n = t.child.stateNode;
                }
                Ns(t, i, n);
              }
              break;
            case 5:
              var a = t.stateNode;
              if (n === null && t.flags & 4) {
                n = a;
                var c = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    c.autoFocus && n.focus();
                    break;
                  case "img":
                    c.src && (n.src = c.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var v = t.alternate;
                if (v !== null) {
                  var C = v.memoizedState;
                  if (C !== null) {
                    var P = C.dehydrated;
                    P !== null && Yn(P);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(u(163));
          }
          Be || t.flags & 512 && hi(t);
        } catch (_) {
          Ce(t, t.return, _);
        }
      }
      if (t === e) {
        U = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, U = n;
        break;
      }
      U = t.return;
    }
  }
  function Na(e) {
    for (; U !== null; ) {
      var t = U;
      if (t === e) {
        U = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, U = n;
        break;
      }
      U = t.return;
    }
  }
  function Ra(e) {
    for (; U !== null; ) {
      var t = U;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              vl(4, t);
            } catch (c) {
              Ce(t, n, c);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (c) {
                Ce(t, l, c);
              }
            }
            var o = t.return;
            try {
              hi(t);
            } catch (c) {
              Ce(t, o, c);
            }
            break;
          case 5:
            var i = t.return;
            try {
              hi(t);
            } catch (c) {
              Ce(t, i, c);
            }
        }
      } catch (c) {
        Ce(t, t.return, c);
      }
      if (t === e) {
        U = null;
        break;
      }
      var a = t.sibling;
      if (a !== null) {
        a.return = t.return, U = a;
        break;
      }
      U = t.return;
    }
  }
  var od = Math.ceil, gl = le.ReactCurrentDispatcher, gi = le.ReactCurrentOwner, st = le.ReactCurrentBatchConfig, oe = 0, ze = null, Re = null, Ue = 0, rt = 0, jn = Ut(0), Te = 0, vr = null, ln = 0, wl = 0, wi = 0, gr = null, Xe = null, Si = 0, zn = 1 / 0, Lt = null, Sl = !1, ki = null, Ht = null, kl = !1, $t = null, _l = 0, wr = 0, _i = null, El = -1, Cl = 0;
  function Ke() {
    return (oe & 6) !== 0 ? xe() : El !== -1 ? El : El = xe();
  }
  function Kt(e) {
    return (e.mode & 1) === 0 ? 1 : (oe & 2) !== 0 && Ue !== 0 ? Ue & -Ue : Bf.transition !== null ? (Cl === 0 && (Cl = ku()), Cl) : (e = fe, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Iu(e.type)), e);
  }
  function yt(e, t, n, r) {
    if (50 < wr) throw wr = 0, _i = null, Error(u(185));
    Qn(e, n, r), ((oe & 2) === 0 || e !== ze) && (e === ze && ((oe & 2) === 0 && (wl |= n), Te === 4 && qt(e, Ue)), Je(e, r), n === 1 && oe === 0 && (t.mode & 1) === 0 && (zn = xe() + 500, Zr && Vt()));
  }
  function Je(e, t) {
    var n = e.callbackNode;
    Wc(e, t);
    var r = jr(e, e === ze ? Ue : 0);
    if (r === 0) n !== null && gu(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && gu(n), t === 1) e.tag === 0 ? Wf(Ia.bind(null, e)) : hs(Ia.bind(null, e)), Mf(function() {
        (oe & 6) === 0 && Vt();
      }), n = null;
      else {
        switch (_u(r)) {
          case 1:
            n = eo;
            break;
          case 4:
            n = wu;
            break;
          case 16:
            n = Lr;
            break;
          case 536870912:
            n = Su;
            break;
          default:
            n = Lr;
        }
        n = Ua(n, La.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function La(e, t) {
    if (El = -1, Cl = 0, (oe & 6) !== 0) throw Error(u(327));
    var n = e.callbackNode;
    if (Dn() && e.callbackNode !== n) return null;
    var r = jr(e, e === ze ? Ue : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = xl(e, r);
    else {
      t = r;
      var l = oe;
      oe |= 2;
      var o = Oa();
      (ze !== e || Ue !== t) && (Lt = null, zn = xe() + 500, un(e, t));
      do
        try {
          sd();
          break;
        } catch (a) {
          Ta(e, a);
        }
      while (!0);
      Vo(), gl.current = o, oe = l, Re !== null ? t = 0 : (ze = null, Ue = 0, t = Te);
    }
    if (t !== 0) {
      if (t === 2 && (l = to(e), l !== 0 && (r = l, t = Ei(e, l))), t === 1) throw n = vr, un(e, 0), qt(e, r), Je(e, xe()), n;
      if (t === 6) qt(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !id(l) && (t = xl(e, r), t === 2 && (o = to(e), o !== 0 && (r = o, t = Ei(e, o))), t === 1)) throw n = vr, un(e, 0), qt(e, r), Je(e, xe()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(u(345));
          case 2:
            sn(e, Xe, Lt);
            break;
          case 3:
            if (qt(e, r), (r & 130023424) === r && (t = Si + 500 - xe(), 10 < t)) {
              if (jr(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                Ke(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = Lo(sn.bind(null, e, Xe, Lt), t);
              break;
            }
            sn(e, Xe, Lt);
            break;
          case 4:
            if (qt(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var i = 31 - ct(r);
              o = 1 << i, i = t[i], i > l && (l = i), r &= ~o;
            }
            if (r = l, r = xe() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * od(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = Lo(sn.bind(null, e, Xe, Lt), r);
              break;
            }
            sn(e, Xe, Lt);
            break;
          case 5:
            sn(e, Xe, Lt);
            break;
          default:
            throw Error(u(329));
        }
      }
    }
    return Je(e, xe()), e.callbackNode === n ? La.bind(null, e) : null;
  }
  function Ei(e, t) {
    var n = gr;
    return e.current.memoizedState.isDehydrated && (un(e, t).flags |= 256), e = xl(e, t), e !== 2 && (t = Xe, Xe = n, t !== null && Ci(t)), e;
  }
  function Ci(e) {
    Xe === null ? Xe = e : Xe.push.apply(Xe, e);
  }
  function id(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
          var l = n[r], o = l.getSnapshot;
          l = l.value;
          try {
            if (!ft(o(), l)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (n = t.child, t.subtreeFlags & 16384 && n !== null) n.return = t, t = n;
      else {
        if (t === e) break;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
    }
    return !0;
  }
  function qt(e, t) {
    for (t &= ~wi, t &= ~wl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - ct(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function Ia(e) {
    if ((oe & 6) !== 0) throw Error(u(327));
    Dn();
    var t = jr(e, 0);
    if ((t & 1) === 0) return Je(e, xe()), null;
    var n = xl(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = to(e);
      r !== 0 && (t = r, n = Ei(e, r));
    }
    if (n === 1) throw n = vr, un(e, 0), qt(e, t), Je(e, xe()), n;
    if (n === 6) throw Error(u(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, sn(e, Xe, Lt), Je(e, xe()), null;
  }
  function xi(e, t) {
    var n = oe;
    oe |= 1;
    try {
      return e(t);
    } finally {
      oe = n, oe === 0 && (zn = xe() + 500, Zr && Vt());
    }
  }
  function on(e) {
    $t !== null && $t.tag === 0 && (oe & 6) === 0 && Dn();
    var t = oe;
    oe |= 1;
    var n = st.transition, r = fe;
    try {
      if (st.transition = null, fe = 1, e) return e();
    } finally {
      fe = r, st.transition = n, oe = t, (oe & 6) === 0 && Vt();
    }
  }
  function Pi() {
    rt = jn.current, ye(jn);
  }
  function un(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Af(n)), Re !== null) for (n = Re.return; n !== null; ) {
      var r = n;
      switch (Do(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && Xr();
          break;
        case 3:
          In(), ye(qe), ye(Fe), Yo();
          break;
        case 5:
          Ko(r);
          break;
        case 4:
          In();
          break;
        case 13:
          ye(ke);
          break;
        case 19:
          ye(ke);
          break;
        case 10:
          Wo(r.type._context);
          break;
        case 22:
        case 23:
          Pi();
      }
      n = n.return;
    }
    if (ze = e, Re = e = Yt(e.current, null), Ue = rt = t, Te = 0, vr = null, wi = wl = ln = 0, Xe = gr = null, tn !== null) {
      for (t = 0; t < tn.length; t++) if (n = tn[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var l = r.next, o = n.pending;
        if (o !== null) {
          var i = o.next;
          o.next = l, r.next = i;
        }
        n.pending = r;
      }
      tn = null;
    }
    return e;
  }
  function Ta(e, t) {
    do {
      var n = Re;
      try {
        if (Vo(), sl.current = dl, al) {
          for (var r = _e.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          al = !1;
        }
        if (rn = 0, je = Ie = _e = null, fr = !1, dr = 0, gi.current = null, n === null || n.return === null) {
          Te = 1, vr = t, Re = null;
          break;
        }
        e: {
          var o = e, i = n.return, a = n, c = t;
          if (t = Ue, a.flags |= 32768, c !== null && typeof c == "object" && typeof c.then == "function") {
            var v = c, C = a, P = C.tag;
            if ((C.mode & 1) === 0 && (P === 0 || P === 11 || P === 15)) {
              var _ = C.alternate;
              _ ? (C.updateQueue = _.updateQueue, C.memoizedState = _.memoizedState, C.lanes = _.lanes) : (C.updateQueue = null, C.memoizedState = null);
            }
            var A = na(i);
            if (A !== null) {
              A.flags &= -257, ra(A, i, a, o, t), A.mode & 1 && ta(o, v, t), t = A, c = v;
              var V = t.updateQueue;
              if (V === null) {
                var W = /* @__PURE__ */ new Set();
                W.add(c), t.updateQueue = W;
              } else V.add(c);
              break e;
            } else {
              if ((t & 1) === 0) {
                ta(o, v, t), Ni();
                break e;
              }
              c = Error(u(426));
            }
          } else if (Se && a.mode & 1) {
            var Pe = na(i);
            if (Pe !== null) {
              (Pe.flags & 65536) === 0 && (Pe.flags |= 256), ra(Pe, i, a, o, t), Uo(Tn(c, a));
              break e;
            }
          }
          o = c = Tn(c, a), Te !== 4 && (Te = 2), gr === null ? gr = [o] : gr.push(o), o = i;
          do {
            switch (o.tag) {
              case 3:
                o.flags |= 65536, t &= -t, o.lanes |= t;
                var m = bs(o, c, t);
                Ps(o, m);
                break e;
              case 1:
                a = c;
                var p = o.type, h = o.stateNode;
                if ((o.flags & 128) === 0 && (typeof p.getDerivedStateFromError == "function" || h !== null && typeof h.componentDidCatch == "function" && (Ht === null || !Ht.has(h)))) {
                  o.flags |= 65536, t &= -t, o.lanes |= t;
                  var L = ea(o, a, t);
                  Ps(o, L);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        za(n);
      } catch (Q) {
        t = Q, Re === n && n !== null && (Re = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Oa() {
    var e = gl.current;
    return gl.current = dl, e === null ? dl : e;
  }
  function Ni() {
    (Te === 0 || Te === 3 || Te === 2) && (Te = 4), ze === null || (ln & 268435455) === 0 && (wl & 268435455) === 0 || qt(ze, Ue);
  }
  function xl(e, t) {
    var n = oe;
    oe |= 2;
    var r = Oa();
    (ze !== e || Ue !== t) && (Lt = null, un(e, t));
    do
      try {
        ud();
        break;
      } catch (l) {
        Ta(e, l);
      }
    while (!0);
    if (Vo(), oe = n, gl.current = r, Re !== null) throw Error(u(261));
    return ze = null, Ue = 0, Te;
  }
  function ud() {
    for (; Re !== null; ) ja(Re);
  }
  function sd() {
    for (; Re !== null && !Oc(); ) ja(Re);
  }
  function ja(e) {
    var t = Ma(e.alternate, e, rt);
    e.memoizedProps = e.pendingProps, t === null ? za(e) : Re = t, gi.current = null;
  }
  function za(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = ed(n, t, rt), n !== null) {
          Re = n;
          return;
        }
      } else {
        if (n = td(n, t), n !== null) {
          n.flags &= 32767, Re = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          Te = 6, Re = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        Re = t;
        return;
      }
      Re = t = e;
    } while (t !== null);
    Te === 0 && (Te = 5);
  }
  function sn(e, t, n) {
    var r = fe, l = st.transition;
    try {
      st.transition = null, fe = 1, ad(e, t, n, r);
    } finally {
      st.transition = l, fe = r;
    }
    return null;
  }
  function ad(e, t, n, r) {
    do
      Dn();
    while ($t !== null);
    if ((oe & 6) !== 0) throw Error(u(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(u(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var o = n.lanes | n.childLanes;
    if (Bc(e, o), e === ze && (Re = ze = null, Ue = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || kl || (kl = !0, Ua(Lr, function() {
      return Dn(), null;
    })), o = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || o) {
      o = st.transition, st.transition = null;
      var i = fe;
      fe = 1;
      var a = oe;
      oe |= 4, gi.current = null, rd(e, n), Ca(n, e), Lf(No), Ar = !!Po, No = Po = null, e.current = n, ld(n), jc(), oe = a, fe = i, st.transition = o;
    } else e.current = n;
    if (kl && (kl = !1, $t = e, _l = l), o = e.pendingLanes, o === 0 && (Ht = null), Ac(n.stateNode), Je(e, xe()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (Sl) throw Sl = !1, e = ki, ki = null, e;
    return (_l & 1) !== 0 && e.tag !== 0 && Dn(), o = e.pendingLanes, (o & 1) !== 0 ? e === _i ? wr++ : (wr = 0, _i = e) : wr = 0, Vt(), null;
  }
  function Dn() {
    if ($t !== null) {
      var e = _u(_l), t = st.transition, n = fe;
      try {
        if (st.transition = null, fe = 16 > e ? 16 : e, $t === null) var r = !1;
        else {
          if (e = $t, $t = null, _l = 0, (oe & 6) !== 0) throw Error(u(331));
          var l = oe;
          for (oe |= 4, U = e.current; U !== null; ) {
            var o = U, i = o.child;
            if ((U.flags & 16) !== 0) {
              var a = o.deletions;
              if (a !== null) {
                for (var c = 0; c < a.length; c++) {
                  var v = a[c];
                  for (U = v; U !== null; ) {
                    var C = U;
                    switch (C.tag) {
                      case 0:
                      case 11:
                      case 15:
                        yr(8, C, o);
                    }
                    var P = C.child;
                    if (P !== null) P.return = C, U = P;
                    else for (; U !== null; ) {
                      C = U;
                      var _ = C.sibling, A = C.return;
                      if (wa(C), C === v) {
                        U = null;
                        break;
                      }
                      if (_ !== null) {
                        _.return = A, U = _;
                        break;
                      }
                      U = A;
                    }
                  }
                }
                var V = o.alternate;
                if (V !== null) {
                  var W = V.child;
                  if (W !== null) {
                    V.child = null;
                    do {
                      var Pe = W.sibling;
                      W.sibling = null, W = Pe;
                    } while (W !== null);
                  }
                }
                U = o;
              }
            }
            if ((o.subtreeFlags & 2064) !== 0 && i !== null) i.return = o, U = i;
            else e: for (; U !== null; ) {
              if (o = U, (o.flags & 2048) !== 0) switch (o.tag) {
                case 0:
                case 11:
                case 15:
                  yr(9, o, o.return);
              }
              var m = o.sibling;
              if (m !== null) {
                m.return = o.return, U = m;
                break e;
              }
              U = o.return;
            }
          }
          var p = e.current;
          for (U = p; U !== null; ) {
            i = U;
            var h = i.child;
            if ((i.subtreeFlags & 2064) !== 0 && h !== null) h.return = i, U = h;
            else e: for (i = p; U !== null; ) {
              if (a = U, (a.flags & 2048) !== 0) try {
                switch (a.tag) {
                  case 0:
                  case 11:
                  case 15:
                    vl(9, a);
                }
              } catch (Q) {
                Ce(a, a.return, Q);
              }
              if (a === i) {
                U = null;
                break e;
              }
              var L = a.sibling;
              if (L !== null) {
                L.return = a.return, U = L;
                break e;
              }
              U = a.return;
            }
          }
          if (oe = l, Vt(), vt && typeof vt.onPostCommitFiberRoot == "function") try {
            vt.onPostCommitFiberRoot(Ir, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        fe = n, st.transition = t;
      }
    }
    return !1;
  }
  function Da(e, t, n) {
    t = Tn(n, t), t = bs(e, t, 1), e = Bt(e, t, 1), t = Ke(), e !== null && (Qn(e, 1, t), Je(e, t));
  }
  function Ce(e, t, n) {
    if (e.tag === 3) Da(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Da(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Ht === null || !Ht.has(r))) {
          e = Tn(n, e), e = ea(t, e, 1), t = Bt(t, e, 1), e = Ke(), t !== null && (Qn(t, 1, e), Je(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function cd(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = Ke(), e.pingedLanes |= e.suspendedLanes & n, ze === e && (Ue & n) === n && (Te === 4 || Te === 3 && (Ue & 130023424) === Ue && 500 > xe() - Si ? un(e, 0) : wi |= n), Je(e, t);
  }
  function Aa(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = Or, Or <<= 1, (Or & 130023424) === 0 && (Or = 4194304)));
    var n = Ke();
    e = Pt(e, t), e !== null && (Qn(e, t, n), Je(e, n));
  }
  function fd(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Aa(e, n);
  }
  function dd(e, t) {
    var n = 0;
    switch (e.tag) {
      case 13:
        var r = e.stateNode, l = e.memoizedState;
        l !== null && (n = l.retryLane);
        break;
      case 19:
        r = e.stateNode;
        break;
      default:
        throw Error(u(314));
    }
    r !== null && r.delete(t), Aa(e, n);
  }
  var Ma;
  Ma = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || qe.current) Ge = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Ge = !1, bf(e, t, n);
      Ge = (e.flags & 131072) !== 0;
    }
    else Ge = !1, Se && (t.flags & 1048576) !== 0 && ys(t, el, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        hl(e, t), e = t.pendingProps;
        var l = En(t, Fe.current);
        Ln(t, n), l = Jo(null, t, r, e, l, n);
        var o = Zo();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ye(r) ? (o = !0, Jr(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Ho(t), l.updater = pl, t.stateNode = l, l._reactInternals = t, li(t, r, e, n), t = si(null, t, r, !0, o, n)) : (t.tag = 0, Se && o && zo(t), $e(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (hl(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = md(r), e = pt(r, e), l) {
            case 0:
              t = ui(null, t, r, e, n);
              break e;
            case 1:
              t = aa(null, t, r, e, n);
              break e;
            case 11:
              t = la(null, t, r, e, n);
              break e;
            case 14:
              t = oa(null, t, r, pt(r.type, e), n);
              break e;
          }
          throw Error(u(
            306,
            r,
            ""
          ));
        }
        return t;
      case 0:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pt(r, l), ui(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pt(r, l), aa(e, t, r, l, n);
      case 3:
        e: {
          if (ca(t), e === null) throw Error(u(387));
          r = t.pendingProps, o = t.memoizedState, l = o.element, xs(e, t), il(t, r, null, n);
          var i = t.memoizedState;
          if (r = i.element, o.isDehydrated) if (o = { element: r, isDehydrated: !1, cache: i.cache, pendingSuspenseBoundaries: i.pendingSuspenseBoundaries, transitions: i.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
            l = Tn(Error(u(423)), t), t = fa(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = Tn(Error(u(424)), t), t = fa(e, t, r, n, l);
            break e;
          } else for (nt = Mt(t.stateNode.containerInfo.firstChild), tt = t, Se = !0, dt = null, n = Es(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (Pn(), r === l) {
              t = Rt(e, t, n);
              break e;
            }
            $e(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Rs(t), e === null && Mo(t), r = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, i = l.children, Ro(r, l) ? i = null : o !== null && Ro(r, o) && (t.flags |= 32), sa(e, t), $e(e, t, i, n), t.child;
      case 6:
        return e === null && Mo(t), null;
      case 13:
        return da(e, t, n);
      case 4:
        return $o(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Nn(t, null, r, n) : $e(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pt(r, l), la(e, t, r, l, n);
      case 7:
        return $e(e, t, t.pendingProps, n), t.child;
      case 8:
        return $e(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return $e(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, o = t.memoizedProps, i = l.value, pe(rl, r._currentValue), r._currentValue = i, o !== null) if (ft(o.value, i)) {
            if (o.children === l.children && !qe.current) {
              t = Rt(e, t, n);
              break e;
            }
          } else for (o = t.child, o !== null && (o.return = t); o !== null; ) {
            var a = o.dependencies;
            if (a !== null) {
              i = o.child;
              for (var c = a.firstContext; c !== null; ) {
                if (c.context === r) {
                  if (o.tag === 1) {
                    c = Nt(-1, n & -n), c.tag = 2;
                    var v = o.updateQueue;
                    if (v !== null) {
                      v = v.shared;
                      var C = v.pending;
                      C === null ? c.next = c : (c.next = C.next, C.next = c), v.pending = c;
                    }
                  }
                  o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Bo(
                    o.return,
                    n,
                    t
                  ), a.lanes |= n;
                  break;
                }
                c = c.next;
              }
            } else if (o.tag === 10) i = o.type === t.type ? null : o.child;
            else if (o.tag === 18) {
              if (i = o.return, i === null) throw Error(u(341));
              i.lanes |= n, a = i.alternate, a !== null && (a.lanes |= n), Bo(i, n, t), i = o.sibling;
            } else i = o.child;
            if (i !== null) i.return = o;
            else for (i = o; i !== null; ) {
              if (i === t) {
                i = null;
                break;
              }
              if (o = i.sibling, o !== null) {
                o.return = i.return, i = o;
                break;
              }
              i = i.return;
            }
            o = i;
          }
          $e(e, t, l.children, n), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, r = t.pendingProps.children, Ln(t, n), l = it(l), r = r(l), t.flags |= 1, $e(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = pt(r, t.pendingProps), l = pt(r.type, l), oa(e, t, r, l, n);
      case 15:
        return ia(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pt(r, l), hl(e, t), t.tag = 1, Ye(r) ? (e = !0, Jr(t)) : e = !1, Ln(t, n), Js(t, r, l), li(t, r, l, n), si(null, t, r, !0, e, n);
      case 19:
        return ma(e, t, n);
      case 22:
        return ua(e, t, n);
    }
    throw Error(u(156, t.tag));
  };
  function Ua(e, t) {
    return vu(e, t);
  }
  function pd(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function at(e, t, n, r) {
    return new pd(e, t, n, r);
  }
  function Ri(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function md(e) {
    if (typeof e == "function") return Ri(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === me) return 11;
      if (e === Ee) return 14;
    }
    return 2;
  }
  function Yt(e, t) {
    var n = e.alternate;
    return n === null ? (n = at(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Pl(e, t, n, r, l, o) {
    var i = 2;
    if (r = e, typeof e == "function") Ri(e) && (i = 1);
    else if (typeof e == "string") i = 5;
    else e: switch (e) {
      case ve:
        return an(n.children, l, o, t);
      case Le:
        i = 8, l |= 8;
        break;
      case Qe:
        return e = at(12, n, t, l | 2), e.elementType = Qe, e.lanes = o, e;
      case Ne:
        return e = at(13, n, t, l), e.elementType = Ne, e.lanes = o, e;
      case He:
        return e = at(19, n, t, l), e.elementType = He, e.lanes = o, e;
      case ie:
        return Nl(n, l, o, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case ge:
            i = 10;
            break e;
          case F:
            i = 9;
            break e;
          case me:
            i = 11;
            break e;
          case Ee:
            i = 14;
            break e;
          case Oe:
            i = 16, r = null;
            break e;
        }
        throw Error(u(130, e == null ? e : typeof e, ""));
    }
    return t = at(i, n, t, l), t.elementType = e, t.type = r, t.lanes = o, t;
  }
  function an(e, t, n, r) {
    return e = at(7, e, r, t), e.lanes = n, e;
  }
  function Nl(e, t, n, r) {
    return e = at(22, e, r, t), e.elementType = ie, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Li(e, t, n) {
    return e = at(6, e, null, t), e.lanes = n, e;
  }
  function Ii(e, t, n) {
    return t = at(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function hd(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = no(0), this.expirationTimes = no(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = no(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Ti(e, t, n, r, l, o, i, a, c) {
    return e = new hd(e, t, n, a, c), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = at(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Ho(o), e;
  }
  function yd(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: re, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Fa(e) {
    if (!e) return Ft;
    e = e._reactInternals;
    e: {
      if (Xt(e) !== e || e.tag !== 1) throw Error(u(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (Ye(t.type)) {
              t = t.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        t = t.return;
      } while (t !== null);
      throw Error(u(171));
    }
    if (e.tag === 1) {
      var n = e.type;
      if (Ye(n)) return ps(e, n, t);
    }
    return t;
  }
  function Va(e, t, n, r, l, o, i, a, c) {
    return e = Ti(n, r, !0, e, l, o, i, a, c), e.context = Fa(null), n = e.current, r = Ke(), l = Kt(n), o = Nt(r, l), o.callback = t ?? null, Bt(n, o, l), e.current.lanes = l, Qn(e, l, r), Je(e, r), e;
  }
  function Rl(e, t, n, r) {
    var l = t.current, o = Ke(), i = Kt(l);
    return n = Fa(n), t.context === null ? t.context = n : t.pendingContext = n, t = Nt(o, i), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Bt(l, t, i), e !== null && (yt(e, l, i, o), ol(e, l, i)), i;
  }
  function Ll(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Wa(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Oi(e, t) {
    Wa(e, t), (e = e.alternate) && Wa(e, t);
  }
  function vd() {
    return null;
  }
  var Ba = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function ji(e) {
    this._internalRoot = e;
  }
  Il.prototype.render = ji.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(u(409));
    Rl(e, t, null, null);
  }, Il.prototype.unmount = ji.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      on(function() {
        Rl(null, e, null, null);
      }), t[_t] = null;
    }
  };
  function Il(e) {
    this._internalRoot = e;
  }
  Il.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = xu();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < zt.length && t !== 0 && t < zt[n].priority; n++) ;
      zt.splice(n, 0, e), n === 0 && Ru(e);
    }
  };
  function zi(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Tl(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function Qa() {
  }
  function gd(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var o = r;
        r = function() {
          var v = Ll(i);
          o.call(v);
        };
      }
      var i = Va(t, r, e, 0, null, !1, !1, "", Qa);
      return e._reactRootContainer = i, e[_t] = i.current, rr(e.nodeType === 8 ? e.parentNode : e), on(), i;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var a = r;
      r = function() {
        var v = Ll(c);
        a.call(v);
      };
    }
    var c = Ti(e, 0, !1, null, null, !1, !1, "", Qa);
    return e._reactRootContainer = c, e[_t] = c.current, rr(e.nodeType === 8 ? e.parentNode : e), on(function() {
      Rl(t, c, n, r);
    }), c;
  }
  function Ol(e, t, n, r, l) {
    var o = n._reactRootContainer;
    if (o) {
      var i = o;
      if (typeof l == "function") {
        var a = l;
        l = function() {
          var c = Ll(i);
          a.call(c);
        };
      }
      Rl(t, i, e, l);
    } else i = gd(n, t, e, l, r);
    return Ll(i);
  }
  Eu = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Bn(t.pendingLanes);
          n !== 0 && (ro(t, n | 1), Je(t, xe()), (oe & 6) === 0 && (zn = xe() + 500, Vt()));
        }
        break;
      case 13:
        on(function() {
          var r = Pt(e, 1);
          if (r !== null) {
            var l = Ke();
            yt(r, e, 1, l);
          }
        }), Oi(e, 1);
    }
  }, lo = function(e) {
    if (e.tag === 13) {
      var t = Pt(e, 134217728);
      if (t !== null) {
        var n = Ke();
        yt(t, e, 134217728, n);
      }
      Oi(e, 134217728);
    }
  }, Cu = function(e) {
    if (e.tag === 13) {
      var t = Kt(e), n = Pt(e, t);
      if (n !== null) {
        var r = Ke();
        yt(n, e, t, r);
      }
      Oi(e, t);
    }
  }, xu = function() {
    return fe;
  }, Pu = function(e, t) {
    var n = fe;
    try {
      return fe = e, t();
    } finally {
      fe = n;
    }
  }, Xl = function(e, t, n) {
    switch (t) {
      case "input":
        if (Bl(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = Gr(r);
              if (!l) throw Error(u(90));
              Xi(r), Bl(r, l);
            }
          }
        }
        break;
      case "textarea":
        tu(e, n);
        break;
      case "select":
        t = n.value, t != null && fn(e, !!n.multiple, t, !1);
    }
  }, cu = xi, fu = on;
  var wd = { usingClientEntryPoint: !1, Events: [ir, kn, Gr, su, au, xi] }, Sr = { findFiberByHostInstance: Jt, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Sd = { bundleType: Sr.bundleType, version: Sr.version, rendererPackageName: Sr.rendererPackageName, rendererConfig: Sr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: le.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = hu(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: Sr.findFiberByHostInstance || vd, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var jl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!jl.isDisabled && jl.supportsFiber) try {
      Ir = jl.inject(Sd), vt = jl;
    } catch {
    }
  }
  return Ze.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = wd, Ze.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!zi(t)) throw Error(u(200));
    return yd(e, t, null, n);
  }, Ze.createRoot = function(e, t) {
    if (!zi(e)) throw Error(u(299));
    var n = !1, r = "", l = Ba;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Ti(e, 1, !1, null, null, n, !1, r, l), e[_t] = t.current, rr(e.nodeType === 8 ? e.parentNode : e), new ji(t);
  }, Ze.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(u(188)) : (e = Object.keys(e).join(","), Error(u(268, e)));
    return e = hu(t), e = e === null ? null : e.stateNode, e;
  }, Ze.flushSync = function(e) {
    return on(e);
  }, Ze.hydrate = function(e, t, n) {
    if (!Tl(t)) throw Error(u(200));
    return Ol(null, e, t, !0, n);
  }, Ze.hydrateRoot = function(e, t, n) {
    if (!zi(e)) throw Error(u(405));
    var r = n != null && n.hydratedSources || null, l = !1, o = "", i = Ba;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onRecoverableError !== void 0 && (i = n.onRecoverableError)), t = Va(t, null, e, 1, n ?? null, l, !1, o, i), e[_t] = t.current, rr(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new Il(t);
  }, Ze.render = function(e, t, n) {
    if (!Tl(t)) throw Error(u(200));
    return Ol(null, e, t, !1, n);
  }, Ze.unmountComponentAtNode = function(e) {
    if (!Tl(e)) throw Error(u(40));
    return e._reactRootContainer ? (on(function() {
      Ol(null, null, e, !1, function() {
        e._reactRootContainer = null, e[_t] = null;
      });
    }), !0) : !1;
  }, Ze.unstable_batchedUpdates = xi, Ze.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Tl(n)) throw Error(u(200));
    if (e == null || e._reactInternals === void 0) throw Error(u(38));
    return Ol(e, t, n, !1, r);
  }, Ze.version = "18.3.1-next-f1338f8080-20240426", Ze;
}
var Ja;
function Rd() {
  if (Ja) return Mi.exports;
  Ja = 1;
  function s() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s);
      } catch (f) {
        console.error(f);
      }
  }
  return s(), Mi.exports = /* @__PURE__ */ Nd(), Mi.exports;
}
var Za;
function Ld() {
  if (Za) return zl;
  Za = 1;
  var s = /* @__PURE__ */ Rd();
  return zl.createRoot = s.createRoot, zl.hydrateRoot = s.hydrateRoot, zl;
}
var Id = /* @__PURE__ */ Ld(), Ae = /* @__PURE__ */ Gi();
const Dl = /* @__PURE__ */ yc(Ae), ba = (s) => {
  let f;
  const u = /* @__PURE__ */ new Set(), y = (x, D) => {
    const k = typeof x == "function" ? x(f) : x;
    if (!Object.is(k, f)) {
      const B = f;
      f = D ?? (typeof k != "object" || k === null) ? k : Object.assign({}, f, k), u.forEach((X) => X(f, B));
    }
  }, w = () => f, T = { setState: y, getState: w, getInitialState: () => I, subscribe: (x) => (u.add(x), () => u.delete(x)) }, I = f = s(y, w, T);
  return T;
}, Td = ((s) => s ? ba(s) : ba), Od = (s) => s;
function jd(s, f = Od) {
  const u = Dl.useSyncExternalStore(
    s.subscribe,
    Dl.useCallback(() => f(s.getState()), [s, f]),
    Dl.useCallback(() => f(s.getInitialState()), [s, f])
  );
  return Dl.useDebugValue(u), u;
}
const ec = (s) => {
  const f = Td(s), u = (y) => jd(f, y);
  return Object.assign(u, f), u;
}, zd = ((s) => s ? ec(s) : ec);
function Dd() {
  const s = new URLSearchParams(window.location.search), f = {};
  for (const [u, y] of s)
    u.includes(".") && (f[u] = y);
  return f;
}
function Ad(s) {
  const f = new URL(window.location.href);
  for (const u of [...f.searchParams.keys()])
    u.includes(".") && f.searchParams.delete(u);
  for (const [u, y] of Object.entries(s))
    y && f.searchParams.set(u, y);
  window.history.replaceState(null, "", f.toString());
}
function Md(s) {
  let f = typeof window < "u" && window.Shopify?.routes?.root || s || "/";
  return f.endsWith("/") || (f += "/"), f + "cart/add.js";
}
async function Ud(s, f) {
  const u = Md(s), y = await fetch(u, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ items: f })
  });
  let w = null;
  try {
    w = await y.json();
  } catch {
  }
  if (!y.ok) {
    const E = w?.description || w?.message || `Add to cart failed (HTTP ${y.status})`, S = new Error(E);
    throw S.status = y.status, S.payload = w, S;
  }
  return w;
}
function Fd(s) {
  if (typeof document > "u") return;
  const f = s || null;
  document.dispatchEvent(
    new CustomEvent("cart:refresh", { bubbles: !0, detail: f })
  ), document.dispatchEvent(
    new CustomEvent("cart:added", { bubbles: !0, detail: f })
  ), document.dispatchEvent(
    new CustomEvent("cart:open", { bubbles: !0, detail: f })
  ), typeof window < "u" && typeof window.dispatchEvent == "function" && window.dispatchEvent(new CustomEvent("cart:updated", { detail: f }));
}
const vc = "_bundle_id", gc = "_bundle_role", Vd = { label: "STOOL OPTION" }, Wd = "YES", Bd = {
  id: "[Character]NRUS_DOSEME_SERI_DUVAR",
  label: "GROUP OF INTERIOR WALLS"
}, Qd = {
  id: "[Character]NRUS_DOSEME_RENK_DUVAR",
  label: "COLOUR OF INTERIOR WALLS"
}, wc = "Upholstery Material", Sc = "Upholstery Color";
function It(s) {
  return String(s ?? "").trim().replace(/\s+/g, " ").toUpperCase();
}
function tc(s) {
  return It(s).split(" - ")[0];
}
function Vi(s, { id: f, label: u }) {
  return f && s.find((y) => y.id === f) || s.find((y) => It(y.label) === It(u)) || null;
}
function Wi(s) {
  if (!s || s.currentValue == null || s.currentValue === "") return "";
  const f = (s.options || []).find((u) => u.value === s.currentValue);
  return String(f?.label ?? s.currentValue);
}
function nc(s, f, u, y, w, E) {
  return s.find(
    (S) => E(S.options?.[f], y) && E(S.options?.[u], w)
  );
}
function Hd({ stool: s, properties: f }) {
  if (!s || !Array.isArray(s.variants) || s.variants.length === 0 || It(Wi(Vi(f, Vd))) !== Wd)
    return null;
  const u = Wi(Vi(f, Bd)), y = Wi(Vi(f, Qd));
  if (!u || !y)
    return {
      error: "Please select the interior wall group and colour for the included stool."
    };
  const w = (s.options || []).map(It), E = w.indexOf(It(wc)), S = w.indexOf(It(Sc));
  if (E === -1 || S === -1)
    return { error: "The included stool product is not set up correctly." };
  const T = nc(s.variants, E, S, u, y, (I, x) => It(I) === It(x)) || nc(s.variants, E, S, u, y, (I, x) => tc(I) === tc(x));
  return T ? {
    variantId: Number(T.id),
    material: T.options[E],
    color: T.options[S]
  } : {
    error: `No matching stool found for ${u} / ${y}. Please contact us.`
  };
}
function $d() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function Kd({ stoolLine: s, includedWith: f, currency: u, bundleId: y }) {
  return {
    [wc]: s.material,
    [Sc]: s.color,
    "Included with": f,
    _Configuration_Price: "0",
    _currency: u || "EUR",
    [vc]: y,
    [gc]: "child"
  };
}
const Yi = "calma_preorder_intent";
function qd() {
  if (typeof window > "u") return null;
  if (window.CalmaPreorderIntent && typeof window.CalmaPreorderIntent.get == "function")
    try {
      return window.CalmaPreorderIntent.get();
    } catch {
    }
  try {
    const s = window.localStorage?.getItem(Yi);
    if (!s) return null;
    const f = JSON.parse(s);
    return !f || typeof f.expiresAt != "number" || Date.now() > f.expiresAt ? (window.localStorage.removeItem(Yi), null) : f;
  } catch {
    return null;
  }
}
function Yd() {
  if (!(typeof window > "u")) {
    if (window.CalmaPreorderIntent && typeof window.CalmaPreorderIntent.clear == "function")
      try {
        window.CalmaPreorderIntent.clear();
        return;
      } catch {
      }
    try {
      window.localStorage?.removeItem(Yi);
    } catch {
    }
  }
}
function Gd() {
  if (typeof window > "u") return null;
  if (window.SHOPIFY_CUSTOMER_ID) return String(window.SHOPIFY_CUSTOMER_ID);
  const s = window.ShopifyAnalytics?.meta?.page?.customerId;
  return s != null ? String(s) : null;
}
const Xd = "/apps/b2b-portal/preorder/add-line";
async function Jd(s) {
  const f = await fetch(Xd, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(s)
  });
  let u = null;
  try {
    u = await f.json();
  } catch {
  }
  return u || {
    error: `Preorder add-line failed (HTTP ${f.status})`
  };
}
let cn = null, Ul = null, Bi = /* @__PURE__ */ new Map(), Er = "";
function Fl(s) {
  const f = (s || "").toUpperCase();
  return f.includes("DUVAR") ? "WALL" : f.includes("MASA") ? "TABLE" : f.includes("HALI") ? "FLOOR" : f.includes("TAVAN") || f.includes("SPRINKLER") ? "CEILING" : f.includes("MONITOR") || f.includes("EKRAN") || f.includes("SCREEN") ? "SCREEN MOUNT" : "GENERAL";
}
const Vl = [
  "GENERAL",
  "WALL",
  "TABLE",
  "SCREEN MOUNT",
  "CEILING",
  "FLOOR"
], Zd = [
  "[Character]NRUS_DOSEME_SERI_DUVAR",
  "[Character]NRUS_DOSEME_RENK_DUVAR",
  "[Character]NRUS_YUZEY_RENK_DUVAR",
  "[Character]NRUS_KECE_RENK_DUVAR",
  "[Character]NRUS_YUZEY_RENK_MASA",
  "[Character]NRUS_HALI_RENK",
  "[Character]NRUS_KOLTUK",
  "[Character]NRUS_PRIZ_TIPI",
  "[Character]NRUS_MEDIAWALL"
], bd = /* @__PURE__ */ new Set([
  "[Character]NRUS_Meta_Dimension",
  "[Character]NRUS_GGRACHAIR"
]), kc = [
  {
    id: "[Character]NRUS_GGRACHAIR",
    propLabel: "STOOL OPTION",
    value: "chair_no",
    displayLabel: "NO"
  }
];
async function rc(s) {
  if (!Array.isArray(s)) return [];
  const f = s.filter(
    (E) => E.visible !== !1 && E.editable !== !1 && E.choiceList && !bd.has(E.key)
  ), u = await Promise.all(
    f.map(
      (E) => typeof E.getChoices == "function" ? E.getChoices().catch(() => []) : Promise.resolve([])
    )
  ), y = f.map((E, S) => {
    const T = u[S] || [], I = typeof E.getValue == "function" ? E.getValue() : null;
    return {
      id: E.key,
      label: E.name,
      type: T.some((x) => x.largeIcon || x.smallIcon) ? "color" : "text",
      editable: !0,
      currentValue: I?.value ?? null,
      options: T.map((x) => ({
        value: x.value,
        label: x.text,
        // Swatch UI'da ~40–96px gösterildiği için önce küçük ikonu tercih
        // ediyoruz; largeIcon (bazen ~1MB) yalnızca smallIcon yoksa fallback.
        // İkonlar WCF choiceList'inden her oturumda taze geldiği için pCon
        // tarafındaki değişiklikler kullanıcıya anında yansımaya devam eder.
        icon: x.smallIcon || x.largeIcon || null,
        available: x.selectable !== !1
      }))
    };
  }), w = new Map(Zd.map((E, S) => [E, S]));
  return y.sort((E, S) => {
    const T = w.has(E.id) ? w.get(E.id) : 1 / 0, I = w.has(S.id) ? w.get(S.id) : 1 / 0;
    return T !== I ? T - I : 0;
  });
}
async function Qi(s) {
  if (!s) return { price: null, currency: "EUR" };
  const f = typeof s.getMainArticle == "function" ? s.getMainArticle() ?? s : s;
  try {
    if (typeof f.getCompositeCalculation == "function") {
      const u = await f.getCompositeCalculation(), y = u?.grossPrice ?? u?.netPrice ?? u?.salesPrice;
      if (y?.value != null)
        return {
          price: y.value,
          currency: y.currency || "EUR"
        };
    }
  } catch (u) {
    console.warn("[wcf] getCompositeCalculation failed (falling back to getItemProperties):", u?.message || u);
  }
  try {
    if (typeof f.getItemProperties == "function") {
      const y = (await f.getItemProperties?.())?.article;
      if (y?.salesPrice != null)
        return {
          price: y.salesPrice,
          currency: y.salesCurrency || "EUR"
        };
    }
  } catch (u) {
    console.warn("[wcf] getItemProperties failed:", u?.message || u);
  }
  return console.warn("[wcf] price could not be determined — both methods failed"), { price: null, currency: "EUR" };
}
const lc = 15e3;
async function oc() {
  if (Er) return Er;
  const s = Ul, f = cn;
  if (!s || typeof s.exportObx != "function" || !f)
    return console.warn("[wcf] exportObx skipped — article/manager not ready"), "";
  const u = typeof f.getMainArticle == "function" ? f.getMainArticle() ?? f : f;
  let y;
  try {
    const w = await Promise.race([
      s.exportObx([u]),
      new Promise((E, S) => {
        y = setTimeout(
          () => S(new Error(`exportObx timed out after ${lc}ms`)),
          lc
        );
      })
    ]);
    return typeof w != "string" || !w ? (console.warn("[wcf] exportObx returned no url:", w), "") : (Er = w, console.log("[wcf] exportObx ok:", w), w);
  } catch (w) {
    return console.warn("[wcf] exportObx failed:", w?.message || w), "";
  } finally {
    clearTimeout(y);
  }
}
async function ic(s) {
  if (!Array.isArray(s)) return [];
  const f = await Promise.all(
    s.map(
      (u) => u.choiceList && typeof u.getChoices == "function" ? u.getChoices().catch(() => []) : Promise.resolve([])
    )
  );
  return s.map((u, y) => {
    const w = f[y] || [], E = typeof u.getValue == "function" ? u.getValue() : null;
    return {
      id: u.key,
      label: u.name,
      type: w.some((S) => S.largeIcon || S.smallIcon) ? "color" : "text",
      editable: !!u.editable,
      currentValue: E?.value ?? null,
      options: w.map((S) => ({
        value: S.value,
        label: S.text,
        icon: S.smallIcon || S.largeIcon || null,
        available: S.selectable !== !1
      }))
    };
  });
}
function uc(s) {
  return Array.isArray(s) ? s.map((f) => ({
    key: f.key,
    name: f.name,
    visible: !!f.visible,
    editable: !!f.editable,
    hasChoiceList: !!f.choiceList,
    value: typeof f.getValue == "function" ? f.getValue()?.value ?? null : null
  })) : [];
}
function Al(s) {
  return s.map((f) => ({
    ...f,
    options: f.options?.map((u) => ({
      ...u,
      icon: typeof u.icon == "string" && u.icon.length > 100 ? `[icon omitted, ${u.icon.length} chars]` : u.icon
    }))
  }));
}
function sc({
  properties: s,
  price: f,
  currency: u,
  articleNumber: y,
  manufacturerId: w,
  safeQuantity: E,
  rawSnapshot: S = [],
  variantId: T = null,
  obxUrl: I = ""
}) {
  const x = /* @__PURE__ */ new Map(), D = [];
  for (const z of s) {
    if (z.currentValue == null || z.currentValue === "") continue;
    const J = Fl(z.id);
    x.has(J) || x.set(J, []);
    const O = (z.options || []).find(
      (le) => le.value === z.currentValue
    )?.label || String(z.currentValue);
    x.get(J).push({ label: z.label, selectedLabel: O }), D.push(O);
  }
  const k = /* @__PURE__ */ new Set();
  for (const z of x.values())
    for (const J of z) k.add(J.label);
  for (const z of kc) {
    if (k.has(z.propLabel)) continue;
    const J = Fl(z.id);
    x.has(J) || x.set(J, []), x.get(J).push({
      label: z.propLabel,
      selectedLabel: z.displayLabel
    }), D.push(z.displayLabel);
  }
  const B = [
    ...Vl.filter((z) => x.has(z)),
    ...[...x.keys()].filter((z) => !Vl.includes(z))
  ], X = {};
  let Z = 1;
  for (const z of B) {
    const J = x.get(z);
    if (!(!J || J.length === 0)) {
      X[`divider ${Z}`] = z, Z++;
      for (const { label: se, selectedLabel: O } of J)
        X[se] = O;
    }
  }
  const R = [
    y,
    w || null,
    ...D.slice(0, 2)
  ].filter(Boolean).join(" / ");
  return {
    _description: R,
    /*  _quantity: String(safeQuantity), */
    /* _unit: "ST", */
    _Configuration_Price: f != null ? String(f) : "",
    _currency: u || "EUR",
    _vendormat: y || "",
    _Configuration: R,
    /* _cust_field1: "",
    _cust_field2: "",
    _cust_field3: "",
    _cust_field4: "",
    _cust_field5: "", */
    /*  _ext_quote_id: "",
     _service: "",
     _leadtime: "",
     _ext_quote_item: "",
     _contract_item: "",
     _manufactcode: manufacturerId || "",
     _manufactmat: "", */
    _ext_product_id: y || "",
    // EAIWS'in ürettiği OBX dosyasının geçici URL'i — konfigürasyonun tam
    // (XML) hali. Export başarısızsa boş string gider; alan her zaman payload'da
    // bulunur ki tüketen taraf key'in varlığına güvenebilsin.
    // "_" prefix'i zorunlu: Shopify `_`-ile başlayan line item property'lerini
    // sepet/checkout/e-posta yüzeylerinde göstermez; `_pcon_full` ile aynı
    // şekilde dealer/CSR gösterim filtrelerinden de gizli kalır.
    _obxURL: I || "",
    /* _matgroup: "",
    _vendor: "",
    _contract: "",
    _priceunit: "1",
    _attachment: "",
    _attachment_purpose: "C",
    _item_type: "R",
    _parent_id: "",
    _article_image: "",
    _eco: "0",
    _eco_info: "Gross Eco Contribution",
    _obx_url: "",
    _oci_plugin: "true",
    _priceservice: "false",
    _reopen_url: "",
    _taxcode: "",
    _vat: "", */
    /* _ean: articleNumber || "",
    _basket_id: "",
    _seriesid: "",
    _additional_text: "",
    _special_model_info: "", */
    // ── Tam pCon ham verisi (Axapta entegrasyonu için) ─────────────────────
    // "_" ile başladığı için tüm dealer/CSR gösterim yüzeylerinden gizlidir
    // (groupProperties / quoteVisibleProps / dealer-portal hepsi `_`-prefix
    // filtreler). Yalnızca draft order customAttributes'a taşınır ve "Approve
    // for Production" anında Axapta'ya JSON olarak gönderilir. Görünür
    // konfigürasyon (divider/label çiftleri) bundan bağımsız, aynen korunur.
    _pcon_full: JSON.stringify({
      articleNumber: y || "",
      manufacturerId: w || "",
      price: f ?? null,
      currency: u || "EUR",
      quantity: E,
      variantId: T != null ? String(T) : "",
      properties: Array.isArray(S) ? S : []
    }),
    // WCF konfigürasyon property'leri — "divider N" + "Label: değer" çiftleri
    ...X
  };
}
function Hi(s) {
  if (s == null) return "";
  const u = String(s).match(/(\d+)\s*$/);
  return u ? u[1] : "";
}
function Ml(s) {
  const f = {};
  for (const u of s)
    u.currentValue && (f[u.id] = u.currentValue);
  Ad(f);
}
const ne = zd((s, f) => ({
  // ── Config (initialize() tarafından set edilir) ──────────────────────────
  proxyBase: "",
  gatekeeperId: "",
  // Giriş yapmış müşterinin region tag'inden türetilir (Liquid). Boş →
  // gatekeeper proxy'si UK/default'a düşer.
  region: "",
  articleNumber: "",
  manufacturerId: "",
  currency: "TRY",
  customIcons: {},
  variantId: null,
  routesRoot: "/",
  addToCartLabel: "Add to Cart",
  successAction: "drawer-event",
  // null → metafield yok veya customer login değil → discount gösterilmez
  discountPercentage: null,
  productTitle: "",
  productImageUrl: "",
  productSku: "",
  customerName: "",
  // App bloğunun "Stool product" ayarı: { title, options, variants } | null
  stool: null,
  // ── UI State ─────────────────────────────────────────────────────────────
  loading: !1,
  updating: !1,
  error: null,
  properties: [],
  // pCon ham property snapshot'ı (tüm gizli alanlar dahil) — _pcon_full için
  rawSnapshot: [],
  price: null,
  // ── Cart State ────────────────────────────────────────────────────────────
  // null = henüz hazır değil (buton disabled), {} = WCF article yüklendi (hazır)
  cartProperties: null,
  quantity: 1,
  cartLoading: !1,
  cartError: null,
  cartSuccess: !1,
  // ── Quote List State (window.CalmaQuoteList — mağaza tarafı API) ──────────
  // quoteLoading: addItem çağrısı sırasında butonu kilitler
  // quoteSuccess: kısa "Teklif listesine eklendi" geri bildirimi
  // quoteError  : API yoksa / hata olursa kullanıcıya gösterilir
  quoteLoading: !1,
  quoteError: null,
  quoteSuccess: !1,
  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: initialize — App.jsx'ten config alınır, ConfiguratorScene
  // tetiklenir (loading: true seti). Asıl WCF başlatma ConfiguratorScene'de.
  // ────────────────────────────────────────────────────────────────────────
  initialize(u) {
    s({
      proxyBase: u.proxyBase,
      gatekeeperId: u.gatekeeperId || "",
      region: u.region || "",
      articleNumber: u.articleNumber,
      manufacturerId: u.manufacturerId,
      currency: u.currency,
      customIcons: u.customIcons || {},
      variantId: u.variantId || null,
      routesRoot: u.routesRoot || "/",
      addToCartLabel: u.addToCartLabel || "Add to Cart",
      successAction: u.successAction || "drawer-event",
      discountPercentage: u.discountPercentage ?? null,
      productTitle: u.productTitle || "",
      productImageUrl: u.productImageUrl || "",
      productSku: u.productSku || "",
      customerName: u.customerName || "",
      stool: u.stool || null,
      loading: !0,
      error: null,
      properties: [],
      rawSnapshot: [],
      price: null,
      cartProperties: null
    });
  },
  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: refreshWcfPrice — eventArticleChanged listener ve dışarıdan
  // fiyat yenilenmesi için. Mevcut price null ise veya pricing procedure
  // hazır olduğunda tekrar çağrılır.
  // ────────────────────────────────────────────────────────────────────────
  async refreshWcfPrice() {
    if (cn)
      try {
        const u = await Qi(cn);
        u?.price != null && s({
          price: u.price,
          currency: u.currency || f().currency
        });
      } catch (u) {
        console.warn("[store] refreshWcfPrice failed:", u?.message || u);
      }
  },
  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: setWcfReady — ConfiguratorScene WCF yüklemeyi tamamladığında
  // çağırır; article ve propMap module-level değişkenlere yazılmış olmalı.
  // ────────────────────────────────────────────────────────────────────────
  async setWcfReady(u, y, w) {
    cn = u, Ul = y, Bi = new Map(w.map((k) => [k.key, k])), Er = "";
    const E = await Qi(u).catch(() => ({
      price: null,
      currency: "EUR"
    })), S = await rc(w).catch(() => []), T = f().customIcons, I = ac(S, T);
    console.group("[pCon] Properties — raw (WCF)"), console.log("rawProps count:", w.length), console.table(
      w.map((k) => ({
        key: k.key,
        name: k.name,
        visible: k.visible,
        editable: k.editable,
        hasChoiceList: !!k.choiceList,
        value: typeof k.getValue == "function" ? k.getValue()?.value : "(n/a)"
      }))
    );
    const x = await ic(w).catch(() => []);
    console.log(
      "[pCon] Full raw properties (JSON):",
      JSON.stringify(Al(x), null, 2)
    ), console.groupEnd(), console.group("[pCon] Properties — mapped (store)"), console.log("mapped count:", I.length), console.table(
      I.map((k) => ({
        id: k.id,
        label: k.label,
        type: k.type,
        currentValue: k.currentValue,
        optionCount: k.options?.length ?? 0
      }))
    ), console.log(
      "[pCon] Full mapped properties (JSON):",
      JSON.stringify(Al(I), null, 2)
    ), console.groupEnd(), s({
      properties: I,
      rawSnapshot: uc(w),
      price: E.price,
      currency: E.currency || f().currency,
      cartProperties: {},
      // signal: WCF article hazır → cart butonu açılır
      loading: !1
    });
    const D = Dd();
    if (Object.keys(D).length > 0)
      for (const [k, B] of Object.entries(D)) {
        const X = I.find((Z) => Z.id === k);
        X && X.currentValue !== B && f().updateProperty(k, B).catch((Z) => console.warn("[store] URL prop apply failed:", Z.message));
      }
    else
      Ml(I);
  },
  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: setWcfError — ConfiguratorScene hata durumunda çağırır.
  // ────────────────────────────────────────────────────────────────────────
  setWcfError(u) {
    s({ error: u?.message || String(u), loading: !1 });
  },
  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: updateProperty
  //
  // setValue() EAIWS sunucusunu günceller; BabylonJS sahne güncellemesi ise
  // eventArticleChanged ateşlenince tamamlanır.
  //
  // Race-condition fix: her iki koşul da gerçekleşene kadar bekle:
  //   1. setValue() promise'i resolve (EAIWS onayı)
  //   2. eventArticleChanged event'i (sahne güncellemesi tamamlandı)
  // Her ikisi birleşince getProperties() çağrılır → UI + sahne senkron.
  // ────────────────────────────────────────────────────────────────────────
  async updateProperty(u, y) {
    const w = Bi.get(u);
    if (!w || typeof w.setValue != "function") {
      console.warn("[store] updateProperty: prop not found in propMap:", u);
      return;
    }
    const { properties: E, customIcons: S } = f();
    Er = "";
    const T = E.map(
      (I) => I.id === u ? { ...I, currentValue: y } : I
    );
    s({ properties: T, updating: !0, error: null }), Ml(T);
    try {
      const I = Ul?.eventArticleChanged, x = I && typeof I.addListener == "function";
      if (await new Promise((R, z) => {
        let J = !1, se = !x, O = !1;
        const le = setTimeout(() => {
          O || (O = !0, x && I.removeListener(re), console.warn("[store] updateProperty: eventArticleChanged timeout, proceeding"), R());
        }, 1e4);
        function ae() {
          O || !J || !se || (O = !0, clearTimeout(le), R());
        }
        function re() {
          I.removeListener(re), se = !0, ae();
        }
        x && I.addListener(re), w.setValue(y).then(() => {
          J = !0, ae();
        }).catch((ve) => {
          O || (O = !0, clearTimeout(le), x && I.removeListener(re), z(ve));
        });
      }), !cn) throw new Error("WCF article ref lost");
      const [D, k] = await Promise.all([
        cn.getProperties(),
        Qi(cn)
      ]);
      Bi = new Map(D.map((R) => [R.key, R])), console.group(`[pCon] updateProperty(${u} = ${JSON.stringify(y)}) — pCon'dan gelen ham veri`), console.log("rawProps count:", D.length), console.table(
        D.map((R) => ({
          key: R.key,
          name: R.name,
          visible: R.visible,
          editable: R.editable,
          hasChoiceList: !!R.choiceList,
          value: typeof R.getValue == "function" ? R.getValue()?.value : "(n/a)"
        }))
      );
      const B = await ic(D).catch(() => []);
      console.log(
        "[pCon] updateProperty — Full raw properties (JSON, değişmemiş pCon verisi):",
        JSON.stringify(Al(B), null, 2)
      ), console.log("[pCon] updateProperty — Fiyat (pCon'dan gelen, önceki → yeni):", {
        previousPrice: f().price,
        previousCurrency: f().currency,
        newPrice: k.price,
        newCurrency: k.currency
      }), console.groupEnd();
      const X = await rc(D), Z = ac(X, S);
      console.group(`[pCon] updateProperty(${u}) — ekrana basılacak mapped veri`), console.log("mapped count:", Z.length), console.table(
        Z.map((R) => ({
          id: R.id,
          label: R.label,
          type: R.type,
          currentValue: R.currentValue,
          optionCount: R.options?.length ?? 0
        }))
      ), console.log(
        "[pCon] updateProperty — Full mapped properties (JSON):",
        JSON.stringify(Al(Z), null, 2)
      ), console.groupEnd(), s({
        properties: Z,
        rawSnapshot: uc(D),
        price: k.price,
        currency: k.currency || f().currency,
        updating: !1
      }), Ml(Z);
      try {
        Ul?.app?.viewer?.requestRenderFrame?.();
      } catch {
      }
    } catch (I) {
      console.warn("[store] updateProperty revert:", I?.message || I), Ml(E), s({ properties: E, updating: !1, error: I?.message || String(I) });
    }
  },
  // ─── No-op: WCF ile hover prefetch gerekmez (client-side, anında update) ─
  prefetchProperty() {
  },
  // ─── Cart actions ─────────────────────────────────────────────────────────
  setQuantity(u) {
    const y = parseInt(u, 10);
    s({ quantity: Number.isFinite(y) && y >= 1 ? y : 1 });
  },
  setVariantId(u) {
    if (!u) return;
    const y = f().variantId;
    String(y) !== String(u) && s({ variantId: String(u), cartError: null, cartSuccess: !1 });
  },
  resetCartFeedback() {
    s({ cartError: null, cartSuccess: !1 });
  },
  resetQuoteFeedback() {
    s({ quoteError: null, quoteSuccess: !1 });
  },
  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: addToQuoteList — ürünü mağazanın "Teklif Listesi" API'sine ekler.
  //
  // window.CalmaQuoteList.addItem(...) çağrılır. Gönderilen `properties` objesi
  // addToCart() ile BİREBİR aynıdır (buildShopifyProperties) — teklif draft
  // order'a dönüştüğünde _Configuration_Price / _currency buradan okunur.
  //
  // Sepete ekleme YAPILMAZ, yönlendirme YAPILMAZ. Mağazadaki sağ-alt rozet
  // sayacı kendi kendine güncellenir.
  // ────────────────────────────────────────────────────────────────────────
  async addToQuoteList() {
    const {
      properties: u,
      rawSnapshot: y,
      price: w,
      currency: E,
      articleNumber: S,
      manufacturerId: T,
      quantity: I,
      variantId: x,
      productTitle: D,
      productImageUrl: k,
      productSku: B,
      loading: X,
      updating: Z,
      cartProperties: R,
      quoteLoading: z
    } = f();
    if (z) return !1;
    if (X || Z)
      return s({ quoteError: "Configuration is still loading. Please wait." }), !1;
    if (!R)
      return s({ quoteError: "Configuration not ready. Please wait." }), !1;
    const J = typeof window < "u" ? window.CalmaQuoteList : null;
    if (!J || typeof J.addItem != "function")
      return s({
        quoteError: "Quote list is not available. Please make sure you are signed in as a dealer."
      }), !1;
    const se = Hi(x);
    if (!se)
      return s({
        quoteError: "Could not detect a product variant on this page. Please reload and try again."
      }), !1;
    s({ quoteLoading: !0, quoteError: null, quoteSuccess: !1 });
    const O = Math.max(1, parseInt(I, 10) || 1), le = await oc(), ae = sc({
      properties: u,
      price: w,
      currency: E,
      articleNumber: S,
      manufacturerId: T,
      safeQuantity: O,
      rawSnapshot: y,
      variantId: se,
      obxUrl: le
    });
    try {
      return J.addItem({
        variant_id: se,
        quantity: O,
        properties: ae,
        name: D || S || null,
        image: k || null,
        sku: B || S || null
      }), s({ quoteLoading: !1, quoteSuccess: !0 }), !0;
    } catch (re) {
      return console.error("[Configurator] addToQuoteList error:", re), s({
        quoteLoading: !1,
        quoteError: re?.message || "Failed to add to quote list."
      }), !1;
    }
  },
  /**
   * Cart-add akışı (iki dallı: normal ve preorder).
   *
   * Backend `/api/pcon/cart-payload` fresh OBX/attachment URL'leri üretir.
   * WCF ile itemId artık null — backend yeni EAIWS session açar ve current
   * property değerlerini uygular.
   */
  async addToCart(u = null) {
    const {
      properties: y,
      rawSnapshot: w,
      price: E,
      currency: S,
      articleNumber: T,
      manufacturerId: I,
      quantity: x,
      variantId: D,
      routesRoot: k,
      successAction: B,
      cartLoading: X,
      updating: Z,
      loading: R,
      cartProperties: z,
      stool: J,
      productTitle: se
    } = f();
    if (X) return !1;
    if (R || Z)
      return s({ cartError: "Configuration is still loading. Please wait." }), !1;
    if (!z)
      return s({ cartError: "Configuration not ready. Please wait." }), !1;
    if (!D)
      return s({
        cartError: "Could not detect a product variant on this page. Please reload and try again."
      }), !1;
    const O = Hd({ stool: J, properties: y });
    if (O?.error)
      return s({ cartError: O.error }), !1;
    s({ cartLoading: !0, cartError: null, cartSuccess: !1 });
    const le = Math.max(1, parseInt(x, 10) || 1), ae = await oc(), re = sc({
      properties: y,
      price: E,
      currency: S,
      articleNumber: T,
      manufacturerId: I,
      safeQuantity: le,
      rawSnapshot: w,
      variantId: Hi(D),
      obxUrl: ae
    }), ve = O ? $d() : null, Le = ve ? { ...re, [vc]: ve, [gc]: "parent" } : re, Qe = O ? Kd({
      stoolLine: O,
      includedWith: se || T,
      currency: S,
      bundleId: ve
    }) : null, ge = [
      {
        id: D,
        quantity: le,
        properties: Le
      }
    ];
    O && ge.push({
      id: O.variantId,
      quantity: le,
      parent_id: Number(Hi(D)),
      properties: Qe
    }), console.log("[cart] Shopify cart/add.js payload:", JSON.stringify({ items: ge }, null, 2));
    try {
      const F = qd();
      if (F) {
        const He = Gd();
        let Ee;
        try {
          Ee = await Jd({
            logged_in_customer_id: He,
            draftOrderId: F.draftOrderId,
            lines: ge.map((ie) => ({
              variantId: ie.id,
              quantity: ie.quantity,
              properties: ie.properties
            }))
          });
        } catch (ie) {
          return console.error("[Configurator] Preorder add-line error:", ie), window.alert("❌ Could not add to preorder. Please try again."), s({ cartLoading: !1 }), !1;
        }
        if (!Ee || Ee.error) {
          const ie = Ee?.error || "Unknown error";
          return window.alert("❌ Could not add to preorder: " + ie), s({ cartLoading: !1 }), !1;
        }
        const Oe = Ee.draftOrder?.name || F.draftOrderName || "preorder";
        return window.alert("✅ Product added to Preorder " + Oe), Yd(), s({ cartLoading: !1, cartSuccess: !0 }), window.location.href = "/pages/b2b-account#preorder-" + F.draftOrderId, !0;
      }
      const me = await Ud(k, ge);
      s({ cartLoading: !1, cartSuccess: !0 });
      const Ne = u ?? B;
      return Ne === "redirect" ? window.setTimeout(() => {
        window.location.href = (window.Shopify?.routes?.root || "/").replace(/\/$/, "") + "/cart";
      }, 0) : Ne === "reload" ? window.setTimeout(() => window.location.reload(), 0) : Ne !== "none" && Fd(me), !0;
    } catch (F) {
      return s({
        cartLoading: !1,
        cartError: F?.message || "Failed to add to cart"
      }), !1;
    }
  },
  setLoading(u) {
    s({ loading: u });
  },
  setError(u) {
    s({ error: u });
  },
  // ──────────────────────────────────────────────────────────────────────────
  // exportRequest — "Add to Request" butonu için Excel indirme aksiyonu.
  //
  // addToCart() ile aynı configDividers yapısını kullanır (fiyat hariç).
  // Gerçek cart-add yapılmaz; yalnızca xlsx dosyası oluşturulup indirilir.
  // ──────────────────────────────────────────────────────────────────────────
  async exportRequest() {
    const {
      properties: u,
      articleNumber: y,
      manufacturerId: w,
      quantity: E,
      productTitle: S,
      productImageUrl: T,
      customerName: I
    } = f(), x = Math.max(1, parseInt(E, 10) || 1), D = /* @__PURE__ */ new Map();
    for (const R of u) {
      if (R.currentValue == null || R.currentValue === "") continue;
      const z = Fl(R.id);
      D.has(z) || D.set(z, []);
      const se = (R.options || []).find(
        (O) => O.value === R.currentValue
      )?.label || String(R.currentValue);
      D.get(z).push({ label: R.label, selectedLabel: se });
    }
    const k = /* @__PURE__ */ new Set();
    for (const R of D.values())
      for (const z of R) k.add(z.label);
    for (const R of kc) {
      if (k.has(R.propLabel)) continue;
      const z = Fl(R.id);
      D.has(z) || D.set(z, []), D.get(z).push({
        label: R.propLabel,
        selectedLabel: R.displayLabel
      });
    }
    const B = [
      ...Vl.filter((R) => D.has(R)),
      ...[...D.keys()].filter((R) => !Vl.includes(R))
    ], X = {};
    let Z = 1;
    for (const R of B) {
      const z = D.get(R);
      if (!(!z || z.length === 0)) {
        X[`divider ${Z}`] = R, Z++;
        for (const { label: J, selectedLabel: se } of z)
          X[J] = se;
      }
    }
    try {
      const { exportToExcel: R } = await import("./pcon-chunk-excel-export-ClkFUrGS.js");
      await R({
        articleNumber: y,
        manufacturerId: w,
        productTitle: S,
        productImageUrl: T,
        quantity: x,
        customerName: I,
        configDividers: X
      });
    } catch (R) {
      console.error("[exportRequest] Excel export failed:", R), window.alert("Excel export failed: " + (R?.message || String(R)));
    }
  }
})), ep = /* @__PURE__ */ new Set(["OI_NONE_PROPCLASS.PRIZ_TIPI"]), tp = [
  { keys: ["german", "deutsch", "alman"], iconKey: "german" },
  { keys: ["multi", "universal", "coklu", "çoklu"], iconKey: "multi" },
  { keys: ["swiss", "schweiz", "isvicre", "isviçre"], iconKey: "swiss" },
  { keys: ["uk", "british", "britisch", "ingiliz"], iconKey: "uk" },
  { keys: ["us", "american", "amerikan", "amerika"], iconKey: "american" }
], np = "MT_TEXT.Meta_Dimension", rp = {
  m_100_140: {
    "MEDIAWALL.MEDIAWALL": {
      false: "withoutMediawall",
      true: "withMediawall"
    },
    "KOLTUK_4U.KOLTUK": {
      false: "forUWithoutSofa",
      true: "forUWithSofa"
    }
  },
  m_100_220: {
    "KOLTUK.KOLTUK": {
      false: "mediumLargeForAllWithoutSofa",
      true: "mediumLargeForAllWithSofa"
    }
  },
  m_144_220: {
    "KOLTUK_L.KOLTUK": {
      false: "mediumLargeForAllWithoutSofa",
      true: "mediumLargeForAllWithSofa"
    }
  },
  m_188_220ALL: {
    "MASA_FA.MASA": {
      false: "mediumLargeForAllWithoutSofa",
      true: "mediumLargeForAllWithSofa"
    }
  }
};
function ac(s, f) {
  if (!f || typeof f != "object") return s;
  let u = op(s, f.variantPicker);
  return u = ip(u, f.socket), u = up(u, f.contextual), u;
}
let _r = null, cc = null;
function lp(s) {
  if (cc === s && _r)
    return _r;
  if (cc = s, _r = /* @__PURE__ */ new Map(), s && typeof s == "object")
    for (const [f, u] of Object.entries(s))
      !f || !u || _r.set(_c(f), u);
  return _r;
}
function _c(s) {
  return String(s || "").toLowerCase().replace(/[\s_-]+/g, "");
}
function op(s, f) {
  const u = lp(f);
  return u.size === 0 ? s : s.map((y) => {
    let w = !1;
    const E = y.options.map((S) => {
      if (S.icon) return S;
      const T = u.get(_c(S.value));
      return T ? (w = !0, { ...S, icon: T }) : S;
    });
    return w ? { ...y, type: "color", options: E } : y;
  });
}
function ip(s, f) {
  return f ? s.map((u) => {
    if (!sp(u)) return u;
    const y = ap(u.options, f), w = y.some((E) => E.icon);
    return { ...u, type: w ? "color" : u.type, options: y };
  }) : s;
}
function up(s, f) {
  if (!f) return s;
  const y = s.find((E) => E.id === np)?.currentValue;
  if (!y) return s;
  const w = rp[y];
  return w ? s.map((E) => {
    const S = w[E.id];
    if (!S) return E;
    const T = E.options.map((x) => {
      const D = S[x.value], k = D ? f[D] : null;
      return k ? { ...x, icon: k } : x;
    }), I = T.some((x) => x.icon);
    return { ...E, type: I ? "color" : E.type, options: T };
  }) : s;
}
function sp(s) {
  return s ? ep.has(s.id) ? !0 : /steckdose|socket|priz/i.test(s.label || "") : !1;
}
function ap(s, f) {
  return !f || !Array.isArray(s) ? s : s.map((u) => {
    const y = cp(u, f);
    return y ? { ...u, icon: y } : u;
  });
}
function cp(s, f) {
  const u = `${s.value || ""} ${s.label || ""}`.toLowerCase();
  for (const { keys: y, iconKey: w } of tp)
    if (y.some((E) => u.includes(E)))
      return f[w] || null;
  return null;
}
function fp(s, f, u = !1) {
  const y = u ? 0 : 2;
  try {
    return new Intl.NumberFormat(void 0, {
      style: "currency",
      currency: f || "EUR",
      minimumFractionDigits: y,
      maximumFractionDigits: y
    }).format(s);
  } catch {
    return u ? `${Math.ceil(Number(s))} ${f || "EUR"}` : `${Number(s).toFixed(2)} ${f || "EUR"}`;
  }
}
function dp() {
  const s = ne((y) => y.price), f = ne((y) => y.currency);
  if (ne((y) => y.discountPercentage), s == null)
    return /* @__PURE__ */ N.jsxs("div", { className: "pcon-price pcon-price--pending", children: [
      /* @__PURE__ */ N.jsx("span", { className: "pcon-price__label", children: "List Price" }),
      /* @__PURE__ */ N.jsx("span", { className: "pcon-price__value pcon-price__value--pending", "aria-busy": "true", children: /* @__PURE__ */ N.jsx("span", { className: "pcon-price__skeleton" }) })
    ] });
  const u = fp(s, f);
  return /* @__PURE__ */ N.jsx("div", { className: "pcon-price-block", children: /* @__PURE__ */ N.jsxs("div", { className: "pcon-price", children: [
    /* @__PURE__ */ N.jsx("span", { className: "pcon-price__label", children: "List Price" }),
    /* @__PURE__ */ N.jsx("span", { className: "pcon-price__value", children: u })
  ] }) });
}
const fc = {
  "[Character]NRUS_DOSEME_RENK_DUVAR": "[Character]NRUS_DOSEME_SERI_DUVAR"
};
function pp() {
  const s = ne((x) => x.properties), f = ne((x) => x.updateProperty), [u, y] = Ae.useState(null), w = s.filter((x) => x.editable && x.options.length > 0);
  if (w.length === 0) return null;
  const E = new Set(Object.keys(fc)), S = w.filter((x) => !E.has(x.id)), T = {};
  for (const [x, D] of Object.entries(fc)) {
    const k = w.find((B) => B.id === x);
    k && (T[D] || (T[D] = []), T[D].push(k));
  }
  const I = (x) => {
    y((D) => D === x ? null : x);
  };
  return /* @__PURE__ */ N.jsx("div", { className: "pcon-properties", children: S.map((x) => /* @__PURE__ */ N.jsx(
    mp,
    {
      prop: x,
      open: u === x.id,
      onToggle: () => I(x.id),
      onSelect: (D) => f(x.id, D),
      childProps: T[x.id] || [],
      updateProperty: f
    },
    x.id
  )) });
}
function mp({
  prop: s,
  open: f,
  onToggle: u,
  onSelect: y,
  childProps: w = [],
  updateProperty: E
}) {
  const S = s.type === "color", T = s.options.find((k) => k.value === s.currentValue), I = (k) => {
    k.available && k.value !== s.currentValue && y(k.value);
  }, x = [
    "pcon-prop-group",
    f && "pcon-prop-group--open"
  ].filter(Boolean).join(" "), D = S ? "pcon-prop-group__body pcon-prop-group__body--colors" : "pcon-prop-group__body pcon-prop-group__body--chips";
  return /* @__PURE__ */ N.jsxs("div", { className: x, children: [
    /* @__PURE__ */ N.jsxs(
      "button",
      {
        type: "button",
        className: "pcon-prop-group__header",
        "aria-expanded": f,
        onClick: u,
        children: [
          /* @__PURE__ */ N.jsxs("span", { className: "pcon-prop-group__header-main", children: [
            /* @__PURE__ */ N.jsx("span", { className: "pcon-prop-group__label", children: s.label }),
            /* @__PURE__ */ N.jsxs("span", { className: "pcon-prop-group__summary", children: [
              S && T?.icon ? /* @__PURE__ */ N.jsx(
                "span",
                {
                  className: "pcon-prop-group__summary-swatch",
                  style: { backgroundImage: `url("${T.icon}")` },
                  "aria-hidden": "true"
                }
              ) : null,
              /* @__PURE__ */ N.jsx("span", { className: "pcon-prop-group__summary-label", children: T?.label ?? "—" })
            ] })
          ] }),
          /* @__PURE__ */ N.jsx("span", { className: "pcon-prop-group__toggle", "aria-hidden": "true", children: f ? "−" : "+" })
        ]
      }
    ),
    f && /* @__PURE__ */ N.jsx("div", { className: D, children: s.options.map((k) => {
      const B = k.value === s.currentValue;
      if (S) {
        const Z = [
          "pcon-option-swatch",
          B && "pcon-option-swatch--active",
          !k.available && "pcon-option-swatch--disabled"
        ].filter(Boolean).join(" ");
        return /* @__PURE__ */ N.jsxs(
          "button",
          {
            type: "button",
            className: Z,
            disabled: !k.available,
            title: k.label,
            onClick: () => I(k),
            children: [
              /* @__PURE__ */ N.jsx(
                "span",
                {
                  className: "pcon-option-swatch__thumb",
                  style: k.icon ? { backgroundImage: `url("${k.icon}")` } : void 0,
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ N.jsx("span", { className: "pcon-option-swatch__label", children: k.label })
            ]
          },
          k.value
        );
      }
      const X = [
        "pcon-option-chip",
        B && "pcon-option-chip--active",
        !k.available && "pcon-option-chip--disabled"
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ N.jsx(
        "button",
        {
          type: "button",
          className: X,
          disabled: !k.available,
          title: k.label,
          onClick: () => I(k),
          children: k.label
        },
        k.value
      );
    }) }),
    f && w.length > 0 && /* @__PURE__ */ N.jsx("div", { className: "pcon-prop-group__nested", children: w.map((k) => /* @__PURE__ */ N.jsx(
      hp,
      {
        prop: k,
        onSelect: (B) => E(k.id, B)
      },
      k.id
    )) })
  ] });
}
function hp({ prop: s, onSelect: f }) {
  const u = s.type === "color", y = s.options.find((S) => S.value === s.currentValue), w = (S) => {
    S.available && S.value !== s.currentValue && f(S.value);
  }, E = u ? "pcon-prop-group__body pcon-prop-group__body--colors" : "pcon-prop-group__body pcon-prop-group__body--chips";
  return /* @__PURE__ */ N.jsxs("div", { className: "pcon-prop-inline", children: [
    /* @__PURE__ */ N.jsxs("div", { className: "pcon-prop-inline__header", children: [
      /* @__PURE__ */ N.jsx("span", { className: "pcon-prop-group__label", children: s.label }),
      /* @__PURE__ */ N.jsxs("span", { className: "pcon-prop-group__summary", children: [
        u && y?.icon ? /* @__PURE__ */ N.jsx(
          "span",
          {
            className: "pcon-prop-group__summary-swatch",
            style: { backgroundImage: `url("${y.icon}")` },
            "aria-hidden": "true"
          }
        ) : null,
        /* @__PURE__ */ N.jsx("span", { className: "pcon-prop-group__summary-label", children: y?.label ?? "—" })
      ] })
    ] }),
    /* @__PURE__ */ N.jsx("div", { className: E, children: s.options.map((S) => {
      const T = S.value === s.currentValue;
      if (u) {
        const x = [
          "pcon-option-swatch",
          T && "pcon-option-swatch--active",
          !S.available && "pcon-option-swatch--disabled"
        ].filter(Boolean).join(" ");
        return /* @__PURE__ */ N.jsxs(
          "button",
          {
            type: "button",
            className: x,
            disabled: !S.available,
            title: S.label,
            onClick: () => w(S),
            children: [
              /* @__PURE__ */ N.jsx(
                "span",
                {
                  className: "pcon-option-swatch__thumb",
                  style: S.icon ? { backgroundImage: `url("${S.icon}")` } : void 0,
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ N.jsx("span", { className: "pcon-option-swatch__label", children: S.label })
            ]
          },
          S.value
        );
      }
      const I = [
        "pcon-option-chip",
        T && "pcon-option-chip--active",
        !S.available && "pcon-option-chip--disabled"
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ N.jsx(
        "button",
        {
          type: "button",
          className: I,
          disabled: !S.available,
          title: S.label,
          onClick: () => w(S),
          children: S.label
        },
        S.value
      );
    }) })
  ] });
}
var $i = { exports: {} }, Ki, dc;
function yp() {
  if (dc) return Ki;
  dc = 1;
  var s = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return Ki = s, Ki;
}
var qi, pc;
function vp() {
  if (pc) return qi;
  pc = 1;
  var s = /* @__PURE__ */ yp();
  function f() {
  }
  function u() {
  }
  return u.resetWarningCache = f, qi = function() {
    function y(S, T, I, x, D, k) {
      if (k !== s) {
        var B = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw B.name = "Invariant Violation", B;
      }
    }
    y.isRequired = y;
    function w() {
      return y;
    }
    var E = {
      array: y,
      bigint: y,
      bool: y,
      func: y,
      number: y,
      object: y,
      string: y,
      symbol: y,
      any: y,
      arrayOf: w,
      element: y,
      elementType: y,
      instanceOf: w,
      node: y,
      objectOf: w,
      oneOf: w,
      oneOfType: w,
      shape: w,
      exact: w,
      checkPropTypes: u,
      resetWarningCache: f
    };
    return E.PropTypes = E, E;
  }, qi;
}
var mc;
function gp() {
  return mc || (mc = 1, $i.exports = /* @__PURE__ */ vp()()), $i.exports;
}
var wp = /* @__PURE__ */ gp();
const Sp = /* @__PURE__ */ yc(wp);
function hc() {
  return typeof window < "u" && window.CalmaQuoteList && typeof window.CalmaQuoteList.addItem == "function";
}
function Ec({ isGuest: s = !1 }) {
  const f = ne((F) => F.quantity), u = ne((F) => F.setQuantity), y = ne((F) => F.addToCart), w = ne((F) => F.addToQuoteList);
  ne((F) => F.exportRequest);
  const E = ne((F) => F.resetCartFeedback), S = ne((F) => F.resetQuoteFeedback), T = ne((F) => F.cartLoading), I = ne((F) => F.cartError), x = ne((F) => F.cartSuccess), D = ne((F) => F.quoteLoading), k = ne((F) => F.quoteError), B = ne((F) => F.quoteSuccess), X = ne((F) => F.cartProperties), Z = ne((F) => F.variantId), R = ne((F) => F.updating), z = ne((F) => F.loading), J = ne((F) => F.addToCartLabel), [se, O] = Ae.useState(!1), [le, ae] = Ae.useState(hc);
  Ae.useEffect(() => {
    if (le) return;
    let F = 0;
    const me = setInterval(() => {
      F += 1, hc() ? (ae(!0), clearInterval(me)) : F >= 20 && clearInterval(me);
    }, 500);
    return () => clearInterval(me);
  }, [le]), Ae.useEffect(() => {
    if (!x) return;
    const F = setTimeout(() => E(), 4e3);
    return () => clearTimeout(F);
  }, [x, E]), Ae.useEffect(() => {
    if (!B) return;
    const F = setTimeout(() => S(), 4e3);
    return () => clearTimeout(F);
  }, [B, S]);
  const re = T || R || z || !X || !Z, ve = (F) => {
    u(F.target.value);
  }, Le = (F) => {
    u(Math.max(1, (parseInt(f, 10) || 1) + F));
  }, Qe = async () => {
    if (re) return;
    await y("none") && document.dispatchEvent(
      new CustomEvent("cart:refresh", { bubbles: !0, detail: { open: !0 } })
    );
  }, ge = async () => {
    re || D || await w();
  };
  return /* @__PURE__ */ N.jsxs("div", { className: "pcon-cart", children: [
    /* @__PURE__ */ N.jsxs("div", { className: "pcon-cart__row", children: [
      /* @__PURE__ */ N.jsx("label", { className: "pcon-cart__qty-label", htmlFor: "pcon-cart-qty", children: "Quantity" }),
      /* @__PURE__ */ N.jsxs("div", { className: "pcon-cart__qty-control", children: [
        /* @__PURE__ */ N.jsx(
          "button",
          {
            type: "button",
            className: "pcon-cart__qty-step",
            onClick: () => Le(-1),
            disabled: T || f <= 1,
            "aria-label": "Decrease quantity",
            children: "−"
          }
        ),
        /* @__PURE__ */ N.jsx(
          "input",
          {
            id: "pcon-cart-qty",
            type: "number",
            min: 1,
            step: 1,
            inputMode: "numeric",
            value: f,
            onChange: ve,
            disabled: T,
            className: "pcon-cart__qty-input"
          }
        ),
        /* @__PURE__ */ N.jsx(
          "button",
          {
            type: "button",
            className: "pcon-cart__qty-step",
            onClick: () => Le(1),
            disabled: T,
            "aria-label": "Increase quantity",
            children: "+"
          }
        )
      ] })
    ] }),
    s ? (
      /* Guest: tek "Request a Quote" butonu */
      /* @__PURE__ */ N.jsx(
        "button",
        {
          type: "button",
          className: "pcon-cart__btn",
          onClick: Qe,
          disabled: re,
          "aria-busy": T,
          children: T ? /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
            /* @__PURE__ */ N.jsx("span", { className: "pcon-cart__btn-spinner", "aria-hidden": "true" }),
            /* @__PURE__ */ N.jsx("span", { children: "Adding..." })
          ] }) : "Request a Quote"
        }
      )
    ) : /* @__PURE__ */ N.jsxs("div", { className: "pcon-cart__btn-group", children: [
      le ? /* @__PURE__ */ N.jsx(
        "button",
        {
          type: "button",
          className: "pcon-cart__btn pcon-cart__btn--secondary",
          onClick: ge,
          disabled: re || D,
          "aria-busy": D,
          children: D ? /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
            /* @__PURE__ */ N.jsx("span", { className: "pcon-cart__btn-spinner", "aria-hidden": "true" }),
            /* @__PURE__ */ N.jsx("span", { children: "Ekleniyor..." })
          ] }) : "Add to Quote List"
        }
      ) : null,
      /* @__PURE__ */ N.jsx(
        "button",
        {
          type: "button",
          className: "pcon-cart__btn",
          onClick: Qe,
          disabled: re,
          "aria-busy": T,
          children: T ? /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
            /* @__PURE__ */ N.jsx("span", { className: "pcon-cart__btn-spinner", "aria-hidden": "true" }),
            /* @__PURE__ */ N.jsx("span", { children: "Adding..." })
          ] }) : J || "Add to Cart"
        }
      )
    ] }),
    I ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__error", role: "alert", children: I }) : null,
    x ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__success", role: "status", children: "Added to cart." }) : null,
    k ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__error", role: "alert", children: k }) : null,
    B ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__success", role: "status", children: "Teklif listesine eklendi." }) : null
  ] });
}
Ec.propTypes = {
  isGuest: Sp.bool
};
class kp extends Ae.Component {
  constructor(f) {
    super(f), this.state = { hasError: !1, error: null };
  }
  static getDerivedStateFromError(f) {
    return { hasError: !0, error: f };
  }
  componentDidCatch(f) {
    console.error("[pcon] WCF render error:", f);
  }
  render() {
    return this.state.hasError ? /* @__PURE__ */ N.jsxs(
      "div",
      {
        className: "pcon-error",
        style: { minHeight: (this.props.canvasHeight || 500) + "px" },
        children: [
          /* @__PURE__ */ N.jsxs(
            "svg",
            {
              className: "pcon-error__icon",
              viewBox: "0 0 24 24",
              width: "32",
              height: "32",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              children: [
                /* @__PURE__ */ N.jsx("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ N.jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                /* @__PURE__ */ N.jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
              ]
            }
          ),
          /* @__PURE__ */ N.jsx("p", { className: "pcon-error__message", children: this.state.error?.message || "Failed to load 3D Configurator." })
        ]
      }
    ) : this.props.children;
  }
}
async function _p(s, f = "en_US", u = null, y = "") {
  if (u) {
    const E = await fetch(
      `https://gatekeeper.eaiws.pcon-solutions.com/v3/session/${u}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: f })
      }
    );
    if (!E.ok)
      throw new Error(`Gatekeeper direct call failed (HTTP ${E.status})`);
    return E.json();
  }
  const w = await fetch(`${s}/api/gatekeeper-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ locale: f, region: y || "" })
  });
  if (!w.ok) {
    const E = await w.json().catch(() => ({}));
    throw new Error(
      E.error || `Gatekeeper session failed (HTTP ${w.status})`
    );
  }
  return w.json();
}
function Ep({ canvasHeight: s, customerLoggedIn: f }) {
  const u = ne((O) => O.loading), y = ne((O) => O.error), w = ne((O) => O.proxyBase), E = ne((O) => O.gatekeeperId), S = ne((O) => O.region), T = ne((O) => O.articleNumber), I = ne((O) => O.manufacturerId), x = ne((O) => O.setWcfReady), D = ne((O) => O.setWcfError), k = ne((O) => O.refreshWcfPrice), B = Ae.useRef(null), X = Ae.useRef(null), Z = Ae.useRef(null), R = Ae.useRef(null), z = Ae.useRef(null), J = Ae.useRef(null), se = Ae.useCallback(() => {
    try {
      J.current?.disconnect();
    } catch {
    }
    J.current = null;
    try {
      z.current && R.current && R.current.eventArticleChanged?.removeListener(
        z.current
      );
    } catch {
    }
    z.current = null, R.current = null;
    try {
      Z.current?.close?.();
    } catch {
    }
    Z.current = null;
    try {
      X.current?.dispose?.();
    } catch {
    }
    X.current = null;
  }, []);
  return Ae.useEffect(() => {
    if (!T || !w) return;
    let O = !1;
    async function le() {
      if (!(!B.current && (await new Promise((ae) => setTimeout(ae, 50)), O || !B.current)))
        try {
          const ae = await _p(w, "en_US", E || null, S || "");
          if (O) return;
          const [re, ve] = await Promise.all([
            import("./pcon-chunk-engine-AgGdbLMj.js").then((d) => d.a),
            import("./pcon-chunk-engine-AgGdbLMj.js").then((d) => d.i)
          ]);
          if (O) return;
          const { Application: Le } = re, { wcfConfig: Qe } = ve;
          Qe.dataPath = `${w}/wcf/data/`;
          const ge = new Le();
          if (ge.initialize(B.current, {
            hardwareAntialiasing: !1,
            preserveDrawingBuffer: !0,
            autoResizeViewer: !0,
            adaptToDeviceRatio: !0,
            maximumDeviceRatio: 1.5,
            audioEngine: !1
          }), X.current = ge, O) {
            try {
              ge.dispose?.();
            } catch {
            }
            return;
          }
          if (await new Promise((d) => requestAnimationFrame(() => requestAnimationFrame(d))), O) return;
          try {
            ge.viewer.resize(!0);
          } catch {
          }
          if (typeof ResizeObserver < "u" && B.current) {
            const d = new ResizeObserver(() => {
              if (!O)
                try {
                  X.current?.viewer?.resize(!0);
                } catch {
                }
            });
            d.observe(B.current), J.current = d;
          }
          const { EaiwsSession: F } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((d) => d.c);
          if (O) return;
          const me = new F();
          me.connect(
            ae.server,
            ae.sessionId,
            ae.keepAliveInterval
          ), Z.current = me;
          const Ne = "en";
          if (await Promise.all([
            me.catalog.setLanguages([Ne]),
            me.basket.setLanguages([Ne])
          ]), O) return;
          const { ArticleManager: He } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((d) => d.d);
          if (O) return;
          const Ee = new He(ge, me);
          R.current = Ee;
          const Oe = (async () => {
            try {
              const { PricingProcedureInfo: d } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((b) => b.b), g = await me.basket.listPricingProcedures(!0);
              if (!g?.length || O) {
                console.warn("[wcf] no pricing procedures available");
                return;
              }
              const H = g[0].name;
              console.log("[wcf] setting pricing procedure:", H);
              const Y = await d.CreateInfo(
                me,
                H,
                !0
              );
              !O && R.current && (R.current.setPricingProcedure(Y), console.log("[wcf] pricing procedure ready:", H));
            } catch (d) {
              console.warn("[wcf] pricing procedure failed:", d?.message);
            }
          })(), ie = (async () => {
            try {
              const { SearchArticleParameterSet: d } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((b) => b.C), g = new d();
              g.baseArticleNumber = T, I && (g.manufacturerId = I);
              const Y = (await me.catalog.searchArticle(g))?.scoredItems?.[0]?.item;
              if (Y) {
                const { InsertInfo: b } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((de) => de.b), te = new b();
                return te.baseArticleNumber = Y.baseArticleNumber || T, Y.manufacturerId && (te.manufacturerId = Y.manufacturerId), Y.seriesId && (te.seriesId = Y.seriesId), await Ee.insertArticle(te);
              } else
                throw new Error(`Article not found in catalog: ${T}`);
            } catch (d) {
              console.warn(
                "[wcf] catalog search fell back to direct insert:",
                d?.message
              );
              const { InsertInfo: g } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((Y) => Y.b), H = new g();
              return H.baseArticleNumber = T, I && (H.manufacturerId = I), await Ee.insertArticle(H);
            }
          })(), [, j] = await Promise.all([
            Oe,
            ie
          ]);
          if (O || !j) return;
          ge.model.addElement(j);
          try {
            if (await j.waitUntilGeometryUpdated?.(), O) return;
            const d = ge.viewer?.view?.cameraControl;
            if (d) {
              const { Vector3: g } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((H) => H.m);
              if (O) return;
              try {
                d.setDirection(new g(0, 0, 1));
              } catch (H) {
                console.warn("[wcf] setDirection failed:", H?.message);
              }
              d.zoomToFitElements?.(
                [j],
                { margin: 0.15 }
              ), X.current?.viewer?.requestRenderFrame?.();
            }
          } catch (d) {
            console.warn("[wcf] initial camera setup failed:", d?.message);
          }
          const q = await j.getProperties();
          if (O) return;
          const M = (d) => {
            k(), (async () => {
              try {
                if (await (d?.article?.getMainArticle?.() ?? j)?.waitUntilGeometryUpdated?.(), O) return;
                X.current?.viewer?.requestRenderFrame?.();
              } catch {
              }
            })();
          };
          if (z.current = M, Ee.eventArticleChanged?.addListener(M), await x(j, Ee, q), O) return;
          k();
        } catch (ae) {
          O || (console.error("[wcf] init failed:", ae), D(ae));
        }
    }
    return le(), () => {
      O = !0, se();
    };
  }, [T, I, w, E, S, x, D, se, k]), /* @__PURE__ */ N.jsx(kp, { canvasHeight: s, children: /* @__PURE__ */ N.jsxs("div", { className: "pcon-configurator", children: [
    /* @__PURE__ */ N.jsxs("div", { className: "pcon-viewer", children: [
      u && /* @__PURE__ */ N.jsx("div", { className: "pcon-updating", children: /* @__PURE__ */ N.jsx("div", { className: "pcon-progress-spinner pcon-progress-spinner--indeterminate", children: /* @__PURE__ */ N.jsxs(
        "svg",
        {
          className: "pcon-progress-spinner__svg",
          viewBox: "0 0 64 64",
          "aria-hidden": "true",
          children: [
            /* @__PURE__ */ N.jsx(
              "circle",
              {
                className: "pcon-progress-spinner__track",
                cx: "32",
                cy: "32",
                r: "28",
                strokeDasharray: "175.93",
                strokeDashoffset: "0"
              }
            ),
            /* @__PURE__ */ N.jsx(
              "circle",
              {
                className: "pcon-progress-spinner__fill",
                cx: "32",
                cy: "32",
                r: "28",
                strokeDasharray: "131.95 175.93",
                strokeDashoffset: "0"
              }
            )
          ]
        }
      ) }) }),
      !u && y && /* @__PURE__ */ N.jsxs(
        "div",
        {
          className: "pcon-error",
          style: {
            position: "absolute",
            inset: 0,
            zIndex: 10,
            background: "white",
            minHeight: s + "px"
          },
          children: [
            /* @__PURE__ */ N.jsxs(
              "svg",
              {
                className: "pcon-error__icon",
                viewBox: "0 0 24 24",
                width: "32",
                height: "32",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                children: [
                  /* @__PURE__ */ N.jsx("circle", { cx: "12", cy: "12", r: "10" }),
                  /* @__PURE__ */ N.jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                  /* @__PURE__ */ N.jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
                ]
              }
            ),
            /* @__PURE__ */ N.jsx("p", { className: "pcon-error__message", children: y })
          ]
        }
      ),
      /* @__PURE__ */ N.jsx(
        "div",
        {
          ref: B,
          style: {
            position: "absolute",
            inset: 0
          }
        }
      )
    ] }),
    /* @__PURE__ */ N.jsx("div", { className: "pcon-sidebar", children: !y && /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
      /* @__PURE__ */ N.jsx(pp, {}),
      /* @__PURE__ */ N.jsxs("div", { className: "pcon-price-cart", children: [
        f && /* @__PURE__ */ N.jsx(dp, {}),
        /* @__PURE__ */ N.jsx(Ec, { isGuest: !f })
      ] })
    ] }) })
  ] }) });
}
const Cp = [
  // Dawn modern — `variant-selects` web component
  'variant-selects input[name="id"]:checked',
  'variant-radios input[name="id"]:checked',
  // Eski Dawn / klasik product form
  'form[action$="/cart/add"] input[name="id"]',
  // Generic select dropdown
  'select[name="id"]',
  // Modern themes gizli input
  'input[name="id"][type="hidden"]',
  'input[name="id"]:not([type="hidden"]):checked'
];
function Cc() {
  if (typeof document > "u") return null;
  for (const s of Cp) {
    const f = document.querySelectorAll(s);
    for (const u of f) {
      const y = u?.value?.trim();
      if (y) return y;
    }
  }
  if (typeof window < "u") {
    const s = window.ShopifyAnalytics?.meta?.selectedVariantId;
    if (s) return String(s);
  }
  return null;
}
function xp(s) {
  if (typeof document > "u") return () => {
  };
  let f = null;
  const u = () => {
    const S = Cc();
    S && S !== f && (f = S, s(S));
  }, y = (S) => {
    const T = S.target;
    T && T.matches?.(
      'input[name="id"], select[name="id"]'
    ) && u();
  }, w = () => u(), E = () => u();
  return document.addEventListener("change", y, !0), document.addEventListener("variant:change", w), document.addEventListener("on:variant:change", w), window.addEventListener("popstate", E), () => {
    document.removeEventListener("change", y, !0), document.removeEventListener("variant:change", w), document.removeEventListener("on:variant:change", w), window.removeEventListener("popstate", E);
  };
}
function Pp({ config: s }) {
  const f = ne((y) => y.initialize), u = ne((y) => y.setVariantId);
  return Ae.useEffect(() => {
    f(s);
  }, [f, s]), Ae.useEffect(() => {
    const y = Cc();
    return y && u(y), xp((E) => {
      u(E);
    });
  }, [u]), /* @__PURE__ */ N.jsx(
    Ep,
    {
      canvasHeight: s.canvasHeight,
      environmentPreset: s.environmentPreset,
      customerLoggedIn: s.customerLoggedIn
    }
  );
}
window.__pconConfiguratorInit = function(s, f) {
  const u = {
    ...f,
    customIcons: window.__pconCustomIcons || {}
  };
  s.innerHTML = "", Id.createRoot(s).render(/* @__PURE__ */ N.jsx(Pp, { config: u }));
};
