import { useState } from "react";
import { X, Globe, Moon, Trash2, Check, AlertCircle } from "lucide-react";
import { useLanguage, type Language } from "../lib/i18n";
import { clearHistory } from "../lib/store";

interface Props {
  open: boolean;
  onClose: () => void;
  onHistoryCleared?: () => void;
  notify: (msg: string) => void;
}

export default function SettingsDialog({ open, onClose, onHistoryCleared, notify }: Props) {
  const { lang, setLang, t, dir } = useLanguage();
  const [confirmClear, setConfirmClear] = useState(false);

  if (!open) return null;

  const handleClearHistory = async () => {
    await clearHistory();
    setConfirmClear(false);
    onHistoryCleared?.();
    notify(t("settingsClearHistorySuccess"));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-yt-raised border border-yt-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        dir={dir}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-yt-border bg-yt-raised shrink-0">
          <h2 className="text-lg font-bold font-display text-yt-text">{t("settingsTitle")}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-yt-surface grid place-items-center text-yt-sub hover:text-yt-text transition-colors"
            aria-label={t("settingsClose")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-yt-text">
          {/* Language section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-base font-bold text-yt-text">
              <Globe className="w-5 h-5 text-yt-blue" />
              <span>{t("language")}</span>
            </div>
            <p className="text-xs text-yt-sub leading-relaxed">{t("settingsLanguageDesc")}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {[
                { id: "en", name: "English", nativeName: "English (US)", isDefault: true },
                { id: "ar", name: "العربية", nativeName: "العربية (Arabic)", isDefault: false },
              ].map((item) => {
                const selected = lang === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setLang(item.id as Language)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-start ${
                      selected
                        ? "border-yt-blue bg-yt-surface shadow-md font-semibold text-white"
                        : "border-yt-border bg-yt-bg hover:bg-yt-surface text-yt-text/90"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.name}</span>
                        {item.isDefault && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-yt-blue/20 text-yt-blue font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-yt-sub block mt-0.5">{item.nativeName}</span>
                    </div>
                    {selected && (
                      <div className="w-6 h-6 rounded-full bg-yt-blue text-black grid place-items-center shrink-0">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-yt-border" />

          {/* Appearance */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-base font-bold text-yt-text">
              <Moon className="w-5 h-5 text-yt-blue" />
              <span>{t("settingsAppearance")}</span>
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-yt-bg border border-yt-border">
              <span className="text-sm">{t("settingsDarkTheme")}</span>
              <span className="text-xs text-yt-sub font-mono bg-yt-surface px-2 py-1 rounded">
                Dark
              </span>
            </div>
          </div>

          <hr className="border-yt-border" />

          {/* History & Privacy */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-base font-bold text-yt-text">
              <Trash2 className="w-5 h-5 text-yt-red" />
              <span>{t("settingsHistory")}</span>
            </div>
            {confirmClear ? (
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/50 space-y-3">
                <div className="flex items-start gap-2.5 text-red-300">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-xs">
                    {lang === "ar"
                      ? "هل أنت متأكد من رغبتك في محو سجل المشاهدة بالكامل؟ لا يمكن التراجع عن هذا الإجراء."
                      : "Are you sure you want to clear your entire watch history? This action cannot be undone."}
                  </p>
                </div>
                <div className="flex items-center gap-2 justify-end pt-1">
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-3.5 py-1.5 rounded-lg bg-yt-surface hover:bg-yt-hover text-xs font-medium"
                  >
                    {t("cancel")}
                  </button>
                  <button
                    onClick={handleClearHistory}
                    className="px-3.5 py-1.5 rounded-lg bg-yt-red hover:bg-red-600 text-white text-xs font-bold"
                  >
                    {lang === "ar" ? "نعم، امسح السجل" : "Yes, clear history"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-yt-bg border border-yt-border hover:bg-yt-surface transition-colors text-start"
              >
                <div>
                  <span className="text-sm font-medium text-red-400 block">
                    {t("settingsClearHistory")}
                  </span>
                  <span className="text-xs text-yt-sub">
                    {lang === "ar"
                      ? "حذف جميع مقاطع الفيديو التي تمت مشاهدتها من السجل"
                      : "Remove all watched videos from this device"}
                  </span>
                </div>
                <Trash2 className="w-4 h-4 text-red-400 shrink-0" />
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-yt-border bg-yt-raised flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-yt-text text-yt-bg font-bold text-sm hover:bg-opacity-90 transition-all"
          >
            {t("settingsClose")}
          </button>
        </div>
      </div>
    </div>
  );
}
