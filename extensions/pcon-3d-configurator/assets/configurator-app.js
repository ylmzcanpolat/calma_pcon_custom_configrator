import { g as sc } from "./pcon-chunk-engine-AgGdbLMj.js";
var Oi = { exports: {} }, Sr = {}, ji = { exports: {} }, b = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ua;
function cd() {
  if (Ua) return b;
  Ua = 1;
  var a = Symbol.for("react.element"), p = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), v = Symbol.for("react.strict_mode"), C = Symbol.for("react.profiler"), R = Symbol.for("react.provider"), _ = Symbol.for("react.context"), O = Symbol.for("react.forward_ref"), P = Symbol.for("react.suspense"), T = Symbol.for("react.memo"), z = Symbol.for("react.lazy"), S = Symbol.iterator;
  function V(f) {
    return f === null || typeof f != "object" ? null : (f = S && f[S] || f["@@iterator"], typeof f == "function" ? f : null);
  }
  var X = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, J = Object.assign, w = {};
  function A(f, g, H) {
    this.props = f, this.context = g, this.refs = w, this.updater = H || X;
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
  function ne(f, g, H) {
    this.props = f, this.context = g, this.refs = w, this.updater = H || X;
  }
  var j = ne.prototype = new re();
  j.constructor = ne, J(j, A.prototype), j.isPureReactComponent = !0;
  var ce = Array.isArray, ue = Object.prototype.hasOwnProperty, oe = { current: null }, Ee = { key: !0, ref: !0, __self: !0, __source: !0 };
  function ge(f, g, H) {
    var Y, Z = {}, ee = null, fe = null;
    if (g != null) for (Y in g.ref !== void 0 && (fe = g.ref), g.key !== void 0 && (ee = "" + g.key), g) ue.call(g, Y) && !Ee.hasOwnProperty(Y) && (Z[Y] = g[Y]);
    var se = arguments.length - 2;
    if (se === 1) Z.children = H;
    else if (1 < se) {
      for (var ye = Array(se), be = 0; be < se; be++) ye[be] = arguments[be + 2];
      Z.children = ye;
    }
    if (f && f.defaultProps) for (Y in se = f.defaultProps, se) Z[Y] === void 0 && (Z[Y] = se[Y]);
    return { $$typeof: a, type: f, key: ee, ref: fe, props: Z, _owner: oe.current };
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
  function Ze(f, g, H, Y, Z) {
    var ee = typeof f;
    (ee === "undefined" || ee === "boolean") && (f = null);
    var fe = !1;
    if (f === null) fe = !0;
    else switch (ee) {
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
    if (fe) return fe = f, Z = Z(fe), f = Y === "" ? "." + Ae(fe, 0) : Y, ce(Z) ? (H = "", f != null && (H = f.replace(Se, "$&/") + "/"), Ze(Z, g, H, "", function(be) {
      return be;
    })) : Z != null && (we(Z) && (Z = Qe(Z, H + (!Z.key || fe && fe.key === Z.key ? "" : ("" + Z.key).replace(Se, "$&/") + "/") + f)), g.push(Z)), 1;
    if (fe = 0, Y = Y === "" ? "." : Y + ":", ce(f)) for (var se = 0; se < f.length; se++) {
      ee = f[se];
      var ye = Y + Ae(ee, se);
      fe += Ze(ee, g, H, ye, Z);
    }
    else if (ye = V(f), typeof ye == "function") for (f = ye.call(f), se = 0; !(ee = f.next()).done; ) ee = ee.value, ye = Y + Ae(ee, se++), fe += Ze(ee, g, H, ye, Z);
    else if (ee === "object") throw g = String(f), Error("Objects are not valid as a React child (found: " + (g === "[object Object]" ? "object with keys {" + Object.keys(f).join(", ") + "}" : g) + "). If you meant to render a collection of children, use an array instead.");
    return fe;
  }
  function Me(f, g, H) {
    if (f == null) return f;
    var Y = [], Z = 0;
    return Ze(f, Y, "", "", function(ee) {
      return g.call(H, ee, Z++);
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
  var he = { current: null }, I = { transition: null }, q = { ReactCurrentDispatcher: he, ReactCurrentBatchConfig: I, ReactCurrentOwner: oe };
  function M() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return b.Children = { map: Me, forEach: function(f, g, H) {
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
  } }, b.Component = A, b.Fragment = u, b.Profiler = C, b.PureComponent = ne, b.StrictMode = v, b.Suspense = P, b.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = q, b.act = M, b.cloneElement = function(f, g, H) {
    if (f == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + f + ".");
    var Y = J({}, f.props), Z = f.key, ee = f.ref, fe = f._owner;
    if (g != null) {
      if (g.ref !== void 0 && (ee = g.ref, fe = oe.current), g.key !== void 0 && (Z = "" + g.key), f.type && f.type.defaultProps) var se = f.type.defaultProps;
      for (ye in g) ue.call(g, ye) && !Ee.hasOwnProperty(ye) && (Y[ye] = g[ye] === void 0 && se !== void 0 ? se[ye] : g[ye]);
    }
    var ye = arguments.length - 2;
    if (ye === 1) Y.children = H;
    else if (1 < ye) {
      se = Array(ye);
      for (var be = 0; be < ye; be++) se[be] = arguments[be + 2];
      Y.children = se;
    }
    return { $$typeof: a, type: f.type, key: Z, ref: ee, props: Y, _owner: fe };
  }, b.createContext = function(f) {
    return f = { $$typeof: _, _currentValue: f, _currentValue2: f, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, f.Provider = { $$typeof: R, _context: f }, f.Consumer = f;
  }, b.createElement = ge, b.createFactory = function(f) {
    var g = ge.bind(null, f);
    return g.type = f, g;
  }, b.createRef = function() {
    return { current: null };
  }, b.forwardRef = function(f) {
    return { $$typeof: O, render: f };
  }, b.isValidElement = we, b.lazy = function(f) {
    return { $$typeof: z, _payload: { _status: -1, _result: f }, _init: Fe };
  }, b.memo = function(f, g) {
    return { $$typeof: T, type: f, compare: g === void 0 ? null : g };
  }, b.startTransition = function(f) {
    var g = I.transition;
    I.transition = {};
    try {
      f();
    } finally {
      I.transition = g;
    }
  }, b.unstable_act = M, b.useCallback = function(f, g) {
    return he.current.useCallback(f, g);
  }, b.useContext = function(f) {
    return he.current.useContext(f);
  }, b.useDebugValue = function() {
  }, b.useDeferredValue = function(f) {
    return he.current.useDeferredValue(f);
  }, b.useEffect = function(f, g) {
    return he.current.useEffect(f, g);
  }, b.useId = function() {
    return he.current.useId();
  }, b.useImperativeHandle = function(f, g, H) {
    return he.current.useImperativeHandle(f, g, H);
  }, b.useInsertionEffect = function(f, g) {
    return he.current.useInsertionEffect(f, g);
  }, b.useLayoutEffect = function(f, g) {
    return he.current.useLayoutEffect(f, g);
  }, b.useMemo = function(f, g) {
    return he.current.useMemo(f, g);
  }, b.useReducer = function(f, g, H) {
    return he.current.useReducer(f, g, H);
  }, b.useRef = function(f) {
    return he.current.useRef(f);
  }, b.useState = function(f) {
    return he.current.useState(f);
  }, b.useSyncExternalStore = function(f, g, H) {
    return he.current.useSyncExternalStore(f, g, H);
  }, b.useTransition = function() {
    return he.current.useTransition();
  }, b.version = "18.3.1", b;
}
var Va;
function Hi() {
  return Va || (Va = 1, ji.exports = /* @__PURE__ */ cd()), ji.exports;
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
var Wa;
function fd() {
  if (Wa) return Sr;
  Wa = 1;
  var a = /* @__PURE__ */ Hi(), p = Symbol.for("react.element"), u = Symbol.for("react.fragment"), v = Object.prototype.hasOwnProperty, C = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, R = { key: !0, ref: !0, __self: !0, __source: !0 };
  function _(O, P, T) {
    var z, S = {}, V = null, X = null;
    T !== void 0 && (V = "" + T), P.key !== void 0 && (V = "" + P.key), P.ref !== void 0 && (X = P.ref);
    for (z in P) v.call(P, z) && !R.hasOwnProperty(z) && (S[z] = P[z]);
    if (O && O.defaultProps) for (z in P = O.defaultProps, P) S[z] === void 0 && (S[z] = P[z]);
    return { $$typeof: p, type: O, key: V, ref: X, props: S, _owner: C.current };
  }
  return Sr.Fragment = u, Sr.jsx = _, Sr.jsxs = _, Sr;
}
var Ba;
function dd() {
  return Ba || (Ba = 1, Oi.exports = /* @__PURE__ */ fd()), Oi.exports;
}
var N = /* @__PURE__ */ dd(), Ol = {}, zi = { exports: {} }, Je = {}, Di = { exports: {} }, Ai = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Qa;
function pd() {
  return Qa || (Qa = 1, (function(a) {
    function p(I, q) {
      var M = I.length;
      I.push(q);
      e: for (; 0 < M; ) {
        var f = M - 1 >>> 1, g = I[f];
        if (0 < C(g, q)) I[f] = q, I[M] = g, M = f;
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
          var Y = 2 * (f + 1) - 1, Z = I[Y], ee = Y + 1, fe = I[ee];
          if (0 > C(Z, M)) ee < g && 0 > C(fe, Z) ? (I[f] = fe, I[ee] = M, f = ee) : (I[f] = Z, I[Y] = M, f = Y);
          else if (ee < g && 0 > C(fe, M)) I[f] = fe, I[ee] = M, f = ee;
          else break e;
        }
      }
      return q;
    }
    function C(I, q) {
      var M = I.sortIndex - q.sortIndex;
      return M !== 0 ? M : I.id - q.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var R = performance;
      a.unstable_now = function() {
        return R.now();
      };
    } else {
      var _ = Date, O = _.now();
      a.unstable_now = function() {
        return _.now() - O;
      };
    }
    var P = [], T = [], z = 1, S = null, V = 3, X = !1, J = !1, w = !1, A = typeof setTimeout == "function" ? setTimeout : null, re = typeof clearTimeout == "function" ? clearTimeout : null, ne = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function j(I) {
      for (var q = u(T); q !== null; ) {
        if (q.callback === null) v(T);
        else if (q.startTime <= I) v(T), q.sortIndex = q.expirationTime, p(P, q);
        else break;
        q = u(T);
      }
    }
    function ce(I) {
      if (w = !1, j(I), !J) if (u(P) !== null) J = !0, Fe(ue);
      else {
        var q = u(T);
        q !== null && he(ce, q.startTime - I);
      }
    }
    function ue(I, q) {
      J = !1, w && (w = !1, re(ge), ge = -1), X = !0;
      var M = V;
      try {
        for (j(q), S = u(P); S !== null && (!(S.expirationTime > q) || I && !Q()); ) {
          var f = S.callback;
          if (typeof f == "function") {
            S.callback = null, V = S.priorityLevel;
            var g = f(S.expirationTime <= q);
            q = a.unstable_now(), typeof g == "function" ? S.callback = g : S === u(P) && v(P), j(q);
          } else v(P);
          S = u(P);
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
    var oe = !1, Ee = null, ge = -1, Qe = 5, we = -1;
    function Q() {
      return !(a.unstable_now() - we < Qe);
    }
    function Se() {
      if (Ee !== null) {
        var I = a.unstable_now();
        we = I;
        var q = !0;
        try {
          q = Ee(!0, I);
        } finally {
          q ? Ae() : (oe = !1, Ee = null);
        }
      } else oe = !1;
    }
    var Ae;
    if (typeof ne == "function") Ae = function() {
      ne(Se);
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
      Ee = I, oe || (oe = !0, Ae());
    }
    function he(I, q) {
      ge = A(function() {
        I(a.unstable_now());
      }, q);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(I) {
      I.callback = null;
    }, a.unstable_continueExecution = function() {
      J || X || (J = !0, Fe(ue));
    }, a.unstable_forceFrameRate = function(I) {
      0 > I || 125 < I ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Qe = 0 < I ? Math.floor(1e3 / I) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return V;
    }, a.unstable_getFirstCallbackNode = function() {
      return u(P);
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
      return g = M + g, I = { id: z++, callback: q, priorityLevel: I, startTime: M, expirationTime: g, sortIndex: -1 }, M > f ? (I.sortIndex = M, p(T, I), u(P) === null && I === u(T) && (w ? (re(ge), ge = -1) : w = !0, he(ce, M - f))) : (I.sortIndex = g, p(P, I), J || X || (J = !0, Fe(ue))), I;
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
  })(Ai)), Ai;
}
var Ha;
function md() {
  return Ha || (Ha = 1, Di.exports = /* @__PURE__ */ pd()), Di.exports;
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
var $a;
function hd() {
  if ($a) return Je;
  $a = 1;
  var a = /* @__PURE__ */ Hi(), p = /* @__PURE__ */ md();
  function u(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var v = /* @__PURE__ */ new Set(), C = {};
  function R(e, t) {
    _(e, t), _(e + "Capture", t);
  }
  function _(e, t) {
    for (C[e] = t, e = 0; e < t.length; e++) v.add(t[e]);
  }
  var O = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), P = Object.prototype.hasOwnProperty, T = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, z = {}, S = {};
  function V(e) {
    return P.call(S, e) ? !0 : P.call(z, e) ? !1 : T.test(e) ? S[e] = !0 : (z[e] = !0, !1);
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
  function w(e, t, n, r, l, o, i) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = o, this.removeEmptyString = i;
  }
  var A = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    A[e] = new w(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    A[t] = new w(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    A[e] = new w(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    A[e] = new w(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    A[e] = new w(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    A[e] = new w(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    A[e] = new w(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    A[e] = new w(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    A[e] = new w(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var re = /[\-:]([a-z])/g;
  function ne(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      re,
      ne
    );
    A[t] = new w(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(re, ne);
    A[t] = new w(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(re, ne);
    A[t] = new w(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    A[e] = new w(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), A.xlinkHref = new w("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    A[e] = new w(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function j(e, t, n, r) {
    var l = A.hasOwnProperty(t) ? A[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && (J(t, n, l, r) && (n = null), r || l === null ? V(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var ce = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ue = Symbol.for("react.element"), oe = Symbol.for("react.portal"), Ee = Symbol.for("react.fragment"), ge = Symbol.for("react.strict_mode"), Qe = Symbol.for("react.profiler"), we = Symbol.for("react.provider"), Q = Symbol.for("react.context"), Se = Symbol.for("react.forward_ref"), Ae = Symbol.for("react.suspense"), Ze = Symbol.for("react.suspense_list"), Me = Symbol.for("react.memo"), Fe = Symbol.for("react.lazy"), he = Symbol.for("react.offscreen"), I = Symbol.iterator;
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
  function Z(e) {
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
  function ee(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case Ee:
        return "Fragment";
      case oe:
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
        return t = e.displayName || null, t !== null ? t : ee(e.type) || "Memo";
      case Fe:
        t = e._payload, e = e._init;
        try {
          return ee(e(t));
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
        return ee(t);
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
  function $i(e) {
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
  function Fl(e, t) {
    var n = t.checked;
    return M({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function Ki(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = se(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function qi(e, t) {
    t = t.checked, t != null && j(e, "checked", t, !1);
  }
  function Ul(e, t) {
    qi(e, t);
    var n = se(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Vl(e, t.type, n) : t.hasOwnProperty("defaultValue") && Vl(e, t.type, se(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function Yi(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Vl(e, t, n) {
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
  function Wl(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(u(91));
    return M({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function Gi(e, t) {
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
  function Xi(e, t) {
    var n = se(t.value), r = se(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function Ji(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function Zi(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Bl(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? Zi(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Cr, bi = (function(e) {
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
  }, pc = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Mn).forEach(function(e) {
    pc.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Mn[t] = Mn[e];
    });
  });
  function eu(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Mn.hasOwnProperty(e) && Mn[e] ? ("" + t).trim() : t + "px";
  }
  function tu(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = eu(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var mc = M({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Ql(e, t) {
    if (t) {
      if (mc[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(u(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(u(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(u(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(u(62));
    }
  }
  function Hl(e, t) {
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
  var $l = null;
  function Kl(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var ql = null, cn = null, fn = null;
  function nu(e) {
    if (e = or(e)) {
      if (typeof ql != "function") throw Error(u(280));
      var t = e.stateNode;
      t && (t = qr(t), ql(e.stateNode, e.type, t));
    }
  }
  function ru(e) {
    cn ? fn ? fn.push(e) : fn = [e] : cn = e;
  }
  function lu() {
    if (cn) {
      var e = cn, t = fn;
      if (fn = cn = null, nu(e), t) for (e = 0; e < t.length; e++) nu(t[e]);
    }
  }
  function ou(e, t) {
    return e(t);
  }
  function iu() {
  }
  var Yl = !1;
  function uu(e, t, n) {
    if (Yl) return e(t, n);
    Yl = !0;
    try {
      return ou(e, t, n);
    } finally {
      Yl = !1, (cn !== null || fn !== null) && (iu(), lu());
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
  var Gl = !1;
  if (O) try {
    var Un = {};
    Object.defineProperty(Un, "passive", { get: function() {
      Gl = !0;
    } }), window.addEventListener("test", Un, Un), window.removeEventListener("test", Un, Un);
  } catch {
    Gl = !1;
  }
  function hc(e, t, n, r, l, o, i, s, c) {
    var y = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, y);
    } catch (E) {
      this.onError(E);
    }
  }
  var Vn = !1, xr = null, Pr = !1, Xl = null, yc = { onError: function(e) {
    Vn = !0, xr = e;
  } };
  function vc(e, t, n, r, l, o, i, s, c) {
    Vn = !1, xr = null, hc.apply(yc, arguments);
  }
  function gc(e, t, n, r, l, o, i, s, c) {
    if (vc.apply(this, arguments), Vn) {
      if (Vn) {
        var y = xr;
        Vn = !1, xr = null;
      } else throw Error(u(198));
      Pr || (Pr = !0, Xl = y);
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
  function su(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function au(e) {
    if (Gt(e) !== e) throw Error(u(188));
  }
  function wc(e) {
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
          if (o === n) return au(l), e;
          if (o === r) return au(l), t;
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
  function cu(e) {
    return e = wc(e), e !== null ? fu(e) : null;
  }
  function fu(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = fu(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var du = p.unstable_scheduleCallback, pu = p.unstable_cancelCallback, Sc = p.unstable_shouldYield, kc = p.unstable_requestPaint, xe = p.unstable_now, _c = p.unstable_getCurrentPriorityLevel, Jl = p.unstable_ImmediatePriority, mu = p.unstable_UserBlockingPriority, Nr = p.unstable_NormalPriority, Ec = p.unstable_LowPriority, hu = p.unstable_IdlePriority, Rr = null, vt = null;
  function Cc(e) {
    if (vt && typeof vt.onCommitFiberRoot == "function") try {
      vt.onCommitFiberRoot(Rr, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var ct = Math.clz32 ? Math.clz32 : Nc, xc = Math.log, Pc = Math.LN2;
  function Nc(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (xc(e) / Pc | 0) | 0;
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
  function Rc(e, t) {
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
  function Lc(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
      var i = 31 - ct(o), s = 1 << i, c = l[i];
      c === -1 ? ((s & n) === 0 || (s & r) !== 0) && (l[i] = Rc(s, t)) : c <= t && (e.expiredLanes |= s), o &= ~s;
    }
  }
  function Zl(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function yu() {
    var e = Lr;
    return Lr <<= 1, (Lr & 4194240) === 0 && (Lr = 64), e;
  }
  function bl(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Bn(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - ct(t), e[t] = n;
  }
  function Tc(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - ct(n), o = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~o;
    }
  }
  function eo(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - ct(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var ae = 0;
  function vu(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var gu, to, wu, Su, ku, no = !1, Or = [], Tt = null, It = null, Ot = null, Qn = /* @__PURE__ */ new Map(), Hn = /* @__PURE__ */ new Map(), jt = [], Ic = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function _u(e, t) {
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
    return e === null || e.nativeEvent !== o ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: o, targetContainers: [l] }, t !== null && (t = or(t), t !== null && to(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function Oc(e, t, n, r, l) {
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
  function Eu(e) {
    var t = Xt(e.target);
    if (t !== null) {
      var n = Gt(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = su(n), t !== null) {
            e.blockedOn = t, ku(e.priority, function() {
              wu(n);
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
      var n = lo(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        $l = r, n.target.dispatchEvent(r), $l = null;
      } else return t = or(n), t !== null && to(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Cu(e, t, n) {
    jr(e) && n.delete(t);
  }
  function jc() {
    no = !1, Tt !== null && jr(Tt) && (Tt = null), It !== null && jr(It) && (It = null), Ot !== null && jr(Ot) && (Ot = null), Qn.forEach(Cu), Hn.forEach(Cu);
  }
  function Kn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, no || (no = !0, p.unstable_scheduleCallback(p.unstable_NormalPriority, jc)));
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
    for (; 0 < jt.length && (n = jt[0], n.blockedOn === null); ) Eu(n), n.blockedOn === null && jt.shift();
  }
  var dn = ce.ReactCurrentBatchConfig, zr = !0;
  function zc(e, t, n, r) {
    var l = ae, o = dn.transition;
    dn.transition = null;
    try {
      ae = 1, ro(e, t, n, r);
    } finally {
      ae = l, dn.transition = o;
    }
  }
  function Dc(e, t, n, r) {
    var l = ae, o = dn.transition;
    dn.transition = null;
    try {
      ae = 4, ro(e, t, n, r);
    } finally {
      ae = l, dn.transition = o;
    }
  }
  function ro(e, t, n, r) {
    if (zr) {
      var l = lo(e, t, n, r);
      if (l === null) _o(e, t, r, Dr, n), _u(e, r);
      else if (Oc(l, e, t, n, r)) r.stopPropagation();
      else if (_u(e, r), t & 4 && -1 < Ic.indexOf(e)) {
        for (; l !== null; ) {
          var o = or(l);
          if (o !== null && gu(o), o = lo(e, t, n, r), o === null && _o(e, t, r, Dr, n), o === l) break;
          l = o;
        }
        l !== null && r.stopPropagation();
      } else _o(e, t, r, null, n);
    }
  }
  var Dr = null;
  function lo(e, t, n, r) {
    if (Dr = null, e = Kl(r), e = Xt(e), e !== null) if (t = Gt(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = su(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Dr = e, null;
  }
  function xu(e) {
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
        switch (_c()) {
          case Jl:
            return 1;
          case mu:
            return 4;
          case Nr:
          case Ec:
            return 16;
          case hu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var zt = null, oo = null, Ar = null;
  function Pu() {
    if (Ar) return Ar;
    var e, t = oo, n = t.length, r, l = "value" in zt ? zt.value : zt.textContent, o = l.length;
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
  }, defaultPrevented: 0, isTrusted: 0 }, io = et(pn), Yn = M({}, pn, { view: 0, detail: 0 }), Ac = et(Yn), uo, so, Gn, Ur = M({}, Yn, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: co, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== Gn && (Gn && e.type === "mousemove" ? (uo = e.screenX - Gn.screenX, so = e.screenY - Gn.screenY) : so = uo = 0, Gn = e), uo);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : so;
  } }), Ru = et(Ur), Mc = M({}, Ur, { dataTransfer: 0 }), Fc = et(Mc), Uc = M({}, Yn, { relatedTarget: 0 }), ao = et(Uc), Vc = M({}, pn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Wc = et(Vc), Bc = M({}, pn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), Qc = et(Bc), Hc = M({}, pn, { data: 0 }), Lu = et(Hc), $c = {
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
  }, Kc = {
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
  }, qc = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Yc(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = qc[e]) ? !!t[e] : !1;
  }
  function co() {
    return Yc;
  }
  var Gc = M({}, Yn, { key: function(e) {
    if (e.key) {
      var t = $c[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Mr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? Kc[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: co, charCode: function(e) {
    return e.type === "keypress" ? Mr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Mr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), Xc = et(Gc), Jc = M({}, Ur, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Tu = et(Jc), Zc = M({}, Yn, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: co }), bc = et(Zc), ef = M({}, pn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), tf = et(ef), nf = M({}, Ur, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), rf = et(nf), lf = [9, 13, 27, 32], fo = O && "CompositionEvent" in window, Xn = null;
  O && "documentMode" in document && (Xn = document.documentMode);
  var of = O && "TextEvent" in window && !Xn, Iu = O && (!fo || Xn && 8 < Xn && 11 >= Xn), Ou = " ", ju = !1;
  function zu(e, t) {
    switch (e) {
      case "keyup":
        return lf.indexOf(t.keyCode) !== -1;
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
  function Du(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var mn = !1;
  function uf(e, t) {
    switch (e) {
      case "compositionend":
        return Du(t);
      case "keypress":
        return t.which !== 32 ? null : (ju = !0, Ou);
      case "textInput":
        return e = t.data, e === Ou && ju ? null : e;
      default:
        return null;
    }
  }
  function sf(e, t) {
    if (mn) return e === "compositionend" || !fo && zu(e, t) ? (e = Pu(), Ar = oo = zt = null, mn = !1, e) : null;
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
        return Iu && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var af = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Au(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!af[e.type] : t === "textarea";
  }
  function Mu(e, t, n, r) {
    ru(r), t = Hr(t, "onChange"), 0 < t.length && (n = new io("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var Jn = null, Zn = null;
  function cf(e) {
    ts(e, 0);
  }
  function Vr(e) {
    var t = wn(e);
    if ($i(t)) return e;
  }
  function ff(e, t) {
    if (e === "change") return t;
  }
  var Fu = !1;
  if (O) {
    var po;
    if (O) {
      var mo = "oninput" in document;
      if (!mo) {
        var Uu = document.createElement("div");
        Uu.setAttribute("oninput", "return;"), mo = typeof Uu.oninput == "function";
      }
      po = mo;
    } else po = !1;
    Fu = po && (!document.documentMode || 9 < document.documentMode);
  }
  function Vu() {
    Jn && (Jn.detachEvent("onpropertychange", Wu), Zn = Jn = null);
  }
  function Wu(e) {
    if (e.propertyName === "value" && Vr(Zn)) {
      var t = [];
      Mu(t, Zn, e, Kl(e)), uu(cf, t);
    }
  }
  function df(e, t, n) {
    e === "focusin" ? (Vu(), Jn = t, Zn = n, Jn.attachEvent("onpropertychange", Wu)) : e === "focusout" && Vu();
  }
  function pf(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return Vr(Zn);
  }
  function mf(e, t) {
    if (e === "click") return Vr(t);
  }
  function hf(e, t) {
    if (e === "input" || e === "change") return Vr(t);
  }
  function yf(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var ft = typeof Object.is == "function" ? Object.is : yf;
  function bn(e, t) {
    if (ft(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!P.call(t, l) || !ft(e[l], t[l])) return !1;
    }
    return !0;
  }
  function Bu(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function Qu(e, t) {
    var n = Bu(e);
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
      n = Bu(n);
    }
  }
  function Hu(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? Hu(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function $u() {
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
  function ho(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function vf(e) {
    var t = $u(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && Hu(n.ownerDocument.documentElement, n)) {
      if (r !== null && ho(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, o = Math.min(r.start, l);
          r = r.end === void 0 ? o : Math.min(r.end, l), !e.extend && o > r && (l = r, r = o, o = l), l = Qu(n, o);
          var i = Qu(
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
  var gf = O && "documentMode" in document && 11 >= document.documentMode, hn = null, yo = null, er = null, vo = !1;
  function Ku(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    vo || hn == null || hn !== Er(r) || (r = hn, "selectionStart" in r && ho(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), er && bn(er, r) || (er = r, r = Hr(yo, "onSelect"), 0 < r.length && (t = new io("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = hn)));
  }
  function Wr(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var yn = { animationend: Wr("Animation", "AnimationEnd"), animationiteration: Wr("Animation", "AnimationIteration"), animationstart: Wr("Animation", "AnimationStart"), transitionend: Wr("Transition", "TransitionEnd") }, go = {}, qu = {};
  O && (qu = document.createElement("div").style, "AnimationEvent" in window || (delete yn.animationend.animation, delete yn.animationiteration.animation, delete yn.animationstart.animation), "TransitionEvent" in window || delete yn.transitionend.transition);
  function Br(e) {
    if (go[e]) return go[e];
    if (!yn[e]) return e;
    var t = yn[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in qu) return go[e] = t[n];
    return e;
  }
  var Yu = Br("animationend"), Gu = Br("animationiteration"), Xu = Br("animationstart"), Ju = Br("transitionend"), Zu = /* @__PURE__ */ new Map(), bu = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Dt(e, t) {
    Zu.set(e, t), R(t, [e]);
  }
  for (var wo = 0; wo < bu.length; wo++) {
    var So = bu[wo], wf = So.toLowerCase(), Sf = So[0].toUpperCase() + So.slice(1);
    Dt(wf, "on" + Sf);
  }
  Dt(Yu, "onAnimationEnd"), Dt(Gu, "onAnimationIteration"), Dt(Xu, "onAnimationStart"), Dt("dblclick", "onDoubleClick"), Dt("focusin", "onFocus"), Dt("focusout", "onBlur"), Dt(Ju, "onTransitionEnd"), _("onMouseEnter", ["mouseout", "mouseover"]), _("onMouseLeave", ["mouseout", "mouseover"]), _("onPointerEnter", ["pointerout", "pointerover"]), _("onPointerLeave", ["pointerout", "pointerover"]), R("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), R("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), R("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), R("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), R("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), R("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var tr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), kf = new Set("cancel close invalid load scroll toggle".split(" ").concat(tr));
  function es(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, gc(r, t, void 0, e), e.currentTarget = null;
  }
  function ts(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var o = void 0;
        if (t) for (var i = r.length - 1; 0 <= i; i--) {
          var s = r[i], c = s.instance, y = s.currentTarget;
          if (s = s.listener, c !== o && l.isPropagationStopped()) break e;
          es(l, s, y), o = c;
        }
        else for (i = 0; i < r.length; i++) {
          if (s = r[i], c = s.instance, y = s.currentTarget, s = s.listener, c !== o && l.isPropagationStopped()) break e;
          es(l, s, y), o = c;
        }
      }
    }
    if (Pr) throw e = Xl, Pr = !1, Xl = null, e;
  }
  function pe(e, t) {
    var n = t[Ro];
    n === void 0 && (n = t[Ro] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (ns(t, e, 2, !1), n.add(r));
  }
  function ko(e, t, n) {
    var r = 0;
    t && (r |= 4), ns(n, e, r, t);
  }
  var Qr = "_reactListening" + Math.random().toString(36).slice(2);
  function nr(e) {
    if (!e[Qr]) {
      e[Qr] = !0, v.forEach(function(n) {
        n !== "selectionchange" && (kf.has(n) || ko(n, !1, e), ko(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Qr] || (t[Qr] = !0, ko("selectionchange", !1, t));
    }
  }
  function ns(e, t, n, r) {
    switch (xu(t)) {
      case 1:
        var l = zc;
        break;
      case 4:
        l = Dc;
        break;
      default:
        l = ro;
    }
    n = l.bind(null, t, n, e), l = void 0, !Gl || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function _o(e, t, n, r, l) {
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
    uu(function() {
      var y = o, E = Kl(n), x = [];
      e: {
        var k = Zu.get(e);
        if (k !== void 0) {
          var D = io, U = e;
          switch (e) {
            case "keypress":
              if (Mr(n) === 0) break e;
            case "keydown":
            case "keyup":
              D = Xc;
              break;
            case "focusin":
              U = "focus", D = ao;
              break;
            case "focusout":
              U = "blur", D = ao;
              break;
            case "beforeblur":
            case "afterblur":
              D = ao;
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
              D = Ru;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              D = Fc;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              D = bc;
              break;
            case Yu:
            case Gu:
            case Xu:
              D = Wc;
              break;
            case Ju:
              D = tf;
              break;
            case "scroll":
              D = Ac;
              break;
            case "wheel":
              D = rf;
              break;
            case "copy":
            case "cut":
            case "paste":
              D = Qc;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              D = Tu;
          }
          var W = (t & 4) !== 0, Pe = !W && e === "scroll", m = W ? k !== null ? k + "Capture" : null : k;
          W = [];
          for (var d = y, h; d !== null; ) {
            h = d;
            var L = h.stateNode;
            if (h.tag === 5 && L !== null && (h = L, m !== null && (L = Fn(d, m), L != null && W.push(rr(d, L, h)))), Pe) break;
            d = d.return;
          }
          0 < W.length && (k = new D(k, U, null, n, E), x.push({ event: k, listeners: W }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (k = e === "mouseover" || e === "pointerover", D = e === "mouseout" || e === "pointerout", k && n !== $l && (U = n.relatedTarget || n.fromElement) && (Xt(U) || U[_t])) break e;
          if ((D || k) && (k = E.window === E ? E : (k = E.ownerDocument) ? k.defaultView || k.parentWindow : window, D ? (U = n.relatedTarget || n.toElement, D = y, U = U ? Xt(U) : null, U !== null && (Pe = Gt(U), U !== Pe || U.tag !== 5 && U.tag !== 6) && (U = null)) : (D = null, U = y), D !== U)) {
            if (W = Ru, L = "onMouseLeave", m = "onMouseEnter", d = "mouse", (e === "pointerout" || e === "pointerover") && (W = Tu, L = "onPointerLeave", m = "onPointerEnter", d = "pointer"), Pe = D == null ? k : wn(D), h = U == null ? k : wn(U), k = new W(L, d + "leave", D, n, E), k.target = Pe, k.relatedTarget = h, L = null, Xt(E) === y && (W = new W(m, d + "enter", U, n, E), W.target = h, W.relatedTarget = Pe, L = W), Pe = L, D && U) t: {
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
            D !== null && rs(x, k, D, W, !1), U !== null && Pe !== null && rs(x, Pe, U, W, !0);
          }
        }
        e: {
          if (k = y ? wn(y) : window, D = k.nodeName && k.nodeName.toLowerCase(), D === "select" || D === "input" && k.type === "file") var B = ff;
          else if (Au(k)) if (Fu) B = hf;
          else {
            B = pf;
            var $ = df;
          }
          else (D = k.nodeName) && D.toLowerCase() === "input" && (k.type === "checkbox" || k.type === "radio") && (B = mf);
          if (B && (B = B(e, y))) {
            Mu(x, B, n, E);
            break e;
          }
          $ && $(e, k, y), e === "focusout" && ($ = k._wrapperState) && $.controlled && k.type === "number" && Vl(k, "number", k.value);
        }
        switch ($ = y ? wn(y) : window, e) {
          case "focusin":
            (Au($) || $.contentEditable === "true") && (hn = $, yo = y, er = null);
            break;
          case "focusout":
            er = yo = hn = null;
            break;
          case "mousedown":
            vo = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            vo = !1, Ku(x, n, E);
            break;
          case "selectionchange":
            if (gf) break;
          case "keydown":
          case "keyup":
            Ku(x, n, E);
        }
        var K;
        if (fo) e: {
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
        else mn ? zu(e, n) && (G = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (G = "onCompositionStart");
        G && (Iu && n.locale !== "ko" && (mn || G !== "onCompositionStart" ? G === "onCompositionEnd" && mn && (K = Pu()) : (zt = E, oo = "value" in zt ? zt.value : zt.textContent, mn = !0)), $ = Hr(y, G), 0 < $.length && (G = new Lu(G, e, null, n, E), x.push({ event: G, listeners: $ }), K ? G.data = K : (K = Du(n), K !== null && (G.data = K)))), (K = of ? uf(e, n) : sf(e, n)) && (y = Hr(y, "onBeforeInput"), 0 < y.length && (E = new Lu("onBeforeInput", "beforeinput", null, n, E), x.push({ event: E, listeners: y }), E.data = K));
      }
      ts(x, t);
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
  function rs(e, t, n, r, l) {
    for (var o = t._reactName, i = []; n !== null && n !== r; ) {
      var s = n, c = s.alternate, y = s.stateNode;
      if (c !== null && c === r) break;
      s.tag === 5 && y !== null && (s = y, l ? (c = Fn(n, o), c != null && i.unshift(rr(n, c, s))) : l || (c = Fn(n, o), c != null && i.push(rr(n, c, s)))), n = n.return;
    }
    i.length !== 0 && e.push({ event: t, listeners: i });
  }
  var _f = /\r\n?/g, Ef = /\u0000|\uFFFD/g;
  function ls(e) {
    return (typeof e == "string" ? e : "" + e).replace(_f, `
`).replace(Ef, "");
  }
  function $r(e, t, n) {
    if (t = ls(t), ls(e) !== t && n) throw Error(u(425));
  }
  function Kr() {
  }
  var Eo = null, Co = null;
  function xo(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var Po = typeof setTimeout == "function" ? setTimeout : void 0, Cf = typeof clearTimeout == "function" ? clearTimeout : void 0, os = typeof Promise == "function" ? Promise : void 0, xf = typeof queueMicrotask == "function" ? queueMicrotask : typeof os < "u" ? function(e) {
    return os.resolve(null).then(e).catch(Pf);
  } : Po;
  function Pf(e) {
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
  function is(e) {
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
  var gn = Math.random().toString(36).slice(2), gt = "__reactFiber$" + gn, lr = "__reactProps$" + gn, _t = "__reactContainer$" + gn, Ro = "__reactEvents$" + gn, Nf = "__reactListeners$" + gn, Rf = "__reactHandles$" + gn;
  function Xt(e) {
    var t = e[gt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[_t] || n[gt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = is(e); e !== null; ) {
          if (n = e[gt]) return n;
          e = is(e);
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
  var Lo = [], Sn = -1;
  function Mt(e) {
    return { current: e };
  }
  function me(e) {
    0 > Sn || (e.current = Lo[Sn], Lo[Sn] = null, Sn--);
  }
  function de(e, t) {
    Sn++, Lo[Sn] = e.current, e.current = t;
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
  function us(e, t, n) {
    if (Ue.current !== Ft) throw Error(u(168));
    de(Ue, t), de(Ke, n);
  }
  function ss(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(u(108, fe(e) || "Unknown", l));
    return M({}, n, r);
  }
  function Gr(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Ft, Jt = Ue.current, de(Ue, e), de(Ke, Ke.current), !0;
  }
  function as(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(u(169));
    n ? (e = ss(e, t, Jt), r.__reactInternalMemoizedMergedChildContext = e, me(Ke), me(Ue), de(Ue, e)) : me(Ke), de(Ke, n);
  }
  var Et = null, Xr = !1, To = !1;
  function cs(e) {
    Et === null ? Et = [e] : Et.push(e);
  }
  function Lf(e) {
    Xr = !0, cs(e);
  }
  function Ut() {
    if (!To && Et !== null) {
      To = !0;
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
        throw Et !== null && (Et = Et.slice(e + 1)), du(Jl, Ut), l;
      } finally {
        ae = t, To = !1;
      }
    }
    return null;
  }
  var _n = [], En = 0, Jr = null, Zr = 0, lt = [], ot = 0, Zt = null, Ct = 1, xt = "";
  function bt(e, t) {
    _n[En++] = Zr, _n[En++] = Jr, Jr = e, Zr = t;
  }
  function fs(e, t, n) {
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
  function Io(e) {
    e.return !== null && (bt(e, 1), fs(e, 1, 0));
  }
  function Oo(e) {
    for (; e === Jr; ) Jr = _n[--En], _n[En] = null, Zr = _n[--En], _n[En] = null;
    for (; e === Zt; ) Zt = lt[--ot], lt[ot] = null, xt = lt[--ot], lt[ot] = null, Ct = lt[--ot], lt[ot] = null;
  }
  var tt = null, nt = null, ve = !1, dt = null;
  function ds(e, t) {
    var n = at(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function ps(e, t) {
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
  function jo(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function zo(e) {
    if (ve) {
      var t = nt;
      if (t) {
        var n = t;
        if (!ps(e, t)) {
          if (jo(e)) throw Error(u(418));
          t = At(n.nextSibling);
          var r = tt;
          t && ps(e, t) ? ds(r, n) : (e.flags = e.flags & -4097 | 2, ve = !1, tt = e);
        }
      } else {
        if (jo(e)) throw Error(u(418));
        e.flags = e.flags & -4097 | 2, ve = !1, tt = e;
      }
    }
  }
  function ms(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    tt = e;
  }
  function br(e) {
    if (e !== tt) return !1;
    if (!ve) return ms(e), ve = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !xo(e.type, e.memoizedProps)), t && (t = nt)) {
      if (jo(e)) throw hs(), Error(u(418));
      for (; t; ) ds(e, t), t = At(t.nextSibling);
    }
    if (ms(e), e.tag === 13) {
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
  function hs() {
    for (var e = nt; e; ) e = At(e.nextSibling);
  }
  function Cn() {
    nt = tt = null, ve = !1;
  }
  function Do(e) {
    dt === null ? dt = [e] : dt.push(e);
  }
  var Tf = ce.ReactCurrentBatchConfig;
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
  function ys(e) {
    var t = e._init;
    return t(e._payload);
  }
  function vs(e) {
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
      return d === null || d.tag !== 6 ? (d = Pi(h, m.mode, L), d.return = m, d) : (d = l(d, h), d.return = m, d);
    }
    function c(m, d, h, L) {
      var B = h.type;
      return B === Ee ? E(m, d, h.props.children, L, h.key) : d !== null && (d.elementType === B || typeof B == "object" && B !== null && B.$$typeof === Fe && ys(B) === d.type) ? (L = l(d, h.props), L.ref = ir(m, d, h), L.return = m, L) : (L = Cl(h.type, h.key, h.props, null, m.mode, L), L.ref = ir(m, d, h), L.return = m, L);
    }
    function y(m, d, h, L) {
      return d === null || d.tag !== 4 || d.stateNode.containerInfo !== h.containerInfo || d.stateNode.implementation !== h.implementation ? (d = Ni(h, m.mode, L), d.return = m, d) : (d = l(d, h.children || []), d.return = m, d);
    }
    function E(m, d, h, L, B) {
      return d === null || d.tag !== 7 ? (d = sn(h, m.mode, L, B), d.return = m, d) : (d = l(d, h), d.return = m, d);
    }
    function x(m, d, h) {
      if (typeof d == "string" && d !== "" || typeof d == "number") return d = Pi("" + d, m.mode, h), d.return = m, d;
      if (typeof d == "object" && d !== null) {
        switch (d.$$typeof) {
          case ue:
            return h = Cl(d.type, d.key, d.props, null, m.mode, h), h.ref = ir(m, null, d), h.return = m, h;
          case oe:
            return d = Ni(d, m.mode, h), d.return = m, d;
          case Fe:
            var L = d._init;
            return x(m, L(d._payload), h);
        }
        if (Dn(d) || q(d)) return d = sn(d, m.mode, h, null), d.return = m, d;
        el(m, d);
      }
      return null;
    }
    function k(m, d, h, L) {
      var B = d !== null ? d.key : null;
      if (typeof h == "string" && h !== "" || typeof h == "number") return B !== null ? null : s(m, d, "" + h, L);
      if (typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case ue:
            return h.key === B ? c(m, d, h, L) : null;
          case oe:
            return h.key === B ? y(m, d, h, L) : null;
          case Fe:
            return B = h._init, k(
              m,
              d,
              B(h._payload),
              L
            );
        }
        if (Dn(h) || q(h)) return B !== null ? null : E(m, d, h, L, null);
        el(m, h);
      }
      return null;
    }
    function D(m, d, h, L, B) {
      if (typeof L == "string" && L !== "" || typeof L == "number") return m = m.get(h) || null, s(d, m, "" + L, B);
      if (typeof L == "object" && L !== null) {
        switch (L.$$typeof) {
          case ue:
            return m = m.get(L.key === null ? h : L.key) || null, c(d, m, L, B);
          case oe:
            return m = m.get(L.key === null ? h : L.key) || null, y(d, m, L, B);
          case Fe:
            var $ = L._init;
            return D(m, d, h, $(L._payload), B);
        }
        if (Dn(L) || q(L)) return m = m.get(h) || null, E(d, m, L, B, null);
        el(d, L);
      }
      return null;
    }
    function U(m, d, h, L) {
      for (var B = null, $ = null, K = d, G = d = 0, Oe = null; K !== null && G < h.length; G++) {
        K.index > G ? (Oe = K, K = null) : Oe = K.sibling;
        var ie = k(m, K, h[G], L);
        if (ie === null) {
          K === null && (K = Oe);
          break;
        }
        e && K && ie.alternate === null && t(m, K), d = o(ie, d, G), $ === null ? B = ie : $.sibling = ie, $ = ie, K = Oe;
      }
      if (G === h.length) return n(m, K), ve && bt(m, G), B;
      if (K === null) {
        for (; G < h.length; G++) K = x(m, h[G], L), K !== null && (d = o(K, d, G), $ === null ? B = K : $.sibling = K, $ = K);
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
        var Yt = k(m, K, ie.value, L);
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
        for (; !ie.done; G++, ie = h.next()) ie = x(m, ie.value, L), ie !== null && (d = o(ie, d, G), $ === null ? B = ie : $.sibling = ie, $ = ie);
        return ve && bt(m, G), B;
      }
      for (K = r(m, K); !ie.done; G++, ie = h.next()) ie = D(K, m, G, ie.value, L), ie !== null && (e && ie.alternate !== null && K.delete(ie.key === null ? G : ie.key), d = o(ie, d, G), $ === null ? B = ie : $.sibling = ie, $ = ie);
      return e && K.forEach(function(ad) {
        return t(m, ad);
      }), ve && bt(m, G), B;
    }
    function Pe(m, d, h, L) {
      if (typeof h == "object" && h !== null && h.type === Ee && h.key === null && (h = h.props.children), typeof h == "object" && h !== null) {
        switch (h.$$typeof) {
          case ue:
            e: {
              for (var B = h.key, $ = d; $ !== null; ) {
                if ($.key === B) {
                  if (B = h.type, B === Ee) {
                    if ($.tag === 7) {
                      n(m, $.sibling), d = l($, h.props.children), d.return = m, m = d;
                      break e;
                    }
                  } else if ($.elementType === B || typeof B == "object" && B !== null && B.$$typeof === Fe && ys(B) === $.type) {
                    n(m, $.sibling), d = l($, h.props), d.ref = ir(m, $, h), d.return = m, m = d;
                    break e;
                  }
                  n(m, $);
                  break;
                } else t(m, $);
                $ = $.sibling;
              }
              h.type === Ee ? (d = sn(h.props.children, m.mode, L, h.key), d.return = m, m = d) : (L = Cl(h.type, h.key, h.props, null, m.mode, L), L.ref = ir(m, d, h), L.return = m, m = L);
            }
            return i(m);
          case oe:
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
            return $ = h._init, Pe(m, d, $(h._payload), L);
        }
        if (Dn(h)) return U(m, d, h, L);
        if (q(h)) return W(m, d, h, L);
        el(m, h);
      }
      return typeof h == "string" && h !== "" || typeof h == "number" ? (h = "" + h, d !== null && d.tag === 6 ? (n(m, d.sibling), d = l(d, h), d.return = m, m = d) : (n(m, d), d = Pi(h, m.mode, L), d.return = m, m = d), i(m)) : n(m, d);
    }
    return Pe;
  }
  var xn = vs(!0), gs = vs(!1), tl = Mt(null), nl = null, Pn = null, Ao = null;
  function Mo() {
    Ao = Pn = nl = null;
  }
  function Fo(e) {
    var t = tl.current;
    me(tl), e._currentValue = t;
  }
  function Uo(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Nn(e, t) {
    nl = e, Ao = Pn = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Ye = !0), e.firstContext = null);
  }
  function it(e) {
    var t = e._currentValue;
    if (Ao !== e) if (e = { context: e, memoizedValue: t, next: null }, Pn === null) {
      if (nl === null) throw Error(u(308));
      Pn = e, nl.dependencies = { lanes: 0, firstContext: e };
    } else Pn = Pn.next = e;
    return t;
  }
  var en = null;
  function Vo(e) {
    en === null ? en = [e] : en.push(e);
  }
  function ws(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Vo(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Pt(e, r);
  }
  function Pt(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Vt = !1;
  function Wo(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Ss(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function Nt(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Wt(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (le & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Pt(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Vo(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Pt(e, n);
  }
  function rl(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, eo(e, n);
    }
  }
  function ks(e, t) {
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
      var E = e.alternate;
      E !== null && (E = E.updateQueue, s = E.lastBaseUpdate, s !== i && (s === null ? E.firstBaseUpdate = y : s.next = y, E.lastBaseUpdate = c));
    }
    if (o !== null) {
      var x = l.baseState;
      i = 0, E = y = c = null, s = o;
      do {
        var k = s.lane, D = s.eventTime;
        if ((r & k) === k) {
          E !== null && (E = E.next = {
            eventTime: D,
            lane: 0,
            tag: s.tag,
            payload: s.payload,
            callback: s.callback,
            next: null
          });
          e: {
            var U = e, W = s;
            switch (k = t, D = n, W.tag) {
              case 1:
                if (U = W.payload, typeof U == "function") {
                  x = U.call(D, x, k);
                  break e;
                }
                x = U;
                break e;
              case 3:
                U.flags = U.flags & -65537 | 128;
              case 0:
                if (U = W.payload, k = typeof U == "function" ? U.call(D, x, k) : U, k == null) break e;
                x = M({}, x, k);
                break e;
              case 2:
                Vt = !0;
            }
          }
          s.callback !== null && s.lane !== 0 && (e.flags |= 64, k = l.effects, k === null ? l.effects = [s] : k.push(s));
        } else D = { eventTime: D, lane: k, tag: s.tag, payload: s.payload, callback: s.callback, next: null }, E === null ? (y = E = D, c = x) : E = E.next = D, i |= k;
        if (s = s.next, s === null) {
          if (s = l.shared.pending, s === null) break;
          k = s, s = k.next, k.next = null, l.lastBaseUpdate = k, l.shared.pending = null;
        }
      } while (!0);
      if (E === null && (c = x), l.baseState = c, l.firstBaseUpdate = y, l.lastBaseUpdate = E, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          i |= l.lane, l = l.next;
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      rn |= i, e.lanes = i, e.memoizedState = x;
    }
  }
  function _s(e, t, n) {
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
  function Bo(e, t) {
    switch (de(ar, t), de(sr, e), de(wt, ur), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Bl(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Bl(t, e);
    }
    me(wt), de(wt, t);
  }
  function Rn() {
    me(wt), me(sr), me(ar);
  }
  function Es(e) {
    tn(ar.current);
    var t = tn(wt.current), n = Bl(t, e.type);
    t !== n && (de(sr, e), de(wt, n));
  }
  function Qo(e) {
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
  var Ho = [];
  function $o() {
    for (var e = 0; e < Ho.length; e++) Ho[e]._workInProgressVersionPrimary = null;
    Ho.length = 0;
  }
  var il = ce.ReactCurrentDispatcher, Ko = ce.ReactCurrentBatchConfig, nn = 0, _e = null, Re = null, Te = null, ul = !1, cr = !1, fr = 0, If = 0;
  function Ve() {
    throw Error(u(321));
  }
  function qo(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!ft(e[n], t[n])) return !1;
    return !0;
  }
  function Yo(e, t, n, r, l, o) {
    if (nn = o, _e = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, il.current = e === null || e.memoizedState === null ? Df : Af, e = n(r, l), cr) {
      o = 0;
      do {
        if (cr = !1, fr = 0, 25 <= o) throw Error(u(301));
        o += 1, Te = Re = null, t.updateQueue = null, il.current = Mf, e = n(r, l);
      } while (cr);
    }
    if (il.current = cl, t = Re !== null && Re.next !== null, nn = 0, Te = Re = _e = null, ul = !1, t) throw Error(u(300));
    return e;
  }
  function Go() {
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
  function Xo(e) {
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
        var E = y.lane;
        if ((nn & E) === E) c !== null && (c = c.next = { lane: 0, action: y.action, hasEagerState: y.hasEagerState, eagerState: y.eagerState, next: null }), r = y.hasEagerState ? y.eagerState : e(r, y.action);
        else {
          var x = {
            lane: E,
            action: y.action,
            hasEagerState: y.hasEagerState,
            eagerState: y.eagerState,
            next: null
          };
          c === null ? (s = c = x, i = r) : c = c.next = x, _e.lanes |= E, rn |= E;
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
  function Jo(e) {
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
  function Cs() {
  }
  function xs(e, t) {
    var n = _e, r = ut(), l = t(), o = !ft(r.memoizedState, l);
    if (o && (r.memoizedState = l, Ye = !0), r = r.queue, Zo(Rs.bind(null, n, r, e), [e]), r.getSnapshot !== t || o || Te !== null && Te.memoizedState.tag & 1) {
      if (n.flags |= 2048, pr(9, Ns.bind(null, n, r, l, t), void 0, null), Ie === null) throw Error(u(349));
      (nn & 30) !== 0 || Ps(n, t, l);
    }
    return l;
  }
  function Ps(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = _e.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, _e.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Ns(e, t, n, r) {
    t.value = n, t.getSnapshot = r, Ls(t) && Ts(e);
  }
  function Rs(e, t, n) {
    return n(function() {
      Ls(t) && Ts(e);
    });
  }
  function Ls(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !ft(e, n);
    } catch {
      return !0;
    }
  }
  function Ts(e) {
    var t = Pt(e, 1);
    t !== null && yt(t, e, 1, -1);
  }
  function Is(e) {
    var t = St();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: dr, lastRenderedState: e }, t.queue = e, e = e.dispatch = zf.bind(null, _e, e), [t.memoizedState, e];
  }
  function pr(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = _e.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, _e.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Os() {
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
      if (o = i.destroy, r !== null && qo(r, i.deps)) {
        l.memoizedState = pr(t, n, o, r);
        return;
      }
    }
    _e.flags |= e, l.memoizedState = pr(1 | t, n, o, r);
  }
  function js(e, t) {
    return sl(8390656, 8, e, t);
  }
  function Zo(e, t) {
    return al(2048, 8, e, t);
  }
  function zs(e, t) {
    return al(4, 2, e, t);
  }
  function Ds(e, t) {
    return al(4, 4, e, t);
  }
  function As(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function Ms(e, t, n) {
    return n = n != null ? n.concat([e]) : null, al(4, 4, As.bind(null, t, e), n);
  }
  function bo() {
  }
  function Fs(e, t) {
    var n = ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && qo(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function Us(e, t) {
    var n = ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && qo(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function Vs(e, t, n) {
    return (nn & 21) === 0 ? (e.baseState && (e.baseState = !1, Ye = !0), e.memoizedState = n) : (ft(n, t) || (n = yu(), _e.lanes |= n, rn |= n, e.baseState = !0), t);
  }
  function Of(e, t) {
    var n = ae;
    ae = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = Ko.transition;
    Ko.transition = {};
    try {
      e(!1), t();
    } finally {
      ae = n, Ko.transition = r;
    }
  }
  function Ws() {
    return ut().memoizedState;
  }
  function jf(e, t, n) {
    var r = $t(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, Bs(e)) Qs(t, n);
    else if (n = ws(e, t, n, r), n !== null) {
      var l = $e();
      yt(n, e, r, l), Hs(n, t, r);
    }
  }
  function zf(e, t, n) {
    var r = $t(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (Bs(e)) Qs(t, l);
    else {
      var o = e.alternate;
      if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
        var i = t.lastRenderedState, s = o(i, n);
        if (l.hasEagerState = !0, l.eagerState = s, ft(s, i)) {
          var c = t.interleaved;
          c === null ? (l.next = l, Vo(t)) : (l.next = c.next, c.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = ws(e, t, l, r), n !== null && (l = $e(), yt(n, e, r, l), Hs(n, t, r));
    }
  }
  function Bs(e) {
    var t = e.alternate;
    return e === _e || t !== null && t === _e;
  }
  function Qs(e, t) {
    cr = ul = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function Hs(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, eo(e, n);
    }
  }
  var cl = { readContext: it, useCallback: Ve, useContext: Ve, useEffect: Ve, useImperativeHandle: Ve, useInsertionEffect: Ve, useLayoutEffect: Ve, useMemo: Ve, useReducer: Ve, useRef: Ve, useState: Ve, useDebugValue: Ve, useDeferredValue: Ve, useTransition: Ve, useMutableSource: Ve, useSyncExternalStore: Ve, useId: Ve, unstable_isNewReconciler: !1 }, Df = { readContext: it, useCallback: function(e, t) {
    return St().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: it, useEffect: js, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, sl(
      4194308,
      4,
      As.bind(null, t, e),
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
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = jf.bind(null, _e, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = St();
    return e = { current: e }, t.memoizedState = e;
  }, useState: Is, useDebugValue: bo, useDeferredValue: function(e) {
    return St().memoizedState = e;
  }, useTransition: function() {
    var e = Is(!1), t = e[0];
    return e = Of.bind(null, e[1]), St().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = _e, l = St();
    if (ve) {
      if (n === void 0) throw Error(u(407));
      n = n();
    } else {
      if (n = t(), Ie === null) throw Error(u(349));
      (nn & 30) !== 0 || Ps(r, t, n);
    }
    l.memoizedState = n;
    var o = { value: n, getSnapshot: t };
    return l.queue = o, js(Rs.bind(
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
    } else n = If++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, Af = {
    readContext: it,
    useCallback: Fs,
    useContext: it,
    useEffect: Zo,
    useImperativeHandle: Ms,
    useInsertionEffect: zs,
    useLayoutEffect: Ds,
    useMemo: Us,
    useReducer: Xo,
    useRef: Os,
    useState: function() {
      return Xo(dr);
    },
    useDebugValue: bo,
    useDeferredValue: function(e) {
      var t = ut();
      return Vs(t, Re.memoizedState, e);
    },
    useTransition: function() {
      var e = Xo(dr)[0], t = ut().memoizedState;
      return [e, t];
    },
    useMutableSource: Cs,
    useSyncExternalStore: xs,
    useId: Ws,
    unstable_isNewReconciler: !1
  }, Mf = { readContext: it, useCallback: Fs, useContext: it, useEffect: Zo, useImperativeHandle: Ms, useInsertionEffect: zs, useLayoutEffect: Ds, useMemo: Us, useReducer: Jo, useRef: Os, useState: function() {
    return Jo(dr);
  }, useDebugValue: bo, useDeferredValue: function(e) {
    var t = ut();
    return Re === null ? t.memoizedState = e : Vs(t, Re.memoizedState, e);
  }, useTransition: function() {
    var e = Jo(dr)[0], t = ut().memoizedState;
    return [e, t];
  }, useMutableSource: Cs, useSyncExternalStore: xs, useId: Ws, unstable_isNewReconciler: !1 };
  function pt(e, t) {
    if (e && e.defaultProps) {
      t = M({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function ei(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : M({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var fl = { isMounted: function(e) {
    return (e = e._reactInternals) ? Gt(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = $e(), l = $t(e), o = Nt(r, l);
    o.payload = t, n != null && (o.callback = n), t = Wt(e, o, l), t !== null && (yt(t, e, l, r), rl(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = $e(), l = $t(e), o = Nt(r, l);
    o.tag = 1, o.payload = t, n != null && (o.callback = n), t = Wt(e, o, l), t !== null && (yt(t, e, l, r), rl(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = $e(), r = $t(e), l = Nt(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Wt(e, l, r), t !== null && (yt(t, e, r, n), rl(t, e, r));
  } };
  function $s(e, t, n, r, l, o, i) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, o, i) : t.prototype && t.prototype.isPureReactComponent ? !bn(n, r) || !bn(l, o) : !0;
  }
  function Ks(e, t, n) {
    var r = !1, l = Ft, o = t.contextType;
    return typeof o == "object" && o !== null ? o = it(o) : (l = qe(t) ? Jt : Ue.current, r = t.contextTypes, o = (r = r != null) ? kn(e, l) : Ft), t = new t(n, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = fl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
  }
  function qs(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && fl.enqueueReplaceState(t, t.state, null);
  }
  function ti(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, Wo(e);
    var o = t.contextType;
    typeof o == "object" && o !== null ? l.context = it(o) : (o = qe(t) ? Jt : Ue.current, l.context = kn(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (ei(e, t, o, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && fl.enqueueReplaceState(l, l.state, null), ll(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Ln(e, t) {
    try {
      var n = "", r = t;
      do
        n += Z(r), r = r.return;
      while (r);
      var l = n;
    } catch (o) {
      l = `
Error generating stack: ` + o.message + `
` + o.stack;
    }
    return { value: e, source: t, stack: l, digest: null };
  }
  function ni(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function ri(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var Ff = typeof WeakMap == "function" ? WeakMap : Map;
  function Ys(e, t, n) {
    n = Nt(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      gl || (gl = !0, gi = r), ri(e, t);
    }, n;
  }
  function Gs(e, t, n) {
    n = Nt(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        ri(e, t);
      };
    }
    var o = e.stateNode;
    return o !== null && typeof o.componentDidCatch == "function" && (n.callback = function() {
      ri(e, t), typeof r != "function" && (Qt === null ? Qt = /* @__PURE__ */ new Set([this]) : Qt.add(this));
      var i = t.stack;
      this.componentDidCatch(t.value, { componentStack: i !== null ? i : "" });
    }), n;
  }
  function Xs(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new Ff();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = Zf.bind(null, e, t, n), t.then(e, e));
  }
  function Js(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function Zs(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = Nt(-1, 1), t.tag = 2, Wt(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var Uf = ce.ReactCurrentOwner, Ye = !1;
  function He(e, t, n, r) {
    t.child = e === null ? gs(t, null, n, r) : xn(t, e.child, n, r);
  }
  function bs(e, t, n, r, l) {
    n = n.render;
    var o = t.ref;
    return Nn(t, l), r = Yo(e, t, n, r, o, l), n = Go(), e !== null && !Ye ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (ve && n && Io(t), t.flags |= 1, He(e, t, r, l), t.child);
  }
  function ea(e, t, n, r, l) {
    if (e === null) {
      var o = n.type;
      return typeof o == "function" && !xi(o) && o.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = o, ta(e, t, o, r, l)) : (e = Cl(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (o = e.child, (e.lanes & l) === 0) {
      var i = o.memoizedProps;
      if (n = n.compare, n = n !== null ? n : bn, n(i, r) && e.ref === t.ref) return Rt(e, t, l);
    }
    return t.flags |= 1, e = qt(o, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function ta(e, t, n, r, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (bn(o, r) && e.ref === t.ref) if (Ye = !1, t.pendingProps = r = o, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Ye = !0);
      else return t.lanes = e.lanes, Rt(e, t, l);
    }
    return li(e, t, n, r, l);
  }
  function na(e, t, n) {
    var r = t.pendingProps, l = r.children, o = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, de(In, rt), rt |= n;
    else {
      if ((n & 1073741824) === 0) return e = o !== null ? o.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, de(In, rt), rt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = o !== null ? o.baseLanes : n, de(In, rt), rt |= r;
    }
    else o !== null ? (r = o.baseLanes | n, t.memoizedState = null) : r = n, de(In, rt), rt |= r;
    return He(e, t, l, n), t.child;
  }
  function ra(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function li(e, t, n, r, l) {
    var o = qe(n) ? Jt : Ue.current;
    return o = kn(t, o), Nn(t, l), n = Yo(e, t, n, r, o, l), r = Go(), e !== null && !Ye ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (ve && r && Io(t), t.flags |= 1, He(e, t, n, l), t.child);
  }
  function la(e, t, n, r, l) {
    if (qe(n)) {
      var o = !0;
      Gr(t);
    } else o = !1;
    if (Nn(t, l), t.stateNode === null) pl(e, t), Ks(t, n, r), ti(t, n, r, l), r = !0;
    else if (e === null) {
      var i = t.stateNode, s = t.memoizedProps;
      i.props = s;
      var c = i.context, y = n.contextType;
      typeof y == "object" && y !== null ? y = it(y) : (y = qe(n) ? Jt : Ue.current, y = kn(t, y));
      var E = n.getDerivedStateFromProps, x = typeof E == "function" || typeof i.getSnapshotBeforeUpdate == "function";
      x || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (s !== r || c !== y) && qs(t, i, r, y), Vt = !1;
      var k = t.memoizedState;
      i.state = k, ll(t, r, i, l), c = t.memoizedState, s !== r || k !== c || Ke.current || Vt ? (typeof E == "function" && (ei(t, n, E, r), c = t.memoizedState), (s = Vt || $s(t, n, s, r, k, c, y)) ? (x || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = c), i.props = r, i.state = c, i.context = y, r = s) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      i = t.stateNode, Ss(e, t), s = t.memoizedProps, y = t.type === t.elementType ? s : pt(t.type, s), i.props = y, x = t.pendingProps, k = i.context, c = n.contextType, typeof c == "object" && c !== null ? c = it(c) : (c = qe(n) ? Jt : Ue.current, c = kn(t, c));
      var D = n.getDerivedStateFromProps;
      (E = typeof D == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (s !== x || k !== c) && qs(t, i, r, c), Vt = !1, k = t.memoizedState, i.state = k, ll(t, r, i, l);
      var U = t.memoizedState;
      s !== x || k !== U || Ke.current || Vt ? (typeof D == "function" && (ei(t, n, D, r), U = t.memoizedState), (y = Vt || $s(t, n, y, r, k, U, c) || !1) ? (E || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(r, U, c), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(r, U, c)), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || s === e.memoizedProps && k === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || s === e.memoizedProps && k === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = U), i.props = r, i.state = U, i.context = c, r = y) : (typeof i.componentDidUpdate != "function" || s === e.memoizedProps && k === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || s === e.memoizedProps && k === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return oi(e, t, n, r, o, l);
  }
  function oi(e, t, n, r, l, o) {
    ra(e, t);
    var i = (t.flags & 128) !== 0;
    if (!r && !i) return l && as(t, n, !1), Rt(e, t, o);
    r = t.stateNode, Uf.current = t;
    var s = i && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && i ? (t.child = xn(t, e.child, null, o), t.child = xn(t, null, s, o)) : He(e, t, s, o), t.memoizedState = r.state, l && as(t, n, !0), t.child;
  }
  function oa(e) {
    var t = e.stateNode;
    t.pendingContext ? us(e, t.pendingContext, t.pendingContext !== t.context) : t.context && us(e, t.context, !1), Bo(e, t.containerInfo);
  }
  function ia(e, t, n, r, l) {
    return Cn(), Do(l), t.flags |= 256, He(e, t, n, r), t.child;
  }
  var ii = { dehydrated: null, treeContext: null, retryLane: 0 };
  function ui(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function ua(e, t, n) {
    var r = t.pendingProps, l = ke.current, o = !1, i = (t.flags & 128) !== 0, s;
    if ((s = i) || (s = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), s ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), de(ke, l & 1), e === null)
      return zo(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (i = r.children, e = r.fallback, o ? (r = t.mode, o = t.child, i = { mode: "hidden", children: i }, (r & 1) === 0 && o !== null ? (o.childLanes = 0, o.pendingProps = i) : o = xl(i, r, 0, null), e = sn(e, r, n, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = ui(n), t.memoizedState = ii, e) : si(t, i));
    if (l = e.memoizedState, l !== null && (s = l.dehydrated, s !== null)) return Vf(e, t, i, r, s, l, n);
    if (o) {
      o = r.fallback, i = t.mode, l = e.child, s = l.sibling;
      var c = { mode: "hidden", children: r.children };
      return (i & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = c, t.deletions = null) : (r = qt(l, c), r.subtreeFlags = l.subtreeFlags & 14680064), s !== null ? o = qt(s, o) : (o = sn(o, i, n, null), o.flags |= 2), o.return = t, r.return = t, r.sibling = o, t.child = r, r = o, o = t.child, i = e.child.memoizedState, i = i === null ? ui(n) : { baseLanes: i.baseLanes | n, cachePool: null, transitions: i.transitions }, o.memoizedState = i, o.childLanes = e.childLanes & ~n, t.memoizedState = ii, r;
    }
    return o = e.child, e = o.sibling, r = qt(o, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function si(e, t) {
    return t = xl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function dl(e, t, n, r) {
    return r !== null && Do(r), xn(t, e.child, null, n), e = si(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function Vf(e, t, n, r, l, o, i) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = ni(Error(u(422))), dl(e, t, i, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = r.fallback, l = t.mode, r = xl({ mode: "visible", children: r.children }, l, 0, null), o = sn(o, l, i, null), o.flags |= 2, r.return = t, o.return = t, r.sibling = o, t.child = r, (t.mode & 1) !== 0 && xn(t, e.child, null, i), t.child.memoizedState = ui(i), t.memoizedState = ii, o);
    if ((t.mode & 1) === 0) return dl(e, t, i, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var s = r.dgst;
      return r = s, o = Error(u(419)), r = ni(o, r, void 0), dl(e, t, i, r);
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
        l = (l & (r.suspendedLanes | i)) !== 0 ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, Pt(e, l), yt(r, e, l, -1));
      }
      return Ci(), r = ni(Error(u(421))), dl(e, t, i, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = bf.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, nt = At(l.nextSibling), tt = t, ve = !0, dt = null, e !== null && (lt[ot++] = Ct, lt[ot++] = xt, lt[ot++] = Zt, Ct = e.id, xt = e.overflow, Zt = t), t = si(t, r.children), t.flags |= 4096, t);
  }
  function sa(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), Uo(e.return, t, n);
  }
  function ai(e, t, n, r, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = l);
  }
  function aa(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, o = r.tail;
    if (He(e, t, r.children, n), r = ke.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && sa(e, n, t);
        else if (e.tag === 19) sa(e, n, t);
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
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), ai(t, !1, l, n, o);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && ol(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        ai(t, !0, n, null, o);
        break;
      case "together":
        ai(t, !1, null, null, void 0);
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
  function Wf(e, t, n) {
    switch (t.tag) {
      case 3:
        oa(t), Cn();
        break;
      case 5:
        Es(t);
        break;
      case 1:
        qe(t.type) && Gr(t);
        break;
      case 4:
        Bo(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        de(tl, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (de(ke, ke.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? ua(e, t, n) : (de(ke, ke.current & 1), e = Rt(e, t, n), e !== null ? e.sibling : null);
        de(ke, ke.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return aa(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), de(ke, ke.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, na(e, t, n);
    }
    return Rt(e, t, n);
  }
  var ca, ci, fa, da;
  ca = function(e, t) {
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
  }, ci = function() {
  }, fa = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, tn(wt.current);
      var o = null;
      switch (n) {
        case "input":
          l = Fl(e, l), r = Fl(e, r), o = [];
          break;
        case "select":
          l = M({}, l, { value: void 0 }), r = M({}, r, { value: void 0 }), o = [];
          break;
        case "textarea":
          l = Wl(e, l), r = Wl(e, r), o = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Kr);
      }
      Ql(n, r);
      var i;
      n = null;
      for (y in l) if (!r.hasOwnProperty(y) && l.hasOwnProperty(y) && l[y] != null) if (y === "style") {
        var s = l[y];
        for (i in s) s.hasOwnProperty(i) && (n || (n = {}), n[i] = "");
      } else y !== "dangerouslySetInnerHTML" && y !== "children" && y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && y !== "autoFocus" && (C.hasOwnProperty(y) ? o || (o = []) : (o = o || []).push(y, null));
      for (y in r) {
        var c = r[y];
        if (s = l?.[y], r.hasOwnProperty(y) && c !== s && (c != null || s != null)) if (y === "style") if (s) {
          for (i in s) !s.hasOwnProperty(i) || c && c.hasOwnProperty(i) || (n || (n = {}), n[i] = "");
          for (i in c) c.hasOwnProperty(i) && s[i] !== c[i] && (n || (n = {}), n[i] = c[i]);
        } else n || (o || (o = []), o.push(
          y,
          n
        )), n = c;
        else y === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, s = s ? s.__html : void 0, c != null && s !== c && (o = o || []).push(y, c)) : y === "children" ? typeof c != "string" && typeof c != "number" || (o = o || []).push(y, "" + c) : y !== "suppressContentEditableWarning" && y !== "suppressHydrationWarning" && (C.hasOwnProperty(y) ? (c != null && y === "onScroll" && pe("scroll", e), o || s === c || (o = [])) : (o = o || []).push(y, c));
      }
      n && (o = o || []).push("style", n);
      var y = o;
      (t.updateQueue = y) && (t.flags |= 4);
    }
  }, da = function(e, t, n, r) {
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
  function Bf(e, t, n) {
    var r = t.pendingProps;
    switch (Oo(t), t.tag) {
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
        return r = t.stateNode, Rn(), me(Ke), me(Ue), $o(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (br(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, dt !== null && (ki(dt), dt = null))), ci(e, t), We(t), null;
      case 5:
        Qo(t);
        var l = tn(ar.current);
        if (n = t.type, e !== null && t.stateNode != null) fa(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
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
                Ki(r, o), pe("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!o.multiple }, pe("invalid", r);
                break;
              case "textarea":
                Gi(r, o), pe("invalid", r);
            }
            Ql(n, o), l = null;
            for (var i in o) if (o.hasOwnProperty(i)) {
              var s = o[i];
              i === "children" ? typeof s == "string" ? r.textContent !== s && (o.suppressHydrationWarning !== !0 && $r(r.textContent, s, e), l = ["children", s]) : typeof s == "number" && r.textContent !== "" + s && (o.suppressHydrationWarning !== !0 && $r(
                r.textContent,
                s,
                e
              ), l = ["children", "" + s]) : C.hasOwnProperty(i) && s != null && i === "onScroll" && pe("scroll", r);
            }
            switch (n) {
              case "input":
                _r(r), Yi(r, o, !0);
                break;
              case "textarea":
                _r(r), Ji(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (r.onclick = Kr);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            i = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Zi(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = i.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = i.createElement(n, { is: r.is }) : (e = i.createElement(n), n === "select" && (i = e, r.multiple ? i.multiple = !0 : r.size && (i.size = r.size))) : e = i.createElementNS(e, n), e[gt] = t, e[lr] = r, ca(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (i = Hl(n, r), n) {
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
                  Ki(e, r), l = Fl(e, r), pe("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = M({}, r, { value: void 0 }), pe("invalid", e);
                  break;
                case "textarea":
                  Gi(e, r), l = Wl(e, r), pe("invalid", e);
                  break;
                default:
                  l = r;
              }
              Ql(n, l), s = l;
              for (o in s) if (s.hasOwnProperty(o)) {
                var c = s[o];
                o === "style" ? tu(e, c) : o === "dangerouslySetInnerHTML" ? (c = c ? c.__html : void 0, c != null && bi(e, c)) : o === "children" ? typeof c == "string" ? (n !== "textarea" || c !== "") && An(e, c) : typeof c == "number" && An(e, "" + c) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (C.hasOwnProperty(o) ? c != null && o === "onScroll" && pe("scroll", e) : c != null && j(e, o, c, i));
              }
              switch (n) {
                case "input":
                  _r(e), Yi(e, r, !1);
                  break;
                case "textarea":
                  _r(e), Ji(e);
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
        if (e && t.stateNode != null) da(e, t, e.memoizedProps, r);
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
          if (ve && nt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) hs(), Cn(), t.flags |= 98560, o = !1;
          else if (o = br(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(u(318));
              if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(u(317));
              o[gt] = t;
            } else Cn(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            We(t), o = !1;
          } else dt !== null && (ki(dt), dt = null), o = !0;
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (ke.current & 1) !== 0 ? Le === 0 && (Le = 3) : Ci())), t.updateQueue !== null && (t.flags |= 4), We(t), null);
      case 4:
        return Rn(), ci(e, t), e === null && nr(t.stateNode.containerInfo), We(t), null;
      case 10:
        return Fo(t.type._context), We(t), null;
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
          o.tail !== null && xe() > On && (t.flags |= 128, r = !0, mr(o, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = ol(i), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), mr(o, !0), o.tail === null && o.tailMode === "hidden" && !i.alternate && !ve) return We(t), null;
          } else 2 * xe() - o.renderingStartTime > On && n !== 1073741824 && (t.flags |= 128, r = !0, mr(o, !1), t.lanes = 4194304);
          o.isBackwards ? (i.sibling = t.child, t.child = i) : (n = o.last, n !== null ? n.sibling = i : t.child = i, o.last = i);
        }
        return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = xe(), t.sibling = null, n = ke.current, de(ke, r ? n & 1 | 2 : n & 1), t) : (We(t), null);
      case 22:
      case 23:
        return Ei(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (rt & 1073741824) !== 0 && (We(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : We(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(u(156, t.tag));
  }
  function Qf(e, t) {
    switch (Oo(t), t.tag) {
      case 1:
        return qe(t.type) && Yr(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Rn(), me(Ke), me(Ue), $o(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Qo(t), null;
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
        return Fo(t.type._context), null;
      case 22:
      case 23:
        return Ei(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var ml = !1, Be = !1, Hf = typeof WeakSet == "function" ? WeakSet : Set, F = null;
  function Tn(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      Ce(e, t, r);
    }
    else n.current = null;
  }
  function fi(e, t, n) {
    try {
      n();
    } catch (r) {
      Ce(e, t, r);
    }
  }
  var pa = !1;
  function $f(e, t) {
    if (Eo = zr, e = $u(), ho(e)) {
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
          var i = 0, s = -1, c = -1, y = 0, E = 0, x = e, k = null;
          t: for (; ; ) {
            for (var D; x !== n || l !== 0 && x.nodeType !== 3 || (s = i + l), x !== o || r !== 0 && x.nodeType !== 3 || (c = i + r), x.nodeType === 3 && (i += x.nodeValue.length), (D = x.firstChild) !== null; )
              k = x, x = D;
            for (; ; ) {
              if (x === e) break t;
              if (k === n && ++y === l && (s = i), k === o && ++E === r && (c = i), (D = x.nextSibling) !== null) break;
              x = k, k = x.parentNode;
            }
            x = D;
          }
          n = s === -1 || c === -1 ? null : { start: s, end: c };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (Co = { focusedElem: e, selectionRange: n }, zr = !1, F = t; F !== null; ) if (t = F, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, F = e;
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
              var W = U.memoizedProps, Pe = U.memoizedState, m = t.stateNode, d = m.getSnapshotBeforeUpdate(t.elementType === t.type ? W : pt(t.type, W), Pe);
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
        Ce(t, t.return, L);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, F = e;
        break;
      }
      F = t.return;
    }
    return U = pa, pa = !1, U;
  }
  function hr(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          l.destroy = void 0, o !== void 0 && fi(t, n, o);
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
  function di(e) {
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
  function ma(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, ma(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[gt], delete t[lr], delete t[Ro], delete t[Nf], delete t[Rf])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function ha(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function ya(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || ha(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function pi(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Kr));
    else if (r !== 4 && (e = e.child, e !== null)) for (pi(e, t, n), e = e.sibling; e !== null; ) pi(e, t, n), e = e.sibling;
  }
  function mi(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (mi(e, t, n), e = e.sibling; e !== null; ) mi(e, t, n), e = e.sibling;
  }
  var ze = null, mt = !1;
  function Bt(e, t, n) {
    for (n = n.child; n !== null; ) va(e, t, n), n = n.sibling;
  }
  function va(e, t, n) {
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
            o = o.tag, i !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && fi(n, t, i), l = l.next;
          } while (l !== r);
        }
        Bt(e, t, n);
        break;
      case 1:
        if (!Be && (Tn(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (s) {
          Ce(n, t, s);
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
  function ga(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new Hf()), t.forEach(function(r) {
        var l = ed.bind(null, e, r);
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
        va(o, i, l), ze = null, mt = !1;
        var c = l.alternate;
        c !== null && (c.return = null), l.return = null;
      } catch (y) {
        Ce(l, t, y);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) wa(t, e), t = t.sibling;
  }
  function wa(e, t) {
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
            Ce(e, e.return, W);
          }
          try {
            hr(5, e, e.return);
          } catch (W) {
            Ce(e, e.return, W);
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
            Ce(e, e.return, W);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var o = e.memoizedProps, i = n !== null ? n.memoizedProps : o, s = e.type, c = e.updateQueue;
          if (e.updateQueue = null, c !== null) try {
            s === "input" && o.type === "radio" && o.name != null && qi(l, o), Hl(s, i);
            var y = Hl(s, o);
            for (i = 0; i < c.length; i += 2) {
              var E = c[i], x = c[i + 1];
              E === "style" ? tu(l, x) : E === "dangerouslySetInnerHTML" ? bi(l, x) : E === "children" ? An(l, x) : j(l, E, x, y);
            }
            switch (s) {
              case "input":
                Ul(l, o);
                break;
              case "textarea":
                Xi(l, o);
                break;
              case "select":
                var k = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!o.multiple;
                var D = o.value;
                D != null ? an(l, !!o.multiple, D, !1) : k !== !!o.multiple && (o.defaultValue != null ? an(
                  l,
                  !!o.multiple,
                  o.defaultValue,
                  !0
                ) : an(l, !!o.multiple, o.multiple ? [] : "", !1));
            }
            l[lr] = o;
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
          qn(t.containerInfo);
        } catch (W) {
          Ce(e, e.return, W);
        }
        break;
      case 4:
        ht(t, e), kt(e);
        break;
      case 13:
        ht(t, e), kt(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (vi = xe())), r & 4 && ga(e);
        break;
      case 22:
        if (E = n !== null && n.memoizedState !== null, e.mode & 1 ? (Be = (y = Be) || E, ht(t, e), Be = y) : ht(t, e), kt(e), r & 8192) {
          if (y = e.memoizedState !== null, (e.stateNode.isHidden = y) && !E && (e.mode & 1) !== 0) for (F = e, E = e.child; E !== null; ) {
            for (x = F = E; F !== null; ) {
              switch (k = F, D = k.child, k.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  hr(4, k, k.return);
                  break;
                case 1:
                  Tn(k, k.return);
                  var U = k.stateNode;
                  if (typeof U.componentWillUnmount == "function") {
                    r = k, n = k.return;
                    try {
                      t = r, U.props = t.memoizedProps, U.state = t.memoizedState, U.componentWillUnmount();
                    } catch (W) {
                      Ce(r, n, W);
                    }
                  }
                  break;
                case 5:
                  Tn(k, k.return);
                  break;
                case 22:
                  if (k.memoizedState !== null) {
                    _a(x);
                    continue;
                  }
              }
              D !== null ? (D.return = k, F = D) : _a(x);
            }
            E = E.sibling;
          }
          e: for (E = null, x = e; ; ) {
            if (x.tag === 5) {
              if (E === null) {
                E = x;
                try {
                  l = x.stateNode, y ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (s = x.stateNode, c = x.memoizedProps.style, i = c != null && c.hasOwnProperty("display") ? c.display : null, s.style.display = eu("display", i));
                } catch (W) {
                  Ce(e, e.return, W);
                }
              }
            } else if (x.tag === 6) {
              if (E === null) try {
                x.stateNode.nodeValue = y ? "" : x.memoizedProps;
              } catch (W) {
                Ce(e, e.return, W);
              }
            } else if ((x.tag !== 22 && x.tag !== 23 || x.memoizedState === null || x === e) && x.child !== null) {
              x.child.return = x, x = x.child;
              continue;
            }
            if (x === e) break e;
            for (; x.sibling === null; ) {
              if (x.return === null || x.return === e) break e;
              E === x && (E = null), x = x.return;
            }
            E === x && (E = null), x.sibling.return = x.return, x = x.sibling;
          }
        }
        break;
      case 19:
        ht(t, e), kt(e), r & 4 && ga(e);
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
            if (ha(n)) {
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
            var o = ya(e);
            mi(e, o, l);
            break;
          case 3:
          case 4:
            var i = r.stateNode.containerInfo, s = ya(e);
            pi(e, s, i);
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
  function Kf(e, t, n) {
    F = e, Sa(e);
  }
  function Sa(e, t, n) {
    for (var r = (e.mode & 1) !== 0; F !== null; ) {
      var l = F, o = l.child;
      if (l.tag === 22 && r) {
        var i = l.memoizedState !== null || ml;
        if (!i) {
          var s = l.alternate, c = s !== null && s.memoizedState !== null || Be;
          s = ml;
          var y = Be;
          if (ml = i, (Be = c) && !y) for (F = l; F !== null; ) i = F, c = i.child, i.tag === 22 && i.memoizedState !== null ? Ea(l) : c !== null ? (c.return = i, F = c) : Ea(l);
          for (; o !== null; ) F = o, Sa(o), o = o.sibling;
          F = l, ml = s, Be = y;
        }
        ka(e);
      } else (l.subtreeFlags & 8772) !== 0 && o !== null ? (o.return = l, F = o) : ka(e);
    }
  }
  function ka(e) {
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
              o !== null && _s(t, o, r);
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
                _s(t, i, n);
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
                    var x = E.dehydrated;
                    x !== null && qn(x);
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
          Be || t.flags & 512 && di(t);
        } catch (k) {
          Ce(t, t.return, k);
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
  function _a(e) {
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
  function Ea(e) {
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
              di(t);
            } catch (c) {
              Ce(t, o, c);
            }
            break;
          case 5:
            var i = t.return;
            try {
              di(t);
            } catch (c) {
              Ce(t, i, c);
            }
        }
      } catch (c) {
        Ce(t, t.return, c);
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
  var qf = Math.ceil, yl = ce.ReactCurrentDispatcher, hi = ce.ReactCurrentOwner, st = ce.ReactCurrentBatchConfig, le = 0, Ie = null, Ne = null, De = 0, rt = 0, In = Mt(0), Le = 0, yr = null, rn = 0, vl = 0, yi = 0, vr = null, Ge = null, vi = 0, On = 1 / 0, Lt = null, gl = !1, gi = null, Qt = null, wl = !1, Ht = null, Sl = 0, gr = 0, wi = null, kl = -1, _l = 0;
  function $e() {
    return (le & 6) !== 0 ? xe() : kl !== -1 ? kl : kl = xe();
  }
  function $t(e) {
    return (e.mode & 1) === 0 ? 1 : (le & 2) !== 0 && De !== 0 ? De & -De : Tf.transition !== null ? (_l === 0 && (_l = yu()), _l) : (e = ae, e !== 0 || (e = window.event, e = e === void 0 ? 16 : xu(e.type)), e);
  }
  function yt(e, t, n, r) {
    if (50 < gr) throw gr = 0, wi = null, Error(u(185));
    Bn(e, n, r), ((le & 2) === 0 || e !== Ie) && (e === Ie && ((le & 2) === 0 && (vl |= n), Le === 4 && Kt(e, De)), Xe(e, r), n === 1 && le === 0 && (t.mode & 1) === 0 && (On = xe() + 500, Xr && Ut()));
  }
  function Xe(e, t) {
    var n = e.callbackNode;
    Lc(e, t);
    var r = Ir(e, e === Ie ? De : 0);
    if (r === 0) n !== null && pu(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && pu(n), t === 1) e.tag === 0 ? Lf(xa.bind(null, e)) : cs(xa.bind(null, e)), xf(function() {
        (le & 6) === 0 && Ut();
      }), n = null;
      else {
        switch (vu(r)) {
          case 1:
            n = Jl;
            break;
          case 4:
            n = mu;
            break;
          case 16:
            n = Nr;
            break;
          case 536870912:
            n = hu;
            break;
          default:
            n = Nr;
        }
        n = ja(n, Ca.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function Ca(e, t) {
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
      (Ie !== e || De !== t) && (Lt = null, On = xe() + 500, on(e, t));
      do
        try {
          Xf();
          break;
        } catch (s) {
          Pa(e, s);
        }
      while (!0);
      Mo(), yl.current = o, le = l, Ne !== null ? t = 0 : (Ie = null, De = 0, t = Le);
    }
    if (t !== 0) {
      if (t === 2 && (l = Zl(e), l !== 0 && (r = l, t = Si(e, l))), t === 1) throw n = yr, on(e, 0), Kt(e, r), Xe(e, xe()), n;
      if (t === 6) Kt(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !Yf(l) && (t = El(e, r), t === 2 && (o = Zl(e), o !== 0 && (r = o, t = Si(e, o))), t === 1)) throw n = yr, on(e, 0), Kt(e, r), Xe(e, xe()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(u(345));
          case 2:
            un(e, Ge, Lt);
            break;
          case 3:
            if (Kt(e, r), (r & 130023424) === r && (t = vi + 500 - xe(), 10 < t)) {
              if (Ir(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                $e(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = Po(un.bind(null, e, Ge, Lt), t);
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
            if (r = l, r = xe() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * qf(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = Po(un.bind(null, e, Ge, Lt), r);
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
    return Xe(e, xe()), e.callbackNode === n ? Ca.bind(null, e) : null;
  }
  function Si(e, t) {
    var n = vr;
    return e.current.memoizedState.isDehydrated && (on(e, t).flags |= 256), e = El(e, t), e !== 2 && (t = Ge, Ge = n, t !== null && ki(t)), e;
  }
  function ki(e) {
    Ge === null ? Ge = e : Ge.push.apply(Ge, e);
  }
  function Yf(e) {
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
    for (t &= ~yi, t &= ~vl, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - ct(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function xa(e) {
    if ((le & 6) !== 0) throw Error(u(327));
    jn();
    var t = Ir(e, 0);
    if ((t & 1) === 0) return Xe(e, xe()), null;
    var n = El(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = Zl(e);
      r !== 0 && (t = r, n = Si(e, r));
    }
    if (n === 1) throw n = yr, on(e, 0), Kt(e, t), Xe(e, xe()), n;
    if (n === 6) throw Error(u(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, un(e, Ge, Lt), Xe(e, xe()), null;
  }
  function _i(e, t) {
    var n = le;
    le |= 1;
    try {
      return e(t);
    } finally {
      le = n, le === 0 && (On = xe() + 500, Xr && Ut());
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
  function Ei() {
    rt = In.current, me(In);
  }
  function on(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Cf(n)), Ne !== null) for (n = Ne.return; n !== null; ) {
      var r = n;
      switch (Oo(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && Yr();
          break;
        case 3:
          Rn(), me(Ke), me(Ue), $o();
          break;
        case 5:
          Qo(r);
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
          Fo(r.type._context);
          break;
        case 22:
        case 23:
          Ei();
      }
      n = n.return;
    }
    if (Ie = e, Ne = e = qt(e.current, null), De = rt = t, Le = 0, yr = null, yi = vl = rn = 0, Ge = vr = null, en !== null) {
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
  function Pa(e, t) {
    do {
      var n = Ne;
      try {
        if (Mo(), il.current = cl, ul) {
          for (var r = _e.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          ul = !1;
        }
        if (nn = 0, Te = Re = _e = null, cr = !1, fr = 0, hi.current = null, n === null || n.return === null) {
          Le = 1, yr = t, Ne = null;
          break;
        }
        e: {
          var o = e, i = n.return, s = n, c = t;
          if (t = De, s.flags |= 32768, c !== null && typeof c == "object" && typeof c.then == "function") {
            var y = c, E = s, x = E.tag;
            if ((E.mode & 1) === 0 && (x === 0 || x === 11 || x === 15)) {
              var k = E.alternate;
              k ? (E.updateQueue = k.updateQueue, E.memoizedState = k.memoizedState, E.lanes = k.lanes) : (E.updateQueue = null, E.memoizedState = null);
            }
            var D = Js(i);
            if (D !== null) {
              D.flags &= -257, Zs(D, i, s, o, t), D.mode & 1 && Xs(o, y, t), t = D, c = y;
              var U = t.updateQueue;
              if (U === null) {
                var W = /* @__PURE__ */ new Set();
                W.add(c), t.updateQueue = W;
              } else U.add(c);
              break e;
            } else {
              if ((t & 1) === 0) {
                Xs(o, y, t), Ci();
                break e;
              }
              c = Error(u(426));
            }
          } else if (ve && s.mode & 1) {
            var Pe = Js(i);
            if (Pe !== null) {
              (Pe.flags & 65536) === 0 && (Pe.flags |= 256), Zs(Pe, i, s, o, t), Do(Ln(c, s));
              break e;
            }
          }
          o = c = Ln(c, s), Le !== 4 && (Le = 2), vr === null ? vr = [o] : vr.push(o), o = i;
          do {
            switch (o.tag) {
              case 3:
                o.flags |= 65536, t &= -t, o.lanes |= t;
                var m = Ys(o, c, t);
                ks(o, m);
                break e;
              case 1:
                s = c;
                var d = o.type, h = o.stateNode;
                if ((o.flags & 128) === 0 && (typeof d.getDerivedStateFromError == "function" || h !== null && typeof h.componentDidCatch == "function" && (Qt === null || !Qt.has(h)))) {
                  o.flags |= 65536, t &= -t, o.lanes |= t;
                  var L = Gs(o, s, t);
                  ks(o, L);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        La(n);
      } catch (B) {
        t = B, Ne === n && n !== null && (Ne = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Na() {
    var e = yl.current;
    return yl.current = cl, e === null ? cl : e;
  }
  function Ci() {
    (Le === 0 || Le === 3 || Le === 2) && (Le = 4), Ie === null || (rn & 268435455) === 0 && (vl & 268435455) === 0 || Kt(Ie, De);
  }
  function El(e, t) {
    var n = le;
    le |= 2;
    var r = Na();
    (Ie !== e || De !== t) && (Lt = null, on(e, t));
    do
      try {
        Gf();
        break;
      } catch (l) {
        Pa(e, l);
      }
    while (!0);
    if (Mo(), le = n, yl.current = r, Ne !== null) throw Error(u(261));
    return Ie = null, De = 0, Le;
  }
  function Gf() {
    for (; Ne !== null; ) Ra(Ne);
  }
  function Xf() {
    for (; Ne !== null && !Sc(); ) Ra(Ne);
  }
  function Ra(e) {
    var t = Oa(e.alternate, e, rt);
    e.memoizedProps = e.pendingProps, t === null ? La(e) : Ne = t, hi.current = null;
  }
  function La(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = Bf(n, t, rt), n !== null) {
          Ne = n;
          return;
        }
      } else {
        if (n = Qf(n, t), n !== null) {
          n.flags &= 32767, Ne = n;
          return;
        }
        if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;
        else {
          Le = 6, Ne = null;
          return;
        }
      }
      if (t = t.sibling, t !== null) {
        Ne = t;
        return;
      }
      Ne = t = e;
    } while (t !== null);
    Le === 0 && (Le = 5);
  }
  function un(e, t, n) {
    var r = ae, l = st.transition;
    try {
      st.transition = null, ae = 1, Jf(e, t, n, r);
    } finally {
      st.transition = l, ae = r;
    }
    return null;
  }
  function Jf(e, t, n, r) {
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
    if (Tc(e, o), e === Ie && (Ne = Ie = null, De = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || wl || (wl = !0, ja(Nr, function() {
      return jn(), null;
    })), o = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || o) {
      o = st.transition, st.transition = null;
      var i = ae;
      ae = 1;
      var s = le;
      le |= 4, hi.current = null, $f(e, n), wa(n, e), vf(Co), zr = !!Eo, Co = Eo = null, e.current = n, Kf(n), kc(), le = s, ae = i, st.transition = o;
    } else e.current = n;
    if (wl && (wl = !1, Ht = e, Sl = l), o = e.pendingLanes, o === 0 && (Qt = null), Cc(n.stateNode), Xe(e, xe()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (gl) throw gl = !1, e = gi, gi = null, e;
    return (Sl & 1) !== 0 && e.tag !== 0 && jn(), o = e.pendingLanes, (o & 1) !== 0 ? e === wi ? gr++ : (gr = 0, wi = e) : gr = 0, Ut(), null;
  }
  function jn() {
    if (Ht !== null) {
      var e = vu(Sl), t = st.transition, n = ae;
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
                    var E = F;
                    switch (E.tag) {
                      case 0:
                      case 11:
                      case 15:
                        hr(8, E, o);
                    }
                    var x = E.child;
                    if (x !== null) x.return = E, F = x;
                    else for (; F !== null; ) {
                      E = F;
                      var k = E.sibling, D = E.return;
                      if (ma(E), E === y) {
                        F = null;
                        break;
                      }
                      if (k !== null) {
                        k.return = D, F = k;
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
                      var Pe = W.sibling;
                      W.sibling = null, W = Pe;
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
                Ce(s, s.return, B);
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
  function Ta(e, t, n) {
    t = Ln(n, t), t = Ys(e, t, 1), e = Wt(e, t, 1), t = $e(), e !== null && (Bn(e, 1, t), Xe(e, t));
  }
  function Ce(e, t, n) {
    if (e.tag === 3) Ta(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Ta(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Qt === null || !Qt.has(r))) {
          e = Ln(n, e), e = Gs(t, e, 1), t = Wt(t, e, 1), e = $e(), t !== null && (Bn(t, 1, e), Xe(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function Zf(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = $e(), e.pingedLanes |= e.suspendedLanes & n, Ie === e && (De & n) === n && (Le === 4 || Le === 3 && (De & 130023424) === De && 500 > xe() - vi ? on(e, 0) : yi |= n), Xe(e, t);
  }
  function Ia(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = Tr, Tr <<= 1, (Tr & 130023424) === 0 && (Tr = 4194304)));
    var n = $e();
    e = Pt(e, t), e !== null && (Bn(e, t, n), Xe(e, n));
  }
  function bf(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), Ia(e, n);
  }
  function ed(e, t) {
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
    r !== null && r.delete(t), Ia(e, n);
  }
  var Oa;
  Oa = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Ke.current) Ye = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Ye = !1, Wf(e, t, n);
      Ye = (e.flags & 131072) !== 0;
    }
    else Ye = !1, ve && (t.flags & 1048576) !== 0 && fs(t, Zr, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        pl(e, t), e = t.pendingProps;
        var l = kn(t, Ue.current);
        Nn(t, n), l = Yo(null, t, r, e, l, n);
        var o = Go();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, qe(r) ? (o = !0, Gr(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Wo(t), l.updater = fl, t.stateNode = l, l._reactInternals = t, ti(t, r, e, n), t = oi(null, t, r, !0, o, n)) : (t.tag = 0, ve && o && Io(t), He(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (pl(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = nd(r), e = pt(r, e), l) {
            case 0:
              t = li(null, t, r, e, n);
              break e;
            case 1:
              t = la(null, t, r, e, n);
              break e;
            case 11:
              t = bs(null, t, r, e, n);
              break e;
            case 14:
              t = ea(null, t, r, pt(r.type, e), n);
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
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pt(r, l), li(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pt(r, l), la(e, t, r, l, n);
      case 3:
        e: {
          if (oa(t), e === null) throw Error(u(387));
          r = t.pendingProps, o = t.memoizedState, l = o.element, Ss(e, t), ll(t, r, null, n);
          var i = t.memoizedState;
          if (r = i.element, o.isDehydrated) if (o = { element: r, isDehydrated: !1, cache: i.cache, pendingSuspenseBoundaries: i.pendingSuspenseBoundaries, transitions: i.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
            l = Ln(Error(u(423)), t), t = ia(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = Ln(Error(u(424)), t), t = ia(e, t, r, n, l);
            break e;
          } else for (nt = At(t.stateNode.containerInfo.firstChild), tt = t, ve = !0, dt = null, n = gs(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
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
        return Es(t), e === null && zo(t), r = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, i = l.children, xo(r, l) ? i = null : o !== null && xo(r, o) && (t.flags |= 32), ra(e, t), He(e, t, i, n), t.child;
      case 6:
        return e === null && zo(t), null;
      case 13:
        return ua(e, t, n);
      case 4:
        return Bo(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = xn(t, null, r, n) : He(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pt(r, l), bs(e, t, r, l, n);
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
                    c = Nt(-1, n & -n), c.tag = 2;
                    var y = o.updateQueue;
                    if (y !== null) {
                      y = y.shared;
                      var E = y.pending;
                      E === null ? c.next = c : (c.next = E.next, E.next = c), y.pending = c;
                    }
                  }
                  o.lanes |= n, c = o.alternate, c !== null && (c.lanes |= n), Uo(
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
              i.lanes |= n, s = i.alternate, s !== null && (s.lanes |= n), Uo(i, n, t), i = o.sibling;
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
        return l = t.type, r = t.pendingProps.children, Nn(t, n), l = it(l), r = r(l), t.flags |= 1, He(e, t, r, n), t.child;
      case 14:
        return r = t.type, l = pt(r, t.pendingProps), l = pt(r.type, l), ea(e, t, r, l, n);
      case 15:
        return ta(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : pt(r, l), pl(e, t), t.tag = 1, qe(r) ? (e = !0, Gr(t)) : e = !1, Nn(t, n), Ks(t, r, l), ti(t, r, l, n), oi(null, t, r, !0, e, n);
      case 19:
        return aa(e, t, n);
      case 22:
        return na(e, t, n);
    }
    throw Error(u(156, t.tag));
  };
  function ja(e, t) {
    return du(e, t);
  }
  function td(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function at(e, t, n, r) {
    return new td(e, t, n, r);
  }
  function xi(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function nd(e) {
    if (typeof e == "function") return xi(e) ? 1 : 0;
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
    if (r = e, typeof e == "function") xi(e) && (i = 1);
    else if (typeof e == "string") i = 5;
    else e: switch (e) {
      case Ee:
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
  function Pi(e, t, n) {
    return e = at(6, e, null, t), e.lanes = n, e;
  }
  function Ni(e, t, n) {
    return t = at(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function rd(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = bl(0), this.expirationTimes = bl(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = bl(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Ri(e, t, n, r, l, o, i, s, c) {
    return e = new rd(e, t, n, s, c), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = at(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Wo(o), e;
  }
  function ld(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: oe, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function za(e) {
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
      if (qe(n)) return ss(e, n, t);
    }
    return t;
  }
  function Da(e, t, n, r, l, o, i, s, c) {
    return e = Ri(n, r, !0, e, l, o, i, s, c), e.context = za(null), n = e.current, r = $e(), l = $t(n), o = Nt(r, l), o.callback = t ?? null, Wt(n, o, l), e.current.lanes = l, Bn(e, l, r), Xe(e, r), e;
  }
  function Pl(e, t, n, r) {
    var l = t.current, o = $e(), i = $t(l);
    return n = za(n), t.context === null ? t.context = n : t.pendingContext = n, t = Nt(o, i), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Wt(l, t, i), e !== null && (yt(e, l, i, o), rl(e, l, i)), i;
  }
  function Nl(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Aa(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Li(e, t) {
    Aa(e, t), (e = e.alternate) && Aa(e, t);
  }
  function od() {
    return null;
  }
  var Ma = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Ti(e) {
    this._internalRoot = e;
  }
  Rl.prototype.render = Ti.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(u(409));
    Pl(e, t, null, null);
  }, Rl.prototype.unmount = Ti.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      ln(function() {
        Pl(null, e, null, null);
      }), t[_t] = null;
    }
  };
  function Rl(e) {
    this._internalRoot = e;
  }
  Rl.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Su();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < jt.length && t !== 0 && t < jt[n].priority; n++) ;
      jt.splice(n, 0, e), n === 0 && Eu(e);
    }
  };
  function Ii(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Ll(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function Fa() {
  }
  function id(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var o = r;
        r = function() {
          var y = Nl(i);
          o.call(y);
        };
      }
      var i = Da(t, r, e, 0, null, !1, !1, "", Fa);
      return e._reactRootContainer = i, e[_t] = i.current, nr(e.nodeType === 8 ? e.parentNode : e), ln(), i;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var s = r;
      r = function() {
        var y = Nl(c);
        s.call(y);
      };
    }
    var c = Ri(e, 0, !1, null, null, !1, !1, "", Fa);
    return e._reactRootContainer = c, e[_t] = c.current, nr(e.nodeType === 8 ? e.parentNode : e), ln(function() {
      Pl(t, c, n, r);
    }), c;
  }
  function Tl(e, t, n, r, l) {
    var o = n._reactRootContainer;
    if (o) {
      var i = o;
      if (typeof l == "function") {
        var s = l;
        l = function() {
          var c = Nl(i);
          s.call(c);
        };
      }
      Pl(t, i, e, l);
    } else i = id(n, t, e, l, r);
    return Nl(i);
  }
  gu = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = Wn(t.pendingLanes);
          n !== 0 && (eo(t, n | 1), Xe(t, xe()), (le & 6) === 0 && (On = xe() + 500, Ut()));
        }
        break;
      case 13:
        ln(function() {
          var r = Pt(e, 1);
          if (r !== null) {
            var l = $e();
            yt(r, e, 1, l);
          }
        }), Li(e, 1);
    }
  }, to = function(e) {
    if (e.tag === 13) {
      var t = Pt(e, 134217728);
      if (t !== null) {
        var n = $e();
        yt(t, e, 134217728, n);
      }
      Li(e, 134217728);
    }
  }, wu = function(e) {
    if (e.tag === 13) {
      var t = $t(e), n = Pt(e, t);
      if (n !== null) {
        var r = $e();
        yt(n, e, t, r);
      }
      Li(e, t);
    }
  }, Su = function() {
    return ae;
  }, ku = function(e, t) {
    var n = ae;
    try {
      return ae = e, t();
    } finally {
      ae = n;
    }
  }, ql = function(e, t, n) {
    switch (t) {
      case "input":
        if (Ul(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = qr(r);
              if (!l) throw Error(u(90));
              $i(r), Ul(r, l);
            }
          }
        }
        break;
      case "textarea":
        Xi(e, n);
        break;
      case "select":
        t = n.value, t != null && an(e, !!n.multiple, t, !1);
    }
  }, ou = _i, iu = ln;
  var ud = { usingClientEntryPoint: !1, Events: [or, wn, qr, ru, lu, _i] }, wr = { findFiberByHostInstance: Xt, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, sd = { bundleType: wr.bundleType, version: wr.version, rendererPackageName: wr.rendererPackageName, rendererConfig: wr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ce.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = cu(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: wr.findFiberByHostInstance || od, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Il = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Il.isDisabled && Il.supportsFiber) try {
      Rr = Il.inject(sd), vt = Il;
    } catch {
    }
  }
  return Je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ud, Je.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Ii(t)) throw Error(u(200));
    return ld(e, t, null, n);
  }, Je.createRoot = function(e, t) {
    if (!Ii(e)) throw Error(u(299));
    var n = !1, r = "", l = Ma;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Ri(e, 1, !1, null, null, n, !1, r, l), e[_t] = t.current, nr(e.nodeType === 8 ? e.parentNode : e), new Ti(t);
  }, Je.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(u(188)) : (e = Object.keys(e).join(","), Error(u(268, e)));
    return e = cu(t), e = e === null ? null : e.stateNode, e;
  }, Je.flushSync = function(e) {
    return ln(e);
  }, Je.hydrate = function(e, t, n) {
    if (!Ll(t)) throw Error(u(200));
    return Tl(null, e, t, !0, n);
  }, Je.hydrateRoot = function(e, t, n) {
    if (!Ii(e)) throw Error(u(405));
    var r = n != null && n.hydratedSources || null, l = !1, o = "", i = Ma;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onRecoverableError !== void 0 && (i = n.onRecoverableError)), t = Da(t, null, e, 1, n ?? null, l, !1, o, i), e[_t] = t.current, nr(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
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
  }, Je.unstable_batchedUpdates = _i, Je.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Ll(n)) throw Error(u(200));
    if (e == null || e._reactInternals === void 0) throw Error(u(38));
    return Tl(e, t, n, !1, r);
  }, Je.version = "18.3.1-next-f1338f8080-20240426", Je;
}
var Ka;
function yd() {
  if (Ka) return zi.exports;
  Ka = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (p) {
        console.error(p);
      }
  }
  return a(), zi.exports = /* @__PURE__ */ hd(), zi.exports;
}
var qa;
function vd() {
  if (qa) return Ol;
  qa = 1;
  var a = /* @__PURE__ */ yd();
  return Ol.createRoot = a.createRoot, Ol.hydrateRoot = a.hydrateRoot, Ol;
}
var gd = /* @__PURE__ */ vd(), je = /* @__PURE__ */ Hi();
const jl = /* @__PURE__ */ sc(je), Ya = (a) => {
  let p;
  const u = /* @__PURE__ */ new Set(), v = (T, z) => {
    const S = typeof T == "function" ? T(p) : T;
    if (!Object.is(S, p)) {
      const V = p;
      p = z ?? (typeof S != "object" || S === null) ? S : Object.assign({}, p, S), u.forEach((X) => X(p, V));
    }
  }, C = () => p, O = { setState: v, getState: C, getInitialState: () => P, subscribe: (T) => (u.add(T), () => u.delete(T)) }, P = p = a(v, C, O);
  return O;
}, wd = ((a) => a ? Ya(a) : Ya), Sd = (a) => a;
function kd(a, p = Sd) {
  const u = jl.useSyncExternalStore(
    a.subscribe,
    jl.useCallback(() => p(a.getState()), [a, p]),
    jl.useCallback(() => p(a.getInitialState()), [a, p])
  );
  return jl.useDebugValue(u), u;
}
const Ga = (a) => {
  const p = wd(a), u = (v) => kd(p, v);
  return Object.assign(u, p), u;
}, _d = ((a) => a ? Ga(a) : Ga);
function Ed() {
  const a = new URLSearchParams(window.location.search), p = {};
  for (const [u, v] of a)
    u.includes(".") && (p[u] = v);
  return p;
}
function Cd(a) {
  const p = new URL(window.location.href);
  for (const u of [...p.searchParams.keys()])
    u.includes(".") && p.searchParams.delete(u);
  for (const [u, v] of Object.entries(a))
    v && p.searchParams.set(u, v);
  window.history.replaceState(null, "", p.toString());
}
function xd(a) {
  let p = typeof window < "u" && window.Shopify?.routes?.root || a || "/";
  return p.endsWith("/") || (p += "/"), p + "cart/add.js";
}
async function Pd(a, p) {
  const u = xd(a), v = await fetch(u, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ items: p })
  });
  let C = null;
  try {
    C = await v.json();
  } catch {
  }
  if (!v.ok) {
    const R = C?.description || C?.message || `Add to cart failed (HTTP ${v.status})`, _ = new Error(R);
    throw _.status = v.status, _.payload = C, _;
  }
  return C;
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
const Qi = "calma_preorder_intent";
function Rd() {
  if (typeof window > "u") return null;
  if (window.CalmaPreorderIntent && typeof window.CalmaPreorderIntent.get == "function")
    try {
      return window.CalmaPreorderIntent.get();
    } catch {
    }
  try {
    const a = window.localStorage?.getItem(Qi);
    if (!a) return null;
    const p = JSON.parse(a);
    return !p || typeof p.expiresAt != "number" || Date.now() > p.expiresAt ? (window.localStorage.removeItem(Qi), null) : p;
  } catch {
    return null;
  }
}
function Ld() {
  if (!(typeof window > "u")) {
    if (window.CalmaPreorderIntent && typeof window.CalmaPreorderIntent.clear == "function")
      try {
        window.CalmaPreorderIntent.clear();
        return;
      } catch {
      }
    try {
      window.localStorage?.removeItem(Qi);
    } catch {
    }
  }
}
function Td() {
  if (typeof window > "u") return null;
  if (window.SHOPIFY_CUSTOMER_ID) return String(window.SHOPIFY_CUSTOMER_ID);
  const a = window.ShopifyAnalytics?.meta?.page?.customerId;
  return a != null ? String(a) : null;
}
const Id = "/apps/b2b-portal/preorder/add-line";
async function Od(a) {
  const p = await fetch(Id, {
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
let zn = null, Mi = null, Fi = /* @__PURE__ */ new Map();
function Al(a) {
  const p = (a || "").toUpperCase();
  return p.includes("DUVAR") ? "WALL" : p.includes("MASA") ? "TABLE" : p.includes("HALI") ? "FLOOR" : p.includes("TAVAN") || p.includes("SPRINKLER") ? "CEILING" : p.includes("MONITOR") || p.includes("EKRAN") || p.includes("SCREEN") ? "SCREEN MOUNT" : "GENERAL";
}
const Ml = [
  "GENERAL",
  "WALL",
  "TABLE",
  "SCREEN MOUNT",
  "CEILING",
  "FLOOR"
], jd = [
  "[Character]NRUS_DOSEME_SERI_DUVAR",
  "[Character]NRUS_DOSEME_RENK_DUVAR",
  "[Character]NRUS_YUZEY_RENK_DUVAR",
  "[Character]NRUS_KECE_RENK_DUVAR",
  "[Character]NRUS_YUZEY_RENK_MASA",
  "[Character]NRUS_HALI_RENK",
  "[Character]NRUS_KOLTUK",
  "[Character]NRUS_PRIZ_TIPI",
  "[Character]NRUS_MEDIAWALL"
], zd = /* @__PURE__ */ new Set([
  "[Character]NRUS_Meta_Dimension",
  "[Character]NRUS_GGRACHAIR"
]), ac = [
  {
    id: "[Character]NRUS_GGRACHAIR",
    propLabel: "STOOL OPTION",
    value: "chair_no",
    displayLabel: "NO"
  }
];
async function Xa(a) {
  if (!Array.isArray(a)) return [];
  const p = a.filter(
    (R) => R.visible !== !1 && R.editable !== !1 && R.choiceList && !zd.has(R.key)
  ), u = await Promise.all(
    p.map(
      (R) => typeof R.getChoices == "function" ? R.getChoices().catch(() => []) : Promise.resolve([])
    )
  ), v = p.map((R, _) => {
    const O = u[_] || [], P = typeof R.getValue == "function" ? R.getValue() : null;
    return {
      id: R.key,
      label: R.name,
      type: O.some((T) => T.largeIcon || T.smallIcon) ? "color" : "text",
      editable: !0,
      currentValue: P?.value ?? null,
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
  }), C = new Map(jd.map((R, _) => [R, _]));
  return v.sort((R, _) => {
    const O = C.has(R.id) ? C.get(R.id) : 1 / 0, P = C.has(_.id) ? C.get(_.id) : 1 / 0;
    return O !== P ? O - P : 0;
  });
}
async function Ui(a) {
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
async function Ja(a) {
  if (!Array.isArray(a)) return [];
  const p = await Promise.all(
    a.map(
      (u) => u.choiceList && typeof u.getChoices == "function" ? u.getChoices().catch(() => []) : Promise.resolve([])
    )
  );
  return a.map((u, v) => {
    const C = p[v] || [], R = typeof u.getValue == "function" ? u.getValue() : null;
    return {
      id: u.key,
      label: u.name,
      type: C.some((_) => _.largeIcon || _.smallIcon) ? "color" : "text",
      editable: !!u.editable,
      currentValue: R?.value ?? null,
      options: C.map((_) => ({
        value: _.value,
        label: _.text,
        icon: _.smallIcon || _.largeIcon || null,
        available: _.selectable !== !1
      }))
    };
  });
}
function Za(a) {
  return Array.isArray(a) ? a.map((p) => ({
    key: p.key,
    name: p.name,
    visible: !!p.visible,
    editable: !!p.editable,
    hasChoiceList: !!p.choiceList,
    value: typeof p.getValue == "function" ? p.getValue()?.value ?? null : null
  })) : [];
}
function zl(a) {
  return a.map((p) => ({
    ...p,
    options: p.options?.map((u) => ({
      ...u,
      icon: typeof u.icon == "string" && u.icon.length > 100 ? `[icon omitted, ${u.icon.length} chars]` : u.icon
    }))
  }));
}
function ba({
  properties: a,
  price: p,
  currency: u,
  articleNumber: v,
  manufacturerId: C,
  safeQuantity: R,
  rawSnapshot: _ = [],
  variantId: O = null
}) {
  const P = /* @__PURE__ */ new Map(), T = [];
  for (const w of a) {
    if (w.currentValue == null || w.currentValue === "") continue;
    const A = Al(w.id);
    P.has(A) || P.set(A, []);
    const ne = (w.options || []).find(
      (j) => j.value === w.currentValue
    )?.label || String(w.currentValue);
    P.get(A).push({ label: w.label, selectedLabel: ne }), T.push(ne);
  }
  const z = /* @__PURE__ */ new Set();
  for (const w of P.values())
    for (const A of w) z.add(A.label);
  for (const w of ac) {
    if (z.has(w.propLabel)) continue;
    const A = Al(w.id);
    P.has(A) || P.set(A, []), P.get(A).push({
      label: w.propLabel,
      selectedLabel: w.displayLabel
    }), T.push(w.displayLabel);
  }
  const S = [
    ...Ml.filter((w) => P.has(w)),
    ...[...P.keys()].filter((w) => !Ml.includes(w))
  ], V = {};
  let X = 1;
  for (const w of S) {
    const A = P.get(w);
    if (!(!A || A.length === 0)) {
      V[`divider ${X}`] = w, X++;
      for (const { label: re, selectedLabel: ne } of A)
        V[re] = ne;
    }
  }
  const J = [
    v,
    C || null,
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
      manufacturerId: C || "",
      price: p ?? null,
      currency: u || "EUR",
      quantity: R,
      variantId: O != null ? String(O) : "",
      properties: Array.isArray(_) ? _ : []
    }),
    // WCF konfigürasyon property'leri — "divider N" + "Label: değer" çiftleri
    ...V
  };
}
function ec(a) {
  if (a == null) return "";
  const u = String(a).match(/(\d+)\s*$/);
  return u ? u[1] : "";
}
function Dl(a) {
  const p = {};
  for (const u of a)
    u.currentValue && (p[u.id] = u.currentValue);
  Cd(p);
}
const te = _d((a, p) => ({
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
        const u = await Ui(zn);
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
  async setWcfReady(u, v, C) {
    zn = u, Mi = v, Fi = new Map(C.map((S) => [S.key, S]));
    const R = await Ui(u).catch(() => ({
      price: null,
      currency: "EUR"
    })), _ = await Xa(C).catch(() => []), O = p().customIcons, P = tc(_, O);
    console.group("[pCon] Properties — raw (WCF)"), console.log("rawProps count:", C.length), console.table(
      C.map((S) => ({
        key: S.key,
        name: S.name,
        visible: S.visible,
        editable: S.editable,
        hasChoiceList: !!S.choiceList,
        value: typeof S.getValue == "function" ? S.getValue()?.value : "(n/a)"
      }))
    );
    const T = await Ja(C).catch(() => []);
    console.log(
      "[pCon] Full raw properties (JSON):",
      JSON.stringify(zl(T), null, 2)
    ), console.groupEnd(), console.group("[pCon] Properties — mapped (store)"), console.log("mapped count:", P.length), console.table(
      P.map((S) => ({
        id: S.id,
        label: S.label,
        type: S.type,
        currentValue: S.currentValue,
        optionCount: S.options?.length ?? 0
      }))
    ), console.log(
      "[pCon] Full mapped properties (JSON):",
      JSON.stringify(zl(P), null, 2)
    ), console.groupEnd(), a({
      properties: P,
      rawSnapshot: Za(C),
      price: R.price,
      currency: R.currency || p().currency,
      cartProperties: {},
      // signal: WCF article hazır → cart butonu açılır
      loading: !1
    });
    const z = Ed();
    if (Object.keys(z).length > 0)
      for (const [S, V] of Object.entries(z)) {
        const X = P.find((J) => J.id === S);
        X && X.currentValue !== V && p().updateProperty(S, V).catch((J) => console.warn("[store] URL prop apply failed:", J.message));
      }
    else
      Dl(P);
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
    const C = Fi.get(u);
    if (!C || typeof C.setValue != "function") {
      console.warn("[store] updateProperty: prop not found in propMap:", u);
      return;
    }
    const { properties: R, customIcons: _ } = p(), O = R.map(
      (P) => P.id === u ? { ...P, currentValue: v } : P
    );
    a({ properties: O, updating: !0, error: null }), Dl(O);
    try {
      const P = Mi?.eventArticleChanged, T = P && typeof P.addListener == "function";
      if (await new Promise((w, A) => {
        let re = !1, ne = !T, j = !1;
        const ce = setTimeout(() => {
          j || (j = !0, T && P.removeListener(oe), console.warn("[store] updateProperty: eventArticleChanged timeout, proceeding"), w());
        }, 1e4);
        function ue() {
          j || !re || !ne || (j = !0, clearTimeout(ce), w());
        }
        function oe() {
          P.removeListener(oe), ne = !0, ue();
        }
        T && P.addListener(oe), C.setValue(v).then(() => {
          re = !0, ue();
        }).catch((Ee) => {
          j || (j = !0, clearTimeout(ce), T && P.removeListener(oe), A(Ee));
        });
      }), !zn) throw new Error("WCF article ref lost");
      const [z, S] = await Promise.all([
        zn.getProperties(),
        Ui(zn)
      ]);
      Fi = new Map(z.map((w) => [w.key, w])), console.group(`[pCon] updateProperty(${u} = ${JSON.stringify(v)}) — pCon'dan gelen ham veri`), console.log("rawProps count:", z.length), console.table(
        z.map((w) => ({
          key: w.key,
          name: w.name,
          visible: w.visible,
          editable: w.editable,
          hasChoiceList: !!w.choiceList,
          value: typeof w.getValue == "function" ? w.getValue()?.value : "(n/a)"
        }))
      );
      const V = await Ja(z).catch(() => []);
      console.log(
        "[pCon] updateProperty — Full raw properties (JSON, değişmemiş pCon verisi):",
        JSON.stringify(zl(V), null, 2)
      ), console.log("[pCon] updateProperty — Fiyat (pCon'dan gelen, önceki → yeni):", {
        previousPrice: p().price,
        previousCurrency: p().currency,
        newPrice: S.price,
        newCurrency: S.currency
      }), console.groupEnd();
      const X = await Xa(z), J = tc(X, _);
      console.group(`[pCon] updateProperty(${u}) — ekrana basılacak mapped veri`), console.log("mapped count:", J.length), console.table(
        J.map((w) => ({
          id: w.id,
          label: w.label,
          type: w.type,
          currentValue: w.currentValue,
          optionCount: w.options?.length ?? 0
        }))
      ), console.log(
        "[pCon] updateProperty — Full mapped properties (JSON):",
        JSON.stringify(zl(J), null, 2)
      ), console.groupEnd(), a({
        properties: J,
        rawSnapshot: Za(z),
        price: S.price,
        currency: S.currency || p().currency,
        updating: !1
      }), Dl(J);
      try {
        Mi?.app?.viewer?.requestRenderFrame?.();
      } catch {
      }
    } catch (P) {
      console.warn("[store] updateProperty revert:", P?.message || P), Dl(R), a({ properties: R, updating: !1, error: P?.message || String(P) });
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
      price: C,
      currency: R,
      articleNumber: _,
      manufacturerId: O,
      quantity: P,
      variantId: T,
      productTitle: z,
      productImageUrl: S,
      productSku: V,
      loading: X,
      updating: J,
      cartProperties: w,
      quoteLoading: A
    } = p();
    if (A) return !1;
    if (X || J)
      return a({ quoteError: "Configuration is still loading. Please wait." }), !1;
    if (!w)
      return a({ quoteError: "Configuration not ready. Please wait." }), !1;
    const re = typeof window < "u" ? window.CalmaQuoteList : null;
    if (!re || typeof re.addItem != "function")
      return a({
        quoteError: "Quote list is not available. Please make sure you are signed in as a dealer."
      }), !1;
    const ne = ec(T);
    if (!ne)
      return a({
        quoteError: "Could not detect a product variant on this page. Please reload and try again."
      }), !1;
    a({ quoteLoading: !0, quoteError: null, quoteSuccess: !1 });
    const j = Math.max(1, parseInt(P, 10) || 1), ce = ba({
      properties: u,
      price: C,
      currency: R,
      articleNumber: _,
      manufacturerId: O,
      safeQuantity: j,
      rawSnapshot: v,
      variantId: ne
    });
    try {
      return re.addItem({
        variant_id: ne,
        quantity: j,
        properties: ce,
        name: z || _ || null,
        image: S || null,
        sku: V || _ || null
      }), a({ quoteLoading: !1, quoteSuccess: !0 }), !0;
    } catch (ue) {
      return console.error("[Configurator] addToQuoteList error:", ue), a({
        quoteLoading: !1,
        quoteError: ue?.message || "Failed to add to quote list."
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
      rawSnapshot: C,
      price: R,
      currency: _,
      articleNumber: O,
      manufacturerId: P,
      quantity: T,
      variantId: z,
      routesRoot: S,
      successAction: V,
      cartLoading: X,
      updating: J,
      loading: w,
      cartProperties: A
    } = p();
    if (X) return !1;
    if (w || J)
      return a({ cartError: "Configuration is still loading. Please wait." }), !1;
    if (!A)
      return a({ cartError: "Configuration not ready. Please wait." }), !1;
    if (!z)
      return a({
        cartError: "Could not detect a product variant on this page. Please reload and try again."
      }), !1;
    a({ cartLoading: !0, cartError: null, cartSuccess: !1 });
    const re = Math.max(1, parseInt(T, 10) || 1), ne = ba({
      properties: v,
      price: R,
      currency: _,
      articleNumber: O,
      manufacturerId: P,
      safeQuantity: re,
      rawSnapshot: C,
      variantId: ec(z)
    });
    console.log(
      "[cart] Shopify cart/add.js payload:",
      JSON.stringify({ items: [{ id: z, quantity: re, properties: ne }] }, null, 2)
    );
    try {
      const j = Rd();
      if (j) {
        const Ee = Td();
        let ge;
        try {
          ge = await Od({
            logged_in_customer_id: Ee,
            draftOrderId: j.draftOrderId,
            variantId: z,
            quantity: re,
            properties: ne
          });
        } catch (we) {
          return console.error("[Configurator] Preorder add-line error:", we), window.alert("❌ Could not add to preorder. Please try again."), a({ cartLoading: !1 }), !1;
        }
        if (!ge || ge.error) {
          const we = ge?.error || "Unknown error";
          return window.alert("❌ Could not add to preorder: " + we), a({ cartLoading: !1 }), !1;
        }
        const Qe = ge.draftOrder?.name || j.draftOrderName || "preorder";
        return window.alert("✅ Product added to Preorder " + Qe), Ld(), a({ cartLoading: !1, cartSuccess: !0 }), window.location.href = "/pages/b2b-account#preorder-" + j.draftOrderId, !0;
      }
      const ue = await Pd(S, [
        {
          id: z,
          quantity: re,
          properties: ne
        }
      ]);
      a({ cartLoading: !1, cartSuccess: !0 });
      const oe = u ?? V;
      return oe === "redirect" ? window.setTimeout(() => {
        window.location.href = (window.Shopify?.routes?.root || "/").replace(/\/$/, "") + "/cart";
      }, 0) : oe === "reload" ? window.setTimeout(() => window.location.reload(), 0) : oe !== "none" && Nd(ue), !0;
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
      manufacturerId: C,
      quantity: R,
      productTitle: _,
      productImageUrl: O,
      customerName: P
    } = p(), T = Math.max(1, parseInt(R, 10) || 1), z = /* @__PURE__ */ new Map();
    for (const w of u) {
      if (w.currentValue == null || w.currentValue === "") continue;
      const A = Al(w.id);
      z.has(A) || z.set(A, []);
      const ne = (w.options || []).find(
        (j) => j.value === w.currentValue
      )?.label || String(w.currentValue);
      z.get(A).push({ label: w.label, selectedLabel: ne });
    }
    const S = /* @__PURE__ */ new Set();
    for (const w of z.values())
      for (const A of w) S.add(A.label);
    for (const w of ac) {
      if (S.has(w.propLabel)) continue;
      const A = Al(w.id);
      z.has(A) || z.set(A, []), z.get(A).push({
        label: w.propLabel,
        selectedLabel: w.displayLabel
      });
    }
    const V = [
      ...Ml.filter((w) => z.has(w)),
      ...[...z.keys()].filter((w) => !Ml.includes(w))
    ], X = {};
    let J = 1;
    for (const w of V) {
      const A = z.get(w);
      if (!(!A || A.length === 0)) {
        X[`divider ${J}`] = w, J++;
        for (const { label: re, selectedLabel: ne } of A)
          X[re] = ne;
      }
    }
    try {
      const { exportToExcel: w } = await import("./pcon-chunk-excel-export-ClkFUrGS.js");
      await w({
        articleNumber: v,
        manufacturerId: C,
        productTitle: _,
        productImageUrl: O,
        quantity: T,
        customerName: P,
        configDividers: X
      });
    } catch (w) {
      console.error("[exportRequest] Excel export failed:", w), window.alert("Excel export failed: " + (w?.message || String(w)));
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
function tc(a, p) {
  if (!p || typeof p != "object") return a;
  let u = Vd(a, p.variantPicker);
  return u = Wd(u, p.socket), u = Bd(u, p.contextual), u;
}
let kr = null, nc = null;
function Ud(a) {
  if (nc === a && kr)
    return kr;
  if (nc = a, kr = /* @__PURE__ */ new Map(), a && typeof a == "object")
    for (const [p, u] of Object.entries(a))
      !p || !u || kr.set(cc(p), u);
  return kr;
}
function cc(a) {
  return String(a || "").toLowerCase().replace(/[\s_-]+/g, "");
}
function Vd(a, p) {
  const u = Ud(p);
  return u.size === 0 ? a : a.map((v) => {
    let C = !1;
    const R = v.options.map((_) => {
      if (_.icon) return _;
      const O = u.get(cc(_.value));
      return O ? (C = !0, { ..._, icon: O }) : _;
    });
    return C ? { ...v, type: "color", options: R } : v;
  });
}
function Wd(a, p) {
  return p ? a.map((u) => {
    if (!Qd(u)) return u;
    const v = Hd(u.options, p), C = v.some((R) => R.icon);
    return { ...u, type: C ? "color" : u.type, options: v };
  }) : a;
}
function Bd(a, p) {
  if (!p) return a;
  const v = a.find((R) => R.id === Md)?.currentValue;
  if (!v) return a;
  const C = Fd[v];
  return C ? a.map((R) => {
    const _ = C[R.id];
    if (!_) return R;
    const O = R.options.map((T) => {
      const z = _[T.value], S = z ? p[z] : null;
      return S ? { ...T, icon: S } : T;
    }), P = O.some((T) => T.icon);
    return { ...R, type: P ? "color" : R.type, options: O };
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
  for (const { keys: v, iconKey: C } of Ad)
    if (v.some((R) => u.includes(R)))
      return p[C] || null;
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
  const a = te((v) => v.price), p = te((v) => v.currency);
  if (te((v) => v.discountPercentage), a == null)
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
const rc = {
  "[Character]NRUS_DOSEME_RENK_DUVAR": "[Character]NRUS_DOSEME_SERI_DUVAR"
};
function Yd() {
  const a = te((T) => T.properties), p = te((T) => T.updateProperty), [u, v] = je.useState(null), C = a.filter((T) => T.editable && T.options.length > 0);
  if (C.length === 0) return null;
  const R = new Set(Object.keys(rc)), _ = C.filter((T) => !R.has(T.id)), O = {};
  for (const [T, z] of Object.entries(rc)) {
    const S = C.find((V) => V.id === T);
    S && (O[z] || (O[z] = []), O[z].push(S));
  }
  const P = (T) => {
    v((z) => z === T ? null : T);
  };
  return /* @__PURE__ */ N.jsx("div", { className: "pcon-properties", children: _.map((T) => /* @__PURE__ */ N.jsx(
    Gd,
    {
      prop: T,
      open: u === T.id,
      onToggle: () => P(T.id),
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
  childProps: C = [],
  updateProperty: R
}) {
  const _ = a.type === "color", O = a.options.find((S) => S.value === a.currentValue), P = (S) => {
    S.available && S.value !== a.currentValue && v(S.value);
  }, T = [
    "pcon-prop-group",
    p && "pcon-prop-group--open"
  ].filter(Boolean).join(" "), z = _ ? "pcon-prop-group__body pcon-prop-group__body--colors" : "pcon-prop-group__body pcon-prop-group__body--chips";
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
              _ && O?.icon ? /* @__PURE__ */ N.jsx(
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
      if (_) {
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
            onClick: () => P(S),
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
          onClick: () => P(S),
          children: S.label
        },
        S.value
      );
    }) }),
    p && C.length > 0 && /* @__PURE__ */ N.jsx("div", { className: "pcon-prop-group__nested", children: C.map((S) => /* @__PURE__ */ N.jsx(
      Xd,
      {
        prop: S,
        onSelect: (V) => R(S.id, V)
      },
      S.id
    )) })
  ] });
}
function Xd({ prop: a, onSelect: p }) {
  const u = a.type === "color", v = a.options.find((_) => _.value === a.currentValue), C = (_) => {
    _.available && _.value !== a.currentValue && p(_.value);
  }, R = u ? "pcon-prop-group__body pcon-prop-group__body--colors" : "pcon-prop-group__body pcon-prop-group__body--chips";
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
    /* @__PURE__ */ N.jsx("div", { className: R, children: a.options.map((_) => {
      const O = _.value === a.currentValue;
      if (u) {
        const T = [
          "pcon-option-swatch",
          O && "pcon-option-swatch--active",
          !_.available && "pcon-option-swatch--disabled"
        ].filter(Boolean).join(" ");
        return /* @__PURE__ */ N.jsxs(
          "button",
          {
            type: "button",
            className: T,
            disabled: !_.available,
            title: _.label,
            onClick: () => C(_),
            children: [
              /* @__PURE__ */ N.jsx(
                "span",
                {
                  className: "pcon-option-swatch__thumb",
                  style: _.icon ? { backgroundImage: `url("${_.icon}")` } : void 0,
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ N.jsx("span", { className: "pcon-option-swatch__label", children: _.label })
            ]
          },
          _.value
        );
      }
      const P = [
        "pcon-option-chip",
        O && "pcon-option-chip--active",
        !_.available && "pcon-option-chip--disabled"
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ N.jsx(
        "button",
        {
          type: "button",
          className: P,
          disabled: !_.available,
          title: _.label,
          onClick: () => C(_),
          children: _.label
        },
        _.value
      );
    }) })
  ] });
}
var Vi = { exports: {} }, Wi, lc;
function Jd() {
  if (lc) return Wi;
  lc = 1;
  var a = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return Wi = a, Wi;
}
var Bi, oc;
function Zd() {
  if (oc) return Bi;
  oc = 1;
  var a = /* @__PURE__ */ Jd();
  function p() {
  }
  function u() {
  }
  return u.resetWarningCache = p, Bi = function() {
    function v(_, O, P, T, z, S) {
      if (S !== a) {
        var V = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw V.name = "Invariant Violation", V;
      }
    }
    v.isRequired = v;
    function C() {
      return v;
    }
    var R = {
      array: v,
      bigint: v,
      bool: v,
      func: v,
      number: v,
      object: v,
      string: v,
      symbol: v,
      any: v,
      arrayOf: C,
      element: v,
      elementType: v,
      instanceOf: C,
      node: v,
      objectOf: C,
      oneOf: C,
      oneOfType: C,
      shape: C,
      exact: C,
      checkPropTypes: u,
      resetWarningCache: p
    };
    return R.PropTypes = R, R;
  }, Bi;
}
var ic;
function bd() {
  return ic || (ic = 1, Vi.exports = /* @__PURE__ */ Zd()()), Vi.exports;
}
var ep = /* @__PURE__ */ bd();
const tp = /* @__PURE__ */ sc(ep);
function uc() {
  return typeof window < "u" && window.CalmaQuoteList && typeof window.CalmaQuoteList.addItem == "function";
}
function fc({ isGuest: a = !1 }) {
  const p = te((Q) => Q.quantity), u = te((Q) => Q.setQuantity), v = te((Q) => Q.addToCart), C = te((Q) => Q.addToQuoteList);
  te((Q) => Q.exportRequest);
  const R = te((Q) => Q.resetCartFeedback), _ = te((Q) => Q.resetQuoteFeedback), O = te((Q) => Q.cartLoading), P = te((Q) => Q.cartError), T = te((Q) => Q.cartSuccess), z = te((Q) => Q.quoteLoading), S = te((Q) => Q.quoteError), V = te((Q) => Q.quoteSuccess), X = te((Q) => Q.cartProperties), J = te((Q) => Q.variantId), w = te((Q) => Q.updating), A = te((Q) => Q.loading), re = te((Q) => Q.addToCartLabel), [ne, j] = je.useState(!1), [ce, ue] = je.useState(uc);
  je.useEffect(() => {
    if (ce) return;
    let Q = 0;
    const Se = setInterval(() => {
      Q += 1, uc() ? (ue(!0), clearInterval(Se)) : Q >= 20 && clearInterval(Se);
    }, 500);
    return () => clearInterval(Se);
  }, [ce]), je.useEffect(() => {
    if (!T) return;
    const Q = setTimeout(() => R(), 4e3);
    return () => clearTimeout(Q);
  }, [T, R]), je.useEffect(() => {
    if (!V) return;
    const Q = setTimeout(() => _(), 4e3);
    return () => clearTimeout(Q);
  }, [V, _]);
  const oe = O || w || A || !X || !J, Ee = (Q) => {
    u(Q.target.value);
  }, ge = (Q) => {
    u(Math.max(1, (parseInt(p, 10) || 1) + Q));
  }, Qe = async () => {
    if (oe) return;
    await v("none") && document.dispatchEvent(
      new CustomEvent("cart:refresh", { bubbles: !0, detail: { open: !0 } })
    );
  }, we = async () => {
    oe || z || await C();
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
            onChange: Ee,
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
          disabled: oe,
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
          disabled: oe || z,
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
          disabled: oe,
          "aria-busy": O,
          children: O ? /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
            /* @__PURE__ */ N.jsx("span", { className: "pcon-cart__btn-spinner", "aria-hidden": "true" }),
            /* @__PURE__ */ N.jsx("span", { children: "Adding..." })
          ] }) : re || "Add to Cart"
        }
      )
    ] }),
    P ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__error", role: "alert", children: P }) : null,
    T ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__success", role: "status", children: "Added to cart." }) : null,
    S ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__error", role: "alert", children: S }) : null,
    V ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__success", role: "status", children: "Teklif listesine eklendi." }) : null
  ] });
}
fc.propTypes = {
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
    const R = await fetch(
      `https://gatekeeper.eaiws.pcon-solutions.com/v3/session/${u}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: p })
      }
    );
    if (!R.ok)
      throw new Error(`Gatekeeper direct call failed (HTTP ${R.status})`);
    return R.json();
  }
  const C = await fetch(`${a}/api/gatekeeper-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ locale: p, region: v || "" })
  });
  if (!C.ok) {
    const R = await C.json().catch(() => ({}));
    throw new Error(
      R.error || `Gatekeeper session failed (HTTP ${C.status})`
    );
  }
  return C.json();
}
function lp({ canvasHeight: a, customerLoggedIn: p }) {
  const u = te((j) => j.loading), v = te((j) => j.error), C = te((j) => j.proxyBase), R = te((j) => j.gatekeeperId), _ = te((j) => j.region), O = te((j) => j.articleNumber), P = te((j) => j.manufacturerId), T = te((j) => j.setWcfReady), z = te((j) => j.setWcfError), S = te((j) => j.refreshWcfPrice), V = je.useRef(null), X = je.useRef(null), J = je.useRef(null), w = je.useRef(null), A = je.useRef(null), re = je.useRef(null), ne = je.useCallback(() => {
    try {
      re.current?.disconnect();
    } catch {
    }
    re.current = null;
    try {
      A.current && w.current && w.current.eventArticleChanged?.removeListener(
        A.current
      );
    } catch {
    }
    A.current = null, w.current = null;
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
    if (!O || !C) return;
    let j = !1;
    async function ce() {
      if (!(!V.current && (await new Promise((ue) => setTimeout(ue, 50)), j || !V.current)))
        try {
          const ue = await rp(C, "en_US", R || null, _ || "");
          if (j) return;
          const [oe, Ee] = await Promise.all([
            import("./pcon-chunk-engine-AgGdbLMj.js").then((f) => f.a),
            import("./pcon-chunk-engine-AgGdbLMj.js").then((f) => f.i)
          ]);
          if (j) return;
          const { Application: ge } = oe, { wcfConfig: Qe } = Ee;
          Qe.dataPath = `${C}/wcf/data/`;
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
            ue.server,
            ue.sessionId,
            ue.keepAliveInterval
          ), J.current = Se;
          const Ae = "en";
          if (await Promise.all([
            Se.catalog.setLanguages([Ae]),
            Se.basket.setLanguages([Ae])
          ]), j) return;
          const { ArticleManager: Ze } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((f) => f.d);
          if (j) return;
          const Me = new Ze(we, Se);
          w.current = Me;
          const Fe = (async () => {
            try {
              const { PricingProcedureInfo: f } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((Z) => Z.b), g = await Se.basket.listPricingProcedures(!0);
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
              !j && w.current && (w.current.setPricingProcedure(Y), console.log("[wcf] pricing procedure ready:", H));
            } catch (f) {
              console.warn("[wcf] pricing procedure failed:", f?.message);
            }
          })(), he = (async () => {
            try {
              const { SearchArticleParameterSet: f } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((Z) => Z.C), g = new f();
              g.baseArticleNumber = O, P && (g.manufacturerId = P);
              const Y = (await Se.catalog.searchArticle(g))?.scoredItems?.[0]?.item;
              if (Y) {
                const { InsertInfo: Z } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((fe) => fe.b), ee = new Z();
                return ee.baseArticleNumber = Y.baseArticleNumber || O, Y.manufacturerId && (ee.manufacturerId = Y.manufacturerId), Y.seriesId && (ee.seriesId = Y.seriesId), await Me.insertArticle(ee);
              } else
                throw new Error(`Article not found in catalog: ${O}`);
            } catch (f) {
              console.warn(
                "[wcf] catalog search fell back to direct insert:",
                f?.message
              );
              const { InsertInfo: g } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((Y) => Y.b), H = new g();
              return H.baseArticleNumber = O, P && (H.manufacturerId = P), await Me.insertArticle(H);
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
        } catch (ue) {
          j || (console.error("[wcf] init failed:", ue), z(ue));
        }
    }
    return ce(), () => {
      j = !0, ne();
    };
  }, [O, P, C, R, _, T, z, ne, S]), /* @__PURE__ */ N.jsx(np, { canvasHeight: a, children: /* @__PURE__ */ N.jsxs("div", { className: "pcon-configurator", children: [
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
        /* @__PURE__ */ N.jsx(fc, { isGuest: !p })
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
function dc() {
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
    const _ = dc();
    _ && _ !== p && (p = _, a(_));
  }, v = (_) => {
    const O = _.target;
    O && O.matches?.(
      'input[name="id"], select[name="id"]'
    ) && u();
  }, C = () => u(), R = () => u();
  return document.addEventListener("change", v, !0), document.addEventListener("variant:change", C), document.addEventListener("on:variant:change", C), window.addEventListener("popstate", R), () => {
    document.removeEventListener("change", v, !0), document.removeEventListener("variant:change", C), document.removeEventListener("on:variant:change", C), window.removeEventListener("popstate", R);
  };
}
function up({ config: a }) {
  const p = te((v) => v.initialize), u = te((v) => v.setVariantId);
  return je.useEffect(() => {
    p(a);
  }, [p, a]), je.useEffect(() => {
    const v = dc();
    return v && u(v), ip((R) => {
      u(R);
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
  a.innerHTML = "", gd.createRoot(a).render(/* @__PURE__ */ N.jsx(up, { config: u }));
};
