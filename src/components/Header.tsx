import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Search,
  Mic,
  Bell,
  Plus,
  Video as VideoIcon,
  Radio,
  PenLine,
  ArrowRight,
  ArrowLeft,
  X,
  MoreVertical,
  TrendingUp,
  Loader2,
  Settings as SettingsIcon,
  Globe,
  LogIn,
  LogOut,
  Cloud,
  User as UserIcon,
  RefreshCw,
  Youtube,
  Sparkles,
} from "lucide-react";
import { LogoIcon } from "./icons";
import { suggestions, getChannel } from "../lib/api";
import { getSubscriptions } from "../lib/store";
import { fmtDuration } from "../lib/format";
import type { PipedVideo } from "../lib/types";
import { useLanguage } from "../lib/i18n";
import { useAuth } from "../lib/AuthContext";
import { YouTubeImportModal } from "./YouTubeImportModal";

interface Props {
  onToggleSidebar: () => void;
  onHome: () => void;
  inWatch: boolean;
  onBack: () => void;
  onSearch: (q: string) => void;
  /** fired while typing (debounced) so results update live */
  onLiveSearch?: (q: string) => void;
  onOpenSettings?: () => void;
  searchQuery?: string;
}

interface Notif {
  video: PipedVideo;
  channel: string;
}

export default function Header({
  onToggleSidebar,
  onHome,
  inWatch,
  onBack,
  onSearch,
  onLiveSearch,
  onOpenSettings,
  searchQuery,
}: Props) {
  const { lang, setLang, t, isAr } = useLanguage();
  const { user, signIn, signOut, importingYouTube, syncYouTubeData, lastImportResult } = useAuth();
  const [showImportModal, setShowImportModal] = useState(false);
  const [query, setQuery] = useState(searchQuery || "");
  const [mobileSearch, setMobileSearch] = useState(false);
  const [popover, setPopover] = useState<"create" | "bell" | "account" | null>(null);
  const [focused, setFocused] = useState(false);
  const [sugg, setSugg] = useState<string[]>([]);
  const [active, setActive] = useState(-1);
  const [listening, setListening] = useState(false);
  const [notifs, setNotifs] = useState<Notif[] | null>(null);
  const [notifsErr, setNotifsErr] = useState(false);
  const blurTimer = useRef<number | null>(null);
  const suggTimer = useRef<number | null>(null);

  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== query) {
      setQuery(searchQuery);
    }
  }, [searchQuery, query]);

  // live search suggestions (debounced)
  useEffect(() => {
    const q = query.trim();
    setActive(-1);
    if (!q) {
      setSugg([]);
      return;
    }
    if (suggTimer.current) window.clearTimeout(suggTimer.current);
    suggTimer.current = window.setTimeout(async () => {
      const r = await suggestions(q);
      setSugg(r.slice(0, 10));
    }, 180);
  }, [query]);

  // live results while typing — no need to press Enter
  useEffect(() => {
    const q = query.trim();
    if (!onLiveSearch || q.length < 2) return;
    const t = window.setTimeout(() => onLiveSearch(q), 450);
    return () => window.clearTimeout(t);
  }, [query, onLiveSearch]);

  // arrow keys walk the suggestions and complete the input
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!sugg.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const next =
        e.key === "ArrowDown"
          ? (active + 1) % sugg.length
          : (active - 1 + sugg.length) % sugg.length;
      setActive(next);
      setQuery(sugg[next]);
    } else if (e.key === "Escape") {
      setFocused(false);
    }
  };

  const submit = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setFocused(false);
    setMobileSearch(false);
    onSearch(trimmed);
  };

  // real voice input via Web Speech API
  const startListening = () => {
    const SR =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    if (!SR) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = new (SR as any)();
    rec.lang = isAr ? "ar-EG" : "en-US";
    rec.interimResults = false;
    setListening(true);
    rec.onresult = (e: { results: { [k: number]: { [k: number]: { transcript: string } } } }) => {
      const res = e.results[0][0].transcript;
      setQuery(res);
      setListening(false);
      submit(res);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  };

  const openBell = async () => {
    setPopover(popover === "bell" ? null : "bell");
    if (popover === "bell" || notifs !== null) return;
    try {
      const subs = await getSubscriptions();
      if (!subs.length) {
        setNotifs([]);
        return;
      }
      const results = await Promise.allSettled(
        subs.slice(0, 4).map(async (s) => {
          const ch = await getChannel(s.channel_id);
          return { ch, sub: s };
        }),
      );
      const list: Notif[] = [];
      for (const r of results) {
        if (r.status !== "fulfilled") continue;
        const latest = (r.value.ch.relatedStreams || [])[0];
        if (latest) list.push({ video: latest, channel: r.value.sub.channel_name });
      }
      setNotifs(list);
    } catch {
      setNotifsErr(true);
    }
  };

  const showSuggestions = focused && sugg.length > 0 && !inWatch;

  return (
    <>
      <header className="fixed top-0 inset-x-0 h-14 z-50 bg-yt-bg flex items-center justify-between gap-2 px-2 sm:px-4">
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {inWatch ? (
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full hover:bg-yt-surface flex items-center justify-center text-yt-text"
              aria-label={t("back")}
              title={isAr ? "رجوع وتصغير الفيديو" : "Back & minimize"}
            >
              {isAr ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
          ) : (
            <button
              onClick={onToggleSidebar}
              className="hidden md:flex w-10 h-10 rounded-full hover:bg-yt-surface items-center justify-center"
              aria-label={t("menu")}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onHome}
            className="flex items-center gap-1.5 px-1.5 h-10 rounded-lg hover:bg-yt-surface/60 transition-colors"
            aria-label="YouTube"
          >
            <LogoIcon className="w-7 h-5" />
            <span className="font-display font-extrabold text-lg tracking-tight leading-none">
              {t("brandName")}
            </span>
            <sup className="text-[9px] text-yt-sub font-sans font-medium -mt-2 hidden sm:inline">
              {t("countryCode")}
            </sup>
          </button>
          <button
            onClick={onToggleSidebar}
            className="md:hidden w-10 h-10 rounded-full hover:bg-yt-surface flex items-center justify-center"
            aria-label={t("menu")}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* desktop search */}
        <div className="hidden sm:flex flex-1 max-w-[640px] items-center gap-3 mx-2 relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(query);
            }}
            className="flex flex-1 h-10 items-center relative"
          >
            <div className="flex flex-1 items-center h-full rounded-full border border-yt-border bg-yt-bg focus-within:border-yt-blue/70 px-4 transition-colors">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => {
                  if (blurTimer.current) window.clearTimeout(blurTimer.current);
                  setFocused(true);
                }}
                onBlur={() => {
                  blurTimer.current = window.setTimeout(() => setFocused(false), 120);
                }}
                onKeyDown={onKeyDown}
                placeholder={t("searchPlaceholder")}
                className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-yt-sub"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="ms-2 text-yt-sub hover:text-yt-text"
                  aria-label={t("clearSearch")}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="h-full w-16 grid place-items-center rounded-e-full border border-s-0 border-yt-border bg-yt-raised hover:bg-yt-surface transition-colors"
              aria-label={t("searchTooltip")}
            >
              <Search className="w-5 h-5" />
            </button>

            {showSuggestions && (
              <div className="dropdown-in absolute top-11 inset-x-0 z-50 bg-yt-raised rounded-xl border border-yt-border py-2 shadow-2xl shadow-black/70">
                {sugg.map((s, i) => (
                  <button
                    key={i}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setQuery(s);
                      submit(s);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-2 text-start ${i === active ? "bg-yt-surface" : "hover:bg-yt-surface"}`}
                  >
                    <Search className="w-4 h-4 text-yt-sub shrink-0" />
                    <span className="text-sm truncate">{s}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
          <button
            onClick={startListening}
            className="w-10 h-10 rounded-full bg-yt-raised hover:bg-yt-surface grid place-items-center shrink-0 transition-colors"
            aria-label={t("voiceSearchTooltip")}
          >
            <Mic className="w-5 h-5" />
          </button>
        </div>

        {/* end actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => setMobileSearch(true)}
            className="sm:hidden w-10 h-10 rounded-full hover:bg-yt-surface grid place-items-center"
            aria-label={t("searchTooltip")}
          >
            <Search className="w-5 h-5" />
          </button>

          <div className="relative">
            <button
              onClick={() => setPopover(popover === "create" ? null : "create")}
              className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-full bg-yt-raised hover:bg-yt-surface text-sm font-medium transition-colors"
            >
              <Plus className="w-5 h-5" /> {t("create")}
            </button>
            {popover === "create" && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setPopover(null)} />
                <div className="dropdown-in absolute end-0 top-12 z-50 w-56 rounded-xl bg-yt-raised border border-yt-border py-2 shadow-2xl shadow-black/60">
                  {[
                    { icon: VideoIcon, label: t("uploadVideo") },
                    { icon: Radio, label: t("goLive") },
                    { icon: PenLine, label: t("createPost") },
                  ].map((it) => (
                    <button
                      key={it.label}
                      onClick={() => setPopover(null)}
                      className="w-full flex items-center gap-4 px-4 py-2.5 hover:bg-yt-surface text-sm text-start"
                    >
                      <it.icon className="w-5 h-5 shrink-0" /> {it.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              onClick={openBell}
              className="relative w-10 h-10 rounded-full hover:bg-yt-surface grid place-items-center transition-colors"
              aria-label={t("notifications")}
            >
              <Bell className="w-5 h-5" />
              {notifs && notifs.length > 0 && (
                <span className="absolute top-1 end-1 min-w-4 h-4 px-0.5 rounded-full bg-yt-red text-[10px] font-bold grid place-items-center">
                  {notifs.length}
                </span>
              )}
            </button>
            {popover === "bell" && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setPopover(null)} />
                <div className="dropdown-in absolute end-0 top-12 z-50 w-[340px] max-w-[90vw] rounded-xl bg-yt-raised border border-yt-border shadow-2xl shadow-black/60 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-yt-border">
                    <span className="font-display font-bold">{t("notifications")}</span>
                    <button
                      className="w-8 h-8 rounded-full hover:bg-yt-surface grid place-items-center"
                      aria-label="More"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifs === null && (
                      <div className="py-10 grid place-items-center">
                        <Loader2 className="w-6 h-6 animate-spin text-yt-sub" />
                      </div>
                    )}
                    {notifsErr && (
                      <p className="px-4 py-6 text-sm text-yt-sub text-center">
                        {t("notifsError")}
                      </p>
                    )}
                    {notifs && notifs.length === 0 && (
                      <p className="px-4 py-6 text-sm text-yt-sub text-center">
                        {t("notifsEmpty")}
                      </p>
                    )}
                    {notifs?.map((n) => (
                      <button
                        key={n.video.url}
                        onClick={() => {
                          setPopover(null);
                          onSearch("");
                          window.dispatchEvent(new CustomEvent("yt:open", { detail: n.video }));
                        }}
                        className="w-full flex gap-3 px-4 py-3 hover:bg-yt-surface text-start"
                      >
                        <span className="flex-1 min-w-0">
                          <span className="block text-[13px] leading-snug line-clamp-2">
                            <b>{n.channel}</b> {t("uploadedVideo")} {n.video.title}
                          </span>
                          <span className="block text-xs text-yt-sub mt-1">
                            {fmtDuration(n.video.duration, lang)}
                          </span>
                        </span>
                        <img
                          src={n.video.thumbnail}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-[76px] h-[42px] rounded-md object-cover shrink-0"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Account / Settings Menu */}
          <div className="relative flex items-center gap-1.5">
            {!user && (
              <button
                onClick={() => signIn().catch(() => {})}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-yt-blue/40 text-yt-blue hover:bg-yt-blue/10 text-xs sm:text-sm font-semibold transition-colors"
                title={isAr ? "تسجيل الدخول باستخدام Google" : "Sign in with Google"}
              >
                <LogIn className="w-4 h-4" />
                <span>{isAr ? "تسجيل الدخول" : "Sign in"}</span>
              </button>
            )}

            <button
              onClick={() => setPopover(popover === "account" ? null : "account")}
              className="w-8 h-8 rounded-full ms-1 grid place-items-center text-sm font-bold bg-gradient-to-br from-yt-blue to-teal-400 text-black hover:opacity-90 active:scale-95 transition-transform overflow-hidden"
              aria-label={t("account")}
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : user?.displayName ? (
                user.displayName.charAt(0).toUpperCase()
              ) : isAr ? (
                "أ"
              ) : (
                "U"
              )}
            </button>

            {popover === "account" && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setPopover(null)} />
                <div className="dropdown-in absolute end-0 top-12 z-50 w-72 rounded-xl bg-yt-raised border border-yt-border py-2 shadow-2xl shadow-black/70 overflow-hidden text-yt-text">
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-yt-border">
                    <div className="w-10 h-10 rounded-full grid place-items-center font-bold bg-gradient-to-br from-yt-blue to-teal-400 text-black shrink-0 overflow-hidden">
                      {user?.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : user?.displayName ? (
                        user.displayName.charAt(0).toUpperCase()
                      ) : isAr ? (
                        "أ"
                      ) : (
                        "U"
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm truncate">
                        {user ? user.displayName || "User" : isAr ? "زائر" : "Guest"}
                      </p>
                      <p className="text-xs text-yt-sub truncate">
                        {user ? user.email : isAr ? "غير مسجل الدخول" : "Not signed in"}
                      </p>
                    </div>
                  </div>

                  {/* Cloud status banner */}
                  <div className="px-4 py-2 bg-yt-surface/50 text-xs border-b border-yt-border flex items-center justify-between">
                    <div className="flex items-center gap-2 text-yt-sub">
                      <Cloud className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{isAr ? "سحابة Firebase" : "Firebase Cloud"}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {user ? (isAr ? "متزامن" : "Synced") : isAr ? "جاهز" : "Ready"}
                    </span>
                  </div>

                  {/* YouTube Data Sync / Import section */}
                  <div className="px-4 py-3 bg-red-500/10 border-b border-yt-border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Youtube className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="text-xs font-semibold">
                          {isAr ? "اشتراكات YouTube" : "YouTube Channels"}
                        </span>
                      </div>
                      <span className="text-[11px] text-yt-sub">
                        {lastImportResult
                          ? isAr
                            ? `${lastImportResult.importedSubsCount} قناة مستوردة`
                            : `${lastImportResult.importedSubsCount} imported`
                          : user
                            ? isAr
                              ? "حساب Google متصل"
                              : "Google connected"
                            : isAr
                              ? "جاهز للاستيراد"
                              : "Ready"}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setPopover(null);
                        setShowImportModal(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white text-xs font-medium transition-all"
                    >
                      <Youtube className="w-3.5 h-3.5" />
                      <span>
                        {isAr
                          ? "استيراد اشتراكات يوتيوب (Takeout / CSV)"
                          : "Import YouTube Subscriptions"}
                      </span>
                    </button>
                  </div>

                  <div className="py-1">
                    {!user ? (
                      <button
                        onClick={() => {
                          setPopover(null);
                          signIn().catch(() => {});
                        }}
                        className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-yt-surface text-sm text-start font-medium text-yt-blue"
                      >
                        <LogIn className="w-5 h-5 shrink-0" />
                        <div className="min-w-0">
                          <p>{isAr ? "تسجيل الدخول بحساب Google" : "Sign in with Google"}</p>
                          <p className="text-[11px] text-yt-sub">
                            {isAr
                              ? "لحفظ المفضلة والمشاهدات ومزامنة السحابة"
                              : "Save likes, history & sync cloud"}
                          </p>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setPopover(null);
                          signOut().catch(() => {});
                        }}
                        className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-yt-surface text-sm text-start font-medium text-red-400 hover:text-red-300"
                      >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span>{isAr ? "تسجيل الخروج" : "Sign out"}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setPopover(null);
                        onOpenSettings?.();
                      }}
                      className="w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-yt-surface text-sm text-start"
                    >
                      <SettingsIcon className="w-5 h-5 text-yt-sub shrink-0" />
                      <span>{t("settings")}</span>
                    </button>

                    <button
                      onClick={() => {
                        setLang(isAr ? "en" : "ar");
                        setPopover(null);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-yt-surface text-sm text-start"
                    >
                      <div className="flex items-center gap-3.5">
                        <Globe className="w-5 h-5 text-yt-sub shrink-0" />
                        <span>{t("language")}:</span>
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-yt-surface border border-yt-border">
                        {isAr ? "العربية" : "English"}
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* mobile search */}
      {mobileSearch && (
        <div className="fixed inset-0 z-[60] bg-yt-bg sm:hidden flex flex-col">
          <div className="flex items-start gap-2 px-2 h-14 shrink-0">
            <button
              onClick={() => setMobileSearch(false)}
              className="w-10 h-10 my-auto rounded-full hover:bg-yt-surface grid place-items-center"
              aria-label={t("back")}
            >
              {isAr ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(query);
              }}
              className="flex flex-1 h-10 my-auto"
            >
              <div className="flex flex-1 items-center h-full rounded-full bg-yt-raised px-4">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={t("searchPlaceholder")}
                  className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-yt-sub"
                />
                {query && (
                  <button type="button" onClick={() => setQuery("")} aria-label={t("clearSearch")}>
                    <X className="w-5 h-5 text-yt-sub" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="w-14 grid place-items-center rounded-e-full bg-yt-raised"
                aria-label={t("searchTooltip")}
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
            <button
              onClick={startListening}
              className="w-10 h-10 my-auto rounded-full bg-yt-raised grid place-items-center"
              aria-label={t("voiceSearchTooltip")}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {sugg.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(s);
                  submit(s);
                }}
                className="w-full flex items-center gap-4 px-5 py-2.5 hover:bg-yt-surface text-start"
              >
                <TrendingUp className="w-4 h-4 text-yt-sub" />
                <span className="text-sm">{s}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {listening && (
        <div className="fixed inset-0 z-[70] bg-yt-bg/98 backdrop-blur flex flex-col items-center justify-center gap-6">
          <span className="relative">
            <span className="absolute inset-0 rounded-full bg-yt-red/30 animate-ping" />
            <span className="relative w-20 h-20 rounded-full bg-yt-red grid place-items-center">
              <Mic className="w-9 h-9 text-white" />
            </span>
          </span>
          <p className="font-display font-bold text-lg">{t("listening")}</p>
          <p className="text-yt-sub text-sm">{t("speakNow")}</p>
          <button
            onClick={() => setListening(false)}
            className="mt-4 h-9 px-5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium"
          >
            {t("cancel")}
          </button>
        </div>
      )}

      <YouTubeImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} />
    </>
  );
}
