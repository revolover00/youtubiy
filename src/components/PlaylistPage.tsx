import { useEffect, useState } from "react";
import { ListVideo, PlayCircle, Shuffle } from "lucide-react";

import { getPlaylist } from "../lib/api";
import type { PipedVideo, PlaylistData } from "../lib/types";
import { EmptyState, ErrorState, SkeletonGrid, VideoCard } from "./Feed";

interface Props {
  playlistId: string;
  title?: string;
  onOpen: (v: PipedVideo) => void;
  onChannel: (id: string, name: string) => void;
  notify: (m: string) => void;
  onDismiss: (id: string) => void;
  isSaved: (id: string) => boolean;
  onSaveLater: (id: string) => void;
}

export default function PlaylistPage(props: Props) {
  const { playlistId } = props;
  const [data, setData] = useState<PlaylistData | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let alive = true;
    setData(null);
    setError(false);
    getPlaylist(playlistId)
      .then((d) => alive && setData(d))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [playlistId, attempt]);

  if (error) {
    return (
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 pt-6">
        <ErrorState onRetry={() => setAttempt((a) => a + 1)} message="تعذّر فتح قائمة التشغيل، حاول مرة أخرى." />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-[1400px] mx-auto px-3 sm:px-6 pt-6">
        <SkeletonGrid count={6} />
      </div>
    );
  }

  const list = data.videos;

  return (
    <div className="max-w-[1400px] mx-auto px-3 sm:px-6 pt-4 lg:pt-6 flex flex-col lg:flex-row gap-6">
      <aside className="lg:w-80 shrink-0">
        <div className="rounded-2xl p-5 text-white relative overflow-hidden bg-yt-raised">
          {data.thumbnail && (
            <img
              src={data.thumbnail}
              alt=""
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
            />
          )}
          <div className="relative">
            <ListVideo className="w-9 h-9 mb-4" />
            <h1 className="font-display font-black text-2xl leading-tight line-clamp-3">{data.title || props.title}</h1>
            <p className="text-sm text-white/80 mt-2">
              {data.uploaderName ? `${data.uploaderName} · ` : ""}
              {data.videoCount || list.length} فيديو
            </p>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => list[0] && props.onOpen(list[0])}
                disabled={!list.length}
                className="flex-1 h-9 rounded-full bg-white text-black text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform"
              >
                <PlayCircle className="w-4 h-4" /> تشغيل الكل
              </button>
              <button
                onClick={() => list.length && props.onOpen(list[Math.floor(Math.random() * list.length)])}
                disabled={!list.length}
                className="w-9 h-9 rounded-full bg-white/20 grid place-items-center disabled:opacity-50"
                aria-label="ترتيب عشوائي"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {list.length === 0 ? (
          <EmptyState message="لا توجد مقاطع في هذه القائمة." />
        ) : (
          <div className="space-y-3">
            {list.map((v, i) => (
              <div key={v.url} className="flex items-center gap-2">
                <span className="w-6 text-center text-sm text-yt-sub shrink-0 tabular-nums">{i + 1}</span>
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
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
