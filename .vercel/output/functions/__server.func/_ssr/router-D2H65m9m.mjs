import { o as __toESM } from "../_runtime.mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useNavigate, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as createServerFn } from "./createServerFn-yTfeHp1H.mjs";
import { a as objectType, n as zodValidator, o as stringType, r as arrayType, t as fallback } from "../_libs/tanstack__zod-adapter+zod.mjs";
import { a as fmtViews, c as isShortsVideo, d as seekTo, f as timeAgo, i as fmtDuration, l as isStandardVideo, n as channelIdFromUrl, p as videoIdFromUrl, r as cleanDateText, s as isLiveStream, t as ageDays, u as parseChapters } from "./format-C7qBpJMP.mjs";
import { t as createSsrRpc } from "./createSsrRpc-Dmfi4vHA.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery, r as QueryClientProvider, t as useInfiniteQuery } from "../_libs/tanstack__react-query.mjs";
import { a as keepPreviousData, t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { o as initializeApp } from "../_libs/@firebase/app+[...].mjs";
import { a as signInWithPopup, i as signInWithCredential, n as getAuth, o as signOut, r as onAuthStateChanged, t as GoogleAuthProvider } from "../_libs/firebase__auth.mjs";
import "../_libs/firebase.mjs";
import { a as query, c as writeBatch, d as getFirestore, i as orderBy, l as collection, n as getDoc, o as setDoc, r as getDocs, s as updateDoc, t as deleteDoc, u as doc } from "../_libs/@firebase/firestore+[...].mjs";
import { $ as EllipsisVertical, A as Music2, B as LoaderCircle, C as RefreshCw, D as PictureInPicture2, E as Play, F as Menu, G as History, H as ListPlus, I as Maximize2, J as Flame, K as Globe, L as LogOut, M as Mic, N as MessageSquare, O as PenLine, P as MessageCircle, Q as ExternalLink, R as LogIn, S as Scale, T as Plus, U as Keyboard, V as ListVideo, W as House, X as FileText, Y as Flag, Z as FileSpreadsheet, _ as Shuffle, _t as Bell, a as Video, at as CloudUpload, b as Settings, bt as ArrowLeft, c as TriangleAlert, ct as CircleQuestionMark, d as ThumbsUp, dt as CircleAlert, et as Download, f as ThumbsDown, ft as ChevronUp, g as Smartphone, gt as Bug, h as Sparkles, ht as Check, i as Volume2, it as Cloud, j as Moon, k as Newspaper, l as TrendingUp, lt as CirclePlay, m as SquarePlay, mt as ChevronDown, n as X, nt as CornerDownLeft, o as UserRound, ot as Clock, p as Square, pt as ChevronRight, q as Gamepad2, r as VolumeX, rt as Copy, s as Trophy, st as Circle, t as Youtube, tt as Database, u as Trash2, ut as CircleCheck, v as ShieldCheck, vt as BadgeCheck, w as Radio, x as Search, xt as Activity, y as Share2, yt as ArrowRight, z as Lock } from "../_libs/lucide-react.mjs";
import { a as DropdownMenuItemIndicator, c as DropdownMenuRadioItem$1, d as DropdownMenuSubTrigger$1, f as DropdownMenuTrigger$1, i as DropdownMenuItem$1, l as DropdownMenuSeparator$1, n as DropdownMenuCheckboxItem$1, o as DropdownMenuLabel$1, r as DropdownMenuContent$1, s as DropdownMenuPortal, t as DropdownMenu$1, u as DropdownMenuSubContent$1 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-D2H65m9m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var autoUpdateMode = "true";
var selfDestroying = "true";
var auto = autoUpdateMode === "true";
var autoDestroy = selfDestroying === "true";
function registerSW(options = {}) {
	const { immediate = false, onNeedReload, onNeedRefresh, onOfflineReady, onRegistered, onRegisteredSW, onRegisterError } = options;
	let wb;
	let registerPromise;
	let sendSkipWaitingMessage;
	const updateServiceWorker = async (_reloadPage = true) => {
		await registerPromise;
		if (!auto) sendSkipWaitingMessage?.();
	};
	async function register() {
		if ("serviceWorker" in navigator) {
			wb = await import("./workbox-window.prod.es5-CkHxznpn.mjs").then(({ Workbox }) => {
				return new Workbox("/sw.js", {
					scope: "/",
					type: "classic"
				});
			}).catch((e) => {
				onRegisterError?.(e);
			});
			if (!wb) return;
			sendSkipWaitingMessage = () => {
				wb?.messageSkipWaiting();
			};
			if (!autoDestroy) if (auto) {
				wb.addEventListener("activated", (event) => {
					if (event.isUpdate || event.isExternal) if (onNeedReload) onNeedReload();
					else window.location.reload();
				});
				wb.addEventListener("installed", (event) => {
					if (!event.isUpdate) onOfflineReady?.();
				});
			} else {
				let onNeedRefreshCalled = false;
				const showSkipWaitingPrompt = () => {
					onNeedRefreshCalled = true;
					wb?.addEventListener("controlling", (event) => {
						if (event.isUpdate) if (onNeedReload) onNeedReload();
						else window.location.reload();
					});
					onNeedRefresh?.();
				};
				wb.addEventListener("installed", (event) => {
					if (typeof event.isUpdate === "undefined") if (typeof event.isExternal !== "undefined") if (event.isExternal) showSkipWaitingPrompt();
					else !onNeedRefreshCalled && onOfflineReady?.();
					else !onNeedRefreshCalled && onOfflineReady?.();
					else if (!event.isUpdate) onOfflineReady?.();
				});
				wb.addEventListener("waiting", showSkipWaitingPrompt);
			}
			wb.register({ immediate }).then((r) => {
				if (onRegisteredSW) onRegisteredSW("/sw.js", r);
				else onRegistered?.(r);
			}).catch((e) => {
				onRegisterError?.(e);
			});
		}
	}
	registerPromise = register();
	return updateServiceWorker;
}
var styles_default = "/assets/styles-Br7LpM0Y.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var STORAGE_KEY = "yt_lang";
var TRANSLATIONS = {
	en: {
		brandName: "youtubiy",
		countryCode: "US",
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
		home: "Home",
		shorts: "Shorts",
		subscriptions: "Subscriptions",
		you: "You",
		yourChannel: "Your channel",
		history: "History",
		playlists: "Playlists",
		yourVideos: "Your videos",
		watchLater: "Watch Later",
		likedVideos: "Liked videos",
		downloads: "Downloads",
		explore: "Explore",
		trending: "Trending",
		music: "Music",
		gaming: "Gaming",
		news: "News",
		sports: "Sports",
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
		chipAll: "All",
		chipTrending: "Trending",
		chipGaming: "Gaming",
		chipMinecraft: "Minecraft",
		chipTechnology: "Technology",
		chipCooking: "Cooking",
		chipTravel: "Travel",
		chipMusic: "Music",
		chipCars: "Cars",
		filterAll: "All",
		filterShorts: "Shorts",
		filterUnwatched: "Unwatched",
		filterWatched: "Watched",
		filterVideos: "Videos",
		filterRecentlyUploaded: "Recently uploaded",
		filterLive: "Live",
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
		confirmClearHistory: "Are you sure you want to clear your entire watch history? This action cannot be undone.",
		yesClearHistory: "Yes, clear history",
		clearHistorySubtitle: "Remove all watched videos from this device",
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
		noResultsGeneric: "No results."
	},
	ar: {
		brandName: "youtubiy",
		countryCode: "EG",
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
		home: "الرئيسية",
		shorts: "Shorts",
		subscriptions: "الاشتراكات",
		you: "أنت",
		yourChannel: "قناتك",
		history: "السجل",
		playlists: "قوائم التشغيل",
		yourVideos: "مقاطع الفيديو",
		watchLater: "المشاهدة لاحقاً",
		likedVideos: "مقاطع أعجبتني",
		downloads: "التنزيلات",
		explore: "استكشف",
		trending: "الرائج",
		music: "الموسيقى",
		gaming: "الألعاب",
		news: "الأخبار",
		sports: "الرياضة",
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
		chipAll: "الكل",
		chipTrending: "الرائج",
		chipGaming: "ألعاب",
		chipMinecraft: "ماينكرافت",
		chipTechnology: "تقنية",
		chipCooking: "طهي",
		chipTravel: "سفر",
		chipMusic: "موسيقى",
		chipCars: "سيارات",
		filterAll: "الكل",
		filterShorts: "Shorts",
		filterUnwatched: "لم تتم مشاهدتها",
		filterWatched: "تمت مشاهدتها",
		filterVideos: "فيديوهات",
		filterRecentlyUploaded: "تم تحميلها مؤخراً",
		filterLive: "بث مباشر",
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
		confirmClearHistory: "هل أنت متأكد من رغبتك في محو سجل المشاهدة بالكامل؟ لا يمكن التراجع عن هذا الإجراء.",
		yesClearHistory: "نعم، امسح السجل",
		clearHistorySubtitle: "حذف جميع مقاطع الفيديو التي تمت مشاهدتها من السجل",
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
		noResultsGeneric: "لا توجد نتائج."
	}
};
function getLanguage() {
	if (typeof window === "undefined") return "en";
	const saved = localStorage.getItem(STORAGE_KEY);
	if (saved === "ar" || saved === "en") return saved;
	return "en";
}
function setLanguage(lang) {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEY, lang);
	document.documentElement.lang = lang;
	document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
	window.dispatchEvent(new CustomEvent("yt:language", { detail: lang }));
}
function useLanguage() {
	const [lang, setLangState] = (0, import_react.useState)("en");
	(0, import_react.useEffect)(() => {
		setLangState(getLanguage());
		const handleLangChange = (e) => {
			const custom = e;
			if (custom.detail) setLangState(custom.detail);
			else setLangState(getLanguage());
		};
		window.addEventListener("yt:language", handleLangChange);
		return () => window.removeEventListener("yt:language", handleLangChange);
	}, []);
	const changeLanguage = (0, import_react.useCallback)((newLang) => {
		setLanguage(newLang);
		setLangState(newLang);
	}, []);
	const t = (0, import_react.useCallback)((key) => {
		return TRANSLATIONS[lang][key] ?? TRANSLATIONS.en[key] ?? key;
	}, [lang]);
	return {
		lang,
		dir: lang === "ar" ? "rtl" : "ltr",
		isAr: lang === "ar",
		isEn: lang === "en",
		setLang: changeLanguage,
		t
	};
}
/**
* Google Identity Services (GSI) OAuth 2.0 Integration
* Allows authenticating directly with Google Cloud Console OAuth 2.0 Client ID
* and obtaining an access token with YouTube Data scopes.
*/
var GOOGLE_CLIENT_ID = typeof import.meta !== "undefined" && "880349982881-8naia73nime31f07q99j6e2m55gimlac.apps.googleusercontent.com" || "880349982881-8naia73nime31f07q99j6e2m55gimlac.apps.googleusercontent.com";
var YOUTUBE_SCOPES = [
	"openid",
	"email",
	"profile",
	"https://www.googleapis.com/auth/youtube.readonly"
].join(" ");
var gsiScriptLoadedPromise = null;
/**
* Dynamically loads the official Google Identity Services (GSI) client script
*/
function loadGsiScript() {
	if (typeof window === "undefined") return Promise.reject(/* @__PURE__ */ new Error("Window is not defined"));
	if (window.google?.accounts?.oauth2) return Promise.resolve();
	if (gsiScriptLoadedPromise) return gsiScriptLoadedPromise;
	gsiScriptLoadedPromise = new Promise((resolve, reject) => {
		const existing = document.querySelector("script[src=\"https://accounts.google.com/gsi/client\"]");
		if (existing) {
			existing.addEventListener("load", () => resolve());
			existing.addEventListener("error", (e) => reject(e));
			return;
		}
		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.defer = true;
		script.onload = () => resolve();
		script.onerror = (err) => reject(err);
		document.head.appendChild(script);
	});
	return gsiScriptLoadedPromise;
}
/**
* Requests an OAuth 2.0 Access Token with YouTube scopes using Google Cloud Console Client ID
*/
async function requestGoogleAccessToken(promptConsent = false) {
	await loadGsiScript();
	const google = window.google;
	if (!google?.accounts?.oauth2?.initTokenClient) throw new Error("Google Identity Services not loaded");
	return new Promise((resolve, reject) => {
		google.accounts.oauth2.initTokenClient({
			client_id: GOOGLE_CLIENT_ID,
			scope: YOUTUBE_SCOPES,
			callback: (response) => {
				if (response.error) {
					reject(new Error(response.error));
					return;
				}
				if (response.access_token) resolve(response.access_token);
				else reject(/* @__PURE__ */ new Error("No access token returned from Google"));
			},
			error_callback: (err) => {
				reject(err);
			},
			prompt: promptConsent ? "consent" : ""
		}).requestAccessToken(promptConsent ? { prompt: "consent" } : void 0);
	});
}
/**
* Fetches user profile information from Google People/Userinfo API using the access token
*/
async function fetchGoogleUserProfile(accessToken) {
	const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", { headers: { Authorization: `Bearer ${accessToken}` } });
	if (!res.ok) throw new Error(`Failed to fetch user profile: ${res.statusText}`);
	const data = await res.json();
	return {
		uid: data.sub,
		email: data.email || null,
		displayName: data.name || null,
		photoURL: data.picture || null
	};
}
var app = initializeApp({
	apiKey: "AIzaSyDQAG0GLQq6KUph_RMLBJFbRNWiMJOIlOk",
	authDomain: "gen-lang-client-0814697034.firebaseapp.com",
	projectId: "gen-lang-client-0814697034",
	storageBucket: "gen-lang-client-0814697034.firebasestorage.app",
	messagingSenderId: "998894461308",
	appId: "1:998894461308:web:e19d6cb430ec54480804f9",
	clientId: "880349982881-8naia73nime31f07q99j6e2m55gimlac.apps.googleusercontent.com"
});
var db = getFirestore(app, "ai-studio-youtubiy-1278634e-3ed7-413d-9d97-686bacfe936e");
var auth = getAuth(app);
new GoogleAuthProvider();
var cachedAccessToken = null;
var cachedGoogleUser = null;
function getCachedAccessToken() {
	return cachedAccessToken;
}
function getCachedGoogleUser() {
	return cachedGoogleUser;
}
var OperationType = /* @__PURE__ */ function(OperationType) {
	OperationType["CREATE"] = "create";
	OperationType["UPDATE"] = "update";
	OperationType["DELETE"] = "delete";
	OperationType["LIST"] = "list";
	OperationType["GET"] = "get";
	OperationType["WRITE"] = "write";
	return OperationType;
}({});
function handleFirestoreError(error, operationType, path) {
	const errInfo = {
		error: error instanceof Error ? error.message : String(error),
		authInfo: {
			userId: auth.currentUser?.uid,
			email: auth.currentUser?.email,
			emailVerified: auth.currentUser?.emailVerified,
			isAnonymous: auth.currentUser?.isAnonymous,
			tenantId: auth.currentUser?.tenantId,
			providerInfo: auth.currentUser?.providerData?.map((provider) => ({
				providerId: provider.providerId,
				email: provider.email
			})) || []
		},
		operationType,
		path
	};
	console.error("Firestore Error: ", JSON.stringify(errInfo));
	throw new Error(JSON.stringify(errInfo));
}
function isPopupClosedError(error) {
	if (!error) return false;
	const err = error;
	return err.code === "auth/popup-closed-by-user" || err.code === "auth/cancelled-popup-request" || err.code === "auth/popup-blocked" || typeof err.message === "string" && (err.message.includes("popup-closed-by-user") || err.message.includes("cancelled-popup-request") || err.message.includes("closed-by-user"));
}
async function testConnection() {
	try {
		if (typeof navigator !== "undefined" && !navigator.onLine) return;
	} catch {}
}
if (typeof window !== "undefined") testConnection().catch(() => {});
async function loginWithGoogle() {
	try {
		const token = await requestGoogleAccessToken(false);
		if (token) {
			cachedAccessToken = token;
			try {
				const cred = GoogleAuthProvider.credential(null, token);
				const res = await signInWithCredential(auth, cred);
				if (res.user) {
					const u = {
						uid: res.user.uid,
						email: res.user.email,
						displayName: res.user.displayName,
						photoURL: res.user.photoURL
					};
					cachedGoogleUser = u;
					return {
						user: u,
						accessToken: token
					};
				}
			} catch (authErr) {
				console.warn("Direct Firebase signInWithCredential note:", authErr);
			}
			const profile = await fetchGoogleUserProfile(token);
			cachedGoogleUser = profile;
			return {
				user: profile,
				accessToken: token
			};
		}
	} catch (gsiError) {
		console.warn("Direct Google Cloud OAuth attempt:", gsiError);
	}
	try {
		const provider = new GoogleAuthProvider();
		provider.addScope("https://www.googleapis.com/auth/youtube.readonly");
		const result = await signInWithPopup(auth, provider);
		cachedAccessToken = GoogleAuthProvider.credentialFromResult(result)?.accessToken || null;
		return {
			user: {
				uid: result.user.uid,
				email: result.user.email,
				displayName: result.user.displayName,
				photoURL: result.user.photoURL
			},
			accessToken: cachedAccessToken
		};
	} catch (error) {
		if (isPopupClosedError(error)) return null;
		console.warn("Failed to sign in with Google:", error);
		throw error;
	}
}
async function requestYouTubeAccessToken() {
	try {
		const token = await requestGoogleAccessToken(true);
		if (token) {
			cachedAccessToken = token;
			if (!auth.currentUser) try {
				const cred = GoogleAuthProvider.credential(null, token);
				await signInWithCredential(auth, cred);
			} catch {}
			return token;
		}
	} catch (gsiError) {
		console.warn("Direct Google Cloud token request attempt:", gsiError);
	}
	const ytProvider = new GoogleAuthProvider();
	ytProvider.addScope("https://www.googleapis.com/auth/youtube.readonly");
	try {
		const result = await signInWithPopup(auth, ytProvider);
		cachedAccessToken = GoogleAuthProvider.credentialFromResult(result)?.accessToken || null;
		return cachedAccessToken;
	} catch (error) {
		if (isPopupClosedError(error)) return null;
		console.warn("Notice: YouTube access token acquisition ended:", error);
		throw error;
	}
}
async function logoutUser() {
	try {
		await signOut(auth);
	} catch (error) {
		console.warn("Notice during sign out:", error);
	} finally {
		cachedAccessToken = null;
		cachedGoogleUser = null;
	}
}
async function getNotifications() {
	const local = read("yt.notifs", []);
	const currentUser = auth.currentUser;
	if (!currentUser) return local;
	try {
		const q = query(collection(db, "users", currentUser.uid, "notifications"), orderBy("created_at", "desc"));
		const snap = await getDocs(q);
		const remote = [];
		snap.forEach((d) => {
			const data = d.data();
			remote.push({
				id: d.id,
				video_id: data.video_id,
				title: data.title,
				thumbnail: data.thumbnail,
				channel_id: data.channel_id,
				channel_name: data.channel_name,
				channel_avatar: data.channel_avatar,
				created_at: data.created_at,
				read: data.read || false
			});
		});
		if (remote.length > 0) {
			write("yt.notifs", remote);
			return remote;
		}
		return local;
	} catch (error) {
		return local;
	}
}
async function markNotificationAsRead(id) {
	const local = read("yt.notifs", []);
	const found = local.find((n) => n.id === id);
	if (found) {
		found.read = true;
		write("yt.notifs", local);
		window.dispatchEvent(new CustomEvent("yt:notifs-updated"));
	}
	const currentUser = auth.currentUser;
	if (!currentUser) return;
	try {
		const docRef = doc(db, "users", currentUser.uid, "notifications", id);
		await updateDoc(docRef, { read: true });
	} catch (error) {}
}
async function addNotification(notif) {
	const currentUser = auth.currentUser;
	if (!currentUser) return;
	const id = `notif_${notif.video_id}`;
	const fullNotif = {
		...notif,
		id,
		read: false
	};
	const local = read("yt.notifs", []);
	if (local.some((n) => n.id === id)) return;
	local.unshift(fullNotif);
	write("yt.notifs", local.slice(0, 50));
	window.dispatchEvent(new CustomEvent("yt:notifs-updated"));
	try {
		const docRef = doc(db, "users", currentUser.uid, "notifications", id);
		await setDoc(docRef, {
			...notif,
			read: false
		});
	} catch (error) {}
}
function read(key, fallback) {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
}
function write(key, value) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {}
}
function getMeta(id) {
	return read("yt.meta", {})[id];
}
function setMeta$1(id, meta) {
	const all = read("yt.meta", {});
	all[id] = meta;
	const keys = Object.keys(all);
	if (keys.length > 400) for (const k of keys.slice(0, keys.length - 400)) delete all[k];
	write("yt.meta", all);
}
function getLocalWatchLater() {
	return read("yt.later", []);
}
function setLocalWatchLater(ids) {
	write("yt.later", ids);
}
function getLocalLiked() {
	return read("yt.liked", []);
}
function setLocalLiked(ids) {
	write("yt.liked", ids);
}
function getWatchLater() {
	return getLocalWatchLater();
}
function setWatchLater(ids) {
	setLocalWatchLater(ids);
}
function getLiked() {
	return getLocalLiked();
}
function setLiked(ids) {
	setLocalLiked(ids);
}
function getBackgroundPlay() {
	return read("yt.bgPlay", true);
}
function setBackgroundPlay(enabled) {
	write("yt.bgPlay", enabled);
}
function getLocalProgress() {
	return read("yt.progress", {});
}
function setLocalProgress(progress) {
	write("yt.progress", progress);
}
function savePlaybackProgress(videoId, seconds) {
	const progress = getLocalProgress();
	const current = progress[videoId] || 0;
	if (Math.abs(current - seconds) < 5) return;
	progress[videoId] = Math.floor(seconds);
	setLocalProgress(progress);
	const currentUser = auth.currentUser;
	if (!currentUser) return;
	`${currentUser.uid}${videoId}`;
	try {
		const docRef = doc(db, "users", currentUser.uid, "history", videoId);
		updateDoc(docRef, {
			progress: Math.floor(seconds),
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		}).catch(() => {});
	} catch (error) {}
}
async function fetchUserProgress() {
	const local = getLocalProgress();
	const currentUser = auth.currentUser;
	if (!currentUser) return local;
	try {
		const snap = await getDocs(collection(db, "users", currentUser.uid, "history"));
		const remote = {};
		snap.forEach((d) => {
			const data = d.data();
			if (typeof data.progress === "number") remote[d.id] = data.progress;
		});
		if (Object.keys(remote).length > 0) {
			const merged = {
				...local,
				...remote
			};
			setLocalProgress(merged);
			return merged;
		}
		return local;
	} catch {
		return local;
	}
}
async function syncUserProfile(user) {
	const currentUser = auth.currentUser;
	if (!currentUser) return;
	const targetUid = currentUser.uid;
	const userPath = `users/${targetUid}`;
	const now = (/* @__PURE__ */ new Date()).toISOString();
	try {
		const userDocRef = doc(db, "users", targetUid);
		await setDoc(userDocRef, {
			userId: targetUid,
			email: (currentUser.email || user.email || "anonymous@youtube.local").slice(0, 200),
			displayName: (currentUser.displayName || user.displayName || "User").slice(0, 120),
			photoURL: (currentUser.photoURL || user.photoURL || "").slice(0, 1e3),
			createdAt: now,
			updatedAt: now
		}, { merge: true });
	} catch (error) {
		handleFirestoreError(error, OperationType.WRITE, userPath);
	}
}
async function getSubscriptions() {
	const local = read("yt.subs", []);
	const currentUser = auth.currentUser;
	if (!currentUser) return local;
	`${currentUser.uid}`;
	try {
		const snap = await getDocs(collection(db, "users", currentUser.uid, "subscriptions"));
		const remote = [];
		snap.forEach((d) => {
			const data = d.data();
			remote.push({
				channel_id: data.channelId || d.id,
				channel_name: data.channelTitle || "",
				channel_avatar_url: data.avatar,
				subscriber_count: data.subscriberCount,
				added_at: data.addedAt
			});
		});
		if (remote.length > 0) {
			write("yt.subs", remote);
			return remote;
		}
		if (local.length > 0) for (const sub of local) await subscribe(sub);
		return local;
	} catch (error) {
		console.warn("Falling back to local subscriptions:", error);
		return local;
	}
}
async function batchSaveSubscriptions(subs) {
	const currentSubs = read("yt.subs", []);
	const subMap = /* @__PURE__ */ new Map();
	currentSubs.forEach((s) => subMap.set(s.channel_id, s));
	subs.forEach((s) => subMap.set(s.channel_id, s));
	const merged = Array.from(subMap.values());
	write("yt.subs", merged);
	const currentUser = auth.currentUser;
	if (!currentUser || subs.length === 0) return merged;
	`${currentUser.uid}`;
	try {
		const batch = writeBatch(db);
		for (const sub of subs) {
			const docRef = doc(db, "users", currentUser.uid, "subscriptions", sub.channel_id);
			batch.set(docRef, {
				channelId: sub.channel_id,
				channelTitle: sub.channel_name,
				avatar: sub.channel_avatar_url || "",
				subscriberCount: sub.subscriber_count || "",
				addedAt: sub.added_at || (/* @__PURE__ */ new Date()).toISOString()
			}, { merge: true });
		}
		await batch.commit();
	} catch (error) {
		console.warn("Failed to batch save subscriptions to Firestore:", error);
	}
	return merged;
}
async function subscribe(sub) {
	const list = read("yt.subs", []);
	if (!list.some((s) => s.channel_id === sub.channel_id)) {
		list.unshift({
			...sub,
			added_at: (/* @__PURE__ */ new Date()).toISOString()
		});
		write("yt.subs", list);
	}
	const currentUser = auth.currentUser;
	if (!currentUser) return;
	const docPath = `users/${currentUser.uid}/subscriptions/${sub.channel_id}`;
	try {
		const docRef = doc(db, "users", currentUser.uid, "subscriptions", sub.channel_id);
		await setDoc(docRef, {
			channelId: sub.channel_id,
			channelTitle: sub.channel_name,
			avatar: sub.channel_avatar_url || "",
			subscriberCount: sub.subscriber_count || "",
			addedAt: sub.added_at || (/* @__PURE__ */ new Date()).toISOString()
		});
	} catch (error) {
		handleFirestoreError(error, OperationType.WRITE, docPath);
	}
}
async function unsubscribe(channelId) {
	write("yt.subs", read("yt.subs", []).filter((s) => s.channel_id !== channelId));
	const currentUser = auth.currentUser;
	if (!currentUser) return;
	const docPath = `users/${currentUser.uid}/subscriptions/${channelId}`;
	try {
		const docRef = doc(db, "users", currentUser.uid, "subscriptions", channelId);
		await deleteDoc(docRef);
	} catch (error) {
		handleFirestoreError(error, OperationType.DELETE, docPath);
	}
}
async function getHistory() {
	const local = read("yt.history", []);
	const currentUser = auth.currentUser;
	if (!currentUser) return local;
	`${currentUser.uid}`;
	try {
		const snap = await getDocs(collection(db, "users", currentUser.uid, "history"));
		const remote = [];
		snap.forEach((d) => {
			const data = d.data();
			remote.push({
				video_id: data.videoId || d.id,
				title: data.title || "",
				channel_name: data.channelTitle || "",
				channel_id: data.channelId || "",
				category: data.category || "",
				progress: data.progress || 0,
				thumbnail: data.thumbnail,
				duration: data.duration,
				watched_at: data.watchedAt
			});
		});
		const mergedMap = /* @__PURE__ */ new Map();
		for (const loc of local) if (loc.video_id) mergedMap.set(loc.video_id, loc);
		for (const rem of remote) {
			const loc = mergedMap.get(rem.video_id);
			if (!loc) mergedMap.set(rem.video_id, rem);
			else {
				const remTime = rem.watched_at ? new Date(rem.watched_at).getTime() : 0;
				const locTime = loc.watched_at ? new Date(loc.watched_at).getTime() : 0;
				if (!isNaN(remTime) && !isNaN(locTime) ? remTime >= locTime : (rem.watched_at || "").localeCompare(loc.watched_at || "") >= 0) mergedMap.set(rem.video_id, {
					...rem,
					channel_id: rem.channel_id || loc.channel_id || "",
					category: rem.category || loc.category || "",
					progress: rem.progress || loc.progress || 0
				});
				else mergedMap.set(rem.video_id, {
					...loc,
					channel_id: loc.channel_id || rem.channel_id || "",
					category: loc.category || rem.category || "",
					progress: loc.progress || rem.progress || 0
				});
			}
		}
		const merged = Array.from(mergedMap.values());
		merged.sort((a, b) => (b.watched_at || "").localeCompare(a.watched_at || ""));
		write("yt.history", merged);
		return merged;
	} catch (error) {
		console.warn("Falling back to local history:", error);
		return local;
	}
}
async function addHistory(row) {
	write("yt.history", [row, ...read("yt.history", []).filter((h) => h.video_id !== row.video_id)].slice(0, 200));
	const currentUser = auth.currentUser;
	if (!currentUser) return;
	const docPath = `users/${currentUser.uid}/history/${row.video_id}`;
	try {
		const docRef = doc(db, "users", currentUser.uid, "history", row.video_id);
		await setDoc(docRef, {
			videoId: row.video_id,
			title: row.title || "Video",
			channelTitle: row.channel_name || "",
			channelId: row.channel_id || "",
			category: row.category || "",
			thumbnail: row.thumbnail || "",
			duration: row.duration || 0,
			progress: row.progress || 0,
			watchedAt: row.watched_at || (/* @__PURE__ */ new Date()).toISOString()
		});
	} catch (error) {
		handleFirestoreError(error, OperationType.WRITE, docPath);
	}
}
async function clearHistory() {
	write("yt.history", []);
	const currentUser = auth.currentUser;
	if (!currentUser) return;
	const colPath = `users/${currentUser.uid}/history`;
	try {
		const snap = await getDocs(collection(db, "users", currentUser.uid, "history"));
		const batch = writeBatch(db);
		snap.forEach((d) => batch.delete(d.ref));
		await batch.commit();
	} catch (error) {
		handleFirestoreError(error, OperationType.DELETE, colPath);
	}
}
async function syncWatchLaterToCloud(videoId, isSaved) {
	const currentUser = auth.currentUser;
	if (!currentUser) return;
	const docPath = `users/${currentUser.uid}/watchLater/${videoId}`;
	const docRef = doc(db, "users", currentUser.uid, "watchLater", videoId);
	try {
		if (isSaved) {
			const meta = getMeta(videoId);
			await setDoc(docRef, {
				videoId,
				title: meta?.title || "Video",
				channelTitle: meta?.uploaderName || "",
				thumbnail: meta?.thumbnail || "",
				duration: meta?.duration || 0,
				addedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		} else await deleteDoc(docRef);
	} catch (error) {
		handleFirestoreError(error, isSaved ? OperationType.WRITE : OperationType.DELETE, docPath);
	}
}
async function syncLikedToCloud(videoId, isLiked) {
	const currentUser = auth.currentUser;
	if (!currentUser) return;
	const docPath = `users/${currentUser.uid}/liked/${videoId}`;
	const docRef = doc(db, "users", currentUser.uid, "liked", videoId);
	try {
		if (isLiked) {
			const meta = getMeta(videoId);
			await setDoc(docRef, {
				videoId,
				title: meta?.title || "Video",
				channelTitle: meta?.uploaderName || "",
				thumbnail: meta?.thumbnail || "",
				duration: meta?.duration || 0,
				addedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		} else await deleteDoc(docRef);
	} catch (error) {
		handleFirestoreError(error, isLiked ? OperationType.WRITE : OperationType.DELETE, docPath);
	}
}
async function getCustomPlaylists() {
	const local = read("yt.playlists", []);
	const currentUser = auth.currentUser;
	if (!currentUser) return local;
	try {
		const q = query(collection(db, "users", currentUser.uid, "playlists"), orderBy("updatedAt", "desc"));
		const snap = await getDocs(q);
		const remote = [];
		snap.forEach((d) => {
			const data = d.data();
			remote.push({
				id: d.id,
				title: data.title || "Untitled Playlist",
				description: data.description || "",
				videoIds: data.videoIds || [],
				thumbnail: data.thumbnail || "",
				createdAt: data.createdAt,
				updatedAt: data.updatedAt
			});
		});
		if (remote.length > 0) {
			write("yt.playlists", remote);
			return remote;
		}
		return local;
	} catch (error) {
		console.warn("Falling back to local playlists:", error);
		return local;
	}
}
async function createCustomPlaylist(title, description = "") {
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const playlist = {
		id: "pl_" + Math.random().toString(36).slice(2) + Date.now().toString(16),
		title,
		description,
		videoIds: [],
		createdAt: now,
		updatedAt: now
	};
	write("yt.playlists", [playlist, ...read("yt.playlists", [])]);
	window.dispatchEvent(new CustomEvent("yt:playlists-updated"));
	const currentUser = auth.currentUser;
	if (!currentUser) return playlist;
	try {
		const docRef = doc(db, "users", currentUser.uid, "playlists", playlist.id);
		await setDoc(docRef, {
			title: playlist.title,
			description: playlist.description,
			videoIds: playlist.videoIds,
			createdAt: playlist.createdAt,
			updatedAt: playlist.updatedAt
		});
	} catch (error) {
		handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.uid}/playlists/${playlist.id}`);
	}
	return playlist;
}
async function addToPlaylist(playlistId, videoId) {
	const all = read("yt.playlists", []);
	const pl = all.find((p) => p.id === playlistId);
	if (!pl) return;
	if (pl.videoIds.includes(videoId)) return;
	const meta = getMeta(videoId);
	pl.videoIds.push(videoId);
	pl.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
	if (!pl.thumbnail && meta?.thumbnail) pl.thumbnail = meta.thumbnail;
	write("yt.playlists", all);
	window.dispatchEvent(new CustomEvent("yt:playlists-updated"));
	const currentUser = auth.currentUser;
	if (!currentUser) return;
	try {
		const docRef = doc(db, "users", currentUser.uid, "playlists", playlistId);
		await updateDoc(docRef, {
			videoIds: pl.videoIds,
			thumbnail: pl.thumbnail || "",
			updatedAt: pl.updatedAt
		});
	} catch (error) {
		handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.uid}/playlists/${playlistId}`);
	}
}
async function removeFromPlaylist(playlistId, videoId) {
	const all = read("yt.playlists", []);
	const pl = all.find((p) => p.id === playlistId);
	if (!pl) return;
	pl.videoIds = pl.videoIds.filter((id) => id !== videoId);
	pl.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
	if (pl.videoIds.length > 0) pl.thumbnail = getMeta(pl.videoIds[0])?.thumbnail || "";
	else pl.thumbnail = "";
	write("yt.playlists", all);
	window.dispatchEvent(new CustomEvent("yt:playlists-updated"));
	const currentUser = auth.currentUser;
	if (!currentUser) return;
	try {
		const docRef = doc(db, "users", currentUser.uid, "playlists", playlistId);
		await updateDoc(docRef, {
			videoIds: pl.videoIds,
			thumbnail: pl.thumbnail || "",
			updatedAt: pl.updatedAt
		});
	} catch (error) {
		handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.uid}/playlists/${playlistId}`);
	}
}
async function fetchUserWatchLater() {
	const local = getLocalWatchLater();
	const currentUser = auth.currentUser;
	if (!currentUser) return local;
	try {
		const snap = await getDocs(collection(db, "users", currentUser.uid, "watchLater"));
		const ids = [];
		snap.forEach((d) => ids.push(d.id));
		if (ids.length > 0) {
			setLocalWatchLater(ids);
			return ids;
		}
		return local;
	} catch {
		return local;
	}
}
async function fetchUserLiked() {
	const local = getLocalLiked();
	const currentUser = auth.currentUser;
	if (!currentUser) return local;
	try {
		const snap = await getDocs(collection(db, "users", currentUser.uid, "liked"));
		const ids = [];
		snap.forEach((d) => ids.push(d.id));
		if (ids.length > 0) {
			setLocalLiked(ids);
			return ids;
		}
		return local;
	} catch {
		return local;
	}
}
function getDismissed() {
	return read("yt.dismissed", {
		videoIds: [],
		channelIds: []
	});
}
function setDismissed(data) {
	write("yt.dismissed", data);
}
async function fetchDismissed() {
	const local = getDismissed();
	const currentUser = auth.currentUser;
	if (!currentUser) return local;
	`${currentUser.uid}`;
	try {
		const docRef = doc(db, "users", currentUser.uid, "prefs", "dismissed");
		const snap = await getDoc(docRef);
		if (snap.exists()) {
			const data = snap.data();
			const remote = {
				videoIds: Array.isArray(data.videoIds) ? data.videoIds : [],
				channelIds: Array.isArray(data.channelIds) ? data.channelIds : []
			};
			const merged = {
				videoIds: Array.from(/* @__PURE__ */ new Set([...local.videoIds, ...remote.videoIds])),
				channelIds: Array.from(/* @__PURE__ */ new Set([...local.channelIds, ...remote.channelIds]))
			};
			setDismissed(merged);
			return merged;
		}
	} catch {}
	return local;
}
async function syncDismissedToCloud(data) {
	const currentUser = auth.currentUser;
	if (!currentUser) return;
	const docPath = `users/${currentUser.uid}/prefs/dismissed`;
	try {
		const docRef = doc(db, "users", currentUser.uid, "prefs", "dismissed");
		await setDoc(docRef, data, { merge: true });
	} catch (error) {
		handleFirestoreError(error, OperationType.WRITE, docPath);
	}
}
async function dismissVideo(videoId) {
	if (!videoId) return;
	const current = getDismissed();
	if (!current.videoIds.includes(videoId)) {
		const updated = {
			...current,
			videoIds: [videoId, ...current.videoIds]
		};
		setDismissed(updated);
		await syncDismissedToCloud(updated);
	}
}
async function dismissChannel(channelId) {
	if (!channelId) return;
	const current = getDismissed();
	if (!current.channelIds.includes(channelId)) {
		const updated = {
			...current,
			channelIds: [channelId, ...current.channelIds]
		};
		setDismissed(updated);
		await syncDismissedToCloud(updated);
	}
}
async function undoDismiss(id) {
	if (!id) return;
	const current = getDismissed();
	const updated = {
		videoIds: current.videoIds.filter((v) => v !== id),
		channelIds: current.channelIds.filter((c) => c !== id)
	};
	setDismissed(updated);
	await syncDismissedToCloud(updated);
}
/**
* Fetches user's subscribed channels from YouTube Data API v3.
*/
async function fetchYouTubeSubscriptions(accessToken) {
	const subscriptions = [];
	let pageToken = void 0;
	let pagesFetched = 0;
	const maxPages = 4;
	do {
		const url = new URL("https://www.googleapis.com/youtube/v3/subscriptions");
		url.searchParams.set("part", "snippet");
		url.searchParams.set("mine", "true");
		url.searchParams.set("maxResults", "50");
		if (pageToken) url.searchParams.set("pageToken", pageToken);
		const res = await fetch(url.toString(), { headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: "application/json"
		} });
		if (!res.ok) {
			const errorText = await res.text();
			console.warn("YouTube API subscriptions response:", res.status, errorText);
			let isServiceDisabled = false;
			let disabledMessage = "";
			try {
				const errJson = JSON.parse(errorText);
				if (errJson?.error?.message?.includes("has not been used in project") || errJson?.error?.message?.includes("before or it is disabled") || errJson?.error?.details?.some((d) => d.reason === "SERVICE_DISABLED")) {
					isServiceDisabled = true;
					disabledMessage = errJson?.error?.message || "YouTube Data API v3 is disabled.";
				}
			} catch {}
			if (isServiceDisabled) {
				const err = /* @__PURE__ */ new Error(`SERVICE_DISABLED: ${disabledMessage}`);
				err.code = "SERVICE_DISABLED";
				err.activationUrl = "https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=998894461308";
				throw err;
			}
			break;
		}
		const data = await res.json();
		if (Array.isArray(data.items)) for (const item of data.items) {
			const channelId = item.snippet?.resourceId?.channelId;
			const channelName = item.snippet?.title || "Channel";
			const avatar = item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || item.snippet?.thumbnails?.high?.url || "";
			if (channelId) subscriptions.push({
				channel_id: channelId,
				channel_name: channelName,
				channel_avatar_url: avatar,
				added_at: (/* @__PURE__ */ new Date()).toISOString()
			});
		}
		pageToken = data.nextPageToken;
		pagesFetched++;
	} while (pageToken && pagesFetched < maxPages);
	return subscriptions;
}
/**
* Fetches user's liked videos from YouTube Data API v3 (up to 50 videos).
*/
async function fetchYouTubeLikedVideos(accessToken) {
	try {
		const url = new URL("https://www.googleapis.com/youtube/v3/videos");
		url.searchParams.set("part", "snippet,contentDetails");
		url.searchParams.set("myRating", "like");
		url.searchParams.set("maxResults", "50");
		const res = await fetch(url.toString(), { headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: "application/json"
		} });
		if (!res.ok) {
			console.warn("YouTube API liked videos request returned status:", res.status);
			return [];
		}
		const data = await res.json();
		if (!Array.isArray(data.items)) return [];
		return data.items.map((item) => ({
			videoId: item.id,
			title: item.snippet?.title || "Video",
			channelTitle: item.snippet?.channelTitle || "",
			thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || ""
		}));
	} catch (err) {
		console.warn("Could not fetch YouTube liked videos:", err);
		return [];
	}
}
/**
* Imports user's YouTube data (subscriptions & liked videos), saving them to
* Firestore and local state for instant personalized home feeds and library views.
*/
async function importYouTubeUserData(accessToken) {
	const [subs, likedVideos] = await Promise.all([fetchYouTubeSubscriptions(accessToken), fetchYouTubeLikedVideos(accessToken)]);
	let mergedSubs = [];
	if (subs.length > 0) mergedSubs = await batchSaveSubscriptions(subs);
	if (likedVideos.length > 0) {
		const existingLiked = getLiked();
		const newLikedIds = likedVideos.map((v) => v.videoId);
		setLiked(Array.from(/* @__PURE__ */ new Set([...newLikedIds, ...existingLiked])));
		likedVideos.slice(0, 25).forEach((v) => {
			syncLikedToCloud(v.videoId, true);
		});
	}
	return {
		subscriptions: mergedSubs.length > 0 ? mergedSubs : subs,
		importedSubsCount: subs.length,
		importedLikedCount: likedVideos.length
	};
}
/**
* Parses Google Takeout subscriptions.csv.
* Expected columns: Channel Id, Channel URL, Channel Title
*/
function parseYouTubeSubscriptionsCsv(csvContent) {
	const lines = csvContent.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
	if (lines.length === 0) return [];
	const results = [];
	const seenIds = /* @__PURE__ */ new Set();
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (i === 0 && (line.toLowerCase().includes("channel id") || line.toLowerCase().includes("channel url"))) continue;
		const parts = [];
		let current = "";
		let inQuotes = false;
		for (let c = 0; c < line.length; c++) {
			const char = line[c];
			if (char === "\"") inQuotes = !inQuotes;
			else if (char === "," && !inQuotes) {
				parts.push(current.trim());
				current = "";
			} else current += char;
		}
		parts.push(current.trim());
		if (parts.length >= 1) {
			let channelId = parts[0]?.replace(/^"|"$/g, "").trim();
			const title = parts[2]?.replace(/^"|"$/g, "").trim() || parts[1]?.replace(/^"|"$/g, "").trim() || "Channel";
			const urlMatch = (parts[1] || parts[0]).match(/channel\/(UC[a-zA-Z0-9_-]{22})/);
			if (urlMatch && urlMatch[1]) channelId = urlMatch[1];
			if (channelId && (channelId.startsWith("UC") || channelId.length >= 20) && !seenIds.has(channelId)) {
				seenIds.add(channelId);
				results.push({
					channel_id: channelId,
					channel_name: title || channelId,
					channel_avatar_url: "",
					added_at: (/* @__PURE__ */ new Date()).toISOString()
				});
			}
		}
	}
	return results;
}
/**
* Parses JSON subscriptions export from NewPipe, FreeTube, Invidious or Takeout.
*/
function parseYouTubeSubscriptionsJson(jsonContent) {
	try {
		const data = JSON.parse(jsonContent);
		const results = [];
		const seenIds = /* @__PURE__ */ new Set();
		const items = Array.isArray(data) ? data : Array.isArray(data.subscriptions) ? data.subscriptions : Array.isArray(data.items) ? data.items : [];
		for (const item of items) {
			const channelId = item.channelId || item.channel_id || item.id || (item.url ? item.url.match(/channel\/(UC[a-zA-Z0-9_-]{22})/)?.[1] : null);
			const name = item.name || item.title || item.channelTitle || item.channel_name || "Channel";
			const avatar = item.avatar || item.channel_avatar_url || item.thumbnail || "";
			if (channelId && !seenIds.has(channelId)) {
				seenIds.add(channelId);
				results.push({
					channel_id: channelId,
					channel_name: name,
					channel_avatar_url: avatar,
					added_at: (/* @__PURE__ */ new Date()).toISOString()
				});
			}
		}
		return results;
	} catch (err) {
		console.warn("Failed to parse JSON subscriptions:", err);
		return [];
	}
}
/**
* Parses freeform text containing YouTube channel links or channel IDs.
*/
function parseYouTubeChannelsText(text) {
	const lines = text.split(/[\n,;]+/).map((l) => l.trim()).filter(Boolean);
	const results = [];
	const seenIds = /* @__PURE__ */ new Set();
	for (const line of lines) {
		const idMatch = line.match(/(UC[a-zA-Z0-9_-]{22})/);
		const channelId = idMatch ? idMatch[1] : line.startsWith("UC") ? line : null;
		if (channelId && !seenIds.has(channelId)) {
			seenIds.add(channelId);
			results.push({
				channel_id: channelId,
				channel_name: channelId,
				channel_avatar_url: "",
				added_at: (/* @__PURE__ */ new Date()).toISOString()
			});
		}
	}
	return results;
}
/**
* Saves an imported batch of subscriptions and notifies the application.
*/
async function saveImportedSubscriptions(subs) {
	if (subs.length === 0) return [];
	const saved = await batchSaveSubscriptions(subs);
	if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("yt:subscriptions-synced", { detail: {
		subscriptions: saved,
		importedSubsCount: subs.length,
		importedLikedCount: 0
	} }));
	return saved;
}
/**
* Parses Google Takeout watch-history.json
*/
function parseYouTubeWatchHistoryJson(jsonContent) {
	try {
		const rawData = JSON.parse(jsonContent);
		const items = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.items) ? rawData.items : [];
		const results = [];
		for (const item of items) {
			if (!item || !item.titleUrl) continue;
			if (Array.isArray(item.details) && item.details.some((d) => /ads/i.test(d?.name || ""))) continue;
			if (item.header && /youtube music/i.test(String(item.header))) continue;
			let videoId = "";
			try {
				videoId = new URL(item.titleUrl).searchParams.get("v") || "";
			} catch {
				const m = String(item.titleUrl).match(/[?&]v=([a-zA-Z0-9_-]{11})/);
				if (m) videoId = m[1];
			}
			if (!videoId) continue;
			let title = String(item.title || "");
			title = title.replace(/^(watched\s+|شاهدت\s+)/i, "").trim();
			let channelId = "";
			if (Array.isArray(item.subtitles) && item.subtitles.length > 0) {
				const subUrl = String(item.subtitles[0]?.url || "");
				const chMatch = subUrl.match(/channel\/(UC[a-zA-Z0-9_-]{22})/);
				if (chMatch) channelId = chMatch[1];
				else {
					const after = subUrl.split("/channel/")[1];
					if (after) channelId = after.split("/")[0].split("?")[0];
				}
			}
			const ts = item.time ? new Date(item.time).getTime() : Date.now();
			results.push({
				v: videoId,
				c: channelId,
				t: title,
				ts: Number.isNaN(ts) ? Date.now() : ts
			});
		}
		results.sort((a, b) => b.ts - a.ts);
		const seen = /* @__PURE__ */ new Set();
		const deduplicated = [];
		for (const item of results) if (!seen.has(item.v)) {
			seen.add(item.v);
			deduplicated.push(item);
		}
		return deduplicated;
	} catch (err) {
		console.warn("Failed to parse watch-history.json:", err);
		return [];
	}
}
/**
* Parses Google Takeout search-history.json
*/
function parseYouTubeSearchHistoryJson(jsonContent) {
	try {
		const rawData = JSON.parse(jsonContent);
		const items = Array.isArray(rawData) ? rawData : Array.isArray(rawData?.items) ? rawData.items : [];
		const parsed = [];
		for (const item of items) {
			if (!item || !item.title) continue;
			const q = String(item.title).replace(/^(searched for\s+|بحثت عن\s+)/i, "").trim();
			if (!q) continue;
			const ts = item.time ? new Date(item.time).getTime() : 0;
			parsed.push({
				query: q,
				ts: Number.isNaN(ts) ? 0 : ts
			});
		}
		parsed.sort((a, b) => b.ts - a.ts);
		const seen = /* @__PURE__ */ new Set();
		const queries = [];
		for (const p of parsed) {
			const lower = p.query.toLowerCase();
			if (!seen.has(lower)) {
				seen.add(lower);
				queries.push(p.query);
				if (queries.length >= 100) break;
			}
		}
		return queries;
	} catch (err) {
		console.warn("Failed to parse search-history.json:", err);
		return [];
	}
}
/**
* Saves imported watch history into localStorage "yt.importedHistory" (compressed, up to 2000 items)
*/
function saveImportedHistory(items) {
	if (!items.length) return 0;
	try {
		let existing = [];
		const raw = localStorage.getItem("yt.importedHistory");
		if (raw) existing = JSON.parse(raw);
		const map = /* @__PURE__ */ new Map();
		for (const it of existing) if (it.v) map.set(it.v, it);
		for (const it of items) if (it.v) {
			const prev = map.get(it.v);
			if (!prev || it.ts > prev.ts) map.set(it.v, it);
		}
		const merged = [...map.values()].sort((a, b) => b.ts - a.ts).slice(0, 2e3);
		localStorage.setItem("yt.importedHistory", JSON.stringify(merged));
		if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("yt:imported-history-updated"));
		return merged.length;
	} catch (err) {
		console.warn("Failed to save imported history:", err);
		return 0;
	}
}
/**
* Saves imported search queries into localStorage "yt.searches" (prepends up to 100 unique queries)
*/
function saveImportedSearches(queries) {
	if (!queries.length) return 0;
	try {
		let existing = [];
		const raw = localStorage.getItem("yt.searches");
		if (raw) existing = JSON.parse(raw);
		const seen = /* @__PURE__ */ new Set();
		const combined = [];
		for (const q of queries) {
			const lower = q.trim().toLowerCase();
			if (lower && !seen.has(lower)) {
				seen.add(lower);
				combined.push(q.trim());
			}
		}
		for (const q of existing) {
			const lower = q.trim().toLowerCase();
			if (lower && !seen.has(lower)) {
				seen.add(lower);
				combined.push(q.trim());
			}
		}
		const finalSearches = combined.slice(0, 200);
		localStorage.setItem("yt.searches", JSON.stringify(finalSearches));
		return queries.length;
	} catch (err) {
		console.warn("Failed to save imported searches:", err);
		return 0;
	}
}
function getImportedHistoryCount() {
	try {
		const raw = localStorage.getItem("yt.importedHistory");
		if (!raw) return 0;
		const items = JSON.parse(raw);
		return Array.isArray(items) ? items.length : 0;
	} catch {
		return 0;
	}
}
function getImportedSearchesCount() {
	try {
		const raw = localStorage.getItem("yt.searches");
		if (!raw) return 0;
		const items = JSON.parse(raw);
		return Array.isArray(items) ? items.length : 0;
	} catch {
		return 0;
	}
}
function clearImportedData() {
	try {
		localStorage.removeItem("yt.importedHistory");
		localStorage.removeItem("yt.searches");
		if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("yt:imported-history-updated"));
	} catch (err) {
		console.warn("Failed to clear imported data:", err);
	}
}
var AuthContext = (0, import_react.createContext)({
	user: null,
	loading: true,
	importingYouTube: false,
	lastImportResult: null,
	signIn: async () => null,
	signOut: async () => {},
	syncYouTubeData: async () => null
});
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [importingYouTube, setImportingYouTube] = (0, import_react.useState)(false);
	const [lastImportResult, setLastImportResult] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const cached = getCachedGoogleUser();
		if (cached) {
			setUser(cached);
			setLoading(false);
		}
		const unsub = onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				const mappedUser = {
					uid: currentUser.uid,
					email: currentUser.email,
					displayName: currentUser.displayName,
					photoURL: currentUser.photoURL
				};
				setUser(mappedUser);
				try {
					await syncUserProfile(mappedUser);
				} catch (err) {
					console.warn("User profile sync notice:", err);
				}
			} else {
				const currentGsi = getCachedGoogleUser();
				if (currentGsi) setUser(currentGsi);
				else setUser(null);
			}
			setLoading(false);
		});
		return () => unsub();
	}, []);
	const performYouTubeImport = async (token) => {
		try {
			setImportingYouTube(true);
			const result = await importYouTubeUserData(token);
			setLastImportResult(result);
			if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("yt:subscriptions-synced", { detail: result }));
			return result;
		} catch (err) {
			console.warn("YouTube import notice:", err);
			throw err;
		} finally {
			setImportingYouTube(false);
		}
	};
	const signIn = async () => {
		try {
			const res = await loginWithGoogle();
			if (res?.user) {
				setUser(res.user);
				try {
					await syncUserProfile(res.user);
				} catch (err) {
					console.warn("User profile sync notice:", err);
				}
				if (res.accessToken) try {
					await performYouTubeImport(res.accessToken);
				} catch (err) {
					console.warn("Auto-sync YouTube on sign-in failed:", err);
				}
				return res.user;
			}
			return null;
		} catch (err) {
			if (!isPopupClosedError(err)) console.warn("Sign in ended:", err);
			return null;
		}
	};
	const syncYouTubeData = async () => {
		try {
			let token = getCachedAccessToken();
			if (!token) token = await requestYouTubeAccessToken();
			if (token) return await performYouTubeImport(token);
			return null;
		} catch (err) {
			if (isPopupClosedError(err)) return null;
			throw err;
		}
	};
	const signOut = async () => {
		try {
			await logoutUser();
			setUser(null);
			setLastImportResult(null);
		} catch (err) {
			console.warn("Sign out ended:", err);
			throw err;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			user,
			loading,
			importingYouTube,
			lastImportResult,
			signIn,
			signOut,
			syncYouTubeData
		},
		children
	});
}
function useAuth() {
	return (0, import_react.useContext)(AuthContext);
}
function ShortsIcon({ className = "w-6 h-6" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		fill: "currentColor",
		className,
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M17.77 10.32l-1.6-.83L17.6 8.7a3.74 3.74 0 0 0 1.5-2.35 3.7 3.7 0 0 0-.43-2.8 3.74 3.74 0 0 0-3.24-1.87c-.65 0-1.3.17-1.87.5L6.23 5.6a3.74 3.74 0 0 0-1.5 2.35 3.7 3.7 0 0 0 .43 2.8c.33.57.8 1.04 1.37 1.38l1.6.83-1.43.79a3.74 3.74 0 0 0-1.5 2.35 3.7 3.7 0 0 0 .43 2.8 3.74 3.74 0 0 0 3.24 1.87c.65 0 1.3-.17 1.87-.5l7.33-4.22a3.74 3.74 0 0 0 1.5-2.35 3.7 3.7 0 0 0-.43-2.8 3.73 3.73 0 0 0-1.37-1.38zM10 14.65v-5.3L14.6 12 10 14.65z" })
	});
}
function SubscriptionsIcon({ className = "w-6 h-6" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 24 24",
		fill: "currentColor",
		className,
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M20 8H4V6h16v2zm-2-6H6v2h12V2zm4 10v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-6 4l-6-3.27v6.53L16 16z" })
	});
}
function LogoIcon({ className = "w-8 h-8" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 28 20",
		className,
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "28",
			height: "20",
			rx: "5",
			fill: "#FF0000"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M11.5 5.5v9l8-4.5-8-4.5z",
			fill: "#fff"
		})]
	});
}
var entries = [];
var listeners$1 = /* @__PURE__ */ new Set();
function pushDebug(label, path, body) {
	entries = [{
		label,
		path,
		at: Date.now(),
		body
	}, ...entries].slice(0, 8);
	listeners$1.forEach((l) => l());
}
function getDebug() {
	return entries;
}
function clearDebug() {
	entries = [];
	listeners$1.forEach((l) => l());
}
function subscribeDebug(fn) {
	listeners$1.add(fn);
	return () => {
		listeners$1.delete(fn);
	};
}
var queryInput = (data) => objectType({ q: stringType().min(1) }).parse(data);
var searchVideosFn = createServerFn({ method: "POST" }).inputValidator(queryInput).handler(createSsrRpc("6c107fbeddfebecfade5757810a2c71586eab58b0aa58408eb40e323cba31003"));
var searchPageFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	q: stringType().min(1),
	continuation: stringType().nullable().optional()
}).parse(data)).handler(createSsrRpc("d3e053beb9baef7858aa8ff1a9c0b9ff4c6ae59e8d67b8421f3e266406ed231a"));
var suggestionsFn = createServerFn({ method: "POST" }).inputValidator(queryInput).handler(createSsrRpc("c179f018c7afafe2d17f332193a04e4ae0a6dc223c7e4b391482e17f731c50de"));
var trendingFn = createServerFn({ method: "POST" }).handler(createSsrRpc("a49e691b622c5fe29a55a052c2f795cd5b21b11101f470cdc26a4fb38d9c31f8"));
var trendingPageFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ cursors: arrayType(stringType().nullable()).optional() }).parse(data ?? {})).handler(createSsrRpc("81f6ffa4e0e71a805c26ed520123cfdb43e38ed55594fd0fe73a596c6ecd7607"));
var videoDetailsFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ id: stringType().min(6) }).parse(data)).handler(createSsrRpc("e58a257fcd97eda44ff2fb91258575a7acdae5d28eae84cb918f8133a8eb8d8e"));
var playlistFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ id: stringType().min(2) }).parse(data)).handler(createSsrRpc("6ed3ca6507a5b00906856c4ba982ac97251ddfce084aa658a1c12d6d8b8aa5bc"));
var channelFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ id: stringType().min(1) }).parse(data)).handler(createSsrRpc("7de321903635e9457261e7fd09127551080505b7a86bd3deb5bbb7a8b6f8c9c7"));
var channelFeedFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ id: stringType().min(1) }).parse(data)).handler(createSsrRpc("d95940ea77e4afe8ab6f56da31d5c1c8d5dc6bc8bfa475fbbd764e56630f7cc9"));
var browsePageFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ continuation: stringType().min(1) }).parse(data)).handler(createSsrRpc("5b0b18d8b92aa7dae9f22a3451e9df74637d6be54115a44f4b7f3156d077d1d9"));
var commentsPageFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ token: stringType().min(1) }).parse(data)).handler(createSsrRpc("6ea08d0d84b44bcea33a8849ef5f29f447e191f3cfa5f45718053b4853f67a62"));
var homeCandidatesFn = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	channelIds: arrayType(stringType()),
	seedVideoIds: arrayType(stringType()),
	queries: arrayType(stringType())
}).parse(data ?? {})).handler(createSsrRpc("082f69d107aea7952728f6125376cb9f1571a57f603de01dfdbce54d2d68c0aa"));
/**
* Client-side data API.
*
* All requests go through our own server (TanStack server functions), which
* talks to YouTube directly. No public Piped instances, no CORS proxies — the
* previous source of "everything failed" errors.
*/
/** First/next page of search results (pass the previous `next`). */
async function searchPaged(q, next = null) {
	const r = await run(`بحث · ${q}${next ? " · المزيد" : ""}`, () => searchPageFn({ data: {
		q,
		continuation: next ?? null
	} }));
	return {
		items: r.items,
		next: r.continuation,
		channels: r.channels,
		playlists: r.playlists
	};
}
/** First/next page of the hot feed. */
async function trendingPaged(next = null) {
	const cursors = next;
	const r = await run(`الرائج${next ? " · المزيد" : ""}`, () => trendingPageFn({ data: cursors ? { cursors } : {} }));
	const exhausted = r.cursors.every((c) => !c);
	return {
		items: r.items,
		next: exhausted ? null : r.cursors
	};
}
var preview = (v) => {
	const s = JSON.stringify(v, null, 1) ?? "";
	return s.length > 2e5 ? s.slice(0, 2e5) + "\n…" : s;
};
async function run(label, fn) {
	try {
		const data = await fn();
		pushDebug(label, "server", preview(data));
		return data;
	} catch (e) {
		pushDebug(`${label} — فشل`, "server", e instanceof Error ? `${e.message}\n\n${e.stack ?? ""}` : String(e));
		throw e;
	}
}
function searchVideos(q) {
	return run(`بحث · ${q}`, () => searchVideosFn({ data: { q } }));
}
async function suggestions(q) {
	try {
		return await suggestionsFn({ data: { q } });
	} catch {
		return [];
	}
}
var streamCache = /* @__PURE__ */ new Map();
function getStreams(videoId) {
	let p = streamCache.get(videoId);
	if (!p) {
		p = run(`فيديو · ${videoId}`, () => videoDetailsFn({ data: { id: videoId } }));
		streamCache.set(videoId, p);
		p.catch(() => streamCache.delete(videoId));
	}
	return p;
}
var playlistCache = /* @__PURE__ */ new Map();
function getPlaylist(id) {
	let p = playlistCache.get(id);
	if (!p) {
		p = run(`قائمة تشغيل · ${id}`, () => playlistFn({ data: { id } }));
		playlistCache.set(id, p);
		p.catch(() => playlistCache.delete(id));
	}
	return p;
}
var channelCache = /* @__PURE__ */ new Map();
function getChannel(channelId) {
	let p = channelCache.get(channelId);
	if (!p) {
		p = run(`قناة · ${channelId}`, () => channelFn({ data: { id: channelId } }));
		channelCache.set(channelId, p);
		p.catch(() => channelCache.delete(channelId));
	}
	return p;
}
var channelFeedCache = /* @__PURE__ */ new Map();
function channelFeed(channelId) {
	let p = channelFeedCache.get(channelId);
	if (!p) {
		p = run(`فيد القناة · ${channelId}`, () => channelFeedFn({ data: { id: channelId } }));
		channelFeedCache.set(channelId, p);
		p.catch(() => channelFeedCache.delete(channelId));
	}
	return p;
}
/** Fetch a generic browse continuation page (channel tabs, etc). */
async function browsePaged(continuation) {
	const r = await run(`المزيد من المحتوى`, () => browsePageFn({ data: { continuation } }));
	return {
		items: r.items,
		next: r.continuation
	};
}
var trendingCache = { value: null };
function getTrending() {
	if (!trendingCache.value) {
		trendingCache.value = run("الرائج", () => trendingFn());
		trendingCache.value.catch(() => trendingCache.value = null);
	}
	return trendingCache.value;
}
async function getCommentsPage(token) {
	return run("تعليقات إضافية", () => commentsPageFn({ data: { token } }));
}
async function homeCandidates(params) {
	return run("تجميع المرشحات للصفحة الرئيسية", () => homeCandidatesFn({ data: params }));
}
async function refreshNotifications() {
	try {
		const subs = await getSubscriptions();
		if (!subs.length) return;
		const targetSubs = subs.slice(0, 10);
		for (const sub of targetSubs) try {
			const latestVideo = ((await getChannel(sub.channel_id)).relatedStreams || [])[0];
			if (latestVideo) {
				const videoId = videoIdFromUrl(latestVideo.url);
				if (!videoId) continue;
				await addNotification({
					video_id: videoId,
					title: latestVideo.title,
					thumbnail: latestVideo.thumbnail,
					channel_id: sub.channel_id,
					channel_name: sub.channel_name,
					channel_avatar: sub.channel_avatar_url,
					created_at: (/* @__PURE__ */ new Date()).toISOString()
				});
			}
		} catch (e) {
			console.warn(`Failed to check notifications for channel ${sub.channel_id}`, e);
		}
	} catch (e) {
		console.error("Failed to refresh notifications", e);
	}
}
function YouTubeImportModal({ isOpen, onClose, onImportSuccess }) {
	const { isAr } = useLanguage();
	const { syncYouTubeData, importingYouTube } = useAuth();
	const [activeTab, setActiveTab] = (0, import_react.useState)("file");
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	const [fileError, setFileError] = (0, import_react.useState)(null);
	const [fileSuccess, setFileSuccess] = (0, import_react.useState)(null);
	const [successSummary, setSuccessSummary] = (0, import_react.useState)(null);
	const [isProcessing, setIsProcessing] = (0, import_react.useState)(false);
	const [importedHistoryCount, setImportedHistoryCount] = (0, import_react.useState)(() => getImportedHistoryCount());
	const [importedSearchesCount, setImportedSearchesCount] = (0, import_react.useState)(() => getImportedSearchesCount());
	const [pastedText, setPastedText] = (0, import_react.useState)("");
	const [pasteError, setPasteError] = (0, import_react.useState)(null);
	const [oauthError, setOauthError] = (0, import_react.useState)(null);
	const [activationUrl, setActivationUrl] = (0, import_react.useState)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	if (!isOpen) return null;
	const handleClearImportedData = () => {
		clearImportedData();
		setImportedHistoryCount(0);
		setImportedSearchesCount(0);
		setSuccessSummary(isAr ? "تم مسح سجل المشاهدات والبحثات المستوردة بنجاح." : "Imported watch and search history cleared.");
	};
	const handleFiles = async (files) => {
		if (!files || files.length === 0) return;
		setIsProcessing(true);
		setFileError(null);
		setFileSuccess(null);
		setSuccessSummary(null);
		let totalSubs = 0;
		let totalWatch = 0;
		let totalSearch = 0;
		const errors = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			try {
				const text = await file.text();
				const fname = file.name.toLowerCase();
				const trimmed = text.trim();
				if (fname.includes("watch-history") || trimmed.startsWith("[") && (trimmed.includes("\"titleUrl\"") || trimmed.includes("watch?v=") || trimmed.includes("\"Watched ") || trimmed.includes("\"شاهدت "))) {
					const items = parseYouTubeWatchHistoryJson(trimmed);
					if (items.length > 0) {
						const savedCount = saveImportedHistory(items);
						totalWatch += savedCount;
					} else errors.push(isAr ? `لم يتم العثور على فيديوهات صالحة في ${file.name}` : `No valid videos found in ${file.name}`);
					continue;
				}
				if (fname.includes("search-history") || trimmed.startsWith("[") && (trimmed.includes("\"Searched for ") || trimmed.includes("\"بحثت عن "))) {
					const queries = parseYouTubeSearchHistoryJson(trimmed);
					if (queries.length > 0) {
						const savedCount = saveImportedSearches(queries);
						totalSearch += savedCount;
					} else errors.push(isAr ? `لم يتم العثور على عمليات بحث صالحة في ${file.name}` : `No valid search queries found in ${file.name}`);
					continue;
				}
				let subs = [];
				if (fname.endsWith(".json") || trimmed.startsWith("{") || trimmed.startsWith("[")) subs = parseYouTubeSubscriptionsJson(trimmed);
				else {
					subs = parseYouTubeSubscriptionsCsv(trimmed);
					if (subs.length === 0) subs = parseYouTubeChannelsText(trimmed);
				}
				if (subs.length > 0) {
					await saveImportedSubscriptions(subs);
					totalSubs += subs.length;
				} else errors.push(isAr ? `تعذر استخراج بيانات من الملف ${file.name}` : `Could not parse data from ${file.name}`);
			} catch (err) {
				console.warn(`Error reading file ${file.name}:`, err);
				errors.push(isAr ? `خطأ أثناء قراءة الملف ${file.name}` : `Error reading file ${file.name}`);
			}
		}
		setImportedHistoryCount(getImportedHistoryCount());
		setImportedSearchesCount(getImportedSearchesCount());
		if (totalSubs > 0 || totalWatch > 0 || totalSearch > 0) {
			const parts = [];
			if (totalSubs > 0) parts.push(isAr ? `${totalSubs} قناة` : `${totalSubs} channels`);
			if (totalWatch > 0) parts.push(isAr ? `${totalWatch} مشاهدة` : `${totalWatch} watch history items`);
			if (totalSearch > 0) parts.push(isAr ? `${totalSearch} استعلام بحث` : `${totalSearch} search queries`);
			const summary = isAr ? `تم بنجاح استيراد: ${parts.join("، و ")}!` : `Successfully imported: ${parts.join(", and ")}!`;
			setSuccessSummary(summary);
			if (totalSubs > 0) {
				setFileSuccess(totalSubs);
				onImportSuccess?.(totalSubs);
			}
			setTimeout(() => {
				onClose();
			}, 2200);
		} else if (errors.length > 0) setFileError(errors.join(" | "));
		else setFileError(isAr ? "لم يتم العثور على بيانات صالحة في الملفات المحددة." : "No valid data found in selected files.");
		setIsProcessing(false);
	};
	const handleFileChange = (e) => {
		if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
		e.target.value = "";
	};
	const handleDrop = (e) => {
		e.preventDefault();
		setDragOver(false);
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
	};
	const handlePasteSubmit = async (e) => {
		e.preventDefault();
		setPasteError(null);
		if (!pastedText.trim()) {
			setPasteError(isAr ? "يرجى لصق روابط أو معرفات القنوات أولاً." : "Please paste channel links or IDs first.");
			return;
		}
		setIsProcessing(true);
		try {
			let subs = parseYouTubeSubscriptionsCsv(pastedText);
			if (subs.length === 0) subs = parseYouTubeSubscriptionsJson(pastedText);
			if (subs.length === 0) subs = parseYouTubeChannelsText(pastedText);
			if (subs.length === 0) {
				setPasteError(isAr ? "لم يتم التعرف على روابط قنوات يوتيوب. تأكد من إدخال روابط مثل: https://www.youtube.com/channel/UC... أو معرفات تبدأ بـ UC" : "No channel links detected. Make sure to enter links like https://www.youtube.com/channel/UC...");
				return;
			}
			await saveImportedSubscriptions(subs);
			setFileSuccess(subs.length);
			onImportSuccess?.(subs.length);
			setTimeout(() => {
				onClose();
			}, 1600);
		} catch {
			setPasteError(isAr ? "حدث خطأ أثناء معالجة القنوات." : "Failed to import channels.");
		} finally {
			setIsProcessing(false);
		}
	};
	const handleOAuthSync = async () => {
		setOauthError(null);
		setActivationUrl(null);
		try {
			const result = await syncYouTubeData();
			if (result && result.importedSubsCount > 0) {
				setFileSuccess(result.importedSubsCount);
				onImportSuccess?.(result.importedSubsCount);
				setTimeout(() => {
					onClose();
				}, 1600);
			}
		} catch (err) {
			if (isPopupClosedError(err)) {
				setOauthError(isAr ? "تم إغلاق نافذة تسجيل الدخول." : "Login window was closed.");
				setActivationUrl(null);
			} else {
				console.warn("Direct OAuth notice:", err);
				const errMessage = err instanceof Error ? err.message : String(err);
				const errObj = err;
				if (errMessage.includes("SERVICE_DISABLED") || errMessage.includes("has not been used in project") || errMessage.includes("before or it is disabled")) {
					setOauthError(isAr ? "خدمة YouTube Data API v3 غير مفعلة حالياً في مشروع Google Cloud (المشروع 998894461308). يرجى تفعيلها من الرابط أدناه ثم المحاولة، أو استخدم خيار (ملف Google Takeout) بالأعلى للاستيراد الفوري مجاناً دون الحاجة لأي تفعيل!" : "YouTube Data API v3 is not enabled in Google Cloud project 998894461308. Please enable it using the link below, or switch to Google Takeout tab for instant sync!");
					setActivationUrl(errObj?.activationUrl || "https://console.developers.google.com/apis/api/youtube.googleapis.com/overview?project=998894461308");
				} else {
					setActivationUrl(null);
					setOauthError(isAr ? "تم رفض الإذن (خطأ 403): تطبيق Google هذا في وضع الاختبار (Testing Mode) ويتطلب اعتماداً رسمياً أو إضافة بريدك كمختبر في Google Cloud Console. نوصيك باستخدام خيار (رفع ملف Google Takeout CSV) فوراً دون أي قيود!" : "Access Denied (403): This Google App is in Testing Mode and requires developer approval or verification. Please use the Google Takeout CSV upload option instead for 100% instant sync!");
				}
			}
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		id: "yt-import-modal-overlay",
		className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			id: "yt-import-modal-card",
			className: "relative w-full max-w-lg bg-yt-nav border border-yt-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-6 py-4 border-b border-yt-border bg-yt-surface/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 rounded-full bg-red-600/15 flex items-center justify-center text-red-500",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-base text-yt-text",
							children: isAr ? "استيراد اشتراكات وقنوات YouTube" : "Import YouTube Subscriptions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-yt-sub",
							children: isAr ? "لمزامنة خلاصتك واشتراكاتك المفضلة فوراً" : "Sync your personal feed and favorite channels"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "p-1.5 rounded-full hover:bg-yt-hover text-yt-sub hover:text-yt-text transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex border-b border-yt-border px-6 bg-yt-surface/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveTab("file"),
							className: `flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${activeTab === "file" ? "border-red-500 text-red-500" : "border-transparent text-yt-sub hover:text-yt-text"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "ملف Google Takeout (موصى به)" : "Takeout CSV (Recommended)" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveTab("paste"),
							className: `flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${activeTab === "paste" ? "border-red-500 text-red-500" : "border-transparent text-yt-sub hover:text-yt-text"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPlus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "لصق روابط" : "Paste Links" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveTab("oauth"),
							className: `flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-all ${activeTab === "oauth" ? "border-red-500 text-red-500" : "border-transparent text-yt-sub hover:text-yt-text"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "مزامنة حساب Google" : "Direct OAuth" })]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 overflow-y-auto space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 bg-yt-surface rounded-xl border border-yt-border flex flex-wrap items-center justify-between gap-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-4 text-yt-sub",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "w-4 h-4 text-sky-400" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "المشاهدات المستوردة:" : "Imported Views:" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-yt-text",
											children: importedHistoryCount
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-amber-400" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "البحثات المستوردة:" : "Imported Searches:" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-yt-text",
											children: importedSearchesCount
										})
									]
								})]
							}), (importedHistoryCount > 0 || importedSearchesCount > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleClearImportedData,
								className: "flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-medium transition-colors",
								title: isAr ? "مسح المشاهدات والبحثات المستوردة" : "Clear imported history & searches",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "مسح البيانات المستوردة" : "Clear Imported" })]
							})]
						}),
						(successSummary || fileSuccess !== null) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs animate-in zoom-in-95",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-5 h-5 shrink-0 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-sm",
								children: successSummary || (isAr ? `تم بنجاح استيراد ${fileSuccess} قناة إلى اشتراكاتك!` : `Successfully imported ${fileSuccess} channels!`)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-emerald-300/80",
								children: isAr ? "تم تحديث خلاصتك الشخصية وقائمة الاشتراكات وبروفايل الذوق." : "Your feed, subscriptions, and taste profile have been updated."
							})] })]
						}),
						activeTab === "file" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 bg-yt-surface/70 rounded-xl border border-yt-border text-xs space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 font-medium text-yt-text",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-[11px] font-bold shrink-0",
												children: "1"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "ملفات Google Takeout المدعومة:" : "Supported Google Takeout files:" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "https://takeout.google.com/takeout/custom/youtube",
											target: "_blank",
											rel: "noreferrer",
											className: "inline-flex items-center gap-1 text-red-400 hover:text-red-300 font-medium underline shrink-0 text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "فتح Google Takeout" : "Open Takeout" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3 h-3" })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-yt-sub text-[11px] leading-relaxed",
										children: isAr ? "يمكنك رفع ملف subscriptions.csv (الاشتراكات)، أو watch-history.json (سجل المشاهدة)، أو search-history.json (سجل البحث)، أو اختيار أكثر من ملف معاً لبناء بروفايل ذوق فوري!" : "You can upload subscriptions.csv, watch-history.json, or search-history.json, or select multiple files together to build your taste profile instantly!"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onDragOver: (e) => {
										e.preventDefault();
										setDragOver(true);
									},
									onDragLeave: () => setDragOver(false),
									onDrop: handleDrop,
									onClick: () => fileInputRef.current?.click(),
									className: `border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all ${dragOver ? "border-red-500 bg-red-500/10 scale-[1.01]" : "border-yt-border hover:border-red-500/60 hover:bg-yt-surface/50"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: fileInputRef,
											type: "file",
											multiple: true,
											accept: ".csv,.json,.txt",
											onChange: handleFileChange,
											className: "hidden"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-12 h-12 rounded-full bg-yt-surface flex items-center justify-center text-yt-sub group-hover:text-red-400",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "w-6 h-6" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold text-yt-text",
											children: isProcessing ? isAr ? "جاري معالجة وحفظ الملفات..." : "Processing & saving files..." : isAr ? "اسحب وأفلت ملفات Takeout هنا" : "Drag & drop your Takeout files here"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-yt-sub mt-1",
											children: isAr ? "اختر subscriptions.csv و watch-history.json و search-history.json" : "Select subscriptions.csv, watch-history.json, or search-history.json"
										})] })
									]
								}),
								fileError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fileError })]
								})
							]
						}),
						activeTab === "paste" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handlePasteSubmit,
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-yt-sub",
									children: isAr ? "الصق روابط قنوات يوتيوب أو معرفات القنوات (واحد في كل سطر أو مفصولة بفواصل):" : "Paste YouTube channel URLs or channel IDs (one per line or separated by commas):"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: 5,
									value: pastedText,
									onChange: (e) => setPastedText(e.target.value),
									placeholder: "https://www.youtube.com/channel/UC_x5XG1OV2P6uZZ5FSM9Ttw\nUCBR8-60-B28hp2BmDPdntcQ\nhttps://www.youtube.com/@mkbhd",
									className: "w-full bg-yt-surface border border-yt-border rounded-xl p-3 text-xs text-yt-text focus:outline-none focus:border-red-500 transition-colors font-mono resize-none"
								}),
								pasteError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pasteError })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "submit",
									disabled: isProcessing || !pastedText.trim(),
									className: "w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white text-xs font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2",
									children: [isProcessing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListPlus, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "استيراد القنوات المكتوبة" : "Import Pasted Channels" })]
								})
							]
						}),
						activeTab === "oauth" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تنبيه هام حول خطأ 403 من Google:" : "Important note about Google 403 error:" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] leading-relaxed text-amber-200/90",
										children: isAr ? "تفرض Google قيوداً أمنية صارمة على واجهة YouTube API وتمنع الحسابات غير المسجلة كمختبرين في Google Cloud Console من منح إذن القراءة التلقائي للتطبيقات التي لم تكمل المراجعة الرسمية. إذا ظهرت لك رسالة الخطأ 403 access_denied، استخدم تبويب (ملف Google Takeout) بالأعلى للاستيراد الفوري مجاناً وبأمان تام." : "Google restricts YouTube API read access in test mode apps. If you see 403 access_denied, switch to the Takeout CSV tab to import with 1 click."
									})]
								}),
								oauthError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "leading-relaxed",
											children: oauthError
										})]
									}), activationUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: activationUrl,
										target: "_blank",
										rel: "noreferrer",
										className: "mt-1 inline-flex items-center gap-1.5 self-start px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-medium text-xs border border-red-500/30 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تفعيل YouTube Data API v3 في Google Cloud Console" : "Enable YouTube Data API v3 in Google Cloud" })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									disabled: importingYouTube,
									onClick: handleOAuthSync,
									className: "w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white text-xs font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-600/20",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-4 h-4 ${importingYouTube ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: importingYouTube ? isAr ? "جاري الاتصال وسحب الاشتراكات..." : "Connecting and syncing..." : isAr ? "محاولة المزامنة المباشرة مع يوتيوب" : "Attempt Direct YouTube OAuth Sync" })]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-6 py-3 border-t border-yt-border bg-yt-surface/30 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "px-4 py-1.5 rounded-lg bg-yt-surface hover:bg-yt-hover text-yt-text text-xs font-medium transition-colors",
						children: isAr ? "إغلاق" : "Close"
					})
				})
			]
		})
	});
}
function Header({ onToggleSidebar, onHome, inWatch, onBack, onSearch, onLiveSearch, onOpenSettings, searchQuery }) {
	const { lang, setLang, t, isAr } = useLanguage();
	const { user, signIn, signOut, importingYouTube, syncYouTubeData, lastImportResult } = useAuth();
	const [showImportModal, setShowImportModal] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)(searchQuery || "");
	const [mobileSearch, setMobileSearch] = (0, import_react.useState)(false);
	const [popover, setPopover] = (0, import_react.useState)(null);
	const [focused, setFocused] = (0, import_react.useState)(false);
	const [sugg, setSugg] = (0, import_react.useState)([]);
	const [active, setActive] = (0, import_react.useState)(-1);
	const [listening, setListening] = (0, import_react.useState)(false);
	const [notifs, setNotifs] = (0, import_react.useState)(null);
	const [unreadCount, setUnreadCount] = (0, import_react.useState)(0);
	const [notifsErr, setNotifsErr] = (0, import_react.useState)(false);
	const blurTimer = (0, import_react.useRef)(null);
	const suggTimer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (searchQuery !== void 0) setQuery(searchQuery);
	}, [searchQuery]);
	(0, import_react.useEffect)(() => {
		const q = query.trim();
		setActive(-1);
		if (!q) {
			setSugg([]);
			return;
		}
		if (suggTimer.current) window.clearTimeout(suggTimer.current);
		suggTimer.current = window.setTimeout(async () => {
			const r = await suggestions(q);
			setSugg(r.slice(0, 10));
		}, 180);
		return () => {
			if (suggTimer.current) window.clearTimeout(suggTimer.current);
		};
	}, [query]);
	(0, import_react.useEffect)(() => {
		return () => {
			if (blurTimer.current) window.clearTimeout(blurTimer.current);
			if (suggTimer.current) window.clearTimeout(suggTimer.current);
		};
	}, []);
	const onKeyDown = (e) => {
		if (!sugg.length || !focused) return;
		if (e.key === "ArrowDown" || e.key === "ArrowUp") {
			e.preventDefault();
			const next = e.key === "ArrowDown" ? (active + 1) % sugg.length : (active - 1 + sugg.length) % sugg.length;
			setActive(next);
			setQuery(sugg[next]);
		} else if (e.key === "Escape") {
			setFocused(false);
			e.target.blur();
		}
	};
	(0, import_react.useEffect)(() => {
		const load = async () => {
			try {
				const list = await getNotifications();
				setNotifs(list);
				setUnreadCount(list.filter((n) => !n.read).length);
			} catch (err) {
				setNotifsErr(true);
			}
		};
		load();
		const handleUpdate = () => load();
		window.addEventListener("yt:notifs-updated", handleUpdate);
		return () => window.removeEventListener("yt:notifs-updated", handleUpdate);
	}, []);
	(0, import_react.useEffect)(() => {
		if (user) {
			refreshNotifications();
			const timer = setInterval(refreshNotifications, 9e5);
			return () => clearInterval(timer);
		}
	}, [user]);
	const submit = (q) => {
		const trimmed = q.trim();
		if (!trimmed) return;
		setFocused(false);
		setMobileSearch(false);
		onSearch(trimmed);
	};
	const startListening = () => {
		const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SR) return;
		const rec = new SR();
		rec.lang = isAr ? "ar-EG" : "en-US";
		rec.interimResults = false;
		setListening(true);
		rec.onresult = (e) => {
			const res = e.results[0][0].transcript;
			setQuery(res);
			setListening(false);
			submit(res);
		};
		rec.onerror = () => setListening(false);
		rec.onend = () => setListening(false);
		rec.start();
	};
	const openBell = () => {
		setPopover(popover === "bell" ? null : "bell");
	};
	const showSuggestions = focused && sugg.length > 0 && !inWatch;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "fixed top-0 inset-x-0 h-14 z-50 bg-yt-bg flex items-center justify-between gap-2 px-2 sm:px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 sm:gap-2 shrink-0",
					children: [
						inWatch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onBack,
							className: "w-10 h-10 rounded-full hover:bg-yt-surface flex items-center justify-center text-yt-text",
							"aria-label": t("back"),
							title: t("backAndMinimize"),
							children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5" })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onToggleSidebar,
							className: "hidden md:flex w-10 h-10 rounded-full hover:bg-yt-surface items-center justify-center",
							"aria-label": t("menu"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-5 h-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: onHome,
							className: "flex items-center gap-1.5 px-1.5 h-10 rounded-lg hover:bg-yt-surface/60 transition-colors",
							"aria-label": "YouTube",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoIcon, { className: "w-7 h-5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display font-extrabold text-lg tracking-tight leading-none",
									children: t("brandName")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sup", {
									className: "text-[9px] text-yt-sub font-sans font-medium -mt-2 hidden sm:inline",
									children: t("countryCode")
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onToggleSidebar,
							className: "md:hidden w-10 h-10 rounded-full hover:bg-yt-surface flex items-center justify-center",
							"aria-label": t("menu"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-5 h-5" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden sm:flex flex-1 max-w-[640px] items-center gap-3 mx-2 relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (e) => {
							e.preventDefault();
							submit(query);
						},
						className: "flex flex-1 h-10 items-center relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 items-center h-full rounded-full border border-yt-border bg-yt-bg focus-within:border-yt-blue/70 px-4 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: query,
									onChange: (e) => setQuery(e.target.value),
									onFocus: () => {
										if (blurTimer.current) window.clearTimeout(blurTimer.current);
										setFocused(true);
									},
									onBlur: () => {
										blurTimer.current = window.setTimeout(() => setFocused(false), 120);
									},
									onKeyDown,
									placeholder: t("searchPlaceholder"),
									className: "flex-1 bg-transparent outline-none text-[15px] placeholder:text-yt-sub"
								}), query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setQuery(""),
									className: "ms-2 text-yt-sub hover:text-yt-text",
									"aria-label": t("clearSearch"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "h-full w-16 grid place-items-center rounded-e-full border border-s-0 border-yt-border bg-yt-raised hover:bg-yt-surface transition-colors",
								"aria-label": t("searchTooltip"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-5 h-5" })
							}),
							showSuggestions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "dropdown-in absolute top-11 inset-x-0 z-50 bg-yt-raised rounded-xl border border-yt-border py-2 shadow-2xl shadow-black/70",
								children: sugg.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onMouseDown: (e) => {
										e.preventDefault();
										setQuery(s);
										submit(s);
									},
									className: `w-full flex items-center gap-4 px-4 py-2 text-start ${i === active ? "bg-yt-surface" : "hover:bg-yt-surface"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-4 h-4 text-yt-sub shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm truncate",
										children: s
									})]
								}, i))
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: startListening,
						className: "w-10 h-10 rounded-full bg-yt-raised hover:bg-yt-surface grid place-items-center shrink-0 transition-colors",
						"aria-label": t("voiceSearchTooltip"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 sm:gap-2 shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMobileSearch(true),
							className: "sm:hidden w-10 h-10 rounded-full hover:bg-yt-surface grid place-items-center",
							"aria-label": t("searchTooltip"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-5 h-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setPopover(popover === "create" ? null : "create"),
								className: "hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-full bg-yt-raised hover:bg-yt-surface text-sm font-medium transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-5 h-5" }),
									" ",
									t("create")
								]
							}), popover === "create" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fixed inset-0 z-40",
								onClick: () => setPopover(null)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "dropdown-in absolute end-0 top-12 z-50 w-56 rounded-xl bg-yt-raised border border-yt-border py-2 shadow-2xl shadow-black/60",
								children: [
									{
										icon: Video,
										label: t("uploadVideo")
									},
									{
										icon: Radio,
										label: t("goLive")
									},
									{
										icon: PenLine,
										label: t("createPost")
									}
								].map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setPopover(null),
									className: "w-full flex items-center gap-4 px-4 py-2.5 hover:bg-yt-surface text-sm text-start",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(it.icon, { className: "w-5 h-5 shrink-0" }),
										" ",
										it.label
									]
								}, it.label))
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: openBell,
								className: "relative w-10 h-10 rounded-full hover:bg-yt-surface grid place-items-center transition-colors",
								"aria-label": t("notifications"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-5 h-5" }), unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute top-1 end-1 min-w-4 h-4 px-1 rounded-full bg-yt-red text-[10px] font-bold grid place-items-center",
									children: unreadCount > 9 ? "+9" : unreadCount
								})]
							}), popover === "bell" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fixed inset-0 z-40",
								onClick: () => setPopover(null)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "dropdown-in absolute end-0 top-12 z-50 w-[340px] max-w-[90vw] rounded-xl bg-yt-raised border border-yt-border shadow-2xl shadow-black/60 overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between px-4 py-3 border-b border-yt-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display font-bold text-[15px]",
										children: t("notifications")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "w-8 h-8 rounded-full hover:bg-yt-surface grid place-items-center",
										"aria-label": "More",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "w-4 h-4" })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "max-h-96 overflow-y-auto custom-scrollbar",
									children: [
										notifs === null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "py-10 grid place-items-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-6 h-6 animate-spin text-yt-sub" })
										}),
										notifsErr && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "px-4 py-8 text-sm text-yt-sub text-center leading-relaxed",
											children: t("notifsError")
										}),
										notifs && notifs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "px-4 py-12 text-sm text-yt-sub text-center leading-relaxed",
											children: t("noNewNotifications")
										}),
										notifs?.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => {
												setPopover(null);
												markNotificationAsRead(n.id);
												onSearch("");
												const video = {
													url: `/watch?v=${n.video_id}`,
													title: n.title,
													thumbnail: n.thumbnail,
													uploaderName: n.channel_name,
													uploaderUrl: `/channel/${n.channel_id}`,
													duration: 0
												};
												window.dispatchEvent(new CustomEvent("yt:open", { detail: video }));
											},
											className: `w-full flex gap-3 px-4 py-3 hover:bg-yt-surface transition-colors text-start relative ${!n.read ? "bg-yt-blue/5" : ""}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "shrink-0 pt-1",
													children: n.channel_avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: n.channel_avatar,
														alt: "",
														className: "w-10 h-10 rounded-full",
														referrerPolicy: "no-referrer"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "w-10 h-10 rounded-full bg-yt-surface grid place-items-center",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-4 h-4 text-yt-sub" })
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex-1 min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[13px] leading-snug line-clamp-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-bold",
																children: n.channel_name
															}),
															" ",
															t("uploadedNewVideo"),
															" ",
															n.title
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-yt-sub mt-1",
														children: new Date(n.created_at).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
															month: "short",
															day: "numeric",
															hour: "numeric",
															minute: "numeric"
														})
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: n.thumbnail,
													alt: "",
													referrerPolicy: "no-referrer",
													className: "w-[86px] h-[48px] rounded-md object-cover shrink-0",
													loading: "lazy"
												}),
												!n.read && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute end-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yt-blue" })
											]
										}, n.id))
									]
								})]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex items-center gap-1.5",
							children: [
								!user && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => signIn().catch(() => {}),
									className: "hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-yt-blue/40 text-yt-blue hover:bg-yt-blue/10 text-xs sm:text-sm font-semibold transition-colors",
									title: t("signInWithGoogle"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("signIn") })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setPopover(popover === "account" ? null : "account"),
									className: "w-8 h-8 rounded-full ms-1 grid place-items-center text-sm font-bold bg-gradient-to-br from-yt-blue to-teal-400 text-black hover:opacity-90 active:scale-95 transition-transform overflow-hidden",
									"aria-label": t("account"),
									children: user?.photoURL ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: user.photoURL,
										alt: user.displayName || "User",
										className: "w-full h-full object-cover",
										referrerPolicy: "no-referrer"
									}) : user?.displayName ? user.displayName.charAt(0).toUpperCase() : user ? "U" : isAr ? "أ" : "G"
								}),
								popover === "account" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "fixed inset-0 z-40",
									onClick: () => setPopover(null)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "dropdown-in absolute end-0 top-12 z-50 w-72 rounded-xl bg-yt-raised border border-yt-border py-2 shadow-2xl shadow-black/70 overflow-hidden text-yt-text",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3 px-4 py-3 border-b border-yt-border",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-10 h-10 rounded-full grid place-items-center font-bold bg-gradient-to-br from-yt-blue to-teal-400 text-black shrink-0 overflow-hidden",
												children: user?.photoURL ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: user.photoURL,
													alt: user.displayName || "User",
													className: "w-full h-full object-cover",
													referrerPolicy: "no-referrer"
												}) : user?.displayName ? user.displayName.charAt(0).toUpperCase() : user ? "U" : isAr ? "أ" : "G"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-bold text-sm truncate",
													children: user ? user.displayName || "User" : t("guest")
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-yt-sub truncate",
													children: user ? user.email : t("notSignedIn")
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "px-4 py-2 bg-yt-surface/50 text-xs border-b border-yt-border flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 text-yt-sub",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "w-3.5 h-3.5 text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("firebaseCloud") })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" }), user ? t("synced") : t("ready")]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "px-4 py-3 bg-red-500/10 border-b border-yt-border",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between mb-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "w-4 h-4 text-red-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs font-semibold",
														children: t("youtubeChannels")
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-yt-sub",
													children: lastImportResult ? `${lastImportResult.importedSubsCount} ${t("channelsImported")}` : user ? t("googleConnected") : t("readyToImport")
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: () => {
													setPopover(null);
													setShowImportModal(true);
												},
												className: "w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white text-xs font-medium transition-all",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("importYouTubeSubs") })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "py-1",
											children: [
												!user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => {
														setPopover(null);
														signIn().catch(() => {});
													},
													className: "w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-yt-surface text-sm text-start font-medium text-yt-blue",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "w-5 h-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("signInWithGoogle") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[11px] text-yt-sub",
															children: t("signInGoogleBenefit")
														})]
													})]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => {
														setPopover(null);
														signOut().catch(() => {});
													},
													className: "w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-yt-surface text-sm text-start font-medium text-red-400 hover:text-red-300",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-5 h-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("signOut") })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => {
														setPopover(null);
														syncYouTubeData().catch(() => {});
													},
													className: "w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-yt-surface text-sm text-start",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-5 h-5 text-yt-sub shrink-0 ${importingYouTube ? "animate-spin text-yt-blue" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: importingYouTube ? t("syncing") : t("syncYouTube") })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => {
														setPopover(null);
														onOpenSettings?.();
													},
													className: "w-full flex items-center gap-3.5 px-4 py-2.5 hover:bg-yt-surface text-sm text-start",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "w-5 h-5 text-yt-sub shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("settings") })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => {
														setLang(isAr ? "en" : "ar");
														setPopover(null);
													},
													className: "w-full flex items-center justify-between px-4 py-2.5 hover:bg-yt-surface text-sm text-start",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-3.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-5 h-5 text-yt-sub shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [t("language"), ":"] })]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs font-semibold px-2 py-0.5 rounded bg-yt-surface border border-yt-border",
														children: isAr ? "العربية" : "English"
													})]
												})
											]
										})
									]
								})] })
							]
						})
					]
				})
			]
		}),
		mobileSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-[60] bg-yt-bg sm:hidden flex flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2 px-2 h-14 shrink-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMobileSearch(false),
						className: "w-10 h-10 my-auto rounded-full hover:bg-yt-surface grid place-items-center",
						"aria-label": t("back"),
						children: isAr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (e) => {
							e.preventDefault();
							submit(query);
						},
						className: "flex flex-1 h-10 my-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-1 items-center h-full rounded-full bg-yt-raised px-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								autoFocus: true,
								value: query,
								onChange: (e) => setQuery(e.target.value),
								onKeyDown,
								placeholder: t("searchPlaceholder"),
								className: "flex-1 bg-transparent outline-none text-[15px] placeholder:text-yt-sub"
							}), query && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setQuery(""),
								"aria-label": t("clearSearch"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5 text-yt-sub" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "w-14 grid place-items-center rounded-e-full bg-yt-raised",
							"aria-label": t("searchTooltip"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-5 h-5" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: startListening,
						className: "w-10 h-10 my-auto rounded-full bg-yt-raised grid place-items-center",
						"aria-label": t("voiceSearchTooltip"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "w-5 h-5" })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto py-2",
				children: sugg.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setQuery(s);
						submit(s);
					},
					className: "w-full flex items-center gap-4 px-5 py-2.5 hover:bg-yt-surface text-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-yt-sub" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm",
						children: s
					})]
				}, i))
			})]
		}),
		listening && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-[70] bg-yt-bg/98 backdrop-blur flex flex-col items-center justify-center gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 rounded-full bg-yt-red/30 animate-ping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "relative w-20 h-20 rounded-full bg-yt-red grid place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "w-9 h-9 text-white" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display font-bold text-lg",
					children: t("listening")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-yt-sub text-sm",
					children: t("speakNow")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setListening(false),
					className: "mt-4 h-9 px-5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium",
					children: t("cancel")
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YouTubeImportModal, {
			isOpen: showImportModal,
			onClose: () => setShowImportModal(false)
		})
	] });
}
function Item({ icon: Icon, label, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: `w-full flex items-center gap-5 px-3 h-10 rounded-lg text-sm transition-colors text-start ${active ? "bg-yt-surface font-bold text-white" : "hover:bg-yt-surface/70 text-yt-text/90"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-5 h-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate",
			children: label
		})]
	});
}
function FullContent({ active, subs, customPlaylists = [], onNavigate, onHome, onOpenSettings }) {
	const { t, isAr } = useLanguage();
	const MAIN = [
		{
			icon: House,
			label: t("home"),
			id: "home"
		},
		{
			icon: ShortsIcon,
			label: t("shorts"),
			id: "shorts"
		},
		{
			icon: SubscriptionsIcon,
			label: t("subscriptions"),
			id: "subs"
		}
	];
	const YOU = [
		{
			icon: UserRound,
			label: t("yourChannel"),
			id: "channel"
		},
		{
			icon: History,
			label: t("history"),
			id: "history"
		},
		{
			icon: ListVideo,
			label: t("playlists"),
			id: "playlists"
		},
		{
			icon: SquarePlay,
			label: t("yourVideos"),
			id: "videos"
		},
		{
			icon: Clock,
			label: t("watchLater"),
			id: "watchlater"
		},
		{
			icon: ThumbsUp,
			label: t("likedVideos"),
			id: "liked"
		}
	];
	const EXPLORE = [
		{
			icon: Flame,
			label: t("trending"),
			id: "trending"
		},
		{
			icon: Music2,
			label: t("music"),
			id: "music"
		},
		{
			icon: Gamepad2,
			label: t("gaming"),
			id: "gaming"
		},
		{
			icon: Newspaper,
			label: t("news"),
			id: "news"
		},
		{
			icon: Trophy,
			label: t("sports"),
			id: "sports"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "px-3 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-2",
				children: MAIN.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
					icon: m.icon,
					label: m.label,
					active: active === m.label || m.id === "home" && active === "home",
					onClick: () => {
						if (m.id === "home") onHome();
						else onNavigate(m.label);
					}
				}, m.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-yt-border my-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "flex items-center gap-1.5 px-3 h-9 text-[15px] font-bold text-yt-text",
						children: [t("you"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-4 h-4" })]
					}),
					YOU.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
						icon: y.icon,
						label: y.label,
						active: active === y.label,
						onClick: () => onNavigate(y.label)
					}, y.id)),
					customPlaylists.slice(0, 5).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
						icon: ListVideo,
						label: p.title,
						active: active === `playlist:${p.id}`,
						onClick: () => onNavigate(`playlist:${p.id}`)
					}, p.id))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-yt-border my-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "px-3 h-9 flex items-center text-[15px] font-bold text-yt-text",
						children: t("subscriptions")
					}),
					subs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 py-2 text-[13px] text-yt-sub",
						children: t("notifsEmpty")
					}),
					subs.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onNavigate(`channel:${s.channel_id}`),
						className: "w-full flex items-center gap-5 px-3 h-10 rounded-lg text-sm hover:bg-yt-surface/70 text-start",
						children: [s.channel_avatar_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: s.channel_avatar_url,
							alt: s.channel_name,
							referrerPolicy: "no-referrer",
							className: "w-6 h-6 rounded-full object-cover shrink-0 bg-yt-surface"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-6 h-6 rounded-full grid place-items-center text-[11px] font-bold text-white shrink-0",
							style: { background: `hsl(${[...s.channel_name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360} 55% 42%)` },
							children: s.channel_name.charAt(0)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate text-yt-text/90",
							children: s.channel_name
						})]
					}, s.channel_id))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-yt-border my-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "px-3 h-9 flex items-center text-[15px] font-bold text-yt-text",
					children: t("explore")
				}), EXPLORE.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
					icon: e.icon,
					label: e.label,
					active: active === e.label,
					onClick: () => onNavigate(e.label)
				}, e.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-yt-border my-2" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
						icon: Settings,
						label: t("settings"),
						onClick: onOpenSettings
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
						icon: Globe,
						label: `${t("language")}: ${t("languageName")}`,
						onClick: onOpenSettings
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
						icon: ShieldCheck,
						label: isAr ? "الحقوق والسياسات" : "Terms & Policies",
						active: active === "policies",
						onClick: () => onNavigate("policies")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
						icon: Flag,
						label: t("report"),
						onClick: () => onNavigate(t("report"))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
						icon: CircleQuestionMark,
						label: t("help"),
						onClick: () => onNavigate(t("help"))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-3 pt-4 text-xs text-yt-sub leading-relaxed",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onNavigate("policies"),
						className: "font-bold text-[13px] text-yt-text/80 hover:text-white mb-2 text-start block transition-colors",
						children: isAr ? "الحقوق والسياسات والأمان" : "Policies, Terms & Safety"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onNavigate("policies"),
						className: "text-start block hover:underline text-yt-sub hover:text-yt-text transition-colors",
						children: t("terms")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1",
						children: t("howWorks")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3",
						children: t("copyright")
					})
				]
			})
		]
	});
}
function Sidebar({ expanded, pushable = true, active, subs, customPlaylists = [], onNavigate, onHome, mobileOpen, onCloseMobile, onOpenSettings }) {
	const { t, isAr } = useLanguage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		pushable && !expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
			className: "hidden md:flex fixed top-14 bottom-0 start-0 w-[72px] z-30 bg-yt-bg flex-col items-center pt-1 gap-1 border-e border-yt-border/40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: onHome,
					className: `w-16 py-3.5 rounded-xl flex flex-col items-center gap-1.5 text-[10px] transition-colors ${active === "home" || active === t("home") ? "bg-yt-surface font-bold text-white" : "hover:bg-yt-surface/70 text-yt-sub"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-6 h-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("home") })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onNavigate(t("shorts")),
					className: "w-16 py-3.5 rounded-xl flex flex-col items-center gap-1.5 text-[10px] hover:bg-yt-surface/70 text-yt-sub transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortsIcon, { className: "w-6 h-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("shorts") })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onNavigate(t("subscriptions")),
					className: "w-16 py-3.5 rounded-xl flex flex-col items-center gap-1.5 text-[10px] hover:bg-yt-surface/70 text-yt-sub transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubscriptionsIcon, { className: "w-6 h-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("subscriptions") })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => onNavigate(t("yourChannel")),
					className: "w-16 py-3.5 rounded-xl flex flex-col items-center gap-1.5 text-[10px] hover:bg-yt-surface/70 text-yt-sub transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "w-6 h-6" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("you") })]
				})
			]
		}),
		pushable && expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "hidden md:block fixed top-14 bottom-0 start-0 w-60 z-30 bg-yt-bg overflow-y-auto border-e border-yt-border/40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullContent, {
				active,
				subs,
				customPlaylists,
				onNavigate,
				onHome,
				onOpenSettings
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `fixed inset-0 z-[55] transition-opacity duration-200 ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 bg-black/60",
				onClick: onCloseMobile
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `absolute top-0 bottom-0 start-0 w-[280px] max-w-[85vw] bg-yt-bg overflow-y-auto transition-transform duration-250 ease-out border-e border-yt-border ${mobileOpen ? "translate-x-0" : isAr ? "translate-x-full" : "-translate-x-full"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "h-14 flex items-center gap-2 px-4 sticky top-0 bg-yt-bg z-10 border-b border-yt-border/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onCloseMobile,
							className: "w-10 h-10 -ms-2 rounded-full hover:bg-yt-surface grid place-items-center",
							"aria-label": t("cancel"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoIcon, { className: "w-7 h-5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display font-extrabold text-lg",
							children: t("brandName")
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FullContent, {
					active,
					subs,
					customPlaylists,
					onNavigate: (l) => {
						onNavigate(l);
						onCloseMobile();
					},
					onHome: () => {
						onHome();
						onCloseMobile();
					},
					onOpenSettings: () => {
						onOpenSettings?.();
						onCloseMobile();
					}
				})]
			})]
		})
	] });
}
function KeyboardShortcutsModal({ open, onClose }) {
	const { isAr } = useLanguage();
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-xl bg-yt-raised border border-yt-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-6 py-4 border-b border-yt-border bg-yt-raised shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, { className: "w-5 h-5 text-yt-blue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold font-display text-yt-text",
							children: isAr ? "اختصارات لوحة المفاتيح" : "Keyboard Shortcuts"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "w-9 h-9 rounded-full hover:bg-yt-surface grid place-items-center text-yt-sub hover:text-yt-text transition-colors cursor-pointer",
						"aria-label": isAr ? "إغلاق" : "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4 sm:p-6 overflow-y-auto space-y-1 text-sm text-yt-text divide-y divide-yt-border/40",
					children: [
						{
							keys: ["k", isAr ? "مسافة" : "Space"],
							descAr: "تشغيل / إيقاف مؤقت",
							descEn: "Toggle play / pause"
						},
						{
							keys: ["j"],
							descAr: "التراجع 10 ثوانٍ",
							descEn: "Seek backward 10 seconds"
						},
						{
							keys: ["l"],
							descAr: "التقدم 10 ثوانٍ",
							descEn: "Seek forward 10 seconds"
						},
						{
							keys: ["←"],
							descAr: "التراجع 5 ثوانٍ",
							descEn: "Seek backward 5 seconds"
						},
						{
							keys: ["→"],
							descAr: "التقدم 5 ثوانٍ",
							descEn: "Seek forward 5 seconds"
						},
						{
							keys: ["↑"],
							descAr: "زيادة مستوى الصوت (5%)",
							descEn: "Volume up (5%)"
						},
						{
							keys: ["↓"],
							descAr: "خفض مستوى الصوت (5%)",
							descEn: "Volume down (5%)"
						},
						{
							keys: ["m"],
							descAr: "كتم / إلغاء كتم الصوت",
							descEn: "Toggle mute"
						},
						{
							keys: ["f"],
							descAr: "التبديل إلى ملء الشاشة",
							descEn: "Toggle full screen"
						},
						{
							keys: ["t"],
							descAr: "التبديل إلى وضع المسرح",
							descEn: "Toggle theater mode"
						},
						{
							keys: ["i"],
							descAr: "فتح المشغّل المصغّر",
							descEn: "Toggle miniplayer"
						},
						{
							keys: [
								"0",
								"-",
								"9"
							],
							descAr: "الانتقال إلى نسبة محددة (0% - 90%)",
							descEn: "Jump to percentage (0% - 90%)"
						},
						{
							keys: [
								"Shift",
								"+",
								"N"
							],
							descAr: "الانتقال للفيديو التالي",
							descEn: "Play next video"
						},
						{
							keys: ["?"],
							descAr: "عرض نافذة اختصارات لوحة المفاتيح",
							descEn: "Show keyboard shortcuts dialog"
						}
					].map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between py-2 px-2 hover:bg-yt-surface/50 rounded-lg transition-colors gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium text-yt-text/90",
							children: isAr ? item.descAr : item.descEn
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1 shrink-0 font-mono",
							children: item.keys.map((k, kIdx) => k === "+" || k === "-" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-yt-sub px-0.5",
								children: k
							}, kIdx) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
								className: "px-2 py-1 text-xs font-semibold bg-yt-surface border border-yt-border text-yt-text rounded-md shadow-xs",
								children: k
							}, kIdx))
						})]
					}, idx))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-6 py-3 border-t border-yt-border bg-yt-raised flex items-center justify-end shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onClose,
						className: "px-5 py-2 rounded-full bg-yt-surface hover:bg-yt-hover text-yt-text font-bold text-xs transition-all cursor-pointer",
						children: isAr ? "إغلاق" : "Close"
					})
				})
			]
		})
	});
}
var initialPlaybackTimes = {};
var initialQuality = "auto";
var initialQueue = [];
var initialQueueIndex = 0;
var initialAutoplay = true;
try {
	const savedProgress = localStorage.getItem("yt.progress");
	if (savedProgress) initialPlaybackTimes = JSON.parse(savedProgress);
	const savedQuality = localStorage.getItem("yt.quality");
	if (savedQuality) initialQuality = savedQuality;
	const savedQueue = localStorage.getItem("yt.queue");
	if (savedQueue) {
		const parsed = JSON.parse(savedQueue);
		if (Array.isArray(parsed.queue)) initialQueue = parsed.queue;
		if (typeof parsed.queueIndex === "number") initialQueueIndex = parsed.queueIndex;
	}
	const savedAutoplay = localStorage.getItem("yt.autoplay");
	if (savedAutoplay !== null) initialAutoplay = JSON.parse(savedAutoplay);
} catch (e) {}
var state = {
	searchQ: "",
	searchFilter: "All",
	miniplayer: null,
	playbackTimes: initialPlaybackTimes,
	preferredQuality: initialQuality,
	backgroundPlay: true,
	route: { type: "home" },
	queue: initialQueue,
	queueIndex: initialQueueIndex,
	autoplayNext: initialAutoplay
};
var listeners = /* @__PURE__ */ new Set();
function notify() {
	for (const listener of listeners) listener();
}
function persistQueue(queue, queueIndex) {
	try {
		localStorage.setItem("yt.queue", JSON.stringify({
			queue,
			queueIndex
		}));
	} catch (e) {}
}
function persistAutoplay(enabled) {
	try {
		localStorage.setItem("yt.autoplay", JSON.stringify(enabled));
	} catch (e) {}
}
var appStore$1 = {
	getSnapshot() {
		return state;
	},
	getServerSnapshot() {
		return state;
	},
	subscribe(listener) {
		listeners.add(listener);
		return () => listeners.delete(listener);
	},
	setSearchQ(q) {
		if (state.searchQ === q) return;
		state = {
			...state,
			searchQ: q
		};
		notify();
	},
	setSearchFilter(f) {
		if (state.searchFilter === f) return;
		state = {
			...state,
			searchFilter: f
		};
		notify();
	},
	setMiniplayer(m) {
		state = {
			...state,
			miniplayer: m
		};
		notify();
	},
	setBackgroundPlay(enabled) {
		if (state.backgroundPlay === enabled) return;
		state = {
			...state,
			backgroundPlay: enabled
		};
		notify();
	},
	setPreferredQuality(q) {
		if (state.preferredQuality === q) return;
		state = {
			...state,
			preferredQuality: q
		};
		try {
			localStorage.setItem("yt.quality", q);
		} catch (e) {}
		notify();
	},
	setRoute(r) {
		const next = typeof r === "function" ? r(state.route) : r;
		if (JSON.stringify(state.route) === JSON.stringify(next)) return;
		state = {
			...state,
			route: next
		};
		notify();
	},
	setPlaybackTime(id, time) {
		if (!id) return;
		const nextTimes = {
			...state.playbackTimes,
			[id]: Math.floor(time)
		};
		state = {
			...state,
			playbackTimes: nextTimes
		};
		try {
			localStorage.setItem("yt.progress", JSON.stringify(nextTimes));
		} catch (e) {}
	},
	getPlaybackTime(id) {
		return state.playbackTimes[id] || 0;
	},
	addToQueue(v) {
		if (!v) return;
		const nextQueue = [...state.queue, v];
		state = {
			...state,
			queue: nextQueue
		};
		persistQueue(nextQueue, state.queueIndex);
		notify();
	},
	playNext(v) {
		if (!v) return;
		const nextQueue = [...state.queue];
		if (nextQueue.length === 0) {
			nextQueue.push(v);
			state = {
				...state,
				queue: nextQueue,
				queueIndex: 0
			};
		} else {
			const insertAt = Math.min(state.queueIndex + 1, nextQueue.length);
			nextQueue.splice(insertAt, 0, v);
			state = {
				...state,
				queue: nextQueue
			};
		}
		persistQueue(state.queue, state.queueIndex);
		notify();
	},
	removeFromQueue(index) {
		if (index < 0 || index >= state.queue.length) return;
		const nextQueue = state.queue.filter((_, i) => i !== index);
		let nextIndex = state.queueIndex;
		if (index < state.queueIndex) nextIndex = Math.max(0, state.queueIndex - 1);
		else if (nextIndex >= nextQueue.length) nextIndex = Math.max(0, nextQueue.length - 1);
		state = {
			...state,
			queue: nextQueue,
			queueIndex: nextIndex
		};
		persistQueue(nextQueue, nextIndex);
		notify();
	},
	clearQueue() {
		state = {
			...state,
			queue: [],
			queueIndex: 0
		};
		persistQueue([], 0);
		notify();
	},
	setQueueIndex(index) {
		if (index < 0 || index >= state.queue.length) return;
		state = {
			...state,
			queueIndex: index
		};
		persistQueue(state.queue, index);
		notify();
	},
	advanceQueue() {
		if (state.queueIndex + 1 < state.queue.length) {
			const nextIndex = state.queueIndex + 1;
			const nextVideo = state.queue[nextIndex];
			state = {
				...state,
				queueIndex: nextIndex
			};
			persistQueue(state.queue, nextIndex);
			notify();
			return nextVideo;
		}
		return null;
	},
	reorderQueue(newQueue, newIndex) {
		const idx = newIndex !== void 0 ? newIndex : Math.min(state.queueIndex, Math.max(0, newQueue.length - 1));
		state = {
			...state,
			queue: newQueue,
			queueIndex: idx
		};
		persistQueue(newQueue, idx);
		notify();
	},
	setAutoplayNext(enabled) {
		if (state.autoplayNext === enabled) return;
		state = {
			...state,
			autoplayNext: enabled
		};
		persistAutoplay(enabled);
		notify();
	}
};
function useAppStore() {
	return (0, import_react.useSyncExternalStore)(appStore$1.subscribe, appStore$1.getSnapshot, appStore$1.getServerSnapshot);
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var DropdownMenu = DropdownMenu$1;
var DropdownMenuTrigger = DropdownMenuTrigger$1;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubTrigger$1, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuSubTrigger$1.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubContent$1, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuSubContent$1.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent$1, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuContent$1.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuItem$1.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuCheckboxItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuCheckboxItem$1.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuRadioItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuRadioItem$1.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuLabel$1.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuSeparator$1.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
function Avatar({ src, name, size = "w-9 h-9 text-xs" }) {
	const [err, setErr] = (0, import_react.useState)(false);
	const letter = (name || "؟").trim().charAt(0);
	const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
	if (!src || err) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `${size} rounded-full grid place-items-center font-bold text-white shrink-0 shadow-sm`,
		style: { background: `hsl(${hue} 60% 45%)` },
		children: letter
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: name,
		onError: () => setErr(true),
		className: `${size} rounded-full object-cover shrink-0 bg-yt-surface`,
		loading: "lazy"
	});
}
function ChipsBar({ active, onChange, chips, onOpenAIAlgorithm, isAIActive }) {
	const { t, isAr } = useLanguage();
	const defaultChips = [
		{
			id: "All",
			label: t("chipAll")
		},
		{
			id: "Trending",
			label: t("chipTrending")
		},
		{
			id: "Gaming",
			label: t("chipGaming")
		},
		{
			id: "Minecraft",
			label: t("chipMinecraft")
		},
		{
			id: "Technology",
			label: t("chipTechnology")
		},
		{
			id: "Cooking",
			label: t("chipCooking")
		},
		{
			id: "Travel",
			label: t("chipTravel")
		},
		{
			id: "Music",
			label: t("chipMusic")
		},
		{
			id: "Cars",
			label: t("chipCars")
		}
	];
	const list = chips ? chips.map((c) => typeof c === "string" ? {
		id: c,
		label: c
	} : c) : defaultChips;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "sticky top-14 z-40 bg-yt-bg/95 backdrop-blur-sm py-3 -mx-1 px-1",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2.5 overflow-x-auto no-scrollbar px-1 items-center",
			children: [onOpenAIAlgorithm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onOpenAIAlgorithm,
				className: `shrink-0 h-8 px-3 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 whitespace-nowrap flex items-center gap-1.5 shadow-sm ${isAIActive ? "bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 text-white shadow-purple-900/30" : "bg-purple-600/15 text-purple-300 border border-purple-500/30 hover:bg-purple-600/25"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "خوارزمية الذكاء الاصطناعي" : "AI Algorithm" }),
					isAIActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse shrink-0" })
				]
			}), list.map((c) => {
				const isSelected = active === c.id || active === c.label;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => onChange(c.id),
					className: `shrink-0 h-8 px-3.5 rounded-lg text-sm font-medium transition-all duration-200 active:scale-95 whitespace-nowrap ${isSelected ? "bg-yt-text text-yt-bg font-bold shadow" : "bg-yt-surface text-yt-text hover:bg-yt-hover"}`,
					children: c.label
				}, c.id);
			})]
		})
	});
}
function CardMenu({ video, onDismiss, onDismissChannel, notify, onSaveLater, onAddToPlaylist, saved, videoUrl }) {
	const { t, dir, isAr } = useLanguage();
	const [open, setOpen] = (0, import_react.useState)(false);
	const handleAddToQueue = () => {
		if (video) {
			appStore.addToQueue(video);
			notify(isAr ? "تمت الإضافة إلى قائمة الانتظار" : "Added to queue");
		} else notify(t("addedToQueueToast"));
	};
	const handlePlayNext = () => {
		if (video) {
			appStore.playNext(video);
			notify(isAr ? "سيتم تشغيله بعد المقطع الحالي" : "Set to play next");
		}
	};
	const items = [
		{
			icon: Clock,
			label: saved ? t("removeFromWatchLater") : t("saveToWatchLater"),
			act: onSaveLater
		},
		{
			icon: ListPlus,
			label: isAr ? "إضافة إلى قائمة تشغيل" : "Add to playlist",
			act: () => onAddToPlaylist?.()
		},
		{
			icon: ListVideo,
			label: isAr ? "تشغيل بعد الحالي" : "Play next",
			act: handlePlayNext
		},
		{
			icon: ListPlus,
			label: t("addToQueue"),
			act: handleAddToQueue
		},
		{
			icon: Share2,
			label: t("share"),
			act: () => {
				const link = videoUrl ? `${window.location.origin}${videoUrl.startsWith("/") ? "" : "/"}${videoUrl}` : window.location.href;
				if (typeof navigator !== "undefined" && navigator.clipboard) navigator.clipboard.writeText(link);
				notify(t("linkCopied"));
			}
		},
		{
			icon: ThumbsDown,
			label: t("notInterested"),
			act: onDismiss,
			danger: true
		},
		...onDismissChannel ? [{
			icon: TriangleAlert,
			label: isAr ? "عدم اقتراح القناة" : "Don't recommend channel",
			act: onDismissChannel,
			danger: true
		}] : []
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		onClick: (e) => e.stopPropagation(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, {
			dir,
			open,
			onOpenChange: setOpen,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: `w-8 h-8 -me-1 rounded-full hover:bg-yt-surface grid place-items-center shrink-0 transition-opacity outline-none ${open ? "opacity-100 bg-yt-surface text-yt-text" : "opacity-0 group-hover:opacity-100 max-md:opacity-100 text-yt-sub hover:text-yt-text"}`,
					onClick: (e) => {
						e.stopPropagation();
					},
					onPointerDown: (e) => {
						e.stopPropagation();
					},
					"aria-label": "Options",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "w-5 h-5" })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
				align: "end",
				side: "bottom",
				sideOffset: 6,
				className: "z-[999] w-56 rounded-xl bg-yt-raised border border-yt-border py-1.5 shadow-2xl shadow-black/80 text-yt-text backdrop-blur-none animate-in fade-in zoom-in-95 duration-150",
				onClick: (e) => e.stopPropagation(),
				children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					onSelect: () => it.act(),
					onClick: () => it.act(),
					className: `w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg cursor-pointer text-sm outline-none transition-colors select-none ${it.danger ? "text-red-400 hover:text-red-300 hover:bg-yt-surface focus:bg-yt-surface focus:text-red-300" : "text-yt-text hover:text-white hover:bg-yt-surface focus:bg-yt-surface focus:text-white"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(it.icon, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: it.label })]
				}, it.label))
			})]
		})
	});
}
function VideoCard({ video, onOpen, index, onDismiss, onDismissChannel, notify, onChannel, onSaveLater, onAddToPlaylist, saved, layout = "grid" }) {
	const { lang, t } = useLanguage();
	const id = videoIdFromUrl(video.url);
	const channelId = channelIdFromUrl(video.uploaderUrl || "");
	const { playbackTimes } = useAppStore();
	const watched = id && playbackTimes[id] || 0;
	const pct = video.duration > 0 ? Math.min(100, watched / video.duration * 100) : 0;
	const isWatched = pct >= 90;
	const remaining = Math.max(0, video.duration - watched);
	const remainingStr = fmtDuration(remaining);
	const queryClient = useQueryClient();
	const cardRef = (0, import_react.useRef)(null);
	const prefetchedRef = (0, import_react.useRef)(false);
	const handlePrefetch = (0, import_react.useCallback)(() => {
		if (!id || prefetchedRef.current) return;
		prefetchedRef.current = true;
		queryClient.prefetchQuery({
			queryKey: ["video", id],
			queryFn: () => getStreams(id)
		});
	}, [id, queryClient]);
	(0, import_react.useEffect)(() => {
		const el = cardRef.current;
		if (!el || !id) return;
		const observer = new IntersectionObserver((entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				handlePrefetch();
				observer.disconnect();
			}
		}, { threshold: .1 });
		observer.observe(el);
		return () => observer.disconnect();
	}, [id, handlePrefetch]);
	const menu = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardMenu, {
		video,
		notify,
		saved: !!saved,
		videoUrl: video.url,
		onSaveLater: () => onSaveLater?.(),
		onAddToPlaylist: () => onAddToPlaylist?.(),
		onDismiss: () => {
			onDismiss?.(id);
		},
		onDismissChannel: channelId ? () => {
			onDismissChannel?.(channelId);
		} : void 0
	});
	const isLive = isLiveStream(video);
	const isShort = isShortsVideo(video);
	const durationStr = fmtDuration(video.duration);
	const thumbSrc = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : video.thumbnail;
	const srcSet = id ? `https://i.ytimg.com/vi/${id}/mqdefault.jpg 320w, https://i.ytimg.com/vi/${id}/hqdefault.jpg 480w, https://i.ytimg.com/vi/${id}/maxresdefault.jpg 1280w` : void 0;
	const thumb = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative aspect-video rounded-xl overflow-hidden bg-yt-raised transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:shadow-lg group-hover:shadow-black/25",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: thumbSrc,
				srcSet,
				sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
				alt: video.title,
				loading: index < 4 ? "eager" : "lazy",
				fetchPriority: index < 4 ? "high" : "low",
				decoding: "async",
				referrerPolicy: "no-referrer",
				className: "w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
			}),
			isLive ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute bottom-1.5 end-1.5 bg-yt-red text-white text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1.5 shadow-md z-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-2 h-2 rounded-full bg-white live-dot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: lang === "ar" ? "مباشر" : "LIVE" })]
			}) : isShort ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute bottom-1.5 end-1.5 bg-black/85 text-white text-[11px] sm:text-xs font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 z-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortsIcon, { className: "w-3.5 h-3.5 text-yt-red" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: durationStr || (lang === "ar" ? "شورتس" : "Shorts") })]
			}) : durationStr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute bottom-1.5 end-1.5 text-white text-xs font-semibold px-1.5 py-0.5 rounded bg-black/80 z-10",
				children: pct >= 2 && pct < 90 && remainingStr ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "group-hover:hidden",
					children: durationStr
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden group-hover:inline",
					children: lang === "ar" ? `يتبقى ${remainingStr}` : `${remainingStr} left`
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: durationStr })
			}) : null,
			isWatched && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute top-2 start-2 bg-black/80 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 z-10",
				children: lang === "ar" ? "تمت المشاهدة" : "Watched"
			}),
			saved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute top-2 end-2 bg-black/75 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 z-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-3 h-3" }),
					" ",
					lang === "ar" ? "محفوظ" : "Saved"
				]
			}),
			pct >= 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-0 inset-x-0 h-[3px] bg-white/30 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-yt-red transition-all duration-300",
					style: { width: `${pct}%` }
				})
			})
		]
	});
	if (layout === "list") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		ref: cardRef,
		onMouseEnter: handlePrefetch,
		className: "rise group cursor-pointer flex gap-3 sm:gap-4",
		style: {
			contentVisibility: "auto",
			containIntrinsicSize: "0 140px",
			...index < 12 ? { animationDelay: `${index * 40}ms` } : {}
		},
		onClick: () => onOpen(video),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-40 sm:w-64 shrink-0",
				children: thumb
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0 py-0.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: `text-[15px] sm:text-lg font-medium leading-snug line-clamp-2 ${isWatched ? "opacity-60" : ""}`,
						children: video.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[13px] text-yt-sub mt-1",
						children: [fmtViews(video.views, lang) && `${fmtViews(video.views, lang)} ${t("views")} · `, timeAgo(video.uploaded, video.uploadedDate, lang)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: (e) => {
							e.stopPropagation();
							onChannel?.(video.uploaderUrl || "", video.uploaderName);
						},
						className: "mt-2 flex items-center gap-2 text-[13px] text-yt-sub hover:text-yt-text",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								src: video.uploaderAvatar,
								name: video.uploaderName,
								size: "w-6 h-6 text-[11px]"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: video.uploaderName
							}),
							video.uploaderVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "w-3.5 h-3.5 shrink-0 text-yt-sub" })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "self-start",
				children: menu
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		ref: cardRef,
		onMouseEnter: handlePrefetch,
		className: "rise group cursor-pointer",
		style: {
			contentVisibility: "auto",
			containIntrinsicSize: "0 300px",
			...index < 12 ? { animationDelay: `${index * 50}ms` } : {}
		},
		onClick: () => onOpen(video),
		children: [thumb, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-3 mt-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: (e) => {
						e.stopPropagation();
						onChannel?.(video.uploaderUrl || "", video.uploaderName);
					},
					className: "mt-0.5 transition-transform hover:scale-105 shrink-0",
					"aria-label": video.uploaderName,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						src: video.uploaderAvatar,
						name: video.uploaderName
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: `text-[15px] font-medium leading-snug line-clamp-2 text-yt-text group-hover:text-white ${isWatched ? "opacity-60" : ""}`,
							children: video.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: (e) => {
								e.stopPropagation();
								onChannel?.(video.uploaderUrl || "", video.uploaderName);
							},
							className: "mt-1 text-[13px] text-yt-sub flex items-center gap-1 hover:text-yt-text truncate",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: video.uploaderName
							}), video.uploaderVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "w-3.5 h-3.5 shrink-0 text-yt-sub" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-[13px] text-yt-sub",
							children: [fmtViews(video.views, lang) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								fmtViews(video.views, lang),
								" ",
								t("views"),
								" ·",
								" "
							] }), timeAgo(video.uploaded, video.uploadedDate, lang)]
						})
					]
				}),
				menu
			]
		})]
	});
}
function ChannelResultCard({ channel, onOpen, subscribed, onToggleSub }) {
	const { lang, t } = useLanguage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rise flex items-center gap-4 sm:gap-6 py-4 border-b border-yt-border cursor-pointer hover:bg-yt-surface/30 px-2 rounded-xl transition-colors",
		onClick: () => onOpen(channel.id),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-24 sm:w-40 flex justify-center shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					src: channel.avatar,
					name: channel.name,
					size: "w-20 h-20 sm:w-28 sm:h-28 text-2xl"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "text-[16px] sm:text-lg font-bold flex items-center gap-1.5 text-yt-text",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: channel.name
						}), channel.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "w-4 h-4 shrink-0 text-yt-sub" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] text-yt-sub mt-0.5",
						children: channel.subscribers > 0 ? `${fmtViews(channel.subscribers, lang)} ${t("subscribers")}` : lang === "ar" ? "قناة" : "Channel"
					}),
					channel.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[13px] text-yt-sub mt-1.5 line-clamp-2 max-w-2xl",
						children: channel.description
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: (e) => {
					e.stopPropagation();
					onToggleSub();
				},
				className: `h-9 px-4 rounded-full text-sm font-bold shrink-0 active:scale-95 transition-all ${subscribed ? "bg-yt-surface text-yt-text hover:bg-yt-hover" : "bg-yt-text text-yt-bg hover:bg-white/85"}`,
				children: subscribed ? t("subscribed") : t("subscribe")
			})
		]
	});
}
function PlaylistCard({ playlist, onOpen, index = 0 }) {
	const { lang } = useLanguage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rise group cursor-pointer",
		style: { animationDelay: `${Math.min(index, 11) * 50}ms` },
		onClick: () => onOpen(playlist),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-video rounded-xl overflow-hidden bg-yt-raised",
				children: [playlist.thumbnail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: playlist.thumbnail,
					alt: playlist.title,
					loading: "lazy",
					referrerPolicy: "no-referrer",
					className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full h-full bg-yt-surface" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-y-0 end-0 w-2/5 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListVideo, { className: "w-5 h-5 mb-1" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-sm",
							children: playlist.videoCount || ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px]",
							children: lang === "ar" ? "فيديو" : "videos"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-[15px] font-medium leading-snug line-clamp-2 mt-3 text-yt-text group-hover:text-white",
				children: playlist.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[13px] text-yt-sub mt-1",
				children: playlist.uploaderName || (lang === "ar" ? "قائمة تشغيل" : "Playlist")
			})
		]
	});
}
function ShortsShelf({ items, onOpen }) {
	const { lang, t } = useLanguage();
	if (!items.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "shorts-shelf",
		className: "rise my-8 py-4 border-y border-yt-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 mb-4 px-0.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortsIcon, { className: "w-7 h-7 text-yt-red" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display font-extrabold text-xl",
				children: t("shorts")
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-3 overflow-x-auto no-scrollbar snap-x pb-1",
			children: items.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => onOpen(i),
				className: "group shrink-0 w-[168px] sm:w-[190px] snap-start text-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-[9/16] rounded-xl overflow-hidden bg-yt-raised",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: s.thumbnail,
							alt: s.title,
							loading: "lazy",
							referrerPolicy: "no-referrer",
							className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "absolute top-2 end-2 flex items-center gap-1 text-[11px] font-bold text-white bg-black/50 rounded px-1.5 py-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortsIcon, { className: "w-3 h-3 text-yt-red" }), fmtViews(s.views, lang)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute bottom-2 start-2 end-2 text-[13px] font-medium leading-snug line-clamp-2 text-white",
							children: s.title
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[13px] text-yt-sub mt-2 truncate",
					children: s.uploaderName
				})]
			}, s.url))
		})]
	});
}
function SkeletonGrid({ count = 8 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8 mt-2",
		children: Array.from({ length: count }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "animate-pulse",
			style: { animationDelay: `${i * 60}ms` },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-video rounded-xl bg-yt-surface" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3 mt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-9 h-9 rounded-full bg-yt-surface shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 bg-yt-surface rounded w-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 bg-yt-surface rounded w-2/3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 bg-yt-surface rounded w-1/3" })
					]
				})]
			})]
		}, i))
	});
}
function ErrorState({ message, onRetry }) {
	const { t } = useLanguage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rise flex flex-col items-center justify-center py-24 text-center px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-20 h-20 rounded-full bg-yt-surface grid place-items-center mb-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-9 h-9 text-red-400" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display font-bold text-lg",
				children: t("loadError")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-yt-sub text-sm mt-1 max-w-sm",
				children: message || t("loadError")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: onRetry,
				className: "mt-5 h-10 px-6 rounded-full bg-yt-text text-yt-bg font-bold text-sm flex items-center gap-2 hover:bg-white/85 active:scale-95 transition-all",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "w-4 h-4" }),
					" ",
					t("retry")
				]
			})
		]
	});
}
function EmptyState({ message }) {
	const { t } = useLanguage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rise flex flex-col items-center justify-center py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-20 h-20 rounded-full bg-yt-surface grid place-items-center mb-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: "0 0 24 24",
					fill: "none",
					stroke: "currentColor",
					strokeWidth: "1.5",
					className: "w-9 h-9 text-yt-sub",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "11",
						cy: "11",
						r: "7"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "m20 20-3.5-3.5",
						strokeLinecap: "round"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display font-bold text-lg",
				children: t("noResults")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-yt-sub text-sm mt-1 max-w-xs",
				children: message || t("noResultsSuggestion")
			})
		]
	});
}
function TextWithTimestamps({ text }) {
	if (!text) return null;
	const regex = /(?:[0-9٠-٩]{1,2}:)?[0-9٠-٩]{1,2}:[0-9٠-٩]{2}/g;
	const parts = [];
	let lastIndex = 0;
	let match;
	while ((match = regex.exec(text)) !== null) {
		const rawTs = match[0];
		const matchIndex = match.index;
		if (matchIndex > lastIndex) parts.push(text.slice(lastIndex, matchIndex));
		const nums = rawTs.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))).split(":").map(Number);
		let seconds = null;
		if (nums.length === 2 && !isNaN(nums[0]) && !isNaN(nums[1]) && nums[1] < 60) seconds = nums[0] * 60 + nums[1];
		else if (nums.length === 3 && !isNaN(nums[0]) && !isNaN(nums[1]) && !isNaN(nums[2]) && nums[1] < 60 && nums[2] < 60) seconds = nums[0] * 3600 + nums[1] * 60 + nums[2];
		if (seconds !== null) {
			const s = seconds;
			parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: (e) => {
					e.stopPropagation();
					seekTo(s);
				},
				className: "text-yt-blue hover:underline font-mono px-1 py-0.5 rounded bg-yt-blue/10 hover:bg-yt-blue/20 transition-colors inline-flex items-center gap-0.5 cursor-pointer text-xs sm:text-sm font-semibold select-none me-0.5",
				children: rawTs
			}, `${matchIndex}-${rawTs}`));
		} else parts.push(rawTs);
		lastIndex = matchIndex + rawTs.length;
	}
	if (lastIndex < text.length) parts.push(text.slice(lastIndex));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: parts });
}
function QueuePanel({ onOpen }) {
	const { isAr } = useLanguage();
	const { queue, queueIndex } = useAppStore();
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	if (!queue || queue.length === 0) return null;
	const moveUp = (idx) => {
		if (idx <= 0) return;
		const newQueue = [...queue];
		const temp = newQueue[idx];
		newQueue[idx] = newQueue[idx - 1];
		newQueue[idx - 1] = temp;
		let newIndex = queueIndex;
		if (queueIndex === idx) newIndex = idx - 1;
		else if (queueIndex === idx - 1) newIndex = idx;
		appStore$1.reorderQueue(newQueue, newIndex);
	};
	const moveDown = (idx) => {
		if (idx >= queue.length - 1) return;
		const newQueue = [...queue];
		const temp = newQueue[idx];
		newQueue[idx] = newQueue[idx + 1];
		newQueue[idx + 1] = temp;
		let newIndex = queueIndex;
		if (queueIndex === idx) newIndex = idx + 1;
		else if (queueIndex === idx + 1) newIndex = idx;
		appStore$1.reorderQueue(newQueue, newIndex);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 rounded-xl border border-yt-border bg-yt-raised shadow-md overflow-hidden animate-in fade-in duration-200",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between px-3.5 py-2.5 bg-yt-surface/80 border-b border-yt-border/60",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListVideo, { className: "w-4 h-4 text-yt-blue shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs sm:text-sm font-bold text-yt-text",
						children: isAr ? "التالي في الطابور" : "Next in queue"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-yt-sub px-2 py-0.5 rounded-full bg-yt-bg font-semibold tabular-nums",
						children: queue.length
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => appStore$1.clearQueue(),
					className: "text-xs text-yt-sub hover:text-yt-red px-2 py-1 rounded hover:bg-yt-bg transition-colors flex items-center gap-1 font-medium cursor-pointer",
					title: isAr ? "مسح الطابور" : "Clear queue",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: isAr ? "مسح" : "Clear"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setCollapsed(!collapsed),
					className: "p-1 text-yt-sub hover:text-yt-text rounded hover:bg-yt-bg transition-colors cursor-pointer",
					children: collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "w-4 h-4" })
				})]
			})]
		}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-h-64 overflow-y-auto divide-y divide-yt-border/20 p-1",
			children: queue.map((item, idx) => {
				const isPlaying = idx === queueIndex;
				const id = videoIdFromUrl(item.url);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `group flex items-center gap-2 p-1.5 rounded-lg transition-colors ${isPlaying ? "bg-yt-blue/15 border border-yt-blue/30" : "hover:bg-yt-surface/60"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-5 text-center text-xs font-mono text-yt-sub shrink-0",
							children: isPlaying ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-3.5 h-3.5 text-yt-blue fill-yt-blue mx-auto animate-pulse" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: idx + 1 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => {
								appStore$1.setQueueIndex(idx);
								onOpen(item);
							},
							className: "flex items-center gap-2 flex-1 min-w-0 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative w-16 aspect-video rounded overflow-hidden bg-black shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.thumbnail || `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
									alt: item.title,
									className: "w-full h-full object-cover"
								}), item.duration > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute bottom-0.5 end-0.5 text-[9px] bg-black/80 px-1 rounded text-white font-mono",
									children: fmtDuration(item.duration)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `text-xs font-medium line-clamp-1 ${isPlaying ? "text-yt-blue font-bold" : "text-yt-text"}`,
									children: item.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-yt-sub truncate",
									children: item.uploaderName
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-0.5 opacity-80 group-hover:opacity-100 shrink-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: idx === 0,
									onClick: () => moveUp(idx),
									className: "p-1 text-yt-sub hover:text-yt-text disabled:opacity-20 hover:bg-yt-bg rounded cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "w-3.5 h-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									disabled: idx === queue.length - 1,
									onClick: () => moveDown(idx),
									className: "p-1 text-yt-sub hover:text-yt-text disabled:opacity-20 hover:bg-yt-bg rounded cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-3.5 h-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => appStore$1.removeFromQueue(idx),
									className: "p-1 text-yt-sub hover:text-yt-red hover:bg-yt-bg rounded cursor-pointer",
									title: isAr ? "إزالة من الطابور" : "Remove from queue",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-3.5 h-3.5" })
								})
							]
						})
					]
				}, `${id}-${idx}`);
			})
		})]
	});
}
function Watch({ video, onOpen, onChannel, notify, liked, onToggleLike, onAddToPlaylist, isSubscribed, onToggleSub, onMinimize, onTopRecommendedChange }) {
	const { t, isAr, lang } = useLanguage();
	const { playbackTimes } = useAppStore();
	const id = videoIdFromUrl(video.url);
	const currentTime = playbackTimes[id] || 0;
	const [attempt, setAttempt] = (0, import_react.useState)(0);
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const [disliked, setDisliked] = (0, import_react.useState)(false);
	const [mobileCommentsOpen, setMobileCommentsOpen] = (0, import_react.useState)(false);
	const [showInlineComments, setShowInlineComments] = (0, import_react.useState)(false);
	const [chaptersCollapsed, setChaptersCollapsed] = (0, import_react.useState)(false);
	const [theater, setTheater] = (0, import_react.useState)(() => {
		try {
			return localStorage.getItem("yt.theater") === "true";
		} catch {
			return false;
		}
	});
	const toggleTheater = (0, import_react.useCallback)(() => {
		setTheater((prev) => {
			const next = !prev;
			try {
				localStorage.setItem("yt.theater", String(next));
			} catch {}
			return next;
		});
	}, []);
	const [isCurrentlyPlaying, setIsCurrentlyPlaying] = (0, import_react.useState)(true);
	const [currentVolume, setCurrentVolume] = (0, import_react.useState)(100);
	const [isMuted, setIsMuted] = (0, import_react.useState)(false);
	const [videoDuration, setVideoDuration] = (0, import_react.useState)(video.duration || 0);
	const [showShortcutsModal, setShowShortcutsModal] = (0, import_react.useState)(false);
	const [commentsList, setCommentsList] = (0, import_react.useState)([]);
	const [commentsCont, setCommentsCont] = (0, import_react.useState)(void 0);
	const [loadingComments, setLoadingComments] = (0, import_react.useState)(false);
	const loadMoreCommentsRef = (0, import_react.useRef)(null);
	(0, import_react.useRef)(null);
	const [relatedStreams, setRelatedStreams] = (0, import_react.useState)([]);
	const [relatedCont, setRelatedCont] = (0, import_react.useState)(null);
	const [loadingMoreRelated, setLoadingMoreRelated] = (0, import_react.useState)(false);
	const [relatedQueryIndex, setRelatedQueryIndex] = (0, import_react.useState)(0);
	const loadMoreRelatedRef = (0, import_react.useRef)(null);
	const playerContainerRef = (0, import_react.useRef)(null);
	const labels = (0, import_react.useMemo)(() => ({
		all: isAr ? "الكل" : "All",
		fromChannel: isAr ? "من القناة" : "From channel",
		shorts: isAr ? "قصيرة" : "Shorts"
	}), [isAr]);
	const [relFilter, setRelFilter] = (0, import_react.useState)(labels.all);
	(0, import_react.useEffect)(() => {
		setRelFilter(labels.all);
	}, [labels.all]);
	const { data, isPending: loading, isError: error, refetch } = useQuery({
		queryKey: [
			"video",
			id,
			attempt
		],
		queryFn: () => getStreams(id),
		placeholderData: keepPreviousData,
		enabled: !!id
	});
	const chapters = (0, import_react.useMemo)(() => parseChapters(data?.description || ""), [data?.description]);
	const activeChapterIndex = (0, import_react.useMemo)(() => {
		if (!chapters || chapters.length === 0) return -1;
		let active = -1;
		for (let i = 0; i < chapters.length; i++) if (currentTime >= chapters[i].start) active = i;
		else break;
		return active;
	}, [chapters, currentTime]);
	(0, import_react.useEffect)(() => {
		if (data) {
			setCommentsList(data.comments || []);
			setCommentsCont(data.commentsContinuation);
			setRelatedStreams(data.relatedStreams || []);
			setMeta$1(id, {
				title: data.title,
				thumbnail: video.thumbnail,
				uploaderName: data.uploader,
				uploaderAvatar: data.uploaderAvatar,
				duration: video.duration
			});
		} else {
			setCommentsList([]);
			setCommentsCont(void 0);
			setRelatedStreams([]);
			setRelatedCont(null);
			setRelatedQueryIndex(0);
		}
	}, [
		data,
		id,
		video.thumbnail,
		video.duration
	]);
	const related = (0, import_react.useMemo)(() => {
		const list = relatedStreams.filter((r) => r.url?.includes("/watch"));
		if (relFilter === labels.fromChannel) {
			const f = list.filter((r) => r.uploaderName === (data?.uploader || video.uploaderName));
			if (f.length) return f;
		}
		if (relFilter === labels.shorts) {
			const f = list.filter((r) => r.duration > 0 && r.duration <= 60);
			if (f.length) return f;
		}
		return list;
	}, [
		relatedStreams,
		relFilter,
		data?.uploader,
		video.uploaderName,
		labels
	]);
	(0, import_react.useEffect)(() => {
		if (related && related.length > 0) onTopRecommendedChange?.(related[0]);
		else onTopRecommendedChange?.(null);
	}, [related, onTopRecommendedChange]);
	const loadMoreRelated = (0, import_react.useCallback)(async () => {
		if (loadingMoreRelated || !data) return;
		setLoadingMoreRelated(true);
		try {
			const queries = [
				data.title,
				`${data.uploader} ${data.title.split(" ").slice(0, 3).join(" ")}`,
				data.uploader,
				data.title.split(" ").filter((w) => w.length > 3).slice(0, 3).join(" ")
			].filter(Boolean);
			const res = await searchPaged(queries[relatedQueryIndex % queries.length] || data.title, relatedCont || void 0);
			if (res.items && res.items.length > 0) setRelatedStreams((prev) => {
				const seenUrls = new Set(prev.map((v) => v.url));
				seenUrls.add(video.url);
				seenUrls.add(`/watch?v=${id}`);
				const newVids = res.items.filter((v) => !seenUrls.has(v.url) && v.url?.includes("/watch"));
				return [...prev, ...newVids];
			});
			if (res.next) setRelatedCont(res.next);
			else {
				setRelatedQueryIndex((q) => q + 1);
				setRelatedCont(null);
			}
		} catch {
			setRelatedQueryIndex((q) => q + 1);
			setRelatedCont(null);
		} finally {
			setLoadingMoreRelated(false);
		}
	}, [
		loadingMoreRelated,
		data,
		relatedCont,
		relatedQueryIndex,
		video.url,
		id
	]);
	(0, import_react.useEffect)(() => {
		const el = loadMoreRelatedRef.current;
		if (!el || !data) return;
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && !loadingMoreRelated) loadMoreRelated();
		}, { rootMargin: "500px 0px" });
		observer.observe(el);
		return () => observer.disconnect();
	}, [
		loadMoreRelated,
		loadingMoreRelated,
		data
	]);
	const loadMoreComments = (0, import_react.useCallback)(async () => {
		if (loadingComments || !commentsCont) return;
		setLoadingComments(true);
		try {
			const res = await getCommentsPage(commentsCont);
			if (res.items && res.items.length > 0) setCommentsList((prev) => [...prev, ...res.items]);
			setCommentsCont(res.nextContinuation);
		} catch {} finally {
			setLoadingComments(false);
		}
	}, [loadingComments, commentsCont]);
	(0, import_react.useEffect)(() => {
		const el = loadMoreCommentsRef.current;
		if (!el || !commentsCont) return;
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting && !loadingComments) loadMoreComments();
		}, { rootMargin: "300px 0px" });
		observer.observe(el);
		return () => observer.disconnect();
	}, [
		loadMoreComments,
		loadingComments,
		commentsCont
	]);
	(0, import_react.useEffect)(() => {
		if (data) {
			const row = {
				video_id: id,
				channel_id: channelIdFromUrl(data.uploaderUrl),
				category: data.category,
				title: data.title,
				duration: video.duration,
				channel_name: data.uploader,
				watched_at: (/* @__PURE__ */ new Date()).toISOString()
			};
			addHistory(row);
			window.dispatchEvent(new CustomEvent("yt:history", { detail: row }));
		}
	}, [
		id,
		data,
		video.duration
	]);
	(0, import_react.useEffect)(() => {
		const handlePlayerInfo = (e) => {
			const info = e.detail;
			if (!info) return;
			if (typeof info.playerState === "number") setIsCurrentlyPlaying(info.playerState === 1);
			if (typeof info.volume === "number") setCurrentVolume(info.volume);
			if (typeof info.muted === "boolean") setIsMuted(info.muted);
			if (typeof info.duration === "number" && info.duration > 0) setVideoDuration(info.duration);
		};
		window.addEventListener("yt:player-info", handlePlayerInfo);
		return () => window.removeEventListener("yt:player-info", handlePlayerInfo);
	}, []);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			const activeEl = document.activeElement;
			if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.isContentEditable || activeEl.closest("input, textarea, [contenteditable='true']"))) return;
			const key = e.key;
			if (e.shiftKey && (key === "N" || key === "n")) {
				e.preventDefault();
				const storeState = appStore$1.getSnapshot();
				const q = storeState.queue;
				const qIdx = storeState.queueIndex;
				if (q && q.length > 0 && qIdx + 1 < q.length) {
					appStore$1.advanceQueue();
					onOpen?.(q[qIdx + 1]);
				} else document.querySelector("#persistent-player iframe")?.contentWindow?.postMessage(JSON.stringify({
					event: "command",
					func: "nextVideo",
					args: []
				}), "*");
				return;
			}
			if (key === "?" || e.shiftKey && key === "/") {
				e.preventDefault();
				setShowShortcutsModal((prev) => !prev);
				return;
			}
			if (key === " " || key === "k" || key === "K") {
				e.preventDefault();
				const func = isCurrentlyPlaying ? "pauseVideo" : "playVideo";
				document.querySelector("#persistent-player iframe")?.contentWindow?.postMessage(JSON.stringify({
					event: "command",
					func,
					args: []
				}), "*");
				setIsCurrentlyPlaying((prev) => !prev);
				return;
			}
			if (key === "j" || key === "J") {
				e.preventDefault();
				seekTo(Math.max(0, currentTime - 10));
				return;
			}
			if (key === "l" || key === "L") {
				e.preventDefault();
				const dur = videoDuration || data?.duration || 0;
				seekTo(dur > 0 ? Math.min(dur, currentTime + 10) : currentTime + 10);
				return;
			}
			if (key === "ArrowLeft") {
				e.preventDefault();
				seekTo(Math.max(0, currentTime - 5));
				return;
			}
			if (key === "ArrowRight") {
				e.preventDefault();
				const dur = videoDuration || data?.duration || 0;
				seekTo(dur > 0 ? Math.min(dur, currentTime + 5) : currentTime + 5);
				return;
			}
			if (key === "ArrowUp") {
				e.preventDefault();
				const nextVol = Math.min(100, currentVolume + 5);
				setCurrentVolume(nextVol);
				const iframe = document.querySelector("#persistent-player iframe");
				iframe?.contentWindow?.postMessage(JSON.stringify({
					event: "command",
					func: "setVolume",
					args: [nextVol]
				}), "*");
				if (isMuted && nextVol > 0) {
					setIsMuted(false);
					iframe?.contentWindow?.postMessage(JSON.stringify({
						event: "command",
						func: "unMute",
						args: []
					}), "*");
				}
				return;
			}
			if (key === "ArrowDown") {
				e.preventDefault();
				const nextVol = Math.max(0, currentVolume - 5);
				setCurrentVolume(nextVol);
				document.querySelector("#persistent-player iframe")?.contentWindow?.postMessage(JSON.stringify({
					event: "command",
					func: "setVolume",
					args: [nextVol]
				}), "*");
				return;
			}
			if (key === "m" || key === "M") {
				e.preventDefault();
				const iframe = document.querySelector("#persistent-player iframe");
				if (isMuted) {
					setIsMuted(false);
					iframe?.contentWindow?.postMessage(JSON.stringify({
						event: "command",
						func: "unMute",
						args: []
					}), "*");
				} else {
					setIsMuted(true);
					iframe?.contentWindow?.postMessage(JSON.stringify({
						event: "command",
						func: "mute",
						args: []
					}), "*");
				}
				return;
			}
			if (key === "f" || key === "F") {
				e.preventDefault();
				if (document.fullscreenElement) document.exitFullscreen();
				else {
					const playerSlot = document.querySelector("#persistent-player") || playerContainerRef.current;
					if (playerSlot) playerSlot.requestFullscreen();
				}
				return;
			}
			if (key === "t" || key === "T") {
				e.preventDefault();
				toggleTheater();
				return;
			}
			if (key === "i" || key === "I") {
				e.preventDefault();
				onMinimize?.();
				return;
			}
			if (/^[0-9]$/.test(key)) {
				e.preventDefault();
				const num = parseInt(key, 10);
				const dur = videoDuration || data?.duration || 0;
				if (dur > 0) seekTo(num / 10 * dur);
				return;
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		currentTime,
		currentVolume,
		isMuted,
		isCurrentlyPlaying,
		videoDuration,
		data?.duration,
		onOpen,
		onMinimize,
		toggleTheater
	]);
	(0, import_react.useEffect)(() => {
		setMobileCommentsOpen(false);
	}, [id]);
	(0, import_react.useEffect)(() => {
		if (mobileCommentsOpen) document.body.style.overflow = "hidden";
		else document.body.style.overflow = "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [mobileCommentsOpen]);
	(0, import_react.useEffect)(() => {
		if (!mobileCommentsOpen) return;
		const onEsc = (e) => {
			if (e.key === "Escape") setMobileCommentsOpen(false);
		};
		window.addEventListener("keydown", onEsc);
		return () => window.removeEventListener("keydown", onEsc);
	}, [mobileCommentsOpen]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-w-[1720px] mx-auto px-3 sm:px-6 pt-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
			onRetry: () => void refetch(),
			message: t("watchError")
		})
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-w-[1720px] mx-auto px-3 sm:px-6 pt-4 lg:pt-6 flex flex-col lg:flex-row gap-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative aspect-video rounded-none lg:rounded-xl overflow-hidden bg-black group",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "watch-player-slot",
						className: "w-full h-full"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-2/3 bg-yt-surface rounded mt-4 animate-pulse" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-1/3 bg-yt-surface rounded mt-3 animate-pulse" })
			]
		})
	});
	const channelId = channelIdFromUrl(data.uploaderUrl);
	const cleanUploadDate = cleanDateText(data.uploadDate);
	const displayRelativeDate = data.relativeDate || timeAgo(video?.uploaded, data.uploadDate || video?.uploadedDate, lang);
	const totalCommentsCount = data.commentCount || commentsList.length || 0;
	const formattedCommentsCount = totalCommentsCount > 0 ? fmtViews(totalCommentsCount, lang) : isAr ? "٠" : "0";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `max-w-[1720px] mx-auto px-3 sm:px-6 pt-4 lg:pt-6 flex flex-col gap-6 ${theater ? "lg:max-w-none lg:px-4" : "lg:flex-row"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyboardShortcutsModal, {
				open: showShortcutsModal,
				onClose: () => setShowShortcutsModal(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex-1 min-w-0 ${theater ? "lg:px-0" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: playerContainerRef,
						className: `relative aspect-video rounded-none overflow-hidden bg-black shadow-lg ${theater ? "lg:rounded-none" : "lg:rounded-xl"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							id: "watch-player-slot",
							className: "w-full h-full"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display font-bold text-lg sm:text-xl mt-3 leading-snug",
						children: data.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-3 mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 me-auto",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => onChannel(channelId, data.uploader),
									className: "transition-transform hover:scale-105",
									"aria-label": data.uploader,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
										src: data.uploaderAvatar,
										name: data.uploader,
										size: "w-10 h-10 text-base"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => onChannel(channelId, data.uploader),
									className: "leading-tight text-start",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 font-bold text-[15px]",
										children: [data.uploader, data.uploaderVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "w-4 h-4 text-yt-sub" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-yt-sub",
										children: [
											fmtViews(data.uploaderSubscriberCount, lang),
											" ",
											t("subscribers")
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => onToggleSub({
										channelId,
										name: data.uploader,
										avatar: data.uploaderAvatar
									}),
									className: `ms-2 h-9 px-4 rounded-full text-sm font-bold transition-all active:scale-95 ${isSubscribed(channelId) ? "bg-yt-surface text-yt-text" : "bg-yt-text text-yt-bg hover:bg-white/80"}`,
									children: isSubscribed(channelId) ? t("subscribed") : t("subscribe")
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center bg-yt-surface rounded-full overflow-hidden",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => {
												onToggleLike();
												setDisliked(false);
											},
											className: `flex items-center gap-2 h-9 ps-4 pe-3 text-sm font-medium hover:bg-yt-hover transition-colors ${liked ? "text-yt-blue" : ""}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: `w-5 h-5 ${liked ? "fill-current pop" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "tabular-nums",
												children: data.likes > 0 ? fmtViews(data.likes + (liked ? 1 : 0), lang) : liked ? "1" : isAr ? "٠" : "0"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-px h-5 bg-yt-hover" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												setDisliked((d) => !d);
												if (liked) onToggleLike();
											},
											className: `h-9 px-3.5 hover:bg-yt-hover transition-colors ${disliked ? "text-yt-blue" : ""}`,
											"aria-label": t("dislike"),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: `w-5 h-5 ${disliked ? "fill-current pop" : ""}` })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => notify(t("linkCopied")),
									className: "flex items-center gap-2 h-9 px-3.5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-5 h-5" }),
										" ",
										t("share")
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => onAddToPlaylist(video),
									className: "flex items-center gap-2 h-9 px-3.5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListVideo, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: t("save")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: toggleTheater,
									className: `flex items-center gap-2 h-9 px-3.5 rounded-full text-sm font-medium transition-colors ${theater ? "bg-yt-blue text-black font-bold shadow-xs" : "bg-yt-surface hover:bg-yt-hover text-yt-text"}`,
									title: isAr ? "وضع المسرح (t)" : "Theater mode (t)",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: isAr ? "وضع المسرح" : "Theater"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setShowShortcutsModal(true),
									className: "flex items-center gap-2 h-9 px-3.5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium text-yt-text transition-colors",
									title: isAr ? "اختصارات لوحة المفاتيح (?)" : "Keyboard shortcuts (?)",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Keyboard, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: isAr ? "الاختصارات" : "Shortcuts"
									})]
								}),
								onMinimize && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: onMinimize,
									className: "flex items-center gap-2 h-9 px-3.5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium",
									title: isAr ? "تصغير الفيديو (i)" : "Miniplayer (i)",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PictureInPicture2, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: isAr ? "تصغير" : "Miniplayer"
									})]
								})
							]
						})]
					}),
					chapters.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-xl border border-yt-border bg-yt-surface/90 overflow-hidden shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setChaptersCollapsed((c) => !c),
							className: "w-full flex items-center justify-between p-3.5 sm:px-4 text-start font-bold text-sm hover:bg-yt-hover transition-colors cursor-pointer select-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 min-w-0 flex-1 me-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListVideo, { className: "w-4 h-4 text-yt-blue shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0",
										children: isAr ? "فصول الفيديو" : "Chapters"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold px-2 py-0.5 rounded-full bg-yt-raised text-yt-sub tabular-nums shrink-0",
										children: chapters.length
									}),
									activeChapterIndex !== -1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-yt-blue font-medium truncate ms-1 hidden sm:inline",
										children: ["• ", chapters[activeChapterIndex].label]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-1 text-xs text-yt-sub shrink-0",
								children: chaptersCollapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "w-4 h-4" })
							})]
						}), !chaptersCollapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t border-yt-border/50 divide-y divide-yt-border/20 max-h-64 overflow-y-auto p-1.5 space-y-1",
							children: chapters.map((chap, idx) => {
								const isActive = idx === activeChapterIndex;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => seekTo(chap.start),
									className: `w-full flex items-center gap-3 p-2 rounded-lg text-start transition-all cursor-pointer ${isActive ? "bg-yt-blue/20 text-yt-blue font-bold border border-yt-blue/40 shadow-xs" : "hover:bg-yt-hover text-yt-text/90"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-xs font-mono px-2 py-0.5 rounded tabular-nums shrink-0 ${isActive ? "bg-yt-blue text-black font-bold" : "bg-yt-bg text-yt-sub font-semibold"}`,
										children: fmtDuration(chap.start) || "0:00"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs sm:text-sm line-clamp-1 flex-1 min-w-0",
										children: chap.label
									})]
								}, idx);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => setExpanded((e) => !e),
						className: "mt-4 p-3.5 sm:p-4 rounded-xl bg-yt-surface/80 hover:bg-yt-surface transition-colors cursor-pointer text-sm select-text",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 font-bold text-xs sm:text-sm text-yt-text flex-wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									data.views ? fmtViews(data.views, lang) : "0",
									" ",
									t("views")
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: displayRelativeDate || cleanUploadDate }),
								data.category && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-yt-sub font-medium",
									children: ["#", data.category]
								})] })
							]
						}), data.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 text-yt-text leading-relaxed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `whitespace-pre-line ${expanded ? "" : "line-clamp-2 sm:line-clamp-3"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextWithTimestamps, { text: data.description })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: (e) => {
									e.stopPropagation();
									setExpanded((x) => !x);
								},
								className: "mt-1 font-bold text-xs sm:text-sm text-yt-sub hover:text-yt-text block cursor-pointer",
								children: expanded ? isAr ? "إظهار أقل" : "Show less" : isAr ? "...المزيد" : "...more"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs sm:text-sm text-yt-sub italic",
							children: t("noDescription")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:hidden mt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								onClick: () => setMobileCommentsOpen(true),
								className: "p-3 sm:p-4 rounded-xl bg-yt-surface/90 hover:bg-yt-surface border border-yt-border/40 transition-all cursor-pointer active:scale-[0.99] select-none shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "w-4 h-4 text-yt-sub" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-bold text-sm text-yt-text",
												children: t("comments")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-yt-sub font-semibold tabular-nums px-2 py-0.5 rounded-full bg-yt-raised",
												children: formattedCommentsCount
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-xs text-yt-sub font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "hover:text-yt-text",
											children: isAr ? "فتح لوحة التعليقات" : "Open sheet"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-4 h-4" })]
									})]
								}), commentsList.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2.5 mt-2.5 pt-2 border-t border-yt-border/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
										src: commentsList[0].thumbnail,
										name: commentsList[0].author,
										size: "w-6 h-6 text-[10px] shrink-0 mt-0.5"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0 text-xs sm:text-[13px] leading-snug",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-bold text-yt-text me-1.5",
											children: ["@", commentsList[0].author]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-yt-sub line-clamp-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextWithTimestamps, { text: commentsList[0].commentText })
										})]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-yt-sub mt-2 pt-2 border-t border-yt-border/30",
									children: isAr ? "انقر لإضافة تعليق أو قراءة التعليقات..." : "Tap to add or read comments..."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end mt-1.5 px-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShowInlineComments((s) => !s),
									className: "text-xs text-yt-sub hover:text-yt-text font-medium flex items-center gap-1 cursor-pointer",
									children: showInlineComments ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إخفاء التعليقات في الصفحة" : "Hide inline comments" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "أو تصفح جميع التعليقات هنا في الصفحة مباشرةً" : "Or view all comments inline on page" })] })
								})
							}),
							showInlineComments && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 p-3.5 sm:p-4 rounded-xl bg-yt-raised border border-yt-border/40 space-y-4 animate-in fade-in duration-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2.5 items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-8 h-8 rounded-full grid place-items-center text-xs font-bold bg-gradient-to-br from-yt-blue to-teal-400 text-black shrink-0",
										children: isAr ? "أ" : "U"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										placeholder: t("writeComment"),
										className: "flex-1 bg-yt-surface rounded-full px-3.5 py-1.5 text-sm placeholder:text-yt-sub outline-none border border-transparent focus:border-yt-border transition-colors",
										onKeyDown: (e) => {
											if (e.key === "Enter" && e.target.value.trim()) {
												notify(t("commentPostedToast"));
												e.target.value = "";
											}
										}
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4 mt-3",
									children: [
										!commentsList.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-yt-sub py-4 text-center",
											children: t("noComments")
										}),
										commentsList.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentRow, { c }, i)),
										commentsCont && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "pt-2 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: loadMoreComments,
												disabled: loadingComments,
												className: "px-6 py-2 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium transition-all active:scale-95 inline-flex items-center gap-2",
												children: loadingComments ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "جارٍ تحميل التعليقات..." : "Loading comments..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "عرض المزيد من التعليقات" : "Load more comments" })
											})
										})
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "hidden lg:block mt-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display font-bold text-lg",
									children: totalCommentsCount > 0 ? `${formattedCommentsCount} ${isAr ? "تعليق" : "comments"}` : t("comments")
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-10 h-10 rounded-full grid place-items-center text-sm font-bold bg-gradient-to-br from-yt-blue to-teal-400 text-black shrink-0",
									children: isAr ? "أ" : "U"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									placeholder: t("writeComment"),
									className: "flex-1 bg-transparent border-b border-yt-hover focus:border-yt-text outline-none pb-1.5 text-sm placeholder:text-yt-sub transition-colors",
									onKeyDown: (e) => {
										if (e.key === "Enter" && e.target.value.trim()) {
											notify(t("commentPostedToast"));
											e.target.value = "";
										}
									}
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 space-y-6",
								children: [
									!commentsList.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-yt-sub py-4",
										children: t("noComments")
									}),
									commentsList.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentRow, { c }, i)),
									commentsCont && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										ref: loadMoreCommentsRef,
										className: "pt-4 text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: loadMoreComments,
											disabled: loadingComments,
											className: "px-6 py-2 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium transition-all active:scale-95 inline-flex items-center gap-2",
											children: loadingComments ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "جارٍ تحميل التعليقات..." : "Loading comments..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "عرض المزيد من التعليقات" : "Load more comments" })
										})
									})
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `shrink-0 ${theater ? "w-full" : "lg:w-[400px] xl:w-[420px]"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueuePanel, { onOpen }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 mb-4 overflow-x-auto no-scrollbar",
						children: Object.values(labels).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setRelFilter(t),
							className: `h-8 px-3 rounded-lg text-sm font-medium shrink-0 transition-colors ${relFilter === t ? "bg-yt-text text-yt-bg font-bold" : "bg-yt-surface hover:bg-yt-hover"}`,
							children: t
						}, t))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `space-y-3 ${theater ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" : ""}`,
						children: related.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, {
							video: r,
							index: i,
							layout: theater ? "grid" : "list",
							onOpen,
							onChannel,
							notify
						}, r.url))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: loadMoreRelatedRef,
						className: "h-24 flex items-center justify-center text-yt-sub mt-4",
						children: loadingMoreRelated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-5 h-5 animate-spin text-yt-text" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "جارٍ تحميل مقترحات أخرى..." : "Loading more suggested..." })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => void loadMoreRelated(),
							className: "h-9 px-5 rounded-full bg-yt-surface hover:bg-yt-hover text-xs font-medium transition-colors",
							children: isAr ? "المزيد من الفيديوهات المقترحة" : "More suggested videos"
						})
					})
				]
			}),
			mobileCommentsOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 lg:hidden flex flex-col justify-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200",
					onClick: () => setMobileCommentsOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 w-full max-h-[84vh] h-[84vh] bg-yt-raised border-t border-yt-border/60 rounded-t-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-200",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-1 rounded-full bg-yt-sub/40 mx-auto mt-2.5 mb-1 shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-4 py-2.5 border-b border-yt-border/40 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-base text-yt-text",
									children: t("comments")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-yt-sub tabular-nums",
									children: formattedCommentsCount
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMobileCommentsOpen(false),
								className: "w-8 h-8 rounded-full hover:bg-yt-hover grid place-items-center text-yt-text transition-colors active:scale-95",
								"aria-label": t("close"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-4 py-3 border-b border-yt-border/30 shrink-0 flex gap-3 items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-8 h-8 rounded-full grid place-items-center text-xs font-bold bg-gradient-to-br from-yt-blue to-teal-400 text-black shrink-0",
								children: isAr ? "أ" : "U"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								placeholder: t("writeComment"),
								className: "flex-1 bg-yt-surface rounded-full px-3.5 py-1.5 text-sm placeholder:text-yt-sub outline-none border border-transparent focus:border-yt-border transition-colors",
								onKeyDown: (e) => {
									if (e.key === "Enter" && e.target.value.trim()) {
										notify(t("commentPostedToast"));
										e.target.value = "";
									}
								}
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-5",
							children: [
								!commentsList.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-yt-sub py-10 text-center",
									children: t("noComments")
								}),
								commentsList.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentRow, { c }, i)),
								commentsCont && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-2 pb-6 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: loadMoreComments,
										disabled: loadingComments,
										className: "px-6 py-2 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium transition-all active:scale-95 inline-flex items-center gap-2",
										children: loadingComments ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-4 h-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "جارٍ التحميل..." : "Loading..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "عرض المزيد من التعليقات" : "Load more comments" })
									})
								})
							]
						})
					]
				})]
			})
		]
	});
}
function CommentRow({ c }) {
	const { t } = useLanguage();
	const [liked, setLiked] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
			src: c.thumbnail,
			name: c.author,
			size: "w-10 h-10 text-sm"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-[13px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-bold",
						children: ["@", c.author]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-yt-sub",
						children: c.commentedTime
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm mt-1 leading-relaxed whitespace-pre-line",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextWithTimestamps, { text: c.commentText })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 mt-2 text-yt-sub",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setLiked((l) => !l),
							className: "flex items-center gap-1.5 text-xs hover:text-yt-text",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: `w-4 h-4 ${liked ? "fill-current text-yt-blue pop" : ""}` }), c.likeCount + (liked ? 1 : 0)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "hover:text-yt-text",
							"aria-label": t("dislike"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "w-4 h-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "flex items-center gap-1.5 text-xs font-medium hover:text-yt-text",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerDownLeft, { className: "w-4 h-4" }),
								" ",
								t("reply")
							]
						})
					]
				})
			]
		})]
	});
}
function Miniplayer({ video, onExpand, onClose }) {
	const { t, isAr } = useLanguage();
	const [hovered, setHovered] = (0, import_react.useState)(false);
	const containerRef = (0, import_react.useRef)(null);
	const [position, setPosition] = (0, import_react.useState)(null);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const dragRef = (0, import_react.useRef)({
		startX: 0,
		startY: 0,
		initialX: 0,
		initialY: 0,
		lastX: 0,
		lastY: 0,
		dragging: false,
		hasMoved: false
	});
	const notifySlotMove = (0, import_react.useCallback)(() => {
		window.dispatchEvent(new Event("yt:player-slot-move"));
	}, []);
	const handlePointerDown = (e) => {
		if (e.target.closest("button")) return;
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
			hasMoved: false
		};
		e.currentTarget.setPointerCapture(e.pointerId);
	};
	const handlePointerMove = (e) => {
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
	const handlePointerUp = (e) => {
		if (!dragRef.current.dragging) return;
		const wasMoved = dragRef.current.hasMoved;
		const { lastX, lastY } = dragRef.current;
		dragRef.current.dragging = false;
		dragRef.current.hasMoved = false;
		setIsDragging(false);
		try {
			e.currentTarget.releasePointerCapture(e.pointerId);
		} catch {}
		if (wasMoved) setPosition({
			x: lastX,
			y: lastY
		});
		notifySlotMove();
		if (!wasMoved) onExpand();
	};
	(0, import_react.useEffect)(() => {
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
					y: Math.min(position.y, maxY)
				});
				notifySlotMove();
			}
		};
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, [position, notifySlotMove]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "yt-miniplayer",
		ref: containerRef,
		onPointerDown: handlePointerDown,
		onPointerMove: handlePointerMove,
		onPointerUp: handlePointerUp,
		onPointerCancel: handlePointerUp,
		onMouseEnter: () => setHovered(true),
		onMouseLeave: () => setHovered(false),
		style: position ? {
			position: "fixed",
			left: `${position.x}px`,
			top: `${position.y}px`,
			bottom: "auto",
			right: "auto"
		} : void 0,
		className: `fixed ${!position ? "bottom-16 sm:bottom-6 end-2 sm:end-6" : ""} z-[45] w-[320px] sm:w-[380px] max-w-[calc(100vw-16px)] rounded-xl overflow-hidden bg-yt-raised border border-yt-border shadow-2xl shadow-black/90 flex flex-col select-none touch-none cursor-grab active:cursor-grabbing transition-shadow ${isDragging ? "shadow-cyan-500/20 scale-[1.02]" : "animate-in slide-in-from-bottom-5 fade-in-50"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-1.5 inset-x-0 z-20 flex justify-center pointer-events-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-10 h-1 rounded-full bg-white/50 backdrop-blur-xs shadow-sm" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-video bg-black rounded-t-xl overflow-hidden group",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					id: "miniplayer-player-slot",
					className: "w-full h-full rounded-t-xl overflow-hidden"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `absolute top-2 end-2 flex items-center gap-1.5 z-20 transition-opacity duration-150 ${hovered || isDragging ? "opacity-100" : "opacity-0 pointer-events-none"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: (e) => {
							e.stopPropagation();
							onExpand();
						},
						className: "w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white grid place-items-center shadow-md transition-transform hover:scale-105 active:scale-95",
						title: t("expand"),
						"aria-label": t("expand"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "w-4 h-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: (e) => {
							e.stopPropagation();
							onClose();
						},
						className: "w-8 h-8 rounded-full bg-black/80 hover:bg-black text-white grid place-items-center shadow-md transition-transform hover:scale-105 active:scale-95",
						title: t("closeMiniplayer"),
						"aria-label": t("closeMiniplayer"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 px-3.5 py-2.5 bg-yt-raised hover:bg-yt-surface/80 transition-colors",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-[13px] font-medium leading-snug line-clamp-1 text-yt-text hover:text-white",
						children: video.title || t("miniplayer")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-yt-sub truncate mt-0.5",
						children: video.uploaderName || (isAr ? "يوتيوب" : "YouTube")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: (e) => {
							e.stopPropagation();
							onExpand();
						},
						className: "w-8 h-8 rounded-full hover:bg-yt-surface text-yt-sub hover:text-white grid place-items-center transition-colors",
						title: t("expand"),
						"aria-label": t("expand"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: (e) => {
							e.stopPropagation();
							onClose();
						},
						className: "w-8 h-8 rounded-full hover:bg-yt-surface text-yt-sub hover:text-white grid place-items-center transition-colors",
						title: t("closeMiniplayer"),
						"aria-label": t("closeMiniplayer"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
					})]
				})]
			})
		]
	});
}
/**
* Clean, Genuine YouTube Player
* Directly uses YouTube's official player engine and UI controls
* Ensures 100% authenticity, zero duplicate layers, and zero sync bugs.
*/
function YouTubePlayer({ videoId, autoplay = false, muted = false, loop = false, controls = true, className = "w-full h-full", title = "مشغّل الفيديو", startTime, onTimeUpdate, onEnded }) {
	const iframeRef = (0, import_react.useRef)(null);
	const { backgroundPlay, preferredQuality } = useAppStore();
	const { lang, t } = useLanguage();
	const initialStartTime = (0, import_react.useRef)({
		id: videoId,
		time: startTime
	});
	if (initialStartTime.current.id !== videoId) initialStartTime.current = {
		id: videoId,
		time: startTime
	};
	(0, import_react.useEffect)(() => {
		const handleMsg = (e) => {
			try {
				const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
				if (!data) return;
				if (data.event === "infoDelivery" && data.info) {
					const info = data.info;
					if (typeof info.currentTime === "number") onTimeUpdate?.(info.currentTime);
					if (info.playerState === 0) onEnded?.();
					window.dispatchEvent(new CustomEvent("yt:player-info", { detail: info }));
				} else if (data.event === "onStateChange") {
					if (data.info === 0 || data.data === 0 || data.playerState === 0) onEnded?.();
				}
			} catch {}
		};
		window.addEventListener("message", handleMsg);
		return () => window.removeEventListener("message", handleMsg);
	}, [onTimeUpdate, onEnded]);
	const handleIframeLoad = () => {
		if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage(JSON.stringify({
			event: "listening",
			id: 1,
			channel: "widget"
		}), "*");
	};
	(0, import_react.useEffect)(() => {
		const handleVisibility = () => {
			if (!backgroundPlay) return;
			if (document.visibilityState === "hidden" && iframeRef.current?.contentWindow) {
				const play = () => {
					if (!iframeRef.current?.contentWindow) return;
					iframeRef.current.contentWindow.postMessage(JSON.stringify({
						event: "command",
						func: "playVideo",
						args: []
					}), "*");
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
	(0, import_react.useEffect)(() => {
		if (!("mediaSession" in navigator)) return;
		navigator.mediaSession.metadata = new MediaMetadata({
			title: title || "فيديو",
			artist: t ? t("brandName") : "Youtubiy",
			artwork: [{
				src: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
				sizes: "480x360",
				type: "image/jpeg"
			}, {
				src: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
				sizes: "1280x720",
				type: "image/jpeg"
			}]
		});
		navigator.mediaSession.setActionHandler("play", () => {
			iframeRef.current?.contentWindow?.postMessage(JSON.stringify({
				event: "command",
				func: "playVideo",
				args: []
			}), "*");
		});
		navigator.mediaSession.setActionHandler("pause", () => {
			iframeRef.current?.contentWindow?.postMessage(JSON.stringify({
				event: "command",
				func: "pauseVideo",
				args: []
			}), "*");
		});
		navigator.mediaSession.setActionHandler("seekto", (details) => {
			if (details.seekTime != null) iframeRef.current?.contentWindow?.postMessage(JSON.stringify({
				event: "command",
				func: "seekTo",
				args: [details.seekTime, true]
			}), "*");
		});
		return () => {
			navigator.mediaSession.metadata = null;
			navigator.mediaSession.setActionHandler("play", null);
			navigator.mediaSession.setActionHandler("pause", null);
			navigator.mediaSession.setActionHandler("seekto", null);
		};
	}, [
		videoId,
		title,
		t
	]);
	const params = (0, import_react.useMemo)(() => {
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
			widgetid: "1"
		});
		if (preferredQuality && preferredQuality !== "auto") p.set("vq", preferredQuality);
		if (initialStartTime.current.time && initialStartTime.current.time > 0) p.set("start", String(Math.floor(initialStartTime.current.time)));
		if (loop) {
			p.set("loop", "1");
			p.set("playlist", videoId);
		}
		return p;
	}, [
		videoId,
		autoplay,
		muted,
		controls,
		lang,
		loop,
		preferredQuality
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `relative bg-black overflow-hidden select-none ${className}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
			ref: iframeRef,
			className: "w-full h-full border-0 pointer-events-auto",
			src: `https://www.youtube.com/embed/${videoId}?${params.toString()}`,
			title,
			loading: "lazy",
			onLoad: handleIframeLoad,
			referrerPolicy: "strict-origin-when-cross-origin",
			allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen",
			allowFullScreen: true
		}, `${videoId}-${autoplay}-${muted}`)
	});
}
function ShortsViewer({ items, startIndex, onClose, notify }) {
	const { t } = useLanguage();
	const [active, setActive] = (0, import_react.useState)(startIndex);
	const [likes, setLikes] = (0, import_react.useState)({});
	const [muted, setMuted] = (0, import_react.useState)(true);
	const containerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const el = containerRef.current;
		if (el) el.scrollTop = startIndex * el.clientHeight;
	}, [startIndex]);
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
			const el = containerRef.current;
			if (!el) return;
			if (e.key === "ArrowDown") el.scrollBy({
				top: el.clientHeight,
				behavior: "smooth"
			});
			if (e.key === "ArrowUp") el.scrollBy({
				top: -el.clientHeight,
				behavior: "smooth"
			});
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	const onScroll = () => {
		const el = containerRef.current;
		if (!el) return;
		setActive(Math.round(el.scrollTop / el.clientHeight));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[80] bg-black flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "h-14 shrink-0 flex items-center justify-between px-3 text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortsIcon, { className: "w-7 h-7 text-yt-red" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display font-extrabold text-lg",
						children: t("shorts")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setMuted((m) => !m),
						className: "w-10 h-10 rounded-full hover:bg-white/10 grid place-items-center",
						"aria-label": t("sound"),
						children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "w-5 h-5 opacity-60" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "w-5 h-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "w-10 h-10 rounded-full hover:bg-white/10 grid place-items-center",
						"aria-label": t("close"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-6 h-6" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: containerRef,
				onScroll,
				className: "flex-1 overflow-y-auto snap-y snap-mandatory no-scrollbar",
				children: items.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortItem, {
					video: s,
					active: active === i,
					muted,
					liked: !!likes[videoIdFromUrl(s.url)],
					onLike: () => {
						const id = videoIdFromUrl(s.url);
						setLikes((p) => ({
							...p,
							[id]: !p[id]
						}));
					},
					notify
				}, s.url))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden sm:flex absolute end-3 top-1/2 -translate-y-1/2 flex-col gap-1.5",
				children: items.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `w-1.5 rounded-full transition-all duration-300 ${active === i ? "h-5 bg-white" : "h-1.5 bg-white/30"}` }, i))
			})
		]
	});
}
function ShortItem({ video, active, muted, liked, onLike, notify }) {
	const { t, lang } = useLanguage();
	const id = videoIdFromUrl(video.url);
	const [failed, setFailed] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!active) return;
		let alive = true;
		const row = {
			video_id: id,
			watched_at: (/* @__PURE__ */ new Date()).toISOString()
		};
		addHistory(row);
		window.dispatchEvent(new CustomEvent("yt:history", { detail: row }));
		getStreams(id).then((d) => {
			if (!alive) return;
			setMeta$1(id, {
				title: d.title,
				thumbnail: video.thumbnail,
				uploaderName: d.uploader,
				uploaderAvatar: d.uploaderAvatar,
				duration: video.duration
			});
		}).catch(() => alive && setFailed(true));
		return () => {
			alive = false;
		};
	}, [
		active,
		id,
		video
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-full snap-start flex items-center justify-center py-1",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-full max-h-[calc(100vh-8rem)] aspect-[9/16] max-w-full rounded-xl overflow-hidden bg-yt-raised",
			children: [
				active && !failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YouTubePlayer, {
					videoId: id,
					autoplay: true,
					muted,
					loop: true,
					className: "w-full h-full",
					title: video.title
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: video.thumbnail,
					alt: video.title,
					className: "w-full h-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute bottom-3 start-3 end-16 text-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								src: video.uploaderAvatar,
								name: video.uploaderName,
								size: "w-8 h-8 text-xs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold truncate",
								children: video.uploaderName
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium leading-snug line-clamp-2",
							children: video.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mt-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music2, { className: "w-3.5 h-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "truncate opacity-90",
								children: [
									fmtViews(video.views, lang),
									" ",
									t("views"),
									" · ",
									t("originalAudio")
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute end-2 bottom-3 flex flex-col items-center gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RailBtn, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: `w-6 h-6 ${liked ? "fill-current" : ""}` }),
							count: fmtViews(liked ? 12e3 : 11e3, lang),
							active: liked,
							onClick: onLike,
							label: t("like")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RailBtn, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "w-6 h-6" }),
							onClick: () => notify(t("thanksForFeedbackToast")),
							label: t("dislike")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RailBtn, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "w-6 h-6" }),
							count: "340",
							onClick: () => notify(t("commentsSoonToast")),
							label: t("comments")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RailBtn, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-6 h-6" }),
							count: t("share"),
							onClick: () => notify(t("linkCopied")),
							label: t("share")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RailBtn, {
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "w-6 h-6" }),
							onClick: () => {},
							label: t("more")
						})
					]
				})
			]
		})
	});
}
function RailBtn({ icon, count, onClick, active, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: "flex flex-col items-center gap-1 group",
		"aria-label": label,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `w-12 h-12 rounded-full grid place-items-center transition-all group-active:scale-90 ${active ? "bg-white/20 text-yt-blue" : "bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white"}`,
			children: icon
		}), count && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-[11px] font-medium text-white drop-shadow",
			children: count
		})]
	});
}
function ChannelPage({ channelId, onOpen, notify, isSubscribed, onToggleSub, onDismiss, onOpenShort, onAddToPlaylist }) {
	const { t, lang } = useLanguage();
	const TABS = (0, import_react.useMemo)(() => [
		{
			id: "home",
			label: t("home")
		},
		{
			id: "videos",
			label: t("videos")
		},
		{
			id: "shorts",
			label: t("shorts")
		},
		{
			id: "playlists",
			label: t("playlists")
		},
		{
			id: "about",
			label: t("about")
		}
	], [t]);
	const [tabId, setTabId] = (0, import_react.useState)("home");
	(0, import_react.useEffect)(() => {
		if (!TABS.find((t) => t.id === tabId)) setTabId("home");
	}, [TABS, tabId]);
	const [allVideos, setAllVideos] = (0, import_react.useState)([]);
	const [nextVideos, setNextVideos] = (0, import_react.useState)(null);
	const [allShorts, setAllShorts] = (0, import_react.useState)([]);
	const [nextShorts, setNextShorts] = (0, import_react.useState)(null);
	const [loadingMore, setLoadingMore] = (0, import_react.useState)(false);
	const loadMoreRef = (0, import_react.useRef)(null);
	const { data, isPending: loading, isError: error, refetch } = useQuery({
		queryKey: ["channel", channelId],
		queryFn: () => getChannel(channelId),
		placeholderData: keepPreviousData,
		enabled: !!channelId
	});
	(0, import_react.useEffect)(() => {
		if (data) {
			setAllVideos(data.relatedStreams || []);
			setNextVideos(data.nextVideos || null);
			setAllShorts(data.shorts || []);
			setNextShorts(data.nextShorts || null);
		} else {
			setAllVideos([]);
			setNextVideos(null);
			setAllShorts([]);
			setNextShorts(null);
		}
	}, [data]);
	const loadMore = (0, import_react.useCallback)(async () => {
		const token = tabId === "shorts" ? nextShorts : nextVideos;
		if (loadingMore || !token) return;
		setLoadingMore(true);
		try {
			const r = await browsePaged(token);
			if (tabId === "shorts") {
				setAllShorts((prev) => {
					const have = new Set(prev.map((v) => v.url));
					return [...prev, ...r.items.filter((v) => !have.has(v.url))];
				});
				setNextShorts(r.next);
			} else {
				setAllVideos((prev) => {
					const have = new Set(prev.map((v) => v.url));
					return [...prev, ...r.items.filter((v) => !have.has(v.url))];
				});
				setNextVideos(r.next);
			}
		} catch (e) {
			console.error("Failed to load more channel content", e);
		} finally {
			setLoadingMore(false);
		}
	}, [
		tabId,
		nextVideos,
		nextShorts,
		loadingMore
	]);
	(0, import_react.useEffect)(() => {
		const el = loadMoreRef.current;
		if (!el || !(tabId === "shorts" ? !!nextShorts : !!nextVideos) || !(tabId === "videos" || tabId === "shorts" || tabId === "home")) return;
		const io = new IntersectionObserver((entries) => {
			if (entries.some((e) => e.isIntersecting)) loadMore();
		}, { rootMargin: "800px 0px" });
		io.observe(el);
		return () => io.disconnect();
	}, [
		tabId,
		nextVideos,
		nextShorts,
		loadMore
	]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		onRetry: () => void refetch(),
		message: t("channelLoadError")
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-[1280px] mx-auto px-3 sm:px-6 pt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 rounded-2xl bg-yt-surface animate-pulse mb-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonGrid, { count: 4 })]
	});
	const videos = allVideos.filter((v) => v.url?.includes("/watch"));
	const shorts = allShorts.length > 0 ? allShorts : videos.filter((v) => v.duration > 0 && v.duration <= 60);
	const featured = videos[0];
	const cardProps = (v, i) => ({
		video: v,
		onOpen,
		index: i,
		notify,
		onDismiss,
		onChannel: () => {},
		onSaveLater: () => notify(t("savedToWatchLaterToast")),
		onAddToPlaylist
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-[1280px] mx-auto pb-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-24 sm:h-40 lg:h-52 mx-3 sm:mx-6 mt-3 rounded-2xl relative overflow-hidden bg-gradient-to-l from-yt-red/40 via-yt-raised to-yt-surface",
				children: data.bannerUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: data.bannerUrl,
					alt: "",
					referrerPolicy: "no-referrer",
					className: "w-full h-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 opacity-30 [background:radial-gradient(circle_at_20%_30%,white,transparent_40%),radial-gradient(circle_at_80%_70%,white,transparent_35%)]" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 sm:px-8 mt-4 flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					src: data.avatarUrl,
					name: data.name,
					size: "w-20 h-20 sm:w-32 sm:h-32 text-4xl sm:text-6xl"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 text-center sm:text-start",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display font-black text-2xl sm:text-3xl flex items-center gap-2 justify-center sm:justify-start",
							children: [data.name, data.verified && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "w-5 h-5 text-yt-sub" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-yt-sub mt-1 flex flex-wrap items-center gap-x-2 justify-center sm:justify-start",
							children: [
								data.subscriberText ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: data.subscriberText }) : data.subscriberCount != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									fmtViews(data.subscriberCount, lang),
									" ",
									t("subscribers")
								] }) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
								data.videoCountText ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: data.videoCountText }) : data.videoCount != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									fmtViews(data.videoCount, lang),
									" ",
									t("videosWord")
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									videos.length,
									"+ ",
									t("videosWord")
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-yt-sub mt-2 max-w-xl line-clamp-1 mx-auto sm:mx-0",
							children: data.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mt-4 justify-center sm:justify-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => onToggleSub({
									channelId,
									name: data.name,
									avatar: data.avatarUrl
								}),
								className: `h-9 px-4 rounded-full text-sm font-bold transition-all active:scale-95 flex items-center gap-2 ${isSubscribed ? "bg-yt-surface text-yt-text" : "bg-yt-text text-yt-bg hover:bg-white/80"}`,
								children: [isSubscribed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "w-4 h-4" }), isSubscribed ? t("subscribed") : t("subscribe")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => notify(t("channelLinkCopied")),
								className: "h-9 px-4 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-4 h-4" }),
									" ",
									t("share")
								]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 border-b border-yt-border px-2 sm:px-6 sticky top-14 bg-yt-bg z-30",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1 overflow-x-auto no-scrollbar",
					children: [TABS.map((tItem) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setTabId(tItem.id),
						className: `shrink-0 px-4 py-3 text-sm font-bold border-b-2 -mb-px transition-colors ${tabId === tItem.id ? "border-yt-text text-yt-text" : "border-transparent text-yt-sub hover:text-yt-text"}`,
						children: tItem.label
					}, tItem.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "shrink-0 px-3 py-3 text-yt-sub",
						"aria-label": t("searchInChannel"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "w-5 h-5" })
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-3 sm:px-6 mt-6",
				children: [
					tabId === "home" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-8",
						children: [
							featured && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rise flex flex-col md:flex-row gap-4 md:gap-6 pb-6 border-b border-yt-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => onOpen(featured),
									className: "md:w-[45%] shrink-0 group text-start",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative aspect-video rounded-xl overflow-hidden bg-yt-raised",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: featured.thumbnail,
											alt: featured.title,
											referrerPolicy: "no-referrer",
											className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
										})
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "md:pt-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-yt-sub",
											children: t("featuredVideo")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-display font-bold text-lg sm:text-xl mt-1 leading-snug",
											children: featured.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-yt-sub mt-2",
											children: fmtViews(featured.views, lang) && `${fmtViews(featured.views, lang)} ${t("views")}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-yt-text/80 mt-3 leading-relaxed line-clamp-3",
											children: data.description
										})
									]
								})]
							}),
							shorts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 border-t border-yt-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortsIcon, { className: "w-5 h-5 text-yt-red" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display font-bold text-lg",
										children: t("shorts")
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3",
									children: shorts.slice(0, 6).map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => onOpenShort(shorts, i),
										className: "group text-start rise",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative aspect-[9/16] rounded-xl overflow-hidden bg-yt-raised",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: s.thumbnail,
												alt: s.title,
												referrerPolicy: "no-referrer",
												className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "absolute top-2 end-2 flex items-center gap-1 text-[11px] font-bold bg-black/60 rounded px-1.5 py-0.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortsIcon, { className: "w-3 h-3" }),
													" ",
													fmtViews(s.views, lang)
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[13px] mt-2 line-clamp-2 leading-snug",
											children: s.title
										})]
									}, s.url))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8",
								children: videos.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, { ...cardProps(v, i) }, videoIdFromUrl(v.url)))
							})
						]
					}),
					tabId === "videos" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8",
						children: videos.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, { ...cardProps(v, i) }, videoIdFromUrl(v.url)))
					}),
					tabId === "shorts" && (shorts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4",
						children: shorts.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => onOpenShort(shorts, i),
							className: "group text-start rise",
							style: { animationDelay: `${i * 40}ms` },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-[9/16] rounded-xl overflow-hidden bg-yt-raised",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: s.thumbnail,
									alt: s.title,
									referrerPolicy: "no-referrer",
									className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "absolute top-2 end-2 flex items-center gap-1 text-[11px] font-bold bg-black/50 rounded px-1.5 py-0.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortsIcon, { className: "w-3 h-3" }),
										" ",
										fmtViews(s.views, lang)
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] mt-2 line-clamp-2 leading-snug",
								children: s.title
							})]
						}, s.url))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-20 text-center text-yt-sub text-sm",
						children: t("noShortsInChannel")
					})),
					tabId === "playlists" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-20 text-center text-yt-sub text-sm",
						children: t("playlistsNotAvailable")
					}),
					tabId === "about" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-2xl rise",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display font-bold text-lg mb-3",
								children: t("description")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed text-yt-text/90 whitespace-pre-line",
								children: data.description || t("noDescription")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-yt-border my-6" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display font-bold text-lg mb-3",
								children: t("details")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "space-y-2.5 text-sm text-yt-sub",
								children: [
									data.subscriberText ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["👥 ", data.subscriberText] }) : data.subscriberCount != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"👥 ",
										fmtViews(data.subscriberCount, lang),
										" ",
										t("subscribers")
									] }) : null,
									data.videoCountText ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["🎬 ", data.videoCountText] }) : data.videoCount != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"🎬 ",
										fmtViews(data.videoCount, lang),
										" ",
										t("videosWord")
									] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"🎬 ",
										videos.length,
										"+ ",
										t("videosPublished")
									] }),
									shorts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"⚡ ",
										shorts.length,
										" ",
										t("shorts")
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["🆔 ", channelId] })
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: loadMoreRef,
						className: "h-24 flex items-center justify-center text-yt-sub",
						children: loadingMore ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-7 h-7 animate-spin" }) : (tabId === "shorts" ? !!nextShorts : !!nextVideos) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => void loadMore(),
							className: "h-9 px-5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium transition-colors",
							children: t("loadMore")
						}) : null
					})
				]
			})
		]
	});
}
var HOME_TOPICS = [
	{
		id: "all",
		en: "All",
		ar: "الكل",
		query: ""
	},
	{
		id: "trending",
		en: "Trending",
		ar: "الرائج",
		query: "trending"
	},
	{
		id: "live",
		en: "Live",
		ar: "بث مباشر",
		query: "live stream"
	},
	{
		id: "gaming",
		en: "Gaming",
		ar: "ألعاب",
		query: "gaming"
	},
	{
		id: "minecraft",
		en: "Minecraft",
		ar: "ماينكرافت",
		query: "minecraft gameplay"
	},
	{
		id: "tech",
		en: "Technology",
		ar: "تقنية",
		query: "technology review"
	},
	{
		id: "cooking",
		en: "Cooking",
		ar: "طهي",
		query: "cooking recipe"
	},
	{
		id: "travel",
		en: "Travel",
		ar: "سفر",
		query: "travel vlog"
	},
	{
		id: "music",
		en: "Music",
		ar: "موسيقى",
		query: "music video"
	},
	{
		id: "cars",
		en: "Cars",
		ar: "سيارات",
		query: "cars review"
	}
];
/** Arabic & English UI chips → real search topics. */
var TOPIC_QUERY = {
	All: "",
	Trending: "trending",
	Live: "live stream",
	Gaming: "gaming",
	Minecraft: "minecraft gameplay",
	Technology: "technology review",
	Cooking: "cooking recipe",
	Travel: "travel vlog",
	Music: "music video",
	Cars: "cars review",
	الكل: "",
	الرائج: "trending",
	"بث مباشر": "live stream",
	مباشر: "live stream",
	ألعاب: "gaming",
	ماينكرافت: "minecraft gameplay",
	تقنية: "technology review",
	طهي: "cooking recipe",
	سفر: "travel vlog",
	موسيقى: "music video",
	سيارات: "cars review"
};
HOME_TOPICS.map((t) => t.en);
function normalizeKey(page) {
	switch (page) {
		case "History":
		case "السجل": return "history";
		case "Watch Later":
		case "المشاهدة لاحقاً": return "watchLater";
		case "Liked Videos":
		case "مقاطع أعجبتني": return "liked";
		case "Playlists":
		case "قوائم التشغيل": return "playlists";
		case "Your Videos":
		case "مقاطع الفيديو": return "videos";
		case "Trending":
		case "الرائج": return "trending";
		case "Music":
		case "الموسيقى": return "music";
		case "Gaming":
		case "الألعاب": return "gaming";
		case "News":
		case "الأخبار": return "news";
		case "Sports":
		case "الرياضة": return "sports";
		default: return page;
	}
}
function idsToVideos$1(ids) {
	return ids.map((id) => {
		const m = getMeta(id);
		if (!m) return null;
		return {
			url: `/watch?v=${id}`,
			title: m.title,
			thumbnail: m.thumbnail,
			uploaderName: m.uploaderName,
			uploaderAvatar: m.uploaderAvatar,
			duration: m.duration ?? 0
		};
	}).filter(Boolean);
}
function LibraryPage(props) {
	const { page } = props;
	const { t } = useLanguage();
	const normalized = normalizeKey(page);
	const [customPlaylists, setCustomPlaylists] = (0, import_react.useState)([]);
	const [showCreate, setShowCreate] = (0, import_react.useState)(false);
	const [newTitle, setNewTitle] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (normalized === "playlists") getCustomPlaylists().then(setCustomPlaylists);
	}, [normalized]);
	const handleCreate = async () => {
		if (!newTitle.trim()) return;
		const pl = await createCustomPlaylist(newTitle.trim());
		setCustomPlaylists((prev) => [pl, ...prev]);
		setNewTitle("");
		setShowCreate(false);
		props.notify(t("playlistCreatedToast"));
	};
	const meta = {
		history: {
			icon: History,
			title: t("history"),
			empty: t("historyEmptyMessage")
		},
		watchLater: {
			icon: Clock,
			title: t("watchLater"),
			empty: t("watchLaterEmptyMessage"),
			playlist: true
		},
		liked: {
			icon: ThumbsUp,
			title: t("likedVideos"),
			empty: t("likedVideosEmptyMessage"),
			playlist: true
		},
		playlists: {
			icon: ListVideo,
			title: t("playlists"),
			empty: ""
		},
		videos: {
			icon: CirclePlay,
			title: t("yourVideos"),
			empty: t("yourVideosEmptyMessage")
		},
		trending: {
			icon: Flame,
			title: t("trending"),
			empty: t("trendingEmptyMessage")
		},
		music: {
			icon: Music2,
			title: t("music"),
			empty: t("noResultsGeneric")
		},
		gaming: {
			icon: Gamepad2,
			title: t("gaming"),
			empty: t("noResultsGeneric")
		},
		news: {
			icon: Newspaper,
			title: t("news"),
			empty: t("noResultsGeneric")
		},
		sports: {
			icon: Trophy,
			title: t("sports"),
			empty: t("noResultsGeneric")
		}
	}[normalized] || {
		icon: ListVideo,
		title: page,
		empty: t("noContent")
	};
	let remoteKey = null;
	if (normalized === "trending") remoteKey = "__trending";
	else if (normalized === "music") remoteKey = TOPIC_QUERY["موسيقى"] || "music songs";
	else if (normalized === "gaming") remoteKey = TOPIC_QUERY["ألعاب"] || "gaming";
	else if (normalized === "news") remoteKey = "news today";
	else if (normalized === "sports") remoteKey = "sports highlights";
	const [remote, setRemote] = (0, import_react.useState)(null);
	const [remoteErr, setRemoteErr] = (0, import_react.useState)(false);
	const [attempt, setAttempt] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (!remoteKey) return;
		let alive = true;
		setRemote(null);
		setRemoteErr(false);
		(remoteKey === "__trending" ? getTrending() : searchVideos(remoteKey)).then((r) => alive && setRemote(r)).catch(() => alive && setRemoteErr(true));
		return () => {
			alive = false;
		};
	}, [remoteKey, attempt]);
	const cardProps = (v, i) => ({
		video: v,
		onOpen: props.onOpen,
		index: i,
		notify: props.notify,
		onDismiss: props.onDismiss,
		onChannel: props.onChannel,
		saved: props.isSaved(v.url.split("v=")[1]),
		onSaveLater: () => props.onSaveLater(v.url.split("v=")[1], v)
	});
	if (normalized === "playlists") {
		const allLists = [...[{
			key: "watchLater",
			name: t("watchLater"),
			count: props.watchLater.length,
			thumb: idsToVideos$1(props.watchLater)[0]?.thumbnail,
			type: "system"
		}, {
			key: "liked",
			name: t("likedVideos"),
			count: props.liked.length,
			thumb: idsToVideos$1(props.liked)[0]?.thumbnail,
			type: "system"
		}], ...customPlaylists.map((p) => ({
			key: p.id,
			name: p.title,
			count: p.videoIds.length,
			thumb: p.thumbnail,
			type: "custom"
		}))];
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-[1400px] mx-auto px-3 sm:px-6 pt-4 lg:pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "font-display font-black text-2xl flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListVideo, { className: "w-7 h-7" }),
							" ",
							t("playlists")
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setShowCreate(true),
						className: "flex items-center gap-2 h-9 px-4 rounded-full bg-yt-blue text-black font-bold text-sm active:scale-95 transition-transform",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }), t("newPlaylist")]
					})]
				}),
				showCreate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8 p-4 rounded-xl bg-yt-surface border border-yt-border animate-in slide-in-from-top-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold mb-3",
						children: t("createNewPlaylist")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								autoFocus: true,
								type: "text",
								value: newTitle,
								onChange: (e) => setNewTitle(e.target.value),
								placeholder: t("playlistTitlePlaceholder"),
								className: "flex-1 bg-yt-bg border border-yt-border rounded-lg px-3 py-2 outline-none focus:border-yt-blue transition-colors",
								onKeyDown: (e) => e.key === "Enter" && handleCreate()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleCreate,
								disabled: !newTitle.trim(),
								className: "bg-white text-black px-4 py-2 rounded-lg font-bold disabled:opacity-50",
								children: t("create")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setShowCreate(false),
								className: "bg-yt-raised px-4 py-2 rounded-lg font-bold",
								children: t("cancel")
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8",
					children: allLists.map((pl, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "group text-start rise",
						style: { animationDelay: `${i * 60}ms` },
						onClick: () => {
							if (pl.type === "system") window.dispatchEvent(new CustomEvent("yt:nav", { detail: pl.name }));
							else window.dispatchEvent(new CustomEvent("yt:nav", { detail: `playlist:${pl.key}` }));
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-video rounded-xl overflow-hidden bg-yt-raised shadow-lg group-hover:shadow-yt-blue/10 transition-shadow",
								children: [pl.thumb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: pl.thumb,
									alt: pl.name,
									referrerPolicy: "no-referrer",
									className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full h-full bg-yt-surface flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListVideo, { className: "w-10 h-10 text-yt-sub opacity-20" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-y-0 end-0 w-2/5 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white border-s border-white/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListVideo, { className: "w-5 h-5 mb-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold",
										children: pl.count
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-[15px] mt-3 group-hover:text-yt-blue transition-colors line-clamp-1",
								children: pl.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[13px] text-yt-sub mt-0.5",
								children: pl.type === "system" ? t("systemPlaylist") : t("customPlaylist")
							})
						]
					}, pl.key))
				})
			]
		});
	}
	if (normalized === "videos") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-[1400px] mx-auto px-3 sm:px-6 pt-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "font-display font-black text-2xl mb-6 flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(meta.icon, { className: "w-7 h-7" }),
				" ",
				meta.title
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: meta.empty })]
	});
	if (remoteKey) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-[1600px] mx-auto px-3 sm:px-6 pt-4 lg:pt-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
			className: "font-display font-black text-2xl mb-6 flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(meta.icon, { className: "w-7 h-7" }),
				" ",
				meta.title
			]
		}), remoteErr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { onRetry: () => setAttempt((a) => a + 1) }) : remote === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonGrid, {}) : remote.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: meta.empty }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8",
			children: remote.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, { ...cardProps(v, i) }, v.url))
		})]
	});
	const ids = normalized === "history" ? props.history : normalized === "watchLater" ? props.watchLater : props.liked;
	const list = idsToVideos$1(ids);
	if (meta.playlist) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-[1400px] mx-auto px-3 sm:px-6 pt-4 lg:pt-6 flex flex-col lg:flex-row gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "lg:w-80 shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl p-5 text-white relative overflow-hidden",
				style: { background: normalized === "liked" ? "linear-gradient(160deg,#3ea6ff,#1e3a8a)" : "linear-gradient(160deg,#ff0000,#7f1d1d)" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 opacity-20 [background:radial-gradient(circle_at_top,white,transparent_60%)]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(meta.icon, { className: "w-9 h-9 mb-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display font-black text-2xl leading-tight",
						children: meta.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-white/80 mt-2",
						children: [
							list.length,
							" ",
							t("videosSavedOnDevice")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 mt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => list[0] && props.onOpen(list[0]),
							disabled: !list.length,
							className: "flex-1 h-9 rounded-full bg-white text-black text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "w-4 h-4" }),
								" ",
								t("playAll")
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => list.length && props.onOpen(list[Math.floor(Math.random() * list.length)]),
							disabled: !list.length,
							className: "w-9 h-9 rounded-full bg-white/20 grid place-items-center disabled:opacity-50",
							"aria-label": t("shuffle"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "w-4 h-4" })
						})]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 min-w-0",
			children: list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: meta.empty }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: list.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 group",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-6 text-center text-sm text-yt-sub shrink-0 tabular-nums",
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 min-w-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, {
								...cardProps(v, i),
								layout: "list"
							})
						}),
						normalized === "watchLater" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								props.onRemoveLater(v.url.split("v=")[1]);
								props.notify(t("removeFromWatchLater"));
							},
							className: "w-9 h-9 rounded-full hover:bg-yt-surface grid place-items-center shrink-0 text-yt-sub hover:text-red-400",
							"aria-label": "Remove",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						})
					]
				}, v.url))
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-[1600px] mx-auto px-3 sm:px-6 pt-4 lg:pt-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between mb-6 flex-wrap gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display font-black text-2xl flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(meta.icon, { className: "w-7 h-7" }),
					" ",
					meta.title
				]
			}), list.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					props.onClearHistory();
					props.notify(t("historyClearedToast"));
				},
				className: "h-9 px-4 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" }),
					" ",
					t("clearHistory")
				]
			})]
		}), ids.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: meta.empty }) : list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 text-yt-sub text-sm py-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-5 h-5 animate-spin" }),
				" ",
				t("loadingHistoryData")
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "max-w-4xl space-y-3",
			children: list.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, {
				...cardProps(v, i),
				layout: "list"
			}, v.url))
		})]
	});
}
function idsToVideos(ids) {
	return ids.map((id) => {
		const m = getMeta(id);
		if (!m) return null;
		return {
			url: `/watch?v=${id}`,
			title: m.title,
			thumbnail: m.thumbnail,
			uploaderName: m.uploaderName,
			uploaderAvatar: m.uploaderAvatar,
			duration: m.duration ?? 0
		};
	}).filter(Boolean);
}
function PlaylistPage(props) {
	const { playlistId } = props;
	const { t, isAr } = useLanguage();
	const [customData, setCustomData] = (0, import_react.useState)(null);
	const [customError, setCustomError] = (0, import_react.useState)(false);
	const isCustom = playlistId.startsWith("pl_");
	const { data, isPending: loading, isError: queryError, refetch } = useQuery({
		queryKey: ["playlist", playlistId],
		queryFn: () => getPlaylist(playlistId),
		placeholderData: keepPreviousData,
		enabled: !isCustom && !!playlistId
	});
	(0, import_react.useEffect)(() => {
		if (isCustom) {
			setCustomError(false);
			getCustomPlaylists().then((lists) => {
				const pl = lists.find((p) => p.id === playlistId);
				if (pl) setCustomData(pl);
				else setCustomError(true);
			});
		} else setCustomData(null);
	}, [playlistId, isCustom]);
	if (isCustom ? customError : queryError) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-w-[1400px] mx-auto px-3 sm:px-6 pt-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
			onRetry: () => void refetch(),
			message: isAr ? "تعذّر فتح قائمة التشغيل، حاول مرة أخرى." : "Failed to open playlist, try again."
		})
	});
	if (!data && !customData) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-w-[1400px] mx-auto px-3 sm:px-6 pt-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonGrid, { count: 6 })
	});
	const list = customData ? idsToVideos(customData.videoIds) : data.videos;
	const title = customData?.title || data?.title || props.title;
	const thumbnail = customData?.thumbnail || data?.thumbnail;
	const uploader = customData ? isAr ? "قائمة مخصصة" : "Custom Playlist" : data?.uploaderName;
	const videoCount = customData ? customData.videoIds.length : data?.videoCount || list.length;
	const handleRemove = async (videoId) => {
		if (!customData) return;
		await removeFromPlaylist(customData.id, videoId);
		setCustomData((prev) => prev ? {
			...prev,
			videoIds: prev.videoIds.filter((id) => id !== videoId)
		} : null);
		props.notify(isAr ? "تمت الإزالة من القائمة" : "Removed from playlist");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-[1400px] mx-auto px-3 sm:px-6 pt-4 lg:pt-6 flex flex-col lg:flex-row gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "lg:w-80 shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl p-5 text-white relative overflow-hidden bg-yt-raised",
				children: [thumbnail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: thumbnail,
					alt: "",
					referrerPolicy: "no-referrer",
					className: "absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListVideo, { className: "w-9 h-9 mb-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display font-black text-2xl leading-tight line-clamp-3",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-white/80 mt-2",
							children: [
								uploader ? `${uploader} · ` : "",
								videoCount,
								" ",
								isAr ? "فيديو" : "videos"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 mt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => list[0] && props.onOpen(list[0]),
								disabled: !list.length,
								className: "flex-1 h-9 rounded-full bg-white text-black text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "w-4 h-4" }),
									" ",
									isAr ? "تشغيل الكل" : "Play all"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => list.length && props.onOpen(list[Math.floor(Math.random() * list.length)]),
								disabled: !list.length,
								className: "w-9 h-9 rounded-full bg-white/20 grid place-items-center disabled:opacity-50",
								"aria-label": isAr ? "ترتيب عشوائي" : "Shuffle",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shuffle, { className: "w-4 h-4" })
							})]
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 min-w-0",
			children: list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: isAr ? "لا توجد مقاطع في هذه القائمة." : "No videos in this playlist." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: list.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 group",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-6 text-center text-sm text-yt-sub shrink-0 tabular-nums",
							children: i + 1
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 min-w-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, {
								video: v,
								index: i,
								layout: "list",
								onOpen: props.onOpen,
								onChannel: props.onChannel,
								notify: props.notify,
								onDismiss: props.onDismiss,
								saved: props.isSaved(v.url.split("v=")[1] || ""),
								onSaveLater: () => props.onSaveLater(v.url.split("v=")[1] || ""),
								onAddToPlaylist: () => props.onAddToPlaylist(v)
							})
						}),
						isCustom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => handleRemove(v.url.split("v=")[1]),
							className: "w-9 h-9 rounded-full hover:bg-yt-surface grid place-items-center shrink-0 text-yt-sub opacity-0 group-hover:opacity-100 transition-opacity",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
						})
					]
				}, v.url))
			})
		})]
	});
}
function PlaylistDialog({ open, onClose, video, notify }) {
	const { t, isAr, dir } = useLanguage();
	const [playlists, setPlaylists] = (0, import_react.useState)([]);
	const [showCreate, setShowCreate] = (0, import_react.useState)(false);
	const [newTitle, setNewTitle] = (0, import_react.useState)("");
	const [search, setSearch] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (open) getCustomPlaylists().then(setPlaylists);
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
	const handleToggle = async (pl) => {
		if (pl.videoIds.includes(videoId)) {
			notify(isAr ? "الفيديو موجود بالفعل في هذه القائمة" : "Video already in this playlist");
			return;
		}
		await addToPlaylist(pl.id, videoId);
		notify(isAr ? `تمت الإضافة إلى ${pl.title}` : `Added to ${pl.title}`);
		onClose();
	};
	const filtered = playlists.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[1000] flex items-center justify-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-md bg-yt-raised border border-yt-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200",
			dir,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between p-4 border-b border-yt-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold text-lg",
					children: isAr ? "إضافة إلى قائمة تشغيل" : "Add to playlist"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "p-1 hover:bg-yt-surface rounded-full transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-6 h-6" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4 space-y-4",
				children: !showCreate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yt-sub" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: isAr ? "بحث في قوائمك..." : "Search your playlists...",
							className: "w-full bg-yt-bg border border-yt-border rounded-xl py-2.5 ps-10 pe-4 outline-none focus:border-yt-blue transition-colors text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-[300px] overflow-y-auto space-y-1 custom-scrollbar pe-1",
						children: [filtered.map((pl) => {
							const exists = pl.videoIds.includes(videoId);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => handleToggle(pl),
								className: "w-full flex items-center justify-between p-3 rounded-xl hover:bg-yt-surface transition-colors text-start group",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-10 h-10 rounded-lg bg-yt-bg border border-yt-border flex items-center justify-center shrink-0",
										children: pl.thumbnail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: pl.thumbnail,
											className: "w-full h-full object-cover rounded-lg",
											alt: ""
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListVideo, { className: "w-5 h-5 text-yt-sub opacity-40" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium text-sm line-clamp-1",
										children: pl.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-yt-sub",
										children: [
											pl.videoIds.length,
											" ",
											isAr ? "فيديو" : "videos"
										]
									})] })]
								}), exists && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-5 h-5 text-yt-blue" })]
							}, pl.id);
						}), filtered.length === 0 && !search && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-8 text-center space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListVideo, { className: "w-10 h-10 text-yt-sub opacity-20 mx-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-yt-sub",
								children: isAr ? "لا توجد قوائم تشغيل بعد" : "No playlists yet"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setShowCreate(true),
						className: "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-yt-surface transition-colors text-yt-blue font-bold text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "إنشاء قائمة جديدة" : "Create new playlist" })]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 py-2 animate-in slide-in-from-bottom-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-bold text-yt-sub uppercase tracking-wider px-1",
							children: isAr ? "اسم القائمة" : "Playlist Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							autoFocus: true,
							type: "text",
							value: newTitle,
							onChange: (e) => setNewTitle(e.target.value),
							placeholder: isAr ? "أدخل اسم القائمة..." : "Enter playlist name...",
							className: "w-full bg-yt-bg border border-yt-border rounded-xl py-3 px-4 outline-none focus:border-yt-blue transition-colors"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleCreateAndAdd,
							disabled: !newTitle.trim(),
							className: "flex-1 bg-white text-black h-11 rounded-xl font-bold active:scale-[0.98] transition-all disabled:opacity-50",
							children: isAr ? "إنشاء وإضافة" : "Create and add"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowCreate(false),
							className: "px-6 h-11 rounded-xl bg-yt-surface font-bold hover:bg-yt-hover transition-colors",
							children: isAr ? "رجوع" : "Back"
						})]
					})]
				})
			})]
		})]
	});
}
function usePWA() {
	const [deferredPrompt, setDeferredPrompt] = (0, import_react.useState)(null);
	const [isInstalled, setIsInstalled] = (0, import_react.useState)(false);
	const [isIOS, setIsIOS] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const isStandalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
		setIsInstalled(isStandalone);
		const userAgent = window.navigator.userAgent.toLowerCase();
		const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
		setIsIOS(isIOSDevice);
		const handleBeforeInstallPrompt = (e) => {
			e.preventDefault();
			setDeferredPrompt(e);
		};
		const handleAppInstalled = () => {
			setIsInstalled(true);
			setDeferredPrompt(null);
		};
		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
		window.addEventListener("appinstalled", handleAppInstalled);
		return () => {
			window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
			window.removeEventListener("appinstalled", handleAppInstalled);
		};
	}, []);
	const install = async () => {
		if (!deferredPrompt) return false;
		await deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === "accepted") {
			setIsInstalled(true);
			setDeferredPrompt(null);
			return true;
		}
		return false;
	};
	return {
		isInstallable: !!deferredPrompt,
		isInstalled,
		isIOS,
		install
	};
}
function SettingsDialog({ open, onClose, onHistoryCleared, onOpenPolicies, notify }) {
	const { lang, setLang, t, dir, isAr } = useLanguage();
	const [confirmClear, setConfirmClear] = (0, import_react.useState)(false);
	const { backgroundPlay, autoplayNext } = useAppStore();
	const { isInstallable, isInstalled, isIOS, install } = usePWA();
	const [showIOSGuide, setShowIOSGuide] = (0, import_react.useState)(false);
	if (!open) return null;
	const toggleBackgroundPlay = () => {
		const next = !backgroundPlay;
		appStore$1.setBackgroundPlay(next);
		setBackgroundPlay(next);
		notify(t("playbackUpdatedToast"));
	};
	const toggleAutoplayNext = () => {
		const next = !autoplayNext;
		appStore$1.setAutoplayNext(next);
		notify(next ? isAr ? "تم تفعيل التشغيل التلقائي" : "Autoplay enabled" : isAr ? "تم إيقاف التشغيل التلقائي" : "Autoplay disabled");
	};
	const handleClearHistory = async () => {
		await clearHistory();
		setConfirmClear(false);
		onHistoryCleared?.();
		notify(t("settingsClearHistorySuccess"));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg bg-yt-raised border border-yt-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
			dir,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-6 py-4 border-b border-yt-border bg-yt-raised shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold font-display text-yt-text",
						children: t("settingsTitle")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "w-9 h-9 rounded-full hover:bg-yt-surface grid place-items-center text-yt-sub hover:text-yt-text transition-colors",
						"aria-label": t("settingsClose"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 overflow-y-auto space-y-6 text-sm text-yt-text",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 text-base font-bold text-yt-text",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "w-5 h-5 text-yt-blue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("language") })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-yt-sub leading-relaxed",
									children: t("settingsLanguageDesc")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1",
									children: [{
										id: "en",
										name: "English",
										nativeName: "English (US)",
										isDefault: true
									}, {
										id: "ar",
										name: "العربية",
										nativeName: "العربية (Arabic)",
										isDefault: false
									}].map((item) => {
										const selected = lang === item.id;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setLang(item.id),
											className: `flex items-center justify-between p-3.5 rounded-xl border transition-all text-start ${selected ? "border-yt-blue bg-yt-surface shadow-md font-semibold text-white" : "border-yt-border bg-yt-bg hover:bg-yt-surface text-yt-text/90"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-medium",
													children: item.name
												}), item.isDefault && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] px-1.5 py-0.5 rounded bg-yt-blue/20 text-yt-blue font-bold",
													children: "Default"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-yt-sub block mt-0.5",
												children: item.nativeName
											})] }), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "w-6 h-6 rounded-full bg-yt-blue text-black grid place-items-center shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 stroke-[3]" })
											})]
										}, item.id);
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-yt-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 text-base font-bold text-yt-text",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "w-5 h-5 text-yt-blue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("settingsAppearance") })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between p-3.5 rounded-xl bg-yt-bg border border-yt-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: t("settingsDarkTheme")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-yt-sub font-mono bg-yt-surface px-2 py-1 rounded",
									children: "Dark"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-yt-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 text-base font-bold text-yt-text",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-5 h-5 text-yt-blue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("settingsBackgroundPlay") })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-yt-sub leading-relaxed",
									children: t("settingsBackgroundPlayDesc")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: toggleBackgroundPlay,
									className: "w-full flex items-center justify-between p-3.5 rounded-xl bg-yt-bg border border-yt-border hover:bg-yt-surface transition-colors cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: backgroundPlay ? t("enabled") : t("disabled")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `w-12 h-6 rounded-full transition-colors relative ${backgroundPlay ? "bg-yt-blue" : "bg-yt-surface"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${backgroundPlay ? isAr ? "right-7" : "left-7" : isAr ? "right-1" : "left-1"}` })
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-yt-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 text-base font-bold text-yt-text",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlay, { className: "w-5 h-5 text-yt-blue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "التشغيل التلقائي" : "Autoplay" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-yt-sub leading-relaxed",
									children: isAr ? "تشغيل الفيديو التالي تلقائياً عند انتهاء المقطع الحالي" : "Automatically play the next video when the current video ends"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: toggleAutoplayNext,
									className: "w-full flex items-center justify-between p-3.5 rounded-xl bg-yt-bg border border-yt-border hover:bg-yt-surface transition-colors cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: autoplayNext ? t("enabled") : t("disabled")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `w-12 h-6 rounded-full transition-colors relative ${autoplayNext ? "bg-yt-blue" : "bg-yt-surface"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${autoplayNext ? isAr ? "right-7" : "left-7" : isAr ? "right-1" : "left-1"}` })
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-yt-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 text-base font-bold text-yt-text",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "w-5 h-5 text-yt-blue" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("settingsInstallApp") })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-yt-sub leading-relaxed",
									children: t("settingsInstallAppDesc")
								}),
								isInstalled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 p-3.5 rounded-xl bg-yt-blue/10 border border-yt-blue/20 text-yt-blue",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: t("settingsInstalled")
									})]
								}) : isInstallable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: install,
									className: "w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-yt-blue hover:bg-opacity-90 text-black font-bold transition-all shadow-lg shadow-yt-blue/10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("install") })]
								}) : isIOS ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setShowIOSGuide(true),
									className: "w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-yt-bg border border-yt-border hover:bg-yt-surface text-yt-text font-medium transition-all",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("installIOS") })]
								}) : null,
								showIOSGuide && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl bg-yt-surface border border-yt-border space-y-3 animate-in slide-in-from-top-2 duration-200",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-sm font-bold",
											children: t("installIOSHeading")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setShowIOSGuide(false),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4 text-yt-sub" })
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-yt-sub space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("installIOSStep1") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("installIOSStep2") })]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-yt-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 text-base font-bold text-yt-text",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-5 h-5 text-yt-red" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("settingsHistory") })]
							}), confirmClear ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-red-950/30 border border-red-800/50 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2.5 text-red-300",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-5 h-5 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs",
										children: t("confirmClearHistory")
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 justify-end pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setConfirmClear(false),
										className: "px-3.5 py-1.5 rounded-lg bg-yt-surface hover:bg-yt-hover text-xs font-medium",
										children: t("cancel")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: handleClearHistory,
										className: "px-3.5 py-1.5 rounded-lg bg-yt-red hover:bg-red-600 text-white text-xs font-bold",
										children: t("yesClearHistory")
									})]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setConfirmClear(true),
								className: "w-full flex items-center justify-between p-3.5 rounded-xl bg-yt-bg border border-yt-border hover:bg-yt-surface transition-colors text-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium text-red-400 block",
									children: t("settingsClearHistory")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-yt-sub",
									children: t("clearHistorySubtitle")
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-red-400 shrink-0" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-yt-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5 text-base font-bold text-yt-text",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-5 h-5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "الحقوق والسياسات" : "Legal & Policies" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									onClose();
									onOpenPolicies?.();
								},
								className: "w-full flex items-center justify-between p-3.5 rounded-xl bg-yt-bg border border-yt-border hover:bg-yt-surface transition-colors text-start",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-medium text-white block",
									children: isAr ? "شروط الخدمة، الخصوصية وحقوق الملكية" : "Terms, Privacy & Content Rights"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-yt-sub",
									children: isAr ? "الاطلاع على سياسات التطبيق، حقوق المحتوى وGoogle API" : "View terms of service, privacy notice and Google API policy"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-4 h-4 text-yt-sub shrink-0" })]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-6 py-4 border-t border-yt-border bg-yt-raised flex items-center justify-end shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "px-5 py-2 rounded-full bg-yt-text text-yt-bg font-bold text-sm hover:bg-opacity-90 transition-all",
						children: t("settingsClose")
					})
				})
			]
		})
	});
}
function PoliciesPage({ onBackToHome }) {
	const { isAr, dir } = useLanguage();
	const [activeTab, setActiveTab] = (0, import_react.useState)("terms");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-yt-bg text-yt-text px-4 py-8 md:px-12 max-w-5xl mx-auto",
		dir,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onBackToHome,
						className: "p-2 -ms-2 rounded-full hover:bg-yt-surface text-yt-sub hover:text-yt-text transition-colors flex items-center gap-1 text-sm font-medium",
						"aria-label": isAr ? "الرجوع للرئيسية" : "Back to Home",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(isAr ? ArrowRight : ArrowLeft, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: isAr ? "الرئيسية" : "Home"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-yt-sub",
						children: "/"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl md:text-2xl font-bold font-display text-white",
						children: isAr ? "حقوق الاستخدام والسياسات" : "Terms of Service & Policies"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-yt-border scrollbar-none",
				children: [
					{
						id: "terms",
						label: isAr ? "شروط الخدمة والاستخدام" : "Terms of Service",
						icon: Scale
					},
					{
						id: "privacy",
						label: isAr ? "سياسة الخصوصية" : "Privacy Policy",
						icon: Lock
					},
					{
						id: "copyright",
						label: isAr ? "حقوق الملكية الفكرية و YouTube" : "Copyright & Content",
						icon: FileText
					},
					{
						id: "google",
						label: isAr ? "خدمات Google Cloud & API" : "Google Cloud & API Policies",
						icon: ShieldCheck
					}
				].map((tab) => {
					const Icon = tab.icon;
					const isActive = activeTab === tab.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab(tab.id),
						className: `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${isActive ? "bg-white text-black font-semibold shadow-md" : "bg-yt-surface/60 text-yt-sub hover:text-white hover:bg-yt-surface"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "w-4 h-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label })]
					}, tab.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					activeTab === "terms" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-6 bg-yt-raised/50 border border-yt-border rounded-2xl p-6 md:p-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-yt-border pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-xl font-bold text-white flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "w-5 h-5 text-yt-red" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "شروط الاستخدام والخدمة" : "Terms of Service" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-yt-sub mt-1",
								children: isAr ? "آخر تحديث: سبتمبر 2026" : "Last updated: September 2026"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-sm leading-relaxed text-yt-text/90",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl bg-yt-surface/50 border border-yt-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-white mb-1.5",
										children: isAr ? "1. طبيعة المنصة والتطبيق" : "1. Nature of the Service"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: isAr ? "منصة Youtubiy هي واجهة عرض ويب تفاعلية خفيفة تم تصميمها لتوفير تجربة استعراض وبحث متطورة وتشغيل في الخلفية لمحتوى الفيديو. المنصة لا تستضيف أي ملفات فيديو على خوادم خاصة، بل تعتمد على تقنيات التشغيل الرسمية المعتمدة." : "Youtubiy is an enhanced interactive web client providing an ad-free viewing experience, search, and background playback. It does not host video files on its own servers and relies on authorized playback mechanisms." })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl bg-yt-surface/50 border border-yt-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-white mb-1.5",
										children: isAr ? "2. الاستخدام المسموح به" : "2. Permitted Use"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "list-disc list-inside space-y-1 text-yt-sub",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: isAr ? "الاستخدام الشخصي وغير التجاري لمشاهدة المقاطع ومتابعة المحتوى." : "Personal, non-commercial use for streaming and discovering video content." }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: isAr ? "تنظيم قوائم التشغيل الخاصة وسجل المشاهدة والمقاطع المحفوظة لاحقاً." : "Managing personal playlists, watch history, and liked videos." }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: isAr ? "يحظر محاولة التحميل غير المصرح به أو إعادة هندسة الخدمة للإضرار بمصادر البث." : "Unauthorized scraping, distribution, or reverse-engineering is strictly prohibited." })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl bg-yt-surface/50 border border-yt-border",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-bold text-white mb-1.5",
											children: isAr ? "3. شروط أطراف ثالثة (YouTube)" : "3. Third-Party Terms"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: isAr ? "باستخدامك لهذا التطبيق، فإنك توافق أيضاً على الالتزام بشروط خدمة YouTube الرسمية وسياسة خصوصية Google." : "By using this application, you also agree to be bound by YouTube's official Terms of Service and Google's Privacy Policy." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 flex flex-wrap gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: "https://www.youtube.com/t/terms",
												target: "_blank",
												rel: "noopener noreferrer",
												className: "inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "شروط خدمة YouTube الرسمية" : "YouTube Terms of Service" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
												href: "https://policies.google.com/privacy",
												target: "_blank",
												rel: "noopener noreferrer",
												className: "inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "سياسة خصوصية Google" : "Google Privacy Policy" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" })]
											})]
										})
									]
								})
							]
						})]
					}),
					activeTab === "privacy" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-6 bg-yt-raised/50 border border-yt-border rounded-2xl p-6 md:p-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-yt-border pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-xl font-bold text-white flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-5 h-5 text-blue-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "سياسة الخصوصية وحماية البيانات" : "Privacy & Data Protection" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-yt-sub mt-1",
								children: isAr ? "نحن نولي حماية خصوصيتك الأولوية القصوى" : "Your privacy is our utmost priority"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-sm leading-relaxed text-yt-text/90",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl bg-yt-surface/50 border border-yt-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-bold text-white mb-1.5 flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "البيانات المخزنة محلياً" : "Locally Stored Data" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-yt-sub",
										children: isAr ? "يتم تخزين تفضيلاتك مثل جودة الفيديو، وضع ملء الشاشة، اللغة، والتشغيل في الخلفية محلياً على جهازك في (localStorage / IndexedDB) دون إرسالها لأي جهة إعلانية أو تتبع." : "Your preferences, language selection, playback speed, and quality settings are retained locally on your device without transmitting telemetry to third-party ad brokers."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl bg-yt-surface/50 border border-yt-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-bold text-white mb-1.5 flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "بيانات الحساب والمزامنة السحابية" : "Account & Cloud Sync" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-yt-sub",
										children: isAr ? "عند تسجيل الدخول عبر Google أو حفظ المقاطع والاشتراكات، يتم حفظ هذه البيانات بشكل مشفر عبر Firebase Firestore التابع لمشروعك فقط لضمان مزامنتها عبر أجهزتك المختلفة." : "When signing in via Google, your profile, subscriptions, and playlists are securely synchronized through your private Cloud Firestore instance solely for multi-device sync."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl bg-yt-surface/50 border border-yt-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-bold text-white mb-1.5 flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-4 h-4 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "انعدام التتبع والإعلانات التجسسية" : "No Ad Tracking" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-yt-sub",
										children: isAr ? "لا يحتوي هذا التطبيق على أي أدوات تتبع تسويقية أو ملفات تعريف ارتباط (cookies) خارجية لأغراض الإعلانات الموجهة." : "This application contains zero commercial advertising trackers, pixels, or behavioral profiling tools."
									})]
								})
							]
						})]
					}),
					activeTab === "copyright" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-6 bg-yt-raised/50 border border-yt-border rounded-2xl p-6 md:p-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-yt-border pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-xl font-bold text-white flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-5 h-5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "حقوق الملكية الفكرية والمحتوى" : "Copyright & IP Rights" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-yt-sub mt-1",
								children: isAr ? "حقوق صانعي المحتوى والعلامات التجارية" : "Content Creators & Trademark Notice"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-sm leading-relaxed text-yt-text/90",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl bg-yt-surface/50 border border-yt-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-white mb-1.5",
										children: isAr ? "حقوق صانعي الفيديو والقنوات" : "Content Creators Ownership"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-yt-sub",
										children: isAr ? "جميع مقاطع الفيديو والعناوين والصور المصغرة والعلامات المائية المعروضة في التطبيق هي ملك لأصحاب القنوات وصناع المحتوى الأصليين، وتخضع لقوانين حقوق النشر المعمول بها عالمياً." : "All videos, audio, titles, thumbnails, and channel metadata presented in this client remain the exclusive intellectual property of their original creators and licensors."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl bg-yt-surface/50 border border-yt-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-white mb-1.5",
										children: isAr ? "العلامات التجارية" : "Trademark Notice"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-yt-sub",
										children: isAr ? "YouTube وشعار YouTube هما علامتان تجاريتان مملوكتان لشركة Google LLC. هذا التطبيق مستقل ولا يرتبط بشكل رسمي أو تعاقدي حصري مع شركة Google LLC." : "YouTube and the YouTube logo are trademarks of Google LLC. Youtubiy is an independent client interface and is not endorsed by or affiliated with Google LLC."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 font-bold mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-4 h-4 text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "طلب إزالة محتوى (DMCA)" : "Copyright Removal Requests" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: isAr ? "نظراً لعدم استضافة مقاطع الفيديو على خوادمنا، فإن إزالة أي مقطع من منصة YouTube الأساسية يؤدي فورياً وتلقائياً إلى إزالته من العرض في هذا التطبيق." : "Because no content is hosted on Youtubiy infrastructure, deleting or making a video private on YouTube instantly prevents it from rendering inside this client." })]
								})
							]
						})]
					}),
					activeTab === "google" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "space-y-6 bg-yt-raised/50 border border-yt-border rounded-2xl p-6 md:p-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-yt-border pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-xl font-bold text-white flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-5 h-5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "خدمات Google Cloud وشروط واجهات البرمجة" : "Google Cloud & API Services" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-yt-sub mt-1",
								children: isAr ? "الامتثال لسياسات Google API Services User Data Policy" : "Google API Services User Data Policy Compliance"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 text-sm leading-relaxed text-yt-text/90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-yt-surface/50 border border-yt-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-white mb-1.5",
										children: isAr ? "نطاقات الصلاحيات المطلوبة (OAuth Scopes)" : "Requested OAuth Scopes"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-yt-sub mb-3",
										children: isAr ? "يطلب التطبيق فقط الصلاحيات المصممة للقراءة اللازمة لتشغيل الميزات التي يطلبها المستخدم:" : "The app requests minimum read-only scopes strictly required for user-initiated actions:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-mono text-xs bg-black/50 p-2.5 rounded-lg border border-yt-border text-emerald-400 space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "https://www.googleapis.com/auth/youtube.readonly" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "openid email profile" })]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl bg-yt-surface/50 border border-yt-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-white mb-1.5",
										children: isAr ? "استخدام البيانات الحصري" : "Limited Use Policy"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-yt-sub",
										children: isAr ? "يلتزم التطبيق بسياسة الاستخدام المحدود (Google API Services User Data Policy)، بما في ذلك متطلبات الاستخدام المحدود. لا يتم نقل أو بيع أو مشاركة بيانات المستخدم الواردة من Google مع أي نماذج ذكاء اصطناعي أو شركات طرف ثالث." : "Youtubiy's use and transfer of information received from Google APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
											href: "https://developers.google.com/terms/api-services-user-data-policy",
											target: "_blank",
											rel: "noopener noreferrer",
											className: "inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "Google API Services User Data Policy" : "Google API Services User Data Policy" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "w-3.5 h-3.5" })]
										})
									})
								]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 pt-6 border-t border-yt-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-yt-sub",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["© 2026 Youtubiy. ", isAr ? "جميع الحقوق محفوظة." : "All rights reserved."] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onBackToHome,
					className: "text-white hover:underline font-medium",
					children: isAr ? "العودة إلى الصفحة الرئيسية" : "Return to Home Feed"
				})]
			})
		]
	});
}
function YouTubeSyncBanner() {
	const { user, signIn, syncYouTubeData, importingYouTube } = useAuth();
	const { isAr } = useLanguage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 rounded-2xl overflow-hidden relative group",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-red-600/10 via-yt-surface to-yt-surface/50 -z-10" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-red-500/10 bg-yt-surface/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl relative overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-24 -end-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-24 -start-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/20 flex items-center justify-center shadow-inner",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "w-10 h-10 text-red-500 relative z-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full bg-red-500/20 animate-ping opacity-50" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 text-center sm:text-start space-y-3 z-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold tracking-wide mb-1 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-3.5 h-3.5" }), isAr ? "موجز مخصص لك" : "Personalized Feed"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl sm:text-2xl font-bold text-yt-text tracking-tight",
								children: isAr ? "استمتع بمحتواك المفضل فوراً" : "Sync Your YouTube Experience"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-yt-sub max-w-md mx-auto sm:mx-0 leading-relaxed font-medium",
								children: user ? isAr ? "يبدو أنه لم يتم العثور على اشتراكات. يرجى التأكد من تفعيل YouTube Data API v3 ومنح الأذونات اللازمة، ثم حاول المزامنة مرة أخرى." : "It looks like no subscriptions were found. Please make sure YouTube Data API v3 is enabled, then try syncing again." : isAr ? "سجّل الدخول بحسابك على Google لمزامنة اشتراكاتك تلقائياً وبناء موجز ذكي يعرض لك أفضل المقاطع والقنوات التي تتابعها فعلياً." : "Sign in with Google to automatically sync your subscriptions and generate a smart feed tailored to the channels you actually watch."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "shrink-0 w-full sm:w-auto z-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => user ? syncYouTubeData().catch(() => {}) : signIn().catch(() => {}),
							disabled: importingYouTube,
							className: "w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-yt-text hover:bg-white text-yt-bg font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-white/5",
							children: [user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `w-5 h-5 shrink-0 ${importingYouTube ? "animate-spin" : ""}` }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "w-5 h-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: importingYouTube ? isAr ? "جاري المزامنة..." : "Syncing..." : user ? isAr ? "مزامنة البيانات الآن" : "Sync Data Now" : isAr ? "تسجيل الدخول ومزامنة يوتيوب" : "Sign in & Sync YouTube" })]
						})
					})
				]
			})
		]
	});
}
var STOP_WORDS = /* @__PURE__ */ new Set([
	"في",
	"من",
	"على",
	"الى",
	"إلى",
	"عن",
	"مع",
	"هذا",
	"هذه",
	"ذلك",
	"التي",
	"الذي",
	"كل",
	"بعد",
	"قبل",
	"ما",
	"لا",
	"هل",
	"كيف",
	"ليه",
	"ازاي",
	"إزاي",
	"يا",
	"او",
	"أو",
	"و",
	"ثم",
	"لكن",
	"حتى",
	"انا",
	"أنا",
	"احنا",
	"احلى",
	"اقوى",
	"افضل",
	"أفضل",
	"جديد",
	"حصري",
	"شرح",
	"فيديو",
	"الحلقة",
	"الجزء",
	"كامل",
	"the",
	"a",
	"an",
	"and",
	"or",
	"of",
	"to",
	"in",
	"on",
	"for",
	"with",
	"is",
	"are",
	"be",
	"this",
	"that",
	"how",
	"what",
	"why",
	"best",
	"top",
	"new",
	"full",
	"official",
	"video",
	"part",
	"ep",
	"episode",
	"vs",
	"you",
	"your",
	"my",
	"i",
	"it",
	"can",
	"do",
	"does",
	"not",
	"from",
	"by",
	"at",
	"as",
	"we"
]);
function normalizeText(s) {
	return s.toLowerCase().replace(/[\u064B-\u0652\u0670\u0640]/g, "").replace(/[إأآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ؤ/g, "و").replace(/ئ/g, "ي").replace(/ة/g, "ه").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}
function tokenize(text, withBigrams = true) {
	const words = normalizeText(text).split(" ").filter((w) => w.length >= 3 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));
	if (!withBigrams) return words;
	const out = [...words];
	for (let i = 0; i < words.length - 1; i++) out.push(`${words[i]} ${words[i + 1]}`);
	return out;
}
function timeDecay(isoDate) {
	if (!isoDate) return .3;
	const time = typeof isoDate === "number" ? isoDate : new Date(isoDate).getTime();
	const ms = Date.now() - time;
	if (!Number.isFinite(ms) || ms < 0) return 1;
	const days = ms / 864e5;
	return Math.pow(.5, days / 14);
}
function engagement(row, watchedSeconds) {
	const dur = row.duration || 0;
	if (dur <= 0) return watchedSeconds > 60 ? .5 : .15;
	const ratio = Math.min(1, watchedSeconds / dur);
	if (ratio < .08) return -.5;
	if (ratio < .2) return -.2;
	if (ratio < .45) return .25;
	if (ratio < .75) return .7;
	return 1;
}
function bump(map, key, value) {
	map.set(key, (map.get(key) || 0) + value);
}
function buildTasteProfile(input) {
	const { history, progress, likedIds, subs, searches = [], dismissed } = input;
	const channels = /* @__PURE__ */ new Map();
	const rawTopics = /* @__PURE__ */ new Map();
	const channelNegatives = /* @__PURE__ */ new Map();
	const watched = /* @__PURE__ */ new Set();
	const resumable = [];
	if (dismissed?.videoIds) dismissed.videoIds.forEach((id) => watched.add(id));
	const liked = new Set(likedIds);
	let completionSum = 0;
	let completionCount = 0;
	let durationSum = 0;
	let durationCount = 0;
	let signalCount = 0;
	for (const row of history) {
		watched.add(row.video_id);
		const seconds = progress[row.video_id] ?? row.progress;
		const decay = timeDecay(row.watched_at);
		let eng = seconds === void 0 ? .2 : engagement(row, seconds);
		if (liked.has(row.video_id)) eng = Math.min(1.6, eng + .6);
		const weight = eng * decay;
		signalCount++;
		if (seconds !== void 0 && row.duration && seconds > 0) {
			const ratio = Math.min(1, seconds / row.duration);
			completionSum += ratio;
			completionCount++;
			if (ratio > .1 && ratio < .9) resumable.push(row.video_id);
			if (ratio >= .6) {
				durationSum += row.duration;
				durationCount++;
			}
		}
		const chId = row.channel_id || "";
		if (chId) {
			bump(channels, chId, weight);
			if (seconds !== void 0 && eng < 0) bump(channelNegatives, chId, decay);
		}
		if (row.title) for (const t of tokenize(row.title)) bump(rawTopics, t, weight);
	}
	let importedHistory = [];
	try {
		if (typeof localStorage !== "undefined") {
			const raw = localStorage.getItem("yt.importedHistory");
			if (raw) importedHistory = JSON.parse(raw);
		}
	} catch {}
	const importedChannelWeights = /* @__PURE__ */ new Map();
	for (const item of importedHistory) {
		if (item.v) watched.add(item.v);
		const weight = .3 * timeDecay(item.ts);
		if (item.c) {
			const current = importedChannelWeights.get(item.c) || 0;
			const next = Math.min(1, current + weight);
			importedChannelWeights.set(item.c, next);
		}
		if (item.t) for (const t of tokenize(item.t)) bump(rawTopics, t, weight);
		signalCount++;
	}
	for (const [chId, w] of importedChannelWeights) bump(channels, chId, w);
	for (const s of subs) bump(channels, s.channel_id, 1.2);
	searches.slice(0, 30).forEach((q, i) => {
		const w = 1.4 * Math.pow(.93, i);
		for (const t of tokenize(q)) bump(rawTopics, t, w);
		signalCount++;
	});
	const muted = /* @__PURE__ */ new Set();
	if (dismissed?.channelIds) dismissed.channelIds.forEach((chId) => muted.add(chId));
	for (const [chId, neg] of channelNegatives) if (neg >= 3 && (channels.get(chId) || 0) <= 0) muted.add(chId);
	const maxTopic = Math.max(...rawTopics.values(), 1);
	const topics = /* @__PURE__ */ new Map();
	for (const [k, v] of rawTopics) {
		if (v <= 0) continue;
		const n = v / maxTopic;
		if (n >= .06) topics.set(k, n);
	}
	const maxCh = Math.max(...[...channels.values()].map(Math.abs), 1);
	for (const [k, v] of channels) channels.set(k, v / maxCh);
	const topInterests = [...topics.entries()].filter(([k]) => k.includes(" ") || k.length > 4).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k]) => k);
	return {
		channels,
		topics,
		muted,
		watched,
		resumable: resumable.slice(0, 10),
		avgCompletion: completionCount ? completionSum / completionCount : .5,
		preferredDuration: durationCount ? durationSum / durationCount : 600,
		topInterests,
		signalCount
	};
}
function topicMatch(profile, video) {
	if (profile.topics.size === 0) return 0;
	const tokens = tokenize(`${video.title} ${video.uploaderName || ""}`);
	if (tokens.length === 0) return 0;
	let sum = 0;
	let hits = 0;
	const seen = /* @__PURE__ */ new Set();
	for (const t of tokens) {
		if (seen.has(t)) continue;
		seen.add(t);
		const w = profile.topics.get(t);
		if (w) {
			sum += t.includes(" ") ? w * 2 : w;
			hits++;
		}
	}
	if (hits === 0) return 0;
	return Math.min(1, sum / 3);
}
function channelAffinity(profile, video) {
	const chId = channelIdFromUrl(video.uploaderUrl || "");
	if (!chId) return 0;
	if (profile.muted.has(chId)) return -1;
	return profile.channels.get(chId) ?? 0;
}
function profileSummary(profile) {
	const topChannels = [];
	for (const [id, score] of [...profile.channels.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)) if (score > .2) topChannels.push(id);
	return [
		`اهتمامات: ${profile.topInterests.join("، ") || "غير محددة"}`,
		`متوسط الإكمال: ${(profile.avgCompletion * 100).toFixed(0)}%`,
		`المدة المفضلة: ${Math.round(profile.preferredDuration / 60)} دقيقة`,
		`عدد الإشارات: ${profile.signalCount}`,
		topChannels.length ? `قنوات مفضلة: ${topChannels.length}` : ""
	].filter(Boolean).join(" | ");
}
var WEIGHTS = {
	channel: .3,
	topic: .28,
	related: .14,
	freshness: .12,
	quality: .1,
	duration: .06
};
var FEED_SIZE = 40;
var CANDIDATE_CAP = 450;
var EXPLORE_RATIO = .15;
var MAX_PER_CHANNEL_TOP = 2;
var MAX_PER_CHANNEL_TOTAL = 4;
var lastFeedDiagnostics = null;
var diagListeners = /* @__PURE__ */ new Set();
function subscribeFeedDiagnostics(fn) {
	diagListeners.add(fn);
	return () => {
		diagListeners.delete(fn);
	};
}
function updateFeedDiagnostics(diag) {
	lastFeedDiagnostics = diag;
	diagListeners.forEach((fn) => {
		try {
			fn(diag);
		} catch {}
	});
}
var lastProfile = null;
var lastWatched = /* @__PURE__ */ new Set();
var freshness = (days) => days < 0 ? .5 : Math.pow(.5, days / 10);
function qualityPrior(v) {
	const views = v.views || 0;
	if (views <= 0) return .2;
	const perDay = views / Math.max(1, ageDays(v.uploaded, v.uploadedDate));
	return Math.min(1, Math.log10(perDay + 1) / 5);
}
function durationFit(v, preferred) {
	const d = v.duration || 0;
	if (d <= 0) return .5;
	const ratio = d / Math.max(60, preferred);
	if (ratio > .5 && ratio < 2) return 1;
	if (ratio > .25 && ratio < 4) return .6;
	return .25;
}
function addCandidate(pool, v, source) {
	const id = videoIdFromUrl(v.url);
	if (!id) return;
	const existing = pool.get(id);
	if (existing) {
		existing.sources.add(source);
		return;
	}
	if (pool.size >= CANDIDATE_CAP) return;
	pool.set(id, {
		video: v,
		sources: /* @__PURE__ */ new Set([source])
	});
}
async function generateCandidates(profile, subs, history, likedIds, searches = []) {
	const pool = /* @__PURE__ */ new Map();
	const relatedIds = /* @__PURE__ */ new Set();
	const rankedSubs = [...subs].sort((a, b) => (profile.channels.get(b.channel_id) ?? 0) - (profile.channels.get(a.channel_id) ?? 0)).filter((s) => !profile.muted.has(s.channel_id)).slice(0, 40);
	const localProgMap = getLocalProgress();
	const sortedHistory = [...history].sort((a, b) => {
		const timeA = a.watched_at ? new Date(a.watched_at).getTime() : 0;
		const timeB = b.watched_at ? new Date(b.watched_at).getTime() : 0;
		const durA = a.duration || 0;
		const progA = localProgMap[a.video_id] ?? (a.progress || 0);
		const ratioA = durA > 0 ? progA / durA : 0;
		const durB = b.duration || 0;
		const progB = localProgMap[b.video_id] ?? (b.progress || 0);
		const ratioB = durB > 0 ? progB / durB : 0;
		const prefA = ratioA >= .4 ? 1 : 0;
		const prefB = ratioB >= .4 ? 1 : 0;
		if (prefA !== prefB) return prefB - prefA;
		return timeB - timeA;
	});
	const historySeeds = [];
	const seenSeeds = /* @__PURE__ */ new Set();
	for (const h of sortedHistory) if (h.video_id && !seenSeeds.has(h.video_id)) {
		seenSeeds.add(h.video_id);
		historySeeds.push(h.video_id);
		if (historySeeds.length >= 10) break;
	}
	const seeds = [.../* @__PURE__ */ new Set([...historySeeds, ...likedIds.slice(0, 5)])];
	const rawSearches = searches.length > 0 ? searches : JSON.parse(typeof localStorage !== "undefined" && localStorage.getItem("yt.searches") || "[]");
	const searchQueries = [];
	const seenQ = /* @__PURE__ */ new Set();
	for (const s of rawSearches) {
		const q = typeof s === "string" ? s.trim() : "";
		if (q && !seenQ.has(q.toLowerCase())) {
			seenQ.add(q.toLowerCase());
			searchQueries.push(q);
			if (searchQueries.length >= 3) break;
		}
	}
	const bestBigram = profile.topInterests.find((t) => t.includes(" "));
	if (bestBigram && !seenQ.has(bestBigram.toLowerCase())) searchQueries.push(bestBigram);
	const queries = searchQueries;
	const res = await homeCandidates({
		channelIds: rankedSubs.map((s) => s.channel_id),
		seedVideoIds: seeds,
		queries
	});
	res.subs.forEach((v) => addCandidate(pool, v, "sub"));
	res.related.forEach((v) => addCandidate(pool, v, "related"));
	res.relatedIds.forEach((id) => relatedIds.add(id));
	res.interest.forEach((v) => addCandidate(pool, v, "interest"));
	(profile.signalCount >= 15 ? res.trending.slice(0, 20) : res.trending).forEach((v) => addCandidate(pool, v, "trending"));
	return {
		pool,
		relatedIds,
		next: res.trendingNext,
		stats: res.stats || {
			sub: {
				ok: 0,
				fail: 0
			},
			related: {
				ok: 0,
				fail: 0
			},
			interest: {
				ok: 0,
				fail: 0
			},
			trending: {
				ok: 0,
				fail: 0
			}
		},
		errors: res.errors || []
	};
}
function rank(pool, profile, relatedIds) {
	const out = [];
	for (const [id, { video, sources }] of pool) {
		if (profile.watched.has(id)) continue;
		const chAff = channelAffinity(profile, video);
		if (chAff <= -.99) continue;
		const parts = {
			channel: Math.max(0, chAff) * WEIGHTS.channel,
			topic: topicMatch(profile, video) * WEIGHTS.topic,
			related: (relatedIds.has(id) ? 1 : 0) * WEIGHTS.related,
			freshness: freshness(ageDays(video.uploaded, video.uploadedDate)) * WEIGHTS.freshness,
			quality: qualityPrior(video) * WEIGHTS.quality,
			duration: durationFit(video, profile.preferredDuration) * WEIGHTS.duration
		};
		let score = Object.values(parts).reduce((a, b) => a + b, 0);
		if (chAff < 0) score += chAff * .25;
		if (isShortsVideo(video)) score *= profile.preferredDuration < 180 ? 1.05 : .7;
		if (sources.size > 1) score *= 1 + .08 * (sources.size - 1);
		out.push({
			id,
			title: video.title,
			score,
			parts,
			source: [...sources].join("+")
		});
	}
	return out.sort((a, b) => b.score - a.score);
}
function getSessionSeed() {
	try {
		const key = "yt.sessionSeed";
		const seedStr = sessionStorage.getItem(key);
		if (!seedStr) {
			const newSeed = Math.floor(Math.random() * 2147483647) + 1;
			sessionStorage.setItem(key, String(newSeed));
			return newSeed;
		}
		const n = parseInt(seedStr, 10);
		return Number.isFinite(n) && n > 0 ? n : 123456789;
	} catch {
		return 123456789;
	}
}
function createSeededRandom(initialSeed) {
	let s = initialSeed;
	return function next() {
		s |= 0;
		s = s + 1831565813 | 0;
		let t = Math.imul(s ^ s >>> 15, 1 | s);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function diversify(scored, pool, size) {
	const picked = [];
	const perChannel = /* @__PURE__ */ new Map();
	const skipped = [];
	const channelOf = (id) => channelIdFromUrl(pool.get(id)?.video.uploaderUrl || "") || `unknown:${id}`;
	const exploreSlots = Math.round(size * EXPLORE_RATIO);
	const rankedSlots = size - exploreSlots;
	for (const item of scored) {
		if (picked.length >= rankedSlots) break;
		const ch = channelOf(item.id);
		const used = perChannel.get(ch) || 0;
		if (used >= (picked.length < 12 ? MAX_PER_CHANNEL_TOP : MAX_PER_CHANNEL_TOTAL)) {
			skipped.push(item);
			continue;
		}
		perChannel.set(ch, used + 1);
		picked.push(item);
	}
	const rng = createSeededRandom(getSessionSeed());
	const tail = scored.slice(rankedSlots, rankedSlots + 120).concat(skipped);
	for (let i = 0; i < exploreSlots && tail.length > 0; i++) {
		const idx = Math.floor(rng() * tail.length);
		const [item] = tail.splice(idx, 1);
		const ch = channelOf(item.id);
		if ((perChannel.get(ch) || 0) >= MAX_PER_CHANNEL_TOTAL) continue;
		perChannel.set(ch, (perChannel.get(ch) || 0) + 1);
		const maxInsert = Math.max(1, picked.length - 5);
		const insertPos = Math.floor(rng() * maxInsert) + 5;
		picked.splice(Math.min(insertPos, picked.length), 0, item);
	}
	return picked.slice(0, size);
}
async function buildHomeFeed(subs, history, likedIds = [], options = {}) {
	const buildStart = Date.now();
	const { progress = {}, searches = [], dismissed = getDismissed(), size = FEED_SIZE } = options;
	const profile = buildTasteProfile({
		history,
		progress,
		likedIds,
		subs,
		searches,
		dismissed
	});
	lastProfile = profile;
	lastWatched = new Set(profile.watched);
	const signalCount = profile.signalCount;
	const topChannels = [...profile.channels.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
	console.info("[feed] profile", {
		signalCount,
		muted: profile.muted.size,
		topChannels,
		topInterests: profile.topInterests
	});
	if (profile.signalCount < 5) {
		const page = await trendingPaged();
		const pool = /* @__PURE__ */ new Map();
		page.items.forEach((v) => addCandidate(pool, v, "trending"));
		await Promise.allSettled(subs.slice(0, 10).map(async (s) => {
			(await channelFeed(s.channel_id) || []).slice(0, 5).forEach((v) => addCandidate(pool, v, "sub"));
		}));
		const all = [...pool.values()].map((c) => c.video);
		const videos = all.slice(0, size);
		updateFeedDiagnostics({
			builtAt: Date.now(),
			buildMs: Date.now() - buildStart,
			stats: {
				sub: {
					ok: subs.length ? 1 : 0,
					fail: 0
				},
				related: {
					ok: 0,
					fail: 0
				},
				interest: {
					ok: 0,
					fail: 0
				},
				trending: {
					ok: page.items.length ? 1 : 0,
					fail: 0
				}
			},
			errors: [],
			signalCount: profile.signalCount,
			coldStart: true,
			mutedCount: profile.muted.size,
			poolSize: pool.size,
			finalCount: videos.length,
			top20: []
		});
		return {
			videos,
			reserve: all.slice(size),
			coldStart: true,
			next: page.next
		};
	}
	const { pool, relatedIds, next, stats, errors } = await generateCandidates(profile, subs, history, likedIds, searches);
	const finalItems = diversify(rank(pool, profile, relatedIds), pool, size * 4);
	const allVideos = finalItems.map((i) => pool.get(i.id)?.video).filter((v) => Boolean(v));
	const videos = allVideos.slice(0, size);
	const reserve = allVideos.slice(size);
	if (videos.length < 10) {
		const have = new Set(videos.map((v) => videoIdFromUrl(v.url)));
		for (const { video } of pool.values()) {
			if (videos.length >= size) break;
			const id = videoIdFromUrl(video.url);
			if (id && !have.has(id) && !profile.watched.has(id)) {
				videos.push(video);
				have.add(id);
			}
		}
	}
	updateFeedDiagnostics({
		builtAt: Date.now(),
		buildMs: Date.now() - buildStart,
		stats,
		errors,
		signalCount: profile.signalCount,
		coldStart: false,
		mutedCount: profile.muted.size,
		poolSize: pool.size,
		finalCount: videos.length,
		top20: (finalItems || []).slice(0, 20).map((item) => ({
			id: item.id,
			title: item.title,
			score: item.score,
			parts: item.parts,
			source: item.source
		}))
	});
	return {
		videos,
		reserve,
		coldStart: false,
		next,
		debug: finalItems
	};
}
async function rerankUnseenWithAI(feedResult, profile, aiPrompt) {
	if (!feedResult.debug || feedResult.debug.length === 0) return feedResult;
	if (feedResult.videos.length <= 8) return feedResult;
	const visibleHead = feedResult.videos.slice(0, 8);
	const headIds = new Set(visibleHead.map((v) => videoIdFromUrl(v.url)).filter(Boolean));
	const unseenScored = feedResult.debug.filter((item) => !headIds.has(item.id));
	if (unseenScored.length <= 4) return feedResult;
	try {
		const { aiRerank } = await import("./aiAlgorithm-BgK58VtT.mjs");
		const pool = /* @__PURE__ */ new Map();
		[...feedResult.videos, ...feedResult.reserve].forEach((v) => {
			const id = videoIdFromUrl(v.url);
			if (id) pool.set(id, {
				video: v,
				sources: /* @__PURE__ */ new Set(["ai"])
			});
		});
		const rerankedVideos = (await aiRerank({
			scored: unseenScored,
			pool,
			summary: profileSummary(profile),
			userPrompt: aiPrompt
		})).map((item) => pool.get(item.id)?.video).filter((v) => Boolean(v));
		const newVideos = [...visibleHead, ...rerankedVideos.slice(0, feedResult.videos.length - 8)];
		const newReserve = rerankedVideos.slice(feedResult.videos.length - 8);
		return {
			...feedResult,
			videos: newVideos,
			reserve: newReserve,
			debug: feedResult.debug
		};
	} catch {
		return feedResult;
	}
}
function rankIncoming(items) {
	if (!lastProfile) return items;
	const profile = lastProfile;
	const scored = [];
	for (const video of items) {
		const id = videoIdFromUrl(video.url);
		if (id && (lastWatched.has(id) || profile.watched.has(id))) continue;
		const chId = channelIdFromUrl(video.uploaderUrl || "");
		if (chId && profile.muted.has(chId)) continue;
		const chAff = channelAffinity(profile, video);
		if (chAff <= -.99) continue;
		const parts = {
			channel: Math.max(0, chAff) * WEIGHTS.channel,
			topic: topicMatch(profile, video) * WEIGHTS.topic,
			related: 0,
			freshness: freshness(ageDays(video.uploaded, video.uploadedDate)) * WEIGHTS.freshness,
			quality: qualityPrior(video) * WEIGHTS.quality,
			duration: durationFit(video, profile.preferredDuration) * WEIGHTS.duration
		};
		let score = Object.values(parts).reduce((a, b) => a + b, 0);
		if (chAff < 0) score += chAff * .25;
		if (isShortsVideo(video)) score *= profile.preferredDuration < 180 ? 1.05 : .7;
		scored.push({
			video,
			score
		});
	}
	return scored.sort((a, b) => b.score - a.score).map((s) => s.video);
}
async function buildSubscriptionsFeed(subs) {
	if (subs.length === 0) return [];
	const pool = /* @__PURE__ */ new Map();
	const targetSubs = subs.slice(0, 40);
	const limit = 6;
	let index = 0;
	async function worker() {
		while (index < targetSubs.length) {
			const s = targetSubs[index++];
			try {
				(await channelFeed(s.channel_id) || []).forEach((v) => {
					const id = videoIdFromUrl(v.url);
					if (id && !pool.has(id)) pool.set(id, v);
				});
			} catch {}
		}
	}
	await Promise.all(Array.from({ length: Math.min(limit, targetSubs.length) }, () => worker()));
	return [...pool.values()].sort((a, b) => ageDays(a.uploaded, a.uploadedDate) - ageDays(b.uploaded, b.uploadedDate));
}
/**
* On-screen inspector: shows the raw JSON bodies and Feed Diagnostics.
*/
function DebugPanel() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("feed");
	const [entries, setEntries] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)(0);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [feedDiag, setFeedDiag] = (0, import_react.useState)(lastFeedDiagnostics);
	(0, import_react.useEffect)(() => {
		setEntries(getDebug());
		return subscribeDebug(() => {
			setEntries(getDebug());
			setSelected(0);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		setFeedDiag(lastFeedDiagnostics);
		return subscribeFeedDiagnostics((d) => {
			setFeedDiag(d);
		});
	}, []);
	const entry = entries[selected];
	const copy = async () => {
		const textToCopy = tab === "feed" ? feedDiag ? JSON.stringify(feedDiag, null, 2) : "" : entry ? entry.body : "";
		if (!textToCopy) return;
		try {
			await navigator.clipboard.writeText(textToCopy);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1500);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed end-4 bottom-20 md:bottom-4 z-[95] flex flex-col items-end gap-2",
		children: [open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "dropdown-in w-[min(640px,94vw)] max-h-[75vh] flex flex-col rounded-xl border border-yt-border bg-[#0a0a0a]/97 backdrop-blur shadow-2xl shadow-black/70 overflow-hidden text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 px-3 py-2 border-b border-yt-border shrink-0 bg-yt-raised/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bug, { className: "w-4 h-4 text-yt-blue" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-bold",
						children: "لوحة التصحيح (Debug)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ms-2 flex items-center bg-yt-surface rounded-lg p-0.5 border border-yt-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setTab("feed"),
							className: `flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${tab === "feed" ? "bg-yt-blue text-black font-bold" : "text-yt-sub hover:text-yt-text"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تشخيص الفيد" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setTab("api"),
							className: `flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${tab === "api" ? "bg-yt-blue text-black font-bold" : "text-yt-sub hover:text-yt-text"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, { className: "w-3.5 h-3.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "استجابات API" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] opacity-75 font-mono",
									children: [
										"(",
										entries.length,
										")"
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ms-auto flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: copy,
								disabled: tab === "feed" ? !feedDiag : !entry,
								className: "w-7 h-7 rounded-md hover:bg-yt-surface grid place-items-center text-yt-sub hover:text-yt-text disabled:opacity-40",
								"aria-label": "نسخ",
								title: "نسخ كـ JSON",
								children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-4 h-4 text-yt-blue" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-4 h-4" })
							}),
							tab === "api" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									clearDebug();
									setSelected(0);
								},
								className: "w-7 h-7 rounded-md hover:bg-yt-surface grid place-items-center text-yt-sub hover:text-red-400",
								"aria-label": "مسح",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setOpen(false),
								className: "w-7 h-7 rounded-md hover:bg-yt-surface grid place-items-center",
								"aria-label": "إغلاق",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4" })
							})
						]
					})
				]
			}), tab === "feed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-auto p-3 space-y-4",
				children: !feedDiag ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-8 text-center text-yt-sub",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "لم يتم بناء الفيد بعد في هذه الجلسة." })
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2 rounded-lg bg-yt-surface/60 border border-yt-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-yt-sub",
										children: "وقت البناء"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono font-bold text-yt-text",
										children: new Date(feedDiag.builtAt).toLocaleTimeString()
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-yt-sub/70 font-mono",
										children: [feedDiag.buildMs, " ms"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2 rounded-lg bg-yt-surface/60 border border-yt-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-yt-sub",
										children: "طبيعة الفيد"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-bold",
										children: feedDiag.coldStart ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-amber-400",
											children: "Cold Start (شائع)"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-400",
											children: "مخصص بالكامل"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-yt-sub/70 font-mono",
										children: [feedDiag.signalCount, " إشارة تفاعل"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2 rounded-lg bg-yt-surface/60 border border-yt-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-yt-sub",
										children: "حجم المجمع / الناتج"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-mono font-bold text-yt-text",
										children: [
											feedDiag.poolSize,
											" مرشح ← ",
											feedDiag.finalCount
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-yt-sub/70 font-mono",
										children: ["مكتوم: ", feedDiag.mutedCount]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2 rounded-lg bg-yt-surface/60 border border-yt-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-yt-sub",
									children: "سلامة المصادر"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold",
									children: feedDiag.errors.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-red-400",
										children: [feedDiag.errors.length, " أخطاء"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-emerald-400",
										children: "سليمة 100%"
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-yt-border overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-3 py-1.5 bg-yt-raised font-bold text-[11px] flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "حالة مصادر الفيد" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-yt-sub font-mono font-normal",
								children: "sub / related / interest / trending"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-right border-collapse text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-yt-border bg-yt-surface/40 text-yt-sub font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 text-right",
										children: "المصدر"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 text-center",
										children: "ناجح (OK)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 text-center",
										children: "فاشل (Fail)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-2 text-center",
										children: "الحالة"
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-yt-border/50 font-mono",
								children: [
									{
										key: "sub",
										label: "الاشتراكات (sub)",
										data: feedDiag.stats.sub
									},
									{
										key: "related",
										label: "فيديوهات مرتبطة (related)",
										data: feedDiag.stats.related
									},
									{
										key: "interest",
										label: "اهتمامات وبحث (interest)",
										data: feedDiag.stats.interest
									},
									{
										key: "trending",
										label: "الشائع (trending)",
										data: feedDiag.stats.trending
									}
								].map((row) => {
									const isOk = row.data.fail === 0 && row.data.ok > 0;
									const isFail = row.data.fail > 0;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-yt-raised/20",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 font-sans font-medium text-yt-text",
												children: row.label
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 text-center text-emerald-400 font-bold",
												children: row.data.ok
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 text-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: row.data.fail > 0 ? "text-red-400 font-bold" : "text-yt-sub",
													children: row.data.fail
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 text-center font-sans",
												children: isFail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-300",
													children: "تنبيه"
												}) : isOk ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300",
													children: "شغال"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-1.5 py-0.5 rounded text-[10px] bg-yt-surface text-yt-sub",
													children: "غير مستخدم"
												})
											})
										]
									}, row.key);
								})
							})]
						})]
					}),
					feedDiag.errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-red-500/40 bg-red-950/20 p-2.5 space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-bold text-red-400 flex items-center gap-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⚠️ رسائل أخطاء المصادر (أول 5):" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1",
							children: feedDiag.errors.map((err, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[11px] text-red-300/90 bg-black/40 px-2 py-1 rounded break-all",
								dir: "ltr",
								children: err
							}, i))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-yt-border overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "px-3 py-1.5 bg-yt-raised font-bold text-[11px] flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "أول 20 فيديو مرشح وأسباب ترشيحها (Top 20 Debug)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-yt-sub font-mono font-normal",
								children: "Score & Parts Breakdown"
							})]
						}), feedDiag.top20 && feedDiag.top20.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-right border-collapse text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-yt-border bg-yt-surface/40 text-yt-sub font-medium",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 text-center w-8",
											children: "#"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 text-right min-w-[180px]",
											children: "الفيديو"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 text-center w-24",
											children: "المصدر"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 text-center w-16",
											children: "الدرجة"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2 text-right min-w-[200px]",
											children: "تفاصيل النقاط (Parts)"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-yt-border/50",
									children: feedDiag.top20.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-yt-raised/20",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 text-center text-yt-sub font-mono",
												children: idx + 1
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 font-medium text-yt-text max-w-[220px] truncate",
												title: item.title,
												children: item.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 text-center font-mono",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-1.5 py-0.5 rounded bg-yt-surface text-[10px] text-yt-blue border border-yt-border",
													children: item.source
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 text-center font-mono font-bold text-amber-300",
												children: item.score.toFixed(2)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2 font-mono text-[10px] text-yt-sub",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex flex-wrap gap-1",
													children: Object.entries(item.parts || {}).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "px-1 py-0.5 rounded bg-black/40 border border-yt-border/40 text-yt-sub",
														children: [
															k.slice(0, 3),
															": ",
															v.toFixed(2)
														]
													}, k))
												})
											})
										]
									}, item.id + idx))
								})]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "p-4 text-center text-yt-sub",
							children: "لا توجد تفاصيل مرشحات مسجلة (Cold Start)"
						})]
					})
				] })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [entries.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar border-b border-yt-border shrink-0",
				children: entries.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setSelected(i),
					className: `shrink-0 text-[11px] font-mono px-2.5 py-1 rounded-md border transition-colors ${i === selected ? "bg-yt-blue/15 border-yt-blue/50 text-yt-blue" : "border-yt-border text-yt-sub hover:text-yt-text"}`,
					dir: "ltr",
					children: e.label
				}, e.at + e.path))
			}), entry ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-3 py-1.5 text-[11px] font-mono text-yt-sub bg-yt-raised/50 shrink-0 flex items-center gap-3",
				dir: "ltr",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: entry.label.includes("فشل") ? "text-red-400 font-bold" : "text-emerald-400 font-bold",
						children: entry.label.includes("فشل") ? "ERR" : "200"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-yt-blue",
						children: "GET"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: entry.path
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "ms-auto shrink-0 text-yt-sub/70",
						children: [
							(entry.body.length / 1024).toFixed(1),
							" KB ·",
							" ",
							new Date(entry.at).toLocaleTimeString()
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				dir: "ltr",
				className: `flex-1 overflow-auto p-3 text-[11px] leading-relaxed font-mono whitespace-pre-wrap break-all ${entry.label.includes("فشل") ? "text-red-300/90" : "text-emerald-300/90"}`,
				children: entry.label.includes("فشل") ? entry.body : pretty(entry.body)
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "p-6 text-center text-sm text-yt-sub",
				children: "لا توجد استجابات بعد — افتح فيديو أو صفحة قناة لالتقاطها"
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setOpen((o) => !o),
			className: `relative w-11 h-11 rounded-full border grid place-items-center shadow-lg shadow-black/50 transition-all active:scale-90 ${open ? "bg-yt-blue text-black border-yt-blue" : entries.length > 0 || feedDiag ? "bg-yt-raised border-yt-blue/60 text-yt-blue hover:text-yt-text" : "bg-yt-raised border-yt-border text-yt-sub hover:text-yt-text"}`,
			"aria-label": "صندوق تصحيح API",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bug, { className: "w-5 h-5" }), (entries.length > 0 || feedDiag?.errors && feedDiag.errors.length > 0) && !open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute -top-1 -end-1 min-w-4 h-4 px-1 rounded-full bg-yt-red text-[10px] font-bold grid place-items-center border-2 border-yt-bg",
				children: feedDiag?.errors && feedDiag.errors.length > 0 ? "!" : entries.length
			})]
		})]
	});
}
/** Pretty-print when valid JSON, fall back to the raw body otherwise. */
function pretty(body) {
	try {
		return JSON.stringify(JSON.parse(body), null, 2);
	} catch {
		return body;
	}
}
var LIBRARY_KEYS = [
	"السجل",
	"History",
	"المشاهدة لاحقاً",
	"Watch Later",
	"مقاطع أعجبتني",
	"Liked Videos",
	"قوائم التشغيل",
	"Playlists",
	"مقاطع الفيديو",
	"Your Videos",
	"الرائج",
	"Trending",
	"الموسيقى",
	"Music",
	"الألعاب",
	"Gaming",
	"الأخبار",
	"News",
	"الرياضة",
	"Sports"
];
function App() {
	const { lang, t, isAr } = useLanguage();
	const { user } = useAuth();
	const routerNav = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const urlSearch = useRouterState({ select: (s) => s.location.search });
	const urlVideoId = pathname === "/watch" ? String(urlSearch?.["v"] ?? "") : "";
	const urlSearchQ = typeof urlSearch?.["q"] === "string" ? urlSearch["q"] : void 0;
	const urlSearchId = typeof urlSearch?.["id"] === "string" ? urlSearch["id"] : void 0;
	const urlSearchK = typeof urlSearch?.["k"] === "string" ? urlSearch["k"] : void 0;
	typeof urlSearch?.["v"] === "string" && urlSearch["v"];
	const { route } = useAppStore();
	const setRoute = appStore$1.setRoute;
	const [mainDragY, setMainDragY] = (0, import_react.useState)(0);
	const [expanded, setExpanded] = (0, import_react.useState)(true);
	const [drawer, setDrawer] = (0, import_react.useState)(false);
	const [activeNav, setActiveNav] = (0, import_react.useState)("home");
	const [chip, setChip] = (0, import_react.useState)("All");
	const { searchQ, searchFilter, miniplayer } = useAppStore();
	const setSearchQ = (0, import_react.useCallback)((q) => appStore$1.setSearchQ(q), []);
	const setSearchFilter = (0, import_react.useCallback)((f) => appStore$1.setSearchFilter(f), []);
	(0, import_react.useCallback)((m) => appStore$1.setMiniplayer(m), []);
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [playlistDialogOpen, setPlaylistDialogOpen] = (0, import_react.useState)(false);
	const [playlistTargetVideo, setPlaylistTargetVideo] = (0, import_react.useState)(null);
	const [hidden, setHidden] = (0, import_react.useState)([]);
	const [shorts, setShorts] = (0, import_react.useState)(null);
	const [toast, setToast] = (0, import_react.useState)(null);
	const toastTimer = (0, import_react.useRef)(null);
	const [subs, setSubs] = (0, import_react.useState)([]);
	const [customPlaylists, setCustomPlaylists] = (0, import_react.useState)([]);
	const [history, setHistory] = (0, import_react.useState)([]);
	const [watchLater, setWatchLaterState] = (0, import_react.useState)([]);
	const [liked, setLikedState] = (0, import_react.useState)([]);
	const [signalsReady, setSignalsReady] = (0, import_react.useState)(false);
	const [importModalOpen, setImportModalOpen] = (0, import_react.useState)(false);
	const [feedAttempt, setFeedAttempt] = (0, import_react.useState)(0);
	const [feedFallbackBanner, setFeedFallbackBanner] = (0, import_react.useState)(false);
	const feedReserve = (0, import_react.useRef)([]);
	const loadMoreRef = (0, import_react.useRef)(null);
	const subsRef = (0, import_react.useRef)(subs);
	subsRef.current = subs;
	const historyRef = (0, import_react.useRef)(history);
	historyRef.current = history;
	const likedRef = (0, import_react.useRef)(liked);
	likedRef.current = liked;
	(0, import_react.useEffect)(() => {
		const THIRTY_MINUTES_MS = 18e5;
		const checkAgeAndRefresh = () => {
			try {
				const raw = localStorage.getItem("yt.homeFeedCache");
				if (raw) {
					const parsed = JSON.parse(raw);
					if (parsed && typeof parsed.at === "number") {
						if (Date.now() - parsed.at >= THIRTY_MINUTES_MS) setFeedAttempt((a) => a + 1);
					}
				}
			} catch {}
		};
		const interval = window.setInterval(checkAgeAndRefresh, 6e4);
		window.addEventListener("focus", checkAgeAndRefresh);
		return () => {
			window.clearInterval(interval);
			window.removeEventListener("focus", checkAgeAndRefresh);
		};
	}, []);
	const notify = (0, import_react.useCallback)((msg, durationMs = 2600) => {
		setToast(msg);
		if (toastTimer.current) window.clearTimeout(toastTimer.current);
		toastTimer.current = window.setTimeout(() => setToast(null), durationMs);
	}, []);
	(0, import_react.useEffect)(() => {
		setSignalsReady(false);
		fetchDismissed().catch(() => {});
		getCustomPlaylists().then(setCustomPlaylists).catch(() => {});
		fetchUserWatchLater().then(setWatchLaterState).catch(() => setWatchLaterState(getWatchLater()));
		const syncSubscriptions = getSubscriptions().then(setSubs).catch(() => {});
		const syncHistory = getHistory().then(setHistory).catch(() => {});
		const syncLiked = fetchUserLiked().then(setLikedState).catch(() => setLikedState(getLiked()));
		const syncProgress = fetchUserProgress().then((p) => {
			Object.entries(p).forEach(([id, time]) => {
				appStore$1.setPlaybackTime(id, time);
			});
		}).catch(() => {});
		Promise.allSettled([
			syncSubscriptions,
			syncHistory,
			syncLiked,
			syncProgress
		]).then(() => {
			setSignalsReady(true);
		});
		appStore$1.setBackgroundPlay(getBackgroundPlay());
	}, [user]);
	(0, import_react.useEffect)(() => {
		const handleSync = (e) => {
			const detail = e.detail;
			getSubscriptions().then(setSubs).catch(() => {});
			fetchUserLiked().then(setLikedState).catch(() => {});
			if (detail?.importedSubsCount && detail.importedSubsCount > 0) notify(isAr ? `تم استيراد ${detail.importedSubsCount} قناة من اشتراكاتك على يوتيوب بنجاح!` : `Successfully imported ${detail.importedSubsCount} channels from YouTube!`);
		};
		window.addEventListener("yt:subscriptions-synced", handleSync);
		return () => window.removeEventListener("yt:subscriptions-synced", handleSync);
	}, [isAr, notify]);
	(0, import_react.useEffect)(() => {
		const brand = "youtubiy";
		let title = brand;
		if (route.type === "watch" && route.video.title) title = route.video.title;
		else if (route.type === "channel") title = isAr ? "قناة" : "Channel";
		else if (route.type === "playlist") title = isAr ? "قائمة تشغيل" : "Playlist";
		else if (route.type === "subs") title = t("subscriptions");
		else if (route.type === "library") title = route.key;
		else if (route.type === "policies") title = isAr ? "الحقوق والسياسات" : "Terms & Policies";
		document.title = title === brand ? brand : `${title} - ${brand}`;
	}, [
		route,
		isAr,
		t,
		searchQ
	]);
	(0, import_react.useEffect)(() => {
		if (pathname === "/watch" && urlVideoId) {} else if (pathname === "/subscriptions") {
			if (route.type !== "subs") setRoute({ type: "subs" });
		} else if (pathname === "/library") {
			if (urlSearchK && (route.type !== "library" || route.key !== urlSearchK)) setRoute({
				type: "library",
				key: urlSearchK
			});
		} else if (pathname === "/shorts") {
			if (route.type !== "home") setRoute({ type: "home" });
			requestAnimationFrame(() => document.getElementById("shorts-shelf")?.scrollIntoView({ behavior: "smooth" }));
		} else if (pathname === "/") {
			if (route.type !== "home") setRoute({ type: "home" });
		} else if (pathname === "/channel") {
			if (urlSearchId && (route.type !== "channel" || route.id !== urlSearchId)) setRoute({
				type: "channel",
				id: urlSearchId
			});
		} else if (pathname === "/playlist") {
			if (urlSearchId && (route.type !== "playlist" || route.id !== urlSearchId)) setRoute({
				type: "playlist",
				id: urlSearchId
			});
		} else if (pathname === "/search") {
			if (urlSearchQ && urlSearchQ !== searchQ) setSearchQ(urlSearchQ);
			if (route.type !== "home") setRoute({ type: "home" });
		} else if (pathname === "/policies") {
			if (route.type !== "policies") setRoute({ type: "policies" });
		}
	}, [
		pathname,
		urlVideoId,
		urlSearchId,
		urlSearchK,
		urlSearchQ,
		setRoute,
		setSearchQ,
		route,
		searchQ
	]);
	const isFeedMode = route.type === "home" || route.type === "subs";
	const isSearchActive = searchQ.trim().length > 0;
	const feedQuery = isSearchActive ? searchQ.trim() : chip === "All" || chip === "الكل" || chip === "Trending" || chip === "الرائج" ? "" : TOPIC_QUERY[chip] || chip;
	const feedKind = isSearchActive ? "search" : chip === "All" || chip === "الكل" ? "home" : chip === "Trending" || chip === "الرائج" ? "trending" : "search";
	const feedQueryKey = (0, import_react.useMemo)(() => {
		if (route.type === "subs") return [
			"subs",
			subs.length,
			feedAttempt
		];
		if (feedKind === "home") return [
			"home-feed",
			user?.uid || "guest",
			feedAttempt
		];
		if (feedKind === "trending") return ["trending", feedAttempt];
		return [
			"search",
			feedQuery,
			feedAttempt
		];
	}, [
		route.type,
		feedKind,
		feedQuery,
		feedAttempt,
		user?.uid,
		subs.length
	]);
	const queryClient = useQueryClient();
	const { data: infiniteFeedData, fetchNextPage, hasNextPage, isFetchingNextPage, isError: feedErr, refetch: refetchFeed } = useInfiniteQuery({
		queryKey: feedQueryKey,
		enabled: isFeedMode && (feedKind !== "home" || signalsReady),
		initialPageParam: null,
		placeholderData: keepPreviousData,
		queryFn: async ({ pageParam }) => {
			if (route.type === "subs") return {
				items: await buildSubscriptionsFeed(subs),
				next: null,
				channels: [],
				playlists: []
			};
			if (feedKind === "home") if (pageParam === null) {
				const SIX_HOURS_MS = 216e5;
				let cachedVideos = null;
				try {
					const raw = localStorage.getItem("yt.homeFeedCache");
					if (raw) {
						const parsed = JSON.parse(raw);
						const expectedUid = user?.uid || "guest";
						if (parsed && parsed.uid === expectedUid && typeof parsed.at === "number" && Date.now() - parsed.at < SIX_HOURS_MS && Array.isArray(parsed.videos) && parsed.videos.length > 0) cachedVideos = parsed.videos.slice(0, 40);
					}
				} catch {}
				if (cachedVideos && cachedVideos.length > 0) return {
					items: cachedVideos,
					next: null,
					channels: [],
					playlists: []
				};
				return {
					items: [],
					next: null,
					channels: [],
					playlists: []
				};
			} else {
				if (feedReserve.current.length > 0) return {
					items: feedReserve.current.splice(0, 20),
					next: pageParam,
					channels: [],
					playlists: []
				};
				if (pageParam && pageParam !== "has_reserve") {
					const r = await trendingPaged(pageParam);
					return {
						items: rankIncoming(r.items),
						next: r.next,
						channels: [],
						playlists: []
					};
				}
				return {
					items: [],
					next: null,
					channels: [],
					playlists: []
				};
			}
			if (feedKind === "trending") {
				const r = await trendingPaged(pageParam);
				return {
					items: r.items,
					next: r.next,
					channels: [],
					playlists: []
				};
			}
			const r = await searchPaged(feedQuery, pageParam);
			return {
				items: r.items,
				next: r.next,
				channels: r.channels || [],
				playlists: r.playlists || []
			};
		},
		getNextPageParam: (lastPage) => {
			if (feedKind === "home") {
				if (feedReserve.current.length > 0) return lastPage.next ?? "has_reserve";
				return lastPage.next ?? void 0;
			}
			return lastPage.next ?? void 0;
		}
	});
	(0, import_react.useEffect)(() => {
		if (!isFeedMode || feedKind !== "home" || !signalsReady) return;
		let cancelled = false;
		(async () => {
			try {
				const searches = JSON.parse(localStorage.getItem("yt.searches") || "[]");
				const r = await buildHomeFeed(subsRef.current, historyRef.current, likedRef.current, {
					progress: getLocalProgress(),
					searches,
					dismissed: getDismissed()
				});
				if (cancelled) return;
				const diag = lastFeedDiagnostics;
				if (diag?.stats) {
					const totalAttempts = diag.stats.sub.ok + diag.stats.sub.fail + diag.stats.related.ok + diag.stats.related.fail + diag.stats.interest.ok + diag.stats.interest.fail + diag.stats.trending.ok + diag.stats.trending.fail;
					const totalFails = diag.stats.sub.fail + diag.stats.related.fail + diag.stats.interest.fail + diag.stats.trending.fail;
					if (totalAttempts > 0 && totalFails > totalAttempts / 2) setFeedFallbackBanner(true);
					else setFeedFallbackBanner(false);
				} else setFeedFallbackBanner(false);
				feedReserve.current = r.reserve || [];
				try {
					localStorage.setItem("yt.homeFeedCache", JSON.stringify({
						uid: user?.uid || "guest",
						at: Date.now(),
						videos: (r.videos || []).slice(0, 40)
					}));
				} catch {}
				const currentScroll = window.scrollY || document.documentElement.scrollTop;
				const currentRoute = appStore$1.getSnapshot().route;
				if (currentScroll < 300 && currentRoute.type === "home") {
					queryClient.setQueryData(feedQueryKey, (old) => {
						if (!old || !old.pages || old.pages.length === 0) return {
							pages: [{
								items: r.videos,
								next: r.next,
								channels: [],
								playlists: []
							}],
							pageParams: [null]
						};
						const newPages = [...old.pages];
						newPages[0] = {
							...newPages[0],
							items: r.videos,
							next: r.next
						};
						return {
							...old,
							pages: newPages
						};
					});
					requestAnimationFrame(() => {
						window.scrollTo({
							top: currentScroll,
							behavior: "instant"
						});
					});
				}
				if (r.videos && r.videos.length > 8 && lastProfile) {
					const reranked = await rerankUnseenWithAI(r, lastProfile);
					if (cancelled) return;
					if (reranked && reranked.videos) {
						feedReserve.current = reranked.reserve || [];
						try {
							localStorage.setItem("yt.homeFeedCache", JSON.stringify({
								uid: user?.uid || "guest",
								at: Date.now(),
								videos: (reranked.videos || []).slice(0, 40)
							}));
						} catch {}
						const scrollBeforeAI = window.scrollY || document.documentElement.scrollTop;
						const routeBeforeAI = appStore$1.getSnapshot().route;
						if (scrollBeforeAI < 300 && routeBeforeAI.type === "home") {
							queryClient.setQueryData(feedQueryKey, (old) => {
								if (!old || !old.pages || old.pages.length === 0) return old;
								const newPages = [...old.pages];
								newPages[0] = {
									...newPages[0],
									items: reranked.videos
								};
								return {
									...old,
									pages: newPages
								};
							});
							requestAnimationFrame(() => {
								window.scrollTo({
									top: scrollBeforeAI,
									behavior: "instant"
								});
							});
						}
					}
				}
			} catch (err) {
				pushDebug("فشل بناء الفيد", "home-feed/build", err instanceof Error ? err.stack || err.message : String(err));
				setFeedFallbackBanner(true);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [
		isFeedMode,
		feedKind,
		signalsReady,
		feedQueryKey,
		queryClient,
		user?.uid
	]);
	const feed = (0, import_react.useMemo)(() => {
		if (!isFeedMode) return null;
		if (feedKind === "home" && !signalsReady) return null;
		if (!infiniteFeedData) return null;
		const allItems = [];
		const seen = /* @__PURE__ */ new Set();
		for (const page of infiniteFeedData.pages) for (const v of page.items || []) if (v?.url && !seen.has(v.url)) {
			seen.add(v.url);
			allItems.push(v);
		}
		if (feedKind === "home" && allItems.length === 0) return null;
		return allItems;
	}, [
		isFeedMode,
		feedKind,
		signalsReady,
		infiniteFeedData
	]);
	const channels = (0, import_react.useMemo)(() => {
		return infiniteFeedData?.pages[0]?.channels || [];
	}, [infiniteFeedData]);
	const playlists = (0, import_react.useMemo)(() => {
		return infiniteFeedData?.pages[0]?.playlists || [];
	}, [infiniteFeedData]);
	const loadingMore = isFetchingNextPage;
	const hasMore = !!hasNextPage;
	const loadMore = (0, import_react.useCallback)(() => {
		if (hasNextPage && !isFetchingNextPage) fetchNextPage();
	}, [
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage
	]);
	(0, import_react.useEffect)(() => {
		const el = loadMoreRef.current;
		if (!el || !hasMore || !isFeedMode) return;
		const io = new IntersectionObserver((entries) => {
			if (entries.some((e) => e.isIntersecting)) loadMore();
		}, { rootMargin: "900px 0px" });
		io.observe(el);
		return () => io.disconnect();
	}, [
		hasMore,
		isFeedMode,
		loadMore
	]);
	const toggleLater = (id, video) => {
		if (video) setMeta(id, {
			title: video.title,
			uploaderName: video.uploaderName,
			thumbnail: video.thumbnail,
			duration: video.duration
		});
		setWatchLaterState((w) => {
			const has = w.includes(id);
			const next = has ? w.filter((x) => x !== id) : [...w, id];
			setWatchLater(next);
			syncWatchLaterToCloud(id, !has);
			notify(has ? t("removeFromWatchLater") : t("saveToWatchLater"));
			return next;
		});
	};
	const toggleLike = (id) => {
		setLikedState((l) => {
			const has = l.includes(id);
			const next = has ? l.filter((x) => x !== id) : [...l, id];
			setLiked(next);
			syncLikedToCloud(id, !has);
			return next;
		});
	};
	const doToggleSub = async (meta) => {
		if (subs.some((s) => s.channel_id === meta.channelId)) {
			await unsubscribe(meta.channelId);
			setSubs((s) => s.filter((x) => x.channel_id !== meta.channelId));
			notify(t("unsubscribedToast"));
		} else {
			await subscribe({
				channel_id: meta.channelId,
				channel_name: meta.name,
				channel_avatar_url: meta.avatar
			});
			setSubs((s) => [{
				channel_id: meta.channelId,
				channel_name: meta.name,
				channel_avatar_url: meta.avatar
			}, ...s]);
			notify(t("subscribedToast"));
		}
	};
	const minimizeVideo = () => {
		if (route.type === "watch") {
			const id = videoIdFromUrl(route.video.url);
			const time = (id ? appStore$1.getPlaybackTime(id) : 0) || 0;
			appStore$1.setMiniplayer({
				video: route.video,
				time
			});
			setRoute({ type: "home" });
			if (pathname !== "/") routerNav({ to: "/" });
		}
	};
	const handleSearch = (0, import_react.useCallback)((q) => {
		const currentRoute = appStore$1.getSnapshot().route;
		if (currentRoute.type === "watch") {
			const id = videoIdFromUrl(currentRoute.video.url);
			const time = (id ? appStore$1.getPlaybackTime(id) : 0) || 0;
			appStore$1.setMiniplayer({
				video: currentRoute.video,
				time
			});
		}
		appStore$1.setSearchQ(q);
		appStore$1.setSearchFilter("All");
		setRoute({ type: "home" });
		if (q.trim()) {
			const prev = JSON.parse(localStorage.getItem("yt.searches") || "[]");
			const next = [q.trim(), ...prev.filter((x) => x !== q.trim())].slice(0, 50);
			localStorage.setItem("yt.searches", JSON.stringify(next));
			routerNav({
				to: "/search",
				search: { q: q.trim() }
			});
		} else if (pathname !== "/") routerNav({ to: "/" });
		window.scrollTo({ top: 0 });
	}, [
		pathname,
		routerNav,
		setRoute
	]);
	const handleLiveSearch = (0, import_react.useCallback)((q) => {
		const snapshot = appStore$1.getSnapshot();
		if (q === snapshot.searchQ) return;
		if (snapshot.route.type === "watch") {
			const id = videoIdFromUrl(snapshot.route.video.url);
			const time = (id ? appStore$1.getPlaybackTime(id) : 0) || 0;
			appStore$1.setMiniplayer({
				video: snapshot.route.video,
				time
			});
		}
		appStore$1.setSearchQ(q);
		appStore$1.setSearchFilter("All");
		if (snapshot.route.type !== "home") setRoute({ type: "home" });
	}, [setRoute]);
	const expandMiniplayer = () => {
		if (!miniplayer) return;
		const v = miniplayer.video;
		const id = videoIdFromUrl(v.url);
		id && appStore$1.getPlaybackTime(id) || miniplayer.time;
		appStore$1.setMiniplayer(null);
		setRoute({
			type: "watch",
			video: v
		});
		if (id && id !== urlVideoId) routerNav({
			to: "/watch",
			search: { v: id }
		});
		window.scrollTo({ top: 0 });
	};
	const closeMiniplayer = () => {
		appStore$1.setMiniplayer(null);
	};
	const goHome = () => {
		if (route.type === "watch") {
			const id = videoIdFromUrl(route.video.url);
			const time = (id ? appStore$1.getPlaybackTime(id) : 0) || 0;
			appStore$1.setMiniplayer({
				video: route.video,
				time
			});
		}
		appStore$1.setSearchQ("");
		appStore$1.setSearchFilter("All");
		setChip("All");
		setRoute({ type: "home" });
		setActiveNav("home");
		setFeedAttempt((a) => a + 1);
		if (pathname !== "/") routerNav({ to: "/" });
		window.scrollTo({ top: 0 });
	};
	const [topRecommendedVideo, setTopRecommendedVideo] = (0, import_react.useState)(null);
	const [autoplayCountdown, setAutoplayCountdown] = (0, import_react.useState)(null);
	const countdownTimerRef = (0, import_react.useRef)(null);
	const shortsItems = (0, import_react.useMemo)(() => (feed || []).filter((v) => isShortsVideo(v)).slice(0, 10), [feed]);
	const openVideo = (0, import_react.useCallback)((v, forceWatch = false) => {
		if (countdownTimerRef.current) {
			clearInterval(countdownTimerRef.current);
			countdownTimerRef.current = null;
		}
		setAutoplayCountdown(null);
		const id = videoIdFromUrl(v.url);
		if (!id) return;
		if (!forceWatch && isShortsVideo(v)) {
			const idx = shortsItems.findIndex((s) => videoIdFromUrl(s.url) === id);
			if (idx !== -1) setShorts({
				items: shortsItems,
				index: idx
			});
			else setShorts({
				items: [v],
				index: 0
			});
			return;
		}
		setShorts(null);
		appStore$1.setMiniplayer(null);
		setRoute({
			type: "watch",
			video: v
		});
		if (id !== urlVideoId) routerNav({
			to: "/watch",
			search: { v: id }
		});
		window.scrollTo({ top: 0 });
	}, [
		shortsItems,
		urlVideoId,
		routerNav
	]);
	const cancelAutoplay = () => {
		if (countdownTimerRef.current) {
			clearInterval(countdownTimerRef.current);
			countdownTimerRef.current = null;
		}
		setAutoplayCountdown(null);
	};
	const playAutoplayNow = () => {
		if (!autoplayCountdown) return;
		const { nextVideo, fromQueue } = autoplayCountdown;
		if (countdownTimerRef.current) {
			clearInterval(countdownTimerRef.current);
			countdownTimerRef.current = null;
		}
		setAutoplayCountdown(null);
		if (fromQueue) appStore$1.advanceQueue();
		openVideo(nextVideo);
	};
	const handleVideoEnded = (0, import_react.useCallback)(() => {
		const storeState = appStore$1.getSnapshot();
		if (!storeState.autoplayNext) return;
		let nextVid = null;
		let fromQueue = false;
		if (storeState.queue && storeState.queue.length > 0 && storeState.queueIndex + 1 < storeState.queue.length) {
			nextVid = storeState.queue[storeState.queueIndex + 1];
			fromQueue = true;
		} else if (topRecommendedVideo) {
			nextVid = topRecommendedVideo;
			fromQueue = false;
		}
		if (!nextVid) return;
		if (countdownTimerRef.current) {
			clearInterval(countdownTimerRef.current);
			countdownTimerRef.current = null;
		}
		setAutoplayCountdown({
			nextVideo: nextVid,
			secondsLeft: 5,
			fromQueue
		});
		countdownTimerRef.current = window.setInterval(() => {
			setAutoplayCountdown((prev) => {
				if (!prev) {
					if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
					return null;
				}
				if (prev.secondsLeft <= 1) {
					if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
					setTimeout(() => {
						if (prev.fromQueue) appStore$1.advanceQueue();
						openVideo(prev.nextVideo);
					}, 50);
					return null;
				}
				return {
					...prev,
					secondsLeft: prev.secondsLeft - 1
				};
			});
		}, 1e3);
	}, [topRecommendedVideo, openVideo]);
	(0, import_react.useEffect)(() => {
		if (urlVideoId) {
			const curMini = appStore$1.getSnapshot().miniplayer;
			if (curMini && videoIdFromUrl(curMini.video.url) === urlVideoId) appStore$1.setMiniplayer(null);
			let alive = true;
			setRoute((r) => {
				if (r.type === "watch" && videoIdFromUrl(r.video.url) === urlVideoId) return r;
				return {
					type: "watch",
					video: {
						url: `/watch?v=${urlVideoId}`,
						title: "",
						thumbnail: `https://i.ytimg.com/vi/${urlVideoId}/hqdefault.jpg`,
						uploaderName: "",
						duration: 0
					}
				};
			});
			getStreams(urlVideoId).then((d) => {
				if (!alive) return;
				setRoute((r) => {
					if (r.type !== "watch" || videoIdFromUrl(r.video.url) !== urlVideoId || r.video.title) return r;
					return {
						type: "watch",
						video: {
							...r.video,
							title: d.title,
							uploaderName: d.uploader,
							uploaderUrl: d.uploaderUrl,
							uploaderAvatar: d.uploaderAvatar,
							views: d.views
						}
					};
				});
			}).catch(() => {});
			return () => {
				alive = false;
			};
		} else setRoute((r) => {
			if (r.type !== "watch") return r;
			const id = videoIdFromUrl(r.video.url);
			const time = (id ? appStore$1.getPlaybackTime(id) : 0) || 0;
			appStore$1.setMiniplayer({
				video: r.video,
				time
			});
			return { type: "home" };
		});
	}, [urlVideoId, setRoute]);
	const openChannel = (raw) => {
		const id = channelIdFromUrl(raw) || raw;
		if (!id) return;
		setRoute({
			type: "channel",
			id
		});
		setActiveNav("");
		routerNav({
			to: "/channel",
			search: { id }
		});
		window.scrollTo({ top: 0 });
	};
	const openPlaylist = (id) => {
		if (!id) return;
		setRoute({
			type: "playlist",
			id
		});
		setActiveNav("");
		routerNav({
			to: "/playlist",
			search: { id }
		});
		window.scrollTo({ top: 0 });
	};
	(0, import_react.useEffect)(() => {
		const onOpen = (e) => openVideo(e.detail);
		const onNav = (e) => navigate(e.detail);
		const onAddToPlaylist = (e) => {
			setPlaylistTargetVideo(e.detail);
			setPlaylistDialogOpen(true);
		};
		window.addEventListener("yt:open", onOpen);
		window.addEventListener("yt:nav", onNav);
		window.addEventListener("yt:add-to-playlist", onAddToPlaylist);
		const onPlaylistUpdate = () => {
			getCustomPlaylists().then(setCustomPlaylists).catch(() => {});
		};
		window.addEventListener("yt:playlists-updated", onPlaylistUpdate);
		return () => {
			window.removeEventListener("yt:open", onOpen);
			window.removeEventListener("yt:nav", onNav);
			window.removeEventListener("yt:add-to-playlist", onAddToPlaylist);
			window.removeEventListener("yt:playlists-updated", onPlaylistUpdate);
		};
	}, []);
	const navigate = (label) => {
		if (label.startsWith("playlist:")) {
			openPlaylist(label.slice(9));
			return;
		}
		if (label.startsWith("channel:")) {
			if (route.type === "watch") {
				const id = videoIdFromUrl(route.video.url);
				const time = (id ? appStore$1.getPlaybackTime(id) : 0) || 0;
				appStore$1.setMiniplayer({
					video: route.video,
					time
				});
			}
			openChannel(label.slice(8));
			return;
		}
		if (label === "Settings" || label === "الإعدادات" || label === t("settings") || label.startsWith("Language:") || label.startsWith("اللغة:")) {
			setSettingsOpen(true);
			return;
		}
		if (route.type === "watch") {
			const id = videoIdFromUrl(route.video.url);
			const time = (id ? appStore$1.getPlaybackTime(id) : 0) || 0;
			appStore$1.setMiniplayer({
				video: route.video,
				time
			});
		}
		setActiveNav(label);
		if (label === "home" || label === t("home") || label === "الرئيسية" || label === "Home") {
			goHome();
			return;
		} else if (label === "Shorts" || label === t("shorts")) {
			setSearchQ("");
			routerNav({ to: "/shorts" });
			setRoute({ type: "home" });
			setChip("All");
			if (shortsItems.length > 0) setShorts({
				items: shortsItems,
				index: 0
			});
			else requestAnimationFrame(() => document.getElementById("shorts-shelf")?.scrollIntoView({ behavior: "smooth" }));
		} else if (label === "subscriptions" || label === t("subscriptions")) {
			setSearchQ("");
			routerNav({ to: "/subscriptions" });
			setRoute({ type: "subs" });
			window.scrollTo({ top: 0 });
		} else if (label === "policies" || label === "الحقوق والسياسات" || label === "Terms & Policies" || label === t("terms")) {
			setSearchQ("");
			routerNav({ to: "/policies" });
			setRoute({ type: "policies" });
			window.scrollTo({ top: 0 });
		} else if (LIBRARY_KEYS.includes(label)) {
			setSearchQ("");
			routerNav({
				to: "/library",
				search: { k: label }
			});
			setRoute({
				type: "library",
				key: label
			});
			window.scrollTo({ top: 0 });
		} else {
			if (pathname !== "/") routerNav({ to: "/" });
			notify(`«${label}»`);
		}
	};
	(0, import_react.useEffect)(() => {
		const onHist = (e) => {
			const row = e.detail;
			setHistory((h) => [row, ...h.filter((x) => x.video_id !== row.video_id)]);
		};
		window.addEventListener("yt:history", onHist);
		return () => window.removeEventListener("yt:history", onHist);
	}, []);
	const watchedSet = (0, import_react.useMemo)(() => new Set(history.map((h) => h.video_id)), [history]);
	const { filteredVideos, showChannelsInSearch, showPlaylistsInSearch } = (0, import_react.useMemo)(() => {
		if (!feed) return {
			filteredVideos: [],
			showChannelsInSearch: false,
			showPlaylistsInSearch: false
		};
		const dismissed = getDismissed();
		const unhidden = feed.filter((v) => {
			const vid = videoIdFromUrl(v.url);
			const chId = channelIdFromUrl(v.uploaderUrl || "");
			if (hidden.includes(vid)) return false;
			if (dismissed.videoIds.includes(vid)) return false;
			if (chId && dismissed.channelIds.includes(chId)) return false;
			return true;
		});
		if (!isSearchActive) return {
			filteredVideos: unhidden,
			showChannelsInSearch: false,
			showPlaylistsInSearch: false
		};
		let list = [...unhidden];
		let showChans = false;
		let showPlays = false;
		switch (searchFilter) {
			case "All":
				showChans = true;
				showPlays = true;
				break;
			case "Shorts":
				showChans = false;
				showPlays = false;
				list = list.filter((v) => isShortsVideo(v));
				break;
			case "Unwatched":
				showChans = false;
				showPlays = false;
				list = list.filter((v) => !watchedSet.has(videoIdFromUrl(v.url)));
				break;
			case "Watched":
				showChans = false;
				showPlays = false;
				list = list.filter((v) => watchedSet.has(videoIdFromUrl(v.url)));
				break;
			case "Videos":
				showChans = false;
				showPlays = false;
				list = list.filter((v) => isStandardVideo(v));
				break;
			case "Recently uploaded":
				showChans = true;
				showPlays = true;
				list.sort((a, b) => ageDays(a.uploaded, a.uploadedDate) - ageDays(b.uploaded, b.uploadedDate));
				break;
			case "Live":
				showChans = false;
				showPlays = false;
				list = list.filter((v) => isLiveStream(v));
		}
		return {
			filteredVideos: list,
			showChannelsInSearch: showChans,
			showPlaylistsInSearch: showPlays
		};
	}, [
		feed,
		hidden,
		isSearchActive,
		searchFilter,
		watchedSet
	]);
	const showShorts = route.type === "home" && (chip === "All" || chip === "الكل") && !isSearchActive && shortsItems.length > 0;
	const inWatch = route.type === "watch";
	const handleDismissVideo = async (videoId) => {
		setHidden((h) => [...h, videoId]);
		await dismissVideo(videoId);
		notify({
			message: isAr ? "تم إخفاء الفيديو" : "Video hidden",
			actionLabel: isAr ? "تراجع" : "Undo",
			onAction: async () => {
				setHidden((h) => h.filter((x) => x !== videoId));
				await undoDismiss(videoId);
				setFeedAttempt((a) => a + 1);
			}
		}, 6e3);
	};
	const handleDismissChannel = async (channelId) => {
		const videoIdsFromChannel = (feed || []).filter((v) => channelIdFromUrl(v.uploaderUrl || "") === channelId).map((v) => videoIdFromUrl(v.url)).filter(Boolean);
		setHidden((h) => [...h, ...videoIdsFromChannel]);
		await dismissChannel(channelId);
		notify({
			message: isAr ? "عدم اقتراح القناة" : "Won't recommend channel",
			actionLabel: isAr ? "تراجع" : "Undo",
			onAction: async () => {
				setHidden((h) => h.filter((x) => !videoIdsFromChannel.includes(x)));
				await undoDismiss(channelId);
				setFeedAttempt((a) => a + 1);
			}
		}, 6e3);
	};
	const cardProps = (v, i) => {
		const id = videoIdFromUrl(v.url);
		const channelId = channelIdFromUrl(v.uploaderUrl || "");
		return {
			video: v,
			onOpen: openVideo,
			index: i,
			notify,
			onChannel: openChannel,
			saved: watchLater.includes(id),
			onSaveLater: () => toggleLater(id, v),
			onDismiss: (vid) => handleDismissVideo(vid),
			onDismissChannel: channelId ? (chId) => handleDismissChannel(chId) : void 0,
			onAddToPlaylist: () => {
				setPlaylistTargetVideo(v);
				setPlaylistDialogOpen(true);
			}
		};
	};
	const first = filteredVideos.slice(0, 4);
	const rest = filteredVideos.slice(4);
	const searchFilterChips = (0, import_react.useMemo)(() => [
		{
			id: "All",
			label: isAr ? "الكل" : "All"
		},
		{
			id: "Shorts",
			label: "Shorts"
		},
		{
			id: "Unwatched",
			label: isAr ? "لم تتم مشاهدتها" : "Unwatched"
		},
		{
			id: "Watched",
			label: isAr ? "تمت مشاهدتها" : "Watched"
		},
		{
			id: "Videos",
			label: isAr ? "فيديوهات" : "Videos"
		},
		{
			id: "Recently uploaded",
			label: isAr ? "تم تحميلها مؤخراً" : "Recently uploaded"
		},
		{
			id: "Live",
			label: isAr ? "بث مباشر" : "Live"
		}
	], [isAr]);
	const homeCategoryChips = (0, import_react.useMemo)(() => [
		{
			id: "All",
			label: t("chipAll")
		},
		{
			id: "Trending",
			label: t("chipTrending")
		},
		{
			id: "Gaming",
			label: t("chipGaming")
		},
		{
			id: "Minecraft",
			label: t("chipMinecraft")
		},
		{
			id: "Technology",
			label: t("chipTechnology")
		},
		{
			id: "Cooking",
			label: t("chipCooking")
		},
		{
			id: "Travel",
			label: t("chipTravel")
		},
		{
			id: "Music",
			label: t("chipMusic")
		},
		{
			id: "Cars",
			label: t("chipCars")
		}
	], [t]);
	const emptyFilterMessage = (0, import_react.useMemo)(() => {
		if (!isSearchActive) return void 0;
		switch (searchFilter) {
			case "Shorts": return t("noShortsResults");
			case "Unwatched": return t("noUnwatchedResults");
			case "Watched": return t("noWatchedResults");
			case "Live": return t("noLiveResults");
			default: return `${t("noResults")} «${searchQ}»`;
		}
	}, [
		isSearchActive,
		searchFilter,
		searchQ,
		t
	]);
	const [playerBounds, setPlayerBounds] = (0, import_react.useState)({
		top: 0,
		left: 0,
		width: 0,
		height: 0,
		position: "fixed",
		visible: false
	});
	(typeof window !== "undefined" ? import_react.useLayoutEffect : import_react.useEffect)(() => {
		let ro = null;
		const update = () => {
			let targetId = "";
			if (route.type === "watch") targetId = "watch-player-slot";
			else if (miniplayer) targetId = "miniplayer-player-slot";
			if (!targetId) {
				setPlayerBounds((b) => b.visible ? {
					...b,
					visible: false
				} : b);
				return;
			}
			const el = document.getElementById(targetId);
			const rootEl = document.getElementById("app-root");
			if (el) {
				const rect = el.getBoundingClientRect();
				if (rect.width > 0 && rect.height > 0) {
					const isWatch = route.type === "watch";
					const rootRect = rootEl ? rootEl.getBoundingClientRect() : {
						top: 0,
						left: 0
					};
					const newTop = isWatch ? rect.top - rootRect.top : rect.top;
					const newLeft = isWatch ? rect.left - rootRect.left : rect.left;
					const newPos = isWatch ? "absolute" : "fixed";
					setPlayerBounds((prev) => {
						if (prev.visible && prev.position === newPos && Math.abs(prev.top - newTop) < 1 && Math.abs(prev.left - newLeft) < 1 && Math.abs(prev.width - rect.width) < 1 && Math.abs(prev.height - rect.height) < 1) return prev;
						return {
							top: newTop,
							left: newLeft,
							width: rect.width,
							height: rect.height,
							position: newPos,
							visible: true
						};
					});
				}
			}
		};
		update();
		const animId = requestAnimationFrame(update);
		const t1 = setTimeout(update, 100);
		const t2 = setTimeout(update, 350);
		const targetId = route.type === "watch" ? "watch-player-slot" : miniplayer ? "miniplayer-player-slot" : "";
		const el = targetId ? document.getElementById(targetId) : null;
		if (el && typeof ResizeObserver !== "undefined") {
			ro = new ResizeObserver(() => update());
			ro.observe(el);
		}
		window.addEventListener("resize", update);
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("yt:player-slot-move", update);
		return () => {
			cancelAnimationFrame(animId);
			clearTimeout(t1);
			clearTimeout(t2);
			if (ro) ro.disconnect();
			window.removeEventListener("resize", update);
			window.removeEventListener("scroll", update);
			window.removeEventListener("yt:player-slot-move", update);
		};
	}, [route, miniplayer]);
	const activeVideo = route.type === "watch" ? route.video : miniplayer?.video;
	const activeVideoId = activeVideo ? videoIdFromUrl(activeVideo.url) : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "app-root",
		className: "min-h-screen bg-yt-bg text-yt-text relative",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
				onToggleSidebar: () => inWatch || window.innerWidth < 768 ? setDrawer(true) : setExpanded((e) => !e),
				onHome: inWatch ? minimizeVideo : goHome,
				inWatch,
				onBack: inWatch ? minimizeVideo : goHome,
				searchQuery: searchQ,
				onSearch: handleSearch,
				onLiveSearch: handleLiveSearch,
				onOpenSettings: () => setSettingsOpen(true)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {
				expanded,
				pushable: !inWatch,
				active: activeNav,
				subs,
				customPlaylists,
				onNavigate: navigate,
				onHome: goHome,
				mobileOpen: drawer,
				onCloseMobile: () => setDrawer(false),
				onOpenSettings: () => setSettingsOpen(true)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				style: {
					transform: mainDragY > 0 ? `translate3d(0, ${mainDragY}px, 0)` : "none",
					transition: mainDragY > 0 ? "none" : "transform 0.2s ease-out"
				},
				className: `pt-14 transition-[margin] duration-200 ${inWatch ? "" : expanded ? "md:ms-60" : "md:ms-[72px]"} ${inWatch ? "" : "pb-20 md:pb-8"}`,
				children: [
					route.type === "watch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Watch, {
						video: route.video,
						onOpen: openVideo,
						onChannel: openChannel,
						notify,
						liked: liked.includes(videoIdFromUrl(route.video.url)),
						onToggleLike: () => toggleLike(videoIdFromUrl(route.video.url)),
						saved: watchLater.includes(videoIdFromUrl(route.video.url)),
						onToggleSave: () => toggleLater(videoIdFromUrl(route.video.url), route.video),
						onAddToPlaylist: (v) => {
							setPlaylistTargetVideo(v);
							setPlaylistDialogOpen(true);
						},
						isSubscribed: (cid) => subs.some((s) => s.channel_id === cid),
						onToggleSub: (m) => doToggleSub(m),
						onMinimize: minimizeVideo,
						startTime: appStore$1.getPlaybackTime(videoIdFromUrl(route.video.url)),
						onTopRecommendedChange: setTopRecommendedVideo
					}, route.video.url),
					route.type === "channel" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelPage, {
						channelId: route.id,
						onOpen: openVideo,
						notify,
						isSubscribed: subs.some((s) => s.channel_id === route.id),
						onToggleSub: doToggleSub,
						onDismiss: (id) => setHidden((h) => [...h, id]),
						onOpenShort: (items, index) => setShorts({
							items,
							index
						})
					}, route.id),
					route.type === "playlist" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaylistPage, {
						playlistId: route.id,
						onOpen: openVideo,
						onChannel: (id) => openChannel(id),
						notify,
						onDismiss: (id) => setHidden((h) => [...h, id]),
						isSaved: (id) => watchLater.includes(id),
						onSaveLater: toggleLater,
						onAddToPlaylist: (v) => {
							setPlaylistTargetVideo(v);
							setPlaylistDialogOpen(true);
						}
					}),
					route.type === "library" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryPage, {
						page: route.key,
						watchLater,
						liked,
						history: history.map((h) => h.video_id),
						onOpen: openVideo,
						onChannel: openChannel,
						notify,
						onDismiss: (id) => setHidden((h) => [...h, id]),
						onRemoveLater: (id) => {
							setWatchLaterState((w) => {
								const next = w.filter((x) => x !== id);
								setWatchLater(next);
								syncWatchLaterToCloud(id, false);
								return next;
							});
						},
						onClearHistory: () => {
							setHistory([]);
							clearHistory();
						},
						isSaved: (id) => watchLater.includes(id),
						onSaveLater: toggleLater,
						onAddToPlaylist: (v) => {
							setPlaylistTargetVideo(v);
							setPlaylistDialogOpen(true);
						}
					}),
					route.type === "policies" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoliciesPage, { onBackToHome: goHome }),
					isFeedMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-3 sm:px-6",
						children: [
							isSearchActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipsBar, {
								active: searchFilter,
								chips: searchFilterChips,
								onChange: (c) => setSearchFilter(c)
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChipsBar, {
								active: chip,
								chips: homeCategoryChips,
								onChange: (c) => {
									setChip(c);
									setSearchQ("");
								}
							}),
							!isSearchActive && route.type === "home" && subs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YouTubeSyncBanner, {}),
							feedErr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { onRetry: () => void refetchFeed() }) : feed === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonGrid, {}) : route.type === "subs" && subs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubscriptionsIcon, { className: "w-8 h-8" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-bold mb-1 text-yt-text",
										children: isAr ? "لا توجد قنوات في اشتراكاتك بعد" : "No subscribed channels yet"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-yt-sub mb-6 leading-relaxed",
										children: isAr ? "يمكنك استيراد قنواتك المفضلة من YouTube فوراً عبر ملف Google Takeout CSV أو لصق الروابط لتحديث خلاصتك هنا بكل سهولة." : "Import your favorite channels from YouTube via Google Takeout CSV or paste links to populate your feed here."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setImportModalOpen(true),
										className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-semibold transition-all shadow-lg shadow-red-600/20",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "استيراد اشتراكات YouTube (Google Takeout)" : "Import YouTube Subscriptions" })
									})
								]
							}) : filteredVideos.length === 0 && (!showChannelsInSearch || channels.length === 0) && (!showPlaylistsInSearch || playlists.length === 0) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { message: emptyFilterMessage }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								showChannelsInSearch && channels.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-6",
									children: channels.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChannelResultCard, {
										channel: c,
										onOpen: openChannel,
										subscribed: subs.some((s) => s.channel_id === c.id),
										onToggleSub: () => doToggleSub({
											channelId: c.id,
											name: c.name,
											avatar: c.avatar
										})
									}, c.id))
								}),
								showPlaylistsInSearch && playlists.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8 mb-8 mt-2",
									children: playlists.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaylistCard, {
										playlist: p,
										index: i,
										onOpen: () => openPlaylist(p.id)
									}, p.id))
								}),
								feedFallbackBanner && feedKind === "home" && !isSearchActive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-4 px-3.5 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-2 shadow-sm",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-amber-400 font-bold",
											children: "⚠️"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "تعذّر تخصيص الفيد، يُعرض محتوى عام" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8 mt-2",
									children: first.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, { ...cardProps(v, i) }, v.url))
								}),
								showShorts && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortsShelf, {
									items: shortsItems,
									onOpen: (i) => setShorts({
										items: shortsItems,
										index: i
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-8",
									children: rest.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, { ...cardProps(v, i + 4) }, v.url))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									ref: loadMoreRef,
									className: "h-24 flex items-center justify-center text-yt-sub",
									children: loadingMore ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-7 h-7 animate-spin" }) : hasMore ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => void loadMore(),
										className: "h-9 px-5 rounded-full bg-yt-surface hover:bg-yt-hover text-sm font-medium transition-colors",
										children: t("loadMore")
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs",
										children: t("endOfResults")
									})
								})
							] })
						]
					})
				]
			}),
			!inWatch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "md:hidden fixed bottom-0 inset-x-0 z-40 bg-yt-bg/95 backdrop-blur border-t border-yt-border flex items-stretch h-14 pb-[env(safe-area-inset-bottom)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomItem, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-6 h-6" }),
						label: t("home"),
						active: route.type === "home",
						onClick: goHome
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomItem, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortsIcon, { className: "w-6 h-6" }),
						label: t("shorts"),
						onClick: () => navigate("Shorts")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCreateOpen(true),
						className: "flex-1 grid place-items-center",
						"aria-label": t("create"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-11 h-8 rounded-xl bg-yt-surface hover:bg-yt-hover active:scale-90 transition-all grid place-items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-6 h-6" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomItem, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubscriptionsIcon, { className: "w-6 h-6" }),
						label: t("subscriptions"),
						active: route.type === "subs",
						onClick: () => navigate("subscriptions")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BottomItem, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListVideo, { className: "w-6 h-6" }),
						label: t("you"),
						active: route.type === "library",
						onClick: () => setDrawer(true)
					})
				]
			}),
			createOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-[60] flex items-end md:items-center md:justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 bg-black/60",
					onClick: () => setCreateOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "dropdown-in relative w-full md:w-80 bg-yt-raised rounded-t-2xl md:rounded-2xl border border-yt-border p-3 pb-6 md:pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-2 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display font-bold",
							children: t("create")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCreateOpen(false),
							className: "w-9 h-9 rounded-full hover:bg-yt-surface grid place-items-center",
							"aria-label": t("cancel"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						})]
					}), [
						{
							icon: Video,
							label: t("uploadVideo"),
							desc: isAr ? "شارك فيديو مع جمهورك" : "Share a video with your audience"
						},
						{
							icon: Radio,
							label: t("goLive"),
							desc: isAr ? "ابدأ البث الآن" : "Go live right now"
						},
						{
							icon: PenLine,
							label: t("createPost"),
							desc: isAr ? "تواصل مع المتابعين" : "Reach your subscribers"
						},
						{
							icon: UserRound,
							label: isAr ? "قصّة شورتس" : "Create Short",
							desc: isAr ? "سجّل لحظة قصيرة" : "Record a short clip"
						}
					].map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setCreateOpen(false);
							notify(isAr ? "هذه واجهة مشاهدة فقط — الرفع غير متاح" : "This is a player client — uploading is not enabled");
						},
						className: "w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-yt-surface text-start transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-10 h-10 rounded-full bg-yt-surface grid place-items-center shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(it.icon, { className: "w-5 h-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-sm",
							children: it.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-yt-sub",
							children: it.desc
						})] })]
					}, it.label))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsDialog, {
				open: settingsOpen,
				onClose: () => setSettingsOpen(false),
				notify,
				onOpenPolicies: () => navigate("policies"),
				onHistoryCleared: () => {
					setHistory([]);
					clearHistory();
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaylistDialog, {
				open: playlistDialogOpen,
				onClose: () => setPlaylistDialogOpen(false),
				video: playlistTargetVideo,
				notify
			}),
			shorts && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShortsViewer, {
				items: shorts.items,
				initialIndex: shorts.index,
				onClose: () => setShorts(null),
				onOpenWatch: (v) => openVideo(v, true)
			}),
			miniplayer && route.type !== "watch" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Miniplayer, {
				video: miniplayer.video,
				startTime: miniplayer.time,
				onExpand: expandMiniplayer,
				onClose: closeMiniplayer,
				onTimeUpdate: (t) => {
					const id = videoIdFromUrl(miniplayer.video.url);
					if (id) {
						appStore$1.setPlaybackTime(id, t);
						savePlaybackProgress(id, t);
					}
				}
			}),
			activeVideoId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "persistent-player",
				style: {
					position: playerBounds.position,
					top: playerBounds.top,
					left: playerBounds.left,
					width: playerBounds.width,
					height: playerBounds.height,
					zIndex: playerBounds.visible ? route.type === "watch" ? 20 : 50 : -1,
					pointerEvents: playerBounds.visible ? "auto" : "none",
					opacity: playerBounds.visible ? 1 : 0,
					transition: mainDragY > 0 ? "none" : "opacity 0.2s ease-out, transform 0.2s ease-out",
					transform: route.type === "watch" && mainDragY > 0 ? `translate3d(0, ${mainDragY}px, 0) scale(${1 - mainDragY * .0015})` : "none",
					backgroundColor: "black",
					overflow: "hidden"
				},
				className: route.type === "watch" ? "lg:rounded-xl" : "rounded-t-xl overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YouTubePlayer, {
					videoId: activeVideoId,
					autoplay: true,
					title: activeVideo?.title,
					startTime: appStore$1.getPlaybackTime(activeVideoId),
					onTimeUpdate: (t) => {
						appStore$1.setPlaybackTime(activeVideoId, t);
						savePlaybackProgress(activeVideoId, t);
					},
					onEnded: handleVideoEnded
				}), autoplayCountdown && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 text-white text-center animate-in fade-in duration-200 select-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-bold uppercase tracking-wider text-yt-sub mb-1",
							children: isAr ? "الفيديو التالي خلال" : "Up Next in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-4xl font-extrabold text-yt-blue font-mono mb-3",
							children: autoplayCountdown.secondsLeft
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 max-w-sm w-full bg-yt-surface/80 p-2.5 rounded-xl border border-yt-border/50 text-start mb-4 shadow-lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: autoplayCountdown.nextVideo.thumbnail || `https://i.ytimg.com/vi/${videoIdFromUrl(autoplayCountdown.nextVideo.url)}/mqdefault.jpg`,
								alt: autoplayCountdown.nextVideo.title,
								className: "w-20 aspect-video rounded object-cover shrink-0"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold line-clamp-2 leading-snug",
									children: autoplayCountdown.nextVideo.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-yt-sub mt-0.5 truncate",
									children: autoplayCountdown.nextVideo.uploaderName
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: cancelAutoplay,
								className: "px-4 py-2 rounded-full bg-yt-surface hover:bg-yt-hover text-xs font-bold transition-all active:scale-95 cursor-pointer",
								children: isAr ? "إلغاء" : "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: playAutoplayNow,
								className: "px-5 py-2 rounded-full bg-yt-blue text-black hover:bg-opacity-90 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 shadow-lg shadow-yt-blue/20 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-3.5 h-3.5 fill-current" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isAr ? "تشغيل الآن" : "Play now" })]
							})]
						})
					]
				})]
			}),
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed bottom-16 md:bottom-6 start-1/2 -translate-x-1/2 z-[70] bg-yt-raised border border-yt-border px-5 py-2.5 rounded-full shadow-2xl shadow-black text-sm font-medium flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: typeof toast === "string" ? toast : toast.message }), typeof toast !== "string" && toast.actionLabel && toast.onAction && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						toast.onAction?.();
						setToast(null);
						if (toastTimer.current) window.clearTimeout(toastTimer.current);
					},
					className: "text-yt-red hover:text-red-400 font-bold ms-2 focus:outline-none transition-colors",
					children: toast.actionLabel
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YouTubeImportModal, {
				isOpen: importModalOpen,
				onClose: () => setImportModalOpen(false),
				onImportSuccess: () => {
					getSubscriptions().then(setSubs).catch(() => {});
					setFeedAttempt((a) => a + 1);
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DebugPanel, {})
		]
	});
}
function BottomItem({ icon, label, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: `flex-1 flex flex-col items-center justify-center gap-1 text-[10px] transition-colors ${active ? "text-white font-bold" : "text-yt-sub"}`,
		children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "truncate max-w-[56px]",
			children: label
		})]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 p-4 bg-red-500/10 text-red-500 text-xs rounded text-left break-all font-mono",
					children: error?.message || String(error)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$9 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
			},
			{ title: "Youtubiy" },
			{
				name: "description",
				content: "YouTube client with background playback and search"
			},
			{
				name: "author",
				content: "Youtubiy"
			},
			{
				property: "og:title",
				content: "Youtubiy"
			},
			{
				property: "og:description",
				content: "YouTube client with background playback and search"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "theme-color",
				content: "#0f0f0f"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent"
			},
			{
				name: "apple-mobile-web-app-title",
				content: "Youtubiy"
			}
		],
		links: [
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "apple-touch-icon",
				href: "/favicon.svg"
			},
			{
				rel: "alternate icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			},
			{
				rel: "preconnect",
				href: "https://i.ytimg.com"
			},
			{
				rel: "preconnect",
				href: "https://yt3.ggpht.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&family=Cairo:wght@400;700;900&family=Tajawal:wght@400;500;700&display=swap"
			}
		],
		scripts: [{
			src: "https://accounts.google.com/gsi/client",
			async: true,
			defer: true
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		dir: "ltr",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
var defaultQueryClient = new QueryClient({ defaultOptions: { queries: {
	staleTime: 3e5,
	gcTime: 18e5,
	refetchOnWindowFocus: false,
	retry: 1
} } });
function RootComponent() {
	const queryClient = Route$9.useRouteContext()?.queryClient ?? defaultQueryClient;
	const { lang, dir } = useLanguage();
	(0, import_react.useEffect)(() => {
		document.documentElement.lang = lang;
		document.documentElement.dir = dir;
	}, [lang, dir]);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") registerSW({ immediate: true });
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})] })
	});
}
var $$splitComponentImporter$8 = () => import("./routes-DTEZEvkE.mjs");
var title$1 = "يوتيوب بالعربية — مشاهدة وبحث بدون إعلانات مزعجة";
var description$1 = "تصفّح الرائج، ابحث عن أي فيديو، شاهد الشورتس وتابع قنواتك المفضّلة بواجهة عربية سريعة بالكامل.";
var Route$8 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: title$1 },
		{
			name: "description",
			content: description$1
		},
		{
			property: "og:title",
			content: title$1
		},
		{
			property: "og:description",
			content: description$1
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./channel-D-0Zhfde.mjs");
var searchSchema$4 = objectType({ id: fallback(stringType(), "").default("") });
var Route$7 = createFileRoute("/channel")({
	validateSearch: zodValidator(searchSchema$4),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./library-DVrJhvoV.mjs");
var searchSchema$3 = objectType({ k: fallback(stringType(), "").default("") });
var Route$6 = createFileRoute("/library")({
	validateSearch: zodValidator(searchSchema$3),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./playlist-fUKWwgQi.mjs");
var searchSchema$2 = objectType({ id: fallback(stringType(), "").default("") });
var Route$5 = createFileRoute("/playlist")({
	validateSearch: zodValidator(searchSchema$2),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./policies-CGHFJokP.mjs");
var Route$4 = createFileRoute("/policies")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./search-BsvJ9jBD.mjs");
var searchSchema$1 = objectType({ q: fallback(stringType(), "").default("") });
var Route$3 = createFileRoute("/search")({
	validateSearch: zodValidator(searchSchema$1),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./shorts-CXha8EGO.mjs");
var Route$2 = createFileRoute("/shorts")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./subscriptions-DXheLhNI.mjs");
var Route$1 = createFileRoute("/subscriptions")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./watch-D2U1fl9G.mjs");
var title = "مشاهدة فيديو — يوتيوب بالعربية";
var description = "شغّل الفيديو بجودة عالية مع الاقتراحات والتعليقات بواجهة عربية سريعة.";
var searchSchema = objectType({ v: fallback(stringType(), "").default("") });
var Route = createFileRoute("/watch")({
	validateSearch: zodValidator(searchSchema),
	head: () => ({ meta: [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			property: "og:title",
			content: title
		},
		{
			property: "og:description",
			content: description
		},
		{
			property: "og:type",
			content: "video.other"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$8.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$9
	}),
	ChannelRoute: Route$7.update({
		id: "/channel",
		path: "/channel",
		getParentRoute: () => Route$9
	}),
	LibraryRoute: Route$6.update({
		id: "/library",
		path: "/library",
		getParentRoute: () => Route$9
	}),
	PlaylistRoute: Route$5.update({
		id: "/playlist",
		path: "/playlist",
		getParentRoute: () => Route$9
	}),
	PoliciesRoute: Route$4.update({
		id: "/policies",
		path: "/policies",
		getParentRoute: () => Route$9
	}),
	SearchRoute: Route$3.update({
		id: "/search",
		path: "/search",
		getParentRoute: () => Route$9
	}),
	ShortsRoute: Route$2.update({
		id: "/shorts",
		path: "/shorts",
		getParentRoute: () => Route$9
	}),
	SubscriptionsRoute: Route$1.update({
		id: "/subscriptions",
		path: "/subscriptions",
		getParentRoute: () => Route$9
	}),
	WatchRoute: Route.update({
		id: "/watch",
		path: "/watch",
		getParentRoute: () => Route$9
	})
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient({ defaultOptions: { queries: {
		staleTime: 3e5,
		gcTime: 18e5,
		refetchOnWindowFocus: false,
		retry: 1
	} } });
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
