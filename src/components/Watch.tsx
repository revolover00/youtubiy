import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  ListVideo,
  MoreHorizontal,
  BadgeCheck,
  CornerDownLeft,
  Loader2,
  PictureInPicture2,
  X,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Trash2,
  Play,
} from "lucide-react";
import { getCommentsPage, getStreams, searchPaged } from "../lib/api";
import { appStore, useAppStore } from "../lib/appStore";
import {
  channelIdFromUrl,
  cleanDateText,
  fmtDuration,
  fmtViews,
  isLiveStream,
  isShortsVideo,
  parseChapters,
  seekTo,
  timeAgo,
  videoIdFromUrl,
} from "../lib/format";

export function TextWithTimestamps({ text }: { text?: string }) {
  if (!text) return null;

  // Match timestamps like 0:00, 12:34, 1:23:45, ٠:٠٠ etc.
  const regex = /(?:[0-9٠-٩]{1,2}:)?[0-9٠-٩]{1,2}:[0-9٠-٩]{2}/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const rawTs = match[0];
    const matchIndex = match.index;

    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex));
    }

    const norm = rawTs.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
    const nums = norm.split(":").map(Number);
    let seconds: number | null = null;
    if (nums.length === 2 && !isNaN(nums[0]) && !isNaN(nums[1]) && nums[1] < 60) {
      seconds = nums[0] * 60 + nums[1];
    } else if (
      nums.length === 3 &&
      !isNaN(nums[0]) &&
      !isNaN(nums[1]) &&
      !isNaN(nums[2]) &&
      nums[1] < 60 &&
      nums[2] < 60
    ) {
      seconds = nums[0] * 3600 + nums[1] * 60 + nums[2];
    }

    if (seconds !== null) {
      const s = seconds;
      parts.push(
        <button
          key={`${matchIndex}-${rawTs}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            seekTo(s);
          }}
          className="text-yt-blue hover:underline font-mono px-1 py-0.5 rounded bg-yt-blue/10 hover:bg-yt-blue/20 transition-colors inline-flex items-center gap-0.5 cursor-pointer text-xs sm:text-sm font-semibold select-none me-0.5"
        >
          {rawTs}
        </button>,
      );
    } else {
      parts.push(rawTs);
    }

    lastIndex = matchIndex + rawTs.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}
import { addHistory, setMeta } from "../lib/store";
import type { PipedComment, PipedVideo, StreamData } from "../lib/types";
import { Avatar, ErrorState, VideoCard } from "./Feed";
import { ShortsIcon } from "./icons";
import { useLanguage } from "../lib/i18n";

interface Props {
  video: PipedVideo;
  onOpen: (v: PipedVideo) => void;
  onChannel: (channelId: string, name: string) => void;
  notify: (m: string) => void;
  liked: boolean;
  onToggleLike: () => void;
  saved: boolean;
  onToggleSave: () => void;
  onAddToPlaylist: (v: PipedVideo) => void;
  isSubscribed: (channelId: string) => boolean;
  onToggleSub: (meta: { channelId: string; name: string; avatar?: string }) => void;
  onMinimize?: () => void;
  startTime?: number;
  onTimeUpdate?: (time: number) => void;
  onTopRecommendedChange?: (v: PipedVideo | null) => void;
}

function QueuePanel({ onOpen }: { onOpen: (v: PipedVideo) => void }) {
  const { isAr } = useLanguage();
  const { queue, queueIndex } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);

  if (!queue || queue.length === 0) return null;

  const moveUp = (idx: number) => {
    if (idx <= 0) return;
    const newQueue = [...queue];
    const temp = newQueue[idx];
    newQueue[idx] = newQueue[idx - 1];
    newQueue[idx - 1] = temp;
    let newIndex = queueIndex;
    if (queueIndex === idx) newIndex = idx - 1;
    else if (queueIndex === idx - 1) newIndex = idx;
    appStore.reorderQueue(newQueue, newIndex);
  };

  const moveDown = (idx: number) => {
    if (idx >= queue.length - 1) return;
    const newQueue = [...queue];
    const temp = newQueue[idx];
    newQueue[idx] = newQueue[idx + 1];
    newQueue[idx + 1] = temp;
    let newIndex = queueIndex;
    if (queueIndex === idx) newIndex = idx + 1;
    else if (queueIndex === idx + 1) newIndex = idx;
    appStore.reorderQueue(newQueue, newIndex);
  };

  return (
    <div className="mb-4 rounded-xl border border-yt-border bg-yt-raised shadow-md overflow-hidden animate-in fade-in duration-200">
      {/* Queue Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-yt-surface/80 border-b border-yt-border/60">
        <div className="flex items-center gap-2">
          <ListVideo className="w-4 h-4 text-yt-blue shrink-0" />
          <h3 className="text-xs sm:text-sm font-bold text-yt-text">
            {isAr ? "التالي في الطابور" : "Next in queue"}
          </h3>
          <span className="text-[11px] text-yt-sub px-2 py-0.5 rounded-full bg-yt-bg font-semibold tabular-nums">
            {queue.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => appStore.clearQueue()}
            className="text-xs text-yt-sub hover:text-yt-red px-2 py-1 rounded hover:bg-yt-bg transition-colors flex items-center gap-1 font-medium cursor-pointer"
            title={isAr ? "مسح الطابور" : "Clear queue"}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? "مسح" : "Clear"}</span>
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-yt-sub hover:text-yt-text rounded hover:bg-yt-bg transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Queue Items List */}
      {!collapsed && (
        <div className="max-h-64 overflow-y-auto divide-y divide-yt-border/20 p-1">
          {queue.map((item, idx) => {
            const isPlaying = idx === queueIndex;
            const id = videoIdFromUrl(item.url);
            return (
              <div
                key={`${id}-${idx}`}
                className={`group flex items-center gap-2 p-1.5 rounded-lg transition-colors ${
                  isPlaying ? "bg-yt-blue/15 border border-yt-blue/30" : "hover:bg-yt-surface/60"
                }`}
              >
                {/* Index / Playing icon */}
                <div className="w-5 text-center text-xs font-mono text-yt-sub shrink-0">
                  {isPlaying ? (
                    <Play className="w-3.5 h-3.5 text-yt-blue fill-yt-blue mx-auto animate-pulse" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Thumbnail & Video Info */}
                <div
                  onClick={() => {
                    appStore.setQueueIndex(idx);
                    onOpen(item);
                  }}
                  className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                >
                  <div className="relative w-16 aspect-video rounded overflow-hidden bg-black shrink-0">
                    <img
                      src={item.thumbnail || `https://i.ytimg.com/vi/${id}/mqdefault.jpg`}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.duration > 0 && (
                      <span className="absolute bottom-0.5 end-0.5 text-[9px] bg-black/80 px-1 rounded text-white font-mono">
                        {fmtDuration(item.duration)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-medium line-clamp-1 ${
                        isPlaying ? "text-yt-blue font-bold" : "text-yt-text"
                      }`}
                    >
                      {item.title}
                    </p>
                    <p className="text-[11px] text-yt-sub truncate">{item.uploaderName}</p>
                  </div>
                </div>

                {/* Reorder Up/Down & Remove actions */}
                <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 shrink-0">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveUp(idx)}
                    className="p-1 text-yt-sub hover:text-yt-text disabled:opacity-20 hover:bg-yt-bg rounded cursor-pointer"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === queue.length - 1}
                    onClick={() => moveDown(idx)}
                    className="p-1 text-yt-sub hover:text-yt-text disabled:opacity-20 hover:bg-yt-bg rounded cursor-pointer"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => appStore.removeFromQueue(idx)}
                    className="p-1 text-yt-sub hover:text-yt-red hover:bg-yt-bg rounded cursor-pointer"
                    title={isAr ? "إزالة من الطابور" : "Remove from queue"}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Watch({
  video,
  onOpen,
  onChannel,
  notify,
  liked,
  onToggleLike,
  onAddToPlaylist,
  isSubscribed,
  onToggleSub,
  onMinimize,
  onTopRecommendedChange,
}: Props) {
  const { t, isAr, lang } = useLanguage();
  const { playbackTimes } = useAppStore();
  const id = videoIdFromUrl(video.url);
  const currentTime = playbackTimes[id] || 0;
  const [attempt, setAttempt] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [mobileCommentsOpen, setMobileCommentsOpen] = useState(false);
  const [showInlineComments, setShowInlineComments] = useState(false);
  const [chaptersCollapsed, setChaptersCollapsed] = useState(false);

  // Comments state & pagination
  const [commentsList, setCommentsList] = useState<PipedComment[]>([]);
  const [commentsCont, setCommentsCont] = useState<string | undefined>(undefined);
  const [loadingComments, setLoadingComments] = useState(false);
  const loadMoreCommentsRef = useRef<HTMLDivElement>(null);
  const mobileCommentsScrollRef = useRef<HTMLDivElement>(null);

  // Infinite Suggested Videos state
  const [relatedStreams, setRelatedStreams] = useState<PipedVideo[]>([]);
  const [relatedCont, setRelatedCont] = useState<unknown | null>(null);
  const [loadingMoreRelated, setLoadingMoreRelated] = useState(false);
  const [relatedQueryIndex, setRelatedQueryIndex] = useState(0);
  const loadMoreRelatedRef = useRef<HTMLDivElement>(null);

  const playerContainerRef = useRef<HTMLDivElement>(null);

  const labels = useMemo(
    () => ({
      all: isAr ? "الكل" : "All",
      fromChannel: isAr ? "من القناة" : "From channel",
      shorts: isAr ? "قصيرة" : "Shorts",
    }),
    [isAr],
  );

  const [relFilter, setRelFilter] = useState<string>(labels.all);

  useEffect(() => {
    setRelFilter(labels.all);
  }, [labels.all]);

  // Initial video details fetch via React Query
  const {
    data,
    isPending: loading,
    isError: error,
    refetch,
  } = useQuery({
    queryKey: ["video", id, attempt],
    queryFn: () => getStreams(id),
    placeholderData: keepPreviousData,
    enabled: !!id,
  });

  const chapters = useMemo(() => parseChapters(data?.description || ""), [data?.description]);

  const activeChapterIndex = useMemo(() => {
    if (!chapters || chapters.length === 0) return -1;
    let active = -1;
    for (let i = 0; i < chapters.length; i++) {
      if (currentTime >= chapters[i].start) {
        active = i;
      } else {
        break;
      }
    }
    return active;
  }, [chapters, currentTime]);

  useEffect(() => {
    if (data) {
      setCommentsList(data.comments || []);
      setCommentsCont(data.commentsContinuation);
      setRelatedStreams(data.relatedStreams || []);

      setMeta(id, {
        title: data.title,
        thumbnail: video.thumbnail,
        uploaderName: data.uploader,
        uploaderAvatar: data.uploaderAvatar,
        duration: video.duration,
      });
    } else {
      setCommentsList([]);
      setCommentsCont(undefined);
      setRelatedStreams([]);
      setRelatedCont(null);
      setRelatedQueryIndex(0);
    }
  }, [data, id, video.thumbnail, video.duration]);

  // Filtered related videos
  const related = useMemo(() => {
    const list = relatedStreams.filter((r) => r.url?.includes("/watch"));
    if (relFilter === labels.fromChannel) {
      const f = list.filter((r) => r.uploaderName === (data?.uploader || video.uploaderName));
      if (f.length) return f;
    }
    if (relFilter === labels.shorts) {
      const f = list.filter((r) => r.duration > 0 && r.duration <= 60);
      if (f.length) return f;
    }
    return list;
  }, [relatedStreams, relFilter, data?.uploader, video.uploaderName, labels]);

  useEffect(() => {
    if (related && related.length > 0) {
      onTopRecommendedChange?.(related[0]);
    } else {
      onTopRecommendedChange?.(null);
    }
  }, [related, onTopRecommendedChange]);

  // Endless suggested videos pagination
  const loadMoreRelated = useCallback(async () => {
    if (loadingMoreRelated || !data) return;
    setLoadingMoreRelated(true);

    try {
      const queries = [
        data.title,
        `${data.uploader} ${data.title.split(" ").slice(0, 3).join(" ")}`,
        data.uploader,
        data.title
          .split(" ")
          .filter((w) => w.length > 3)
          .slice(0, 3)
          .join(" "),
      ].filter(Boolean);

      const currentQuery = queries[relatedQueryIndex % queries.length] || data.title;
      const res = await searchPaged(currentQuery, relatedCont || undefined);

      if (res.items && res.items.length > 0) {
        setRelatedStreams((prev) => {
          const seenUrls = new Set(prev.map((v) => v.url));
          seenUrls.add(video.url);
          seenUrls.add(`/watch?v=${id}`);
          const newVids = res.items.filter(
            (v) => !seenUrls.has(v.url) && v.url?.includes("/watch"),
          );
          return [...prev, ...newVids];
        });
      }

      if (res.next) {
        setRelatedCont(res.next);
      } else {
        setRelatedQueryIndex((q) => q + 1);
        setRelatedCont(null);
      }
    } catch {
      setRelatedQueryIndex((q) => q + 1);
      setRelatedCont(null);
    } finally {
      setLoadingMoreRelated(false);
    }
  }, [loadingMoreRelated, data, relatedCont, relatedQueryIndex, video.url, id]);

  // IntersectionObserver for infinite scrolling suggested videos
  useEffect(() => {
    const el = loadMoreRelatedRef.current;
    if (!el || !data) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMoreRelated) {
          void loadMoreRelated();
        }
      },
      { rootMargin: "500px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMoreRelated, loadingMoreRelated, data]);

  // Comments pagination handler
  const loadMoreComments = useCallback(async () => {
    if (loadingComments || !commentsCont) return;
    setLoadingComments(true);
    try {
      const res = await getCommentsPage(commentsCont);
      if (res.items && res.items.length > 0) {
        setCommentsList((prev) => [...prev, ...res.items]);
      }
      setCommentsCont(res.nextContinuation);
    } catch {
      // Ignore transient pagination error
    } finally {
      setLoadingComments(false);
    }
  }, [loadingComments, commentsCont]);

  // Desktop IntersectionObserver for auto loading comments as user scrolls down comments
  useEffect(() => {
    const el = loadMoreCommentsRef.current;
    if (!el || !commentsCont) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingComments) {
          void loadMoreComments();
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMoreComments, loadingComments, commentsCont]);

  useEffect(() => {
    if (data) {
      const row = {
        video_id: id,
        channel_id: channelIdFromUrl(data.uploaderUrl),
        category: data.category,
        title: data.title,
        duration: video.duration,
        channel_name: data.uploader,
        watched_at: new Date().toISOString(),
      };
      addHistory(row);
      window.dispatchEvent(new CustomEvent("yt:history", { detail: row }));
    }
  }, [id, data, video.duration]);

  // Keyboard shortcut 'i' for miniplayer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement).tagName === "INPUT" ||
        (e.target as HTMLElement).tagName === "TEXTAREA"
      )
        return;
      if (e.key === "i" || e.key === "I") {
        e.preventDefault();
        onMinimize?.();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onMinimize]);

  // Reset mobile comments drawer when video changes
  useEffect(() => {
    setMobileCommentsOpen(false);
  }, [id]);

  // Lock body scroll when mobile comments are open
  useEffect(() => {
    if (mobileCommentsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileCommentsOpen]);

  // Close mobile comments on Escape
  useEffect(() => {
    if (!mobileCommentsOpen) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileCommentsOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [mobileCommentsOpen]);

  if (error) {
    return (
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 pt-6">
        <ErrorState onRetry={() => void refetch()} message={t("watchError")} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 pt-4 lg:pt-6 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="relative aspect-video rounded-none lg:rounded-xl overflow-hidden bg-black group">
            <div id="watch-player-slot" className="w-full h-full" />
          </div>
          <div className="h-6 w-2/3 bg-yt-surface rounded mt-4 animate-pulse" />
          <div className="h-4 w-1/3 bg-yt-surface rounded mt-3 animate-pulse" />
        </div>
      </div>
    );
  }

  const channelId = channelIdFromUrl(data.uploaderUrl);
  const cleanUploadDate = cleanDateText(data.uploadDate);
  const displayRelativeDate =
    data.relativeDate || timeAgo(video?.uploaded, data.uploadDate || video?.uploadedDate, lang);

  const totalCommentsCount = data.commentCount || commentsList.length || 0;
  const formattedCommentsCount =
    totalCommentsCount > 0 ? fmtViews(totalCommentsCount, lang) : isAr ? "٠" : "0";

  return (
    <div className="max-w-[1720px] mx-auto px-3 sm:px-6 pt-4 lg:pt-6 flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">
        {/* Native player slot */}
        <div
          ref={playerContainerRef}
          className="relative aspect-video rounded-none lg:rounded-xl overflow-hidden bg-black shadow-lg"
        >
          <div id="watch-player-slot" className="w-full h-full" />
        </div>

        {/* Video Title & Actions */}
        <h1 className="font-display font-bold text-lg sm:text-xl mt-3 leading-snug">
          {data.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 mt-3">
          <div className="flex items-center gap-3 me-auto">
            <button
              onClick={() => onChannel(channelId, data.uploader)}
              className="transition-transform hover:scale-105"
              aria-label={data.uploader}
            >
              <Avatar src={data.uploaderAvatar} name={data.uploader} size="w-10 h-10 text-base" />
            </button>
            <button
              onClick={() => onChannel(channelId, data.uploader)}
              className="leading-tight text-start"
            >
              <div className="flex items-center gap-1 font-bold text-[15px]">
                {data.uploader}
                {data.uploaderVerified && <BadgeCheck className="w-4 h-4 text-yt-sub" />}
              </div>
              <div className="text-xs text-yt-sub">
                {fmtViews(data.uploaderSubscriberCount, lang)} {t("subscribers")}
              </div>
            </button>
            <button
              onClick={() =>
                onToggleSub({ channelId, name: data.uploader, avatar: data.uploaderAvatar })
              }
              className={`ms-2 h-9 px-4 rounded-full text-sm font-bold transition-all active:scale-95 ${
                isSubscribed(channelId)
                  ? "bg-yt-surface text-yt-text"
                  : "bg-yt-text text-yt-bg hover:bg-white/80"
              }`}
            >
              {isSubscribed(channelId) ? t("subscribed") : t("subscribe")}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-yt-surface rounded-full overflow-hidden">
              <button
                onClick={() => {
                  onToggleLike();
                  setDisliked(false);
                }}
                className={`flex items-center gap-2 h-9 ps-4 pe-3 text-sm font-medium hover:bg-yt-hover transition-colors ${
                  liked ? "text-yt-blue" : ""
                }`}
              >
                <ThumbsUp className={`w-5 h-5 ${liked ? "fill-current pop" : ""}`} />
                <span className="tabular-nums">
                  {data.likes > 0
                    ? fmtViews(data.likes + (liked ? 1 : 0), lang)
                    : liked
                      ? "1"
                      : isAr
                        ? "٠"
                        : "0"}
                </span>
              </button>
              <span className="w-px h-5 bg-yt-hover" />
              <button
                onClick={() => {
                  setDisliked((d) => !d);
                  if (liked) onToggleLike();
                }}
                className={`h-9 px-3.5 hover:bg-yt-hover transition-colors ${
                  disliked ? "text-yt-blue" : ""
                }`}
                aria-label={t("dislike")}
              >
                <ThumbsDown className={`w-5 h-5 ${disliked ? "fill-current pop" : ""}`} />
              </button>
            </div>
            <button
              onClick={() => notify(t("linkCopied"))}
              className="flex items-center gap-2 h-9 px-3.5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium"
            >
              <Share2 className="w-5 h-5" /> {t("share")}
            </button>
            <button
              onClick={() => onAddToPlaylist(video)}
              className="flex items-center gap-2 h-9 px-3.5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium"
            >
              <ListVideo className="w-5 h-5" />
              <span className="hidden sm:inline">{t("save")}</span>
            </button>
            {onMinimize && (
              <button
                onClick={onMinimize}
                className="flex items-center gap-2 h-9 px-3.5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium"
                title={isAr ? "تصغير الفيديو (i)" : "Miniplayer (i)"}
              >
                <PictureInPicture2 className="w-5 h-5" />
                <span className="hidden sm:inline">{isAr ? "تصغير" : "Miniplayer"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Video Chapters Box (Collapsible) */}
        {chapters.length > 0 && (
          <div className="mt-4 rounded-xl border border-yt-border bg-yt-surface/90 overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => setChaptersCollapsed((c) => !c)}
              className="w-full flex items-center justify-between p-3.5 sm:px-4 text-start font-bold text-sm hover:bg-yt-hover transition-colors cursor-pointer select-none"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1 me-2">
                <ListVideo className="w-4 h-4 text-yt-blue shrink-0" />
                <span className="shrink-0">{isAr ? "فصول الفيديو" : "Chapters"}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yt-raised text-yt-sub tabular-nums shrink-0">
                  {chapters.length}
                </span>
                {activeChapterIndex !== -1 && (
                  <span className="text-xs text-yt-blue font-medium truncate ms-1 hidden sm:inline">
                    • {chapters[activeChapterIndex].label}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-yt-sub shrink-0">
                {chaptersCollapsed ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </div>
            </button>

            {!chaptersCollapsed && (
              <div className="border-t border-yt-border/50 divide-y divide-yt-border/20 max-h-64 overflow-y-auto p-1.5 space-y-1">
                {chapters.map((chap, idx) => {
                  const isActive = idx === activeChapterIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => seekTo(chap.start)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg text-start transition-all cursor-pointer ${
                        isActive
                          ? "bg-yt-blue/20 text-yt-blue font-bold border border-yt-blue/40 shadow-xs"
                          : "hover:bg-yt-hover text-yt-text/90"
                      }`}
                    >
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded tabular-nums shrink-0 ${
                          isActive
                            ? "bg-yt-blue text-black font-bold"
                            : "bg-yt-bg text-yt-sub font-semibold"
                        }`}
                      >
                        {fmtDuration(chap.start) || "0:00"}
                      </span>
                      <span className="text-xs sm:text-sm line-clamp-1 flex-1 min-w-0">
                        {chap.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Video Description & Metadata Box */}
        <div
          onClick={() => setExpanded((e) => !e)}
          className="mt-4 p-3.5 sm:p-4 rounded-xl bg-yt-surface/80 hover:bg-yt-surface transition-colors cursor-pointer text-sm select-text"
        >
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-yt-text flex-wrap">
            <span>
              {data.views ? fmtViews(data.views, lang) : "0"} {t("views")}
            </span>
            <span>•</span>
            <span>{displayRelativeDate || cleanUploadDate}</span>
            {data.category && (
              <>
                <span>•</span>
                <span className="text-yt-sub font-medium">#{data.category}</span>
              </>
            )}
          </div>

          {data.description ? (
            <div className="mt-2 text-yt-text leading-relaxed">
              <p
                className={`whitespace-pre-line ${expanded ? "" : "line-clamp-2 sm:line-clamp-3"}`}
              >
                <TextWithTimestamps text={data.description} />
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((x) => !x);
                }}
                className="mt-1 font-bold text-xs sm:text-sm text-yt-sub hover:text-yt-text block cursor-pointer"
              >
                {expanded ? (isAr ? "إظهار أقل" : "Show less") : isAr ? "...المزيد" : "...more"}
              </button>
            </div>
          ) : (
            <p className="mt-2 text-xs sm:text-sm text-yt-sub italic">{t("noDescription")}</p>
          )}
        </div>

        {/* Mobile & Tablet Comments Teaser Card (Visible on Phone and Tablet screens < lg) */}
        <div className="lg:hidden mt-3">
          <div
            onClick={() => setMobileCommentsOpen(true)}
            className="p-3 sm:p-4 rounded-xl bg-yt-surface/90 hover:bg-yt-surface border border-yt-border/40 transition-all cursor-pointer active:scale-[0.99] select-none shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-yt-sub" />
                <span className="font-bold text-sm text-yt-text">{t("comments")}</span>
                <span className="text-xs text-yt-sub font-semibold tabular-nums px-2 py-0.5 rounded-full bg-yt-raised">
                  {formattedCommentsCount}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-yt-sub font-medium">
                <span className="hover:text-yt-text">
                  {isAr ? "فتح لوحة التعليقات" : "Open sheet"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Top comment preview */}
            {commentsList.length > 0 ? (
              <div className="flex items-start gap-2.5 mt-2.5 pt-2 border-t border-yt-border/30">
                <Avatar
                  src={commentsList[0].thumbnail}
                  name={commentsList[0].author}
                  size="w-6 h-6 text-[10px] shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0 text-xs sm:text-[13px] leading-snug">
                  <span className="font-bold text-yt-text me-1.5">@{commentsList[0].author}</span>
                  <span className="text-yt-sub line-clamp-1">
                    <TextWithTimestamps text={commentsList[0].commentText} />
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-yt-sub mt-2 pt-2 border-t border-yt-border/30">
                {isAr
                  ? "انقر لإضافة تعليق أو قراءة التعليقات..."
                  : "Tap to add or read comments..."}
              </p>
            )}
          </div>

          {/* Quick toggle to also show inline on tablets / mobile */}
          <div className="flex justify-end mt-1.5 px-1">
            <button
              onClick={() => setShowInlineComments((s) => !s)}
              className="text-xs text-yt-sub hover:text-yt-text font-medium flex items-center gap-1 cursor-pointer"
            >
              {showInlineComments ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>{isAr ? "إخفاء التعليقات في الصفحة" : "Hide inline comments"}</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>
                    {isAr
                      ? "أو تصفح جميع التعليقات هنا في الصفحة مباشرةً"
                      : "Or view all comments inline on page"}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Inline comments for mobile/tablet when toggled */}
          {showInlineComments && (
            <div className="mt-3 p-3.5 sm:p-4 rounded-xl bg-yt-raised border border-yt-border/40 space-y-4 animate-in fade-in duration-200">
              <div className="flex gap-2.5 items-center">
                <span className="w-8 h-8 rounded-full grid place-items-center text-xs font-bold bg-gradient-to-br from-yt-blue to-teal-400 text-black shrink-0">
                  {isAr ? "أ" : "U"}
                </span>
                <input
                  placeholder={t("writeComment")}
                  className="flex-1 bg-yt-surface rounded-full px-3.5 py-1.5 text-sm placeholder:text-yt-sub outline-none border border-transparent focus:border-yt-border transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                      notify(t("commentPostedToast"));
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                />
              </div>

              <div className="space-y-4 mt-3">
                {!commentsList.length && (
                  <p className="text-sm text-yt-sub py-4 text-center">{t("noComments")}</p>
                )}
                {commentsList.map((c, i) => (
                  <CommentRow key={i} c={c} />
                ))}

                {commentsCont && (
                  <div className="pt-2 text-center">
                    <button
                      onClick={loadMoreComments}
                      disabled={loadingComments}
                      className="px-6 py-2 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium transition-all active:scale-95 inline-flex items-center gap-2"
                    >
                      {loadingComments ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{isAr ? "جارٍ تحميل التعليقات..." : "Loading comments..."}</span>
                        </>
                      ) : (
                        <span>{isAr ? "عرض المزيد من التعليقات" : "Load more comments"}</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Comments (Shows all comments with real count and pagination) */}
        <section className="hidden lg:block mt-6">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-lg">
              {totalCommentsCount > 0
                ? `${formattedCommentsCount} ${isAr ? "تعليق" : "comments"}`
                : t("comments")}
            </h2>
          </div>

          <div className="flex gap-3 mt-4">
            <span className="w-10 h-10 rounded-full grid place-items-center text-sm font-bold bg-gradient-to-br from-yt-blue to-teal-400 text-black shrink-0">
              {isAr ? "أ" : "U"}
            </span>
            <input
              placeholder={t("writeComment")}
              className="flex-1 bg-transparent border-b border-yt-hover focus:border-yt-text outline-none pb-1.5 text-sm placeholder:text-yt-sub transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                  notify(t("commentPostedToast"));
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
          </div>

          <div className="mt-6 space-y-6">
            {!commentsList.length && <p className="text-sm text-yt-sub py-4">{t("noComments")}</p>}
            {commentsList.map((c, i) => (
              <CommentRow key={i} c={c} />
            ))}

            {/* Load more comments trigger */}
            {commentsCont && (
              <div ref={loadMoreCommentsRef} className="pt-4 text-center">
                <button
                  onClick={loadMoreComments}
                  disabled={loadingComments}
                  className="px-6 py-2 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium transition-all active:scale-95 inline-flex items-center gap-2"
                >
                  {loadingComments ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isAr ? "جارٍ تحميل التعليقات..." : "Loading comments..."}</span>
                    </>
                  ) : (
                    <span>{isAr ? "عرض المزيد من التعليقات" : "Load more comments"}</span>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Related / Suggested Videos Column (Infinite Scrolling) */}
      <aside className="lg:w-[400px] xl:w-[420px] shrink-0">
        <QueuePanel onOpen={onOpen} />

        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {Object.values(labels).map((t) => (
            <button
              key={t}
              onClick={() => setRelFilter(t)}
              className={`h-8 px-3 rounded-lg text-sm font-medium shrink-0 transition-colors ${
                relFilter === t
                  ? "bg-yt-text text-yt-bg font-bold"
                  : "bg-yt-surface hover:bg-yt-hover"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {related.map((r, i) => (
            <VideoCard
              key={r.url}
              video={r}
              index={i}
              layout="list"
              onOpen={onOpen}
              onChannel={onChannel}
              notify={notify}
            />
          ))}
        </div>

        {/* Endless Scroll Sentinel for Suggested Videos */}
        <div
          ref={loadMoreRelatedRef}
          className="h-24 flex items-center justify-center text-yt-sub mt-4"
        >
          {loadingMoreRelated ? (
            <div className="flex items-center gap-2 text-xs font-medium">
              <Loader2 className="w-5 h-5 animate-spin text-yt-text" />
              <span>{isAr ? "جارٍ تحميل مقترحات أخرى..." : "Loading more suggested..."}</span>
            </div>
          ) : (
            <button
              onClick={() => void loadMoreRelated()}
              className="h-9 px-5 rounded-full bg-yt-surface hover:bg-yt-hover text-xs font-medium transition-colors"
            >
              {isAr ? "المزيد من الفيديوهات المقترحة" : "More suggested videos"}
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Comments Bottom Sheet (YouTube style) */}
      {mobileCommentsOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileCommentsOpen(false)}
          />

          {/* Sheet panel */}
          <div className="relative z-10 w-full max-h-[84vh] h-[84vh] bg-yt-raised border-t border-yt-border/60 rounded-t-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-200">
            {/* Grab handle */}
            <div className="w-10 h-1 rounded-full bg-yt-sub/40 mx-auto mt-2.5 mb-1 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-yt-border/40 shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-yt-text">{t("comments")}</h3>
                <span className="text-xs text-yt-sub tabular-nums">{formattedCommentsCount}</span>
              </div>
              <button
                onClick={() => setMobileCommentsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-yt-hover grid place-items-center text-yt-text transition-colors active:scale-95"
                aria-label={t("close")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Write comment input */}
            <div className="px-4 py-3 border-b border-yt-border/30 shrink-0 flex gap-3 items-center">
              <span className="w-8 h-8 rounded-full grid place-items-center text-xs font-bold bg-gradient-to-br from-yt-blue to-teal-400 text-black shrink-0">
                {isAr ? "أ" : "U"}
              </span>
              <input
                placeholder={t("writeComment")}
                className="flex-1 bg-yt-surface rounded-full px-3.5 py-1.5 text-sm placeholder:text-yt-sub outline-none border border-transparent focus:border-yt-border transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                    notify(t("commentPostedToast"));
                    (e.target as HTMLInputElement).value = "";
                  }
                }}
              />
            </div>

            {/* Comments scroll container with all comments & pagination */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-5">
              {!commentsList.length && (
                <p className="text-sm text-yt-sub py-10 text-center">{t("noComments")}</p>
              )}
              {commentsList.map((c, i) => (
                <CommentRow key={i} c={c} />
              ))}

              {commentsCont && (
                <div className="pt-2 pb-6 text-center">
                  <button
                    onClick={loadMoreComments}
                    disabled={loadingComments}
                    className="px-6 py-2 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium transition-all active:scale-95 inline-flex items-center gap-2"
                  >
                    {loadingComments ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{isAr ? "جارٍ التحميل..." : "Loading..."}</span>
                      </>
                    ) : (
                      <span>{isAr ? "عرض المزيد من التعليقات" : "Load more comments"}</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CommentRow({
  c,
}: {
  c: {
    author: string;
    thumbnail: string;
    commentText: string;
    commentedTime: string;
    likeCount: number;
    replyCount?: number;
  };
}) {
  const { t } = useLanguage();
  const [liked, setLiked] = useState(false);
  return (
    <div className="flex gap-3">
      <Avatar src={c.thumbnail} name={c.author} size="w-10 h-10 text-sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-[13px]">
          <span className="font-bold">@{c.author}</span>
          <span className="text-yt-sub">{c.commentedTime}</span>
        </div>
        <p className="text-sm mt-1 leading-relaxed whitespace-pre-line">
          <TextWithTimestamps text={c.commentText} />
        </p>
        <div className="flex items-center gap-4 mt-2 text-yt-sub">
          <button
            onClick={() => setLiked((l) => !l)}
            className="flex items-center gap-1.5 text-xs hover:text-yt-text"
          >
            <ThumbsUp className={`w-4 h-4 ${liked ? "fill-current text-yt-blue pop" : ""}`} />
            {c.likeCount + (liked ? 1 : 0)}
          </button>
          <button className="hover:text-yt-text" aria-label={t("dislike")}>
            <ThumbsDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-1.5 text-xs font-medium hover:text-yt-text">
            <CornerDownLeft className="w-4 h-4" /> {t("reply")}
          </button>
        </div>
      </div>
    </div>
  );
}
