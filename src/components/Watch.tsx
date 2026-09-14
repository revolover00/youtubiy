import { useEffect, useMemo, useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  ListPlus,
  ListVideo,
  MoreHorizontal,
  BadgeCheck,
  CornerDownLeft,
  Loader2,
  PictureInPicture2,
  ChevronDown,
} from "lucide-react";
import { getStreams } from "../lib/api";
import { channelIdFromUrl, fmtDuration, fmtViews, timeAgoAr, videoIdFromUrl } from "../lib/format";
import { addHistory, setMeta } from "../lib/store";
import { appStore } from "../lib/appStore";
import type { PipedVideo, StreamData } from "../lib/types";
import { Avatar, ErrorState } from "./Feed";
import YouTubePlayer from "./YouTubePlayer";
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
  saved,
  onToggleSave,
  onAddToPlaylist,
  isSubscribed,
  onToggleSub,
  onMinimize,
  startTime,
  onTimeUpdate,
}: Props) {
  const { t, isAr } = useLanguage();
  const id = videoIdFromUrl(video.url);
  const [data, setData] = useState<StreamData | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [disliked, setDisliked] = useState(false);
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

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    setData(null);
    setError(false);
    getStreams(id)
      .then((d) => {
        if (!alive) return;
        setData(d);
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

  const related = useMemo(() => {
    const list = (data?.relatedStreams || []).filter((r) => r.url?.includes("/watch"));
    if (relFilter === labels.fromChannel) {
      const f = list.filter((r) => r.uploaderName === (data?.uploader || video.uploaderName));
      if (f.length) return f;
    }
    if (relFilter === labels.shorts) {
      const f = list.filter((r) => r.duration > 0 && r.duration <= 60);
      if (f.length) return f;
    }
    return list;
  }, [data, relFilter, video.uploaderName, labels]);

  useEffect(() => {
    if (data) {
      const row = {
        video_id: id,
        channel_id: channelIdFromUrl(data.uploaderUrl),
        category: data.category,
        watched_at: new Date().toISOString(),
        progress: appStore.getSnapshot().playbackTimes[id] || 0,
      };
      addHistory(row);
      window.dispatchEvent(new CustomEvent("yt:history", { detail: row }));
    }
  }, [data, id]);

  // Keyboard shortcut 'i' for miniplayer
  useEffect(() => {
    if (!onMinimize) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }
      if (e.key === "i" || e.key === "I") {
        e.preventDefault();
        onMinimize();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onMinimize]);

  if (error) {
    return (
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 pt-6">
        <ErrorState
          onRetry={() => setAttempt((a) => a + 1)}
          message="تعذّر جلب بيانات هذا الفيديو، حاول مرة أخرى."
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 pt-6">
        <div className="aspect-video rounded-none lg:rounded-xl bg-yt-surface animate-pulse grid place-items-center">
          <Loader2 className="w-10 h-10 text-yt-sub animate-spin" />
        </div>
        <div className="h-6 w-2/3 bg-yt-surface rounded mt-4 animate-pulse" />
        <div className="h-4 w-1/3 bg-yt-surface rounded mt-3 animate-pulse" />
      </div>
    );
  }

  const channelId = channelIdFromUrl(data.uploaderUrl);

  return (
    <div className="max-w-[1720px] mx-auto px-3 sm:px-6 pt-4 lg:pt-6 flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">
        {/* native ad-free player slot */}
        <div className="relative aspect-video rounded-none lg:rounded-xl overflow-hidden bg-black group">
          <div id="watch-player-slot" className="w-full h-full" />
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="absolute top-3 start-3 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 max-md:opacity-90 shadow-lg"
              title={`${t("miniplayer")} (i)`}
              aria-label={t("miniplayer")}
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          )}
        </div>

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
                {fmtViews(data.uploaderSubscriberCount)} مشترك
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
              {isSubscribed(channelId) ? "مشترك ✓" : "اشتراك"}
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-yt-surface rounded-full overflow-hidden">
              <button
                onClick={() => {
                  onToggleLike();
                  setDisliked(false);
                }}
                className={`flex items-center gap-2 h-9 ps-4 pe-3 text-sm font-medium hover:bg-yt-hover transition-colors ${liked ? "text-yt-blue" : ""}`}
              >
                <ThumbsUp className={`w-5 h-5 ${liked ? "fill-current pop" : ""}`} />
                <span className="tabular-nums">{fmtViews(data.likes + (liked ? 1 : 0))}</span>
              </button>
              <span className="w-px h-5 bg-yt-hover" />
              <button
                onClick={() => {
                  setDisliked((d) => !d);
                  if (liked) onToggleLike();
                }}
                className={`h-9 px-3.5 hover:bg-yt-hover transition-colors ${disliked ? "text-yt-blue" : ""}`}
                aria-label="لم يعجبني"
              >
                <ThumbsDown className={`w-5 h-5 ${disliked ? "fill-current pop" : ""}`} />
              </button>
            </div>
            <button
              onClick={() => notify("تم نسخ الرابط 🔗")}
              className="flex items-center gap-2 h-9 px-3.5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium"
            >
              <Share2 className="w-5 h-5" /> مشاركة
            </button>
            <button
              onClick={() => notify("بدأ التنزيل في الخلفية")}
              className="flex items-center gap-2 h-9 px-3.5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium"
            >
              <Download className="w-5 h-5" /> <span className="hidden sm:inline">تنزيل</span>
            </button>
            <button
              onClick={() => onAddToPlaylist(video)}
              className="flex items-center gap-2 h-9 px-3.5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium"
            >
              <ListVideo className="w-5 h-5" />
              <span className="hidden sm:inline">{isAr ? "حفظ" : "Save"}</span>
            </button>
            {onMinimize && (
              <button
                onClick={onMinimize}
                className="flex items-center gap-2 h-9 px-3.5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium transition-colors border border-yt-border/40"
                title={`${t("miniplayer")} (i)`}
                aria-label={t("miniplayer")}
              >
                <PictureInPicture2 className="w-4 h-4 text-yt-blue" />
                <span>{t("minimize")}</span>
              </button>
            )}
            <button
              className="w-9 h-9 rounded-full bg-yt-surface hover:bg-yt-hover grid place-items-center"
              aria-label="المزيد"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* description */}
        <div className="mt-4 bg-yt-surface rounded-xl p-3 text-sm">
          <div className="font-bold flex flex-wrap gap-x-3">
            <span>{fmtViews(data.views)} مشاهدة</span>
            <span>{timeAgoAr(undefined, data.uploadDate)}</span>
            {data.category && <span className="text-yt-blue">#{data.category}</span>}
          </div>
          <p
            className={`mt-2 leading-relaxed text-yt-text/90 whitespace-pre-line ${expanded ? "" : "line-clamp-2"}`}
          >
            {data.description || "لا يوجد وصف لهذا الفيديو."}
          </p>
          {data.description && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="font-bold mt-1 text-yt-sub hover:text-yt-text"
            >
              {expanded ? "عرض أقل" : "...المزيد"}
            </button>
          )}
        </div>

        {/* comments */}
        <section className="mt-6">
          <h2 className="font-display font-bold text-lg">
            {(data.comments?.length || 0) > 0 ? `${data.comments!.length} تعليق` : "التعليقات"}
          </h2>
          <div className="flex gap-3 mt-4">
            <span className="w-10 h-10 rounded-full grid place-items-center text-sm font-bold bg-gradient-to-br from-yt-blue to-teal-400 text-black shrink-0">
              أ
            </span>
            <input
              placeholder="أضف تعليقاً..."
              className="flex-1 bg-transparent border-b border-yt-hover focus:border-yt-text outline-none pb-1.5 text-sm placeholder:text-yt-sub transition-colors"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.target as HTMLInputElement).value.trim()) {
                  notify("تم نشر تعليقك (واجهة تجريبية)");
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
          </div>
          <div className="mt-6 space-y-6">
            {!data.comments?.length && (
              <p className="text-sm text-yt-sub py-4">لا توجد تعليقات معروضة لهذا الفيديو.</p>
            )}
            {(data.comments || []).slice(0, 20).map((c, i) => (
              <CommentRow key={i} c={c} />
            ))}
          </div>
        </section>
      </div>

      {/* related */}
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
              className="w-full flex gap-2.5 group text-start"
            >
              <div className="relative w-[168px] aspect-video rounded-lg overflow-hidden bg-yt-raised shrink-0">
                <img
                  src={r.thumbnail}
                  alt={r.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute bottom-1 end-1 bg-black/80 text-white text-[11px] font-medium px-1 py-0.5 rounded">
                  {fmtDuration(r.duration)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium leading-snug line-clamp-2">{r.title}</h4>
                <div className="text-xs text-yt-sub mt-1 flex items-center gap-1">
                  {r.uploaderName}
                  {r.uploaderVerified && <BadgeCheck className="w-3 h-3" />}
                </div>
                <div className="text-xs text-yt-sub">
                  {fmtViews(r.views) && `${fmtViews(r.views)} مشاهدة · `}
                  {timeAgoAr(r.uploaded, r.uploadedDate)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>
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
          <button className="hover:text-yt-text" aria-label="لم يعجبني">
            <ThumbsDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-1.5 text-xs font-medium hover:text-yt-text">
            <CornerDownLeft className="w-4 h-4" /> رد
          </button>
        </div>
      </div>
    </div>
  );
}
