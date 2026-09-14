import { useEffect, useRef, useMemo } from "react";
import { useAppStore } from "../lib/appStore";
import { useLanguage } from "../lib/i18n";

interface Props {
  videoId: string;
  /** Start playing as soon as the frame mounts (shorts / active card). */
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
 * Playback uses YouTube's official embedded player.
 *
 * Direct stream URLs from third-party mirrors expire, are region-locked and
 * break constantly; the embed is signed by YouTube itself, supports adaptive
 * quality, subtitles, fullscreen and mobile autoplay, and never 403s.
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

  useEffect(() => {
    if (!onTimeUpdate) return;
    const handleMsg = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (
          data &&
          data.event === "infoDelivery" &&
          data.info &&
          typeof data.info.currentTime === "number"
        ) {
          onTimeUpdate(data.info.currentTime);
        }
      } catch {
        // ignore non-json messages
      }
    };
    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, [onTimeUpdate]);

  const handleIframeLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      // Send the listening event to the iframe to enable infoDelivery messages
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "listening", id: 1, channel: "widget" }),
        "*"
      );
    }
  };

  const { backgroundPlay } = useAppStore();
  const { lang, t } = useLanguage();

  useEffect(() => {
    // Keep YouTube playing when tab is hidden or backgrounded (if enabled)
    const handleVisibility = () => {
      if (!backgroundPlay) return;
      // We check if the current document is hidden
      if (document.visibilityState === "hidden" && iframeRef.current?.contentWindow) {
        // Send a play command to override YouTube's auto-pause on blur
        const play = () => {
          if (!iframeRef.current?.contentWindow) return;
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: "command", func: "playVideo", args: [] }),
            "*"
          );
        };
        // Sequence of play commands to fight YouTube's internal blur pause logic
        play();
        const t1 = setTimeout(play, 150);
        const t2 = setTimeout(play, 400);
        const t3 = setTimeout(play, 1000);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
          clearTimeout(t3);
        };
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [backgroundPlay]);

  // Media Session API for background play controls
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

    const sendCommand = (func: string, args: unknown[] = []) => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: "command", func, args }),
          "*"
        );
      }
    };

    navigator.mediaSession.setActionHandler("play", () => {
      sendCommand("playVideo");
      navigator.mediaSession.playbackState = "playing";
    });

    navigator.mediaSession.setActionHandler("pause", () => {
      sendCommand("pauseVideo");
      navigator.mediaSession.playbackState = "paused";
    });

    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime != null) {
        sendCommand("seekTo", [details.seekTime, true]);
      }
    });

    if (autoplay) {
      navigator.mediaSession.playbackState = "playing";
    }

    return () => {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("seekto", null);
    };
  }, [videoId, title, autoplay, t]);

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
    if (startTime && startTime > 0) p.set("start", String(Math.floor(startTime)));
    if (loop) {
      p.set("loop", "1");
      p.set("playlist", videoId);
    }
    return p;
  }, [videoId, autoplay, muted, controls, lang, startTime, loop]);

  return (
    <iframe
      ref={iframeRef}
      key={`${videoId}-${autoplay}-${muted}`}
      className={className}
      src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
      title={title}
      loading="lazy"
      onLoad={handleIframeLoad}
      referrerPolicy="strict-origin-when-cross-origin"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      allowFullScreen
    />
  );
}
