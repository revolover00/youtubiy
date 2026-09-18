import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { ChannelData, PipedVideo, PlaylistData, StreamData } from "./types";
import type { Page, TrendingPage } from "./youtube.server";

const queryInput = (data: unknown) => z.object({ q: z.string().min(1) }).parse(data);

export const searchVideosFn = createServerFn({ method: "POST" })
  .inputValidator(queryInput)
  .handler(async ({ data }): Promise<PipedVideo[]> => {
    const { search } = await import("./youtube.server");
    return search(data.q);
  });

export const searchPageFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ q: z.string().min(1), continuation: z.string().nullable().optional() }).parse(data),
  )
  .handler(async ({ data }): Promise<Page> => {
    const { searchPage } = await import("./youtube.server");
    return searchPage(data.q, undefined, data.continuation ?? null);
  });

export const suggestionsFn = createServerFn({ method: "POST" })
  .inputValidator(queryInput)
  .handler(async ({ data }): Promise<string[]> => {
    const { suggest } = await import("./youtube.server");
    return suggest(data.q);
  });

export const trendingFn = createServerFn({ method: "POST" }).handler(
  async (): Promise<PipedVideo[]> => {
    const { trending } = await import("./youtube.server");
    return trending();
  },
);

export const trendingPageFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ cursors: z.array(z.string().nullable()).optional() }).parse(data ?? {}),
  )
  .handler(async ({ data }): Promise<TrendingPage> => {
    const { trendingPage } = await import("./youtube.server");
    return trendingPage(data.cursors);
  });

export const videoDetailsFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().min(6) }).parse(data))
  .handler(async ({ data }): Promise<StreamData> => {
    const { videoDetails } = await import("./youtube.server");
    return videoDetails(data.id);
  });

export const playlistFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().min(2) }).parse(data))
  .handler(async ({ data }): Promise<PlaylistData> => {
    const { playlist } = await import("./youtube.server");
    return playlist(data.id);
  });

export const channelFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ id: z.string().min(1) }).parse(data))
  .handler(async ({ data }): Promise<ChannelData> => {
    const { channel } = await import("./youtube.server");
    return channel(data.id);
  });

export const browsePageFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ continuation: z.string().min(1) }).parse(data))
  .handler(async ({ data }): Promise<Page> => {
    const { browsePage } = await import("./youtube.server");
    return browsePage(data.continuation);
  });

export const commentsPageFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ token: z.string().min(1) }).parse(data))
  .handler(
    async ({
      data,
    }): Promise<{ items: import("./types").PipedComment[]; nextContinuation?: string }> => {
      const { getCommentsPage } = await import("./youtube.server");
      return getCommentsPage(data.token);
    },
  );

export const homeCandidatesFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        channelIds: z.array(z.string()),
        seedVideoIds: z.array(z.string()),
        queries: z.array(z.string()),
      })
      .parse(data ?? {}),
  )
  .handler(
    async ({
      data,
    }): Promise<{
      subs: PipedVideo[];
      related: PipedVideo[];
      relatedIds: string[];
      interest: PipedVideo[];
      trending: PipedVideo[];
      trendingNext: unknown;
    }> => {
      const { channel, videoDetails, searchPage, trendingPage } = await import("./youtube.server");
      const { videoIdFromUrl } = await import("./format");

      async function runInBatches<T, R>(
        items: T[],
        fn: (item: T) => Promise<R>,
        limit = 6,
      ): Promise<PromiseSettledResult<R>[]> {
        const results: PromiseSettledResult<R>[] = new Array(items.length);
        let index = 0;
        async function worker() {
          while (index < items.length) {
            const i = index++;
            try {
              const res = await fn(items[i]);
              results[i] = { status: "fulfilled", value: res };
            } catch (reason) {
              results[i] = { status: "rejected", reason };
            }
          }
        }
        const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
        await Promise.all(workers);
        return results;
      }

      type Task =
        | { type: "trending" }
        | { type: "channel"; id: string }
        | { type: "seed"; id: string }
        | { type: "query"; q: string };

      const tasks: Task[] = [
        { type: "trending" },
        ...data.channelIds.map((id): Task => ({ type: "channel", id })),
        ...data.seedVideoIds.map((id): Task => ({ type: "seed", id })),
        ...data.queries.map((q): Task => ({ type: "query", q })),
      ];

      const taskResults = await runInBatches(
        tasks,
        async (task) => {
          if (task.type === "trending") {
            return trendingPage();
          } else if (task.type === "channel") {
            return channel(task.id);
          } else if (task.type === "seed") {
            return videoDetails(task.id);
          } else {
            return searchPage(task.q);
          }
        },
        6,
      );

      const subs: PipedVideo[] = [];
      const related: PipedVideo[] = [];
      const relatedIdsSet = new Set<string>();
      const interest: PipedVideo[] = [];
      let trending: PipedVideo[] = [];
      let trendingNext: unknown = null;

      tasks.forEach((task, idx) => {
        const res = taskResults[idx];
        if (res.status !== "fulfilled") return;

        if (task.type === "trending") {
          const tp = res.value as TrendingPage;
          trending = tp.items || [];
          trendingNext = tp.cursors || null;
        } else if (task.type === "channel") {
          const ch = res.value as ChannelData;
          (ch.relatedStreams || []).slice(0, 8).forEach((v) => subs.push(v));
        } else if (task.type === "seed") {
          const st = res.value as StreamData;
          (st.relatedStreams || []).slice(0, 15).forEach((v) => {
            related.push(v);
            const vidId = videoIdFromUrl(v.url);
            if (vidId) relatedIdsSet.add(vidId);
          });
        } else if (task.type === "query") {
          const page = res.value as Page;
          (page.items || []).slice(0, 12).forEach((v) => interest.push(v));
        }
      });

      return {
        subs,
        related,
        relatedIds: Array.from(relatedIdsSet),
        interest,
        trending,
        trendingNext,
      };
    },
  );
