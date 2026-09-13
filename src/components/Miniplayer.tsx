import { useState } from "react";
import { Maximize2, X, ChevronUp } from "lucide-react";
import YouTubePlayer from "./YouTubePlayer";
import { videoIdFromUrl } from "../lib/format";
import type { PipedVideo } from "../lib/types";
import { useLanguage } from "../lib/i18n";

interface Props {
  video: PipedVideo;
  startTime?: number;
  onExpand: () => void;
  onClose: () => void;
  onTimeUpdate?: (time: number) => void;
}

export default function Miniplayer({ video, startTime, onExpand, onClose, onTimeUpdate }: Props) {
  const { t, isAr } = useLanguage();
  const id = videoIdFromUrl(video.url);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      id="yt-miniplayer"
      className="fixed bottom-16 sm:bottom-6 end-2 sm:end-6 z-[45] w-[320px] sm:w-[380px] max-w-[calc(100vw-16px)] rounded-xl overflow-hidden bg-yt-raised border border-yt-border shadow-2xl shadow-black/90 flex flex-col transition-all duration-200 select-none animate-in slide-in-from-bottom-5 fade-in-50"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Video Container with hover overlay */}
      <div className="relative aspect-video bg-black group">
        <YouTubePlayer
          videoId={id}
          autoplay
          startTime={startTime}
          onTimeUpdate={onTimeUpdate}
          title={video.title}
        />

        {/* Top hover action buttons */}
        <div
          className={`absolute top-2 end-2 flex items-center gap-1.5 z-10 transition-opacity duration-150 ${
            hovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
            className="w-8 h-8 rounded-full bg-black/75 hover:bg-black text-white grid place-items-center shadow-md transition-transform hover:scale-105"
            title={t("expand")}
            aria-label={t("expand")}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-black/75 hover:bg-black text-white grid place-items-center shadow-md transition-transform hover:scale-105"
            title={t("closeMiniplayer")}
            aria-label={t("closeMiniplayer")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Miniplayer metadata & control footer */}
      <div
        onClick={onExpand}
        className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-yt-raised hover:bg-yt-surface/80 cursor-pointer transition-colors"
      >
        <div className="flex-1 min-w-0">
          <h4 className="text-[13px] font-medium leading-snug line-clamp-1 text-yt-text hover:text-white">
            {video.title || t("miniplayer")}
          </h4>
          <p className="text-[11px] text-yt-sub truncate mt-0.5">
            {video.uploaderName || (isAr ? "يوتيوب" : "YouTube")}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onExpand}
            className="w-8 h-8 rounded-full hover:bg-yt-surface text-yt-sub hover:text-white grid place-items-center transition-colors"
            title={t("expand")}
            aria-label={t("expand")}
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-yt-surface text-yt-sub hover:text-white grid place-items-center transition-colors"
            title={t("closeMiniplayer")}
            aria-label={t("closeMiniplayer")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
