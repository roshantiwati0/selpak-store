import { defineConfig } from "@playwright/test";

/* End-to-end tests: asli browser me site ko chala kar check karte hain.
   Chalana:  npm run test:e2e
   - Agar `npm run dev` pehle se chal raha hai to usi ko use karta hai, warna khud chalu karta hai.
   - Browser: computer par install Microsoft Edge (koi alag download nahi).
     Chrome se chalana ho:  PW_CHANNEL=chrome npm run test:e2e */
const PORT = Number(process.env.PORT ?? 3000);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  // dev server pages ko pehli baar kholne par compile karta hai, isliye ek-ek karke chalana zyada bharosemand hai
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    channel: process.env.PW_CHANNEL ?? "msedge",
    viewport: { width: 1280, height: 900 },
    trace: "retain-on-failure",
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: "npm run dev", url: BASE_URL, reuseExistingServer: true, timeout: 120_000 },
});
