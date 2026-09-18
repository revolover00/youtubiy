import { aiRerankFn, aiTuneFn } from "./ai.functions";
import { ageDays, channelIdFromUrl } from "./format";
import type { AIAlgorithmConfig, PipedVideo } from "./types";

const STORAGE_KEY = "yt_ai_algorithm_config";
const RERANK_CACHE = "yt_ai_rerank_cache";

const AI_BLEND = 0.4;
const RERANK_LIMIT = 80;

export function getStoredAIConfig(): AIAlgorithmConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AIAlgorithmConfig) : null;
  } catch {
    return null;
  }
}

export function saveStoredAIConfig(config: AIAlgorithmConfig | null): void {
  if (typeof window === "undefined") return;
  try {
    if (!config) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export async function requestAITunedAlgorithm(params: {
  userPrompt: string;
  language?: string;
  topInterests?: string[];
}): Promise<AIAlgorithmConfig> {
  const config = await aiTuneFn({
    data: {
      userPrompt: params.userPrompt,
      language: params.language || "ar",
      topInterests: params.topInterests || [],
    },
  });
  saveStoredAIConfig(config);
  return config;
}

interface RerankItem {
  id: string;
  title: string;
  score: number;
  parts: Record<string, number>;
  source: string;
}

interface PoolEntry {
  video: PipedVideo;
}

function cacheKey(ids: string[], prompt?: string): string {
  let h = 0;
  const s = ids.slice(0, 40).join(",") + "|" + (prompt || "");
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return `${RERANK_CACHE}:${h}`;
}

function readCache(key: string): Record<string, number> | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { at, scores } = JSON.parse(raw) as { at: number; scores: Record<string, number> };
    if (Date.now() - at > 30 * 60_000) return null; // 30 mins
    return scores;
  } catch {
    return null;
  }
}

function writeCache(key: string, scores: Record<string, number>) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), scores }));
  } catch {
    // ignore
  }
}

export async function aiRerank(params: {
  scored: RerankItem[];
  pool: Map<string, PoolEntry>;
  summary: string;
  userPrompt?: string;
}): Promise<RerankItem[]> {
  const { scored, pool, summary } = params;

  const stored = getStoredAIConfig();
  const userPrompt =
    params.userPrompt ||
    (stored
      ? [
          stored.summary,
          stored.includeTopics?.length ? `ركّز على: ${stored.includeTopics.join("، ")}` : "",
          stored.excludeTopics?.length ? `استبعد: ${stored.excludeTopics.join("، ")}` : "",
        ]
          .filter(Boolean)
          .join(". ")
      : undefined);

  const head = scored.slice(0, RERANK_LIMIT);
  const tail = scored.slice(RERANK_LIMIT);
  const ids = head.map((h) => h.id);

  const key = cacheKey(ids, userPrompt);
  let scores = readCache(key);

  if (!scores) {
    const candidates = head.map((h) => {
      const v = pool.get(h.id)?.video;
      return {
        id: h.id,
        title: h.title.slice(0, 140),
        channel: v?.uploaderName?.slice(0, 60) || channelIdFromUrl(v?.uploaderUrl || ""),
        views: v?.views || 0,
        ageDays: Math.round(ageDays(v?.uploaded, v?.uploadedDate)),
      };
    });

    const res = await aiRerankFn({ data: { summary, userPrompt, candidates } });
    scores = res.scores;
    writeCache(key, scores);
  }

  const maxBase = Math.max(...head.map((h) => h.score), 0.0001);

  const blended = head
    .map((h) => {
      const ai = scores?.[h.id];
      if (ai === undefined) return h;
      const base = h.score / maxBase;
      const mixed = base * (1 - AI_BLEND) + ai * AI_BLEND;
      return {
        ...h,
        score: mixed * maxBase,
        parts: { ...h.parts, ai },
        source: `${h.source}+ai`,
      };
    })
    .sort((a, b) => b.score - a.score);

  return [...blended, ...tail];
}

export interface AIPresetPrompt {
  id: string;
  titleAr: string;
  titleEn: string;
  promptAr: string;
  promptEn: string;
  icon: string;
}

export const AI_PRESETS: AIPresetPrompt[] = [
  {
    id: "tech_ai",
    titleAr: "البرمجة والذكاء الاصطناعي",
    titleEn: "Tech & AI",
    promptAr:
      "ركزلي على شروحات البرمجة (React، Python، هندسة البرمجيات)، وآخر أخبار الذكاء الاصطناعي ونماذج Gemini والتقنية، واستبعد المقالب والمحتوى الترفيهي التافه.",
    promptEn:
      "Focus on programming tutorials (React, Python, software engineering) and latest Artificial Intelligence news, exclude pranks and shallow entertainment.",
    icon: "💻",
  },
  {
    id: "docs_history",
    titleAr: "وثائقيات وتاريخ وعلوم",
    titleEn: "Documentaries & Science",
    promptAr:
      "أريد وثائقيات عميقة، تاريخ، فيزياء وعلوم، واستكشاف الفضاء مع محتوى تحليلي موثوق، وتجنب الأخبار العاجلة المشتتة.",
    promptEn:
      "I want in-depth documentaries, history, physics, science and space exploration with authoritative content. Avoid sensational breaking news.",
    icon: "🔬",
  },
  {
    id: "self_improvement",
    titleAr: "تطوير الذات وبودكاست",
    titleEn: "Growth & Podcasts",
    promptAr:
      "ركزلي على بودكاست هادفة ومقابلات ملهمة، تطوير المهارات والإنتاجية وإدارة المال والأعمال، واستبعد الفيديوهات القصيرة المشتتة والمقالب.",
    promptEn:
      "Focus on meaningful podcasts, inspiring interviews, productivity, finance and personal growth. Exclude clickbait and pranks.",
    icon: "🎙️",
  },
  {
    id: "gaming",
    titleAr: "ألعاب واحتراف",
    titleEn: "Gaming & Esports",
    promptAr:
      "رشحلي محتوى ألعاب واستراتيجيات وشروحات احترافية وأخبار ألعاب جديدة بجودة عالية، واستبعد الصراخ والمقالب.",
    promptEn:
      "Recommend gaming strategies, high-level walkthroughs, game reviews and tech, avoid screaming clickbait.",
    icon: "🎮",
  },
];
