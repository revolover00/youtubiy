import { useState } from "react";
import {
  Clock,
  Share2,
  ThumbsDown,
  ListPlus,
  MoreVertical,
  BadgeCheck,
  RefreshCw,
  AlertTriangle,
  ListVideo,
  Sparkles,
} from "lucide-react";
import { ShortsIcon } from "./icons";
import {
  fmtDuration,
  fmtViews,
  isLiveStream,
  isShortsVideo,
  timeAgo,
  videoIdFromUrl,
} from "../lib/format";
import type { PipedVideo, SearchChannel, SearchPlaylist } from "../lib/types";
import { useLanguage } from "../lib/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Avatar({
  src,
  name,
  size = "w-9 h-9 text-xs",
}: {
  src?: string;
  name: string;
  size?: string;
}) {
  const [err, setErr] = useState(false);
  const letter = (name || "؟").trim().charAt(0);
  const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;

  if (!src || err) {
    return (
      <div
        className={`${size} rounded-full grid place-items-center font-bold text-white shrink-0 shadow-sm`}
        style={{ background: `hsl(${hue} 60% 45%)` }}
      >
        {letter}
      </div>
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

export interface ChipItem {
  id: string;
  label: string;
}

export function ChipsBar({
  active,
  onChange,
  chips,
  onOpenAIAlgorithm,
  isAIActive,
}: {
  active: string;
  onChange: (c: string) => void;
  chips?: (ChipItem | string)[];
  onOpenAIAlgorithm?: () => void;
  isAIActive?: boolean;
}) {
  const { t, isAr } = useLanguage();

  const defaultChips: ChipItem[] = [
    { id: "All", label: t("chipAll") },
    { id: "Trending", label: t("chipTrending") },
    { id: "Gaming", label: t("chipGaming") },
    { id: "Minecraft", label: t("chipMinecraft") },
    { id: "Technology", label: t("chipTechnology") },
    { id: "Cooking", label: t("chipCooking") },
    { id: "Travel", label: t("chipTravel") },
    { id: "Music", label: t("chipMusic") },
    { id: "Cars", label: t("chipCars") },
  ];

  const list: ChipItem[] = chips
    ? chips.map((c) => (typeof c === "string" ? { id: c, label: c } : c))
    : defaultChips;

  return (
    <div className="sticky top-14 z-40 bg-yt-bg/95 backdrop-blur-sm py-3 -mx-1 px-1">
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar px-1 items-center">
        {onOpenAIAlgorithm && (
          <button
            onClick={onOpenAIAlgorithm}
            className={`shrink-0 h-8 px-3 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 whitespace-nowrap flex items-center gap-1.5 shadow-sm ${
              isAIActive
                ? "bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 text-white shadow-purple-900/30"
                : "bg-purple-600/15 text-purple-300 border border-purple-500/30 hover:bg-purple-600/25"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{isAr ? "خوارزمية الذكاء الاصطناعي" : "AI Algorithm"}</span>
            {isAIActive && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse shrink-0" />
            )}
          </button>
        )}

        {list.map((c) => {
          const isSelected = active === c.id || active === c.label;
          return (
            <button
              key={c.id}
              onClick={() => onChange(c.id)}
              className={`shrink-0 h-8 px-3.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 whitespace-nowrap ${
                isSelected
                  ? "bg-yt-text text-yt-bg font-bold shadow"
                  : "bg-yt-surface text-yt-text hover:bg-yt-hover"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CardMenu({
  onDismiss,
  notify,
  onSaveLater,
  onAddToPlaylist,
  saved,
  videoUrl,
}: {
  onDismiss: () => void;
  notify: (m: string) => void;
  onSaveLater: () => void;
  onAddToPlaylist?: () => void;
  saved: boolean;
  videoUrl?: string;
}) {
  const { t, dir, isAr } = useLanguage();
  const [open, setOpen] = useState(false);

  const items = [
    {
      icon: Clock,
      label: saved ? t("removeFromWatchLater") : t("saveToWatchLater"),
      act: onSaveLater,
    },
    {
      icon: ListPlus,
      label: isAr ? "إضافة إلى قائمة تشغيل" : "Add to playlist",
      act: () => onAddToPlaylist?.(),
    },
    {
      icon: ListPlus,
      label: t("addToQueue"),
      act: () => notify(t("addedToQueueToast")),
    },
    {
      icon: Share2,
      label: t("share"),
      act: () => {
        const link = videoUrl
          ? `${window.location.origin}${videoUrl.startsWith("/") ? "" : "/"}${videoUrl}`
          : window.location.href;
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          navigator.clipboard.writeText(link);
        }
        notify(t("linkCopied"));
      },
    },
    {
      icon: ThumbsDown,
      label: t("notInterested"),
      act: onDismiss,
      danger: true,
    },
  ];

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu dir={dir} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={`w-8 h-8 -me-1 rounded-full hover:bg-yt-surface grid place-items-center shrink-0 transition-opacity outline-none ${
              open
                ? "opacity-100 bg-yt-surface text-yt-text"
                : "opacity-0 group-hover:opacity-100 max-md:opacity-100 text-yt-sub hover:text-yt-text"
            }`}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            aria-label="Options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="bottom"
          sideOffset={6}
          className="z-[999] w-56 rounded-xl bg-yt-raised border border-yt-border py-1.5 shadow-2xl shadow-black/80 text-yt-text backdrop-blur-none animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((it) => (
            <DropdownMenuItem
              key={it.label}
              onSelect={() => it.act()}
              onClick={() => it.act()}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg cursor-pointer text-sm outline-none transition-colors select-none ${
                it.danger
                  ? "text-red-400 hover:text-red-300 hover:bg-yt-surface focus:bg-yt-surface focus:text-red-300"
                  : "text-yt-text hover:text-white hover:bg-yt-surface focus:bg-yt-surface focus:text-white"
              }`}
            >
              <it.icon className="w-4 h-4 shrink-0" />
              <span>{it.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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
  onAddToPlaylist,
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
  onAddToPlaylist?: () => void;
  saved?: boolean;
  layout?: "grid" | "list";
}) {
  const { lang, t } = useLanguage();
  const id = videoIdFromUrl(video.url);

  const menu = (
    <CardMenu
      notify={notify}
      saved={!!saved}
      videoUrl={video.url}
      onSaveLater={() => onSaveLater?.()}
      onAddToPlaylist={() => onAddToPlaylist?.()}
      onDismiss={() => {
        onDismiss(id);
        notify(t("notInterested"));
      }}
    />
  );

  const isLive = isLiveStream(video);
  const isShort = isShortsVideo(video);
  const durationStr = fmtDuration(video.duration);

  const thumb = (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-yt-raised transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-black/25">
      <img
        src={video.thumbnail}
        alt={video.title}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
      />
      {isLive ? (
        <span className="absolute bottom-1.5 end-1.5 bg-yt-red text-white text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1.5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-white live-dot" />
          <span>{lang === "ar" ? "مباشر" : "LIVE"}</span>
        </span>
      ) : isShort ? (
        <span className="absolute bottom-1.5 end-1.5 bg-black/85 text-white text-[11px] sm:text-xs font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
          <ShortsIcon className="w-3.5 h-3.5 text-yt-red" />
          <span>{durationStr || (lang === "ar" ? "شورتس" : "Shorts")}</span>
        </span>
      ) : durationStr ? (
        <span className="absolute bottom-1.5 end-1.5 text-white text-xs font-semibold px-1.5 py-0.5 rounded bg-black/80">
          {durationStr}
        </span>
      ) : null}
      {saved && (
        <span className="absolute top-2 end-2 bg-black/75 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
          <Clock className="w-3 h-3" /> {lang === "ar" ? "محفوظ" : "Saved"}
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
          <h3 className="text-[15px] sm:text-lg font-medium leading-snug line-clamp-2">
            {video.title}
          </h3>
          <div className="text-[13px] text-yt-sub mt-1">
            {fmtViews(video.views, lang) && `${fmtViews(video.views, lang)} ${t("views")} · `}
            {timeAgo(video.uploaded, video.uploadedDate, lang)}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChannel?.(video.uploaderUrl || "", video.uploaderName);
            }}
            className="mt-2 flex items-center gap-2 text-[13px] text-yt-sub hover:text-yt-text"
          >
            <Avatar
              src={video.uploaderAvatar}
              name={video.uploaderName}
              size="w-6 h-6 text-[11px]"
            />
            <span className="truncate">{video.uploaderName}</span>
            {video.uploaderVerified && <BadgeCheck className="w-3.5 h-3.5 shrink-0 text-yt-sub" />}
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
          className="mt-0.5 transition-transform hover:scale-105 shrink-0"
          aria-label={video.uploaderName}
        >
          <Avatar src={video.uploaderAvatar} name={video.uploaderName} />
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-medium leading-snug line-clamp-2 text-yt-text group-hover:text-white">
            {video.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChannel?.(video.uploaderUrl || "", video.uploaderName);
            }}
            className="mt-1 text-[13px] text-yt-sub flex items-center gap-1 hover:text-yt-text truncate"
          >
            <span className="truncate">{video.uploaderName}</span>
            {video.uploaderVerified && <BadgeCheck className="w-3.5 h-3.5 shrink-0 text-yt-sub" />}
          </button>
          <div className="text-[13px] text-yt-sub">
            {fmtViews(video.views, lang) && (
              <>
                {fmtViews(video.views, lang)} {t("views")} ·{" "}
              </>
            )}
            {timeAgo(video.uploaded, video.uploadedDate, lang)}
          </div>
        </div>
        {menu}
      </div>
    </article>
  );
}

export function ChannelResultCard({
  channel,
  onOpen,
  subscribed,
  onToggleSub,
}: {
  channel: SearchChannel;
  onOpen: (id: string) => void;
  subscribed: boolean;
  onToggleSub: () => void;
}) {
  const { lang, t } = useLanguage();

  return (
    <article
      className="rise flex items-center gap-4 sm:gap-6 py-4 border-b border-yt-border cursor-pointer hover:bg-yt-surface/30 px-2 rounded-xl transition-colors"
      onClick={() => onOpen(channel.id)}
    >
      <div className="w-24 sm:w-40 flex justify-center shrink-0">
        <Avatar
          src={channel.avatar}
          name={channel.name}
          size="w-20 h-20 sm:w-28 sm:h-28 text-2xl"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[16px] sm:text-lg font-bold flex items-center gap-1.5 text-yt-text">
          <span className="truncate">{channel.name}</span>
          {channel.verified && <BadgeCheck className="w-4 h-4 shrink-0 text-yt-sub" />}
        </h3>
        <p className="text-[13px] text-yt-sub mt-0.5">
          {channel.subscribers > 0
            ? `${fmtViews(channel.subscribers, lang)} ${t("subscribers")}`
            : lang === "ar"
              ? "قناة"
              : "Channel"}
        </p>
        {channel.description && (
          <p className="text-[13px] text-yt-sub mt-1.5 line-clamp-2 max-w-2xl">
            {channel.description}
          </p>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSub();
        }}
        className={`h-9 px-4 rounded-full text-sm font-bold shrink-0 active:scale-95 transition-all ${
          subscribed
            ? "bg-yt-surface text-yt-text hover:bg-yt-hover"
            : "bg-yt-text text-yt-bg hover:bg-white/85"
        }`}
      >
        {subscribed ? t("subscribed") : t("subscribe")}
      </button>
    </article>
  );
}

export function PlaylistCard({
  playlist,
  onOpen,
  index = 0,
}: {
  playlist: SearchPlaylist;
  onOpen: (p: SearchPlaylist) => void;
  index?: number;
}) {
  const { lang } = useLanguage();

  return (
    <article
      className="rise group cursor-pointer"
      style={{ animationDelay: `${Math.min(index, 11) * 50}ms` }}
      onClick={() => onOpen(playlist)}
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-yt-raised">
        {playlist.thumbnail ? (
          <img
            src={playlist.thumbnail}
            alt={playlist.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="w-full h-full bg-yt-surface" />
        )}
        <div className="absolute inset-y-0 end-0 w-2/5 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white">
          <ListVideo className="w-5 h-5 mb-1" />
          <span className="font-bold text-sm">{playlist.videoCount || ""}</span>
          <span className="text-[11px]">{lang === "ar" ? "فيديو" : "videos"}</span>
        </div>
      </div>
      <h3 className="text-[15px] font-medium leading-snug line-clamp-2 mt-3 text-yt-text group-hover:text-white">
        {playlist.title}
      </h3>
      <p className="text-[13px] text-yt-sub mt-1">
        {playlist.uploaderName || (lang === "ar" ? "قائمة تشغيل" : "Playlist")}
      </p>
    </article>
  );
}

export function ShortsShelf({
  items,
  onOpen,
}: {
  items: PipedVideo[];
  onOpen: (i: number) => void;
}) {
  const { lang, t } = useLanguage();
  if (!items.length) return null;

  return (
    <section id="shorts-shelf" className="rise my-8 py-4 border-y border-yt-border">
      <div className="flex items-center gap-2.5 mb-4 px-0.5">
        <ShortsIcon className="w-7 h-7 text-yt-red" />
        <h2 className="font-display font-extrabold text-xl">{t("shorts")}</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x pb-1">
        {items.map((s, i) => (
          <button
            key={s.url}
            onClick={() => onOpen(i)}
            className="group shrink-0 w-[168px] sm:w-[190px] snap-start text-start"
          >
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
                <ShortsIcon className="w-3 h-3 text-yt-red" />
                {fmtViews(s.views, lang)}
              </span>
              <span className="absolute bottom-2 start-2 end-2 text-[13px] font-medium leading-snug line-clamp-2 text-white">
                {s.title}
              </span>
            </div>
            <p className="text-[13px] text-yt-sub mt-2 truncate">{s.uploaderName}</p>
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
  const { t } = useLanguage();
  return (
    <div className="rise flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-20 h-20 rounded-full bg-yt-surface grid place-items-center mb-5">
        <AlertTriangle className="w-9 h-9 text-red-400" />
      </div>
      <h3 className="font-display font-bold text-lg">{t("loadError")}</h3>
      <p className="text-yt-sub text-sm mt-1 max-w-sm">{message || t("loadError")}</p>
      <button
        onClick={onRetry}
        className="mt-5 h-10 px-6 rounded-full bg-yt-text text-yt-bg font-bold text-sm flex items-center gap-2 hover:bg-white/85 active:scale-95 transition-all"
      >
        <RefreshCw className="w-4 h-4" /> {t("retry")}
      </button>
    </div>
  );
}

export function EmptyState({ message }: { message?: string }) {
  const { t } = useLanguage();
  return (
    <div className="rise flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-yt-surface grid place-items-center mb-5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-9 h-9 text-yt-sub"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="font-display font-bold text-lg">{t("noResults")}</h3>
      <p className="text-yt-sub text-sm mt-1 max-w-xs">{message || t("noResultsSuggestion")}</p>
    </div>
  );
}
