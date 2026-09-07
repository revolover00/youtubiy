import { useEffect, useState } from "react";
import { BadgeCheck, Bell, Search, Share2 } from "lucide-react";
import { getChannel } from "../lib/api";
import { fmtViews, videoIdFromUrl } from "../lib/format";
import type { ChannelData, PipedVideo } from "../lib/types";
import { Avatar, ErrorState, SkeletonGrid, VideoCard } from "./Feed";
import { ShortsIcon } from "./icons";

interface Props {
  channelId: string;
  onOpen: (v: PipedVideo) => void;
  notify: (m: string) => void;
  isSubscribed: boolean;
  onToggleSub: (m: { channelId: string; name: string; avatar?: string }) => void;
  onDismiss: (id: string) => void;
  onOpenShort: (items: PipedVideo[], index: number) => void;
}

const TABS = ["الرئيسية", "الفيديوهات", "شورتس", "قوائم التشغيل", "عن القناة"] as const;
type Tab = (typeof TABS)[number];

export default function ChannelPage({ channelId, onOpen, notify, isSubscribed, onToggleSub, onDismiss, onOpenShort }: Props) {
  const [tab, setTab] = useState<Tab>("الرئيسية");
  const [data, setData] = useState<ChannelData | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setData(null);
    setError(false);
    getChannel(channelId)
      .then((d) => alive && setData(d))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [channelId, attempt]);

  if (error) return <ErrorState onRetry={() => setAttempt((a) => a + 1)} message="تعذّر تحميل بيانات القناة." />;
  if (!data)
    return (
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 pt-4">
        <div className="h-40 rounded-2xl bg-yt-surface animate-pulse mb-8" />
        <SkeletonGrid count={4} />
      </div>
    );

  const videos = (data.relatedStreams || []).filter((v) => v.url?.includes("/watch"));
  const shorts = videos.filter((v) => v.duration > 0 && v.duration <= 60);
  const featured = videos[0];
  const cardProps = (v: PipedVideo, i: number) => ({
    video: v,
    onOpen,
    index: i,
    notify,
    onDismiss,
    onChannel: () => {},
    onSaveLater: () => notify("تم الحفظ للمشاهدة لاحقاً ⏰"),
  });

  return (
    <div className="max-w-[1280px] mx-auto pb-10">
      <div className="h-24 sm:h-40 lg:h-52 mx-3 sm:mx-6 mt-3 rounded-2xl relative overflow-hidden bg-gradient-to-l from-yt-red/40 via-yt-raised to-yt-surface">
        {data.bannerUrl ? (
          <img src={data.bannerUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_30%,white,transparent_40%),radial-gradient(circle_at_80%_70%,white,transparent_35%)]" />
        )}
      </div>

      <div className="px-4 sm:px-8 mt-4 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
        <Avatar src={data.avatarUrl} name={data.name} size="w-20 h-20 sm:w-32 sm:h-32 text-4xl sm:text-6xl" />
        <div className="flex-1 text-center sm:text-start">
          <h1 className="font-display font-black text-2xl sm:text-3xl flex items-center gap-2 justify-center sm:justify-start">
            {data.name}
            {data.verified && <BadgeCheck className="w-5 h-5 text-yt-sub" />}
          </h1>
          <div className="text-sm text-yt-sub mt-1 flex flex-wrap gap-x-2 justify-center sm:justify-start">
            {data.subscriberCount != null && <span>{fmtViews(data.subscriberCount)} مشترك</span>}
            <span>· {videos.length}+ فيديو</span>
          </div>
          <p className="text-sm text-yt-sub mt-2 max-w-xl line-clamp-1 mx-auto sm:mx-0">{data.description}</p>
          <div className="flex items-center gap-2 mt-4 justify-center sm:justify-start">
            <button
              onClick={() => onToggleSub({ channelId, name: data.name, avatar: data.avatarUrl })}
              className={`h-9 px-4 rounded-full text-sm font-bold transition-all active:scale-95 flex items-center gap-2 ${
                isSubscribed ? "bg-yt-surface text-yt-text" : "bg-yt-text text-yt-bg hover:bg-white/80"
              }`}
            >
              {isSubscribed && <Bell className="w-4 h-4" />}
              {isSubscribed ? "مشترك" : "اشتراك"}
            </button>
            <button
              onClick={() => notify("تم نسخ رابط القناة 🔗")}
              className="h-9 px-4 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" /> مشاركة
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 border-b border-yt-border px-2 sm:px-6 sticky top-14 bg-yt-bg z-30">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 px-4 py-3 text-sm font-bold border-b-2 -mb-px transition-colors ${
                tab === t ? "border-yt-text text-yt-text" : "border-transparent text-yt-sub hover:text-yt-text"
              }`}
            >
              {t}
            </button>
          ))}
          <button className="shrink-0 px-3 py-3 text-yt-sub" aria-label="بحث في القناة">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-3 sm:px-6 mt-6">
        {tab === "الرئيسية" && (
          <div className="space-y-8">
            {featured && (
              <div className="rise flex flex-col md:flex-row gap-4 md:gap-6 pb-6 border-b border-yt-border">
                <button onClick={() => onOpen(featured)} className="md:w-[45%] shrink-0 group text-start">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-yt-raised">
                    <img src={featured.thumbnail} alt={featured.title} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                </button>
                <div className="md:pt-2">
                  <span className="text-xs text-yt-sub">فيديو مميّز</span>
                  <h2 className="font-display font-bold text-lg sm:text-xl mt-1 leading-snug">{featured.title}</h2>
                  <p className="text-sm text-yt-sub mt-2">
                    {fmtViews(featured.views) && `${fmtViews(featured.views)} مشاهدة`}
                  </p>
                  <p className="text-sm text-yt-text/80 mt-3 leading-relaxed line-clamp-3">{data.description}</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8">
              {videos.slice(0, 8).map((v, i) => (
                <VideoCard key={videoIdFromUrl(v.url)} {...cardProps(v, i)} />
              ))}
            </div>
          </div>
        )}

        {tab === "الفيديوهات" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8">
            {videos.map((v, i) => (
              <VideoCard key={videoIdFromUrl(v.url)} {...cardProps(v, i)} />
            ))}
          </div>
        )}

        {tab === "شورتس" &&
          (shorts.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {shorts.map((s, i) => (
                <button key={s.url} onClick={() => onOpenShort(shorts, i)} className="group text-start rise" style={{ animationDelay: `${i * 40}ms` }}>
                  <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-yt-raised">
                    <img src={s.thumbnail} alt={s.title} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute top-2 end-2 flex items-center gap-1 text-[11px] font-bold bg-black/50 rounded px-1.5 py-0.5">
                      <ShortsIcon className="w-3 h-3" /> {fmtViews(s.views)}
                    </span>
                  </div>
                  <p className="text-[13px] mt-2 line-clamp-2 leading-snug">{s.title}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-yt-sub text-sm">لا توجد مقاطع قصيرة في هذه القناة</div>
          ))}

        {tab === "قوائم التشغيل" && (
          <div className="py-20 text-center text-yt-sub text-sm">قوائم التشغيل غير متاحة عبر واجهة Piped البرمجية حالياً</div>
        )}

        {tab === "عن القناة" && (
          <div className="max-w-2xl rise">
            <h3 className="font-display font-bold text-lg mb-3">الوصف</h3>
            <p className="text-sm leading-relaxed text-yt-text/90 whitespace-pre-line">{data.description || "لا يوجد وصف."}</p>
            <hr className="border-yt-border my-6" />
            <h3 className="font-display font-bold text-lg mb-3">التفاصيل</h3>
            <ul className="space-y-2.5 text-sm text-yt-sub">
              {data.subscriberCount != null && <li>👥 {fmtViews(data.subscriberCount)} مشترك</li>}
              <li>🎬 {videos.length}+ فيديو منشور</li>
              <li>🆔 {channelId}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
