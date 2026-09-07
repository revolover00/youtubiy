import { useEffect, useState } from "react";
import {
  History,
  Clock,
  ThumbsUp,
  ListVideo,
  Download,
  Flame,
  Music2,
  Gamepad2,
  Newspaper,
  Trophy,
  PlayCircle,
  Trash2,
  Shuffle,
  Loader2,
} from "lucide-react";
import { getTrending, searchVideos } from "../lib/api";
import { TOPIC_QUERY } from "../lib/config";
import { getMeta } from "../lib/store";
import type { PipedVideo } from "../lib/types";
import { EmptyState, ErrorState, SkeletonGrid, VideoCard } from "./Feed";

export type LibraryKey =
  | "السجل"
  | "المشاهدة لاحقاً"
  | "مقاطع أعجبتني"
  | "قوائم التشغيل"
  | "مقاطع الفيديو"
  | "التنزيلات"
  | "الرائج"
  | "الموسيقى"
  | "الألعاب"
  | "الأخبار"
  | "الرياضة";

interface Props {
  page: LibraryKey;
  watchLater: string[];
  liked: string[];
  history: string[];
  onOpen: (v: PipedVideo) => void;
  onChannel: (id: string, name: string) => void;
  notify: (m: string) => void;
  onDismiss: (id: string) => void;
  onRemoveLater: (id: string) => void;
  onClearHistory: () => void;
  isSaved: (id: string) => boolean;
  onSaveLater: (id: string) => void;
}

const META: Record<string, { icon: React.ComponentType<{ className?: string }>; title: string; empty: string; playlist?: boolean }> = {
  "السجل": { icon: History, title: "سجل المشاهدة", empty: "لا يوجد سجل مشاهدة بعد — ابدأ بمشاهدة فيديو!" },
  "المشاهدة لاحقاً": { icon: Clock, title: "المشاهدة لاحقاً", empty: "لم تحفظ أي فيديو بعد. اضغط ⋮ على أي فيديو ثم «المشاهدة لاحقاً».", playlist: true },
  "مقاطع أعجبتني": { icon: ThumbsUp, title: "مقاطع أعجبتني", empty: "لم تعجبك أي مقاطع بعد.", playlist: true },
  "قوائم التشغيل": { icon: ListVideo, title: "قوائم التشغيل", empty: "" },
  "مقاطع الفيديو": { icon: PlayCircle, title: "مقاطع الفيديو الخاصة بك", empty: "" },
  "التنزيلات": { icon: Download, title: "التنزيلات", empty: "لا توجد تنزيلات محفوظة على هذا الجهاز." },
  "الرائج": { icon: Flame, title: "الرائج في مصر", empty: "لا يوجد محتوى رائج حالياً." },
  "الموسيقى": { icon: Music2, title: "الموسيقى", empty: "لا توجد نتائج." },
  "الألعاب": { icon: Gamepad2, title: "الألعاب", empty: "لا توجد نتائج." },
  "الأخبار": { icon: Newspaper, title: "الأخبار", empty: "لا توجد نتائج." },
  "الرياضة": { icon: Trophy, title: "الرياضة", empty: "لا توجد نتائج." },
};

function idsToVideos(ids: string[]): PipedVideo[] {
  return ids
    .map((id) => {
      const m = getMeta(id);
      if (!m) return null;
      return {
        url: `/watch?v=${id}`,
        title: m.title,
        thumbnail: m.thumbnail,
        uploaderName: m.uploaderName,
        uploaderAvatar: m.uploaderAvatar,
        duration: m.duration ?? 0,
      } as PipedVideo;
    })
    .filter(Boolean) as PipedVideo[];
}

const TOPIC_FOR: Record<string, string> = {
  "الموسيقى": TOPIC_QUERY["موسيقى"],
  "الألعاب": TOPIC_QUERY["ألعاب"],
  "الأخبار": "news today",
  "الرياضة": "sports highlights",
};

export default function LibraryPage(props: Props) {
  const { page } = props;
  const meta = META[page] || { icon: ListVideo, title: page, empty: "لا يوجد محتوى." };

  // remote-backed pages (trending + topics)
  const remoteKey = page === "الرائج" ? "__trending" : TOPIC_FOR[page];
  const [remote, setRemote] = useState<PipedVideo[] | null>(null);
  const [remoteErr, setRemoteErr] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!remoteKey) return;
    let alive = true;
    setRemote(null);
    setRemoteErr(false);
    const load = remoteKey === "__trending" ? getTrending() : searchVideos(remoteKey);
    load
      .then((r) => alive && setRemote(r))
      .catch(() => alive && setRemoteErr(true));
    return () => {
      alive = false;
    };
  }, [remoteKey, attempt]);

  const cardProps = (v: PipedVideo, i: number) => ({
    video: v,
    onOpen: props.onOpen,
    index: i,
    notify: props.notify,
    onDismiss: props.onDismiss,
    onChannel: props.onChannel,
    saved: props.isSaved(v.url.split("v=")[1]),
    onSaveLater: () => props.onSaveLater(v.url.split("v=")[1]),
  });

  // ---- Playlists overview ----
  if (page === "قوائم التشغيل") {
    const lists = [
      { key: "المشاهدة لاحقاً" as LibraryKey, name: "المشاهدة لاحقاً", count: props.watchLater.length, thumb: idsToVideos(props.watchLater)[0]?.thumbnail },
      { key: "مقاطع أعجبتني" as LibraryKey, name: "مقاطع أعجبتني", count: props.liked.length, thumb: idsToVideos(props.liked)[0]?.thumbnail },
    ];
    return (
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 pt-4 lg:pt-6">
        <h1 className="font-display font-black text-2xl mb-6 flex items-center gap-3"><ListVideo className="w-7 h-7" /> قوائم التشغيل</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8">
          {lists.map((pl, i) => (
            <button key={pl.name} className="group text-start rise" style={{ animationDelay: `${i * 60}ms` }} onClick={() => (window.dispatchEvent(new CustomEvent("yt:nav", { detail: pl.key })))}>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-yt-raised">
                {pl.thumb ? <img src={pl.thumb} alt={pl.name} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="w-full h-full bg-yt-surface" />}
                <div className="absolute inset-y-0 end-0 w-2/5 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
                  <ListVideo className="w-5 h-5 mb-1" />
                  <span className="font-bold">{pl.count}</span>
                </div>
              </div>
              <h3 className="font-medium text-[15px] mt-2">{pl.name}</h3>
              <p className="text-[13px] text-yt-sub mt-0.5">عرض القائمة</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ---- honest empty pages ----
  if (page === "مقاطع الفيديو" || page === "التنزيلات") {
    return (
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 pt-6">
        <h1 className="font-display font-black text-2xl mb-6 flex items-center gap-3"><meta.icon className="w-7 h-7" /> {meta.title}</h1>
        <EmptyState message={page === "مقاطع الفيديو" ? "هذه واجهة مشاهدة فقط — اربط حسابك لرفع مقاطعك الخاصة" : meta.empty} />
      </div>
    );
  }

  // ---- remote pages ----
  if (remoteKey) {
    return (
      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 pt-4 lg:pt-6">
        <h1 className="font-display font-black text-2xl mb-6 flex items-center gap-3"><meta.icon className="w-7 h-7" /> {meta.title}</h1>
        {remoteErr ? (
          <ErrorState onRetry={() => setAttempt((a) => a + 1)} />
        ) : remote === null ? (
          <SkeletonGrid />
        ) : remote.length === 0 ? (
          <EmptyState message={meta.empty} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8">
            {remote.map((v, i) => (
              <VideoCard key={v.url} {...cardProps(v, i)} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---- local list pages ----
  const ids = page === "السجل" ? props.history : page === "المشاهدة لاحقاً" ? props.watchLater : props.liked;
  const list = idsToVideos(ids);

  if (meta.playlist) {
    return (
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 pt-4 lg:pt-6 flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-80 shrink-0">
          <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{ background: page === "مقاطع أعجبتني" ? "linear-gradient(160deg,#3ea6ff,#1e3a8a)" : "linear-gradient(160deg,#ff0000,#7f1d1d)" }}>
            <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_top,white,transparent_60%)]" />
            <meta.icon className="w-9 h-9 mb-4" />
            <h1 className="font-display font-black text-2xl leading-tight">{meta.title}</h1>
            <p className="text-sm text-white/80 mt-2">{list.length} فيديو محفوظ على هذا الجهاز</p>
            <div className="flex gap-2 mt-5">
              <button onClick={() => list[0] && props.onOpen(list[0])} disabled={!list.length} className="flex-1 h-9 rounded-full bg-white text-black text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform">
                <PlayCircle className="w-4 h-4" /> تشغيل الكل
              </button>
              <button onClick={() => list.length && props.onOpen(list[Math.floor(Math.random() * list.length)])} disabled={!list.length} className="w-9 h-9 rounded-full bg-white/20 grid place-items-center disabled:opacity-50" aria-label="ترتيب عشوائي">
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
        <div className="flex-1 min-w-0">
          {list.length === 0 ? (
            <EmptyState message={meta.empty} />
          ) : (
            <div className="space-y-3">
              {list.map((v, i) => (
                <div key={v.url} className="flex items-center gap-2 group">
                  <span className="w-6 text-center text-sm text-yt-sub shrink-0 tabular-nums">{i + 1}</span>
                  <div className="flex-1 min-w-0"><VideoCard {...cardProps(v, i)} layout="list" /></div>
                  {page === "المشاهدة لاحقاً" && (
                    <button onClick={() => { props.onRemoveLater(v.url.split("v=")[1]); props.notify("تمت الإزالة من المشاهدة لاحقاً"); }} className="w-9 h-9 rounded-full hover:bg-yt-surface grid place-items-center shrink-0 text-yt-sub hover:text-red-400" aria-label="إزالة">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // history
  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 pt-4 lg:pt-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display font-black text-2xl flex items-center gap-3"><meta.icon className="w-7 h-7" /> {meta.title}</h1>
        {list.length > 0 && (
          <button onClick={() => { props.onClearHistory(); props.notify("تم مسح سجل المشاهدة"); }} className="h-9 px-4 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium flex items-center gap-2">
            <Trash2 className="w-4 h-4" /> مسح السجل
          </button>
        )}
      </div>
      {ids.length === 0 ? (
        <EmptyState message={meta.empty} />
      ) : list.length === 0 ? (
        <div className="flex items-center gap-3 text-yt-sub text-sm py-10"><Loader2 className="w-5 h-5 animate-spin" /> جارٍ تحميل بيانات السجل...</div>
      ) : (
        <div className="max-w-4xl space-y-3">
          {list.map((v, i) => (
            <VideoCard key={v.url} {...cardProps(v, i)} layout="list" />
          ))}
        </div>
      )}
    </div>
  );
}
