var g5 = A5;
const k5 = (e) => {
    const t = document.createElement("script");
    return (
      (t.crossOrigin = "anonymous"),
      (t.type = "text/javascript"),
      (t.src = e),
      document.body.appendChild(t),
      new Promise((n) => (t.onload = n))
    );
  },
  C5 = (e) =>
    Z(void 0, null, function* () {
      var B;
      const t = (() => !!document.createElement("div").attachShadow)(),
        n = (() => {
          var E;
          const L =
            (E = navigator.connection) == null ? void 0 : E.effectiveType;
          if (["slow-2g", "2g"].includes(L)) return !1;
          const b = navigator.deviceMemory;
          return !(b && b < 4);
        })();
      if (
        !(
          !/^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
          n &&
          t &&
          (() => !!document.createElement("canvas").getContext("webgl2"))()
        )
      )
        return;
      const s = yield Ur({
        benchmarksURL:
          "http://localhost/res/banner/blackboard/static/00979505aec5edd6e5c2f8c096fa0f62",
      });
      if (s.tier < 2 || s.type === "FALLBACK") return;
      const r = (() => {
          const L = document.createElement("video");
          return (
            (L.muted = !0),
            (L.loop = !0),
            (L.src =
              "http://localhost/res/banner/blackboard/activity68698/public/static/2xv.mp4"),
            (L.playsInline = !0),
            (L.disablepictureinpicture = !0),
            (L.disableremoteplayback = !0),
            L
          );
        })(),
        d = 360 * (e.clientWidth / 1920),
        _ = 0.6;
      Object.assign(r.style, {
        position: "absolute",
        transform: "translateY(-4%)",
        left: "0",
        width: "100%",
        height: `${d}px`,
        objectFit: "cover",
        objectPosition: "center",
        transition: `transform ${_}s linear`,
      }),
        (e.style.overflow = "hidden"),
        e.insertBefore(
          r,
          document.querySelector(".bili-header__banner > .header-banner__inner")
        ),
        r.play();
      const v = "http://localhost/res/banner/main.d177301ef5bc94ea7572.js";
      let h = !1,
        p = NaN;
      const u = (() => {
        const L = document.createElement("div");
        L.classList.add("autumn-banner"),
          Object.assign(L.style, {
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            left: "50%",
            width: "100%",
            minWidth: "1654px",
            transition: `top ${_}s linear`,
          });
        let b = NaN;
        const E = () => {
          cancelAnimationFrame(b),
            (b = requestAnimationFrame(() => {
              const S = Math.max(L.clientWidth * 0.1875, 155);
              (L.style.height = `${S}px`),
                (r.style.height = `${S}px`),
                h &&
                  ((e.style.height = `${S}px`), (e.style.maxHeight = `${S}px`));
            }));
        };
        return E(), window.addEventListener("resize", Vn(E, 300)), L;
      })();
      (e.style.transition = `height ${_}s linear`),
        e.insertBefore(
          u,
          document.querySelector(".bili-header__banner > .header-banner__inner")
        );
      const f = e.querySelector(".header-banner__inner"),
        A =
          (B = e.parentElement) == null
            ? void 0
            : B.querySelector(".bili-header__bar"),
        g = e.querySelector(".taper-line"),
        k = document.createElement("div");
      Object.assign(k.style, {
        position: "absolute",
        top: "36%",
        left: "15%",
        width: "85%",
        height: "64%",
        cursor: "pointer",
      }),
        e.appendChild(k);
      const C = e.clientHeight;
      k.addEventListener("click", (L) =>
        Z(void 0, null, function* () {
          if (
            h ||
            L.composedPath().some((x) => {
              var R, V;
              const M = x;
              return (
                ((R = M.classList) == null
                  ? void 0
                  : R.contains("autumn-banner")) ||
                ((V = M.classList) == null ? void 0 : V.contains("inner-logo"))
              );
            })
          )
            return;
          r.pause(),
            (h = !0),
            window.CustomEvent &&
              e.dispatchEvent(new CustomEvent("banner-expand", { detail: !0 })),
            k.style.setProperty("display", "none"),
            f.style.setProperty("display", "none"),
            g.style.setProperty("display", "none"),
            A == null || A.style.setProperty("display", "none");
          const b = e.clientWidth * (3 / 16);
          Object.assign(e.style, { height: b + "px", maxHeight: b + "px" }),
            (r.style.transform = "translateY(0%)");
          let E = null;
          yield k5(v),
            window.clearTimeout(p),
            (p = window.setTimeout(
              () =>
                Z(void 0, null, function* () {
                  try {
                    E = yield window.autumn2022(u);
                  } catch (x) {
                    console.error(x);
                    return;
                  }
                  E.onExit = () => {
                    (h = !1),
                      window.CustomEvent &&
                        e.dispatchEvent(
                          new CustomEvent("banner-expand", { detail: !1 })
                        ),
                      Object.assign(e.style, { height: C + "px" }),
                      (r.style.transform = "translateY(-4%)"),
                      window.clearTimeout(p),
                      (p = window.setTimeout(() => {
                        r.play(),
                          k.style.removeProperty("display"),
                          f.style.removeProperty("display"),
                          g.style.removeProperty("display"),
                          A == null || A.style.removeProperty("display"),
                          (e.style.maxHeight = "240px");
                      }, _ * 1e3));
                  };
                }),
              _ * 1e3
            ));
        })
      );
    });
const w5 = {
    components: { AnimatedBanner: g5, VImg: Qe },
    setup() {
      return Z(this, null, function* () {
        var u;
        pe(() => {
          h();
        });
        const e = y(),
          t = y(null),
          n = ue("currentBid"),
          i = y(null),
          o = y(!1),
          l = y(!1),
          s = y(null),
          { userInfoData: r } = Co();
        Ie(r, (f) => {
          f && (e.value = f.mid);
        });
        const d = t5[n.value],
          [_, v] = yield oe.$get(
            "http://localhost/res/banner/header.json",
            { resource_id: d || 142 },
            {
              ctx: me ? Ge() : null,
              preload: !0,
              com2co: !0,
              discovery: "main.web-svr.web-show",
            }
          );
        _ ||
          ((t.value = v),
          t.value &&
            ((u = t.value.litpic) == null
              ? void 0
              : u.indexOf(
                  "//localhost/res/banner/bfs/archive/622017dd4b0140432962d3ce0c6db99d77d2e937.png"
                )) >= 0 &&
            ((t.value.url = ""),
            (t.value.name = ""),
            (t.value.is_split_layer = 1),
            (t.value.split_layer =
              '{"version":"1", "extensions":{"autumn2022":{}}}')));
        const h = () =>
            Z(this, null, function* () {
              var g, k, C, B;
              const f = document.getElementById("bili-header-banner-img"),
                A = document.createElement("img");
              if (
                !!(f != null && f.children.length) &&
                ((A.src = _t(
                  f == null ? void 0 : f.children[0].getAttribute("srcset")
                )),
                yield new Promise((L) => (A.onload = L)),
                ((g = t.value) == null ? void 0 : g.is_split_layer) === 1)
              )
                try {
                  (i.value = JSON.parse(
                    (k = t.value) == null ? void 0 : k.split_layer
                  )),
                    (B = (C = i.value) == null ? void 0 : C.extensions) !=
                      null && B.autumn2022
                      ? C5(s.value)
                      : (o.value = !0);
                } catch (L) {
                  console.error("animated_banner_config parse error"),
                    (o.value = !1);
                }
            }),
          p = U(() => {
            var A, g;
            let f = _t((A = t.value) == null ? void 0 : A.url) || null;
            return f &&
              f.indexOf("__MID__") !== -1 &&
              f.indexOf("__REQUESTID__") !== -1 &&
              e.value
              ? f
                  .replace("__MID__", e.value || "__MID__")
                  .replace(
                    "__REQUESTID__",
                    ((g = t.value) == null ? void 0 : g.request_id) ||
                      "__REQUESTID__"
                  )
              : f;
          });
        return {
          trimHttp: _t,
          bannerData: t,
          bannerLink: p,
          animatedBannerShow: l,
          animatedBannerEnabled: o,
          animatedBannerConfig: i,
          bannerEl: s,
        };
      });
    },
  },
  y5 = { ref: "bannerEl", class: "bili-header__banner" },
  b5 = { class: "header-banner__inner" },
  E5 = { href: "//www.bilibili.com", class: "inner-logo" },
  I5 = ["src"],
  L5 = ["href", "textContent"],
  S5 = { class: "taper-line" },
  B5 = ["href"];
