import { LogIn, Sparkles, Youtube, RefreshCw } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { useLanguage } from "../lib/i18n";

export function YouTubeSyncBanner() {
  const { user, signIn, syncYouTubeData, importingYouTube } = useAuth();
  const { isAr } = useLanguage();

  return (
    <div className="mb-6 rounded-2xl overflow-hidden relative group">
      {/* Background with glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-yt-surface to-yt-surface/50 -z-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-2xl" />

      <div className="border border-red-500/10 bg-yt-surface/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute -top-24 -end-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -start-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

        {/* Icon container */}
        <div className="relative shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/20 flex items-center justify-center shadow-inner">
          <Youtube className="w-10 h-10 text-red-500 relative z-10" />
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping opacity-50" />
        </div>

        {/* Content */}
        <div className="flex-1 text-center sm:text-start space-y-3 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wide mb-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            {isAr ? "موجز مخصص لك" : "Personalized Feed"}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-yt-text tracking-tight">
            {isAr ? "استمتع بمحتواك المفضل فوراً" : "Sync Your YouTube Experience"}
          </h2>
          <p className="text-sm text-yt-sub max-w-md mx-auto sm:mx-0 leading-relaxed font-medium">
            {user
              ? isAr
                ? "يبدو أنه لم يتم العثور على اشتراكات. يرجى التأكد من تفعيل YouTube Data API v3 ومنح الأذونات اللازمة، ثم حاول المزامنة مرة أخرى."
                : "It looks like no subscriptions were found. Please make sure YouTube Data API v3 is enabled, then try syncing again."
              : isAr
                ? "سجّل الدخول بحسابك على Google لمزامنة اشتراكاتك تلقائياً وبناء موجز ذكي يعرض لك أفضل المقاطع والقنوات التي تتابعها فعلياً."
                : "Sign in with Google to automatically sync your subscriptions and generate a smart feed tailored to the channels you actually watch."}
          </p>
        </div>

        {/* Action button */}
        <div className="shrink-0 w-full sm:w-auto z-10">
          <button
            onClick={() => (user ? syncYouTubeData().catch(() => {}) : signIn().catch(() => {}))}
            disabled={importingYouTube}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-yt-text hover:bg-white text-yt-bg font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-white/5"
          >
            {user ? <RefreshCw className={`w-5 h-5 shrink-0 ${importingYouTube ? "animate-spin" : ""}`} /> : <LogIn className="w-5 h-5 shrink-0" />}
            <span>
              {importingYouTube
                ? isAr
                  ? "جاري المزامنة..."
                  : "Syncing..."
                : user
                  ? isAr
                    ? "مزامنة البيانات الآن"
                    : "Sync Data Now"
                  : isAr
                    ? "تسجيل الدخول ومزامنة يوتيوب"
                    : "Sign in & Sync YouTube"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
