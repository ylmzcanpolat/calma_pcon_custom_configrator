import { g as Cc } from "./pcon-chunk-engine-AgGdbLMj.js";
var Fi = { exports: {} }, Er = {}, Vi = { exports: {} }, te = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ec;
function zd() {
  if (ec) return te;
  ec = 1;
  var a = Symbol.for("react.element"), s = Symbol.for("react.portal"), u = Symbol.for("react.fragment"), m = Symbol.for("react.strict_mode"), g = Symbol.for("react.profiler"), _ = Symbol.for("react.provider"), w = Symbol.for("react.context"), x = Symbol.for("react.forward_ref"), k = Symbol.for("react.suspense"), S = Symbol.for("react.memo"), j = Symbol.for("react.lazy"), C = Symbol.iterator;
  function M(f) {
    return f === null || typeof f != "object" ? null : (f = C && f[C] || f["@@iterator"], typeof f == "function" ? f : null);
  }
  var J = { isMounted: function() {
    return !1;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, $ = Object.assign, L = {};
  function A(f, E, H) {
    this.props = f, this.context = E, this.refs = L, this.updater = H || J;
  }
  A.prototype.isReactComponent = {}, A.prototype.setState = function(f, E) {
    if (typeof f != "object" && typeof f != "function" && f != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, f, E, "setState");
  }, A.prototype.forceUpdate = function(f) {
    this.updater.enqueueForceUpdate(this, f, "forceUpdate");
  };
  function b() {
  }
  b.prototype = A.prototype;
  function le(f, E, H) {
    this.props = f, this.context = E, this.refs = L, this.updater = H || J;
  }
  var z = le.prototype = new b();
  z.constructor = le, $(z, A.prototype), z.isPureReactComponent = !0;
  var se = Array.isArray, ce = Object.prototype.hasOwnProperty, ee = { current: null }, ve = { key: !0, ref: !0, __self: !0, __source: !0 };
  function me(f, E, H) {
    var G, Z = {}, ne = null, de = null;
    if (E != null) for (G in E.ref !== void 0 && (de = E.ref), E.key !== void 0 && (ne = "" + E.key), E) ce.call(E, G) && !ve.hasOwnProperty(G) && (Z[G] = E[G]);
    var ue = arguments.length - 2;
    if (ue === 1) Z.children = H;
    else if (1 < ue) {
      for (var we = Array(ue), be = 0; be < ue; be++) we[be] = arguments[be + 2];
      Z.children = we;
    }
    if (f && f.defaultProps) for (G in ue = f.defaultProps, ue) Z[G] === void 0 && (Z[G] = ue[G]);
    return { $$typeof: a, type: f, key: ne, ref: de, props: Z, _owner: ee.current };
  }
  function Qe(f, E) {
    return { $$typeof: a, type: f.type, key: E, ref: f.ref, props: f.props, _owner: f._owner };
  }
  function ge(f) {
    return typeof f == "object" && f !== null && f.$$typeof === a;
  }
  function qe(f) {
    var E = { "=": "=0", ":": "=2" };
    return "$" + f.replace(/[=:]/g, function(H) {
      return E[H];
    });
  }
  var _e = /\/+/g;
  function D(f, E) {
    return typeof f == "object" && f !== null && f.key != null ? qe("" + f.key) : E.toString(36);
  }
  function ke(f, E, H, G, Z) {
    var ne = typeof f;
    (ne === "undefined" || ne === "boolean") && (f = null);
    var de = !1;
    if (f === null) de = !0;
    else switch (ne) {
      case "string":
      case "number":
        de = !0;
        break;
      case "object":
        switch (f.$$typeof) {
          case a:
          case s:
            de = !0;
        }
    }
    if (de) return de = f, Z = Z(de), f = G === "" ? "." + D(de, 0) : G, se(Z) ? (H = "", f != null && (H = f.replace(_e, "$&/") + "/"), ke(Z, E, H, "", function(be) {
      return be;
    })) : Z != null && (ge(Z) && (Z = Qe(Z, H + (!Z.key || de && de.key === Z.key ? "" : ("" + Z.key).replace(_e, "$&/") + "/") + f)), E.push(Z)), 1;
    if (de = 0, G = G === "" ? "." : G + ":", se(f)) for (var ue = 0; ue < f.length; ue++) {
      ne = f[ue];
      var we = G + D(ne, ue);
      de += ke(ne, E, H, we, Z);
    }
    else if (we = M(f), typeof we == "function") for (f = we.call(f), ue = 0; !(ne = f.next()).done; ) ne = ne.value, we = G + D(ne, ue++), de += ke(ne, E, H, we, Z);
    else if (ne === "object") throw E = String(f), Error("Objects are not valid as a React child (found: " + (E === "[object Object]" ? "object with keys {" + Object.keys(f).join(", ") + "}" : E) + "). If you meant to render a collection of children, use an array instead.");
    return de;
  }
  function Pe(f, E, H) {
    if (f == null) return f;
    var G = [], Z = 0;
    return ke(f, G, "", "", function(ne) {
      return E.call(H, ne, Z++);
    }), G;
  }
  function Oe(f) {
    if (f._status === -1) {
      var E = f._result;
      E = E(), E.then(function(H) {
        (f._status === 0 || f._status === -1) && (f._status = 1, f._result = H);
      }, function(H) {
        (f._status === 0 || f._status === -1) && (f._status = 2, f._result = H);
      }), f._status === -1 && (f._status = 0, f._result = E);
    }
    if (f._status === 1) return f._result.default;
    throw f._result;
  }
  var fe = { current: null }, O = { transition: null }, Q = { ReactCurrentDispatcher: fe, ReactCurrentBatchConfig: O, ReactCurrentOwner: ee };
  function U() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  return te.Children = { map: Pe, forEach: function(f, E, H) {
    Pe(f, function() {
      E.apply(this, arguments);
    }, H);
  }, count: function(f) {
    var E = 0;
    return Pe(f, function() {
      E++;
    }), E;
  }, toArray: function(f) {
    return Pe(f, function(E) {
      return E;
    }) || [];
  }, only: function(f) {
    if (!ge(f)) throw Error("React.Children.only expected to receive a single React element child.");
    return f;
  } }, te.Component = A, te.Fragment = u, te.Profiler = g, te.PureComponent = le, te.StrictMode = m, te.Suspense = k, te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Q, te.act = U, te.cloneElement = function(f, E, H) {
    if (f == null) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + f + ".");
    var G = $({}, f.props), Z = f.key, ne = f.ref, de = f._owner;
    if (E != null) {
      if (E.ref !== void 0 && (ne = E.ref, de = ee.current), E.key !== void 0 && (Z = "" + E.key), f.type && f.type.defaultProps) var ue = f.type.defaultProps;
      for (we in E) ce.call(E, we) && !ve.hasOwnProperty(we) && (G[we] = E[we] === void 0 && ue !== void 0 ? ue[we] : E[we]);
    }
    var we = arguments.length - 2;
    if (we === 1) G.children = H;
    else if (1 < we) {
      ue = Array(we);
      for (var be = 0; be < we; be++) ue[be] = arguments[be + 2];
      G.children = ue;
    }
    return { $$typeof: a, type: f.type, key: Z, ref: ne, props: G, _owner: de };
  }, te.createContext = function(f) {
    return f = { $$typeof: w, _currentValue: f, _currentValue2: f, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null }, f.Provider = { $$typeof: _, _context: f }, f.Consumer = f;
  }, te.createElement = me, te.createFactory = function(f) {
    var E = me.bind(null, f);
    return E.type = f, E;
  }, te.createRef = function() {
    return { current: null };
  }, te.forwardRef = function(f) {
    return { $$typeof: x, render: f };
  }, te.isValidElement = ge, te.lazy = function(f) {
    return { $$typeof: j, _payload: { _status: -1, _result: f }, _init: Oe };
  }, te.memo = function(f, E) {
    return { $$typeof: S, type: f, compare: E === void 0 ? null : E };
  }, te.startTransition = function(f) {
    var E = O.transition;
    O.transition = {};
    try {
      f();
    } finally {
      O.transition = E;
    }
  }, te.unstable_act = U, te.useCallback = function(f, E) {
    return fe.current.useCallback(f, E);
  }, te.useContext = function(f) {
    return fe.current.useContext(f);
  }, te.useDebugValue = function() {
  }, te.useDeferredValue = function(f) {
    return fe.current.useDeferredValue(f);
  }, te.useEffect = function(f, E) {
    return fe.current.useEffect(f, E);
  }, te.useId = function() {
    return fe.current.useId();
  }, te.useImperativeHandle = function(f, E, H) {
    return fe.current.useImperativeHandle(f, E, H);
  }, te.useInsertionEffect = function(f, E) {
    return fe.current.useInsertionEffect(f, E);
  }, te.useLayoutEffect = function(f, E) {
    return fe.current.useLayoutEffect(f, E);
  }, te.useMemo = function(f, E) {
    return fe.current.useMemo(f, E);
  }, te.useReducer = function(f, E, H) {
    return fe.current.useReducer(f, E, H);
  }, te.useRef = function(f) {
    return fe.current.useRef(f);
  }, te.useState = function(f) {
    return fe.current.useState(f);
  }, te.useSyncExternalStore = function(f, E, H) {
    return fe.current.useSyncExternalStore(f, E, H);
  }, te.useTransition = function() {
    return fe.current.useTransition();
  }, te.version = "18.3.1", te;
}
var tc;
function ru() {
  return tc || (tc = 1, Vi.exports = /* @__PURE__ */ zd()), Vi.exports;
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
var nc;
function Ad() {
  if (nc) return Er;
  nc = 1;
  var a = /* @__PURE__ */ ru(), s = Symbol.for("react.element"), u = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, g = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, _ = { key: !0, ref: !0, __self: !0, __source: !0 };
  function w(x, k, S) {
    var j, C = {}, M = null, J = null;
    S !== void 0 && (M = "" + S), k.key !== void 0 && (M = "" + k.key), k.ref !== void 0 && (J = k.ref);
    for (j in k) m.call(k, j) && !_.hasOwnProperty(j) && (C[j] = k[j]);
    if (x && x.defaultProps) for (j in k = x.defaultProps, k) C[j] === void 0 && (C[j] = k[j]);
    return { $$typeof: s, type: x, key: M, ref: J, props: C, _owner: g.current };
  }
  return Er.Fragment = u, Er.jsx = w, Er.jsxs = w, Er;
}
var rc;
function Dd() {
  return rc || (rc = 1, Fi.exports = /* @__PURE__ */ Ad()), Fi.exports;
}
var N = /* @__PURE__ */ Dd(), Ml = {}, Wi = { exports: {} }, Ze = {}, Bi = { exports: {} }, Qi = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var lc;
function Ud() {
  return lc || (lc = 1, (function(a) {
    function s(O, Q) {
      var U = O.length;
      O.push(Q);
      e: for (; 0 < U; ) {
        var f = U - 1 >>> 1, E = O[f];
        if (0 < g(E, Q)) O[f] = Q, O[U] = E, U = f;
        else break e;
      }
    }
    function u(O) {
      return O.length === 0 ? null : O[0];
    }
    function m(O) {
      if (O.length === 0) return null;
      var Q = O[0], U = O.pop();
      if (U !== Q) {
        O[0] = U;
        e: for (var f = 0, E = O.length, H = E >>> 1; f < H; ) {
          var G = 2 * (f + 1) - 1, Z = O[G], ne = G + 1, de = O[ne];
          if (0 > g(Z, U)) ne < E && 0 > g(de, Z) ? (O[f] = de, O[ne] = U, f = ne) : (O[f] = Z, O[G] = U, f = G);
          else if (ne < E && 0 > g(de, U)) O[f] = de, O[ne] = U, f = ne;
          else break e;
        }
      }
      return Q;
    }
    function g(O, Q) {
      var U = O.sortIndex - Q.sortIndex;
      return U !== 0 ? U : O.id - Q.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var _ = performance;
      a.unstable_now = function() {
        return _.now();
      };
    } else {
      var w = Date, x = w.now();
      a.unstable_now = function() {
        return w.now() - x;
      };
    }
    var k = [], S = [], j = 1, C = null, M = 3, J = !1, $ = !1, L = !1, A = typeof setTimeout == "function" ? setTimeout : null, b = typeof clearTimeout == "function" ? clearTimeout : null, le = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function z(O) {
      for (var Q = u(S); Q !== null; ) {
        if (Q.callback === null) m(S);
        else if (Q.startTime <= O) m(S), Q.sortIndex = Q.expirationTime, s(k, Q);
        else break;
        Q = u(S);
      }
    }
    function se(O) {
      if (L = !1, z(O), !$) if (u(k) !== null) $ = !0, Oe(ce);
      else {
        var Q = u(S);
        Q !== null && fe(se, Q.startTime - O);
      }
    }
    function ce(O, Q) {
      $ = !1, L && (L = !1, b(me), me = -1), J = !0;
      var U = M;
      try {
        for (z(Q), C = u(k); C !== null && (!(C.expirationTime > Q) || O && !qe()); ) {
          var f = C.callback;
          if (typeof f == "function") {
            C.callback = null, M = C.priorityLevel;
            var E = f(C.expirationTime <= Q);
            Q = a.unstable_now(), typeof E == "function" ? C.callback = E : C === u(k) && m(k), z(Q);
          } else m(k);
          C = u(k);
        }
        if (C !== null) var H = !0;
        else {
          var G = u(S);
          G !== null && fe(se, G.startTime - Q), H = !1;
        }
        return H;
      } finally {
        C = null, M = U, J = !1;
      }
    }
    var ee = !1, ve = null, me = -1, Qe = 5, ge = -1;
    function qe() {
      return !(a.unstable_now() - ge < Qe);
    }
    function _e() {
      if (ve !== null) {
        var O = a.unstable_now();
        ge = O;
        var Q = !0;
        try {
          Q = ve(!0, O);
        } finally {
          Q ? D() : (ee = !1, ve = null);
        }
      } else ee = !1;
    }
    var D;
    if (typeof le == "function") D = function() {
      le(_e);
    };
    else if (typeof MessageChannel < "u") {
      var ke = new MessageChannel(), Pe = ke.port2;
      ke.port1.onmessage = _e, D = function() {
        Pe.postMessage(null);
      };
    } else D = function() {
      A(_e, 0);
    };
    function Oe(O) {
      ve = O, ee || (ee = !0, D());
    }
    function fe(O, Q) {
      me = A(function() {
        O(a.unstable_now());
      }, Q);
    }
    a.unstable_IdlePriority = 5, a.unstable_ImmediatePriority = 1, a.unstable_LowPriority = 4, a.unstable_NormalPriority = 3, a.unstable_Profiling = null, a.unstable_UserBlockingPriority = 2, a.unstable_cancelCallback = function(O) {
      O.callback = null;
    }, a.unstable_continueExecution = function() {
      $ || J || ($ = !0, Oe(ce));
    }, a.unstable_forceFrameRate = function(O) {
      0 > O || 125 < O ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : Qe = 0 < O ? Math.floor(1e3 / O) : 5;
    }, a.unstable_getCurrentPriorityLevel = function() {
      return M;
    }, a.unstable_getFirstCallbackNode = function() {
      return u(k);
    }, a.unstable_next = function(O) {
      switch (M) {
        case 1:
        case 2:
        case 3:
          var Q = 3;
          break;
        default:
          Q = M;
      }
      var U = M;
      M = Q;
      try {
        return O();
      } finally {
        M = U;
      }
    }, a.unstable_pauseExecution = function() {
    }, a.unstable_requestPaint = function() {
    }, a.unstable_runWithPriority = function(O, Q) {
      switch (O) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          O = 3;
      }
      var U = M;
      M = O;
      try {
        return Q();
      } finally {
        M = U;
      }
    }, a.unstable_scheduleCallback = function(O, Q, U) {
      var f = a.unstable_now();
      switch (typeof U == "object" && U !== null ? (U = U.delay, U = typeof U == "number" && 0 < U ? f + U : f) : U = f, O) {
        case 1:
          var E = -1;
          break;
        case 2:
          E = 250;
          break;
        case 5:
          E = 1073741823;
          break;
        case 4:
          E = 1e4;
          break;
        default:
          E = 5e3;
      }
      return E = U + E, O = { id: j++, callback: Q, priorityLevel: O, startTime: U, expirationTime: E, sortIndex: -1 }, U > f ? (O.sortIndex = U, s(S, O), u(k) === null && O === u(S) && (L ? (b(me), me = -1) : L = !0, fe(se, U - f))) : (O.sortIndex = E, s(k, O), $ || J || ($ = !0, Oe(ce))), O;
    }, a.unstable_shouldYield = qe, a.unstable_wrapCallback = function(O) {
      var Q = M;
      return function() {
        var U = M;
        M = Q;
        try {
          return O.apply(this, arguments);
        } finally {
          M = U;
        }
      };
    };
  })(Qi)), Qi;
}
var oc;
function Md() {
  return oc || (oc = 1, Bi.exports = /* @__PURE__ */ Ud()), Bi.exports;
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
var ic;
function Fd() {
  if (ic) return Ze;
  ic = 1;
  var a = /* @__PURE__ */ ru(), s = /* @__PURE__ */ Md();
  function u(e) {
    for (var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1; n < arguments.length; n++) t += "&args[]=" + encodeURIComponent(arguments[n]);
    return "Minified React error #" + e + "; visit " + t + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var m = /* @__PURE__ */ new Set(), g = {};
  function _(e, t) {
    w(e, t), w(e + "Capture", t);
  }
  function w(e, t) {
    for (g[e] = t, e = 0; e < t.length; e++) m.add(t[e]);
  }
  var x = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), k = Object.prototype.hasOwnProperty, S = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, j = {}, C = {};
  function M(e) {
    return k.call(C, e) ? !0 : k.call(j, e) ? !1 : S.test(e) ? C[e] = !0 : (j[e] = !0, !1);
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
  function $(e, t, n, r) {
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
  function L(e, t, n, r, l, o, i) {
    this.acceptsBooleans = t === 2 || t === 3 || t === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = n, this.propertyName = e, this.type = t, this.sanitizeURL = o, this.removeEmptyString = i;
  }
  var A = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e) {
    A[e] = new L(e, 0, !1, e, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
    var t = e[0];
    A[t] = new L(t, 1, !1, e[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
    A[e] = new L(e, 2, !1, e.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
    A[e] = new L(e, 2, !1, e, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e) {
    A[e] = new L(e, 3, !1, e.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(e) {
    A[e] = new L(e, 3, !0, e, null, !1, !1);
  }), ["capture", "download"].forEach(function(e) {
    A[e] = new L(e, 4, !1, e, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(e) {
    A[e] = new L(e, 6, !1, e, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(e) {
    A[e] = new L(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  var b = /[\-:]([a-z])/g;
  function le(e) {
    return e[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e) {
    var t = e.replace(
      b,
      le
    );
    A[t] = new L(t, 1, !1, e, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e) {
    var t = e.replace(b, le);
    A[t] = new L(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(e) {
    var t = e.replace(b, le);
    A[t] = new L(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(e) {
    A[e] = new L(e, 1, !1, e.toLowerCase(), null, !1, !1);
  }), A.xlinkHref = new L("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(e) {
    A[e] = new L(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  function z(e, t, n, r) {
    var l = A.hasOwnProperty(t) ? A[t] : null;
    (l !== null ? l.type !== 0 : r || !(2 < t.length) || t[0] !== "o" && t[0] !== "O" || t[1] !== "n" && t[1] !== "N") && ($(t, n, l, r) && (n = null), r || l === null ? M(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : l.mustUseProperty ? e[l.propertyName] = n === null ? l.type === 3 ? !1 : "" : n : (t = l.attributeName, r = l.attributeNamespace, n === null ? e.removeAttribute(t) : (l = l.type, n = l === 3 || l === 4 && n === !0 ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }
  var se = a.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, ce = Symbol.for("react.element"), ee = Symbol.for("react.portal"), ve = Symbol.for("react.fragment"), me = Symbol.for("react.strict_mode"), Qe = Symbol.for("react.profiler"), ge = Symbol.for("react.provider"), qe = Symbol.for("react.context"), _e = Symbol.for("react.forward_ref"), D = Symbol.for("react.suspense"), ke = Symbol.for("react.suspense_list"), Pe = Symbol.for("react.memo"), Oe = Symbol.for("react.lazy"), fe = Symbol.for("react.offscreen"), O = Symbol.iterator;
  function Q(e) {
    return e === null || typeof e != "object" ? null : (e = O && e[O] || e["@@iterator"], typeof e == "function" ? e : null);
  }
  var U = Object.assign, f;
  function E(e) {
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
  function G(e, t) {
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
`), i = l.length - 1, c = o.length - 1; 1 <= i && 0 <= c && l[i] !== o[c]; ) c--;
        for (; 1 <= i && 0 <= c; i--, c--) if (l[i] !== o[c]) {
          if (i !== 1 || c !== 1)
            do
              if (i--, c--, 0 > c || l[i] !== o[c]) {
                var d = `
` + l[i].replace(" at new ", " at ");
                return e.displayName && d.includes("<anonymous>") && (d = d.replace("<anonymous>", e.displayName)), d;
              }
            while (1 <= i && 0 <= c);
          break;
        }
      }
    } finally {
      H = !1, Error.prepareStackTrace = n;
    }
    return (e = e ? e.displayName || e.name : "") ? E(e) : "";
  }
  function Z(e) {
    switch (e.tag) {
      case 5:
        return E(e.type);
      case 16:
        return E("Lazy");
      case 13:
        return E("Suspense");
      case 19:
        return E("SuspenseList");
      case 0:
      case 2:
      case 15:
        return e = G(e.type, !1), e;
      case 11:
        return e = G(e.type.render, !1), e;
      case 1:
        return e = G(e.type, !0), e;
      default:
        return "";
    }
  }
  function ne(e) {
    if (e == null) return null;
    if (typeof e == "function") return e.displayName || e.name || null;
    if (typeof e == "string") return e;
    switch (e) {
      case ve:
        return "Fragment";
      case ee:
        return "Portal";
      case Qe:
        return "Profiler";
      case me:
        return "StrictMode";
      case D:
        return "Suspense";
      case ke:
        return "SuspenseList";
    }
    if (typeof e == "object") switch (e.$$typeof) {
      case qe:
        return (e.displayName || "Context") + ".Consumer";
      case ge:
        return (e._context.displayName || "Context") + ".Provider";
      case _e:
        var t = e.render;
        return e = e.displayName, e || (e = t.displayName || t.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
      case Pe:
        return t = e.displayName || null, t !== null ? t : ne(e.type) || "Memo";
      case Oe:
        t = e._payload, e = e._init;
        try {
          return ne(e(t));
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
        return ne(t);
      case 8:
        return t === me ? "StrictMode" : "Mode";
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
  function ue(e) {
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
  function Ir(e) {
    e._valueTracker || (e._valueTracker = be(e));
  }
  function iu(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(), r = "";
    return e && (r = we(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== n ? (t.setValue(e), !0) : !1;
  }
  function Rr(e) {
    if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function Hl(e, t) {
    var n = t.checked;
    return U({}, t, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: n ?? e._wrapperState.initialChecked });
  }
  function uu(e, t) {
    var n = t.defaultValue == null ? "" : t.defaultValue, r = t.checked != null ? t.checked : t.defaultChecked;
    n = ue(t.value != null ? t.value : n), e._wrapperState = { initialChecked: r, initialValue: n, controlled: t.type === "checkbox" || t.type === "radio" ? t.checked != null : t.value != null };
  }
  function au(e, t) {
    t = t.checked, t != null && z(e, "checked", t, !1);
  }
  function $l(e, t) {
    au(e, t);
    var n = ue(t.value), r = t.type;
    if (n != null) r === "number" ? (n === 0 && e.value === "" || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);
    else if (r === "submit" || r === "reset") {
      e.removeAttribute("value");
      return;
    }
    t.hasOwnProperty("value") ? Kl(e, t.type, n) : t.hasOwnProperty("defaultValue") && Kl(e, t.type, ue(t.defaultValue)), t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked);
  }
  function su(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!(r !== "submit" && r !== "reset" || t.value !== void 0 && t.value !== null)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }
    n = e.name, n !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, n !== "" && (e.name = n);
  }
  function Kl(e, t, n) {
    (t !== "number" || Rr(e.ownerDocument) !== e) && (n == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }
  var Mn = Array.isArray;
  function fn(e, t, n, r) {
    if (e = e.options, t) {
      t = {};
      for (var l = 0; l < n.length; l++) t["$" + n[l]] = !0;
      for (n = 0; n < e.length; n++) l = t.hasOwnProperty("$" + e[n].value), e[n].selected !== l && (e[n].selected = l), l && r && (e[n].defaultSelected = !0);
    } else {
      for (n = "" + ue(n), t = null, l = 0; l < e.length; l++) {
        if (e[l].value === n) {
          e[l].selected = !0, r && (e[l].defaultSelected = !0);
          return;
        }
        t !== null || e[l].disabled || (t = e[l]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function Yl(e, t) {
    if (t.dangerouslySetInnerHTML != null) throw Error(u(91));
    return U({}, t, { value: void 0, defaultValue: void 0, children: "" + e._wrapperState.initialValue });
  }
  function cu(e, t) {
    var n = t.value;
    if (n == null) {
      if (n = t.children, t = t.defaultValue, n != null) {
        if (t != null) throw Error(u(92));
        if (Mn(n)) {
          if (1 < n.length) throw Error(u(93));
          n = n[0];
        }
        t = n;
      }
      t == null && (t = ""), n = t;
    }
    e._wrapperState = { initialValue: ue(n) };
  }
  function fu(e, t) {
    var n = ue(t.value), r = ue(t.defaultValue);
    n != null && (n = "" + n, n !== e.value && (e.value = n), t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)), r != null && (e.defaultValue = "" + r);
  }
  function du(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
  }
  function pu(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function Gl(e, t) {
    return e == null || e === "http://www.w3.org/1999/xhtml" ? pu(t) : e === "http://www.w3.org/2000/svg" && t === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
  }
  var Lr, mu = (function(e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, n, r, l) {
      MSApp.execUnsafeLocalFunction(function() {
        return e(t, n, r, l);
      });
    } : e;
  })(function(e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = t;
    else {
      for (Lr = Lr || document.createElement("div"), Lr.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>", t = Lr.firstChild; e.firstChild; ) e.removeChild(e.firstChild);
      for (; t.firstChild; ) e.appendChild(t.firstChild);
    }
  });
  function Fn(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var Vn = {
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
  }, Uc = ["Webkit", "ms", "Moz", "O"];
  Object.keys(Vn).forEach(function(e) {
    Uc.forEach(function(t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Vn[t] = Vn[e];
    });
  });
  function hu(e, t, n) {
    return t == null || typeof t == "boolean" || t === "" ? "" : n || typeof t != "number" || t === 0 || Vn.hasOwnProperty(e) && Vn[e] ? ("" + t).trim() : t + "px";
  }
  function yu(e, t) {
    e = e.style;
    for (var n in t) if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0, l = hu(n, t[n], r);
      n === "float" && (n = "cssFloat"), r ? e.setProperty(n, l) : e[n] = l;
    }
  }
  var Mc = U({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function Xl(e, t) {
    if (t) {
      if (Mc[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(u(137, e));
      if (t.dangerouslySetInnerHTML != null) {
        if (t.children != null) throw Error(u(60));
        if (typeof t.dangerouslySetInnerHTML != "object" || !("__html" in t.dangerouslySetInnerHTML)) throw Error(u(61));
      }
      if (t.style != null && typeof t.style != "object") throw Error(u(62));
    }
  }
  function Jl(e, t) {
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
  var Zl = null;
  function bl(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
  }
  var eo = null, dn = null, pn = null;
  function vu(e) {
    if (e = ar(e)) {
      if (typeof eo != "function") throw Error(u(280));
      var t = e.stateNode;
      t && (t = br(t), eo(e.stateNode, e.type, t));
    }
  }
  function gu(e) {
    dn ? pn ? pn.push(e) : pn = [e] : dn = e;
  }
  function wu() {
    if (dn) {
      var e = dn, t = pn;
      if (pn = dn = null, vu(e), t) for (e = 0; e < t.length; e++) vu(t[e]);
    }
  }
  function Su(e, t) {
    return e(t);
  }
  function _u() {
  }
  var to = !1;
  function ku(e, t, n) {
    if (to) return e(t, n);
    to = !0;
    try {
      return Su(e, t, n);
    } finally {
      to = !1, (dn !== null || pn !== null) && (_u(), wu());
    }
  }
  function Wn(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var r = br(n);
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
  var no = !1;
  if (x) try {
    var Bn = {};
    Object.defineProperty(Bn, "passive", { get: function() {
      no = !0;
    } }), window.addEventListener("test", Bn, Bn), window.removeEventListener("test", Bn, Bn);
  } catch {
    no = !1;
  }
  function Fc(e, t, n, r, l, o, i, c, d) {
    var v = Array.prototype.slice.call(arguments, 3);
    try {
      t.apply(n, v);
    } catch (I) {
      this.onError(I);
    }
  }
  var Qn = !1, Tr = null, Or = !1, ro = null, Vc = { onError: function(e) {
    Qn = !0, Tr = e;
  } };
  function Wc(e, t, n, r, l, o, i, c, d) {
    Qn = !1, Tr = null, Fc.apply(Vc, arguments);
  }
  function Bc(e, t, n, r, l, o, i, c, d) {
    if (Wc.apply(this, arguments), Qn) {
      if (Qn) {
        var v = Tr;
        Qn = !1, Tr = null;
      } else throw Error(u(198));
      Or || (Or = !0, ro = v);
    }
  }
  function Jt(e) {
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
  function Eu(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if (t === null && (e = e.alternate, e !== null && (t = e.memoizedState)), t !== null) return t.dehydrated;
    }
    return null;
  }
  function Cu(e) {
    if (Jt(e) !== e) throw Error(u(188));
  }
  function Qc(e) {
    var t = e.alternate;
    if (!t) {
      if (t = Jt(e), t === null) throw Error(u(188));
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
          if (o === n) return Cu(l), e;
          if (o === r) return Cu(l), t;
          o = o.sibling;
        }
        throw Error(u(188));
      }
      if (n.return !== r.return) n = l, r = o;
      else {
        for (var i = !1, c = l.child; c; ) {
          if (c === n) {
            i = !0, n = l, r = o;
            break;
          }
          if (c === r) {
            i = !0, r = l, n = o;
            break;
          }
          c = c.sibling;
        }
        if (!i) {
          for (c = o.child; c; ) {
            if (c === n) {
              i = !0, n = o, r = l;
              break;
            }
            if (c === r) {
              i = !0, r = o, n = l;
              break;
            }
            c = c.sibling;
          }
          if (!i) throw Error(u(189));
        }
      }
      if (n.alternate !== r) throw Error(u(190));
    }
    if (n.tag !== 3) throw Error(u(188));
    return n.stateNode.current === n ? e : t;
  }
  function xu(e) {
    return e = Qc(e), e !== null ? Pu(e) : null;
  }
  function Pu(e) {
    if (e.tag === 5 || e.tag === 6) return e;
    for (e = e.child; e !== null; ) {
      var t = Pu(e);
      if (t !== null) return t;
      e = e.sibling;
    }
    return null;
  }
  var Nu = s.unstable_scheduleCallback, Iu = s.unstable_cancelCallback, qc = s.unstable_shouldYield, Hc = s.unstable_requestPaint, Ne = s.unstable_now, $c = s.unstable_getCurrentPriorityLevel, lo = s.unstable_ImmediatePriority, Ru = s.unstable_UserBlockingPriority, jr = s.unstable_NormalPriority, Kc = s.unstable_LowPriority, Lu = s.unstable_IdlePriority, zr = null, gt = null;
  function Yc(e) {
    if (gt && typeof gt.onCommitFiberRoot == "function") try {
      gt.onCommitFiberRoot(zr, e, void 0, (e.current.flags & 128) === 128);
    } catch {
    }
  }
  var ft = Math.clz32 ? Math.clz32 : Jc, Gc = Math.log, Xc = Math.LN2;
  function Jc(e) {
    return e >>>= 0, e === 0 ? 32 : 31 - (Gc(e) / Xc | 0) | 0;
  }
  var Ar = 64, Dr = 4194304;
  function qn(e) {
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
  function Ur(e, t) {
    var n = e.pendingLanes;
    if (n === 0) return 0;
    var r = 0, l = e.suspendedLanes, o = e.pingedLanes, i = n & 268435455;
    if (i !== 0) {
      var c = i & ~l;
      c !== 0 ? r = qn(c) : (o &= i, o !== 0 && (r = qn(o)));
    } else i = n & ~l, i !== 0 ? r = qn(i) : o !== 0 && (r = qn(o));
    if (r === 0) return 0;
    if (t !== 0 && t !== r && (t & l) === 0 && (l = r & -r, o = t & -t, l >= o || l === 16 && (o & 4194240) !== 0)) return t;
    if ((r & 4) !== 0 && (r |= n & 16), t = e.entangledLanes, t !== 0) for (e = e.entanglements, t &= r; 0 < t; ) n = 31 - ft(t), l = 1 << n, r |= e[n], t &= ~l;
    return r;
  }
  function Zc(e, t) {
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
  function bc(e, t) {
    for (var n = e.suspendedLanes, r = e.pingedLanes, l = e.expirationTimes, o = e.pendingLanes; 0 < o; ) {
      var i = 31 - ft(o), c = 1 << i, d = l[i];
      d === -1 ? ((c & n) === 0 || (c & r) !== 0) && (l[i] = Zc(c, t)) : d <= t && (e.expiredLanes |= c), o &= ~c;
    }
  }
  function oo(e) {
    return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
  }
  function Tu() {
    var e = Ar;
    return Ar <<= 1, (Ar & 4194240) === 0 && (Ar = 64), e;
  }
  function io(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function Hn(e, t, n) {
    e.pendingLanes |= t, t !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, t = 31 - ft(t), e[t] = n;
  }
  function ef(e, t) {
    var n = e.pendingLanes & ~t;
    e.pendingLanes = t, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t, t = e.entanglements;
    var r = e.eventTimes;
    for (e = e.expirationTimes; 0 < n; ) {
      var l = 31 - ft(n), o = 1 << l;
      t[l] = 0, r[l] = -1, e[l] = -1, n &= ~o;
    }
  }
  function uo(e, t) {
    var n = e.entangledLanes |= t;
    for (e = e.entanglements; n; ) {
      var r = 31 - ft(n), l = 1 << r;
      l & t | e[r] & t && (e[r] |= t), n &= ~l;
    }
  }
  var ae = 0;
  function Ou(e) {
    return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
  }
  var ju, ao, zu, Au, Du, so = !1, Mr = [], Ot = null, jt = null, zt = null, $n = /* @__PURE__ */ new Map(), Kn = /* @__PURE__ */ new Map(), At = [], tf = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Uu(e, t) {
    switch (e) {
      case "focusin":
      case "focusout":
        Ot = null;
        break;
      case "dragenter":
      case "dragleave":
        jt = null;
        break;
      case "mouseover":
      case "mouseout":
        zt = null;
        break;
      case "pointerover":
      case "pointerout":
        $n.delete(t.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Kn.delete(t.pointerId);
    }
  }
  function Yn(e, t, n, r, l, o) {
    return e === null || e.nativeEvent !== o ? (e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: o, targetContainers: [l] }, t !== null && (t = ar(t), t !== null && ao(t)), e) : (e.eventSystemFlags |= r, t = e.targetContainers, l !== null && t.indexOf(l) === -1 && t.push(l), e);
  }
  function nf(e, t, n, r, l) {
    switch (t) {
      case "focusin":
        return Ot = Yn(Ot, e, t, n, r, l), !0;
      case "dragenter":
        return jt = Yn(jt, e, t, n, r, l), !0;
      case "mouseover":
        return zt = Yn(zt, e, t, n, r, l), !0;
      case "pointerover":
        var o = l.pointerId;
        return $n.set(o, Yn($n.get(o) || null, e, t, n, r, l)), !0;
      case "gotpointercapture":
        return o = l.pointerId, Kn.set(o, Yn(Kn.get(o) || null, e, t, n, r, l)), !0;
    }
    return !1;
  }
  function Mu(e) {
    var t = Zt(e.target);
    if (t !== null) {
      var n = Jt(t);
      if (n !== null) {
        if (t = n.tag, t === 13) {
          if (t = Eu(n), t !== null) {
            e.blockedOn = t, Du(e.priority, function() {
              zu(n);
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
  function Fr(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length; ) {
      var n = fo(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var r = new n.constructor(n.type, n);
        Zl = r, n.target.dispatchEvent(r), Zl = null;
      } else return t = ar(n), t !== null && ao(t), e.blockedOn = n, !1;
      t.shift();
    }
    return !0;
  }
  function Fu(e, t, n) {
    Fr(e) && n.delete(t);
  }
  function rf() {
    so = !1, Ot !== null && Fr(Ot) && (Ot = null), jt !== null && Fr(jt) && (jt = null), zt !== null && Fr(zt) && (zt = null), $n.forEach(Fu), Kn.forEach(Fu);
  }
  function Gn(e, t) {
    e.blockedOn === t && (e.blockedOn = null, so || (so = !0, s.unstable_scheduleCallback(s.unstable_NormalPriority, rf)));
  }
  function Xn(e) {
    function t(l) {
      return Gn(l, e);
    }
    if (0 < Mr.length) {
      Gn(Mr[0], e);
      for (var n = 1; n < Mr.length; n++) {
        var r = Mr[n];
        r.blockedOn === e && (r.blockedOn = null);
      }
    }
    for (Ot !== null && Gn(Ot, e), jt !== null && Gn(jt, e), zt !== null && Gn(zt, e), $n.forEach(t), Kn.forEach(t), n = 0; n < At.length; n++) r = At[n], r.blockedOn === e && (r.blockedOn = null);
    for (; 0 < At.length && (n = At[0], n.blockedOn === null); ) Mu(n), n.blockedOn === null && At.shift();
  }
  var mn = se.ReactCurrentBatchConfig, Vr = !0;
  function lf(e, t, n, r) {
    var l = ae, o = mn.transition;
    mn.transition = null;
    try {
      ae = 1, co(e, t, n, r);
    } finally {
      ae = l, mn.transition = o;
    }
  }
  function of(e, t, n, r) {
    var l = ae, o = mn.transition;
    mn.transition = null;
    try {
      ae = 4, co(e, t, n, r);
    } finally {
      ae = l, mn.transition = o;
    }
  }
  function co(e, t, n, r) {
    if (Vr) {
      var l = fo(e, t, n, r);
      if (l === null) Ro(e, t, r, Wr, n), Uu(e, r);
      else if (nf(l, e, t, n, r)) r.stopPropagation();
      else if (Uu(e, r), t & 4 && -1 < tf.indexOf(e)) {
        for (; l !== null; ) {
          var o = ar(l);
          if (o !== null && ju(o), o = fo(e, t, n, r), o === null && Ro(e, t, r, Wr, n), o === l) break;
          l = o;
        }
        l !== null && r.stopPropagation();
      } else Ro(e, t, r, null, n);
    }
  }
  var Wr = null;
  function fo(e, t, n, r) {
    if (Wr = null, e = bl(r), e = Zt(e), e !== null) if (t = Jt(e), t === null) e = null;
    else if (n = t.tag, n === 13) {
      if (e = Eu(t), e !== null) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
    return Wr = e, null;
  }
  function Vu(e) {
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
        switch ($c()) {
          case lo:
            return 1;
          case Ru:
            return 4;
          case jr:
          case Kc:
            return 16;
          case Lu:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Dt = null, po = null, Br = null;
  function Wu() {
    if (Br) return Br;
    var e, t = po, n = t.length, r, l = "value" in Dt ? Dt.value : Dt.textContent, o = l.length;
    for (e = 0; e < n && t[e] === l[e]; e++) ;
    var i = n - e;
    for (r = 1; r <= i && t[n - r] === l[o - r]; r++) ;
    return Br = l.slice(e, 1 < r ? 1 - r : void 0);
  }
  function Qr(e) {
    var t = e.keyCode;
    return "charCode" in e ? (e = e.charCode, e === 0 && t === 13 && (e = 13)) : e = t, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
  }
  function qr() {
    return !0;
  }
  function Bu() {
    return !1;
  }
  function et(e) {
    function t(n, r, l, o, i) {
      this._reactName = n, this._targetInst = l, this.type = r, this.nativeEvent = o, this.target = i, this.currentTarget = null;
      for (var c in e) e.hasOwnProperty(c) && (n = e[c], this[c] = n ? n(o) : o[c]);
      return this.isDefaultPrevented = (o.defaultPrevented != null ? o.defaultPrevented : o.returnValue === !1) ? qr : Bu, this.isPropagationStopped = Bu, this;
    }
    return U(t.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var n = this.nativeEvent;
      n && (n.preventDefault ? n.preventDefault() : typeof n.returnValue != "unknown" && (n.returnValue = !1), this.isDefaultPrevented = qr);
    }, stopPropagation: function() {
      var n = this.nativeEvent;
      n && (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0), this.isPropagationStopped = qr);
    }, persist: function() {
    }, isPersistent: qr }), t;
  }
  var hn = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(e) {
    return e.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, mo = et(hn), Jn = U({}, hn, { view: 0, detail: 0 }), uf = et(Jn), ho, yo, Zn, Hr = U({}, Jn, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: go, button: 0, buttons: 0, relatedTarget: function(e) {
    return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
  }, movementX: function(e) {
    return "movementX" in e ? e.movementX : (e !== Zn && (Zn && e.type === "mousemove" ? (ho = e.screenX - Zn.screenX, yo = e.screenY - Zn.screenY) : yo = ho = 0, Zn = e), ho);
  }, movementY: function(e) {
    return "movementY" in e ? e.movementY : yo;
  } }), Qu = et(Hr), af = U({}, Hr, { dataTransfer: 0 }), sf = et(af), cf = U({}, Jn, { relatedTarget: 0 }), vo = et(cf), ff = U({}, hn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), df = et(ff), pf = U({}, hn, { clipboardData: function(e) {
    return "clipboardData" in e ? e.clipboardData : window.clipboardData;
  } }), mf = et(pf), hf = U({}, hn, { data: 0 }), qu = et(hf), yf = {
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
  }, vf = {
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
  }, gf = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function wf(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = gf[e]) ? !!t[e] : !1;
  }
  function go() {
    return wf;
  }
  var Sf = U({}, Jn, { key: function(e) {
    if (e.key) {
      var t = yf[e.key] || e.key;
      if (t !== "Unidentified") return t;
    }
    return e.type === "keypress" ? (e = Qr(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? vf[e.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: go, charCode: function(e) {
    return e.type === "keypress" ? Qr(e) : 0;
  }, keyCode: function(e) {
    return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  }, which: function(e) {
    return e.type === "keypress" ? Qr(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
  } }), _f = et(Sf), kf = U({}, Hr, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Hu = et(kf), Ef = U({}, Jn, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: go }), Cf = et(Ef), xf = U({}, hn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Pf = et(xf), Nf = U({}, Hr, {
    deltaX: function(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), If = et(Nf), Rf = [9, 13, 27, 32], wo = x && "CompositionEvent" in window, bn = null;
  x && "documentMode" in document && (bn = document.documentMode);
  var Lf = x && "TextEvent" in window && !bn, $u = x && (!wo || bn && 8 < bn && 11 >= bn), Ku = " ", Yu = !1;
  function Gu(e, t) {
    switch (e) {
      case "keyup":
        return Rf.indexOf(t.keyCode) !== -1;
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
  function Xu(e) {
    return e = e.detail, typeof e == "object" && "data" in e ? e.data : null;
  }
  var yn = !1;
  function Tf(e, t) {
    switch (e) {
      case "compositionend":
        return Xu(t);
      case "keypress":
        return t.which !== 32 ? null : (Yu = !0, Ku);
      case "textInput":
        return e = t.data, e === Ku && Yu ? null : e;
      default:
        return null;
    }
  }
  function Of(e, t) {
    if (yn) return e === "compositionend" || !wo && Gu(e, t) ? (e = Wu(), Br = po = Dt = null, yn = !1, e) : null;
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
        return $u && t.locale !== "ko" ? null : t.data;
      default:
        return null;
    }
  }
  var jf = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Ju(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === "input" ? !!jf[e.type] : t === "textarea";
  }
  function Zu(e, t, n, r) {
    gu(r), t = Xr(t, "onChange"), 0 < t.length && (n = new mo("onChange", "change", null, n, r), e.push({ event: n, listeners: t }));
  }
  var er = null, tr = null;
  function zf(e) {
    ya(e, 0);
  }
  function $r(e) {
    var t = _n(e);
    if (iu(t)) return e;
  }
  function Af(e, t) {
    if (e === "change") return t;
  }
  var bu = !1;
  if (x) {
    var So;
    if (x) {
      var _o = "oninput" in document;
      if (!_o) {
        var ea = document.createElement("div");
        ea.setAttribute("oninput", "return;"), _o = typeof ea.oninput == "function";
      }
      So = _o;
    } else So = !1;
    bu = So && (!document.documentMode || 9 < document.documentMode);
  }
  function ta() {
    er && (er.detachEvent("onpropertychange", na), tr = er = null);
  }
  function na(e) {
    if (e.propertyName === "value" && $r(tr)) {
      var t = [];
      Zu(t, tr, e, bl(e)), ku(zf, t);
    }
  }
  function Df(e, t, n) {
    e === "focusin" ? (ta(), er = t, tr = n, er.attachEvent("onpropertychange", na)) : e === "focusout" && ta();
  }
  function Uf(e) {
    if (e === "selectionchange" || e === "keyup" || e === "keydown") return $r(tr);
  }
  function Mf(e, t) {
    if (e === "click") return $r(t);
  }
  function Ff(e, t) {
    if (e === "input" || e === "change") return $r(t);
  }
  function Vf(e, t) {
    return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
  }
  var dt = typeof Object.is == "function" ? Object.is : Vf;
  function nr(e, t) {
    if (dt(e, t)) return !0;
    if (typeof e != "object" || e === null || typeof t != "object" || t === null) return !1;
    var n = Object.keys(e), r = Object.keys(t);
    if (n.length !== r.length) return !1;
    for (r = 0; r < n.length; r++) {
      var l = n[r];
      if (!k.call(t, l) || !dt(e[l], t[l])) return !1;
    }
    return !0;
  }
  function ra(e) {
    for (; e && e.firstChild; ) e = e.firstChild;
    return e;
  }
  function la(e, t) {
    var n = ra(e);
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
      n = ra(n);
    }
  }
  function oa(e, t) {
    return e && t ? e === t ? !0 : e && e.nodeType === 3 ? !1 : t && t.nodeType === 3 ? oa(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1 : !1;
  }
  function ia() {
    for (var e = window, t = Rr(); t instanceof e.HTMLIFrameElement; ) {
      try {
        var n = typeof t.contentWindow.location.href == "string";
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Rr(e.document);
    }
    return t;
  }
  function ko(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
  }
  function Wf(e) {
    var t = ia(), n = e.focusedElem, r = e.selectionRange;
    if (t !== n && n && n.ownerDocument && oa(n.ownerDocument.documentElement, n)) {
      if (r !== null && ko(n)) {
        if (t = r.start, e = r.end, e === void 0 && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);
        else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
          e = e.getSelection();
          var l = n.textContent.length, o = Math.min(r.start, l);
          r = r.end === void 0 ? o : Math.min(r.end, l), !e.extend && o > r && (l = r, r = o, o = l), l = la(n, o);
          var i = la(
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
  var Bf = x && "documentMode" in document && 11 >= document.documentMode, vn = null, Eo = null, rr = null, Co = !1;
  function ua(e, t, n) {
    var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    Co || vn == null || vn !== Rr(r) || (r = vn, "selectionStart" in r && ko(r) ? r = { start: r.selectionStart, end: r.selectionEnd } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = { anchorNode: r.anchorNode, anchorOffset: r.anchorOffset, focusNode: r.focusNode, focusOffset: r.focusOffset }), rr && nr(rr, r) || (rr = r, r = Xr(Eo, "onSelect"), 0 < r.length && (t = new mo("onSelect", "select", null, t, n), e.push({ event: t, listeners: r }), t.target = vn)));
  }
  function Kr(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }
  var gn = { animationend: Kr("Animation", "AnimationEnd"), animationiteration: Kr("Animation", "AnimationIteration"), animationstart: Kr("Animation", "AnimationStart"), transitionend: Kr("Transition", "TransitionEnd") }, xo = {}, aa = {};
  x && (aa = document.createElement("div").style, "AnimationEvent" in window || (delete gn.animationend.animation, delete gn.animationiteration.animation, delete gn.animationstart.animation), "TransitionEvent" in window || delete gn.transitionend.transition);
  function Yr(e) {
    if (xo[e]) return xo[e];
    if (!gn[e]) return e;
    var t = gn[e], n;
    for (n in t) if (t.hasOwnProperty(n) && n in aa) return xo[e] = t[n];
    return e;
  }
  var sa = Yr("animationend"), ca = Yr("animationiteration"), fa = Yr("animationstart"), da = Yr("transitionend"), pa = /* @__PURE__ */ new Map(), ma = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Ut(e, t) {
    pa.set(e, t), _(t, [e]);
  }
  for (var Po = 0; Po < ma.length; Po++) {
    var No = ma[Po], Qf = No.toLowerCase(), qf = No[0].toUpperCase() + No.slice(1);
    Ut(Qf, "on" + qf);
  }
  Ut(sa, "onAnimationEnd"), Ut(ca, "onAnimationIteration"), Ut(fa, "onAnimationStart"), Ut("dblclick", "onDoubleClick"), Ut("focusin", "onFocus"), Ut("focusout", "onBlur"), Ut(da, "onTransitionEnd"), w("onMouseEnter", ["mouseout", "mouseover"]), w("onMouseLeave", ["mouseout", "mouseover"]), w("onPointerEnter", ["pointerout", "pointerover"]), w("onPointerLeave", ["pointerout", "pointerover"]), _("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), _("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), _("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), _("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), _("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), _("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var lr = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), Hf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lr));
  function ha(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = n, Bc(r, t, void 0, e), e.currentTarget = null;
  }
  function ya(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var r = e[n], l = r.event;
      r = r.listeners;
      e: {
        var o = void 0;
        if (t) for (var i = r.length - 1; 0 <= i; i--) {
          var c = r[i], d = c.instance, v = c.currentTarget;
          if (c = c.listener, d !== o && l.isPropagationStopped()) break e;
          ha(l, c, v), o = d;
        }
        else for (i = 0; i < r.length; i++) {
          if (c = r[i], d = c.instance, v = c.currentTarget, c = c.listener, d !== o && l.isPropagationStopped()) break e;
          ha(l, c, v), o = d;
        }
      }
    }
    if (Or) throw e = ro, Or = !1, ro = null, e;
  }
  function he(e, t) {
    var n = t[Ao];
    n === void 0 && (n = t[Ao] = /* @__PURE__ */ new Set());
    var r = e + "__bubble";
    n.has(r) || (va(t, e, 2, !1), n.add(r));
  }
  function Io(e, t, n) {
    var r = 0;
    t && (r |= 4), va(n, e, r, t);
  }
  var Gr = "_reactListening" + Math.random().toString(36).slice(2);
  function or(e) {
    if (!e[Gr]) {
      e[Gr] = !0, m.forEach(function(n) {
        n !== "selectionchange" && (Hf.has(n) || Io(n, !1, e), Io(n, !0, e));
      });
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Gr] || (t[Gr] = !0, Io("selectionchange", !1, t));
    }
  }
  function va(e, t, n, r) {
    switch (Vu(t)) {
      case 1:
        var l = lf;
        break;
      case 4:
        l = of;
        break;
      default:
        l = co;
    }
    n = l.bind(null, t, n, e), l = void 0, !no || t !== "touchstart" && t !== "touchmove" && t !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(t, n, { capture: !0, passive: l }) : e.addEventListener(t, n, !0) : l !== void 0 ? e.addEventListener(t, n, { passive: l }) : e.addEventListener(t, n, !1);
  }
  function Ro(e, t, n, r, l) {
    var o = r;
    if ((t & 1) === 0 && (t & 2) === 0 && r !== null) e: for (; ; ) {
      if (r === null) return;
      var i = r.tag;
      if (i === 3 || i === 4) {
        var c = r.stateNode.containerInfo;
        if (c === l || c.nodeType === 8 && c.parentNode === l) break;
        if (i === 4) for (i = r.return; i !== null; ) {
          var d = i.tag;
          if ((d === 3 || d === 4) && (d = i.stateNode.containerInfo, d === l || d.nodeType === 8 && d.parentNode === l)) return;
          i = i.return;
        }
        for (; c !== null; ) {
          if (i = Zt(c), i === null) return;
          if (d = i.tag, d === 5 || d === 6) {
            r = o = i;
            continue e;
          }
          c = c.parentNode;
        }
      }
      r = r.return;
    }
    ku(function() {
      var v = o, I = bl(n), R = [];
      e: {
        var P = pa.get(e);
        if (P !== void 0) {
          var F = mo, W = e;
          switch (e) {
            case "keypress":
              if (Qr(n) === 0) break e;
            case "keydown":
            case "keyup":
              F = _f;
              break;
            case "focusin":
              W = "focus", F = vo;
              break;
            case "focusout":
              W = "blur", F = vo;
              break;
            case "beforeblur":
            case "afterblur":
              F = vo;
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
              F = Qu;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              F = sf;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              F = Cf;
              break;
            case sa:
            case ca:
            case fa:
              F = df;
              break;
            case da:
              F = Pf;
              break;
            case "scroll":
              F = uf;
              break;
            case "wheel":
              F = If;
              break;
            case "copy":
            case "cut":
            case "paste":
              F = mf;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              F = Hu;
          }
          var B = (t & 4) !== 0, Ie = !B && e === "scroll", h = B ? P !== null ? P + "Capture" : null : P;
          B = [];
          for (var p = v, y; p !== null; ) {
            y = p;
            var T = y.stateNode;
            if (y.tag === 5 && T !== null && (y = T, h !== null && (T = Wn(p, h), T != null && B.push(ir(p, T, y)))), Ie) break;
            p = p.return;
          }
          0 < B.length && (P = new F(P, W, null, n, I), R.push({ event: P, listeners: B }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (P = e === "mouseover" || e === "pointerover", F = e === "mouseout" || e === "pointerout", P && n !== Zl && (W = n.relatedTarget || n.fromElement) && (Zt(W) || W[Et])) break e;
          if ((F || P) && (P = I.window === I ? I : (P = I.ownerDocument) ? P.defaultView || P.parentWindow : window, F ? (W = n.relatedTarget || n.toElement, F = v, W = W ? Zt(W) : null, W !== null && (Ie = Jt(W), W !== Ie || W.tag !== 5 && W.tag !== 6) && (W = null)) : (F = null, W = v), F !== W)) {
            if (B = Qu, T = "onMouseLeave", h = "onMouseEnter", p = "mouse", (e === "pointerout" || e === "pointerover") && (B = Hu, T = "onPointerLeave", h = "onPointerEnter", p = "pointer"), Ie = F == null ? P : _n(F), y = W == null ? P : _n(W), P = new B(T, p + "leave", F, n, I), P.target = Ie, P.relatedTarget = y, T = null, Zt(I) === v && (B = new B(h, p + "enter", W, n, I), B.target = y, B.relatedTarget = Ie, T = B), Ie = T, F && W) t: {
              for (B = F, h = W, p = 0, y = B; y; y = wn(y)) p++;
              for (y = 0, T = h; T; T = wn(T)) y++;
              for (; 0 < p - y; ) B = wn(B), p--;
              for (; 0 < y - p; ) h = wn(h), y--;
              for (; p--; ) {
                if (B === h || h !== null && B === h.alternate) break t;
                B = wn(B), h = wn(h);
              }
              B = null;
            }
            else B = null;
            F !== null && ga(R, P, F, B, !1), W !== null && Ie !== null && ga(R, Ie, W, B, !0);
          }
        }
        e: {
          if (P = v ? _n(v) : window, F = P.nodeName && P.nodeName.toLowerCase(), F === "select" || F === "input" && P.type === "file") var q = Af;
          else if (Ju(P)) if (bu) q = Ff;
          else {
            q = Uf;
            var K = Df;
          }
          else (F = P.nodeName) && F.toLowerCase() === "input" && (P.type === "checkbox" || P.type === "radio") && (q = Mf);
          if (q && (q = q(e, v))) {
            Zu(R, q, n, I);
            break e;
          }
          K && K(e, P, v), e === "focusout" && (K = P._wrapperState) && K.controlled && P.type === "number" && Kl(P, "number", P.value);
        }
        switch (K = v ? _n(v) : window, e) {
          case "focusin":
            (Ju(K) || K.contentEditable === "true") && (vn = K, Eo = v, rr = null);
            break;
          case "focusout":
            rr = Eo = vn = null;
            break;
          case "mousedown":
            Co = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Co = !1, ua(R, n, I);
            break;
          case "selectionchange":
            if (Bf) break;
          case "keydown":
          case "keyup":
            ua(R, n, I);
        }
        var Y;
        if (wo) e: {
          switch (e) {
            case "compositionstart":
              var X = "onCompositionStart";
              break e;
            case "compositionend":
              X = "onCompositionEnd";
              break e;
            case "compositionupdate":
              X = "onCompositionUpdate";
              break e;
          }
          X = void 0;
        }
        else yn ? Gu(e, n) && (X = "onCompositionEnd") : e === "keydown" && n.keyCode === 229 && (X = "onCompositionStart");
        X && ($u && n.locale !== "ko" && (yn || X !== "onCompositionStart" ? X === "onCompositionEnd" && yn && (Y = Wu()) : (Dt = I, po = "value" in Dt ? Dt.value : Dt.textContent, yn = !0)), K = Xr(v, X), 0 < K.length && (X = new qu(X, e, null, n, I), R.push({ event: X, listeners: K }), Y ? X.data = Y : (Y = Xu(n), Y !== null && (X.data = Y)))), (Y = Lf ? Tf(e, n) : Of(e, n)) && (v = Xr(v, "onBeforeInput"), 0 < v.length && (I = new qu("onBeforeInput", "beforeinput", null, n, I), R.push({ event: I, listeners: v }), I.data = Y));
      }
      ya(R, t);
    });
  }
  function ir(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function Xr(e, t) {
    for (var n = t + "Capture", r = []; e !== null; ) {
      var l = e, o = l.stateNode;
      l.tag === 5 && o !== null && (l = o, o = Wn(e, n), o != null && r.unshift(ir(e, o, l)), o = Wn(e, t), o != null && r.push(ir(e, o, l))), e = e.return;
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
  function ga(e, t, n, r, l) {
    for (var o = t._reactName, i = []; n !== null && n !== r; ) {
      var c = n, d = c.alternate, v = c.stateNode;
      if (d !== null && d === r) break;
      c.tag === 5 && v !== null && (c = v, l ? (d = Wn(n, o), d != null && i.unshift(ir(n, d, c))) : l || (d = Wn(n, o), d != null && i.push(ir(n, d, c)))), n = n.return;
    }
    i.length !== 0 && e.push({ event: t, listeners: i });
  }
  var $f = /\r\n?/g, Kf = /\u0000|\uFFFD/g;
  function wa(e) {
    return (typeof e == "string" ? e : "" + e).replace($f, `
`).replace(Kf, "");
  }
  function Jr(e, t, n) {
    if (t = wa(t), wa(e) !== t && n) throw Error(u(425));
  }
  function Zr() {
  }
  var Lo = null, To = null;
  function Oo(e, t) {
    return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
  }
  var jo = typeof setTimeout == "function" ? setTimeout : void 0, Yf = typeof clearTimeout == "function" ? clearTimeout : void 0, Sa = typeof Promise == "function" ? Promise : void 0, Gf = typeof queueMicrotask == "function" ? queueMicrotask : typeof Sa < "u" ? function(e) {
    return Sa.resolve(null).then(e).catch(Xf);
  } : jo;
  function Xf(e) {
    setTimeout(function() {
      throw e;
    });
  }
  function zo(e, t) {
    var n = t, r = 0;
    do {
      var l = n.nextSibling;
      if (e.removeChild(n), l && l.nodeType === 8) if (n = l.data, n === "/$") {
        if (r === 0) {
          e.removeChild(l), Xn(t);
          return;
        }
        r--;
      } else n !== "$" && n !== "$?" && n !== "$!" || r++;
      n = l;
    } while (n);
    Xn(t);
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
  function _a(e) {
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
  var Sn = Math.random().toString(36).slice(2), wt = "__reactFiber$" + Sn, ur = "__reactProps$" + Sn, Et = "__reactContainer$" + Sn, Ao = "__reactEvents$" + Sn, Jf = "__reactListeners$" + Sn, Zf = "__reactHandles$" + Sn;
  function Zt(e) {
    var t = e[wt];
    if (t) return t;
    for (var n = e.parentNode; n; ) {
      if (t = n[Et] || n[wt]) {
        if (n = t.alternate, t.child !== null || n !== null && n.child !== null) for (e = _a(e); e !== null; ) {
          if (n = e[wt]) return n;
          e = _a(e);
        }
        return t;
      }
      e = n, n = e.parentNode;
    }
    return null;
  }
  function ar(e) {
    return e = e[wt] || e[Et], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
  }
  function _n(e) {
    if (e.tag === 5 || e.tag === 6) return e.stateNode;
    throw Error(u(33));
  }
  function br(e) {
    return e[ur] || null;
  }
  var Do = [], kn = -1;
  function Ft(e) {
    return { current: e };
  }
  function ye(e) {
    0 > kn || (e.current = Do[kn], Do[kn] = null, kn--);
  }
  function pe(e, t) {
    kn++, Do[kn] = e.current, e.current = t;
  }
  var Vt = {}, Fe = Ft(Vt), Ke = Ft(!1), bt = Vt;
  function En(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Vt;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var l = {}, o;
    for (o in n) l[o] = t[o];
    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = l), l;
  }
  function Ye(e) {
    return e = e.childContextTypes, e != null;
  }
  function el() {
    ye(Ke), ye(Fe);
  }
  function ka(e, t, n) {
    if (Fe.current !== Vt) throw Error(u(168));
    pe(Fe, t), pe(Ke, n);
  }
  function Ea(e, t, n) {
    var r = e.stateNode;
    if (t = t.childContextTypes, typeof r.getChildContext != "function") return n;
    r = r.getChildContext();
    for (var l in r) if (!(l in t)) throw Error(u(108, de(e) || "Unknown", l));
    return U({}, n, r);
  }
  function tl(e) {
    return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || Vt, bt = Fe.current, pe(Fe, e), pe(Ke, Ke.current), !0;
  }
  function Ca(e, t, n) {
    var r = e.stateNode;
    if (!r) throw Error(u(169));
    n ? (e = Ea(e, t, bt), r.__reactInternalMemoizedMergedChildContext = e, ye(Ke), ye(Fe), pe(Fe, e)) : ye(Ke), pe(Ke, n);
  }
  var Ct = null, nl = !1, Uo = !1;
  function xa(e) {
    Ct === null ? Ct = [e] : Ct.push(e);
  }
  function bf(e) {
    nl = !0, xa(e);
  }
  function Wt() {
    if (!Uo && Ct !== null) {
      Uo = !0;
      var e = 0, t = ae;
      try {
        var n = Ct;
        for (ae = 1; e < n.length; e++) {
          var r = n[e];
          do
            r = r(!0);
          while (r !== null);
        }
        Ct = null, nl = !1;
      } catch (l) {
        throw Ct !== null && (Ct = Ct.slice(e + 1)), Nu(lo, Wt), l;
      } finally {
        ae = t, Uo = !1;
      }
    }
    return null;
  }
  var Cn = [], xn = 0, rl = null, ll = 0, lt = [], ot = 0, en = null, xt = 1, Pt = "";
  function tn(e, t) {
    Cn[xn++] = ll, Cn[xn++] = rl, rl = e, ll = t;
  }
  function Pa(e, t, n) {
    lt[ot++] = xt, lt[ot++] = Pt, lt[ot++] = en, en = e;
    var r = xt;
    e = Pt;
    var l = 32 - ft(r) - 1;
    r &= ~(1 << l), n += 1;
    var o = 32 - ft(t) + l;
    if (30 < o) {
      var i = l - l % 5;
      o = (r & (1 << i) - 1).toString(32), r >>= i, l -= i, xt = 1 << 32 - ft(t) + l | n << l | r, Pt = o + e;
    } else xt = 1 << o | n << l | r, Pt = e;
  }
  function Mo(e) {
    e.return !== null && (tn(e, 1), Pa(e, 1, 0));
  }
  function Fo(e) {
    for (; e === rl; ) rl = Cn[--xn], Cn[xn] = null, ll = Cn[--xn], Cn[xn] = null;
    for (; e === en; ) en = lt[--ot], lt[ot] = null, Pt = lt[--ot], lt[ot] = null, xt = lt[--ot], lt[ot] = null;
  }
  var tt = null, nt = null, Se = !1, pt = null;
  function Na(e, t) {
    var n = st(5, null, null, 0);
    n.elementType = "DELETED", n.stateNode = t, n.return = e, t = e.deletions, t === null ? (e.deletions = [n], e.flags |= 16) : t.push(n);
  }
  function Ia(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t, t !== null ? (e.stateNode = t, tt = e, nt = Mt(t.firstChild), !0) : !1;
      case 6:
        return t = e.pendingProps === "" || t.nodeType !== 3 ? null : t, t !== null ? (e.stateNode = t, tt = e, nt = null, !0) : !1;
      case 13:
        return t = t.nodeType !== 8 ? null : t, t !== null ? (n = en !== null ? { id: xt, overflow: Pt } : null, e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }, n = st(18, null, null, 0), n.stateNode = t, n.return = e, e.child = n, tt = e, nt = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Vo(e) {
    return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
  }
  function Wo(e) {
    if (Se) {
      var t = nt;
      if (t) {
        var n = t;
        if (!Ia(e, t)) {
          if (Vo(e)) throw Error(u(418));
          t = Mt(n.nextSibling);
          var r = tt;
          t && Ia(e, t) ? Na(r, n) : (e.flags = e.flags & -4097 | 2, Se = !1, tt = e);
        }
      } else {
        if (Vo(e)) throw Error(u(418));
        e.flags = e.flags & -4097 | 2, Se = !1, tt = e;
      }
    }
  }
  function Ra(e) {
    for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return;
    tt = e;
  }
  function ol(e) {
    if (e !== tt) return !1;
    if (!Se) return Ra(e), Se = !0, !1;
    var t;
    if ((t = e.tag !== 3) && !(t = e.tag !== 5) && (t = e.type, t = t !== "head" && t !== "body" && !Oo(e.type, e.memoizedProps)), t && (t = nt)) {
      if (Vo(e)) throw La(), Error(u(418));
      for (; t; ) Na(e, t), t = Mt(t.nextSibling);
    }
    if (Ra(e), e.tag === 13) {
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
  function La() {
    for (var e = nt; e; ) e = Mt(e.nextSibling);
  }
  function Pn() {
    nt = tt = null, Se = !1;
  }
  function Bo(e) {
    pt === null ? pt = [e] : pt.push(e);
  }
  var ed = se.ReactCurrentBatchConfig;
  function sr(e, t, n) {
    if (e = n.ref, e !== null && typeof e != "function" && typeof e != "object") {
      if (n._owner) {
        if (n = n._owner, n) {
          if (n.tag !== 1) throw Error(u(309));
          var r = n.stateNode;
        }
        if (!r) throw Error(u(147, e));
        var l = r, o = "" + e;
        return t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === o ? t.ref : (t = function(i) {
          var c = l.refs;
          i === null ? delete c[o] : c[o] = i;
        }, t._stringRef = o, t);
      }
      if (typeof e != "string") throw Error(u(284));
      if (!n._owner) throw Error(u(290, e));
    }
    return e;
  }
  function il(e, t) {
    throw e = Object.prototype.toString.call(t), Error(u(31, e === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : e));
  }
  function Ta(e) {
    var t = e._init;
    return t(e._payload);
  }
  function Oa(e) {
    function t(h, p) {
      if (e) {
        var y = h.deletions;
        y === null ? (h.deletions = [p], h.flags |= 16) : y.push(p);
      }
    }
    function n(h, p) {
      if (!e) return null;
      for (; p !== null; ) t(h, p), p = p.sibling;
      return null;
    }
    function r(h, p) {
      for (h = /* @__PURE__ */ new Map(); p !== null; ) p.key !== null ? h.set(p.key, p) : h.set(p.index, p), p = p.sibling;
      return h;
    }
    function l(h, p) {
      return h = Gt(h, p), h.index = 0, h.sibling = null, h;
    }
    function o(h, p, y) {
      return h.index = y, e ? (y = h.alternate, y !== null ? (y = y.index, y < p ? (h.flags |= 2, p) : y) : (h.flags |= 2, p)) : (h.flags |= 1048576, p);
    }
    function i(h) {
      return e && h.alternate === null && (h.flags |= 2), h;
    }
    function c(h, p, y, T) {
      return p === null || p.tag !== 6 ? (p = ji(y, h.mode, T), p.return = h, p) : (p = l(p, y), p.return = h, p);
    }
    function d(h, p, y, T) {
      var q = y.type;
      return q === ve ? I(h, p, y.props.children, T, y.key) : p !== null && (p.elementType === q || typeof q == "object" && q !== null && q.$$typeof === Oe && Ta(q) === p.type) ? (T = l(p, y.props), T.ref = sr(h, p, y), T.return = h, T) : (T = Ll(y.type, y.key, y.props, null, h.mode, T), T.ref = sr(h, p, y), T.return = h, T);
    }
    function v(h, p, y, T) {
      return p === null || p.tag !== 4 || p.stateNode.containerInfo !== y.containerInfo || p.stateNode.implementation !== y.implementation ? (p = zi(y, h.mode, T), p.return = h, p) : (p = l(p, y.children || []), p.return = h, p);
    }
    function I(h, p, y, T, q) {
      return p === null || p.tag !== 7 ? (p = cn(y, h.mode, T, q), p.return = h, p) : (p = l(p, y), p.return = h, p);
    }
    function R(h, p, y) {
      if (typeof p == "string" && p !== "" || typeof p == "number") return p = ji("" + p, h.mode, y), p.return = h, p;
      if (typeof p == "object" && p !== null) {
        switch (p.$$typeof) {
          case ce:
            return y = Ll(p.type, p.key, p.props, null, h.mode, y), y.ref = sr(h, null, p), y.return = h, y;
          case ee:
            return p = zi(p, h.mode, y), p.return = h, p;
          case Oe:
            var T = p._init;
            return R(h, T(p._payload), y);
        }
        if (Mn(p) || Q(p)) return p = cn(p, h.mode, y, null), p.return = h, p;
        il(h, p);
      }
      return null;
    }
    function P(h, p, y, T) {
      var q = p !== null ? p.key : null;
      if (typeof y == "string" && y !== "" || typeof y == "number") return q !== null ? null : c(h, p, "" + y, T);
      if (typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case ce:
            return y.key === q ? d(h, p, y, T) : null;
          case ee:
            return y.key === q ? v(h, p, y, T) : null;
          case Oe:
            return q = y._init, P(
              h,
              p,
              q(y._payload),
              T
            );
        }
        if (Mn(y) || Q(y)) return q !== null ? null : I(h, p, y, T, null);
        il(h, y);
      }
      return null;
    }
    function F(h, p, y, T, q) {
      if (typeof T == "string" && T !== "" || typeof T == "number") return h = h.get(y) || null, c(p, h, "" + T, q);
      if (typeof T == "object" && T !== null) {
        switch (T.$$typeof) {
          case ce:
            return h = h.get(T.key === null ? y : T.key) || null, d(p, h, T, q);
          case ee:
            return h = h.get(T.key === null ? y : T.key) || null, v(p, h, T, q);
          case Oe:
            var K = T._init;
            return F(h, p, y, K(T._payload), q);
        }
        if (Mn(T) || Q(T)) return h = h.get(y) || null, I(p, h, T, q, null);
        il(p, T);
      }
      return null;
    }
    function W(h, p, y, T) {
      for (var q = null, K = null, Y = p, X = p = 0, Ae = null; Y !== null && X < y.length; X++) {
        Y.index > X ? (Ae = Y, Y = null) : Ae = Y.sibling;
        var ie = P(h, Y, y[X], T);
        if (ie === null) {
          Y === null && (Y = Ae);
          break;
        }
        e && Y && ie.alternate === null && t(h, Y), p = o(ie, p, X), K === null ? q = ie : K.sibling = ie, K = ie, Y = Ae;
      }
      if (X === y.length) return n(h, Y), Se && tn(h, X), q;
      if (Y === null) {
        for (; X < y.length; X++) Y = R(h, y[X], T), Y !== null && (p = o(Y, p, X), K === null ? q = Y : K.sibling = Y, K = Y);
        return Se && tn(h, X), q;
      }
      for (Y = r(h, Y); X < y.length; X++) Ae = F(Y, h, X, y[X], T), Ae !== null && (e && Ae.alternate !== null && Y.delete(Ae.key === null ? X : Ae.key), p = o(Ae, p, X), K === null ? q = Ae : K.sibling = Ae, K = Ae);
      return e && Y.forEach(function(Xt) {
        return t(h, Xt);
      }), Se && tn(h, X), q;
    }
    function B(h, p, y, T) {
      var q = Q(y);
      if (typeof q != "function") throw Error(u(150));
      if (y = q.call(y), y == null) throw Error(u(151));
      for (var K = q = null, Y = p, X = p = 0, Ae = null, ie = y.next(); Y !== null && !ie.done; X++, ie = y.next()) {
        Y.index > X ? (Ae = Y, Y = null) : Ae = Y.sibling;
        var Xt = P(h, Y, ie.value, T);
        if (Xt === null) {
          Y === null && (Y = Ae);
          break;
        }
        e && Y && Xt.alternate === null && t(h, Y), p = o(Xt, p, X), K === null ? q = Xt : K.sibling = Xt, K = Xt, Y = Ae;
      }
      if (ie.done) return n(
        h,
        Y
      ), Se && tn(h, X), q;
      if (Y === null) {
        for (; !ie.done; X++, ie = y.next()) ie = R(h, ie.value, T), ie !== null && (p = o(ie, p, X), K === null ? q = ie : K.sibling = ie, K = ie);
        return Se && tn(h, X), q;
      }
      for (Y = r(h, Y); !ie.done; X++, ie = y.next()) ie = F(Y, h, X, ie.value, T), ie !== null && (e && ie.alternate !== null && Y.delete(ie.key === null ? X : ie.key), p = o(ie, p, X), K === null ? q = ie : K.sibling = ie, K = ie);
      return e && Y.forEach(function(jd) {
        return t(h, jd);
      }), Se && tn(h, X), q;
    }
    function Ie(h, p, y, T) {
      if (typeof y == "object" && y !== null && y.type === ve && y.key === null && (y = y.props.children), typeof y == "object" && y !== null) {
        switch (y.$$typeof) {
          case ce:
            e: {
              for (var q = y.key, K = p; K !== null; ) {
                if (K.key === q) {
                  if (q = y.type, q === ve) {
                    if (K.tag === 7) {
                      n(h, K.sibling), p = l(K, y.props.children), p.return = h, h = p;
                      break e;
                    }
                  } else if (K.elementType === q || typeof q == "object" && q !== null && q.$$typeof === Oe && Ta(q) === K.type) {
                    n(h, K.sibling), p = l(K, y.props), p.ref = sr(h, K, y), p.return = h, h = p;
                    break e;
                  }
                  n(h, K);
                  break;
                } else t(h, K);
                K = K.sibling;
              }
              y.type === ve ? (p = cn(y.props.children, h.mode, T, y.key), p.return = h, h = p) : (T = Ll(y.type, y.key, y.props, null, h.mode, T), T.ref = sr(h, p, y), T.return = h, h = T);
            }
            return i(h);
          case ee:
            e: {
              for (K = y.key; p !== null; ) {
                if (p.key === K) if (p.tag === 4 && p.stateNode.containerInfo === y.containerInfo && p.stateNode.implementation === y.implementation) {
                  n(h, p.sibling), p = l(p, y.children || []), p.return = h, h = p;
                  break e;
                } else {
                  n(h, p);
                  break;
                }
                else t(h, p);
                p = p.sibling;
              }
              p = zi(y, h.mode, T), p.return = h, h = p;
            }
            return i(h);
          case Oe:
            return K = y._init, Ie(h, p, K(y._payload), T);
        }
        if (Mn(y)) return W(h, p, y, T);
        if (Q(y)) return B(h, p, y, T);
        il(h, y);
      }
      return typeof y == "string" && y !== "" || typeof y == "number" ? (y = "" + y, p !== null && p.tag === 6 ? (n(h, p.sibling), p = l(p, y), p.return = h, h = p) : (n(h, p), p = ji(y, h.mode, T), p.return = h, h = p), i(h)) : n(h, p);
    }
    return Ie;
  }
  var Nn = Oa(!0), ja = Oa(!1), ul = Ft(null), al = null, In = null, Qo = null;
  function qo() {
    Qo = In = al = null;
  }
  function Ho(e) {
    var t = ul.current;
    ye(ul), e._currentValue = t;
  }
  function $o(e, t, n) {
    for (; e !== null; ) {
      var r = e.alternate;
      if ((e.childLanes & t) !== t ? (e.childLanes |= t, r !== null && (r.childLanes |= t)) : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t), e === n) break;
      e = e.return;
    }
  }
  function Rn(e, t) {
    al = e, Qo = In = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & t) !== 0 && (Ge = !0), e.firstContext = null);
  }
  function it(e) {
    var t = e._currentValue;
    if (Qo !== e) if (e = { context: e, memoizedValue: t, next: null }, In === null) {
      if (al === null) throw Error(u(308));
      In = e, al.dependencies = { lanes: 0, firstContext: e };
    } else In = In.next = e;
    return t;
  }
  var nn = null;
  function Ko(e) {
    nn === null ? nn = [e] : nn.push(e);
  }
  function za(e, t, n, r) {
    var l = t.interleaved;
    return l === null ? (n.next = n, Ko(t)) : (n.next = l.next, l.next = n), t.interleaved = n, Nt(e, r);
  }
  function Nt(e, t) {
    e.lanes |= t;
    var n = e.alternate;
    for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; ) e.childLanes |= t, n = e.alternate, n !== null && (n.childLanes |= t), n = e, e = e.return;
    return n.tag === 3 ? n.stateNode : null;
  }
  var Bt = !1;
  function Yo(e) {
    e.updateQueue = { baseState: e.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function Aa(e, t) {
    e = e.updateQueue, t.updateQueue === e && (t.updateQueue = { baseState: e.baseState, firstBaseUpdate: e.firstBaseUpdate, lastBaseUpdate: e.lastBaseUpdate, shared: e.shared, effects: e.effects });
  }
  function It(e, t) {
    return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null };
  }
  function Qt(e, t, n) {
    var r = e.updateQueue;
    if (r === null) return null;
    if (r = r.shared, (oe & 2) !== 0) {
      var l = r.pending;
      return l === null ? t.next = t : (t.next = l.next, l.next = t), r.pending = t, Nt(e, n);
    }
    return l = r.interleaved, l === null ? (t.next = t, Ko(r)) : (t.next = l.next, l.next = t), r.interleaved = t, Nt(e, n);
  }
  function sl(e, t, n) {
    if (t = t.updateQueue, t !== null && (t = t.shared, (n & 4194240) !== 0)) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, uo(e, n);
    }
  }
  function Da(e, t) {
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
  function cl(e, t, n, r) {
    var l = e.updateQueue;
    Bt = !1;
    var o = l.firstBaseUpdate, i = l.lastBaseUpdate, c = l.shared.pending;
    if (c !== null) {
      l.shared.pending = null;
      var d = c, v = d.next;
      d.next = null, i === null ? o = v : i.next = v, i = d;
      var I = e.alternate;
      I !== null && (I = I.updateQueue, c = I.lastBaseUpdate, c !== i && (c === null ? I.firstBaseUpdate = v : c.next = v, I.lastBaseUpdate = d));
    }
    if (o !== null) {
      var R = l.baseState;
      i = 0, I = v = d = null, c = o;
      do {
        var P = c.lane, F = c.eventTime;
        if ((r & P) === P) {
          I !== null && (I = I.next = {
            eventTime: F,
            lane: 0,
            tag: c.tag,
            payload: c.payload,
            callback: c.callback,
            next: null
          });
          e: {
            var W = e, B = c;
            switch (P = t, F = n, B.tag) {
              case 1:
                if (W = B.payload, typeof W == "function") {
                  R = W.call(F, R, P);
                  break e;
                }
                R = W;
                break e;
              case 3:
                W.flags = W.flags & -65537 | 128;
              case 0:
                if (W = B.payload, P = typeof W == "function" ? W.call(F, R, P) : W, P == null) break e;
                R = U({}, R, P);
                break e;
              case 2:
                Bt = !0;
            }
          }
          c.callback !== null && c.lane !== 0 && (e.flags |= 64, P = l.effects, P === null ? l.effects = [c] : P.push(c));
        } else F = { eventTime: F, lane: P, tag: c.tag, payload: c.payload, callback: c.callback, next: null }, I === null ? (v = I = F, d = R) : I = I.next = F, i |= P;
        if (c = c.next, c === null) {
          if (c = l.shared.pending, c === null) break;
          P = c, c = P.next, P.next = null, l.lastBaseUpdate = P, l.shared.pending = null;
        }
      } while (!0);
      if (I === null && (d = R), l.baseState = d, l.firstBaseUpdate = v, l.lastBaseUpdate = I, t = l.shared.interleaved, t !== null) {
        l = t;
        do
          i |= l.lane, l = l.next;
        while (l !== t);
      } else o === null && (l.shared.lanes = 0);
      on |= i, e.lanes = i, e.memoizedState = R;
    }
  }
  function Ua(e, t, n) {
    if (e = t.effects, t.effects = null, e !== null) for (t = 0; t < e.length; t++) {
      var r = e[t], l = r.callback;
      if (l !== null) {
        if (r.callback = null, r = n, typeof l != "function") throw Error(u(191, l));
        l.call(r);
      }
    }
  }
  var cr = {}, St = Ft(cr), fr = Ft(cr), dr = Ft(cr);
  function rn(e) {
    if (e === cr) throw Error(u(174));
    return e;
  }
  function Go(e, t) {
    switch (pe(dr, t), pe(fr, e), pe(St, cr), e = t.nodeType, e) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : Gl(null, "");
        break;
      default:
        e = e === 8 ? t.parentNode : t, t = e.namespaceURI || null, e = e.tagName, t = Gl(t, e);
    }
    ye(St), pe(St, t);
  }
  function Ln() {
    ye(St), ye(fr), ye(dr);
  }
  function Ma(e) {
    rn(dr.current);
    var t = rn(St.current), n = Gl(t, e.type);
    t !== n && (pe(fr, e), pe(St, n));
  }
  function Xo(e) {
    fr.current === e && (ye(St), ye(fr));
  }
  var Ee = Ft(0);
  function fl(e) {
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
  var Jo = [];
  function Zo() {
    for (var e = 0; e < Jo.length; e++) Jo[e]._workInProgressVersionPrimary = null;
    Jo.length = 0;
  }
  var dl = se.ReactCurrentDispatcher, bo = se.ReactCurrentBatchConfig, ln = 0, Ce = null, Le = null, je = null, pl = !1, pr = !1, mr = 0, td = 0;
  function Ve() {
    throw Error(u(321));
  }
  function ei(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!dt(e[n], t[n])) return !1;
    return !0;
  }
  function ti(e, t, n, r, l, o) {
    if (ln = o, Ce = t, t.memoizedState = null, t.updateQueue = null, t.lanes = 0, dl.current = e === null || e.memoizedState === null ? od : id, e = n(r, l), pr) {
      o = 0;
      do {
        if (pr = !1, mr = 0, 25 <= o) throw Error(u(301));
        o += 1, je = Le = null, t.updateQueue = null, dl.current = ud, e = n(r, l);
      } while (pr);
    }
    if (dl.current = yl, t = Le !== null && Le.next !== null, ln = 0, je = Le = Ce = null, pl = !1, t) throw Error(u(300));
    return e;
  }
  function ni() {
    var e = mr !== 0;
    return mr = 0, e;
  }
  function _t() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return je === null ? Ce.memoizedState = je = e : je = je.next = e, je;
  }
  function ut() {
    if (Le === null) {
      var e = Ce.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Le.next;
    var t = je === null ? Ce.memoizedState : je.next;
    if (t !== null) je = t, Le = e;
    else {
      if (e === null) throw Error(u(310));
      Le = e, e = { memoizedState: Le.memoizedState, baseState: Le.baseState, baseQueue: Le.baseQueue, queue: Le.queue, next: null }, je === null ? Ce.memoizedState = je = e : je = je.next = e;
    }
    return je;
  }
  function hr(e, t) {
    return typeof t == "function" ? t(e) : t;
  }
  function ri(e) {
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
      var c = i = null, d = null, v = o;
      do {
        var I = v.lane;
        if ((ln & I) === I) d !== null && (d = d.next = { lane: 0, action: v.action, hasEagerState: v.hasEagerState, eagerState: v.eagerState, next: null }), r = v.hasEagerState ? v.eagerState : e(r, v.action);
        else {
          var R = {
            lane: I,
            action: v.action,
            hasEagerState: v.hasEagerState,
            eagerState: v.eagerState,
            next: null
          };
          d === null ? (c = d = R, i = r) : d = d.next = R, Ce.lanes |= I, on |= I;
        }
        v = v.next;
      } while (v !== null && v !== o);
      d === null ? i = r : d.next = c, dt(r, t.memoizedState) || (Ge = !0), t.memoizedState = r, t.baseState = i, t.baseQueue = d, n.lastRenderedState = r;
    }
    if (e = n.interleaved, e !== null) {
      l = e;
      do
        o = l.lane, Ce.lanes |= o, on |= o, l = l.next;
      while (l !== e);
    } else l === null && (n.lanes = 0);
    return [t.memoizedState, n.dispatch];
  }
  function li(e) {
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
      dt(o, t.memoizedState) || (Ge = !0), t.memoizedState = o, t.baseQueue === null && (t.baseState = o), n.lastRenderedState = o;
    }
    return [o, r];
  }
  function Fa() {
  }
  function Va(e, t) {
    var n = Ce, r = ut(), l = t(), o = !dt(r.memoizedState, l);
    if (o && (r.memoizedState = l, Ge = !0), r = r.queue, oi(Qa.bind(null, n, r, e), [e]), r.getSnapshot !== t || o || je !== null && je.memoizedState.tag & 1) {
      if (n.flags |= 2048, yr(9, Ba.bind(null, n, r, l, t), void 0, null), ze === null) throw Error(u(349));
      (ln & 30) !== 0 || Wa(n, t, l);
    }
    return l;
  }
  function Wa(e, t, n) {
    e.flags |= 16384, e = { getSnapshot: t, value: n }, t = Ce.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Ce.updateQueue = t, t.stores = [e]) : (n = t.stores, n === null ? t.stores = [e] : n.push(e));
  }
  function Ba(e, t, n, r) {
    t.value = n, t.getSnapshot = r, qa(t) && Ha(e);
  }
  function Qa(e, t, n) {
    return n(function() {
      qa(t) && Ha(e);
    });
  }
  function qa(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !dt(e, n);
    } catch {
      return !0;
    }
  }
  function Ha(e) {
    var t = Nt(e, 1);
    t !== null && vt(t, e, 1, -1);
  }
  function $a(e) {
    var t = _t();
    return typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: hr, lastRenderedState: e }, t.queue = e, e = e.dispatch = ld.bind(null, Ce, e), [t.memoizedState, e];
  }
  function yr(e, t, n, r) {
    return e = { tag: e, create: t, destroy: n, deps: r, next: null }, t = Ce.updateQueue, t === null ? (t = { lastEffect: null, stores: null }, Ce.updateQueue = t, t.lastEffect = e.next = e) : (n = t.lastEffect, n === null ? t.lastEffect = e.next = e : (r = n.next, n.next = e, e.next = r, t.lastEffect = e)), e;
  }
  function Ka() {
    return ut().memoizedState;
  }
  function ml(e, t, n, r) {
    var l = _t();
    Ce.flags |= e, l.memoizedState = yr(1 | t, n, void 0, r === void 0 ? null : r);
  }
  function hl(e, t, n, r) {
    var l = ut();
    r = r === void 0 ? null : r;
    var o = void 0;
    if (Le !== null) {
      var i = Le.memoizedState;
      if (o = i.destroy, r !== null && ei(r, i.deps)) {
        l.memoizedState = yr(t, n, o, r);
        return;
      }
    }
    Ce.flags |= e, l.memoizedState = yr(1 | t, n, o, r);
  }
  function Ya(e, t) {
    return ml(8390656, 8, e, t);
  }
  function oi(e, t) {
    return hl(2048, 8, e, t);
  }
  function Ga(e, t) {
    return hl(4, 2, e, t);
  }
  function Xa(e, t) {
    return hl(4, 4, e, t);
  }
  function Ja(e, t) {
    if (typeof t == "function") return e = e(), t(e), function() {
      t(null);
    };
    if (t != null) return e = e(), t.current = e, function() {
      t.current = null;
    };
  }
  function Za(e, t, n) {
    return n = n != null ? n.concat([e]) : null, hl(4, 4, Ja.bind(null, t, e), n);
  }
  function ii() {
  }
  function ba(e, t) {
    var n = ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && ei(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
  }
  function es(e, t) {
    var n = ut();
    t = t === void 0 ? null : t;
    var r = n.memoizedState;
    return r !== null && t !== null && ei(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
  }
  function ts(e, t, n) {
    return (ln & 21) === 0 ? (e.baseState && (e.baseState = !1, Ge = !0), e.memoizedState = n) : (dt(n, t) || (n = Tu(), Ce.lanes |= n, on |= n, e.baseState = !0), t);
  }
  function nd(e, t) {
    var n = ae;
    ae = n !== 0 && 4 > n ? n : 4, e(!0);
    var r = bo.transition;
    bo.transition = {};
    try {
      e(!1), t();
    } finally {
      ae = n, bo.transition = r;
    }
  }
  function ns() {
    return ut().memoizedState;
  }
  function rd(e, t, n) {
    var r = Kt(e);
    if (n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }, rs(e)) ls(t, n);
    else if (n = za(e, t, n, r), n !== null) {
      var l = $e();
      vt(n, e, r, l), os(n, t, r);
    }
  }
  function ld(e, t, n) {
    var r = Kt(e), l = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
    if (rs(e)) ls(t, l);
    else {
      var o = e.alternate;
      if (e.lanes === 0 && (o === null || o.lanes === 0) && (o = t.lastRenderedReducer, o !== null)) try {
        var i = t.lastRenderedState, c = o(i, n);
        if (l.hasEagerState = !0, l.eagerState = c, dt(c, i)) {
          var d = t.interleaved;
          d === null ? (l.next = l, Ko(t)) : (l.next = d.next, d.next = l), t.interleaved = l;
          return;
        }
      } catch {
      } finally {
      }
      n = za(e, t, l, r), n !== null && (l = $e(), vt(n, e, r, l), os(n, t, r));
    }
  }
  function rs(e) {
    var t = e.alternate;
    return e === Ce || t !== null && t === Ce;
  }
  function ls(e, t) {
    pr = pl = !0;
    var n = e.pending;
    n === null ? t.next = t : (t.next = n.next, n.next = t), e.pending = t;
  }
  function os(e, t, n) {
    if ((n & 4194240) !== 0) {
      var r = t.lanes;
      r &= e.pendingLanes, n |= r, t.lanes = n, uo(e, n);
    }
  }
  var yl = { readContext: it, useCallback: Ve, useContext: Ve, useEffect: Ve, useImperativeHandle: Ve, useInsertionEffect: Ve, useLayoutEffect: Ve, useMemo: Ve, useReducer: Ve, useRef: Ve, useState: Ve, useDebugValue: Ve, useDeferredValue: Ve, useTransition: Ve, useMutableSource: Ve, useSyncExternalStore: Ve, useId: Ve, unstable_isNewReconciler: !1 }, od = { readContext: it, useCallback: function(e, t) {
    return _t().memoizedState = [e, t === void 0 ? null : t], e;
  }, useContext: it, useEffect: Ya, useImperativeHandle: function(e, t, n) {
    return n = n != null ? n.concat([e]) : null, ml(
      4194308,
      4,
      Ja.bind(null, t, e),
      n
    );
  }, useLayoutEffect: function(e, t) {
    return ml(4194308, 4, e, t);
  }, useInsertionEffect: function(e, t) {
    return ml(4, 2, e, t);
  }, useMemo: function(e, t) {
    var n = _t();
    return t = t === void 0 ? null : t, e = e(), n.memoizedState = [e, t], e;
  }, useReducer: function(e, t, n) {
    var r = _t();
    return t = n !== void 0 ? n(t) : t, r.memoizedState = r.baseState = t, e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: e, lastRenderedState: t }, r.queue = e, e = e.dispatch = rd.bind(null, Ce, e), [r.memoizedState, e];
  }, useRef: function(e) {
    var t = _t();
    return e = { current: e }, t.memoizedState = e;
  }, useState: $a, useDebugValue: ii, useDeferredValue: function(e) {
    return _t().memoizedState = e;
  }, useTransition: function() {
    var e = $a(!1), t = e[0];
    return e = nd.bind(null, e[1]), _t().memoizedState = e, [t, e];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(e, t, n) {
    var r = Ce, l = _t();
    if (Se) {
      if (n === void 0) throw Error(u(407));
      n = n();
    } else {
      if (n = t(), ze === null) throw Error(u(349));
      (ln & 30) !== 0 || Wa(r, t, n);
    }
    l.memoizedState = n;
    var o = { value: n, getSnapshot: t };
    return l.queue = o, Ya(Qa.bind(
      null,
      r,
      o,
      e
    ), [e]), r.flags |= 2048, yr(9, Ba.bind(null, r, o, n, t), void 0, null), n;
  }, useId: function() {
    var e = _t(), t = ze.identifierPrefix;
    if (Se) {
      var n = Pt, r = xt;
      n = (r & ~(1 << 32 - ft(r) - 1)).toString(32) + n, t = ":" + t + "R" + n, n = mr++, 0 < n && (t += "H" + n.toString(32)), t += ":";
    } else n = td++, t = ":" + t + "r" + n.toString(32) + ":";
    return e.memoizedState = t;
  }, unstable_isNewReconciler: !1 }, id = {
    readContext: it,
    useCallback: ba,
    useContext: it,
    useEffect: oi,
    useImperativeHandle: Za,
    useInsertionEffect: Ga,
    useLayoutEffect: Xa,
    useMemo: es,
    useReducer: ri,
    useRef: Ka,
    useState: function() {
      return ri(hr);
    },
    useDebugValue: ii,
    useDeferredValue: function(e) {
      var t = ut();
      return ts(t, Le.memoizedState, e);
    },
    useTransition: function() {
      var e = ri(hr)[0], t = ut().memoizedState;
      return [e, t];
    },
    useMutableSource: Fa,
    useSyncExternalStore: Va,
    useId: ns,
    unstable_isNewReconciler: !1
  }, ud = { readContext: it, useCallback: ba, useContext: it, useEffect: oi, useImperativeHandle: Za, useInsertionEffect: Ga, useLayoutEffect: Xa, useMemo: es, useReducer: li, useRef: Ka, useState: function() {
    return li(hr);
  }, useDebugValue: ii, useDeferredValue: function(e) {
    var t = ut();
    return Le === null ? t.memoizedState = e : ts(t, Le.memoizedState, e);
  }, useTransition: function() {
    var e = li(hr)[0], t = ut().memoizedState;
    return [e, t];
  }, useMutableSource: Fa, useSyncExternalStore: Va, useId: ns, unstable_isNewReconciler: !1 };
  function mt(e, t) {
    if (e && e.defaultProps) {
      t = U({}, t), e = e.defaultProps;
      for (var n in e) t[n] === void 0 && (t[n] = e[n]);
      return t;
    }
    return t;
  }
  function ui(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = n == null ? t : U({}, t, n), e.memoizedState = n, e.lanes === 0 && (e.updateQueue.baseState = n);
  }
  var vl = { isMounted: function(e) {
    return (e = e._reactInternals) ? Jt(e) === e : !1;
  }, enqueueSetState: function(e, t, n) {
    e = e._reactInternals;
    var r = $e(), l = Kt(e), o = It(r, l);
    o.payload = t, n != null && (o.callback = n), t = Qt(e, o, l), t !== null && (vt(t, e, l, r), sl(t, e, l));
  }, enqueueReplaceState: function(e, t, n) {
    e = e._reactInternals;
    var r = $e(), l = Kt(e), o = It(r, l);
    o.tag = 1, o.payload = t, n != null && (o.callback = n), t = Qt(e, o, l), t !== null && (vt(t, e, l, r), sl(t, e, l));
  }, enqueueForceUpdate: function(e, t) {
    e = e._reactInternals;
    var n = $e(), r = Kt(e), l = It(n, r);
    l.tag = 2, t != null && (l.callback = t), t = Qt(e, l, r), t !== null && (vt(t, e, r, n), sl(t, e, r));
  } };
  function is(e, t, n, r, l, o, i) {
    return e = e.stateNode, typeof e.shouldComponentUpdate == "function" ? e.shouldComponentUpdate(r, o, i) : t.prototype && t.prototype.isPureReactComponent ? !nr(n, r) || !nr(l, o) : !0;
  }
  function us(e, t, n) {
    var r = !1, l = Vt, o = t.contextType;
    return typeof o == "object" && o !== null ? o = it(o) : (l = Ye(t) ? bt : Fe.current, r = t.contextTypes, o = (r = r != null) ? En(e, l) : Vt), t = new t(n, o), e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null, t.updater = vl, e.stateNode = t, t._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = o), t;
  }
  function as(e, t, n, r) {
    e = t.state, typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(n, r), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && vl.enqueueReplaceState(t, t.state, null);
  }
  function ai(e, t, n, r) {
    var l = e.stateNode;
    l.props = n, l.state = e.memoizedState, l.refs = {}, Yo(e);
    var o = t.contextType;
    typeof o == "object" && o !== null ? l.context = it(o) : (o = Ye(t) ? bt : Fe.current, l.context = En(e, o)), l.state = e.memoizedState, o = t.getDerivedStateFromProps, typeof o == "function" && (ui(e, t, o, n), l.state = e.memoizedState), typeof t.getDerivedStateFromProps == "function" || typeof l.getSnapshotBeforeUpdate == "function" || typeof l.UNSAFE_componentWillMount != "function" && typeof l.componentWillMount != "function" || (t = l.state, typeof l.componentWillMount == "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount == "function" && l.UNSAFE_componentWillMount(), t !== l.state && vl.enqueueReplaceState(l, l.state, null), cl(e, n, l, r), l.state = e.memoizedState), typeof l.componentDidMount == "function" && (e.flags |= 4194308);
  }
  function Tn(e, t) {
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
  function si(e, t, n) {
    return { value: e, source: null, stack: n ?? null, digest: t ?? null };
  }
  function ci(e, t) {
    try {
      console.error(t.value);
    } catch (n) {
      setTimeout(function() {
        throw n;
      });
    }
  }
  var ad = typeof WeakMap == "function" ? WeakMap : Map;
  function ss(e, t, n) {
    n = It(-1, n), n.tag = 3, n.payload = { element: null };
    var r = t.value;
    return n.callback = function() {
      Cl || (Cl = !0, xi = r), ci(e, t);
    }, n;
  }
  function cs(e, t, n) {
    n = It(-1, n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;
    if (typeof r == "function") {
      var l = t.value;
      n.payload = function() {
        return r(l);
      }, n.callback = function() {
        ci(e, t);
      };
    }
    var o = e.stateNode;
    return o !== null && typeof o.componentDidCatch == "function" && (n.callback = function() {
      ci(e, t), typeof r != "function" && (Ht === null ? Ht = /* @__PURE__ */ new Set([this]) : Ht.add(this));
      var i = t.stack;
      this.componentDidCatch(t.value, { componentStack: i !== null ? i : "" });
    }), n;
  }
  function fs(e, t, n) {
    var r = e.pingCache;
    if (r === null) {
      r = e.pingCache = new ad();
      var l = /* @__PURE__ */ new Set();
      r.set(t, l);
    } else l = r.get(t), l === void 0 && (l = /* @__PURE__ */ new Set(), r.set(t, l));
    l.has(n) || (l.add(n), e = kd.bind(null, e, t, n), t.then(e, e));
  }
  function ds(e) {
    do {
      var t;
      if ((t = e.tag === 13) && (t = e.memoizedState, t = t !== null ? t.dehydrated !== null : !0), t) return e;
      e = e.return;
    } while (e !== null);
    return null;
  }
  function ps(e, t, n, r, l) {
    return (e.mode & 1) === 0 ? (e === t ? e.flags |= 65536 : (e.flags |= 128, n.flags |= 131072, n.flags &= -52805, n.tag === 1 && (n.alternate === null ? n.tag = 17 : (t = It(-1, 1), t.tag = 2, Qt(n, t, 1))), n.lanes |= 1), e) : (e.flags |= 65536, e.lanes = l, e);
  }
  var sd = se.ReactCurrentOwner, Ge = !1;
  function He(e, t, n, r) {
    t.child = e === null ? ja(t, null, n, r) : Nn(t, e.child, n, r);
  }
  function ms(e, t, n, r, l) {
    n = n.render;
    var o = t.ref;
    return Rn(t, l), r = ti(e, t, n, r, o, l), n = ni(), e !== null && !Ge ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (Se && n && Mo(t), t.flags |= 1, He(e, t, r, l), t.child);
  }
  function hs(e, t, n, r, l) {
    if (e === null) {
      var o = n.type;
      return typeof o == "function" && !Oi(o) && o.defaultProps === void 0 && n.compare === null && n.defaultProps === void 0 ? (t.tag = 15, t.type = o, ys(e, t, o, r, l)) : (e = Ll(n.type, null, r, t, t.mode, l), e.ref = t.ref, e.return = t, t.child = e);
    }
    if (o = e.child, (e.lanes & l) === 0) {
      var i = o.memoizedProps;
      if (n = n.compare, n = n !== null ? n : nr, n(i, r) && e.ref === t.ref) return Rt(e, t, l);
    }
    return t.flags |= 1, e = Gt(o, r), e.ref = t.ref, e.return = t, t.child = e;
  }
  function ys(e, t, n, r, l) {
    if (e !== null) {
      var o = e.memoizedProps;
      if (nr(o, r) && e.ref === t.ref) if (Ge = !1, t.pendingProps = r = o, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (Ge = !0);
      else return t.lanes = e.lanes, Rt(e, t, l);
    }
    return fi(e, t, n, r, l);
  }
  function vs(e, t, n) {
    var r = t.pendingProps, l = r.children, o = e !== null ? e.memoizedState : null;
    if (r.mode === "hidden") if ((t.mode & 1) === 0) t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, pe(jn, rt), rt |= n;
    else {
      if ((n & 1073741824) === 0) return e = o !== null ? o.baseLanes | n : n, t.lanes = t.childLanes = 1073741824, t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }, t.updateQueue = null, pe(jn, rt), rt |= e, null;
      t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, r = o !== null ? o.baseLanes : n, pe(jn, rt), rt |= r;
    }
    else o !== null ? (r = o.baseLanes | n, t.memoizedState = null) : r = n, pe(jn, rt), rt |= r;
    return He(e, t, l, n), t.child;
  }
  function gs(e, t) {
    var n = t.ref;
    (e === null && n !== null || e !== null && e.ref !== n) && (t.flags |= 512, t.flags |= 2097152);
  }
  function fi(e, t, n, r, l) {
    var o = Ye(n) ? bt : Fe.current;
    return o = En(t, o), Rn(t, l), n = ti(e, t, n, r, o, l), r = ni(), e !== null && !Ge ? (t.updateQueue = e.updateQueue, t.flags &= -2053, e.lanes &= ~l, Rt(e, t, l)) : (Se && r && Mo(t), t.flags |= 1, He(e, t, n, l), t.child);
  }
  function ws(e, t, n, r, l) {
    if (Ye(n)) {
      var o = !0;
      tl(t);
    } else o = !1;
    if (Rn(t, l), t.stateNode === null) wl(e, t), us(t, n, r), ai(t, n, r, l), r = !0;
    else if (e === null) {
      var i = t.stateNode, c = t.memoizedProps;
      i.props = c;
      var d = i.context, v = n.contextType;
      typeof v == "object" && v !== null ? v = it(v) : (v = Ye(n) ? bt : Fe.current, v = En(t, v));
      var I = n.getDerivedStateFromProps, R = typeof I == "function" || typeof i.getSnapshotBeforeUpdate == "function";
      R || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (c !== r || d !== v) && as(t, i, r, v), Bt = !1;
      var P = t.memoizedState;
      i.state = P, cl(t, r, i, l), d = t.memoizedState, c !== r || P !== d || Ke.current || Bt ? (typeof I == "function" && (ui(t, n, I, r), d = t.memoizedState), (c = Bt || is(t, n, c, r, P, d, v)) ? (R || typeof i.UNSAFE_componentWillMount != "function" && typeof i.componentWillMount != "function" || (typeof i.componentWillMount == "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount == "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount == "function" && (t.flags |= 4194308)) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), t.memoizedProps = r, t.memoizedState = d), i.props = r, i.state = d, i.context = v, r = c) : (typeof i.componentDidMount == "function" && (t.flags |= 4194308), r = !1);
    } else {
      i = t.stateNode, Aa(e, t), c = t.memoizedProps, v = t.type === t.elementType ? c : mt(t.type, c), i.props = v, R = t.pendingProps, P = i.context, d = n.contextType, typeof d == "object" && d !== null ? d = it(d) : (d = Ye(n) ? bt : Fe.current, d = En(t, d));
      var F = n.getDerivedStateFromProps;
      (I = typeof F == "function" || typeof i.getSnapshotBeforeUpdate == "function") || typeof i.UNSAFE_componentWillReceiveProps != "function" && typeof i.componentWillReceiveProps != "function" || (c !== R || P !== d) && as(t, i, r, d), Bt = !1, P = t.memoizedState, i.state = P, cl(t, r, i, l);
      var W = t.memoizedState;
      c !== R || P !== W || Ke.current || Bt ? (typeof F == "function" && (ui(t, n, F, r), W = t.memoizedState), (v = Bt || is(t, n, v, r, P, W, d) || !1) ? (I || typeof i.UNSAFE_componentWillUpdate != "function" && typeof i.componentWillUpdate != "function" || (typeof i.componentWillUpdate == "function" && i.componentWillUpdate(r, W, d), typeof i.UNSAFE_componentWillUpdate == "function" && i.UNSAFE_componentWillUpdate(r, W, d)), typeof i.componentDidUpdate == "function" && (t.flags |= 4), typeof i.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024)) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && P === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && P === e.memoizedState || (t.flags |= 1024), t.memoizedProps = r, t.memoizedState = W), i.props = r, i.state = W, i.context = d, r = v) : (typeof i.componentDidUpdate != "function" || c === e.memoizedProps && P === e.memoizedState || (t.flags |= 4), typeof i.getSnapshotBeforeUpdate != "function" || c === e.memoizedProps && P === e.memoizedState || (t.flags |= 1024), r = !1);
    }
    return di(e, t, n, r, o, l);
  }
  function di(e, t, n, r, l, o) {
    gs(e, t);
    var i = (t.flags & 128) !== 0;
    if (!r && !i) return l && Ca(t, n, !1), Rt(e, t, o);
    r = t.stateNode, sd.current = t;
    var c = i && typeof n.getDerivedStateFromError != "function" ? null : r.render();
    return t.flags |= 1, e !== null && i ? (t.child = Nn(t, e.child, null, o), t.child = Nn(t, null, c, o)) : He(e, t, c, o), t.memoizedState = r.state, l && Ca(t, n, !0), t.child;
  }
  function Ss(e) {
    var t = e.stateNode;
    t.pendingContext ? ka(e, t.pendingContext, t.pendingContext !== t.context) : t.context && ka(e, t.context, !1), Go(e, t.containerInfo);
  }
  function _s(e, t, n, r, l) {
    return Pn(), Bo(l), t.flags |= 256, He(e, t, n, r), t.child;
  }
  var pi = { dehydrated: null, treeContext: null, retryLane: 0 };
  function mi(e) {
    return { baseLanes: e, cachePool: null, transitions: null };
  }
  function ks(e, t, n) {
    var r = t.pendingProps, l = Ee.current, o = !1, i = (t.flags & 128) !== 0, c;
    if ((c = i) || (c = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), c ? (o = !0, t.flags &= -129) : (e === null || e.memoizedState !== null) && (l |= 1), pe(Ee, l & 1), e === null)
      return Wo(t), e = t.memoizedState, e !== null && (e = e.dehydrated, e !== null) ? ((t.mode & 1) === 0 ? t.lanes = 1 : e.data === "$!" ? t.lanes = 8 : t.lanes = 1073741824, null) : (i = r.children, e = r.fallback, o ? (r = t.mode, o = t.child, i = { mode: "hidden", children: i }, (r & 1) === 0 && o !== null ? (o.childLanes = 0, o.pendingProps = i) : o = Tl(i, r, 0, null), e = cn(e, r, n, null), o.return = t, e.return = t, o.sibling = e, t.child = o, t.child.memoizedState = mi(n), t.memoizedState = pi, e) : hi(t, i));
    if (l = e.memoizedState, l !== null && (c = l.dehydrated, c !== null)) return cd(e, t, i, r, c, l, n);
    if (o) {
      o = r.fallback, i = t.mode, l = e.child, c = l.sibling;
      var d = { mode: "hidden", children: r.children };
      return (i & 1) === 0 && t.child !== l ? (r = t.child, r.childLanes = 0, r.pendingProps = d, t.deletions = null) : (r = Gt(l, d), r.subtreeFlags = l.subtreeFlags & 14680064), c !== null ? o = Gt(c, o) : (o = cn(o, i, n, null), o.flags |= 2), o.return = t, r.return = t, r.sibling = o, t.child = r, r = o, o = t.child, i = e.child.memoizedState, i = i === null ? mi(n) : { baseLanes: i.baseLanes | n, cachePool: null, transitions: i.transitions }, o.memoizedState = i, o.childLanes = e.childLanes & ~n, t.memoizedState = pi, r;
    }
    return o = e.child, e = o.sibling, r = Gt(o, { mode: "visible", children: r.children }), (t.mode & 1) === 0 && (r.lanes = n), r.return = t, r.sibling = null, e !== null && (n = t.deletions, n === null ? (t.deletions = [e], t.flags |= 16) : n.push(e)), t.child = r, t.memoizedState = null, r;
  }
  function hi(e, t) {
    return t = Tl({ mode: "visible", children: t }, e.mode, 0, null), t.return = e, e.child = t;
  }
  function gl(e, t, n, r) {
    return r !== null && Bo(r), Nn(t, e.child, null, n), e = hi(t, t.pendingProps.children), e.flags |= 2, t.memoizedState = null, e;
  }
  function cd(e, t, n, r, l, o, i) {
    if (n)
      return t.flags & 256 ? (t.flags &= -257, r = si(Error(u(422))), gl(e, t, i, r)) : t.memoizedState !== null ? (t.child = e.child, t.flags |= 128, null) : (o = r.fallback, l = t.mode, r = Tl({ mode: "visible", children: r.children }, l, 0, null), o = cn(o, l, i, null), o.flags |= 2, r.return = t, o.return = t, r.sibling = o, t.child = r, (t.mode & 1) !== 0 && Nn(t, e.child, null, i), t.child.memoizedState = mi(i), t.memoizedState = pi, o);
    if ((t.mode & 1) === 0) return gl(e, t, i, null);
    if (l.data === "$!") {
      if (r = l.nextSibling && l.nextSibling.dataset, r) var c = r.dgst;
      return r = c, o = Error(u(419)), r = si(o, r, void 0), gl(e, t, i, r);
    }
    if (c = (i & e.childLanes) !== 0, Ge || c) {
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
        l = (l & (r.suspendedLanes | i)) !== 0 ? 0 : l, l !== 0 && l !== o.retryLane && (o.retryLane = l, Nt(e, l), vt(r, e, l, -1));
      }
      return Ti(), r = si(Error(u(421))), gl(e, t, i, r);
    }
    return l.data === "$?" ? (t.flags |= 128, t.child = e.child, t = Ed.bind(null, e), l._reactRetry = t, null) : (e = o.treeContext, nt = Mt(l.nextSibling), tt = t, Se = !0, pt = null, e !== null && (lt[ot++] = xt, lt[ot++] = Pt, lt[ot++] = en, xt = e.id, Pt = e.overflow, en = t), t = hi(t, r.children), t.flags |= 4096, t);
  }
  function Es(e, t, n) {
    e.lanes |= t;
    var r = e.alternate;
    r !== null && (r.lanes |= t), $o(e.return, t, n);
  }
  function yi(e, t, n, r, l) {
    var o = e.memoizedState;
    o === null ? e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: l } : (o.isBackwards = t, o.rendering = null, o.renderingStartTime = 0, o.last = r, o.tail = n, o.tailMode = l);
  }
  function Cs(e, t, n) {
    var r = t.pendingProps, l = r.revealOrder, o = r.tail;
    if (He(e, t, r.children, n), r = Ee.current, (r & 2) !== 0) r = r & 1 | 2, t.flags |= 128;
    else {
      if (e !== null && (e.flags & 128) !== 0) e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Es(e, n, t);
        else if (e.tag === 19) Es(e, n, t);
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
    if (pe(Ee, r), (t.mode & 1) === 0) t.memoizedState = null;
    else switch (l) {
      case "forwards":
        for (n = t.child, l = null; n !== null; ) e = n.alternate, e !== null && fl(e) === null && (l = n), n = n.sibling;
        n = l, n === null ? (l = t.child, t.child = null) : (l = n.sibling, n.sibling = null), yi(t, !1, l, n, o);
        break;
      case "backwards":
        for (n = null, l = t.child, t.child = null; l !== null; ) {
          if (e = l.alternate, e !== null && fl(e) === null) {
            t.child = l;
            break;
          }
          e = l.sibling, l.sibling = n, n = l, l = e;
        }
        yi(t, !0, n, null, o);
        break;
      case "together":
        yi(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
    return t.child;
  }
  function wl(e, t) {
    (t.mode & 1) === 0 && e !== null && (e.alternate = null, t.alternate = null, t.flags |= 2);
  }
  function Rt(e, t, n) {
    if (e !== null && (t.dependencies = e.dependencies), on |= t.lanes, (n & t.childLanes) === 0) return null;
    if (e !== null && t.child !== e.child) throw Error(u(153));
    if (t.child !== null) {
      for (e = t.child, n = Gt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; ) e = e.sibling, n = n.sibling = Gt(e, e.pendingProps), n.return = t;
      n.sibling = null;
    }
    return t.child;
  }
  function fd(e, t, n) {
    switch (t.tag) {
      case 3:
        Ss(t), Pn();
        break;
      case 5:
        Ma(t);
        break;
      case 1:
        Ye(t.type) && tl(t);
        break;
      case 4:
        Go(t, t.stateNode.containerInfo);
        break;
      case 10:
        var r = t.type._context, l = t.memoizedProps.value;
        pe(ul, r._currentValue), r._currentValue = l;
        break;
      case 13:
        if (r = t.memoizedState, r !== null)
          return r.dehydrated !== null ? (pe(Ee, Ee.current & 1), t.flags |= 128, null) : (n & t.child.childLanes) !== 0 ? ks(e, t, n) : (pe(Ee, Ee.current & 1), e = Rt(e, t, n), e !== null ? e.sibling : null);
        pe(Ee, Ee.current & 1);
        break;
      case 19:
        if (r = (n & t.childLanes) !== 0, (e.flags & 128) !== 0) {
          if (r) return Cs(e, t, n);
          t.flags |= 128;
        }
        if (l = t.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), pe(Ee, Ee.current), r) break;
        return null;
      case 22:
      case 23:
        return t.lanes = 0, vs(e, t, n);
    }
    return Rt(e, t, n);
  }
  var xs, vi, Ps, Ns;
  xs = function(e, t) {
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
  }, vi = function() {
  }, Ps = function(e, t, n, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = t.stateNode, rn(St.current);
      var o = null;
      switch (n) {
        case "input":
          l = Hl(e, l), r = Hl(e, r), o = [];
          break;
        case "select":
          l = U({}, l, { value: void 0 }), r = U({}, r, { value: void 0 }), o = [];
          break;
        case "textarea":
          l = Yl(e, l), r = Yl(e, r), o = [];
          break;
        default:
          typeof l.onClick != "function" && typeof r.onClick == "function" && (e.onclick = Zr);
      }
      Xl(n, r);
      var i;
      n = null;
      for (v in l) if (!r.hasOwnProperty(v) && l.hasOwnProperty(v) && l[v] != null) if (v === "style") {
        var c = l[v];
        for (i in c) c.hasOwnProperty(i) && (n || (n = {}), n[i] = "");
      } else v !== "dangerouslySetInnerHTML" && v !== "children" && v !== "suppressContentEditableWarning" && v !== "suppressHydrationWarning" && v !== "autoFocus" && (g.hasOwnProperty(v) ? o || (o = []) : (o = o || []).push(v, null));
      for (v in r) {
        var d = r[v];
        if (c = l?.[v], r.hasOwnProperty(v) && d !== c && (d != null || c != null)) if (v === "style") if (c) {
          for (i in c) !c.hasOwnProperty(i) || d && d.hasOwnProperty(i) || (n || (n = {}), n[i] = "");
          for (i in d) d.hasOwnProperty(i) && c[i] !== d[i] && (n || (n = {}), n[i] = d[i]);
        } else n || (o || (o = []), o.push(
          v,
          n
        )), n = d;
        else v === "dangerouslySetInnerHTML" ? (d = d ? d.__html : void 0, c = c ? c.__html : void 0, d != null && c !== d && (o = o || []).push(v, d)) : v === "children" ? typeof d != "string" && typeof d != "number" || (o = o || []).push(v, "" + d) : v !== "suppressContentEditableWarning" && v !== "suppressHydrationWarning" && (g.hasOwnProperty(v) ? (d != null && v === "onScroll" && he("scroll", e), o || c === d || (o = [])) : (o = o || []).push(v, d));
      }
      n && (o = o || []).push("style", n);
      var v = o;
      (t.updateQueue = v) && (t.flags |= 4);
    }
  }, Ns = function(e, t, n, r) {
    n !== r && (t.flags |= 4);
  };
  function vr(e, t) {
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
  function dd(e, t, n) {
    var r = t.pendingProps;
    switch (Fo(t), t.tag) {
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
        return Ye(t.type) && el(), We(t), null;
      case 3:
        return r = t.stateNode, Ln(), ye(Ke), ye(Fe), Zo(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), (e === null || e.child === null) && (ol(t) ? t.flags |= 4 : e === null || e.memoizedState.isDehydrated && (t.flags & 256) === 0 || (t.flags |= 1024, pt !== null && (Ii(pt), pt = null))), vi(e, t), We(t), null;
      case 5:
        Xo(t);
        var l = rn(dr.current);
        if (n = t.type, e !== null && t.stateNode != null) Ps(e, t, n, r, l), e.ref !== t.ref && (t.flags |= 512, t.flags |= 2097152);
        else {
          if (!r) {
            if (t.stateNode === null) throw Error(u(166));
            return We(t), null;
          }
          if (e = rn(St.current), ol(t)) {
            r = t.stateNode, n = t.type;
            var o = t.memoizedProps;
            switch (r[wt] = t, r[ur] = o, e = (t.mode & 1) !== 0, n) {
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
                for (l = 0; l < lr.length; l++) he(lr[l], r);
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
                uu(r, o), he("invalid", r);
                break;
              case "select":
                r._wrapperState = { wasMultiple: !!o.multiple }, he("invalid", r);
                break;
              case "textarea":
                cu(r, o), he("invalid", r);
            }
            Xl(n, o), l = null;
            for (var i in o) if (o.hasOwnProperty(i)) {
              var c = o[i];
              i === "children" ? typeof c == "string" ? r.textContent !== c && (o.suppressHydrationWarning !== !0 && Jr(r.textContent, c, e), l = ["children", c]) : typeof c == "number" && r.textContent !== "" + c && (o.suppressHydrationWarning !== !0 && Jr(
                r.textContent,
                c,
                e
              ), l = ["children", "" + c]) : g.hasOwnProperty(i) && c != null && i === "onScroll" && he("scroll", r);
            }
            switch (n) {
              case "input":
                Ir(r), su(r, o, !0);
                break;
              case "textarea":
                Ir(r), du(r);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof o.onClick == "function" && (r.onclick = Zr);
            }
            r = l, t.updateQueue = r, r !== null && (t.flags |= 4);
          } else {
            i = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = pu(n)), e === "http://www.w3.org/1999/xhtml" ? n === "script" ? (e = i.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is == "string" ? e = i.createElement(n, { is: r.is }) : (e = i.createElement(n), n === "select" && (i = e, r.multiple ? i.multiple = !0 : r.size && (i.size = r.size))) : e = i.createElementNS(e, n), e[wt] = t, e[ur] = r, xs(e, t, !1, !1), t.stateNode = e;
            e: {
              switch (i = Jl(n, r), n) {
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
                  for (l = 0; l < lr.length; l++) he(lr[l], e);
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
                  uu(e, r), l = Hl(e, r), he("invalid", e);
                  break;
                case "option":
                  l = r;
                  break;
                case "select":
                  e._wrapperState = { wasMultiple: !!r.multiple }, l = U({}, r, { value: void 0 }), he("invalid", e);
                  break;
                case "textarea":
                  cu(e, r), l = Yl(e, r), he("invalid", e);
                  break;
                default:
                  l = r;
              }
              Xl(n, l), c = l;
              for (o in c) if (c.hasOwnProperty(o)) {
                var d = c[o];
                o === "style" ? yu(e, d) : o === "dangerouslySetInnerHTML" ? (d = d ? d.__html : void 0, d != null && mu(e, d)) : o === "children" ? typeof d == "string" ? (n !== "textarea" || d !== "") && Fn(e, d) : typeof d == "number" && Fn(e, "" + d) : o !== "suppressContentEditableWarning" && o !== "suppressHydrationWarning" && o !== "autoFocus" && (g.hasOwnProperty(o) ? d != null && o === "onScroll" && he("scroll", e) : d != null && z(e, o, d, i));
              }
              switch (n) {
                case "input":
                  Ir(e), su(e, r, !1);
                  break;
                case "textarea":
                  Ir(e), du(e);
                  break;
                case "option":
                  r.value != null && e.setAttribute("value", "" + ue(r.value));
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
                  typeof l.onClick == "function" && (e.onclick = Zr);
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
        if (e && t.stateNode != null) Ns(e, t, e.memoizedProps, r);
        else {
          if (typeof r != "string" && t.stateNode === null) throw Error(u(166));
          if (n = rn(dr.current), rn(St.current), ol(t)) {
            if (r = t.stateNode, n = t.memoizedProps, r[wt] = t, (o = r.nodeValue !== n) && (e = tt, e !== null)) switch (e.tag) {
              case 3:
                Jr(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && Jr(r.nodeValue, n, (e.mode & 1) !== 0);
            }
            o && (t.flags |= 4);
          } else r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r), r[wt] = t, t.stateNode = r;
        }
        return We(t), null;
      case 13:
        if (ye(Ee), r = t.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
          if (Se && nt !== null && (t.mode & 1) !== 0 && (t.flags & 128) === 0) La(), Pn(), t.flags |= 98560, o = !1;
          else if (o = ol(t), r !== null && r.dehydrated !== null) {
            if (e === null) {
              if (!o) throw Error(u(318));
              if (o = t.memoizedState, o = o !== null ? o.dehydrated : null, !o) throw Error(u(317));
              o[wt] = t;
            } else Pn(), (t.flags & 128) === 0 && (t.memoizedState = null), t.flags |= 4;
            We(t), o = !1;
          } else pt !== null && (Ii(pt), pt = null), o = !0;
          if (!o) return t.flags & 65536 ? t : null;
        }
        return (t.flags & 128) !== 0 ? (t.lanes = n, t) : (r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (t.child.flags |= 8192, (t.mode & 1) !== 0 && (e === null || (Ee.current & 1) !== 0 ? Te === 0 && (Te = 3) : Ti())), t.updateQueue !== null && (t.flags |= 4), We(t), null);
      case 4:
        return Ln(), vi(e, t), e === null && or(t.stateNode.containerInfo), We(t), null;
      case 10:
        return Ho(t.type._context), We(t), null;
      case 17:
        return Ye(t.type) && el(), We(t), null;
      case 19:
        if (ye(Ee), o = t.memoizedState, o === null) return We(t), null;
        if (r = (t.flags & 128) !== 0, i = o.rendering, i === null) if (r) vr(o, !1);
        else {
          if (Te !== 0 || e !== null && (e.flags & 128) !== 0) for (e = t.child; e !== null; ) {
            if (i = fl(e), i !== null) {
              for (t.flags |= 128, vr(o, !1), r = i.updateQueue, r !== null && (t.updateQueue = r, t.flags |= 4), t.subtreeFlags = 0, r = n, n = t.child; n !== null; ) o = n, e = r, o.flags &= 14680066, i = o.alternate, i === null ? (o.childLanes = 0, o.lanes = e, o.child = null, o.subtreeFlags = 0, o.memoizedProps = null, o.memoizedState = null, o.updateQueue = null, o.dependencies = null, o.stateNode = null) : (o.childLanes = i.childLanes, o.lanes = i.lanes, o.child = i.child, o.subtreeFlags = 0, o.deletions = null, o.memoizedProps = i.memoizedProps, o.memoizedState = i.memoizedState, o.updateQueue = i.updateQueue, o.type = i.type, e = i.dependencies, o.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext }), n = n.sibling;
              return pe(Ee, Ee.current & 1 | 2), t.child;
            }
            e = e.sibling;
          }
          o.tail !== null && Ne() > zn && (t.flags |= 128, r = !0, vr(o, !1), t.lanes = 4194304);
        }
        else {
          if (!r) if (e = fl(i), e !== null) {
            if (t.flags |= 128, r = !0, n = e.updateQueue, n !== null && (t.updateQueue = n, t.flags |= 4), vr(o, !0), o.tail === null && o.tailMode === "hidden" && !i.alternate && !Se) return We(t), null;
          } else 2 * Ne() - o.renderingStartTime > zn && n !== 1073741824 && (t.flags |= 128, r = !0, vr(o, !1), t.lanes = 4194304);
          o.isBackwards ? (i.sibling = t.child, t.child = i) : (n = o.last, n !== null ? n.sibling = i : t.child = i, o.last = i);
        }
        return o.tail !== null ? (t = o.tail, o.rendering = t, o.tail = t.sibling, o.renderingStartTime = Ne(), t.sibling = null, n = Ee.current, pe(Ee, r ? n & 1 | 2 : n & 1), t) : (We(t), null);
      case 22:
      case 23:
        return Li(), r = t.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (t.flags |= 8192), r && (t.mode & 1) !== 0 ? (rt & 1073741824) !== 0 && (We(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : We(t), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(u(156, t.tag));
  }
  function pd(e, t) {
    switch (Fo(t), t.tag) {
      case 1:
        return Ye(t.type) && el(), e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 3:
        return Ln(), ye(Ke), ye(Fe), Zo(), e = t.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (t.flags = e & -65537 | 128, t) : null;
      case 5:
        return Xo(t), null;
      case 13:
        if (ye(Ee), e = t.memoizedState, e !== null && e.dehydrated !== null) {
          if (t.alternate === null) throw Error(u(340));
          Pn();
        }
        return e = t.flags, e & 65536 ? (t.flags = e & -65537 | 128, t) : null;
      case 19:
        return ye(Ee), null;
      case 4:
        return Ln(), null;
      case 10:
        return Ho(t.type._context), null;
      case 22:
      case 23:
        return Li(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Sl = !1, Be = !1, md = typeof WeakSet == "function" ? WeakSet : Set, V = null;
  function On(e, t) {
    var n = e.ref;
    if (n !== null) if (typeof n == "function") try {
      n(null);
    } catch (r) {
      xe(e, t, r);
    }
    else n.current = null;
  }
  function gi(e, t, n) {
    try {
      n();
    } catch (r) {
      xe(e, t, r);
    }
  }
  var Is = !1;
  function hd(e, t) {
    if (Lo = Vr, e = ia(), ko(e)) {
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
          var i = 0, c = -1, d = -1, v = 0, I = 0, R = e, P = null;
          t: for (; ; ) {
            for (var F; R !== n || l !== 0 && R.nodeType !== 3 || (c = i + l), R !== o || r !== 0 && R.nodeType !== 3 || (d = i + r), R.nodeType === 3 && (i += R.nodeValue.length), (F = R.firstChild) !== null; )
              P = R, R = F;
            for (; ; ) {
              if (R === e) break t;
              if (P === n && ++v === l && (c = i), P === o && ++I === r && (d = i), (F = R.nextSibling) !== null) break;
              R = P, P = R.parentNode;
            }
            R = F;
          }
          n = c === -1 || d === -1 ? null : { start: c, end: d };
        } else n = null;
      }
      n = n || { start: 0, end: 0 };
    } else n = null;
    for (To = { focusedElem: e, selectionRange: n }, Vr = !1, V = t; V !== null; ) if (t = V, e = t.child, (t.subtreeFlags & 1028) !== 0 && e !== null) e.return = t, V = e;
    else for (; V !== null; ) {
      t = V;
      try {
        var W = t.alternate;
        if ((t.flags & 1024) !== 0) switch (t.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (W !== null) {
              var B = W.memoizedProps, Ie = W.memoizedState, h = t.stateNode, p = h.getSnapshotBeforeUpdate(t.elementType === t.type ? B : mt(t.type, B), Ie);
              h.__reactInternalSnapshotBeforeUpdate = p;
            }
            break;
          case 3:
            var y = t.stateNode.containerInfo;
            y.nodeType === 1 ? y.textContent = "" : y.nodeType === 9 && y.documentElement && y.removeChild(y.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(u(163));
        }
      } catch (T) {
        xe(t, t.return, T);
      }
      if (e = t.sibling, e !== null) {
        e.return = t.return, V = e;
        break;
      }
      V = t.return;
    }
    return W = Is, Is = !1, W;
  }
  function gr(e, t, n) {
    var r = t.updateQueue;
    if (r = r !== null ? r.lastEffect : null, r !== null) {
      var l = r = r.next;
      do {
        if ((l.tag & e) === e) {
          var o = l.destroy;
          l.destroy = void 0, o !== void 0 && gi(t, n, o);
        }
        l = l.next;
      } while (l !== r);
    }
  }
  function _l(e, t) {
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
  function wi(e) {
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
  function Rs(e) {
    var t = e.alternate;
    t !== null && (e.alternate = null, Rs(t)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (t = e.stateNode, t !== null && (delete t[wt], delete t[ur], delete t[Ao], delete t[Jf], delete t[Zf])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
  }
  function Ls(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 4;
  }
  function Ts(e) {
    e: for (; ; ) {
      for (; e.sibling === null; ) {
        if (e.return === null || Ls(e.return)) return null;
        e = e.return;
      }
      for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
        if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
        e.child.return = e, e = e.child;
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Si(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.nodeType === 8 ? n.parentNode.insertBefore(e, t) : n.insertBefore(e, t) : (n.nodeType === 8 ? (t = n.parentNode, t.insertBefore(e, n)) : (t = n, t.appendChild(e)), n = n._reactRootContainer, n != null || t.onclick !== null || (t.onclick = Zr));
    else if (r !== 4 && (e = e.child, e !== null)) for (Si(e, t, n), e = e.sibling; e !== null; ) Si(e, t, n), e = e.sibling;
  }
  function _i(e, t, n) {
    var r = e.tag;
    if (r === 5 || r === 6) e = e.stateNode, t ? n.insertBefore(e, t) : n.appendChild(e);
    else if (r !== 4 && (e = e.child, e !== null)) for (_i(e, t, n), e = e.sibling; e !== null; ) _i(e, t, n), e = e.sibling;
  }
  var Ue = null, ht = !1;
  function qt(e, t, n) {
    for (n = n.child; n !== null; ) Os(e, t, n), n = n.sibling;
  }
  function Os(e, t, n) {
    if (gt && typeof gt.onCommitFiberUnmount == "function") try {
      gt.onCommitFiberUnmount(zr, n);
    } catch {
    }
    switch (n.tag) {
      case 5:
        Be || On(n, t);
      case 6:
        var r = Ue, l = ht;
        Ue = null, qt(e, t, n), Ue = r, ht = l, Ue !== null && (ht ? (e = Ue, n = n.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n)) : Ue.removeChild(n.stateNode));
        break;
      case 18:
        Ue !== null && (ht ? (e = Ue, n = n.stateNode, e.nodeType === 8 ? zo(e.parentNode, n) : e.nodeType === 1 && zo(e, n), Xn(e)) : zo(Ue, n.stateNode));
        break;
      case 4:
        r = Ue, l = ht, Ue = n.stateNode.containerInfo, ht = !0, qt(e, t, n), Ue = r, ht = l;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!Be && (r = n.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
          l = r = r.next;
          do {
            var o = l, i = o.destroy;
            o = o.tag, i !== void 0 && ((o & 2) !== 0 || (o & 4) !== 0) && gi(n, t, i), l = l.next;
          } while (l !== r);
        }
        qt(e, t, n);
        break;
      case 1:
        if (!Be && (On(n, t), r = n.stateNode, typeof r.componentWillUnmount == "function")) try {
          r.props = n.memoizedProps, r.state = n.memoizedState, r.componentWillUnmount();
        } catch (c) {
          xe(n, t, c);
        }
        qt(e, t, n);
        break;
      case 21:
        qt(e, t, n);
        break;
      case 22:
        n.mode & 1 ? (Be = (r = Be) || n.memoizedState !== null, qt(e, t, n), Be = r) : qt(e, t, n);
        break;
      default:
        qt(e, t, n);
    }
  }
  function js(e) {
    var t = e.updateQueue;
    if (t !== null) {
      e.updateQueue = null;
      var n = e.stateNode;
      n === null && (n = e.stateNode = new md()), t.forEach(function(r) {
        var l = Cd.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(l, l));
      });
    }
  }
  function yt(e, t) {
    var n = t.deletions;
    if (n !== null) for (var r = 0; r < n.length; r++) {
      var l = n[r];
      try {
        var o = e, i = t, c = i;
        e: for (; c !== null; ) {
          switch (c.tag) {
            case 5:
              Ue = c.stateNode, ht = !1;
              break e;
            case 3:
              Ue = c.stateNode.containerInfo, ht = !0;
              break e;
            case 4:
              Ue = c.stateNode.containerInfo, ht = !0;
              break e;
          }
          c = c.return;
        }
        if (Ue === null) throw Error(u(160));
        Os(o, i, l), Ue = null, ht = !1;
        var d = l.alternate;
        d !== null && (d.return = null), l.return = null;
      } catch (v) {
        xe(l, t, v);
      }
    }
    if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) zs(t, e), t = t.sibling;
  }
  function zs(e, t) {
    var n = e.alternate, r = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (yt(t, e), kt(e), r & 4) {
          try {
            gr(3, e, e.return), _l(3, e);
          } catch (B) {
            xe(e, e.return, B);
          }
          try {
            gr(5, e, e.return);
          } catch (B) {
            xe(e, e.return, B);
          }
        }
        break;
      case 1:
        yt(t, e), kt(e), r & 512 && n !== null && On(n, n.return);
        break;
      case 5:
        if (yt(t, e), kt(e), r & 512 && n !== null && On(n, n.return), e.flags & 32) {
          var l = e.stateNode;
          try {
            Fn(l, "");
          } catch (B) {
            xe(e, e.return, B);
          }
        }
        if (r & 4 && (l = e.stateNode, l != null)) {
          var o = e.memoizedProps, i = n !== null ? n.memoizedProps : o, c = e.type, d = e.updateQueue;
          if (e.updateQueue = null, d !== null) try {
            c === "input" && o.type === "radio" && o.name != null && au(l, o), Jl(c, i);
            var v = Jl(c, o);
            for (i = 0; i < d.length; i += 2) {
              var I = d[i], R = d[i + 1];
              I === "style" ? yu(l, R) : I === "dangerouslySetInnerHTML" ? mu(l, R) : I === "children" ? Fn(l, R) : z(l, I, R, v);
            }
            switch (c) {
              case "input":
                $l(l, o);
                break;
              case "textarea":
                fu(l, o);
                break;
              case "select":
                var P = l._wrapperState.wasMultiple;
                l._wrapperState.wasMultiple = !!o.multiple;
                var F = o.value;
                F != null ? fn(l, !!o.multiple, F, !1) : P !== !!o.multiple && (o.defaultValue != null ? fn(
                  l,
                  !!o.multiple,
                  o.defaultValue,
                  !0
                ) : fn(l, !!o.multiple, o.multiple ? [] : "", !1));
            }
            l[ur] = o;
          } catch (B) {
            xe(e, e.return, B);
          }
        }
        break;
      case 6:
        if (yt(t, e), kt(e), r & 4) {
          if (e.stateNode === null) throw Error(u(162));
          l = e.stateNode, o = e.memoizedProps;
          try {
            l.nodeValue = o;
          } catch (B) {
            xe(e, e.return, B);
          }
        }
        break;
      case 3:
        if (yt(t, e), kt(e), r & 4 && n !== null && n.memoizedState.isDehydrated) try {
          Xn(t.containerInfo);
        } catch (B) {
          xe(e, e.return, B);
        }
        break;
      case 4:
        yt(t, e), kt(e);
        break;
      case 13:
        yt(t, e), kt(e), l = e.child, l.flags & 8192 && (o = l.memoizedState !== null, l.stateNode.isHidden = o, !o || l.alternate !== null && l.alternate.memoizedState !== null || (Ci = Ne())), r & 4 && js(e);
        break;
      case 22:
        if (I = n !== null && n.memoizedState !== null, e.mode & 1 ? (Be = (v = Be) || I, yt(t, e), Be = v) : yt(t, e), kt(e), r & 8192) {
          if (v = e.memoizedState !== null, (e.stateNode.isHidden = v) && !I && (e.mode & 1) !== 0) for (V = e, I = e.child; I !== null; ) {
            for (R = V = I; V !== null; ) {
              switch (P = V, F = P.child, P.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  gr(4, P, P.return);
                  break;
                case 1:
                  On(P, P.return);
                  var W = P.stateNode;
                  if (typeof W.componentWillUnmount == "function") {
                    r = P, n = P.return;
                    try {
                      t = r, W.props = t.memoizedProps, W.state = t.memoizedState, W.componentWillUnmount();
                    } catch (B) {
                      xe(r, n, B);
                    }
                  }
                  break;
                case 5:
                  On(P, P.return);
                  break;
                case 22:
                  if (P.memoizedState !== null) {
                    Us(R);
                    continue;
                  }
              }
              F !== null ? (F.return = P, V = F) : Us(R);
            }
            I = I.sibling;
          }
          e: for (I = null, R = e; ; ) {
            if (R.tag === 5) {
              if (I === null) {
                I = R;
                try {
                  l = R.stateNode, v ? (o = l.style, typeof o.setProperty == "function" ? o.setProperty("display", "none", "important") : o.display = "none") : (c = R.stateNode, d = R.memoizedProps.style, i = d != null && d.hasOwnProperty("display") ? d.display : null, c.style.display = hu("display", i));
                } catch (B) {
                  xe(e, e.return, B);
                }
              }
            } else if (R.tag === 6) {
              if (I === null) try {
                R.stateNode.nodeValue = v ? "" : R.memoizedProps;
              } catch (B) {
                xe(e, e.return, B);
              }
            } else if ((R.tag !== 22 && R.tag !== 23 || R.memoizedState === null || R === e) && R.child !== null) {
              R.child.return = R, R = R.child;
              continue;
            }
            if (R === e) break e;
            for (; R.sibling === null; ) {
              if (R.return === null || R.return === e) break e;
              I === R && (I = null), R = R.return;
            }
            I === R && (I = null), R.sibling.return = R.return, R = R.sibling;
          }
        }
        break;
      case 19:
        yt(t, e), kt(e), r & 4 && js(e);
        break;
      case 21:
        break;
      default:
        yt(
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
            if (Ls(n)) {
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
            r.flags & 32 && (Fn(l, ""), r.flags &= -33);
            var o = Ts(e);
            _i(e, o, l);
            break;
          case 3:
          case 4:
            var i = r.stateNode.containerInfo, c = Ts(e);
            Si(e, c, i);
            break;
          default:
            throw Error(u(161));
        }
      } catch (d) {
        xe(e, e.return, d);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function yd(e, t, n) {
    V = e, As(e);
  }
  function As(e, t, n) {
    for (var r = (e.mode & 1) !== 0; V !== null; ) {
      var l = V, o = l.child;
      if (l.tag === 22 && r) {
        var i = l.memoizedState !== null || Sl;
        if (!i) {
          var c = l.alternate, d = c !== null && c.memoizedState !== null || Be;
          c = Sl;
          var v = Be;
          if (Sl = i, (Be = d) && !v) for (V = l; V !== null; ) i = V, d = i.child, i.tag === 22 && i.memoizedState !== null ? Ms(l) : d !== null ? (d.return = i, V = d) : Ms(l);
          for (; o !== null; ) V = o, As(o), o = o.sibling;
          V = l, Sl = c, Be = v;
        }
        Ds(e);
      } else (l.subtreeFlags & 8772) !== 0 && o !== null ? (o.return = l, V = o) : Ds(e);
    }
  }
  function Ds(e) {
    for (; V !== null; ) {
      var t = V;
      if ((t.flags & 8772) !== 0) {
        var n = t.alternate;
        try {
          if ((t.flags & 8772) !== 0) switch (t.tag) {
            case 0:
            case 11:
            case 15:
              Be || _l(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !Be) if (n === null) r.componentDidMount();
              else {
                var l = t.elementType === t.type ? n.memoizedProps : mt(t.type, n.memoizedProps);
                r.componentDidUpdate(l, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
              }
              var o = t.updateQueue;
              o !== null && Ua(t, o, r);
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
                Ua(t, i, n);
              }
              break;
            case 5:
              var c = t.stateNode;
              if (n === null && t.flags & 4) {
                n = c;
                var d = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    d.autoFocus && n.focus();
                    break;
                  case "img":
                    d.src && (n.src = d.src);
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
                  var I = v.memoizedState;
                  if (I !== null) {
                    var R = I.dehydrated;
                    R !== null && Xn(R);
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
          Be || t.flags & 512 && wi(t);
        } catch (P) {
          xe(t, t.return, P);
        }
      }
      if (t === e) {
        V = null;
        break;
      }
      if (n = t.sibling, n !== null) {
        n.return = t.return, V = n;
        break;
      }
      V = t.return;
    }
  }
  function Us(e) {
    for (; V !== null; ) {
      var t = V;
      if (t === e) {
        V = null;
        break;
      }
      var n = t.sibling;
      if (n !== null) {
        n.return = t.return, V = n;
        break;
      }
      V = t.return;
    }
  }
  function Ms(e) {
    for (; V !== null; ) {
      var t = V;
      try {
        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            var n = t.return;
            try {
              _l(4, t);
            } catch (d) {
              xe(t, n, d);
            }
            break;
          case 1:
            var r = t.stateNode;
            if (typeof r.componentDidMount == "function") {
              var l = t.return;
              try {
                r.componentDidMount();
              } catch (d) {
                xe(t, l, d);
              }
            }
            var o = t.return;
            try {
              wi(t);
            } catch (d) {
              xe(t, o, d);
            }
            break;
          case 5:
            var i = t.return;
            try {
              wi(t);
            } catch (d) {
              xe(t, i, d);
            }
        }
      } catch (d) {
        xe(t, t.return, d);
      }
      if (t === e) {
        V = null;
        break;
      }
      var c = t.sibling;
      if (c !== null) {
        c.return = t.return, V = c;
        break;
      }
      V = t.return;
    }
  }
  var vd = Math.ceil, kl = se.ReactCurrentDispatcher, ki = se.ReactCurrentOwner, at = se.ReactCurrentBatchConfig, oe = 0, ze = null, Re = null, Me = 0, rt = 0, jn = Ft(0), Te = 0, wr = null, on = 0, El = 0, Ei = 0, Sr = null, Xe = null, Ci = 0, zn = 1 / 0, Lt = null, Cl = !1, xi = null, Ht = null, xl = !1, $t = null, Pl = 0, _r = 0, Pi = null, Nl = -1, Il = 0;
  function $e() {
    return (oe & 6) !== 0 ? Ne() : Nl !== -1 ? Nl : Nl = Ne();
  }
  function Kt(e) {
    return (e.mode & 1) === 0 ? 1 : (oe & 2) !== 0 && Me !== 0 ? Me & -Me : ed.transition !== null ? (Il === 0 && (Il = Tu()), Il) : (e = ae, e !== 0 || (e = window.event, e = e === void 0 ? 16 : Vu(e.type)), e);
  }
  function vt(e, t, n, r) {
    if (50 < _r) throw _r = 0, Pi = null, Error(u(185));
    Hn(e, n, r), ((oe & 2) === 0 || e !== ze) && (e === ze && ((oe & 2) === 0 && (El |= n), Te === 4 && Yt(e, Me)), Je(e, r), n === 1 && oe === 0 && (t.mode & 1) === 0 && (zn = Ne() + 500, nl && Wt()));
  }
  function Je(e, t) {
    var n = e.callbackNode;
    bc(e, t);
    var r = Ur(e, e === ze ? Me : 0);
    if (r === 0) n !== null && Iu(n), e.callbackNode = null, e.callbackPriority = 0;
    else if (t = r & -r, e.callbackPriority !== t) {
      if (n != null && Iu(n), t === 1) e.tag === 0 ? bf(Vs.bind(null, e)) : xa(Vs.bind(null, e)), Gf(function() {
        (oe & 6) === 0 && Wt();
      }), n = null;
      else {
        switch (Ou(r)) {
          case 1:
            n = lo;
            break;
          case 4:
            n = Ru;
            break;
          case 16:
            n = jr;
            break;
          case 536870912:
            n = Lu;
            break;
          default:
            n = jr;
        }
        n = Ys(n, Fs.bind(null, e));
      }
      e.callbackPriority = t, e.callbackNode = n;
    }
  }
  function Fs(e, t) {
    if (Nl = -1, Il = 0, (oe & 6) !== 0) throw Error(u(327));
    var n = e.callbackNode;
    if (An() && e.callbackNode !== n) return null;
    var r = Ur(e, e === ze ? Me : 0);
    if (r === 0) return null;
    if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || t) t = Rl(e, r);
    else {
      t = r;
      var l = oe;
      oe |= 2;
      var o = Bs();
      (ze !== e || Me !== t) && (Lt = null, zn = Ne() + 500, an(e, t));
      do
        try {
          Sd();
          break;
        } catch (c) {
          Ws(e, c);
        }
      while (!0);
      qo(), kl.current = o, oe = l, Re !== null ? t = 0 : (ze = null, Me = 0, t = Te);
    }
    if (t !== 0) {
      if (t === 2 && (l = oo(e), l !== 0 && (r = l, t = Ni(e, l))), t === 1) throw n = wr, an(e, 0), Yt(e, r), Je(e, Ne()), n;
      if (t === 6) Yt(e, r);
      else {
        if (l = e.current.alternate, (r & 30) === 0 && !gd(l) && (t = Rl(e, r), t === 2 && (o = oo(e), o !== 0 && (r = o, t = Ni(e, o))), t === 1)) throw n = wr, an(e, 0), Yt(e, r), Je(e, Ne()), n;
        switch (e.finishedWork = l, e.finishedLanes = r, t) {
          case 0:
          case 1:
            throw Error(u(345));
          case 2:
            sn(e, Xe, Lt);
            break;
          case 3:
            if (Yt(e, r), (r & 130023424) === r && (t = Ci + 500 - Ne(), 10 < t)) {
              if (Ur(e, 0) !== 0) break;
              if (l = e.suspendedLanes, (l & r) !== r) {
                $e(), e.pingedLanes |= e.suspendedLanes & l;
                break;
              }
              e.timeoutHandle = jo(sn.bind(null, e, Xe, Lt), t);
              break;
            }
            sn(e, Xe, Lt);
            break;
          case 4:
            if (Yt(e, r), (r & 4194240) === r) break;
            for (t = e.eventTimes, l = -1; 0 < r; ) {
              var i = 31 - ft(r);
              o = 1 << i, i = t[i], i > l && (l = i), r &= ~o;
            }
            if (r = l, r = Ne() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3e3 > r ? 3e3 : 4320 > r ? 4320 : 1960 * vd(r / 1960)) - r, 10 < r) {
              e.timeoutHandle = jo(sn.bind(null, e, Xe, Lt), r);
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
    return Je(e, Ne()), e.callbackNode === n ? Fs.bind(null, e) : null;
  }
  function Ni(e, t) {
    var n = Sr;
    return e.current.memoizedState.isDehydrated && (an(e, t).flags |= 256), e = Rl(e, t), e !== 2 && (t = Xe, Xe = n, t !== null && Ii(t)), e;
  }
  function Ii(e) {
    Xe === null ? Xe = e : Xe.push.apply(Xe, e);
  }
  function gd(e) {
    for (var t = e; ; ) {
      if (t.flags & 16384) {
        var n = t.updateQueue;
        if (n !== null && (n = n.stores, n !== null)) for (var r = 0; r < n.length; r++) {
          var l = n[r], o = l.getSnapshot;
          l = l.value;
          try {
            if (!dt(o(), l)) return !1;
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
  function Yt(e, t) {
    for (t &= ~Ei, t &= ~El, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
      var n = 31 - ft(t), r = 1 << n;
      e[n] = -1, t &= ~r;
    }
  }
  function Vs(e) {
    if ((oe & 6) !== 0) throw Error(u(327));
    An();
    var t = Ur(e, 0);
    if ((t & 1) === 0) return Je(e, Ne()), null;
    var n = Rl(e, t);
    if (e.tag !== 0 && n === 2) {
      var r = oo(e);
      r !== 0 && (t = r, n = Ni(e, r));
    }
    if (n === 1) throw n = wr, an(e, 0), Yt(e, t), Je(e, Ne()), n;
    if (n === 6) throw Error(u(345));
    return e.finishedWork = e.current.alternate, e.finishedLanes = t, sn(e, Xe, Lt), Je(e, Ne()), null;
  }
  function Ri(e, t) {
    var n = oe;
    oe |= 1;
    try {
      return e(t);
    } finally {
      oe = n, oe === 0 && (zn = Ne() + 500, nl && Wt());
    }
  }
  function un(e) {
    $t !== null && $t.tag === 0 && (oe & 6) === 0 && An();
    var t = oe;
    oe |= 1;
    var n = at.transition, r = ae;
    try {
      if (at.transition = null, ae = 1, e) return e();
    } finally {
      ae = r, at.transition = n, oe = t, (oe & 6) === 0 && Wt();
    }
  }
  function Li() {
    rt = jn.current, ye(jn);
  }
  function an(e, t) {
    e.finishedWork = null, e.finishedLanes = 0;
    var n = e.timeoutHandle;
    if (n !== -1 && (e.timeoutHandle = -1, Yf(n)), Re !== null) for (n = Re.return; n !== null; ) {
      var r = n;
      switch (Fo(r), r.tag) {
        case 1:
          r = r.type.childContextTypes, r != null && el();
          break;
        case 3:
          Ln(), ye(Ke), ye(Fe), Zo();
          break;
        case 5:
          Xo(r);
          break;
        case 4:
          Ln();
          break;
        case 13:
          ye(Ee);
          break;
        case 19:
          ye(Ee);
          break;
        case 10:
          Ho(r.type._context);
          break;
        case 22:
        case 23:
          Li();
      }
      n = n.return;
    }
    if (ze = e, Re = e = Gt(e.current, null), Me = rt = t, Te = 0, wr = null, Ei = El = on = 0, Xe = Sr = null, nn !== null) {
      for (t = 0; t < nn.length; t++) if (n = nn[t], r = n.interleaved, r !== null) {
        n.interleaved = null;
        var l = r.next, o = n.pending;
        if (o !== null) {
          var i = o.next;
          o.next = l, r.next = i;
        }
        n.pending = r;
      }
      nn = null;
    }
    return e;
  }
  function Ws(e, t) {
    do {
      var n = Re;
      try {
        if (qo(), dl.current = yl, pl) {
          for (var r = Ce.memoizedState; r !== null; ) {
            var l = r.queue;
            l !== null && (l.pending = null), r = r.next;
          }
          pl = !1;
        }
        if (ln = 0, je = Le = Ce = null, pr = !1, mr = 0, ki.current = null, n === null || n.return === null) {
          Te = 1, wr = t, Re = null;
          break;
        }
        e: {
          var o = e, i = n.return, c = n, d = t;
          if (t = Me, c.flags |= 32768, d !== null && typeof d == "object" && typeof d.then == "function") {
            var v = d, I = c, R = I.tag;
            if ((I.mode & 1) === 0 && (R === 0 || R === 11 || R === 15)) {
              var P = I.alternate;
              P ? (I.updateQueue = P.updateQueue, I.memoizedState = P.memoizedState, I.lanes = P.lanes) : (I.updateQueue = null, I.memoizedState = null);
            }
            var F = ds(i);
            if (F !== null) {
              F.flags &= -257, ps(F, i, c, o, t), F.mode & 1 && fs(o, v, t), t = F, d = v;
              var W = t.updateQueue;
              if (W === null) {
                var B = /* @__PURE__ */ new Set();
                B.add(d), t.updateQueue = B;
              } else W.add(d);
              break e;
            } else {
              if ((t & 1) === 0) {
                fs(o, v, t), Ti();
                break e;
              }
              d = Error(u(426));
            }
          } else if (Se && c.mode & 1) {
            var Ie = ds(i);
            if (Ie !== null) {
              (Ie.flags & 65536) === 0 && (Ie.flags |= 256), ps(Ie, i, c, o, t), Bo(Tn(d, c));
              break e;
            }
          }
          o = d = Tn(d, c), Te !== 4 && (Te = 2), Sr === null ? Sr = [o] : Sr.push(o), o = i;
          do {
            switch (o.tag) {
              case 3:
                o.flags |= 65536, t &= -t, o.lanes |= t;
                var h = ss(o, d, t);
                Da(o, h);
                break e;
              case 1:
                c = d;
                var p = o.type, y = o.stateNode;
                if ((o.flags & 128) === 0 && (typeof p.getDerivedStateFromError == "function" || y !== null && typeof y.componentDidCatch == "function" && (Ht === null || !Ht.has(y)))) {
                  o.flags |= 65536, t &= -t, o.lanes |= t;
                  var T = cs(o, c, t);
                  Da(o, T);
                  break e;
                }
            }
            o = o.return;
          } while (o !== null);
        }
        qs(n);
      } catch (q) {
        t = q, Re === n && n !== null && (Re = n = n.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Bs() {
    var e = kl.current;
    return kl.current = yl, e === null ? yl : e;
  }
  function Ti() {
    (Te === 0 || Te === 3 || Te === 2) && (Te = 4), ze === null || (on & 268435455) === 0 && (El & 268435455) === 0 || Yt(ze, Me);
  }
  function Rl(e, t) {
    var n = oe;
    oe |= 2;
    var r = Bs();
    (ze !== e || Me !== t) && (Lt = null, an(e, t));
    do
      try {
        wd();
        break;
      } catch (l) {
        Ws(e, l);
      }
    while (!0);
    if (qo(), oe = n, kl.current = r, Re !== null) throw Error(u(261));
    return ze = null, Me = 0, Te;
  }
  function wd() {
    for (; Re !== null; ) Qs(Re);
  }
  function Sd() {
    for (; Re !== null && !qc(); ) Qs(Re);
  }
  function Qs(e) {
    var t = Ks(e.alternate, e, rt);
    e.memoizedProps = e.pendingProps, t === null ? qs(e) : Re = t, ki.current = null;
  }
  function qs(e) {
    var t = e;
    do {
      var n = t.alternate;
      if (e = t.return, (t.flags & 32768) === 0) {
        if (n = dd(n, t, rt), n !== null) {
          Re = n;
          return;
        }
      } else {
        if (n = pd(n, t), n !== null) {
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
    var r = ae, l = at.transition;
    try {
      at.transition = null, ae = 1, _d(e, t, n, r);
    } finally {
      at.transition = l, ae = r;
    }
    return null;
  }
  function _d(e, t, n, r) {
    do
      An();
    while ($t !== null);
    if ((oe & 6) !== 0) throw Error(u(327));
    n = e.finishedWork;
    var l = e.finishedLanes;
    if (n === null) return null;
    if (e.finishedWork = null, e.finishedLanes = 0, n === e.current) throw Error(u(177));
    e.callbackNode = null, e.callbackPriority = 0;
    var o = n.lanes | n.childLanes;
    if (ef(e, o), e === ze && (Re = ze = null, Me = 0), (n.subtreeFlags & 2064) === 0 && (n.flags & 2064) === 0 || xl || (xl = !0, Ys(jr, function() {
      return An(), null;
    })), o = (n.flags & 15990) !== 0, (n.subtreeFlags & 15990) !== 0 || o) {
      o = at.transition, at.transition = null;
      var i = ae;
      ae = 1;
      var c = oe;
      oe |= 4, ki.current = null, hd(e, n), zs(n, e), Wf(To), Vr = !!Lo, To = Lo = null, e.current = n, yd(n), Hc(), oe = c, ae = i, at.transition = o;
    } else e.current = n;
    if (xl && (xl = !1, $t = e, Pl = l), o = e.pendingLanes, o === 0 && (Ht = null), Yc(n.stateNode), Je(e, Ne()), t !== null) for (r = e.onRecoverableError, n = 0; n < t.length; n++) l = t[n], r(l.value, { componentStack: l.stack, digest: l.digest });
    if (Cl) throw Cl = !1, e = xi, xi = null, e;
    return (Pl & 1) !== 0 && e.tag !== 0 && An(), o = e.pendingLanes, (o & 1) !== 0 ? e === Pi ? _r++ : (_r = 0, Pi = e) : _r = 0, Wt(), null;
  }
  function An() {
    if ($t !== null) {
      var e = Ou(Pl), t = at.transition, n = ae;
      try {
        if (at.transition = null, ae = 16 > e ? 16 : e, $t === null) var r = !1;
        else {
          if (e = $t, $t = null, Pl = 0, (oe & 6) !== 0) throw Error(u(331));
          var l = oe;
          for (oe |= 4, V = e.current; V !== null; ) {
            var o = V, i = o.child;
            if ((V.flags & 16) !== 0) {
              var c = o.deletions;
              if (c !== null) {
                for (var d = 0; d < c.length; d++) {
                  var v = c[d];
                  for (V = v; V !== null; ) {
                    var I = V;
                    switch (I.tag) {
                      case 0:
                      case 11:
                      case 15:
                        gr(8, I, o);
                    }
                    var R = I.child;
                    if (R !== null) R.return = I, V = R;
                    else for (; V !== null; ) {
                      I = V;
                      var P = I.sibling, F = I.return;
                      if (Rs(I), I === v) {
                        V = null;
                        break;
                      }
                      if (P !== null) {
                        P.return = F, V = P;
                        break;
                      }
                      V = F;
                    }
                  }
                }
                var W = o.alternate;
                if (W !== null) {
                  var B = W.child;
                  if (B !== null) {
                    W.child = null;
                    do {
                      var Ie = B.sibling;
                      B.sibling = null, B = Ie;
                    } while (B !== null);
                  }
                }
                V = o;
              }
            }
            if ((o.subtreeFlags & 2064) !== 0 && i !== null) i.return = o, V = i;
            else e: for (; V !== null; ) {
              if (o = V, (o.flags & 2048) !== 0) switch (o.tag) {
                case 0:
                case 11:
                case 15:
                  gr(9, o, o.return);
              }
              var h = o.sibling;
              if (h !== null) {
                h.return = o.return, V = h;
                break e;
              }
              V = o.return;
            }
          }
          var p = e.current;
          for (V = p; V !== null; ) {
            i = V;
            var y = i.child;
            if ((i.subtreeFlags & 2064) !== 0 && y !== null) y.return = i, V = y;
            else e: for (i = p; V !== null; ) {
              if (c = V, (c.flags & 2048) !== 0) try {
                switch (c.tag) {
                  case 0:
                  case 11:
                  case 15:
                    _l(9, c);
                }
              } catch (q) {
                xe(c, c.return, q);
              }
              if (c === i) {
                V = null;
                break e;
              }
              var T = c.sibling;
              if (T !== null) {
                T.return = c.return, V = T;
                break e;
              }
              V = c.return;
            }
          }
          if (oe = l, Wt(), gt && typeof gt.onPostCommitFiberRoot == "function") try {
            gt.onPostCommitFiberRoot(zr, e);
          } catch {
          }
          r = !0;
        }
        return r;
      } finally {
        ae = n, at.transition = t;
      }
    }
    return !1;
  }
  function Hs(e, t, n) {
    t = Tn(n, t), t = ss(e, t, 1), e = Qt(e, t, 1), t = $e(), e !== null && (Hn(e, 1, t), Je(e, t));
  }
  function xe(e, t, n) {
    if (e.tag === 3) Hs(e, e, n);
    else for (; t !== null; ) {
      if (t.tag === 3) {
        Hs(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (typeof t.type.getDerivedStateFromError == "function" || typeof r.componentDidCatch == "function" && (Ht === null || !Ht.has(r))) {
          e = Tn(n, e), e = cs(t, e, 1), t = Qt(t, e, 1), e = $e(), t !== null && (Hn(t, 1, e), Je(t, e));
          break;
        }
      }
      t = t.return;
    }
  }
  function kd(e, t, n) {
    var r = e.pingCache;
    r !== null && r.delete(t), t = $e(), e.pingedLanes |= e.suspendedLanes & n, ze === e && (Me & n) === n && (Te === 4 || Te === 3 && (Me & 130023424) === Me && 500 > Ne() - Ci ? an(e, 0) : Ei |= n), Je(e, t);
  }
  function $s(e, t) {
    t === 0 && ((e.mode & 1) === 0 ? t = 1 : (t = Dr, Dr <<= 1, (Dr & 130023424) === 0 && (Dr = 4194304)));
    var n = $e();
    e = Nt(e, t), e !== null && (Hn(e, t, n), Je(e, n));
  }
  function Ed(e) {
    var t = e.memoizedState, n = 0;
    t !== null && (n = t.retryLane), $s(e, n);
  }
  function Cd(e, t) {
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
    r !== null && r.delete(t), $s(e, n);
  }
  var Ks;
  Ks = function(e, t, n) {
    if (e !== null) if (e.memoizedProps !== t.pendingProps || Ke.current) Ge = !0;
    else {
      if ((e.lanes & n) === 0 && (t.flags & 128) === 0) return Ge = !1, fd(e, t, n);
      Ge = (e.flags & 131072) !== 0;
    }
    else Ge = !1, Se && (t.flags & 1048576) !== 0 && Pa(t, ll, t.index);
    switch (t.lanes = 0, t.tag) {
      case 2:
        var r = t.type;
        wl(e, t), e = t.pendingProps;
        var l = En(t, Fe.current);
        Rn(t, n), l = ti(null, t, r, e, l, n);
        var o = ni();
        return t.flags |= 1, typeof l == "object" && l !== null && typeof l.render == "function" && l.$$typeof === void 0 ? (t.tag = 1, t.memoizedState = null, t.updateQueue = null, Ye(r) ? (o = !0, tl(t)) : o = !1, t.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, Yo(t), l.updater = vl, t.stateNode = l, l._reactInternals = t, ai(t, r, e, n), t = di(null, t, r, !0, o, n)) : (t.tag = 0, Se && o && Mo(t), He(null, t, l, n), t = t.child), t;
      case 16:
        r = t.elementType;
        e: {
          switch (wl(e, t), e = t.pendingProps, l = r._init, r = l(r._payload), t.type = r, l = t.tag = Pd(r), e = mt(r, e), l) {
            case 0:
              t = fi(null, t, r, e, n);
              break e;
            case 1:
              t = ws(null, t, r, e, n);
              break e;
            case 11:
              t = ms(null, t, r, e, n);
              break e;
            case 14:
              t = hs(null, t, r, mt(r.type, e), n);
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
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : mt(r, l), fi(e, t, r, l, n);
      case 1:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : mt(r, l), ws(e, t, r, l, n);
      case 3:
        e: {
          if (Ss(t), e === null) throw Error(u(387));
          r = t.pendingProps, o = t.memoizedState, l = o.element, Aa(e, t), cl(t, r, null, n);
          var i = t.memoizedState;
          if (r = i.element, o.isDehydrated) if (o = { element: r, isDehydrated: !1, cache: i.cache, pendingSuspenseBoundaries: i.pendingSuspenseBoundaries, transitions: i.transitions }, t.updateQueue.baseState = o, t.memoizedState = o, t.flags & 256) {
            l = Tn(Error(u(423)), t), t = _s(e, t, r, n, l);
            break e;
          } else if (r !== l) {
            l = Tn(Error(u(424)), t), t = _s(e, t, r, n, l);
            break e;
          } else for (nt = Mt(t.stateNode.containerInfo.firstChild), tt = t, Se = !0, pt = null, n = ja(t, null, r, n), t.child = n; n; ) n.flags = n.flags & -3 | 4096, n = n.sibling;
          else {
            if (Pn(), r === l) {
              t = Rt(e, t, n);
              break e;
            }
            He(e, t, r, n);
          }
          t = t.child;
        }
        return t;
      case 5:
        return Ma(t), e === null && Wo(t), r = t.type, l = t.pendingProps, o = e !== null ? e.memoizedProps : null, i = l.children, Oo(r, l) ? i = null : o !== null && Oo(r, o) && (t.flags |= 32), gs(e, t), He(e, t, i, n), t.child;
      case 6:
        return e === null && Wo(t), null;
      case 13:
        return ks(e, t, n);
      case 4:
        return Go(t, t.stateNode.containerInfo), r = t.pendingProps, e === null ? t.child = Nn(t, null, r, n) : He(e, t, r, n), t.child;
      case 11:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : mt(r, l), ms(e, t, r, l, n);
      case 7:
        return He(e, t, t.pendingProps, n), t.child;
      case 8:
        return He(e, t, t.pendingProps.children, n), t.child;
      case 12:
        return He(e, t, t.pendingProps.children, n), t.child;
      case 10:
        e: {
          if (r = t.type._context, l = t.pendingProps, o = t.memoizedProps, i = l.value, pe(ul, r._currentValue), r._currentValue = i, o !== null) if (dt(o.value, i)) {
            if (o.children === l.children && !Ke.current) {
              t = Rt(e, t, n);
              break e;
            }
          } else for (o = t.child, o !== null && (o.return = t); o !== null; ) {
            var c = o.dependencies;
            if (c !== null) {
              i = o.child;
              for (var d = c.firstContext; d !== null; ) {
                if (d.context === r) {
                  if (o.tag === 1) {
                    d = It(-1, n & -n), d.tag = 2;
                    var v = o.updateQueue;
                    if (v !== null) {
                      v = v.shared;
                      var I = v.pending;
                      I === null ? d.next = d : (d.next = I.next, I.next = d), v.pending = d;
                    }
                  }
                  o.lanes |= n, d = o.alternate, d !== null && (d.lanes |= n), $o(
                    o.return,
                    n,
                    t
                  ), c.lanes |= n;
                  break;
                }
                d = d.next;
              }
            } else if (o.tag === 10) i = o.type === t.type ? null : o.child;
            else if (o.tag === 18) {
              if (i = o.return, i === null) throw Error(u(341));
              i.lanes |= n, c = i.alternate, c !== null && (c.lanes |= n), $o(i, n, t), i = o.sibling;
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
        return r = t.type, l = mt(r, t.pendingProps), l = mt(r.type, l), hs(e, t, r, l, n);
      case 15:
        return ys(e, t, t.type, t.pendingProps, n);
      case 17:
        return r = t.type, l = t.pendingProps, l = t.elementType === r ? l : mt(r, l), wl(e, t), t.tag = 1, Ye(r) ? (e = !0, tl(t)) : e = !1, Rn(t, n), us(t, r, l), ai(t, r, l, n), di(null, t, r, !0, e, n);
      case 19:
        return Cs(e, t, n);
      case 22:
        return vs(e, t, n);
    }
    throw Error(u(156, t.tag));
  };
  function Ys(e, t) {
    return Nu(e, t);
  }
  function xd(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function st(e, t, n, r) {
    return new xd(e, t, n, r);
  }
  function Oi(e) {
    return e = e.prototype, !(!e || !e.isReactComponent);
  }
  function Pd(e) {
    if (typeof e == "function") return Oi(e) ? 1 : 0;
    if (e != null) {
      if (e = e.$$typeof, e === _e) return 11;
      if (e === Pe) return 14;
    }
    return 2;
  }
  function Gt(e, t) {
    var n = e.alternate;
    return n === null ? (n = st(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.type = e.type, n.flags = 0, n.subtreeFlags = 0, n.deletions = null), n.flags = e.flags & 14680064, n.childLanes = e.childLanes, n.lanes = e.lanes, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, t = e.dependencies, n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }
  function Ll(e, t, n, r, l, o) {
    var i = 2;
    if (r = e, typeof e == "function") Oi(e) && (i = 1);
    else if (typeof e == "string") i = 5;
    else e: switch (e) {
      case ve:
        return cn(n.children, l, o, t);
      case me:
        i = 8, l |= 8;
        break;
      case Qe:
        return e = st(12, n, t, l | 2), e.elementType = Qe, e.lanes = o, e;
      case D:
        return e = st(13, n, t, l), e.elementType = D, e.lanes = o, e;
      case ke:
        return e = st(19, n, t, l), e.elementType = ke, e.lanes = o, e;
      case fe:
        return Tl(n, l, o, t);
      default:
        if (typeof e == "object" && e !== null) switch (e.$$typeof) {
          case ge:
            i = 10;
            break e;
          case qe:
            i = 9;
            break e;
          case _e:
            i = 11;
            break e;
          case Pe:
            i = 14;
            break e;
          case Oe:
            i = 16, r = null;
            break e;
        }
        throw Error(u(130, e == null ? e : typeof e, ""));
    }
    return t = st(i, n, t, l), t.elementType = e, t.type = r, t.lanes = o, t;
  }
  function cn(e, t, n, r) {
    return e = st(7, e, r, t), e.lanes = n, e;
  }
  function Tl(e, t, n, r) {
    return e = st(22, e, r, t), e.elementType = fe, e.lanes = n, e.stateNode = { isHidden: !1 }, e;
  }
  function ji(e, t, n) {
    return e = st(6, e, null, t), e.lanes = n, e;
  }
  function zi(e, t, n) {
    return t = st(4, e.children !== null ? e.children : [], e.key, t), t.lanes = n, t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }, t;
  }
  function Nd(e, t, n, r, l) {
    this.tag = t, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = io(0), this.expirationTimes = io(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = io(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
  }
  function Ai(e, t, n, r, l, o, i, c, d) {
    return e = new Nd(e, t, n, c, d), t === 1 ? (t = 1, o === !0 && (t |= 8)) : t = 0, o = st(3, null, null, t), e.current = o, o.stateNode = e, o.memoizedState = { element: r, isDehydrated: n, cache: null, transitions: null, pendingSuspenseBoundaries: null }, Yo(o), e;
  }
  function Id(e, t, n) {
    var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: ee, key: r == null ? null : "" + r, children: e, containerInfo: t, implementation: n };
  }
  function Gs(e) {
    if (!e) return Vt;
    e = e._reactInternals;
    e: {
      if (Jt(e) !== e || e.tag !== 1) throw Error(u(170));
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
      if (Ye(n)) return Ea(e, n, t);
    }
    return t;
  }
  function Xs(e, t, n, r, l, o, i, c, d) {
    return e = Ai(n, r, !0, e, l, o, i, c, d), e.context = Gs(null), n = e.current, r = $e(), l = Kt(n), o = It(r, l), o.callback = t ?? null, Qt(n, o, l), e.current.lanes = l, Hn(e, l, r), Je(e, r), e;
  }
  function Ol(e, t, n, r) {
    var l = t.current, o = $e(), i = Kt(l);
    return n = Gs(n), t.context === null ? t.context = n : t.pendingContext = n, t = It(o, i), t.payload = { element: e }, r = r === void 0 ? null : r, r !== null && (t.callback = r), e = Qt(l, t, i), e !== null && (vt(e, l, i, o), sl(e, l, i)), i;
  }
  function jl(e) {
    if (e = e.current, !e.child) return null;
    switch (e.child.tag) {
      case 5:
        return e.child.stateNode;
      default:
        return e.child.stateNode;
    }
  }
  function Js(e, t) {
    if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function Di(e, t) {
    Js(e, t), (e = e.alternate) && Js(e, t);
  }
  function Rd() {
    return null;
  }
  var Zs = typeof reportError == "function" ? reportError : function(e) {
    console.error(e);
  };
  function Ui(e) {
    this._internalRoot = e;
  }
  zl.prototype.render = Ui.prototype.render = function(e) {
    var t = this._internalRoot;
    if (t === null) throw Error(u(409));
    Ol(e, t, null, null);
  }, zl.prototype.unmount = Ui.prototype.unmount = function() {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var t = e.containerInfo;
      un(function() {
        Ol(null, e, null, null);
      }), t[Et] = null;
    }
  };
  function zl(e) {
    this._internalRoot = e;
  }
  zl.prototype.unstable_scheduleHydration = function(e) {
    if (e) {
      var t = Au();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < At.length && t !== 0 && t < At[n].priority; n++) ;
      At.splice(n, 0, e), n === 0 && Mu(e);
    }
  };
  function Mi(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
  }
  function Al(e) {
    return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
  }
  function bs() {
  }
  function Ld(e, t, n, r, l) {
    if (l) {
      if (typeof r == "function") {
        var o = r;
        r = function() {
          var v = jl(i);
          o.call(v);
        };
      }
      var i = Xs(t, r, e, 0, null, !1, !1, "", bs);
      return e._reactRootContainer = i, e[Et] = i.current, or(e.nodeType === 8 ? e.parentNode : e), un(), i;
    }
    for (; l = e.lastChild; ) e.removeChild(l);
    if (typeof r == "function") {
      var c = r;
      r = function() {
        var v = jl(d);
        c.call(v);
      };
    }
    var d = Ai(e, 0, !1, null, null, !1, !1, "", bs);
    return e._reactRootContainer = d, e[Et] = d.current, or(e.nodeType === 8 ? e.parentNode : e), un(function() {
      Ol(t, d, n, r);
    }), d;
  }
  function Dl(e, t, n, r, l) {
    var o = n._reactRootContainer;
    if (o) {
      var i = o;
      if (typeof l == "function") {
        var c = l;
        l = function() {
          var d = jl(i);
          c.call(d);
        };
      }
      Ol(t, i, e, l);
    } else i = Ld(n, t, e, l, r);
    return jl(i);
  }
  ju = function(e) {
    switch (e.tag) {
      case 3:
        var t = e.stateNode;
        if (t.current.memoizedState.isDehydrated) {
          var n = qn(t.pendingLanes);
          n !== 0 && (uo(t, n | 1), Je(t, Ne()), (oe & 6) === 0 && (zn = Ne() + 500, Wt()));
        }
        break;
      case 13:
        un(function() {
          var r = Nt(e, 1);
          if (r !== null) {
            var l = $e();
            vt(r, e, 1, l);
          }
        }), Di(e, 1);
    }
  }, ao = function(e) {
    if (e.tag === 13) {
      var t = Nt(e, 134217728);
      if (t !== null) {
        var n = $e();
        vt(t, e, 134217728, n);
      }
      Di(e, 134217728);
    }
  }, zu = function(e) {
    if (e.tag === 13) {
      var t = Kt(e), n = Nt(e, t);
      if (n !== null) {
        var r = $e();
        vt(n, e, t, r);
      }
      Di(e, t);
    }
  }, Au = function() {
    return ae;
  }, Du = function(e, t) {
    var n = ae;
    try {
      return ae = e, t();
    } finally {
      ae = n;
    }
  }, eo = function(e, t, n) {
    switch (t) {
      case "input":
        if ($l(e, n), t = n.name, n.type === "radio" && t != null) {
          for (n = e; n.parentNode; ) n = n.parentNode;
          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];
            if (r !== e && r.form === e.form) {
              var l = br(r);
              if (!l) throw Error(u(90));
              iu(r), $l(r, l);
            }
          }
        }
        break;
      case "textarea":
        fu(e, n);
        break;
      case "select":
        t = n.value, t != null && fn(e, !!n.multiple, t, !1);
    }
  }, Su = Ri, _u = un;
  var Td = { usingClientEntryPoint: !1, Events: [ar, _n, br, gu, wu, Ri] }, kr = { findFiberByHostInstance: Zt, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, Od = { bundleType: kr.bundleType, version: kr.version, rendererPackageName: kr.rendererPackageName, rendererConfig: kr.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: se.ReactCurrentDispatcher, findHostInstanceByFiber: function(e) {
    return e = xu(e), e === null ? null : e.stateNode;
  }, findFiberByHostInstance: kr.findFiberByHostInstance || Rd, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Ul = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Ul.isDisabled && Ul.supportsFiber) try {
      zr = Ul.inject(Od), gt = Ul;
    } catch {
    }
  }
  return Ze.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Td, Ze.createPortal = function(e, t) {
    var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Mi(t)) throw Error(u(200));
    return Id(e, t, null, n);
  }, Ze.createRoot = function(e, t) {
    if (!Mi(e)) throw Error(u(299));
    var n = !1, r = "", l = Zs;
    return t != null && (t.unstable_strictMode === !0 && (n = !0), t.identifierPrefix !== void 0 && (r = t.identifierPrefix), t.onRecoverableError !== void 0 && (l = t.onRecoverableError)), t = Ai(e, 1, !1, null, null, n, !1, r, l), e[Et] = t.current, or(e.nodeType === 8 ? e.parentNode : e), new Ui(t);
  }, Ze.findDOMNode = function(e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == "function" ? Error(u(188)) : (e = Object.keys(e).join(","), Error(u(268, e)));
    return e = xu(t), e = e === null ? null : e.stateNode, e;
  }, Ze.flushSync = function(e) {
    return un(e);
  }, Ze.hydrate = function(e, t, n) {
    if (!Al(t)) throw Error(u(200));
    return Dl(null, e, t, !0, n);
  }, Ze.hydrateRoot = function(e, t, n) {
    if (!Mi(e)) throw Error(u(405));
    var r = n != null && n.hydratedSources || null, l = !1, o = "", i = Zs;
    if (n != null && (n.unstable_strictMode === !0 && (l = !0), n.identifierPrefix !== void 0 && (o = n.identifierPrefix), n.onRecoverableError !== void 0 && (i = n.onRecoverableError)), t = Xs(t, null, e, 1, n ?? null, l, !1, o, i), e[Et] = t.current, or(e), r) for (e = 0; e < r.length; e++) n = r[e], l = n._getVersion, l = l(n._source), t.mutableSourceEagerHydrationData == null ? t.mutableSourceEagerHydrationData = [n, l] : t.mutableSourceEagerHydrationData.push(
      n,
      l
    );
    return new zl(t);
  }, Ze.render = function(e, t, n) {
    if (!Al(t)) throw Error(u(200));
    return Dl(null, e, t, !1, n);
  }, Ze.unmountComponentAtNode = function(e) {
    if (!Al(e)) throw Error(u(40));
    return e._reactRootContainer ? (un(function() {
      Dl(null, null, e, !1, function() {
        e._reactRootContainer = null, e[Et] = null;
      });
    }), !0) : !1;
  }, Ze.unstable_batchedUpdates = Ri, Ze.unstable_renderSubtreeIntoContainer = function(e, t, n, r) {
    if (!Al(n)) throw Error(u(200));
    if (e == null || e._reactInternals === void 0) throw Error(u(38));
    return Dl(e, t, n, !1, r);
  }, Ze.version = "18.3.1-next-f1338f8080-20240426", Ze;
}
var uc;
function Vd() {
  if (uc) return Wi.exports;
  uc = 1;
  function a() {
    if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (s) {
        console.error(s);
      }
  }
  return a(), Wi.exports = /* @__PURE__ */ Fd(), Wi.exports;
}
var ac;
function Wd() {
  if (ac) return Ml;
  ac = 1;
  var a = /* @__PURE__ */ Vd();
  return Ml.createRoot = a.createRoot, Ml.hydrateRoot = a.hydrateRoot, Ml;
}
var Bd = /* @__PURE__ */ Wd(), De = /* @__PURE__ */ ru();
const Fl = /* @__PURE__ */ Cc(De), sc = (a) => {
  let s;
  const u = /* @__PURE__ */ new Set(), m = (S, j) => {
    const C = typeof S == "function" ? S(s) : S;
    if (!Object.is(C, s)) {
      const M = s;
      s = j ?? (typeof C != "object" || C === null) ? C : Object.assign({}, s, C), u.forEach((J) => J(s, M));
    }
  }, g = () => s, x = { setState: m, getState: g, getInitialState: () => k, subscribe: (S) => (u.add(S), () => u.delete(S)) }, k = s = a(m, g, x);
  return x;
}, Qd = ((a) => a ? sc(a) : sc), qd = (a) => a;
function Hd(a, s = qd) {
  const u = Fl.useSyncExternalStore(
    a.subscribe,
    Fl.useCallback(() => s(a.getState()), [a, s]),
    Fl.useCallback(() => s(a.getInitialState()), [a, s])
  );
  return Fl.useDebugValue(u), u;
}
const cc = (a) => {
  const s = Qd(a), u = (m) => Hd(s, m);
  return Object.assign(u, s), u;
}, $d = ((a) => a ? cc(a) : cc);
function Kd() {
  const a = new URLSearchParams(window.location.search), s = {};
  for (const [u, m] of a)
    u.includes(".") && (s[u] = m);
  return s;
}
function Yd(a) {
  const s = new URL(window.location.href);
  for (const u of [...s.searchParams.keys()])
    u.includes(".") && s.searchParams.delete(u);
  for (const [u, m] of Object.entries(a))
    m && s.searchParams.set(u, m);
  window.history.replaceState(null, "", s.toString());
}
function Gd(a) {
  let s = typeof window < "u" && window.Shopify?.routes?.root || a || "/";
  return s.endsWith("/") || (s += "/"), s + "cart/add.js";
}
async function Xd(a, s) {
  const u = Gd(a), m = await fetch(u, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({ items: s })
  });
  let g = null;
  try {
    g = await m.json();
  } catch {
  }
  if (!m.ok) {
    const _ = g?.description || g?.message || `Add to cart failed (HTTP ${m.status})`, w = new Error(_);
    throw w.status = m.status, w.payload = g, w;
  }
  return g;
}
function Jd(a) {
  if (typeof document > "u") return;
  const s = a || null;
  document.dispatchEvent(
    new CustomEvent("cart:refresh", { bubbles: !0, detail: s })
  ), document.dispatchEvent(
    new CustomEvent("cart:added", { bubbles: !0, detail: s })
  ), document.dispatchEvent(
    new CustomEvent("cart:open", { bubbles: !0, detail: s })
  ), typeof window < "u" && typeof window.dispatchEvent == "function" && window.dispatchEvent(new CustomEvent("cart:updated", { detail: s }));
}
const xc = "_bundle_id", Pc = "_bundle_role", Zd = { label: "STOOL OPTION" }, bd = "YES", ep = {
  id: "[Character]NRUS_PG_SOFA",
  label: "UPHOLSTERY GROUP"
}, tp = {
  id: "[Character]NRUS_MAT_SOFA",
  label: "FONT UPHOLSTERY SERIE"
}, Nc = "Upholstery Material", Ic = "Upholstery Color";
function Tt(a) {
  return String(a ?? "").trim().replace(/\s+/g, " ").toUpperCase();
}
function fc(a) {
  return Tt(a).split(" - ")[0];
}
function qi(a, { id: s, label: u }) {
  return s && a.find((m) => m.id === s) || a.find((m) => Tt(m.label) === Tt(u)) || null;
}
function Hi(a) {
  if (!a || a.currentValue == null || a.currentValue === "") return "";
  const s = (a.options || []).find((u) => u.value === a.currentValue);
  return String(s?.label ?? a.currentValue);
}
function dc(a, s, u, m, g, _) {
  return a.find(
    (w) => _(w.options?.[s], m) && _(w.options?.[u], g)
  );
}
function np({ stool: a, properties: s }) {
  if (!a || !Array.isArray(a.variants) || a.variants.length === 0 || Tt(Hi(qi(s, Zd))) !== bd)
    return null;
  const u = Hi(qi(s, ep)), m = Hi(qi(s, tp));
  if (!u || !m)
    return {
      error: "Please select the upholstery group and upholstery serie for the included stool."
    };
  const g = (a.options || []).map(Tt), _ = g.indexOf(Tt(Nc)), w = g.indexOf(Tt(Ic));
  if (_ === -1 || w === -1)
    return { error: "The included stool product is not set up correctly." };
  const x = dc(a.variants, _, w, u, m, (k, S) => Tt(k) === Tt(S)) || dc(a.variants, _, w, u, m, (k, S) => fc(k) === fc(S));
  return x ? {
    variantId: Number(x.id),
    material: x.options[_],
    color: x.options[w]
  } : {
    error: `No matching stool found for ${u} / ${m}. Please contact us.`
  };
}
function rp() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function lp({ stoolLine: a, includedWith: s, currency: u, bundleId: m }) {
  return {
    [Nc]: a.material,
    [Ic]: a.color,
    "Included with": s,
    _Configuration_Price: "0",
    _currency: u || "EUR",
    [xc]: m,
    [Pc]: "child"
  };
}
const tu = "calma_preorder_intent";
function op() {
  if (typeof window > "u") return null;
  if (window.CalmaPreorderIntent && typeof window.CalmaPreorderIntent.get == "function")
    try {
      return window.CalmaPreorderIntent.get();
    } catch {
    }
  try {
    const a = window.localStorage?.getItem(tu);
    if (!a) return null;
    const s = JSON.parse(a);
    return !s || typeof s.expiresAt != "number" || Date.now() > s.expiresAt ? (window.localStorage.removeItem(tu), null) : s;
  } catch {
    return null;
  }
}
function ip() {
  if (!(typeof window > "u")) {
    if (window.CalmaPreorderIntent && typeof window.CalmaPreorderIntent.clear == "function")
      try {
        window.CalmaPreorderIntent.clear();
        return;
      } catch {
      }
    try {
      window.localStorage?.removeItem(tu);
    } catch {
    }
  }
}
function $i() {
  if (typeof window > "u") return null;
  if (window.SHOPIFY_CUSTOMER_ID) return String(window.SHOPIFY_CUSTOMER_ID);
  const a = window.ShopifyAnalytics?.meta?.page?.customerId;
  return a != null ? String(a) : null;
}
const up = "/apps/b2b-portal/preorder/add-line";
async function ap(a) {
  const s = await fetch(up, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(a)
  });
  let u = null;
  try {
    u = await s.json();
  } catch {
  }
  return u || {
    error: `Preorder add-line failed (HTTP ${s.status})`
  };
}
const nu = "calma_quote_line_edit_intent", Rc = "calma_quote_edit_session_", Lc = "/apps/b2b-portal";
function ql() {
  if (typeof window > "u") return null;
  const a = window.CalmaQuoteEdit;
  return a && a.__loaded ? a : null;
}
function lu(a) {
  try {
    return window.localStorage?.getItem(a) ?? null;
  } catch {
    return null;
  }
}
function sp(a, s) {
  try {
    return window.localStorage?.setItem(a, s), !0;
  } catch {
    return !1;
  }
}
function Tc(a) {
  try {
    window.localStorage?.removeItem(a);
  } catch {
  }
}
function ou(a) {
  if (!a) return null;
  try {
    const s = JSON.parse(a);
    return s && typeof s == "object" ? s : null;
  } catch {
    return null;
  }
}
function Ki() {
  if (typeof window > "u") return null;
  const a = ql();
  if (a && typeof a.getIntent == "function")
    try {
      return a.getIntent();
    } catch {
    }
  const s = ou(lu(nu));
  return !s || !s.quotationId || typeof s.expiresAt != "number" ? null : Date.now() > s.expiresAt ? (Tc(nu), null) : s;
}
function Yi() {
  if (typeof window > "u") return;
  const a = ql();
  if (a && typeof a.clearIntent == "function")
    try {
      a.clearIntent();
      return;
    } catch {
    }
  Tc(nu);
}
function cp(a) {
  if (typeof window > "u" || !a) return null;
  const s = ql();
  if (s && typeof s.getSession == "function")
    try {
      return s.getSession(a);
    } catch {
    }
  const u = ou(lu(Rc + a));
  return !u || !Array.isArray(u.items) || typeof u.expiresAt == "number" && Date.now() > u.expiresAt ? null : u;
}
function fp(a) {
  if (!a) return null;
  const s = cp(a.quotationId);
  if (!s) return null;
  const u = parseInt(a.lineIndex, 10);
  return !Number.isFinite(u) || u < 0 || u >= s.items.length ? null : s.items[u] || null;
}
function pc(a) {
  const s = a && a._bundle_id ? String(a._bundle_id) : "", u = a && a._bundle_role ? String(a._bundle_role) : "";
  return { id: s, role: s ? u : "" };
}
function dp(a, s) {
  if (typeof window > "u" || !a) return null;
  const u = ql();
  if (u && typeof u.replaceLine == "function")
    try {
      return u.replaceLine(a.quotationId, a.lineIndex, s);
    } catch (M) {
      console.warn("[quote-edit] CalmaQuoteEdit.replaceLine failed, using fallback:", M?.message || M);
    }
  const m = Rc + a.quotationId, g = ou(lu(m));
  if (!g || !Array.isArray(g.items)) return null;
  const _ = parseInt(a.lineIndex, 10);
  if (!Number.isFinite(_) || _ < 0 || _ >= g.items.length || !Array.isArray(s) || !s.length) return null;
  const w = g.items[_], x = pc(w?.properties), k = s.map((M, J) => {
    const $ = { ...M, edited: !0 };
    return J === 0 && w && (!$.name && w.name && ($.name = w.name), !$.image && w.image && ($.image = w.image), !$.sku && w.sku && ($.sku = w.sku), !$.url && w.url && ($.url = w.url)), $;
  }), S = [];
  g.items.forEach((M, J) => {
    if (J === _) {
      S.push(...k);
      return;
    }
    const $ = pc(M?.properties);
    x.id && $.role === "child" && $.id === x.id || S.push(M);
  });
  const j = Date.now(), C = {
    ...g,
    items: S,
    dirty: !0,
    updatedAt: j,
    expiresAt: j + 1440 * 60 * 1e3
  };
  return sp(m, JSON.stringify(C)) ? C : null;
}
async function pp({ customerId: a, fileId: s, url: u }) {
  if (!a || !s && !u) return null;
  const m = new URLSearchParams({ logged_in_customer_id: String(a) });
  s && m.set("fileId", String(s)), u && m.set("url", String(u));
  try {
    const g = await fetch(`${Lc}/obx/file?${m.toString()}`, {
      headers: { Accept: "application/octet-stream" }
    });
    if (!g.ok) return null;
    const _ = await g.blob();
    return _ && _.size > 0 ? _ : null;
  } catch (g) {
    return console.warn("[quote-edit] stored OBX fetch failed:", g?.message || g), null;
  }
}
async function mp(a, s) {
  if (!a || !s) return null;
  try {
    return (await (await fetch(`${Lc}/obx/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logged_in_customer_id: String(a), urls: [s] })
    })).json().catch(() => null))?.captured?.[s] || null;
  } catch (u) {
    return console.warn("[quote-edit] OBX capture failed:", u?.message || u), null;
  }
}
function hp(a) {
  return a?.returnUrl ? a.returnUrl : "/pages/dealer-portal#quotations?edit=" + encodeURIComponent(a?.quotationId || "");
}
let ct = null, Dn = null, Cr = /* @__PURE__ */ new Map(), Un = "";
function Bl(a) {
  const s = (a || "").toUpperCase();
  return s.includes("DUVAR") ? "WALL" : s.includes("MASA") ? "TABLE" : s.includes("HALI") ? "FLOOR" : s.includes("TAVAN") || s.includes("SPRINKLER") ? "CEILING" : s.includes("MONITOR") || s.includes("EKRAN") || s.includes("SCREEN") ? "SCREEN MOUNT" : "GENERAL";
}
const Ql = [
  "GENERAL",
  "WALL",
  "TABLE",
  "SCREEN MOUNT",
  "CEILING",
  "FLOOR"
], Oc = [
  "[Character]NRUS_DOSEME_SERI_DUVAR",
  "[Character]NRUS_DOSEME_RENK_DUVAR",
  "[Character]NRUS_YUZEY_RENK_DUVAR",
  "[Character]NRUS_KECE_RENK_DUVAR",
  "[Character]NRUS_YUZEY_RENK_MASA",
  "[Character]NRUS_HALI_RENK",
  "[Character]NRUS_KOLTUK",
  "[Character]NRUS_PRIZ_TIPI",
  "[Character]NRUS_MEDIAWALL"
], yp = /* @__PURE__ */ new Set([
  "[Character]NRUS_Meta_Dimension",
  "[Character]NRUS_GGRACHAIR"
]), jc = [
  {
    id: "[Character]NRUS_GGRACHAIR",
    propLabel: "STOOL OPTION",
    value: "chair_no",
    displayLabel: "NO"
  }
];
async function Gi(a) {
  if (!Array.isArray(a)) return [];
  const s = a.filter(
    (_) => _.visible !== !1 && _.editable !== !1 && _.choiceList && !yp.has(_.key)
  ), u = await Promise.all(
    s.map(
      (_) => typeof _.getChoices == "function" ? _.getChoices().catch(() => []) : Promise.resolve([])
    )
  ), m = s.map((_, w) => {
    const x = u[w] || [], k = typeof _.getValue == "function" ? _.getValue() : null;
    return {
      id: _.key,
      label: _.name,
      type: x.some((S) => S.largeIcon || S.smallIcon) ? "color" : "text",
      editable: !0,
      currentValue: k?.value ?? null,
      options: x.map((S) => ({
        value: S.value,
        label: S.text,
        // Swatch UI'da ~40–96px gösterildiği için önce küçük ikonu tercih
        // ediyoruz; largeIcon (bazen ~1MB) yalnızca smallIcon yoksa fallback.
        // İkonlar WCF choiceList'inden her oturumda taze geldiği için pCon
        // tarafındaki değişiklikler kullanıcıya anında yansımaya devam eder.
        icon: S.smallIcon || S.largeIcon || null,
        available: S.selectable !== !1
      }))
    };
  }), g = new Map(Oc.map((_, w) => [_, w]));
  return m.sort((_, w) => {
    const x = g.has(_.id) ? g.get(_.id) : 1 / 0, k = g.has(w.id) ? g.get(w.id) : 1 / 0;
    return x !== k ? x - k : 0;
  });
}
async function Vl(a) {
  if (!a) return { price: null, currency: "EUR" };
  const s = typeof a.getMainArticle == "function" ? a.getMainArticle() ?? a : a;
  try {
    if (typeof s.getCompositeCalculation == "function") {
      const u = await s.getCompositeCalculation(), m = u?.grossPrice ?? u?.netPrice ?? u?.salesPrice;
      if (m?.value != null)
        return {
          price: m.value,
          currency: m.currency || "EUR"
        };
    }
  } catch (u) {
    console.warn("[wcf] getCompositeCalculation failed (falling back to getItemProperties):", u?.message || u);
  }
  try {
    if (typeof s.getItemProperties == "function") {
      const m = (await s.getItemProperties?.())?.article;
      if (m?.salesPrice != null)
        return {
          price: m.salesPrice,
          currency: m.salesCurrency || "EUR"
        };
    }
  } catch (u) {
    console.warn("[wcf] getItemProperties failed:", u?.message || u);
  }
  return console.warn("[wcf] price could not be determined — both methods failed"), { price: null, currency: "EUR" };
}
const mc = 15e3;
async function hc() {
  if (Un) return Un;
  const a = Dn, s = ct;
  if (!a || typeof a.exportObx != "function" || !s)
    return console.warn("[wcf] exportObx skipped — article/manager not ready"), "";
  const u = typeof s.getMainArticle == "function" ? s.getMainArticle() ?? s : s;
  let m;
  try {
    const g = await Promise.race([
      a.exportObx([u]),
      new Promise((_, w) => {
        m = setTimeout(
          () => w(new Error(`exportObx timed out after ${mc}ms`)),
          mc
        );
      })
    ]);
    return typeof g != "string" || !g ? (console.warn("[wcf] exportObx returned no url:", g), "") : (Un = g, console.log("[wcf] exportObx ok:", g), g);
  } catch (g) {
    return console.warn("[wcf] exportObx failed:", g?.message || g), "";
  } finally {
    clearTimeout(m);
  }
}
async function yc(a) {
  if (!Array.isArray(a)) return [];
  const s = await Promise.all(
    a.map(
      (u) => u.choiceList && typeof u.getChoices == "function" ? u.getChoices().catch(() => []) : Promise.resolve([])
    )
  );
  return a.map((u, m) => {
    const g = s[m] || [], _ = typeof u.getValue == "function" ? u.getValue() : null;
    return {
      id: u.key,
      label: u.name,
      type: g.some((w) => w.largeIcon || w.smallIcon) ? "color" : "text",
      editable: !!u.editable,
      currentValue: _?.value ?? null,
      options: g.map((w) => ({
        value: w.value,
        label: w.text,
        icon: w.smallIcon || w.largeIcon || null,
        available: w.selectable !== !1
      }))
    };
  });
}
function Xi(a) {
  return Array.isArray(a) ? a.map((s) => ({
    key: s.key,
    name: s.name,
    visible: !!s.visible,
    editable: !!s.editable,
    hasChoiceList: !!s.choiceList,
    value: typeof s.getValue == "function" ? s.getValue()?.value ?? null : null
  })) : [];
}
function Wl(a) {
  return a.map((s) => ({
    ...s,
    options: s.options?.map((u) => ({
      ...u,
      icon: typeof u.icon == "string" && u.icon.length > 100 ? `[icon omitted, ${u.icon.length} chars]` : u.icon
    }))
  }));
}
function vc({
  properties: a,
  price: s,
  currency: u,
  articleNumber: m,
  manufacturerId: g,
  safeQuantity: _,
  rawSnapshot: w = [],
  variantId: x = null,
  obxUrl: k = ""
}) {
  const S = /* @__PURE__ */ new Map(), j = [];
  for (const A of a) {
    if (A.currentValue == null || A.currentValue === "") continue;
    const b = Bl(A.id);
    S.has(b) || S.set(b, []);
    const z = (A.options || []).find(
      (se) => se.value === A.currentValue
    )?.label || String(A.currentValue);
    S.get(b).push({ label: A.label, selectedLabel: z }), j.push(z);
  }
  const C = /* @__PURE__ */ new Set();
  for (const A of S.values())
    for (const b of A) C.add(b.label);
  for (const A of jc) {
    if (C.has(A.propLabel)) continue;
    const b = Bl(A.id);
    S.has(b) || S.set(b, []), S.get(b).push({
      label: A.propLabel,
      selectedLabel: A.displayLabel
    }), j.push(A.displayLabel);
  }
  const M = [
    ...Ql.filter((A) => S.has(A)),
    ...[...S.keys()].filter((A) => !Ql.includes(A))
  ], J = {};
  let $ = 1;
  for (const A of M) {
    const b = S.get(A);
    if (!(!b || b.length === 0)) {
      J[`divider ${$}`] = A, $++;
      for (const { label: le, selectedLabel: z } of b)
        J[le] = z;
    }
  }
  const L = [
    m,
    g || null,
    ...j.slice(0, 2)
  ].filter(Boolean).join(" / ");
  return {
    _description: L,
    /*  _quantity: String(safeQuantity), */
    /* _unit: "ST", */
    _Configuration_Price: s != null ? String(s) : "",
    _currency: u || "EUR",
    _vendormat: m || "",
    _Configuration: L,
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
    _ext_product_id: m || "",
    // EAIWS'in ürettiği OBX dosyasının geçici URL'i — konfigürasyonun tam
    // (XML) hali. Export başarısızsa boş string gider; alan her zaman payload'da
    // bulunur ki tüketen taraf key'in varlığına güvenebilsin.
    // "_" prefix'i zorunlu: Shopify `_`-ile başlayan line item property'lerini
    // sepet/checkout/e-posta yüzeylerinde göstermez; `_pcon_full` ile aynı
    // şekilde dealer/CSR gösterim filtrelerinden de gizli kalır.
    _obxURL: k || "",
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
      articleNumber: m || "",
      manufacturerId: g || "",
      price: s ?? null,
      currency: u || "EUR",
      quantity: _,
      variantId: x != null ? String(x) : "",
      properties: Array.isArray(w) ? w : []
    }),
    // WCF konfigürasyon property'leri — "divider N" + "Label: değer" çiftleri
    ...J
  };
}
function xr(a) {
  if (a == null) return "";
  const u = String(a).match(/(\d+)\s*$/);
  return u ? u[1] : "";
}
function Pr(a) {
  const s = {};
  for (const u of a)
    u.currentValue && (s[u.id] = u.currentValue);
  Yd(s);
}
function vp(a) {
  const s = a && a._pcon_full;
  if (!s) return null;
  try {
    const u = typeof s == "string" ? JSON.parse(s) : s;
    return u && typeof u == "object" ? u : null;
  } catch {
    return null;
  }
}
async function gp({ customerId: a, fileId: s, url: u }) {
  const m = Dn;
  if (!m || typeof m.importObx != "function")
    return console.warn("[quote-edit] importObx unavailable — manager not ready"), !1;
  const g = await pp({ customerId: a, fileId: s, url: u });
  if (!g)
    return console.warn("[quote-edit] no stored OBX for this line — falling back to properties"), !1;
  let _;
  try {
    _ = await m.importObx(g, { importArticlesWithoutPosition: !0 });
  } catch (S) {
    return console.warn("[quote-edit] importObx failed:", S?.message || S), !1;
  }
  const w = Array.isArray(_) ? _.find(Boolean) : null;
  if (!w)
    return console.warn("[quote-edit] importObx returned no article"), !1;
  const x = m.app, k = ct;
  try {
    x?.model?.addElement(w);
  } catch (S) {
    return console.warn("[quote-edit] could not add imported article to the scene:", S?.message || S), !1;
  }
  if (k && k !== w)
    try {
      x?.model?.removeElement(k, !0, !0);
    } catch (S) {
      console.warn("[quote-edit] could not remove previous article:", S?.message || S);
    }
  ct = w, Un = "";
  try {
    await w.waitUntilGeometryUpdated?.(), x?.viewer?.view?.cameraControl?.zoomToFitElements?.([w], { margin: 0.15 }), x?.viewer?.requestRenderFrame?.();
  } catch (S) {
    console.warn("[quote-edit] camera refit after import failed:", S?.message || S);
  }
  return console.log("[quote-edit] configuration restored from stored OBX"), !0;
}
const re = $d((a, s) => ({
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
  // ── Quote line edit (Edit Quote → "Edit configuration") ──────────────────
  // quoteEdit: aktif intent ({ quotationId, quoteNumber, lineIndex, lineName,
  //            returnUrl }) — varsa "Add to Cart" yerine "Update Quote Line".
  // restoring: satırın konfigürasyonu geri yüklenirken true (buton kilitli).
  quoteEdit: null,
  restoring: !1,
  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: initialize — App.jsx'ten config alınır, ConfiguratorScene
  // tetiklenir (loading: true seti). Asıl WCF başlatma ConfiguratorScene'de.
  // ────────────────────────────────────────────────────────────────────────
  initialize(u) {
    const m = u.customerLoggedIn === !1 ? null : Ki();
    a({
      quoteEdit: m,
      restoring: !1,
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
    if (ct)
      try {
        const u = await Vl(ct);
        u?.price != null && a({
          price: u.price,
          currency: u.currency || s().currency
        });
      } catch (u) {
        console.warn("[store] refreshWcfPrice failed:", u?.message || u);
      }
  },
  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: setWcfReady — ConfiguratorScene WCF yüklemeyi tamamladığında
  // çağırır; article ve propMap module-level değişkenlere yazılmış olmalı.
  // ────────────────────────────────────────────────────────────────────────
  async setWcfReady(u, m, g) {
    ct = u, Dn = m, Cr = new Map(g.map((C) => [C.key, C])), Un = "";
    const _ = await Vl(u).catch(() => ({
      price: null,
      currency: "EUR"
    })), w = await Gi(g).catch(() => []), x = s().customIcons, k = Ji(w, x);
    console.group("[pCon] Properties — raw (WCF)"), console.log("rawProps count:", g.length), console.table(
      g.map((C) => ({
        key: C.key,
        name: C.name,
        visible: C.visible,
        editable: C.editable,
        hasChoiceList: !!C.choiceList,
        value: typeof C.getValue == "function" ? C.getValue()?.value : "(n/a)"
      }))
    );
    const S = await yc(g).catch(() => []);
    if (console.log(
      "[pCon] Full raw properties (JSON):",
      JSON.stringify(Wl(S), null, 2)
    ), console.groupEnd(), console.group("[pCon] Properties — mapped (store)"), console.log("mapped count:", k.length), console.table(
      k.map((C) => ({
        id: C.id,
        label: C.label,
        type: C.type,
        currentValue: C.currentValue,
        optionCount: C.options?.length ?? 0
      }))
    ), console.log(
      "[pCon] Full mapped properties (JSON):",
      JSON.stringify(Wl(k), null, 2)
    ), console.groupEnd(), a({
      properties: k,
      rawSnapshot: Xi(g),
      price: _.price,
      currency: _.currency || s().currency,
      cartProperties: {},
      // signal: WCF article hazır → cart butonu açılır
      loading: !1
    }), s().quoteEdit) {
      await s().restoreQuoteEditLine();
      return;
    }
    const j = Kd();
    if (Object.keys(j).length > 0)
      for (const [C, M] of Object.entries(j)) {
        const J = k.find(($) => $.id === C);
        J && J.currentValue !== M && s().updateProperty(C, M).catch(($) => console.warn("[store] URL prop apply failed:", $.message));
      }
    else
      Pr(k);
  },
  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: setWcfError — ConfiguratorScene hata durumunda çağırır.
  // ────────────────────────────────────────────────────────────────────────
  setWcfError(u) {
    a({ error: u?.message || String(u), loading: !1 });
  },
  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: reloadArticleState — module-level `_wcfArticle`'dan property,
  // fiyat ve snapshot'ı yeniden okuyup store'u tazeler (importObx sonrası
  // yeni article için). updateProperty'nin getProperties zinciriyle aynı.
  // ────────────────────────────────────────────────────────────────────────
  async reloadArticleState() {
    if (!ct) return;
    const [u, m] = await Promise.all([
      ct.getProperties(),
      Vl(ct).catch(() => ({ price: null, currency: s().currency }))
    ]);
    Cr = new Map(u.map((_) => [_.key, _]));
    const g = await Gi(u).catch(() => []);
    a({
      properties: Ji(g, s().customIcons),
      rawSnapshot: Xi(u),
      price: m.price,
      currency: m.currency || s().currency
    });
  },
  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: applySnapshotProperties — `_pcon_full.properties` snapshot'ındaki
  // değerleri sırayla uygular (sadece düzenlenebilir choice-list property'ler,
  // değeri farklı olanlar ve seçenek listesinde hâlâ sunulanlar). Sıralı
  // çalışır: bir seçim (örn. boyut) diğerlerinin seçenek listesini
  // değiştirebilir. Hem OBX yoksa fallback hem de OBX sonrası doğrulama.
  //
  // @returns {Promise<number>} uygulanan property sayısı
  // ────────────────────────────────────────────────────────────────────────
  async applySnapshotProperties(u) {
    if (!Array.isArray(u) || !u.length) return 0;
    const m = 1e9, g = new Map(Oc.map((k, S) => [k, S])), _ = (k) => g.has(k) ? g.get(k) : m, w = u.filter((k) => k && k.key && k.value != null && k.value !== "").sort((k, S) => _(k.key) - _(S.key));
    let x = 0;
    for (const k of w) {
      const S = Cr.get(k.key);
      if (!(!S || S.editable === !1 || !S.choiceList || (typeof S.getValue == "function" ? S.getValue()?.value : null) === k.value)) {
        try {
          const C = typeof S.getChoices == "function" ? await S.getChoices() : null;
          if (Array.isArray(C) && C.length && !C.some((M) => M.value === k.value)) {
            console.warn(`[quote-edit] value no longer available, skipped: ${k.key} = ${k.value}`);
            continue;
          }
        } catch {
        }
        try {
          await s().updateProperty(k.key, k.value), x++;
        } catch (C) {
          console.warn(`[quote-edit] could not apply ${k.key} = ${k.value}:`, C?.message || C);
        }
      }
    }
    return x;
  },
  // ────────────────────────────────────────────────────────────────────────
  // Aksiyon: restoreQuoteEditLine — düzenlenen teklif satırının kayıtlı
  // konfigürasyonunu konfigüratöre yükler.
  //
  //   1. Çalışma kopyasından satırı bul (yoksa intent düşürülür, normal mod).
  //   2. Adet satırdan alınır.
  //   3. Aynı article ise saklı OBX → importObx (en sadık yol).
  //   4. `_pcon_full.properties` değerleri uygulanır — OBX yoksa fallback,
  //      varsa farklı kalan değerler için doğrulama (eşleşiyorsa no-op).
  // ────────────────────────────────────────────────────────────────────────
  async restoreQuoteEditLine() {
    const u = Ki();
    if (!u)
      return a({ quoteEdit: null, restoring: !1 }), !1;
    const m = fp(u);
    if (!m)
      return console.warn("[quote-edit] working copy / line not found — intent dropped"), Yi(), a({
        quoteEdit: null,
        restoring: !1,
        cartError: "The quotation line to edit could not be found (your unsaved quotation copy may have expired). Please reopen the quotation and try again."
      }), !1;
    const g = m.properties || {}, _ = vp(g), { articleNumber: w } = s(), x = !_?.articleNumber || !w || String(_.articleNumber) === String(w);
    x || console.warn(
      `[quote-edit] line article (${_.articleNumber}) differs from page article (${w}) — OBX import skipped`
    ), a({
      quoteEdit: u,
      quantity: Math.max(1, parseInt(m.quantity, 10) || 1),
      restoring: !0,
      updating: !0,
      error: null,
      cartError: null
    });
    try {
      let k = !1;
      x && (g._obxFileId || g._obxURL) && (k = await gp({
        customerId: $i(),
        fileId: g._obxFileId || "",
        url: g._obxURL || ""
      }), k && await s().reloadArticleState());
      const S = Array.isArray(_?.properties) ? _.properties : [], j = await s().applySnapshotProperties(S);
      console.log(
        `[quote-edit] line restored (obx: ${k ? "yes" : "no"}, properties applied: ${j})`
      ), !k && !S.length && a({
        cartError: "This line carries no stored configuration data; the product opened with its default configuration."
      });
    } catch (k) {
      console.warn("[quote-edit] restore failed:", k?.message || k), a({ cartError: "The saved configuration could not be fully restored. Please review the selections before updating the quote line." });
    } finally {
      a({ restoring: !1, updating: !1 });
      try {
        Pr(s().properties), Dn?.app?.viewer?.requestRenderFrame?.();
      } catch {
      }
    }
    return !0;
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
  async updateProperty(u, m) {
    const g = Cr.get(u);
    if (!g || typeof g.setValue != "function") {
      console.warn("[store] updateProperty: prop not found in propMap:", u);
      return;
    }
    const { properties: _, customIcons: w } = s();
    Un = "";
    const x = _.map(
      (k) => k.id === u ? { ...k, currentValue: m } : k
    );
    a({ properties: x, updating: !0, error: null }), Pr(x);
    try {
      const k = Dn?.eventArticleChanged, S = k && typeof k.addListener == "function";
      if (await new Promise((L, A) => {
        let b = !1, le = !S, z = !1;
        const se = setTimeout(() => {
          z || (z = !0, S && k.removeListener(ee), console.warn("[store] updateProperty: eventArticleChanged timeout, proceeding"), L());
        }, 1e4);
        function ce() {
          z || !b || !le || (z = !0, clearTimeout(se), L());
        }
        function ee() {
          k.removeListener(ee), le = !0, ce();
        }
        S && k.addListener(ee), g.setValue(m).then(() => {
          b = !0, ce();
        }).catch((ve) => {
          z || (z = !0, clearTimeout(se), S && k.removeListener(ee), A(ve));
        });
      }), !ct) throw new Error("WCF article ref lost");
      const [j, C] = await Promise.all([
        ct.getProperties(),
        Vl(ct)
      ]);
      Cr = new Map(j.map((L) => [L.key, L])), console.group(`[pCon] updateProperty(${u} = ${JSON.stringify(m)}) — pCon'dan gelen ham veri`), console.log("rawProps count:", j.length), console.table(
        j.map((L) => ({
          key: L.key,
          name: L.name,
          visible: L.visible,
          editable: L.editable,
          hasChoiceList: !!L.choiceList,
          value: typeof L.getValue == "function" ? L.getValue()?.value : "(n/a)"
        }))
      );
      const M = await yc(j).catch(() => []);
      console.log(
        "[pCon] updateProperty — Full raw properties (JSON, değişmemiş pCon verisi):",
        JSON.stringify(Wl(M), null, 2)
      ), console.log("[pCon] updateProperty — Fiyat (pCon'dan gelen, önceki → yeni):", {
        previousPrice: s().price,
        previousCurrency: s().currency,
        newPrice: C.price,
        newCurrency: C.currency
      }), console.groupEnd();
      const J = await Gi(j), $ = Ji(J, w);
      console.group(`[pCon] updateProperty(${u}) — ekrana basılacak mapped veri`), console.log("mapped count:", $.length), console.table(
        $.map((L) => ({
          id: L.id,
          label: L.label,
          type: L.type,
          currentValue: L.currentValue,
          optionCount: L.options?.length ?? 0
        }))
      ), console.log(
        "[pCon] updateProperty — Full mapped properties (JSON):",
        JSON.stringify(Wl($), null, 2)
      ), console.groupEnd(), a({
        properties: $,
        rawSnapshot: Xi(j),
        price: C.price,
        currency: C.currency || s().currency,
        updating: !1
      }), Pr($);
      try {
        Dn?.app?.viewer?.requestRenderFrame?.();
      } catch {
      }
    } catch (k) {
      console.warn("[store] updateProperty revert:", k?.message || k), Pr(_), a({ properties: _, updating: !1, error: k?.message || String(k) });
    }
  },
  // ─── No-op: WCF ile hover prefetch gerekmez (client-side, anında update) ─
  prefetchProperty() {
  },
  // ─── Cart actions ─────────────────────────────────────────────────────────
  setQuantity(u) {
    const m = parseInt(u, 10);
    a({ quantity: Number.isFinite(m) && m >= 1 ? m : 1 });
  },
  setVariantId(u) {
    if (!u) return;
    const m = s().variantId;
    String(m) !== String(u) && a({ variantId: String(u), cartError: null, cartSuccess: !1 });
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
      rawSnapshot: m,
      price: g,
      currency: _,
      articleNumber: w,
      manufacturerId: x,
      quantity: k,
      variantId: S,
      productTitle: j,
      productImageUrl: C,
      productSku: M,
      loading: J,
      updating: $,
      cartProperties: L,
      quoteLoading: A
    } = s();
    if (A) return !1;
    if (J || $)
      return a({ quoteError: "Configuration is still loading. Please wait." }), !1;
    if (!L)
      return a({ quoteError: "Configuration not ready. Please wait." }), !1;
    const b = typeof window < "u" ? window.CalmaQuoteList : null;
    if (!b || typeof b.addItem != "function")
      return a({
        quoteError: "Quote list is not available. Please make sure you are signed in as a dealer."
      }), !1;
    const le = xr(S);
    if (!le)
      return a({
        quoteError: "Could not detect a product variant on this page. Please reload and try again."
      }), !1;
    a({ quoteLoading: !0, quoteError: null, quoteSuccess: !1 });
    const z = Math.max(1, parseInt(k, 10) || 1), se = await hc(), ce = vc({
      properties: u,
      price: g,
      currency: _,
      articleNumber: w,
      manufacturerId: x,
      safeQuantity: z,
      rawSnapshot: m,
      variantId: le,
      obxUrl: se
    });
    try {
      return b.addItem({
        variant_id: le,
        quantity: z,
        properties: ce,
        name: j || w || null,
        image: C || null,
        sku: M || w || null
      }), a({ quoteLoading: !1, quoteSuccess: !0 }), !0;
    } catch (ee) {
      return console.error("[Configurator] addToQuoteList error:", ee), a({
        quoteLoading: !1,
        quoteError: ee?.message || "Failed to add to quote list."
      }), !1;
    }
  },
  /**
   * Cart-add akışı (üç dallı: teklif satırı güncelleme, preorder, normal).
   *
   * Backend `/api/pcon/cart-payload` fresh OBX/attachment URL'leri üretir.
   * WCF ile itemId artık null — backend yeni EAIWS session açar ve current
   * property değerlerini uygular.
   */
  async addToCart(u = null) {
    const {
      properties: m,
      rawSnapshot: g,
      price: _,
      currency: w,
      articleNumber: x,
      manufacturerId: k,
      quantity: S,
      variantId: j,
      routesRoot: C,
      successAction: M,
      cartLoading: J,
      updating: $,
      loading: L,
      restoring: A,
      cartProperties: b,
      stool: le,
      productTitle: z,
      productImageUrl: se,
      productSku: ce
    } = s();
    if (J) return !1;
    if (A)
      return a({ cartError: "The saved configuration is still being restored. Please wait." }), !1;
    if (L || $)
      return a({ cartError: "Configuration is still loading. Please wait." }), !1;
    if (!b)
      return a({ cartError: "Configuration not ready. Please wait." }), !1;
    if (!j)
      return a({
        cartError: "Could not detect a product variant on this page. Please reload and try again."
      }), !1;
    const ee = np({ stool: le, properties: m });
    if (ee?.error)
      return a({ cartError: ee.error }), !1;
    a({ cartLoading: !0, cartError: null, cartSuccess: !1 });
    const ve = Math.max(1, parseInt(S, 10) || 1), me = await hc(), Qe = vc({
      properties: m,
      price: _,
      currency: w,
      articleNumber: x,
      manufacturerId: k,
      safeQuantity: ve,
      rawSnapshot: g,
      variantId: xr(j),
      obxUrl: me
    }), ge = ee ? rp() : null, qe = ge ? { ...Qe, [xc]: ge, [Pc]: "parent" } : Qe, _e = ee ? lp({
      stoolLine: ee,
      includedWith: z || x,
      currency: w,
      bundleId: ge
    }) : null, D = [
      {
        id: j,
        quantity: ve,
        properties: qe
      }
    ];
    ee && D.push({
      id: ee.variantId,
      quantity: ve,
      parent_id: Number(xr(j)),
      properties: _e
    }), console.log("[cart] Shopify cart/add.js payload:", JSON.stringify({ items: D }, null, 2));
    try {
      const ke = Ki();
      if (ke) {
        const O = $i();
        me && await mp(O, me);
        const Q = xr(j), U = window.location.pathname + (Q ? "?variant=" + Q : ""), f = D.map((H, G) => {
          const Z = G === 0;
          return {
            variant_id: xr(H.id),
            quantity: H.quantity,
            properties: H.properties,
            name: Z ? z || x || "" : le?.title || "Included stool",
            variantTitle: !Z && ee ? `${ee.material} / ${ee.color}` : "",
            image: Z && se || null,
            sku: Z && (ce || x) || "",
            url: Z ? U : null
          };
        });
        return dp(ke, f) ? (Yi(), a({ cartLoading: !1, cartSuccess: !0 }), window.location.href = hp(ke), !0) : (window.alert(
          "❌ Could not update the quotation line: the unsaved quotation copy was not found (it may have expired). Please reopen the quotation and try again."
        ), Yi(), a({ cartLoading: !1, quoteEdit: null }), !1);
      }
      const Pe = op();
      if (Pe) {
        const O = $i();
        let Q;
        try {
          Q = await ap({
            logged_in_customer_id: O,
            draftOrderId: Pe.draftOrderId,
            lines: D.map((f) => ({
              variantId: f.id,
              quantity: f.quantity,
              properties: f.properties
            }))
          });
        } catch (f) {
          return console.error("[Configurator] Preorder add-line error:", f), window.alert("❌ Could not add to preorder. Please try again."), a({ cartLoading: !1 }), !1;
        }
        if (!Q || Q.error) {
          const f = Q?.error || "Unknown error";
          return window.alert("❌ Could not add to preorder: " + f), a({ cartLoading: !1 }), !1;
        }
        const U = Q.draftOrder?.name || Pe.draftOrderName || "preorder";
        return window.alert("✅ Product added to Preorder " + U), ip(), a({ cartLoading: !1, cartSuccess: !0 }), window.location.href = "/pages/b2b-account#preorder-" + Pe.draftOrderId, !0;
      }
      const Oe = await Xd(C, D);
      a({ cartLoading: !1, cartSuccess: !0 });
      const fe = u ?? M;
      return fe === "redirect" ? window.setTimeout(() => {
        window.location.href = (window.Shopify?.routes?.root || "/").replace(/\/$/, "") + "/cart";
      }, 0) : fe === "reload" ? window.setTimeout(() => window.location.reload(), 0) : fe !== "none" && Jd(Oe), !0;
    } catch (ke) {
      return a({
        cartLoading: !1,
        cartError: ke?.message || "Failed to add to cart"
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
      articleNumber: m,
      manufacturerId: g,
      quantity: _,
      productTitle: w,
      productImageUrl: x,
      customerName: k
    } = s(), S = Math.max(1, parseInt(_, 10) || 1), j = /* @__PURE__ */ new Map();
    for (const L of u) {
      if (L.currentValue == null || L.currentValue === "") continue;
      const A = Bl(L.id);
      j.has(A) || j.set(A, []);
      const le = (L.options || []).find(
        (z) => z.value === L.currentValue
      )?.label || String(L.currentValue);
      j.get(A).push({ label: L.label, selectedLabel: le });
    }
    const C = /* @__PURE__ */ new Set();
    for (const L of j.values())
      for (const A of L) C.add(A.label);
    for (const L of jc) {
      if (C.has(L.propLabel)) continue;
      const A = Bl(L.id);
      j.has(A) || j.set(A, []), j.get(A).push({
        label: L.propLabel,
        selectedLabel: L.displayLabel
      });
    }
    const M = [
      ...Ql.filter((L) => j.has(L)),
      ...[...j.keys()].filter((L) => !Ql.includes(L))
    ], J = {};
    let $ = 1;
    for (const L of M) {
      const A = j.get(L);
      if (!(!A || A.length === 0)) {
        J[`divider ${$}`] = L, $++;
        for (const { label: b, selectedLabel: le } of A)
          J[b] = le;
      }
    }
    try {
      const { exportToExcel: L } = await import("./pcon-chunk-excel-export-ClkFUrGS.js");
      await L({
        articleNumber: m,
        manufacturerId: g,
        productTitle: w,
        productImageUrl: x,
        quantity: S,
        customerName: k,
        configDividers: J
      });
    } catch (L) {
      console.error("[exportRequest] Excel export failed:", L), window.alert("Excel export failed: " + (L?.message || String(L)));
    }
  }
})), wp = /* @__PURE__ */ new Set(["OI_NONE_PROPCLASS.PRIZ_TIPI"]), Sp = [
  { keys: ["german", "deutsch", "alman"], iconKey: "german" },
  { keys: ["multi", "universal", "coklu", "çoklu"], iconKey: "multi" },
  { keys: ["swiss", "schweiz", "isvicre", "isviçre"], iconKey: "swiss" },
  { keys: ["uk", "british", "britisch", "ingiliz"], iconKey: "uk" },
  { keys: ["us", "american", "amerikan", "amerika"], iconKey: "american" }
], _p = "MT_TEXT.Meta_Dimension", kp = {
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
function Ji(a, s) {
  if (!s || typeof s != "object") return a;
  let u = Cp(a, s.variantPicker);
  return u = xp(u, s.socket), u = Pp(u, s.contextual), u;
}
let Nr = null, gc = null;
function Ep(a) {
  if (gc === a && Nr)
    return Nr;
  if (gc = a, Nr = /* @__PURE__ */ new Map(), a && typeof a == "object")
    for (const [s, u] of Object.entries(a))
      !s || !u || Nr.set(zc(s), u);
  return Nr;
}
function zc(a) {
  return String(a || "").toLowerCase().replace(/[\s_-]+/g, "");
}
function Cp(a, s) {
  const u = Ep(s);
  return u.size === 0 ? a : a.map((m) => {
    let g = !1;
    const _ = m.options.map((w) => {
      if (w.icon) return w;
      const x = u.get(zc(w.value));
      return x ? (g = !0, { ...w, icon: x }) : w;
    });
    return g ? { ...m, type: "color", options: _ } : m;
  });
}
function xp(a, s) {
  return s ? a.map((u) => {
    if (!Np(u)) return u;
    const m = Ip(u.options, s), g = m.some((_) => _.icon);
    return { ...u, type: g ? "color" : u.type, options: m };
  }) : a;
}
function Pp(a, s) {
  if (!s) return a;
  const m = a.find((_) => _.id === _p)?.currentValue;
  if (!m) return a;
  const g = kp[m];
  return g ? a.map((_) => {
    const w = g[_.id];
    if (!w) return _;
    const x = _.options.map((S) => {
      const j = w[S.value], C = j ? s[j] : null;
      return C ? { ...S, icon: C } : S;
    }), k = x.some((S) => S.icon);
    return { ..._, type: k ? "color" : _.type, options: x };
  }) : a;
}
function Np(a) {
  return a ? wp.has(a.id) ? !0 : /steckdose|socket|priz/i.test(a.label || "") : !1;
}
function Ip(a, s) {
  return !s || !Array.isArray(a) ? a : a.map((u) => {
    const m = Rp(u, s);
    return m ? { ...u, icon: m } : u;
  });
}
function Rp(a, s) {
  const u = `${a.value || ""} ${a.label || ""}`.toLowerCase();
  for (const { keys: m, iconKey: g } of Sp)
    if (m.some((_) => u.includes(_)))
      return s[g] || null;
  return null;
}
function Lp(a, s, u = !1) {
  const m = u ? 0 : 2;
  try {
    return new Intl.NumberFormat(void 0, {
      style: "currency",
      currency: s || "EUR",
      minimumFractionDigits: m,
      maximumFractionDigits: m
    }).format(a);
  } catch {
    return u ? `${Math.ceil(Number(a))} ${s || "EUR"}` : `${Number(a).toFixed(2)} ${s || "EUR"}`;
  }
}
function Tp() {
  const a = re((m) => m.price), s = re((m) => m.currency);
  if (re((m) => m.discountPercentage), a == null)
    return /* @__PURE__ */ N.jsxs("div", { className: "pcon-price pcon-price--pending", children: [
      /* @__PURE__ */ N.jsx("span", { className: "pcon-price__label", children: "List Price" }),
      /* @__PURE__ */ N.jsx("span", { className: "pcon-price__value pcon-price__value--pending", "aria-busy": "true", children: /* @__PURE__ */ N.jsx("span", { className: "pcon-price__skeleton" }) })
    ] });
  const u = Lp(a, s);
  return /* @__PURE__ */ N.jsx("div", { className: "pcon-price-block", children: /* @__PURE__ */ N.jsxs("div", { className: "pcon-price", children: [
    /* @__PURE__ */ N.jsx("span", { className: "pcon-price__label", children: "List Price" }),
    /* @__PURE__ */ N.jsx("span", { className: "pcon-price__value", children: u })
  ] }) });
}
const wc = {
  "[Character]NRUS_DOSEME_RENK_DUVAR": "[Character]NRUS_DOSEME_SERI_DUVAR"
};
function Op() {
  const a = re((S) => S.properties), s = re((S) => S.updateProperty), [u, m] = De.useState(null), g = a.filter((S) => S.editable && S.options.length > 0);
  if (g.length === 0) return null;
  const _ = new Set(Object.keys(wc)), w = g.filter((S) => !_.has(S.id)), x = {};
  for (const [S, j] of Object.entries(wc)) {
    const C = g.find((M) => M.id === S);
    C && (x[j] || (x[j] = []), x[j].push(C));
  }
  const k = (S) => {
    m((j) => j === S ? null : S);
  };
  return /* @__PURE__ */ N.jsx("div", { className: "pcon-properties", children: w.map((S) => /* @__PURE__ */ N.jsx(
    jp,
    {
      prop: S,
      open: u === S.id,
      onToggle: () => k(S.id),
      onSelect: (j) => s(S.id, j),
      childProps: x[S.id] || [],
      updateProperty: s
    },
    S.id
  )) });
}
function jp({
  prop: a,
  open: s,
  onToggle: u,
  onSelect: m,
  childProps: g = [],
  updateProperty: _
}) {
  const w = a.type === "color", x = a.options.find((C) => C.value === a.currentValue), k = (C) => {
    C.available && C.value !== a.currentValue && m(C.value);
  }, S = [
    "pcon-prop-group",
    s && "pcon-prop-group--open"
  ].filter(Boolean).join(" "), j = w ? "pcon-prop-group__body pcon-prop-group__body--colors" : "pcon-prop-group__body pcon-prop-group__body--chips";
  return /* @__PURE__ */ N.jsxs("div", { className: S, children: [
    /* @__PURE__ */ N.jsxs(
      "button",
      {
        type: "button",
        className: "pcon-prop-group__header",
        "aria-expanded": s,
        onClick: u,
        children: [
          /* @__PURE__ */ N.jsxs("span", { className: "pcon-prop-group__header-main", children: [
            /* @__PURE__ */ N.jsx("span", { className: "pcon-prop-group__label", children: a.label }),
            /* @__PURE__ */ N.jsxs("span", { className: "pcon-prop-group__summary", children: [
              w && x?.icon ? /* @__PURE__ */ N.jsx(
                "span",
                {
                  className: "pcon-prop-group__summary-swatch",
                  style: { backgroundImage: `url("${x.icon}")` },
                  "aria-hidden": "true"
                }
              ) : null,
              /* @__PURE__ */ N.jsx("span", { className: "pcon-prop-group__summary-label", children: x?.label ?? "—" })
            ] })
          ] }),
          /* @__PURE__ */ N.jsx("span", { className: "pcon-prop-group__toggle", "aria-hidden": "true", children: s ? "−" : "+" })
        ]
      }
    ),
    s && /* @__PURE__ */ N.jsx("div", { className: j, children: a.options.map((C) => {
      const M = C.value === a.currentValue;
      if (w) {
        const $ = [
          "pcon-option-swatch",
          M && "pcon-option-swatch--active",
          !C.available && "pcon-option-swatch--disabled"
        ].filter(Boolean).join(" ");
        return /* @__PURE__ */ N.jsxs(
          "button",
          {
            type: "button",
            className: $,
            disabled: !C.available,
            title: C.label,
            onClick: () => k(C),
            children: [
              /* @__PURE__ */ N.jsx(
                "span",
                {
                  className: "pcon-option-swatch__thumb",
                  style: C.icon ? { backgroundImage: `url("${C.icon}")` } : void 0,
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ N.jsx("span", { className: "pcon-option-swatch__label", children: C.label })
            ]
          },
          C.value
        );
      }
      const J = [
        "pcon-option-chip",
        M && "pcon-option-chip--active",
        !C.available && "pcon-option-chip--disabled"
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ N.jsx(
        "button",
        {
          type: "button",
          className: J,
          disabled: !C.available,
          title: C.label,
          onClick: () => k(C),
          children: C.label
        },
        C.value
      );
    }) }),
    s && g.length > 0 && /* @__PURE__ */ N.jsx("div", { className: "pcon-prop-group__nested", children: g.map((C) => /* @__PURE__ */ N.jsx(
      zp,
      {
        prop: C,
        onSelect: (M) => _(C.id, M)
      },
      C.id
    )) })
  ] });
}
function zp({ prop: a, onSelect: s }) {
  const u = a.type === "color", m = a.options.find((w) => w.value === a.currentValue), g = (w) => {
    w.available && w.value !== a.currentValue && s(w.value);
  }, _ = u ? "pcon-prop-group__body pcon-prop-group__body--colors" : "pcon-prop-group__body pcon-prop-group__body--chips";
  return /* @__PURE__ */ N.jsxs("div", { className: "pcon-prop-inline", children: [
    /* @__PURE__ */ N.jsxs("div", { className: "pcon-prop-inline__header", children: [
      /* @__PURE__ */ N.jsx("span", { className: "pcon-prop-group__label", children: a.label }),
      /* @__PURE__ */ N.jsxs("span", { className: "pcon-prop-group__summary", children: [
        u && m?.icon ? /* @__PURE__ */ N.jsx(
          "span",
          {
            className: "pcon-prop-group__summary-swatch",
            style: { backgroundImage: `url("${m.icon}")` },
            "aria-hidden": "true"
          }
        ) : null,
        /* @__PURE__ */ N.jsx("span", { className: "pcon-prop-group__summary-label", children: m?.label ?? "—" })
      ] })
    ] }),
    /* @__PURE__ */ N.jsx("div", { className: _, children: a.options.map((w) => {
      const x = w.value === a.currentValue;
      if (u) {
        const S = [
          "pcon-option-swatch",
          x && "pcon-option-swatch--active",
          !w.available && "pcon-option-swatch--disabled"
        ].filter(Boolean).join(" ");
        return /* @__PURE__ */ N.jsxs(
          "button",
          {
            type: "button",
            className: S,
            disabled: !w.available,
            title: w.label,
            onClick: () => g(w),
            children: [
              /* @__PURE__ */ N.jsx(
                "span",
                {
                  className: "pcon-option-swatch__thumb",
                  style: w.icon ? { backgroundImage: `url("${w.icon}")` } : void 0,
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ N.jsx("span", { className: "pcon-option-swatch__label", children: w.label })
            ]
          },
          w.value
        );
      }
      const k = [
        "pcon-option-chip",
        x && "pcon-option-chip--active",
        !w.available && "pcon-option-chip--disabled"
      ].filter(Boolean).join(" ");
      return /* @__PURE__ */ N.jsx(
        "button",
        {
          type: "button",
          className: k,
          disabled: !w.available,
          title: w.label,
          onClick: () => g(w),
          children: w.label
        },
        w.value
      );
    }) })
  ] });
}
var Zi = { exports: {} }, bi, Sc;
function Ap() {
  if (Sc) return bi;
  Sc = 1;
  var a = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return bi = a, bi;
}
var eu, _c;
function Dp() {
  if (_c) return eu;
  _c = 1;
  var a = /* @__PURE__ */ Ap();
  function s() {
  }
  function u() {
  }
  return u.resetWarningCache = s, eu = function() {
    function m(w, x, k, S, j, C) {
      if (C !== a) {
        var M = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw M.name = "Invariant Violation", M;
      }
    }
    m.isRequired = m;
    function g() {
      return m;
    }
    var _ = {
      array: m,
      bigint: m,
      bool: m,
      func: m,
      number: m,
      object: m,
      string: m,
      symbol: m,
      any: m,
      arrayOf: g,
      element: m,
      elementType: m,
      instanceOf: g,
      node: m,
      objectOf: g,
      oneOf: g,
      oneOfType: g,
      shape: g,
      exact: g,
      checkPropTypes: u,
      resetWarningCache: s
    };
    return _.PropTypes = _, _;
  }, eu;
}
var kc;
function Up() {
  return kc || (kc = 1, Zi.exports = /* @__PURE__ */ Dp()()), Zi.exports;
}
var Mp = /* @__PURE__ */ Up();
const Fp = /* @__PURE__ */ Cc(Mp);
function Ec() {
  return typeof window < "u" && window.CalmaQuoteList && typeof window.CalmaQuoteList.addItem == "function";
}
function Ac({ isGuest: a = !1 }) {
  const s = re((D) => D.quantity), u = re((D) => D.setQuantity), m = re((D) => D.addToCart), g = re((D) => D.addToQuoteList);
  re((D) => D.exportRequest);
  const _ = re((D) => D.resetCartFeedback), w = re((D) => D.resetQuoteFeedback), x = re((D) => D.cartLoading), k = re((D) => D.cartError), S = re((D) => D.cartSuccess), j = re((D) => D.quoteLoading), C = re((D) => D.quoteError), M = re((D) => D.quoteSuccess), J = re((D) => D.cartProperties), $ = re((D) => D.variantId), L = re((D) => D.updating), A = re((D) => D.loading), b = re((D) => D.addToCartLabel), le = re((D) => D.quoteEdit), z = re((D) => D.restoring), [se, ce] = De.useState(!1), [ee, ve] = De.useState(Ec);
  De.useEffect(() => {
    if (ee) return;
    let D = 0;
    const ke = setInterval(() => {
      D += 1, Ec() ? (ve(!0), clearInterval(ke)) : D >= 20 && clearInterval(ke);
    }, 500);
    return () => clearInterval(ke);
  }, [ee]), De.useEffect(() => {
    if (!S) return;
    const D = setTimeout(() => _(), 4e3);
    return () => clearTimeout(D);
  }, [S, _]), De.useEffect(() => {
    if (!M) return;
    const D = setTimeout(() => w(), 4e3);
    return () => clearTimeout(D);
  }, [M, w]);
  const me = x || L || A || z || !J || !$, Qe = (D) => {
    u(D.target.value);
  }, ge = (D) => {
    u(Math.max(1, (parseInt(s, 10) || 1) + D));
  }, qe = async () => {
    if (me) return;
    await m("none") && !le && document.dispatchEvent(
      new CustomEvent("cart:refresh", { bubbles: !0, detail: { open: !0 } })
    );
  }, _e = async () => {
    me || j || await g();
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
            disabled: x || s <= 1,
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
            value: s,
            onChange: Qe,
            disabled: x,
            className: "pcon-cart__qty-input"
          }
        ),
        /* @__PURE__ */ N.jsx(
          "button",
          {
            type: "button",
            className: "pcon-cart__qty-step",
            onClick: () => ge(1),
            disabled: x,
            "aria-label": "Increase quantity",
            children: "+"
          }
        )
      ] })
    ] }),
    !a && le ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__btn-group", children: /* @__PURE__ */ N.jsx(
      "button",
      {
        type: "button",
        className: "pcon-cart__btn",
        onClick: qe,
        disabled: me,
        "aria-busy": x || z,
        children: z ? /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
          /* @__PURE__ */ N.jsx("span", { className: "pcon-cart__btn-spinner", "aria-hidden": "true" }),
          /* @__PURE__ */ N.jsx("span", { children: "Restoring configuration..." })
        ] }) : x ? /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
          /* @__PURE__ */ N.jsx("span", { className: "pcon-cart__btn-spinner", "aria-hidden": "true" }),
          /* @__PURE__ */ N.jsx("span", { children: "Updating..." })
        ] }) : `Update Quote Line${le.quoteNumber ? ` (${le.quoteNumber})` : ""}`
      }
    ) }) : a ? (
      /* Guest: tek "Request a Quote" butonu */
      /* @__PURE__ */ N.jsx(
        "button",
        {
          type: "button",
          className: "pcon-cart__btn",
          onClick: qe,
          disabled: me,
          "aria-busy": x,
          children: x ? /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
            /* @__PURE__ */ N.jsx("span", { className: "pcon-cart__btn-spinner", "aria-hidden": "true" }),
            /* @__PURE__ */ N.jsx("span", { children: "Adding..." })
          ] }) : "Request a Quote"
        }
      )
    ) : (
      /* Dealer: iki buton yan yana */
      /* @__PURE__ */ N.jsxs("div", { className: "pcon-cart__btn-group", children: [
        ee ? /* @__PURE__ */ N.jsx(
          "button",
          {
            type: "button",
            className: "pcon-cart__btn pcon-cart__btn--secondary",
            onClick: _e,
            disabled: me || j,
            "aria-busy": j,
            children: j ? /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
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
            onClick: qe,
            disabled: me,
            "aria-busy": x,
            children: x ? /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
              /* @__PURE__ */ N.jsx("span", { className: "pcon-cart__btn-spinner", "aria-hidden": "true" }),
              /* @__PURE__ */ N.jsx("span", { children: "Adding..." })
            ] }) : b || "Add to Cart"
          }
        )
      ] })
    ),
    k ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__error", role: "alert", children: k }) : null,
    S ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__success", role: "status", children: le ? "Quote line updated — returning to the quotation…" : "Added to cart." }) : null,
    C ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__error", role: "alert", children: C }) : null,
    M ? /* @__PURE__ */ N.jsx("div", { className: "pcon-cart__success", role: "status", children: "Teklif listesine eklendi." }) : null
  ] });
}
Ac.propTypes = {
  isGuest: Fp.bool
};
class Vp extends De.Component {
  constructor(s) {
    super(s), this.state = { hasError: !1, error: null };
  }
  static getDerivedStateFromError(s) {
    return { hasError: !0, error: s };
  }
  componentDidCatch(s) {
    console.error("[pcon] WCF render error:", s);
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
async function Wp(a, s = "en_US", u = null, m = "") {
  if (u) {
    const _ = await fetch(
      `https://gatekeeper.eaiws.pcon-solutions.com/v3/session/${u}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: s })
      }
    );
    if (!_.ok)
      throw new Error(`Gatekeeper direct call failed (HTTP ${_.status})`);
    return _.json();
  }
  const g = await fetch(`${a}/api/gatekeeper-session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ locale: s, region: m || "" })
  });
  if (!g.ok) {
    const _ = await g.json().catch(() => ({}));
    throw new Error(
      _.error || `Gatekeeper session failed (HTTP ${g.status})`
    );
  }
  return g.json();
}
function Bp({ canvasHeight: a, customerLoggedIn: s }) {
  const u = re((z) => z.loading), m = re((z) => z.error), g = re((z) => z.proxyBase), _ = re((z) => z.gatekeeperId), w = re((z) => z.region), x = re((z) => z.articleNumber), k = re((z) => z.manufacturerId), S = re((z) => z.setWcfReady), j = re((z) => z.setWcfError), C = re((z) => z.refreshWcfPrice), M = De.useRef(null), J = De.useRef(null), $ = De.useRef(null), L = De.useRef(null), A = De.useRef(null), b = De.useRef(null), le = De.useCallback(() => {
    try {
      b.current?.disconnect();
    } catch {
    }
    b.current = null;
    try {
      A.current && L.current && L.current.eventArticleChanged?.removeListener(
        A.current
      );
    } catch {
    }
    A.current = null, L.current = null;
    try {
      $.current?.close?.();
    } catch {
    }
    $.current = null;
    try {
      J.current?.dispose?.();
    } catch {
    }
    J.current = null;
  }, []);
  return De.useEffect(() => {
    if (!x || !g) return;
    let z = !1;
    async function se() {
      if (!(!M.current && (await new Promise((ce) => setTimeout(ce, 50)), z || !M.current)))
        try {
          const ce = await Wp(g, "en_US", _ || null, w || "");
          if (z) return;
          const [ee, ve] = await Promise.all([
            import("./pcon-chunk-engine-AgGdbLMj.js").then((f) => f.a),
            import("./pcon-chunk-engine-AgGdbLMj.js").then((f) => f.i)
          ]);
          if (z) return;
          const { Application: me } = ee, { wcfConfig: Qe } = ve;
          Qe.dataPath = `${g}/wcf/data/`;
          const ge = new me();
          if (ge.initialize(M.current, {
            hardwareAntialiasing: !1,
            preserveDrawingBuffer: !0,
            autoResizeViewer: !0,
            adaptToDeviceRatio: !0,
            maximumDeviceRatio: 1.5,
            audioEngine: !1
          }), J.current = ge, z) {
            try {
              ge.dispose?.();
            } catch {
            }
            return;
          }
          if (await new Promise((f) => requestAnimationFrame(() => requestAnimationFrame(f))), z) return;
          try {
            ge.viewer.resize(!0);
          } catch {
          }
          if (typeof ResizeObserver < "u" && M.current) {
            const f = new ResizeObserver(() => {
              if (!z)
                try {
                  J.current?.viewer?.resize(!0);
                } catch {
                }
            });
            f.observe(M.current), b.current = f;
          }
          const { EaiwsSession: qe } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((f) => f.c);
          if (z) return;
          const _e = new qe();
          _e.connect(
            ce.server,
            ce.sessionId,
            ce.keepAliveInterval
          ), $.current = _e;
          const D = "en";
          if (await Promise.all([
            _e.catalog.setLanguages([D]),
            _e.basket.setLanguages([D])
          ]), z) return;
          const { ArticleManager: ke } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((f) => f.d);
          if (z) return;
          const Pe = new ke(ge, _e);
          L.current = Pe;
          const Oe = (async () => {
            try {
              const { PricingProcedureInfo: f } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((Z) => Z.b), E = await _e.basket.listPricingProcedures(!0);
              if (!E?.length || z) {
                console.warn("[wcf] no pricing procedures available");
                return;
              }
              const H = E[0].name;
              console.log("[wcf] setting pricing procedure:", H);
              const G = await f.CreateInfo(
                _e,
                H,
                !0
              );
              !z && L.current && (L.current.setPricingProcedure(G), console.log("[wcf] pricing procedure ready:", H));
            } catch (f) {
              console.warn("[wcf] pricing procedure failed:", f?.message);
            }
          })(), fe = (async () => {
            try {
              const { SearchArticleParameterSet: f } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((Z) => Z.C), E = new f();
              E.baseArticleNumber = x, k && (E.manufacturerId = k);
              const G = (await _e.catalog.searchArticle(E))?.scoredItems?.[0]?.item;
              if (G) {
                const { InsertInfo: Z } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((de) => de.b), ne = new Z();
                return ne.baseArticleNumber = G.baseArticleNumber || x, G.manufacturerId && (ne.manufacturerId = G.manufacturerId), G.seriesId && (ne.seriesId = G.seriesId), await Pe.insertArticle(ne);
              } else
                throw new Error(`Article not found in catalog: ${x}`);
            } catch (f) {
              console.warn(
                "[wcf] catalog search fell back to direct insert:",
                f?.message
              );
              const { InsertInfo: E } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((G) => G.b), H = new E();
              return H.baseArticleNumber = x, k && (H.manufacturerId = k), await Pe.insertArticle(H);
            }
          })(), [, O] = await Promise.all([
            Oe,
            fe
          ]);
          if (z || !O) return;
          ge.model.addElement(O);
          try {
            if (await O.waitUntilGeometryUpdated?.(), z) return;
            const f = ge.viewer?.view?.cameraControl;
            if (f) {
              const { Vector3: E } = await import("./pcon-chunk-engine-AgGdbLMj.js").then((H) => H.m);
              if (z) return;
              try {
                f.setDirection(new E(0, 0, 1));
              } catch (H) {
                console.warn("[wcf] setDirection failed:", H?.message);
              }
              f.zoomToFitElements?.(
                [O],
                { margin: 0.15 }
              ), J.current?.viewer?.requestRenderFrame?.();
            }
          } catch (f) {
            console.warn("[wcf] initial camera setup failed:", f?.message);
          }
          const Q = await O.getProperties();
          if (z) return;
          const U = (f) => {
            C(), (async () => {
              try {
                if (await (f?.article?.getMainArticle?.() ?? O)?.waitUntilGeometryUpdated?.(), z) return;
                J.current?.viewer?.requestRenderFrame?.();
              } catch {
              }
            })();
          };
          if (A.current = U, Pe.eventArticleChanged?.addListener(U), await S(O, Pe, Q), z) return;
          C();
        } catch (ce) {
          z || (console.error("[wcf] init failed:", ce), j(ce));
        }
    }
    return se(), () => {
      z = !0, le();
    };
  }, [x, k, g, _, w, S, j, le, C]), /* @__PURE__ */ N.jsx(Vp, { canvasHeight: a, children: /* @__PURE__ */ N.jsxs("div", { className: "pcon-configurator", children: [
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
      !u && m && /* @__PURE__ */ N.jsxs(
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
            /* @__PURE__ */ N.jsx("p", { className: "pcon-error__message", children: m })
          ]
        }
      ),
      /* @__PURE__ */ N.jsx(
        "div",
        {
          ref: M,
          style: {
            position: "absolute",
            inset: 0
          }
        }
      )
    ] }),
    /* @__PURE__ */ N.jsx("div", { className: "pcon-sidebar", children: !m && /* @__PURE__ */ N.jsxs(N.Fragment, { children: [
      /* @__PURE__ */ N.jsx(Op, {}),
      /* @__PURE__ */ N.jsxs("div", { className: "pcon-price-cart", children: [
        s && /* @__PURE__ */ N.jsx(Tp, {}),
        /* @__PURE__ */ N.jsx(Ac, { isGuest: !s })
      ] })
    ] }) })
  ] }) });
}
const Qp = [
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
function Dc() {
  if (typeof document > "u") return null;
  for (const a of Qp) {
    const s = document.querySelectorAll(a);
    for (const u of s) {
      const m = u?.value?.trim();
      if (m) return m;
    }
  }
  if (typeof window < "u") {
    const a = window.ShopifyAnalytics?.meta?.selectedVariantId;
    if (a) return String(a);
  }
  return null;
}
function qp(a) {
  if (typeof document > "u") return () => {
  };
  let s = null;
  const u = () => {
    const w = Dc();
    w && w !== s && (s = w, a(w));
  }, m = (w) => {
    const x = w.target;
    x && x.matches?.(
      'input[name="id"], select[name="id"]'
    ) && u();
  }, g = () => u(), _ = () => u();
  return document.addEventListener("change", m, !0), document.addEventListener("variant:change", g), document.addEventListener("on:variant:change", g), window.addEventListener("popstate", _), () => {
    document.removeEventListener("change", m, !0), document.removeEventListener("variant:change", g), document.removeEventListener("on:variant:change", g), window.removeEventListener("popstate", _);
  };
}
function Hp({ config: a }) {
  const s = re((m) => m.initialize), u = re((m) => m.setVariantId);
  return De.useEffect(() => {
    s(a);
  }, [s, a]), De.useEffect(() => {
    const m = Dc();
    return m && u(m), qp((_) => {
      u(_);
    });
  }, [u]), /* @__PURE__ */ N.jsx(
    Bp,
    {
      canvasHeight: a.canvasHeight,
      environmentPreset: a.environmentPreset,
      customerLoggedIn: a.customerLoggedIn
    }
  );
}
window.__pconConfiguratorInit = function(a, s) {
  const u = {
    ...s,
    customIcons: window.__pconCustomIcons || {}
  };
  a.innerHTML = "", Bd.createRoot(a).render(/* @__PURE__ */ N.jsx(Hp, { config: u }));
};
