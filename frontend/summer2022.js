const m5 = (e) => {
    const t = document.createElement("script");
    return (
      (t.crossOrigin = "anonymous"),
      (t.type = "text/javascript"),
      (t.src = e),
      document.body.appendChild(t),
      new Promise((n) => (t.onload = n))
    );
  },
  h5 = async (e) => {
    var k;
    const t = (() => !!document.createElement("canvas").getContext("webgl2"))(),
      n = (() => !!document.createElement("div").attachShadow)(),
      i = (() => {
        var I;
        const E = (I = navigator.connection) == null ? void 0 : I.effectiveType;
        if (["slow-2g", "2g"].includes(E)) return !1;
        const S = navigator.deviceMemory;
        return !(S && S < 4);
      })(),
      o = !/^((?!chrome|android).)*safari/i.test(navigator.userAgent),
      l = await Hr({
        benchmarksURL:
          "https://activity.hdslb.com/blackboard/static/00979505aec5edd6e5c2f8c096fa0f62",
      });
    if (!(t && n && i && o && l.tier >= 2 && l.type !== "FALLBACK")) return;
    await m5(
      "https://activity.hdslb.com/blackboard/static/20220629/00979505aec5edd6e5c2f8c096fa0f62/rmt7XCXYp9.js"
    );
    let _ = !1,
      u = NaN;
    const f = 0.6,
      d = (() => {
        const E = document.createElement("div");
        E.classList.add("summer-banner"),
          Object.assign(E.style, {
            position: "absolute",
            top: "75%",
            transform: "translate(-50%, -50%)",
            left: "50%",
            width: "100%",
            minWidth: "1654px",
            transition: `top ${f}s linear`,
          });
        let S = NaN;
        const I = () => {
          cancelAnimationFrame(S),
            (S = requestAnimationFrame(() => {
              const L = Math.max(E.clientWidth * 0.1875, 155);
              (E.style.height = `${L}px`),
                _ &&
                  ((e.style.height = `${L}px`), (e.style.maxHeight = `${L}px`));
            }));
        };
        return I(), window.addEventListener("resize", Gn(I, 300)), E;
      })();
    (e.style.overflow = "hidden"),
      (e.style.transition = `height ${f}s linear`),
      e.insertBefore(
        d,
        document.querySelector(".bili-header__banner > .header-banner__inner")
      );
    const p = e.querySelector(".header-banner__inner"),
      h =
        (k = e.parentElement) == null
          ? void 0
          : k.querySelector(".bili-header__bar"),
      v = e.querySelector(".taper-line");
    let A = null;
    try {
      A = await window.summer2022(d);
    } catch (E) {
      console.error(E);
      return;
    }
    const g = document.createElement("div");
    Object.assign(g.style, {
      position: "absolute",
      top: "36%",
      left: "15%",
      width: "85%",
      height: "64%",
      cursor: "pointer",
    }),
      e.appendChild(g);
    const y = e.clientHeight;
    g.addEventListener("click", (E) => {
      if (
        _ ||
        E.composedPath().some((I) => {
          var B, N;
          const L = I;
          return (
            ((B = L.classList) == null
              ? void 0
              : B.contains("summer-banner")) ||
            ((N = L.classList) == null ? void 0 : N.contains("inner-logo"))
          );
        })
      )
        return;
      (_ = !0),
        window.CustomEvent &&
          e.dispatchEvent(new CustomEvent("banner-expand", { detail: !0 })),
        g.style.setProperty("display", "none"),
        p.style.setProperty("display", "none"),
        v.style.setProperty("display", "none"),
        h == null || h.style.setProperty("display", "none");
      const S = e.clientWidth * (3 / 16);
      Object.assign(e.style, { height: S + "px", maxHeight: S + "px" }),
        (d.style.top = "50%"),
        window.clearTimeout(u),
        (u = window.setTimeout(async () => {
          var I;
          (I = A.toggleExtend) == null || I.call(A, !0),
            (A.onExit = () => {
              (_ = !1),
                window.CustomEvent &&
                  e.dispatchEvent(
                    new CustomEvent("banner-expand", { detail: !1 })
                  ),
                Object.assign(e.style, { height: y + "px" }),
                (d.style.top = "80%"),
                window.clearTimeout(u),
                (u = window.setTimeout(() => {
                  g.style.removeProperty("display"),
                    p.style.removeProperty("display"),
                    v.style.removeProperty("display"),
                    h == null || h.style.removeProperty("display"),
                    (e.style.maxHeight = "240px");
                }, f * 1e3));
            });
        }, f * 1e3));
    });
  };
const f5 = {
    name: "Banner",
    components: { AnimatedBanner: u5, VImg: Ze },
    async setup() {
      var h;
      de(() => {
        d();
      });
      const e = C(),
        t = C(null),
        n = se("currentBid"),
        i = C(null),
        o = C(!1),
        l = C(!1),
        s = C(null),
        { userInfoData: r } = wo();
      ke(r, (v) => {
        v && (e.value = v.mid);
      });
      const _ = p5[n.value],
        [u, f] = await te.$get(
          "/x/web-show/page/header",
          { resource_id: _ || 142 },
          {
            ctx: pe ? We() : null,
            preload: !0,
            com2co: !0,
            discovery: "main.web-svr.web-show",
          }
        );
      u ||
        ((t.value = f),
        t.value &&
          ((h = t.value.litpic) == null
            ? void 0
            : h.indexOf(
                "//i0.hdslb.com/bfs/archive/5b8cfd2c03e653106b1c9c37ba2025e39afc0ad1.png"
              )) > 0 &&
          ((t.value.url = ""),
          (t.value.name = ""),
          (t.value.is_split_layer = 1),
          (t.value.split_layer =
            '{"version":"1", "extensions":{"summer2022":{}}}')));
      const d = async () => {
          var g, y, k, E;
          const v = document.getElementById("bili-header-banner-img"),
            A = document.createElement("img");
          if (
            !!(v != null && v.children.length) &&
            ((A.src = dt(
              v == null ? void 0 : v.children[0].getAttribute("srcset")
            )),
            await new Promise((S) => (A.onload = S)),
            ((g = t.value) == null ? void 0 : g.is_split_layer) === 1)
          )
            try {
              (i.value = JSON.parse(
                (y = t.value) == null ? void 0 : y.split_layer
              )),
                (E = (k = i.value) == null ? void 0 : k.extensions) != null &&
                E.summer2022
                  ? h5(s.value)
                  : (o.value = !0);
            } catch {
              console.error("animated_banner_config parse error"),
                (o.value = !1);
            }
        },
        p = U(() => {
          var A, g;
          let v = dt((A = t.value) == null ? void 0 : A.url) || null;
          return v &&
            v.indexOf("__MID__") !== -1 &&
            v.indexOf("__REQUESTID__") !== -1 &&
            e.value
            ? v
                .replace("__MID__", e.value || "__MID__")
                .replace(
                  "__REQUESTID__",
                  ((g = t.value) == null ? void 0 : g.request_id) ||
                    "__REQUESTID__"
                )
            : v;
        });
      return {
        trimHttp: dt,
        bannerData: t,
        bannerLink: p,
        animatedBannerShow: l,
        animatedBannerEnabled: o,
        animatedBannerConfig: i,
        bannerEl: s,
      };
    },
  },
  v5 = { ref: "bannerEl", class: "bili-header__banner" },
  A5 = { class: "header-banner__inner" },
  g5 = { href: "//www.bilibili.com", class: "inner-logo" },
  k5 = ["src"],
  w5 = ["href", "textContent"],
  y5 = { class: "taper-line" },
  C5 = ["href"];
