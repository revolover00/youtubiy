import { useState, useRef, useEffect, useCallback } from "react";
import { Maximize2, X, ChevronUp } from "lucide-react";
import type { PipedVideo } from "../lib/types";
import { useLanguage } from "../lib/i18n";

interface Props {
  video: PipedVideo;
  startTime?: number;
  onExpand: () => void;
  onClose: () => void;
  onTimeUpdate?: (time: number) => void;
}

export default function Miniplayer({ video, onExpand, onClose }: Props) {
  const { t, isAr } = useLanguage();
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const dragRef = useRef({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    lastX: 0,
    lastY: 0,
    dragging: false,
    hasMoved: false,
  });

  const notifySlotMove = useCallback(() => {
    window.dispatchEvent(new Event("yt:player-slot-move"));
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Ignore clicks on buttons
    if ((e.target as HTMLElement).closest("button")) return;

    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: rect.left,
      initialY: rect.top,
      lastX: rect.left,
      lastY: rect.top,
      dragging: true,
      hasMoved: false,
    };

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragRef.current.hasMoved = true;
      if (!isDragging) setIsDragging(true);
    }

    if (dragRef.current.hasMoved) {
      const el = containerRef.current;
      const width = el?.offsetWidth || 340;
      const height = el?.offsetHeight || 220;

      const minX = 8;
      const maxX = Math.max(8, window.innerWidth - width - 8);
      const minY = 8;
      const maxY = Math.max(8, window.innerHeight - height - 8);

      const targetX = Math.max(minX, Math.min(maxX, dragRef.current.initialX + dx));
      const targetY = Math.max(minY, Math.min(maxY, dragRef.current.initialY + dy));

      if (el) {
        el.style.position = "fixed";
        el.style.left = `${targetX}px`;
        el.style.top = `${targetY}px`;
        el.style.bottom = "auto";
        el.style.right = "auto";
      }

      const persistentPlayer = document.getElementById("persistent-player");
      if (persistentPlayer) {
        persistentPlayer.style.left = `${targetX}px`;
        persistentPlayer.style.top = `${targetY}px`;
      }

      dragRef.current.lastX = targetX;
      dragRef.current.lastY = targetY;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return;
    const wasMoved = dragRef.current.hasMoved;
    const { lastX, lastY } = dragRef.current;

    dragRef.current.dragging = false;
    dragRef.current.hasMoved = false;
    setIsDragging(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore pointer capture release error
    }

    if (wasMoved) {
      setPosition({ x: lastX, y: lastY });
    }

    notifySlotMove();

    // If it was just a tap without dragging, expand into full watch mode
    if (!wasMoved) {
      onExpand();
    }
  };

  // Keep in bounds on window resize
  useEffect(() => {
    const onResize = () => {
      if (!position) return;
      const el = containerRef.current;
      const width = el?.offsetWidth || 340;
      const height = el?.offsetHeight || 220;
      const maxX = Math.max(8, window.innerWidth - width - 8);
      const maxY = Math.max(8, window.innerHeight - height - 8);

      if (position.x > maxX || position.y > maxY) {
        setPosition({
          x: Math.min(position.x, maxX),
          y: Math.min(position.y, maxY),
        });
        notifySlotMove();
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [position, notifySlotMove]);

  return (
    <div
      id="yt-miniplayer"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={
        position
          ? {
              position: "fixed",
              left: `${position.x}px`,
              top: `${position.y}px`,
              bottom: "auto",
              right: "auto",
            }
          : undefined
      }
      className={`fixed ${
        !position ? "bottom-16 sm:bottom-6 end-2 sm:end-6" : ""
      } z-[45] w-[320px] sm:w-[380px] max-w-[calc(100vw-16px)] rounded-xl overflow-hidden bg-yt-raised border border-yt-border shadow-2xl shadow-black/90 flex flex-col select-none touch-none cursor-grab active:cursor-grabbing transition-shadow ${
        isDragging
          ? "shadow-cyan-500/20 scale-[1.02]"
          : "animate-in slide-in-from-bottom-5 fade-in-50"
      }`}
    >
      {/* Sleek top grab bar indicator for YouTube look */}
      <div className="absolute top-1.5 inset-x-0 z-20 flex justify-center pointer-events-none">
        <div className="w-10 h-1 rounded-full bg-white/50 backdrop-blur-xs shadow-sm" />
      </div>

      {/* Video Container with global player slot */}
      <div className="relative aspect-video bg-black rounded-t-xl overflow-hidden group">
        <div id="miniplayer-player-slot" className="w-full h-full rounded-t-xl overflow-hidden" />

        {/* Top hover action buttons */}
        <div
          className={`absolute top-2 end-2 flex items-center gap-1.5 z-20 transition-opacity duration-150 ${
            hovered || isDragging ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
            className="w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white grid place-items-center shadow-md transition-transform hover:scale-105 active:scale-95"
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
            className="w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white grid place-items-center shadow-md transition-transform hover:scale-105 active:scale-95"
            title={t("closeMiniplayer")}
            aria-label={t("closeMiniplayer")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Miniplayer metadata & control footer */}
      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-yt-raised hover:bg-yt-surface/80 transition-colors">
        <div className="flex-1 min-w-0">
          <h4 className="text-[13px] font-medium leading-snug line-clamp-1 text-yt-text hover:text-white">
            {video.title || t("miniplayer")}
          </h4>
          <p className="text-[11px] text-yt-sub truncate mt-0.5">
            {video.uploaderName || (isAr ? "يوتيوب" : "YouTube")}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
            className="w-8 h-8 rounded-full hover:bg-yt-surface text-yt-sub hover:text-white grid place-items-center transition-colors"
            title={t("expand")}
            aria-label={t("expand")}
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-8 h-8 rounded-full hover:bg-yt-surface text-yt-sub hover:text-white grid place-items-center transition-colors"
            title={t("closeMiniplayer")}
            aria-label={t("closeMiniplayer")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
