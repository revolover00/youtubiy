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
  X,
  MoreVertical,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { LogoIcon } from "./icons";
import { suggestions, getChannel } from "../lib/api";
import { getSubscriptions } from "../lib/store";
import { fmtDuration } from "../lib/format";
import type { PipedVideo } from "../lib/types";

interface Props {
  onToggleSidebar: () => void;
  onHome: () => void;
  inWatch: boolean;
  onBack: () => void;
  onSearch: (q: string) => void;
  /** fired while typing (debounced) so results update live */
  onLiveSearch?: (q: string) => void;
}

interface Notif {
  video: PipedVideo;
  channel: string;
}

export default function Header({ onToggleSidebar, onHome, inWatch, onBack, onSearch, onLiveSearch }: Props) {
  const [query, setQuery] = useState("");
  const [mobileSearch, setMobileSearch] = useState(false);
  const [popover, setPopover] = useState<"create" | "bell" | null>(null);
  const [focused, setFocused] = useState(false);
  const [sugg, setSugg] = useState<string[]>([]);
  const [active, setActive] = useState(-1);
  const [listening, setListening] = useState(false);
  const [notifs, setNotifs] = useState<Notif[] | null>(null);
  const [notifsErr, setNotifsErr] = useState(false);
  const blurTimer = useRef<number | null>(null);
  const suggTimer = useRef<number | null>(null);

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
      const next = e.key === "ArrowDown"
        ? (active + 1) % sugg.length
        : (active <= 0 ? sugg.length : active) - 1;
      setActive(next);
      setQuery(sugg[next] ?? query);
    } else if (e.key === "Tab" && sugg[0]) {
      e.preventDefault();
      setQuery(sugg[active >= 0 ? active : 0] ?? query);
    } else if (e.key === "Escape") {
      setFocused(false);
    }
  };

  const submit = (q: string) => {
    const v = q.trim();
    if (!v) return;
    setFocused(false);
    setMobileSearch(false);
    onSearch(v);
  };

  // real voice input via Web Speech API
  const startListening = () => {
    const SR =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
    if (!SR) {
      alert("التعرف الصوتي غير مدعوم في هذا المتصفح");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = new (SR as any)();
    rec.lang = "ar-EG";
    rec.interimResults = false;
    setListening(true);
    rec.onresult = (e: { results: { [k: number]: { [k: number]: { transcript: string } } } }) => {
      const t = e.results[0][0].transcript;
      setQuery(t);
      setListening(false);
      submit(t);
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
        })
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
            <button onClick={onBack} className="md:hidden w-10 h-10 rounded-full hover:bg-yt-surface flex items-center justify-center" aria-label="رجوع">
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={onToggleSidebar} className="hidden md:flex w-10 h-10 rounded-full hover:bg-yt-surface items-center justify-center" aria-label="القائمة">
              <Menu className="w-5 h-5" />
            </button>
          )}
          <button onClick={onHome} className="flex items-center gap-1.5 px-1.5 h-10 rounded-lg hover:bg-yt-surface/60 transition-colors" aria-label="يوتيوب — الرئيسية">
            <LogoIcon className="w-7 h-5" />
            <span className="font-display font-extrabold text-lg tracking-tight leading-none">يوتيوب</span>
            <sup className="text-[9px] text-yt-sub font-sans font-medium -mt-2 hidden sm:inline">EG</sup>
          </button>
          <button onClick={onToggleSidebar} className="md:hidden w-10 h-10 rounded-full hover:bg-yt-surface flex items-center justify-center" aria-label="القائمة">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* desktop search */}
        <div className="hidden sm:flex flex-1 max-w-[640px] items-center gap-3 mx-2 relative">
          <form onSubmit={(e) => { e.preventDefault(); submit(query); }} className="flex flex-1 h-10 items-center relative">
            <div className="flex flex-1 items-center h-full rounded-full border border-yt-border bg-yt-bg focus-within:border-yt-blue/70 px-4 transition-colors">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => { if (blurTimer.current) window.clearTimeout(blurTimer.current); setFocused(true); }}
                onBlur={() => { blurTimer.current = window.setTimeout(() => setFocused(false), 120); }}
                onKeyDown={onKeyDown}
                placeholder="ابحث في يوتيوب"
                className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-yt-sub"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="ms-2 text-yt-sub hover:text-yt-text" aria-label="مسح">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button type="submit" className="h-full w-16 grid place-items-center rounded-e-full border border-s-0 border-yt-border bg-yt-raised hover:bg-yt-surface" aria-label="بحث">
              <Search className="w-5 h-5" />
            </button>

            {showSuggestions && (
              <div className="dropdown-in absolute top-11 inset-x-0 z-50 bg-yt-raised rounded-xl border border-yt-border py-2 shadow-2xl shadow-black/70">
                {sugg.map((s, i) => (
                  <button
                    key={i}
                    onMouseDown={(e) => { e.preventDefault(); setQuery(s); submit(s); }}
                    className={`w-full flex items-center gap-4 px-4 py-2 text-start ${i === active ? "bg-yt-surface" : "hover:bg-yt-surface"}`}
                  >
                    <Search className="w-4 h-4 text-yt-sub shrink-0" />
                    <span className="text-sm truncate">{s}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
          <button onClick={startListening} className="w-10 h-10 rounded-full bg-yt-raised hover:bg-yt-surface grid place-items-center shrink-0" aria-label="البحث الصوتي">
            <Mic className="w-5 h-5" />
          </button>
        </div>

        {/* end actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button onClick={() => setMobileSearch(true)} className="sm:hidden w-10 h-10 rounded-full hover:bg-yt-surface grid place-items-center" aria-label="بحث">
            <Search className="w-5 h-5" />
          </button>

          <div className="relative">
            <button onClick={() => setPopover(popover === "create" ? null : "create")} className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-full bg-yt-raised hover:bg-yt-surface text-sm font-medium">
              <Plus className="w-5 h-5" /> إنشاء
            </button>
            {popover === "create" && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setPopover(null)} />
                <div className="dropdown-in absolute end-0 top-12 z-50 w-56 rounded-xl bg-yt-raised border border-yt-border py-2 shadow-2xl shadow-black/60">
                  {[
                    { icon: VideoIcon, label: "رفع فيديو" },
                    { icon: Radio, label: "بث مباشر" },
                    { icon: PenLine, label: "إنشاء منشور" },
                  ].map((it) => (
                    <button key={it.label} onClick={() => setPopover(null)} className="w-full flex items-center gap-4 px-4 py-2.5 hover:bg-yt-surface text-sm">
                      <it.icon className="w-5 h-5" /> {it.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button onClick={openBell} className="relative w-10 h-10 rounded-full hover:bg-yt-surface grid place-items-center" aria-label="الإشعارات">
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
                    <span className="font-display font-bold">الإشعارات</span>
                    <button className="w-8 h-8 rounded-full hover:bg-yt-surface grid place-items-center" aria-label="المزيد">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifs === null && (
                      <div className="py-10 grid place-items-center"><Loader2 className="w-6 h-6 animate-spin text-yt-sub" /></div>
                    )}
                    {notifsErr && <p className="px-4 py-6 text-sm text-yt-sub text-center">تعذّر تحميل الإشعارات</p>}
                    {notifs && notifs.length === 0 && (
                      <p className="px-4 py-6 text-sm text-yt-sub text-center">اشترك في قنوات لتصلك إشعارات بآخر الفيديوهات</p>
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
                            <b>{n.channel}</b> رفع فيديو: {n.video.title}
                          </span>
                          <span className="block text-xs text-yt-sub mt-1">{fmtDuration(n.video.duration)}</span>
                        </span>
                        <img src={n.video.thumbnail} alt="" referrerPolicy="no-referrer" className="w-[76px] h-[42px] rounded-md object-cover shrink-0" loading="lazy" />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <button className="w-8 h-8 rounded-full ms-1 grid place-items-center text-sm font-bold bg-gradient-to-br from-yt-blue to-teal-400 text-black" aria-label="حسابك">
            أ
          </button>
        </div>
      </header>

      {/* mobile search */}
      {mobileSearch && (
        <div className="fixed inset-0 z-[60] bg-yt-bg sm:hidden flex flex-col">
          <div className="flex items-start gap-2 px-2 h-14 shrink-0">
            <button onClick={() => setMobileSearch(false)} className="w-10 h-10 my-auto rounded-full hover:bg-yt-surface grid place-items-center" aria-label="إغلاق">
              <ArrowRight className="w-5 h-5" />
            </button>
            <form onSubmit={(e) => { e.preventDefault(); submit(query); }} className="flex flex-1 h-10 my-auto">
              <div className="flex flex-1 items-center h-full rounded-full bg-yt-raised px-4">
                <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown} placeholder="ابحث في يوتيوب" className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-yt-sub" />
                {query && (
                  <button type="button" onClick={() => setQuery("")} aria-label="مسح"><X className="w-5 h-5 text-yt-sub" /></button>
                )}
              </div>
              <button type="submit" className="w-14 grid place-items-center rounded-e-full bg-yt-raised" aria-label="بحث"><Search className="w-5 h-5" /></button>
            </form>
            <button onClick={startListening} className="w-10 h-10 my-auto rounded-full bg-yt-raised grid place-items-center" aria-label="بحث صوتي"><Mic className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {sugg.map((s, i) => (
              <button key={i} onClick={() => { setQuery(s); submit(s); }} className="w-full flex items-center gap-4 px-5 py-2.5 hover:bg-yt-surface text-start">
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
            <span className="relative w-20 h-20 rounded-full bg-yt-red grid place-items-center"><Mic className="w-9 h-9 text-white" /></span>
          </span>
          <p className="font-display font-bold text-lg">جارٍ الاستماع...</p>
          <p className="text-yt-sub text-sm">تكلّم الآن وسيتم تحويل كلامك إلى بحث</p>
          <button onClick={() => setListening(false)} className="mt-4 h-9 px-5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium">إلغاء</button>
        </div>
      )}
    </>
  );
}
