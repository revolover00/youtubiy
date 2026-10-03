import { useEffect, useState } from "react";
import { Bug, X, Trash2, Copy, Check, Activity, Database } from "lucide-react";
import { clearDebug, getDebug, subscribeDebug, type DebugEntry } from "../lib/debug";
import {
  lastFeedDiagnostics,
  subscribeFeedDiagnostics,
  type FeedDiagnostics,
} from "../lib/recommend";

/**
 * On-screen inspector: shows the raw JSON bodies and Feed Diagnostics.
 */
export default function DebugPanel() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"feed" | "api">("feed");
  const [entries, setEntries] = useState<DebugEntry[]>([]);
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const [feedDiag, setFeedDiag] = useState<FeedDiagnostics | null>(lastFeedDiagnostics);

  useEffect(() => {
    setEntries(getDebug());
    return subscribeDebug(() => {
      setEntries(getDebug());
      setSelected(0);
    });
  }, []);

  useEffect(() => {
    setFeedDiag(lastFeedDiagnostics);
    return subscribeFeedDiagnostics((d) => {
      setFeedDiag(d);
    });
  }, []);

  const entry = entries[selected];

  const copy = async () => {
    const textToCopy =
      tab === "feed"
        ? feedDiag
          ? JSON.stringify(feedDiag, null, 2)
          : ""
        : entry
          ? entry.body
          : "";
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="fixed end-4 bottom-20 md:bottom-4 z-[95] flex flex-col items-end gap-2">
      {open && (
        <div className="dropdown-in w-[min(640px,94vw)] max-h-[75vh] flex flex-col rounded-xl border border-yt-border bg-[#0a0a0a]/97 backdrop-blur shadow-2xl shadow-black/70 overflow-hidden text-xs">
          {/* Header */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-yt-border shrink-0 bg-yt-raised/40">
            <Bug className="w-4 h-4 text-yt-blue" />
            <span className="font-bold">لوحة التصحيح (Debug)</span>

            {/* Tab switch */}
            <div className="ms-2 flex items-center bg-yt-surface rounded-lg p-0.5 border border-yt-border">
              <button
                onClick={() => setTab("feed")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  tab === "feed"
                    ? "bg-yt-blue text-black font-bold"
                    : "text-yt-sub hover:text-yt-text"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>تشخيص الفيد</span>
              </button>
              <button
                onClick={() => setTab("api")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  tab === "api"
                    ? "bg-yt-blue text-black font-bold"
                    : "text-yt-sub hover:text-yt-text"
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>استجابات API</span>
                <span className="text-[10px] opacity-75 font-mono">({entries.length})</span>
              </button>
            </div>

            <div className="ms-auto flex items-center gap-1">
              <button
                onClick={copy}
                disabled={tab === "feed" ? !feedDiag : !entry}
                className="w-7 h-7 rounded-md hover:bg-yt-surface grid place-items-center text-yt-sub hover:text-yt-text disabled:opacity-40"
                aria-label="نسخ"
                title="نسخ كـ JSON"
              >
                {copied ? <Check className="w-4 h-4 text-yt-blue" /> : <Copy className="w-4 h-4" />}
              </button>
              {tab === "api" && (
                <button
                  onClick={() => {
                    clearDebug();
                    setSelected(0);
                  }}
                  className="w-7 h-7 rounded-md hover:bg-yt-surface grid place-items-center text-yt-sub hover:text-red-400"
                  aria-label="مسح"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-md hover:bg-yt-surface grid place-items-center"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TAB 1: FEED DIAGNOSTICS */}
          {tab === "feed" ? (
            <div className="flex-1 overflow-auto p-3 space-y-4">
              {!feedDiag ? (
                <div className="p-8 text-center text-yt-sub">
                  <p>لم يتم بناء الفيد بعد في هذه الجلسة.</p>
                </div>
              ) : (
                <>
                  {/* Summary Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2 rounded-lg bg-yt-surface/60 border border-yt-border">
                      <div className="text-[10px] text-yt-sub">وقت البناء</div>
                      <div className="font-mono font-bold text-yt-text">
                        {new Date(feedDiag.builtAt).toLocaleTimeString()}
                      </div>
                      <div className="text-[10px] text-yt-sub/70 font-mono">
                        {feedDiag.buildMs} ms
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-yt-surface/60 border border-yt-border">
                      <div className="text-[10px] text-yt-sub">طبيعة الفيد</div>
                      <div className="font-bold">
                        {feedDiag.coldStart ? (
                          <span className="text-amber-400">Cold Start (شائع)</span>
                        ) : (
                          <span className="text-emerald-400">مخصص بالكامل</span>
                        )}
                      </div>
                      <div className="text-[10px] text-yt-sub/70 font-mono">
                        {feedDiag.signalCount} إشارة تفاعل
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-yt-surface/60 border border-yt-border">
                      <div className="text-[10px] text-yt-sub">حجم المجمع / الناتج</div>
                      <div className="font-mono font-bold text-yt-text">
                        {feedDiag.poolSize} مرشح ← {feedDiag.finalCount}
                      </div>
                      <div className="text-[10px] text-yt-sub/70 font-mono">
                        مكتوم: {feedDiag.mutedCount}
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-yt-surface/60 border border-yt-border">
                      <div className="text-[10px] text-yt-sub">سلامة المصادر</div>
                      <div className="font-bold">
                        {feedDiag.errors.length > 0 ? (
                          <span className="text-red-400">{feedDiag.errors.length} أخطاء</span>
                        ) : (
                          <span className="text-emerald-400">سليمة 100%</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sources Stats Table */}
                  <div className="rounded-lg border border-yt-border overflow-hidden">
                    <div className="px-3 py-1.5 bg-yt-raised font-bold text-[11px] flex items-center justify-between">
                      <span>حالة مصادر الفيد</span>
                      <span className="text-[10px] text-yt-sub font-mono font-normal">
                        sub / related / interest / trending
                      </span>
                    </div>
                    <table className="w-full text-right border-collapse text-[11px]">
                      <thead>
                        <tr className="border-b border-yt-border bg-yt-surface/40 text-yt-sub font-medium">
                          <th className="p-2 text-right">المصدر</th>
                          <th className="p-2 text-center">ناجح (OK)</th>
                          <th className="p-2 text-center">فاشل (Fail)</th>
                          <th className="p-2 text-center">الحالة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-yt-border/50 font-mono">
                        {[
                          { key: "sub", label: "الاشتراكات (sub)", data: feedDiag.stats.sub },
                          {
                            key: "related",
                            label: "فيديوهات مرتبطة (related)",
                            data: feedDiag.stats.related,
                          },
                          {
                            key: "interest",
                            label: "اهتمامات وبحث (interest)",
                            data: feedDiag.stats.interest,
                          },
                          {
                            key: "trending",
                            label: "الشائع (trending)",
                            data: feedDiag.stats.trending,
                          },
                        ].map((row) => {
                          const isOk = row.data.fail === 0 && row.data.ok > 0;
                          const isFail = row.data.fail > 0;
                          return (
                            <tr key={row.key} className="hover:bg-yt-raised/20">
                              <td className="p-2 font-sans font-medium text-yt-text">
                                {row.label}
                              </td>
                              <td className="p-2 text-center text-emerald-400 font-bold">
                                {row.data.ok}
                              </td>
                              <td className="p-2 text-center">
                                <span
                                  className={
                                    row.data.fail > 0 ? "text-red-400 font-bold" : "text-yt-sub"
                                  }
                                >
                                  {row.data.fail}
                                </span>
                              </td>
                              <td className="p-2 text-center font-sans">
                                {isFail ? (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-300">
                                    تنبيه
                                  </span>
                                ) : isOk ? (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300">
                                    شغال
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-yt-surface text-yt-sub">
                                    غير مستخدم
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Errors if any */}
                  {feedDiag.errors.length > 0 && (
                    <div className="rounded-lg border border-red-500/40 bg-red-950/20 p-2.5 space-y-1.5">
                      <div className="font-bold text-red-400 flex items-center gap-1.5">
                        <span>⚠️ رسائل أخطاء المصادر (أول 5):</span>
                      </div>
                      <div className="space-y-1">
                        {feedDiag.errors.map((err, i) => (
                          <div
                            key={i}
                            className="font-mono text-[11px] text-red-300/90 bg-black/40 px-2 py-1 rounded break-all"
                            dir="ltr"
                          >
                            {err}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top 20 Ranked Videos with Parts & Source */}
                  <div className="rounded-lg border border-yt-border overflow-hidden">
                    <div className="px-3 py-1.5 bg-yt-raised font-bold text-[11px] flex items-center justify-between">
                      <span>أول 20 فيديو مرشح وأسباب ترشيحها (Top 20 Debug)</span>
                      <span className="text-[10px] text-yt-sub font-mono font-normal">
                        Score & Parts Breakdown
                      </span>
                    </div>
                    {feedDiag.top20 && feedDiag.top20.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse text-[11px]">
                          <thead>
                            <tr className="border-b border-yt-border bg-yt-surface/40 text-yt-sub font-medium">
                              <th className="p-2 text-center w-8">#</th>
                              <th className="p-2 text-right min-w-[180px]">الفيديو</th>
                              <th className="p-2 text-center w-24">المصدر</th>
                              <th className="p-2 text-center w-16">الدرجة</th>
                              <th className="p-2 text-right min-w-[200px]">
                                تفاصيل النقاط (Parts)
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-yt-border/50">
                            {feedDiag.top20.map((item, idx) => (
                              <tr key={item.id + idx} className="hover:bg-yt-raised/20">
                                <td className="p-2 text-center text-yt-sub font-mono">{idx + 1}</td>
                                <td
                                  className="p-2 font-medium text-yt-text max-w-[220px] truncate"
                                  title={item.title}
                                >
                                  {item.title}
                                </td>
                                <td className="p-2 text-center font-mono">
                                  <span className="px-1.5 py-0.5 rounded bg-yt-surface text-[10px] text-yt-blue border border-yt-border">
                                    {item.source}
                                  </span>
                                </td>
                                <td className="p-2 text-center font-mono font-bold text-amber-300">
                                  {item.score.toFixed(2)}
                                </td>
                                <td className="p-2 font-mono text-[10px] text-yt-sub">
                                  <div className="flex flex-wrap gap-1">
                                    {Object.entries(item.parts || {}).map(([k, v]) => (
                                      <span
                                        key={k}
                                        className="px-1 py-0.5 rounded bg-black/40 border border-yt-border/40 text-yt-sub"
                                      >
                                        {k.slice(0, 3)}: {(v as number).toFixed(2)}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="p-4 text-center text-yt-sub">
                        لا توجد تفاصيل مرشحات مسجلة (Cold Start)
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            /* TAB 2: RAW API RESPONSES */
            <>
              {entries.length > 1 && (
                <div className="flex gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar border-b border-yt-border shrink-0">
                  {entries.map((e, i) => (
                    <button
                      key={e.at + e.path}
                      onClick={() => setSelected(i)}
                      className={`shrink-0 text-[11px] font-mono px-2.5 py-1 rounded-md border transition-colors ${
                        i === selected
                          ? "bg-yt-blue/15 border-yt-blue/50 text-yt-blue"
                          : "border-yt-border text-yt-sub hover:text-yt-text"
                      }`}
                      dir="ltr"
                    >
                      {e.label}
                    </button>
                  ))}
                </div>
              )}

              {entry ? (
                <>
                  <div
                    className="px-3 py-1.5 text-[11px] font-mono text-yt-sub bg-yt-raised/50 shrink-0 flex items-center gap-3"
                    dir="ltr"
                  >
                    <span
                      className={
                        entry.label.includes("فشل")
                          ? "text-red-400 font-bold"
                          : "text-emerald-400 font-bold"
                      }
                    >
                      {entry.label.includes("فشل") ? "ERR" : "200"}
                    </span>
                    <span className="text-yt-blue">GET</span>
                    <span className="truncate">{entry.path}</span>
                    <span className="ms-auto shrink-0 text-yt-sub/70">
                      {(entry.body.length / 1024).toFixed(1)} KB ·{" "}
                      {new Date(entry.at).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre
                    dir="ltr"
                    className={`flex-1 overflow-auto p-3 text-[11px] leading-relaxed font-mono whitespace-pre-wrap break-all ${
                      entry.label.includes("فشل") ? "text-red-300/90" : "text-emerald-300/90"
                    }`}
                  >
                    {entry.label.includes("فشل") ? entry.body : pretty(entry.body)}
                  </pre>
                </>
              ) : (
                <p className="p-6 text-center text-sm text-yt-sub">
                  لا توجد استجابات بعد — افتح فيديو أو صفحة قناة لالتقاطها
                </p>
              )}
            </>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative w-11 h-11 rounded-full border grid place-items-center shadow-lg shadow-black/50 transition-all active:scale-90 ${
          open
            ? "bg-yt-blue text-black border-yt-blue"
            : entries.length > 0 || feedDiag
              ? "bg-yt-raised border-yt-blue/60 text-yt-blue hover:text-yt-text"
              : "bg-yt-raised border-yt-border text-yt-sub hover:text-yt-text"
        }`}
        aria-label="صندوق تصحيح API"
      >
        <Bug className="w-5 h-5" />
        {(entries.length > 0 || (feedDiag?.errors && feedDiag.errors.length > 0)) && !open && (
          <span className="absolute -top-1 -end-1 min-w-4 h-4 px-1 rounded-full bg-yt-red text-[10px] font-bold grid place-items-center border-2 border-yt-bg">
            {feedDiag?.errors && feedDiag.errors.length > 0 ? "!" : entries.length}
          </span>
        )}
      </button>
    </div>
  );
}

/** Pretty-print when valid JSON, fall back to the raw body otherwise. */
function pretty(body: string): string {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body;
  }
}
