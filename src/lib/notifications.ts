import { getChannel } from "./api";
import { getSubscriptions, addNotification } from "./store";
import { videoIdFromUrl } from "./format";

export async function refreshNotifications() {
  try {
    const subs = await getSubscriptions();
    if (!subs.length) return;

    // To avoid hitting API limits too hard, we check a few channels at a time
    // or we could check all if the list is small. 
    // For now, let's check the first 10 subs.
    const targetSubs = subs.slice(0, 10);
    
    for (const sub of targetSubs) {
      try {
        const channel = await getChannel(sub.channel_id);
        const latestVideo = (channel.relatedStreams || [])[0];
        
        if (latestVideo) {
          const videoId = videoIdFromUrl(latestVideo.url);
          if (!videoId) continue;

          // Only notify if it's "new" - for simplicity we just try to add it.
          // addNotification handles duplicates by videoId.
          await addNotification({
            video_id: videoId,
            title: latestVideo.title,
            thumbnail: latestVideo.thumbnail,
            channel_id: sub.channel_id,
            channel_name: sub.channel_name,
            channel_avatar: sub.channel_avatar_url,
            created_at: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.warn(`Failed to check notifications for channel ${sub.channel_id}`, e);
      }
    }
  } catch (e) {
    console.error("Failed to refresh notifications", e);
  }
}
