import { useEffect, useState } from "react";
import { Bug, X, Trash2, Copy, Check } from "lucide-react";
import { clearDebug, getDebug, subscribeDebug, type DebugEntry } from "../lib/debug";

/**
 * Temporary on-screen inspector: shows the raw JSON bodies returned by
 * the Piped `/streams` and `/channel` endpoints. Safe to delete later —
 * remove this component + its mount in App.tsx and the pushDebug calls.
 */
export default function DebugPanel() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<DebugEntry[]>([]);
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setEntries(getDebug());
    return subscribeDebug(() => {
      setEntries(getDebug());
      setSelected(0);
    });
  }, []);

  const entry = entries[selected];

  const copy = async () => {
    if (!entry) return;
    try {
      await navigator.clipboard.writeText(entry.body);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="fixed end-4 bottom-20 md:bottom-4 z-[95] flex flex-col items-end gap-2">
      {open && (
        <div className="dropdown-in w-[min(560px,92vw)] max-h-[70vh] flex flex-col rounded-xl border border-yt-border bg-[#0a0a0a]/97 backdrop-blur shadow-2xl shadow-black/70 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-yt-border shrink-0">
            <Bug className="w-4 h-4 text-yt-blue" />
            <span className="text-xs font-bold">API Debug — raw JSON</span>
            <span className="text-[10px] text-yt-sub font-mono" dir="ltr">
              {entries.length} response{entries.length === 1 ? "" : "s"}
            </span>
            <div className="ms-auto flex items-center gap-1">
              <button
                onClick={copy}
                disabled={!entry}
                className="w-7 h-7 rounded-md hover:bg-yt-surface grid place-items-center text-yt-sub hover:text-yt-text disabled:opacity-40"
                aria-label="نسخ"
              >
                {copied ? <Check className="w-4 h-4 text-yt-blue" /> : <Copy className="w-4 h-4" />}
              </button>
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
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-md hover:bg-yt-surface grid place-items-center"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

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
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative w-11 h-11 rounded-full border grid place-items-center shadow-lg shadow-black/50 transition-all active:scale-90 ${
          open
            ? "bg-yt-blue text-black border-yt-blue"
            : entries.length > 0
              ? "bg-yt-raised border-yt-blue/60 text-yt-blue hover:text-yt-text"
              : "bg-yt-raised border-yt-border text-yt-sub hover:text-yt-text"
        }`}
        aria-label="صندوق تصحيح API"
      >
        <Bug className="w-5 h-5" />
        {entries.length > 0 && !open && (
          <span className="absolute -top-1 -end-1 min-w-4 h-4 px-1 rounded-full bg-yt-red text-[10px] font-bold grid place-items-center border-2 border-yt-bg">
            {entries.length}
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
