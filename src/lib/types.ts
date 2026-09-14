export interface PipedVideo {
  url: string;
  type?: string;
  title: string;
  thumbnail: string;
  uploaderName: string;
  uploaderUrl?: string;
  uploaderAvatar?: string;
  uploaderVerified?: boolean;
  uploadedDate?: string;
  uploaded?: number;
  duration: number;
  views?: number;
  description?: string;
}

export interface VideoStream {
  url: string;
  quality: string;
  mimeType: string;
  videoOnly: boolean;
}

export interface PipedComment {
  author: string;
  thumbnail: string;
  commentText: string;
  commentedTime: string;
  likeCount: number;
  replyCount?: number;
}

export interface StreamData {
  title: string;
  description: string;
  uploadDate: string;
  category: string;
  likes: number;
  views: number;
  uploader: string;
  uploaderUrl: string;
  uploaderAvatar: string;
  uploaderVerified: boolean;
  uploaderSubscriberCount?: number;
  videoStreams: VideoStream[];
  hls?: string;
  relatedStreams: PipedVideo[];
  comments?: PipedComment[];
}

export interface ChannelData {
  id?: string;
  name: string;
  avatarUrl: string;
  bannerUrl?: string;
  subscriberCount?: number;
  subscriberText?: string;
  videoCount?: number;
  videoCountText?: string;
  description: string;
  verified?: boolean;
  relatedStreams: PipedVideo[];
  shorts?: PipedVideo[];
  nextVideos?: string | null;
  nextShorts?: string | null;
}

export interface Subscription {
  channel_id: string;
  channel_name: string;
  channel_avatar_url?: string;
  added_at?: string;
}

export interface HistoryRow {
  video_id: string;
  title?: string;
  channel_name?: string;
  channel_id?: string;
  thumbnail?: string;
  duration?: number;
  category?: string;
  progress?: number;
  watched_at: string;
}

export interface VideoMeta {
  title: string;
  thumbnail: string;
  uploaderName: string;
  uploaderAvatar?: string;
  duration?: number;
}

export interface SearchChannel {
  id: string;
  name: string;
  avatar: string;
  subscribers: number;
  description?: string;
  verified?: boolean;
}

export interface SearchPlaylist {
  id: string;
  title: string;
  thumbnail: string;
  videoCount: number;
  uploaderName?: string;
  firstVideoId?: string;
}

export interface UserPlaylist {
  id: string;
  title: string;
  description?: string;
  videoIds: string[];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistData {
  id: string;
  title: string;
  thumbnail: string;
  videoCount: number;
  uploaderName: string;
  description?: string;
  videos: PipedVideo[];
}
