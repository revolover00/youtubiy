import {
  Home,
  History,
  Clock,
  ThumbsUp,
  Download,
  ListVideo,
  UserRound,
  SquarePlay,
  ChevronDown,
  Flame,
  Music2,
  Gamepad2,
  Newspaper,
  Trophy,
  Settings,
  Flag,
  HelpCircle,
  X,
} from "lucide-react";
import { ShortsIcon, SubscriptionsIcon, LogoIcon } from "./icons";
import type { Subscription } from "../lib/types";

interface Props {
  expanded: boolean;
  pushable?: boolean;
  active: string;
  subs: Subscription[];
  onNavigate: (label: string) => void;
  onHome: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const MAIN = [
  { icon: Home, label: "الرئيسية" },
  { icon: ShortsIcon, label: "Shorts" },
  { icon: SubscriptionsIcon, label: "الاشتراكات" },
];

const YOU = [
  { icon: UserRound, label: "قناتك" },
  { icon: History, label: "السجل" },
  { icon: ListVideo, label: "قوائم التشغيل" },
  { icon: SquarePlay, label: "مقاطع الفيديو" },
  { icon: Clock, label: "المشاهدة لاحقاً" },
  { icon: ThumbsUp, label: "مقاطع أعجبتني" },
  { icon: Download, label: "التنزيلات" },
];

const EXPLORE = [
  { icon: Flame, label: "الرائج" },
  { icon: Music2, label: "الموسيقى" },
  { icon: Gamepad2, label: "الألعاب" },
  { icon: Newspaper, label: "الأخبار" },
  { icon: Trophy, label: "الرياضة" },
];

const SETTINGS = [
  { icon: Settings, label: "الإعدادات" },
  { icon: Flag, label: "الإبلاغ عن مشكلة" },
  { icon: HelpCircle, label: "المساعدة" },
];

function Item({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-5 px-3 h-10 rounded-lg text-sm transition-colors ${
        active ? "bg-yt-surface font-bold" : "hover:bg-yt-surface/70"
      }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );
}

function FullContent({ active, subs, onNavigate, onHome }: Pick<Props, "active" | "subs" | "onNavigate" | "onHome">) {
  return (
    <div className="px-3 pb-8">
      <div className="py-2">
        {MAIN.map((m) => (
          <Item
            key={m.label}
            icon={m.icon}
            label={m.label}
            active={active === m.label}
            onClick={() => {
              onNavigate(m.label);
              if (m.label === "الرئيسية") onHome();
            }}
          />
        ))}
      </div>

      <hr className="border-yt-border my-2" />

      <div className="py-1">
        <button className="flex items-center gap-1.5 px-3 h-9 text-[15px] font-bold">
          أنت
          <ChevronDown className="w-4 h-4" />
        </button>
        {YOU.map((y) => (
          <Item key={y.label} icon={y.icon} label={y.label} active={active === y.label} onClick={() => onNavigate(y.label)} />
        ))}
      </div>

      <hr className="border-yt-border my-2" />

      <div className="py-1">
        <h3 className="px-3 h-9 flex items-center text-[15px] font-bold">الاشتراكات</h3>
        {subs.length === 0 && (
          <p className="px-3 py-2 text-[13px] text-yt-sub">اشترك في قنوات لتظهر هنا</p>
        )}
        {subs.map((s) => (
          <button
            key={s.channel_id}
            onClick={() => onNavigate(`channel:${s.channel_id}`)}
            className="w-full flex items-center gap-5 px-3 h-10 rounded-lg text-sm hover:bg-yt-surface/70"
          >
            {s.channel_avatar_url ? (
              <img src={s.channel_avatar_url} alt={s.channel_name} referrerPolicy="no-referrer" className="w-6 h-6 rounded-full object-cover shrink-0 bg-yt-surface" />
            ) : (
              <span
                className="w-6 h-6 rounded-full grid place-items-center text-[11px] font-bold text-white shrink-0"
                style={{ background: `hsl(${[...s.channel_name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360} 55% 42%)` }}
              >
                {s.channel_name.charAt(0)}
              </span>
            )}
            <span className="truncate">{s.channel_name}</span>
          </button>
        ))}
      </div>

      <hr className="border-yt-border my-2" />

      <div className="py-1">
        <h3 className="px-3 h-9 flex items-center text-[15px] font-bold">استكشف</h3>
        {EXPLORE.map((e) => (
          <Item key={e.label} icon={e.icon} label={e.label} active={active === e.label} onClick={() => onNavigate(e.label)} />
        ))}
      </div>

      <hr className="border-yt-border my-2" />

      <div className="py-1">
        {SETTINGS.map((s) => (
          <Item key={s.label} icon={s.icon} label={s.label} onClick={() => onNavigate(s.label)} />
        ))}
      </div>

      <div className="px-3 pt-4 text-xs text-yt-sub leading-relaxed">
        <p className="font-bold text-[13px] text-yt-text/80 mb-2">نبذة</p>
        <p>الشروط · الخصوصية · السياسة والأمان</p>
        <p>كيف يعمل يوتيوب · اختبار الميزات الجديدة</p>
        <p className="mt-3">© 2026 Google LLC — واجهة تجريبية</p>
      </div>
    </div>
  );
}

export default function Sidebar({ expanded, pushable = true, active, subs, onNavigate, onHome, mobileOpen, onCloseMobile }: Props) {
  return (
    <>
      {/* desktop mini */}
      {pushable && !expanded && (
        <nav className="hidden md:flex fixed top-14 bottom-0 start-0 w-[72px] z-30 bg-yt-bg flex-col items-center pt-1 gap-1">
          {MAIN.map((m) => (
            <button
              key={m.label}
              onClick={() => {
                onNavigate(m.label);
                if (m.label === "الرئيسية") onHome();
              }}
              className={`w-16 py-3.5 rounded-xl flex flex-col items-center gap-1.5 text-[10px] transition-colors ${
                active === m.label ? "bg-yt-surface font-bold" : "hover:bg-yt-surface/70"
              }`}
            >
              <m.icon className="w-6 h-6" />
              {m.label === "Shorts" ? "شورتس" : m.label}
            </button>
          ))}
          <button
            onClick={() => onNavigate("قناتك")}
            className="w-16 py-3.5 rounded-xl flex flex-col items-center gap-1.5 text-[10px] hover:bg-yt-surface/70"
          >
            <UserRound className="w-6 h-6" />
            أنت
          </button>
        </nav>
      )}

      {/* desktop full */}
      {pushable && expanded && (
        <nav className="hidden md:block fixed top-14 bottom-0 start-0 w-60 z-30 bg-yt-bg overflow-y-auto">
          <FullContent active={active} subs={subs} onNavigate={onNavigate} onHome={onHome} />
        </nav>
      )}

      {/* drawer (mobile + watch overlay) */}
      <div
        className={`fixed inset-0 z-[55] transition-opacity duration-200 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/60" onClick={onCloseMobile} />
        <aside
          className={`absolute top-0 bottom-0 start-0 w-[280px] max-w-[85vw] bg-yt-bg overflow-y-auto transition-transform duration-250 ease-out ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-14 flex items-center gap-2 px-4 sticky top-0 bg-yt-bg z-10">
            <button
              onClick={onCloseMobile}
              className="w-10 h-10 -ms-2 rounded-full hover:bg-yt-surface grid place-items-center"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
            <LogoIcon className="w-7 h-5" />
            <span className="font-display font-extrabold text-lg">يوتيوب</span>
          </div>
          <FullContent
            active={active}
            subs={subs}
            onNavigate={(l) => {
              onNavigate(l);
              onCloseMobile();
            }}
            onHome={() => {
              onHome();
              onCloseMobile();
            }}
          />
        </aside>
      </div>
    </>
  );
}
