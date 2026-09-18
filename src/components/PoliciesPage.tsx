import { useState } from "react";
import {
  ShieldCheck,
  FileText,
  Lock,
  Scale,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useLanguage } from "../lib/i18n";

interface PoliciesPageProps {
  onBackToHome: () => void;
}

export default function PoliciesPage({ onBackToHome }: PoliciesPageProps) {
  const { isAr, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<"terms" | "privacy" | "copyright" | "google">("terms");

  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  return (
    <div
      className="min-h-screen bg-yt-bg text-yt-text px-4 py-8 md:px-12 max-w-5xl mx-auto"
      dir={dir}
    >
      {/* Header Breadcrumb & Title */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBackToHome}
          className="p-2 -ms-2 rounded-full hover:bg-yt-surface text-yt-sub hover:text-yt-text transition-colors flex items-center gap-1 text-sm font-medium"
          aria-label={isAr ? "الرجوع للرئيسية" : "Back to Home"}
        >
          <BackIcon className="w-5 h-5" />
          <span className="hidden sm:inline">{isAr ? "الرئيسية" : "Home"}</span>
        </button>
        <span className="text-yt-sub">/</span>
        <h1 className="text-xl md:text-2xl font-bold font-display text-white">
          {isAr ? "حقوق الاستخدام والسياسات" : "Terms of Service & Policies"}
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-yt-border scrollbar-none">
        {[
          {
            id: "terms" as const,
            label: isAr ? "شروط الخدمة والاستخدام" : "Terms of Service",
            icon: Scale,
          },
          {
            id: "privacy" as const,
            label: isAr ? "سياسة الخصوصية" : "Privacy Policy",
            icon: Lock,
          },
          {
            id: "copyright" as const,
            label: isAr ? "حقوق الملكية الفكرية و YouTube" : "Copyright & Content",
            icon: FileText,
          },
          {
            id: "google" as const,
            label: isAr ? "خدمات Google Cloud & API" : "Google Cloud & API Policies",
            icon: ShieldCheck,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? "bg-white text-black font-semibold shadow-md"
                  : "bg-yt-surface/60 text-yt-sub hover:text-white hover:bg-yt-surface"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === "terms" && (
          <section className="space-y-6 bg-yt-raised/50 border border-yt-border rounded-2xl p-6 md:p-8">
            <div className="border-b border-yt-border pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-yt-red" />
                <span>{isAr ? "شروط الاستخدام والخدمة" : "Terms of Service"}</span>
              </h2>
              <p className="text-xs text-yt-sub mt-1">
                {isAr ? "آخر تحديث: سبتمبر 2026" : "Last updated: September 2026"}
              </p>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-yt-text/90">
              <div className="p-4 rounded-xl bg-yt-surface/50 border border-yt-border">
                <h3 className="font-bold text-white mb-1.5">
                  {isAr ? "1. طبيعة المنصة والتطبيق" : "1. Nature of the Service"}
                </h3>
                <p>
                  {isAr
                    ? "منصة Youtubiy هي واجهة عرض ويب تفاعلية خفيفة تم تصميمها لتوفير تجربة استعراض وبحث متطورة وتشغيل في الخلفية لمحتوى الفيديو. المنصة لا تستضيف أي ملفات فيديو على خوادم خاصة، بل تعتمد على تقنيات التشغيل الرسمية المعتمدة."
                    : "Youtubiy is an enhanced interactive web client providing an ad-free viewing experience, search, and background playback. It does not host video files on its own servers and relies on authorized playback mechanisms."}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-yt-surface/50 border border-yt-border">
                <h3 className="font-bold text-white mb-1.5">
                  {isAr ? "2. الاستخدام المسموح به" : "2. Permitted Use"}
                </h3>
                <ul className="list-disc list-inside space-y-1 text-yt-sub">
                  <li>
                    {isAr
                      ? "الاستخدام الشخصي وغير التجاري لمشاهدة المقاطع ومتابعة المحتوى."
                      : "Personal, non-commercial use for streaming and discovering video content."}
                  </li>
                  <li>
                    {isAr
                      ? "تنظيم قوائم التشغيل الخاصة وسجل المشاهدة والمقاطع المحفوظة لاحقاً."
                      : "Managing personal playlists, watch history, and liked videos."}
                  </li>
                  <li>
                    {isAr
                      ? "يحظر محاولة التحميل غير المصرح به أو إعادة هندسة الخدمة للإضرار بمصادر البث."
                      : "Unauthorized scraping, distribution, or reverse-engineering is strictly prohibited."}
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-yt-surface/50 border border-yt-border">
                <h3 className="font-bold text-white mb-1.5">
                  {isAr ? "3. شروط أطراف ثالثة (YouTube)" : "3. Third-Party Terms"}
                </h3>
                <p>
                  {isAr
                    ? "باستخدامك لهذا التطبيق، فإنك توافق أيضاً على الالتزام بشروط خدمة YouTube الرسمية وسياسة خصوصية Google."
                    : "By using this application, you also agree to be bound by YouTube's official Terms of Service and Google's Privacy Policy."}
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a
                    href="https://www.youtube.com/t/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline"
                  >
                    <span>{isAr ? "شروط خدمة YouTube الرسمية" : "YouTube Terms of Service"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline"
                  >
                    <span>{isAr ? "سياسة خصوصية Google" : "Google Privacy Policy"}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "privacy" && (
          <section className="space-y-6 bg-yt-raised/50 border border-yt-border rounded-2xl p-6 md:p-8">
            <div className="border-b border-yt-border pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-blue-400" />
                <span>{isAr ? "سياسة الخصوصية وحماية البيانات" : "Privacy & Data Protection"}</span>
              </h2>
              <p className="text-xs text-yt-sub mt-1">
                {isAr
                  ? "نحن نولي حماية خصوصيتك الأولوية القصوى"
                  : "Your privacy is our utmost priority"}
              </p>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-yt-text/90">
              <div className="p-4 rounded-xl bg-yt-surface/50 border border-yt-border">
                <h3 className="font-bold text-white mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? "البيانات المخزنة محلياً" : "Locally Stored Data"}</span>
                </h3>
                <p className="text-yt-sub">
                  {isAr
                    ? "يتم تخزين تفضيلاتك مثل جودة الفيديو، وضع ملء الشاشة، اللغة، والتشغيل في الخلفية محلياً على جهازك في (localStorage / IndexedDB) دون إرسالها لأي جهة إعلانية أو تتبع."
                    : "Your preferences, language selection, playback speed, and quality settings are retained locally on your device without transmitting telemetry to third-party ad brokers."}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-yt-surface/50 border border-yt-border">
                <h3 className="font-bold text-white mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? "بيانات الحساب والمزامنة السحابية" : "Account & Cloud Sync"}</span>
                </h3>
                <p className="text-yt-sub">
                  {isAr
                    ? "عند تسجيل الدخول عبر Google أو حفظ المقاطع والاشتراكات، يتم حفظ هذه البيانات بشكل مشفر عبر Firebase Firestore التابع لمشروعك فقط لضمان مزامنتها عبر أجهزتك المختلفة."
                    : "When signing in via Google, your profile, subscriptions, and playlists are securely synchronized through your private Cloud Firestore instance solely for multi-device sync."}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-yt-surface/50 border border-yt-border">
                <h3 className="font-bold text-white mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? "انعدام التتبع والإعلانات التجسسية" : "No Ad Tracking"}</span>
                </h3>
                <p className="text-yt-sub">
                  {isAr
                    ? "لا يحتوي هذا التطبيق على أي أدوات تتبع تسويقية أو ملفات تعريف ارتباط (cookies) خارجية لأغراض الإعلانات الموجهة."
                    : "This application contains zero commercial advertising trackers, pixels, or behavioral profiling tools."}
                </p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "copyright" && (
          <section className="space-y-6 bg-yt-raised/50 border border-yt-border rounded-2xl p-6 md:p-8">
            <div className="border-b border-yt-border pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>{isAr ? "حقوق الملكية الفكرية والمحتوى" : "Copyright & IP Rights"}</span>
              </h2>
              <p className="text-xs text-yt-sub mt-1">
                {isAr
                  ? "حقوق صانعي المحتوى والعلامات التجارية"
                  : "Content Creators & Trademark Notice"}
              </p>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-yt-text/90">
              <div className="p-4 rounded-xl bg-yt-surface/50 border border-yt-border">
                <h3 className="font-bold text-white mb-1.5">
                  {isAr ? "حقوق صانعي الفيديو والقنوات" : "Content Creators Ownership"}
                </h3>
                <p className="text-yt-sub">
                  {isAr
                    ? "جميع مقاطع الفيديو والعناوين والصور المصغرة والعلامات المائية المعروضة في التطبيق هي ملك لأصحاب القنوات وصناع المحتوى الأصليين، وتخضع لقوانين حقوق النشر المعمول بها عالمياً."
                    : "All videos, audio, titles, thumbnails, and channel metadata presented in this client remain the exclusive intellectual property of their original creators and licensors."}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-yt-surface/50 border border-yt-border">
                <h3 className="font-bold text-white mb-1.5">
                  {isAr ? "العلامات التجارية" : "Trademark Notice"}
                </h3>
                <p className="text-yt-sub">
                  {isAr
                    ? "YouTube وشعار YouTube هما علامتان تجاريتان مملوكتان لشركة Google LLC. هذا التطبيق مستقل ولا يرتبط بشكل رسمي أو تعاقدي حصري مع شركة Google LLC."
                    : "YouTube and the YouTube logo are trademarks of Google LLC. Youtubiy is an independent client interface and is not endorsed by or affiliated with Google LLC."}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{isAr ? "طلب إزالة محتوى (DMCA)" : "Copyright Removal Requests"}</span>
                </div>
                <p>
                  {isAr
                    ? "نظراً لعدم استضافة مقاطع الفيديو على خوادمنا، فإن إزالة أي مقطع من منصة YouTube الأساسية يؤدي فورياً وتلقائياً إلى إزالته من العرض في هذا التطبيق."
                    : "Because no content is hosted on Youtubiy infrastructure, deleting or making a video private on YouTube instantly prevents it from rendering inside this client."}
                </p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "google" && (
          <section className="space-y-6 bg-yt-raised/50 border border-yt-border rounded-2xl p-6 md:p-8">
            <div className="border-b border-yt-border pb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>
                  {isAr ? "خدمات Google Cloud وشروط واجهات البرمجة" : "Google Cloud & API Services"}
                </span>
              </h2>
              <p className="text-xs text-yt-sub mt-1">
                {isAr
                  ? "الامتثال لسياسات Google API Services User Data Policy"
                  : "Google API Services User Data Policy Compliance"}
              </p>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-yt-text/90">
              <div className="p-4 rounded-xl bg-yt-surface/50 border border-yt-border">
                <h3 className="font-bold text-white mb-1.5">
                  {isAr ? "نطاقات الصلاحيات المطلوبة (OAuth Scopes)" : "Requested OAuth Scopes"}
                </h3>
                <p className="text-yt-sub mb-3">
                  {isAr
                    ? "يطلب التطبيق فقط الصلاحيات المصممة للقراءة اللازمة لتشغيل الميزات التي يطلبها المستخدم:"
                    : "The app requests minimum read-only scopes strictly required for user-initiated actions:"}
                </p>
                <div className="font-mono text-xs bg-black/50 p-2.5 rounded-lg border border-yt-border text-emerald-400 space-y-1">
                  <div>https://www.googleapis.com/auth/youtube.readonly</div>
                  <div>openid email profile</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-yt-surface/50 border border-yt-border">
                <h3 className="font-bold text-white mb-1.5">
                  {isAr ? "استخدام البيانات الحصري" : "Limited Use Policy"}
                </h3>
                <p className="text-yt-sub">
                  {isAr
                    ? "يلتزم التطبيق بسياسة الاستخدام المحدود (Google API Services User Data Policy)، بما في ذلك متطلبات الاستخدام المحدود. لا يتم نقل أو بيع أو مشاركة بيانات المستخدم الواردة من Google مع أي نماذج ذكاء اصطناعي أو شركات طرف ثالث."
                    : "Youtubiy's use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements."}
                </p>
                <div className="mt-3">
                  <a
                    href="https://developers.google.com/terms/api-services-user-data-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline"
                  >
                    <span>
                      {isAr
                        ? "Google API Services User Data Policy"
                        : "Google API Services User Data Policy"}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-12 pt-6 border-t border-yt-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-yt-sub">
        <p>© 2026 Youtubiy. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
        <button onClick={onBackToHome} className="text-white hover:underline font-medium">
          {isAr ? "العودة إلى الصفحة الرئيسية" : "Return to Home Feed"}
        </button>
      </div>
    </div>
  );
}
