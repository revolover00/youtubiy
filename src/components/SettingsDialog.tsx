import { useState } from "react";
import {
  X,
  Globe,
  Moon,
  Trash2,
  Check,
  AlertCircle,
  Play,
  Download,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { useLanguage, type Language } from "../lib/i18n";
import { clearHistory, setBackgroundPlay as persistBackgroundPlay } from "../lib/store";
import { useAppStore, appStore } from "../lib/appStore";
import { usePWA } from "../lib/usePWA";

interface Props {
  open: boolean;
  onClose: () => void;
  onHistoryCleared?: () => void;
  onOpenPolicies?: () => void;
  notify: (msg: string) => void;
}

export default function SettingsDialog({
  open,
  onClose,
  onHistoryCleared,
  onOpenPolicies,
  notify,
}: Props) {
  const { lang, setLang, t, dir, isAr } = useLanguage();
  const [confirmClear, setConfirmClear] = useState(false);
  const { backgroundPlay } = useAppStore();
  const { isInstallable, isInstalled, isIOS, install } = usePWA();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (!open) return null;

  const toggleBackgroundPlay = () => {
    const next = !backgroundPlay;
    appStore.setBackgroundPlay(next);
    persistBackgroundPlay(next);
    notify(t("playbackUpdatedToast"));
  };

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

          {/* Background Play */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-base font-bold text-yt-text">
              <Play className="w-5 h-5 text-yt-blue" />
              <span>{t("settingsBackgroundPlay")}</span>
            </div>
            <p className="text-xs text-yt-sub leading-relaxed">{t("settingsBackgroundPlayDesc")}</p>
            <button
              onClick={toggleBackgroundPlay}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-yt-bg border border-yt-border hover:bg-yt-surface transition-colors"
            >
              <span className="text-sm font-medium">
                {backgroundPlay ? t("enabled") : t("disabled")}
              </span>
              <div
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  backgroundPlay ? "bg-yt-blue" : "bg-yt-surface"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    backgroundPlay ? (isAr ? "right-7" : "left-7") : isAr ? "right-1" : "left-1"
                  }`}
                />
              </div>
            </button>
          </div>

          <hr className="border-yt-border" />

          {/* Install App */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-base font-bold text-yt-text">
              <Smartphone className="w-5 h-5 text-yt-blue" />
              <span>{t("settingsInstallApp")}</span>
            </div>
            <p className="text-xs text-yt-sub leading-relaxed">{t("settingsInstallAppDesc")}</p>

            {isInstalled ? (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-yt-blue/10 border border-yt-blue/20 text-yt-blue">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">{t("settingsInstalled")}</span>
              </div>
            ) : isInstallable ? (
              <button
                onClick={install}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-yt-blue hover:bg-opacity-90 text-black font-bold transition-all shadow-lg shadow-yt-blue/10"
              >
                <Download className="w-4 h-4" />
                <span>{t("install")}</span>
              </button>
            ) : isIOS ? (
              <button
                onClick={() => setShowIOSGuide(true)}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-yt-bg border border-yt-border hover:bg-yt-surface text-yt-text font-medium transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{t("installIOS")}</span>
              </button>
            ) : null}

            {showIOSGuide && (
              <div className="p-4 rounded-xl bg-yt-surface border border-yt-border space-y-3 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold">{t("installIOSHeading")}</h4>
                  <button onClick={() => setShowIOSGuide(false)}>
                    <X className="w-4 h-4 text-yt-sub" />
                  </button>
                </div>
                <div className="text-xs text-yt-sub space-y-2">
                  <p>{t("installIOSStep1")}</p>
                  <p>{t("installIOSStep2")}</p>
                </div>
              </div>
            )}
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
                  <p className="text-xs">{t("confirmClearHistory")}</p>
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
                    {t("yesClearHistory")}
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
                  <span className="text-xs text-yt-sub">{t("clearHistorySubtitle")}</span>
                </div>
                <Trash2 className="w-4 h-4 text-red-400 shrink-0" />
              </button>
            )}
          </div>

          <hr className="border-yt-border" />

          {/* Policies & Copyrights */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-base font-bold text-yt-text">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{isAr ? "الحقوق والسياسات" : "Legal & Policies"}</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenPolicies?.();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-yt-bg border border-yt-border hover:bg-yt-surface transition-colors text-start"
            >
              <div>
                <span className="text-sm font-medium text-white block">
                  {isAr ? "شروط الخدمة، الخصوصية وحقوق الملكية" : "Terms, Privacy & Content Rights"}
                </span>
                <span className="text-xs text-yt-sub">
                  {isAr
                    ? "الاطلاع على سياسات التطبيق، حقوق المحتوى وGoogle API"
                    : "View terms of service, privacy notice and Google API policy"}
                </span>
              </div>
              <ShieldCheck className="w-4 h-4 text-yt-sub shrink-0" />
            </button>
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
