/**
 * Run database migrations for development or production
 *
 * Usage:
 *   npm run db:migrate        # Run migrations on dev (default)
 *   npm run db:migrate:prod   # Run migrations on production
 *
 * Database URLs are fetched from 1Password:
 *   - dev:  op://Private/Apunta/apunta-dev-db
 *   - prod: op://Private/Apunta/apunta-prod-db
 */

import { execSync, spawn } from "child_process";

const env = process.argv[2] || "dev";

const opPaths = {
  dev: "op://Private/Apunta/apunta-dev-db",
  prod: "op://Private/Apunta/apunta-prod-db",
};

const opPath = opPaths[env];

if (!opPath) {
  console.error(`❌ Unknown environment: ${env}. Use 'dev' or 'prod'.`);
  process.exit(1);
}

let dbUrl;
try {
  dbUrl = execSync(`op read "${opPath}"`, { encoding: "utf-8" }).trim();
} catch {
  console.error(`❌ Failed to read database URL from 1Password: ${opPath}`);
  console.error("   Make sure you are signed in to 1Password CLI (op signin)");
  process.exit(1);
}

if (!dbUrl) {
  console.error(`❌ Empty database URL from 1Password: ${opPath}`);
  process.exit(1);
}

console.log(`\n🚀 Running migrations for ${env.toUpperCase()}`);
console.log(`   Using: 1Password (${opPath})\n`);

const child = spawn("npx", ["drizzle-kit", "migrate"], {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: dbUrl },
});

child.on("close", (code) => {
  if (code === 0) {
    console.log(`\n✅ Migrations applied successfully for ${env.toUpperCase()}\n`);
  }
  process.exit(code ?? 0);
});
