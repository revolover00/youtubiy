import { useCallback, useEffect, useRef, useState } from "react";
import { Home, Plus, ListVideo, Video as VideoLucide, Radio, PenLine, X, UserRound, Loader2 } from "lucide-react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Watch from "./components/Watch";
import ShortsViewer from "./components/ShortsViewer";
import ChannelPage from "./components/ChannelPage";
import LibraryPage, { type LibraryKey } from "./components/LibraryPage";
import { ChipsBar, VideoCard, ShortsShelf, EmptyState, SkeletonGrid, ErrorState } from "./components/Feed";
import { ShortsIcon, SubscriptionsIcon } from "./components/icons";
import { buildHomeFeed } from "./lib/recommend";
import { searchPaged, trendingPaged } from "./lib/api";
import { TOPIC_QUERY } from "./lib/config";
import { channelIdFromUrl, videoIdFromUrl } from "./lib/format";
import {
  clearHistory,
  getHistory,
  getLiked,
  getSubscriptions,
  getWatchLater,
  setLiked,
  setWatchLater,
  subscribe,
  unsubscribe,
} from "./lib/store";
import type { HistoryRow, PipedVideo, Subscription } from "./lib/types";

type Route =
  | { type: "home" }
  | { type: "watch"; video: PipedVideo }
  | { type: "channel"; id: string }
  | { type: "subs" }
  | { type: "library"; key: LibraryKey };

const LIBRARY_KEYS: LibraryKey[] = [
  "السجل",
  "المشاهدة لاحقاً",
  "مقاطع أعجبتني",
  "قوائم التشغيل",
  "مقاطع الفيديو",
  "التنزيلات",
  "الرائج",
  "الموسيقى",
  "الألعاب",
  "الأخبار",
  "الرياضة",
];

export default function App() {
  const [route, setRoute] = useState<Route>({ type: "home" });
  const [expanded, setExpanded] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const [activeNav, setActiveNav] = useState("الرئيسية");
  const [chip, setChip] = useState("الكل");
  const [searchQ, setSearchQ] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [hidden, setHidden] = useState<string[]>([]);
  const [shorts, setShorts] = useState<{ items: PipedVideo[]; index: number } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  // persisted state
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [watchLater, setWatchLaterState] = useState<string[]>([]);
  const [liked, setLikedState] = useState<string[]>([]);

  // feed
  const [feed, setFeed] = useState<PipedVideo[] | null>(null);
  const [feedErr, setFeedErr] = useState(false);
  const [feedAttempt, setFeedAttempt] = useState(0);
  // pagination: opaque cursor for the next page (null = no more)
  const feedNext = useRef<unknown | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const feedGen = useRef(0);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  // initial load
  useEffect(() => {
    getSubscriptions().then(setSubs).catch(() => {});
    getHistory().then(setHistory).catch(() => {});
    setWatchLaterState(getWatchLater());
    setLikedState(getLiked());
  }, []);

  // feed loading: personalized / topic / search
  const isFeedMode = route.type === "home" || route.type === "subs";
  const feedQuery = searchQ.trim()
    ? searchQ.trim()
    : chip === "الكل" || chip === "الرائج"
      ? ""
      : TOPIC_QUERY[chip] || chip;
  const feedKind: "home" | "trending" | "search" = searchQ.trim()
    ? "search"
    : chip === "الكل"
      ? "home"
      : chip === "الرائج"
        ? "trending"
        : "search";

  useEffect(() => {
    if (!isFeedMode) return;
    const gen = ++feedGen.current;
    setFeed(null);
    setFeedErr(false);
    setHasMore(false);
    feedNext.current = null;

    (async () => {
      try {
        let items: PipedVideo[];
        let next: unknown | null;
        if (feedKind === "home") {
          const r = await buildHomeFeed(subs, history);
          items = r.videos;
          next = r.next;
        } else if (feedKind === "trending") {
          const r = await trendingPaged();
          items = r.items;
          next = r.next;
        } else {
          const r = await searchPaged(feedQuery);
          items = r.items;
          next = r.next;
        }
        if (gen !== feedGen.current) return;
        setFeed(items);
        feedNext.current = next;
        setHasMore(!!next);
      } catch {
        if (gen === feedGen.current) setFeedErr(true);
      }
    })();
    // subs/history intentionally excluded: they only refine the home ranking
    // and re-running on every watch would reset the user's scroll position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFeedMode, feedKind, feedQuery, feedAttempt]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !feedNext.current) return;
    const gen = feedGen.current;
    setLoadingMore(true);
    try {
      const r =
        feedKind === "search"
          ? await searchPaged(feedQuery, feedNext.current)
          : await trendingPaged(feedNext.current);
      if (gen !== feedGen.current) return;
      setFeed((f) => {
        const have = new Set((f || []).map((v) => v.url));
        return [...(f || []), ...r.items.filter((v) => !have.has(v.url))];
      });
      feedNext.current = r.next;
      setHasMore(!!r.next && r.items.length > 0);
    } catch {
      if (gen === feedGen.current) setHasMore(false);
    } finally {
      if (gen === feedGen.current) setLoadingMore(false);
    }
  }, [feedKind, feedQuery, loadingMore]);

  // infinite scroll: fetch the next page when the sentinel becomes visible
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !hasMore || !isFeedMode) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) void loadMore();
      },
      { rootMargin: "900px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, isFeedMode, loadMore, feed]);

  const toggleLater = (id: string) => {
    setWatchLaterState((w) => {
      const has = w.includes(id);
      const next = has ? w.filter((x) => x !== id) : [...w, id];
      setWatchLater(next);
      notify(has ? "تمت الإزالة من المشاهدة لاحقاً" : "تم الحفظ للمشاهدة لاحقاً ⏰");
      return next;
    });
  };

  const toggleLike = (id: string) => {
    setLikedState((l) => {
      const next = l.includes(id) ? l.filter((x) => x !== id) : [...l, id];
      setLiked(next);
      return next;
    });
  };

  const doToggleSub = async (meta: { channelId: string; name: string; avatar?: string }) => {
    const has = subs.some((s) => s.channel_id === meta.channelId);
    if (has) {
      await unsubscribe(meta.channelId);
      setSubs((s) => s.filter((x) => x.channel_id !== meta.channelId));
      notify("تم إلغاء الاشتراك");
    } else {
      await subscribe({ channel_id: meta.channelId, channel_name: meta.name, channel_avatar_url: meta.avatar });
      setSubs((s) => [{ channel_id: meta.channelId, channel_name: meta.name, channel_avatar_url: meta.avatar }, ...s]);
      notify("تم الاشتراك ✓");
    }
  };

  const goHome = () => {
    setRoute({ type: "home" });
    setSearchQ("");
    setActiveNav("الرئيسية");
    window.scrollTo({ top: 0 });
  };

  const openVideo = (v: PipedVideo) => {
    setRoute({ type: "watch", video: v });
    window.scrollTo({ top: 0 });
  };

  const openChannel = (raw: string) => {
    const id = channelIdFromUrl(raw) || raw;
    if (!id) return;
    setRoute({ type: "channel", id });
    setActiveNav("");
    window.scrollTo({ top: 0 });
  };

  // cross-component events (header notifications, playlist links)
  useEffect(() => {
    const onOpen = (e: Event) => openVideo((e as CustomEvent<PipedVideo>).detail);
    const onNav = (e: Event) => navigate((e as CustomEvent<LibraryKey>).detail);
    window.addEventListener("yt:open", onOpen);
    window.addEventListener("yt:nav", onNav);
    return () => {
      window.removeEventListener("yt:open", onOpen);
      window.removeEventListener("yt:nav", onNav);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = (label: string) => {
    if (label.startsWith("channel:")) {
      openChannel(label.slice(8));
      return;
    }
    setActiveNav(label);
    setSearchQ("");
    if (label === "الرئيسية") goHome();
    else if (label === "Shorts") {
      setRoute({ type: "home" });
      setChip("الكل");
      requestAnimationFrame(() => document.getElementById("shorts-shelf")?.scrollIntoView({ behavior: "smooth" }));
    } else if (label === "الاشتراكات") {
      setRoute({ type: "subs" });
      window.scrollTo({ top: 0 });
    } else if ((LIBRARY_KEYS as string[]).includes(label)) {
      setRoute({ type: "library", key: label as LibraryKey });
      window.scrollTo({ top: 0 });
    } else if (["الإعدادات", "الإبلاغ عن مشكلة", "المساعدة"].includes(label)) {
      notify(`«${label}» — غير متاح في الواجهة التجريبية`);
    }
  };

  // live history updates from the player
  useEffect(() => {
    const onHist = (e: Event) => {
      const row = (e as CustomEvent<HistoryRow>).detail;
      setHistory((h) => [row, ...h.filter((x) => x.video_id !== row.video_id)]);
    };
    window.addEventListener("yt:history", onHist);
    return () => window.removeEventListener("yt:history", onHist);
  }, []);

  const visibleFeed = (feed || []).filter((v) => !hidden.includes(videoIdFromUrl(v.url)));
  const shortsItems = visibleFeed.filter((v) => v.duration > 0 && v.duration <= 60).slice(0, 8);
  const showShorts = route.type === "home" && chip === "الكل" && !searchQ && shortsItems.length > 0;
  const inWatch = route.type === "watch";

  const cardProps = (v: PipedVideo, i: number) => {
    const id = videoIdFromUrl(v.url);
    return {
      video: v,
      onOpen: openVideo,
      index: i,
      notify,
      onChannel: openChannel,
      saved: watchLater.includes(id),
      onSaveLater: () => toggleLater(id),
      onDismiss: (vid: string) => setHidden((h) => [...h, vid]),
    };
  };

  const first = visibleFeed.slice(0, 4);
  const rest = visibleFeed.slice(4);

  return (
    <div className="min-h-screen bg-yt-bg text-yt-text">
      <Header
        onToggleSidebar={() => (inWatch || window.innerWidth < 768 ? setDrawer(true) : setExpanded((e) => !e))}
        onHome={goHome}
        inWatch={inWatch}
        onBack={goHome}
        onSearch={(q) => {
          setSearchQ(q);
          setRoute({ type: "home" });
          window.scrollTo({ top: 0 });
        }}
      />

      <Sidebar
        expanded={expanded}
        pushable={!inWatch}
        active={activeNav}
        subs={subs}
        onNavigate={navigate}
        onHome={goHome}
        mobileOpen={drawer}
        onCloseMobile={() => setDrawer(false)}
      />

      <main className={`pt-14 transition-[margin] duration-200 ${inWatch ? "" : expanded ? "md:ms-60" : "md:ms-[72px]"} ${inWatch ? "" : "pb-20 md:pb-8"}`}>
        {route.type === "watch" && (
          <Watch
            key={route.video.url}
            video={route.video}
            onOpen={openVideo}
            onChannel={openChannel}
            notify={notify}
            liked={liked.includes(videoIdFromUrl(route.video.url))}
            onToggleLike={() => toggleLike(videoIdFromUrl(route.video.url))}
            saved={watchLater.includes(videoIdFromUrl(route.video.url))}
            onToggleSave={() => toggleLater(videoIdFromUrl(route.video.url))}
            isSubscribed={(cid) => subs.some((s) => s.channel_id === cid)}
            onToggleSub={(m) => doToggleSub(m)}
          />
        )}

        {route.type === "channel" && (
          <ChannelPage
            key={route.id}
            channelId={route.id}
            onOpen={openVideo}
            notify={notify}
            isSubscribed={subs.some((s) => s.channel_id === route.id)}
            onToggleSub={doToggleSub}
            onDismiss={(id) => setHidden((h) => [...h, id])}
            onOpenShort={(items, index) => setShorts({ items, index })}
          />
        )}

        {route.type === "library" && (
          <LibraryPage
            page={route.key}
            watchLater={watchLater}
            liked={liked}
            history={history.map((h) => h.video_id)}
            onOpen={openVideo}
            onChannel={openChannel}
            notify={notify}
            onDismiss={(id) => setHidden((h) => [...h, id])}
            onRemoveLater={(id) => {
              setWatchLaterState((w) => {
                const next = w.filter((x) => x !== id);
                setWatchLater(next);
                return next;
              });
            }}
            onClearHistory={() => {
              setHistory([]);
              clearHistory();
            }}
            isSaved={(id) => watchLater.includes(id)}
            onSaveLater={toggleLater}
          />
        )}

        {isFeedMode && (
          <div className="px-3 sm:px-6">
            <ChipsBar active={chip} onChange={(c) => { setChip(c); setSearchQ(""); }} />
            {feedErr ? (
              <ErrorState onRetry={() => setFeedAttempt((a) => a + 1)} />
            ) : feed === null ? (
              <SkeletonGrid />
            ) : visibleFeed.length === 0 ? (
              <EmptyState message={searchQ ? `لا توجد نتائج للبحث «${searchQ}»` : undefined} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8 mt-2">
                  {first.map((v, i) => (
                    <VideoCard key={v.url} {...cardProps(v, i)} />
                  ))}
                </div>
                {showShorts && <ShortsShelf items={shortsItems} onOpen={(i) => setShorts({ items: shortsItems, index: i })} />}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8">
                  {rest.map((v, i) => (
                    <VideoCard key={v.url} {...cardProps(v, i + 4)} />
                  ))}
                </div>
                {/* infinite-scroll sentinel */}
                <div ref={loadMoreRef} className="h-24 flex items-center justify-center text-yt-sub">
                  {loadingMore ? (
                    <Loader2 className="w-7 h-7 animate-spin" />
                  ) : hasMore ? (
                    <button onClick={() => void loadMore()} className="h-9 px-5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium">
                      عرض المزيد
                    </button>
                  ) : (
                    <span className="text-xs">وصلت إلى نهاية النتائج</span>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* mobile bottom nav */}
      {!inWatch && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-yt-bg/95 backdrop-blur border-t border-yt-border flex items-stretch h-14 pb-[env(safe-area-inset-bottom)]">
          <BottomItem icon={<Home className="w-6 h-6" />} label="الرئيسية" active={route.type === "home"} onClick={goHome} />
          <BottomItem icon={<ShortsIcon className="w-6 h-6" />} label="شورتس" onClick={() => navigate("Shorts")} />
          <button onClick={() => setCreateOpen(true)} className="flex-1 grid place-items-center" aria-label="إنشاء">
            <span className="w-11 h-8 rounded-xl bg-yt-surface hover:bg-yt-hover active:scale-90 transition-all grid place-items-center">
              <Plus className="w-6 h-6" />
            </span>
          </button>
          <BottomItem icon={<SubscriptionsIcon className="w-6 h-6" />} label="الاشتراكات" active={route.type === "subs"} onClick={() => navigate("الاشتراكات")} />
          <BottomItem icon={<ListVideo className="w-6 h-6" />} label="أنت" active={route.type === "library"} onClick={() => setDrawer(true)} />
        </nav>
      )}

      {createOpen && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center md:justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setCreateOpen(false)} />
          <div className="dropdown-in relative w-full md:w-80 bg-yt-raised rounded-t-2xl md:rounded-2xl border border-yt-border p-3 pb-6 md:pb-3">
            <div className="flex items-center justify-between px-2 py-2">
              <span className="font-display font-bold">إنشاء</span>
              <button onClick={() => setCreateOpen(false)} className="w-9 h-9 rounded-full hover:bg-yt-surface grid place-items-center" aria-label="إغلاق">
                <X className="w-5 h-5" />
              </button>
            </div>
            {[
              { icon: VideoLucide, label: "رفع فيديو", desc: "شارك فيديو مع جمهورك" },
              { icon: Radio, label: "بث مباشر", desc: "ابدأ البث الآن" },
              { icon: PenLine, label: "إنشاء منشور", desc: "تواصل مع المتابعين" },
              { icon: UserRound, label: "قصّة شورتس", desc: "سجّل لحظة قصيرة" },
            ].map((it) => (
              <button
                key={it.label}
                onClick={() => {
                  setCreateOpen(false);
                  notify("هذه واجهة مشاهدة فقط — الرفع غير متاح");
                }}
                className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-yt-surface text-start"
              >
                <span className="w-10 h-10 rounded-full bg-yt-surface grid place-items-center">
                  <it.icon className="w-5 h-5" />
                </span>
                <span>
                  <span className="block text-sm font-bold">{it.label}</span>
                  <span className="block text-xs text-yt-sub">{it.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {shorts && <ShortsViewer items={shorts.items} startIndex={shorts.index} onClose={() => setShorts(null)} notify={notify} />}


      {toast && (
        <div className="toast-in fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-[#f1f1f1] text-[#0f0f0f] text-sm font-medium px-4 py-3 rounded-lg shadow-2xl shadow-black/50 max-w-[90vw] truncate">
          {toast}
        </div>
      )}
    </div>
  );
}

function BottomItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex-1 flex flex-col items-center justify-center gap-1">
      <span className={`transition-transform active:scale-90 ${active ? "text-yt-text" : "text-yt-sub"}`}>{icon}</span>
      <span className={`text-[10px] ${active ? "font-bold" : "text-yt-sub"}`}>{label}</span>
    </button>
  );
}
