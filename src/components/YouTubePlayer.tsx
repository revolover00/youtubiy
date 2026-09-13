import { useEffect, useRef } from "react";

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

  useEffect(() => {
    // Keep YouTube playing when tab is hidden or backgrounded
    const handleVisibility = () => {
      if (document.visibilityState === "hidden" && iframeRef.current?.contentWindow) {
        // Send a play command to override YouTube's auto-pause on blur
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: "playVideo",
            args: []
          }),
          "*"
        );
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: muted ? "1" : "0",
    controls: controls ? "1" : "0",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    hl: "ar",
    // no annotations / info cards / promoted overlays inside the frame
    iv_load_policy: "3",
    disablekb: "0",
    fs: "1",
    enablejsapi: "1",
    widgetid: "1",
  });

  if (startTime && startTime > 0) {
    params.set("start", String(Math.floor(startTime)));
  }

  if (loop) {
    params.set("loop", "1");
    params.set("playlist", videoId);
  }

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
