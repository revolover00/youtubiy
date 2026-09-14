import {
  Home,
  History,
  Clock,
  ThumbsUp,
  Download,
  ListVideo,
  UserRound,
  SquarePlay,
  ChevronDown,
  Flame,
  Music2,
  Gamepad2,
  Newspaper,
  Trophy,
  Settings,
  Flag,
  HelpCircle,
  Globe,
  X,
} from "lucide-react";
import { ShortsIcon, SubscriptionsIcon, LogoIcon } from "./icons";
import type { Subscription, UserPlaylist } from "../lib/types";
import { useLanguage } from "../lib/i18n";

interface Props {
  expanded: boolean;
  pushable?: boolean;
  active: string;
  subs: Subscription[];
  customPlaylists?: UserPlaylist[];
  onNavigate: (label: string) => void;
  onHome: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenSettings?: () => void;
}

function Item({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-5 px-3 h-10 rounded-lg text-sm transition-colors text-start ${
        active ? "bg-yt-surface font-bold text-white" : "hover:bg-yt-surface/70 text-yt-text/90"
      }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}

function FullContent({
  active,
  subs,
  customPlaylists = [],
  onNavigate,
  onHome,
  onOpenSettings,
}: Pick<Props, "active" | "subs" | "onNavigate" | "onHome" | "onOpenSettings" | "customPlaylists">) {
  const { t, isAr } = useLanguage();

  const MAIN = [
    { icon: Home, label: t("home"), id: "home" },
    { icon: ShortsIcon, label: t("shorts"), id: "shorts" },
    { icon: SubscriptionsIcon, label: t("subscriptions"), id: "subs" },
  ];

  const YOU = [
    { icon: UserRound, label: t("yourChannel"), id: "channel" },
    { icon: History, label: t("history"), id: "history" },
    { icon: ListVideo, label: t("playlists"), id: "playlists" },
    { icon: SquarePlay, label: t("yourVideos"), id: "videos" },
    { icon: Clock, label: t("watchLater"), id: "watchlater" },
    { icon: ThumbsUp, label: t("likedVideos"), id: "liked" },
    { icon: Download, label: t("downloads"), id: "downloads" },
  ];

  const EXPLORE = [
    { icon: Flame, label: t("trending"), id: "trending" },
    { icon: Music2, label: t("music"), id: "music" },
    { icon: Gamepad2, label: t("gaming"), id: "gaming" },
    { icon: Newspaper, label: t("news"), id: "news" },
    { icon: Trophy, label: t("sports"), id: "sports" },
  ];

  return (
    <div className="px-3 pb-8">
      <div className="py-2">
        {MAIN.map((m) => (
          <Item
            key={m.id}
            icon={m.icon}
            label={m.label}
            active={active === m.label || (m.id === "home" && active === "home")}
            onClick={() => {
              if (m.id === "home") onHome();
              else onNavigate(m.label);
            }}
          />
        ))}
      </div>

      <hr className="border-yt-border my-2" />

      <div className="py-1">
        <button className="flex items-center gap-1.5 px-3 h-9 text-[15px] font-bold text-yt-text">
          {t("you")}
          <ChevronDown className="w-4 h-4" />
        </button>
        {YOU.map((y) => (
          <Item
            key={y.id}
            icon={y.icon}
            label={y.label}
            active={active === y.label}
            onClick={() => onNavigate(y.label)}
          />
        ))}
        {customPlaylists.slice(0, 5).map((p) => (
          <Item
            key={p.id}
            icon={ListVideo}
            label={p.title}
            active={active === `playlist:${p.id}`}
            onClick={() => onNavigate(`playlist:${p.id}`)}
          />
        ))}
      </div>

      <hr className="border-yt-border my-2" />

      <div className="py-1">
        <h3 className="px-3 h-9 flex items-center text-[15px] font-bold text-yt-text">
          {t("subscriptions")}
        </h3>
        {subs.length === 0 && (
          <p className="px-3 py-2 text-[13px] text-yt-sub">{t("notifsEmpty")}</p>
        )}
        {subs.map((s) => (
          <button
            key={s.channel_id}
            onClick={() => onNavigate(`channel:${s.channel_id}`)}
            className="w-full flex items-center gap-5 px-3 h-10 rounded-lg text-sm hover:bg-yt-surface/70 text-start"
          >
            {s.channel_avatar_url ? (
              <img
                src={s.channel_avatar_url}
                alt={s.channel_name}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover shrink-0 bg-yt-surface"
              />
            ) : (
              <span
                className="w-6 h-6 rounded-full grid place-items-center text-[11px] font-bold text-white shrink-0"
                style={{
                  background: `hsl(${
                    [...s.channel_name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
                  } 55% 42%)`,
                }}
              >
                {s.channel_name.charAt(0)}
              </span>
            )}
            <span className="truncate text-yt-text/90">{s.channel_name}</span>
          </button>
        ))}
      </div>

      <hr className="border-yt-border my-2" />

      <div className="py-1">
        <h3 className="px-3 h-9 flex items-center text-[15px] font-bold text-yt-text">
          {t("explore")}
        </h3>
        {EXPLORE.map((e) => (
          <Item
            key={e.id}
            icon={e.icon}
            label={e.label}
            active={active === e.label}
            onClick={() => onNavigate(e.label)}
          />
        ))}
      </div>

      <hr className="border-yt-border my-2" />

      <div className="py-1">
        <Item icon={Settings} label={t("settings")} onClick={onOpenSettings} />
        <Item
          icon={Globe}
          label={`${t("language")}: ${t("languageName")}`}
          onClick={onOpenSettings}
        />
        <Item icon={Flag} label={t("report")} onClick={() => onNavigate(t("report"))} />
        <Item icon={HelpCircle} label={t("help")} onClick={() => onNavigate(t("help"))} />
      </div>

      <div className="px-3 pt-4 text-xs text-yt-sub leading-relaxed">
        <p className="font-bold text-[13px] text-yt-text/80 mb-2">{t("about")}</p>
        <p>{t("terms")}</p>
        <p>{t("howWorks")}</p>
        <p className="mt-3">{t("copyright")}</p>
      </div>
    </div>
  );
}

export default function Sidebar({
  expanded,
  pushable = true,
  active,
  subs,
  customPlaylists = [],
  onNavigate,
  onHome,
  mobileOpen,
  onCloseMobile,
  onOpenSettings,
}: Props) {
  const { t, isAr } = useLanguage();

  return (
    <>
      {/* desktop mini */}
      {pushable && !expanded && (
        <nav className="hidden md:flex fixed top-14 bottom-0 start-0 w-[72px] z-30 bg-yt-bg flex-col items-center pt-1 gap-1 border-e border-yt-border/40">
          <button
            onClick={onHome}
            className={`w-16 py-3.5 rounded-xl flex flex-col items-center gap-1.5 text-[10px] transition-colors ${
              active === "home" || active === t("home")
                ? "bg-yt-surface font-bold text-white"
                : "hover:bg-yt-surface/70 text-yt-sub"
            }`}
          >
            <Home className="w-6 h-6" />
            <span>{t("home")}</span>
          </button>
          <button
            onClick={() => onNavigate(t("shorts"))}
            className="w-16 py-3.5 rounded-xl flex flex-col items-center gap-1.5 text-[10px] hover:bg-yt-surface/70 text-yt-sub transition-colors"
          >
            <ShortsIcon className="w-6 h-6" />
            <span>{t("shorts")}</span>
          </button>
          <button
            onClick={() => onNavigate(t("subscriptions"))}
            className="w-16 py-3.5 rounded-xl flex flex-col items-center gap-1.5 text-[10px] hover:bg-yt-surface/70 text-yt-sub transition-colors"
          >
            <SubscriptionsIcon className="w-6 h-6" />
            <span>{t("subscriptions")}</span>
          </button>
          <button
            onClick={() => onNavigate(t("yourChannel"))}
            className="w-16 py-3.5 rounded-xl flex flex-col items-center gap-1.5 text-[10px] hover:bg-yt-surface/70 text-yt-sub transition-colors"
          >
            <UserRound className="w-6 h-6" />
            <span>{t("you")}</span>
          </button>
        </nav>
      )}

      {/* desktop full */}
      {pushable && expanded && (
        <nav className="hidden md:block fixed top-14 bottom-0 start-0 w-60 z-30 bg-yt-bg overflow-y-auto border-e border-yt-border/40">
          <FullContent
            active={active}
            subs={subs}
            customPlaylists={customPlaylists}
            onNavigate={onNavigate}
            onHome={onHome}
            onOpenSettings={onOpenSettings}
          />
        </nav>
      )}

      {/* drawer (mobile + watch overlay) */}
      <div
        className={`fixed inset-0 z-[55] transition-opacity duration-200 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/60" onClick={onCloseMobile} />
        <aside
          className={`absolute top-0 bottom-0 start-0 w-[280px] max-w-[85vw] bg-yt-bg overflow-y-auto transition-transform duration-250 ease-out border-e border-yt-border ${
            mobileOpen ? "translate-x-0" : isAr ? "translate-x-full" : "-translate-x-full"
          }`}
        >
          <div className="h-14 flex items-center gap-2 px-4 sticky top-0 bg-yt-bg z-10 border-b border-yt-border/30">
            <button
              onClick={onCloseMobile}
              className="w-10 h-10 -ms-2 rounded-full hover:bg-yt-surface grid place-items-center"
              aria-label={t("cancel")}
            >
              <X className="w-5 h-5" />
            </button>
            <LogoIcon className="w-7 h-5" />
            <span className="font-display font-extrabold text-lg">{t("brandName")}</span>
          </div>
          <FullContent
            active={active}
            subs={subs}
            customPlaylists={customPlaylists}
            onNavigate={(l) => {
              onNavigate(l);
              onCloseMobile();
            }}
            onHome={() => {
              onHome();
              onCloseMobile();
            }}
            onOpenSettings={() => {
              onOpenSettings?.();
              onCloseMobile();
            }}
          />
        </aside>
      </div>
    </>
  );
}
