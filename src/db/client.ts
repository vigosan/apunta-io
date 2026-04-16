import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { validateEnv } from "../env.js";
import * as schema from "./schema/index.js";

const { DATABASE_URL } = validateEnv(
  process.env as Record<string, string | undefined>
);
const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });
