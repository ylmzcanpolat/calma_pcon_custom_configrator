import { g as fc } from "./pcon-chunk-engine-AgGdbLMj.js";
var zi = { exports: {} }, Sr = {}, Di = { exports: {} }, ee = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Va;
function pd() {
  if (Va) return ee;
  Va = 1;
  var a = Symbol.for("react.element"), d = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), v = Symbol.for("react.strict_mode"), w = Symbol.for("react.profiler"), P = Symbol.for("react.provider"), k = Symbol.for("react.context"), O = Symbol.for("react.forward_ref"), T = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), D = Symbol.for("react.lazy"), S = Symbol.iterator;
  function B(f) {
    return f === null || typeof f != "object" ? null : (f = S && f[S] || f["@@iterator"], typeof f == "function" ? f : null);
  }
  var J = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, Z = Object.assign, R = {};
  function j(f, g, H) {
    this.props = f, this.context = g, this.refs = R, this.updater = H || J;
  }
  j.prototype.isReactComponent = {}, j.prototype.setState = function(f, g) {
    if (typeof f != "object" && typeof f != "function" && f != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, f, g, "setState");
  }, j.prototype.forceUpdate = function(f) {
    this.updater.enqueueForceUpdate(this, f, "forceUpdate");
  };
  function X() {
  }
  X.prototype = j.prototype;
  function ue(f, g, H) {
    this.props = f, this.context = g, this.refs = R, this.updater = H || J;
  }
  var z = ue.prototype = new X();
  z.constructor = ue, Z(z, j.prototype), z.isPureReactComponent = !0;
  var ne = Array.isArray, ce = Object.prototype.hasOwnProperty, le = { current: null }, he = { key: !0, ref: !0, __self: !0, __source: !0 };
  function Ne(f, g, H) {
    var Y, b = {}, te = null, fe = null;
    if (g != null) for (Y in g.ref !== void 0 && (fe = g.ref), g.key !== void 0 && (te = "" + g.key), g) ce.call(g, Y) && !he.hasOwnProperty(Y) && (b[Y] = g[Y]);
    var se = arguments.length - 2;
    if (se === 1) b.children = H;
    else if (1 < se) {
      for (var ve = Array(se), be = 0; be < se; be++) ve[be] = arguments[be + 2];
      b.children = ve;
    }
    if (f && f.defaultProps) for (Y in se = f.defaultProps, se) b[Y] === void 0 && (b[Y] = se[Y]);
    return { $$typeof: a, type: f, key: te, ref: fe, props: b, _owner: le.current };
  }
  function Re(f, g) {
    return { $$typeof: a, type: f.type, key: g, ref: f.ref, props: f.props, _owner: f._owner };
  }
  function Ee(f) {
    return typeof f == "object" && f !== null && f.$$typeof === a;
  }
  function W(f) {
    var g = { "=": "=0", ":": "=2" };
    return "$" + f.replace(/[=:]/g, function(H) {
      return g[H];
    });
  }
  var we = /\/+/g;
  function Me(f, g) {
    return typeof f == "object" && f !== null && f.key != null ? W("" + f.key) : g.toString(36);
  }
  function Ze(f, g, H, Y, b) {
    var te = typeof f;
    (te === "undefined" || te === "boolean") && (f = null);
    var fe = !1;
    if (f === null) fe = !0;
    else switch (te) {
      case "string":
      case "number":
        fe = !0;
        break;
      case "object":
        switch (f.$$typeof) {
          case a:
          case d:
            fe = !0;
        }
    }
    if (fe) return fe = f, b = b(fe), f = Y === "" ? "." + Me(fe, 0) : Y, ne(b) ? (H = "", f != null && (H = f.replace(we, "$&/") + "/"), Ze(b, g, H, "", function(be) {
      return be;
    })) : b != null && (Ee(b) && (b = Re(b, H + (!b.key || fe && fe.key === b.key ? "" : ("" + b.key).replace(we, "$&/") + "/") + f)), g.push(b)), 1;
    if (fe = 0, Y = Y === "" ? "." : Y + ":", ne(f)) for (var se = 0; se < f.length; se++) {
      te = f[se];
      var ve = Y + Me(te, se);
      fe += Ze(te, g, H, ve, b);
    }
    else if (ve = B(f), typeof ve == "function") for (f = ve.call(f), se = 0; !(te = f.next()).done; ) te = te.value, ve = Y + Me(te, se++), fe += Ze(te, g, H, ve, b);
    else if (te === "object") throw g = String(f), Error("Objects are not valid as a React child (found: " + (g === "[object Object]" ? "object with keys {" + Object.keys(f).join(", ") + "}" : g) + "). If you meant to render a collection of children, use an array instead.");
    return fe;
  }
  function Fe(f, g, H) {
    if (f == null) return f;
    var Y = [], b = 0;
    return Ze(f, Y, "", "", function(te) {
      return g.call(H, te, b++);
    }), Y;
  }
  function Ue(f) {
    if (f._status === -1) {
      var g = f._result;
      g = g(), g.then(function(H) {
        (f._status === 0 || f._status === -1) && (f._status = 1, f._result = H);
      }, function(H) {
        (f._status === 0 || f._status === -1) && (f._status = 2, f._result = H);
      }), f._status === -1 && (f._status = 0, f._result = g);
    }
    if (f._status === 1) return f._result.default;
    throw f._result;
  }
  var ye = { current: null }, I = { transition: null }, q = { ReactCurrentDispatcher: ye, ReactCurrentBatchConfig: I, ReactCurrentOwner: le };
  function M() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return ee.Children = { map: Fe, forEach: function(f, g, H) {
    Fe(f, function() {
      g.apply(this, arguments);
    }, H);
  }, count: function(f) {
    var g = 0;
    return Fe(f, function() {
      g++;
    }), g;
  }, toArray: function(f) {
    return Fe(f, function(g) {
      return g;
    }) || [];
  }, only: function(f) {
    if (!Ee(f)) throw Error("React.Children.only expected to receive a single React element child.");
    return f;
  } }, ee.Component = j, ee.Fragment = u, ee.Profiler = w, ee.PureComponent = ue, ee.StrictMode = v, ee.Suspense = T, ee.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = q, ee.act = M, ee.cloneElement = function(f, g, H) {
    if (f == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + f + ".");
    var Y = Z({}, f.props), b = f.key, te = f.ref, fe = f._owner;
    if (g != null) {
      if (g.ref !== void 0 && (te = g.ref, fe = le.current), g.key !== void 0 && (b = "" + g.key), f.type && f.type.defaultProps) var se = f.type.defaultProps;
      for (ve in g) ce.call(g, ve) && !he.hasOwnProperty(ve) && (Y[ve] = g[ve] === void 0 && se !== void 0 ? se[ve] : g[ve]);
    }
    var ve = arguments.length - 2;
    if (ve === 1) Y.children = H;
    else if (1 < ve) {
      se = Array(ve);
      for (var be = 0; be < ve; be++) se[be] = arguments[be + 2];
      Y.children = se;
    }
    return { $$typeof: a, type: f.type, key: b, ref: te, props: Y, _owner: fe };
  }, ee.createContext = function(f) {
    return f = { $$typeof: k, _currentValue: f, _currentValue2: f, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, f.Provider = { $$typeof: P, _context: f }, f.Consumer = f;
  }, ee.createElement = Ne, ee.createFactory = function(f) {
    var g = Ne.bind(null, f);
    return g.type = f, g;
  }, ee.createRef = function() {
    return { current: null };
  }, ee.forwardRef = function(f) {
    return { $$typeof: O, render: f };
  }, ee.isValidElement = Ee, ee.lazy = function(f) {
    return { $$typeof: D, _payload: { _status: -1, _result: f }, _init: Ue };
  }, ee.memo = function(f, g) {
    return { $$typeof: x, type: f, compare: g === void 0 ? null : g };
  }, ee.startTransition = function(f) {
    var g = I.transition;
    I.transition = {};
    try {
      f();
    } finally {
      I.transition = g;
    }
  }, ee.unstable_act = M, ee.useCallback = function(f, g) {
    return ye.current.useCallback(f, g);
  }, ee.useContext = function(f) {
    return ye.current.useContext(f);
  }, ee.useDebugValue = function() {
  }, ee.useDeferredValue = function(f) {
    return ye.current.useDeferredValue(f);
  }, ee.useEffect = function(f, g) {
    return ye.current.useEffect(f, g);
  }, ee.useId = function() {
    return ye.current.useId();
  }, ee.useImperativeHandle = function(f, g, H) {
    return ye.current.useImperativeHandle(f, g, H);
  }, ee.useInsertionEffect = function(f, g) {
    return ye.current.useInsertionEffect(f, g);
  }, ee.useLayoutEffect = function(f, g) {
    return ye.current.useLayoutEffect(f, g);
  }, ee.useMemo = function(f, g) {
    return ye.current.useMemo(f, g);
  }, ee.useReducer = function(f, g, H) {
    return ye.current.useReducer(f, g, H);
  }, ee.useRef = function(f) {
    return ye.current.useRef(f);
  }, ee.useState = function(f) {
    return ye.current.useState(f);
  }, ee.useSyncExternalStore = function(f, g, H) {
    return ye.current.useSyncExternalStore(f, g, H);
  }, ee.useTransition = function() {
    return ye.current.useTransition();
  }, ee.version = "18.3.1", ee;
}
var Wa;
function $i() {
  return Wa || (Wa = 1, Di.exports = /* @__PURE__ */ pd()), Di.exports;
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
var Ba;
function md() {
  if (Ba) return Sr;
  Ba = 1;
  var a = /* @__PURE__ */ $i(), d = Symbol.for("react.element"), u = Symbol.for("react.fragment"), v = Object.prototype.hasOwnProperty, w = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, P = { key: !0, ref: !0, __self: !0, __source: !0 };
  function k(O, T, x) {
    var D, S = {}, B = null, J = null;
    x !== void 0 && (B = "" + x), T.key !== void 0 && (B = "" + T.key), T.ref !== void 0 && (J = T.ref);
    for (D in T) v.call(T, D) && !P.hasOwnProperty(D) && (S[D] = T[D]);
    if (O && O.defaultProps) for (D in T = O.defaultProps, T) S[D] === void 0 && (S[D] = T[D]);
    return { $$typeof: d, type: O, key: B, ref: J, props: S, _owner: w.current };
  }
  return Sr.Fragment = u, Sr.jsx = k, Sr.jsxs = k, Sr;
}
var Qa;
function hd() {
  return Qa || (Qa = 1, zi.exports = /* @__PURE__ */ md()), zi.exports;
}
var N = /* @__PURE__ */ hd(), jl = {}, Ai = { exports: {} }, Je = {}, Mi = { exports: {} }, Fi = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ha;
function yd() {
  return Ha || (Ha = 1, (function(a) {
    function d(I, q) {
      var M = I.length;
      I.push(q);
      e: for (; 0 < M; ) {
        var f = M - 1 >>> 1, g = I[f];
        if (0 < w(g, q)) I[f] = q, I[M] = g, M = f;
        else break e;
      }
    }
    function u(I) {
      return I.length === 0 ? null : I[0];
    }
    function v(I) {
      if (I.length === 0) return null;
      var q = I[0], M = I.pop();
      if (M !== q) {
        I[0] = M;
        e: for (var f = 0, g = I.length, H = g >>> 1; f < H; ) {
          var Y = 2 * (f + 1) - 1, b = I[Y], te = Y + 1, fe = I[te];
          if (0 > w(b, M)) te < g && 0 > w(fe, b) ? (I[f] = fe, I[te] = M, f = te) : (I[f] = b, I[Y] = M, f = Y);
          else if (te < g && 0 > w(fe, M)) I[f] = fe, I[te] = M, f = te;
          else break e;
        }
      }
      return q;
    }
    function w(I, q) {
      var M = I.sortIndex - q.sortIndex;
      return M !== 0 ? M : I.id - q.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var P = performance;
      a.unstable_now = function() {
        return P.now();
      };
    } else {
      var k = Date, O = k.now();
      a.unstable_now = function() {
        return k.now() - O;
      };
    }
    var T = [], x = [], D = 1, S = null, B = 3, J = !1, Z = !1, R = !1, j = typeof setTimeout == "function" ? setTimeout : null, X = typeof clearTimeout == "function" ? clearTimeout : null, ue = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function z(I) {
      for (var q = u(x); q !== null; ) {
        if (q.callback === null) v(x);
        else if (q.startTime <= I) v(x), q.sortIndex = q.expirationTime, d(T, q);
        else break;
        q = u(x);
      }
    }
    function ne(I) {
      if (R = !1, z(I), !Z) if (u(T) !== null) Z = !0, Ue(ce);
      else {
        var q = u(x);
        q !== null && ye(ne, q.startTime - I);
      }
    }
    function ce(I, q) {
      Z = !1, R && (R = !1, X(Ne), Ne = -1), J = !0;
      var M = B;
      try {
        for (z(q), S = u(T); S !== null && (!(S.expirationTime > q) || I && !W()); ) {
          var f = S.callback;
          if (typeof f == "function") {
            S.callback = null, B = S.priorityLevel;
            var g = f(S.expirationTime <= q);
            q = a.unstable_now(), typeof g == "function" ? S.callback = g : S === u(T) && v(T), z(q);
          } else v(T);
          S = u(T);
        }
        if (S !== null) var H = !0;
        else {
          var Y = u(x);
          Y !== null && ye(ne, Y.startTime - q), H = !1;
        }
        return H;
      } finally {
        S = null, B = M, J = !1;
      }
    }
    var le = !1, he = null, Ne = -1, Re = 5, Ee = -1;
    function W() {
      return !(a.unstable_now() - Ee < Re);
    }
    function we() {
      if (he !== null) {
        var I = a.unstable_now();
        Ee = I;
        var q = !0;
        try {
          q = he(!0, I);
        } finally {
          q ? Me() : (le = !1, he = null);
        }
      } else le = !1;
    }
    var Me;
    if (typeof ue == "function") Me = function() {
      ue(we);
    };
    else if (typeof MessageChannel < "u") {
      var Ze = new MessageChannel(), Fe = Ze.port2;
      Ze.port1.onmessage = we, Me = function() {
        Fe.postMessage(null);
      };
    } else Me = function() {
      j(we, 0);
    };
    function Ue(I) {
      he = I, le || (le = !0, Me());
    }
    function ye(I, q) {
      Ne = j(function() {
        I(a.unstable_now());
      }, q);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(I) {
      I.callback = null;
    }, a.unstable_continueExecution = function() {
      Z || J || (Z = !0, Ue(ce));
    }, a.unstable_forceFrameRate = function(I) {
      0 > I || 125 < I ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Re = 0 < I ? Math.floor(1e3 / I) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return B;
    }, a.unstable_getFirstCallbackNode = function() {
      return u(T);
    }, a.unstable_next = function(I) {
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
        return I();
      } finally {
        B = M;
      }
    }, a.unstable_pauseExecution = function() {
    }, a.unstable_requestPaint = function() {
    }, a.unstable_runWithPriority = function(I, q) {
      switch (I) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          I = 3;
      }
      var M = B;
      B = I;
      try {
        return q();
      } finally {
        B = M;
      }
    }, a.unstable_scheduleCallback = function(I, q, M) {
      var f = a.unstable_now();
      switch (typeof M == "object" && M !== null ? (M = M.delay, M = typeof M == "number" && 0 < M ? f + M : f) : M = f, I) {
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
      return g = M + g, I = { id: D++, callback: q, priorityLevel: I, startTime: M, expirationTime: g, sortIndex: -1 }, M > f ? (I.sortIndex = M, d(x, I), u(T) === null && I === u(x) && (R ? (X(Ne), Ne = -1) : R = !0, ye(ne, M - f))) : (I.sortIndex = g, d(T, I), Z || J || (Z = !0, Ue(ce))), I;
    }, a.unstable_shouldYield = W, a.unstable_wrapCallback = function(I) {
      var q = B;
      return function() {
        var M = B;
        B = q;
        try {
          return I.apply(this, arguments);
        } finally {
          B = M;
        }
      };
    };
  })(Fi)), Fi;
}
var $a;
function vd() {
  return $a || ($a = 1, Mi.exports = /* @__PURE__ */ yd()), Mi.exports;
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
var Ka;
function gd() {
  if (Ka) return Je;
  Ka = 1;
  var a = /* @__PURE__ */ $i(), d = /* @__PURE__ */ vd();
  function u(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var v = /* @__PURE__ */ new Set(), w = {};
  function P(e, t) {
    k(e, t), k(e + "Capture", t);
  }
  function k(e, t) {
    for (w[e] = t, e = 0; e < t.length; e++) v.add(t[e]);
  }
  var O = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), T = Object.prototype.hasOwnProperty, x = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, D = {}, S = {};
  function B(e) {
    return T.call(S, e) ? !0 : T.call(D, e) ? !1 : x.test(e) ? S[e] = !0 : (D[e] = !0, !1);
  }
  function J(e, t, n, r) {
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
    if (t === null || typeof t > "u" || J(e, t, n, r)) return !0;
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
  var j = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    j[e] = new R(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    j[t] = new R(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    j[e] = new R(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    j[e] = new R(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    j[e] = new R(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    j[e] = new R(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    j[e] = new R(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    j[e] = new R(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    j[e] = new R(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var X = /[\-:]([a-z])/g;
  function ue(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      X,
      ue
    );
    j[t] = new R(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(X, ue);
    j[t] = new R(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(X, ue);
    j[t] = new R(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    j[e] = new R(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), j.xlinkHref = new R("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    j[e] = new R(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function z(e, t, n, r) {
    var l = j.hasOwnProperty(t) ? j[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (Z(t, n, l, r) && (n = null), r || l === null ? B(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var ne = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ce = Symbol.for("react.element"), le = Symbol.for("react.portal"), he = Symbol.for("react.fragment"), Ne = Symbol.for("react.strict_mode"), Re = Symbol.for("react.profiler"), Ee = Symbol.for("react.provider"), W = Symbol.for("react.context"), we = Symbol.for("react.forward_ref"), Me = Symbol.for("react.suspense"), Ze = Symbol.for("react.suspense_list"), Fe = Symbol.for("react.memo"), Ue = Symbol.for("react.lazy"), ye = Symbol.for("react.offscreen"), I = Symbol.iterator;
  function q(e) {
    return e === null || typeof e != "object" ? null : (e = I && e[I] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var M = Object.assign, f;
  function g(e) {
    if (f === void 0) try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      f = t && t[1] || "";
    }
    return `
` + f + e;
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
        } catch (y) {
          var r = y;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (y) {
          r = y;
        }
        e.call(t.prototype);
      }
      else {
        try {
          throw Error();
        } catch (y) {
          r = y;
        }
        e();
      }
    } catch (y) {
      if (y && r && typeof y.stack == "string") {
        for (var l = y.stack.split(`
`), o = r.stack.split(`
`), i = l.length - 1, s = o.length - 1; 1 <= i && 0 <= s && l[i] !== o[s]; ) s--;
        for (; 1 <= i && 0 <= s; i--, s--) if (l[i] !== o[s]) {
          if (i !== 1 || s !== 1)
            do
              if (i--, s--, 0 > s || l[i] !== o[s]) {
                var c = `
` + l[i].replace(" at new ", " at ");
                return e.displayName && c.includes("<anonymous>") && (c = c.replace("<anonymous>", e.displayName)), c;
              }
            while (1 <= i && 0 <= s);
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
      case he:
        return "Fragment";
      case le:
        return "Portal";
      case Re:
        return "Profiler";
      case Ne:
        return "StrictMode";
      case Me:
        return "Suspense";
      case Ze:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case W:
        return (e.displayName || "Context") + ".Consumer";
      case Ee:
        return (e._context.displayName || "Context") + ".Provider";
      case we:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Fe:
        return t = e.displayName || null, t !== null ? t : te(e.type) || "Memo";
      case Ue:
        t = e._payload, e = e._init;
        try {
          return te(e(t));
        } catch {
        }
    }
    return null;
  }
  function fe(e) {
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
        return t === Ne ? "StrictMode" : "Mode";
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
  function se(e) {
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
  function ve(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function be(e) {
    var t = ve(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
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
  function Er(e) {
    e._valueTracker || (e._valueTracker = be(e));
  }
  function Ki(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = ve(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Cr(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Vl(e, t) {
    var n = t.checked;
    return M({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function qi(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = se(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Yi(e, t) {
    t = t.checked, t != null && z(e, "checked", t, !1);
  }
  function Wl(e, t) {
    Yi(e, t);
    var n = se(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Bl(e, t.type, n) : t.hasOwnProperty("defaultValue") && Bl(e, t.type, se(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function Gi(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Bl(e, t, n) {
    (t !== "number" || Cr(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var Dn = Array.isArray;
  function cn(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + se(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          e[l].selected = !0, r && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Ql(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(u(91));
    return M({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Xi(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(u(92));
        if (Dn(n)) {
          if (1 < n.length) throw Error(u(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: se(n) };
  }
  function Ji(e, t) {
    var n = se(t.value), r = se(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function Zi(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function bi(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Hl(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? bi(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var xr, eu = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (xr = xr || document.createElement("div"), xr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = xr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function An(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Mn = {
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
  }, yc = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Mn).forEach(function(e) {
    yc.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Mn[t] = Mn[e];
    });
  });
  function tu(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Mn.hasOwnProperty(e) && Mn[e] ? ("" + t).trim() : t + "px";
  }
  function nu(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = tu(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var vc = M({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function $l(e, t) {
    if (t) {
      if (vc[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(u(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(u(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(u(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(u(62));
    }
  }
  function Kl(e, t) {
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
  var ql = null;
  function Yl(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Gl = null, fn = null, dn = null;
  function ru(e) {
    if (e = or(e)) {
      if (typeof Gl != "function") throw Error(u(280));
      var t = e.stateNode;
      t && (t = Yr(t), Gl(e.stateNode, e.type, t));
    }
  }
  function lu(e) {
    fn ? dn ? dn.push(e) : dn = [e] : fn = e;
  }
  function ou() {
    if (fn) {
      var e = fn, t = dn;
      if (dn = fn = null, ru(e), t) for (e = 0; e < t.length; e++) ru(t[e]);
    }
  }
  function iu(e, t) {
    return e(t);
  }
  function uu() {
  }
  var Xl = !1;
  function su(e, t, n) {
    if (Xl) return e(t, n);
    Xl = !0;
    try {
      return iu(e, t, n);
    } finally {
      Xl = !1, (fn !== null || dn !== null) && (uu(), ou());
    }
  }
  function Fn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = Yr(n);
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
  var Jl = !1;
  if (O) try {
    var Un = {};
    Object.defineProperty(Un, "passive", { get: function() {
      Jl = !0;
    } }), window.addEventListener("test", Un, Un), window.removeEventListener("test", Un, Un);
  } catch {
    Jl = !1;
  }
  function gc(e, t, n, r, l, o, i, s, c) {
    var y = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, y);
    } catch (E) {
      this.onError(E);
    }
  }
  var Vn = !1, Pr = null, Nr = !1, Zl = null, wc = { onError: function(e) {
    Vn = !0, Pr = e;
  } };
  function Sc(e, t, n, r, l, o, i, s, c) {
    Vn = !1, Pr = null, gc.apply(wc, arguments);
  }
  function kc(e, t, n, r, l, o, i, s, c) {
    if (Sc.apply(this, arguments), Vn) {
      if (Vn) {
        var y = Pr;
        Vn = !1, Pr = null;
      } else throw Error(u(198));
      Nr || (Nr = !0, Zl = y);
    }
  }
  function Gt(e) {
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
  function au(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function cu(e) {
    if (Gt(e) !== e) throw Error(u(188));
  }
  function _c(e) {
    var t = e.alternate;
    if (!t) {
      if (t = Gt(e), t === null) throw Error(u(188));
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
          if (o === n) return cu(l), e;
          if (o === r) return cu(l), t;
          o = o.sibling;
        }
        throw Error(u(188));
      }
      if (n.return !== r.return) n = l, r = o;
      else {
        for (var i = !1, s = l.child; s; ) {
          if (s === n) {
            i = !0, n = l, r = o;
            break;
          }
          if (s === r) {
            i = !0, r = l, n = o;
            break;
          }
          s = s.sibling;
        }
        if (!i) {
          for (s = o.child; s; ) {
            if (s === n) {
              i = !0, n = o, r = l;
              break;
            }
            if (s === r) {
              i = !0, r = o, n = l;
              break;
            }
            s = s.sibling;
          }
          if (!i) throw Error(u(189));
        }
      }
      if (n.alternate !== r) throw Error(u(190));
    }
    if (n.tag !== 3) throw Error(u(188));
    return n.stateNode.current === n ? e : t;
  }
  function fu(e) {
    return e = _c(e), e !== null ? du(e) : null;
  }
  function du(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = du(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var pu = d.unstable_scheduleCallback, mu = d.unstable_cancelCallback, Ec = d.unstable_shouldYield, Cc = d.unstable_requestPaint, Ce = d.unstable_now, xc = d.unstable_getCurrentPriorityLevel, bl = d.unstable_ImmediatePriority, hu = d.unstable_UserBlockingPriority, Rr = d.unstable_NormalPriority, Pc = d.unstable_LowPriority, yu = d.unstable_IdlePriority, Lr = null, vt = null;
  function Nc(e) {
    if (vt && typeof vt.onCommitFiberRoot == "function") try {
      vt.onCommitFiberRoot(Lr, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var ct = Math.clz32 ? Math.clz32 : Tc, Rc = Math.log, Lc = Math.LN2;
  function Tc(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Rc(e) / Lc | 0) | 0;
  }
  var Tr = 64, Ir = 4194304;
  function Wn(e) {
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
  function Or(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, o = e.pingedLanes, i = n & 268435455;
    if (i !== 0) {
      var s = i & ~l;
      s !== 0 ? r = Wn(s) : (o &= i, o !== 0 && (r = Wn(o)));
    } else i = n & ~l, i !== 0 ? r = Wn(i) : o !== 0 && (r = Wn(o));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, o = t & -t, l >= o || l === 16 && (o & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - ct(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function Ic(e, t) {
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
  function Oc(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
      var i = 31 - ct(o), s = 1 << i, c = l[i];
      c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (l[i] = Ic(s, t)) : c <= t && (e.expiredLanes |= s), o &= ~s;
    }
  }
  function eo(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function vu() {
    var e = Tr;
    return Tr <<= 1, (Tr & 4194240) === 0 && (Tr = 64), e;
  }
  function to(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Bn(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - ct(t), e[t] = n;
  }
  function jc(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - ct(n), o = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~o;
    }
  }
  function no(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - ct(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var ae = 0;
  function gu(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var wu, ro, Su, ku, _u, lo = !1, jr = [], Tt = null, It = null, Ot = null, Qn = /* @__PURE__ */ new Map(), Hn = /* @__PURE__ */ new Map(), jt = [], zc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Eu(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Tt = null;
        break;
      case "dragenter":
      case "dragleave":
        It = null;
        break;
      case "mouseover":
      case "mouseout":
        Ot = null;
        break;
      case "pointerover":
      case "pointerout":
        Qn.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Hn.delete(t.pointerId);
    }
  }
  function $n(e, t, n, r, l, o) {
    return e === null || e.nativeEvent !== o ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: o, targetContainers: [l] }, t !== null && (t = or(t), t !== null && ro(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function Dc(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return Tt = $n(Tt, e, t, n, r, l), !0;
      case "dragenter":
        return It = $n(It, e, t, n, r, l), !0;
      case "mouseover":
        return Ot = $n(Ot, e, t, n, r, l), !0;
      case "pointerover":
        var o = l.pointerId;
        return Qn.set(o, $n(Qn.get(o) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return o = l.pointerId, Hn.set(o, $n(Hn.get(o) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function Cu(e) {
    var t = Xt(e.target);
    if (t !== null) {
      var n = Gt(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = au(n), t !== null) {
            e.blockedOn = t, _u(e.priority, function() {
              Su(n);
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
  function zr(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = io(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        ql = r, n.target.dispatchEvent(r), ql = null;
      } else return t = or(n), t !== null && ro(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function xu(e, t, n) {
    zr(e) && n.delete(t);
  }
  function Ac() {
    lo = !1, Tt !== null && zr(Tt) && (Tt = null), It !== null && zr(It) && (It = null), Ot !== null && zr(Ot) && (Ot = null), Qn.forEach(xu), Hn.forEach(xu);
  }
  function Kn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, lo || (lo = !0, d.unstable_scheduleCallback(d.unstable_NormalPriority, Ac)));
  }
  function qn(e) {
    function t(l) {
      return Kn(l, e);
    }
    if (0 < jr.length) {
      Kn(jr[0], e);
      for (var n = 1; n < jr.length; n++) {
        var r = jr[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Tt !== null && Kn(Tt, e), It !== null && Kn(It, e), Ot !== null && Kn(Ot, e), Qn.forEach(t), Hn.forEach(t), n = 0; n < jt.length; n++) r = jt[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < jt.length && (n = jt[0], n.blockedOn === null); ) Cu(n), n.blockedOn === null && jt.shift();
  }
  var pn = ne.ReactCurrentBatchConfig, Dr = !0;
  function Mc(e, t, n, r) {
    var l = ae, o = pn.transition;
    pn.transition = null;
    try {
      ae = 1, oo(e, t, n, r);
    } finally {
      ae = l, pn.transition = o;
    }
  }
  function Fc(e, t, n, r) {
    var l = ae, o = pn.transition;
    pn.transition = null;
    try {
      ae = 4, oo(e, t, n, r);
    } finally {
      ae = l, pn.transition = o;
    }
  }
  function oo(e, t, n, r) {
    if (Dr) {
      var l = io(e, t, n, r);
      if (l === null) Co(e, t, r, Ar, n), Eu(e, r);
      else if (Dc(l, e, t, n, r)) r.stopPropagation();
      else if (Eu(e, r), t & 4 && -1 < zc.indexOf(e)) {
        for (; l !== null; ) {
          var o = or(l);
          if (o !== null && wu(o), o = io(e, t, n, r), o === null && Co(e, t, r, Ar, n), o === l) break;
          l = o;
        }
        l !== null && r.stopPropagation();
      } else Co(e, t, r, null, n);
    }
  }
  var Ar = null;
  function io(e, t, n, r) {
    if (Ar = null, e = Yl(r), e = Xt(e), e !== null) if (t = Gt(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = au(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Ar = e, null;
  }
  function Pu(e) {
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
        switch (xc()) {
          case bl:
            return 1;
          case hu:
            return 4;
          case Rr:
          case Pc:
            return 16;
          case yu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var zt = null, uo = null, Mr = null;
  function Nu() {
    if (Mr) return Mr;
    var e, t = uo, n = t.length, r, l = "value" in zt ? zt.value : zt.textContent, o = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var i = n - e;
    for (r = 1; r <= i && t[n - r] === l[o - r]; r++) ;
    return Mr = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Fr(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Ur() {
    return !0;
  }
  function Ru() {
    return !1;
  }
  function et(e) {
    function t(n, r, l, o, i) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = o, this.target = i, this.currentTarget = null;
      for (var s in e) e.hasOwnProperty(s) && (n = e[s], this[s] = n ? n(o) : o[s]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? Ur : Ru, this.isPropagationStopped = Ru, this;
    }
    return M(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Ur);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Ur);
    }, persist: function() {
    }, isPersistent: Ur }), t;
  }
  var mn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, so = et(mn), Yn = M({}, mn, { view: 0, detail: 0 }), Uc = et(Yn), ao, co, Gn, Vr = M({}, Yn, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: po, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== Gn && (Gn && e.type === "mousemove" ? (ao = e.screenX - Gn.screenX, co = e.screenY - Gn.screenY) : co = ao = 0, Gn = e), ao);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : co;
  } }), Lu = et(Vr), Vc = M({}, Vr, { dataTransfer: 0 }), Wc = et(Vc), Bc = M({}, Yn, { relatedTarget: 0 }), fo = et(Bc), Qc = M({}, mn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hc = et(Qc), $c = M({}, mn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Kc = et($c), qc = M({}, mn, { data: 0 }), Tu = et(qc), Yc = {
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
  }, Gc = {
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
  }, Xc = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Jc(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Xc[e]) ? !!t[e] : !1;
  }
  function po() {
    return Jc;
  }
  var Zc = M({}, Yn, { key: function(e) {
    if (e.key) {
      var t = Yc[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Fr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Gc[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: po, charCode: function(e) {
    return e.type === "keypress" ? Fr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Fr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), bc = et(Zc), ef = M({}, Vr, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Iu = et(ef), tf = M({}, Yn, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: po }), nf = et(tf), rf = M({}, mn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), lf = et(rf), of = M({}, Vr, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), uf = et(of), sf = [9, 13, 27, 32], mo = O && "CompositionEvent" in window, Xn = null;
  O && "documentMode" in document && (Xn = document.documentMode);
  var af = O && "TextEvent" in window && !Xn, Ou = O && (!mo || Xn && 8 < Xn && 11 >= Xn), ju = " ", zu = !1;
  function Du(e, t) {
    switch (e) {
      case "keyup":
        return sf.indexOf(t.keyCode) !== -1;
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
  function Au(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var hn = !1;
  function cf(e, t) {
    switch (e) {
      case "compositionend":
        return Au(t);
      case "keypress":
        return t.which !== 32 ? null : (zu = !0, ju);
      case "textInput":
        return e = t.data, e === ju && zu ? null : e;
      default:
        return null;
    }
  }
  function ff(e, t) {
    if (hn) return e === "compositionend" || !mo && Du(e, t) ? (e = Nu(), Mr = uo = zt = null, hn = !1, e) : null;
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
        return Ou && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var df = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Mu(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!df[e.type] : t === "textarea";
  }
  function Fu(e, t, n, r) {
    lu(r), t = $r(t, "onChange"), 0 < t.length && (n = new so("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var Jn = null, Zn = null;
  function pf(e) {
    ns(e, 0);
  }
  function Wr(e) {
    var t = Sn(e);
    if (Ki(t)) return e;
  }
  function mf(e, t) {
    if (e === "change") return t;
  }
  var Uu = !1;
  if (O) {
    var ho;
    if (O) {
      var yo = "oninput" in document;
      if (!yo) {
        var Vu = document.createElement("div");
        Vu.setAttribute("oninput", "return;"), yo = typeof Vu.oninput == "function";
      }
      ho = yo;
    } else ho = !1;
    Uu = ho && (!document.documentMode || 9 < document.documentMode);
  }
  function Wu() {
    Jn && (Jn.detachEvent("onpropertychange", Bu), Zn = Jn = null);
  }
  function Bu(e) {
    if (e.propertyName === "value" && Wr(Zn)) {
      var t = [];
      Fu(t, Zn, e, Yl(e)), su(pf, t);
    }
  }
  function hf(e, t, n) {
    e === "focusin" ? (Wu(), Jn = t, Zn = n, Jn.attachEvent("onpropertychange", Bu)) : e === "focusout" && Wu();
  }
  function yf(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Wr(Zn);
  }
  function vf(e, t) {
    if (e === "click") return Wr(t);
  }
  function gf(e, t) {
    if (e === "input" || e === "change") return Wr(t);
  }
  function wf(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ft = typeof Object.is == "function" ? Object.is : wf;
  function bn(e, t) {
    if (ft(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!T.call(t, l) || !ft(e[l], t[l])) return !1;
    }
    return !0;
  }
  function Qu(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Hu(e, t) {
    var n = Qu(e);
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
      n = Qu(n);
    }
  }
  function $u(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? $u(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Ku() {
    for (var e = window, t = Cr(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Cr(e.document);
    }
    return t;
  }
  function vo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Sf(e) {
    var t = Ku(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && $u(n.ownerDocument.documentElement, n)) {
      if (r !== null && vo(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, o = Math.min(r.start, l);
          r = r.end === void 0 ? o : Math.min(r.end, l), !e.extend && o > r && (l = r, r = o, o = l), l = Hu(n, o);
          var i = Hu(
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
  var kf = O && "documentMode" in document && 11 >= document.documentMode, yn = null, go = null, er = null, wo = !1;
  function qu(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    wo || yn == null || yn !== Cr(r) || (r = yn, "selectionStart" in r && vo(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), er && bn(er, r) || (er = r, r = $r(go, "onSelect"), 0 < r.length && (t = new so("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = yn)));
  }
  function Br(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var vn = { animationend: Br("Animation", "AnimationEnd"), animationiteration: Br("Animation", "AnimationIteration"), animationstart: Br("Animation", "AnimationStart"), transitionend: Br("Transition", "TransitionEnd") }, So = {}, Yu = {};
  O && (Yu = document.createElement("div").style, "AnimationEvent" in window || (delete vn.animationend.animation, delete vn.animationiteration.animation, delete vn.animationstart.animation), "TransitionEvent" in window || delete vn.transitionend.transition);
  function Qr(e) {
    if (So[e]) return So[e];
    if (!vn[e]) return e;
    var t = vn[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in Yu) return So[e] = t[n];
    return e;
  }
  var Gu = Qr("animationend"), Xu = Qr("animationiteration"), Ju = Qr("animationstart"), Zu = Qr("transitionend"), bu = /* @__PURE__ */ new Map(), es = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Dt(e, t) {
    bu.set(e, t), P(t, [e]);
  }
  for (var ko = 0; ko < es.length; ko++) {
    var _o = es[ko], _f = _o.toLowerCase(), Ef = _o[0].toUpperCase() + _o.slice(1);
    Dt(_f, "on" + Ef);
  }
  Dt(Gu, "onAnimationEnd"), Dt(Xu, "onAnimationIteration"), Dt(Ju, "onAnimationStart"), Dt("dblclick", "onDoubleClick"), Dt("focusin", "onFocus"), Dt("focusout", "onBlur"), Dt(Zu, "onTransitionEnd"), k("onMouseEnter", ["mouseout", "mouseover"]), k("onMouseLeave", ["mouseout", "mouseover"]), k("onPointerEnter", ["pointerout", "pointerover"]), k("onPointerLeave", ["pointerout", "pointerover"]), P("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), P("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), P("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), P("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), P("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), P("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var tr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Cf = new Set("cancel close invalid load scroll toggle".split(" ").concat(tr));
  function ts(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, kc(r, t, void 0, e), e.currentTarget = null;
  }
  function ns(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var o = void 0;
        if (t) for (var i = r.length - 1; 0 <= i; i--) {
          var s = r[i], c = s.instance, y = s.currentTarget;
          if (s = s.listener, c !== o && l.isPropagationStopped()) break e;
          ts(l, s, y), o = c;
        }
        else for (i = 0; i < r.length; i++) {
          if (s = r[i], c = s.instance, y = s.currentTarget, s = s.listener, c !== o && l.isPropagationStopped()) break e;
          ts(l, s, y), o = c;
        }
      }
    }
    if (Nr) throw e = Zl, Nr = !1, Zl = null, e;
  }
  function pe(e, t) {
    var n = t[To];
    n === void 0 && (n = t[To] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (rs(t, e, 2, !1), n.add(r));
  }
  function Eo(e, t, n) {
    var r = 0;
    t && (r |= 4), rs(n, e, r, t);
  }
  var Hr = "_reactListening" + Math.random().toString(36).slice(2);
  function nr(e) {
    if (!e[Hr]) {
      e[Hr] = !0, v.forEach(function(n) {
        n !== "selectionchange" && (Cf.has(n) || Eo(n, !1, e), Eo(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Hr] || (t[Hr] = !0, Eo("selectionchange", !1, t));
    }
  }
  function rs(e, t, n, r) {
    switch (Pu(t)) {
      case 1:
        var l = Mc;
        break;
      case 4:
        l = Fc;
        break;
      default:
        l = oo;
    }
    n = l.bind(null, t, n, e), l = void 0, !Jl || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function Co(e, t, n, r, l) {
    var o = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var i = r.tag;
      if (i === 3 || i === 4) {
        var s = r.stateNode.containerInfo;
        if (s === l || s.nodeType === 8 && s.parentNode === l) break;
        if (i === 4) for (i = r.return; i !== null; ) {
          var c = i.tag;
          if ((c === 3 || c === 4) && (c = i.stateNode.containerInfo, c === l || c.nodeType === 8 && c.parentNode === l)) return;
          i = i.return;
        }
        for (; s !== null; ) {
          if (i = Xt(s), i === null) return;
          if (c = i.tag, c === 5 || c === 6) {
            r = o = i;
            continue e;
          }
          s = s.parentNode;
        }
      }
      r = r.return;
    }
    su(function() {
      var y = o, E = Yl(n), C = [];
      e: {
        var _ = bu.get(e);
        if (_ !== void 0) {
          var A = so, U = e;
          switch (e) {
            case "keypress":
              if (Fr(n) === 0) break e;
            case "keydown":
            case "keyup":
              A = bc;
              break;
            case "focusin":
              U = "focus", A = fo;
              break;
            case "focusout":
              U = "blur", A = fo;
              break;
            case "beforeblur":
            case "afterblur":
              A = fo;
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
              A = Lu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              A = Wc;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              A = nf;
              break;
            case Gu:
            case Xu:
            case Ju:
              A = Hc;
              break;
            case Zu:
              A = lf;
              break;
            case "scroll":
              A = Uc;
              break;
            case "wheel":
              A = uf;
              break;
            case "copy":
            case "cut":
            case "paste":
              A = Kc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              A = Iu;
          }
          var V = (t & 4) !== 0, xe = !V && e === "scroll", m = V ? _ !== null ? _ + "Capture" : null : _;
          V = [];
          for (var p = y, h; p !== null; ) {
            h = p;
            var L = h.stateNode;
            if (h.tag === 5 && L !== null && (h = L, m !== null && (L = Fn(p, m), L != null && V.push(rr(p, L, h)))), xe) break;
            p = p.return;
          }
          0 < V.length && (_ = new A(_, U, null, n, E), C.push({ event: _, listeners: V }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (_ = e === "mouseover" || e === "pointerover", A = e === "mouseout" || e === "pointerout", _ && n !== ql && (U = n.relatedTarget || n.fromElement) && (Xt(U) || U[_t])) break e;
          if ((A || _) && (_ = E.window === E ? E : (_ = E.ownerDocument) ? _.defaultView || _.parentWindow : window, A ? (U = n.relatedTarget || n.toElement, A = y, U = U ? Xt(U) : null, U !== null && (xe = Gt(U), U !== xe || U.tag !== 5 && U.tag !== 6) && (U = null)) : (A = null, U = y), A !== U)) {
            if (V = Lu, L = "onMouseLeave", m = "onMouseEnter", p = "mouse", (e === "pointerout" || e === "pointerover") && (V = Iu, L = "onPointerLeave", m = "onPointerEnter", p = "pointer"), xe = A == null ? _ : Sn(A), h = U == null ? _ : Sn(U), _ = new V(L, p + "leave", A, n, E), _.target = xe, _.relatedTarget = h, L = null, Xt(E) === y && (V = new V(m, p + "enter", U, n, E), V.target = h, V.relatedTarget = xe, L = V), xe = L, A && U) t: {
              for (V = A, m = U, p = 0, h = V; h; h = gn(h)) p++;
              for (h = 0, L = m; L; L = gn(L)) h++;
              for (; 0 < p - h; ) V = gn(V), p--;
              for (; 0 < h - p; ) m = gn(m), h--;
              for (; p--; ) {
                if (V === m || m !== null && V === m.alternate) break t;
                V = gn(V), m = gn(m);
              }
              V = null;
            }
            else V = null;
            A !== null && ls(C, _, A, V, !1), U !== null && xe !== null && ls(C, xe, U, V, !0);
          }
        }
        e: {
          if (_ = y ? Sn(y) : window, A = _.nodeName && _.nodeName.toLowerCase(), A === "select" || A === "input" && _.type === "file") var Q = mf;
          else if (Mu(_)) if (Uu) Q = gf;
          else {
            Q = yf;
            var $ = hf;
          }
          else (A = _.nodeName) && A.toLowerCase() === "input" && (_.type === "checkbox" || _.type === "radio") && (Q = vf);
          if (Q && (Q = Q(e, y))) {
            Fu(C, Q, n, E);
            break e;
          }
          $ && $(e, _, y), e === "focusout" && ($ = _._wrapperState) && $.controlled && _.type === "number" && Bl(_, "number", _.value);
        }
        switch ($ = y ? Sn(y) : window, e) {
          case "focusin":
            (Mu($) || $.contentEditable === "true") && (yn = $, go = y, er = null);
            break;
          case "focusout":
            er = go = yn = null;
            break;
          case "mousedown":
            wo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            wo = !1, qu(C, n, E);
            break;
          case "selectionchange":
            if (kf) break;
          case "keydown":
          case "keyup":
            qu(C, n, E);
        }
        var K;
        if (mo) e: {
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
        else hn ? Du(e, n) && (G = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (G = "onCompositionStart");
        G && (Ou && n.locale !== "ko" && (hn || G !== "onCompositionStart" ? G === "onCompositionEnd" && hn && (K = Nu()) : (zt = E, uo = "value" in zt ? zt.value : zt.textContent, hn = !0)), $ = $r(y, G), 0 < $.length && (G = new Tu(G, e, null, n, E), C.push({ event: G, listeners: $ }), K ? G.data = K : (K = Au(n), K !== null && (G.data = K)))), (K = af ? cf(e, n) : ff(e, n)) && (y = $r(y, "onBeforeInput"), 0 < y.length && (E = new Tu("onBeforeInput", "beforeinput", null, n, E), C.push({ event: E, listeners: y }), E.data = K));
      }
      ns(C, t);
    });
  }
  function rr(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function $r(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, o = l.stateNode;
      l.tag === 5 && o !== null && (l = o, o = Fn(e, n), o != null && r.unshift(rr(e, o, l)), o = Fn(e, t), o != null && r.push(rr(e, o, l))), e = e.return;
    }
    return r;
  }
  function gn(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function ls(e, t, n, r, l) {
    for (var o = t._reactName, i = []; n !== null && n !== r; ) {
      var s = n, c = s.alternate, y = s.stateNode;
      if (c !== null && c === r) break;
      s.tag === 5 && y !== null && (s = y, l ? (c = Fn(n, o), c != null && i.unshift(rr(n, c, s))) : l || (c = Fn(n, o), c != null && i.push(rr(n, c, s)))), n = n.return;
    }
    i.length !== 0 && e.push({ event: t, listeners: i });
  }
  var xf = /\r\n?/g, Pf = /\u0000|\uFFFD/g;
  function os(e) {
    return (typeof e == "string" ? e : "" + e).replace(xf, `
`).replace(Pf, "");
  }
  function Kr(e, t, n) {
    if (t = os(t), os(e) !== t && n) throw Error(u(425));
  }
  function qr() {
  }
  var xo = null, Po = null;
  function No(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Ro = typeof setTimeout == "function" ? setTimeout : void 0, Nf = typeof clearTimeout == "function" ? clearTimeout : void 0, is = typeof Promise == "function" ? Promise : void 0, Rf = typeof queueMicrotask == "function" ? queueMicrotask : typeof is < "u" ? function(e) {
    return is.resolve(null).then(e).catch(Lf);
  } : Ro;
  function Lf(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function Lo(e, t) {
    var n = t, r = 0;
    do {
      var l = n.nextSibling;
      if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
        if (r === 0) {
          e.removeChild(l), qn(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    qn(t);
  }
  function At(e) {
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
  function us(e) {
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
  var wn = Math.random().toString(36).slice(2), gt = "__reactFiber$" + wn, lr = "__reactProps$" + wn, _t = "__reactContainer$" + wn, To = "__reactEvents$" + wn, Tf = "__reactListeners$" + wn, If = "__reactHandles$" + wn;
  function Xt(e) {
    var t = e[gt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[_t] || n[gt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = us(e); e !== null; ) {
          if (n = e[gt]) return n;
          e = us(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function or(e) {
    return e = e[gt] || e[_t], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function Sn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(u(33));
  }
  function Yr(e) {
    return e[lr] || null;
  }
  var Io = [], kn = -1;
  function Mt(e) {
    return { current: e };
  }
  function me(e) {
    0 > kn || (e.current = Io[kn], Io[kn] = null, kn--);
  }
  function de(e, t) {
    kn++, Io[kn] = e.current, e.current = t;
  }
  var Ft = {}, Ve = Mt(Ft), Ke = Mt(!1), Jt = Ft;
  function _n(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Ft;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, o;
    for (o in n) l[o] = t[o];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function qe(e) {
    return e = e.childContextTypes, e != null;
  }
  function Gr() {
    me(Ke), me(Ve);
  }
  function ss(e, t, n) {
    if (Ve.current !== Ft) throw Error(u(168));
    de(Ve, t), de(Ke, n);
  }
  function as(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(u(108, fe(e) || "Unknown", l));
    return M({}, n, r);
  }
  function Xr(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Ft, Jt = Ve.current, de(Ve, e), de(Ke, Ke.current), !0;
  }
  function cs(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(u(169));
    n ? (e = as(e, t, Jt), r.__reactInternalMemoizedMergedChildContext = e, me(Ke), me(Ve), de(Ve, e)) : me(Ke), de(Ke, n);
  }
  var Et = null, Jr = !1, Oo = !1;
  function fs(e) {
    Et === null ? Et = [e] : Et.push(e);
  }
  function Of(e) {
    Jr = !0, fs(e);
  }
  function Ut() {
    if (!Oo && Et !== null) {
      Oo = !0;
      var e = 0, t = ae;
      try {
        var n = Et;
        for (ae = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        Et = null, Jr = !1;
      } catch (l) {
        throw Et !== null && (Et = Et.slice(e + 1)), pu(bl, Ut), l;
      } finally {
        ae = t, Oo = !1;
      }
    }
    return null;
  }
  var En = [], Cn = 0, Zr = null, br = 0, lt = [], ot = 0, Zt = null, Ct = 1, xt = "";
  function bt(e, t) {
    En[Cn++] = br, En[Cn++] = Zr, Zr = e, br = t;
  }
  function ds(e, t, n) {
    lt[ot++] = Ct, lt[ot++] = xt, lt[ot++] = Zt, Zt = e;
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
  function jo(e) {
    e.return !== null && (bt(e, 1), ds(e, 1, 0));
  }
  function zo(e) {
    for (; e === Zr; ) Zr = En[--Cn], En[Cn] = null, br = En[--Cn], En[Cn] = null;
    for (; e === Zt; ) Zt = lt[--ot], lt[ot] = null, xt = lt[--ot], lt[ot] = null, Ct = lt[--ot], lt[ot] = null;
  }
  var tt = null, nt = null, ge = !1, dt = null;
  function ps(e, t) {
    var n = at(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function ms(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, tt = e, nt = At(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, tt = e, nt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = Zt !== null ? { id: Ct, overflow: xt } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = at(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, tt = e, nt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Do(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Ao(e) {
    if (ge) {
      var t = nt;
      if (t) {
        var n = t;
        if (!ms(e, t)) {
          if (Do(e)) throw Error(u(418));
          t = At(n.nextSibling);
          var r = tt;
          t && ms(e, t) ? ps(r, n) : (e.flags = e.flags & -4097 | 2, ge = !1, tt = e);
        }
      } else {
        if (Do(e)) throw Error(u(418));
        e.flags = e.flags & -4097 | 2, ge = !1, tt = e;
      }
    }
  }
  function hs(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    tt = e;
  }
  function el(e) {
    if (e !== tt) return !1;
    if (!ge) return hs(e), ge = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !No(e.type, e.memoizedProps)), t && (t = nt)) {
      if (Do(e)) throw ys(), Error(u(418));
      for (; t; ) ps(e, t), t = At(t.nextSibling);
    }
    if (hs(e), e.tag === 13) {
      if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(u(317));
      e: {
        for (e = e.nextSibling, t = 0; e; ) {
          if (e.nodeType === 8) {
            var n = e.data;
            if (n === "/$") {
              if (t === 0) {
                nt = At(e.nextSibling);
                break e;
              }
              t--;
            } else n !== "$" && n !== "$!" && n !== "$?" || t++;
          }
          e = e.nextSibling;
        }
        nt = null;
      }
    } else nt = tt ? At(e.stateNode.nextSibling) : null;
    return !0;
  }
  function ys() {
    for (var e = nt; e; ) e = At(e.nextSibling);
  }
  function xn() {
    nt = tt = null, ge = !1;
  }
  function Mo(e) {
    dt === null ? dt = [e] : dt.push(e);
  }
  var jf = ne.ReactCurrentBatchConfig;
  function ir(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(u(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(u(147, e));
        var l = r, o = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === o ? t.ref : (t = function(i) {
          var s = l.refs;
          i === null ? delete s[o] : s[o] = i;
        }, t._stringRef = o, t);
      }
      if (typeof e != "string") throw Error(u(284));
      if (!n._owner) throw Error(u(290, e));
    }
    return e;
  }
  function tl(e, t) {
    throw e = Object.prototype.toString.call(t), Error(u(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function vs(e) {
    var t = e._init;
    return t(e._payload);
  }
  function gs(e) {
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
      return m = qt(m, p), m.index = 0, m.sibling = null, m;
    }
    function o(m, p, h) {
      return m.index = h, e ? (h = m.alternate, h !== null ? (h = h.index, h < p ? (m.flags |= 2, p) : h) : (m.flags |= 2, p)) : (m.flags |= 1048576, p);
    }
    function i(m) {
      return e && m.alternate === null && (m.flags |= 2), m;
    }
    function s(m, p, h, L) {
      return p === null || p.tag !== 6 ? (p = Ri(h, m.mode, L), p.return = m, p) : (p = l(p, h), p.return = m, p);
    }
    function c(m, p, h, L) {
      var Q = h.type;
      return Q === he ? E(m, p, h.props.children, L, h.key) : p !== null && (p.elementType === Q || typeof Q == "object" && Q !== null && Q.$$typeof === Ue && vs(Q) === p.type) ? (L = l(p, h.props), L.ref = ir(m, p, h), L.return = m, L) : (L = xl(h.type, h.key, h.props, null, m.mode, L), L.ref = ir(m, p, h), L.return = m, L);
    }
    function y(m, p, h, L) {
      return p === null || p.tag !== 4 || p.stateNode.containerInfo !== h.containerInfo || p.stateNode.implementation !== h.implementation ? (p = Li(h, m.mode, L), p.return = m, p) : (p = l(p, h.children || []), p.return = m, p);
    }
    function E(m, p, h, L, Q) {
      return p === null || p.tag !== 7 ? (p = sn(h, m.mode, L, Q), p.return = m, p) : (p = l(p, h), p.return = m, p);
    }
    function C(m, p, h) {
      if (typeof p == "string" && p !== "" || typeof p == "number") return p = Ri("" + p, m.mode, h), p.return = m, p;
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case ce:
            return h = xl(p.type, p.key, p.props, null, m.mode, h), h.ref = ir(m, null, p), h.return = m, h;
          case le:
            return p = Li(p, m.mode, h), p.return = m, p;
          case Ue:
            var L = p._init;
            return C(m, L(p._payload), h);
        }
        if (Dn(p) || q(p)) return p = sn(p, m.mode, h, null), p.return = m, p;
        tl(m, p);
      }
      return null;
    }
    function _(m, p, h, L) {
      var Q = p !== null ? p.key : null;
      if (typeof h == "string" && h !== "" || typeof h == "number") return Q !== null ? null : s(m, p, "" + h, L);
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case ce:
            return h.key === Q ? c(m, p, h, L) : null;
          case le:
            return h.key === Q ? y(m, p, h, L) : null;
          case Ue:
            return Q = h._init, _(
              m,
              p,
              Q(h._payload),
              L
            );
        }
        if (Dn(h) || q(h)) return Q !== null ? null : E(m, p, h, L, null);
        tl(m, h);
      }
      return null;
    }
    function A(m, p, h, L, Q) {
      if (typeof L == "string" && L !== "" || typeof L == "number") return m = m.get(h) || null, s(p, m, "" + L, Q);
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case ce:
            return m = m.get(L.key === null ? h : L.key) || null, c(p, m, L, Q);
          case le:
            return m = m.get(L.key === null ? h : L.key) || null, y(p, m, L, Q);
          case Ue:
            var $ = L._init;
            return A(m, p, h, $(L._payload), Q);
        }
        if (Dn(L) || q(L)) return m = m.get(h) || null, E(p, m, L, Q, null);
        tl(p, L);
      }
      return null;
    }
    function U(m, p, h, L) {
      for (var Q = null, $ = null, K = p, G = p = 0, je = null; K !== null && G < h.length; G++) {
        K.index > G ? (je = K, K = null) : je = K.sibling;
        var ie = _(m, K, h[G], L);
        if (ie === null) {
          K === null && (K = je);
          break;
        }
        e && K && ie.alternate === null && t(m, K), p = o(ie, p, G), $ === null ? Q = ie : $.sibling = ie, $ = ie, K = je;
      }
      if (G === h.length) return n(m, K), ge && bt(m, G), Q;
      if (K === null) {
        for (; G < h.length; G++) K = C(m, h[G], L), K !== null && (p = o(K, p, G), $ === null ? Q = K : $.sibling = K, $ = K);
        return ge && bt(m, G), Q;
      }
      for (K = r(m, K); G < h.length; G++) je = A(K, m, G, h[G], L), je !== null && (e && je.alternate !== null && K.delete(je.key === null ? G : je.key), p = o(je, p, G), $ === null ? Q = je : $.sibling = je, $ = je);
      return e && K.forEach(function(Yt) {
        return t(m, Yt);
      }), ge && bt(m, G), Q;
    }
    function V(m, p, h, L) {
      var Q = q(h);
      if (typeof Q != "function") throw Error(u(150));
      if (h = Q.call(h), h == null) throw Error(u(151));
      for (var $ = Q = null, K = p, G = p = 0, je = null, ie = h.next(); K !== null && !ie.done; G++, ie = h.next()) {
        K.index > G ? (je = K, K = null) : je = K.sibling;
        var Yt = _(m, K, ie.value, L);
        if (Yt === null) {
          K === null && (K = je);
          break;
        }
        e && K && Yt.alternate === null && t(m, K), p = o(Yt, p, G), $ === null ? Q = Yt : $.sibling = Yt, $ = Yt, K = je;
      }
      if (ie.done) return n(
        m,
        K
      ), ge && bt(m, G), Q;
      if (K === null) {
        for (; !ie.done; G++, ie = h.next()) ie = C(m, ie.value, L), ie !== null && (p = o(ie, p, G), $ === null ? Q = ie : $.sibling = ie, $ = ie);
        return ge && bt(m, G), Q;
      }
      for (K = r(m, K); !ie.done; G++, ie = h.next()) ie = A(K, m, G, ie.value, L), ie !== null && (e && ie.alternate !== null && K.delete(ie.key === null ? G : ie.key), p = o(ie, p, G), $ === null ? Q = ie : $.sibling = ie, $ = ie);
      return e && K.forEach(function(dd) {
        return t(m, dd);
      }), ge && bt(m, G), Q;
    }
    function xe(m, p, h, L) {
      if (typeof h == "object" && h !== null && h.type === he && h.key === null && (h = h.props.children), typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case ce:
            e: {
              for (var Q = h.key, $ = p; $ !== null; ) {
                if ($.key === Q) {
                  if (Q = h.type, Q === he) {
                    if ($.tag === 7) {
                      n(m, $.sibling), p = l($, h.props.children), p.return = m, m = p;
                      break e;
                    }
                  } else if ($.elementType === Q || typeof Q == "object" && Q !== null && Q.$$typeof === Ue && vs(Q) === $.type) {
                    n(m, $.sibling), p = l($, h.props), p.ref = ir(m, $, h), p.return = m, m = p;
                    break e;
                  }
                  n(m, $);
                  break;
                } else t(m, $);
                $ = $.sibling;
              }
              h.type === he ? (p = sn(h.props.children, m.mode, L, h.key), p.return = m, m = p) : (L = xl(h.type, h.key, h.props, null, m.mode, L), L.ref = ir(m, p, h), L.return = m, m = L);
            }
            return i(m);
          case le:
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
              p = Li(h, m.mode, L), p.return = m, m = p;
            }
            return i(m);
          case Ue:
            return $ = h._init, xe(m, p, $(h._payload), L);
        }
        if (Dn(h)) return U(m, p, h, L);
        if (q(h)) return V(m, p, h, L);
        tl(m, h);
      }
      return typeof h == "string" && h !== "" || typeof h == "number" ? (h = "" + h, p !== null && p.tag === 6 ? (n(m, p.sibling), p = l(p, h), p.return = m, m = p) : (n(m, p), p = Ri(h, m.mode, L), p.return = m, m = p), i(m)) : n(m, p);
    }
    return xe;
  }
  var Pn = gs(!0), ws = gs(!1), nl = Mt(null), rl = null, Nn = null, Fo = null;
  function Uo() {
    Fo = Nn = rl = null;
  }
  function Vo(e) {
    var t = nl.current;
    me(nl), e._currentValue = t;
  }
  function Wo(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Rn(e, t) {
    rl = e, Fo = Nn = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Ye = !0), e.firstContext = null);
  }
  function it(e) {
    var t = e._currentValue;
    if (Fo !== e) if (e = { context: e, memoizedValue: t, next: null }, Nn === null) {
      if (rl === null) throw Error(u(308));
      Nn = e, rl.dependencies = { lanes: 0, firstContext: e };
    } else Nn = Nn.next = e;
    return t;
  }
  var en = null;
  function Bo(e) {
    en === null ? en = [e] : en.push(e);
  }
  function Ss(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Bo(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Pt(e, r);
  }
  function Pt(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Vt = !1;
  function Qo(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function ks(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Nt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Wt(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (oe & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Pt(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Bo(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Pt(e, n);
  }
  function ll(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, no(e, n);
    }
  }
  function _s(e, t) {
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
  function ol(e, t, n, r) {
    var l = e.updateQueue;
    Vt = !1;
    var o = l.firstBaseUpdate, i = l.lastBaseUpdate, s = l.shared.pending;
    if (s !== null) {
      l.shared.pending = null;
      var c = s, y = c.next;
      c.next = null, i === null ? o = y : i.next = y, i = c;
      var E = e.alternate;
      E !== null && (E = E.updateQueue, s = E.lastBaseUpdate, s !== i && (s === null ? E.firstBaseUpdate = y : s.next = y, E.lastBaseUpdate = c));
    }
    if (o !== null) {
      var C = l.baseState;
      i = 0, E = y = c = null, s = o;
      do {
        var _ = s.lane, A = s.eventTime;
        if ((r & _) === _) {
          E !== null && (E = E.next = {
            eventTime: A,
            lane: 0,
            tag: s.tag,
            payload: s.payload,
            callback: s.callback,
            next: null
          });
          e: {
            var U = e, V = s;
            switch (_ = t, A = n, V.tag) {
              case 1:
                if (U = V.payload, typeof U == "function") {
                  C = U.call(A, C, _);
                  break e;
                }
                C = U;
                break e;
              case 3:
                U.flags = U.flags & -65537 | 128;
              case 0:
                if (U = V.payload, _ = typeof U == "function" ? U.call(A, C, _) : U, _ == null) break e;
                C = M({}, C, _);
                break e;
              case 2:
                Vt = !0;
            }
          }
          s.callback !== null && s.lane !== 0 && (e.flags |= 64, _ = l.effects, _ === null ? l.effects = [s] : _.push(s));
        } else A = { eventTime: A, lane: _, tag: s.tag, payload: s.payload, callback: s.callback, next: null }, E === null ? (y = E = A, c = C) : E = E.next = A, i |= _;
        if (s = s.next, s === null) {
          if (s = l.shared.pending, s === null) break;
          _ = s, s = _.next, _.next = null, l.lastBaseUpdate = _, l.shared.pending = null;
        }
      } while (!0);
      if (E === null && (c = C), l.baseState = c, l.firstBaseUpdate = y, l.lastBaseUpdate = E, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          i |= l.lane, l = l.next;
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      rn |= i, e.lanes = i, e.memoizedState = C;
    }
  }
  function Es(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], l = r.callback;
      if (l !== null) {
        if (r.callback = null, r = n, typeof l != "function") throw Error(u(191, l));
        l.call(r);
      }
    }
  }
  var ur = {}, wt = Mt(ur), sr = Mt(ur), ar = Mt(ur);
  function tn(e) {
    if (e === ur) throw Error(u(174));
    return e;
  }
  function Ho(e, t) {
    switch (de(ar, t), de(sr, e), de(wt, ur), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Hl(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Hl(t, e);
    }
    me(wt), de(wt, t);
  }
  function Ln() {
    me(wt), me(sr), me(ar);
  }
  function Cs(e) {
    tn(ar.current);
    var t = tn(wt.current), n = Hl(t, e.type);
    t !== n && (de(sr, e), de(wt, n));
  }
  function $o(e) {
    sr.current === e && (me(wt), me(sr));
  }
  var Se = Mt(0);
  function il(e) {
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
  var Ko = [];
  function qo() {
    for (var e = 0; e < Ko.length; e++) Ko[e]._workInProgressVersionPrimary = null;
    Ko.length = 0;
  }
  var ul = ne.ReactCurrentDispatcher, Yo = ne.ReactCurrentBatchConfig, nn = 0, ke = null, Le = null, Ie = null, sl = !1, cr = !1, fr = 0, zf = 0;
  function We() {
    throw Error(u(321));
  }
  function Go(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!ft(e[n], t[n])) return !1;
    return !0;
  }
  function Xo(e, t, n, r, l, o) {
    if (nn = o, ke = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, ul.current = e === null || e.memoizedState === null ? Ff : Uf, e = n(r, l), cr) {
      o = 0;
      do {
        if (cr = !1, fr = 0, 25 <= o) throw Error(u(301));
        o += 1, Ie = Le = null, t.updateQueue = null, ul.current = Vf, e = n(r, l);
      } while (cr);
    }
    if (ul.current = fl, t = Le !== null && Le.next !== null, nn = 0, Ie = Le = ke = null, sl = !1, t) throw Error(u(300));
    return e;
  }
  function Jo() {
    var e = fr !== 0;
    return fr = 0, e;
  }
  function St() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Ie === null ? ke.memoizedState = Ie = e : Ie = Ie.next = e, Ie;
  }
  function ut() {
    if (Le === null) {
      var e = ke.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Le.next;
    var t = Ie === null ? ke.memoizedState : Ie.next;
    if (t !== null) Ie = t, Le = e;
    else {
      if (e === null) throw Error(u(310));
      Le = e, e = { memoizedState: Le.memoizedState, baseState: Le.baseState, baseQueue: Le.baseQueue, queue: Le.queue, next: null }, Ie === null ? ke.memoizedState = Ie = e : Ie = Ie.next = e;
    }
    return Ie;
  }
  function dr(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Zo(e) {
    var t = ut(), n = t.queue;
    if (n === null) throw Error(u(311));
    n.lastRenderedReducer = e;
    var r = Le, l = r.baseQueue, o = n.pending;
    if (o !== null) {
      if (l !== null) {
        var i = l.next;
        l.next = o.next, o.next = i;
      }
      r.baseQueue = l = o, n.pending = null;
    }
    if (l !== null) {
      o = l.next, r = r.baseState;
      var s = i = null, c = null, y = o;
      do {
        var E = y.lane;
        if ((nn & E) === E) c !== null && (c = c.next = { lane: 0, action: y.action, hasEagerState: y.hasEagerState, eagerState: y.eagerState, next: null }), r = y.hasEagerState ? y.eagerState : e(r, y.action);
        else {
          var C = {
            lane: E,
            action: y.action,
            hasEagerState: y.hasEagerState,
            eagerState: y.eagerState,
            next: null
          };
          c === null ? (s = c = C, i = r) : c = c.next = C, ke.lanes |= E, rn |= E;
        }
        y = y.next;
      } while (y !== null && y !== o);
      c === null ? i = r : c.next = s, ft(r, t.memoizedState) || (Ye = !0), t.memoizedState = r, t.baseState = i, t.baseQueue = c, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        o = l.lane, ke.lanes |= o, rn |= o, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function bo(e) {
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
      ft(o, t.memoizedState) || (Ye = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
    }
    return [o, r];
  }
  function xs() {
  }
  function Ps(e, t) {
    var n = ke, r = ut(), l = t(), o = !ft(r.memoizedState, l);
    if (o && (r.memoizedState = l, Ye = !0), r = r.queue, ei(Ls.bind(null, n, r, e), [e]), r.getSnapshot !== t || o || Ie !== null && Ie.memoizedState.tag & 1) {
      if (n.flags |= 2048, pr(9, Rs.bind(null, n, r, l, t), void 0, null), Oe === null) throw Error(u(349));
      (nn & 30) !== 0 || Ns(n, t, l);
    }
    return l;
  }
  function Ns(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = ke.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, ke.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Rs(e, t, n, r) {
    t.value = n, t.getSnapshot = r, Ts(t) && Is(e);
  }
  function Ls(e, t, n) {
    return n(function() {
      Ts(t) && Is(e);
    });
  }
  function Ts(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !ft(e, n);
    } catch {
      return !0;
    }
  }
  function Is(e) {
    var t = Pt(e, 1);
    t !== null && yt(t, e, 1, -1);
  }
  function Os(e) {
    var t = St();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: dr, lastRenderedState: e }, t.queue = e, e = e.dispatch = Mf.bind(null, ke, e), [t.memoizedState, e];
  }
  function pr(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = ke.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, ke.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function js() {
    return ut().memoizedState;
  }
  function al(e, t, n, r) {
    var l = St();
    ke.flags |= e, l.memoizedState = pr(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function cl(e, t, n, r) {
    var l = ut();
    r = r === void 0 ? null : r;
    var o = void 0;
    if (Le !== null) {
      var i = Le.memoizedState;
      if (o = i.destroy, r !== null && Go(r, i.deps)) {
        l.memoizedState = pr(t, n, o, r);
        return;
      }
    }
    ke.flags |= e, l.memoizedState = pr(1 | t, n, o, r);
  }
  function zs(e, t) {
    return al(8390656, 8, e, t);
  }
  function ei(e, t) {
    return cl(2048, 8, e, t);
  }
  function Ds(e, t) {
    return cl(4, 2, e, t);
  }
  function As(e, t) {
    return cl(4, 4, e, t);
  }
  function Ms(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function Fs(e, t, n) {
    return n = n != null ? n.concat([e]) : null, cl(4, 4, Ms.bind(null, t, e), n);
  }
  function ti() {
  }
  function Us(e, t) {
    var n = ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Go(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function Vs(e, t) {
    var n = ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Go(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function Ws(e, t, n) {
    return (nn & 21) === 0 ? (e.baseState && (e.baseState = !1, Ye = !0), e.memoizedState = n) : (ft(n, t) || (n = vu(), ke.lanes |= n, rn |= n, e.baseState = !0), t);
  }
  function Df(e, t) {
    var n = ae;
    ae = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = Yo.transition;
    Yo.transition = {};
    try {
      e(!1), t();
    } finally {
      ae = n, Yo.transition = r;
    }
  }
  function Bs() {
    return ut().memoizedState;
  }
  function Af(e, t, n) {
    var r = $t(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Qs(e)) Hs(t, n);
    else if (n = Ss(e, t, n, r), n !== null) {
      var l = $e();
      yt(n, e, r, l), $s(n, t, r);
    }
  }
  function Mf(e, t, n) {
    var r = $t(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (Qs(e)) Hs(t, l);
    else {
      var o = e.alternate;
      if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
        var i = t.lastRenderedState, s = o(i, n);
        if (l.hasEagerState = !0, l.eagerState = s, ft(s, i)) {
          var c = t.interleaved;
          c === null ? (l.next = l, Bo(t)) : (l.next = c.next, c.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = Ss(e, t, l, r), n !== null && (l = $e(), yt(n, e, r, l), $s(n, t, r));
    }
  }
  function Qs(e) {
    var t = e.alternate;
    return e === ke || t !== null && t === ke;
  }
  function Hs(e, t) {
    cr = sl = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function $s(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, no(e, n);
    }
  }
  var fl = { readContext: it, useCallback: We, useContext: We, useEffect: We, useImperativeHandle: We, useInsertionEffect: We, useLayoutEffect: We, useMemo: We, useReducer: We, useRef: We, useState: We, useDebugValue: We, useDeferredValue: We, useTransition: We, useMutableSource: We, useSyncExternalStore: We, useId: We, unstable_isNewReconciler: !1 }, Ff = { readContext: it, useCallback: function(e, t) {
    return St().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: it, useEffect: zs, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, al(
      4194308,
      4,
      Ms.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return al(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return al(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = St();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = St();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Af.bind(null, ke, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = St();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Os, useDebugValue: ti, useDeferredValue: function(e) {
    return St().memoizedState = e;
  }, useTransition: function() {
    var e = Os(!1), t = e[0];
    return e = Df.bind(null, e[1]), St().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = ke, l = St();
    if (ge) {
      if (n === void 0) throw Error(u(407));
      n = n();
    } else {
      if (n = t(), Oe === null) throw Error(u(349));
      (nn & 30) !== 0 || Ns(r, t, n);
    }
    l.memoizedState = n;
    var o = { value: n, getSnapshot: t };
    return l.queue = o, zs(Ls.bind(
      null,
      r,
      o,
      e
    ), [e]), r.flags |= 2048, pr(9, Rs.bind(null, r, o, n, t), void 0, null), n;
  }, useId: function() {
    var e = St(), t = Oe.identifierPrefix;
    if (ge) {
      var n = xt, r = Ct;
      n = (r & ~(1 << 32 - ct(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = fr++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = zf++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Uf = {
    readContext: it,
    useCallback: Us,
    useContext: it,
    useEffect: ei,
    useImperativeHandle: Fs,
    useInsertionEffect: Ds,
    useLayoutEffect: As,
    useMemo: Vs,
    useReducer: Zo,
    useRef: js,
    useState: function() {
      return Zo(dr);
    },
    useDebugValue: ti,
    useDeferredValue: function(e) {
      var t = ut();
      return Ws(t, Le.memoizedState, e);
    },
    useTransition: function() {
      var e = Zo(dr)[0], t = ut().memoizedState;
      return [e, t];
    },
    useMutableSource: xs,
    useSyncExternalStore: Ps,
    useId: Bs,
    unstable_isNewReconciler: !1
  }, Vf = { readContext: it, useCallback: Us, useContext: it, useEffect: ei, useImperativeHandle: Fs, useInsertionEffect: Ds, useLayoutEffect: As, useMemo: Vs, useReducer: bo, useRef: js, useState: function() {
    return bo(dr);
  }, useDebugValue: ti, useDeferredValue: function(e) {
    var t = ut();
    return Le === null ? t.memoizedState = e : Ws(t, Le.memoizedState, e);
  }, useTransition: function() {
    var e = bo(dr)[0], t = ut().memoizedState;
    return [e, t];
  }, useMutableSource: xs, useSyncExternalStore: Ps, useId: Bs, unstable_isNewReconciler: !1 };
  function pt(e, t) {
    if (e && e.defaultProps) {
      t = M({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function ni(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : M({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var dl = { isMounted: function(e) {
    return (e = e._reactInternals) ? Gt(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = $e(), l = $t(e), o = Nt(r, l);
    o.payload = t, n != null && (o.callback = n), t = Wt(e, o, l), t !== null && (yt(t, e, l, r), ll(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = $e(), l = $t(e), o = Nt(r, l);
    o.tag = 1, o.payload = t, n != null && (o.callback = n), t = Wt(e, o, l), t !== null && (yt(t, e, l, r), ll(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = $e(), r = $t(e), l = Nt(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Wt(e, l, r), t !== null && (yt(t, e, r, n), ll(t, e, r));
  } };
  function Ks(e, t, n, r, l, o, i) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, o, i) : t.prototype && t.prototype.isPureReactComponent ? !bn(n, r) || !bn(l, o) : !0;
  }
  function qs(e, t, n) {
    var r = !1, l = Ft, o = t.contextType;
    return typeof o == "object" && o !== null ? o = it(o) : (l = qe(t) ? Jt : Ve.current, r = t.contextTypes, o = (r = r != null) ? _n(e, l) : Ft), t = new t(n, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = dl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
  }
  function Ys(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && dl.enqueueReplaceState(t, t.state, null);
  }
  function ri(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, Qo(e);
    var o = t.contextType;
    typeof o == "object" && o !== null ? l.context = it(o) : (o = qe(t) ? Jt : Ve.current, l.context = _n(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (ni(e, t, o, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && dl.enqueueReplaceState(l, l.state, null), ol(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
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
  function li(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function oi(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var Wf = typeof WeakMap == "function" ? WeakMap : Map;
  function Gs(e, t, n) {
    n = Nt(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      wl || (wl = !0, Si = r), oi(e, t);
    }, n;
  }
  function Xs(e, t, n) {
    n = Nt(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        oi(e, t);
      };
    }
    var o = e.stateNode;
    return o !== null && typeof o.componentDidCatch == "function" && (n.callback = function() {
      oi(e, t), typeof r != "function" && (Qt === null ? Qt = /* @__PURE__ */ new Set([this]) : Qt.add(this));
      var i = t.stack;
      this.componentDidCatch(t.value, { componentStack: i !== null ? i : "" });
    }), n;
  }
  function Js(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new Wf();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = td.bind(null, e, t, n), t.then(e, e));
  }
  function Zs(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function bs(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Nt(-1, 1), t.tag = 2, Wt(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var Bf = ne.ReactCurrentOwner, Ye = !1;
  function He(e, t, n, r) {
    t.child = e === null ? ws(t, null, n, r) : Pn(t, e.child, n, r);
  }
  function ea(e, t, n, r, l) {
    n = n.render;
    var o = t.ref;
    return Rn(t, l), r = Xo(e, t, n, r, o, l), n = Jo(), e !== null && !Ye ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (ge && n && jo(t), t.flags |= 1, He(e, t, r, l), t.child);
  }
  function ta(e, t, n, r, l) {
    if (e === null) {
      var o = n.type;
      return typeof o == "function" && !Ni(o) && o.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = o, na(e, t, o, r, l)) : (e = xl(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (o = e.child, (e.lanes & l) === 0) {
      var i = o.memoizedProps;
      if (n = n.compare, n = n !== null ? n : bn, n(i, r) && e.ref === t.ref) return Rt(e, t, l);
    }
    return t.flags |= 1, e = qt(o, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function na(e, t, n, r, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (bn(o, r) && e.ref === t.ref) if (Ye = !1, t.pendingProps = r = o, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Ye = !0);
      else return t.lanes = e.lanes, Rt(e, t, l);
    }
    return ii(e, t, n, r, l);
  }
  function ra(e, t, n) {
    var r = t.pendingProps, l = r.children, o = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, de(On, rt), rt |= n;
    else {
      if ((n & 1073741824) === 0) return e = o !== null ? o.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, de(On, rt), rt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = o !== null ? o.baseLanes : n, de(On, rt), rt |= r;
    }
    else o !== null ? (r = o.baseLanes | n, t.memoizedState = null) : r = n, de(On, rt), rt |= r;
    return He(e, t, l, n), t.child;
  }
  function la(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function ii(e, t, n, r, l) {
    var o = qe(n) ? Jt : Ve.current;
    return o = _n(t, o), Rn(t, l), n = Xo(e, t, n, r, o, l), r = Jo(), e !== null && !Ye ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (ge && r && jo(t), t.flags |= 1, He(e, t, n, l), t.child);
  }
  function oa(e, t, n, r, l) {
    if (qe(n)) {
      var o = !0;
      Xr(t);
    } else o = !1;
    if (Rn(t, l), t.stateNode === null) ml(e, t), qs(t, n, r), ri(t, n, r, l), r = !0;
    else if (e === null) {
      var i = t.stateNode, s = t.memoizedProps;
      i.props = s;
      var c = i.context, y = n.contextType;
      typeof y == "object" && y !== null ? y = it(y) : (y = qe(n) ? Jt : Ve.current, y = _n(t, y));
      var E = n.getDerivedStateFromProps, C = typeof E == "function" || typeof i.getSnapshotBeforeUpdate == "function";
      C || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (s !== r || c !== y) && Ys(t, i, r, y), Vt = !1;
      var _ = t.memoizedState;
      i.state = _, ol(t, r, i, l), c = t.memoizedState, s !== r || _ !== c || Ke.current || Vt ? (typeof E == "function" && (ni(t, n, E, r), c = t.memoizedState), (s = Vt || Ks(t, n, s, r, _, c, y)) ? (C || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = c), i.props = r, i.state = c, i.context = y, r = s) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      i = t.stateNode, ks(e, t), s = t.memoizedProps, y = t.type === t.elementType ? s : pt(t.type, s), i.props = y, C = t.pendingProps, _ = i.context, c = n.contextType, typeof c == "object" && c !== null ? c = it(c) : (c = qe(n) ? Jt : Ve.current, c = _n(t, c));
      var A = n.getDerivedStateFromProps;
      (E = typeof A == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (s !== C || _ !== c) && Ys(t, i, r, c), Vt = !1, _ = t.memoizedState, i.state = _, ol(t, r, i, l);
      var U = t.memoizedState;
      s !== C || _ !== U || Ke.current || Vt ? (typeof A == "function" && (ni(t, n, A, r), U = t.memoizedState), (y = Vt || Ks(t, n, y, r, _, U, c) || !1) ? (E || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(r, U, c), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(r, U, c)), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || s === e.memoizedProps && _ === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || s === e.memoizedProps && _ === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = U), i.props = r, i.state = U, i.context = c, r = y) : (typeof i.componentDidUpdate != "function" || s === e.memoizedProps && _ === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || s === e.memoizedProps && _ === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return ui(e, t, n, r, o, l);
  }
  function ui(e, t, n, r, l, o) {
    la(e, t);
    var i = (t.flags & 128) !== 0;
    if (!r && !i) return l && cs(t, n, !1), Rt(e, t, o);
    r = t.stateNode, Bf.current = t;
    var s = i && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && i ? (t.child = Pn(t, e.child, null, o), t.child = Pn(t, null, s, o)) : He(e, t, s, o), t.memoizedState = r.state, l && cs(t, n, !0), t.child;
  }
  function ia(e) {
    var t = e.stateNode;
    t.pendingContext ? ss(e, t.pendingContext, t.pendingContext !== t.context) : t.context && ss(e, t.context, !1), Ho(e, t.containerInfo);
  }
  function ua(e, t, n, r, l) {
    return xn(), Mo(l), t.flags |= 256, He(e, t, n, r), t.child;
  }
  var si = { dehydrated: null, treeContext: null, retryLane: 0 };
  function ai(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function sa(e, t, n) {
    var r = t.pendingProps, l = Se.current, o = !1, i = (t.flags & 128) !== 0, s;
    if ((s = i) || (s = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), s ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), de(Se, l & 1), e === null)
      return Ao(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (i = r.children, e = r.fallback, o ? (r = t.mode, o = t.child, i = { mode: "hidden", children: i }, (r & 1) === 0 && o !== null ? (o.childLanes = 0, o.pendingProps = i) : o = Pl(i, r, 0, null), e = sn(e, r, n, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = ai(n), t.memoizedState = si, e) : ci(t, i));
    if (l = e.memoizedState, l !== null && (s = l.dehydrated, s !== null)) return Qf(e, t, i, r, s, l, n);
    if (o) {
      o = r.fallback, i = t.mode, l = e.child, s = l.sibling;
      var c = { mode: "hidden", children: r.children };
      return (i & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = c, t.deletions = null) : (r = qt(l, c), r.subtreeFlags = l.subtreeFlags & 14680064), s !== null ? o = qt(s, o) : (o = sn(o, i, n, null), o.flags |= 2), o.return = t, r.return = t, r.sibling = o, t.child = r, r = o, o = t.child, i = e.child.memoizedState, i = i === null ? ai(n) : { baseLanes: i.baseLanes | n, cachePool: null, transitions: i.transitions }, o.memoizedState = i, o.childLanes = e.childLanes & ~n, t.memoizedState = si, r;
    }
    return o = e.child, e = o.sibling, r = qt(o, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function ci(e, t) {
    return t = Pl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function pl(e, t, n, r) {
    return r !== null && Mo(r), Pn(t, e.child, null, n), e = ci(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Qf(e, t, n, r, l, o, i) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = li(Error(u(422))), pl(e, t, i, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = r.fallback, l = t.mode, r = Pl({ mode: "visible", children: r.children }, l, 0, null), o = sn(o, l, i, null), o.flags |= 2, r.return = t, o.return = t, r.sibling = o, t.child = r, (t.mode & 1) !== 0 && Pn(t, e.child, null, i), t.child.memoizedState = ai(i), t.memoizedState = si, o);
    if ((t.mode & 1) === 0) return pl(e, t, i, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var s = r.dgst;
      return r = s, o = Error(u(419)), r = li(o, r, void 0), pl(e, t, i, r);
    }
    if (s = (i & e.childLanes) !== 0, Ye || s) {
      if (r = Oe, r !== null) {
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
      return Pi(), r = li(Error(u(421))), pl(e, t, i, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = nd.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, nt = At(l.nextSibling), tt = t, ge = !0, dt = null, e !== null && (lt[ot++] = Ct, lt[ot++] = xt, lt[ot++] = Zt, Ct = e.id, xt = e.overflow, Zt = t), t = ci(t, r.children), t.flags |= 4096, t);
  }
  function aa(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Wo(e.return, t, n);
  }
  function fi(e, t, n, r, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = l);
  }
  function ca(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, o = r.tail;
    if (He(e, t, r.children, n), r = Se.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && aa(e, n, t);
        else if (e.tag === 19) aa(e, n, t);
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
    if (de(Se, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && il(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), fi(t, !1, l, n, o);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && il(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        fi(t, !0, n, null, o);
        break;
      case "together":
        fi(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function ml(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function Rt(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), rn |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(u(153));
    if (t.child !== null) {
      for (e = t.child, n = qt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = qt(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function Hf(e, t, n) {
    switch (t.tag) {
      case 3:
        ia(t), xn();
        break;
      case 5:
        Cs(t);
        break;
      case 1:
        qe(t.type) && Xr(t);
        break;
      case 4:
        Ho(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        de(nl, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (de(Se, Se.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? sa(e, t, n) : (de(Se, Se.current & 1), e = Rt(e, t, n), e !== null ? e.sibling : null);
        de(Se, Se.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return ca(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), de(Se, Se.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, ra(e, t, n);
    }
    return Rt(e, t, n);
  }
  var fa, di, da, pa;
  fa = function(e, t) {
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
  }, di = function() {
  }, da = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, tn(wt.current);
      var o = null;
      switch (n) {
        case "input":
          l = Vl(e, l), r = Vl(e, r), o = [];
          break;
        case "select":
          l = M({}, l, { value: void 0 }), r = M({}, r, { value: void 0 }), o = [];
          break;
        case "textarea":
          l = Ql(e, l), r = Ql(e, r), o = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = qr);
      }
      $l(n, r);
      var i;
      n = null;
      for (y in l) if (!r.hasOwnProperty(y) && l.hasOwnProperty(y) && l[y] != null) if (y === "style") {
        var s = l[y];
        for (i in s) s.hasOwnProperty(i) && (n || (n = {}), n[i] = "");
      } else y !== "dangerouslySetInnerHTML" && y !== "children" && y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && y !== "autoFocus" && (w.hasOwnProperty(y) ? o || (o = []) : (o = o || []).push(y, null));
      for (y in r) {
        var c = r[y];
        if (s = l?.[y], r.hasOwnProperty(y) && c !== s && (c != null || s != null)) if (y === "style") if (s) {
          for (i in s) !s.hasOwnProperty(i) || c && c.hasOwnProperty(i) || (n || (n = {}), n[i] = "");
          for (i in c) c.hasOwnProperty(i) && s[i] !== c[i] && (n || (n = {}), n[i] = c[i]);
        } else n || (o || (o = []), o.push(
          y,
          n
        )), n = c;
        else y === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, s = s ? s.__html : void 0, c != null && s !== c && (o = o || []).push(y, c)) : y === "children" ? typeof c != "string" && typeof c != "number" || (o = o || []).push(y, "" + c) : y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && (w.hasOwnProperty(y) ? (c != null && y === "onScroll" && pe("scroll", e), o || s === c || (o = [])) : (o = o || []).push(y, c));
      }
      n && (o = o || []).push("style", n);
      var y = o;
      (t.updateQueue = y) && (t.flags |= 4);
    }
  }, pa = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function mr(e, t) {
    if (!ge) switch (e.tailMode) {
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
  function Be(e) {
    var t = e.alternate !== null && e.alternate.child === e.child, n = 0, r = 0;
    if (t) for (var l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;
    else for (l = e.child; l !== null; ) n |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
    return e.subtreeFlags |= r, e.childLanes = n, t;
  }
  function $f(e, t, n) {
    var r = t.pendingProps;
    switch (zo(t), t.tag) {
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
        return Be(t), null;
      case 1:
        return qe(t.type) && Gr(), Be(t), null;
      case 3:
        return r = t.stateNode, Ln(), me(Ke), me(Ve), qo(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (el(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, dt !== null && (Ei(dt), dt = null))), di(e, t), Be(t), null;
      case 5:
        $o(t);
        var l = tn(ar.current);
        if (n = t.type, e !== null && t.stateNode != null) da(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(u(166));
            return Be(t), null;
          }
          if (e = tn(wt.current), el(t)) {
            r = t.stateNode, n = t.type;
            var o = t.memoizedProps;
            switch (r[gt] = t, r[lr] = o, e = (t.mode & 1) !== 0, n) {
              case "dialog":
                pe("cancel", r), pe("close", r);
                break;
              case "iframe":
              case "object":
              case "embed":
                pe("load", r);
                break;
              case "video":
              case "audio":
                for (l = 0; l < tr.length; l++) pe(tr[l], r);
                break;
              case "source":
                pe("error", r);
                break;
              case "img":
              case "image":
              case "link":
                pe(
                  "error",
                  r
                ), pe("load", r);
                break;
              case "details":
                pe("toggle", r);
                break;
              case "input":
                qi(r, o), pe("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!o.multiple }, pe("invalid", r);
                break;
              case "textarea":
                Xi(r, o), pe("invalid", r);
            }
            $l(n, o), l = null;
            for (var i in o) if (o.hasOwnProperty(i)) {
              var s = o[i];
              i === "children" ? typeof s == "string" ? r.textContent !== s && (o.suppressHydrationWarning !== !0 && Kr(r.textContent, s, e), l = ["children", s]) : typeof s == "number" && r.textContent !== "" + s && (o.suppressHydrationWarning !== !0 && Kr(
                r.textContent,
                s,
                e
              ), l = ["children", "" + s]) : w.hasOwnProperty(i) && s != null && i === "onScroll" && pe("scroll", r);
            }
            switch (n) {
              case "input":
                Er(r), Gi(r, o, !0);
                break;
              case "textarea":
                Er(r), Zi(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (r.onclick = qr);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            i = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = bi(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = i.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = i.createElement(n, { is: r.is }) : (e = i.createElement(n), n === "select" && (i = e, r.multiple ? i.multiple = !0 : r.size && (i.size = r.size))) : e = i.createElementNS(e, n), e[gt] = t, e[lr] = r, fa(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (i = Kl(n, r), n) {
                case "dialog":
                  pe("cancel", e), pe("close", e), l = r;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  pe("load", e), l = r;
                  break;
                case "video":
                case "audio":
                  for (l = 0; l < tr.length; l++) pe(tr[l], e);
                  l = r;
                  break;
                case "source":
                  pe("error", e), l = r;
                  break;
                case "img":
                case "image":
                case "link":
                  pe(
                    "error",
                    e
                  ), pe("load", e), l = r;
                  break;
                case "details":
                  pe("toggle", e), l = r;
                  break;
                case "input":
                  qi(e, r), l = Vl(e, r), pe("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = M({}, r, { value: void 0 }), pe("invalid", e);
                  break;
                case "textarea":
                  Xi(e, r), l = Ql(e, r), pe("invalid", e);
                  break;
                default:
                  l = r;
              }
              $l(n, l), s = l;
              for (o in s) if (s.hasOwnProperty(o)) {
                var c = s[o];
                o === "style" ? nu(e, c) : o === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, c != null && eu(e, c)) : o === "children" ? typeof c == "string" ? (n !== "textarea" || c !== "") && An(e, c) : typeof c == "number" && An(e, "" + c) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (w.hasOwnProperty(o) ? c != null && o === "onScroll" && pe("scroll", e) : c != null && z(e, o, c, i));
              }
              switch (n) {
                case "input":
                  Er(e), Gi(e, r, !1);
                  break;
                case "textarea":
                  Er(e), Zi(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + se(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, o = r.value, o != null ? cn(e, !!r.multiple, o, !1) : r.defaultValue != null && cn(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = qr);
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
        return Be(t), null;
      case 6:
        if (e && t.stateNode != null) pa(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(u(166));
          if (n = tn(ar.current), tn(wt.current), el(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[gt] = t, (o = r.nodeValue !== n) && (e = tt, e !== null)) switch (e.tag) {
              case 3:
                Kr(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && Kr(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            o && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[gt] = t, t.stateNode = r;
        }
        return Be(t), null;
      case 13:
        if (me(Se), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (ge && nt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) ys(), xn(), t.flags |= 98560, o = !1;
          else if (o = el(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(u(318));
              if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(u(317));
              o[gt] = t;
            } else xn(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            Be(t), o = !1;
          } else dt !== null && (Ei(dt), dt = null), o = !0;
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (Se.current & 1) !== 0 ? Te === 0 && (Te = 3) : Pi())), t.updateQueue !== null && (t.flags |= 4), Be(t), null);
      case 4:
        return Ln(), di(e, t), e === null && nr(t.stateNode.containerInfo), Be(t), null;
      case 10:
        return Vo(t.type._context), Be(t), null;
      case 17:
        return qe(t.type) && Gr(), Be(t), null;
      case 19:
        if (me(Se), o = t.memoizedState, o === null) return Be(t), null;
        if (r = (t.flags & 128) !== 0, i = o.rendering, i === null) if (r) mr(o, !1);
        else {
          if (Te !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (i = il(e), i !== null) {
              for (t.flags |= 128, mr(o, !1), r = i.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) o = n, e = r, o.flags &= 14680066, i = o.alternate, i === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = i.childLanes, o.lanes = i.lanes, o.child = i.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = i.memoizedProps, o.memoizedState = i.memoizedState, o.updateQueue = i.updateQueue, o.type = i.type, e = i.dependencies, o.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return de(Se, Se.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          o.tail !== null && Ce() > jn && (t.flags |= 128, r = !0, mr(o, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = il(i), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), mr(o, !0), o.tail === null && o.tailMode === "hidden" && !i.alternate && !ge) return Be(t), null;
          } else 2 * Ce() - o.renderingStartTime > jn && n !== 1073741824 && (t.flags |= 128, r = !0, mr(o, !1), t.lanes = 4194304);
          o.isBackwards ? (i.sibling = t.child, t.child = i) : (n = o.last, n !== null ? n.sibling = i : t.child = i, o.last = i);
        }
        return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = Ce(), t.sibling = null, n = Se.current, de(Se, r ? n & 1 | 2 : n & 1), t) : (Be(t), null);
      case 22:
      case 23:
        return xi(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (rt & 1073741824) !== 0 && (Be(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : Be(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(u(156, t.tag));
  }
  function Kf(e, t) {
    switch (zo(t), t.tag) {
      case 1:
        return qe(t.type) && Gr(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Ln(), me(Ke), me(Ve), qo(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return $o(t), null;
      case 13:
        if (me(Se), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(u(340));
          xn();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return me(Se), null;
      case 4:
        return Ln(), null;
      case 10:
        return Vo(t.type._context), null;
      case 22:
      case 23:
        return xi(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var hl = !1, Qe = !1, qf = typeof WeakSet == "function" ? WeakSet : Set, F = null;
  function In(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      _e(e, t, r);
    }
    else n.current = null;
  }
  function pi(e, t, n) {
    try {
      n();
    } catch (r) {
      _e(e, t, r);
    }
  }
  var ma = !1;
  function Yf(e, t) {
    if (xo = Dr, e = Ku(), vo(e)) {
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
          var i = 0, s = -1, c = -1, y = 0, E = 0, C = e, _ = null;
          t: for (; ; ) {
            for (var A; C !== n || l !== 0 && C.nodeType !== 3 || (s = i + l), C !== o || r !== 0 && C.nodeType !== 3 || (c = i + r), C.nodeType === 3 && (i += C.nodeValue.length), (A = C.firstChild) !== null; )
              _ = C, C = A;
            for (; ; ) {
              if (C === e) break t;
              if (_ === n && ++y === l && (s = i), _ === o && ++E === r && (c = i), (A = C.nextSibling) !== null) break;
              C = _, _ = C.parentNode;
            }
            C = A;
          }
          n = s === -1 || c === -1 ? null : { start: s, end: c };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Po = { focusedElem: e, selectionRange: n }, Dr = !1, F = t; F !== null; ) if (t = F, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, F = e;
    else for (; F !== null; ) {
      t = F;
      try {
        var U = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (U !== null) {
              var V = U.memoizedProps, xe = U.memoizedState, m = t.stateNode, p = m.getSnapshotBeforeUpdate(t.elementType === t.type ? V : pt(t.type, V), xe);
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
        _e(t, t.return, L);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, F = e;
        break;
      }
      F = t.return;
    }
    return U = ma, ma = !1, U;
  }
  function hr(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          l.destroy = void 0, o !== void 0 && pi(t, n, o);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function yl(e, t) {
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
  function mi(e) {
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
  function ha(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, ha(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[gt], delete t[lr], delete t[To], delete t[Tf], delete t[If])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function ya(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function va(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || ya(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function hi(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = qr));
    else if (r !== 4 && (e = e.child, e !== null)) for (hi(e, t, n), e = e.sibling; e !== null; ) hi(e, t, n), e = e.sibling;
  }
  function yi(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (yi(e, t, n), e = e.sibling; e !== null; ) yi(e, t, n), e = e.sibling;
  }
  var De = null, mt = !1;
  function Bt(e, t, n) {
    for (n = n.child; n !== null; ) ga(e, t, n), n = n.sibling;
  }
  function ga(e, t, n) {
    if (vt && typeof vt.onCommitFiberUnmount == "function") try {
      vt.onCommitFiberUnmount(Lr, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        Qe || In(n, t);
      case 6:
        var r = De, l = mt;
        De = null, Bt(e, t, n), De = r, mt = l, De !== null && (mt ? (e = De, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : De.removeChild(n.stateNode));
        break;
      case 18:
        De !== null && (mt ? (e = De, n = n.stateNode, e.nodeType === 8 ? Lo(e.parentNode, n) : e.nodeType === 1 && Lo(e, n), qn(e)) : Lo(De, n.stateNode));
        break;
      case 4:
        r = De, l = mt, De = n.stateNode.containerInfo, mt = !0, Bt(e, t, n), De = r, mt = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Qe && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var o = l, i = o.destroy;
            o = o.tag, i !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && pi(n, t, i), l = l.next;
          } while (l !== r);
        }
        Bt(e, t, n);
        break;
      case 1:
        if (!Qe && (In(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (s) {
          _e(n, t, s);
        }
        Bt(e, t, n);
        break;
      case 21:
        Bt(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (Qe = (r = Qe) || n.memoizedState !== null, Bt(e, t, n), Qe = r) : Bt(e, t, n);
        break;
      default:
        Bt(e, t, n);
    }
  }
  function wa(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new qf()), t.forEach(function(r) {
        var l = rd.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
    }
  }
  function ht(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var o = e, i = t, s = i;
        e: for (; s !== null; ) {
          switch (s.tag) {
            case 5:
              De = s.stateNode, mt = !1;
              break e;
            case 3:
              De = s.stateNode.containerInfo, mt = !0;
              break e;
            case 4:
              De = s.stateNode.containerInfo, mt = !0;
              break e;
          }
          s = s.return;
        }
        if (De === null) throw Error(u(160));
        ga(o, i, l), De = null, mt = !1;
        var c = l.alternate;
        c !== null && (c.return = null), l.return = null;
      } catch (y) {
        _e(l, t, y);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) Sa(t, e), t = t.sibling;
  }
  function Sa(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ht(t, e), kt(e), r & 4) {
          try {
            hr(3, e, e.return), yl(3, e);
          } catch (V) {
            _e(e, e.return, V);
          }
          try {
            hr(5, e, e.return);
          } catch (V) {
            _e(e, e.return, V);
          }
        }
        break;
      case 1:
        ht(t, e), kt(e), r & 512 && n !== null && In(n, n.return);
        break;
      case 5:
        if (ht(t, e), kt(e), r & 512 && n !== null && In(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            An(l, "");
          } catch (V) {
            _e(e, e.return, V);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var o = e.memoizedProps, i = n !== null ? n.memoizedProps : o, s = e.type, c = e.updateQueue;
          if (e.updateQueue = null, c !== null) try {
            s === "input" && o.type === "radio" && o.name != null && Yi(l, o), Kl(s, i);
            var y = Kl(s, o);
            for (i = 0; i < c.length; i += 2) {
              var E = c[i], C = c[i + 1];
              E === "style" ? nu(l, C) : E === "dangerouslySetInnerHTML" ? eu(l, C) : E === "children" ? An(l, C) : z(l, E, C, y);
            }
            switch (s) {
              case "input":
                Wl(l, o);
                break;
              case "textarea":
                Ji(l, o);
                break;
              case "select":
                var _ = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!o.multiple;
                var A = o.value;
                A != null ? cn(l, !!o.multiple, A, !1) : _ !== !!o.multiple && (o.defaultValue != null ? cn(
                  l,
                  !!o.multiple,
                  o.defaultValue,
                  !0
                ) : cn(l, !!o.multiple, o.multiple ? [] : "", !1));
            }
            l[lr] = o;
          } catch (V) {
            _e(e, e.return, V);
          }
        }
        break;
      case 6:
        if (ht(t, e), kt(e), r & 4) {
          if (e.stateNode === null) throw Error(u(162));
          l = e.stateNode, o = e.memoizedProps;
          try {
            l.nodeValue = o;
          } catch (V) {
            _e(e, e.return, V);
          }
        }
        break;
      case 3:
        if (ht(t, e), kt(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          qn(t.containerInfo);
        } catch (V) {
          _e(e, e.return, V);
        }
        break;
      case 4:
        ht(t, e), kt(e);
        break;
      case 13:
        ht(t, e), kt(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (wi = Ce())), r & 4 && wa(e);
        break;
      case 22:
        if (E = n !== null && n.memoizedState !== null, e.mode & 1 ? (Qe = (y = Qe) || E, ht(t, e), Qe = y) : ht(t, e), kt(e), r & 8192) {
          if (y = e.memoizedState !== null, (e.stateNode.isHidden = y) && !E && (e.mode & 1) !== 0) for (F = e, E = e.child; E !== null; ) {
            for (C = F = E; F !== null; ) {
              switch (_ = F, A = _.child, _.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  hr(4, _, _.return);
                  break;
                case 1:
                  In(_, _.return);
                  var U = _.stateNode;
                  if (typeof U.componentWillUnmount == "function") {
                    r = _, n = _.return;
                    try {
                      t = r, U.props = t.memoizedProps, U.state = t.memoizedState, U.componentWillUnmount();
                    } catch (V) {
                      _e(r, n, V);
                    }
                  }
                  break;
                case 5:
                  In(_, _.return);
                  break;
                case 22:
                  if (_.memoizedState !== null) {
                    Ea(C);
                    continue;
                  }
              }
              A !== null ? (A.return = _, F = A) : Ea(C);
            }
            E = E.sibling;
          }
          e: for (E = null, C = e; ; ) {
            if (C.tag === 5) {
              if (E === null) {
                E = C;
                try {
                  l = C.stateNode, y ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (s = C.stateNode, c = C.memoizedProps.style, i = c != null && c.hasOwnProperty("display") ? c.display : null, s.style.display = tu("display", i));
                } catch (V) {
                  _e(e, e.return, V);
                }
              }
            } else if (C.tag === 6) {
              if (E === null) try {
                C.stateNode.nodeValue = y ? "" : C.memoizedProps;
              } catch (V) {
                _e(e, e.return, V);
              }
            } else if ((C.tag !== 22 && C.tag !== 23 || C.memoizedState === null || C === e) && C.child !== null) {
              C.child.return = C, C = C.child;
              continue;
            }
            if (C === e) break e;
            for (; C.sibling === null; ) {
              if (C.return === null || C.return === e) break e;
              E === C && (E = null), C = C.return;
            }
            E === C && (E = null), C.sibling.return = C.return, C = C.sibling;
          }
        }
        break;
      case 19:
        ht(t, e), kt(e), r & 4 && wa(e);
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
            if (ya(n)) {
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
            r.flags & 32 && (An(l, ""), r.flags &= -33);
            var o = va(e);
            yi(e, o, l);
            break;
          case 3:
          case 4:
            var i = r.stateNode.containerInfo, s = va(e);
            hi(e, s, i);
            break;
          default:
            throw Error(u(161));
        }
      } catch (c) {
        _e(e, e.return, c);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function Gf(e, t, n) {
    F = e, ka(e);
  }
  function ka(e, t, n) {
    for (var r = (e.mode & 1) !== 0; F !== null; ) {
      var l = F, o = l.child;
      if (l.tag === 22 && r) {
        var i = l.memoizedState !== null || hl;
        if (!i) {
          var s = l.alternate, c = s !== null && s.memoizedState !== null || Qe;
          s = hl;
          var y = Qe;
          if (hl = i, (Qe = c) && !y) for (F = l; F !== null; ) i = F, c = i.child, i.tag === 22 && i.memoizedState !== null ? Ca(l) : c !== null ? (c.return = i, F = c) : Ca(l);
          for (; o !== null; ) F = o, ka(o), o = o.sibling;
          F = l, hl = s, Qe = y;
        }
        _a(e);
      } else (l.subtreeFlags & 8772) !== 0 && o !== null ? (o.return = l, F = o) : _a(e);
    }
  }
  function _a(e) {
    for (; F !== null; ) {
      var t = F;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Qe || yl(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !Qe) if (n === null) r.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : pt(t.type, n.memoizedProps);
                r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var o = t.updateQueue;
              o !== null && Es(t, o, r);
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
                Es(t, i, n);
              }
              break;
            case 5:
              var s = t.stateNode;
              if (n === null && t.flags & 4) {
                n = s;
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
                var y = t.alternate;
                if (y !== null) {
                  var E = y.memoizedState;
                  if (E !== null) {
                    var C = E.dehydrated;
                    C !== null && qn(C);
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
          Qe || t.flags & 512 && mi(t);
        } catch (_) {
          _e(t, t.return, _);
        }
      }
      if (t === e) {
        F = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, F = n;
        break;
      }
      F = t.return;
    }
  }
  function Ea(e) {
    for (; F !== null; ) {
      var t = F;
      if (t === e) {
        F = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, F = n;
        break;
      }
      F = t.return;
    }
  }
  function Ca(e) {
    for (; F !== null; ) {
      var t = F;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              yl(4, t);
            } catch (c) {
              _e(t, n, c);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (c) {
                _e(t, l, c);
              }
            }
            var o = t.return;
            try {
              mi(t);
            } catch (c) {
              _e(t, o, c);
            }
            break;
          case 5:
            var i = t.return;
            try {
              mi(t);
            } catch (c) {
              _e(t, i, c);
            }
        }
      } catch (c) {
        _e(t, t.return, c);
      }
      if (t === e) {
        F = null;
        break;
      }
      var s = t.sibling;
      if (s !== null) {
        s.return = t.return, F = s;
        break;
      }
      F = t.return;
    }
  }
  var Xf = Math.ceil, vl = ne.ReactCurrentDispatcher, vi = ne.ReactCurrentOwner, st = ne.ReactCurrentBatchConfig, oe = 0, Oe = null, Pe = null, Ae = 0, rt = 0, On = Mt(0), Te = 0, yr = null, rn = 0, gl = 0, gi = 0, vr = null, Ge = null, wi = 0, jn = 1 / 0, Lt = null, wl = !1, Si = null, Qt = null, Sl = !1, Ht = null, kl = 0, gr = 0, ki = null, _l = -1, El = 0;
  function $e() {
    return (oe & 6) !== 0 ? Ce() : _l !== -1 ? _l : _l = Ce();
  }
  function $t(e) {
    return (e.mode & 1) === 0 ? 1 : (oe & 2) !== 0 && Ae !== 0 ? Ae & -Ae : jf.transition !== null ? (El === 0 && (El = vu()), El) : (e = ae, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Pu(e.type)), e);
  }
  function yt(e, t, n, r) {
    if (50 < gr) throw gr = 0, ki = null, Error(u(185));
    Bn(e, n, r), ((oe & 2) === 0 || e !== Oe) && (e === Oe && ((oe & 2) === 0 && (gl |= n), Te === 4 && Kt(e, Ae)), Xe(e, r), n === 1 && oe === 0 && (t.mode & 1) === 0 && (jn = Ce() + 500, Jr && Ut()));
  }
  function Xe(e, t) {
    var n = e.callbackNode;
    Oc(e, t);
    var r = Or(e, e === Oe ? Ae : 0);
    if (r === 0) n !== null && mu(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && mu(n), t === 1) e.tag === 0 ? Of(Pa.bind(null, e)) : fs(Pa.bind(null, e)), Rf(function() {
        (oe & 6) === 0 && Ut();
      }), n = null;
      else {
        switch (gu(r)) {
          case 1:
            n = bl;
            break;
          case 4:
            n = hu;
            break;
          case 16:
            n = Rr;
            break;
          case 536870912:
            n = yu;
            break;
          default:
            n = Rr;
        }
        n = za(n, xa.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function xa(e, t) {
    if (_l = -1, El = 0, (oe & 6) !== 0) throw Error(u(327));
    var n = e.callbackNode;
    if (zn() && e.callbackNode !== n) return null;
    var r = Or(e, e === Oe ? Ae : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Cl(e, r);
    else {
      t = r;
      var l = oe;
      oe |= 2;
      var o = Ra();
      (Oe !== e || Ae !== t) && (Lt = null, jn = Ce() + 500, on(e, t));
      do
        try {
          bf();
          break;
        } catch (s) {
          Na(e, s);
        }
      while (!0);
      Uo(), vl.current = o, oe = l, Pe !== null ? t = 0 : (Oe = null, Ae = 0, t = Te);
    }
    if (t !== 0) {
      if (t === 2 && (l = eo(e), l !== 0 && (r = l, t = _i(e, l))), t === 1) throw n = yr, on(e, 0), Kt(e, r), Xe(e, Ce()), n;
      if (t === 6) Kt(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !Jf(l) && (t = Cl(e, r), t === 2 && (o = eo(e), o !== 0 && (r = o, t = _i(e, o))), t === 1)) throw n = yr, on(e, 0), Kt(e, r), Xe(e, Ce()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(u(345));
          case 2:
            un(e, Ge, Lt);
            break;
          case 3:
            if (Kt(e, r), (r & 130023424) === r && (t = wi + 500 - Ce(), 10 < t)) {
              if (Or(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                $e(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = Ro(un.bind(null, e, Ge, Lt), t);
              break;
            }
            un(e, Ge, Lt);
            break;
          case 4:
            if (Kt(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var i = 31 - ct(r);
              o = 1 << i, i = t[i], i > l && (l = i), r &= ~o;
            }
            if (r = l, r = Ce() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Xf(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = Ro(un.bind(null, e, Ge, Lt), r);
              break;
            }
            un(e, Ge, Lt);
            break;
          case 5:
            un(e, Ge, Lt);
            break;
          default:
            throw Error(u(329));
        }
      }
    }
    return Xe(e, Ce()), e.callbackNode === n ? xa.bind(null, e) : null;
  }
  function _i(e, t) {
    var n = vr;
    return e.current.memoizedState.isDehydrated && (on(e, t).flags |= 256), e = Cl(e, t), e !== 2 && (t = Ge, Ge = n, t !== null && Ei(t)), e;
  }
  function Ei(e) {
    Ge === null ? Ge = e : Ge.push.apply(Ge, e);
  }
  function Jf(e) {
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
  function Kt(e, t) {
    for (t &= ~gi, t &= ~gl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - ct(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function Pa(e) {
    if ((oe & 6) !== 0) throw Error(u(327));
    zn();
    var t = Or(e, 0);
    if ((t & 1) === 0) return Xe(e, Ce()), null;
    var n = Cl(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = eo(e);
      r !== 0 && (t = r, n = _i(e, r));
    }
    if (n === 1) throw n = yr, on(e, 0), Kt(e, t), Xe(e, Ce()), n;
    if (n === 6) throw Error(u(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, un(e, Ge, Lt), Xe(e, Ce()), null;
  }
  function Ci(e, t) {
    var n = oe;
    oe |= 1;
    try {
      return e(t);
    } finally {
      oe = n, oe === 0 && (jn = Ce() + 500, Jr && Ut());
    }
  }
  function ln(e) {
    Ht !== null && Ht.tag === 0 && (oe & 6) === 0 && zn();
    var t = oe;
    oe |= 1;
    var n = st.transition, r = ae;
    try {
      if (st.transition = null, ae = 1, e) return e();
    } finally {
      ae = r, st.transition = n, oe = t, (oe & 6) === 0 && Ut();
    }
  }
  function xi() {
    rt = On.current, me(On);
  }
  function on(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Nf(n)), Pe !== null) for (n = Pe.return; n !== null; ) {
      var r = n;
      switch (zo(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && Gr();
          break;
        case 3:
          Ln(), me(Ke), me(Ve), qo();
          break;
        case 5:
          $o(r);
          break;
        case 4:
          Ln();
          break;
        case 13:
          me(Se);
          break;
        case 19:
          me(Se);
          break;
        case 10:
          Vo(r.type._context);
          break;
        case 22:
        case 23:
          xi();
      }
      n = n.return;
    }
    if (Oe = e, Pe = e = qt(e.current, null), Ae = rt = t, Te = 0, yr = null, gi = gl = rn = 0, Ge = vr = null, en !== null) {
      for (t = 0; t < en.length; t++) if (n = en[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var l = r.next, o = n.pending;
        if (o !== null) {
          var i = o.next;
          o.next = l, r.next = i;
        }
        n.pending = r;
      }
      en = null;
    }
    return e;
  }
  function Na(e, t) {
    do {
      var n = Pe;
      try {
        if (Uo(), ul.current = fl, sl) {
          for (var r = ke.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          sl = !1;
        }
        if (nn = 0, Ie = Le = ke = null, cr = !1, fr = 0, vi.current = null, n === null || n.return === null) {
          Te = 1, yr = t, Pe = null;
          break;
        }
        e: {
          var o = e, i = n.return, s = n, c = t;
          if (t = Ae, s.flags |= 32768, c !== null && typeof c == "object" && typeof c.then == "function") {
            var y = c, E = s, C = E.tag;
            if ((E.mode & 1) === 0 && (C === 0 || C === 11 || C === 15)) {
              var _ = E.alternate;
              _ ? (E.updateQueue = _.updateQueue, E.memoizedState = _.memoizedState, E.lanes = _.lanes) : (E.updateQueue = null, E.memoizedState = null);
            }
            var A = Zs(i);
            if (A !== null) {
              A.flags &= -257, bs(A, i, s, o, t), A.mode & 1 && Js(o, y, t), t = A, c = y;
              var U = t.updateQueue;
              if (U === null) {
                var V = /* @__PURE__ */ new Set();
                V.add(c), t.updateQueue = V;
              } else U.add(c);
              break e;
            } else {
              if ((t & 1) === 0) {
                Js(o, y, t), Pi();
                break e;
              }
              c = Error(u(426));
            }
          } else if (ge && s.mode & 1) {
            var xe = Zs(i);
            if (xe !== null) {
              (xe.flags & 65536) === 0 && (xe.flags |= 256), bs(xe, i, s, o, t), Mo(Tn(c, s));
              break e;
            }
          }
          o = c = Tn(c, s), Te !== 4 && (Te = 2), vr === null ? vr = [o] : vr.push(o), o = i;
          do {
            switch (o.tag) {
              case 3:
                o.flags |= 65536, t &= -t, o.lanes |= t;
                var m = Gs(o, c, t);
                _s(o, m);
                break e;
              case 1:
                s = c;
                var p = o.type, h = o.stateNode;
                if ((o.flags & 128) === 0 && (typeof p.getDerivedStateFromError == "function" || h !== null && typeof h.componentDidCatch == "function" && (Qt === null || !Qt.has(h)))) {
                  o.flags |= 65536, t &= -t, o.lanes |= t;
                  var L = Xs(o, s, t);
                  _s(o, L);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        Ta(n);
      } catch (Q) {
        t = Q, Pe === n && n !== null && (Pe = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Ra() {
    var e = vl.current;
    return vl.current = fl, e === null ? fl : e;
  }
  function Pi() {
    (Te === 0 || Te === 3 || Te === 2) && (Te = 4), Oe === null || (rn & 268435455) === 0 && (gl & 268435455) === 0 || Kt(Oe, Ae);
  }
  function Cl(e, t) {
    var n = oe;
    oe |= 2;
    var r = Ra();
    (Oe !== e || Ae !== t) && (Lt = null, on(e, t));
    do
      try {
        Zf();
        break;
      } catch (l) {
        Na(e, l);
      }
    while (!0);
    if (Uo(), oe = n, vl.current = r, Pe !== null) throw Error(u(261));
    return Oe = null, Ae = 0, Te;
  }
  function Zf() {
    for (; Pe !== null; ) La(Pe);
  }
  function bf() {
    for (; Pe !== null && !Ec(); ) La(Pe);
  }
  function La(e) {
    var t = ja(e.alternate, e, rt);
    e.memoizedProps = e.pendingProps, t === null ? Ta(e) : Pe = t, vi.current = null;
  }
  function Ta(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = $f(n, t, rt), n !== null) {
          Pe = n;
          return;
        }
      } else {
        if (n = Kf(n, t), n !== null) {
          n.flags &= 32767, Pe = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          Te = 6, Pe = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        Pe = t;
        return;
      }
      Pe = t = e;
    } while (t !== null);
    Te === 0 && (Te = 5);
  }
  function un(e, t, n) {
    var r = ae, l = st.transition;
    try {
      st.transition = null, ae = 1, ed(e, t, n, r);
    } finally {
      st.transition = l, ae = r;
    }
    return null;
  }
  function ed(e, t, n, r) {
    do
      zn();
    while (Ht !== null);
    if ((oe & 6) !== 0) throw Error(u(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(u(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var o = n.lanes | n.childLanes;
    if (jc(e, o), e === Oe && (Pe = Oe = null, Ae = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || Sl || (Sl = !0, za(Rr, function() {
      return zn(), null;
    })), o = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || o) {
      o = st.transition, st.transition = null;
      var i = ae;
      ae = 1;
      var s = oe;
      oe |= 4, vi.current = null, Yf(e, n), Sa(n, e), Sf(Po), Dr = !!xo, Po = xo = null, e.current = n, Gf(n), Cc(), oe = s, ae = i, st.transition = o;
    } else e.current = n;
    if (Sl && (Sl = !1, Ht = e, kl = l), o = e.pendingLanes, o === 0 && (Qt = null), Nc(n.stateNode), Xe(e, Ce()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (wl) throw wl = !1, e = Si, Si = null, e;
    return (kl & 1) !== 0 && e.tag !== 0 && zn(), o = e.pendingLanes, (o & 1) !== 0 ? e === ki ? gr++ : (gr = 0, ki = e) : gr = 0, Ut(), null;
  }
  function zn() {
    if (Ht !== null) {
      var e = gu(kl), t = st.transition, n = ae;
      try {
        if (st.transition = null, ae = 16 > e ? 16 : e, Ht === null) var r = !1;
        else {
          if (e = Ht, Ht = null, kl = 0, (oe & 6) !== 0) throw Error(u(331));
          var l = oe;
          for (oe |= 4, F = e.current; F !== null; ) {
            var o = F, i = o.child;
            if ((F.flags & 16) !== 0) {
              var s = o.deletions;
              if (s !== null) {
                for (var c = 0; c < s.length; c++) {
                  var y = s[c];
                  for (F = y; F !== null; ) {
                    var E = F;
                    switch (E.tag) {
                      case 0:
                      case 11:
                      case 15:
                        hr(8, E, o);
                    }
                    var C = E.child;
                    if (C !== null) C.return = E, F = C;
                    else for (; F !== null; ) {
                      E = F;
                      var _ = E.sibling, A = E.return;
                      if (ha(E), E === y) {
                        F = null;
                        break;
                      }
                      if (_ !== null) {
                        _.return = A, F = _;
                        break;
                      }
                      F = A;
                    }
                  }
                }
                var U = o.alternate;
                if (U !== null) {
                  var V = U.child;
                  if (V !== null) {
                    U.child = null;
                    do {
                      var xe = V.sibling;
                      V.sibling = null, V = xe;
                    } while (V !== null);
                  }
                }
                F = o;
              }
            }
            if ((o.subtreeFlags & 2064) !== 0 && i !== null) i.return = o, F = i;
            else e: for (; F !== null; ) {
              if (o = F, (o.flags & 2048) !== 0) switch (o.tag) {
                case 0:
                case 11:
                case 15:
                  hr(9, o, o.return);
              }
              var m = o.sibling;
              if (m !== null) {
                m.return = o.return, F = m;
                break e;
              }
              F = o.return;
            }
          }
          var p = e.current;
          for (F = p; F !== null; ) {
            i = F;
            var h = i.child;
            if ((i.subtreeFlags & 2064) !== 0 && h !== null) h.return = i, F = h;
            else e: for (i = p; F !== null; ) {
              if (s = F, (s.flags & 2048) !== 0) try {
                switch (s.tag) {
                  case 0:
                  case 11:
                  case 15:
                    yl(9, s);
                }
              } catch (Q) {
                _e(s, s.return, Q);
              }
              if (s === i) {
                F = null;
                break e;
              }
              var L = s.sibling;
              if (L !== null) {
                L.return = s.return, F = L;
                break e;
              }
              F = s.return;
            }
          }
          if (oe = l, Ut(), vt && typeof vt.onPostCommitFiberRoot == "function") try {
            vt.onPostCommitFiberRoot(Lr, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        ae = n, st.transition = t;
      }
    }
    return !1;
  }
  function Ia(e, t, n) {
    t = Tn(n, t), t = Gs(e, t, 1), e = Wt(e, t, 1), t = $e(), e !== null && (Bn(e, 1, t), Xe(e, t));
  }
  function _e(e, t, n) {
    if (e.tag === 3) Ia(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Ia(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Qt === null || !Qt.has(r))) {
          e = Tn(n, e), e = Xs(t, e, 1), t = Wt(t, e, 1), e = $e(), t !== null && (Bn(t, 1, e), Xe(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function td(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = $e(), e.pingedLanes |= e.suspendedLanes & n, Oe === e && (Ae & n) === n && (Te === 4 || Te === 3 && (Ae & 130023424) === Ae && 500 > Ce() - wi ? on(e, 0) : gi |= n), Xe(e, t);
  }
  function Oa(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = Ir, Ir <<= 1, (Ir & 130023424) === 0 && (Ir = 4194304)));
    var n = $e();
    e = Pt(e, t), e !== null && (Bn(e, t, n), Xe(e, n));
  }
  function nd(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Oa(e, n);
  }
  function rd(e, t) {
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
    r !== null && r.delete(t), Oa(e, n);
  }
  var ja;
  ja = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Ke.current) Ye = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Ye = !1, Hf(e, t, n);
      Ye = (e.flags & 131072) !== 0;
    }
    else Ye = !1, ge && (t.flags & 1048576) !== 0 && ds(t, br, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        ml(e, t), e = t.pendingProps;
        var l = _n(t, Ve.current);
        Rn(t, n), l = Xo(null, t, r, e, l, n);
        var o = Jo();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, qe(r) ? (o = !0, Xr(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Qo(t), l.updater = dl, t.stateNode = l, l._reactInternals = t, ri(t, r, e, n), t = ui(null, t, r, !0, o, n)) : (t.tag = 0, ge && o && jo(t), He(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (ml(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = od(r), e = pt(r, e), l) {
            case 0:
              t = ii(null, t, r, e, n);
              break e;
            case 1:
              t = oa(null, t, r, e, n);
              break e;
            case 11:
              t = ea(null, t, r, e, n);
              break e;
            case 14:
              t = ta(null, t, r, pt(r.type, e), n);
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
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pt(r, l), ii(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pt(r, l), oa(e, t, r, l, n);
      case 3:
        e: {
          if (ia(t), e === null) throw Error(u(387));
          r = t.pendingProps, o = t.memoizedState, l = o.element, ks(e, t), ol(t, r, null, n);
          var i = t.memoizedState;
          if (r = i.element, o.isDehydrated) if (o = { element: r, isDehydrated: !1, cache: i.cache, pendingSuspenseBoundaries: i.pendingSuspenseBoundaries, transitions: i.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
            l = Tn(Error(u(423)), t), t = ua(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = Tn(Error(u(424)), t), t = ua(e, t, r, n, l);
            break e;
          } else for (nt = At(t.stateNode.containerInfo.firstChild), tt = t, ge = !0, dt = null, n = ws(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (xn(), r === l) {
              t = Rt(e, t, n);
              break e;
            }
            He(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Cs(t), e === null && Ao(t), r = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, i = l.children, No(r, l) ? i = null : o !== null && No(r, o) && (t.flags |= 32), la(e, t), He(e, t, i, n), t.child;
      case 6:
        return e === null && Ao(t), null;
      case 13:
        return sa(e, t, n);
      case 4:
        return Ho(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Pn(t, null, r, n) : He(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pt(r, l), ea(e, t, r, l, n);
      case 7:
        return He(e, t, t.pendingProps, n), t.child;
      case 8:
        return He(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return He(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, o = t.memoizedProps, i = l.value, de(nl, r._currentValue), r._currentValue = i, o !== null) if (ft(o.value, i)) {
            if (o.children === l.children && !Ke.current) {
              t = Rt(e, t, n);
              break e;
            }
          } else for (o = t.child, o !== null && (o.return = t); o !== null; ) {
            var s = o.dependencies;
            if (s !== null) {
              i = o.child;
              for (var c = s.firstContext; c !== null; ) {
                if (c.context === r) {
                  if (o.tag === 1) {
                    c = Nt(-1, n & -n), c.tag = 2;
                    var y = o.updateQueue;
                    if (y !== null) {
                      y = y.shared;
                      var E = y.pending;
                      E === null ? c.next = c : (c.next = E.next, E.next = c), y.pending = c;
                    }
                  }
                  o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Wo(
                    o.return,
                    n,
                    t
                  ), s.lanes |= n;
                  break;
                }
                c = c.next;
              }
            } else if (o.tag === 10) i = o.type === t.type ? null : o.child;
            else if (o.tag === 18) {
              if (i = o.return, i === null) throw Error(u(341));
              i.lanes |= n, s = i.alternate, s !== null && (s.lanes |= n), Wo(i, n, t), i = o.sibling;
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
          He(e, t, l.children, n), t = t.child;
        }
        return t;
      case 9:
        return l = t.type, r = t.pendingProps.children, Rn(t, n), l = it(l), r = r(l), t.flags |= 1, He(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = pt(r, t.pendingProps), l = pt(r.type, l), ta(e, t, r, l, n);
      case 15:
        return na(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pt(r, l), ml(e, t), t.tag = 1, qe(r) ? (e = !0, Xr(t)) : e = !1, Rn(t, n), qs(t, r, l), ri(t, r, l, n), ui(null, t, r, !0, e, n);
      case 19:
        return ca(e, t, n);
      case 22:
        return ra(e, t, n);
    }
    throw Error(u(156, t.tag));
  };
  function za(e, t) {
    return pu(e, t);
  }
  function ld(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function at(e, t, n, r) {
    return new ld(e, t, n, r);
  }
  function Ni(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function od(e) {
    if (typeof e == "function") return Ni(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === we) return 11;
      if (e === Fe) return 14;
    }
    return 2;
  }
  function qt(e, t) {
    var n = e.alternate;
    return n === null ? (n = at(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function xl(e, t, n, r, l, o) {
    var i = 2;
    if (r = e, typeof e == "function") Ni(e) && (i = 1);
    else if (typeof e == "string") i = 5;
    else e: switch (e) {
      case he:
        return sn(n.children, l, o, t);
      case Ne:
        i = 8, l |= 8;
        break;
      case Re:
        return e = at(12, n, t, l | 2), e.elementType = Re, e.lanes = o, e;
      case Me:
        return e = at(13, n, t, l), e.elementType = Me, e.lanes = o, e;
      case Ze:
        return e = at(19, n, t, l), e.elementType = Ze, e.lanes = o, e;
      case ye:
        return Pl(n, l, o, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case Ee:
            i = 10;
            break e;
          case W:
            i = 9;
            break e;
          case we:
            i = 11;
            break e;
          case Fe:
            i = 14;
            break e;
          case Ue:
            i = 16, r = null;
            break e;
        }
        throw Error(u(130, e == null ? e : typeof e, ""));
    }
    return t = at(i, n, t, l), t.elementType = e, t.type = r, t.lanes = o, t;
  }
  function sn(e, t, n, r) {
    return e = at(7, e, r, t), e.lanes = n, e;
  }
  function Pl(e, t, n, r) {
    return e = at(22, e, r, t), e.elementType = ye, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function Ri(e, t, n) {
    return e = at(6, e, null, t), e.lanes = n, e;
  }
  function Li(e, t, n) {
    return t = at(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function id(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = to(0), this.expirationTimes = to(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = to(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Ti(e, t, n, r, l, o, i, s, c) {
    return e = new id(e, t, n, s, c), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = at(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Qo(o), e;
  }
  function ud(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: le, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Da(e) {
    if (!e) return Ft;
    e = e._reactInternals;
    e: {
      if (Gt(e) !== e || e.tag !== 1) throw Error(u(170));
      var t = e;
      do {
        switch (t.tag) {
          case 3:
            t = t.stateNode.context;
            break e;
          case 1:
            if (qe(t.type)) {
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
      if (qe(n)) return as(e, n, t);
    }
    return t;
  }
  function Aa(e, t, n, r, l, o, i, s, c) {
    return e = Ti(n, r, !0, e, l, o, i, s, c), e.context = Da(null), n = e.current, r = $e(), l = $t(n), o = Nt(r, l), o.callback = t ?? null, Wt(n, o, l), e.current.lanes = l, Bn(e, l, r), Xe(e, r), e;
  }
  function Nl(e, t, n, r) {
    var l = t.current, o = $e(), i = $t(l);
    return n = Da(n), t.context === null ? t.context = n : t.pendingContext = n, t = Nt(o, i), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Wt(l, t, i), e !== null && (yt(e, l, i, o), ll(e, l, i)), i;
  }
  function Rl(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Ma(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Ii(e, t) {
    Ma(e, t), (e = e.alternate) && Ma(e, t);
  }
  function sd() {
    return null;
  }
  var Fa = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Oi(e) {
    this._internalRoot = e;
  }
  Ll.prototype.render = Oi.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(u(409));
    Nl(e, t, null, null);
  }, Ll.prototype.unmount = Oi.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      ln(function() {
        Nl(null, e, null, null);
      }), t[_t] = null;
    }
  };
  function Ll(e) {
    this._internalRoot = e;
  }
  Ll.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = ku();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < jt.length && t !== 0 && t < jt[n].priority; n++) ;
      jt.splice(n, 0, e), n === 0 && Cu(e);
    }
  };
  function ji(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Tl(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function Ua() {
  }
  function ad(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var o = r;
        r = function() {
          var y = Rl(i);
          o.call(y);
        };
      }
      var i = Aa(t, r, e, 0, null, !1, !1, "", Ua);
      return e._reactRootContainer = i, e[_t] = i.current, nr(e.nodeType === 8 ? e.parentNode : e), ln(), i;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var s = r;
      r = function() {
        var y = Rl(c);
        s.call(y);
      };
    }
    var c = Ti(e, 0, !1, null, null, !1, !1, "", Ua);
    return e._reactRootContainer = c, e[_t] = c.current, nr(e.nodeType === 8 ? e.parentNode : e), ln(function() {
      Nl(t, c, n, r);
    }), c;
  }
  function Il(e, t, n, r, l) {
    var o = n._reactRootContainer;
    if (o) {
      var i = o;
      if (typeof l == "function") {
        var s = l;
        l = function() {
          var c = Rl(i);
          s.call(c);
        };
      }
      Nl(t, i, e, l);
    } else i = ad(n, t, e, l, r);
    return Rl(i);
  }
  wu = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Wn(t.pendingLanes);
          n !== 0 && (no(t, n | 1), Xe(t, Ce()), (oe & 6) === 0 && (jn = Ce() + 500, Ut()));
        }
        break;
      case 13:
        ln(function() {
          var r = Pt(e, 1);
          if (r !== null) {
            var l = $e();
            yt(r, e, 1, l);
          }
        }), Ii(e, 1);
    }
  }, ro = function(e) {
    if (e.tag === 13) {
      var t = Pt(e, 134217728);
      if (t !== null) {
        var n = $e();
        yt(t, e, 134217728, n);
      }
      Ii(e, 134217728);
    }
  }, Su = function(e) {
    if (e.tag === 13) {
      var t = $t(e), n = Pt(e, t);
      if (n !== null) {
        var r = $e();
        yt(n, e, t, r);
      }
      Ii(e, t);
    }
  }, ku = function() {
    return ae;
  }, _u = function(e, t) {
    var n = ae;
    try {
      return ae = e, t();
    } finally {
      ae = n;
    }
  }, Gl = function(e, t, n) {
    switch (t) {
      case "input":
        if (Wl(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = Yr(r);
              if (!l) throw Error(u(90));
              Ki(r), Wl(r, l);
            }
          }
        }
        break;
      case "textarea":
        Ji(e, n);
        break;
      case "select":
        t = n.value, t != null && cn(e, !!n.multiple, t, !1);
    }
  }, iu = Ci, uu = ln;
  var cd = { usingClientEntryPoint: !1, Events: [or, Sn, Yr, lu, ou, Ci] }, wr = { findFiberByHostInstance: Xt, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, fd = { bundleType: wr.bundleType, version: wr.version, rendererPackageName: wr.rendererPackageName, rendererConfig: wr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ne.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = fu(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: wr.findFiberByHostInstance || sd, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ol = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ol.isDisabled && Ol.supportsFiber) try {
      Lr = Ol.inject(fd), vt = Ol;
    } catch {
    }
  }
  return Je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = cd, Je.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!ji(t)) throw Error(u(200));
    return ud(e, t, null, n);
  }, Je.createRoot = function(e, t) {
    if (!ji(e)) throw Error(u(299));
    var n = !1, r = "", l = Fa;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Ti(e, 1, !1, null, null, n, !1, r, l), e[_t] = t.current, nr(e.nodeType === 8 ? e.parentNode : e), new Oi(t);
  }, Je.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(u(188)) : (e = Object.keys(e).join(","), Error(u(268, e)));
    return e = fu(t), e = e === null ? null : e.stateNode, e;
  }, Je.flushSync = function(e) {
    return ln(e);
  }, Je.hydrate = function(e, t, n) {
    if (!Tl(t)) throw Error(u(200));
    return Il(null, e, t, !0, n);
  }, Je.hydrateRoot = function(e, t, n) {
    if (!ji(e)) throw Error(u(405));
    var r = n != null && n.hydratedSources || null, l = !1, o = "", i = Fa;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onRecoverableError !== void 0 && (i = n.onRecoverableError)), t = Aa(t, null, e, 1, n ?? null, l, !1, o, i), e[_t] = t.current, nr(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new Ll(t);
  }, Je.render = function(e, t, n) {
    if (!Tl(t)) throw Error(u(200));
    return Il(null, e, t, !1, n);
  }, Je.unmountComponentAtNode = function(e) {
    if (!Tl(e)) throw Error(u(40));
    return e._reactRootContainer ? (ln(function() {
      Il(null, null, e, !1, function() {
        e._reactRootContainer = null, e[_t] = null;
      });
    }), !0) : !1;
  }, Je.unstable_batchedUpdates = Ci, Je.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Tl(n)) throw Error(u(200));
    if (e == null || e._reactInternals === void 0) throw Error(u(38));
    return Il(e, t, n, !1, r);
  }, Je.version = "18.3.1-next-f1338f8080-20240426", Je;
}
var qa;
function wd() {
  if (qa) return Ai.exports;
  qa = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (d) {
        console.error(d);
      }
  }
  return a(), Ai.exports = /* @__PURE__ */ gd(), Ai.exports;
}
var Ya;
function Sd() {
  if (Ya) return jl;
  Ya = 1;
  var a = /* @__PURE__ */ wd();
  return jl.createRoot = a.createRoot, jl.hydrateRoot = a.hydrateRoot, jl;
}
var kd = /* @__PURE__ */ Sd(), ze = /* @__PURE__ */ $i();
const zl = /* @__PURE__ */ fc(ze), Ga = (a) => {
  let d;
  const u = /* @__PURE__ */ new Set(), v = (x, D) => {
    const S = typeof x == "function" ? x(d) : x;
    if (!Object.is(S, d)) {
      const B = d;
      d = D ?? (typeof S != "object" || S === null) ? S : Object.assign({}, d, S), u.forEach((J) => J(d, B));
    }
  }, w = () => d, O = { setState: v, getState: w, getInitialState: () => T, subscribe: (x) => (u.add(x), () => u.delete(x)) }, T = d = a(v, w, O);
  return O;
}, _d = ((a) => a ? Ga(a) : Ga), Ed = (a) => a;
function Cd(a, d = Ed) {
  const u = zl.useSyncExternalStore(
    a.subscribe,
    zl.useCallback(() => d(a.getState()), [a, d]),
    zl.useCallback(() => d(a.getInitialState()), [a, d])
  );
  return zl.useDebugValue(u), u;
}
const Xa = (a) => {
  const d = _d(a), u = (v) => Cd(d, v);
  return Object.assign(u, d), u;
}, xd = ((a) => a ? Xa(a) : Xa);
function Pd() {
  const a = new URLSearchParams(window.location.search), d = {};
  for (const [u, v] of a)
    u.includes(".") && (d[u] = v);
  return d;
}
function Nd(a) {
  const d = new URL(window.location.href);
  for (const u of [...d.searchParams.keys()])
    u.includes(".") && d.searchParams.delete(u);
  for (const [u, v] of Object.entries(a))
    v && d.searchParams.set(u, v);
  window.history.replaceState(null, "", d.toString());
}
function Rd(a) {
  let d = typeof window < "u" && window.Shopify?.routes?.root || a || "/";
  return d.endsWith("/") || (d += "/"), d + "cart/add.js";
}
async function Ld(a, d) {
  const u = Rd(a), v = await fetch(u, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ items: d })
  });
  let w = null;
  try {
    w = await v.json();
  } catch {
  }
  if (!v.ok) {
    const P = w?.description || w?.message || `Add to cart failed (HTTP ${v.status})`, k = new Error(P);
    throw k.status = v.status, k.payload = w, k;
  }
  return w;
}
function Td(a) {
  if (typeof document > "u") return;
  const d = a || null;
  document.dispatchEvent(
    new CustomEvent("cart:refresh", { bubbles: !0, detail: d })
  ), document.dispatchEvent(
    new CustomEvent("cart:added", { bubbles: !0, detail: d })
  ), document.dispatchEvent(
    new CustomEvent("cart:open", { bubbles: !0, detail: d })
  ), typeof window < "u" && typeof window.dispatchEvent == "function" && window.dispatchEvent(new CustomEvent("cart:updated", { detail: d }));
}
const Hi = "calma_preorder_intent";
function Id() {
  if (typeof window > "u") return null;
  if (window.CalmaPreorderIntent && typeof window.CalmaPreorderIntent.get == "function")
    try {
      return window.CalmaPreorderIntent.get();
    } catch {
    }
  try {
    const a = window.localStorage?.getItem(Hi);
    if (!a) return null;
    const d = JSON.parse(a);
    return !d || typeof d.expiresAt != "number" || Date.now() > d.expiresAt ? (window.localStorage.removeItem(Hi), null) : d;
  } catch {
    return null;
  }
}
function Od() {
  if (!(typeof window > "u")) {
    if (window.CalmaPreorderIntent && typeof window.CalmaPreorderIntent.clear == "function")
      try {
        window.CalmaPreorderIntent.clear();
        return;
      } catch {
      }
    try {
      window.localStorage?.removeItem(Hi);
    } catch {
    }
  }
}
function jd() {
  if (typeof window > "u") return null;
  if (window.SHOPIFY_CUSTOMER_ID) return String(window.SHOPIFY_CUSTOMER_ID);
  const a = window.ShopifyAnalytics?.meta?.page?.customerId;
  return a != null ? String(a) : null;
}
const zd = "/apps/b2b-portal/preorder/add-line";
async function Dd(a) {
  const d = await fetch(zd, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(a)
  });
  let u = null;
  try {
    u = await d.json();
  } catch {
  }
  return u || {
    error: `Preorder add-line failed (HTTP ${d.status})`
  };
}
let an = null, Ml = null, Ui = /* @__PURE__ */ new Map(), _r = "";
function Fl(a) {
  const d = (a || "").toUpperCase();
  return d.includes("DUVAR") ? "WALL" : d.includes("MASA") ? "TABLE" : d.includes("HALI") ? "FLOOR" : d.includes("TAVAN") || d.includes("SPRINKLER") ? "CEILING" : d.includes("MONITOR") || d.includes("EKRAN") || d.includes("SCREEN") ? "SCREEN MOUNT" : "GENERAL";
}
const Ul = [
  "GENERAL",
  "WALL",
  "TABLE",
  "SCREEN MOUNT",
  "CEILING",
  "FLOOR"
], Ad = [
  "[Character]NRUS_DOSEME_SERI_DUVAR",
  "[Character]NRUS_DOSEME_RENK_DUVAR",
  "[Character]NRUS_YUZEY_RENK_DUVAR",
  "[Character]NRUS_KECE_RENK_DUVAR",
  "[Character]NRUS_YUZEY_RENK_MASA",
  "[Character]NRUS_HALI_RENK",
  "[Character]NRUS_KOLTUK",
  "[Character]NRUS_PRIZ_TIPI",
  "[Character]NRUS_MEDIAWALL"
], Md = /* @__PURE__ */ new Set([
  "[Character]NRUS_Meta_Dimension",
  "[Character]NRUS_GGRACHAIR"
]), dc = [
  {
    id: "[Character]NRUS_GGRACHAIR",
    propLabel: "STOOL OPTION",
    value: "chair_no",
    displayLabel: "NO"
  }
];
async function Ja(a) {
  if (!Array.isArray(a)) return [];
  const d = a.filter(
    (P) => P.visible !== !1 && P.editable !== !1 && P.choiceList && !Md.has(P.key)
  ), u = await Promise.all(
    d.map(
      (P) => typeof P.getChoices == "function" ? P.getChoices().catch(() => []) : Promise.resolve([])
    )
  ), v = d.map((P, k) => {
    const O = u[k] || [], T = typeof P.getValue == "function" ? P.getValue() : null;
    return {
      id: P.key,
      label: P.name,
      type: O.some((x) => x.largeIcon || x.smallIcon) ? "color" : "text",
      editable: !0,
      currentValue: T?.value ?? null,
      options: O.map((x) => ({
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
  }), w = new Map(Ad.map((P, k) => [P, k]));
  return v.sort((P, k) => {
    const O = w.has(P.id) ? w.get(P.id) : 1 / 0, T = w.has(k.id) ? w.get(k.id) : 1 / 0;
    return O !== T ? O - T : 0;
  });
}
async function Vi(a) {
  if (!a) return { price: null, currency: "EUR" };
  const d = typeof a.getMainArticle == "function" ? a.getMainArticle() ?? a : a;
  try {
    if (typeof d.getCompositeCalculation == "function") {
      const u = await d.getCompositeCalculation(), v = u?.grossPrice ?? u?.netPrice ?? u?.salesPrice;
      if (v?.value != null)
        return {
          price: v.value,
          currency: v.currency || "EUR"
        };
    }
  } catch (u) {
    console.warn("[wcf] getCompositeCalculation failed (falling back to getItemProperties):", u?.message || u);
  }
  try {
    if (typeof d.getItemProperties == "function") {
      const v = (await d.getItemProperties?.())?.article;
      if (v?.salesPrice != null)
        return {
          price: v.salesPrice,
          currency: v.salesCurrency || "EUR"
        };
    }
  } catch (u) {
    console.warn("[wcf] getItemProperties failed:", u?.message || u);
  }
  return console.warn("[wcf] price could not be determined — both methods failed"), { price: null, currency: "EUR" };
}
const Za = 15e3;
async function ba() {
  if (_r) return _r;
  const a = Ml, d = an;
  if (!a || typeof a.exportObx != "function" || !d)
    return console.warn("[wcf] exportObx skipped — article/manager not ready"), "";
  const u = typeof d.getMainArticle == "function" ? d.getMainArticle() ?? d : d;
  let v;
  try {
    const w = await Promise.race([
      a.exportObx([u]),
      new Promise((P, k) => {
        v = setTimeout(
          () => k(new Error(`exportObx timed out after ${Za}ms`)),
          Za
        );
      })
    ]);
    return typeof w != "string" || !w ? (console.warn("[wcf] exportObx returned no url:", w), "") : (_r = w, console.log("[wcf] exportObx ok:", w), w);
  } catch (w) {
    return console.warn("[wcf] exportObx failed:", w?.message || w), "";
  } finally {
    clearTimeout(v);
  }
}
async function ec(a) {
  if (!Array.isArray(a)) return [];
  const d = await Promise.all(
    a.map(
      (u) => u.choiceList && typeof u.getChoices == "function" ? u.getChoices().catch(() => []) : Promise.resolve([])
    )
  );
  return a.map((u, v) => {
    const w = d[v] || [], P = typeof u.getValue == "function" ? u.getValue() : null;
    return {
      id: u.key,
      label: u.name,
      type: w.some((k) => k.largeIcon || k.smallIcon) ? "color" : "text",
      editable: !!u.editable,
      currentValue: P?.value ?? null,
      options: w.map((k) => ({
        value: k.value,
        label: k.text,
        icon: k.smallIcon || k.largeIcon || null,
        available: k.selectable !== !1
      }))
    };
  });
}
function tc(a) {
  return Array.isArray(a) ? a.map((d) => ({
    key: d.key,
    name: d.name,
    visible: !!d.visible,
    editable: !!d.editable,
    hasChoiceList: !!d.choiceList,
    value: typeof d.getValue == "function" ? d.getValue()?.value ?? null : null
  })) : [];
}
function Dl(a) {
  return a.map((d) => ({
    ...d,
    options: d.options?.map((u) => ({
      ...u,
      icon: typeof u.icon == "string" && u.icon.length > 100 ? `[icon omitted, ${u.icon.length} chars]` : u.icon
    }))
  }));
}
function nc({
  properties: a,
  price: d,
  currency: u,
  articleNumber: v,
  manufacturerId: w,
  safeQuantity: P,
  rawSnapshot: k = [],
  variantId: O = null,
  obxUrl: T = ""
}) {
  const x = /* @__PURE__ */ new Map(), D = [];
  for (const j of a) {
    if (j.currentValue == null || j.currentValue === "") continue;
    const X = Fl(j.id);
    x.has(X) || x.set(X, []);
    const z = (j.options || []).find(
      (ne) => ne.value === j.currentValue
    )?.label || String(j.currentValue);
    x.get(X).push({ label: j.label, selectedLabel: z }), D.push(z);
  }
  const S = /* @__PURE__ */ new Set();
  for (const j of x.values())
    for (const X of j) S.add(X.label);
  for (const j of dc) {
    if (S.has(j.propLabel)) continue;
    const X = Fl(j.id);
    x.has(X) || x.set(X, []), x.get(X).push({
      label: j.propLabel,
      selectedLabel: j.displayLabel
    }), D.push(j.displayLabel);
  }
  const B = [
    ...Ul.filter((j) => x.has(j)),
    ...[...x.keys()].filter((j) => !Ul.includes(j))
  ], J = {};
  let Z = 1;
  for (const j of B) {
    const X = x.get(j);
    if (!(!X || X.length === 0)) {
      J[`divider ${Z}`] = j, Z++;
      for (const { label: ue, selectedLabel: z } of X)
        J[ue] = z;
    }
  }
  const R = [
    v,
    w || null,
    ...D.slice(0, 2)
  ].filter(Boolean).join(" / ");
  return {
    _description: R,
    /*  _quantity: String(safeQuantity), */
    /* _unit: "ST", */
    _Configuration_Price: d != null ? String(d) : "",
    _currency: u || "EUR",
    _vendormat: v || "",
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
    _ext_product_id: v || "",
    // EAIWS'in ürettiği OBX dosyasının geçici URL'i — konfigürasyonun tam
    // (XML) hali. Export başarısızsa boş string gider; alan her zaman payload'da
    // bulunur ki tüketen taraf key'in varlığına güvenebilsin.
    // "_" prefix'i zorunlu: Shopify `_`-ile başlayan line item property'lerini
    // sepet/checkout/e-posta yüzeylerinde göstermez; `_pcon_full` ile aynı
    // şekilde dealer/CSR gösterim filtrelerinden de gizli kalır.
    _obxURL: T || "",
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
      articleNumber: v || "",
      manufacturerId: w || "",
      price: d ?? null,
      currency: u || "EUR",
      quantity: P,
      variantId: O != null ? String(O) : "",
      properties: Array.isArray(k) ? k : []
    }),
    // WCF konfigürasyon property'leri — "divider N" + "Label: değer" çiftleri
    ...J
  };
}
function rc(a) {
  if (a == null) return "";
  const u = String(a).match(/(\d+)\s*$/);
  return u ? u[1] : "";
}
function Al(a) {
  const d = {};
  for (const u of a)
    u.currentValue && (d[u.id] = u.currentValue);
  Nd(d);
}
const re = xd((a, d) => ({
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
    a({
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
    if (an)
      try {
        const u = await Vi(an);
        u?.price != null && a({
          price: u.price,
          currency: u.currency || d().currency
        });
      } catch (u) {
        console.warn("[store] refreshWcfPrice failed:", u?.message || u);
      }
  },
  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: setWcfReady — ConfiguratorScene WCF yüklemeyi tamamladığında
  // çağırır; article ve propMap module-level değişkenlere yazılmış olmalı.
  // ────────────────────────────────────────────────────────────────────────
  async setWcfReady(u, v, w) {
    an = u, Ml = v, Ui = new Map(w.map((S) => [S.key, S])), _r = "";
    const P = await Vi(u).catch(() => ({
      price: null,
      currency: "EUR"
    })), k = await Ja(w).catch(() => []), O = d().customIcons, T = lc(k, O);
    console.group("[pCon] Properties — raw (WCF)"), console.log("rawProps count:", w.length), console.table(
      w.map((S) => ({
        key: S.key,
        name: S.name,
        visible: S.visible,
        editable: S.editable,
        hasChoiceList: !!S.choiceList,
        value: typeof S.getValue == "function" ? S.getValue()?.value : "(n/a)"
      }))
    );
    const x = await ec(w).catch(() => []);
    console.log(
      "[pCon] Full raw properties (JSON):",
      JSON.stringify(Dl(x), null, 2)
    ), console.groupEnd(), console.group("[pCon] Properties — mapped (store)"), console.log("mapped count:", T.length), console.table(
      T.map((S) => ({
        id: S.id,
        label: S.label,
        type: S.type,
        currentValue: S.currentValue,
        optionCount: S.options?.length ?? 0
      }))
    ), console.log(
      "[pCon] Full mapped properties (JSON):",
      JSON.stringify(Dl(T), null, 2)
    ), console.groupEnd(), a({
      properties: T,
      rawSnapshot: tc(w),
      price: P.price,
      currency: P.currency || d().currency,
      cartProperties: {},
      // signal: WCF article hazır → cart butonu açılır
      loading: !1
    });
    const D = Pd();
    if (Object.keys(D).length > 0)
      for (const [S, B] of Object.entries(D)) {
        const J = T.find((Z) => Z.id === S);
        J && J.currentValue !== B && d().updateProperty(S, B).catch((Z) => console.warn("[store] URL prop apply failed:", Z.message));
      }
    else
      Al(T);
  },
  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: setWcfError — ConfiguratorScene hata durumunda çağırır.
  // ────────────────────────────────────────────────────────────────────────
  setWcfError(u) {
    a({ error: u?.message || String(u), loading: !1 });
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
  async updateProperty(u, v) {
    const w = Ui.get(u);
    if (!w || typeof w.setValue != "function") {
      console.warn("[store] updateProperty: prop not found in propMap:", u);
      return;
    }
    const { properties: P, customIcons: k } = d();
    _r = "";
    const O = P.map(
      (T) => T.id === u ? { ...T, currentValue: v } : T
    );
    a({ properties: O, updating: !0, error: null }), Al(O);
    try {
      const T = Ml?.eventArticleChanged, x = T && typeof T.addListener == "function";
      if (await new Promise((R, j) => {
        let X = !1, ue = !x, z = !1;
        const ne = setTimeout(() => {
          z || (z = !0, x && T.removeListener(le), console.warn("[store] updateProperty: eventArticleChanged timeout, proceeding"), R());
        }, 1e4);
        function ce() {
          z || !X || !ue || (z = !0, clearTimeout(ne), R());
        }
        function le() {
          T.removeListener(le), ue = !0, ce();
        }
        x && T.addListener(le), w.setValue(v).then(() => {
          X = !0, ce();
        }).catch((he) => {
          z || (z = !0, clearTimeout(ne), x && T.removeListener(le), j(he));
        });
      }), !an) throw new Error("WCF article ref lost");
      const [D, S] = await Promise.all([
        an.getProperties(),
        Vi(an)
      ]);
      Ui = new Map(D.map((R) => [R.key, R])), console.group(`[pCon] updateProperty(${u} = ${JSON.stringify(v)}) — pCon'dan gelen ham veri`), console.log("rawProps count:", D.length), console.table(
        D.map((R) => ({
          key: R.key,
          name: R.name,
          visible: R.visible,
          editable: R.editable,
          hasChoiceList: !!R.choiceList,
          value: typeof R.getValue == "function" ? R.getValue()?.value : "(n/a)"
        }))
      );
      const B = await ec(D).catch(() => []);
      console.log(
        "[pCon] updateProperty — Full raw properties (JSON, değişmemiş pCon verisi):",
        JSON.stringify(Dl(B), null, 2)
      ), console.log("[pCon] updateProperty — Fiyat (pCon'dan gelen, önceki → yeni):", {
        previousPrice: d().price,
        previousCurrency: d().currency,
        newPrice: S.price,
        newCurrency: S.currency
      }), console.groupEnd();
      const J = await Ja(D), Z = lc(J, k);
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
        JSON.stringify(Dl(Z), null, 2)
      ), console.groupEnd(), a({
        properties: Z,
        rawSnapshot: tc(D),
        price: S.price,
        currency: S.currency || d().currency,
        updating: !1
      }), Al(Z);
      try {
        Ml?.app?.viewer?.requestRenderFrame?.();
      } catch {
      }
    } catch (T) {
      console.warn("[store] updateProperty revert:", T?.message || T), Al(P), a({ properties: P, updating: !1, error: T?.message || String(T) });
    }
  },
  // ─── No-op: WCF ile hover prefetch gerekmez (client-side, anında update) ─
  prefetchProperty() {
  },
  // ─── Cart actions ─────────────────────────────────────────────────────────
  setQuantity(u) {
    const v = parseInt(u, 10);
    a({ quantity: Number.isFinite(v) && v >= 1 ? v : 1 });
  },
  setVariantId(u) {
    if (!u) return;
    const v = d().variantId;
    String(v) !== String(u) && a({ variantId: String(u), cartError: null, cartSuccess: !1 });
  },
  resetCartFeedback() {
    a({ cartError: null, cartSuccess: !1 });
  },
  resetQuoteFeedback() {
    a({ quoteError: null, quoteSuccess: !1 });
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
      rawSnapshot: v,
      price: w,
      currency: P,
      articleNumber: k,
      manufacturerId: O,
      quantity: T,
      variantId: x,
      productTitle: D,
      productImageUrl: S,
      productSku: B,
      loading: J,
      updating: Z,
      cartProperties: R,
      quoteLoading: j
    } = d();
    if (j) return !1;
    if (J || Z)
      return a({ quoteError: "Configuration is still loading. Please wait." }), !1;
    if (!R)
      return a({ quoteError: "Configuration not ready. Please wait." }), !1;
    const X = typeof window < "u" ? window.CalmaQuoteList : null;
    if (!X || typeof X.addItem != "function")
      return a({
        quoteError: "Quote list is not available. Please make sure you are signed in as a dealer."
      }), !1;
    const ue = rc(x);
    if (!ue)
      return a({
        quoteError: "Could not detect a product variant on this page. Please reload and try again."
      }), !1;
    a({ quoteLoading: !0, quoteError: null, quoteSuccess: !1 });
    const z = Math.max(1, parseInt(T, 10) || 1), ne = await ba(), ce = nc({
      properties: u,
      price: w,
      currency: P,
      articleNumber: k,
      manufacturerId: O,
      safeQuantity: z,
      rawSnapshot: v,
      variantId: ue,
      obxUrl: ne
    });
    try {
      return X.addItem({
        variant_id: ue,
        quantity: z,
        properties: ce,
        name: D || k || null,
        image: S || null,
        sku: B || k || null
      }), a({ quoteLoading: !1, quoteSuccess: !0 }), !0;
    } catch (le) {
      return console.error("[Configurator] addToQuoteList error:", le), a({
        quoteLoading: !1,
        quoteError: le?.message || "Failed to add to quote list."
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
      properties: v,
      rawSnapshot: w,
      price: P,
      currency: k,
      articleNumber: O,
      manufacturerId: T,
      quantity: x,
      variantId: D,
      routesRoot: S,
      successAction: B,
      cartLoading: J,
      updating: Z,
      loading: R,
      cartProperties: j
    } = d();
    if (J) return !1;
    if (R || Z)
      return a({ cartError: "Configuration is still loading. Please wait." }), !1;
    if (!j)
      return a({ cartError: "Configuration not ready. Please wait." }), !1;
    if (!D)
      return a({
        cartError: "Could not detect a product variant on this page. Please reload and try again."
      }), !1;
    a({ cartLoading: !0, cartError: null, cartSuccess: !1 });
    const X = Math.max(1, parseInt(x, 10) || 1), ue = await ba(), z = nc({
      properties: v,
      price: P,
      currency: k,
      articleNumber: O,
      manufacturerId: T,
      safeQuantity: X,
      rawSnapshot: w,
      variantId: rc(D),
      obxUrl: ue
    });
    console.log(
      "[cart] Shopify cart/add.js payload:",
      JSON.stringify({ items: [{ id: D, quantity: X, properties: z }] }, null, 2)
    );
    try {
      const ne = Id();
      if (ne) {
        const Ne = jd();
        let Re;
        try {
          Re = await Dd({
            logged_in_customer_id: Ne,
            draftOrderId: ne.draftOrderId,
            variantId: D,
            quantity: X,
            properties: z
          });
        } catch (W) {
          return console.error("[Configurator] Preorder add-line error:", W), window.alert("❌ Could not add to preorder. Please try again."), a({ cartLoading: !1 }), !1;
        }
        if (!Re || Re.error) {
          const W = Re?.error || "Unknown error";
          return window.alert("❌ Could not add to preorder: " + W), a({ cartLoading: !1 }), !1;
        }
        const Ee = Re.draftOrder?.name || ne.draftOrderName || "preorder";
        return window.alert("✅ Product added to Preorder " + Ee), Od(), a({ cartLoading: !1, cartSuccess: !0 }), window.location.href = "/pages/b2b-account#preorder-" + ne.draftOrderId, !0;
      }
      const le = await Ld(S, [
        {
          id: D,
          quantity: X,
          properties: z
        }
      ]);
      a({ cartLoading: !1, cartSuccess: !0 });
      const he = u ?? B;
      return he === "redirect" ? window.setTimeout(() => {
        window.location.href = (window.Shopify?.routes?.root || "/").replace(/\/$/, "") + "/cart";
      }, 0) : he === "reload" ? window.setTimeout(() => window.location.reload(), 0) : he !== "none" && Td(le), !0;
    } catch (ne) {
      return a({
        cartLoading: !1,
        cartError: ne?.message || "Failed to add to cart"
      }), !1;
    }
  },
  setLoading(u) {
    a({ loading: u });
  },
  setError(u) {
    a({ error: u });
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
      articleNumber: v,
      manufacturerId: w,
      quantity: P,
      productTitle: k,
      productImageUrl: O,
      customerName: T
    } = d(), x = Math.max(1, parseInt(P, 10) || 1), D = /* @__PURE__ */ new Map();
    for (const R of u) {
      if (R.currentValue == null || R.currentValue === "") continue;
      const j = Fl(R.id);
      D.has(j) || D.set(j, []);
      const ue = (R.options || []).find(
        (z) => z.value === R.currentValue
      )?.label || String(R.currentValue);
      D.get(j).push({ label: R.label, selectedLabel: ue });
    }
    const S = /* @__PURE__ */ new Set();
    for (const R of D.values())
      for (const j of R) S.add(j.label);
    for (const R of dc) {
      if (S.has(R.propLabel)) continue;
      const j = Fl(R.id);
      D.has(j) || D.set(j, []), D.get(j).push({
        label: R.propLabel,
        selectedLabel: R.displayLabel
      });
    }
    const B = [
      ...Ul.filter((R) => D.has(R)),
      ...[...D.keys()].filter((R) => !Ul.includes(R))
    ], J = {};
    let Z = 1;
    for (const R of B) {
      const j = D.get(R);
      if (!(!j || j.length === 0)) {
        J[`divider ${Z}`] = R, Z++;
        for (const { label: X, selectedLabel: ue } of j)
          J[X] = ue;
      }
    }
    try {
      const { exportToExcel: R } = await import("./pcon-chunk-excel-export-ClkFUrGS.js");
      await R({
        articleNumber: v,
        manufacturerId: w,
        productTitle: k,
        productImageUrl: O,
        quantity: x,
        customerName: T,
        configDividers: J
      });
    } catch (R) {
      console.error("[exportRequest] Excel export failed:", R), window.alert("Excel export failed: " + (R?.message || String(R)));
    }
  }
})), Fd = /* @__PURE__ */ new Set(["OI_NONE_PROPCLASS.PRIZ_TIPI"]), Ud = [
  { keys: ["german", "deutsch", "alman"], iconKey: "german" },
  { keys: ["multi", "universal", "coklu", "çoklu"], iconKey: "multi" },
  { keys: ["swiss", "schweiz", "isvicre", "isviçre"], iconKey: "swiss" },
  { keys: ["uk", "british", "britisch", "ingiliz"], iconKey: "uk" },
  { keys: ["us", "american", "amerikan", "amerika"], iconKey: "american" }
], Vd = "MT_TEXT.Meta_Dimension", Wd = {
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
function lc(a, d) {
  if (!d || typeof d != "object") return a;
  let u = Qd(a, d.variantPicker);
  return u = Hd(u, d.socket), u = $d(u, d.contextual), u;
}
let kr = null, oc = null;
function Bd(a) {
  if (oc === a && kr)
    return kr;
  if (oc = a, kr = /* @__PURE__ */ new Map(), a && typeof a == "object")
    for (const [d, u] of Object.entries(a))
      !d || !u || kr.set(pc(d), u);
  return kr;
}
function pc(a) {
  return String(a || "").toLowerCase().replace(/[\s_-]+/g, "");
}
function Qd(a, d) {
  const u = Bd(d);
  return u.size === 0 ? a : a.map((v) => {
    let w = !1;
    const P = v.options.map((k) => {
      if (k.icon) return k;
      const O = u.get(pc(k.value));
      return O ? (w = !0, { ...k, icon: O }) : k;
    });
    return w ? { ...v, type: "color", options: P } : v;
  });
}
function Hd(a, d) {
  return d ? a.map((u) => {
    if (!Kd(u)) return u;
    const v = qd(u.options, d), w = v.some((P) => P.icon);
    return { ...u, type: w ? "color" : u.type, options: v };
  }) : a;
}
function $d(a, d) {
  if (!d) return a;
  const v = a.find((P) => P.id === Vd)?.currentValue;
  if (!v) return a;
  const w = Wd[v];
  return w ? a.map((P) => {
    const k = w[P.id];
    if (!k) return P;
    const O = P.options.map((x) => {
      const D = k[x.value], S = D ? d[D] : null;
      return S ? { ...x, icon: S } : x;
    }), T = O.some((x) => x.icon);
    return { ...P, type: T ? "color" : P.type, options: O };
  }) : a;
}
function Kd(a) {
  return a ? Fd.has(a.id) ? !0 : /steckdose|socket|priz/i.test(a.label || "") : !1;
}
function qd(a, d) {
  return !d || !Array.isArray(a) ? a : a.map((u) => {
    const v = Yd(u, d);
    return v ? { ...u, icon: v } : u;
  });
}
function Yd(a, d) {
  const u = `${a.value || ""} ${a.label || ""}`.toLowerCase();
  for (const { keys: v, iconKey: w } of Ud)
    if (v.some((P) => u.includes(P)))
      return d[w] || null;
  return null;
}
function Gd(a, d, u = !1) {
  const v = u ? 0 : 2;
  try {
    return new Intl.NumberFormat(void 0, {
      style: "currency",
      currency: d || "EUR",
      minimumFractionDigits: v,
      maximumFractionDigits: v
    }).format(a);
  } catch {
    return u ? `${Math.ceil(Number(a))} ${d || "EUR"}` : `${Number(a).toFixed(2)} ${d || "EUR"}`;
  }
}
function Xd() {
  const a = re((v) => v.price), d = re((v) => v.currency);
  if (re((v) => v.discountPercentage), a == null)
    return /* @__PURE__ */ N.jsxs("div", { className: "pcon-price pcon-price--pending", children: [
      /* @__PURE__ */ N.jsx("span", { className: "pcon-price__label", children: "List Price" }),
      /* @__PURE__ */ N.jsx("span", { className: "pcon-price__value pcon-price__value--pending", "aria-busy": "true", children: /* @__PURE__ */ N.jsx("span", { className: "pcon-price__skeleton" }) })
    ] });
  const u = Gd(a, d);
  return /* @__PURE__ */ N.jsx("div", { className: "pcon-price-block", children: /* @__PURE__ */ N.jsxs("div", { className: "pcon-price", children: [
    /* @__PURE__ */ N.jsx("span", { className: "pcon-price__label", children: "List Price" }),
    /* @__PURE__ */ N.jsx("span", { className: "pcon-price__value", children: u })
  ] }) });
}
const ic = {
  "[Character]NRUS_DOSEME_RENK_DUVAR": "[Character]NRUS_DOSEME_SERI_DUVAR"
};
function Jd() {
  const a = re((x) => x.properties), d = re((x) => x.updateProperty), [u, v] = ze.useState(null), w = a.filter((x) => x.editable && x.options.length > 0);
  if (w.length === 0) return null;
  const P = new Set(Object.keys(ic)), k = w.filter((x) => !P.has(x.id)), O = {};
  for (const [x, D] of Object.entries(ic)) {
    const S = w.find((B) => B.id === x);
    S && (O[D] || (O[D] = []), O[D].push(S));
  }
  const T = (x) => {
    v((D) => D === x ? null : x);
  };
  return /* @__PURE__ */ N.jsx("div", { className: "pcon-properties", children: k.map((x) => /* @__PURE__ */ N.jsx(
    Zd,
    {
      prop: x,
      open: u === x.id,
      onToggle: () => T(x.id),
      onSelect: (D) => d(x.id, D),
      childProps: O[x.id] || [],
      updateProperty: d
    },
    x.id
  )) });
}
function Zd({
  prop: a,
  open: d,
  onToggle: u,
  onSelect: v,
  childProps: w = [],
  updateProperty: P
}) {
  const k = a.type === "color", O = a.options.find((S) => S.value === a.currentValue), T = (S) => {
    S.available && S.value !== a.currentValue && v(S.value);
  }, x = [
    "pcon-prop-group",
    d && "pcon-prop-group--open"
  ].filter(Boolean).join(" "), D = k ? "pcon-prop-group__body pcon-prop-group__body--colors" : "pcon-prop-group__body pcon-prop-group__body--chips";
  return /* @__PURE__ */ N.jsxs("div", { className: x, children: [
    /* @__PURE__ */ N.jsxs(
      "button",
      {
        type: "button",
        className: "pcon-prop-group__header",
        "aria-expanded": d,
        onClick: u,
        children: [
          /* @__PURE__ */ N.jsxs("span", { className: "pcon-prop-group__header-main", children: [
            /* @__PURE__ */ N.jsx("span", { className: "pcon-prop-group__label", children: a.label }),
            /* @__PURE__ */ N.jsxs("span", { className: "pcon-prop-group__summary", children: [
              k && O?.icon ? /* @__PURE__ */ N.jsx(
                "span",
                {
                  className: "pcon-prop-group__summary-swatch",
                  style: { backgroundImage: `url("${O.icon}")` },
                  "aria-hidden": "true"
                }
              ) : null,
              /* @__PURE__ */ N.jsx("span", { className: "pcon-prop-group__summary-label", children: O?.label ?? "—" })
            ] })
          ] }),
          /* @__PURE__ */ N.jsx("span", { className: "pcon-prop-group__toggle", "aria-hidden": "true", children: d ? "−" : "+" })
        ]
      }
    ),
    d && /* @__PURE__ */ N.jsx("div", { className: D, children: a.options.map((S) => {
      const B = S.value === a.currentValue;
      if (k) {
        const Z = [
          "pcon-option-swatch",
          B && "pcon-option-swatch--active",
          !S.available && "pcon-option-swatch--disabled"
        ].filter(Boolean).join(" ");
        return /* @__PURE__ */ N.jsxs(
          "button",
          {
            type: "button",
            className: Z,
            disabled: !S.available,
            title: S.label,
            onClick: () => T(S),
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
      const J = [
        "pcon-option-chip",
        B && "pcon-option-chip--active",
        !S.available && "pcon-option-chip--disabled"
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ N.jsx(
        "button",
        {
          type: "button",
          className: J,
          disabled: !S.available,
          title: S.label,
          onClick: () => T(S),
          children: S.label
        },
        S.value
      );
    }) }),
    d && w.length > 0 && /* @__PURE__ */ N.jsx("div", { className: "pcon-prop-group__nested", children: w.map((S) => /* @__PURE__ */ N.jsx(
      bd,
      {
        prop: S,
        onSelect: (B) => P(S.id, B)
      },
      S.id
    )) })
  ] });
}
function bd({ prop: a, onSelect: d }) {
  const u = a.type === "color", v = a.options.find((k) => k.value === a.currentValue), w = (k) => {
    k.available && k.value !== a.currentValue && d(k.value);
  }, P = u ? "pcon-prop-group__body pcon-prop-group__body--colors" : "pcon-prop-group__body pcon-prop-group__body--chips";
  return /* @__PURE__ */ N.jsxs("div", { className: "pcon-prop-inline", children: [
    /* @__PURE__ */ N.jsxs("div", { className: "pcon-prop-inline__header", children: [
      /* @__PURE__ */ N.jsx("span", { className: "pcon-prop-group__label", children: a.label }),
      /* @__PURE__ */ N.jsxs("span", { className: "pcon-prop-group__summary", children: [
        u && v?.icon ? /* @__PURE__ */ N.jsx(
          "span",
          {
            className: "pcon-prop-group__summary-swatch",
            style: { backgroundImage: `url("${v.icon}")` },
            "aria-hidden": "true"
          }
        ) : null,
        /* @__PURE__ */ N.jsx("span", { className: "pcon-prop-group__summary-label", children: v?.label ?? "—" })
      ] })
    ] }),
    /* @__PURE__ */ N.jsx("div", { className: P, children: a.options.map((k) => {
      const O = k.value === a.currentValue;
      if (u) {
        const x = [
          "pcon-option-swatch",
          O && "pcon-option-swatch--active",
          !k.available && "pcon-option-swatch--disabled"
        ].filter(Boolean).join(" ");
        return /* @__PURE__ */ N.jsxs(
          "button",
          {
            type: "button",
            className: x,
            disabled: !k.available,
            title: k.label,
            onClick: () => w(k),
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
      const T = [
        "pcon-option-chip",
        O && "pcon-option-chip--active",
        !k.available && "pcon-option-chip--disabled"
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ N.jsx(
        "button",
        {
          type: "button",
          className: T,
          disabled: !k.available,
          title: k.label,
          onClick: () => w(k),
          children: k.label
        },
        k.value
      );
    }) })
  ] });
}
var Wi = { exports: {} }, Bi, uc;
function ep() {
  if (uc) return Bi;
  uc = 1;
  var a = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return Bi = a, Bi;
}
var Qi, sc;
function tp() {
  if (sc) return Qi;
  sc = 1;
  var a = /* @__PURE__ */ ep();
  function d() {
  }
  function u() {
  }
  return u.resetWarningCache = d, Qi = function() {
    function v(k, O, T, x, D, S) {
      if (S !== a) {
        var B = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw B.name = "Invariant Violation", B;
      }
    }
    v.isRequired = v;
    function w() {
      return v;
    }
    var P = {
      array: v,
      bigint: v,
      bool: v,
      func: v,
      number: v,
      object: v,
      string: v,
      symbol: v,
      any: v,
      arrayOf: w,
      element: v,
      elementType: v,
      instanceOf: w,
      node: v,
      objectOf: w,
      oneOf: w,
      oneOfType: w,
      shape: w,
      exact: w,
      checkPropTypes: u,
      resetWarningCache: d
    };
    return P.PropTypes = P, P;
  }, Qi;
}
var ac;
function np() {
  return ac || (ac = 1, Wi.exports = /* @__PURE__ */ tp()()), Wi.exports;
}
var rp = /* @__PURE__ */ np();
const lp = /* @__PURE__ */ fc(rp);
function cc() {
  return typeof window < "u" && window.CalmaQuoteList && typeof window.CalmaQuoteList.addItem == "function";
}
function mc({ isGuest: a = !1 }) {
  const d = re((W) => W.quantity), u = re((W) => W.setQuantity), v = re((W) => W.addToCart), w = re((W) => W.addToQuoteList);
  re((W) => W.exportRequest);
  const P = re((W) => W.resetCartFeedback), k = re((W) => W.resetQuoteFeedback), O = re((W) => W.cartLoading), T = re((W) => W.cartError), x = re((W) => W.cartSuccess), D = re((W) => W.quoteLoading), S = re((W) => W.quoteError), B = re((W) => W.quoteSuccess), J = re((W) => W.cartProperties), Z = re((W) => W.variantId), R = re((W) => W.updating), j = re((W) => W.loading), X = re((W) => W.addToCartLabel), [ue, z] = ze.useState(!1), [ne, ce] = ze.useState(cc);
  ze.useEffect(() => {
    if (ne) return;
    let W = 0;
    const we = setInterval(() => {
      W += 1, cc() ? (ce(!0), clearInterval(we)) : W >= 20 && clearInterval(we);
    }, 500);
    return () => clearInterval(we);
  }, [ne]), ze.useEffect(() => {
    if (!x) return;
    const W = setTimeout(() => P(), 4e3);
    return () => clearTimeout(W);
  }, [x, P]), ze.useEffect(() => {
    if (!B) return;
    const W = setTimeout(() => k(), 4e3);
    return () => clearTimeout(W);
  }, [B, k]);
  const le = O || R || j || !J || !Z, he = (W) => {
    u(W.target.value);
  }, Ne = (W) => {
    u(Math.max(1, (parseInt(d, 10) || 1) + W));
  }, Re = async () => {
    if (le) return;
    await v("none") && document.dispatchEvent(
      new CustomEvent("cart:refresh", { bubbles: !0, detail: { open: !0 } })
    );
  }, Ee = async () => {
    le || D || await w();
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
            onClick: () => Ne(-1),
            disabled: O || d <= 1,
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
            value: d,
            onChange: he,
            disabled: O,
            className: "pcon-cart__qty-input"
          }
        ),
        /* @__PURE__ */ N.jsx(
          "button",
          {
            type: "button",
            className: "pcon-cart__qty-step",
            onClick: () => Ne(1),
            disabled: O,
            "aria-label": "Increase quantity",
            children: "+"
          }
        )
      ] })
    ] }),
    a ? (
      /* Guest: tek "Request a Quote" butonu */
      /* @__PURE__ */ N.jsx(
        "button",
        {
          type: "button",
          className: "pcon-cart__btn",
          onClick: Re,
          disabled: le,
          "aria-busy": O,
          children: O ? /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
            /* @__PURE__ */ N.jsx("span", { className: "pcon-cart__btn-spinner", "aria-hidden": "true" }),
            /* @__PURE__ */ N.jsx("span", { children: "Adding..." })
          ] }) : "Request a Quote"
        }
      )
    ) : /* @__PURE__ */ N.jsxs("div", { className: "pcon-cart__btn-group", children: [
      ne ? /* @__PURE__ */ N.jsx(
        "button",
        {
          type: "button",
          className: "pcon-cart__btn pcon-cart__btn--secondary",
          onClick: Ee,
          disabled: le || D,
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
          onClick: Re,
          disabled: le,
          "aria-busy": O,
          children: O ? /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
            /* @__PURE__ */ N.jsx("span", { className: "pcon-cart__btn-spinner", "aria-hidden": "true" }),
            /* @__PURE__ */ N.jsx("span", { children: "Adding..." })
          ] }) : X || "Add to Cart"
        }
      )
    ] }),
    T ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__error", role: "alert", children: T }) : null,
    x ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__success", role: "status", children: "Added to cart." }) : null,
    S ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__error", role: "alert", children: S }) : null,
    B ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__success", role: "status", children: "Teklif listesine eklendi." }) : null
  ] });
}
mc.propTypes = {
  isGuest: lp.bool
};
class op extends ze.Component {
  constructor(d) {
    super(d), this.state = { hasError: !1, error: null };
  }
  static getDerivedStateFromError(d) {
    return { hasError: !0, error: d };
  }
  componentDidCatch(d) {
    console.error("[pcon] WCF render error:", d);
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
async function ip(a, d = "en_US", u = null, v = "") {
  if (u) {
    const P = await fetch(
      `https://gatekeeper.eaiws.pcon-solutions.com/v3/session/${u}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: d })
      }
    );
    if (!P.ok)
      throw new Error(`Gatekeeper direct call failed (HTTP ${P.status})`);
    return P.json();
  }
  const w = await fetch(`${a}/api/gatekeeper-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ locale: d, region: v || "" })
  });
  if (!w.ok) {
    const P = await w.json().catch(() => ({}));
    throw new Error(
      P.error || `Gatekeeper session failed (HTTP ${w.status})`
    );
  }
  return w.json();
}
function up({ canvasHeight: a, customerLoggedIn: d }) {
  const u = re((z) => z.loading), v = re((z) => z.error), w = re((z) => z.proxyBase), P = re((z) => z.gatekeeperId), k = re((z) => z.region), O = re((z) => z.articleNumber), T = re((z) => z.manufacturerId), x = re((z) => z.setWcfReady), D = re((z) => z.setWcfError), S = re((z) => z.refreshWcfPrice), B = ze.useRef(null), J = ze.useRef(null), Z = ze.useRef(null), R = ze.useRef(null), j = ze.useRef(null), X = ze.useRef(null), ue = ze.useCallback(() => {
    try {
      X.current?.disconnect();
    } catch {
    }
    X.current = null;
    try {
      j.current && R.current && R.current.eventArticleChanged?.removeListener(
        j.current
      );
    } catch {
    }
    j.current = null, R.current = null;
    try {
      Z.current?.close?.();
    } catch {
    }
    Z.current = null;
    try {
      J.current?.dispose?.();
    } catch {
    }
    J.current = null;
  }, []);
  return ze.useEffect(() => {
    if (!O || !w) return;
    let z = !1;
    async function ne() {
      if (!(!B.current && (await new Promise((ce) => setTimeout(ce, 50)), z || !B.current)))
        try {
          const ce = await ip(w, "en_US", P || null, k || "");
          if (z) return;
          const [le, he] = await Promise.all([
            import("./pcon-chunk-engine-AgGdbLMj.js").then((f) => f.a),
            import("./pcon-chunk-engine-AgGdbLMj.js").then((f) => f.i)
          ]);
          if (z) return;
          const { Application: Ne } = le, { wcfConfig: Re } = he;
          Re.dataPath = `${w}/wcf/data/`;
          const Ee = new Ne();
          if (Ee.initialize(B.current, {
            hardwareAntialiasing: !1,
            preserveDrawingBuffer: !0,
            autoResizeViewer: !0,
            adaptToDeviceRatio: !0,
            maximumDeviceRatio: 1.5,
            audioEngine: !1
          }), J.current = Ee, z) {
            try {
              Ee.dispose?.();
            } catch {
            }
            return;
          }
          if (await new Promise((f) => requestAnimationFrame(() => requestAnimationFrame(f))), z) return;
          try {
            Ee.viewer.resize(!0);
          } catch {
          }
          if (typeof ResizeObserver < "u" && B.current) {
            const f = new ResizeObserver(() => {
              if (!z)
                try {
                  J.current?.viewer?.resize(!0);
                } catch {
                }
            });
            f.observe(B.current), X.current = f;
          }
          const { EaiwsSession: W } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((f) => f.c);
          if (z) return;
          const we = new W();
          we.connect(
            ce.server,
            ce.sessionId,
            ce.keepAliveInterval
          ), Z.current = we;
          const Me = "en";
          if (await Promise.all([
            we.catalog.setLanguages([Me]),
            we.basket.setLanguages([Me])
          ]), z) return;
          const { ArticleManager: Ze } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((f) => f.d);
          if (z) return;
          const Fe = new Ze(Ee, we);
          R.current = Fe;
          const Ue = (async () => {
            try {
              const { PricingProcedureInfo: f } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((b) => b.b), g = await we.basket.listPricingProcedures(!0);
              if (!g?.length || z) {
                console.warn("[wcf] no pricing procedures available");
                return;
              }
              const H = g[0].name;
              console.log("[wcf] setting pricing procedure:", H);
              const Y = await f.CreateInfo(
                we,
                H,
                !0
              );
              !z && R.current && (R.current.setPricingProcedure(Y), console.log("[wcf] pricing procedure ready:", H));
            } catch (f) {
              console.warn("[wcf] pricing procedure failed:", f?.message);
            }
          })(), ye = (async () => {
            try {
              const { SearchArticleParameterSet: f } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((b) => b.C), g = new f();
              g.baseArticleNumber = O, T && (g.manufacturerId = T);
              const Y = (await we.catalog.searchArticle(g))?.scoredItems?.[0]?.item;
              if (Y) {
                const { InsertInfo: b } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((fe) => fe.b), te = new b();
                return te.baseArticleNumber = Y.baseArticleNumber || O, Y.manufacturerId && (te.manufacturerId = Y.manufacturerId), Y.seriesId && (te.seriesId = Y.seriesId), await Fe.insertArticle(te);
              } else
                throw new Error(`Article not found in catalog: ${O}`);
            } catch (f) {
              console.warn(
                "[wcf] catalog search fell back to direct insert:",
                f?.message
              );
              const { InsertInfo: g } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((Y) => Y.b), H = new g();
              return H.baseArticleNumber = O, T && (H.manufacturerId = T), await Fe.insertArticle(H);
            }
          })(), [, I] = await Promise.all([
            Ue,
            ye
          ]);
          if (z || !I) return;
          Ee.model.addElement(I);
          try {
            if (await I.waitUntilGeometryUpdated?.(), z) return;
            const f = Ee.viewer?.view?.cameraControl;
            if (f) {
              const { Vector3: g } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((H) => H.m);
              if (z) return;
              try {
                f.setDirection(new g(0, 0, 1));
              } catch (H) {
                console.warn("[wcf] setDirection failed:", H?.message);
              }
              f.zoomToFitElements?.(
                [I],
                { margin: 0.15 }
              ), J.current?.viewer?.requestRenderFrame?.();
            }
          } catch (f) {
            console.warn("[wcf] initial camera setup failed:", f?.message);
          }
          const q = await I.getProperties();
          if (z) return;
          const M = (f) => {
            S(), (async () => {
              try {
                if (await (f?.article?.getMainArticle?.() ?? I)?.waitUntilGeometryUpdated?.(), z) return;
                J.current?.viewer?.requestRenderFrame?.();
              } catch {
              }
            })();
          };
          if (j.current = M, Fe.eventArticleChanged?.addListener(M), await x(I, Fe, q), z) return;
          S();
        } catch (ce) {
          z || (console.error("[wcf] init failed:", ce), D(ce));
        }
    }
    return ne(), () => {
      z = !0, ue();
    };
  }, [O, T, w, P, k, x, D, ue, S]), /* @__PURE__ */ N.jsx(op, { canvasHeight: a, children: /* @__PURE__ */ N.jsxs("div", { className: "pcon-configurator", children: [
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
      !u && v && /* @__PURE__ */ N.jsxs(
        "div",
        {
          className: "pcon-error",
          style: {
            position: "absolute",
            inset: 0,
            zIndex: 10,
            background: "white",
            minHeight: a + "px"
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
            /* @__PURE__ */ N.jsx("p", { className: "pcon-error__message", children: v })
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
    /* @__PURE__ */ N.jsx("div", { className: "pcon-sidebar", children: !v && /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
      /* @__PURE__ */ N.jsx(Jd, {}),
      /* @__PURE__ */ N.jsxs("div", { className: "pcon-price-cart", children: [
        d && /* @__PURE__ */ N.jsx(Xd, {}),
        /* @__PURE__ */ N.jsx(mc, { isGuest: !d })
      ] })
    ] }) })
  ] }) });
}
const sp = [
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
function hc() {
  if (typeof document > "u") return null;
  for (const a of sp) {
    const d = document.querySelectorAll(a);
    for (const u of d) {
      const v = u?.value?.trim();
      if (v) return v;
    }
  }
  if (typeof window < "u") {
    const a = window.ShopifyAnalytics?.meta?.selectedVariantId;
    if (a) return String(a);
  }
  return null;
}
function ap(a) {
  if (typeof document > "u") return () => {
  };
  let d = null;
  const u = () => {
    const k = hc();
    k && k !== d && (d = k, a(k));
  }, v = (k) => {
    const O = k.target;
    O && O.matches?.(
      'input[name="id"], select[name="id"]'
    ) && u();
  }, w = () => u(), P = () => u();
  return document.addEventListener("change", v, !0), document.addEventListener("variant:change", w), document.addEventListener("on:variant:change", w), window.addEventListener("popstate", P), () => {
    document.removeEventListener("change", v, !0), document.removeEventListener("variant:change", w), document.removeEventListener("on:variant:change", w), window.removeEventListener("popstate", P);
  };
}
function cp({ config: a }) {
  const d = re((v) => v.initialize), u = re((v) => v.setVariantId);
  return ze.useEffect(() => {
    d(a);
  }, [d, a]), ze.useEffect(() => {
    const v = hc();
    return v && u(v), ap((P) => {
      u(P);
    });
  }, [u]), /* @__PURE__ */ N.jsx(
    up,
    {
      canvasHeight: a.canvasHeight,
      environmentPreset: a.environmentPreset,
      customerLoggedIn: a.customerLoggedIn
    }
  );
}
window.__pconConfiguratorInit = function(a, d) {
  const u = {
    ...d,
    customIcons: window.__pconCustomIcons || {}
  };
  a.innerHTML = "", kd.createRoot(a).render(/* @__PURE__ */ N.jsx(cp, { config: u }));
};
