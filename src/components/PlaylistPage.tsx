import { useEffect, useState } from "react";
import { ListVideo, PlayCircle, Shuffle, Trash2 } from "lucide-react";

import { getPlaylist } from "../lib/api";
import { getMeta, getCustomPlaylists, removeFromPlaylist } from "../lib/store";
import type { PipedVideo, PlaylistData, UserPlaylist } from "../lib/types";
import { EmptyState, ErrorState, SkeletonGrid, VideoCard } from "./Feed";
import { useLanguage } from "../lib/i18n";

interface Props {
  playlistId: string;
  title?: string;
  onOpen: (v: PipedVideo) => void;
  onChannel: (id: string, name: string) => void;
  notify: (m: string) => void;
  onDismiss: (id: string) => void;
  isSaved: (id: string) => boolean;
  onSaveLater: (id: string) => void;
  onAddToPlaylist: (v: PipedVideo) => void;
}

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

export default function PlaylistPage(props: Props) {
  const { playlistId } = props;
  const { t, isAr } = useLanguage();
  const [data, setData] = useState<PlaylistData | null>(null);
  const [customData, setCustomData] = useState<UserPlaylist | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const isCustom = playlistId.startsWith("pl_");

  useEffect(() => {
    let alive = true;
    setData(null);
    setCustomData(null);
    setError(false);

    if (isCustom) {
      getCustomPlaylists().then((lists) => {
        if (!alive) return;
        const pl = lists.find((p) => p.id === playlistId);
        if (pl) {
          setCustomData(pl);
        } else {
          setError(true);
        }
      });
    } else {
      getPlaylist(playlistId)
        .then((d) => alive && setData(d))
        .catch(() => alive && setError(true));
    }

    return () => {
      alive = false;
    };
  }, [playlistId, attempt, isCustom]);

  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 pt-6">
        <ErrorState
          onRetry={() => setAttempt((a) => a + 1)}
          message={isAr ? "تعذّر فتح قائمة التشغيل، حاول مرة أخرى." : "Failed to open playlist, try again."}
        />
      </div>
    );
  }

  if (!data && !customData) {
    return (
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 pt-6">
        <SkeletonGrid count={6} />
      </div>
    );
  }

  const list = customData ? idsToVideos(customData.videoIds) : data!.videos;
  const title = customData?.title || data?.title || props.title;
  const thumbnail = customData?.thumbnail || data?.thumbnail;
  const uploader = customData ? (isAr ? "قائمة مخصصة" : "Custom Playlist") : data?.uploaderName;
  const videoCount = customData ? customData.videoIds.length : data?.videoCount || list.length;

  const handleRemove = async (videoId: string) => {
    if (!customData) return;
    await removeFromPlaylist(customData.id, videoId);
    setCustomData((prev) =>
      prev ? { ...prev, videoIds: prev.videoIds.filter((id) => id !== videoId) } : null,
    );
    props.notify(isAr ? "تمت الإزالة من القائمة" : "Removed from playlist");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 pt-4 lg:pt-6 flex flex-col lg:flex-row gap-6">
      <aside className="lg:w-80 shrink-0">
        <div className="rounded-2xl p-5 text-white relative overflow-hidden bg-yt-raised">
          {thumbnail && (
            <img
              src={thumbnail}
              alt=""
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
            />
          )}
          <div className="relative">
            <ListVideo className="w-9 h-9 mb-4" />
            <h1 className="font-display font-black text-2xl leading-tight line-clamp-3">{title}</h1>
            <p className="text-sm text-white/80 mt-2">
              {uploader ? `${uploader} · ` : ""}
              {videoCount} {isAr ? "فيديو" : "videos"}
            </p>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => list[0] && props.onOpen(list[0])}
                disabled={!list.length}
                className="flex-1 h-9 rounded-full bg-white text-black text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform"
              >
                <PlayCircle className="w-4 h-4" /> {isAr ? "تشغيل الكل" : "Play all"}
              </button>
              <button
                onClick={() =>
                  list.length && props.onOpen(list[Math.floor(Math.random() * list.length)])
                }
                disabled={!list.length}
                className="w-9 h-9 rounded-full bg-white/20 grid place-items-center disabled:opacity-50"
                aria-label={isAr ? "ترتيب عشوائي" : "Shuffle"}
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {list.length === 0 ? (
          <EmptyState message={isAr ? "لا توجد مقاطع في هذه القائمة." : "No videos in this playlist."} />
        ) : (
          <div className="space-y-3">
            {list.map((v, i) => (
              <div key={v.url} className="flex items-center gap-2 group">
                <span className="w-6 text-center text-sm text-yt-sub shrink-0 tabular-nums">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <VideoCard
                    video={v}
                    index={i}
                    layout="list"
                    onOpen={props.onOpen}
                    onChannel={props.onChannel}
                    notify={props.notify}
                    onDismiss={props.onDismiss}
                    saved={props.isSaved(v.url.split("v=")[1] || "")}
                    onSaveLater={() => props.onSaveLater(v.url.split("v=")[1] || "")}
                    onAddToPlaylist={() => props.onAddToPlaylist(v)}
                  />
                </div>
                {isCustom && (
                  <button
                    onClick={() => handleRemove(v.url.split("v=")[1])}
                    className="w-9 h-9 rounded-full hover:bg-yt-surface grid place-items-center shrink-0 text-yt-sub opacity-0 group-hover:opacity-100 transition-opacity"
                  >
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
