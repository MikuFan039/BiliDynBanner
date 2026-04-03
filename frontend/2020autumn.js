we =
  (i(784),
  i(785),
  {
    components: {
      AnimatedBanner: Object(at.a)(
        ge,
        function () {
          var t = this.$createElement;
          return (this._self._c || t)("div", {
            ref: "container",
            staticClass: "animated-banner",
          });
        },
        [],
        !1,
        null,
        "0a487de8",
        null
      ).exports,
    },
    props: {
      bid: { type: Number, default: 142 },
      locsData: {
        type: Object,
        default: function () {
          return {};
        },
      },
      userInfo: {
        type: Object,
        default: function () {
          return {};
        },
      },
      bannerData: {
        type: Array,
        default: function () {
          return [];
        },
      },
    },
    data: function () {
      return {
        mid: null,
        animatedBannerSupport: !1,
        animatedBannerEnabled: !1,
        animatedBannerLoaded: !1,
        layerConfig: null,
      };
    },
    watch: {
      userInfo: {
        deep: !0,
        handler: function (t) {
          this.mid = t.mid;
        },
      },
      bannerImg: function (t) {
        t && this.bannerDataFetched && this.bannerDataFetched();
      },
    },
    computed: {
      locs: function () {
        return (
          this.bannerData[0] || (this.locsData && this.locsData[this.bid][0])
        );
      },
      bannerImg: function () {
        return Q(this.locs && this.locs.pic);
      },
      logoImg: function () {
        return Q(this.locs && this.locs.litpic);
      },
      bannerTitle: function () {
        return this.locs && this.locs.name;
      },
      bannerLink: function () {
        var t = Q(this.locs && this.locs.url) || null;
        return t &&
          -1 !== t.indexOf("__MID__") &&
          -1 !== t.indexOf("__REQUESTID__") &&
          this.mid
          ? t
              .replace("__MID__", this.mid || "__MID__")
              .replace("__REQUESTID__", this.locs.request_id || "__REQUESTID__")
          : t;
      },
      animatedBannerShow: function () {
        return (
          this.animatedBannerEnabled &&
          this.animatedBannerSupport &&
          this.animatedBannerLoaded
        );
      },
    },
    mounted: function () {
      this.animatedBanner();
    },
    methods: {
      animatedBanner: function () {
        var t = this;
        return U()(
          z.a.mark(function e() {
            var i;
            return z.a.wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (t.locs) {
                        e.next = 3;
                        break;
                      }
                      return (
                        (e.next = 3),
                        new Promise(function (e) {
                          return (t.bannerDataFetched = e);
                        })
                      );
                    case 3:
                      return (
                        ((i = document.createElement("img")).src = Q(
                          t.locs && t.locs.pic
                        )),
                        (e.next = 7),
                        new Promise(function (t) {
                          return (i.onload = t);
                        })
                      );
                    case 7:
                      if (
                        t.locs.litpic.indexOf(
                          "/bfs/archive/622017dd4b0140432962d3ce0c6db99d77d2e937.png"
                        ) > 0
                      ) {
                        t.animatedBannerEnabled = !0;
                        try {
                          t.layerConfig = JSON.parse(
                            '[{"images":[{"src":"https://i0.hdslb.com/bfs/vc/8e084d67aa18ed9c42dce043e06e16b79cbb50ef.png"}],"initial":{"scale":1,"blur":4},"offset":{"blur":4},"offsetCurve":{"blur":[0,0,1,1]}},{"images":[{"src":"https://i0.hdslb.com/bfs/vc/082e39ef757826401ef82da818310d42e05bc2de.png","duration":5000},{"src":"https://i0.hdslb.com/bfs/vc/ddad7c909e4c2cf933473e971373d825e6f06519.png","duration":60},{"src":"https://i0.hdslb.com/bfs/vc/173eafe211b4671e5aff059a1834f3e4579c7a5d.png","duration":200},{"src":"https://i0.hdslb.com/bfs/vc/f1892bc119b722c3cda5b26269c292a90a9f5f06.png","duration":60}],"initial":{"scale":0.6,"blur":0},"offset":{"translate":[15,0],"blur":10},"offsetCurve":{"blur":[0.3,0.7,0.5,0.5]}},{"images":[{"src":"https://i0.hdslb.com/bfs/vc/dbd5c17c4315714de9e4ee119694d2e9efaf9639.png"}],"initial":{"scale":1,"translate":[-50,0],"blur":1},"offset":{"translate":[30,0],"blur":-5},"offsetCurve":{"blur":[0.25,1,1,0]}},{"images":[{"src":"https://i0.hdslb.com/bfs/vc/cd9be0a2716adbae85fd899259381c4b2c2893c7.png"}],"initial":{"scale":0.6,"translate":[0,7],"blur":4},"offset":{"translate":[60,0],"blur":-10},"offsetCurve":{"blur":[0.4,1,1,0]}},{"images":[{"src":"https://i0.hdslb.com/bfs/vc/88537437a7916ecde847fa46652b44fbd3cbbb06.png"}],"initial":{"scale":0.6,"translate":[0,-3],"blur":5},"offset":{"translate":[130,0],"blur":-10},"offsetCurve":{"blur":[0.5,1,1,0]}},{"images":[{"src":"https://i0.hdslb.com/bfs/vc/37d9a93baa55870506a6f3e6308e7a0c386b97c7.png"}],"initial":{"scale":0.65,"blur":6},"offset":{"translate":[150,0],"blur":-6},"offsetCurve":{}}]'
                          );
                        } catch (e) {
                          console.error("animated_banner_config parse error"),
                            (t.layerConfig = []),
                            (t.animatedBannerEnabled = !1);
                        }
                      }
                      if (
                        ((t.animatedBannerSupport =
                          "undefined" != typeof CSS &&
                          CSS.supports &&
                          CSS.supports("filter: blur(1px)")),
                        !t.animatedBannerSupport || !t.animatedBannerEnabled)
                      ) {
                        e.next = 20;
                        break;
                      }
                      return (
                        t.layerConfig.map(function (t) {
                          t.loopTime = t.images.reduce(function (t, e) {
                            return t + (e.duration || 0);
                          }, 0);
                        }),
                        (e.prev = 11),
                        (e.next = 14),
                        Promise.all(
                          t.layerConfig.map(
                            (function () {
                              var t = U()(
                                z.a.mark(function t(e) {
                                  return z.a.wrap(function (t) {
                                    for (;;)
                                      switch ((t.prev = t.next)) {
                                        case 0:
                                          return t.abrupt(
                                            "return",
                                            Promise.all(
                                              e.images.map(
                                                (function () {
                                                  var t = U()(
                                                    z.a.mark(function t(i, a) {
                                                      var n;
                                                      return z.a.wrap(function (
                                                        t
                                                      ) {
                                                        for (;;)
                                                          switch (
                                                            (t.prev = t.next)
                                                          ) {
                                                            case 0:
                                                              return (
                                                                ((n =
                                                                  document.createElement(
                                                                    "img"
                                                                  )).src =
                                                                  i.src),
                                                                (t.next = 4),
                                                                new Promise(
                                                                  function (t) {
                                                                    return (n.onload =
                                                                      t);
                                                                  }
                                                                )
                                                              );
                                                            case 4:
                                                              e.images[a].img =
                                                                n;
                                                            case 5:
                                                            case "end":
                                                              return t.stop();
                                                          }
                                                      },
                                                      t);
                                                    })
                                                  );
                                                  return function (e, i) {
                                                    return t.apply(
                                                      this,
                                                      arguments
                                                    );
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
                    case 14:
                      (t.animatedBannerLoaded = !0), (e.next = 20);
                      break;
                    case 17:
                      (e.prev = 17),
                        (e.t0 = e.catch(11)),
                        console.log("load animated banner images error");
                    case 20:
                    case "end":
                      return e.stop();
                  }
              },
              e,
              null,
              [[11, 17]]
            );
          })
        )();
      },
    },
  });
