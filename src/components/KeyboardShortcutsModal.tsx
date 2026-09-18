import { X, Keyboard } from "lucide-react";
import { useLanguage } from "../lib/i18n";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function KeyboardShortcutsModal({ open, onClose }: Props) {
  const { isAr } = useLanguage();

  if (!open) return null;

  const shortcuts = [
    {
      keys: ["k", isAr ? "مسافة" : "Space"],
      descAr: "تشغيل / إيقاف مؤقت",
      descEn: "Toggle play / pause",
    },
    { keys: ["j"], descAr: "التراجع 10 ثوانٍ", descEn: "Seek backward 10 seconds" },
    { keys: ["l"], descAr: "التقدم 10 ثوانٍ", descEn: "Seek forward 10 seconds" },
    { keys: ["←"], descAr: "التراجع 5 ثوانٍ", descEn: "Seek backward 5 seconds" },
    { keys: ["→"], descAr: "التقدم 5 ثوانٍ", descEn: "Seek forward 5 seconds" },
    { keys: ["↑"], descAr: "زيادة مستوى الصوت (5%)", descEn: "Volume up (5%)" },
    { keys: ["↓"], descAr: "خفض مستوى الصوت (5%)", descEn: "Volume down (5%)" },
    { keys: ["m"], descAr: "كتم / إلغاء كتم الصوت", descEn: "Toggle mute" },
    { keys: ["f"], descAr: "التبديل إلى ملء الشاشة", descEn: "Toggle full screen" },
    { keys: ["t"], descAr: "التبديل إلى وضع المسرح", descEn: "Toggle theater mode" },
    { keys: ["i"], descAr: "فتح المشغّل المصغّر", descEn: "Toggle miniplayer" },
    {
      keys: ["0", "-", "9"],
      descAr: "الانتقال إلى نسبة محددة (0% - 90%)",
      descEn: "Jump to percentage (0% - 90%)",
    },
    { keys: ["Shift", "+", "N"], descAr: "الانتقال للفيديو التالي", descEn: "Play next video" },
    {
      keys: ["?"],
      descAr: "عرض نافذة اختصارات لوحة المفاتيح",
      descEn: "Show keyboard shortcuts dialog",
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-yt-raised border border-yt-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-yt-border bg-yt-raised shrink-0">
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-5 h-5 text-yt-blue" />
            <h2 className="text-lg font-bold font-display text-yt-text">
              {isAr ? "اختصارات لوحة المفاتيح" : "Keyboard Shortcuts"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-yt-surface grid place-items-center text-yt-sub hover:text-yt-text transition-colors cursor-pointer"
            aria-label={isAr ? "إغلاق" : "Close"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Table */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-1 text-sm text-yt-text divide-y divide-yt-border/40">
          {shortcuts.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 px-2 hover:bg-yt-surface/50 rounded-lg transition-colors gap-4"
            >
              <span className="text-sm font-medium text-yt-text/90">
                {isAr ? item.descAr : item.descEn}
              </span>
              <div className="flex items-center gap-1 shrink-0 font-mono">
                {item.keys.map((k, kIdx) =>
                  k === "+" || k === "-" ? (
                    <span key={kIdx} className="text-xs text-yt-sub px-0.5">
                      {k}
                    </span>
                  ) : (
                    <kbd
                      key={kIdx}
                      className="px-2 py-1 text-xs font-semibold bg-yt-surface border border-yt-border text-yt-text rounded-md shadow-xs"
                    >
                      {k}
                    </kbd>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-yt-border bg-yt-raised flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-yt-surface hover:bg-yt-hover text-yt-text font-bold text-xs transition-all cursor-pointer"
          >
            {isAr ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
