var d = Object.defineProperty;
var f = (i, e, t) => (e in i ? d(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : (i[e] = t));
var c = (i, e, t) => (f(i, typeof e != "symbol" ? e + "" : e, t), t);
const a = (i) => {
        const e = new DOMParser().parseFromString(i, "text/html"),
            t = new CustomEvent("xeon:navigated", {}),
            n = e.querySelector("body"),
            r = document.querySelector("body");
        r.innerHTML = n.innerHTML;
        const o = e.querySelector("head"),
            s = document.querySelector("head");
        (s.innerHTML = o.innerHTML), window.dispatchEvent(t), window.Xeonic && window.Xeonic.prefetchLinks();
    },
    w = (i) => {
        const e = document.createElement("a");
        return e.setAttribute("href", i), e.href;
    },
    l = (i) => {
        const e = i.hasAttribute("xeon-ignore");
        let t = w(i.href || i.getAttribute("href"));
        const n = new URL(t),
            r = n.href.includes(window.Xeonic.siteInfo.hostname),
            o = !r,
            s = !!window.Xeonic.cachedLinks[n.href];
        return {
            ignored: e,
            fullURL: n,
            local: r,
            external: o,
            prefetched: s,
        };
    };
class u {
    constructor() {
        c(this, "config", {});
        c(this, "siteInfo", {
            hostname: location.hostname,
            protocol: location.protocol,
            pathname: location.pathname,
            host: location.host,
            port: location.port,
            href: location.href,
        });
        c(this, "cachedLinks", {});
        c(this, "history", []);
        c(this, "activeIndex", 0);
        c(this, "prefetchLinks", async () => {
            const e = document.querySelectorAll("a[href], [xeon-include]");
            for (let t = 0; t < e.length; t++) {
                const n = l(e[t]);
                if (n.ignored || (n.external && this.config.ignoreExternal) || n.prefetched) return;
                console.log(n),
                    (this.cachedLinks[n.fullURL.href] = await fetch(n.fullURL.href).then(async (r) => await r.text())),
                    this.config.logs && console.log(`\u26A1 - Prefetched ${n.fullURL.href}`);
            }
        });
        c(this, "goBack", () => {
            const e = this.history[this.activeIndex - 1],
                t = new CustomEvent("xeon:back", {
                    detail: e,
                });
            return this.config.logs && console.log("\u26A1 - Going back"), e ? (this.activeIndex--, window.dispatchEvent(t), this.goTo(e)) : (window.dispatchEvent(t), window.history.back());
        });
        c(this, "goForward", () => {
            const e = this.history[this.activeIndex + 1],
                t = new CustomEvent("xeon:forward", {
                    detail: e,
                });
            return this.config.logs && console.log("\u26A1 - Going forward"), e ? (this.activeIndex++, window.dispatchEvent(t), this.goTo(e)) : (window.dispatchEvent(t), window.history.forward());
        });
        c(this, "goTo", async (e) => {
            const t = new URL(e),
                n = new CustomEvent("xeon:will-navigate", {
                    detail: t.href,
                });
            return (
                (this.cachedLinks[t.href] = await fetch(t.href).then(async (r) => await r.text())),
                this.config.logs && console.log(`\u26A1 - Routed to ${t.href}`),
                this.activeIndex++,
                this.history.push(window.location.href),
                window.dispatchEvent(n),
                a(this.cachedLinks[t.href])
            );
        });
        this.history.push(this.siteInfo.href);
    }
}
const v = (i = {}) => {
    const { ignoreExternal: e = !0, prefetch: t = !0, logs: n = !1 } = i;
    return (
        (window.Xeonic = new u()),
        (window.Xeonic.config = {
            ignoreExternal: e,
            prefetch: t,
            logs: n,
        }),
        t && window.Xeonic.prefetchLinks(),
        window.addEventListener("click", async (r) => {
            if (r.target.tagName === "A" || r.target.hasAttribute("xeon-include")) {
                const o = l(r.target);
                if ((console.log(o), o.ignored || (o.external && e))) return;
                r.preventDefault(),
                    window.addEventListener(
                        "xeon:navigate",
                        function (h) {
                            console.log(h);
                        },
                        !1
                    );
                const s = new CustomEvent("xeon:will-navigate", {
                    detail: o.fullURL.href,
                });
                return (
                    window.dispatchEvent(s),
                    o.prefetched
                        ? (window.Xeonic.activeIndex++,
                          window.Xeonic.history.push(o.fullURL.href),
                          n && console.log(`\u26A1 - Routed to ${o.fullURL.href}`),
                          a(window.Xeonic.cachedLinks[o.fullURL.href]))
                        : ((window.Xeonic.cachedLinks[o.fullURL.href] = await fetch(o.fullURL.href).then(async (h) => await h.text())),
                          window.Xeonic.activeIndex++,
                          window.Xeonic.history.push(o.fullURL.href),
                          n && console.log(`\u26A1 - Routed to ${o.fullURL.href}`),
                          a(window.Xeonic.cachedLinks[o.fullURL.href]))
                );
            }
        }),
        window.addEventListener("popstate", (r) => {
            r.preventDefault();
            const o = new CustomEvent("xeon:will-navigate", {
                detail: data.fullURL.href,
            });
            return (
                window.dispatchEvent(o),
                window.Xeonic.activeIndex++,
                window.Xeonic.history.push(window.location.href),
                n && console.log(`\u26A1 - Routed to ${window.location.href}`),
                a(window.Xeonic.cachedLinks[window.location.href])
            );
        }),
        window.Xeonic
    );
};
export { v as initialiseRouter };
