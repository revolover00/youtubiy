import { useState } from "react";
import {
  MoreVertical,
  BadgeCheck,
  Clock,
  ListPlus,
  Share2,
  ThumbsDown,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { CHIPS } from "../lib/config";
import { fmtDuration, fmtViews, timeAgoAr, videoIdFromUrl } from "../lib/format";
import type { PipedVideo } from "../lib/types";
import { ShortsIcon } from "./icons";

export function Avatar({
  src,
  name,
  size = "w-9 h-9 text-sm",
}: {
  src?: string;
  name: string;
  size?: string;
}) {
  const [err, setErr] = useState(false);
  const letter = name?.trim()?.charAt(0) || "؟";
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  if (!src || err) {
    return (
      <span
        className={`${size} rounded-full grid place-items-center font-bold text-white shrink-0`}
        style={{ background: `hsl(${hue} 55% 42%)` }}
      >
        {letter}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      onError={() => setErr(true)}
      className={`${size} rounded-full object-cover shrink-0 bg-yt-surface`}
      loading="lazy"
    />
  );
}

export function ChipsBar({ active, onChange }: { active: string; onChange: (c: string) => void }) {
  return (
    <div className="sticky top-14 z-40 bg-yt-bg/95 backdrop-blur-sm py-3 -mx-1 px-1">
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-1">
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`shrink-0 h-8 px-3.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 ${
              active === c ? "bg-yt-text text-yt-bg font-bold" : "bg-yt-surface text-yt-text hover:bg-yt-hover"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

function CardMenu({
  onDismiss,
  notify,
  onSaveLater,
  saved,
}: {
  onDismiss: () => void;
  notify: (m: string) => void;
  onSaveLater: () => void;
  saved: boolean;
}) {
  const [open, setOpen] = useState(false);
  const items = [
    { icon: Clock, label: saved ? "إزالة من المشاهدة لاحقاً" : "المشاهدة لاحقاً", act: onSaveLater },
    { icon: ListPlus, label: "إضافة إلى قائمة الانتظار", act: () => notify("تمت الإضافة لقائمة الانتظار") },
    { icon: Share2, label: "مشاركة", act: () => notify("تم نسخ الرابط 🔗") },
    { icon: ThumbsDown, label: "لا أهتم", act: onDismiss, danger: true },
  ];
  return (
    <div className="relative">
      <button
        className={`w-8 h-8 -me-1 rounded-full hover:bg-yt-surface grid place-items-center shrink-0 transition-opacity ${
          open ? "opacity-100" : "opacity-0 group-hover:opacity-100 max-md:opacity-100"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label="خيارات الفيديو"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpen(false); }} />
          <div
            className="dropdown-in absolute end-0 top-9 z-50 w-60 rounded-xl bg-yt-raised border border-yt-border py-2 shadow-2xl shadow-black/70"
            onClick={(e) => e.stopPropagation()}
          >
            {items.map((it) => (
              <button
                key={it.label}
                onClick={() => {
                  setOpen(false);
                  it.act();
                }}
                className={`w-full flex items-center gap-4 px-4 py-2.5 text-sm hover:bg-yt-surface ${it.danger ? "text-red-400" : ""}`}
              >
                <it.icon className="w-5 h-5" />
                {it.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function VideoCard({
  video,
  onOpen,
  index,
  onDismiss,
  notify,
  onChannel,
  onSaveLater,
  saved,
  layout = "grid",
}: {
  video: PipedVideo;
  onOpen: (v: PipedVideo) => void;
  index: number;
  onDismiss: (id: string) => void;
  notify: (m: string) => void;
  onChannel?: (channelId: string, name: string) => void;
  onSaveLater?: () => void;
  saved?: boolean;
  layout?: "grid" | "list";
}) {
  const id = videoIdFromUrl(video.url);
  const menu = (
    <CardMenu
      notify={notify}
      saved={!!saved}
      onSaveLater={() => onSaveLater?.()}
      onDismiss={() => {
        onDismiss(id);
        notify("لن نعرض لك هذا الفيديو مرة أخرى");
      }}
    />
  );

  const thumb = (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-yt-raised">
      <img
        src={video.thumbnail}
        alt={video.title}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
      />
      <span className="absolute bottom-1.5 end-1.5 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
        {fmtDuration(video.duration)}
      </span>
      {saved && (
        <span className="absolute top-2 end-2 bg-black/75 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3" /> محفوظ
        </span>
      )}
    </div>
  );

  if (layout === "list") {
    return (
      <article
        className="rise group cursor-pointer flex gap-3 sm:gap-4"
        style={{ animationDelay: `${Math.min(index, 11) * 40}ms` }}
        onClick={() => onOpen(video)}
      >
        <div className="w-40 sm:w-64 shrink-0">{thumb}</div>
        <div className="flex-1 min-w-0 py-0.5">
          <h3 className="text-[15px] sm:text-lg font-medium leading-snug line-clamp-2">{video.title}</h3>
          <div className="text-[13px] text-yt-sub mt-1">
            {fmtViews(video.views) && `${fmtViews(video.views)} مشاهدة`} · {timeAgoAr(video.uploaded, video.uploadedDate)}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChannel?.(video.uploaderUrl || "", video.uploaderName);
            }}
            className="mt-2 flex items-center gap-2 text-[13px] text-yt-sub hover:text-yt-text"
          >
            <Avatar src={video.uploaderAvatar} name={video.uploaderName} size="w-6 h-6 text-[11px]" />
            {video.uploaderName}
            {video.uploaderVerified && <BadgeCheck className="w-3.5 h-3.5" />}
          </button>
        </div>
        <div className="self-start">{menu}</div>
      </article>
    );
  }

  return (
    <article
      className="rise group cursor-pointer"
      style={{ animationDelay: `${Math.min(index, 11) * 50}ms` }}
      onClick={() => onOpen(video)}
    >
      {thumb}
      <div className="flex gap-3 mt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChannel?.(video.uploaderUrl || "", video.uploaderName);
          }}
          className="mt-0.5 transition-transform hover:scale-105"
          aria-label={video.uploaderName}
        >
          <Avatar src={video.uploaderAvatar} name={video.uploaderName} />
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-medium leading-snug line-clamp-2">{video.title}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChannel?.(video.uploaderUrl || "", video.uploaderName);
            }}
            className="mt-1 text-[13px] text-yt-sub flex items-center gap-1 hover:text-yt-text"
          >
            <span className="truncate">{video.uploaderName}</span>
            {video.uploaderVerified && <BadgeCheck className="w-3.5 h-3.5 shrink-0" />}
          </button>
          <div className="text-[13px] text-yt-sub">
            {fmtViews(video.views) && <>{fmtViews(video.views)} مشاهدة · </>}
            {timeAgoAr(video.uploaded, video.uploadedDate)}
          </div>
        </div>
        {menu}
      </div>
    </article>
  );
}

export function ShortsShelf({ items, onOpen }: { items: PipedVideo[]; onOpen: (i: number) => void }) {
  if (!items.length) return null;
  return (
    <section id="shorts-shelf" className="rise my-8 py-4 border-y border-yt-border">
      <div className="flex items-center gap-2.5 mb-4 px-0.5">
        <ShortsIcon className="w-7 h-7 text-yt-red" />
        <h2 className="font-display font-extrabold text-xl">شورتس</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x pb-1">
        {items.map((s, i) => (
          <button key={s.url} onClick={() => onOpen(i)} className="group shrink-0 w-[168px] sm:w-[190px] snap-start text-start">
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-yt-raised">
              <img
                src={s.thumbnail}
                alt={s.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute top-2 end-2 flex items-center gap-1 text-[11px] font-bold text-white bg-black/50 rounded px-1.5 py-0.5">
                <ShortsIcon className="w-3 h-3" />
                {fmtViews(s.views)}
              </span>
              <span className="absolute bottom-2 start-2 end-2 text-[13px] font-medium leading-snug line-clamp-2">{s.title}</span>
            </div>
            <p className="text-[13px] text-yt-sub mt-2">{s.uploaderName}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8 mt-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 60}ms` }}>
          <div className="aspect-video rounded-xl bg-yt-surface" />
          <div className="flex gap-3 mt-3">
            <div className="w-9 h-9 rounded-full bg-yt-surface shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-yt-surface rounded w-full" />
              <div className="h-3.5 bg-yt-surface rounded w-2/3" />
              <div className="h-3 bg-yt-surface rounded w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry: () => void }) {
  return (
    <div className="rise flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-20 h-20 rounded-full bg-yt-surface grid place-items-center mb-5">
        <AlertTriangle className="w-9 h-9 text-red-400" />
      </div>
      <h3 className="font-display font-bold text-lg">تعذّر تحميل المحتوى</h3>
      <p className="text-yt-sub text-sm mt-1 max-w-sm">
        {message || "فشلت جميع خوادم Piped في الاستجابة. تحقق من اتصالك بالإنترنت ثم أعد المحاولة."}
      </p>
      <button
        onClick={onRetry}
        className="mt-5 h-10 px-6 rounded-full bg-yt-text text-yt-bg font-bold text-sm flex items-center gap-2 hover:bg-white/85 active:scale-95 transition-all"
      >
        <RefreshCw className="w-4 h-4" /> إعادة المحاولة
      </button>
    </div>
  );
}

export function EmptyState({ message }: { message?: string }) {
  return (
    <div className="rise flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-yt-surface grid place-items-center mb-5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-9 h-9 text-yt-sub">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="font-display font-bold text-lg">لا توجد نتائج</h3>
      <p className="text-yt-sub text-sm mt-1 max-w-xs">{message || "جرّب كلمات بحث مختلفة أو اختر تصنيفاً آخر من الأعلى"}</p>
    </div>
  );
}
