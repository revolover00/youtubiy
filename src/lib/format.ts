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

export function fmtDuration(s?: number): string {
  if (s == null || s <= 0) return "مباشر";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const mm = h ? String(m).padStart(2, "0") : String(m);
  return `${h ? h + ":" : ""}${mm}:${String(sec).padStart(2, "0")}`;
}

export function fmtViews(n?: number | null): string {
  if (n == null || isNaN(n)) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")} مليون`;
  if (n >= 1_000) return `${Math.round(n / 1_000)} ألف`;
  return String(n);
}

const UNIT_DAYS: [RegExp, number][] = [
  [/(\d+)\s*second/i, 1 / 86400],
  [/(\d+)\s*minute/i, 1 / 1440],
  [/(\d+)\s*hour/i, 1 / 24],
  [/(\d+)\s*day/i, 1],
  [/(\d+)\s*week/i, 7],
  [/(\d+)\s*month/i, 30],
  [/(\d+)\s*year/i, 365],
];

export function ageDays(uploaded?: number, uploadedDate?: string): number {
  if (uploaded && uploaded > 0) {
    return Math.max(0, (Date.now() - uploaded) / 86400000);
  }
  if (uploadedDate) {
    for (const [re, days] of UNIT_DAYS) {
      const m = uploadedDate.match(re);
      if (m) return Number(m[1]) * days;
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

export function timeAgoAr(uploaded?: number, uploadedDate?: string): string {
  const d = ageDays(uploaded, uploadedDate);
  if (d < 1 / 1440) return "الآن";
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
