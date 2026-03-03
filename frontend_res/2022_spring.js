const iI = async (e) => {
  var i;
  const t = !!document.createElement("canvas").getContext("webgl2"),
    n =
      "undefined" != typeof CSS &&
      CSS.supports &&
      CSS.supports("image-rendering: pixelated"),
    a = !!document.createElement("div").attachShadow,
    l = t && n && a,
    o = (() => {
      const e = document.createElement("video");
      return (
        (e.muted = !0),
        (e.loop = !0),
        (e.src = l
          ? "http://localhost/banner/data/blackboard/static/20220315/00979505aec5edd6e5c2f8c096fa0f62/kPbkWcX74M.mp4"
          : "http://localhost/banner/data/blackboard/static/20220314/00979505aec5edd6e5c2f8c096fa0f62/ZlmaPe9AZv.mp4"),
        (e.playsInline = !0),
        (e.disablepictureinpicture = !0),
        (e.disableremoteplayback = !0),
        e
      );
    })();
  if (
    (Object.assign(o.style, {
      position: "absolute",
      top: "40%",
      transform: "translateY(-50%)",
      left: "0",
      width: "100%",
      objectFit: "cover",
      objectPosition: "center",
      imageRendering: "pixelated",
      transition: "top 1s",
    }),
    e.insertBefore(
      o,
      document.querySelector(".bili-header__banner > .header-banner__inner")
    ),
    o.play(),
    !l)
  )
    return;
  qe(
    {
      type: "appear",
      c: "banner_game",
      d: "entry",
      e: "show",
    },
    {
      msg: JSON.stringify({
        id: 0,
        game: "叶间穿行",
      }),
    }
  );
  const r = e.querySelector(".inner-logo"),
    s =
      null == (i = e.parentElement)
        ? void 0
        : i.querySelector(".bili-header__bar"),
    c = e.querySelector(".taper-line");
  let d = !1,
    u = 0;
  const m = e.clientHeight;
  let p = NaN,
    v = NaN,
    h = !1;
  (e.style.transition = "height 1s"), (e.style.overflow = "hidden");
  const f = (e) => {
    ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "z"].some(
      (i) => i === e.key
    ) && e.preventDefault();
  };
  e.addEventListener("click", (i) => {
    if (
      d ||
      i.composedPath().some((e) => {
        var i, t;
        const n = e;
        return (
          (null == (i = n.classList) ? void 0 : i.contains("banner-game")) ||
          (null == (t = n.classList) ? void 0 : t.contains("inner-logo"))
        );
      })
    )
      return;
    window.addEventListener("keydown", f),
      qe(
        {
          type: "click",
          c: "banner_game",
          d: "entry",
          e: "click",
        },
        {
          msg: JSON.stringify({
            id: 0,
            game: "叶间穿行",
          }),
        }
      ),
      (d = !0),
      (u = performance.now()),
      r.style.setProperty("display", "none"),
      c.style.setProperty("display", "none"),
      null == s || s.style.setProperty("display", "none");
    const t = e.clientWidth / (16 / 3);
    Object.assign(e.style, {
      height: t + "px",
      maxHeight: t + "px",
    }),
      (o.style.top = "50%");
    const n = (() => {
        const e = document.createElement("video");
        return (
          (e.muted = !0),
          (e.src =
            "http://localhost/banner/data/blackboard/static/20220314/00979505aec5edd6e5c2f8c096fa0f62/CmamSTNOdq.mp4"),
          (e.playsInline = !0),
          (e.disablepictureinpicture = !0),
          (e.disableremoteplayback = !0),
          Object.assign(e.style, {
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "0px",
            height: "0px",
            objectFit: "cover",
            objectPosition: "center",
            imageRendering: "pixelated",
          }),
          (e.style.width = "0px"),
          (e.style.height = "0px"),
          document.body.appendChild(e),
          e
        );
      })(),
      a = performance.now();
    let l = 0,
      w = 0;
    const g = ((e) => {
      const i = document.createElement("script");
      return (
        (i.crossOrigin = "anonymous"),
        (i.type = "text/javascript"),
        (i.src = e),
        document.body.appendChild(i),
        new Promise((e) => (i.onload = e))
      );
    })("http://localhost/banner/XRG02U9wAU.js");
    document.addEventListener("visibilitychange", () => {
      "hidden" === document.visibilityState
        ? qe(
            {
              type: "click",
              c: "banner_game",
              d: "extend",
              e: "duration",
            },
            {
              msg: JSON.stringify({
                id: 0,
                game: "叶间穿行",
                duration: Math.round(performance.now() - u),
              }),
            }
          )
        : (u = performance.now());
    }),
      window.clearTimeout(p),
      (p = window.setTimeout(async () => {
        var i, t;
        h || (await g, (l = performance.now()), (h = !0)),
          null == (i = n.parentElement) || i.removeChild(n),
          (n.style.width = "100%"),
          (n.style.height = "100%"),
          e.appendChild(n),
          n.play();
        const b = new window.BannerGameSpring2022(e),
          y = new Promise((e) => {
            n.onended = () => e();
          }),
          _ = b.init().then(() => {
            (w = performance.now()),
              qe(
                {
                  type: "tech",
                  c: "banner_game",
                  d: "load",
                  e: "duration",
                },
                {
                  msg: JSON.stringify({
                    id: 0,
                    game: "叶间穿行",
                    loadScript: Math.round(l - a),
                    init: Math.round(w - l),
                  }),
                }
              );
          });
        await Promise.all([y, _]),
          null == (t = n.parentElement) || t.removeChild(n),
          window.removeEventListener("keydown", f),
          window.localStorage.getItem("banner_game_2022_spring")
            ? (b.gameContainer.focus(), b.start())
            : (window.localStorage.setItem("banner_game_2022_spring", "1"),
              b.showGuide(),
              b.renderFirstFrame());
        const k = () => {
          (d = !1),
            window.clearInterval(v),
            qe(
              {
                type: "click",
                c: "banner_game",
                d: "extend",
                e: "duration",
              },
              {
                msg: JSON.stringify({
                  id: 0,
                  game: "叶间穿行",
                  duration: Math.round(performance.now() - u),
                }),
              }
            ),
            Object.assign(e.style, {
              height: m + "px",
            }),
            (o.style.top = "40%"),
            window.clearTimeout(p),
            (p = window.setTimeout(() => {
              r.style.removeProperty("display"),
                c.style.removeProperty("display"),
                null == s || s.style.removeProperty("display");
            }, 1e3));
        };
        (b.onExit = k),
          (v = window.setInterval(() => {
            performance.now() - b.lastActive > 3e5 &&
              (qe(
                {
                  type: "click",
                  c: "banner_game",
                  d: "end_page",
                  e: "close",
                },
                {
                  msg: JSON.stringify({
                    id: 0,
                    game: "叶间穿行",
                  }),
                }
              ),
              k(),
              b.destroy());
          }, 3e4));
      }, 1e3));
  });
};
