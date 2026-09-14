export function videoIdFromUrl(u: string): string {
  if (!u) return "";
  const m = u.match(/[?&]v=([\w-]{6,})/);
  if (m) return m[1];
  const yb = u.match(/youtu\.be\/([\w-]{6,})/);
  if (yb) return yb[1];
  const w = u.match(/^\/watch\?v=([\w-]+)/);
  if (w) return w[1];
  return /^[\w-]{11}$/.test(u) ? u : "";
}

export function channelIdFromUrl(u = ""): string {
  const m = u.match(/\/channel\/([\w-]+)/);
  return m ? m[1] : u;
}

export function getCurrentLang(): "en" | "ar" {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("yt_lang");
    if (saved === "ar" || saved === "en") return saved;
  }
  return "en";
}

export function fmtDuration(s?: number): string {
  if (s == null || s <= 0 || isNaN(s)) return "";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const mm = h ? String(m).padStart(2, "0") : String(m);
  return `${h ? h + ":" : ""}${mm}:${String(sec).padStart(2, "0")}`;
}

export function isLiveStream(v?: {
  duration?: number;
  type?: string;
  isLive?: boolean;
  isShort?: boolean;
  title?: string;
  uploadedDate?: string;
  uploaderName?: string;
}): boolean {
  if (!v) return false;
  // If explicitly designated as short, it cannot be a live stream
  if (v.isShort === true || v.type === "shorts" || v.uploaderName === "Shorts") return false;
  if (v.isLive === true || v.type === "live" || v.type === "live_stream") return true;

  const title = (v.title || "").toLowerCase();
  const date = (v.uploadedDate || "").toLowerCase();

  // Shorts tags exclude live status
  if (title.includes("#shorts") || title.includes("#short")) return false;

  const hasLiveKeywords =
    date.includes("مباشر") ||
    date.includes("live") ||
    date.includes("بدأ البث") ||
    date.includes("started streaming") ||
    date.includes("watching") ||
    date.includes("مشاهدة حالياً") ||
    date.includes("يشاهد الآن") ||
    title.includes("بث مباشر") ||
    title.includes("live stream") ||
    title.includes("🔴") ||
    /\b(stream|streaming) now\b/i.test(title) ||
    /\[live\]|\(live\)/i.test(title);

  return (v.duration == null || v.duration === 0) && hasLiveKeywords;
}

export function isShortsVideo(v?: {
  duration?: number;
  type?: string;
  isLive?: boolean;
  isShort?: boolean;
  title?: string;
  url?: string;
  uploaderName?: string;
  uploadedDate?: string;
}): boolean {
  if (!v) return false;
  if (isLiveStream(v)) return false;
  if (v.isShort === true || v.type === "shorts" || v.uploaderName === "Shorts") return true;

  const title = (v.title || "").toLowerCase();
  if (title.includes("#shorts") || title.includes("#short")) return true;
  if (v.url && (v.url.includes("/shorts/") || v.url.includes("shorts="))) return true;

  const dur = v.duration ?? 0;
  return dur > 0 && dur <= 60;
}

export function isStandardVideo(v?: {
  duration?: number;
  type?: string;
  isLive?: boolean;
  isShort?: boolean;
  title?: string;
  url?: string;
  uploaderName?: string;
  uploadedDate?: string;
}): boolean {
  return !isLiveStream(v) && !isShortsVideo(v);
}

export function fmtViews(n?: number | null, lang: "en" | "ar" = getCurrentLang()): string {
  if (n == null || isNaN(n)) return "";
  const formatter = new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  });
  return formatter.format(n);
}

const UNIT_DAYS: [RegExp, number][] = [
  [/(\d+)\s*sec/i, 1 / 86400],
  [/(\d+)\s*min/i, 1 / 1440],
  [/(\d+)\s*hour/i, 1 / 24],
  [/(\d+)\s*day/i, 1],
  [/(\d+)\s*week/i, 7],
  [/(\d+)\s*month/i, 30],
  [/(\d+)\s*year/i, 365],
  // Arabic units
  [/(?:قبل|منذ)?\s*(\d+)?\s*(?:ثانية|ثواني)/, 1 / 86400],
  [/(?:قبل|منذ)?\s*(\d+)?\s*(?:دقيقة|دقائق)/, 1 / 1440],
  [/(?:قبل|منذ)?\s*دقيقتين/, 2 / 1440],
  [/(?:قبل|منذ)?\s*ساعتين/, 2 / 24],
  [/(?:قبل|منذ)?\s*(\d+)?\s*(?:ساعة|ساعات)/, 1 / 24],
  [/(?:قبل|منذ)?\s*يومين/, 2],
  [/(?:قبل|منذ)?\s*(\d+)?\s*(?:يوم|أيام)/, 1],
  [/(?:قبل|منذ)?\s*أسبوعين/, 14],
  [/(?:قبل|منذ)?\s*(\d+)?\s*(?:أسبوع|أسابيع)/, 7],
  [/(?:قبل|منذ)?\s*شهرين/, 60],
  [/(?:قبل|منذ)?\s*(\d+)?\s*(?:شهر|أشهر)/, 30],
  [/(?:قبل|منذ)?\s*سنتين/, 730],
  [/(?:قبل|منذ)?\s*(\d+)?\s*(?:سنة|سنوات)/, 365],
];

const AR_MONTHS: Record<string, number> = {
  يناير: 0,
  فبراير: 1,
  مارس: 2,
  أبريل: 3,
  ابريل: 3,
  مايو: 4,
  يونيو: 5,
  يوليو: 6,
  أغسطس: 7,
  اغسطس: 7,
  سبتمبر: 8,
  أكتوبر: 9,
  اكتوبر: 9,
  نوفمبر: 10,
  ديسمبر: 11,
};

export function cleanDateText(s?: string): string {
  if (!s) return "";
  return s
    .replace(/[\u200e\u200f\u202a-\u202e]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function ageDays(uploaded?: number, uploadedDate?: string): number {
  if (uploaded && uploaded > 0) {
    return Math.max(0, (Date.now() - uploaded) / 86400000);
  }
  if (uploadedDate) {
    const clean = cleanDateText(uploadedDate);
    const norm = clean.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));

    // 1. DD/MM/YYYY or DD-MM-YYYY (e.g. 24/10/2009)
    const dmy = norm.match(/(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/);
    if (dmy) {
      const [, d, m, y] = dmy;
      const dt = new Date(Number(y), Number(m) - 1, Number(d));
      if (!isNaN(dt.getTime())) return Math.max(0, (Date.now() - dt.getTime()) / 86400000);
    }

    // 2. YYYY/MM/DD or YYYY-MM-DD
    const ymd = norm.match(/(\d{4})[/.-](\d{1,2})[/.-](\d{1,2})/);
    if (ymd) {
      const [, y, m, d] = ymd;
      const dt = new Date(Number(y), Number(m) - 1, Number(d));
      if (!isNaN(dt.getTime())) return Math.max(0, (Date.now() - dt.getTime()) / 86400000);
    }

    // 3. Arabic spelled month (e.g. "24 أكتوبر 2009")
    const arMatch = norm.match(/(\d{1,2})\s+([^\s\d]+)\s+(\d{4})/);
    if (arMatch) {
      const [, d, monStr, y] = arMatch;
      const monthIdx = AR_MONTHS[monStr];
      if (monthIdx !== undefined) {
        const dt = new Date(Number(y), monthIdx, Number(d));
        if (!isNaN(dt.getTime())) return Math.max(0, (Date.now() - dt.getTime()) / 86400000);
      }
    }

    // 4. English or standard parseable date string
    const parsedTs = Date.parse(norm);
    if (!isNaN(parsedTs)) {
      return Math.max(0, (Date.now() - parsedTs) / 86400000);
    }

    // 5. Match relative units (hours, days, weeks, months, years)
    for (const [re, days] of UNIT_DAYS) {
      const m = norm.match(re);
      if (m) {
        const count = m[1] ? Number(m[1]) : 1;
        return (count || 1) * days;
      }
    }
  }
  return 0;
}

const AR_UNITS: [number, string, string, string][] = [
  // [unitInDays, singular, dual, plural3to10]
  [365, "سنة", "سنتين", "سنوات"],
  [30, "شهر", "شهرين", "أشهر"],
  [7, "أسبوع", "أسبوعين", "أسابيع"],
  [1, "يوم", "يومين", "أيام"],
  [1 / 24, "ساعة", "ساعتين", "ساعات"],
  [1 / 1440, "دقيقة", "دقيقتين", "دقائق"],
];

const EN_UNITS: [number, string, string][] = [
  [365, "year", "years"],
  [30, "month", "months"],
  [7, "week", "weeks"],
  [1, "day", "days"],
  [1 / 24, "hour", "hours"],
  [1 / 1440, "minute", "minutes"],
];

export function timeAgo(
  uploaded?: number,
  uploadedDate?: string,
  lang: "en" | "ar" = getCurrentLang(),
): string {
  if (uploadedDate) {
    const trimmed = cleanDateText(uploadedDate);
    // If it is already a complete localized relative date phrase, preserve it directly!
    if (
      lang === "ar" &&
      (trimmed.startsWith("قبل ") ||
        trimmed.startsWith("منذ ") ||
        trimmed.startsWith("تم البث ") ||
        trimmed.startsWith("تم إجراء بث مباشر "))
    ) {
      return trimmed;
    }
    if (lang === "en" && (trimmed.endsWith(" ago") || trimmed.startsWith("Streamed "))) {
      return trimmed;
    }
  }

  const d = ageDays(uploaded, uploadedDate);
  if (d <= 0) {
    const clean = cleanDateText(uploadedDate);
    if (clean) return clean;
    return lang === "ar" ? "الآن" : "Just now";
  }
  if (d < 1 / 1440) return lang === "ar" ? "الآن" : "Just now";
  if (lang === "en") {
    for (const [unit, sing, plur] of EN_UNITS) {
      const v = Math.floor(d / unit);
      if (v >= 1) {
        return `${v} ${v === 1 ? sing : plur} ago`;
      }
    }
    return "Just now";
  }
  for (const [unit, one, two, few] of AR_UNITS) {
    const v = Math.floor(d / unit);
    if (v >= 1) {
      if (v === 1) return `قبل ${one}`;
      if (v === 2) return `قبل ${two}`;
      if (v <= 10) return `قبل ${v} ${few}`;
      return `قبل ${v} ${one}`;
    }
  }
  return "الآن";
}

export function timeAgoAr(
  uploaded?: number,
  uploadedDate?: string,
  lang: "en" | "ar" = getCurrentLang(),
): string {
  return timeAgo(uploaded, uploadedDate, lang);
}
