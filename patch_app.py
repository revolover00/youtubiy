import re

with open('/app/applet/src/App.tsx', 'r') as f:
    content = f.read()

# 1. Remove Sync state to URL
sync_state_pattern = re.compile(r'    // Sync state to URL.*?(?=\n  // Initial URL -> State sync)', re.DOTALL)
content = sync_state_pattern.sub('', content)

# 2. Update Initial URL -> State sync
initial_sync_pattern = re.compile(r'  // Initial URL -> State sync.*?}(?=\s*const isFeedMode =)', re.DOTALL)
initial_sync_new = """  // Initial URL -> State sync
  useEffect(() => {
    if (pathname === "/watch" && urlVideoId) {
      if (route.type !== "watch" || videoIdFromUrl(route.video.url) !== urlVideoId) {
        setRoute({
          type: "watch",
          video: {
            url: `/watch?v=${urlVideoId}`,
            title: "",
            thumbnail: `https://i.ytimg.com/vi/${urlVideoId}/hqdefault.jpg`,
            uploaderName: "",
            duration: 0,
          } as any,
        });
      }
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

# 3. Update urlVideoId useEffect
url_video_pattern = re.compile(r'  useEffect\(\(\) => \{\n    if \(urlVideoId\) \{.*?\} else \{\n      // No video in URL - handle transitions to Home/Channel/Library\n      setRoute\(\(r\) => \{\n        // 1\. If we are already on a non-watch route, stay there\n        if \(r\.type !== "watch"\) return r;\n\n        // 2\. Handle minimization from watch to home when URL cleared \(e\.g\. back button\)\n        const id = videoIdFromUrl\(r\.video\.url\);\n        const time = \(id \? appStore\.getPlaybackTime\(id\) : 0\) || 0;\n        appStore\.setMiniplayer\(\{ video: r\.video, time \}\);\n        return \{ type: "home" \};\n      \}\);\n    \}\n  \}, \[urlVideoId, setRoute\]\);', re.DOTALL)

url_video_new = """  useEffect(() => {
    if (urlVideoId) {
      // If opening full watch view for this video, close miniplayer
      const curMini = appStore.getSnapshot().miniplayer;
      if (curMini && videoIdFromUrl(curMini.video.url) === urlVideoId) {
        appStore.setMiniplayer(null);
      }

      let alive = true;

      getVideo(urlVideoId)
        .then((data) => {
          if (!alive) return;
          setRoute((r) => {
            if (r.type !== "watch" || videoIdFromUrl(r.video.url) !== urlVideoId || r.video.title)
              return r;
            return {
              type: "watch",
              video: {
                ...r.video,
                title: data.title,
                uploaderName: data.uploader,
                uploaderUrl: data.uploaderUrl,
                uploaderAvatar: data.uploaderAvatar,
                views: data.views,
              },
            };
          });
        })
        .catch(() => {});
      return () => {
        alive = false;
      };
    } else {
      // URL no longer has a video, but state might still think it's watch.
      // We extract to miniplayer. The other hook handles the actual route change.
      setRoute((r) => {
        if (r.type === "watch") {
            const id = videoIdFromUrl(r.video.url);
            const time = (id ? appStore.getPlaybackTime(id) : 0) || 0;
            appStore.setMiniplayer({ video: r.video, time });
        }
        return r;
      });
    }
  }, [urlVideoId, setRoute]);"""
content = url_video_pattern.sub(url_video_new, content)

with open('/app/applet/src/App.tsx', 'w') as f:
    f.write(content)
