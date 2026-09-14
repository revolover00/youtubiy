import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
} from "lucide-react";
import { getCommentsPage, getStreams, searchPaged } from "../lib/api";
import {
  channelIdFromUrl,
  cleanDateText,
  fmtDuration,
  fmtViews,
  isLiveStream,
  isShortsVideo,
  timeAgo,
  videoIdFromUrl,
} from "../lib/format";
import { addHistory, setMeta } from "../lib/store";
import type { PipedComment, PipedVideo, StreamData } from "../lib/types";
import { Avatar, ErrorState } from "./Feed";
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
}: Props) {
  const { t, isAr, lang } = useLanguage();
  const id = videoIdFromUrl(video.url);
  const [data, setData] = useState<StreamData | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [mobileCommentsOpen, setMobileCommentsOpen] = useState(false);

  // Comments state & pagination
  const [commentsList, setCommentsList] = useState<PipedComment[]>([]);
  const [commentsCont, setCommentsCont] = useState<string | undefined>(undefined);
  const [loadingComments, setLoadingComments] = useState(false);

  // Infinite Suggested Videos state
  const [relatedStreams, setRelatedStreams] = useState<PipedVideo[]>([]);
  const [relatedCont, setRelatedCont] = useState<unknown | null>(null);
  const [loadingMoreRelated, setLoadingMoreRelated] = useState(false);
  const [relatedQueryIndex, setRelatedQueryIndex] = useState(0);
  const loadMoreRelatedRef = useRef<HTMLDivElement>(null);

  // Mobile swipe down gesture tracking
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const touchStateRef = useRef<{
    startY: number;
    startX: number;
    active: boolean;
    moved: boolean;
  }>({
    startY: 0,
    startX: 0,
    active: false,
    moved: false,
  });

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

  // Initial video details fetch
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    setData(null);
    setError(false);
    setCommentsList([]);
    setCommentsCont(undefined);
    setRelatedStreams([]);
    setRelatedCont(null);
    setRelatedQueryIndex(0);

    getStreams(id)
      .then((d) => {
        if (!alive) return;
        setData(d);
        setCommentsList(d.comments || []);
        setCommentsCont(d.commentsContinuation);
        setRelatedStreams(d.relatedStreams || []);

        setMeta(id, {
          title: d.title,
          thumbnail: video.thumbnail,
          uploaderName: d.uploader,
          uploaderAvatar: d.uploaderAvatar,
          duration: video.duration,
        });
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        if (alive) setError(true);
      });

    return () => {
      alive = false;
      controller.abort();
    };
  }, [id, attempt, video.thumbnail, video.duration]);

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

  // Touch Swipe Down to Minimize Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStateRef.current = {
      startY: touch.clientY,
      startX: touch.clientX,
      active: true,
      moved: false,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStateRef.current.active) return;
    const dy = e.touches[0].clientY - touchStateRef.current.startY;
    const dx = e.touches[0].clientX - touchStateRef.current.startX;

    if (dy > 0 && dy > Math.abs(dx)) {
      touchStateRef.current.moved = true;
      const clampedY = Math.min(dy, 120);
      setDragY(clampedY);
      const persistentEl = document.getElementById("persistent-player");
      if (persistentEl) {
        persistentEl.style.transform = `translate3d(0, ${clampedY}px, 0) scale(${
          1 - clampedY * 0.0015
        })`;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStateRef.current.active) return;
    const dy = e.changedTouches[0].clientY - touchStateRef.current.startY;
    touchStateRef.current.active = false;
    setDragY(0);

    const persistentEl = document.getElementById("persistent-player");
    if (persistentEl) {
      persistentEl.style.transform = "";
    }

    if (dy > 50 && onMinimize) {
      onMinimize();
    }
  };

  useEffect(() => {
    if (data) {
      const row = {
        video_id: id,
        channel_id: channelIdFromUrl(data.uploaderUrl),
        category: data.category,
        title: data.title,
        duration: video.duration,
        uploader: data.uploader,
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
        <ErrorState onRetry={() => setAttempt((a) => a + 1)} message={t("watchError")} />
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
        {/* Native ad-free player slot with swipe down to minimize support */}
        <div
          ref={playerContainerRef}

          style={
            dragY > 0
              ? {
                  transform: `translate3d(0, ${dragY}px, 0) scale(${1 - dragY * 0.0015})`,
                  transition: "none",
                }
              : { transition: "transform 0.2s ease-out" }
          }
          className="relative aspect-video rounded-none lg:rounded-xl overflow-hidden bg-black group shadow-lg"
        >
          <div id="watch-player-slot" className="w-full h-full" />

          {/* Top swipe-down grab indicator & minimize button for touch devices */}
          {onMinimize && (
            <div className="absolute top-0 inset-x-0 h-12 z-10 flex items-center justify-between px-3 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-auto">
              <div className="w-10 h-1 rounded-full bg-white/60 shadow-sm" />
              <div className="w-9 h-9" />
            </div>
          )}
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
              <div className="pt-4 text-center">
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
          {related.map((r) => (
            <button
              key={r.url}
              onClick={() => onOpen(r)}
              className="w-full flex gap-2.5 group text-start cursor-pointer"
            >
              <div className="relative w-[168px] aspect-video rounded-lg overflow-hidden bg-yt-raised shrink-0">
                <img
                  src={r.thumbnail}
                  alt={r.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {isLiveStream(r) ? (
                  <span className="absolute bottom-1 end-1 bg-yt-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white live-dot" />
                    {lang === "ar" ? "مباشر" : "LIVE"}
                  </span>
                ) : isShortsVideo(r) ? (
                  <span className="absolute bottom-1 end-1 bg-black/85 text-white text-[10px] font-medium px-1.5 py-0.5 rounded flex items-center gap-1">
                    <ShortsIcon className="w-3 h-3 text-yt-red" />
                    {fmtDuration(r.duration) || (lang === "ar" ? "شورتس" : "Shorts")}
                  </span>
                ) : fmtDuration(r.duration) ? (
                  <span className="absolute bottom-1 end-1 bg-black/80 text-white text-[11px] font-medium px-1 py-0.5 rounded">
                    {fmtDuration(r.duration)}
                  </span>
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium leading-snug line-clamp-2">{r.title}</h4>
                <div className="text-xs text-yt-sub mt-1 flex items-center gap-1">
                  {r.uploaderName}
                  {r.uploaderVerified && <BadgeCheck className="w-3 h-3" />}
                </div>
                <div className="text-xs text-yt-sub">
                  {fmtViews(r.views, lang) && `${fmtViews(r.views, lang)} ${t("views")} · `}
                  {timeAgo(r.uploaded, r.uploadedDate, lang)}
                </div>
              </div>
            </button>
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
        <p className="text-sm mt-1 leading-relaxed whitespace-pre-line">{c.commentText}</p>
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
