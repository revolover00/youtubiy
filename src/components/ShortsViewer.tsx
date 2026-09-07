import { useEffect, useRef, useState } from "react";
import {
  X,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  MoreVertical,
  Music2,
  Volume2,
  VolumeX,
  Loader2,
} from "lucide-react";
import { getStreams } from "../lib/api";
import { fmtViews, videoIdFromUrl } from "../lib/format";
import { addHistory, setMeta } from "../lib/store";
import type { PipedVideo } from "../lib/types";
import { Avatar } from "./Feed";
import { ShortsIcon } from "./icons";

interface Props {
  items: PipedVideo[];
  startIndex: number;
  onClose: () => void;
  notify: (m: string) => void;
}

export default function ShortsViewer({ items, startIndex, onClose, notify }: Props) {
  const [active, setActive] = useState(startIndex);
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [muted, setMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = startIndex * el.clientHeight;
  }, [startIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      const el = containerRef.current;
      if (!el) return;
      if (e.key === "ArrowDown") el.scrollBy({ top: el.clientHeight, behavior: "smooth" });
      if (e.key === "ArrowUp") el.scrollBy({ top: -el.clientHeight, behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const onScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setActive(Math.round(el.scrollTop / el.clientHeight));
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black flex flex-col">
      <div className="h-14 shrink-0 flex items-center justify-between px-3 text-white">
        <div className="flex items-center gap-2">
          <ShortsIcon className="w-7 h-7 text-yt-red" />
          <span className="font-display font-extrabold text-lg">شورتس</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setMuted((m) => !m)} className="w-10 h-10 rounded-full hover:bg-white/10 grid place-items-center" aria-label="الصوت">
            {muted ? <VolumeX className="w-5 h-5 opacity-60" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-white/10 grid place-items-center" aria-label="إغلاق">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div ref={containerRef} onScroll={onScroll} className="flex-1 overflow-y-auto snap-y snap-mandatory no-scrollbar">
        {items.map((s, i) => (
          <ShortItem
            key={s.url}
            video={s}
            active={active === i}
            muted={muted}
            liked={!!likes[videoIdFromUrl(s.url)]}
            onLike={() => {
              const id = videoIdFromUrl(s.url);
              setLikes((p) => ({ ...p, [id]: !p[id] }));
            }}
            notify={notify}
          />
        ))}
      </div>

      <div className="hidden sm:flex absolute end-3 top-1/2 -translate-y-1/2 flex-col gap-1.5">
        {items.map((_, i) => (
          <span key={i} className={`w-1.5 rounded-full transition-all duration-300 ${active === i ? "h-5 bg-white" : "h-1.5 bg-white/30"}`} />
        ))}
      </div>
    </div>
  );
}

function ShortItem({
  video,
  active,
  muted,
  liked,
  onLike,
  notify,
}: {
  video: PipedVideo;
  active: boolean;
  muted: boolean;
  liked: boolean;
  onLike: () => void;
  notify: (m: string) => void;
}) {
  const id = videoIdFromUrl(video.url);
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!active) {
      ref.current?.pause();
      return;
    }
    ref.current?.play().catch(() => {});
  }, [active, src]);

  useEffect(() => {
    let alive = true;
    setSrc(null);
    setFailed(false);
    if (!active) return;
    getStreams(id)
      .then((d) => {
        if (!alive) return;
        const combined = (d.videoStreams || [])
          .filter((s) => !s.videoOnly && s.mimeType?.startsWith("video/"))
          .sort((a, b) => (parseInt(b.quality) || 0) - (parseInt(a.quality) || 0));
        const url = combined[0]?.url || d.hls || null;
        if (url) {
          setSrc(url);
          setMeta(id, {
            title: d.title,
            thumbnail: video.thumbnail,
            uploaderName: d.uploader,
            uploaderAvatar: d.uploaderAvatar,
            duration: video.duration,
          });
        } else setFailed(true);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [active, id, video]);

  return (
    <div className="h-full snap-start flex items-center justify-center py-1">
      <div className="relative h-full max-h-[calc(100vh-8rem)] aspect-[9/16] max-w-full rounded-xl overflow-hidden bg-yt-raised">
        {src ? (
          <video
            ref={ref}
            src={src}
            poster={video.thumbnail}
            muted={muted}
            loop
            playsInline
            className="w-full h-full object-cover"
            onPlay={() => addHistory({ video_id: id, watched_at: new Date().toISOString() })}
          />
        ) : failed ? (
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
        ) : (
          <>
            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
            {active && (
              <span className="absolute inset-0 grid place-items-center bg-black/40">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </span>
            )}
          </>
        )}
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        <div className="absolute bottom-3 start-3 end-16 text-white">
          <div className="flex items-center gap-2.5 mb-2">
            <Avatar src={video.uploaderAvatar} name={video.uploaderName} size="w-8 h-8 text-xs" />
            <span className="text-sm font-bold truncate">{video.uploaderName}</span>
          </div>
          <p className="text-sm font-medium leading-snug line-clamp-2">{video.title}</p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <Music2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate opacity-90">{fmtViews(video.views)} مشاهدة · صوت أصلي</span>
          </div>
        </div>

        <div className="absolute end-2 bottom-3 flex flex-col items-center gap-4">
          <RailBtn
            icon={<ThumbsUp className={`w-6 h-6 ${liked ? "fill-current" : ""}`} />}
            count={liked ? "12 ألف" : "11 ألف"}
            active={liked}
            onClick={onLike}
            label="إعجاب"
          />
          <RailBtn icon={<ThumbsDown className="w-6 h-6" />} onClick={() => notify("شكراً لتقييمك")} label="لم يعجبني" />
          <RailBtn icon={<MessageCircle className="w-6 h-6" />} count="340" onClick={() => notify("التعليقات قريباً")} label="تعليقات" />
          <RailBtn icon={<Share2 className="w-6 h-6" />} count="مشاركة" onClick={() => notify("تم نسخ الرابط 🔗")} label="مشاركة" />
          <RailBtn icon={<MoreVertical className="w-6 h-6" />} onClick={() => {}} label="المزيد" />
        </div>
      </div>
    </div>
  );
}

function RailBtn({
  icon,
  count,
  onClick,
  active,
  label,
}: {
  icon: React.ReactNode;
  count?: string;
  onClick: () => void;
  active?: boolean;
  label: string;
}) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group" aria-label={label}>
      <span
        className={`w-12 h-12 rounded-full grid place-items-center transition-all group-active:scale-90 ${
          active ? "bg-white/20 text-yt-blue" : "bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white"
        }`}
      >
        {icon}
      </span>
      {count && <span className="text-[11px] font-medium text-white drop-shadow">{count}</span>}
    </button>
  );
}
