import { useState, useEffect } from "react";
import { X, Plus, ListVideo, Check, Search } from "lucide-react";
import { useLanguage } from "../lib/i18n";
import { getCustomPlaylists, createCustomPlaylist, addToPlaylist } from "../lib/store";
import type { UserPlaylist, PipedVideo } from "../lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  video: PipedVideo | null;
  notify: (m: string) => void;
}

export default function PlaylistDialog({ open, onClose, video, notify }: Props) {
  const { t, isAr, dir } = useLanguage();
  const [playlists, setPlaylists] = useState<UserPlaylist[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) {
      getCustomPlaylists().then(setPlaylists);
    }
  }, [open]);

  if (!open || !video) return null;

  const videoId = video.url.split("v=")[1];

  const handleCreateAndAdd = async () => {
    if (!newTitle.trim()) return;
    const pl = await createCustomPlaylist(newTitle.trim());
    await addToPlaylist(pl.id, videoId);
    notify(isAr ? `تمت الإضافة إلى ${pl.title}` : `Added to ${pl.title}`);
    onClose();
    setNewTitle("");
    setShowCreate(false);
  };

  const handleToggle = async (pl: UserPlaylist) => {
    if (pl.videoIds.includes(videoId)) {
      notify(isAr ? "الفيديو موجود بالفعل في هذه القائمة" : "Video already in this playlist");
      return;
    }
    await addToPlaylist(pl.id, videoId);
    notify(isAr ? `تمت الإضافة إلى ${pl.title}` : `Added to ${pl.title}`);
    onClose();
  };

  const filtered = playlists.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full max-w-md bg-yt-raised border border-yt-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        dir={dir}
      >
        <div className="flex items-center justify-between p-4 border-b border-yt-border">
          <h2 className="font-bold text-lg">
            {isAr ? "إضافة إلى قائمة تشغيل" : "Add to playlist"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-yt-surface rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {!showCreate ? (
            <>
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yt-sub" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={isAr ? "بحث في قوائمك..." : "Search your playlists..."}
                  className="w-full bg-yt-bg border border-yt-border rounded-xl py-2.5 ps-10 pe-4 outline-none focus:border-yt-blue transition-colors text-sm"
                />
              </div>

              <div className="max-h-[300px] overflow-y-auto space-y-1 custom-scrollbar pe-1">
                {filtered.map((pl) => {
                  const exists = pl.videoIds.includes(videoId);
                  return (
                    <button
                      key={pl.id}
                      onClick={() => handleToggle(pl)}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-yt-surface transition-colors text-start group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-yt-bg border border-yt-border flex items-center justify-center shrink-0">
                          {pl.thumbnail ? (
                            <img
                              src={pl.thumbnail}
                              className="w-full h-full object-cover rounded-lg"
                              alt=""
                            />
                          ) : (
                            <ListVideo className="w-5 h-5 text-yt-sub opacity-40" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm line-clamp-1">{pl.title}</p>
                          <p className="text-xs text-yt-sub">
                            {pl.videoIds.length} {isAr ? "فيديو" : "videos"}
                          </p>
                        </div>
                      </div>
                      {exists && <Check className="w-5 h-5 text-yt-blue" />}
                    </button>
                  );
                })}
                {filtered.length === 0 && !search && (
                  <div className="py-8 text-center space-y-2">
                    <ListVideo className="w-10 h-10 text-yt-sub opacity-20 mx-auto" />
                    <p className="text-sm text-yt-sub">
                      {isAr ? "لا توجد قوائم تشغيل بعد" : "No playlists yet"}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowCreate(true)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-yt-surface transition-colors text-yt-blue font-bold text-sm"
              >
                <Plus className="w-5 h-5" />
                <span>{isAr ? "إنشاء قائمة جديدة" : "Create new playlist"}</span>
              </button>
            </>
          ) : (
            <div className="space-y-4 py-2 animate-in slide-in-from-bottom-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-yt-sub uppercase tracking-wider px-1">
                  {isAr ? "اسم القائمة" : "Playlist Name"}
                </label>
                <input
                  autoFocus
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={isAr ? "أدخل اسم القائمة..." : "Enter playlist name..."}
                  className="w-full bg-yt-bg border border-yt-border rounded-xl py-3 px-4 outline-none focus:border-yt-blue transition-colors"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleCreateAndAdd}
                  disabled={!newTitle.trim()}
                  className="flex-1 bg-white text-black h-11 rounded-xl font-bold active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isAr ? "إنشاء وإضافة" : "Create and add"}
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-6 h-11 rounded-xl bg-yt-surface font-bold hover:bg-yt-hover transition-colors"
                >
                  {isAr ? "رجوع" : "Back"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
