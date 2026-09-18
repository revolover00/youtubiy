import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
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
  ChevronDown,
  Play,
} from "lucide-react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Watch from "./components/Watch";
import Miniplayer from "./components/Miniplayer";
import ShortsViewer from "./components/ShortsViewer";
import ChannelPage from "./components/ChannelPage";
import LibraryPage, { type LibraryKey } from "./components/LibraryPage";
import PlaylistPage from "./components/PlaylistPage";
import PlaylistDialog from "./components/PlaylistDialog";
import SettingsDialog from "./components/SettingsDialog";
import PoliciesPage from "./components/PoliciesPage";
import { YouTubeImportModal } from "./components/YouTubeImportModal";
import { YouTubeSyncBanner } from "./components/YouTubeSyncBanner";
import YouTubePlayer from "./components/YouTubePlayer";
import {
  ChipsBar,
  VideoCard,
  ShortsShelf,
  EmptyState,
  SkeletonGrid,
  ErrorState,
  ChannelResultCard,
  PlaylistCard,
  Avatar,
} from "./components/Feed";
import { ShortsIcon, SubscriptionsIcon } from "./components/icons";
import {
  buildHomeFeed,
  buildSubscriptionsFeed,
  rankIncoming,
  rerankUnseenWithAI,
} from "./lib/recommend";
import { buildTasteProfile } from "./lib/signals";
import { getStreams, searchPaged, trendingPaged } from "./lib/api";
import { TOPIC_QUERY } from "./lib/config";
import {
  ageDays,
  channelIdFromUrl,
  isLiveStream,
  isShortsVideo,
  isStandardVideo,
  videoIdFromUrl,
} from "./lib/format";
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
  getBackgroundPlay,
  setBackgroundPlay,
  getCustomPlaylists,
  fetchUserProgress,
  savePlaybackProgress,
  getLocalProgress,
  getDismissed,
  fetchDismissed,
  dismissVideo,
  dismissChannel,
  undoDismiss,
} from "./lib/store";
import { useAuth } from "./lib/AuthContext";
import type {
  HistoryRow,
  PipedVideo,
  Subscription,
  SearchChannel,
  SearchPlaylist,
  UserPlaylist,
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

  const urlSearchQ = typeof urlSearch?.["q"] === "string" ? urlSearch["q"] : undefined;
  const urlSearchId = typeof urlSearch?.["id"] === "string" ? urlSearch["id"] : undefined;
  const urlSearchK = typeof urlSearch?.["k"] === "string" ? urlSearch["k"] : undefined;
  const urlSearchV = typeof urlSearch?.["v"] === "string" ? urlSearch["v"] : undefined;

  const { route } = useAppStore();
  const setRoute = appStore.setRoute;

  const [mainDragY, setMainDragY] = useState(0);
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
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const [playlistTargetVideo, setPlaylistTargetVideo] = useState<PipedVideo | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);
  const [shorts, setShorts] = useState<{ items: PipedVideo[]; index: number } | null>(null);
  const [toast, setToast] = useState<
    | {
        message: string;
        actionLabel?: string;
        onAction?: () => void;
      }
    | string
    | null
  >(null);
  const toastTimer = useRef<number | null>(null);

  // persisted state
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [customPlaylists, setCustomPlaylists] = useState<UserPlaylist[]>([]);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [watchLater, setWatchLaterState] = useState<string[]>([]);
  const [liked, setLikedState] = useState<string[]>([]);
  const [signalsReady, setSignalsReady] = useState(false);

  // feed
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [feedAttempt, setFeedAttempt] = useState(0);
  const feedReserve = useRef<PipedVideo[]>([]);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const notify = useCallback(
    (
      msg:
        | string
        | {
            message: string;
            actionLabel?: string;
            onAction?: () => void;
          },
      durationMs = 2600,
    ) => {
      setToast(msg);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToast(null), durationMs);
    },
    [],
  );

  // initial load and user change sync
  useEffect(() => {
    setSignalsReady(false);

    fetchDismissed().catch(() => {});
    getCustomPlaylists()
      .then(setCustomPlaylists)
      .catch(() => {});
    fetchUserWatchLater()
      .then(setWatchLaterState)
      .catch(() => setWatchLaterState(getWatchLater()));

    const syncSubscriptions = getSubscriptions()
      .then(setSubs)
      .catch(() => {});
    const syncHistory = getHistory()
      .then(setHistory)
      .catch(() => {});
    const syncLiked = fetchUserLiked()
      .then(setLikedState)
      .catch(() => setLikedState(getLiked()));
    const syncProgress = fetchUserProgress()
      .then((p) => {
        Object.entries(p).forEach(([id, time]) => {
          appStore.setPlaybackTime(id, time);
        });
      })
      .catch(() => {});

    Promise.allSettled([syncSubscriptions, syncHistory, syncLiked, syncProgress]).then(() => {
      setSignalsReady(true);
    });

    appStore.setBackgroundPlay(getBackgroundPlay());
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

  // URL Sync and Page Title management
  useEffect(() => {
    const brand = "youtubiy";
    let title = brand;

    if (route.type === "watch" && route.video.title) {
      title = route.video.title;
    } else if (route.type === "channel") {
      title = isAr ? "قناة" : "Channel";
    } else if (route.type === "playlist") {
      title = isAr ? "قائمة تشغيل" : "Playlist";
    } else if (route.type === "subs") {
      title = t("subscriptions");
    } else if (route.type === "library") {
      title = route.key;
    } else if (route.type === "policies") {
      title = isAr ? "الحقوق والسياسات" : "Terms & Policies";
    }

    document.title = title === brand ? brand : `${title} - ${brand}`;
  }, [route, isAr, t, searchQ]);

  // Initial URL -> State sync
  useEffect(() => {
    if (pathname === "/watch" && urlVideoId) {
      // Handled by the other useEffect
    } else if (pathname === "/subscriptions") {
      if (route.type !== "subs") setRoute({ type: "subs" });
    } else if (pathname === "/library") {
      if (urlSearchK && (route.type !== "library" || route.key !== urlSearchK))
        setRoute({ type: "library", key: urlSearchK as LibraryKey });
    } else if (pathname === "/shorts") {
      if (route.type !== "home") setRoute({ type: "home" });
      requestAnimationFrame(() =>
        document.getElementById("shorts-shelf")?.scrollIntoView({ behavior: "smooth" }),
      );
    } else if (pathname === "/") {
      if (route.type !== "home") setRoute({ type: "home" });
    } else if (pathname === "/channel") {
      if (urlSearchId && (route.type !== "channel" || route.id !== urlSearchId))
        setRoute({ type: "channel", id: urlSearchId });
    } else if (pathname === "/playlist") {
      if (urlSearchId && (route.type !== "playlist" || route.id !== urlSearchId))
        setRoute({ type: "playlist", id: urlSearchId });
    } else if (pathname === "/search") {
      if (urlSearchQ && urlSearchQ !== searchQ) setSearchQ(urlSearchQ);
      if (route.type !== "home") setRoute({ type: "home" });
    } else if (pathname === "/policies") {
      if (route.type !== "policies") setRoute({ type: "policies" });
    }
  }, [
    pathname,
    urlVideoId,
    urlSearchId,
    urlSearchK,
    urlSearchQ,
    setRoute,
    setSearchQ,
    route,
    searchQ,
  ]);

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

  const feedQueryKey = useMemo(() => {
    if (route.type === "subs") {
      return ["subs", subs.length, feedAttempt];
    }
    if (feedKind === "home") {
      return [
        "home-feed",
        user?.uid || "guest",
        `${history.length}-${subs.length}-${liked.length}-${feedAttempt}`,
      ];
    }
    if (feedKind === "trending") {
      return ["trending", feedAttempt];
    }
    return ["search", feedQuery, feedAttempt];
  }, [
    route.type,
    feedKind,
    feedQuery,
    feedAttempt,
    user?.uid,
    history.length,
    subs.length,
    liked.length,
  ]);

  const queryClient = useQueryClient();

  const {
    data: infiniteFeedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError: feedErr,
    refetch: refetchFeed,
  } = useInfiniteQuery({
    queryKey: feedQueryKey,
    enabled: isFeedMode && (feedKind !== "home" || signalsReady),
    initialPageParam: null as unknown,
    placeholderData: keepPreviousData,
    queryFn: async ({ pageParam }) => {
      if (route.type === "subs") {
        const items = await buildSubscriptionsFeed(subs);
        return { items, next: null, channels: [], playlists: [] };
      }

      if (feedKind === "home") {
        if (pageParam === null) {
          // Fast initial paint with trending
          const r = await trendingPaged();
          return { items: r.items, next: r.next, channels: [], playlists: [] };
        } else {
          if (feedReserve.current.length > 0) {
            const nextBatch = feedReserve.current.splice(0, 20);
            return {
              items: nextBatch,
              next: pageParam,
              channels: [],
              playlists: [],
            };
          }
          if (pageParam) {
            const r = await trendingPaged(pageParam);
            const ranked = rankIncoming(r.items);
            return { items: ranked, next: r.next, channels: [], playlists: [] };
          }
          return { items: [], next: null, channels: [], playlists: [] };
        }
      }

      if (feedKind === "trending") {
        const r = await trendingPaged(pageParam as string | null);
        return { items: r.items, next: r.next, channels: [], playlists: [] };
      }

      // search
      const r = await searchPaged(feedQuery, pageParam as string | null);
      return {
        items: r.items,
        next: r.next,
        channels: r.channels || [],
        playlists: r.playlists || [],
      };
    },
    getNextPageParam: (lastPage) => {
      if (feedKind === "home") {
        if (feedReserve.current.length > 0) {
          return lastPage.next ?? "has_reserve";
        }
        return lastPage.next ?? undefined;
      }
      return lastPage.next ?? undefined;
    },
  });

  // Progressive rendering for home feed: calculate candidates after initial fast paint
  useEffect(() => {
    if (!isFeedMode || feedKind !== "home" || !signalsReady) return;

    let cancelled = false;

    (async () => {
      try {
        const searches = JSON.parse(localStorage.getItem("yt.searches") || "[]");
        const getProgress = (): Record<string, number> => {
          try {
            return JSON.parse(localStorage.getItem("yt_progress_map") || "{}");
          } catch {
            return {};
          }
        };

        const r = await buildHomeFeed(subs, history, liked, {
          progress: getProgress(),
          searches,
          dismissed: getDismissed(),
        });

        if (cancelled) return;

        feedReserve.current = r.reserve || [];

        const currentScroll = window.scrollY || document.documentElement.scrollTop;

        type FeedPage = {
          items: PipedVideo[];
          next?: unknown;
          channels?: unknown[];
          playlists?: unknown[];
        };
        type InfiniteFeed = { pages: FeedPage[]; pageParams: unknown[] };

        queryClient.setQueryData(feedQueryKey, (old: InfiniteFeed | undefined) => {
          if (!old || !old.pages || old.pages.length === 0) return old;
          const newPages = [...old.pages];
          newPages[0] = {
            ...newPages[0],
            items: r.videos,
            next: r.next,
          };
          return { ...old, pages: newPages };
        });

        requestAnimationFrame(() => {
          window.scrollTo({ top: currentScroll, behavior: "instant" });
        });

        // Async AI re-ranking on unseen items
        if (r.videos && r.videos.length > 8) {
          const profile = buildTasteProfile({
            history,
            progress: getProgress(),
            likedIds: liked,
            subs,
            searches,
          });
          const reranked = await rerankUnseenWithAI(r, profile);

          if (cancelled) return;

          if (reranked && reranked.videos) {
            feedReserve.current = reranked.reserve || [];
            const scrollBeforeAI = window.scrollY || document.documentElement.scrollTop;

            queryClient.setQueryData(feedQueryKey, (old: InfiniteFeed | undefined) => {
              if (!old || !old.pages || old.pages.length === 0) return old;
              const newPages = [...old.pages];
              newPages[0] = {
                ...newPages[0],
                items: reranked.videos,
              };
              return { ...old, pages: newPages };
            });

            requestAnimationFrame(() => {
              window.scrollTo({ top: scrollBeforeAI, behavior: "instant" });
            });
          }
        }
      } catch {
        // Fallback to initial trending on error
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isFeedMode, feedKind, signalsReady, feedQueryKey, queryClient, subs, history, liked]);

  const feed = useMemo(() => {
    if (!isFeedMode) return null;
    if (feedKind === "home" && !signalsReady) return null;
    if (!infiniteFeedData) return null;
    const allItems: PipedVideo[] = [];
    const seen = new Set<string>();
    for (const page of infiniteFeedData.pages) {
      for (const v of page.items || []) {
        if (v?.url && !seen.has(v.url)) {
          seen.add(v.url);
          allItems.push(v);
        }
      }
    }
    return allItems;
  }, [isFeedMode, feedKind, signalsReady, infiniteFeedData]);

  const channels = useMemo(() => {
    return infiniteFeedData?.pages[0]?.channels || [];
  }, [infiniteFeedData]);

  const playlists = useMemo(() => {
    return infiniteFeedData?.pages[0]?.playlists || [];
  }, [infiniteFeedData]);

  const loadingMore = isFetchingNextPage;
  const hasMore = !!hasNextPage;

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
  }, [hasMore, isFeedMode, loadMore]);

  const toggleLater = (id: string, video?: PipedVideo) => {
    if (video) {
      setMeta(id, {
        title: video.title,
        uploaderName: video.uploaderName,
        thumbnail: video.thumbnail,
        duration: video.duration,
      });
    }
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
      if (q.trim()) {
        const prev: string[] = JSON.parse(localStorage.getItem("yt.searches") || "[]");
        const next = [q.trim(), ...prev.filter((x) => x !== q.trim())].slice(0, 50);
        localStorage.setItem("yt.searches", JSON.stringify(next));
        void routerNav({ to: "/search", search: { q: q.trim() } });
      } else {
        if (pathname !== "/") void routerNav({ to: "/" });
      }
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
    appStore.setSearchQ("");
    appStore.setSearchFilter("All");
    setChip("All");
    setRoute({ type: "home" });
    setActiveNav("home");
    if (pathname !== "/") void routerNav({ to: "/" });
    window.scrollTo({ top: 0 });
  };

  const [topRecommendedVideo, setTopRecommendedVideo] = useState<PipedVideo | null>(null);
  const [autoplayCountdown, setAutoplayCountdown] = useState<{
    nextVideo: PipedVideo;
    secondsLeft: number;
    fromQueue: boolean;
  } | null>(null);
  const countdownTimerRef = useRef<number | null>(null);

  const openVideo = useCallback(
    (v: PipedVideo, forceWatch = false) => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      setAutoplayCountdown(null);

      const id = videoIdFromUrl(v.url);
      if (!id) return;

      if (!forceWatch && isShortsVideo(v)) {
        const idx = shortsItems.findIndex((s) => videoIdFromUrl(s.url) === id);
        if (idx !== -1) {
          setShorts({ items: shortsItems, index: idx });
        } else {
          setShorts({ items: [v], index: 0 });
        }
        return;
      }

      setShorts(null);
      appStore.setMiniplayer(null);
      setRoute({ type: "watch", video: v });

      if (id !== urlVideoId) {
        void routerNav({ to: "/watch", search: { v: id } });
      }
      window.scrollTo({ top: 0 });
    },
    [shortsItems, urlVideoId, routerNav],
  );

  const cancelAutoplay = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setAutoplayCountdown(null);
  };

  const playAutoplayNow = () => {
    if (!autoplayCountdown) return;
    const { nextVideo, fromQueue } = autoplayCountdown;
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setAutoplayCountdown(null);
    if (fromQueue) {
      appStore.advanceQueue();
    }
    openVideo(nextVideo);
  };

  const handleVideoEnded = useCallback(() => {
    const storeState = appStore.getSnapshot();
    if (!storeState.autoplayNext) return;

    let nextVid: PipedVideo | null = null;
    let fromQueue = false;

    if (
      storeState.queue &&
      storeState.queue.length > 0 &&
      storeState.queueIndex + 1 < storeState.queue.length
    ) {
      nextVid = storeState.queue[storeState.queueIndex + 1];
      fromQueue = true;
    } else if (topRecommendedVideo) {
      nextVid = topRecommendedVideo;
      fromQueue = false;
    }

    if (!nextVid) return;

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    setAutoplayCountdown({
      nextVideo: nextVid,
      secondsLeft: 5,
      fromQueue,
    });

    countdownTimerRef.current = window.setInterval(() => {
      setAutoplayCountdown((prev) => {
        if (!prev) {
          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
          return null;
        }
        if (prev.secondsLeft <= 1) {
          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
          setTimeout(() => {
            if (prev.fromQueue) {
              appStore.advanceQueue();
            }
            openVideo(prev.nextVideo);
          }, 50);
          return null;
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);
  }, [topRecommendedVideo, openVideo]);

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
    void routerNav({ to: "/channel", search: { id } });
    window.scrollTo({ top: 0 });
  };

  const openPlaylist = (id: string) => {
    if (!id) return;
    setRoute({ type: "playlist", id });
    setActiveNav("");
    void routerNav({ to: "/playlist", search: { id } });
    window.scrollTo({ top: 0 });
  };

  // cross-component events (header notifications, playlist links)
  useEffect(() => {
    const onOpen = (e: Event) => openVideo((e as CustomEvent<PipedVideo>).detail);
    const onNav = (e: Event) => navigate((e as CustomEvent<LibraryKey>).detail);
    const onAddToPlaylist = (e: Event) => {
      setPlaylistTargetVideo((e as CustomEvent<PipedVideo>).detail);
      setPlaylistDialogOpen(true);
    };
    window.addEventListener("yt:open", onOpen);
    window.addEventListener("yt:nav", onNav);
    window.addEventListener("yt:add-to-playlist", onAddToPlaylist);
    const onPlaylistUpdate = () => {
      getCustomPlaylists()
        .then(setCustomPlaylists)
        .catch(() => {});
    };
    window.addEventListener("yt:playlists-updated", onPlaylistUpdate);
    return () => {
      window.removeEventListener("yt:open", onOpen);
      window.removeEventListener("yt:nav", onNav);
      window.removeEventListener("yt:add-to-playlist", onAddToPlaylist);
      window.removeEventListener("yt:playlists-updated", onPlaylistUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = (label: string) => {
    if (label.startsWith("playlist:")) {
      openPlaylist(label.slice(9));
      return;
    }
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

    if (label === "home" || label === t("home") || label === "الرئيسية" || label === "Home") {
      goHome();
      return;
    } else if (label === "Shorts" || label === t("shorts")) {
      setSearchQ("");
      void routerNav({ to: "/shorts" });
      setRoute({ type: "home" });
      setChip("All");
      if (shortsItems.length > 0) {
        setShorts({ items: shortsItems, index: 0 });
      } else {
        requestAnimationFrame(() =>
          document.getElementById("shorts-shelf")?.scrollIntoView({ behavior: "smooth" }),
        );
      }
    } else if (label === "subscriptions" || label === t("subscriptions")) {
      setSearchQ("");
      void routerNav({ to: "/subscriptions" });
      setRoute({ type: "subs" });
      window.scrollTo({ top: 0 });
    } else if (
      label === "policies" ||
      label === "الحقوق والسياسات" ||
      label === "Terms & Policies" ||
      label === t("terms")
    ) {
      setSearchQ("");
      void routerNav({ to: "/policies" });
      setRoute({ type: "policies" });
      window.scrollTo({ top: 0 });
    } else if ((LIBRARY_KEYS as string[]).includes(label)) {
      setSearchQ("");
      void routerNav({ to: "/library", search: { k: label } });
      setRoute({ type: "library", key: label as LibraryKey });
      window.scrollTo({ top: 0 });
    } else {
      if (pathname !== "/") void routerNav({ to: "/" });
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

    const dismissed = getDismissed();
    const unhidden = feed.filter((v) => {
      const vid = videoIdFromUrl(v.url);
      const chId = channelIdFromUrl(v.uploaderUrl || "");
      if (hidden.includes(vid)) return false;
      if (dismissed.videoIds.includes(vid)) return false;
      if (chId && dismissed.channelIds.includes(chId)) return false;
      return true;
    });

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
        list = list.filter((v) => isShortsVideo(v));
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
        list = list.filter((v) => isStandardVideo(v));
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
        list = list.filter((v) => isLiveStream(v));
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
    () => (feed || []).filter((v) => isShortsVideo(v)).slice(0, 10),
    [feed],
  );
  const showShorts =
    route.type === "home" &&
    (chip === "All" || chip === "الكل") &&
    !isSearchActive &&
    shortsItems.length > 0;
  const inWatch = route.type === "watch";

  const handleDismissVideo = async (videoId: string) => {
    setHidden((h) => [...h, videoId]);
    await dismissVideo(videoId);
    notify(
      {
        message: isAr ? "تم إخفاء الفيديو" : "Video hidden",
        actionLabel: isAr ? "تراجع" : "Undo",
        onAction: async () => {
          setHidden((h) => h.filter((x) => x !== videoId));
          await undoDismiss(videoId);
          setFeedAttempt((a) => a + 1);
        },
      },
      6000,
    );
  };

  const handleDismissChannel = async (channelId: string) => {
    const videoIdsFromChannel = (feed || [])
      .filter((v) => channelIdFromUrl(v.uploaderUrl || "") === channelId)
      .map((v) => videoIdFromUrl(v.url))
      .filter(Boolean);

    setHidden((h) => [...h, ...videoIdsFromChannel]);
    await dismissChannel(channelId);
    notify(
      {
        message: isAr ? "عدم اقتراح القناة" : "Won't recommend channel",
        actionLabel: isAr ? "تراجع" : "Undo",
        onAction: async () => {
          setHidden((h) => h.filter((x) => !videoIdsFromChannel.includes(x)));
          await undoDismiss(channelId);
          setFeedAttempt((a) => a + 1);
        },
      },
      6000,
    );
  };

  const cardProps = (v: PipedVideo, i: number) => {
    const id = videoIdFromUrl(v.url);
    const channelId = channelIdFromUrl(v.uploaderUrl || "");
    return {
      video: v,
      onOpen: openVideo,
      index: i,
      notify,
      onChannel: openChannel,
      saved: watchLater.includes(id),
      onSaveLater: () => toggleLater(id, v),
      onDismiss: (vid: string) => handleDismissVideo(vid),
      onDismissChannel: channelId ? (chId: string) => handleDismissChannel(chId) : undefined,
      onAddToPlaylist: () => {
        setPlaylistTargetVideo(v);
        setPlaylistDialogOpen(true);
      },
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

  const [playerBounds, setPlayerBounds] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
    position: "absolute" | "fixed";
    visible: boolean;
  }>({ top: 0, left: 0, width: 0, height: 0, position: "fixed", visible: false });

  const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

  // Update player bounds based on active slot
  useIsomorphicLayoutEffect(() => {
    let ro: ResizeObserver | null = null;

    const update = () => {
      let targetId = "";
      if (route.type === "watch") targetId = "watch-player-slot";
      else if (miniplayer) targetId = "miniplayer-player-slot";

      if (!targetId) {
        setPlayerBounds((b) => (b.visible ? { ...b, visible: false } : b));
        return;
      }

      const el = document.getElementById(targetId);
      const rootEl = document.getElementById("app-root");
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const isWatch = route.type === "watch";
          const rootRect = rootEl ? rootEl.getBoundingClientRect() : { top: 0, left: 0 };
          const newTop = isWatch ? rect.top - rootRect.top : rect.top;
          const newLeft = isWatch ? rect.left - rootRect.left : rect.left;
          const newPos: "absolute" | "fixed" = isWatch ? "absolute" : "fixed";

          setPlayerBounds((prev) => {
            if (
              prev.visible &&
              prev.position === newPos &&
              Math.abs(prev.top - newTop) < 1 &&
              Math.abs(prev.left - newLeft) < 1 &&
              Math.abs(prev.width - rect.width) < 1 &&
              Math.abs(prev.height - rect.height) < 1
            ) {
              return prev;
            }
            return {
              top: newTop,
              left: newLeft,
              width: rect.width,
              height: rect.height,
              position: newPos,
              visible: true,
            };
          });
        }
      }
      // If el is not found yet in this microtask but targetId is set, do not turn visible false,
      // as that would flash opacity 0 during the slot switch.
    };

    update();
    const animId = requestAnimationFrame(update);
    const t1 = setTimeout(update, 100);
    const t2 = setTimeout(update, 350);

    const targetId =
      route.type === "watch" ? "watch-player-slot" : miniplayer ? "miniplayer-player-slot" : "";
    const el = targetId ? document.getElementById(targetId) : null;
    if (el && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => update());
      ro.observe(el);
    }

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("yt:player-slot-move", update);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(t1);
      clearTimeout(t2);
      if (ro) ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
      window.removeEventListener("yt:player-slot-move", update);
    };
  }, [route, miniplayer]);

  const activeVideo = route.type === "watch" ? route.video : miniplayer?.video;
  const activeVideoId = activeVideo ? videoIdFromUrl(activeVideo.url) : "";

  return (
    <div id="app-root" className="min-h-screen bg-yt-bg text-yt-text relative">
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
        customPlaylists={customPlaylists}
        onNavigate={navigate}
        onHome={goHome}
        mobileOpen={drawer}
        onCloseMobile={() => setDrawer(false)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main
        style={{
          transform: mainDragY > 0 ? `translate3d(0, ${mainDragY}px, 0)` : "none",
          transition: mainDragY > 0 ? "none" : "transform 0.2s ease-out",
        }}
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
            onToggleSave={() => toggleLater(videoIdFromUrl(route.video.url), route.video)}
            onAddToPlaylist={(v) => {
              setPlaylistTargetVideo(v);
              setPlaylistDialogOpen(true);
            }}
            isSubscribed={(cid) => subs.some((s) => s.channel_id === cid)}
            onToggleSub={(m) => doToggleSub(m)}
            onMinimize={minimizeVideo}
            startTime={appStore.getPlaybackTime(videoIdFromUrl(route.video.url))}
            onTopRecommendedChange={setTopRecommendedVideo}
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
            onAddToPlaylist={(v) => {
              setPlaylistTargetVideo(v);
              setPlaylistDialogOpen(true);
            }}
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
                void syncWatchLaterToCloud(id, false);
                return next;
              });
            }}
            onClearHistory={() => {
              setHistory([]);
              clearHistory();
            }}
            isSaved={(id) => watchLater.includes(id)}
            onSaveLater={toggleLater}
            onAddToPlaylist={(v) => {
              setPlaylistTargetVideo(v);
              setPlaylistDialogOpen(true);
            }}
          />
        )}

        {route.type === "policies" && <PoliciesPage onBackToHome={goHome} />}

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

            {!isSearchActive && route.type === "home" && subs.length === 0 && <YouTubeSyncBanner />}

            {feedErr ? (
              <ErrorState onRetry={() => void refetchFeed()} />
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
        notify={notify}
        onOpenPolicies={() => navigate("policies")}
        onHistoryCleared={() => {
          setHistory([]);
          clearHistory();
        }}
      />

      {/* Playlist Dialog */}
      <PlaylistDialog
        open={playlistDialogOpen}
        onClose={() => setPlaylistDialogOpen(false)}
        video={playlistTargetVideo}
        notify={notify}
      />

      {/* Shorts full-screen viewer */}
      {shorts && (
        <ShortsViewer
          items={shorts.items}
          initialIndex={shorts.index}
          onClose={() => setShorts(null)}
          onOpenWatch={(v) => openVideo(v, true)}
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
            if (id) {
              appStore.setPlaybackTime(id, t);
              savePlaybackProgress(id, t);
            }
          }}
        />
      )}

      {/* Global Persistent Player */}
      {activeVideoId && (
        <div
          id="persistent-player"
          style={{
            position: playerBounds.position,
            top: playerBounds.top,
            left: playerBounds.left,
            width: playerBounds.width,
            height: playerBounds.height,
            zIndex: playerBounds.visible ? (route.type === "watch" ? 20 : 50) : -1,
            pointerEvents: playerBounds.visible ? "auto" : "none",
            opacity: playerBounds.visible ? 1 : 0,
            transition: mainDragY > 0 ? "none" : "opacity 0.2s ease-out, transform 0.2s ease-out",
            transform:
              route.type === "watch" && mainDragY > 0
                ? `translate3d(0, ${mainDragY}px, 0) scale(${1 - mainDragY * 0.0015})`
                : "none",
            backgroundColor: "black",
            overflow: "hidden",
          }}
          className={route.type === "watch" ? "lg:rounded-xl" : "rounded-t-xl overflow-hidden"}
        >
          <YouTubePlayer
            videoId={activeVideoId}
            autoplay
            title={activeVideo?.title}
            startTime={appStore.getPlaybackTime(activeVideoId)}
            onTimeUpdate={(t) => {
              appStore.setPlaybackTime(activeVideoId, t);
              savePlaybackProgress(activeVideoId, t);
            }}
            onEnded={handleVideoEnded}
          />

          {autoplayCountdown && (
            <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 text-white text-center animate-in fade-in duration-200 select-none">
              <div className="text-xs font-bold uppercase tracking-wider text-yt-sub mb-1">
                {isAr ? "الفيديو التالي خلال" : "Up Next in"}
              </div>
              <div className="text-4xl font-extrabold text-yt-blue font-mono mb-3">
                {autoplayCountdown.secondsLeft}
              </div>
              <div className="flex items-center gap-3 max-w-sm w-full bg-yt-surface/80 p-2.5 rounded-xl border border-yt-border/50 text-start mb-4 shadow-lg">
                <img
                  src={
                    autoplayCountdown.nextVideo.thumbnail ||
                    `https://i.ytimg.com/vi/${videoIdFromUrl(autoplayCountdown.nextVideo.url)}/mqdefault.jpg`
                  }
                  alt={autoplayCountdown.nextVideo.title}
                  className="w-20 aspect-video rounded object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold line-clamp-2 leading-snug">
                    {autoplayCountdown.nextVideo.title}
                  </p>
                  <p className="text-[11px] text-yt-sub mt-0.5 truncate">
                    {autoplayCountdown.nextVideo.uploaderName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={cancelAutoplay}
                  className="px-4 py-2 rounded-full bg-yt-surface hover:bg-yt-hover text-xs font-bold transition-all active:scale-95 cursor-pointer"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  onClick={playAutoplayNow}
                  className="px-5 py-2 rounded-full bg-yt-blue text-black hover:bg-opacity-90 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-lg shadow-yt-blue/20 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isAr ? "تشغيل الآن" : "Play now"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Floating Notification Toast */}
      {toast && (
        <div className="fixed bottom-16 md:bottom-6 start-1/2 -translate-x-1/2 z-[70] bg-yt-raised border border-yt-border px-5 py-2.5 rounded-full shadow-2xl shadow-black text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span>{typeof toast === "string" ? toast : toast.message}</span>
          {typeof toast !== "string" && toast.actionLabel && toast.onAction && (
            <button
              onClick={() => {
                toast.onAction?.();
                setToast(null);
                if (toastTimer.current) window.clearTimeout(toastTimer.current);
              }}
              className="text-yt-red hover:text-red-400 font-bold ms-2 focus:outline-none transition-colors"
            >
              {toast.actionLabel}
            </button>
          )}
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
