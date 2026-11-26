"use client";

import { IS_DEMO } from "@/lib/config";
import { httpApi } from "./http";
import { mockApi } from "./mock";
import { ApiError, type Api } from "./types";

/* Poore app me sirf `api` import karo. Demo ya asli backend ka faisla yahan hota hai. */
export const api: Api = IS_DEMO ? mockApi : httpApi;

export function errorMessage(e: unknown) {
  return e instanceof ApiError ? e.message : "Something went wrong. Please try again.";
}

export { ApiError };
export type { Api };
