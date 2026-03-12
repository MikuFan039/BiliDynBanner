var ye = {
  props: { config: { required: !0 } },
  data: function () {
    return { entered: !1, visible: !1 };
  },
  watch: {
    entered: function (t) {
      var e;
      null === (e = this.extensions) ||
        void 0 === e ||
        e.map(function (e) {
          var i;
          return null === (i = e.handleHoverChange) || void 0 === i
            ? void 0
            : i.call(e, t);
        });
    },
  },
  mounted: function () {
    var t = this;
    return S()(
      O.a.mark(function e() {
        var a,
          n,
          o,
          r,
          s,
          l,
          c,
          d,
          u,
          p,
          m,
          h,
          f,
          v,
          b,
          g,
          w,
          _,
          y,
          C,
          k,
          M,
          x,
          I;
        return O.a.wrap(
          function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  if (
                    ((t.animatedBannerSupport =
                      "undefined" != typeof CSS &&
                      CSS.supports &&
                      CSS.supports("filter: blur(1px)") &&
                      !/^((?!chrome|android).)*safari/i.test(
                        navigator.userAgent
                      )),
                    t.animatedBannerSupport)
                  ) {
                    e.next = 3;
                    break;
                  }
                  return e.abrupt("return");
                case 3:
                  if (
                    ("1" !== t.config.version
                      ? (t.layerConfig = t.compatOldConfig(t.config).layers)
                      : (t.layerConfig = t.config.layers),
                    "complete" === document.readyState)
                  ) {
                    e.next = 7;
                    break;
                  }
                  return (
                    (e.next = 7),
                    new Promise(function (t) {
                      return window.addEventListener("load", t);
                    })
                  );
                case 7:
                  if (
                    null === (a = t.config.extensions) ||
                    void 0 === a ||
                    !a.time
                  ) {
                    e.next = 19;
                    break;
                  }
                  (s = (Date.now() - new Date().setHours(0, 0, 0, 0)) / 1e3),
                    (l = Object.keys(t.config.extensions.time)
                      .map(function (t) {
                        return parseInt(t);
                      })
                      .sort(function (t, e) {
                        return t - e;
                      })),
                    (c = 0);
                case 11:
                  if (!(c < l.length)) {
                    e.next = 19;
                    break;
                  }
                  if (!(l[c] < s && (l[c + 1] > s || c + 1 === l.length))) {
                    e.next = 16;
                    break;
                  }
                  return (
                    (d = t.config.extensions.time[l[c]]),
                    (t.layerConfig =
                      d[Math.floor(Math.random() * d.length)].layers),
                    e.abrupt("break", 19)
                  );
                case 16:
                  c++, (e.next = 11);
                  break;
                case 19:
                  return (
                    (e.prev = 19),
                    (e.next = 22),
                    Promise.all(
                      t.layerConfig.map(
                        (function () {
                          var t = S()(
                            O.a.mark(function t(e) {
                              return O.a.wrap(function (t) {
                                for (;;)
                                  switch ((t.prev = t.next)) {
                                    case 0:
                                      return t.abrupt(
                                        "return",
                                        Promise.all(
                                          e.resources.map(
                                            (function () {
                                              var t = S()(
                                                O.a.mark(function t(i, a) {
                                                  var n, o, r, s;
                                                  return O.a.wrap(function (t) {
                                                    for (;;)
                                                      switch (
                                                        (t.prev = t.next)
                                                      ) {
                                                        case 0:
                                                          if (
                                                            !/\.(webm|mp4)$/.test(
                                                              i.src
                                                            )
                                                          ) {
                                                            t.next = 19;
                                                            break;
                                                          }
                                                          return (
                                                            (t.next = 3),
                                                            rt.a.get(i.src, {
                                                              responseType:
                                                                "blob",
                                                            })
                                                          );
                                                        case 3:
                                                          return (
                                                            (n = t.sent),
                                                            (o =
                                                              URL.createObjectURL(
                                                                n.data
                                                              )),
                                                            ((r =
                                                              document.createElement(
                                                                "video"
                                                              )).muted = !0),
                                                            (r.loop = !0),
                                                            (r.src = o),
                                                            (r.playsinline =
                                                              !0),
                                                            (r.style.objectFit =
                                                              "cover"),
                                                            (e.resources[a].el =
                                                              r),
                                                            (r.width = 0),
                                                            (r.height = 0),
                                                            document.body.appendChild(
                                                              r
                                                            ),
                                                            (t.next = 17),
                                                            new Promise(
                                                              function (t) {
                                                                r.addEventListener(
                                                                  "loadedmetadata",
                                                                  function e() {
                                                                    t(),
                                                                      r.removeEventListener(
                                                                        "loadedmetadata",
                                                                        e
                                                                      );
                                                                  }
                                                                );
                                                              }
                                                            )
                                                          );
                                                        case 17:
                                                          t.next = 24;
                                                          break;
                                                        case 19:
                                                          return (
                                                            ((s =
                                                              document.createElement(
                                                                "img"
                                                              )).src = i.src),
                                                            (t.next = 23),
                                                            new Promise(
                                                              function (t) {
                                                                return (s.onload =
                                                                  t);
                                                              }
                                                            )
                                                          );
                                                        case 23:
                                                          e.resources[a].el = s;
                                                        case 24:
                                                        case "end":
                                                          return t.stop();
                                                      }
                                                  }, t);
                                                })
                                              );
                                              return function (e, i) {
                                                return t.apply(this, arguments);
                                              };
                                            })()
                                          )
                                        )
                                      );
                                    case 1:
                                    case "end":
                                      return t.stop();
                                  }
                              }, t);
                            })
                          );
                          return function (e) {
                            return t.apply(this, arguments);
                          };
                        })()
                      )
                    )
                  );
                case 22:
                  e.next = 28;
                  break;
                case 24:
                  return (
                    (e.prev = 24),
                    (e.t0 = e.catch(19)),
                    console.error("load animated banner images error", e.t0),
                    e.abrupt("return")
                  );
                case 28:
                  if ((u = t.layerConfig).length || t.config.extensions) {
                    e.next = 31;
                    break;
                  }
                  return e.abrupt("return");
                case 31:
                  if (
                    ((p = t.$refs.container),
                    (m = p.clientHeight),
                    (h = p.clientWidth),
                    (f = m / 155),
                    u.forEach(function (t) {
                      var e, i, a, n;
                      (t._initState = {
                        scale: 1,
                        rotate:
                          (null === (e = t.rotate) || void 0 === e
                            ? void 0
                            : e.initial) || 0,
                        translate: (null === (i = t.translate) || void 0 === i
                          ? void 0
                          : i.initial) || [0, 0],
                        blur:
                          (null === (a = t.blur) || void 0 === a
                            ? void 0
                            : a.initial) || 0,
                        opacity:
                          void 0 ===
                          (null === (n = t.opacity) || void 0 === n
                            ? void 0
                            : n.initial)
                            ? 1
                            : t.opacity.initial,
                      }),
                        t.resources.forEach(function (e, i) {
                          var a,
                            n,
                            o = t.resources[i].el;
                          "VIDEO" === o.tagName
                            ? (o.parentNode && o.parentNode.removeChild(o),
                              (o.dataset.height = o.videoHeight),
                              (o.dataset.width = o.videoWidth))
                            : ((o.dataset.height = o.naturalHeight),
                              (o.dataset.width = o.naturalWidth));
                          var r =
                            void 0 ===
                            (null === (a = t.scale) || void 0 === a
                              ? void 0
                              : a.initial)
                              ? 1
                              : null === (n = t.scale) || void 0 === n
                              ? void 0
                              : n.initial;
                          (o.height = o.dataset.height * f * r),
                            (o.width = o.dataset.width * f * r);
                        });
                    }),
                    (v = u.map(function () {
                      var t = document.createElement("div");
                      return t.classList.add("layer"), p.appendChild(t), t;
                    })),
                    null !== (n = t.config.extensions) &&
                      void 0 !== n &&
                      n.time &&
                      (v.map(function (t) {
                        return (t.style.opacity = 0);
                      }),
                      600,
                      (b = performance.now()),
                      (g = function t(e) {
                        e - b < 600
                          ? (v.map(function (t) {
                              return (t.style.opacity = (e - b) / 600);
                            }),
                            requestAnimationFrame(t))
                          : v.map(function (t) {
                              return (t.style.opacity = 1);
                            });
                      }),
                      requestAnimationFrame(g)),
                    (w = 0),
                    (_ = 0),
                    (y = 0),
                    (C = function (t) {
                      var e = be.apply(void 0, ce()(t));
                      return function (t) {
                        return t > 0 ? e(t) : -e(-t);
                      };
                    }),
                    (k = NaN),
                    (M = function () {
                      try {
                        if (k === w) return;
                        (k = w),
                          v.map(function (t, e) {
                            var i = u[e],
                              a = t.firstChild;
                            if (a) {
                              var n = {
                                scale: i._initState.scale,
                                rotate: i._initState.rotate,
                                translate: i._initState.translate,
                              };
                              if (i.scale) {
                                var o =
                                  (i.scale.offset || 0) *
                                  (i.scale.offsetCurve
                                    ? C(i.scale.offsetCurve)
                                    : function (t) {
                                        return t;
                                      })(w);
                                n.scale = i._initState.scale + o;
                              }
                              if (i.rotate) {
                                var r =
                                  (i.rotate.offset || 0) *
                                  (i.rotate.offsetCurve
                                    ? C(i.rotate.offsetCurve)
                                    : function (t) {
                                        return t;
                                      })(w);
                                n.rotate = i._initState.rotate + r;
                              }
                              if (i.translate) {
                                var s = i.translate.offset || [0, 0],
                                  l = i.translate.offsetCurve
                                    ? C(i.translate.offsetCurve)
                                    : function (t) {
                                        return t;
                                      },
                                  c = s.map(function (t) {
                                    return l(w) * t;
                                  }),
                                  d = i._initState.translate.map(function (
                                    t,
                                    e
                                  ) {
                                    var a;
                                    return (
                                      (t + c[e]) *
                                      f *
                                      ((null === (a = i.scale) || void 0 === a
                                        ? void 0
                                        : a.initial) || 1)
                                    );
                                  });
                                n.translate = d;
                              }
                              if (
                                ((a.style.transform =
                                  "scale(".concat(n.scale, ")") +
                                  "translate("
                                    .concat(n.translate[0], "px, ")
                                    .concat(n.translate[1], "px)") +
                                  "rotate(".concat(n.rotate, "deg)")),
                                i.blur)
                              ) {
                                var p =
                                    (i.blur.offset || 0) *
                                    (i.blur.offsetCurve
                                      ? C(i.blur.offsetCurve)
                                      : function (t) {
                                          return t;
                                        })(w),
                                  m = 0;
                                i.blur.wrap && "clamp" !== i.blur.wrap
                                  ? "alternate" === i.blur.wrap &&
                                    (m = Math.abs(i._initState.blur + p))
                                  : (m = Math.max(0, i._initState.blur + p)),
                                  (a.style.filter =
                                    m < 1e-4 ? "" : "blur(".concat(m, "px)"));
                              }
                              if (i.opacity) {
                                var h =
                                    (i.opacity.offset || 0) *
                                    (i.opacity.offsetCurve
                                      ? C(i.opacity.offsetCurve)
                                      : function (t) {
                                          return t;
                                        })(w),
                                  v = i._initState.opacity;
                                if (
                                  i.opacity.wrap &&
                                  "clamp" !== i.opacity.wrap
                                ) {
                                  if ("alternate" === i.opacity.wrap) {
                                    var b = v + h,
                                      g = Math.abs(b % 1);
                                    Math.abs(b % 2) >= 1 && (g = 1 - g),
                                      (a.style.opacity = g);
                                  }
                                } else
                                  a.style.opacity = Math.max(
                                    0,
                                    Math.min(1, v + h)
                                  );
                              }
                            }
                          });
                      } catch (e) {
                        console.error(e), t.$emit("change", !1);
                      }
                    }),
                    u.map(function (t, e) {
                      var i = t.resources[0].el;
                      v[e].appendChild(i),
                        "VIDEO" === i.tagName && i.play(),
                        requestAnimationFrame(M);
                    }),
                    (x = function () {
                      var t = performance.now(),
                        e = w;
                      cancelAnimationFrame(y);
                      y = requestAnimationFrame(function i(a) {
                        a - t < 200
                          ? ((w = e * (1 - (a - t) / 200)),
                            M(a),
                            requestAnimationFrame(i))
                          : ((w = 0), M(a));
                      });
                    }),
                    (t.entered = !1),
                    (t.extensions = []),
                    null === (o = t.config.extensions) ||
                      void 0 === o ||
                      !o.petals)
                  ) {
                    e.next = 63;
                    break;
                  }
                  return (
                    (e.prev = 49),
                    (e.next = 52),
                    Promise.resolve().then(function () {
                      return _e(i(838));
                    })
                  );
                case 52:
                  return (
                    (I = e.sent.default),
                    (e.t1 = t.extensions),
                    (e.next = 56),
                    I(t.$refs.container)
                  );
                case 56:
                  (e.t2 = e.sent), e.t1.push.call(e.t1, e.t2), (e.next = 63);
                  break;
                case 60:
                  (e.prev = 60), (e.t3 = e.catch(49)), console.error(e.t3);
                case 63:
                  if (
                    null === (r = t.config.extensions) ||
                    void 0 === r ||
                    !r.time
                  ) {
                    e.next = 66;
                    break;
                  }
                  return (
                    (e.next = 66),
                    new Promise(function (t) {
                      return setTimeout(t, 600);
                    })
                  );
                case 66:
                  t.$emit("change", !0),
                    (t.handleMouseLeave = function () {
                      (t.entered = !1), x();
                    }),
                    (t.handleMouseMove = function (e) {
                      document.documentElement.scrollTop + e.clientY < m
                        ? (t.entered || ((t.entered = !0), (_ = e.clientX)),
                          (w = (e.clientX - _) / h),
                          cancelAnimationFrame(y),
                          (y = requestAnimationFrame(M)))
                        : t.entered && ((t.entered = !1), x()),
                        t.extensions.map(function (t) {
                          var i;
                          return null === (i = t.handleMouseMove) ||
                            void 0 === i
                            ? void 0
                            : i.call(t, { e: e, displace: w });
                        });
                    }),
                    (t.handleResize = function (e) {
                      (m = p.clientHeight),
                        (h = p.clientWidth),
                        (f = m / 155),
                        u.forEach(function (t) {
                          t.resources.forEach(function (e) {
                            var i,
                              a,
                              n = e.el;
                            (n.height =
                              n.dataset.height *
                              f *
                              ((null === (i = t.scale) || void 0 === i
                                ? void 0
                                : i.initial) || 1)),
                              (n.width =
                                n.dataset.width *
                                f *
                                ((null === (a = t.scale) || void 0 === a
                                  ? void 0
                                  : a.initial) || 1));
                          });
                        }),
                        cancelAnimationFrame(y),
                        (y = requestAnimationFrame(function (t) {
                          M(t);
                        })),
                        t.extensions.map(function (t) {
                          var i;
                          return null === (i = t.handleResize) || void 0 === i
                            ? void 0
                            : i.call(t, e);
                        });
                    }),
                    document.addEventListener("mouseleave", t.handleMouseLeave),
                    window.addEventListener("mousemove", t.handleMouseMove),
                    window.addEventListener("resize", t.handleResize);
                case 73:
                case "end":
                  return e.stop();
              }
          },
          e,
          null,
          [
            [19, 24],
            [49, 60],
          ]
        );
      })
    )();
  },
  beforeDestroy: function () {
    document.removeEventListener("mouseleave", this.handleMouseLeave),
      window.removeEventListener("mousemove", this.handleMouseMove),
      window.removeEventListener("resize", this.handleResize),
      this.extensions &&
        (this.extensions.map(function (t) {
          var e;
          return null === (e = t.destory) || void 0 === e ? void 0 : e.call(t);
        }),
        (this.extensions = []));
  },
  methods: {
    compatOldConfig: function (t) {
      if (t instanceof Array)
        return {
          version: "1",
          layers: t.map(function (t, e) {
            var i, a, n, o, r, s, l, c, d, u, p, m;
            return {
              id: e,
              resources: t.images.map(function (t, e) {
                return (function (t) {
                  for (var e = 1; e < arguments.length; e++) {
                    var i = null != arguments[e] ? arguments[e] : {};
                    e % 2
                      ? ge(Object(i), !0).forEach(function (e) {
                          T()(t, e, i[e]);
                        })
                      : Object.getOwnPropertyDescriptors
                      ? Object.defineProperties(
                          t,
                          Object.getOwnPropertyDescriptors(i)
                        )
                      : ge(Object(i)).forEach(function (e) {
                          Object.defineProperty(
                            t,
                            e,
                            Object.getOwnPropertyDescriptor(i, e)
                          );
                        });
                  }
                  return t;
                })({ id: e }, t);
              }),
              scale: {
                initial:
                  null === (i = t.initial) || void 0 === i ? void 0 : i.scale,
                offset:
                  null === (a = t.offset) || void 0 === a ? void 0 : a.scale,
                offsetCurve:
                  null === (n = t.offsetCurve) || void 0 === n
                    ? void 0
                    : n.scale,
              },
              rotate: {
                initial:
                  null === (o = t.initial) || void 0 === o ? void 0 : o.rotate,
                offset:
                  null === (r = t.offset) || void 0 === r ? void 0 : r.rotate,
                offsetCurve:
                  null === (s = t.offsetCurve) || void 0 === s
                    ? void 0
                    : s.rotate,
              },
              translate: {
                initial:
                  null === (l = t.initial) || void 0 === l
                    ? void 0
                    : l.translate,
                offset:
                  null === (c = t.offset) || void 0 === c
                    ? void 0
                    : c.translate,
                offsetCurve:
                  null === (d = t.offsetCurve) || void 0 === d
                    ? void 0
                    : d.translate,
              },
              blur: {
                initial:
                  null === (u = t.initial) || void 0 === u ? void 0 : u.blur,
                offset:
                  null === (p = t.offset) || void 0 === p ? void 0 : p.blur,
                offsetCurve:
                  null === (m = t.offsetCurve) || void 0 === m
                    ? void 0
                    : m.blur,
              },
            };
          }),
        };
      t.version;
    },
  },
};
