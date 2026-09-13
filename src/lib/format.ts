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

export function fmtDuration(s?: number, lang: "en" | "ar" = "en"): string {
  if (s == null || s <= 0) return lang === "ar" ? "مباشر" : "LIVE";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const mm = h ? String(m).padStart(2, "0") : String(m);
  return `${h ? h + ":" : ""}${mm}:${String(sec).padStart(2, "0")}`;
}

export function fmtViews(n?: number | null, lang: "en" | "ar" = "ar"): string {
  if (n == null || isNaN(n)) return "";
  if (lang === "ar") {
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")} مليار`;
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")} مليون`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")} ألف`;
    return String(n);
  }
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
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

export function ageDays(uploaded?: number, uploadedDate?: string): number {
  if (uploaded && uploaded > 0) {
    return Math.max(0, (Date.now() - uploaded) / 86400000);
  }
  if (uploadedDate) {
    const norm = uploadedDate.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
    for (const [re, days] of UNIT_DAYS) {
      const m = norm.match(re);
      if (m) {
        const count = m[1] ? Number(m[1]) : 1;
        return (count || 1) * days;
      }
    }
  }
  return 30;
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
  lang: "en" | "ar" = "en",
): string {
  const d = ageDays(uploaded, uploadedDate);
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

export function timeAgoAr(uploaded?: number, uploadedDate?: string): string {
  return timeAgo(uploaded, uploadedDate, "ar");
}
