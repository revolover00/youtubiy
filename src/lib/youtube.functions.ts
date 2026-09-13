import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { ChannelData, PipedVideo, PlaylistData, StreamData } from "./types";
import type { Page, TrendingPage } from "./youtube.server";

const queryInput = (data: unknown) => z.object({ q: z.string().min(1) }).parse(data);

export const searchVideosFn = createServerFn({ method: "GET" })
  .inputValidator(queryInput)
  .handler(async ({ data }): Promise<PipedVideo[]> => {
    const { search } = await import("./youtube.server");
    return search(data.q);
  });

export const searchPageFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ q: z.string().min(1), continuation: z.string().nullable().optional() }).parse(data),
  )
  .handler(async ({ data }): Promise<Page> => {
    const { searchPage } = await import("./youtube.server");
    return searchPage(data.q, undefined, data.continuation ?? null);
  });

export const suggestionsFn = createServerFn({ method: "GET" })
  .inputValidator(queryInput)
  .handler(async ({ data }): Promise<string[]> => {
    const { suggest } = await import("./youtube.server");
    return suggest(data.q);
  });

export const trendingFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<PipedVideo[]> => {
    const { trending } = await import("./youtube.server");
    return trending();
  },
);

export const trendingPageFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ cursors: z.array(z.string().nullable()).optional() }).parse(data ?? {}),
  )
  .handler(async ({ data }): Promise<TrendingPage> => {
    const { trendingPage } = await import("./youtube.server");
    return trendingPage(data.cursors);
  });

export const videoDetailsFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string().min(6) }).parse(data))
  .handler(async ({ data }): Promise<StreamData> => {
    const { videoDetails } = await import("./youtube.server");
    return videoDetails(data.id);
  });

export const playlistFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string().min(2) }).parse(data))
  .handler(async ({ data }): Promise<PlaylistData> => {
    const { playlist } = await import("./youtube.server");
    return playlist(data.id);
  });

export const channelFn = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ id: z.string().min(1) }).parse(data))
  .handler(async ({ data }): Promise<ChannelData> => {
    const { channel } = await import("./youtube.server");
    return channel(data.id);
  });
