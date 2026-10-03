import React, { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Youtube,
  RefreshCw,
  ListPlus,
  History,
  Search,
  Trash2,
} from "lucide-react";
import { useLanguage } from "../lib/i18n";
import { useAuth } from "../lib/AuthContext";
import { isPopupClosedError } from "../lib/firebase";
import {
  parseYouTubeSubscriptionsCsv,
  parseYouTubeSubscriptionsJson,
  parseYouTubeChannelsText,
  saveImportedSubscriptions,
  parseYouTubeWatchHistoryJson,
  parseYouTubeSearchHistoryJson,
  saveImportedHistory,
  saveImportedSearches,
  getImportedHistoryCount,
  getImportedSearchesCount,
  clearImportedData,
} from "../lib/youtubeApi";
import type { Subscription } from "../lib/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: (count: number) => void;
}

export function YouTubeImportModal({ isOpen, onClose, onImportSuccess }: Props) {
  const { isAr } = useLanguage();
  const { syncYouTubeData, importingYouTube } = useAuth();

  const [activeTab, setActiveTab] = useState<"file" | "paste" | "oauth">("file");
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileSuccess, setFileSuccess] = useState<number | null>(null);
  const [successSummary, setSuccessSummary] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [importedHistoryCount, setImportedHistoryCount] = useState(() => getImportedHistoryCount());
  const [importedSearchesCount, setImportedSearchesCount] = useState(() =>
    getImportedSearchesCount(),
  );

  const [pastedText, setPastedText] = useState("");
  const [pasteError, setPasteError] = useState<string | null>(null);

  const [oauthError, setOauthError] = useState<string | null>(null);
  const [activationUrl, setActivationUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleClearImportedData = () => {
    clearImportedData();
    setImportedHistoryCount(0);
    setImportedSearchesCount(0);
    setSuccessSummary(
      isAr
        ? "تم مسح سجل المشاهدات والبحثات المستوردة بنجاح."
        : "Imported watch and search history cleared.",
    );
  };

  const handleFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    setFileError(null);
    setFileSuccess(null);
    setSuccessSummary(null);

    let totalSubs = 0;
    let totalWatch = 0;
    let totalSearch = 0;
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const text = await file.text();
        const fname = file.name.toLowerCase();
        const trimmed = text.trim();

        // 1. Check if watch-history.json
        if (
          fname.includes("watch-history") ||
          (trimmed.startsWith("[") &&
            (trimmed.includes('"titleUrl"') ||
              trimmed.includes("watch?v=") ||
              trimmed.includes('"Watched ') ||
              trimmed.includes('"شاهدت ')))
        ) {
          const items = parseYouTubeWatchHistoryJson(trimmed);
          if (items.length > 0) {
            const savedCount = saveImportedHistory(items);
            totalWatch += savedCount;
          } else {
            errors.push(
              isAr
                ? `لم يتم العثور على فيديوهات صالحة في ${file.name}`
                : `No valid videos found in ${file.name}`,
            );
          }
          continue;
        }

        // 2. Check if search-history.json
        if (
          fname.includes("search-history") ||
          (trimmed.startsWith("[") &&
            (trimmed.includes('"Searched for ') || trimmed.includes('"بحثت عن ')))
        ) {
          const queries = parseYouTubeSearchHistoryJson(trimmed);
          if (queries.length > 0) {
            const savedCount = saveImportedSearches(queries);
            totalSearch += savedCount;
          } else {
            errors.push(
              isAr
                ? `لم يتم العثور على عمليات بحث صالحة في ${file.name}`
                : `No valid search queries found in ${file.name}`,
            );
          }
          continue;
        }

        // 3. Subscriptions (CSV or JSON)
        let subs: Subscription[] = [];
        if (fname.endsWith(".json") || trimmed.startsWith("{") || trimmed.startsWith("[")) {
          subs = parseYouTubeSubscriptionsJson(trimmed);
        } else {
          subs = parseYouTubeSubscriptionsCsv(trimmed);
          if (subs.length === 0) {
            subs = parseYouTubeChannelsText(trimmed);
          }
        }

        if (subs.length > 0) {
          await saveImportedSubscriptions(subs);
          totalSubs += subs.length;
        } else {
          errors.push(
            isAr
              ? `تعذر استخراج بيانات من الملف ${file.name}`
              : `Could not parse data from ${file.name}`,
          );
        }
      } catch (err) {
        console.warn(`Error reading file ${file.name}:`, err);
        errors.push(
          isAr ? `خطأ أثناء قراءة الملف ${file.name}` : `Error reading file ${file.name}`,
        );
      }
    }

    setImportedHistoryCount(getImportedHistoryCount());
    setImportedSearchesCount(getImportedSearchesCount());

    if (totalSubs > 0 || totalWatch > 0 || totalSearch > 0) {
      const parts: string[] = [];
      if (totalSubs > 0) parts.push(isAr ? `${totalSubs} قناة` : `${totalSubs} channels`);
      if (totalWatch > 0)
        parts.push(isAr ? `${totalWatch} مشاهدة` : `${totalWatch} watch history items`);
      if (totalSearch > 0)
        parts.push(isAr ? `${totalSearch} استعلام بحث` : `${totalSearch} search queries`);

      const summary = isAr
        ? `تم بنجاح استيراد: ${parts.join("، و ")}!`
        : `Successfully imported: ${parts.join(", and ")}!`;

      setSuccessSummary(summary);
      if (totalSubs > 0) {
        setFileSuccess(totalSubs);
        onImportSuccess?.(totalSubs);
      }
      setTimeout(() => {
        onClose();
      }, 2200);
    } else if (errors.length > 0) {
      setFileError(errors.join(" | "));
    } else {
      setFileError(
        isAr
          ? "لم يتم العثور على بيانات صالحة في الملفات المحددة."
          : "No valid data found in selected files.",
      );
    }

    setIsProcessing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handlePasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasteError(null);
    if (!pastedText.trim()) {
      setPasteError(
        isAr
          ? "يرجى لصق روابط أو معرفات القنوات أولاً."
          : "Please paste channel links or IDs first.",
      );
      return;
    }
    setIsProcessing(true);
    try {
      let subs = parseYouTubeSubscriptionsCsv(pastedText);
      if (subs.length === 0) {
        subs = parseYouTubeSubscriptionsJson(pastedText);
      }
      if (subs.length === 0) {
        subs = parseYouTubeChannelsText(pastedText);
      }
      if (subs.length === 0) {
        setPasteError(
          isAr
            ? "لم يتم التعرف على روابط قنوات يوتيوب. تأكد من إدخال روابط مثل: https://www.youtube.com/channel/UC... أو معرفات تبدأ بـ UC"
            : "No channel links detected. Make sure to enter links like https://www.youtube.com/channel/UC...",
        );
        return;
      }
      await saveImportedSubscriptions(subs);
      setFileSuccess(subs.length);
      onImportSuccess?.(subs.length);
      setTimeout(() => {
        onClose();
      }, 1600);
    } catch {
      setPasteError(isAr ? "حدث خطأ أثناء معالجة القنوات." : "Failed to import channels.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOAuthSync = async () => {
    setOauthError(null);
    setActivationUrl(null);
    try {
      const result = await syncYouTubeData();
      if (result && result.importedSubsCount > 0) {
        setFileSuccess(result.importedSubsCount);
        onImportSuccess?.(result.importedSubsCount);
        setTimeout(() => {
          onClose();
        }, 1600);
      }
    } catch (err: unknown) {
      if (isPopupClosedError(err)) {
        setOauthError(isAr ? "تم إغلاق نافذة تسجيل الدخول." : "Login window was closed.");
        setActivationUrl(null);
      } else {
        console.warn("Direct OAuth notice:", err);
        const errMessage = err instanceof Error ? err.message : String(err);
        const errObj = err as { activationUrl?: string; code?: string } | null;

        if (
          errMessage.includes("SERVICE_DISABLED") ||
          errMessage.includes("has not been used in project") ||
          errMessage.includes("before or it is disabled")
        ) {
          setOauthError(
            isAr
              ? "خدمة YouTube Data API v3 غير مفعلة حالياً في مشروع Google Cloud (المشروع 998894461308). يرجى تفعيلها من الرابط أدناه ثم المحاولة، أو استخدم خيار (ملف Google Takeout) بالأعلى للاستيراد الفوري مجاناً دون الحاجة لأي تفعيل!"
              : "YouTube Data API v3 is not enabled in Google Cloud project 998894461308. Please enable it using the link below, or switch to Google Takeout tab for instant sync!",
          );
          setActivationUrl(
            errObj?.activationUrl ||
              "https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=998894461308",
          );
        } else {
          setActivationUrl(null);
          setOauthError(
            isAr
              ? "تم رفض الإذن (خطأ 403): تطبيق Google هذا في وضع الاختبار (Testing Mode) ويتطلب اعتماداً رسمياً أو إضافة بريدك كمختبر في Google Cloud Console. نوصيك باستخدام خيار (رفع ملف Google Takeout CSV) فوراً دون أي قيود!"
              : "Access Denied (403): This Google App is in Testing Mode and requires developer approval or verification. Please use the Google Takeout CSV upload option instead for 100% instant sync!",
          );
        }
      }
    }
  };

  return (
    <div
      id="yt-import-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="yt-import-modal-card"
        className="relative w-full max-w-lg bg-yt-nav border border-yt-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-yt-border bg-yt-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600/15 flex items-center justify-center text-red-500">
              <Youtube className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-yt-text">
                {isAr ? "استيراد اشتراكات وقنوات YouTube" : "Import YouTube Subscriptions"}
              </h3>
              <p className="text-xs text-yt-sub">
                {isAr
                  ? "لمزامنة خلاصتك واشتراكاتك المفضلة فوراً"
                  : "Sync your personal feed and favorite channels"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-yt-hover text-yt-sub hover:text-yt-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-yt-border px-6 bg-yt-surface/30">
          <button
            onClick={() => setActiveTab("file")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "file"
                ? "border-red-500 text-red-500"
                : "border-transparent text-yt-sub hover:text-yt-text"
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isAr ? "ملف Google Takeout (موصى به)" : "Takeout CSV (Recommended)"}</span>
          </button>
          <button
            onClick={() => setActiveTab("paste")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "paste"
                ? "border-red-500 text-red-500"
                : "border-transparent text-yt-sub hover:text-yt-text"
            }`}
          >
            <ListPlus className="w-4 h-4" />
            <span>{isAr ? "لصق روابط" : "Paste Links"}</span>
          </button>
          <button
            onClick={() => setActiveTab("oauth")}
            className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === "oauth"
                ? "border-red-500 text-red-500"
                : "border-transparent text-yt-sub hover:text-yt-text"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isAr ? "مزامنة حساب Google" : "Direct OAuth"}</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Imported History & Searches Stats Bar */}
          <div className="p-3 bg-yt-surface rounded-xl border border-yt-border flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4 text-yt-sub">
              <div className="flex items-center gap-1.5">
                <History className="w-4 h-4 text-sky-400" />
                <span>{isAr ? "المشاهدات المستوردة:" : "Imported Views:"}</span>
                <span className="font-semibold text-yt-text">{importedHistoryCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Search className="w-4 h-4 text-amber-400" />
                <span>{isAr ? "البحثات المستوردة:" : "Imported Searches:"}</span>
                <span className="font-semibold text-yt-text">{importedSearchesCount}</span>
              </div>
            </div>
            {(importedHistoryCount > 0 || importedSearchesCount > 0) && (
              <button
                type="button"
                onClick={handleClearImportedData}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-medium transition-colors"
                title={
                  isAr ? "مسح المشاهدات والبحثات المستوردة" : "Clear imported history & searches"
                }
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isAr ? "مسح البيانات المستوردة" : "Clear Imported"}</span>
              </button>
            )}
          </div>

          {(successSummary || fileSuccess !== null) && (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <div>
                <p className="font-semibold text-sm">
                  {successSummary ||
                    (isAr
                      ? `تم بنجاح استيراد ${fileSuccess} قناة إلى اشتراكاتك!`
                      : `Successfully imported ${fileSuccess} channels!`)}
                </p>
                <p className="text-[11px] text-emerald-300/80">
                  {isAr
                    ? "تم تحديث خلاصتك الشخصية وقائمة الاشتراكات وبروفايل الذوق."
                    : "Your feed, subscriptions, and taste profile have been updated."}
                </p>
              </div>
            </div>
          )}

          {activeTab === "file" && (
            <div className="space-y-4">
              <div className="p-3 bg-yt-surface/70 rounded-xl border border-yt-border text-xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 font-medium text-yt-text">
                    <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-[11px] font-bold shrink-0">
                      1
                    </span>
                    <span>
                      {isAr ? "ملفات Google Takeout المدعومة:" : "Supported Google Takeout files:"}
                    </span>
                  </div>
                  <a
                    href="https://takeout.google.com/takeout/custom/youtube"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-medium underline shrink-0 text-[11px]"
                  >
                    <span>{isAr ? "فتح Google Takeout" : "Open Takeout"}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-yt-sub text-[11px] leading-relaxed">
                  {isAr
                    ? "يمكنك رفع ملف subscriptions.csv (الاشتراكات)، أو watch-history.json (سجل المشاهدة)، أو search-history.json (سجل البحث)، أو اختيار أكثر من ملف معاً لبناء بروفايل ذوق فوري!"
                    : "You can upload subscriptions.csv, watch-history.json, or search-history.json, or select multiple files together to build your taste profile instantly!"}
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all ${
                  dragOver
                    ? "border-red-500 bg-red-500/10 scale-[1.01]"
                    : "border-yt-border hover:border-red-500/60 hover:bg-yt-surface/50"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".csv,.json,.txt"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-yt-surface flex items-center justify-center text-yt-sub group-hover:text-red-400">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-yt-text">
                    {isProcessing
                      ? isAr
                        ? "جاري معالجة وحفظ الملفات..."
                        : "Processing & saving files..."
                      : isAr
                        ? "اسحب وأفلت ملفات Takeout هنا"
                        : "Drag & drop your Takeout files here"}
                  </p>
                  <p className="text-xs text-yt-sub mt-1">
                    {isAr
                      ? "اختر subscriptions.csv و watch-history.json و search-history.json"
                      : "Select subscriptions.csv, watch-history.json, or search-history.json"}
                  </p>
                </div>
              </div>

              {fileError && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{fileError}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === "paste" && (
            <form onSubmit={handlePasteSubmit} className="space-y-3">
              <p className="text-xs text-yt-sub">
                {isAr
                  ? "الصق روابط قنوات يوتيوب أو معرفات القنوات (واحد في كل سطر أو مفصولة بفواصل):"
                  : "Paste YouTube channel URLs or channel IDs (one per line or separated by commas):"}
              </p>
              <textarea
                rows={5}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="https://www.youtube.com/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw&#10;UCBR8-60-B28hp2BmDPdntcQ&#10;https://www.youtube.com/@mkbhd"
                className="w-full bg-yt-surface border border-yt-border rounded-xl p-3 text-xs text-yt-text focus:outline-none focus:border-red-500 transition-colors font-mono resize-none"
              />

              {pasteError && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{pasteError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing || !pastedText.trim()}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white text-xs font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ListPlus className="w-4 h-4" />
                )}
                <span>{isAr ? "استيراد القنوات المكتوبة" : "Import Pasted Channels"}</span>
              </button>
            </form>
          )}

          {activeTab === "oauth" && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 space-y-2">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    {isAr
                      ? "تنبيه هام حول خطأ 403 من Google:"
                      : "Important note about Google 403 error:"}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-200/90">
                  {isAr
                    ? "تفرض Google قيوداً أمنية صارمة على واجهة YouTube API وتمنع الحسابات غير المسجلة كمختبرين في Google Cloud Console من منح إذن القراءة التلقائي للتطبيقات التي لم تكمل المراجعة الرسمية. إذا ظهرت لك رسالة الخطأ 403 access_denied، استخدم تبويب (ملف Google Takeout) بالأعلى للاستيراد الفوري مجاناً وبأمان تام."
                    : "Google restricts YouTube API read access in test mode apps. If you see 403 access_denied, switch to the Takeout CSV tab to import with 1 click."}
                </p>
              </div>

              {oauthError && (
                <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{oauthError}</span>
                  </div>
                  {activationUrl && (
                    <a
                      href={activationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium text-xs border border-red-500/30 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>
                        {isAr
                          ? "تفعيل YouTube Data API v3 في Google Cloud Console"
                          : "Enable YouTube Data API v3 in Google Cloud"}
                      </span>
                    </a>
                  )}
                </div>
              )}

              <button
                disabled={importingYouTube}
                onClick={handleOAuthSync}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white text-xs font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
              >
                <RefreshCw className={`w-4 h-4 ${importingYouTube ? "animate-spin" : ""}`} />
                <span>
                  {importingYouTube
                    ? isAr
                      ? "جاري الاتصال وسحب الاشتراكات..."
                      : "Connecting and syncing..."
                    : isAr
                      ? "محاولة المزامنة المباشرة مع يوتيوب"
                      : "Attempt Direct YouTube OAuth Sync"}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-yt-border bg-yt-surface/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-yt-surface hover:bg-yt-hover text-yt-text text-xs font-medium transition-colors"
          >
            {isAr ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
