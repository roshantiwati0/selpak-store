"use client";

import type { Address } from "@/lib/types";
import { createPersistedStore } from "./createStore";

/* Pichhla delivery address yaad rakhta hai taaki agli baar form bhara mile. */
const store = createPersistedStore<Address | null>("selpak.address.v1", null);

export const savedAddress = {
  get: store.get,
  save: (address: Address) => store.set(address),
};
