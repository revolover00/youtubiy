interface Props {
  videoId: string;
  /** Start playing as soon as the frame mounts (shorts / active card). */
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  className?: string;
  title?: string;
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
}: Props) {
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
  });
  if (loop) {
    params.set("loop", "1");
    params.set("playlist", videoId);
  }

  return (
    <iframe
      key={`${videoId}-${autoplay}-${muted}`}
      className={className}
      src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
      title={title}
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
      allowFullScreen
    />
  );
}
