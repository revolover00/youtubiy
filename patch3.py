import re

with open('/app/applet/src/App.tsx', 'r') as f:
    content = f.read()

initial_sync_pattern = re.compile(r'  // Initial URL -> State sync.*?}(?=\s*const isFeedMode =)', re.DOTALL)

initial_sync_new = """  // Initial URL -> State sync
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

content = initial_sync_pattern.sub(initial_sync_new, content)

with open('/app/applet/src/App.tsx', 'w') as f:
    f.write(content)
