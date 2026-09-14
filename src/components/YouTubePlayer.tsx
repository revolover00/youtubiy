import { useEffect, useRef, useMemo } from "react";
import { useAppStore } from "../lib/appStore";
import { useLanguage } from "../lib/i18n";

interface Props {
  videoId: string;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  title?: string;
  startTime?: number;
  onTimeUpdate?: (currentTime: number) => void;
}

/**
 * Clean, Genuine YouTube Player
 * Directly uses YouTube's official player engine and UI controls
 * Ensures 100% authenticity, zero duplicate layers, and zero sync bugs.
 */
export default function YouTubePlayer({
  videoId,
  autoplay = false,
  muted = false,
  loop = false,
  controls = true,
  className = "w-full h-full",
  title = "مشغّل الفيديو",
  startTime,
  onTimeUpdate,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { backgroundPlay, preferredQuality } = useAppStore();
  const { lang, t } = useLanguage();

  const initialStartTime = useRef<{ id: string; time: number | undefined }>({
    id: videoId,
    time: startTime,
  });

  if (initialStartTime.current.id !== videoId) {
    initialStartTime.current = { id: videoId, time: startTime };
  }

  // Handle postMessage to receive playback progress from YouTube JS API
  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (!data) return;

        if (data.event === "infoDelivery" && data.info) {
          const info = data.info;
          if (typeof info.currentTime === "number") {
            onTimeUpdate?.(info.currentTime);
          }
        }
      } catch {
        // Ignore non-json messages
      }
    };

    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, [onTimeUpdate]);

  // Activate YouTube JS API listening on load
  const handleIframeLoad = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "listening", id: 1, channel: "widget" }),
        "*",
      );
    }
  };

  // Background play support: keep audio running if enabled
  useEffect(() => {
    const handleVisibility = () => {
      if (!backgroundPlay) return;
      if (document.visibilityState === "hidden" && iframeRef.current?.contentWindow) {
        const play = () => {
          if (!iframeRef.current?.contentWindow) return;
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: "command", func: "playVideo", args: [] }),
            "*",
          );
        };
        play();
        const t1 = setTimeout(play, 200);
        const t2 = setTimeout(play, 600);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [backgroundPlay]);

  // Media Session API for lock screen and system media keys
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: title || "فيديو",
      artist: t ? t("brandName") : "Youtubiy",
      artwork: [
        {
          src: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          sizes: "480x360",
          type: "image/jpeg",
        },
        {
          src: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
          sizes: "1280x720",
          type: "image/jpeg",
        },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "playVideo", args: [] }),
        "*",
      );
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
        "*",
      );
    });

    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime != null) {
        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "seekTo", args: [details.seekTime, true] }),
          "*",
        );
      }
    });

    return () => {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("seekto", null);
    };
  }, [videoId, title, t]);

  // YouTube IFrame URL parameters
  const params = useMemo(() => {
    const p = new URLSearchParams({
      autoplay: autoplay ? "1" : "0",
      mute: muted ? "1" : "0",
      controls: controls ? "1" : "0",
      playsinline: "1",
      rel: "0",
      modestbranding: "1",
      hl: lang || "ar",
      origin: typeof window !== "undefined" ? window.location.origin : "",
      iv_load_policy: "3",
      disablekb: "0",
      fs: "1",
      enablejsapi: "1",
      widgetid: "1",
    });
    if (preferredQuality && preferredQuality !== "auto") {
      p.set("vq", preferredQuality);
    }
    if (initialStartTime.current.time && initialStartTime.current.time > 0) {
      p.set("start", String(Math.floor(initialStartTime.current.time)));
    }
    if (loop) {
      p.set("loop", "1");
      p.set("playlist", videoId);
    }
    return p;
  }, [videoId, autoplay, muted, controls, lang, loop, preferredQuality]);

  return (
    <div className={`relative bg-black overflow-hidden select-none ${className}`}>
      <iframe
        ref={iframeRef}
        key={`${videoId}-${autoplay}-${muted}`}
        className="w-full h-full border-0 pointer-events-auto"
        src={`https://www.youtube.com/embed/${videoId}?${params.toString()}`}
        title={title}
        loading="lazy"
        onLoad={handleIframeLoad}
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen
      />
    </div>
  );
}
