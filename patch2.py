import re

with open('/app/applet/src/App.tsx', 'r') as f:
    content = f.read()

url_primitives = """  const urlSearchQ = typeof urlSearch?.["q"] === "string" ? urlSearch["q"] : undefined;
  const urlSearchId = typeof urlSearch?.["id"] === "string" ? urlSearch["id"] : undefined;
  const urlSearchK = typeof urlSearch?.["k"] === "string" ? urlSearch["k"] : undefined;
  const urlSearchV = typeof urlSearch?.["v"] === "string" ? urlSearch["v"] : undefined;"""

content = content.replace('  const { route } = useAppStore();', url_primitives + '\n\n  const { route } = useAppStore();')

route_sync = """    // Sync state to URL
    if (route.type === "watch") {
      const vid = videoIdFromUrl(route.video.url);
      if (vid && urlVideoId !== vid) {
        void routerNav({ to: "/watch", search: { v: vid } });
      }
    } else if (route.type === "channel") {
      const id = route.id;
      if (id && (pathname !== "/channel" || urlSearchId !== id)) {
        void routerNav({ to: "/channel", search: { id } });
      }
    } else if (route.type === "playlist") {
      const id = route.id;
      if (id && (pathname !== "/playlist" || urlSearchId !== id)) {
        void routerNav({ to: "/playlist", search: { id } });
      }
    } else if (searchQ.trim() && pathname !== "/search") {
      if (urlSearchQ !== searchQ.trim()) {
        void routerNav({ to: "/search", search: { q: searchQ.trim() } });
      }
    } else if (route.type === "home") {
      if (pathname !== "/" && pathname !== "/search" && pathname !== "/shorts") void routerNav({ to: "/" });
    } else if (route.type === "subs") {
      if (pathname !== "/subscriptions") void routerNav({ to: "/subscriptions" });
    } else if (route.type === "library") {
      if (pathname !== "/library" || urlSearchK !== route.key) void routerNav({ to: "/library", search: { k: route.key } });
    }
  }, [route, isAr, t, pathname, urlVideoId, routerNav, searchQ, urlSearchId, urlSearchQ, urlSearchK]);"""

content = re.sub(r'    // Sync state to URL.*?(?=\n  // Initial URL -> State sync)', route_sync + '\n', content, flags=re.DOTALL)

initial_sync = """  // Initial URL -> State sync
  useEffect(() => {
    if (pathname === "/watch" && urlVideoId) {
      // Handled by the other useEffect
    } else if (pathname === "/subscriptions") {
      if (route.type !== "subs") setRoute({ type: "subs" });
    } else if (pathname === "/library") {
      if (urlSearchK && (route.type !== "library" || route.key !== urlSearchK)) setRoute({ type: "library", key: urlSearchK as any });
    } else if (pathname === "/shorts") {
      if (route.type !== "home") setRoute({ type: "home" });
      requestAnimationFrame(() =>
        document.getElementById("shorts-shelf")?.scrollIntoView({ behavior: "smooth" }),
      );
    } else if (pathname === "/") {
      if (route.type !== "home") setRoute({ type: "home" });
    } else if (pathname === "/channel") {
      if (urlSearchId && (route.type !== "channel" || route.id !== urlSearchId)) setRoute({ type: "channel", id: urlSearchId });
    } else if (pathname === "/playlist") {
      if (urlSearchId && (route.type !== "playlist" || route.id !== urlSearchId)) setRoute({ type: "playlist", id: urlSearchId });
    } else if (pathname === "/search") {
      if (urlSearchQ && urlSearchQ !== searchQ) setSearchQ(urlSearchQ);
    }
  }, [pathname, urlVideoId, urlSearchId, urlSearchK, urlSearchQ, setRoute, setSearchQ, route, searchQ]);"""

content = re.sub(r'  // Initial URL -> State sync.*?}(?=\n  const isFeedMode =)', initial_sync + '\n', content, flags=re.DOTALL)

with open('/app/applet/src/App.tsx', 'w') as f:
    f.write(content)
