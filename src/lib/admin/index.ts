"use client";

import { IS_DEMO } from "@/lib/config";
import { httpAdminApi } from "./http";
import { mockAdminApi } from "./mock";
import type { AdminApi } from "./types";

/* Admin ke pages me sirf `adminApi` import karo. Demo ya asli backend ka faisla yahan hota hai. */
export const adminApi: AdminApi = IS_DEMO ? mockAdminApi : httpAdminApi;

export type { AdminApi };
