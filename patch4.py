with open('/app/applet/src/App.tsx', 'r') as f:
    content = f.read()

old_sync = """  // Initial URL -> State sync
  useEffect(() => {
    if (pathname === "/watch" && urlVideoId) {
      // Handled by the other useEffect
    } else if (pathname === "/subscriptions") {
      setRoute({ type: "subs" });
    } else if (pathname === "/library") {
      const key = urlSearch?.["k"] as LibraryKey;
      if (key) setRoute({ type: "library", key });
    } else if (pathname === "/shorts") {
      setRoute({ type: "home" });
      requestAnimationFrame(() =>
        document.getElementById("shorts-shelf")?.scrollIntoView({ behavior: "smooth" }),
      );
    } else if (pathname === "/channel") {
      const id = urlSearch?.["id"] as string;
      if (id) setRoute({ type: "channel", id });
    } else if (pathname === "/playlist") {
      const id = urlSearch?.["id"] as string;
      if (id) setRoute({ type: "playlist", id });
    } else if (pathname === "/search") {
      const q = urlSearch?.["q"] as string;
      if (q) setSearchQ(q);
    }
  }, [pathname, urlVideoId, urlSearch, setRoute, setSearchQ]);"""

new_sync = """  // Initial URL -> State sync
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

content = content.replace(old_sync, new_sync)

with open('/app/applet/src/App.tsx', 'w') as f:
    f.write(content)
