"use client";

import { useEffect, useState } from "react";
import { errorMessage } from "@/lib/api";

interface State<T> {
  key: string;
  data?: T;
  error?: string;
}

/** Runs `load` whenever `key` changes. Returns loading / data / error for the current key. */
export function useAsync<T>(key: string | null, load: () => Promise<T>) {
  const [state, setState] = useState<State<T>>({ key: "" });

  useEffect(() => {
    if (key === null) return;
    let active = true;
    load().then(
      (data) => active && setState({ key, data }),
      (e) => active && setState({ key, error: errorMessage(e) }),
    );
    return () => {
      active = false;
    };
    // `load` is intentionally not a dependency: `key` says when to reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const current = key !== null && state.key === key;
  return {
    loading: key !== null && !current,
    data: current ? state.data : undefined,
    error: current ? state.error : undefined,
  };
}
