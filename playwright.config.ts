import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: 1,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:4173", headless: true, viewport: { width: 1440, height: 1000 } },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4173",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_SUPABASE_URL: "https://pfzigswxultqyjahunqo.supabase.co",
      VITE_SUPABASE_PUBLISHABLE_KEY: "test-publishable-key"
    }
  }
});
