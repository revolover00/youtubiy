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
  description: string;
  verified?: boolean;
  relatedStreams: PipedVideo[];
}

export interface Subscription {
  channel_id: string;
  channel_name: string;
  channel_avatar_url?: string;
  added_at?: string;
}

export interface HistoryRow {
  video_id: string;
  channel_id?: string;
  category?: string;
  watched_at: string;
}

export interface VideoMeta {
  title: string;
  thumbnail: string;
  uploaderName: string;
  uploaderAvatar?: string;
  duration?: number;
}
