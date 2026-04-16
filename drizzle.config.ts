import { loadEnvFile } from "node:process";
import { defineConfig } from "drizzle-kit";

try {
  loadEnvFile(".env.local");
} catch {}

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
