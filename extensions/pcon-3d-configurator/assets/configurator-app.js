import { g as uc } from "./pcon-chunk-engine-AgGdbLMj.js";
var Ii = { exports: {} }, Sr = {}, Oi = { exports: {} }, ee = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Fa;
function ad() {
  if (Fa) return ee;
  Fa = 1;
  var a = Symbol.for("react.element"), p = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), v = Symbol.for("react.strict_mode"), E = Symbol.for("react.profiler"), P = Symbol.for("react.provider"), k = Symbol.for("react.context"), O = Symbol.for("react.forward_ref"), x = Symbol.for("react.suspense"), T = Symbol.for("react.memo"), z = Symbol.for("react.lazy"), S = Symbol.iterator;
  function V(f) {
    return f === null || typeof f != "object" ? null : (f = S && f[S] || f["@@iterator"], typeof f == "function" ? f : null);
  }
  var X = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, J = Object.assign, R = {};
  function A(f, g, H) {
    this.props = f, this.context = g, this.refs = R, this.updater = H || X;
  }
  A.prototype.isReactComponent = {}, A.prototype.setState = function(f, g) {
    if (typeof f != "object" && typeof f != "function" && f != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, f, g, "setState");
  }, A.prototype.forceUpdate = function(f) {
    this.updater.enqueueForceUpdate(this, f, "forceUpdate");
  };
  function re() {
  }
  re.prototype = A.prototype;
  function Z(f, g, H) {
    this.props = f, this.context = g, this.refs = R, this.updater = H || X;
  }
  var j = Z.prototype = new re();
  j.constructor = Z, J(j, A.prototype), j.isPureReactComponent = !0;
  var ce = Array.isArray, oe = Object.prototype.hasOwnProperty, ue = { current: null }, Ne = { key: !0, ref: !0, __self: !0, __source: !0 };
  function ge(f, g, H) {
    var Y, b = {}, te = null, fe = null;
    if (g != null) for (Y in g.ref !== void 0 && (fe = g.ref), g.key !== void 0 && (te = "" + g.key), g) oe.call(g, Y) && !Ne.hasOwnProperty(Y) && (b[Y] = g[Y]);
    var se = arguments.length - 2;
    if (se === 1) b.children = H;
    else if (1 < se) {
      for (var ye = Array(se), be = 0; be < se; be++) ye[be] = arguments[be + 2];
      b.children = ye;
    }
    if (f && f.defaultProps) for (Y in se = f.defaultProps, se) b[Y] === void 0 && (b[Y] = se[Y]);
    return { $$typeof: a, type: f, key: te, ref: fe, props: b, _owner: ue.current };
  }
  function Qe(f, g) {
    return { $$typeof: a, type: f.type, key: g, ref: f.ref, props: f.props, _owner: f._owner };
  }
  function we(f) {
    return typeof f == "object" && f !== null && f.$$typeof === a;
  }
  function Q(f) {
    var g = { "=": "=0", ":": "=2" };
    return "$" + f.replace(/[=:]/g, function(H) {
      return g[H];
    });
  }
  var Se = /\/+/g;
  function Ae(f, g) {
    return typeof f == "object" && f !== null && f.key != null ? Q("" + f.key) : g.toString(36);
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
          case p:
            fe = !0;
        }
    }
    if (fe) return fe = f, b = b(fe), f = Y === "" ? "." + Ae(fe, 0) : Y, ce(b) ? (H = "", f != null && (H = f.replace(Se, "$&/") + "/"), Ze(b, g, H, "", function(be) {
      return be;
    })) : b != null && (we(b) && (b = Qe(b, H + (!b.key || fe && fe.key === b.key ? "" : ("" + b.key).replace(Se, "$&/") + "/") + f)), g.push(b)), 1;
    if (fe = 0, Y = Y === "" ? "." : Y + ":", ce(f)) for (var se = 0; se < f.length; se++) {
      te = f[se];
      var ye = Y + Ae(te, se);
      fe += Ze(te, g, H, ye, b);
    }
    else if (ye = V(f), typeof ye == "function") for (f = ye.call(f), se = 0; !(te = f.next()).done; ) te = te.value, ye = Y + Ae(te, se++), fe += Ze(te, g, H, ye, b);
    else if (te === "object") throw g = String(f), Error("Objects are not valid as a React child (found: " + (g === "[object Object]" ? "object with keys {" + Object.keys(f).join(", ") + "}" : g) + "). If you meant to render a collection of children, use an array instead.");
    return fe;
  }
  function Me(f, g, H) {
    if (f == null) return f;
    var Y = [], b = 0;
    return Ze(f, Y, "", "", function(te) {
      return g.call(H, te, b++);
    }), Y;
  }
  function Fe(f) {
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
  var he = { current: null }, I = { transition: null }, q = { ReactCurrentDispatcher: he, ReactCurrentBatchConfig: I, ReactCurrentOwner: ue };
  function M() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return ee.Children = { map: Me, forEach: function(f, g, H) {
    Me(f, function() {
      g.apply(this, arguments);
    }, H);
  }, count: function(f) {
    var g = 0;
    return Me(f, function() {
      g++;
    }), g;
  }, toArray: function(f) {
    return Me(f, function(g) {
      return g;
    }) || [];
  }, only: function(f) {
    if (!we(f)) throw Error("React.Children.only expected to receive a single React element child.");
    return f;
  } }, ee.Component = A, ee.Fragment = u, ee.Profiler = E, ee.PureComponent = Z, ee.StrictMode = v, ee.Suspense = x, ee.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = q, ee.act = M, ee.cloneElement = function(f, g, H) {
    if (f == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + f + ".");
    var Y = J({}, f.props), b = f.key, te = f.ref, fe = f._owner;
    if (g != null) {
      if (g.ref !== void 0 && (te = g.ref, fe = ue.current), g.key !== void 0 && (b = "" + g.key), f.type && f.type.defaultProps) var se = f.type.defaultProps;
      for (ye in g) oe.call(g, ye) && !Ne.hasOwnProperty(ye) && (Y[ye] = g[ye] === void 0 && se !== void 0 ? se[ye] : g[ye]);
    }
    var ye = arguments.length - 2;
    if (ye === 1) Y.children = H;
    else if (1 < ye) {
      se = Array(ye);
      for (var be = 0; be < ye; be++) se[be] = arguments[be + 2];
      Y.children = se;
    }
    return { $$typeof: a, type: f.type, key: b, ref: te, props: Y, _owner: fe };
  }, ee.createContext = function(f) {
    return f = { $$typeof: k, _currentValue: f, _currentValue2: f, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, f.Provider = { $$typeof: P, _context: f }, f.Consumer = f;
  }, ee.createElement = ge, ee.createFactory = function(f) {
    var g = ge.bind(null, f);
    return g.type = f, g;
  }, ee.createRef = function() {
    return { current: null };
  }, ee.forwardRef = function(f) {
    return { $$typeof: O, render: f };
  }, ee.isValidElement = we, ee.lazy = function(f) {
    return { $$typeof: z, _payload: { _status: -1, _result: f }, _init: Fe };
  }, ee.memo = function(f, g) {
    return { $$typeof: T, type: f, compare: g === void 0 ? null : g };
  }, ee.startTransition = function(f) {
    var g = I.transition;
    I.transition = {};
    try {
      f();
    } finally {
      I.transition = g;
    }
  }, ee.unstable_act = M, ee.useCallback = function(f, g) {
    return he.current.useCallback(f, g);
  }, ee.useContext = function(f) {
    return he.current.useContext(f);
  }, ee.useDebugValue = function() {
  }, ee.useDeferredValue = function(f) {
    return he.current.useDeferredValue(f);
  }, ee.useEffect = function(f, g) {
    return he.current.useEffect(f, g);
  }, ee.useId = function() {
    return he.current.useId();
  }, ee.useImperativeHandle = function(f, g, H) {
    return he.current.useImperativeHandle(f, g, H);
  }, ee.useInsertionEffect = function(f, g) {
    return he.current.useInsertionEffect(f, g);
  }, ee.useLayoutEffect = function(f, g) {
    return he.current.useLayoutEffect(f, g);
  }, ee.useMemo = function(f, g) {
    return he.current.useMemo(f, g);
  }, ee.useReducer = function(f, g, H) {
    return he.current.useReducer(f, g, H);
  }, ee.useRef = function(f) {
    return he.current.useRef(f);
  }, ee.useState = function(f) {
    return he.current.useState(f);
  }, ee.useSyncExternalStore = function(f, g, H) {
    return he.current.useSyncExternalStore(f, g, H);
  }, ee.useTransition = function() {
    return he.current.useTransition();
  }, ee.version = "18.3.1", ee;
}
var Ua;
function Qi() {
  return Ua || (Ua = 1, Oi.exports = /* @__PURE__ */ ad()), Oi.exports;
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
var Va;
function cd() {
  if (Va) return Sr;
  Va = 1;
  var a = /* @__PURE__ */ Qi(), p = Symbol.for("react.element"), u = Symbol.for("react.fragment"), v = Object.prototype.hasOwnProperty, E = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, P = { key: !0, ref: !0, __self: !0, __source: !0 };
  function k(O, x, T) {
    var z, S = {}, V = null, X = null;
    T !== void 0 && (V = "" + T), x.key !== void 0 && (V = "" + x.key), x.ref !== void 0 && (X = x.ref);
    for (z in x) v.call(x, z) && !P.hasOwnProperty(z) && (S[z] = x[z]);
    if (O && O.defaultProps) for (z in x = O.defaultProps, x) S[z] === void 0 && (S[z] = x[z]);
    return { $$typeof: p, type: O, key: V, ref: X, props: S, _owner: E.current };
  }
  return Sr.Fragment = u, Sr.jsx = k, Sr.jsxs = k, Sr;
}
var Wa;
function fd() {
  return Wa || (Wa = 1, Ii.exports = /* @__PURE__ */ cd()), Ii.exports;
}
var N = /* @__PURE__ */ fd(), Ol = {}, ji = { exports: {} }, Je = {}, zi = { exports: {} }, Di = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ba;
function dd() {
  return Ba || (Ba = 1, (function(a) {
    function p(I, q) {
      var M = I.length;
      I.push(q);
      e: for (; 0 < M; ) {
        var f = M - 1 >>> 1, g = I[f];
        if (0 < E(g, q)) I[f] = q, I[M] = g, M = f;
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
          if (0 > E(b, M)) te < g && 0 > E(fe, b) ? (I[f] = fe, I[te] = M, f = te) : (I[f] = b, I[Y] = M, f = Y);
          else if (te < g && 0 > E(fe, M)) I[f] = fe, I[te] = M, f = te;
          else break e;
        }
      }
      return q;
    }
    function E(I, q) {
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
    var x = [], T = [], z = 1, S = null, V = 3, X = !1, J = !1, R = !1, A = typeof setTimeout == "function" ? setTimeout : null, re = typeof clearTimeout == "function" ? clearTimeout : null, Z = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function j(I) {
      for (var q = u(T); q !== null; ) {
        if (q.callback === null) v(T);
        else if (q.startTime <= I) v(T), q.sortIndex = q.expirationTime, p(x, q);
        else break;
        q = u(T);
      }
    }
    function ce(I) {
      if (R = !1, j(I), !J) if (u(x) !== null) J = !0, Fe(oe);
      else {
        var q = u(T);
        q !== null && he(ce, q.startTime - I);
      }
    }
    function oe(I, q) {
      J = !1, R && (R = !1, re(ge), ge = -1), X = !0;
      var M = V;
      try {
        for (j(q), S = u(x); S !== null && (!(S.expirationTime > q) || I && !Q()); ) {
          var f = S.callback;
          if (typeof f == "function") {
            S.callback = null, V = S.priorityLevel;
            var g = f(S.expirationTime <= q);
            q = a.unstable_now(), typeof g == "function" ? S.callback = g : S === u(x) && v(x), j(q);
          } else v(x);
          S = u(x);
        }
        if (S !== null) var H = !0;
        else {
          var Y = u(T);
          Y !== null && he(ce, Y.startTime - q), H = !1;
        }
        return H;
      } finally {
        S = null, V = M, X = !1;
      }
    }
    var ue = !1, Ne = null, ge = -1, Qe = 5, we = -1;
    function Q() {
      return !(a.unstable_now() - we < Qe);
    }
    function Se() {
      if (Ne !== null) {
        var I = a.unstable_now();
        we = I;
        var q = !0;
        try {
          q = Ne(!0, I);
        } finally {
          q ? Ae() : (ue = !1, Ne = null);
        }
      } else ue = !1;
    }
    var Ae;
    if (typeof Z == "function") Ae = function() {
      Z(Se);
    };
    else if (typeof MessageChannel < "u") {
      var Ze = new MessageChannel(), Me = Ze.port2;
      Ze.port1.onmessage = Se, Ae = function() {
        Me.postMessage(null);
      };
    } else Ae = function() {
      A(Se, 0);
    };
    function Fe(I) {
      Ne = I, ue || (ue = !0, Ae());
    }
    function he(I, q) {
      ge = A(function() {
        I(a.unstable_now());
      }, q);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(I) {
      I.callback = null;
    }, a.unstable_continueExecution = function() {
      J || X || (J = !0, Fe(oe));
    }, a.unstable_forceFrameRate = function(I) {
      0 > I || 125 < I ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Qe = 0 < I ? Math.floor(1e3 / I) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return V;
    }, a.unstable_getFirstCallbackNode = function() {
      return u(x);
    }, a.unstable_next = function(I) {
      switch (V) {
        case 1:
        case 2:
        case 3:
          var q = 3;
          break;
        default:
          q = V;
      }
      var M = V;
      V = q;
      try {
        return I();
      } finally {
        V = M;
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
      var M = V;
      V = I;
      try {
        return q();
      } finally {
        V = M;
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
      return g = M + g, I = { id: z++, callback: q, priorityLevel: I, startTime: M, expirationTime: g, sortIndex: -1 }, M > f ? (I.sortIndex = M, p(T, I), u(x) === null && I === u(T) && (R ? (re(ge), ge = -1) : R = !0, he(ce, M - f))) : (I.sortIndex = g, p(x, I), J || X || (J = !0, Fe(oe))), I;
    }, a.unstable_shouldYield = Q, a.unstable_wrapCallback = function(I) {
      var q = V;
      return function() {
        var M = V;
        V = q;
        try {
          return I.apply(this, arguments);
        } finally {
          V = M;
        }
      };
    };
  })(Di)), Di;
}
var Qa;
function pd() {
  return Qa || (Qa = 1, zi.exports = /* @__PURE__ */ dd()), zi.exports;
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
var Ha;
function md() {
  if (Ha) return Je;
  Ha = 1;
  var a = /* @__PURE__ */ Qi(), p = /* @__PURE__ */ pd();
  function u(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var v = /* @__PURE__ */ new Set(), E = {};
  function P(e, t) {
    k(e, t), k(e + "Capture", t);
  }
  function k(e, t) {
    for (E[e] = t, e = 0; e < t.length; e++) v.add(t[e]);
  }
  var O = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), x = Object.prototype.hasOwnProperty, T = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, z = {}, S = {};
  function V(e) {
    return x.call(S, e) ? !0 : x.call(z, e) ? !1 : T.test(e) ? S[e] = !0 : (z[e] = !0, !1);
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
  function J(e, t, n, r) {
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
  var A = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    A[e] = new R(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    A[t] = new R(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    A[e] = new R(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    A[e] = new R(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    A[e] = new R(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    A[e] = new R(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    A[e] = new R(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    A[e] = new R(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    A[e] = new R(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var re = /[\-:]([a-z])/g;
  function Z(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      re,
      Z
    );
    A[t] = new R(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(re, Z);
    A[t] = new R(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(re, Z);
    A[t] = new R(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    A[e] = new R(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), A.xlinkHref = new R("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    A[e] = new R(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function j(e, t, n, r) {
    var l = A.hasOwnProperty(t) ? A[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (J(t, n, l, r) && (n = null), r || l === null ? V(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var ce = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, oe = Symbol.for("react.element"), ue = Symbol.for("react.portal"), Ne = Symbol.for("react.fragment"), ge = Symbol.for("react.strict_mode"), Qe = Symbol.for("react.profiler"), we = Symbol.for("react.provider"), Q = Symbol.for("react.context"), Se = Symbol.for("react.forward_ref"), Ae = Symbol.for("react.suspense"), Ze = Symbol.for("react.suspense_list"), Me = Symbol.for("react.memo"), Fe = Symbol.for("react.lazy"), he = Symbol.for("react.offscreen"), I = Symbol.iterator;
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
      case Ne:
        return "Fragment";
      case ue:
        return "Portal";
      case Qe:
        return "Profiler";
      case ge:
        return "StrictMode";
      case Ae:
        return "Suspense";
      case Ze:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case Q:
        return (e.displayName || "Context") + ".Consumer";
      case we:
        return (e._context.displayName || "Context") + ".Provider";
      case Se:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Me:
        return t = e.displayName || null, t !== null ? t : te(e.type) || "Memo";
      case Fe:
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
        return t === ge ? "StrictMode" : "Mode";
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
  function ye(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
  }
  function be(e) {
    var t = ye(e) ? "checked" : "value", n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t), r = "" + e[t];
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
  function _r(e) {
    e._valueTracker || (e._valueTracker = be(e));
  }
  function Hi(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = ye(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Er(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Ml(e, t) {
    var n = t.checked;
    return M({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function $i(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = se(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function Ki(e, t) {
    t = t.checked, t != null && j(e, "checked", t, !1);
  }
  function Fl(e, t) {
    Ki(e, t);
    var n = se(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Ul(e, t.type, n) : t.hasOwnProperty("defaultValue") && Ul(e, t.type, se(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function qi(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Ul(e, t, n) {
    (t !== "number" || Er(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var Dn = Array.isArray;
  function an(e, t, n, r) {
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
  function Vl(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(u(91));
    return M({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Yi(e, t) {
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
  function Gi(e, t) {
    var n = se(t.value), r = se(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function Xi(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function Ji(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Wl(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Ji(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Cr, Zi = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Cr = Cr || document.createElement("div"), Cr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Cr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
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
  }, dc = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Mn).forEach(function(e) {
    dc.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Mn[t] = Mn[e];
    });
  });
  function bi(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Mn.hasOwnProperty(e) && Mn[e] ? ("" + t).trim() : t + "px";
  }
  function eu(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = bi(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var pc = M({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Bl(e, t) {
    if (t) {
      if (pc[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(u(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(u(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(u(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(u(62));
    }
  }
  function Ql(e, t) {
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
  var Hl = null;
  function $l(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var Kl = null, cn = null, fn = null;
  function tu(e) {
    if (e = or(e)) {
      if (typeof Kl != "function") throw Error(u(280));
      var t = e.stateNode;
      t && (t = qr(t), Kl(e.stateNode, e.type, t));
    }
  }
  function nu(e) {
    cn ? fn ? fn.push(e) : fn = [e] : cn = e;
  }
  function ru() {
    if (cn) {
      var e = cn, t = fn;
      if (fn = cn = null, tu(e), t) for (e = 0; e < t.length; e++) tu(t[e]);
    }
  }
  function lu(e, t) {
    return e(t);
  }
  function ou() {
  }
  var ql = !1;
  function iu(e, t, n) {
    if (ql) return e(t, n);
    ql = !0;
    try {
      return lu(e, t, n);
    } finally {
      ql = !1, (cn !== null || fn !== null) && (ou(), ru());
    }
  }
  function Fn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = qr(n);
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
  var Yl = !1;
  if (O) try {
    var Un = {};
    Object.defineProperty(Un, "passive", { get: function() {
      Yl = !0;
    } }), window.addEventListener("test", Un, Un), window.removeEventListener("test", Un, Un);
  } catch {
    Yl = !1;
  }
  function mc(e, t, n, r, l, o, i, s, c) {
    var y = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, y);
    } catch (_) {
      this.onError(_);
    }
  }
  var Vn = !1, xr = null, Nr = !1, Gl = null, hc = { onError: function(e) {
    Vn = !0, xr = e;
  } };
  function yc(e, t, n, r, l, o, i, s, c) {
    Vn = !1, xr = null, mc.apply(hc, arguments);
  }
  function vc(e, t, n, r, l, o, i, s, c) {
    if (yc.apply(this, arguments), Vn) {
      if (Vn) {
        var y = xr;
        Vn = !1, xr = null;
      } else throw Error(u(198));
      Nr || (Nr = !0, Gl = y);
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
  function uu(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function su(e) {
    if (Gt(e) !== e) throw Error(u(188));
  }
  function gc(e) {
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
          if (o === n) return su(l), e;
          if (o === r) return su(l), t;
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
  function au(e) {
    return e = gc(e), e !== null ? cu(e) : null;
  }
  function cu(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = cu(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var fu = p.unstable_scheduleCallback, du = p.unstable_cancelCallback, wc = p.unstable_shouldYield, Sc = p.unstable_requestPaint, Ce = p.unstable_now, kc = p.unstable_getCurrentPriorityLevel, Xl = p.unstable_ImmediatePriority, pu = p.unstable_UserBlockingPriority, Pr = p.unstable_NormalPriority, _c = p.unstable_LowPriority, mu = p.unstable_IdlePriority, Rr = null, vt = null;
  function Ec(e) {
    if (vt && typeof vt.onCommitFiberRoot == "function") try {
      vt.onCommitFiberRoot(Rr, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var ct = Math.clz32 ? Math.clz32 : Nc, Cc = Math.log, xc = Math.LN2;
  function Nc(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Cc(e) / xc | 0) | 0;
  }
  var Lr = 64, Tr = 4194304;
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
  function Ir(e, t) {
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
  function Pc(e, t) {
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
  function Rc(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
      var i = 31 - ct(o), s = 1 << i, c = l[i];
      c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (l[i] = Pc(s, t)) : c <= t && (e.expiredLanes |= s), o &= ~s;
    }
  }
  function Jl(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function hu() {
    var e = Lr;
    return Lr <<= 1, (Lr & 4194240) === 0 && (Lr = 64), e;
  }
  function Zl(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Bn(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - ct(t), e[t] = n;
  }
  function Lc(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - ct(n), o = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~o;
    }
  }
  function bl(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - ct(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var ae = 0;
  function yu(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var vu, eo, gu, wu, Su, to = !1, Or = [], Tt = null, It = null, Ot = null, Qn = /* @__PURE__ */ new Map(), Hn = /* @__PURE__ */ new Map(), jt = [], Tc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function ku(e, t) {
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
    return e === null || e.nativeEvent !== o ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: o, targetContainers: [l] }, t !== null && (t = or(t), t !== null && eo(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function Ic(e, t, n, r, l) {
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
  function _u(e) {
    var t = Xt(e.target);
    if (t !== null) {
      var n = Gt(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = uu(n), t !== null) {
            e.blockedOn = t, Su(e.priority, function() {
              gu(n);
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
  function jr(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = ro(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        Hl = r, n.target.dispatchEvent(r), Hl = null;
      } else return t = or(n), t !== null && eo(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Eu(e, t, n) {
    jr(e) && n.delete(t);
  }
  function Oc() {
    to = !1, Tt !== null && jr(Tt) && (Tt = null), It !== null && jr(It) && (It = null), Ot !== null && jr(Ot) && (Ot = null), Qn.forEach(Eu), Hn.forEach(Eu);
  }
  function Kn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, to || (to = !0, p.unstable_scheduleCallback(p.unstable_NormalPriority, Oc)));
  }
  function qn(e) {
    function t(l) {
      return Kn(l, e);
    }
    if (0 < Or.length) {
      Kn(Or[0], e);
      for (var n = 1; n < Or.length; n++) {
        var r = Or[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Tt !== null && Kn(Tt, e), It !== null && Kn(It, e), Ot !== null && Kn(Ot, e), Qn.forEach(t), Hn.forEach(t), n = 0; n < jt.length; n++) r = jt[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < jt.length && (n = jt[0], n.blockedOn === null); ) _u(n), n.blockedOn === null && jt.shift();
  }
  var dn = ce.ReactCurrentBatchConfig, zr = !0;
  function jc(e, t, n, r) {
    var l = ae, o = dn.transition;
    dn.transition = null;
    try {
      ae = 1, no(e, t, n, r);
    } finally {
      ae = l, dn.transition = o;
    }
  }
  function zc(e, t, n, r) {
    var l = ae, o = dn.transition;
    dn.transition = null;
    try {
      ae = 4, no(e, t, n, r);
    } finally {
      ae = l, dn.transition = o;
    }
  }
  function no(e, t, n, r) {
    if (zr) {
      var l = ro(e, t, n, r);
      if (l === null) ko(e, t, r, Dr, n), ku(e, r);
      else if (Ic(l, e, t, n, r)) r.stopPropagation();
      else if (ku(e, r), t & 4 && -1 < Tc.indexOf(e)) {
        for (; l !== null; ) {
          var o = or(l);
          if (o !== null && vu(o), o = ro(e, t, n, r), o === null && ko(e, t, r, Dr, n), o === l) break;
          l = o;
        }
        l !== null && r.stopPropagation();
      } else ko(e, t, r, null, n);
    }
  }
  var Dr = null;
  function ro(e, t, n, r) {
    if (Dr = null, e = $l(r), e = Xt(e), e !== null) if (t = Gt(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = uu(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Dr = e, null;
  }
  function Cu(e) {
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
        switch (kc()) {
          case Xl:
            return 1;
          case pu:
            return 4;
          case Pr:
          case _c:
            return 16;
          case mu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var zt = null, lo = null, Ar = null;
  function xu() {
    if (Ar) return Ar;
    var e, t = lo, n = t.length, r, l = "value" in zt ? zt.value : zt.textContent, o = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var i = n - e;
    for (r = 1; r <= i && t[n - r] === l[o - r]; r++) ;
    return Ar = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Mr(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function Fr() {
    return !0;
  }
  function Nu() {
    return !1;
  }
  function et(e) {
    function t(n, r, l, o, i) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = o, this.target = i, this.currentTarget = null;
      for (var s in e) e.hasOwnProperty(s) && (n = e[s], this[s] = n ? n(o) : o[s]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? Fr : Nu, this.isPropagationStopped = Nu, this;
    }
    return M(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = Fr);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = Fr);
    }, persist: function() {
    }, isPersistent: Fr }), t;
  }
  var pn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, oo = et(pn), Yn = M({}, pn, { view: 0, detail: 0 }), Dc = et(Yn), io, uo, Gn, Ur = M({}, Yn, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: ao, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== Gn && (Gn && e.type === "mousemove" ? (io = e.screenX - Gn.screenX, uo = e.screenY - Gn.screenY) : uo = io = 0, Gn = e), io);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : uo;
  } }), Pu = et(Ur), Ac = M({}, Ur, { dataTransfer: 0 }), Mc = et(Ac), Fc = M({}, Yn, { relatedTarget: 0 }), so = et(Fc), Uc = M({}, pn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Vc = et(Uc), Wc = M({}, pn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Bc = et(Wc), Qc = M({}, pn, { data: 0 }), Ru = et(Qc), Hc = {
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
  }, $c = {
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
  }, Kc = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function qc(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Kc[e]) ? !!t[e] : !1;
  }
  function ao() {
    return qc;
  }
  var Yc = M({}, Yn, { key: function(e) {
    if (e.key) {
      var t = Hc[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Mr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? $c[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: ao, charCode: function(e) {
    return e.type === "keypress" ? Mr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Mr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Gc = et(Yc), Xc = M({}, Ur, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Lu = et(Xc), Jc = M({}, Yn, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: ao }), Zc = et(Jc), bc = M({}, pn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), ef = et(bc), tf = M({}, Ur, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), nf = et(tf), rf = [9, 13, 27, 32], co = O && "CompositionEvent" in window, Xn = null;
  O && "documentMode" in document && (Xn = document.documentMode);
  var lf = O && "TextEvent" in window && !Xn, Tu = O && (!co || Xn && 8 < Xn && 11 >= Xn), Iu = " ", Ou = !1;
  function ju(e, t) {
    switch (e) {
      case "keyup":
        return rf.indexOf(t.keyCode) !== -1;
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
  function zu(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var mn = !1;
  function of(e, t) {
    switch (e) {
      case "compositionend":
        return zu(t);
      case "keypress":
        return t.which !== 32 ? null : (Ou = !0, Iu);
      case "textInput":
        return e = t.data, e === Iu && Ou ? null : e;
      default:
        return null;
    }
  }
  function uf(e, t) {
    if (mn) return e === "compositionend" || !co && ju(e, t) ? (e = xu(), Ar = lo = zt = null, mn = !1, e) : null;
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
        return Tu && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var sf = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Du(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!sf[e.type] : t === "textarea";
  }
  function Au(e, t, n, r) {
    nu(r), t = Hr(t, "onChange"), 0 < t.length && (n = new oo("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var Jn = null, Zn = null;
  function af(e) {
    es(e, 0);
  }
  function Vr(e) {
    var t = wn(e);
    if (Hi(t)) return e;
  }
  function cf(e, t) {
    if (e === "change") return t;
  }
  var Mu = !1;
  if (O) {
    var fo;
    if (O) {
      var po = "oninput" in document;
      if (!po) {
        var Fu = document.createElement("div");
        Fu.setAttribute("oninput", "return;"), po = typeof Fu.oninput == "function";
      }
      fo = po;
    } else fo = !1;
    Mu = fo && (!document.documentMode || 9 < document.documentMode);
  }
  function Uu() {
    Jn && (Jn.detachEvent("onpropertychange", Vu), Zn = Jn = null);
  }
  function Vu(e) {
    if (e.propertyName === "value" && Vr(Zn)) {
      var t = [];
      Au(t, Zn, e, $l(e)), iu(af, t);
    }
  }
  function ff(e, t, n) {
    e === "focusin" ? (Uu(), Jn = t, Zn = n, Jn.attachEvent("onpropertychange", Vu)) : e === "focusout" && Uu();
  }
  function df(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Vr(Zn);
  }
  function pf(e, t) {
    if (e === "click") return Vr(t);
  }
  function mf(e, t) {
    if (e === "input" || e === "change") return Vr(t);
  }
  function hf(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ft = typeof Object.is == "function" ? Object.is : hf;
  function bn(e, t) {
    if (ft(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!x.call(t, l) || !ft(e[l], t[l])) return !1;
    }
    return !0;
  }
  function Wu(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Bu(e, t) {
    var n = Wu(e);
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
      n = Wu(n);
    }
  }
  function Qu(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Qu(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function Hu() {
    for (var e = window, t = Er(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Er(e.document);
    }
    return t;
  }
  function mo(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function yf(e) {
    var t = Hu(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && Qu(n.ownerDocument.documentElement, n)) {
      if (r !== null && mo(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, o = Math.min(r.start, l);
          r = r.end === void 0 ? o : Math.min(r.end, l), !e.extend && o > r && (l = r, r = o, o = l), l = Bu(n, o);
          var i = Bu(
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
  var vf = O && "documentMode" in document && 11 >= document.documentMode, hn = null, ho = null, er = null, yo = !1;
  function $u(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    yo || hn == null || hn !== Er(r) || (r = hn, "selectionStart" in r && mo(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), er && bn(er, r) || (er = r, r = Hr(ho, "onSelect"), 0 < r.length && (t = new oo("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = hn)));
  }
  function Wr(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var yn = { animationend: Wr("Animation", "AnimationEnd"), animationiteration: Wr("Animation", "AnimationIteration"), animationstart: Wr("Animation", "AnimationStart"), transitionend: Wr("Transition", "TransitionEnd") }, vo = {}, Ku = {};
  O && (Ku = document.createElement("div").style, "AnimationEvent" in window || (delete yn.animationend.animation, delete yn.animationiteration.animation, delete yn.animationstart.animation), "TransitionEvent" in window || delete yn.transitionend.transition);
  function Br(e) {
    if (vo[e]) return vo[e];
    if (!yn[e]) return e;
    var t = yn[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in Ku) return vo[e] = t[n];
    return e;
  }
  var qu = Br("animationend"), Yu = Br("animationiteration"), Gu = Br("animationstart"), Xu = Br("transitionend"), Ju = /* @__PURE__ */ new Map(), Zu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Dt(e, t) {
    Ju.set(e, t), P(t, [e]);
  }
  for (var go = 0; go < Zu.length; go++) {
    var wo = Zu[go], gf = wo.toLowerCase(), wf = wo[0].toUpperCase() + wo.slice(1);
    Dt(gf, "on" + wf);
  }
  Dt(qu, "onAnimationEnd"), Dt(Yu, "onAnimationIteration"), Dt(Gu, "onAnimationStart"), Dt("dblclick", "onDoubleClick"), Dt("focusin", "onFocus"), Dt("focusout", "onBlur"), Dt(Xu, "onTransitionEnd"), k("onMouseEnter", ["mouseout", "mouseover"]), k("onMouseLeave", ["mouseout", "mouseover"]), k("onPointerEnter", ["pointerout", "pointerover"]), k("onPointerLeave", ["pointerout", "pointerover"]), P("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), P("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), P("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), P("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), P("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), P("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var tr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Sf = new Set("cancel close invalid load scroll toggle".split(" ").concat(tr));
  function bu(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, vc(r, t, void 0, e), e.currentTarget = null;
  }
  function es(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var o = void 0;
        if (t) for (var i = r.length - 1; 0 <= i; i--) {
          var s = r[i], c = s.instance, y = s.currentTarget;
          if (s = s.listener, c !== o && l.isPropagationStopped()) break e;
          bu(l, s, y), o = c;
        }
        else for (i = 0; i < r.length; i++) {
          if (s = r[i], c = s.instance, y = s.currentTarget, s = s.listener, c !== o && l.isPropagationStopped()) break e;
          bu(l, s, y), o = c;
        }
      }
    }
    if (Nr) throw e = Gl, Nr = !1, Gl = null, e;
  }
  function pe(e, t) {
    var n = t[Po];
    n === void 0 && (n = t[Po] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (ts(t, e, 2, !1), n.add(r));
  }
  function So(e, t, n) {
    var r = 0;
    t && (r |= 4), ts(n, e, r, t);
  }
  var Qr = "_reactListening" + Math.random().toString(36).slice(2);
  function nr(e) {
    if (!e[Qr]) {
      e[Qr] = !0, v.forEach(function(n) {
        n !== "selectionchange" && (Sf.has(n) || So(n, !1, e), So(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Qr] || (t[Qr] = !0, So("selectionchange", !1, t));
    }
  }
  function ts(e, t, n, r) {
    switch (Cu(t)) {
      case 1:
        var l = jc;
        break;
      case 4:
        l = zc;
        break;
      default:
        l = no;
    }
    n = l.bind(null, t, n, e), l = void 0, !Yl || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function ko(e, t, n, r, l) {
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
    iu(function() {
      var y = o, _ = $l(n), C = [];
      e: {
        var w = Ju.get(e);
        if (w !== void 0) {
          var D = oo, U = e;
          switch (e) {
            case "keypress":
              if (Mr(n) === 0) break e;
            case "keydown":
            case "keyup":
              D = Gc;
              break;
            case "focusin":
              U = "focus", D = so;
              break;
            case "focusout":
              U = "blur", D = so;
              break;
            case "beforeblur":
            case "afterblur":
              D = so;
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
              D = Pu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              D = Mc;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              D = Zc;
              break;
            case qu:
            case Yu:
            case Gu:
              D = Vc;
              break;
            case Xu:
              D = ef;
              break;
            case "scroll":
              D = Dc;
              break;
            case "wheel":
              D = nf;
              break;
            case "copy":
            case "cut":
            case "paste":
              D = Bc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              D = Lu;
          }
          var W = (t & 4) !== 0, xe = !W && e === "scroll", m = W ? w !== null ? w + "Capture" : null : w;
          W = [];
          for (var d = y, h; d !== null; ) {
            h = d;
            var L = h.stateNode;
            if (h.tag === 5 && L !== null && (h = L, m !== null && (L = Fn(d, m), L != null && W.push(rr(d, L, h)))), xe) break;
            d = d.return;
          }
          0 < W.length && (w = new D(w, U, null, n, _), C.push({ event: w, listeners: W }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (w = e === "mouseover" || e === "pointerover", D = e === "mouseout" || e === "pointerout", w && n !== Hl && (U = n.relatedTarget || n.fromElement) && (Xt(U) || U[_t])) break e;
          if ((D || w) && (w = _.window === _ ? _ : (w = _.ownerDocument) ? w.defaultView || w.parentWindow : window, D ? (U = n.relatedTarget || n.toElement, D = y, U = U ? Xt(U) : null, U !== null && (xe = Gt(U), U !== xe || U.tag !== 5 && U.tag !== 6) && (U = null)) : (D = null, U = y), D !== U)) {
            if (W = Pu, L = "onMouseLeave", m = "onMouseEnter", d = "mouse", (e === "pointerout" || e === "pointerover") && (W = Lu, L = "onPointerLeave", m = "onPointerEnter", d = "pointer"), xe = D == null ? w : wn(D), h = U == null ? w : wn(U), w = new W(L, d + "leave", D, n, _), w.target = xe, w.relatedTarget = h, L = null, Xt(_) === y && (W = new W(m, d + "enter", U, n, _), W.target = h, W.relatedTarget = xe, L = W), xe = L, D && U) t: {
              for (W = D, m = U, d = 0, h = W; h; h = vn(h)) d++;
              for (h = 0, L = m; L; L = vn(L)) h++;
              for (; 0 < d - h; ) W = vn(W), d--;
              for (; 0 < h - d; ) m = vn(m), h--;
              for (; d--; ) {
                if (W === m || m !== null && W === m.alternate) break t;
                W = vn(W), m = vn(m);
              }
              W = null;
            }
            else W = null;
            D !== null && ns(C, w, D, W, !1), U !== null && xe !== null && ns(C, xe, U, W, !0);
          }
        }
        e: {
          if (w = y ? wn(y) : window, D = w.nodeName && w.nodeName.toLowerCase(), D === "select" || D === "input" && w.type === "file") var B = cf;
          else if (Du(w)) if (Mu) B = mf;
          else {
            B = df;
            var $ = ff;
          }
          else (D = w.nodeName) && D.toLowerCase() === "input" && (w.type === "checkbox" || w.type === "radio") && (B = pf);
          if (B && (B = B(e, y))) {
            Au(C, B, n, _);
            break e;
          }
          $ && $(e, w, y), e === "focusout" && ($ = w._wrapperState) && $.controlled && w.type === "number" && Ul(w, "number", w.value);
        }
        switch ($ = y ? wn(y) : window, e) {
          case "focusin":
            (Du($) || $.contentEditable === "true") && (hn = $, ho = y, er = null);
            break;
          case "focusout":
            er = ho = hn = null;
            break;
          case "mousedown":
            yo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            yo = !1, $u(C, n, _);
            break;
          case "selectionchange":
            if (vf) break;
          case "keydown":
          case "keyup":
            $u(C, n, _);
        }
        var K;
        if (co) e: {
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
        else mn ? ju(e, n) && (G = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (G = "onCompositionStart");
        G && (Tu && n.locale !== "ko" && (mn || G !== "onCompositionStart" ? G === "onCompositionEnd" && mn && (K = xu()) : (zt = _, lo = "value" in zt ? zt.value : zt.textContent, mn = !0)), $ = Hr(y, G), 0 < $.length && (G = new Ru(G, e, null, n, _), C.push({ event: G, listeners: $ }), K ? G.data = K : (K = zu(n), K !== null && (G.data = K)))), (K = lf ? of(e, n) : uf(e, n)) && (y = Hr(y, "onBeforeInput"), 0 < y.length && (_ = new Ru("onBeforeInput", "beforeinput", null, n, _), C.push({ event: _, listeners: y }), _.data = K));
      }
      es(C, t);
    });
  }
  function rr(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function Hr(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, o = l.stateNode;
      l.tag === 5 && o !== null && (l = o, o = Fn(e, n), o != null && r.unshift(rr(e, o, l)), o = Fn(e, t), o != null && r.push(rr(e, o, l))), e = e.return;
    }
    return r;
  }
  function vn(e) {
    if (e === null) return null;
    do
      e = e.return;
    while (e && e.tag !== 5);
    return e || null;
  }
  function ns(e, t, n, r, l) {
    for (var o = t._reactName, i = []; n !== null && n !== r; ) {
      var s = n, c = s.alternate, y = s.stateNode;
      if (c !== null && c === r) break;
      s.tag === 5 && y !== null && (s = y, l ? (c = Fn(n, o), c != null && i.unshift(rr(n, c, s))) : l || (c = Fn(n, o), c != null && i.push(rr(n, c, s)))), n = n.return;
    }
    i.length !== 0 && e.push({ event: t, listeners: i });
  }
  var kf = /\r\n?/g, _f = /\u0000|\uFFFD/g;
  function rs(e) {
    return (typeof e == "string" ? e : "" + e).replace(kf, `
`).replace(_f, "");
  }
  function $r(e, t, n) {
    if (t = rs(t), rs(e) !== t && n) throw Error(u(425));
  }
  function Kr() {
  }
  var _o = null, Eo = null;
  function Co(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var xo = typeof setTimeout == "function" ? setTimeout : void 0, Ef = typeof clearTimeout == "function" ? clearTimeout : void 0, ls = typeof Promise == "function" ? Promise : void 0, Cf = typeof queueMicrotask == "function" ? queueMicrotask : typeof ls < "u" ? function(e) {
    return ls.resolve(null).then(e).catch(xf);
  } : xo;
  function xf(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function No(e, t) {
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
  function os(e) {
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
  var gn = Math.random().toString(36).slice(2), gt = "__reactFiber$" + gn, lr = "__reactProps$" + gn, _t = "__reactContainer$" + gn, Po = "__reactEvents$" + gn, Nf = "__reactListeners$" + gn, Pf = "__reactHandles$" + gn;
  function Xt(e) {
    var t = e[gt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[_t] || n[gt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = os(e); e !== null; ) {
          if (n = e[gt]) return n;
          e = os(e);
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
  function wn(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(u(33));
  }
  function qr(e) {
    return e[lr] || null;
  }
  var Ro = [], Sn = -1;
  function Mt(e) {
    return { current: e };
  }
  function me(e) {
    0 > Sn || (e.current = Ro[Sn], Ro[Sn] = null, Sn--);
  }
  function de(e, t) {
    Sn++, Ro[Sn] = e.current, e.current = t;
  }
  var Ft = {}, Ue = Mt(Ft), Ke = Mt(!1), Jt = Ft;
  function kn(e, t) {
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
  function Yr() {
    me(Ke), me(Ue);
  }
  function is(e, t, n) {
    if (Ue.current !== Ft) throw Error(u(168));
    de(Ue, t), de(Ke, n);
  }
  function us(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(u(108, fe(e) || "Unknown", l));
    return M({}, n, r);
  }
  function Gr(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Ft, Jt = Ue.current, de(Ue, e), de(Ke, Ke.current), !0;
  }
  function ss(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(u(169));
    n ? (e = us(e, t, Jt), r.__reactInternalMemoizedMergedChildContext = e, me(Ke), me(Ue), de(Ue, e)) : me(Ke), de(Ke, n);
  }
  var Et = null, Xr = !1, Lo = !1;
  function as(e) {
    Et === null ? Et = [e] : Et.push(e);
  }
  function Rf(e) {
    Xr = !0, as(e);
  }
  function Ut() {
    if (!Lo && Et !== null) {
      Lo = !0;
      var e = 0, t = ae;
      try {
        var n = Et;
        for (ae = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        Et = null, Xr = !1;
      } catch (l) {
        throw Et !== null && (Et = Et.slice(e + 1)), fu(Xl, Ut), l;
      } finally {
        ae = t, Lo = !1;
      }
    }
    return null;
  }
  var _n = [], En = 0, Jr = null, Zr = 0, lt = [], ot = 0, Zt = null, Ct = 1, xt = "";
  function bt(e, t) {
    _n[En++] = Zr, _n[En++] = Jr, Jr = e, Zr = t;
  }
  function cs(e, t, n) {
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
  function To(e) {
    e.return !== null && (bt(e, 1), cs(e, 1, 0));
  }
  function Io(e) {
    for (; e === Jr; ) Jr = _n[--En], _n[En] = null, Zr = _n[--En], _n[En] = null;
    for (; e === Zt; ) Zt = lt[--ot], lt[ot] = null, xt = lt[--ot], lt[ot] = null, Ct = lt[--ot], lt[ot] = null;
  }
  var tt = null, nt = null, ve = !1, dt = null;
  function fs(e, t) {
    var n = at(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function ds(e, t) {
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
  function Oo(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function jo(e) {
    if (ve) {
      var t = nt;
      if (t) {
        var n = t;
        if (!ds(e, t)) {
          if (Oo(e)) throw Error(u(418));
          t = At(n.nextSibling);
          var r = tt;
          t && ds(e, t) ? fs(r, n) : (e.flags = e.flags & -4097 | 2, ve = !1, tt = e);
        }
      } else {
        if (Oo(e)) throw Error(u(418));
        e.flags = e.flags & -4097 | 2, ve = !1, tt = e;
      }
    }
  }
  function ps(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    tt = e;
  }
  function br(e) {
    if (e !== tt) return !1;
    if (!ve) return ps(e), ve = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Co(e.type, e.memoizedProps)), t && (t = nt)) {
      if (Oo(e)) throw ms(), Error(u(418));
      for (; t; ) fs(e, t), t = At(t.nextSibling);
    }
    if (ps(e), e.tag === 13) {
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
  function ms() {
    for (var e = nt; e; ) e = At(e.nextSibling);
  }
  function Cn() {
    nt = tt = null, ve = !1;
  }
  function zo(e) {
    dt === null ? dt = [e] : dt.push(e);
  }
  var Lf = ce.ReactCurrentBatchConfig;
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
  function el(e, t) {
    throw e = Object.prototype.toString.call(t), Error(u(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function hs(e) {
    var t = e._init;
    return t(e._payload);
  }
  function ys(e) {
    function t(m, d) {
      if (e) {
        var h = m.deletions;
        h === null ? (m.deletions = [d], m.flags |= 16) : h.push(d);
      }
    }
    function n(m, d) {
      if (!e) return null;
      for (; d !== null; ) t(m, d), d = d.sibling;
      return null;
    }
    function r(m, d) {
      for (m = /* @__PURE__ */ new Map(); d !== null; ) d.key !== null ? m.set(d.key, d) : m.set(d.index, d), d = d.sibling;
      return m;
    }
    function l(m, d) {
      return m = qt(m, d), m.index = 0, m.sibling = null, m;
    }
    function o(m, d, h) {
      return m.index = h, e ? (h = m.alternate, h !== null ? (h = h.index, h < d ? (m.flags |= 2, d) : h) : (m.flags |= 2, d)) : (m.flags |= 1048576, d);
    }
    function i(m) {
      return e && m.alternate === null && (m.flags |= 2), m;
    }
    function s(m, d, h, L) {
      return d === null || d.tag !== 6 ? (d = xi(h, m.mode, L), d.return = m, d) : (d = l(d, h), d.return = m, d);
    }
    function c(m, d, h, L) {
      var B = h.type;
      return B === Ne ? _(m, d, h.props.children, L, h.key) : d !== null && (d.elementType === B || typeof B == "object" && B !== null && B.$$typeof === Fe && hs(B) === d.type) ? (L = l(d, h.props), L.ref = ir(m, d, h), L.return = m, L) : (L = Cl(h.type, h.key, h.props, null, m.mode, L), L.ref = ir(m, d, h), L.return = m, L);
    }
    function y(m, d, h, L) {
      return d === null || d.tag !== 4 || d.stateNode.containerInfo !== h.containerInfo || d.stateNode.implementation !== h.implementation ? (d = Ni(h, m.mode, L), d.return = m, d) : (d = l(d, h.children || []), d.return = m, d);
    }
    function _(m, d, h, L, B) {
      return d === null || d.tag !== 7 ? (d = sn(h, m.mode, L, B), d.return = m, d) : (d = l(d, h), d.return = m, d);
    }
    function C(m, d, h) {
      if (typeof d == "string" && d !== "" || typeof d == "number") return d = xi("" + d, m.mode, h), d.return = m, d;
      if (typeof d == "object" && d !== null) {
        switch (d.$$typeof) {
          case oe:
            return h = Cl(d.type, d.key, d.props, null, m.mode, h), h.ref = ir(m, null, d), h.return = m, h;
          case ue:
            return d = Ni(d, m.mode, h), d.return = m, d;
          case Fe:
            var L = d._init;
            return C(m, L(d._payload), h);
        }
        if (Dn(d) || q(d)) return d = sn(d, m.mode, h, null), d.return = m, d;
        el(m, d);
      }
      return null;
    }
    function w(m, d, h, L) {
      var B = d !== null ? d.key : null;
      if (typeof h == "string" && h !== "" || typeof h == "number") return B !== null ? null : s(m, d, "" + h, L);
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case oe:
            return h.key === B ? c(m, d, h, L) : null;
          case ue:
            return h.key === B ? y(m, d, h, L) : null;
          case Fe:
            return B = h._init, w(
              m,
              d,
              B(h._payload),
              L
            );
        }
        if (Dn(h) || q(h)) return B !== null ? null : _(m, d, h, L, null);
        el(m, h);
      }
      return null;
    }
    function D(m, d, h, L, B) {
      if (typeof L == "string" && L !== "" || typeof L == "number") return m = m.get(h) || null, s(d, m, "" + L, B);
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case oe:
            return m = m.get(L.key === null ? h : L.key) || null, c(d, m, L, B);
          case ue:
            return m = m.get(L.key === null ? h : L.key) || null, y(d, m, L, B);
          case Fe:
            var $ = L._init;
            return D(m, d, h, $(L._payload), B);
        }
        if (Dn(L) || q(L)) return m = m.get(h) || null, _(d, m, L, B, null);
        el(d, L);
      }
      return null;
    }
    function U(m, d, h, L) {
      for (var B = null, $ = null, K = d, G = d = 0, Oe = null; K !== null && G < h.length; G++) {
        K.index > G ? (Oe = K, K = null) : Oe = K.sibling;
        var ie = w(m, K, h[G], L);
        if (ie === null) {
          K === null && (K = Oe);
          break;
        }
        e && K && ie.alternate === null && t(m, K), d = o(ie, d, G), $ === null ? B = ie : $.sibling = ie, $ = ie, K = Oe;
      }
      if (G === h.length) return n(m, K), ve && bt(m, G), B;
      if (K === null) {
        for (; G < h.length; G++) K = C(m, h[G], L), K !== null && (d = o(K, d, G), $ === null ? B = K : $.sibling = K, $ = K);
        return ve && bt(m, G), B;
      }
      for (K = r(m, K); G < h.length; G++) Oe = D(K, m, G, h[G], L), Oe !== null && (e && Oe.alternate !== null && K.delete(Oe.key === null ? G : Oe.key), d = o(Oe, d, G), $ === null ? B = Oe : $.sibling = Oe, $ = Oe);
      return e && K.forEach(function(Yt) {
        return t(m, Yt);
      }), ve && bt(m, G), B;
    }
    function W(m, d, h, L) {
      var B = q(h);
      if (typeof B != "function") throw Error(u(150));
      if (h = B.call(h), h == null) throw Error(u(151));
      for (var $ = B = null, K = d, G = d = 0, Oe = null, ie = h.next(); K !== null && !ie.done; G++, ie = h.next()) {
        K.index > G ? (Oe = K, K = null) : Oe = K.sibling;
        var Yt = w(m, K, ie.value, L);
        if (Yt === null) {
          K === null && (K = Oe);
          break;
        }
        e && K && Yt.alternate === null && t(m, K), d = o(Yt, d, G), $ === null ? B = Yt : $.sibling = Yt, $ = Yt, K = Oe;
      }
      if (ie.done) return n(
        m,
        K
      ), ve && bt(m, G), B;
      if (K === null) {
        for (; !ie.done; G++, ie = h.next()) ie = C(m, ie.value, L), ie !== null && (d = o(ie, d, G), $ === null ? B = ie : $.sibling = ie, $ = ie);
        return ve && bt(m, G), B;
      }
      for (K = r(m, K); !ie.done; G++, ie = h.next()) ie = D(K, m, G, ie.value, L), ie !== null && (e && ie.alternate !== null && K.delete(ie.key === null ? G : ie.key), d = o(ie, d, G), $ === null ? B = ie : $.sibling = ie, $ = ie);
      return e && K.forEach(function(sd) {
        return t(m, sd);
      }), ve && bt(m, G), B;
    }
    function xe(m, d, h, L) {
      if (typeof h == "object" && h !== null && h.type === Ne && h.key === null && (h = h.props.children), typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case oe:
            e: {
              for (var B = h.key, $ = d; $ !== null; ) {
                if ($.key === B) {
                  if (B = h.type, B === Ne) {
                    if ($.tag === 7) {
                      n(m, $.sibling), d = l($, h.props.children), d.return = m, m = d;
                      break e;
                    }
                  } else if ($.elementType === B || typeof B == "object" && B !== null && B.$$typeof === Fe && hs(B) === $.type) {
                    n(m, $.sibling), d = l($, h.props), d.ref = ir(m, $, h), d.return = m, m = d;
                    break e;
                  }
                  n(m, $);
                  break;
                } else t(m, $);
                $ = $.sibling;
              }
              h.type === Ne ? (d = sn(h.props.children, m.mode, L, h.key), d.return = m, m = d) : (L = Cl(h.type, h.key, h.props, null, m.mode, L), L.ref = ir(m, d, h), L.return = m, m = L);
            }
            return i(m);
          case ue:
            e: {
              for ($ = h.key; d !== null; ) {
                if (d.key === $) if (d.tag === 4 && d.stateNode.containerInfo === h.containerInfo && d.stateNode.implementation === h.implementation) {
                  n(m, d.sibling), d = l(d, h.children || []), d.return = m, m = d;
                  break e;
                } else {
                  n(m, d);
                  break;
                }
                else t(m, d);
                d = d.sibling;
              }
              d = Ni(h, m.mode, L), d.return = m, m = d;
            }
            return i(m);
          case Fe:
            return $ = h._init, xe(m, d, $(h._payload), L);
        }
        if (Dn(h)) return U(m, d, h, L);
        if (q(h)) return W(m, d, h, L);
        el(m, h);
      }
      return typeof h == "string" && h !== "" || typeof h == "number" ? (h = "" + h, d !== null && d.tag === 6 ? (n(m, d.sibling), d = l(d, h), d.return = m, m = d) : (n(m, d), d = xi(h, m.mode, L), d.return = m, m = d), i(m)) : n(m, d);
    }
    return xe;
  }
  var xn = ys(!0), vs = ys(!1), tl = Mt(null), nl = null, Nn = null, Do = null;
  function Ao() {
    Do = Nn = nl = null;
  }
  function Mo(e) {
    var t = tl.current;
    me(tl), e._currentValue = t;
  }
  function Fo(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Pn(e, t) {
    nl = e, Do = Nn = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Ye = !0), e.firstContext = null);
  }
  function it(e) {
    var t = e._currentValue;
    if (Do !== e) if (e = { context: e, memoizedValue: t, next: null }, Nn === null) {
      if (nl === null) throw Error(u(308));
      Nn = e, nl.dependencies = { lanes: 0, firstContext: e };
    } else Nn = Nn.next = e;
    return t;
  }
  var en = null;
  function Uo(e) {
    en === null ? en = [e] : en.push(e);
  }
  function gs(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Uo(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Nt(e, r);
  }
  function Nt(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Vt = !1;
  function Vo(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function ws(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Pt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Wt(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (le & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Nt(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Uo(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Nt(e, n);
  }
  function rl(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, bl(e, n);
    }
  }
  function Ss(e, t) {
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
  function ll(e, t, n, r) {
    var l = e.updateQueue;
    Vt = !1;
    var o = l.firstBaseUpdate, i = l.lastBaseUpdate, s = l.shared.pending;
    if (s !== null) {
      l.shared.pending = null;
      var c = s, y = c.next;
      c.next = null, i === null ? o = y : i.next = y, i = c;
      var _ = e.alternate;
      _ !== null && (_ = _.updateQueue, s = _.lastBaseUpdate, s !== i && (s === null ? _.firstBaseUpdate = y : s.next = y, _.lastBaseUpdate = c));
    }
    if (o !== null) {
      var C = l.baseState;
      i = 0, _ = y = c = null, s = o;
      do {
        var w = s.lane, D = s.eventTime;
        if ((r & w) === w) {
          _ !== null && (_ = _.next = {
            eventTime: D,
            lane: 0,
            tag: s.tag,
            payload: s.payload,
            callback: s.callback,
            next: null
          });
          e: {
            var U = e, W = s;
            switch (w = t, D = n, W.tag) {
              case 1:
                if (U = W.payload, typeof U == "function") {
                  C = U.call(D, C, w);
                  break e;
                }
                C = U;
                break e;
              case 3:
                U.flags = U.flags & -65537 | 128;
              case 0:
                if (U = W.payload, w = typeof U == "function" ? U.call(D, C, w) : U, w == null) break e;
                C = M({}, C, w);
                break e;
              case 2:
                Vt = !0;
            }
          }
          s.callback !== null && s.lane !== 0 && (e.flags |= 64, w = l.effects, w === null ? l.effects = [s] : w.push(s));
        } else D = { eventTime: D, lane: w, tag: s.tag, payload: s.payload, callback: s.callback, next: null }, _ === null ? (y = _ = D, c = C) : _ = _.next = D, i |= w;
        if (s = s.next, s === null) {
          if (s = l.shared.pending, s === null) break;
          w = s, s = w.next, w.next = null, l.lastBaseUpdate = w, l.shared.pending = null;
        }
      } while (!0);
      if (_ === null && (c = C), l.baseState = c, l.firstBaseUpdate = y, l.lastBaseUpdate = _, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          i |= l.lane, l = l.next;
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      rn |= i, e.lanes = i, e.memoizedState = C;
    }
  }
  function ks(e, t, n) {
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
  function Wo(e, t) {
    switch (de(ar, t), de(sr, e), de(wt, ur), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Wl(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Wl(t, e);
    }
    me(wt), de(wt, t);
  }
  function Rn() {
    me(wt), me(sr), me(ar);
  }
  function _s(e) {
    tn(ar.current);
    var t = tn(wt.current), n = Wl(t, e.type);
    t !== n && (de(sr, e), de(wt, n));
  }
  function Bo(e) {
    sr.current === e && (me(wt), me(sr));
  }
  var ke = Mt(0);
  function ol(e) {
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
  var Qo = [];
  function Ho() {
    for (var e = 0; e < Qo.length; e++) Qo[e]._workInProgressVersionPrimary = null;
    Qo.length = 0;
  }
  var il = ce.ReactCurrentDispatcher, $o = ce.ReactCurrentBatchConfig, nn = 0, _e = null, Re = null, Te = null, ul = !1, cr = !1, fr = 0, Tf = 0;
  function Ve() {
    throw Error(u(321));
  }
  function Ko(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!ft(e[n], t[n])) return !1;
    return !0;
  }
  function qo(e, t, n, r, l, o) {
    if (nn = o, _e = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, il.current = e === null || e.memoizedState === null ? zf : Df, e = n(r, l), cr) {
      o = 0;
      do {
        if (cr = !1, fr = 0, 25 <= o) throw Error(u(301));
        o += 1, Te = Re = null, t.updateQueue = null, il.current = Af, e = n(r, l);
      } while (cr);
    }
    if (il.current = cl, t = Re !== null && Re.next !== null, nn = 0, Te = Re = _e = null, ul = !1, t) throw Error(u(300));
    return e;
  }
  function Yo() {
    var e = fr !== 0;
    return fr = 0, e;
  }
  function St() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Te === null ? _e.memoizedState = Te = e : Te = Te.next = e, Te;
  }
  function ut() {
    if (Re === null) {
      var e = _e.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Re.next;
    var t = Te === null ? _e.memoizedState : Te.next;
    if (t !== null) Te = t, Re = e;
    else {
      if (e === null) throw Error(u(310));
      Re = e, e = { memoizedState: Re.memoizedState, baseState: Re.baseState, baseQueue: Re.baseQueue, queue: Re.queue, next: null }, Te === null ? _e.memoizedState = Te = e : Te = Te.next = e;
    }
    return Te;
  }
  function dr(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function Go(e) {
    var t = ut(), n = t.queue;
    if (n === null) throw Error(u(311));
    n.lastRenderedReducer = e;
    var r = Re, l = r.baseQueue, o = n.pending;
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
        var _ = y.lane;
        if ((nn & _) === _) c !== null && (c = c.next = { lane: 0, action: y.action, hasEagerState: y.hasEagerState, eagerState: y.eagerState, next: null }), r = y.hasEagerState ? y.eagerState : e(r, y.action);
        else {
          var C = {
            lane: _,
            action: y.action,
            hasEagerState: y.hasEagerState,
            eagerState: y.eagerState,
            next: null
          };
          c === null ? (s = c = C, i = r) : c = c.next = C, _e.lanes |= _, rn |= _;
        }
        y = y.next;
      } while (y !== null && y !== o);
      c === null ? i = r : c.next = s, ft(r, t.memoizedState) || (Ye = !0), t.memoizedState = r, t.baseState = i, t.baseQueue = c, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        o = l.lane, _e.lanes |= o, rn |= o, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function Xo(e) {
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
  function Es() {
  }
  function Cs(e, t) {
    var n = _e, r = ut(), l = t(), o = !ft(r.memoizedState, l);
    if (o && (r.memoizedState = l, Ye = !0), r = r.queue, Jo(Ps.bind(null, n, r, e), [e]), r.getSnapshot !== t || o || Te !== null && Te.memoizedState.tag & 1) {
      if (n.flags |= 2048, pr(9, Ns.bind(null, n, r, l, t), void 0, null), Ie === null) throw Error(u(349));
      (nn & 30) !== 0 || xs(n, t, l);
    }
    return l;
  }
  function xs(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = _e.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, _e.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Ns(e, t, n, r) {
    t.value = n, t.getSnapshot = r, Rs(t) && Ls(e);
  }
  function Ps(e, t, n) {
    return n(function() {
      Rs(t) && Ls(e);
    });
  }
  function Rs(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !ft(e, n);
    } catch {
      return !0;
    }
  }
  function Ls(e) {
    var t = Nt(e, 1);
    t !== null && yt(t, e, 1, -1);
  }
  function Ts(e) {
    var t = St();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: dr, lastRenderedState: e }, t.queue = e, e = e.dispatch = jf.bind(null, _e, e), [t.memoizedState, e];
  }
  function pr(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = _e.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, _e.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Is() {
    return ut().memoizedState;
  }
  function sl(e, t, n, r) {
    var l = St();
    _e.flags |= e, l.memoizedState = pr(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function al(e, t, n, r) {
    var l = ut();
    r = r === void 0 ? null : r;
    var o = void 0;
    if (Re !== null) {
      var i = Re.memoizedState;
      if (o = i.destroy, r !== null && Ko(r, i.deps)) {
        l.memoizedState = pr(t, n, o, r);
        return;
      }
    }
    _e.flags |= e, l.memoizedState = pr(1 | t, n, o, r);
  }
  function Os(e, t) {
    return sl(8390656, 8, e, t);
  }
  function Jo(e, t) {
    return al(2048, 8, e, t);
  }
  function js(e, t) {
    return al(4, 2, e, t);
  }
  function zs(e, t) {
    return al(4, 4, e, t);
  }
  function Ds(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function As(e, t, n) {
    return n = n != null ? n.concat([e]) : null, al(4, 4, Ds.bind(null, t, e), n);
  }
  function Zo() {
  }
  function Ms(e, t) {
    var n = ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Ko(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function Fs(e, t) {
    var n = ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && Ko(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function Us(e, t, n) {
    return (nn & 21) === 0 ? (e.baseState && (e.baseState = !1, Ye = !0), e.memoizedState = n) : (ft(n, t) || (n = hu(), _e.lanes |= n, rn |= n, e.baseState = !0), t);
  }
  function If(e, t) {
    var n = ae;
    ae = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = $o.transition;
    $o.transition = {};
    try {
      e(!1), t();
    } finally {
      ae = n, $o.transition = r;
    }
  }
  function Vs() {
    return ut().memoizedState;
  }
  function Of(e, t, n) {
    var r = $t(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Ws(e)) Bs(t, n);
    else if (n = gs(e, t, n, r), n !== null) {
      var l = $e();
      yt(n, e, r, l), Qs(n, t, r);
    }
  }
  function jf(e, t, n) {
    var r = $t(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (Ws(e)) Bs(t, l);
    else {
      var o = e.alternate;
      if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
        var i = t.lastRenderedState, s = o(i, n);
        if (l.hasEagerState = !0, l.eagerState = s, ft(s, i)) {
          var c = t.interleaved;
          c === null ? (l.next = l, Uo(t)) : (l.next = c.next, c.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = gs(e, t, l, r), n !== null && (l = $e(), yt(n, e, r, l), Qs(n, t, r));
    }
  }
  function Ws(e) {
    var t = e.alternate;
    return e === _e || t !== null && t === _e;
  }
  function Bs(e, t) {
    cr = ul = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Qs(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, bl(e, n);
    }
  }
  var cl = { readContext: it, useCallback: Ve, useContext: Ve, useEffect: Ve, useImperativeHandle: Ve, useInsertionEffect: Ve, useLayoutEffect: Ve, useMemo: Ve, useReducer: Ve, useRef: Ve, useState: Ve, useDebugValue: Ve, useDeferredValue: Ve, useTransition: Ve, useMutableSource: Ve, useSyncExternalStore: Ve, useId: Ve, unstable_isNewReconciler: !1 }, zf = { readContext: it, useCallback: function(e, t) {
    return St().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: it, useEffect: Os, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, sl(
      4194308,
      4,
      Ds.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return sl(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return sl(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = St();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = St();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = Of.bind(null, _e, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = St();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Ts, useDebugValue: Zo, useDeferredValue: function(e) {
    return St().memoizedState = e;
  }, useTransition: function() {
    var e = Ts(!1), t = e[0];
    return e = If.bind(null, e[1]), St().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = _e, l = St();
    if (ve) {
      if (n === void 0) throw Error(u(407));
      n = n();
    } else {
      if (n = t(), Ie === null) throw Error(u(349));
      (nn & 30) !== 0 || xs(r, t, n);
    }
    l.memoizedState = n;
    var o = { value: n, getSnapshot: t };
    return l.queue = o, Os(Ps.bind(
      null,
      r,
      o,
      e
    ), [e]), r.flags |= 2048, pr(9, Ns.bind(null, r, o, n, t), void 0, null), n;
  }, useId: function() {
    var e = St(), t = Ie.identifierPrefix;
    if (ve) {
      var n = xt, r = Ct;
      n = (r & ~(1 << 32 - ct(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = fr++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = Tf++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Df = {
    readContext: it,
    useCallback: Ms,
    useContext: it,
    useEffect: Jo,
    useImperativeHandle: As,
    useInsertionEffect: js,
    useLayoutEffect: zs,
    useMemo: Fs,
    useReducer: Go,
    useRef: Is,
    useState: function() {
      return Go(dr);
    },
    useDebugValue: Zo,
    useDeferredValue: function(e) {
      var t = ut();
      return Us(t, Re.memoizedState, e);
    },
    useTransition: function() {
      var e = Go(dr)[0], t = ut().memoizedState;
      return [e, t];
    },
    useMutableSource: Es,
    useSyncExternalStore: Cs,
    useId: Vs,
    unstable_isNewReconciler: !1
  }, Af = { readContext: it, useCallback: Ms, useContext: it, useEffect: Jo, useImperativeHandle: As, useInsertionEffect: js, useLayoutEffect: zs, useMemo: Fs, useReducer: Xo, useRef: Is, useState: function() {
    return Xo(dr);
  }, useDebugValue: Zo, useDeferredValue: function(e) {
    var t = ut();
    return Re === null ? t.memoizedState = e : Us(t, Re.memoizedState, e);
  }, useTransition: function() {
    var e = Xo(dr)[0], t = ut().memoizedState;
    return [e, t];
  }, useMutableSource: Es, useSyncExternalStore: Cs, useId: Vs, unstable_isNewReconciler: !1 };
  function pt(e, t) {
    if (e && e.defaultProps) {
      t = M({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function bo(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : M({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var fl = { isMounted: function(e) {
    return (e = e._reactInternals) ? Gt(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = $e(), l = $t(e), o = Pt(r, l);
    o.payload = t, n != null && (o.callback = n), t = Wt(e, o, l), t !== null && (yt(t, e, l, r), rl(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = $e(), l = $t(e), o = Pt(r, l);
    o.tag = 1, o.payload = t, n != null && (o.callback = n), t = Wt(e, o, l), t !== null && (yt(t, e, l, r), rl(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = $e(), r = $t(e), l = Pt(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Wt(e, l, r), t !== null && (yt(t, e, r, n), rl(t, e, r));
  } };
  function Hs(e, t, n, r, l, o, i) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, o, i) : t.prototype && t.prototype.isPureReactComponent ? !bn(n, r) || !bn(l, o) : !0;
  }
  function $s(e, t, n) {
    var r = !1, l = Ft, o = t.contextType;
    return typeof o == "object" && o !== null ? o = it(o) : (l = qe(t) ? Jt : Ue.current, r = t.contextTypes, o = (r = r != null) ? kn(e, l) : Ft), t = new t(n, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = fl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
  }
  function Ks(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && fl.enqueueReplaceState(t, t.state, null);
  }
  function ei(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, Vo(e);
    var o = t.contextType;
    typeof o == "object" && o !== null ? l.context = it(o) : (o = qe(t) ? Jt : Ue.current, l.context = kn(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (bo(e, t, o, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && fl.enqueueReplaceState(l, l.state, null), ll(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Ln(e, t) {
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
  function ti(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function ni(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var Mf = typeof WeakMap == "function" ? WeakMap : Map;
  function qs(e, t, n) {
    n = Pt(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      gl || (gl = !0, vi = r), ni(e, t);
    }, n;
  }
  function Ys(e, t, n) {
    n = Pt(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        ni(e, t);
      };
    }
    var o = e.stateNode;
    return o !== null && typeof o.componentDidCatch == "function" && (n.callback = function() {
      ni(e, t), typeof r != "function" && (Qt === null ? Qt = /* @__PURE__ */ new Set([this]) : Qt.add(this));
      var i = t.stack;
      this.componentDidCatch(t.value, { componentStack: i !== null ? i : "" });
    }), n;
  }
  function Gs(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new Mf();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = Jf.bind(null, e, t, n), t.then(e, e));
  }
  function Xs(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function Js(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Pt(-1, 1), t.tag = 2, Wt(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var Ff = ce.ReactCurrentOwner, Ye = !1;
  function He(e, t, n, r) {
    t.child = e === null ? vs(t, null, n, r) : xn(t, e.child, n, r);
  }
  function Zs(e, t, n, r, l) {
    n = n.render;
    var o = t.ref;
    return Pn(t, l), r = qo(e, t, n, r, o, l), n = Yo(), e !== null && !Ye ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (ve && n && To(t), t.flags |= 1, He(e, t, r, l), t.child);
  }
  function bs(e, t, n, r, l) {
    if (e === null) {
      var o = n.type;
      return typeof o == "function" && !Ci(o) && o.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = o, ea(e, t, o, r, l)) : (e = Cl(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (o = e.child, (e.lanes & l) === 0) {
      var i = o.memoizedProps;
      if (n = n.compare, n = n !== null ? n : bn, n(i, r) && e.ref === t.ref) return Rt(e, t, l);
    }
    return t.flags |= 1, e = qt(o, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function ea(e, t, n, r, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (bn(o, r) && e.ref === t.ref) if (Ye = !1, t.pendingProps = r = o, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Ye = !0);
      else return t.lanes = e.lanes, Rt(e, t, l);
    }
    return ri(e, t, n, r, l);
  }
  function ta(e, t, n) {
    var r = t.pendingProps, l = r.children, o = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, de(In, rt), rt |= n;
    else {
      if ((n & 1073741824) === 0) return e = o !== null ? o.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, de(In, rt), rt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = o !== null ? o.baseLanes : n, de(In, rt), rt |= r;
    }
    else o !== null ? (r = o.baseLanes | n, t.memoizedState = null) : r = n, de(In, rt), rt |= r;
    return He(e, t, l, n), t.child;
  }
  function na(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function ri(e, t, n, r, l) {
    var o = qe(n) ? Jt : Ue.current;
    return o = kn(t, o), Pn(t, l), n = qo(e, t, n, r, o, l), r = Yo(), e !== null && !Ye ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (ve && r && To(t), t.flags |= 1, He(e, t, n, l), t.child);
  }
  function ra(e, t, n, r, l) {
    if (qe(n)) {
      var o = !0;
      Gr(t);
    } else o = !1;
    if (Pn(t, l), t.stateNode === null) pl(e, t), $s(t, n, r), ei(t, n, r, l), r = !0;
    else if (e === null) {
      var i = t.stateNode, s = t.memoizedProps;
      i.props = s;
      var c = i.context, y = n.contextType;
      typeof y == "object" && y !== null ? y = it(y) : (y = qe(n) ? Jt : Ue.current, y = kn(t, y));
      var _ = n.getDerivedStateFromProps, C = typeof _ == "function" || typeof i.getSnapshotBeforeUpdate == "function";
      C || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (s !== r || c !== y) && Ks(t, i, r, y), Vt = !1;
      var w = t.memoizedState;
      i.state = w, ll(t, r, i, l), c = t.memoizedState, s !== r || w !== c || Ke.current || Vt ? (typeof _ == "function" && (bo(t, n, _, r), c = t.memoizedState), (s = Vt || Hs(t, n, s, r, w, c, y)) ? (C || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = c), i.props = r, i.state = c, i.context = y, r = s) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      i = t.stateNode, ws(e, t), s = t.memoizedProps, y = t.type === t.elementType ? s : pt(t.type, s), i.props = y, C = t.pendingProps, w = i.context, c = n.contextType, typeof c == "object" && c !== null ? c = it(c) : (c = qe(n) ? Jt : Ue.current, c = kn(t, c));
      var D = n.getDerivedStateFromProps;
      (_ = typeof D == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (s !== C || w !== c) && Ks(t, i, r, c), Vt = !1, w = t.memoizedState, i.state = w, ll(t, r, i, l);
      var U = t.memoizedState;
      s !== C || w !== U || Ke.current || Vt ? (typeof D == "function" && (bo(t, n, D, r), U = t.memoizedState), (y = Vt || Hs(t, n, y, r, w, U, c) || !1) ? (_ || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(r, U, c), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(r, U, c)), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || s === e.memoizedProps && w === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || s === e.memoizedProps && w === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = U), i.props = r, i.state = U, i.context = c, r = y) : (typeof i.componentDidUpdate != "function" || s === e.memoizedProps && w === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || s === e.memoizedProps && w === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return li(e, t, n, r, o, l);
  }
  function li(e, t, n, r, l, o) {
    na(e, t);
    var i = (t.flags & 128) !== 0;
    if (!r && !i) return l && ss(t, n, !1), Rt(e, t, o);
    r = t.stateNode, Ff.current = t;
    var s = i && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && i ? (t.child = xn(t, e.child, null, o), t.child = xn(t, null, s, o)) : He(e, t, s, o), t.memoizedState = r.state, l && ss(t, n, !0), t.child;
  }
  function la(e) {
    var t = e.stateNode;
    t.pendingContext ? is(e, t.pendingContext, t.pendingContext !== t.context) : t.context && is(e, t.context, !1), Wo(e, t.containerInfo);
  }
  function oa(e, t, n, r, l) {
    return Cn(), zo(l), t.flags |= 256, He(e, t, n, r), t.child;
  }
  var oi = { dehydrated: null, treeContext: null, retryLane: 0 };
  function ii(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function ia(e, t, n) {
    var r = t.pendingProps, l = ke.current, o = !1, i = (t.flags & 128) !== 0, s;
    if ((s = i) || (s = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), s ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), de(ke, l & 1), e === null)
      return jo(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (i = r.children, e = r.fallback, o ? (r = t.mode, o = t.child, i = { mode: "hidden", children: i }, (r & 1) === 0 && o !== null ? (o.childLanes = 0, o.pendingProps = i) : o = xl(i, r, 0, null), e = sn(e, r, n, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = ii(n), t.memoizedState = oi, e) : ui(t, i));
    if (l = e.memoizedState, l !== null && (s = l.dehydrated, s !== null)) return Uf(e, t, i, r, s, l, n);
    if (o) {
      o = r.fallback, i = t.mode, l = e.child, s = l.sibling;
      var c = { mode: "hidden", children: r.children };
      return (i & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = c, t.deletions = null) : (r = qt(l, c), r.subtreeFlags = l.subtreeFlags & 14680064), s !== null ? o = qt(s, o) : (o = sn(o, i, n, null), o.flags |= 2), o.return = t, r.return = t, r.sibling = o, t.child = r, r = o, o = t.child, i = e.child.memoizedState, i = i === null ? ii(n) : { baseLanes: i.baseLanes | n, cachePool: null, transitions: i.transitions }, o.memoizedState = i, o.childLanes = e.childLanes & ~n, t.memoizedState = oi, r;
    }
    return o = e.child, e = o.sibling, r = qt(o, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function ui(e, t) {
    return t = xl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function dl(e, t, n, r) {
    return r !== null && zo(r), xn(t, e.child, null, n), e = ui(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Uf(e, t, n, r, l, o, i) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = ti(Error(u(422))), dl(e, t, i, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = r.fallback, l = t.mode, r = xl({ mode: "visible", children: r.children }, l, 0, null), o = sn(o, l, i, null), o.flags |= 2, r.return = t, o.return = t, r.sibling = o, t.child = r, (t.mode & 1) !== 0 && xn(t, e.child, null, i), t.child.memoizedState = ii(i), t.memoizedState = oi, o);
    if ((t.mode & 1) === 0) return dl(e, t, i, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var s = r.dgst;
      return r = s, o = Error(u(419)), r = ti(o, r, void 0), dl(e, t, i, r);
    }
    if (s = (i & e.childLanes) !== 0, Ye || s) {
      if (r = Ie, r !== null) {
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
        l = (l & (r.suspendedLanes | i)) !== 0 ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, Nt(e, l), yt(r, e, l, -1));
      }
      return Ei(), r = ti(Error(u(421))), dl(e, t, i, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Zf.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, nt = At(l.nextSibling), tt = t, ve = !0, dt = null, e !== null && (lt[ot++] = Ct, lt[ot++] = xt, lt[ot++] = Zt, Ct = e.id, xt = e.overflow, Zt = t), t = ui(t, r.children), t.flags |= 4096, t);
  }
  function ua(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Fo(e.return, t, n);
  }
  function si(e, t, n, r, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = l);
  }
  function sa(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, o = r.tail;
    if (He(e, t, r.children, n), r = ke.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && ua(e, n, t);
        else if (e.tag === 19) ua(e, n, t);
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
    if (de(ke, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && ol(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), si(t, !1, l, n, o);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && ol(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        si(t, !0, n, null, o);
        break;
      case "together":
        si(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function pl(e, t) {
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
  function Vf(e, t, n) {
    switch (t.tag) {
      case 3:
        la(t), Cn();
        break;
      case 5:
        _s(t);
        break;
      case 1:
        qe(t.type) && Gr(t);
        break;
      case 4:
        Wo(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        de(tl, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (de(ke, ke.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? ia(e, t, n) : (de(ke, ke.current & 1), e = Rt(e, t, n), e !== null ? e.sibling : null);
        de(ke, ke.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return sa(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), de(ke, ke.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, ta(e, t, n);
    }
    return Rt(e, t, n);
  }
  var aa, ai, ca, fa;
  aa = function(e, t) {
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
  }, ai = function() {
  }, ca = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, tn(wt.current);
      var o = null;
      switch (n) {
        case "input":
          l = Ml(e, l), r = Ml(e, r), o = [];
          break;
        case "select":
          l = M({}, l, { value: void 0 }), r = M({}, r, { value: void 0 }), o = [];
          break;
        case "textarea":
          l = Vl(e, l), r = Vl(e, r), o = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Kr);
      }
      Bl(n, r);
      var i;
      n = null;
      for (y in l) if (!r.hasOwnProperty(y) && l.hasOwnProperty(y) && l[y] != null) if (y === "style") {
        var s = l[y];
        for (i in s) s.hasOwnProperty(i) && (n || (n = {}), n[i] = "");
      } else y !== "dangerouslySetInnerHTML" && y !== "children" && y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && y !== "autoFocus" && (E.hasOwnProperty(y) ? o || (o = []) : (o = o || []).push(y, null));
      for (y in r) {
        var c = r[y];
        if (s = l?.[y], r.hasOwnProperty(y) && c !== s && (c != null || s != null)) if (y === "style") if (s) {
          for (i in s) !s.hasOwnProperty(i) || c && c.hasOwnProperty(i) || (n || (n = {}), n[i] = "");
          for (i in c) c.hasOwnProperty(i) && s[i] !== c[i] && (n || (n = {}), n[i] = c[i]);
        } else n || (o || (o = []), o.push(
          y,
          n
        )), n = c;
        else y === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, s = s ? s.__html : void 0, c != null && s !== c && (o = o || []).push(y, c)) : y === "children" ? typeof c != "string" && typeof c != "number" || (o = o || []).push(y, "" + c) : y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && (E.hasOwnProperty(y) ? (c != null && y === "onScroll" && pe("scroll", e), o || s === c || (o = [])) : (o = o || []).push(y, c));
      }
      n && (o = o || []).push("style", n);
      var y = o;
      (t.updateQueue = y) && (t.flags |= 4);
    }
  }, fa = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function mr(e, t) {
    if (!ve) switch (e.tailMode) {
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
  function Wf(e, t, n) {
    var r = t.pendingProps;
    switch (Io(t), t.tag) {
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
        return qe(t.type) && Yr(), We(t), null;
      case 3:
        return r = t.stateNode, Rn(), me(Ke), me(Ue), Ho(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (br(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, dt !== null && (Si(dt), dt = null))), ai(e, t), We(t), null;
      case 5:
        Bo(t);
        var l = tn(ar.current);
        if (n = t.type, e !== null && t.stateNode != null) ca(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(u(166));
            return We(t), null;
          }
          if (e = tn(wt.current), br(t)) {
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
                $i(r, o), pe("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!o.multiple }, pe("invalid", r);
                break;
              case "textarea":
                Yi(r, o), pe("invalid", r);
            }
            Bl(n, o), l = null;
            for (var i in o) if (o.hasOwnProperty(i)) {
              var s = o[i];
              i === "children" ? typeof s == "string" ? r.textContent !== s && (o.suppressHydrationWarning !== !0 && $r(r.textContent, s, e), l = ["children", s]) : typeof s == "number" && r.textContent !== "" + s && (o.suppressHydrationWarning !== !0 && $r(
                r.textContent,
                s,
                e
              ), l = ["children", "" + s]) : E.hasOwnProperty(i) && s != null && i === "onScroll" && pe("scroll", r);
            }
            switch (n) {
              case "input":
                _r(r), qi(r, o, !0);
                break;
              case "textarea":
                _r(r), Xi(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (r.onclick = Kr);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            i = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Ji(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = i.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = i.createElement(n, { is: r.is }) : (e = i.createElement(n), n === "select" && (i = e, r.multiple ? i.multiple = !0 : r.size && (i.size = r.size))) : e = i.createElementNS(e, n), e[gt] = t, e[lr] = r, aa(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (i = Ql(n, r), n) {
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
                  $i(e, r), l = Ml(e, r), pe("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = M({}, r, { value: void 0 }), pe("invalid", e);
                  break;
                case "textarea":
                  Yi(e, r), l = Vl(e, r), pe("invalid", e);
                  break;
                default:
                  l = r;
              }
              Bl(n, l), s = l;
              for (o in s) if (s.hasOwnProperty(o)) {
                var c = s[o];
                o === "style" ? eu(e, c) : o === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, c != null && Zi(e, c)) : o === "children" ? typeof c == "string" ? (n !== "textarea" || c !== "") && An(e, c) : typeof c == "number" && An(e, "" + c) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (E.hasOwnProperty(o) ? c != null && o === "onScroll" && pe("scroll", e) : c != null && j(e, o, c, i));
              }
              switch (n) {
                case "input":
                  _r(e), qi(e, r, !1);
                  break;
                case "textarea":
                  _r(e), Xi(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + se(r.value));
                  break;
                case "select":
                  e.multiple = !!r.multiple, o = r.value, o != null ? an(e, !!r.multiple, o, !1) : r.defaultValue != null && an(
                    e,
                    !!r.multiple,
                    r.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof l.onClick == "function" && (e.onclick = Kr);
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
        if (e && t.stateNode != null) fa(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(u(166));
          if (n = tn(ar.current), tn(wt.current), br(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[gt] = t, (o = r.nodeValue !== n) && (e = tt, e !== null)) switch (e.tag) {
              case 3:
                $r(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && $r(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            o && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[gt] = t, t.stateNode = r;
        }
        return We(t), null;
      case 13:
        if (me(ke), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (ve && nt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) ms(), Cn(), t.flags |= 98560, o = !1;
          else if (o = br(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(u(318));
              if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(u(317));
              o[gt] = t;
            } else Cn(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            We(t), o = !1;
          } else dt !== null && (Si(dt), dt = null), o = !0;
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (ke.current & 1) !== 0 ? Le === 0 && (Le = 3) : Ei())), t.updateQueue !== null && (t.flags |= 4), We(t), null);
      case 4:
        return Rn(), ai(e, t), e === null && nr(t.stateNode.containerInfo), We(t), null;
      case 10:
        return Mo(t.type._context), We(t), null;
      case 17:
        return qe(t.type) && Yr(), We(t), null;
      case 19:
        if (me(ke), o = t.memoizedState, o === null) return We(t), null;
        if (r = (t.flags & 128) !== 0, i = o.rendering, i === null) if (r) mr(o, !1);
        else {
          if (Le !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (i = ol(e), i !== null) {
              for (t.flags |= 128, mr(o, !1), r = i.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) o = n, e = r, o.flags &= 14680066, i = o.alternate, i === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = i.childLanes, o.lanes = i.lanes, o.child = i.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = i.memoizedProps, o.memoizedState = i.memoizedState, o.updateQueue = i.updateQueue, o.type = i.type, e = i.dependencies, o.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return de(ke, ke.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          o.tail !== null && Ce() > On && (t.flags |= 128, r = !0, mr(o, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = ol(i), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), mr(o, !0), o.tail === null && o.tailMode === "hidden" && !i.alternate && !ve) return We(t), null;
          } else 2 * Ce() - o.renderingStartTime > On && n !== 1073741824 && (t.flags |= 128, r = !0, mr(o, !1), t.lanes = 4194304);
          o.isBackwards ? (i.sibling = t.child, t.child = i) : (n = o.last, n !== null ? n.sibling = i : t.child = i, o.last = i);
        }
        return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = Ce(), t.sibling = null, n = ke.current, de(ke, r ? n & 1 | 2 : n & 1), t) : (We(t), null);
      case 22:
      case 23:
        return _i(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (rt & 1073741824) !== 0 && (We(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : We(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(u(156, t.tag));
  }
  function Bf(e, t) {
    switch (Io(t), t.tag) {
      case 1:
        return qe(t.type) && Yr(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Rn(), me(Ke), me(Ue), Ho(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Bo(t), null;
      case 13:
        if (me(ke), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(u(340));
          Cn();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return me(ke), null;
      case 4:
        return Rn(), null;
      case 10:
        return Mo(t.type._context), null;
      case 22:
      case 23:
        return _i(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var ml = !1, Be = !1, Qf = typeof WeakSet == "function" ? WeakSet : Set, F = null;
  function Tn(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      Ee(e, t, r);
    }
    else n.current = null;
  }
  function ci(e, t, n) {
    try {
      n();
    } catch (r) {
      Ee(e, t, r);
    }
  }
  var da = !1;
  function Hf(e, t) {
    if (_o = zr, e = Hu(), mo(e)) {
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
          var i = 0, s = -1, c = -1, y = 0, _ = 0, C = e, w = null;
          t: for (; ; ) {
            for (var D; C !== n || l !== 0 && C.nodeType !== 3 || (s = i + l), C !== o || r !== 0 && C.nodeType !== 3 || (c = i + r), C.nodeType === 3 && (i += C.nodeValue.length), (D = C.firstChild) !== null; )
              w = C, C = D;
            for (; ; ) {
              if (C === e) break t;
              if (w === n && ++y === l && (s = i), w === o && ++_ === r && (c = i), (D = C.nextSibling) !== null) break;
              C = w, w = C.parentNode;
            }
            C = D;
          }
          n = s === -1 || c === -1 ? null : { start: s, end: c };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Eo = { focusedElem: e, selectionRange: n }, zr = !1, F = t; F !== null; ) if (t = F, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, F = e;
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
              var W = U.memoizedProps, xe = U.memoizedState, m = t.stateNode, d = m.getSnapshotBeforeUpdate(t.elementType === t.type ? W : pt(t.type, W), xe);
              m.__reactInternalSnapshotBeforeUpdate = d;
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
        Ee(t, t.return, L);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, F = e;
        break;
      }
      F = t.return;
    }
    return U = da, da = !1, U;
  }
  function hr(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          l.destroy = void 0, o !== void 0 && ci(t, n, o);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function hl(e, t) {
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
  function fi(e) {
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
  function pa(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, pa(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[gt], delete t[lr], delete t[Po], delete t[Nf], delete t[Pf])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function ma(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function ha(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || ma(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function di(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Kr));
    else if (r !== 4 && (e = e.child, e !== null)) for (di(e, t, n), e = e.sibling; e !== null; ) di(e, t, n), e = e.sibling;
  }
  function pi(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (pi(e, t, n), e = e.sibling; e !== null; ) pi(e, t, n), e = e.sibling;
  }
  var ze = null, mt = !1;
  function Bt(e, t, n) {
    for (n = n.child; n !== null; ) ya(e, t, n), n = n.sibling;
  }
  function ya(e, t, n) {
    if (vt && typeof vt.onCommitFiberUnmount == "function") try {
      vt.onCommitFiberUnmount(Rr, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        Be || Tn(n, t);
      case 6:
        var r = ze, l = mt;
        ze = null, Bt(e, t, n), ze = r, mt = l, ze !== null && (mt ? (e = ze, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : ze.removeChild(n.stateNode));
        break;
      case 18:
        ze !== null && (mt ? (e = ze, n = n.stateNode, e.nodeType === 8 ? No(e.parentNode, n) : e.nodeType === 1 && No(e, n), qn(e)) : No(ze, n.stateNode));
        break;
      case 4:
        r = ze, l = mt, ze = n.stateNode.containerInfo, mt = !0, Bt(e, t, n), ze = r, mt = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Be && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var o = l, i = o.destroy;
            o = o.tag, i !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && ci(n, t, i), l = l.next;
          } while (l !== r);
        }
        Bt(e, t, n);
        break;
      case 1:
        if (!Be && (Tn(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (s) {
          Ee(n, t, s);
        }
        Bt(e, t, n);
        break;
      case 21:
        Bt(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (Be = (r = Be) || n.memoizedState !== null, Bt(e, t, n), Be = r) : Bt(e, t, n);
        break;
      default:
        Bt(e, t, n);
    }
  }
  function va(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new Qf()), t.forEach(function(r) {
        var l = bf.bind(null, e, r);
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
              ze = s.stateNode, mt = !1;
              break e;
            case 3:
              ze = s.stateNode.containerInfo, mt = !0;
              break e;
            case 4:
              ze = s.stateNode.containerInfo, mt = !0;
              break e;
          }
          s = s.return;
        }
        if (ze === null) throw Error(u(160));
        ya(o, i, l), ze = null, mt = !1;
        var c = l.alternate;
        c !== null && (c.return = null), l.return = null;
      } catch (y) {
        Ee(l, t, y);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) ga(t, e), t = t.sibling;
  }
  function ga(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ht(t, e), kt(e), r & 4) {
          try {
            hr(3, e, e.return), hl(3, e);
          } catch (W) {
            Ee(e, e.return, W);
          }
          try {
            hr(5, e, e.return);
          } catch (W) {
            Ee(e, e.return, W);
          }
        }
        break;
      case 1:
        ht(t, e), kt(e), r & 512 && n !== null && Tn(n, n.return);
        break;
      case 5:
        if (ht(t, e), kt(e), r & 512 && n !== null && Tn(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            An(l, "");
          } catch (W) {
            Ee(e, e.return, W);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var o = e.memoizedProps, i = n !== null ? n.memoizedProps : o, s = e.type, c = e.updateQueue;
          if (e.updateQueue = null, c !== null) try {
            s === "input" && o.type === "radio" && o.name != null && Ki(l, o), Ql(s, i);
            var y = Ql(s, o);
            for (i = 0; i < c.length; i += 2) {
              var _ = c[i], C = c[i + 1];
              _ === "style" ? eu(l, C) : _ === "dangerouslySetInnerHTML" ? Zi(l, C) : _ === "children" ? An(l, C) : j(l, _, C, y);
            }
            switch (s) {
              case "input":
                Fl(l, o);
                break;
              case "textarea":
                Gi(l, o);
                break;
              case "select":
                var w = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!o.multiple;
                var D = o.value;
                D != null ? an(l, !!o.multiple, D, !1) : w !== !!o.multiple && (o.defaultValue != null ? an(
                  l,
                  !!o.multiple,
                  o.defaultValue,
                  !0
                ) : an(l, !!o.multiple, o.multiple ? [] : "", !1));
            }
            l[lr] = o;
          } catch (W) {
            Ee(e, e.return, W);
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
            Ee(e, e.return, W);
          }
        }
        break;
      case 3:
        if (ht(t, e), kt(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          qn(t.containerInfo);
        } catch (W) {
          Ee(e, e.return, W);
        }
        break;
      case 4:
        ht(t, e), kt(e);
        break;
      case 13:
        ht(t, e), kt(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (yi = Ce())), r & 4 && va(e);
        break;
      case 22:
        if (_ = n !== null && n.memoizedState !== null, e.mode & 1 ? (Be = (y = Be) || _, ht(t, e), Be = y) : ht(t, e), kt(e), r & 8192) {
          if (y = e.memoizedState !== null, (e.stateNode.isHidden = y) && !_ && (e.mode & 1) !== 0) for (F = e, _ = e.child; _ !== null; ) {
            for (C = F = _; F !== null; ) {
              switch (w = F, D = w.child, w.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  hr(4, w, w.return);
                  break;
                case 1:
                  Tn(w, w.return);
                  var U = w.stateNode;
                  if (typeof U.componentWillUnmount == "function") {
                    r = w, n = w.return;
                    try {
                      t = r, U.props = t.memoizedProps, U.state = t.memoizedState, U.componentWillUnmount();
                    } catch (W) {
                      Ee(r, n, W);
                    }
                  }
                  break;
                case 5:
                  Tn(w, w.return);
                  break;
                case 22:
                  if (w.memoizedState !== null) {
                    ka(C);
                    continue;
                  }
              }
              D !== null ? (D.return = w, F = D) : ka(C);
            }
            _ = _.sibling;
          }
          e: for (_ = null, C = e; ; ) {
            if (C.tag === 5) {
              if (_ === null) {
                _ = C;
                try {
                  l = C.stateNode, y ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (s = C.stateNode, c = C.memoizedProps.style, i = c != null && c.hasOwnProperty("display") ? c.display : null, s.style.display = bi("display", i));
                } catch (W) {
                  Ee(e, e.return, W);
                }
              }
            } else if (C.tag === 6) {
              if (_ === null) try {
                C.stateNode.nodeValue = y ? "" : C.memoizedProps;
              } catch (W) {
                Ee(e, e.return, W);
              }
            } else if ((C.tag !== 22 && C.tag !== 23 || C.memoizedState === null || C === e) && C.child !== null) {
              C.child.return = C, C = C.child;
              continue;
            }
            if (C === e) break e;
            for (; C.sibling === null; ) {
              if (C.return === null || C.return === e) break e;
              _ === C && (_ = null), C = C.return;
            }
            _ === C && (_ = null), C.sibling.return = C.return, C = C.sibling;
          }
        }
        break;
      case 19:
        ht(t, e), kt(e), r & 4 && va(e);
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
            if (ma(n)) {
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
            var o = ha(e);
            pi(e, o, l);
            break;
          case 3:
          case 4:
            var i = r.stateNode.containerInfo, s = ha(e);
            di(e, s, i);
            break;
          default:
            throw Error(u(161));
        }
      } catch (c) {
        Ee(e, e.return, c);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function $f(e, t, n) {
    F = e, wa(e);
  }
  function wa(e, t, n) {
    for (var r = (e.mode & 1) !== 0; F !== null; ) {
      var l = F, o = l.child;
      if (l.tag === 22 && r) {
        var i = l.memoizedState !== null || ml;
        if (!i) {
          var s = l.alternate, c = s !== null && s.memoizedState !== null || Be;
          s = ml;
          var y = Be;
          if (ml = i, (Be = c) && !y) for (F = l; F !== null; ) i = F, c = i.child, i.tag === 22 && i.memoizedState !== null ? _a(l) : c !== null ? (c.return = i, F = c) : _a(l);
          for (; o !== null; ) F = o, wa(o), o = o.sibling;
          F = l, ml = s, Be = y;
        }
        Sa(e);
      } else (l.subtreeFlags & 8772) !== 0 && o !== null ? (o.return = l, F = o) : Sa(e);
    }
  }
  function Sa(e) {
    for (; F !== null; ) {
      var t = F;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Be || hl(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !Be) if (n === null) r.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : pt(t.type, n.memoizedProps);
                r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var o = t.updateQueue;
              o !== null && ks(t, o, r);
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
                ks(t, i, n);
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
                  var _ = y.memoizedState;
                  if (_ !== null) {
                    var C = _.dehydrated;
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
          Be || t.flags & 512 && fi(t);
        } catch (w) {
          Ee(t, t.return, w);
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
  function ka(e) {
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
  function _a(e) {
    for (; F !== null; ) {
      var t = F;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              hl(4, t);
            } catch (c) {
              Ee(t, n, c);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (c) {
                Ee(t, l, c);
              }
            }
            var o = t.return;
            try {
              fi(t);
            } catch (c) {
              Ee(t, o, c);
            }
            break;
          case 5:
            var i = t.return;
            try {
              fi(t);
            } catch (c) {
              Ee(t, i, c);
            }
        }
      } catch (c) {
        Ee(t, t.return, c);
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
  var Kf = Math.ceil, yl = ce.ReactCurrentDispatcher, mi = ce.ReactCurrentOwner, st = ce.ReactCurrentBatchConfig, le = 0, Ie = null, Pe = null, De = 0, rt = 0, In = Mt(0), Le = 0, yr = null, rn = 0, vl = 0, hi = 0, vr = null, Ge = null, yi = 0, On = 1 / 0, Lt = null, gl = !1, vi = null, Qt = null, wl = !1, Ht = null, Sl = 0, gr = 0, gi = null, kl = -1, _l = 0;
  function $e() {
    return (le & 6) !== 0 ? Ce() : kl !== -1 ? kl : kl = Ce();
  }
  function $t(e) {
    return (e.mode & 1) === 0 ? 1 : (le & 2) !== 0 && De !== 0 ? De & -De : Lf.transition !== null ? (_l === 0 && (_l = hu()), _l) : (e = ae, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Cu(e.type)), e);
  }
  function yt(e, t, n, r) {
    if (50 < gr) throw gr = 0, gi = null, Error(u(185));
    Bn(e, n, r), ((le & 2) === 0 || e !== Ie) && (e === Ie && ((le & 2) === 0 && (vl |= n), Le === 4 && Kt(e, De)), Xe(e, r), n === 1 && le === 0 && (t.mode & 1) === 0 && (On = Ce() + 500, Xr && Ut()));
  }
  function Xe(e, t) {
    var n = e.callbackNode;
    Rc(e, t);
    var r = Ir(e, e === Ie ? De : 0);
    if (r === 0) n !== null && du(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && du(n), t === 1) e.tag === 0 ? Rf(Ca.bind(null, e)) : as(Ca.bind(null, e)), Cf(function() {
        (le & 6) === 0 && Ut();
      }), n = null;
      else {
        switch (yu(r)) {
          case 1:
            n = Xl;
            break;
          case 4:
            n = pu;
            break;
          case 16:
            n = Pr;
            break;
          case 536870912:
            n = mu;
            break;
          default:
            n = Pr;
        }
        n = Oa(n, Ea.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function Ea(e, t) {
    if (kl = -1, _l = 0, (le & 6) !== 0) throw Error(u(327));
    var n = e.callbackNode;
    if (jn() && e.callbackNode !== n) return null;
    var r = Ir(e, e === Ie ? De : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = El(e, r);
    else {
      t = r;
      var l = le;
      le |= 2;
      var o = Na();
      (Ie !== e || De !== t) && (Lt = null, On = Ce() + 500, on(e, t));
      do
        try {
          Gf();
          break;
        } catch (s) {
          xa(e, s);
        }
      while (!0);
      Ao(), yl.current = o, le = l, Pe !== null ? t = 0 : (Ie = null, De = 0, t = Le);
    }
    if (t !== 0) {
      if (t === 2 && (l = Jl(e), l !== 0 && (r = l, t = wi(e, l))), t === 1) throw n = yr, on(e, 0), Kt(e, r), Xe(e, Ce()), n;
      if (t === 6) Kt(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !qf(l) && (t = El(e, r), t === 2 && (o = Jl(e), o !== 0 && (r = o, t = wi(e, o))), t === 1)) throw n = yr, on(e, 0), Kt(e, r), Xe(e, Ce()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(u(345));
          case 2:
            un(e, Ge, Lt);
            break;
          case 3:
            if (Kt(e, r), (r & 130023424) === r && (t = yi + 500 - Ce(), 10 < t)) {
              if (Ir(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                $e(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = xo(un.bind(null, e, Ge, Lt), t);
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
            if (r = l, r = Ce() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * Kf(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = xo(un.bind(null, e, Ge, Lt), r);
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
    return Xe(e, Ce()), e.callbackNode === n ? Ea.bind(null, e) : null;
  }
  function wi(e, t) {
    var n = vr;
    return e.current.memoizedState.isDehydrated && (on(e, t).flags |= 256), e = El(e, t), e !== 2 && (t = Ge, Ge = n, t !== null && Si(t)), e;
  }
  function Si(e) {
    Ge === null ? Ge = e : Ge.push.apply(Ge, e);
  }
  function qf(e) {
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
    for (t &= ~hi, t &= ~vl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - ct(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function Ca(e) {
    if ((le & 6) !== 0) throw Error(u(327));
    jn();
    var t = Ir(e, 0);
    if ((t & 1) === 0) return Xe(e, Ce()), null;
    var n = El(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = Jl(e);
      r !== 0 && (t = r, n = wi(e, r));
    }
    if (n === 1) throw n = yr, on(e, 0), Kt(e, t), Xe(e, Ce()), n;
    if (n === 6) throw Error(u(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, un(e, Ge, Lt), Xe(e, Ce()), null;
  }
  function ki(e, t) {
    var n = le;
    le |= 1;
    try {
      return e(t);
    } finally {
      le = n, le === 0 && (On = Ce() + 500, Xr && Ut());
    }
  }
  function ln(e) {
    Ht !== null && Ht.tag === 0 && (le & 6) === 0 && jn();
    var t = le;
    le |= 1;
    var n = st.transition, r = ae;
    try {
      if (st.transition = null, ae = 1, e) return e();
    } finally {
      ae = r, st.transition = n, le = t, (le & 6) === 0 && Ut();
    }
  }
  function _i() {
    rt = In.current, me(In);
  }
  function on(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Ef(n)), Pe !== null) for (n = Pe.return; n !== null; ) {
      var r = n;
      switch (Io(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && Yr();
          break;
        case 3:
          Rn(), me(Ke), me(Ue), Ho();
          break;
        case 5:
          Bo(r);
          break;
        case 4:
          Rn();
          break;
        case 13:
          me(ke);
          break;
        case 19:
          me(ke);
          break;
        case 10:
          Mo(r.type._context);
          break;
        case 22:
        case 23:
          _i();
      }
      n = n.return;
    }
    if (Ie = e, Pe = e = qt(e.current, null), De = rt = t, Le = 0, yr = null, hi = vl = rn = 0, Ge = vr = null, en !== null) {
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
  function xa(e, t) {
    do {
      var n = Pe;
      try {
        if (Ao(), il.current = cl, ul) {
          for (var r = _e.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          ul = !1;
        }
        if (nn = 0, Te = Re = _e = null, cr = !1, fr = 0, mi.current = null, n === null || n.return === null) {
          Le = 1, yr = t, Pe = null;
          break;
        }
        e: {
          var o = e, i = n.return, s = n, c = t;
          if (t = De, s.flags |= 32768, c !== null && typeof c == "object" && typeof c.then == "function") {
            var y = c, _ = s, C = _.tag;
            if ((_.mode & 1) === 0 && (C === 0 || C === 11 || C === 15)) {
              var w = _.alternate;
              w ? (_.updateQueue = w.updateQueue, _.memoizedState = w.memoizedState, _.lanes = w.lanes) : (_.updateQueue = null, _.memoizedState = null);
            }
            var D = Xs(i);
            if (D !== null) {
              D.flags &= -257, Js(D, i, s, o, t), D.mode & 1 && Gs(o, y, t), t = D, c = y;
              var U = t.updateQueue;
              if (U === null) {
                var W = /* @__PURE__ */ new Set();
                W.add(c), t.updateQueue = W;
              } else U.add(c);
              break e;
            } else {
              if ((t & 1) === 0) {
                Gs(o, y, t), Ei();
                break e;
              }
              c = Error(u(426));
            }
          } else if (ve && s.mode & 1) {
            var xe = Xs(i);
            if (xe !== null) {
              (xe.flags & 65536) === 0 && (xe.flags |= 256), Js(xe, i, s, o, t), zo(Ln(c, s));
              break e;
            }
          }
          o = c = Ln(c, s), Le !== 4 && (Le = 2), vr === null ? vr = [o] : vr.push(o), o = i;
          do {
            switch (o.tag) {
              case 3:
                o.flags |= 65536, t &= -t, o.lanes |= t;
                var m = qs(o, c, t);
                Ss(o, m);
                break e;
              case 1:
                s = c;
                var d = o.type, h = o.stateNode;
                if ((o.flags & 128) === 0 && (typeof d.getDerivedStateFromError == "function" || h !== null && typeof h.componentDidCatch == "function" && (Qt === null || !Qt.has(h)))) {
                  o.flags |= 65536, t &= -t, o.lanes |= t;
                  var L = Ys(o, s, t);
                  Ss(o, L);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        Ra(n);
      } catch (B) {
        t = B, Pe === n && n !== null && (Pe = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Na() {
    var e = yl.current;
    return yl.current = cl, e === null ? cl : e;
  }
  function Ei() {
    (Le === 0 || Le === 3 || Le === 2) && (Le = 4), Ie === null || (rn & 268435455) === 0 && (vl & 268435455) === 0 || Kt(Ie, De);
  }
  function El(e, t) {
    var n = le;
    le |= 2;
    var r = Na();
    (Ie !== e || De !== t) && (Lt = null, on(e, t));
    do
      try {
        Yf();
        break;
      } catch (l) {
        xa(e, l);
      }
    while (!0);
    if (Ao(), le = n, yl.current = r, Pe !== null) throw Error(u(261));
    return Ie = null, De = 0, Le;
  }
  function Yf() {
    for (; Pe !== null; ) Pa(Pe);
  }
  function Gf() {
    for (; Pe !== null && !wc(); ) Pa(Pe);
  }
  function Pa(e) {
    var t = Ia(e.alternate, e, rt);
    e.memoizedProps = e.pendingProps, t === null ? Ra(e) : Pe = t, mi.current = null;
  }
  function Ra(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = Wf(n, t, rt), n !== null) {
          Pe = n;
          return;
        }
      } else {
        if (n = Bf(n, t), n !== null) {
          n.flags &= 32767, Pe = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          Le = 6, Pe = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        Pe = t;
        return;
      }
      Pe = t = e;
    } while (t !== null);
    Le === 0 && (Le = 5);
  }
  function un(e, t, n) {
    var r = ae, l = st.transition;
    try {
      st.transition = null, ae = 1, Xf(e, t, n, r);
    } finally {
      st.transition = l, ae = r;
    }
    return null;
  }
  function Xf(e, t, n, r) {
    do
      jn();
    while (Ht !== null);
    if ((le & 6) !== 0) throw Error(u(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(u(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var o = n.lanes | n.childLanes;
    if (Lc(e, o), e === Ie && (Pe = Ie = null, De = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || wl || (wl = !0, Oa(Pr, function() {
      return jn(), null;
    })), o = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || o) {
      o = st.transition, st.transition = null;
      var i = ae;
      ae = 1;
      var s = le;
      le |= 4, mi.current = null, Hf(e, n), ga(n, e), yf(Eo), zr = !!_o, Eo = _o = null, e.current = n, $f(n), Sc(), le = s, ae = i, st.transition = o;
    } else e.current = n;
    if (wl && (wl = !1, Ht = e, Sl = l), o = e.pendingLanes, o === 0 && (Qt = null), Ec(n.stateNode), Xe(e, Ce()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (gl) throw gl = !1, e = vi, vi = null, e;
    return (Sl & 1) !== 0 && e.tag !== 0 && jn(), o = e.pendingLanes, (o & 1) !== 0 ? e === gi ? gr++ : (gr = 0, gi = e) : gr = 0, Ut(), null;
  }
  function jn() {
    if (Ht !== null) {
      var e = yu(Sl), t = st.transition, n = ae;
      try {
        if (st.transition = null, ae = 16 > e ? 16 : e, Ht === null) var r = !1;
        else {
          if (e = Ht, Ht = null, Sl = 0, (le & 6) !== 0) throw Error(u(331));
          var l = le;
          for (le |= 4, F = e.current; F !== null; ) {
            var o = F, i = o.child;
            if ((F.flags & 16) !== 0) {
              var s = o.deletions;
              if (s !== null) {
                for (var c = 0; c < s.length; c++) {
                  var y = s[c];
                  for (F = y; F !== null; ) {
                    var _ = F;
                    switch (_.tag) {
                      case 0:
                      case 11:
                      case 15:
                        hr(8, _, o);
                    }
                    var C = _.child;
                    if (C !== null) C.return = _, F = C;
                    else for (; F !== null; ) {
                      _ = F;
                      var w = _.sibling, D = _.return;
                      if (pa(_), _ === y) {
                        F = null;
                        break;
                      }
                      if (w !== null) {
                        w.return = D, F = w;
                        break;
                      }
                      F = D;
                    }
                  }
                }
                var U = o.alternate;
                if (U !== null) {
                  var W = U.child;
                  if (W !== null) {
                    U.child = null;
                    do {
                      var xe = W.sibling;
                      W.sibling = null, W = xe;
                    } while (W !== null);
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
          var d = e.current;
          for (F = d; F !== null; ) {
            i = F;
            var h = i.child;
            if ((i.subtreeFlags & 2064) !== 0 && h !== null) h.return = i, F = h;
            else e: for (i = d; F !== null; ) {
              if (s = F, (s.flags & 2048) !== 0) try {
                switch (s.tag) {
                  case 0:
                  case 11:
                  case 15:
                    hl(9, s);
                }
              } catch (B) {
                Ee(s, s.return, B);
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
          if (le = l, Ut(), vt && typeof vt.onPostCommitFiberRoot == "function") try {
            vt.onPostCommitFiberRoot(Rr, e);
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
  function La(e, t, n) {
    t = Ln(n, t), t = qs(e, t, 1), e = Wt(e, t, 1), t = $e(), e !== null && (Bn(e, 1, t), Xe(e, t));
  }
  function Ee(e, t, n) {
    if (e.tag === 3) La(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        La(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Qt === null || !Qt.has(r))) {
          e = Ln(n, e), e = Ys(t, e, 1), t = Wt(t, e, 1), e = $e(), t !== null && (Bn(t, 1, e), Xe(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function Jf(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = $e(), e.pingedLanes |= e.suspendedLanes & n, Ie === e && (De & n) === n && (Le === 4 || Le === 3 && (De & 130023424) === De && 500 > Ce() - yi ? on(e, 0) : hi |= n), Xe(e, t);
  }
  function Ta(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = Tr, Tr <<= 1, (Tr & 130023424) === 0 && (Tr = 4194304)));
    var n = $e();
    e = Nt(e, t), e !== null && (Bn(e, t, n), Xe(e, n));
  }
  function Zf(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Ta(e, n);
  }
  function bf(e, t) {
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
    r !== null && r.delete(t), Ta(e, n);
  }
  var Ia;
  Ia = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Ke.current) Ye = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Ye = !1, Vf(e, t, n);
      Ye = (e.flags & 131072) !== 0;
    }
    else Ye = !1, ve && (t.flags & 1048576) !== 0 && cs(t, Zr, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        pl(e, t), e = t.pendingProps;
        var l = kn(t, Ue.current);
        Pn(t, n), l = qo(null, t, r, e, l, n);
        var o = Yo();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, qe(r) ? (o = !0, Gr(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Vo(t), l.updater = fl, t.stateNode = l, l._reactInternals = t, ei(t, r, e, n), t = li(null, t, r, !0, o, n)) : (t.tag = 0, ve && o && To(t), He(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (pl(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = td(r), e = pt(r, e), l) {
            case 0:
              t = ri(null, t, r, e, n);
              break e;
            case 1:
              t = ra(null, t, r, e, n);
              break e;
            case 11:
              t = Zs(null, t, r, e, n);
              break e;
            case 14:
              t = bs(null, t, r, pt(r.type, e), n);
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
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pt(r, l), ri(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pt(r, l), ra(e, t, r, l, n);
      case 3:
        e: {
          if (la(t), e === null) throw Error(u(387));
          r = t.pendingProps, o = t.memoizedState, l = o.element, ws(e, t), ll(t, r, null, n);
          var i = t.memoizedState;
          if (r = i.element, o.isDehydrated) if (o = { element: r, isDehydrated: !1, cache: i.cache, pendingSuspenseBoundaries: i.pendingSuspenseBoundaries, transitions: i.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
            l = Ln(Error(u(423)), t), t = oa(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = Ln(Error(u(424)), t), t = oa(e, t, r, n, l);
            break e;
          } else for (nt = At(t.stateNode.containerInfo.firstChild), tt = t, ve = !0, dt = null, n = vs(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (Cn(), r === l) {
              t = Rt(e, t, n);
              break e;
            }
            He(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return _s(t), e === null && jo(t), r = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, i = l.children, Co(r, l) ? i = null : o !== null && Co(r, o) && (t.flags |= 32), na(e, t), He(e, t, i, n), t.child;
      case 6:
        return e === null && jo(t), null;
      case 13:
        return ia(e, t, n);
      case 4:
        return Wo(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = xn(t, null, r, n) : He(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pt(r, l), Zs(e, t, r, l, n);
      case 7:
        return He(e, t, t.pendingProps, n), t.child;
      case 8:
        return He(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return He(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, o = t.memoizedProps, i = l.value, de(tl, r._currentValue), r._currentValue = i, o !== null) if (ft(o.value, i)) {
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
                    c = Pt(-1, n & -n), c.tag = 2;
                    var y = o.updateQueue;
                    if (y !== null) {
                      y = y.shared;
                      var _ = y.pending;
                      _ === null ? c.next = c : (c.next = _.next, _.next = c), y.pending = c;
                    }
                  }
                  o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Fo(
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
              i.lanes |= n, s = i.alternate, s !== null && (s.lanes |= n), Fo(i, n, t), i = o.sibling;
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
        return l = t.type, r = t.pendingProps.children, Pn(t, n), l = it(l), r = r(l), t.flags |= 1, He(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = pt(r, t.pendingProps), l = pt(r.type, l), bs(e, t, r, l, n);
      case 15:
        return ea(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pt(r, l), pl(e, t), t.tag = 1, qe(r) ? (e = !0, Gr(t)) : e = !1, Pn(t, n), $s(t, r, l), ei(t, r, l, n), li(null, t, r, !0, e, n);
      case 19:
        return sa(e, t, n);
      case 22:
        return ta(e, t, n);
    }
    throw Error(u(156, t.tag));
  };
  function Oa(e, t) {
    return fu(e, t);
  }
  function ed(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function at(e, t, n, r) {
    return new ed(e, t, n, r);
  }
  function Ci(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function td(e) {
    if (typeof e == "function") return Ci(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === Se) return 11;
      if (e === Me) return 14;
    }
    return 2;
  }
  function qt(e, t) {
    var n = e.alternate;
    return n === null ? (n = at(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Cl(e, t, n, r, l, o) {
    var i = 2;
    if (r = e, typeof e == "function") Ci(e) && (i = 1);
    else if (typeof e == "string") i = 5;
    else e: switch (e) {
      case Ne:
        return sn(n.children, l, o, t);
      case ge:
        i = 8, l |= 8;
        break;
      case Qe:
        return e = at(12, n, t, l | 2), e.elementType = Qe, e.lanes = o, e;
      case Ae:
        return e = at(13, n, t, l), e.elementType = Ae, e.lanes = o, e;
      case Ze:
        return e = at(19, n, t, l), e.elementType = Ze, e.lanes = o, e;
      case he:
        return xl(n, l, o, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case we:
            i = 10;
            break e;
          case Q:
            i = 9;
            break e;
          case Se:
            i = 11;
            break e;
          case Me:
            i = 14;
            break e;
          case Fe:
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
  function xl(e, t, n, r) {
    return e = at(22, e, r, t), e.elementType = he, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function xi(e, t, n) {
    return e = at(6, e, null, t), e.lanes = n, e;
  }
  function Ni(e, t, n) {
    return t = at(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function nd(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Zl(0), this.expirationTimes = Zl(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Zl(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Pi(e, t, n, r, l, o, i, s, c) {
    return e = new nd(e, t, n, s, c), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = at(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Vo(o), e;
  }
  function rd(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: ue, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function ja(e) {
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
      if (qe(n)) return us(e, n, t);
    }
    return t;
  }
  function za(e, t, n, r, l, o, i, s, c) {
    return e = Pi(n, r, !0, e, l, o, i, s, c), e.context = ja(null), n = e.current, r = $e(), l = $t(n), o = Pt(r, l), o.callback = t ?? null, Wt(n, o, l), e.current.lanes = l, Bn(e, l, r), Xe(e, r), e;
  }
  function Nl(e, t, n, r) {
    var l = t.current, o = $e(), i = $t(l);
    return n = ja(n), t.context === null ? t.context = n : t.pendingContext = n, t = Pt(o, i), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Wt(l, t, i), e !== null && (yt(e, l, i, o), rl(e, l, i)), i;
  }
  function Pl(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Da(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Ri(e, t) {
    Da(e, t), (e = e.alternate) && Da(e, t);
  }
  function ld() {
    return null;
  }
  var Aa = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Li(e) {
    this._internalRoot = e;
  }
  Rl.prototype.render = Li.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(u(409));
    Nl(e, t, null, null);
  }, Rl.prototype.unmount = Li.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      ln(function() {
        Nl(null, e, null, null);
      }), t[_t] = null;
    }
  };
  function Rl(e) {
    this._internalRoot = e;
  }
  Rl.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = wu();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < jt.length && t !== 0 && t < jt[n].priority; n++) ;
      jt.splice(n, 0, e), n === 0 && _u(e);
    }
  };
  function Ti(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Ll(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function Ma() {
  }
  function od(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var o = r;
        r = function() {
          var y = Pl(i);
          o.call(y);
        };
      }
      var i = za(t, r, e, 0, null, !1, !1, "", Ma);
      return e._reactRootContainer = i, e[_t] = i.current, nr(e.nodeType === 8 ? e.parentNode : e), ln(), i;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var s = r;
      r = function() {
        var y = Pl(c);
        s.call(y);
      };
    }
    var c = Pi(e, 0, !1, null, null, !1, !1, "", Ma);
    return e._reactRootContainer = c, e[_t] = c.current, nr(e.nodeType === 8 ? e.parentNode : e), ln(function() {
      Nl(t, c, n, r);
    }), c;
  }
  function Tl(e, t, n, r, l) {
    var o = n._reactRootContainer;
    if (o) {
      var i = o;
      if (typeof l == "function") {
        var s = l;
        l = function() {
          var c = Pl(i);
          s.call(c);
        };
      }
      Nl(t, i, e, l);
    } else i = od(n, t, e, l, r);
    return Pl(i);
  }
  vu = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Wn(t.pendingLanes);
          n !== 0 && (bl(t, n | 1), Xe(t, Ce()), (le & 6) === 0 && (On = Ce() + 500, Ut()));
        }
        break;
      case 13:
        ln(function() {
          var r = Nt(e, 1);
          if (r !== null) {
            var l = $e();
            yt(r, e, 1, l);
          }
        }), Ri(e, 1);
    }
  }, eo = function(e) {
    if (e.tag === 13) {
      var t = Nt(e, 134217728);
      if (t !== null) {
        var n = $e();
        yt(t, e, 134217728, n);
      }
      Ri(e, 134217728);
    }
  }, gu = function(e) {
    if (e.tag === 13) {
      var t = $t(e), n = Nt(e, t);
      if (n !== null) {
        var r = $e();
        yt(n, e, t, r);
      }
      Ri(e, t);
    }
  }, wu = function() {
    return ae;
  }, Su = function(e, t) {
    var n = ae;
    try {
      return ae = e, t();
    } finally {
      ae = n;
    }
  }, Kl = function(e, t, n) {
    switch (t) {
      case "input":
        if (Fl(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = qr(r);
              if (!l) throw Error(u(90));
              Hi(r), Fl(r, l);
            }
          }
        }
        break;
      case "textarea":
        Gi(e, n);
        break;
      case "select":
        t = n.value, t != null && an(e, !!n.multiple, t, !1);
    }
  }, lu = ki, ou = ln;
  var id = { usingClientEntryPoint: !1, Events: [or, wn, qr, nu, ru, ki] }, wr = { findFiberByHostInstance: Xt, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, ud = { bundleType: wr.bundleType, version: wr.version, rendererPackageName: wr.rendererPackageName, rendererConfig: wr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ce.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = au(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: wr.findFiberByHostInstance || ld, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Il = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Il.isDisabled && Il.supportsFiber) try {
      Rr = Il.inject(ud), vt = Il;
    } catch {
    }
  }
  return Je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = id, Je.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Ti(t)) throw Error(u(200));
    return rd(e, t, null, n);
  }, Je.createRoot = function(e, t) {
    if (!Ti(e)) throw Error(u(299));
    var n = !1, r = "", l = Aa;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Pi(e, 1, !1, null, null, n, !1, r, l), e[_t] = t.current, nr(e.nodeType === 8 ? e.parentNode : e), new Li(t);
  }, Je.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(u(188)) : (e = Object.keys(e).join(","), Error(u(268, e)));
    return e = au(t), e = e === null ? null : e.stateNode, e;
  }, Je.flushSync = function(e) {
    return ln(e);
  }, Je.hydrate = function(e, t, n) {
    if (!Ll(t)) throw Error(u(200));
    return Tl(null, e, t, !0, n);
  }, Je.hydrateRoot = function(e, t, n) {
    if (!Ti(e)) throw Error(u(405));
    var r = n != null && n.hydratedSources || null, l = !1, o = "", i = Aa;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onRecoverableError !== void 0 && (i = n.onRecoverableError)), t = za(t, null, e, 1, n ?? null, l, !1, o, i), e[_t] = t.current, nr(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new Rl(t);
  }, Je.render = function(e, t, n) {
    if (!Ll(t)) throw Error(u(200));
    return Tl(null, e, t, !1, n);
  }, Je.unmountComponentAtNode = function(e) {
    if (!Ll(e)) throw Error(u(40));
    return e._reactRootContainer ? (ln(function() {
      Tl(null, null, e, !1, function() {
        e._reactRootContainer = null, e[_t] = null;
      });
    }), !0) : !1;
  }, Je.unstable_batchedUpdates = ki, Je.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Ll(n)) throw Error(u(200));
    if (e == null || e._reactInternals === void 0) throw Error(u(38));
    return Tl(e, t, n, !1, r);
  }, Je.version = "18.3.1-next-f1338f8080-20240426", Je;
}
var $a;
function hd() {
  if ($a) return ji.exports;
  $a = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (p) {
        console.error(p);
      }
  }
  return a(), ji.exports = /* @__PURE__ */ md(), ji.exports;
}
var Ka;
function yd() {
  if (Ka) return Ol;
  Ka = 1;
  var a = /* @__PURE__ */ hd();
  return Ol.createRoot = a.createRoot, Ol.hydrateRoot = a.hydrateRoot, Ol;
}
var vd = /* @__PURE__ */ yd(), je = /* @__PURE__ */ Qi();
const jl = /* @__PURE__ */ uc(je), qa = (a) => {
  let p;
  const u = /* @__PURE__ */ new Set(), v = (T, z) => {
    const S = typeof T == "function" ? T(p) : T;
    if (!Object.is(S, p)) {
      const V = p;
      p = z ?? (typeof S != "object" || S === null) ? S : Object.assign({}, p, S), u.forEach((X) => X(p, V));
    }
  }, E = () => p, O = { setState: v, getState: E, getInitialState: () => x, subscribe: (T) => (u.add(T), () => u.delete(T)) }, x = p = a(v, E, O);
  return O;
}, gd = ((a) => a ? qa(a) : qa), wd = (a) => a;
function Sd(a, p = wd) {
  const u = jl.useSyncExternalStore(
    a.subscribe,
    jl.useCallback(() => p(a.getState()), [a, p]),
    jl.useCallback(() => p(a.getInitialState()), [a, p])
  );
  return jl.useDebugValue(u), u;
}
const Ya = (a) => {
  const p = gd(a), u = (v) => Sd(p, v);
  return Object.assign(u, p), u;
}, kd = ((a) => a ? Ya(a) : Ya);
function _d() {
  const a = new URLSearchParams(window.location.search), p = {};
  for (const [u, v] of a)
    u.includes(".") && (p[u] = v);
  return p;
}
function Ed(a) {
  const p = new URL(window.location.href);
  for (const u of [...p.searchParams.keys()])
    u.includes(".") && p.searchParams.delete(u);
  for (const [u, v] of Object.entries(a))
    v && p.searchParams.set(u, v);
  window.history.replaceState(null, "", p.toString());
}
function Cd(a) {
  let p = typeof window < "u" && window.Shopify?.routes?.root || a || "/";
  return p.endsWith("/") || (p += "/"), p + "cart/add.js";
}
async function xd(a, p) {
  const u = Cd(a), v = await fetch(u, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ items: p })
  });
  let E = null;
  try {
    E = await v.json();
  } catch {
  }
  if (!v.ok) {
    const P = E?.description || E?.message || `Add to cart failed (HTTP ${v.status})`, k = new Error(P);
    throw k.status = v.status, k.payload = E, k;
  }
  return E;
}
function Nd(a) {
  if (typeof document > "u") return;
  const p = a || null;
  document.dispatchEvent(
    new CustomEvent("cart:refresh", { bubbles: !0, detail: p })
  ), document.dispatchEvent(
    new CustomEvent("cart:added", { bubbles: !0, detail: p })
  ), document.dispatchEvent(
    new CustomEvent("cart:open", { bubbles: !0, detail: p })
  ), typeof window < "u" && typeof window.dispatchEvent == "function" && window.dispatchEvent(new CustomEvent("cart:updated", { detail: p }));
}
const Bi = "calma_preorder_intent";
function Pd() {
  if (typeof window > "u") return null;
  if (window.CalmaPreorderIntent && typeof window.CalmaPreorderIntent.get == "function")
    try {
      return window.CalmaPreorderIntent.get();
    } catch {
    }
  try {
    const a = window.localStorage?.getItem(Bi);
    if (!a) return null;
    const p = JSON.parse(a);
    return !p || typeof p.expiresAt != "number" || Date.now() > p.expiresAt ? (window.localStorage.removeItem(Bi), null) : p;
  } catch {
    return null;
  }
}
function Rd() {
  if (!(typeof window > "u")) {
    if (window.CalmaPreorderIntent && typeof window.CalmaPreorderIntent.clear == "function")
      try {
        window.CalmaPreorderIntent.clear();
        return;
      } catch {
      }
    try {
      window.localStorage?.removeItem(Bi);
    } catch {
    }
  }
}
function Ld() {
  if (typeof window > "u") return null;
  if (window.SHOPIFY_CUSTOMER_ID) return String(window.SHOPIFY_CUSTOMER_ID);
  const a = window.ShopifyAnalytics?.meta?.page?.customerId;
  return a != null ? String(a) : null;
}
const Td = "/apps/b2b-portal/preorder/add-line";
async function Id(a) {
  const p = await fetch(Td, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(a)
  });
  let u = null;
  try {
    u = await p.json();
  } catch {
  }
  return u || {
    error: `Preorder add-line failed (HTTP ${p.status})`
  };
}
let zn = null, Ai = null, Mi = /* @__PURE__ */ new Map();
function Dl(a) {
  const p = (a || "").toUpperCase();
  return p.includes("DUVAR") ? "WALL" : p.includes("MASA") ? "TABLE" : p.includes("HALI") ? "FLOOR" : p.includes("TAVAN") || p.includes("SPRINKLER") ? "CEILING" : p.includes("MONITOR") || p.includes("EKRAN") || p.includes("SCREEN") ? "SCREEN MOUNT" : "GENERAL";
}
const Al = [
  "GENERAL",
  "WALL",
  "TABLE",
  "SCREEN MOUNT",
  "CEILING",
  "FLOOR"
], Od = [
  "[Character]NRUS_DOSEME_SERI_DUVAR",
  "[Character]NRUS_DOSEME_RENK_DUVAR",
  "[Character]NRUS_YUZEY_RENK_DUVAR",
  "[Character]NRUS_KECE_RENK_DUVAR",
  "[Character]NRUS_YUZEY_RENK_MASA",
  "[Character]NRUS_HALI_RENK",
  "[Character]NRUS_KOLTUK",
  "[Character]NRUS_PRIZ_TIPI",
  "[Character]NRUS_MEDIAWALL"
], jd = /* @__PURE__ */ new Set([
  "[Character]NRUS_Meta_Dimension",
  "[Character]NRUS_GGRACHAIR"
]), sc = [
  {
    id: "[Character]NRUS_GGRACHAIR",
    propLabel: "STOOL OPTION",
    value: "chair_no",
    displayLabel: "NO"
  }
];
async function Ga(a) {
  if (!Array.isArray(a)) return [];
  const p = a.filter(
    (P) => P.visible !== !1 && P.editable !== !1 && P.choiceList && !jd.has(P.key)
  ), u = await Promise.all(
    p.map(
      (P) => typeof P.getChoices == "function" ? P.getChoices().catch(() => []) : Promise.resolve([])
    )
  ), v = p.map((P, k) => {
    const O = u[k] || [], x = typeof P.getValue == "function" ? P.getValue() : null;
    return {
      id: P.key,
      label: P.name,
      type: O.some((T) => T.largeIcon || T.smallIcon) ? "color" : "text",
      editable: !0,
      currentValue: x?.value ?? null,
      options: O.map((T) => ({
        value: T.value,
        label: T.text,
        // Swatch UI'da ~40–96px gösterildiği için önce küçük ikonu tercih
        // ediyoruz; largeIcon (bazen ~1MB) yalnızca smallIcon yoksa fallback.
        // İkonlar WCF choiceList'inden her oturumda taze geldiği için pCon
        // tarafındaki değişiklikler kullanıcıya anında yansımaya devam eder.
        icon: T.smallIcon || T.largeIcon || null,
        available: T.selectable !== !1
      }))
    };
  }), E = new Map(Od.map((P, k) => [P, k]));
  return v.sort((P, k) => {
    const O = E.has(P.id) ? E.get(P.id) : 1 / 0, x = E.has(k.id) ? E.get(k.id) : 1 / 0;
    return O !== x ? O - x : 0;
  });
}
async function Fi(a) {
  if (!a) return { price: null, currency: "EUR" };
  const p = typeof a.getMainArticle == "function" ? a.getMainArticle() ?? a : a;
  try {
    if (typeof p.getCompositeCalculation == "function") {
      const u = await p.getCompositeCalculation(), v = u?.grossPrice ?? u?.netPrice ?? u?.salesPrice;
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
    if (typeof p.getItemProperties == "function") {
      const v = (await p.getItemProperties?.())?.article;
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
async function zd(a) {
  if (!Array.isArray(a)) return [];
  const p = await Promise.all(
    a.map(
      (u) => u.choiceList && typeof u.getChoices == "function" ? u.getChoices().catch(() => []) : Promise.resolve([])
    )
  );
  return a.map((u, v) => {
    const E = p[v] || [], P = typeof u.getValue == "function" ? u.getValue() : null;
    return {
      id: u.key,
      label: u.name,
      type: E.some((k) => k.largeIcon || k.smallIcon) ? "color" : "text",
      editable: !!u.editable,
      currentValue: P?.value ?? null,
      options: E.map((k) => ({
        value: k.value,
        label: k.text,
        icon: k.smallIcon || k.largeIcon || null,
        available: k.selectable !== !1
      }))
    };
  });
}
function Xa(a) {
  return Array.isArray(a) ? a.map((p) => ({
    key: p.key,
    name: p.name,
    visible: !!p.visible,
    editable: !!p.editable,
    hasChoiceList: !!p.choiceList,
    value: typeof p.getValue == "function" ? p.getValue()?.value ?? null : null
  })) : [];
}
function Ja(a) {
  return a.map((p) => ({
    ...p,
    options: p.options?.map((u) => ({
      ...u,
      icon: typeof u.icon == "string" && u.icon.length > 100 ? `[icon omitted, ${u.icon.length} chars]` : u.icon
    }))
  }));
}
function Za({
  properties: a,
  price: p,
  currency: u,
  articleNumber: v,
  manufacturerId: E,
  safeQuantity: P,
  rawSnapshot: k = [],
  variantId: O = null
}) {
  const x = /* @__PURE__ */ new Map(), T = [];
  for (const R of a) {
    if (R.currentValue == null || R.currentValue === "") continue;
    const A = Dl(R.id);
    x.has(A) || x.set(A, []);
    const Z = (R.options || []).find(
      (j) => j.value === R.currentValue
    )?.label || String(R.currentValue);
    x.get(A).push({ label: R.label, selectedLabel: Z }), T.push(Z);
  }
  const z = /* @__PURE__ */ new Set();
  for (const R of x.values())
    for (const A of R) z.add(A.label);
  for (const R of sc) {
    if (z.has(R.propLabel)) continue;
    const A = Dl(R.id);
    x.has(A) || x.set(A, []), x.get(A).push({
      label: R.propLabel,
      selectedLabel: R.displayLabel
    }), T.push(R.displayLabel);
  }
  const S = [
    ...Al.filter((R) => x.has(R)),
    ...[...x.keys()].filter((R) => !Al.includes(R))
  ], V = {};
  let X = 1;
  for (const R of S) {
    const A = x.get(R);
    if (!(!A || A.length === 0)) {
      V[`divider ${X}`] = R, X++;
      for (const { label: re, selectedLabel: Z } of A)
        V[re] = Z;
    }
  }
  const J = [
    v,
    E || null,
    ...T.slice(0, 2)
  ].filter(Boolean).join(" / ");
  return {
    _description: J,
    /*  _quantity: String(safeQuantity), */
    /* _unit: "ST", */
    _Configuration_Price: p != null ? String(p) : "",
    _currency: u || "EUR",
    _vendormat: v || "",
    _Configuration: J,
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
      manufacturerId: E || "",
      price: p ?? null,
      currency: u || "EUR",
      quantity: P,
      variantId: O != null ? String(O) : "",
      properties: Array.isArray(k) ? k : []
    }),
    // WCF konfigürasyon property'leri — "divider N" + "Label: değer" çiftleri
    ...V
  };
}
function ba(a) {
  if (a == null) return "";
  const u = String(a).match(/(\d+)\s*$/);
  return u ? u[1] : "";
}
function zl(a) {
  const p = {};
  for (const u of a)
    u.currentValue && (p[u.id] = u.currentValue);
  Ed(p);
}
const ne = kd((a, p) => ({
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
    if (zn)
      try {
        const u = await Fi(zn);
        u?.price != null && a({
          price: u.price,
          currency: u.currency || p().currency
        });
      } catch (u) {
        console.warn("[store] refreshWcfPrice failed:", u?.message || u);
      }
  },
  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: setWcfReady — ConfiguratorScene WCF yüklemeyi tamamladığında
  // çağırır; article ve propMap module-level değişkenlere yazılmış olmalı.
  // ────────────────────────────────────────────────────────────────────────
  async setWcfReady(u, v, E) {
    zn = u, Ai = v, Mi = new Map(E.map((S) => [S.key, S]));
    const P = await Fi(u).catch(() => ({
      price: null,
      currency: "EUR"
    })), k = await Ga(E).catch(() => []), O = p().customIcons, x = ec(k, O);
    console.group("[pCon] Properties — raw (WCF)"), console.log("rawProps count:", E.length), console.table(
      E.map((S) => ({
        key: S.key,
        name: S.name,
        visible: S.visible,
        editable: S.editable,
        hasChoiceList: !!S.choiceList,
        value: typeof S.getValue == "function" ? S.getValue()?.value : "(n/a)"
      }))
    );
    const T = await zd(E).catch(() => []);
    console.log(
      "[pCon] Full raw properties (JSON):",
      JSON.stringify(Ja(T), null, 2)
    ), console.groupEnd(), console.group("[pCon] Properties — mapped (store)"), console.log("mapped count:", x.length), console.table(
      x.map((S) => ({
        id: S.id,
        label: S.label,
        type: S.type,
        currentValue: S.currentValue,
        optionCount: S.options?.length ?? 0
      }))
    ), console.log(
      "[pCon] Full mapped properties (JSON):",
      JSON.stringify(Ja(x), null, 2)
    ), console.groupEnd(), a({
      properties: x,
      rawSnapshot: Xa(E),
      price: P.price,
      currency: P.currency || p().currency,
      cartProperties: {},
      // signal: WCF article hazır → cart butonu açılır
      loading: !1
    });
    const z = _d();
    if (Object.keys(z).length > 0)
      for (const [S, V] of Object.entries(z)) {
        const X = x.find((J) => J.id === S);
        X && X.currentValue !== V && p().updateProperty(S, V).catch((J) => console.warn("[store] URL prop apply failed:", J.message));
      }
    else
      zl(x);
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
    const E = Mi.get(u);
    if (!E || typeof E.setValue != "function") {
      console.warn("[store] updateProperty: prop not found in propMap:", u);
      return;
    }
    const { properties: P, customIcons: k } = p(), O = P.map(
      (x) => x.id === u ? { ...x, currentValue: v } : x
    );
    a({ properties: O, updating: !0, error: null }), zl(O);
    try {
      const x = Ai?.eventArticleChanged, T = x && typeof x.addListener == "function";
      if (await new Promise((J, R) => {
        let A = !1, re = !T, Z = !1;
        const j = setTimeout(() => {
          Z || (Z = !0, T && x.removeListener(oe), console.warn("[store] updateProperty: eventArticleChanged timeout, proceeding"), J());
        }, 1e4);
        function ce() {
          Z || !A || !re || (Z = !0, clearTimeout(j), J());
        }
        function oe() {
          x.removeListener(oe), re = !0, ce();
        }
        T && x.addListener(oe), E.setValue(v).then(() => {
          A = !0, ce();
        }).catch((ue) => {
          Z || (Z = !0, clearTimeout(j), T && x.removeListener(oe), R(ue));
        });
      }), !zn) throw new Error("WCF article ref lost");
      const [z, S] = await Promise.all([
        zn.getProperties(),
        Fi(zn)
      ]);
      Mi = new Map(z.map((J) => [J.key, J]));
      const V = await Ga(z), X = ec(V, k);
      a({
        properties: X,
        rawSnapshot: Xa(z),
        price: S.price,
        currency: S.currency || p().currency,
        updating: !1
      }), zl(X);
      try {
        Ai?.app?.viewer?.requestRenderFrame?.();
      } catch {
      }
    } catch (x) {
      console.warn("[store] updateProperty revert:", x?.message || x), zl(P), a({ properties: P, updating: !1, error: x?.message || String(x) });
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
    const v = p().variantId;
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
      price: E,
      currency: P,
      articleNumber: k,
      manufacturerId: O,
      quantity: x,
      variantId: T,
      productTitle: z,
      productImageUrl: S,
      productSku: V,
      loading: X,
      updating: J,
      cartProperties: R,
      quoteLoading: A
    } = p();
    if (A) return !1;
    if (X || J)
      return a({ quoteError: "Configuration is still loading. Please wait." }), !1;
    if (!R)
      return a({ quoteError: "Configuration not ready. Please wait." }), !1;
    const re = typeof window < "u" ? window.CalmaQuoteList : null;
    if (!re || typeof re.addItem != "function")
      return a({
        quoteError: "Quote list is not available. Please make sure you are signed in as a dealer."
      }), !1;
    const Z = ba(T);
    if (!Z)
      return a({
        quoteError: "Could not detect a product variant on this page. Please reload and try again."
      }), !1;
    a({ quoteLoading: !0, quoteError: null, quoteSuccess: !1 });
    const j = Math.max(1, parseInt(x, 10) || 1), ce = Za({
      properties: u,
      price: E,
      currency: P,
      articleNumber: k,
      manufacturerId: O,
      safeQuantity: j,
      rawSnapshot: v,
      variantId: Z
    });
    try {
      return re.addItem({
        variant_id: Z,
        quantity: j,
        properties: ce,
        name: z || k || null,
        image: S || null,
        sku: V || k || null
      }), a({ quoteLoading: !1, quoteSuccess: !0 }), !0;
    } catch (oe) {
      return console.error("[Configurator] addToQuoteList error:", oe), a({
        quoteLoading: !1,
        quoteError: oe?.message || "Failed to add to quote list."
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
      rawSnapshot: E,
      price: P,
      currency: k,
      articleNumber: O,
      manufacturerId: x,
      quantity: T,
      variantId: z,
      routesRoot: S,
      successAction: V,
      cartLoading: X,
      updating: J,
      loading: R,
      cartProperties: A
    } = p();
    if (X) return !1;
    if (R || J)
      return a({ cartError: "Configuration is still loading. Please wait." }), !1;
    if (!A)
      return a({ cartError: "Configuration not ready. Please wait." }), !1;
    if (!z)
      return a({
        cartError: "Could not detect a product variant on this page. Please reload and try again."
      }), !1;
    a({ cartLoading: !0, cartError: null, cartSuccess: !1 });
    const re = Math.max(1, parseInt(T, 10) || 1), Z = Za({
      properties: v,
      price: P,
      currency: k,
      articleNumber: O,
      manufacturerId: x,
      safeQuantity: re,
      rawSnapshot: E,
      variantId: ba(z)
    });
    console.log(
      "[cart] Shopify cart/add.js payload:",
      JSON.stringify({ items: [{ id: z, quantity: re, properties: Z }] }, null, 2)
    );
    try {
      const j = Pd();
      if (j) {
        const Ne = Ld();
        let ge;
        try {
          ge = await Id({
            logged_in_customer_id: Ne,
            draftOrderId: j.draftOrderId,
            variantId: z,
            quantity: re,
            properties: Z
          });
        } catch (we) {
          return console.error("[Configurator] Preorder add-line error:", we), window.alert("❌ Could not add to preorder. Please try again."), a({ cartLoading: !1 }), !1;
        }
        if (!ge || ge.error) {
          const we = ge?.error || "Unknown error";
          return window.alert("❌ Could not add to preorder: " + we), a({ cartLoading: !1 }), !1;
        }
        const Qe = ge.draftOrder?.name || j.draftOrderName || "preorder";
        return window.alert("✅ Product added to Preorder " + Qe), Rd(), a({ cartLoading: !1, cartSuccess: !0 }), window.location.href = "/pages/b2b-account#preorder-" + j.draftOrderId, !0;
      }
      const oe = await xd(S, [
        {
          id: z,
          quantity: re,
          properties: Z
        }
      ]);
      a({ cartLoading: !1, cartSuccess: !0 });
      const ue = u ?? V;
      return ue === "redirect" ? window.setTimeout(() => {
        window.location.href = (window.Shopify?.routes?.root || "/").replace(/\/$/, "") + "/cart";
      }, 0) : ue === "reload" ? window.setTimeout(() => window.location.reload(), 0) : ue !== "none" && Nd(oe), !0;
    } catch (j) {
      return a({
        cartLoading: !1,
        cartError: j?.message || "Failed to add to cart"
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
      manufacturerId: E,
      quantity: P,
      productTitle: k,
      productImageUrl: O,
      customerName: x
    } = p(), T = Math.max(1, parseInt(P, 10) || 1), z = /* @__PURE__ */ new Map();
    for (const R of u) {
      if (R.currentValue == null || R.currentValue === "") continue;
      const A = Dl(R.id);
      z.has(A) || z.set(A, []);
      const Z = (R.options || []).find(
        (j) => j.value === R.currentValue
      )?.label || String(R.currentValue);
      z.get(A).push({ label: R.label, selectedLabel: Z });
    }
    const S = /* @__PURE__ */ new Set();
    for (const R of z.values())
      for (const A of R) S.add(A.label);
    for (const R of sc) {
      if (S.has(R.propLabel)) continue;
      const A = Dl(R.id);
      z.has(A) || z.set(A, []), z.get(A).push({
        label: R.propLabel,
        selectedLabel: R.displayLabel
      });
    }
    const V = [
      ...Al.filter((R) => z.has(R)),
      ...[...z.keys()].filter((R) => !Al.includes(R))
    ], X = {};
    let J = 1;
    for (const R of V) {
      const A = z.get(R);
      if (!(!A || A.length === 0)) {
        X[`divider ${J}`] = R, J++;
        for (const { label: re, selectedLabel: Z } of A)
          X[re] = Z;
      }
    }
    try {
      const { exportToExcel: R } = await import("./pcon-chunk-excel-export-ClkFUrGS.js");
      await R({
        articleNumber: v,
        manufacturerId: E,
        productTitle: k,
        productImageUrl: O,
        quantity: T,
        customerName: x,
        configDividers: X
      });
    } catch (R) {
      console.error("[exportRequest] Excel export failed:", R), window.alert("Excel export failed: " + (R?.message || String(R)));
    }
  }
})), Dd = /* @__PURE__ */ new Set(["OI_NONE_PROPCLASS.PRIZ_TIPI"]), Ad = [
  { keys: ["german", "deutsch", "alman"], iconKey: "german" },
  { keys: ["multi", "universal", "coklu", "çoklu"], iconKey: "multi" },
  { keys: ["swiss", "schweiz", "isvicre", "isviçre"], iconKey: "swiss" },
  { keys: ["uk", "british", "britisch", "ingiliz"], iconKey: "uk" },
  { keys: ["us", "american", "amerikan", "amerika"], iconKey: "american" }
], Md = "MT_TEXT.Meta_Dimension", Fd = {
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
function ec(a, p) {
  if (!p || typeof p != "object") return a;
  let u = Vd(a, p.variantPicker);
  return u = Wd(u, p.socket), u = Bd(u, p.contextual), u;
}
let kr = null, tc = null;
function Ud(a) {
  if (tc === a && kr)
    return kr;
  if (tc = a, kr = /* @__PURE__ */ new Map(), a && typeof a == "object")
    for (const [p, u] of Object.entries(a))
      !p || !u || kr.set(ac(p), u);
  return kr;
}
function ac(a) {
  return String(a || "").toLowerCase().replace(/[\s_-]+/g, "");
}
function Vd(a, p) {
  const u = Ud(p);
  return u.size === 0 ? a : a.map((v) => {
    let E = !1;
    const P = v.options.map((k) => {
      if (k.icon) return k;
      const O = u.get(ac(k.value));
      return O ? (E = !0, { ...k, icon: O }) : k;
    });
    return E ? { ...v, type: "color", options: P } : v;
  });
}
function Wd(a, p) {
  return p ? a.map((u) => {
    if (!Qd(u)) return u;
    const v = Hd(u.options, p), E = v.some((P) => P.icon);
    return { ...u, type: E ? "color" : u.type, options: v };
  }) : a;
}
function Bd(a, p) {
  if (!p) return a;
  const v = a.find((P) => P.id === Md)?.currentValue;
  if (!v) return a;
  const E = Fd[v];
  return E ? a.map((P) => {
    const k = E[P.id];
    if (!k) return P;
    const O = P.options.map((T) => {
      const z = k[T.value], S = z ? p[z] : null;
      return S ? { ...T, icon: S } : T;
    }), x = O.some((T) => T.icon);
    return { ...P, type: x ? "color" : P.type, options: O };
  }) : a;
}
function Qd(a) {
  return a ? Dd.has(a.id) ? !0 : /steckdose|socket|priz/i.test(a.label || "") : !1;
}
function Hd(a, p) {
  return !p || !Array.isArray(a) ? a : a.map((u) => {
    const v = $d(u, p);
    return v ? { ...u, icon: v } : u;
  });
}
function $d(a, p) {
  const u = `${a.value || ""} ${a.label || ""}`.toLowerCase();
  for (const { keys: v, iconKey: E } of Ad)
    if (v.some((P) => u.includes(P)))
      return p[E] || null;
  return null;
}
function Kd(a, p, u = !1) {
  const v = u ? 0 : 2;
  try {
    return new Intl.NumberFormat(void 0, {
      style: "currency",
      currency: p || "EUR",
      minimumFractionDigits: v,
      maximumFractionDigits: v
    }).format(a);
  } catch {
    return u ? `${Math.ceil(Number(a))} ${p || "EUR"}` : `${Number(a).toFixed(2)} ${p || "EUR"}`;
  }
}
function qd() {
  const a = ne((v) => v.price), p = ne((v) => v.currency);
  if (ne((v) => v.discountPercentage), a == null)
    return /* @__PURE__ */ N.jsxs("div", { className: "pcon-price pcon-price--pending", children: [
      /* @__PURE__ */ N.jsx("span", { className: "pcon-price__label", children: "List Price" }),
      /* @__PURE__ */ N.jsx("span", { className: "pcon-price__value pcon-price__value--pending", "aria-busy": "true", children: /* @__PURE__ */ N.jsx("span", { className: "pcon-price__skeleton" }) })
    ] });
  const u = Kd(a, p);
  return /* @__PURE__ */ N.jsx("div", { className: "pcon-price-block", children: /* @__PURE__ */ N.jsxs("div", { className: "pcon-price", children: [
    /* @__PURE__ */ N.jsx("span", { className: "pcon-price__label", children: "List Price" }),
    /* @__PURE__ */ N.jsx("span", { className: "pcon-price__value", children: u })
  ] }) });
}
const nc = {
  "[Character]NRUS_DOSEME_RENK_DUVAR": "[Character]NRUS_DOSEME_SERI_DUVAR"
};
function Yd() {
  const a = ne((T) => T.properties), p = ne((T) => T.updateProperty), [u, v] = je.useState(null), E = a.filter((T) => T.editable && T.options.length > 0);
  if (E.length === 0) return null;
  const P = new Set(Object.keys(nc)), k = E.filter((T) => !P.has(T.id)), O = {};
  for (const [T, z] of Object.entries(nc)) {
    const S = E.find((V) => V.id === T);
    S && (O[z] || (O[z] = []), O[z].push(S));
  }
  const x = (T) => {
    v((z) => z === T ? null : T);
  };
  return /* @__PURE__ */ N.jsx("div", { className: "pcon-properties", children: k.map((T) => /* @__PURE__ */ N.jsx(
    Gd,
    {
      prop: T,
      open: u === T.id,
      onToggle: () => x(T.id),
      onSelect: (z) => p(T.id, z),
      childProps: O[T.id] || [],
      updateProperty: p
    },
    T.id
  )) });
}
function Gd({
  prop: a,
  open: p,
  onToggle: u,
  onSelect: v,
  childProps: E = [],
  updateProperty: P
}) {
  const k = a.type === "color", O = a.options.find((S) => S.value === a.currentValue), x = (S) => {
    S.available && S.value !== a.currentValue && v(S.value);
  }, T = [
    "pcon-prop-group",
    p && "pcon-prop-group--open"
  ].filter(Boolean).join(" "), z = k ? "pcon-prop-group__body pcon-prop-group__body--colors" : "pcon-prop-group__body pcon-prop-group__body--chips";
  return /* @__PURE__ */ N.jsxs("div", { className: T, children: [
    /* @__PURE__ */ N.jsxs(
      "button",
      {
        type: "button",
        className: "pcon-prop-group__header",
        "aria-expanded": p,
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
          /* @__PURE__ */ N.jsx("span", { className: "pcon-prop-group__toggle", "aria-hidden": "true", children: p ? "−" : "+" })
        ]
      }
    ),
    p && /* @__PURE__ */ N.jsx("div", { className: z, children: a.options.map((S) => {
      const V = S.value === a.currentValue;
      if (k) {
        const J = [
          "pcon-option-swatch",
          V && "pcon-option-swatch--active",
          !S.available && "pcon-option-swatch--disabled"
        ].filter(Boolean).join(" ");
        return /* @__PURE__ */ N.jsxs(
          "button",
          {
            type: "button",
            className: J,
            disabled: !S.available,
            title: S.label,
            onClick: () => x(S),
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
      const X = [
        "pcon-option-chip",
        V && "pcon-option-chip--active",
        !S.available && "pcon-option-chip--disabled"
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ N.jsx(
        "button",
        {
          type: "button",
          className: X,
          disabled: !S.available,
          title: S.label,
          onClick: () => x(S),
          children: S.label
        },
        S.value
      );
    }) }),
    p && E.length > 0 && /* @__PURE__ */ N.jsx("div", { className: "pcon-prop-group__nested", children: E.map((S) => /* @__PURE__ */ N.jsx(
      Xd,
      {
        prop: S,
        onSelect: (V) => P(S.id, V)
      },
      S.id
    )) })
  ] });
}
function Xd({ prop: a, onSelect: p }) {
  const u = a.type === "color", v = a.options.find((k) => k.value === a.currentValue), E = (k) => {
    k.available && k.value !== a.currentValue && p(k.value);
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
        const T = [
          "pcon-option-swatch",
          O && "pcon-option-swatch--active",
          !k.available && "pcon-option-swatch--disabled"
        ].filter(Boolean).join(" ");
        return /* @__PURE__ */ N.jsxs(
          "button",
          {
            type: "button",
            className: T,
            disabled: !k.available,
            title: k.label,
            onClick: () => E(k),
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
      const x = [
        "pcon-option-chip",
        O && "pcon-option-chip--active",
        !k.available && "pcon-option-chip--disabled"
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ N.jsx(
        "button",
        {
          type: "button",
          className: x,
          disabled: !k.available,
          title: k.label,
          onClick: () => E(k),
          children: k.label
        },
        k.value
      );
    }) })
  ] });
}
var Ui = { exports: {} }, Vi, rc;
function Jd() {
  if (rc) return Vi;
  rc = 1;
  var a = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return Vi = a, Vi;
}
var Wi, lc;
function Zd() {
  if (lc) return Wi;
  lc = 1;
  var a = /* @__PURE__ */ Jd();
  function p() {
  }
  function u() {
  }
  return u.resetWarningCache = p, Wi = function() {
    function v(k, O, x, T, z, S) {
      if (S !== a) {
        var V = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw V.name = "Invariant Violation", V;
      }
    }
    v.isRequired = v;
    function E() {
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
      arrayOf: E,
      element: v,
      elementType: v,
      instanceOf: E,
      node: v,
      objectOf: E,
      oneOf: E,
      oneOfType: E,
      shape: E,
      exact: E,
      checkPropTypes: u,
      resetWarningCache: p
    };
    return P.PropTypes = P, P;
  }, Wi;
}
var oc;
function bd() {
  return oc || (oc = 1, Ui.exports = /* @__PURE__ */ Zd()()), Ui.exports;
}
var ep = /* @__PURE__ */ bd();
const tp = /* @__PURE__ */ uc(ep);
function ic() {
  return typeof window < "u" && window.CalmaQuoteList && typeof window.CalmaQuoteList.addItem == "function";
}
function cc({ isGuest: a = !1 }) {
  const p = ne((Q) => Q.quantity), u = ne((Q) => Q.setQuantity), v = ne((Q) => Q.addToCart), E = ne((Q) => Q.addToQuoteList);
  ne((Q) => Q.exportRequest);
  const P = ne((Q) => Q.resetCartFeedback), k = ne((Q) => Q.resetQuoteFeedback), O = ne((Q) => Q.cartLoading), x = ne((Q) => Q.cartError), T = ne((Q) => Q.cartSuccess), z = ne((Q) => Q.quoteLoading), S = ne((Q) => Q.quoteError), V = ne((Q) => Q.quoteSuccess), X = ne((Q) => Q.cartProperties), J = ne((Q) => Q.variantId), R = ne((Q) => Q.updating), A = ne((Q) => Q.loading), re = ne((Q) => Q.addToCartLabel), [Z, j] = je.useState(!1), [ce, oe] = je.useState(ic);
  je.useEffect(() => {
    if (ce) return;
    let Q = 0;
    const Se = setInterval(() => {
      Q += 1, ic() ? (oe(!0), clearInterval(Se)) : Q >= 20 && clearInterval(Se);
    }, 500);
    return () => clearInterval(Se);
  }, [ce]), je.useEffect(() => {
    if (!T) return;
    const Q = setTimeout(() => P(), 4e3);
    return () => clearTimeout(Q);
  }, [T, P]), je.useEffect(() => {
    if (!V) return;
    const Q = setTimeout(() => k(), 4e3);
    return () => clearTimeout(Q);
  }, [V, k]);
  const ue = O || R || A || !X || !J, Ne = (Q) => {
    u(Q.target.value);
  }, ge = (Q) => {
    u(Math.max(1, (parseInt(p, 10) || 1) + Q));
  }, Qe = async () => {
    if (ue) return;
    await v("none") && document.dispatchEvent(
      new CustomEvent("cart:refresh", { bubbles: !0, detail: { open: !0 } })
    );
  }, we = async () => {
    ue || z || await E();
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
            onClick: () => ge(-1),
            disabled: O || p <= 1,
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
            value: p,
            onChange: Ne,
            disabled: O,
            className: "pcon-cart__qty-input"
          }
        ),
        /* @__PURE__ */ N.jsx(
          "button",
          {
            type: "button",
            className: "pcon-cart__qty-step",
            onClick: () => ge(1),
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
          onClick: Qe,
          disabled: ue,
          "aria-busy": O,
          children: O ? /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
            /* @__PURE__ */ N.jsx("span", { className: "pcon-cart__btn-spinner", "aria-hidden": "true" }),
            /* @__PURE__ */ N.jsx("span", { children: "Adding..." })
          ] }) : "Request a Quote"
        }
      )
    ) : /* @__PURE__ */ N.jsxs("div", { className: "pcon-cart__btn-group", children: [
      ce ? /* @__PURE__ */ N.jsx(
        "button",
        {
          type: "button",
          className: "pcon-cart__btn pcon-cart__btn--secondary",
          onClick: we,
          disabled: ue || z,
          "aria-busy": z,
          children: z ? /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
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
          disabled: ue,
          "aria-busy": O,
          children: O ? /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
            /* @__PURE__ */ N.jsx("span", { className: "pcon-cart__btn-spinner", "aria-hidden": "true" }),
            /* @__PURE__ */ N.jsx("span", { children: "Adding..." })
          ] }) : re || "Add to Cart"
        }
      )
    ] }),
    x ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__error", role: "alert", children: x }) : null,
    T ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__success", role: "status", children: "Added to cart." }) : null,
    S ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__error", role: "alert", children: S }) : null,
    V ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__success", role: "status", children: "Teklif listesine eklendi." }) : null
  ] });
}
cc.propTypes = {
  isGuest: tp.bool
};
class np extends je.Component {
  constructor(p) {
    super(p), this.state = { hasError: !1, error: null };
  }
  static getDerivedStateFromError(p) {
    return { hasError: !0, error: p };
  }
  componentDidCatch(p) {
    console.error("[pcon] WCF render error:", p);
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
async function rp(a, p = "en_US", u = null, v = "") {
  if (u) {
    const P = await fetch(
      `https://gatekeeper.eaiws.pcon-solutions.com/v3/session/${u}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: p })
      }
    );
    if (!P.ok)
      throw new Error(`Gatekeeper direct call failed (HTTP ${P.status})`);
    return P.json();
  }
  const E = await fetch(`${a}/api/gatekeeper-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ locale: p, region: v || "" })
  });
  if (!E.ok) {
    const P = await E.json().catch(() => ({}));
    throw new Error(
      P.error || `Gatekeeper session failed (HTTP ${E.status})`
    );
  }
  return E.json();
}
function lp({ canvasHeight: a, customerLoggedIn: p }) {
  const u = ne((j) => j.loading), v = ne((j) => j.error), E = ne((j) => j.proxyBase), P = ne((j) => j.gatekeeperId), k = ne((j) => j.region), O = ne((j) => j.articleNumber), x = ne((j) => j.manufacturerId), T = ne((j) => j.setWcfReady), z = ne((j) => j.setWcfError), S = ne((j) => j.refreshWcfPrice), V = je.useRef(null), X = je.useRef(null), J = je.useRef(null), R = je.useRef(null), A = je.useRef(null), re = je.useRef(null), Z = je.useCallback(() => {
    try {
      re.current?.disconnect();
    } catch {
    }
    re.current = null;
    try {
      A.current && R.current && R.current.eventArticleChanged?.removeListener(
        A.current
      );
    } catch {
    }
    A.current = null, R.current = null;
    try {
      J.current?.close?.();
    } catch {
    }
    J.current = null;
    try {
      X.current?.dispose?.();
    } catch {
    }
    X.current = null;
  }, []);
  return je.useEffect(() => {
    if (!O || !E) return;
    let j = !1;
    async function ce() {
      if (!(!V.current && (await new Promise((oe) => setTimeout(oe, 50)), j || !V.current)))
        try {
          const oe = await rp(E, "en_US", P || null, k || "");
          if (j) return;
          const [ue, Ne] = await Promise.all([
            import("./pcon-chunk-engine-AgGdbLMj.js").then((f) => f.a),
            import("./pcon-chunk-engine-AgGdbLMj.js").then((f) => f.i)
          ]);
          if (j) return;
          const { Application: ge } = ue, { wcfConfig: Qe } = Ne;
          Qe.dataPath = `${E}/wcf/data/`;
          const we = new ge();
          if (we.initialize(V.current, {
            hardwareAntialiasing: !1,
            preserveDrawingBuffer: !0,
            autoResizeViewer: !0,
            adaptToDeviceRatio: !0,
            maximumDeviceRatio: 1.5,
            audioEngine: !1
          }), X.current = we, j) {
            try {
              we.dispose?.();
            } catch {
            }
            return;
          }
          if (await new Promise((f) => requestAnimationFrame(() => requestAnimationFrame(f))), j) return;
          try {
            we.viewer.resize(!0);
          } catch {
          }
          if (typeof ResizeObserver < "u" && V.current) {
            const f = new ResizeObserver(() => {
              if (!j)
                try {
                  X.current?.viewer?.resize(!0);
                } catch {
                }
            });
            f.observe(V.current), re.current = f;
          }
          const { EaiwsSession: Q } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((f) => f.c);
          if (j) return;
          const Se = new Q();
          Se.connect(
            oe.server,
            oe.sessionId,
            oe.keepAliveInterval
          ), J.current = Se;
          const Ae = "en";
          if (await Promise.all([
            Se.catalog.setLanguages([Ae]),
            Se.basket.setLanguages([Ae])
          ]), j) return;
          const { ArticleManager: Ze } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((f) => f.d);
          if (j) return;
          const Me = new Ze(we, Se);
          R.current = Me;
          const Fe = (async () => {
            try {
              const { PricingProcedureInfo: f } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((b) => b.b), g = await Se.basket.listPricingProcedures(!0);
              if (!g?.length || j) {
                console.warn("[wcf] no pricing procedures available");
                return;
              }
              const H = g[0].name;
              console.log("[wcf] setting pricing procedure:", H);
              const Y = await f.CreateInfo(
                Se,
                H,
                !0
              );
              !j && R.current && (R.current.setPricingProcedure(Y), console.log("[wcf] pricing procedure ready:", H));
            } catch (f) {
              console.warn("[wcf] pricing procedure failed:", f?.message);
            }
          })(), he = (async () => {
            try {
              const { SearchArticleParameterSet: f } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((b) => b.C), g = new f();
              g.baseArticleNumber = O, x && (g.manufacturerId = x);
              const Y = (await Se.catalog.searchArticle(g))?.scoredItems?.[0]?.item;
              if (Y) {
                const { InsertInfo: b } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((fe) => fe.b), te = new b();
                return te.baseArticleNumber = Y.baseArticleNumber || O, Y.manufacturerId && (te.manufacturerId = Y.manufacturerId), Y.seriesId && (te.seriesId = Y.seriesId), await Me.insertArticle(te);
              } else
                throw new Error(`Article not found in catalog: ${O}`);
            } catch (f) {
              console.warn(
                "[wcf] catalog search fell back to direct insert:",
                f?.message
              );
              const { InsertInfo: g } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((Y) => Y.b), H = new g();
              return H.baseArticleNumber = O, x && (H.manufacturerId = x), await Me.insertArticle(H);
            }
          })(), [, I] = await Promise.all([
            Fe,
            he
          ]);
          if (j || !I) return;
          we.model.addElement(I);
          try {
            if (await I.waitUntilGeometryUpdated?.(), j) return;
            const f = we.viewer?.view?.cameraControl;
            if (f) {
              const { Vector3: g } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((H) => H.m);
              if (j) return;
              try {
                f.setDirection(new g(0, 0, 1));
              } catch (H) {
                console.warn("[wcf] setDirection failed:", H?.message);
              }
              f.zoomToFitElements?.(
                [I],
                { margin: 0.15 }
              ), X.current?.viewer?.requestRenderFrame?.();
            }
          } catch (f) {
            console.warn("[wcf] initial camera setup failed:", f?.message);
          }
          const q = await I.getProperties();
          if (j) return;
          const M = (f) => {
            S(), (async () => {
              try {
                if (await (f?.article?.getMainArticle?.() ?? I)?.waitUntilGeometryUpdated?.(), j) return;
                X.current?.viewer?.requestRenderFrame?.();
              } catch {
              }
            })();
          };
          if (A.current = M, Me.eventArticleChanged?.addListener(M), await T(I, Me, q), j) return;
          S();
        } catch (oe) {
          j || (console.error("[wcf] init failed:", oe), z(oe));
        }
    }
    return ce(), () => {
      j = !0, Z();
    };
  }, [O, x, E, P, k, T, z, Z, S]), /* @__PURE__ */ N.jsx(np, { canvasHeight: a, children: /* @__PURE__ */ N.jsxs("div", { className: "pcon-configurator", children: [
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
          ref: V,
          style: {
            position: "absolute",
            inset: 0
          }
        }
      )
    ] }),
    /* @__PURE__ */ N.jsx("div", { className: "pcon-sidebar", children: !v && /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
      /* @__PURE__ */ N.jsx(Yd, {}),
      /* @__PURE__ */ N.jsxs("div", { className: "pcon-price-cart", children: [
        p && /* @__PURE__ */ N.jsx(qd, {}),
        /* @__PURE__ */ N.jsx(cc, { isGuest: !p })
      ] })
    ] }) })
  ] }) });
}
const op = [
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
function fc() {
  if (typeof document > "u") return null;
  for (const a of op) {
    const p = document.querySelectorAll(a);
    for (const u of p) {
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
function ip(a) {
  if (typeof document > "u") return () => {
  };
  let p = null;
  const u = () => {
    const k = fc();
    k && k !== p && (p = k, a(k));
  }, v = (k) => {
    const O = k.target;
    O && O.matches?.(
      'input[name="id"], select[name="id"]'
    ) && u();
  }, E = () => u(), P = () => u();
  return document.addEventListener("change", v, !0), document.addEventListener("variant:change", E), document.addEventListener("on:variant:change", E), window.addEventListener("popstate", P), () => {
    document.removeEventListener("change", v, !0), document.removeEventListener("variant:change", E), document.removeEventListener("on:variant:change", E), window.removeEventListener("popstate", P);
  };
}
function up({ config: a }) {
  const p = ne((v) => v.initialize), u = ne((v) => v.setVariantId);
  return je.useEffect(() => {
    p(a);
  }, [p, a]), je.useEffect(() => {
    const v = fc();
    return v && u(v), ip((P) => {
      u(P);
    });
  }, [u]), /* @__PURE__ */ N.jsx(
    lp,
    {
      canvasHeight: a.canvasHeight,
      environmentPreset: a.environmentPreset,
      customerLoggedIn: a.customerLoggedIn
    }
  );
}
window.__pconConfiguratorInit = function(a, p) {
  const u = {
    ...p,
    customIcons: window.__pconCustomIcons || {}
  };
  a.innerHTML = "", vd.createRoot(a).render(/* @__PURE__ */ N.jsx(up, { config: u }));
};
