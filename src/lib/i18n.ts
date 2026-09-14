import { useState, useEffect, useCallback } from "react";

export type Language = "en" | "ar";

const STORAGE_KEY = "yt_lang";

export const TRANSLATIONS = {
  en: {
    // Brand
    brandName: "youtubiy",
    countryCode: "US",

    // Header
    searchPlaceholder: "Search",
    searchTooltip: "Search",
    voiceSearchTooltip: "Search with your voice",
    clearSearch: "Clear",
    create: "Create",
    uploadVideo: "Upload video",
    goLive: "Go live",
    createPost: "Create post",
    notifications: "Notifications",
    account: "Account",
    signIn: "Sign In",
    signInGoogle: "Sign in with Google",
    signOut: "Sign Out",
    cloudSynced: "Activity saved to Firebase",
    guestAccount: "Guest Account",
    guestHint: "Sign in to save subscriptions, history and playlists to your account",
    back: "Back",
    menu: "Menu",
    listening: "Listening...",
    speakNow: "Say something to search YouTube",
    cancel: "Cancel",
    voiceNotSupported: "Voice recognition is not supported in this browser.",
    notifsEmpty: "Subscribe to channels to get notified of new videos.",
    notifsError: "Could not load notifications.",
    uploadedVideo: "uploaded:",

    // Sidebar - Main
    home: "Home",
    shorts: "Shorts",
    subscriptions: "Subscriptions",

    // Sidebar - You
    you: "You",
    yourChannel: "Your channel",
    history: "History",
    playlists: "Playlists",
    yourVideos: "Your videos",
    watchLater: "Watch Later",
    likedVideos: "Liked videos",
    downloads: "Downloads",

    // Sidebar - Explore
    explore: "Explore",
    trending: "Trending",
    music: "Music",
    gaming: "Gaming",
    news: "News",
    sports: "Sports",

    // Sidebar - Settings & More
    settings: "Settings",
    report: "Report history",
    help: "Help",
    language: "Language",
    languageName: "English",
    english: "English",
    arabic: "العربية",
    about: "About",
    terms: "Terms · Privacy · Policy & Safety",
    howWorks: "How YouTube works · Test new features",
    copyright: "© 2026 Google LLC",

    // Home Chips
    chipAll: "All",
    chipTrending: "Trending",
    chipGaming: "Gaming",
    chipMinecraft: "Minecraft",
    chipTechnology: "Technology",
    chipCooking: "Cooking",
    chipTravel: "Travel",
    chipMusic: "Music",
    chipCars: "Cars",

    // Search Filter Chips (High precision YouTube filter chips)
    filterAll: "All",
    filterShorts: "Shorts",
    filterUnwatched: "Unwatched",
    filterWatched: "Watched",
    filterVideos: "Videos",
    filterRecentlyUploaded: "Recently uploaded",
    filterLive: "Live",

    // Feed & Video
    views: "views",
    subscribers: "subscribers",
    subscribe: "Subscribe",
    subscribed: "Subscribed",
    saveToWatchLater: "Save to Watch Later",
    removeFromWatchLater: "Remove from Watch Later",
    addToQueue: "Add to queue",
    share: "Share",
    notInterested: "Not interested",
    linkCopied: "Link copied to clipboard 🔗",
    savedToWatchLaterToast: "Saved to Watch Later ⏰",
    removedFromWatchLaterToast: "Removed from Watch Later",
    addedToQueueToast: "Added to queue",
    subscribedToast: "Subscribed to channel",
    unsubscribedToast: "Unsubscribed from channel",
    historyClearedToast: "Watch history cleared successfully",
    loadMore: "Load more",
    endOfResults: "No more results",
    clearHistory: "Clear watch history",
    reply: "Reply",
    commentPostedToast: "Comment posted (demo UI)",
    downloadStartedToast: "Download started in background",
    noComments: "No comments to display for this video.",
    noDescription: "No description provided.",
    watchError: "Failed to load video details. Please try again.",
    channelLoadError: "Failed to load channel data.",
    channelLinkCopied: "Channel link copied 🔗",
    videosWord: "videos",
    featuredVideo: "Featured video",
    details: "Details",
    description: "Description",
    more: "More",
    noResults: "No results found for",
    noResultsSuggestion: "Try different keywords or remove search filters",
    noWatchedResults: "No watched videos found in these search results",
    noUnwatchedResults: "No unwatched videos found in these search results",
    noShortsResults: "No Shorts found for this search",
    noLiveResults: "No active live streams found for this search",
    retry: "Retry",
    loadError: "Something went wrong. Please try again.",
    liveBadge: "LIVE",

    // Watch Page
    like: "Like",
    dislike: "Dislike",
    download: "Download",
    save: "Save",
    comments: "Comments",
    writeComment: "Add a comment...",
    showMore: "Show more",
    showLess: "Show less",
    relatedVideos: "Related videos",
    miniplayer: "Miniplayer",
    minimize: "Minimize",
    expand: "Expand",
    closeMiniplayer: "Close miniplayer",

    // Settings Modal
    settingsTitle: "Settings",
    settingsGeneral: "General",
    settingsLanguageDesc: "Choose your display language for the YouTube interface",
    settingsAppearance: "Appearance",
    settingsDarkTheme: "Dark theme (always on)",
    settingsHistory: "History & Privacy",
    settingsClearHistory: "Clear all watch history",
    settingsClearHistorySuccess: "Watch history cleared successfully",
    settingsClose: "Close",
    settingsBackgroundPlay: "Background Playback",
    settingsBackgroundPlayDesc: "Keep video playing when switching apps or locking screen",
    settingsInstallApp: "Install Application",
    settingsInstallAppDesc: "Install Youtubiy as a standalone app for better performance",
    settingsInstalled: "App is already installed",
    install: "Install",
    playbackUpdatedToast: "Playback settings updated",
    enabled: "Enabled",
    disabled: "Disabled",
    installIOS: "Install on iOS",
    installIOSHeading: "Install on iPhone / iPad",
    installIOSStep1: "1. Tap the Share button in Safari toolbar.",
    installIOSStep2: "2. Scroll down and tap 'Add to Home Screen'.",
    confirmClearHistory:
      "Are you sure you want to clear your entire watch history? This action cannot be undone.",
    yesClearHistory: "Yes, clear history",
    clearHistorySubtitle: "Remove all watched videos from this device",

    // Channel & Shorts & Library & Navigation
    about: "About",
    searchInChannel: "Search in channel",
    noShortsInChannel: "No shorts available for this channel",
    playlistsNotAvailable: "Playlists are not available currently",
    videosPublished: "videos published",
    sound: "Sound",
    close: "Close",
    originalAudio: "Original audio",
    thanksForFeedbackToast: "Thanks for your feedback",
    commentsSoonToast: "Comments coming soon",
    newPlaylist: "New playlist",
    createNewPlaylist: "Create new playlist",
    playlistTitlePlaceholder: "Playlist title...",
    playlistCreatedToast: "Playlist created",
    systemPlaylist: "System",
    customPlaylist: "Custom playlist",
    savedVideosOnDevice: "videos saved on this device",
    playAll: "Play all",
    shuffle: "Shuffle",
    loadingHistory: "Loading history data...",
    guest: "Guest",
    notSignedIn: "Not signed in",
    firebaseCloud: "Firebase Cloud",
    synced: "Synced",
    ready: "Ready",
    youtubeChannels: "YouTube Channels",
    importedChannels: "channels imported",
    googleConnected: "Google connected",
    readyToImport: "Ready to import",
    importYouTubeSubs: "Import YouTube Subscriptions (Takeout / CSV)",
    signInWithGoogle: "Sign in with Google",
    signInBenefits: "Save likes, history & sync across devices",
    syncing: "Syncing...",
    syncYouTube: "Sync YouTube",
    uploadedNewVideo: "uploaded:",
    noNotifsFromSubs: "No new notifications from your subscriptions",
    historyEmptyMessage: "No watch history yet — start watching videos!",
    watchLaterEmptyMessage: "You haven't saved any videos to Watch Later yet.",
    likedVideosEmptyMessage: "No liked videos yet.",
    yourVideosEmptyMessage: "This is a viewer client — no personal uploads found.",
    downloadsEmptyMessage: "No downloads stored on this device.",
    trendingEmptyMessage: "No trending content right now.",
    noContent: "No content.",
    noResultsGeneric: "No results.",
  },
  ar: {
    // Brand
    brandName: "youtubiy",
    countryCode: "EG",

    // Header
    searchPlaceholder: "ابحث في يوتيوب",
    searchTooltip: "بحث",
    voiceSearchTooltip: "البحث الصوتي",
    clearSearch: "مسح",
    create: "إنشاء",
    uploadVideo: "رفع فيديو",
    goLive: "بث مباشر",
    createPost: "إنشاء منشور",
    notifications: "الإشعارات",
    account: "حسابك",
    signIn: "تسجيل الدخول",
    signInGoogle: "تسجيل الدخول باستخدام Google",
    signOut: "تسجيل الخروج",
    cloudSynced: "النشاط محفوظ في Firebase",
    guestAccount: "حساب زائر",
    guestHint: "سجّل الدخول لحفظ الاشتراكات وسجل المشاهدة وقوائم التشغيل في حسابك",
    back: "رجوع",
    menu: "القائمة",
    listening: "جارٍ الاستماع...",
    speakNow: "تكلّم الآن وسيتم تحويل كلامك إلى بحث",
    cancel: "إلغاء",
    voiceNotSupported: "التعرف الصوتي غير مدعوم في هذا المتصفح",
    notifsEmpty: "اشترك في قنوات لتصلك إشعارات بآخر الفيديوهات",
    notifsError: "تعذّر تحميل الإشعارات",
    uploadedVideo: "رفع فيديو:",

    // Sidebar - Main
    home: "الرئيسية",
    shorts: "Shorts",
    subscriptions: "الاشتراكات",

    // Sidebar - You
    you: "أنت",
    yourChannel: "قناتك",
    history: "السجل",
    playlists: "قوائم التشغيل",
    yourVideos: "مقاطع الفيديو",
    watchLater: "المشاهدة لاحقاً",
    likedVideos: "مقاطع أعجبتني",
    downloads: "التنزيلات",

    // Sidebar - Explore
    explore: "استكشف",
    trending: "الرائج",
    music: "الموسيقى",
    gaming: "الألعاب",
    news: "الأخبار",
    sports: "الرياضة",

    // Sidebar - Settings & More
    settings: "الإعدادات",
    report: "الإبلاغ عن مشكلة",
    help: "المساعدة",
    language: "اللغة",
    languageName: "العربية",
    english: "English",
    arabic: "العربية",
    about: "نبذة",
    terms: "الشروط · الخصوصية · السياسة والأمان",
    howWorks: "كيف يعمل يوتيوب · اختبار الميزات الجديدة",
    copyright: "© 2026 Google LLC — واجهة تجريبية",

    // Home Chips
    chipAll: "الكل",
    chipTrending: "الرائج",
    chipGaming: "ألعاب",
    chipMinecraft: "ماينكرافت",
    chipTechnology: "تقنية",
    chipCooking: "طهي",
    chipTravel: "سفر",
    chipMusic: "موسيقى",
    chipCars: "سيارات",

    // Search Filter Chips
    filterAll: "الكل",
    filterShorts: "Shorts",
    filterUnwatched: "لم تتم مشاهدتها",
    filterWatched: "تمت مشاهدتها",
    filterVideos: "فيديوهات",
    filterRecentlyUploaded: "تم تحميلها مؤخراً",
    filterLive: "بث مباشر",

    // Feed & Video
    views: "مشاهدة",
    subscribers: "مشترك",
    subscribe: "اشتراك",
    subscribed: "مشترك",
    saveToWatchLater: "المشاهدة لاحقاً",
    removeFromWatchLater: "إزالة من المشاهدة لاحقاً",
    addToQueue: "إضافة إلى قائمة الانتظار",
    share: "مشاركة",
    notInterested: "لا أهتم",
    linkCopied: "تم نسخ الرابط 🔗",
    savedToWatchLaterToast: "تم الحفظ للمشاهدة لاحقاً ⏰",
    removedFromWatchLaterToast: "تمت الإزالة من المشاهدة لاحقاً",
    addedToQueueToast: "تمت الإضافة لقائمة الانتظار",
    subscribedToast: "تم الاشتراك في القناة",
    unsubscribedToast: "تم إلغاء الاشتراك من القناة",
    historyClearedToast: "تم محو سجل المشاهدة بنجاح",
    loadMore: "تحميل المزيد",
    endOfResults: "نهاية النتائج",
    clearHistory: "محو سجل المشاهدة",
    reply: "رد",
    commentPostedToast: "تم نشر تعليقك (واجهة تجريبية)",
    downloadStartedToast: "بدأ التنزيل في الخلفية",
    noComments: "لا توجد تعليقات معروضة لهذا الفيديو.",
    noDescription: "لا يوجد وصف لهذا الفيديو.",
    watchError: "تعذّر جلب بيانات هذا الفيديو، حاول مرة أخرى.",
    channelLoadError: "تعذّر تحميل بيانات القناة.",
    channelLinkCopied: "تم نسخ رابط القناة 🔗",
    videosWord: "فيديو",
    featuredVideo: "فيديو مميّز",
    details: "التفاصيل",
    description: "الوصف",
    more: "المزيد",
    noResults: "لا توجد نتائج للبحث",
    noResultsSuggestion: "جرّب كلمات بحث مختلفة أو قم بإزالة عوامل التصفية",
    noWatchedResults: "لا توجد مقاطع فيديو تمت مشاهدتها ضمن نتائج هذا البحث",
    noUnwatchedResults: "لا توجد مقاطع فيديو لم تتم مشاهدتها ضمن نتائج هذا البحث",
    noShortsResults: "لا توجد مقاطع شورتس لهذا البحث",
    noLiveResults: "لا يوجد بث مباشر نشط لهذا البحث حالياً",
    retry: "إعادة المحاولة",
    loadError: "حدث خطأ ما. يرجى إعادة المحاولة.",
    liveBadge: "مباشر",

    // Watch Page
    like: "إعجاب",
    dislike: "لم يعجبني",
    download: "تنزيل",
    save: "حفظ",
    comments: "التعليقات",
    writeComment: "إضافة تعليق...",
    showMore: "عرض المزيد",
    showLess: "عرض أقل",
    relatedVideos: "مقاطع فيديو ذات صلة",
    miniplayer: "المشغل المصغر",
    minimize: "تصغير المشغل",
    expand: "توسيع المشغل",
    closeMiniplayer: "إغلاق المشغل المصغر",

    // Settings Modal
    settingsTitle: "الإعدادات",
    settingsGeneral: "عام",
    settingsLanguageDesc: "اختر لغة العرض لواجهة يوتيوب",
    settingsAppearance: "المظهر",
    settingsDarkTheme: "المظهر الداكن (مفعّل دائماً)",
    settingsHistory: "السجل والخصوصية",
    settingsClearHistory: "محو سجل المشاهدة بالكامل",
    settingsClearHistorySuccess: "تم محو سجل المشاهدة بنجاح",
    settingsClose: "إغلاق",
    settingsBackgroundPlay: "التشغيل في الخلفية",
    settingsBackgroundPlayDesc: "استمرار تشغيل الفيديو عند التبديل بين التطبيقات أو قفل الشاشة",
    settingsInstallApp: "تثبيت التطبيق",
    settingsInstallAppDesc: "تثبيت Youtubiy كتطبيق مستقل لأداء أفضل وميزات إضافية",
    settingsInstalled: "التطبيق مثبت بالفعل",
    install: "تثبيت",
    playbackUpdatedToast: "تم تحديث إعدادات التشغيل",
    enabled: "مفعّل",
    disabled: "معطّل",
    installIOS: "تثبيت على iOS",
    installIOSHeading: "التثبيت على iPhone / iPad",
    installIOSStep1: "1. اضغط على زر المشاركة في متصفح Safari.",
    installIOSStep2: "2. مرر للأسفل واضغط على 'إضافة إلى الشاشة الرئيسية'.",
    confirmClearHistory:
      "هل أنت متأكد من رغبتك في محو سجل المشاهدة بالكامل؟ لا يمكن التراجع عن هذا الإجراء.",
    yesClearHistory: "نعم، امسح السجل",
    clearHistorySubtitle: "حذف جميع مقاطع الفيديو التي تمت مشاهدتها من السجل",

    // Channel & Shorts & Library & Navigation
    about: "لمحة",
    searchInChannel: "بحث في القناة",
    noShortsInChannel: "لا توجد مقاطع قصيرة في هذه القناة",
    playlistsNotAvailable: "قوائم التشغيل غير متاحة حالياً",
    videosPublished: "فيديو منشور",
    sound: "الصوت",
    close: "إغلاق",
    originalAudio: "صوت أصلي",
    thanksForFeedbackToast: "شكراً لتقييمك",
    commentsSoonToast: "التعليقات قريباً",
    newPlaylist: "قائمة جديدة",
    createNewPlaylist: "إنشاء قائمة تشغيل جديدة",
    playlistTitlePlaceholder: "عنوان القائمة...",
    playlistCreatedToast: "تم إنشاء قائمة التشغيل",
    systemPlaylist: "نظام",
    customPlaylist: "قائمة مخصصة",
    savedVideosOnDevice: "فيديو محفوظ على هذا الجهاز",
    playAll: "تشغيل الكل",
    shuffle: "خلط العرض",
    loadingHistory: "جارٍ تحميل بيانات السجل...",
    guest: "زائر",
    notSignedIn: "غير مسجل الدخول",
    firebaseCloud: "سحابة Firebase",
    synced: "متزامن",
    ready: "جاهز",
    youtubeChannels: "اشتراكات YouTube",
    importedChannels: "قناة مستوردة",
    googleConnected: "حساب Google متصل",
    readyToImport: "جاهز للاستيراد",
    importYouTubeSubs: "استيراد اشتراكات يوتيوب (Takeout / CSV)",
    signInWithGoogle: "تسجيل الدخول باستخدام Google",
    signInBenefits: "لحفظ المفضلة والمشاهدات ومزامنة السحابة",
    syncing: "جاري المزامنة...",
    syncYouTube: "مزامنة يوتيوب",
    uploadedNewVideo: "نشر فيديو جديد:",
    noNotifsFromSubs: "لا توجد إشعارات جديدة من اشتراكاتك",
    historyEmptyMessage: "لا يوجد سجل مشاهدة بعد — ابدأ بمشاهدة فيديو!",
    watchLaterEmptyMessage: "لم تحفظ أي فيديو بعد للمشاهدة لاحقاً.",
    likedVideosEmptyMessage: "لم تعجبك أي مقاطع بعد.",
    yourVideosEmptyMessage: "هذه واجهة مشاهدة فقط — لا توجد مقاطع خاصة بك.",
    downloadsEmptyMessage: "لا توجد تنزيلات محفوظة على هذا الجهاز.",
    trendingEmptyMessage: "لا يوجد محتوى رائج حالياً.",
    noContent: "لا يوجد محتوى.",
    noResultsGeneric: "لا توجد نتائج.",
  },
};

export type TranslationKey = keyof typeof TRANSLATIONS.en;

export function getLanguage(): Language {
  if (typeof window === "undefined") return "en"; // Default is English
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "ar" || saved === "en") return saved;
  return "en"; // Default English as explicitly requested
}

export function setLanguage(lang: Language): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  window.dispatchEvent(new CustomEvent("yt:language", { detail: lang }));
}

export function useLanguage() {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    setLangState(getLanguage());

    const handleLangChange = (e: Event) => {
      const custom = e as CustomEvent<Language>;
      if (custom.detail) {
        setLangState(custom.detail);
      } else {
        setLangState(getLanguage());
      }
    };
    window.addEventListener("yt:language", handleLangChange);
    return () => window.removeEventListener("yt:language", handleLangChange);
  }, []);

  const changeLanguage = useCallback((newLang: Language) => {
    setLanguage(newLang);
    setLangState(newLang);
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key;
    },
    [lang],
  );

  return {
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    isAr: lang === "ar",
    isEn: lang === "en",
    setLang: changeLanguage,
    t,
  };
}
