import type { AIAlgorithmConfig, HistoryRow, Subscription } from "./types";

const STORAGE_KEY = "yt_ai_algorithm_config";

export function getStoredAIConfig(): AIAlgorithmConfig | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AIAlgorithmConfig;
  } catch {
    return null;
  }
}

export function saveStoredAIConfig(config: AIAlgorithmConfig | null): void {
  if (typeof window === "undefined") return;
  try {
    if (!config) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
  } catch {
    // ignore
  }
}

export async function requestAITunedAlgorithm(params: {
  userPrompt: string;
  language: string;
  subscriptions: Subscription[];
  history: HistoryRow[];
}): Promise<AIAlgorithmConfig> {
  const res = await fetch("/api/ai-algorithm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userPrompt: params.userPrompt,
      language: params.language,
      subscriptions: params.subscriptions.map((s) => ({
        channel_id: s.channel_id,
        channel_name: s.channel_name,
      })),
      history: params.history.map((h) => ({
        title: h.video_id,
        channelTitle: h.channel_id,
      })),
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to tune algorithm (${res.status}): ${errText}`);
  }

  const data = (await res.json()) as AIAlgorithmConfig;
  saveStoredAIConfig(data);
  return data;
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
