import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Plus,
  ListVideo,
  Video as VideoLucide,
  Radio,
  PenLine,
  X,
  UserRound,
  Loader2,
} from "lucide-react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Watch from "./components/Watch";
import Miniplayer from "./components/Miniplayer";
import ShortsViewer from "./components/ShortsViewer";
import ChannelPage from "./components/ChannelPage";
import LibraryPage, { type LibraryKey } from "./components/LibraryPage";
import PlaylistPage from "./components/PlaylistPage";
import SettingsDialog from "./components/SettingsDialog";
import { YouTubeImportModal } from "./components/YouTubeImportModal";
import { YouTubeSyncBanner } from "./components/YouTubeSyncBanner";
import {
  ChipsBar,
  VideoCard,
  ShortsShelf,
  EmptyState,
  SkeletonGrid,
  ErrorState,
  ChannelResultCard,
  PlaylistCard,
} from "./components/Feed";
import { ShortsIcon, SubscriptionsIcon } from "./components/icons";
import { buildHomeFeed, buildSubscriptionsFeed } from "./lib/recommend";
import { getStreams, searchPaged, trendingPaged } from "./lib/api";
import { TOPIC_QUERY } from "./lib/config";
import { ageDays, channelIdFromUrl, videoIdFromUrl } from "./lib/format";
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
  syncWatchLaterToCloud,
  syncLikedToCloud,
  fetchUserWatchLater,
  fetchUserLiked,
} from "./lib/store";
import { useAuth } from "./lib/AuthContext";
import type {
  HistoryRow,
  PipedVideo,
  Subscription,
  SearchChannel,
  SearchPlaylist,
} from "./lib/types";
import { useLanguage } from "./lib/i18n";
import { useAppStore, appStore, type RouteState } from "./lib/appStore";

type SearchFilter =
  "All" | "Shorts" | "Unwatched" | "Watched" | "Videos" | "Recently uploaded" | "Live";

const LIBRARY_KEYS: LibraryKey[] = [
  "السجل",
  "History",
  "المشاهدة لاحقاً",
  "Watch Later",
  "مقاطع أعجبتني",
  "Liked Videos",
  "قوائم التشغيل",
  "Playlists",
  "مقاطع الفيديو",
  "Your Videos",
  "التنزيلات",
  "Downloads",
  "الرائج",
  "Trending",
  "الموسيقى",
  "Music",
  "الألعاب",
  "Gaming",
  "الأخبار",
  "News",
  "الرياضة",
  "Sports",
];

export default function App() {
  const { lang, t, isAr } = useLanguage();
  const { user } = useAuth();
  const routerNav = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const urlSearch = useRouterState({ select: (s) => s.location.search as Record<string, unknown> });
  const urlVideoId = pathname === "/watch" ? String(urlSearch?.["v"] ?? "") : "";

  const { route } = useAppStore();
  const setRoute = appStore.setRoute;
  
  const [expanded, setExpanded] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [chip, setChip] = useState("All");
  const { searchQ, searchFilter, miniplayer } = useAppStore();
  const setSearchQ = useCallback((q: string) => appStore.setSearchQ(q), []);
  const setSearchFilter = useCallback((f: SearchFilter) => appStore.setSearchFilter(f), []);
  const setMiniplayer = useCallback(
    (m: { video: PipedVideo; time?: number } | null) => appStore.setMiniplayer(m),
    [],
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
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
  const [channels, setChannels] = useState<SearchChannel[]>([]);
  const [playlists, setPlaylists] = useState<SearchPlaylist[]>([]);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [feedErr, setFeedErr] = useState(false);
  const [feedAttempt, setFeedAttempt] = useState(0);
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

  // initial load and user change sync
  useEffect(() => {
    getSubscriptions()
      .then(setSubs)
      .catch(() => {});
    getHistory()
      .then(setHistory)
      .catch(() => {});
    fetchUserWatchLater()
      .then(setWatchLaterState)
      .catch(() => setWatchLaterState(getWatchLater()));
    fetchUserLiked()
      .then(setLikedState)
      .catch(() => setLikedState(getLiked()));
  }, [user]);

  // Listen for YouTube sync completion events
  useEffect(() => {
    const handleSync = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      getSubscriptions()
        .then(setSubs)
        .catch(() => {});
      fetchUserLiked()
        .then(setLikedState)
        .catch(() => {});
      if (detail?.importedSubsCount && detail.importedSubsCount > 0) {
        notify(
          isAr
            ? `تم استيراد ${detail.importedSubsCount} قناة من اشتراكاتك على يوتيوب بنجاح!`
            : `Successfully imported ${detail.importedSubsCount} channels from YouTube!`,
        );
      }
    };
    window.addEventListener("yt:subscriptions-synced", handleSync);
    return () => window.removeEventListener("yt:subscriptions-synced", handleSync);
  }, [isAr, notify]);

  // feed loading: personalized / topic / search
  const isFeedMode = route.type === "home" || route.type === "subs";
  const isSearchActive = searchQ.trim().length > 0;

  const feedQuery = isSearchActive
    ? searchQ.trim()
    : chip === "All" || chip === "الكل" || chip === "Trending" || chip === "الرائج"
      ? ""
      : TOPIC_QUERY[chip] || chip;

  const feedKind: "home" | "trending" | "search" = isSearchActive
    ? "search"
    : chip === "All" || chip === "الكل"
      ? "home"
      : chip === "Trending" || chip === "الرائج"
        ? "trending"
        : "search";

  useEffect(() => {
    if (!isFeedMode) return;
    const gen = ++feedGen.current;
    setFeed(null);
    setChannels([]);
    setPlaylists([]);
    setFeedErr(false);
    setHasMore(false);
    feedNext.current = null;

    (async () => {
      try {
        let items: PipedVideo[];
        let chans: SearchChannel[] = [];
        let plays: SearchPlaylist[] = [];
        let next: unknown | null;
        if (route.type === "subs") {
          items = await buildSubscriptionsFeed(subs);
          next = null;
        } else if (feedKind === "home") {
          const r = await buildHomeFeed(subs, history, liked);
          items = r.videos;
          next = r.next;
        } else if (feedKind === "trending") {
          const r = await trendingPaged();
          items = r.items;
          next = r.next;
        } else {
          const r = await searchPaged(feedQuery);
          items = r.items;
          chans = r.channels || [];
          plays = r.playlists || [];
          next = r.next;
        }
        if (gen !== feedGen.current) return;
        setFeed(items);
        setChannels(chans);
        setPlaylists(plays);

        feedNext.current = next;
        setHasMore(!!next);
      } catch {
        if (gen === feedGen.current) setFeedErr(true);
      }
    })();
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
      setHasMore(!!r.next);
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
      void syncWatchLaterToCloud(id, !has);
      notify(has ? t("removeFromWatchLater") : t("saveToWatchLater"));
      return next;
    });
  };

  const toggleLike = (id: string) => {
    setLikedState((l) => {
      const has = l.includes(id);
      const next = has ? l.filter((x) => x !== id) : [...l, id];
      setLiked(next);
      void syncLikedToCloud(id, !has);
      return next;
    });
  };

  const doToggleSub = async (meta: { channelId: string; name: string; avatar?: string }) => {
    const has = subs.some((s) => s.channel_id === meta.channelId);
    if (has) {
      await unsubscribe(meta.channelId);
      setSubs((s) => s.filter((x) => x.channel_id !== meta.channelId));
      notify(t("unsubscribedToast"));
    } else {
      await subscribe({
        channel_id: meta.channelId,
        channel_name: meta.name,
        channel_avatar_url: meta.avatar,
      });
      setSubs((s) => [
        {
          channel_id: meta.channelId,
          channel_name: meta.name,
          channel_avatar_url: meta.avatar,
        },
        ...s,
      ]);
      notify(t("subscribedToast"));
    }
  };

  const minimizeVideo = () => {
    if (route.type === "watch") {
      const id = videoIdFromUrl(route.video.url);
      const time = (id ? appStore.getPlaybackTime(id) : 0) || 0;
      appStore.setMiniplayer({ video: route.video, time });
      setRoute({ type: "home" });
      if (pathname !== "/") void routerNav({ to: "/" });
    }
  };

  const handleSearch = useCallback(
    (q: string) => {
      const currentRoute = appStore.getSnapshot().route;
      if (currentRoute.type === "watch") {
        const id = videoIdFromUrl(currentRoute.video.url);
        const time = (id ? appStore.getPlaybackTime(id) : 0) || 0;
        appStore.setMiniplayer({ video: currentRoute.video, time });
      }
      appStore.setSearchQ(q);
      appStore.setSearchFilter("All");
      setRoute({ type: "home" });
      if (pathname !== "/") void routerNav({ to: "/" });
      window.scrollTo({ top: 0 });
    },
    [pathname, routerNav, setRoute],
  );

  const handleLiveSearch = useCallback(
    (q: string) => {
      const snapshot = appStore.getSnapshot();
      if (q === snapshot.searchQ) return;

      if (snapshot.route.type === "watch") {
        const id = videoIdFromUrl(snapshot.route.video.url);
        const time = (id ? appStore.getPlaybackTime(id) : 0) || 0;
        appStore.setMiniplayer({ video: snapshot.route.video, time });
      }
      appStore.setSearchQ(q);
      appStore.setSearchFilter("All");
      if (snapshot.route.type !== "home") {
        setRoute({ type: "home" });
      }
    },
    [setRoute],
  );

  const expandMiniplayer = () => {
    if (!miniplayer) return;
    const v = miniplayer.video;
    const id = videoIdFromUrl(v.url);
    const time = (id ? appStore.getPlaybackTime(id) : 0) || miniplayer.time || 0;
    appStore.setMiniplayer(null);
    setRoute({ type: "watch", video: v });
    if (id && id !== urlVideoId) void routerNav({ to: "/watch", search: { v: id } });
    window.scrollTo({ top: 0 });
  };

  const closeMiniplayer = () => {
    appStore.setMiniplayer(null);
  };

  const goHome = () => {
    if (route.type === "watch") {
      const id = videoIdFromUrl(route.video.url);
      const time = (id ? appStore.getPlaybackTime(id) : 0) || 0;
      appStore.setMiniplayer({ video: route.video, time });
    }
    setRoute({ type: "home" });
    setActiveNav("home");
    if (pathname !== "/") void routerNav({ to: "/" });
    window.scrollTo({ top: 0 });
  };

  const openVideo = (v: PipedVideo) => {
    const id = videoIdFromUrl(v.url);
    if (!id) return;
    
    appStore.setMiniplayer(null);
    setRoute({ type: "watch", video: v });
    
    if (id !== urlVideoId) {
      void routerNav({ to: "/watch", search: { v: id } });
    }
    window.scrollTo({ top: 0 });
  };

  // keep the in-app view in sync with the address bar (deep links, back/forward)
  useEffect(() => {
    if (urlVideoId) {
      // If opening full watch view for this video, close miniplayer
      const curMini = appStore.getSnapshot().miniplayer;
      if (curMini && videoIdFromUrl(curMini.video.url) === urlVideoId) {
        appStore.setMiniplayer(null);
      }

      let alive = true;
      setRoute((r) => {
        // If we already have the correct video in route, don't reset it
        if (r.type === "watch" && videoIdFromUrl(r.video.url) === urlVideoId) return r;

        return {
          type: "watch",
          video: {
            url: `/watch?v=${urlVideoId}`,
            title: "",
            thumbnail: `https://i.ytimg.com/vi/${urlVideoId}/hqdefault.jpg`,
            uploaderName: "",
            duration: 0,
          },
        };
      });
      getStreams(urlVideoId)
        .then((d) => {
          if (!alive) return;
          setRoute((r) => {
            if (r.type !== "watch" || videoIdFromUrl(r.video.url) !== urlVideoId || r.video.title)
              return r;
            return {
              type: "watch",
              video: {
                ...r.video,
                title: d.title,
                uploaderName: d.uploader,
                uploaderUrl: d.uploaderUrl,
                uploaderAvatar: d.uploaderAvatar,
                views: d.views,
              },
            };
          });
        })
        .catch(() => {});
      return () => {
        alive = false;
      };
    } else {
      // No video in URL - handle transitions to Home/Channel/Library
      setRoute((r) => {
        // 1. If we are already on a non-watch route, stay there
        if (r.type !== "watch") return r;

        // 2. Handle minimization from watch to home when URL cleared (e.g. back button)
        const id = videoIdFromUrl(r.video.url);
        const time = (id ? appStore.getPlaybackTime(id) : 0) || 0;
        appStore.setMiniplayer({ video: r.video, time });
        return { type: "home" };
      });
    }
  }, [urlVideoId, setRoute]);

  const openChannel = (raw: string) => {
    const id = channelIdFromUrl(raw) || raw;
    if (!id) return;
    setRoute({ type: "channel", id });
    setActiveNav("");
    if (pathname !== "/") void routerNav({ to: "/" });
    window.scrollTo({ top: 0 });
  };

  const openPlaylist = (id: string) => {
    if (!id) return;
    setRoute({ type: "playlist", id });
    setActiveNav("");
    if (pathname !== "/") void routerNav({ to: "/" });
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
      if (route.type === "watch") {
        const id = videoIdFromUrl(route.video.url);
        const time = (id ? appStore.getPlaybackTime(id) : 0) || 0;
        appStore.setMiniplayer({ video: route.video, time });
      }
      openChannel(label.slice(8));
      return;
    }
    if (
      label === "Settings" ||
      label === "الإعدادات" ||
      label === t("settings") ||
      label.startsWith("Language:") ||
      label.startsWith("اللغة:")
    ) {
      setSettingsOpen(true);
      return;
    }
    if (route.type === "watch") {
      const id = videoIdFromUrl(route.video.url);
      const time = (id ? appStore.getPlaybackTime(id) : 0) || 0;
      appStore.setMiniplayer({ video: route.video, time });
    }
    setActiveNav(label);
    if (pathname !== "/") void routerNav({ to: "/" });
    if (label === "home" || label === t("home")) {
      goHome();
    } else if (label === "Shorts" || label === t("shorts")) {
      setRoute({ type: "home" });
      setChip("All");
      requestAnimationFrame(() =>
        document.getElementById("shorts-shelf")?.scrollIntoView({ behavior: "smooth" }),
      );
    } else if (label === "subscriptions" || label === t("subscriptions")) {
      setRoute({ type: "subs" });
      window.scrollTo({ top: 0 });
    } else if ((LIBRARY_KEYS as string[]).includes(label)) {
      setRoute({ type: "library", key: label as LibraryKey });
      window.scrollTo({ top: 0 });
    } else {
      notify(`«${label}»`);
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

  // History set for Watched/Unwatched filters
  const watchedSet = useMemo(() => new Set(history.map((h) => h.video_id)), [history]);

  // High precision Search Filter calculations
  const { filteredVideos, showChannelsInSearch, showPlaylistsInSearch } = useMemo(() => {
    if (!feed) {
      return {
        filteredVideos: [],
        showChannelsInSearch: false,
        showPlaylistsInSearch: false,
      };
    }

    const unhidden = feed.filter((v) => !hidden.includes(videoIdFromUrl(v.url)));

    if (!isSearchActive) {
      return {
        filteredVideos: unhidden,
        showChannelsInSearch: false,
        showPlaylistsInSearch: false,
      };
    }

    let list = [...unhidden];
    let showChans = false;
    let showPlays = false;

    switch (searchFilter) {
      case "All":
        showChans = true;
        showPlays = true;
        break;

      case "Shorts": {
        showChans = false;
        showPlays = false;
        list = list.filter((v) => {
          const dur = v.duration;
          const isShortDur = dur > 0 && dur <= 60;
          const isShortTag =
            (v.title || "").toLowerCase().includes("#shorts") ||
            (v.title || "").toLowerCase().includes("shorts");
          const isShortName = v.uploaderName === "Shorts";
          const isReel =
            dur === 0 &&
            !v.type?.includes("live") &&
            !(v.uploadedDate || "").includes("مباشر") &&
            !(v.uploadedDate || "").toLowerCase().includes("live");
          return isShortDur || isShortTag || isShortName || isReel;
        });
        break;
      }

      case "Unwatched": {
        showChans = false;
        showPlays = false;
        list = list.filter((v) => !watchedSet.has(videoIdFromUrl(v.url)));
        break;
      }

      case "Watched": {
        showChans = false;
        showPlays = false;
        list = list.filter((v) => watchedSet.has(videoIdFromUrl(v.url)));
        break;
      }

      case "Videos": {
        showChans = false;
        showPlays = false;
        list = list.filter((v) => {
          const dur = v.duration;
          const isShort =
            (dur > 0 && dur <= 60) || (v.title || "").toLowerCase().includes("#shorts");
          return !isShort && dur > 0;
        });
        break;
      }

      case "Recently uploaded": {
        showChans = true;
        showPlays = true;
        list.sort(
          (a, b) => ageDays(a.uploaded, a.uploadedDate) - ageDays(b.uploaded, b.uploadedDate),
        );
        break;
      }

      case "Live": {
        showChans = false;
        showPlays = false;
        list = list.filter((v) => {
          const dur = v.duration;
          const isLiveType = v.type === "live";
          const isLiveText =
            (v.uploadedDate || "").includes("مباشر") ||
            (v.uploadedDate || "").toLowerCase().includes("live") ||
            (v.title || "").includes("بث مباشر") ||
            (v.title || "").toLowerCase().includes("live stream");
          return (dur === 0 && isLiveText) || isLiveType;
        });
        break;
      }
    }

    return {
      filteredVideos: list,
      showChannelsInSearch: showChans,
      showPlaylistsInSearch: showPlays,
    };
  }, [feed, hidden, isSearchActive, searchFilter, watchedSet]);

  const shortsItems = useMemo(
    () => (feed || []).filter((v) => v.duration > 0 && v.duration <= 60).slice(0, 8),
    [feed],
  );
  const showShorts =
    route.type === "home" &&
    (chip === "All" || chip === "الكل") &&
    !isSearchActive &&
    shortsItems.length > 0;
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

  const first = filteredVideos.slice(0, 4);
  const rest = filteredVideos.slice(4);

  // Search filter chips definition requested by the user:
  // "All", "Shorts", "Unwatched", "Watched", "Videos", "Recently uploaded", "Live"
  const searchFilterChips: { id: SearchFilter; label: string }[] = useMemo(
    () => [
      { id: "All", label: isAr ? "الكل" : "All" },
      { id: "Shorts", label: "Shorts" },
      { id: "Unwatched", label: isAr ? "لم تتم مشاهدتها" : "Unwatched" },
      { id: "Watched", label: isAr ? "تمت مشاهدتها" : "Watched" },
      { id: "Videos", label: isAr ? "فيديوهات" : "Videos" },
      { id: "Recently uploaded", label: isAr ? "تم تحميلها مؤخراً" : "Recently uploaded" },
      { id: "Live", label: isAr ? "بث مباشر" : "Live" },
    ],
    [isAr],
  );

  // Home chips definition
  const homeCategoryChips = useMemo(
    () => [
      { id: "All", label: t("chipAll") },
      { id: "Trending", label: t("chipTrending") },
      { id: "Gaming", label: t("chipGaming") },
      { id: "Minecraft", label: t("chipMinecraft") },
      { id: "Technology", label: t("chipTechnology") },
      { id: "Cooking", label: t("chipCooking") },
      { id: "Travel", label: t("chipTravel") },
      { id: "Music", label: t("chipMusic") },
      { id: "Cars", label: t("chipCars") },
    ],
    [t],
  );

  const emptyFilterMessage = useMemo(() => {
    if (!isSearchActive) return undefined;
    switch (searchFilter) {
      case "Shorts":
        return t("noShortsResults");
      case "Unwatched":
        return t("noUnwatchedResults");
      case "Watched":
        return t("noWatchedResults");
      case "Live":
        return t("noLiveResults");
      default:
        return `${t("noResults")} «${searchQ}»`;
    }
  }, [isSearchActive, searchFilter, searchQ, t]);

  return (
    <div className="min-h-screen bg-yt-bg text-yt-text">
      <Header
        onToggleSidebar={() =>
          inWatch || window.innerWidth < 768 ? setDrawer(true) : setExpanded((e) => !e)
        }
        onHome={inWatch ? minimizeVideo : goHome}
        inWatch={inWatch}
        onBack={inWatch ? minimizeVideo : goHome}
        searchQuery={searchQ}
        onSearch={handleSearch}
        onLiveSearch={handleLiveSearch}
        onOpenSettings={() => setSettingsOpen(true)}
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
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main
        className={`pt-14 transition-[margin] duration-200 ${
          inWatch ? "" : expanded ? "md:ms-60" : "md:ms-[72px]"
        } ${inWatch ? "" : "pb-20 md:pb-8"}`}
      >
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
            onMinimize={minimizeVideo}
            startTime={appStore.getPlaybackTime(videoIdFromUrl(route.video.url))}
            onTimeUpdate={(t) => {
              const id = videoIdFromUrl(route.video.url);
              if (id) appStore.setPlaybackTime(id, t);
            }}
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

        {route.type === "playlist" && (
          <PlaylistPage
            playlistId={route.id}
            onOpen={openVideo}
            onChannel={(id) => openChannel(id)}
            notify={notify}
            onDismiss={(id) => setHidden((h) => [...h, id])}
            isSaved={(id) => watchLater.includes(id)}
            onSaveLater={toggleLater}
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
            {/* Conditional Chips Bar: When search is active, show the 7 requested search filter chips! */}
            {isSearchActive ? (
              <ChipsBar
                active={searchFilter}
                chips={searchFilterChips}
                onChange={(c) => setSearchFilter(c as SearchFilter)}
              />
            ) : (
              <ChipsBar
                active={chip}
                chips={homeCategoryChips}
                onChange={(c) => {
                  setChip(c);
                  setSearchQ("");
                }}
              />
            )}

            {!isSearchActive && route.type === "home" && subs.length === 0 && (
              <YouTubeSyncBanner />
            )}

            {feedErr ? (
              <ErrorState onRetry={() => setFeedAttempt((a) => a + 1)} />
            ) : feed === null ? (
              <SkeletonGrid />
            ) : route.type === "subs" && subs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                  <SubscriptionsIcon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-1 text-yt-text">
                  {isAr ? "لا توجد قنوات في اشتراكاتك بعد" : "No subscribed channels yet"}
                </h3>
                <p className="text-xs text-yt-sub mb-6 leading-relaxed">
                  {isAr
                    ? "يمكنك استيراد قنواتك المفضلة من YouTube فوراً عبر ملف Google Takeout CSV أو لصق الروابط لتحديث خلاصتك هنا بكل سهولة."
                    : "Import your favorite channels from YouTube via Google Takeout CSV or paste links to populate your feed here."}
                </p>
                <button
                  onClick={() => setImportModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-semibold transition-all shadow-lg shadow-red-600/20"
                >
                  <span>
                    {isAr
                      ? "استيراد اشتراكات YouTube (Google Takeout)"
                      : "Import YouTube Subscriptions"}
                  </span>
                </button>
              </div>
            ) : filteredVideos.length === 0 &&
              (!showChannelsInSearch || channels.length === 0) &&
              (!showPlaylistsInSearch || playlists.length === 0) ? (
              <EmptyState message={emptyFilterMessage} />
            ) : (
              <>
                {/* Search Channels Results */}
                {showChannelsInSearch && channels.length > 0 && (
                  <div className="mb-6">
                    {channels.map((c) => (
                      <ChannelResultCard
                        key={c.id}
                        channel={c}
                        onOpen={openChannel}
                        subscribed={subs.some((s) => s.channel_id === c.id)}
                        onToggleSub={() =>
                          doToggleSub({ channelId: c.id, name: c.name, avatar: c.avatar })
                        }
                      />
                    ))}
                  </div>
                )}

                {/* Search Playlists Results */}
                {showPlaylistsInSearch && playlists.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8 mb-8 mt-2">
                    {playlists.map((p, i) => (
                      <PlaylistCard
                        key={p.id}
                        playlist={p}
                        index={i}
                        onOpen={() => openPlaylist(p.id)}
                      />
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8 mt-2">
                  {first.map((v, i) => (
                    <VideoCard key={v.url} {...cardProps(v, i)} />
                  ))}
                </div>
                {showShorts && (
                  <ShortsShelf
                    items={shortsItems}
                    onOpen={(i) => setShorts({ items: shortsItems, index: i })}
                  />
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8">
                  {rest.map((v, i) => (
                    <VideoCard key={v.url} {...cardProps(v, i + 4)} />
                  ))}
                </div>

                {/* infinite-scroll sentinel */}
                <div
                  ref={loadMoreRef}
                  className="h-24 flex items-center justify-center text-yt-sub"
                >
                  {loadingMore ? (
                    <Loader2 className="w-7 h-7 animate-spin" />
                  ) : hasMore ? (
                    <button
                      onClick={() => void loadMore()}
                      className="h-9 px-5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium transition-colors"
                    >
                      {t("loadMore")}
                    </button>
                  ) : (
                    <span className="text-xs">{t("endOfResults")}</span>
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
          <BottomItem
            icon={<Home className="w-6 h-6" />}
            label={t("home")}
            active={route.type === "home"}
            onClick={goHome}
          />
          <BottomItem
            icon={<ShortsIcon className="w-6 h-6" />}
            label={t("shorts")}
            onClick={() => navigate("Shorts")}
          />
          <button
            onClick={() => setCreateOpen(true)}
            className="flex-1 grid place-items-center"
            aria-label={t("create")}
          >
            <span className="w-11 h-8 rounded-xl bg-yt-surface hover:bg-yt-hover active:scale-90 transition-all grid place-items-center">
              <Plus className="w-6 h-6" />
            </span>
          </button>
          <BottomItem
            icon={<SubscriptionsIcon className="w-6 h-6" />}
            label={t("subscriptions")}
            active={route.type === "subs"}
            onClick={() => navigate("subscriptions")}
          />
          <BottomItem
            icon={<ListVideo className="w-6 h-6" />}
            label={t("you")}
            active={route.type === "library"}
            onClick={() => setDrawer(true)}
          />
        </nav>
      )}

      {/* Create Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center md:justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setCreateOpen(false)} />
          <div className="dropdown-in relative w-full md:w-80 bg-yt-raised rounded-t-2xl md:rounded-2xl border border-yt-border p-3 pb-6 md:pb-3">
            <div className="flex items-center justify-between px-2 py-2">
              <span className="font-display font-bold">{t("create")}</span>
              <button
                onClick={() => setCreateOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-yt-surface grid place-items-center"
                aria-label={t("cancel")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {[
              {
                icon: VideoLucide,
                label: t("uploadVideo"),
                desc: isAr ? "شارك فيديو مع جمهورك" : "Share a video with your audience",
              },
              {
                icon: Radio,
                label: t("goLive"),
                desc: isAr ? "ابدأ البث الآن" : "Go live right now",
              },
              {
                icon: PenLine,
                label: t("createPost"),
                desc: isAr ? "تواصل مع المتابعين" : "Reach your subscribers",
              },
              {
                icon: UserRound,
                label: isAr ? "قصّة شورتس" : "Create Short",
                desc: isAr ? "سجّل لحظة قصيرة" : "Record a short clip",
              },
            ].map((it) => (
              <button
                key={it.label}
                onClick={() => {
                  setCreateOpen(false);
                  notify(
                    isAr
                      ? "هذه واجهة مشاهدة فقط — الرفع غير متاح"
                      : "This is a player client — uploading is not enabled",
                  );
                }}
                className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-yt-surface text-start transition-colors"
              >
                <span className="w-10 h-10 rounded-full bg-yt-surface grid place-items-center shrink-0">
                  <it.icon className="w-5 h-5" />
                </span>
                <div>
                  <p className="font-medium text-sm">{it.label}</p>
                  <p className="text-xs text-yt-sub">{it.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onClearAllHistory={() => {
          setHistory([]);
          clearHistory();
        }}
      />

      {/* Shorts full-screen viewer */}
      {shorts && (
        <ShortsViewer
          items={shorts.items}
          initialIndex={shorts.index}
          onClose={() => setShorts(null)}
          onOpenWatch={openVideo}
        />
      )}

      {/* Persistent Miniplayer for background watching / browsing */}
      {miniplayer && route.type !== "watch" && (
        <Miniplayer
          video={miniplayer.video}
          startTime={miniplayer.time}
          onExpand={expandMiniplayer}
          onClose={closeMiniplayer}
          onTimeUpdate={(t) => {
            const id = videoIdFromUrl(miniplayer.video.url);
            if (id) appStore.setPlaybackTime(id, t);
          }}
        />
      )}

      {/* Floating Notification Toast */}
      {toast && (
        <div className="fixed bottom-16 md:bottom-6 start-1/2 -translate-x-1/2 z-[70] bg-yt-raised border border-yt-border px-5 py-2.5 rounded-full shadow-2xl shadow-black text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span>{toast}</span>
        </div>
      )}

      {/* Subscriptions Import Modal */}
      <YouTubeImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportSuccess={() => {
          getSubscriptions()
            .then(setSubs)
            .catch(() => {});
          setFeedAttempt((a) => a + 1);
        }}
      />
    </div>
  );
}

function BottomItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center gap-1 text-[10px] transition-colors ${
        active ? "text-white font-bold" : "text-yt-sub"
      }`}
    >
      {icon}
      <span className="truncate max-w-[56px]">{label}</span>
    </button>
  );
}
